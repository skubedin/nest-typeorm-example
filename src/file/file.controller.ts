import * as fs from 'node:fs';
import * as path from 'node:path';

import { Controller, Get, NotFoundException, Param, Query, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

import { IsPublic } from '../auth/guards/is-public.decorator';

@ApiTags('Files')
@Controller('files')
export class FileController {
  @ApiOperation({ summary: 'Get file' })
  @ApiImplicitQuery({
    type: 'string',
    name: 'fileName',
  })
  @Get('')
  @IsPublic()
  async getFileStream(@Query('fileName') fileName: string) {
    const filePath = path.join('./uploads' + fileName);
    try {
      await fs.promises.access(filePath);
    } catch (error) {
      new NotFoundException();
    }

    const stream = fs.createReadStream(filePath);
    return new StreamableFile(stream);
  }
}
