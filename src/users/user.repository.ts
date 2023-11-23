import { Injectable, Scope } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseRepository } from '../common/repositories/base.repository';
import { User } from './entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository {
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
