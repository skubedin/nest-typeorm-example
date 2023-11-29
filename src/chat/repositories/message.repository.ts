import { Injectable, Scope } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { BaseRepository } from '../../common/repositories/base.repository';
import { Message } from '../models/message.entity';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable({ scope: Scope.REQUEST })
export class MessageRepository extends BaseRepository {
  create(text: string, authorId: string, chatId: string) {
    const repo = this.getRepository(Message);

    return repo.insert({ text, author: { id: authorId }, chat: { id: chatId } });
  }

  findAll(options?: FindManyOptions<Message>) {
    const repo = this.getRepository(Message);

    return repo.find(options);
  }

  findOne(options: FindOneOptions<Message>) {
    const repo = this.getRepository(Message);

    return repo.findOne(options);
  }
}
