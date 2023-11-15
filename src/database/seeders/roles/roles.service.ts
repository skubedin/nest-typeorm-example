import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from '../../../common/roles/entities/role.entity';
import { roles as RolesData } from './data';

@Injectable()
export class RolesSeederService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleModel: Repository<RoleEntity>,
  ) {}

  async create() {
    return this.roleModel.save(RolesData);
  }
}
