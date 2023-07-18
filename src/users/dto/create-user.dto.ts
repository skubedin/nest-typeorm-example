import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 255)
  public firstName: string;

  @Length(3, 255)
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsStrongPassword()
  @Length(3, 255)
  public password: string;
}
