import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/models/user.entity';
import { Chat } from './chat.entity';

@Entity()
export class UserChat {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

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
}
