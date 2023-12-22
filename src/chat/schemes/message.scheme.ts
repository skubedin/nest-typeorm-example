import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';

import { User } from '../../users/models/user.entity';
import { Message } from '../models/message.entity';

export class AuthorScheme {
  @Expose()
  @ApiProperty({ type: String, example: '' })
  id: User['id'];

  @Expose()
  @ApiProperty({ type: String, example: '', required: false })
  firstName?: User['firstName'];

  @Expose()
  @ApiProperty({ type: String, example: '', required: false })
  lastName?: User['lastName'];
}

export class MessageScheme {
  @Expose()
  @ApiProperty({ type: String, example: '' })
  id: Message['id'];

  @Expose()
  @ApiProperty({ type: String, example: '', required: false })
  text?: Message['text'];

  @Expose()
  @ApiProperty({ type: Boolean, example: true, required: false })
  isUnread?: Message['isUnread'];

  @Expose()
  @ApiProperty({ type: Date, example: new Date(), required: false })
  createdAt?: Message['createdAt'];

  @Expose()
  @ApiProperty({ type: Date, example: new Date(), required: false })
  updatedAt?: Message['updatedAt'];

  @Expose()
  @ApiProperty({ required: false })
  @Type(() => AuthorScheme)
  author?: AuthorScheme;
}

function plainToMessage<T>(messages: T[]): MessageScheme[];
function plainToMessage<T>(message: T): MessageScheme;
function plainToMessage(messages: unknown): unknown {
  return plainToInstance(MessageScheme, messages, { excludeExtraneousValues: true });
}

export { plainToMessage };
