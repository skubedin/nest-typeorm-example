import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ length: 255 })
  public name: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt!: Date;

  @OneToMany(() => PermissionEntity, (permission) => permission.role)
  permissions: PermissionEntity[];
}
