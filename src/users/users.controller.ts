import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  ParseUUIDPipe,
  Inject,
  Put, UseInterceptors
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { API_VERSION_HEADER } from '../common/constants/headers';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { plainToUser, UserEntity } from './dto/User.entity';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';

@ApiTags('User')
@Controller('users')
export class UsersController {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Version('1')
  findAllV1() {
    return this.usersService.findAllV1({ select: ['id'] });
  }

  @ApiHeader({
    name: API_VERSION_HEADER,
    description: 'Select version',
    required: true,
    enum: ['2', '1'],
  })
  @Get()
  @Version('2')
  async findAllV2(): Promise<UserEntity[]> {
    const users = await this.usersService.findAllV2();
    return plainToUser(users);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    const user = await this.usersService.findOne({ id });
    return plainToUser(user);
  }

  @Patch(':id')
  update(@Param('id') id: User['id'], @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/password')
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426655440000' })
  @UseInterceptors(TransactionInterceptor)
  changePassword(@Param('id') id: User['id'], @Body() updateUserDto: UpdateUserPasswordDto) {
    return this.usersService.changePassword(
      id,
      updateUserDto?.newPassword,
      updateUserDto?.oldPassword,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
