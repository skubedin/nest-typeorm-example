import { FastifyReply } from 'fastify';
import { EntityManager } from 'typeorm';

import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';

export type FastifyCustomRequest = FastifyReply & {
  [ENTITY_MANAGER_KEY]: EntityManager;
};
