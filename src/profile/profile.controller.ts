import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';

import { Controller, Get, Post, Req, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';

import { FastifyCustomRequest } from '../common/types/request';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() req: FastifyCustomRequest) {
    return this.profileService.getProfile(req.user.id);
  }

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  // @ApiImplicitFile({ name: 'file', required: true, description: 'Avatar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // comment: { type: 'string', required: false },
        // outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiProduces()
  async uploadAvatar(@Req() req: FastifyCustomRequest) {
    // const userId = req.user.sub;
    const file = await req.file();
    const fileName = file.filename;
    try {
      await fsPromises.access('./uploads');
    } catch (e) {
      await fsPromises.mkdir('./uploads');
    }

    const writeStream = fs.createWriteStream('./uploads/' + fileName);
    file.file.pipe(writeStream);
    const readStream = fs.createReadStream('./uploads/' + fileName);

    return new StreamableFile(readStream);
  }
}
