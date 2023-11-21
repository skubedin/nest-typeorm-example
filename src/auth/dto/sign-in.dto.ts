import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, Length, MaxLength } from 'class-validator';

import { IsEmailUnique } from '../../common/validation/IsEmailUnique';
import { AUTH_MESSAGES } from '../../common/error-messages';

export class SignInDto {
  @ApiProperty({ example: 'asd@asd.asd' })
  @IsEmail()
  @IsEmailUnique({ inverted: true, message: AUTH_MESSAGES.invalidPasswordOrEmail })
  @MaxLength(255)
  readonly email: string;

  @ApiProperty({ example: 'Asdasd1!' })
  @IsStrongPassword()
  @Length(8, 255)
  readonly password: string;
}
