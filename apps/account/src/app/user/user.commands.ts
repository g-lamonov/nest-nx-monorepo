import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@nest-monorepo/contracts';
import { Controller, Body, } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { BuyCourseSaga } from './sagas/buy-course/buy-course.saga';

export enum UserCommandsErrors {
  USER_DOES_NOT_EXISTS = 'User does not exist',
}

@Controller()
export class UserCommands {
  constructor(
    private readonly userRepository: UserRepository,

    private readonly rmqService: RMQService,
  ) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async changeProfile(@Body() dto: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
    const { id, user } = dto;

    const existedUser = await this.userRepository.findUserById(id);
    if (!existedUser)
      throw new Error(UserCommandsErrors.USER_DOES_NOT_EXISTS)

    const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
    await this.userRepository.updateUser(id, userEntity);

    return {};
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(@Body() dto: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    const { userId, courseId } = dto;

    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser)
      throw new Error(UserCommandsErrors.USER_DOES_NOT_EXISTS);

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(courseId, userEntity, this.rmqService);
    const { user, paymentLink, } = await saga.getState().pay();

    await this.userRepository.updateUser(userId, user);
    return { paymentLink };
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(@Body() dto: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    const { userId, courseId } = dto;

    const existedUser = await this.userRepository.findUserById(userId);
    if (!existedUser)
      throw new Error(UserCommandsErrors.USER_DOES_NOT_EXISTS);

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(courseId, userEntity, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();
    await this.userRepository.updateUser(userId, user);

    return {
      status
    };
  }
}
