import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsStrongPassword()
  @Length(3, 255)
  public password: string;
}
