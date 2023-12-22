import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @Length(1, 5000)
  text: string;

  @ApiProperty({ example: '6fa006db-9701-4cce-b435-1175e7923e4f' })
  @IsUUID()
  recipientId: string;
}
