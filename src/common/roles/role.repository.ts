import { Injectable, Scope } from '@nestjs/common';
import { IsNull } from 'typeorm';

import { BaseRepository } from '../repositories/base.repository';
import { Roles } from './constants';
import { RoleEntity } from './entities/role.entity';

@Injectable({ scope: Scope.REQUEST })
export class RoleRepository extends BaseRepository {
  async getIdByName(name: Roles): Promise<string | undefined> {
    const roleRepository = this.getRepository(RoleEntity);
    const role = await roleRepository.findOne({
      select: ['id'],
      where: { name, deletedAt: IsNull() },
    });

    return role?.id;
  }
}
