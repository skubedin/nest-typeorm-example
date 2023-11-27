import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { FastifyCustomRequest } from '../common/types/request';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetChatMessagesDto } from './dto/get-chat-messages.dto';
import { MessageService } from './message.service';

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

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Chat id',
    type: 'string',
    format: 'uuid',
    example: '254a8188-2dff-4053-8816-45c0dd08fb08',
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
