import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleRepository } from '../common/roles/role.repository';
import { CustomEmailValidation } from '../common/validation/IsEmailUnique';
import { MatchConstraint } from '../common/validation/Match';
import { PasswordModule } from '../password/password.module';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PasswordModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [CustomEmailValidation, MatchConstraint, RoleRepository, UserRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
