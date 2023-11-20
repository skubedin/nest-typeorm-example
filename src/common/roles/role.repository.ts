import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, IsNull } from 'typeorm';

import { BaseRepository } from '../repositories/base.repository';
import { FastifyCustomRequest } from '../types/request';
import { Roles } from './constants';
import { RoleEntity } from './entities/role.entity';

@Injectable({ scope: Scope.REQUEST })
export class RoleRepository extends BaseRepository {
  constructor(
    protected readonly dataSource: DataSource,
    @Inject(REQUEST) protected readonly req: FastifyCustomRequest,
  ) {
    super(dataSource, req);
  }

  async getIdByName(name: Roles): Promise<string | undefined> {
    const roleRepository = this.getRepository(RoleEntity);
    const role = await roleRepository.findOne({
      select: ['id'],
      where: { name, deletedAt: IsNull() },
    });

    return role?.id;
  }
}
