import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @Length(3, 255)
  public firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Length(3, 255)
  public lastName: string;

  @ApiProperty({ example: 'asd@asd.asd' })
  @IsEmail()
  public email: string;

  @ApiProperty({ example: 'Asdasd1!' })
  @IsStrongPassword()
  @Length(3, 255)
  public password: string;
}
