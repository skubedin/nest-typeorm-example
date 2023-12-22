import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';

import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';
import { FastifyCustomRequest } from '../types/request';

export class BaseRepository {
  @Inject(REQUEST)
  protected readonly req: FastifyCustomRequest;
  @Inject(DataSource)
  protected readonly dataSource: DataSource;

  protected getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager = this.req[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}
