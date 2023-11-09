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
import { Actions, Entities } from '../constants';
import { RoleEntity } from './role.entity';

@Entity()
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public action: Actions;

  @Column()
  public subject: Entities;

  @Column({ default: false })
  inverted: boolean;

  @Column({ type: 'jsonb' })
  conditions?: { [key: string]: unknown };

  @Column({ type: 'varchar', length: 500 })
  reason: string;

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
