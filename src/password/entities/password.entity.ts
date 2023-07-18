import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
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

  @OneToOne(() => User, (user) => user.password)
  @JoinColumn({ foreignKeyConstraintName: 'id', name: 'user_id' })
  public user: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt!: Date;
}
