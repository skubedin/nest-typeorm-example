import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { FastifyCustomRequest } from '../common/types/request';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetChatMessagesDto } from './dto/get-chat-messages.dto';
import { MessageService } from './message.service';
import { ChatListScheme, plainToChat } from './schemes/chat-list.scheme';
import { MessageScheme, plainToMessage } from './schemes/message.scheme';

@ApiTags('Chat')
@Controller('talk')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @Get('chats')
  @ApiOperation({ summary: 'Chat list', description: 'API for getting a list of all chats' })
  @ApiOkResponse({ type: ChatListScheme })
  async getAllChats(@Req() req: FastifyCustomRequest) {
    const chats = await this.chatService.getAllChatsWithLastMessage(req.user.sub);
    return plainToChat(chats);
  }

  @Post('msg')
  @UseInterceptors(TransactionInterceptor)
  @ApiOkResponse({ type: MessageScheme })
  async sendMessage(@Body() dto: CreateMessageDto, @Req() req: FastifyCustomRequest) {
    const messageInsertValue = await this.messageService.createMessage({
      ...dto,
      authorId: req.user.sub,
    });
    const message = await this.messageService.findMessage({
      id: messageInsertValue.id,
      author: true,
    });

    return plainToMessage(message);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Chat id',
    type: 'string',
    format: 'uuid',
    example: '254a8188-2dff-4053-8816-45c0dd08fb08',
  })
  @ApiOperation({
    summary: 'Message list',
    description: 'API for getting a list of messages in the chat',
  })
  async getChatMessages(
    @Param('id') chatId: string,
    @Query() query: GetChatMessagesDto,
    @Req() req: FastifyCustomRequest,
  ) {
    const hasAccess = await this.chatService.hasAccess(
      { id: req.user.sub, roleName: req.user.role.name },
      chatId,
    );
    if (!hasAccess) throw new ForbiddenException();

    return this.messageService.getChatMessages(chatId, query);
  }
}
