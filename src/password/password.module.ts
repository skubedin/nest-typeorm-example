import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Password } from './entities/password.entity';
import { PasswordRepository } from './password.repository';
import { PasswordService } from './password.service';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  providers: [PasswordService, PasswordRepository],
  exports: [PasswordService],
})
export class PasswordModule {}
