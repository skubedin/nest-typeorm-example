import { Injectable } from '@nestjs/common';

import { Roles } from '../common/roles/constants';
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
    const userChat = await this.userChatRepository.findGeneralId([authorId, recipientId]);
    let chatId = userChat?.chatId;

    if (!userChat) {
      const chat = await this.chatRepository.create({ isSelf: authorId === recipientId });
      chatId = chat.raw[0].id;

      await this.userChatRepository.create(chatId, authorId);
      if (authorId !== recipientId) await this.userChatRepository.create(chatId, recipientId);
    }

    return chatId;
  }

  async hasAccess(user: { roleName: string; id: string }, chatId: string) {
    if (user.roleName === Roles.ADMIN) return true;

    return this.userChatRepository.exist(chatId, user.id);
  }
}
