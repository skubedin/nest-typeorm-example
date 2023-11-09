import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, Length } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 'Asdasd1!' })
  @IsStrongPassword()
  @Length(3, 255)
  oldPassword: string;

  @ApiProperty({ example: 'Asdasd1!' })
  @IsStrongPassword()
  @Length(3, 255)
  newPassword: string;
}
