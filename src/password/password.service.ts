import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';

import { AUTH_MESSAGES } from '../common/error-messages';
import { comparePassword, createHash } from '../common/helpers/hash.helper';
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

    if (!passwordEntity) throw new ForbiddenException(AUTH_MESSAGES.invalidPasswordOrEmail);

    return comparePassword(password, passwordEntity?.hash);
  }
}
