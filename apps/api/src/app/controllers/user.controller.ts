import { Controller, Post, UseGuards, } from '@nestjs/common';
import { UserId } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('users')
export class UserController {
  constructor() {}

  // TODO
  @UseGuards(JwtAuthGuard)
  @Post('info')
  async info(@UserId() userId: string) {
    return userId;
  }
}
