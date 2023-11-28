import { Injectable } from '@nestjs/common';

import { UserRepository } from '../users/user.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}
  async getProfile(userId: string) {
    return this.userRepository.findOne({
      select: ['id', 'firstName', 'lastName', 'email'],
      where: {
        id: userId,
      },
    });
  }
}
