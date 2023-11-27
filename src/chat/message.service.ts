import { Injectable } from '@nestjs/common';

import { ChatService } from './chat.service';
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
  }) {
    const chatId = await this.chatService.findOrCreate(authorId, recipientId);
    await this.messageRepository.create(text, authorId, chatId);
  }
}
