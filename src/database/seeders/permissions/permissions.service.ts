import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { PermissionEntity } from '../../../common/roles/entities/permission.entity';
import { RolesRecord } from '../types';
import { permissions as permissionsData } from './data';

@Injectable()
export class PermissionsSeederService {
  async create(manager: EntityManager, roles: RolesRecord) {
    const permissionRepository = manager.getRepository(PermissionEntity);
    const permissions = permissionsData.map(({ roleName, ...permissionData }) => ({
      ...permissionData,
      role: {
        id: roles[roleName]?.id,
      },
    }));

    return permissionRepository.insert(permissions);
  }
}
