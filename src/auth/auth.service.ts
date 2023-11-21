import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordService } from '../password/password.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AUTH_MESSAGES } from '../common/error-messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    //
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findOne({
      relations: [],
      where: {
        email: dto.email,
      },
    });

    const isValidPassword = await this.passwordService.comparePassword({
      userId: user.id,
      password: dto.password,
    });

    if (!isValidPassword) throw new ForbiddenException(AUTH_MESSAGES.invalidPasswordOrEmail);

    const payload = { sub: user.id, userName: user.firstName + user.lastName };
    return {
      access_token: await this.createJWTToken(payload),
    };
  }

  private async createJWTToken(payload: { [key: string]: unknown }) {
    return this.jwtService.signAsync(payload);
  }
}
