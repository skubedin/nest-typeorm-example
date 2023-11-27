import { Injectable, Scope } from '@nestjs/common';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

import { BaseRepository } from '../common/repositories/base.repository';
import { RefreshToken } from './models/refresh-token.entity';

@Injectable({ scope: Scope.REQUEST })
export class RefreshTokenRepository extends BaseRepository {
  findAll(options?: FindManyOptions<RefreshToken>) {
    const repo = this.getRepository(RefreshToken);

    return repo.find(options);
  }

  create(token: string, expiresIn: number, userId: string) {
    const repo = this.getRepository(RefreshToken);
    return repo.insert({
      token,
      user: { id: userId },
      expiresIn: new Date(Date.now() + expiresIn * 1000),
    });
  }
}
