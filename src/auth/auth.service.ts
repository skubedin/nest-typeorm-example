import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';

import { AUTH_MESSAGES } from '../common/error-messages';
import { cleanJwtTokenHelper } from '../common/helpers/clean-jwt-token.helper';
import { UserTokenPayload } from '../common/types/request';
import { PasswordService } from '../password/password.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  signUp(dto: SignUpDto) {
    return this.usersService.create(dto);
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

    const payload: UserTokenPayload = {
      sub: user.id,
      userName: user.firstName + ' ' + user.lastName,
    };

    return this.generateTokens(payload);
  }

  generateTokens(payload: UserTokenPayload) {
    return {
      accessToken: this.createJWTToken(payload),
      refreshToken: this.createJWTToken(payload, '7d'),
    };
  }

  verifyToken(token: string) {
    const secret = this.configService.get('JWT_SECRET');
    const cleanToken = cleanJwtTokenHelper(token);

    return this.jwtService.verifyAsync(cleanToken, { secret });
  }

  saveRefreshToken(token, expiresIn, userId: string) {
    return this.refreshTokenRepository.create(token, expiresIn, userId);
  }

  private createJWTToken(payload: Buffer | object, expiresIn?: JwtSignOptions['expiresIn']) {
    return this.jwtService.sign(payload, expiresIn ? { expiresIn } : undefined);
  }
}
