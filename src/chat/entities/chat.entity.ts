import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
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

  // @ManyToMany(() => User)
  // @JoinTable({
  //   name: 'user_chat',
  //   joinColumn: {
  //     name: 'chat_id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'user_id',
  //   },
  // })
  // public users?: User[];
  @OneToMany(() => UserChat, (uc) => uc.chat)
  public userChats: UserChat[];
}
