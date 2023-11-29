import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';

import { Chat } from '../models/chat.entity';
import { MessageScheme } from './message.scheme';

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
function plainToChat<T>(chat: T): ChatListScheme;
function plainToChat(chats: unknown): unknown {
  return plainToInstance(ChatListScheme, chats, { excludeExtraneousValues: true });
}

export { plainToChat };
