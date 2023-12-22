import { Injectable, Scope } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseRepository } from '../common/repositories/base.repository';
import { Password } from './models/password.entity';

@Injectable({ scope: Scope.REQUEST })
export class PasswordRepository extends BaseRepository {
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
