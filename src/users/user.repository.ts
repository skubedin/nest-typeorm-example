import { Injectable, Scope } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { ObjectId } from 'typeorm/driver/mongodb/typings';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseRepository } from '../common/repositories/base.repository';
import { User } from './models/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository {
  create(entity: QueryDeepPartialEntity<User> | QueryDeepPartialEntity<User>[]) {
    const userRepository = this.getRepository(User);

    return userRepository.insert(entity);
  }
  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<User>,
    entity: QueryDeepPartialEntity<User>,
  ) {
    const userRepository = this.getRepository(User);

    return userRepository.update(criteria, entity);
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
