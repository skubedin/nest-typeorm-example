import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Message } from './message.entity';
import { UserChat } from './user-chat.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public name: string;

  @Column({
    name: 'is_self',
    type: 'boolean',
    default: false,
  })
  public isSelf: boolean;

  @OneToMany(() => Message, (msg) => msg.chat, { nullable: true })
  messages?: Message[];

  @Column({
    name: 'archived_at',
    type: 'timestamp',
    nullable: true,
  })
  public archivedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt: Date;

  @OneToMany(() => UserChat, (uc) => uc.chat)
  public userChats: UserChat[];
}
