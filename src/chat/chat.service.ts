import { Injectable } from '@nestjs/common';

import { Roles } from '../common/roles/constants';
import { User } from '../users/models/user.entity';
import { UserChat } from './models/user-chat.entity';
import { ChatRepository } from './repositories/chat.repository';
import { UserChatRepository } from './repositories/user-chat.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userChatRepository: UserChatRepository,
  ) {}

  getAllChatsWithLastMessage(userId: string) {
    return this.chatRepository.getAllChatsWithLastMessage(userId);
  }

  async findOrCreate(authorId: string, recipientId: string): Promise<string> {
    const userChat = await this.userChatRepository.findGeneralChatId(authorId, recipientId);
    let chatId = userChat?.chatId;

    if (!userChat) {
      const chat = await this.chatRepository.create({ isSelf: authorId === recipientId });
      chatId = chat.raw[0].id;

      await this.userChatRepository.create(chatId, authorId);
      if (authorId !== recipientId) await this.userChatRepository.create(chatId, recipientId);
    }

    return chatId;
  }

  async findGeneralChat(userId: string, recipientId: string) {
    const chat = await this.userChatRepository.findGeneralChatId(userId, recipientId);

    if (!chat?.chatId) return {};

    return this.getChatInfo(chat.chatId);
  }

  async getChatInfo(chatId: string, userId?: string) {
    const builder = this.chatRepository
      .createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c.name AS name',
        'c.archived_at AS "archivedAt"',
        'c.created_at AS "createdAt"',
        'c.updated_at AS "updatedAt"',
        'jsonb_agg(DISTINCT jsonb_build_object(' +
          "'id', u.id, " +
          "'firstName', u.first_name, " +
          "'lastName', u.last_name, " +
          "'email', u.email" +
          ')) AS users',
      ])
      .leftJoin(UserChat, 'uc', 'uc.chat_id = c.id')
      .leftJoin(User, 'u', 'uc.user_id = u.id')
      .where('c.id = :chatId' + (userId ? 'AND uc.user_id = :userId' : ''), { chatId, userId })
      .groupBy('c.id');

    return builder.getRawOne();
  }

  async hasAccess(user: { roleName: string; id: string }, chatId: string) {
    if (user.roleName === Roles.ADMIN) return true;

    return this.userChatRepository.existChat(chatId, user.id);
  }
}
