import { DataSource, Repository } from 'typeorm';

import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';
import { FastifyCustomRequest } from '../types/request';

export class BaseRepository {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly req: FastifyCustomRequest,
  ) {}

  getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager = this.req[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}
