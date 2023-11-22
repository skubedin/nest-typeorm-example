import { Module } from '@nestjs/common';

import { RoleRepository } from '../common/roles/role.repository';
import { CustomEmailValidation } from '../common/validation/IsEmailUnique';
import { MatchConstraint } from '../common/validation/Match';
import { PasswordModule } from '../password/password.module';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PasswordModule],
  controllers: [UsersController],
  providers: [CustomEmailValidation, MatchConstraint, RoleRepository, UserRepository, UsersService],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
