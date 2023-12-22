import { Injectable, Scope } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseRepository } from '../../common/repositories/base.repository';
import { Message } from '../models/message.entity';

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

  updateById(where: FindOptionsWhere<Message>, partialEntity: QueryDeepPartialEntity<Message>) {
    const repo = this.getRepository(Message);

    return repo.update(where, partialEntity);
  }

  exist(options: FindManyOptions<Message>) {
    const repo = this.getRepository(Message);

    return repo.exist(options);
  }

  createBuilder(alias: string) {
    const repo = this.getRepository(Message);
    return repo.createQueryBuilder(alias);
  }
}
