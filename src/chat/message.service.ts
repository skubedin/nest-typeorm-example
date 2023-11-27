import { Injectable } from '@nestjs/common';

import { ChatService } from './chat.service';
import { MessageRepository } from './repositories/message.repository';
import { IsNull } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatService: ChatService,
  ) {}

  async createMessage({
    text,
    authorId,
    recipientId,
  }: {
    text: string;
    authorId: string;
    recipientId: string;
  }) {
    const chatId = await this.chatService.findOrCreate(authorId, recipientId);
    const msgInsertInfo = await this.messageRepository.create(text, authorId, chatId);
    return { ...msgInsertInfo.raw[0], text };
  }

  async getChatMessages(
    chatId: string,
    param?: {
      perPage?: number;
      endDate?: Date;
      page?: number;
      startDate?: Date;
    },
  ) {
    const perPage = param?.perPage ?? 25;
    const skip = (param?.page ?? 1) * perPage - perPage;

    return this.messageRepository.findAll({
      skip,
      select: {
        id: true,
        isUnread: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      relations: {
        author: true,
      },
      where: {
        chat: { id: chatId },
        deletedAt: IsNull(),
      },
      take: perPage,
    });
  }
}
