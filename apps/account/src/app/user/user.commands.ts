import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@nest-monorepo/contracts';
import { Controller, Body, } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserService } from './user.service';

@Controller()
export class UserCommands {
  constructor(
    private readonly userService: UserService,
  ) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async changeProfile(@Body() dto: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
    return this.userService.changeProfile(dto.id, dto.user);
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(@Body() dto: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    return this.userService.buyCourse(dto.userId, dto.courseId);
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(@Body() dto: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    return this.userService.checkPayment(dto.userId, dto.courseId);
  }
}
