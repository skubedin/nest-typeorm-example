import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/models/user.entity';

@Entity({
  name: 'file',
})
export class FileModel {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  public name: string;

  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
  })
  public path: string;

  @Column({
    name: 'expires_at',
    type: 'timestamp',
    nullable: true,
  })
  public expiresAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  public deletedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt: Date;

  @OneToOne(() => User)
  public user: User;
}
