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
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { API_VERSION_HEADER } from '../common/constants/headers';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { plainToUser, UserEntity } from './dto/User.entity';

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
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
