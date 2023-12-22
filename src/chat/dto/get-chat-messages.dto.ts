import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class GetChatMessagesDto {
  @ApiProperty({
    example: new Date().toISOString(),
    required: false,
    format: 'date',
    type: 'string',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    required: false,
    format: 'date',
    type: 'string',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, type: 'string' })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  perPage?: number;
}
