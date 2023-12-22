import * as fs from 'node:fs';

import { Controller, Get, NotFoundException, Param, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { IsPublic } from '../auth/guards/is-public.decorator';
import { FileService } from './file.service';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Get file' })
  @Get(':fileId')
  @IsPublic()
  async getFileStream(@Param('fileId') fileId: string) {
    const fileNotFoundException = new NotFoundException('File not found');

    const file = await this.fileService.findOneById(fileId, ['path']);
    if (!file) throw fileNotFoundException;

    try {
      const stats = await fs.promises.stat(file.path);
      if (stats.isFile()) {
        const stream = fs.createReadStream(file.path);
        return new StreamableFile(stream);
      }
    } catch (e) {
      throw fileNotFoundException;
    }

    // if !stats.isFile()
    throw fileNotFoundException;
  }
}
