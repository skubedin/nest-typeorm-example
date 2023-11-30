import { BaseRepository } from '../../common/repositories/base.repository';
import { Chat } from '../models/chat.entity';
import { UserChat } from '../models/user-chat.entity';

export class UserChatRepository extends BaseRepository {
  findGeneralId(userIds: string[]): Promise<{ chatId?: Chat['id'] } | undefined> {
    const repo = this.getRepository(UserChat);
    const builder = repo
      .createQueryBuilder('uc')
      .select('chat_id as "chatId"')
      .where(
        'chat_id IN (SELECT chat_id FROM user_chat WHERE user_id = :recipientId) AND user_id = :userId',
        { userId: userIds[0], recipientId: userIds[1] },
      )
      .groupBy('chat_id')
      .having('count(chat_id) > 1');

    return builder.getRawOne();
  }

  create(chatId, userId) {
    const repo = this.getRepository(UserChat);
    return repo.insert({ user: { id: userId }, chat: { id: chatId } });
  }

  exist(chatId: string, userId: string) {
    const repo = this.getRepository(UserChat);
    return repo.exist({ where: { user: { id: userId }, chat: { id: chatId } } });
  }
}
