import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseRepository } from '../common/repositories/base.repository';
import { FastifyCustomRequest } from '../common/types/request';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(
    readonly dataSource: DataSource,
    @Inject(REQUEST) readonly req: FastifyCustomRequest,
  ) {
    super(dataSource, req);
  }

  create(entity: QueryDeepPartialEntity<User> | QueryDeepPartialEntity<User>[]) {
    const userRepository = this.getRepository(User);

    return userRepository.insert(entity);
  }

  findOneBy(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    const userRepository = this.getRepository(User);

    return userRepository.findOneBy(where);
  }

  find(options: FindManyOptions<User>) {
    const userRepository = this.getRepository(User);

    return userRepository.find(options);
  }

  findOne(options: FindOneOptions<User>) {
    const userRepository = this.getRepository(User);

    return userRepository.findOne(options);
  }

  exist(options: FindManyOptions<User>) {
    const userRepository = this.getRepository(User);

    return userRepository.exist(options);
  }
}
