import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './message.service';
import { UserChatRepository } from './repositories/user-chat.repository';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, MessageService, MessageRepository, UserChatRepository],
  exports: [ChatRepository, MessageRepository],
})
export class ChatModule {}
