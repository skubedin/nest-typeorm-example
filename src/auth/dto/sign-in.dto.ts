import { IsEmail, IsStrongPassword, Length, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @MaxLength(255)
  readonly login: string;

  @IsStrongPassword()
  @Length(8, 255)
  readonly password: string;
}
