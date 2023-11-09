import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { FastifyCustomRequest } from '../common/types/request';
import { BaseRepository } from '../common/repositories/base.repository';
import { Password } from './entities/password.entity';

@Injectable({ scope: Scope.REQUEST })
export class PasswordRepository extends BaseRepository {
  constructor(
    protected readonly dataSource: DataSource,
    @Inject(REQUEST)
    protected readonly req: FastifyCustomRequest,
  ) {
    super(dataSource, req);
  }
  async create(userId: string, hash: string) {
    const password = {
      hash,
      user: { id: userId },
    };

    await this.getRepository(Password).insert(password);
  }

  async findOne(options: FindOneOptions<Password>) {
    return await this.getRepository(Password).findOne(options);
  }

  async update(
    criteria: FindOptionsWhere<Password>,
    partialEntity: QueryDeepPartialEntity<Password>,
  ) {
    await this.getRepository(Password).update(criteria, partialEntity);
  }
}
