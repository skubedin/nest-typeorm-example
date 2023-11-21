import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { IsPublic } from './guards/is-public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('sign-in')
  @IsPublic()
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
    // const accessToken = await this.authService.createJWTToken(user);
    // const refreshToken = await this.authService.createJWTToken(user);
  }

  @Post('sign-up')
  @IsPublic()
  async signUp(@Body() dto: SignUpDto) {
    await this.authService.signUp(dto);
  }
}
