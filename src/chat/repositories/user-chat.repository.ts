import { FindManyOptions } from 'typeorm';

import { BaseRepository } from '../../common/repositories/base.repository';
import { Chat } from '../models/chat.entity';
import { UserChat } from '../models/user-chat.entity';

export class UserChatRepository extends BaseRepository {
  findGeneralChatId(
    userId: string,
    recipientId?: string,
  ): Promise<{ chatId?: Chat['id'] } | undefined> {
    const repo = this.getRepository(UserChat);
    const builder = repo
      .createQueryBuilder('uc')
      .select('chat_id as "chatId"')
      .where(
        'chat_id IN (SELECT chat_id FROM user_chat WHERE user_id = :recipientId) ' +
          'AND user_id = :userId',
        { userId, recipientId: recipientId || userId },
      )
      .groupBy('chat_id')
      .having(userId === recipientId || !recipientId ? 'count(chat_id) > 1' : '');

    return builder.getRawOne();
  }

  create(chatId, userId) {
    const repo = this.getRepository(UserChat);
    return repo.insert({ user: { id: userId }, chat: { id: chatId } });
  }

  existChat(chatId: string, userId: string) {
    const repo = this.getRepository(UserChat);
    return repo.exist({ where: { user: { id: userId }, chat: { id: chatId } } });
  }

  exist(options: FindManyOptions<UserChat>) {
    const repo = this.getRepository(UserChat);
    return repo.exist(options);
  }
}
