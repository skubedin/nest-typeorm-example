import { Module } from '@nestjs/common';

import { FileModule } from '../file/file.module';
import { UserRepository } from '../users/user.repository';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [FileModule],
  controllers: [ProfileController],
  providers: [ProfileService, UserRepository],
})
export class ProfileModule {}
