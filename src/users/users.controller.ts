import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

import { IsPublic } from '../auth/guards/is-public.decorator';
import { API_VERSION_HEADER } from '../common/constants/headers';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { plainToUser, UserEntity } from './entities/User.entity';
import { User } from './models/user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
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
    const user = await this.usersService.findOne({
      where: {
        id,
      },
    });
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

  @IsPublic()
  @Post('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    await this.usersService.setPassword(dto);
    return;
  }
}
