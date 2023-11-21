import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

import { Match } from '../../common/validation/Match';

export class SetPasswordDto {
  @ApiProperty({ example: 'asd@asd.asd' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Asdasd1!' })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'Asdasd1!' })
  @IsStrongPassword()
  @Match('password', { message: 'Password mismatch' })
  confirmPassword: string;
}
