import { AccountChangeProfile } from '@nest-monorepo/contracts';
import { Controller, Body, } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

export enum UserCommandsErrors {
  USER_DOES_NOT_EXISTS = 'User does not exist',
}

@Controller()
export class UserCommands {
  constructor(
    private readonly userRepository: UserRepository
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
}
