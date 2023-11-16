import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Action, Scope, Subject } from '../constants';
import { RoleEntity } from './role.entity';

@Entity({ name: 'permission' })
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  public action: Action;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  public subject: Subject;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  public scope: Scope;

  @Column({ default: false })
  inverted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  conditions?: { [key: string]: unknown } | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  reason?: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  public deletedAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt: Date;

  @ManyToOne(() => RoleEntity, (role) => role.permissions)
  @JoinColumn({ foreignKeyConstraintName: 'id', name: 'role_id' })
  role: RoleEntity;
}
