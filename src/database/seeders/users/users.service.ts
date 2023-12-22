import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { User } from '../../../users/models/user.entity';
import { RolesRecord } from '../types';
import { users as usersData } from './data';

@Injectable()
export class UsersSeederService {
  async create(manager: EntityManager, roles: RolesRecord) {
    const userRepository = manager.getRepository(User);
    const users = usersData.map(({ roleName, ...user }) => ({
      ...user,
      role: {
        id: roles[roleName]?.id,
      },
    }));

    return userRepository.insert(users);
  }
}
