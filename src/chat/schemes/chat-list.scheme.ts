import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';

import { User } from '../../users/models/user.entity';
import { Chat } from '../models/chat.entity';
import { Message } from '../models/message.entity';

export class AuthorScheme {
  @Expose()
  @ApiProperty({ type: String, example: '' })
  id: User['id'];

  @Expose()
  @ApiProperty({ type: String, example: '' })
  firstName: User['firstName'];

  @Expose()
  @ApiProperty({ type: String, example: '' })
  lastName: User['lastName'];
}

export class MessageScheme {
  @Expose()
  @ApiProperty({ type: String, example: '' })
  id: Message['id'];

  @Expose()
  @ApiProperty({ type: String, example: '' })
  text: Message['text'];

  @Expose()
  @ApiProperty({ type: Boolean, example: true })
  isUnread: Message['isUnread'];

  @Expose()
  @ApiProperty({ type: Date, example: new Date() })
  createdAt: Message['createdAt'];

  @Expose()
  @ApiProperty({ type: Date, example: new Date() })
  updatedAt: Message['updatedAt'];

  @Expose()
  @ApiProperty()
  @Type(() => AuthorScheme)
  author: AuthorScheme;
}

export class ChatListScheme {
  @Expose()
  @ApiProperty({ type: String, example: '' })
  id: Chat['id'];

  @Expose()
  @ApiProperty({ type: String, example: '' })
  name: Chat['name'];

  @Expose()
  @ApiProperty({ type: Number, example: 1 })
  unreadMessages: number;

  @Expose()
  @ApiProperty()
  @Type(() => MessageScheme)
  lastMessage: MessageScheme;
}

function plainToChat<T>(chats: T[]): ChatListScheme[];
function plainToChat<T>(chat: T): ChatListScheme[];
function plainToChat(chats: unknown): unknown {
  return plainToInstance(ChatListScheme, chats, { excludeExtraneousValues: true });
}

export { plainToChat };
