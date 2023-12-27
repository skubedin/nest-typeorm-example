import { Controller, Delete, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';

import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { FastifyCustomRequest } from '../common/types/request';
import { FileService } from '../file/file.service';
import { FileRepository } from '../file/repositories/file.repository';
import { UserRepository } from '../users/user.repository';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly fileService: FileService,
    private readonly fileRepository: FileRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @Get()
  getProfile(@Req() req: FastifyCustomRequest) {
    return this.profileService.getProfile(req.user.id);
  }

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiProduces()
  @UseInterceptors(TransactionInterceptor)
  async uploadAvatar(@Req() req: FastifyCustomRequest) {
    const userId = req.user.sub;
    const file = await req.file();
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        avatar: {
          id: true,
          path: true,
          name: true,
        },
      },
      relations: { avatar: true },
      where: { id: userId },
    });

    const { path, name } = await this.fileService.saveFileInDir({ file, dir: 'avatars' });
    const fileInsertResult = await this.fileRepository.create({ path, name });

    await this.userRepository.update(userId, { avatar: { id: fileInsertResult.raw[0].id } });

    if (user.avatar) await this.fileService.removeFileFromDir(user.avatar.path);

    return {
      path,
      name,
    };
  }

  @ApiOperation({ summary: 'Delete avatar' })
  @Delete('avatar')
  async deleteAvatar(@Req() req: FastifyCustomRequest) {
    const userId = req.user.sub;
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        avatar: {
          id: true,
          path: true,
          name: true,
        },
      },
      relations: { avatar: true },
      where: { id: userId },
    });

    if (user.avatar) {
      await this.fileService.removeFileFromDir(user.avatar.path);
      await this.userRepository.update(userId, { avatar: null });
    }
  }
}
