import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FastifyCustomRequest } from '../common/types/request';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';

@ApiTags('Chat')
@Controller('talk')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @Get('chats')
  getAllChats(@Req() req: FastifyCustomRequest) {
    return this.chatService.getAllChatsWithLastMessage(req.user.sub);
  }

  @Post('msg')
  @UseInterceptors(TransactionInterceptor)
  async sendMessage(@Body() dto: CreateMessageDto, @Req() req: FastifyCustomRequest) {
    await this.messageService.createMessage({ ...dto, authorId: req.user.sub });
  }
}
