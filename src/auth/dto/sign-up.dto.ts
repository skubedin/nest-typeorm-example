import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

import { Match } from '../../common/validation/Match';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @Length(3, 255)
  public firstName: string;

  @ApiProperty()
  @Length(3, 255)
  public lastName: string;

  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsStrongPassword({ minLength: 8 })
  public password: string;

  @ApiProperty()
  @IsStrongPassword({ minLength: 8 })
  @Match('password', { message: 'Password mismatch' })
  public confirmPassword: string;
}
