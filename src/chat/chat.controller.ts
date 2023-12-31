import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
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
import { GetChatDto } from './dto/get-chat.dto';
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

  @Get('chat')
  @ApiOperation({
    summary: 'Get chat info',
    description: 'Get chat info by chat id (primary) or user id',
  })
  async getChatByUserId(@Query() dto: GetChatDto, @Req() req: FastifyCustomRequest) {
    if (!dto.userId && !dto.chatId) return;

    const reqUserId = req.user.sub;

    if (dto.chatId) return this.chatService.getChatInfo(dto.chatId);
    if (dto.userId) return this.chatService.findGeneralChat(dto.userId, reqUserId);
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

  @Patch('msg/read/:msgId')
  @ApiParam({
    name: 'msgId',
    description: 'Message id',
    type: 'string',
    format: 'uuid',
    example: '254a8188-2dff-4053-8816-45c0dd08fb08',
  })
  @ApiOperation({ summary: 'Set read status', description: 'Mark message as read' })
  async readMessage(@Param('msgId') msgId: string, @Req() req: FastifyCustomRequest) {
    const userId = req.user.sub;
    const canRead = await this.messageService.canReadMessage(msgId, userId);
    if (!canRead) throw new ForbiddenException();

    await this.messageService.readMessage(msgId, userId);
  }
}
