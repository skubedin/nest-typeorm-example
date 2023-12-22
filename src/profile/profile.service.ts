import { Injectable } from '@nestjs/common';

import { UserRepository } from '../users/user.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}
  async getProfile(userId: string) {
    return this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: {
          id: true,
          path: true,
          name: true,
        },
      },
      relations: {
        avatar: true,
      },
      where: {
        id: userId,
      },
    });
  }
}
