import { Injectable, Scope } from '@nestjs/common';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

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
      .select(['chat.id', 'chat.name'])
      .addSelect(
        (sq) =>
          sq
            .select(
              'jsonb_build_object(' +
                "'id', m.id," +
                " 'text', m.text," +
                " 'isUnread', m.isUnread," +
                " 'author', jsonb_build_object(" +
                "'id', u.id," +
                "'firstName', u.first_name," +
                "'lastName', u.last_name" +
                ')' +
                ')',
            )
            .addFrom(Message, 'm')
            .leftJoin(User, 'u', 'u.id = m.author_id')
            .where('chat_id = chat.id')
            .orderBy({ 'm.created_at': 'DESC' })
            .limit(1),
        'lastMessage',
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

  create() {
    const repo = this.getRepository(Chat);
    return repo.insert({});
  }
}
