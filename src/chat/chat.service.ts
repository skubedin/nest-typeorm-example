import { Injectable } from '@nestjs/common';

import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';
import { UserChatRepository } from './repositories/user-chat.repository';
import { Roles } from '../common/roles/constants';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userChatRepository: UserChatRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  getAllChatsWithLastMessage(userId: string) {
    return this.chatRepository.getAllChatsWithLastMessage(userId);
  }

  async findOrCreate(authorId: string, recipientId: string): Promise<string> {
    const userChat = await this.userChatRepository.findGeneralId([authorId, recipientId]);
    let chatId = userChat?.chatId;

    if (!userChat) {
      const chat = await this.chatRepository.create();
      chatId = chat.raw[0].id;

      await this.userChatRepository.create(chatId, authorId);
      await this.userChatRepository.create(chatId, recipientId);
    }

    return chatId;
  }

  async hasAccess(user: { roleName: string; id: string }, chatId: string) {
    if (user.roleName === Roles.ADMIN) return true;

    return this.userChatRepository.exist(chatId, user.id);
  }
}
