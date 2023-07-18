import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { PasswordService } from '../password/password.service';
import { Password } from '../password/entities/password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Password, User])],
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
})
export class UsersModule {}
