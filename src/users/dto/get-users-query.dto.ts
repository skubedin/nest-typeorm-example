import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Type(() => String)
  search?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  perPage?: number;
}
