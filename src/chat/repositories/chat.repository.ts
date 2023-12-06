import { Injectable, Scope } from '@nestjs/common';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseRepository } from '../../common/repositories/base.repository';
import { User } from '../../users/models/user.entity';
import { Chat } from '../models/chat.entity';
import { Message } from '../models/message.entity';
import { UserChat } from '../models/user-chat.entity';

@Injectable({ scope: Scope.REQUEST })
export class ChatRepository extends BaseRepository {
  async getAllChatsWithLastMessage(userId: string) {
    const repo = this.getRepository(Chat);
    const builder = repo
      .createQueryBuilder('chat')
      .select(['chat.id AS id', 'chat.name AS name'])
      .addSelect(
        (sq) =>
          sq
            .select(
              'jsonb_build_object(' +
                "'id', m.id, " +
                "'text', m.text, " +
                "'isUnread', m.is_unread, " +
                "'createdAt', m.created_at, " +
                "'updatedAt', m.updated_at, " +
                "'author', jsonb_build_object(" +
                "'id', u.id, " +
                "'firstName', u.first_name, " +
                "'lastName', u.last_name" +
                ')' +
                ')',
            )
            .from(Message, 'm')
            .leftJoin(User, 'u', 'u.id = m.author_id')
            .where('chat_id = chat.id')
            .orderBy({ 'm.created_at': 'DESC' })
            .limit(1),
        'lastMessage',
      )
      .addSelect(
        (sq) =>
          sq
            .select(
              'case ' +
                'when u2.id IS NULL ' +
                'then NULL ' +
                'else jsonb_build_object(' +
                "'id', u2.id, " +
                "'firstName', u2.first_name, " +
                "'lastName', u2.last_name, " +
                "'email', u2.email" +
                ') ' +
                'end as recipient',
            )
            .from(UserChat, 'uc2')
            .leftJoin(
              User,
              'u2',
              'uc2.chat_id = chat.id AND uc2.user_id <> :userId AND uc2.user_id = u2.id',
            )
            .where('uc2.chat_id = chat.id AND uc2.user_id <> :userId'),
        'recipient',
      )
      .addSelect(
        (sq) =>
          sq
            .select('COUNT(id) AS unreadMessages')
            .from(Message, 'm')
            .where('chat_id = chat.id AND is_unread = true AND author_id = :userId'),
        'unreadMessages',
      )
      .distinct(true)
      .leftJoin(UserChat, 'uc', 'uc.chat_id = chat.id AND uc.user_id = :userId')
      .where('uc.user_id = :userId', { userId });
    return builder.getRawMany();
  }

  findOne(options?: FindOneOptions<Chat>) {
    const repo = this.getRepository(Chat);

    return repo.findOne(options);
  }

  create(entity: QueryDeepPartialEntity<Chat>) {
    const repo = this.getRepository(Chat);
    return repo.insert(entity);
  }

  createQueryBuilder(alias: string) {
    const repo = this.getRepository(Chat);
    return repo.createQueryBuilder(alias);
  }
}
