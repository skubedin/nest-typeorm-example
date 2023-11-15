import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionEntity } from '../../../common/roles/entities/permission.entity';
import { PermissionsSeederService } from './permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  providers: [PermissionsSeederService],
  exports: [PermissionsSeederService],
})
export class PermissionsSeedersModule {}
