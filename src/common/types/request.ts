import { FastifyRequest } from 'fastify';
import { EntityManager } from 'typeorm';

import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';
import { User } from '../../users/entities/user.entity';

export type FastifyCustomRequest = FastifyRequest & {
  [ENTITY_MANAGER_KEY]: EntityManager;
};

export type RequestUser = Omit<User, 'projects' | 'password'>;
