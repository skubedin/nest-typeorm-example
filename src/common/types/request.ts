import { FastifyRequest } from 'fastify';
import { EntityManager } from 'typeorm';

import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';

export type FastifyCustomRequest = FastifyRequest & {
  [ENTITY_MANAGER_KEY]: EntityManager;
};
