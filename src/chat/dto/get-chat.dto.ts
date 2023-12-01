import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetChatDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  chatId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
