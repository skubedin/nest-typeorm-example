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
import { User } from '../../users/entities/user.entity';

@Entity()
export class Password {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ length: 255 })
  public hash: string;

  @ManyToOne(() => User, (user) => user.password, { nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'id', name: 'user_id' })
  public user!: User;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  public deletedAt!: Date;
}
