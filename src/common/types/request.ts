import { FastifyRequest } from 'fastify';
import { EntityManager } from 'typeorm';

import { User } from '../../users/models/user.entity';
import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';

export type UserTokenPayload = {
  userName: string;
  sub: User['id'];
  iat?: number;
  exp?: number;
};

export type UserFromAuthGuard = Pick<User, 'id' | 'email' | 'firstName' | 'lastName'> & {
  role: Pick<User['role'], 'id' | 'name'>;
};
export type RequestUser = UserTokenPayload & UserFromAuthGuard;

export type FastifyCustomRequest = FastifyRequest & { [ENTITY_MANAGER_KEY]?: EntityManager } & {
  user?: RequestUser;
};
