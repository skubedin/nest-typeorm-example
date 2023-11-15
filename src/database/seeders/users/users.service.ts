import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../users/entities/user.entity';
import { users as usersData } from './data';

@Injectable()
export class UsersSeederService {
  constructor(@InjectRepository(User) private readonly userModel: Repository<User>) {}

  async create() {
    return this.userModel.save(usersData);
  }
}
