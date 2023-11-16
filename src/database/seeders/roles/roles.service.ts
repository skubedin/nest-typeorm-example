import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { RoleEntity } from '../../../common/roles/entities/role.entity';
import { roles as RolesData } from './data';

@Injectable()
export class RolesSeederService {
  async create(manager: EntityManager) {
    const roleRepository = manager.getRepository(RoleEntity);
    return roleRepository.insert(RolesData);
  }
}
