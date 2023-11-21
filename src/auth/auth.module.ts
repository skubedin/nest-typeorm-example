import { ClassProvider, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { CustomEmailValidation } from '../common/validation/IsEmailUnique';
import { PasswordModule } from '../password/password.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtConfigService } from './jwt-config.service';

const authGuardProvider: ClassProvider = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};

@Module({
  imports: [
    PasswordModule,
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      useClass: JwtConfigService,
    }),
  ],
  providers: [CustomEmailValidation, AuthService, authGuardProvider],
  controllers: [AuthController],
})
export class AuthModule {}
