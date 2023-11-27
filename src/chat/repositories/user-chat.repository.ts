import { BaseRepository } from '../../common/repositories/base.repository';
import { Chat } from '../entities/chat.entity';
import { UserChat } from '../entities/user-chat.entity';

export class UserChatRepository extends BaseRepository {
  findGeneralId(userIds: string[]): Promise<{ chatId?: Chat['id'] } | undefined> {
    const repo = this.getRepository(UserChat);
    const builder = repo
      .createQueryBuilder('uc')
      .select('chat_id as "chatId"')
      .where('user_id IN (:...userIds)', { userIds })
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
