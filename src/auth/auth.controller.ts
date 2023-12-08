import { CookieSerializeOptions } from '@fastify/cookie';
import { BadRequestException, Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';

import { FastifyCustomRequest } from '../common/types/request';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { IsPublic } from './guards/is-public.decorator';

const JWT_REFRESH_COOKIE_NAME = 'refresh';
const JWT_REFRESH_COOKIE_OPTIONS = <CookieSerializeOptions>{
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  domain: 'localhost',
  path: '/auth/refresh',
  // sameSite: 'none',
  secure: false,
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @IsPublic()
  async signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res: FastifyReply) {
    const tokens = await this.authService.signIn(dto);
    res.setCookie(JWT_REFRESH_COOKIE_NAME, tokens.refreshToken, JWT_REFRESH_COOKIE_OPTIONS);

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('sign-up')
  @IsPublic()
  async signUp(@Body() dto: SignUpDto) {
    await this.authService.signUp(dto);
  }

  @Get('logout')
  @IsPublic()
  async logout(@Req() req: FastifyCustomRequest, @Res({ passthrough: true }) res: FastifyReply) {
    const refresh = req.cookies[JWT_REFRESH_COOKIE_NAME];

    await this.authService.deleteToken(refresh);
    res.setCookie(JWT_REFRESH_COOKIE_NAME, refresh, { ...JWT_REFRESH_COOKIE_OPTIONS, maxAge: 0 });
  }

  @Get('refresh')
  @IsPublic()
  async refresh(@Req() req: FastifyRequest, @Res({ passthrough: true }) res) {
    const refresh = req.cookies[JWT_REFRESH_COOKIE_NAME];
    console.log('--->>> refresh', refresh);
    if (!refresh) throw new BadRequestException('Invalid token');

    const payload = await this.authService.verifyToken(refresh);

    const { iat, exp, ...clearPayload } = payload;

    const { accessToken, refreshToken } = this.authService.generateTokens(clearPayload);

    res.setCookie(JWT_REFRESH_COOKIE_NAME, refreshToken, JWT_REFRESH_COOKIE_OPTIONS);
    await this.authService.saveRefreshToken(
      refreshToken,
      JWT_REFRESH_COOKIE_OPTIONS.maxAge,
      clearPayload.sub,
    );

    return { accessToken };
  }
}
