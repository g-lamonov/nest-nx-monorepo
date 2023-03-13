import { IUser } from '@nest-monorepo/interfaces';
import { Controller, } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { BuyCourseSaga } from './sagas/buy-course/buy-course.saga';
import { UserEventEmitter } from './user.event-emitter';

export enum UserServiceErrors {
  USER_DOES_NOT_EXISTS = 'User does not exist',
}

@Controller()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,

    private readonly rmqService: RMQService,

    private readonly userEventEmitter: UserEventEmitter,
  ) {}

  public async changeProfile(id: string, user: Pick<IUser, 'displayName'>) {
    const existedUser = await this.userRepository.findUserById(id);
    if (!existedUser)
      throw new Error(UserServiceErrors.USER_DOES_NOT_EXISTS)

    const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
    await this.updateUser(userEntity);

    return {};
  }

  public async buyCourse(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser)
      throw new Error(UserServiceErrors.USER_DOES_NOT_EXISTS);

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(courseId, userEntity, this.rmqService);
    const { user, paymentLink, } = await saga.getState().pay();
    await this.updateUser(user);

    return { paymentLink };
  }

  public async checkPayment(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser)
      throw new Error(UserServiceErrors.USER_DOES_NOT_EXISTS);

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(courseId, userEntity, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();
    await this.updateUser(user);

    return {
      status
    };
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRepository.updateUser(user)
    ])
  }
}
