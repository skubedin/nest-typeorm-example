import { Roles } from '../../common/roles/constants';
import { RoleEntity } from '../../common/roles/entities/role.entity';

export type InsertionRole = Omit<RoleEntity, 'name'>;

export type RolesRecord = Partial<Record<Roles, InsertionRole>>;
