import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from '../../../common/roles/entities/role.entity';
import { RolesSeederService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RolesSeederService],
  exports: [RolesSeederService],
})
export class RolesSeedersModule {}
