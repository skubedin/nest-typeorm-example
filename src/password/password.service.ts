import { Injectable } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';

import { comparePassword, createHash } from '../common/helpers/hash.helper';
import { User } from '../users/entities/user.entity';
import { PasswordRepository } from './password.repository';

@Injectable()
export class PasswordService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly passwordRepository: PasswordRepository,
  ) {}

  async changePassword(userId: string, newPassword: string) {
    await this.passwordRepository.update(
      {
        user: { id: userId },
        deletedAt: IsNull(),
      },
      { deletedAt: new Date() },
    );

    const hash = await createHash(newPassword);
    await this.passwordRepository.create(userId, hash);
  }

  async createPassword({ userId, password }: { userId: string; password: string }) {
    const hash = await createHash(password);

    await this.passwordRepository.create(userId, hash);
  }

  async comparePassword({ userId, password }: { userId: string; password: string }) {
    const passwordEntity = await this.passwordRepository.findOne({
      select: ['id', 'hash'],
      where: { user: { id: userId } },
    });

    return comparePassword(password, passwordEntity.hash);
  }
}
