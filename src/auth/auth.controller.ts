import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.checkUser(dto);
    // const accessToken = await this.authService.createJWTToken(user);
    // const refreshToken = await this.authService.createJWTToken(user);
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    await this.authService.createUser(dto);
  }
}
