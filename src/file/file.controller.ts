import * as fs from 'node:fs';

import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller()
export class FileController {
  @ApiOperation({ summary: 'Get file' })
  @Get(':id')
  getFileStream(@Param('id') id: string) {
    const stream = fs.createReadStream('./uploads' + id);
    return new StreamableFile(stream);
  }
}
