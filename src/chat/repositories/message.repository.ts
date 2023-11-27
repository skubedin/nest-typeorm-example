import { Injectable, Scope } from '@nestjs/common';

import { BaseRepository } from '../../common/repositories/base.repository';
import { Message } from '../entities/message.entity';

@Injectable({ scope: Scope.REQUEST })
export class MessageRepository extends BaseRepository {
  create(text: string, authorId: string, chatId: string) {
    const repo = this.getRepository(Message);

    return repo.insert({ text, author: { id: authorId }, chat: { id: chatId } });
  }
}
