import { Injectable } from '@nestjs/common';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';

import { ChatService } from './chat.service';
import { Chat } from './models/chat.entity';
import { UserChat } from './models/user-chat.entity';
import { MessageRepository } from './repositories/message.repository';

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
  }): Promise<{ id: string; created_at: string; updated_at: string }> {
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
        ...(param.startDate && { createdAt: MoreThanOrEqual(param.startDate) }),
        ...(param.endDate && { createdAt: LessThanOrEqual(param.endDate) }),
      },
      take: perPage,
    });
  }

  findMessage(param: { id: string; author?: boolean }) {
    return this.messageRepository.findOne({
      select: {
        id: true,
        text: true,
        isUnread: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      relations: {
        author: param.author,
      },
      where: { id: param.id },
    });
  }

  async readMessage(msgId: string, userId: string) {
    await this.messageRepository.updateById(
      { id: msgId, author: { id: Not(userId) } },
      { isUnread: false },
    );
  }

  canReadMessage(msgId: string, userId: string) {
    return this.messageRepository
      .createBuilder('m')
      .select()
      .leftJoin(Chat, 'c', 'c.id = m.chat_id')
      .leftJoin(UserChat, 'uc', 'uc.chat_id = m.chat_id')
      .where(
        'uc.user_id = :userId ' +
          'AND (m.author_id <> :userId OR (m.author_id = :userId AND c.is_self = TRUE))',
        {
          msgId,
          userId,
        },
      )
      .getExists();
  }
}
