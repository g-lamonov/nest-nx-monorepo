import { UserRole } from '@nest-monorepo/interfaces';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { AccountLogin, AccountRegister } from '@nest-monorepo/contracts'

export enum AuthServiceErrors {
  USER_ALREADY_EXISTS = 'User already exists',
  INCORRECT_LOGIN_OR_PASSWORD = 'Incorrect login or password'
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    const { email, password, displayName } = dto;

    const oldUser = await this.userRepository.findUser(email);
    if (oldUser)
      throw new Error(AuthServiceErrors.USER_ALREADY_EXISTS)

    const newUserEntity = await new UserEntity({
      displayName,
      email,
      role: UserRole.Student
    })
    .setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);
    return {
      email: newUser.email,
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);

    if (!user)
      throw new Error(AuthServiceErrors.INCORRECT_LOGIN_OR_PASSWORD);

    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword)
      throw new Error(AuthServiceErrors.INCORRECT_LOGIN_OR_PASSWORD);

    return {
      id: user._id,
    }
  }

  async login(id: string): Promise<AccountLogin.Response> {
    const accessToken = await this.jwtService.signAsync(id);

    return {
      accessToken,
    }
  }
}
