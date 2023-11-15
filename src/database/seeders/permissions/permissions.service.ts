import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PermissionEntity } from '../../../common/roles/entities/permission.entity';
import { permissions as permissionsData } from './data';

@Injectable()
export class PermissionsSeederService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionModel: Repository<PermissionEntity>,
  ) {}

  async create() {
    return this.permissionModel.save(permissionsData);
  }
}
