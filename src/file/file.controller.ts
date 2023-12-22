import * as fs from 'node:fs';
import * as path from 'node:path';

import { Controller, Get, NotFoundException, Param, Query, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

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
