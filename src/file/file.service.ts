import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import * as path from 'node:path';

import { MultipartFile } from '@fastify/multipart';
import { Injectable, Logger } from '@nestjs/common';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { ulid } from 'ulid';

import { _ } from '../common/constants/global';
import { FileModel } from './models/file.entity';
import { FileRepository } from './repositories/file.repository';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async saveFileInDir({
    file,
    basePath = './uploads',
    dir = '',
  }: {
    basePath?: string;
    dir?: string;
    file: MultipartFile;
  }) {
    const ulidName = ulid(Date.now());
    const fullDir = path.join(basePath, dir);
    try {
      await fsPromises.access(fullDir);
    } catch (e) {
      await fsPromises.mkdir(fullDir, { recursive: true });
    }

    const ext = path.extname(file.filename);

    const newFileName = ulidName + ext;
    const fullPath = path.join(fullDir, newFileName);

    const writeStream = fs.createWriteStream(fullPath);
    file.file.pipe(writeStream);

    return {
      ulid: ulidName,
      path: fullPath,
      name: newFileName,
    };
  }

  async removeFileFromDir(path: string) {
    try {
      const removeFilePromise = new Promise((doRes, doRej) => {
        fs.unlink(path, (err) => {
          if (err) {
            doRej(err);
            return;
          }
          doRes(_);
        });
      });

      await removeFilePromise;
    } catch (e) {
      const logger = new Logger();
      logger.error(e);
    }
  }

  findOneById(
    id: string,
    entityFields: FindOneOptions<FileModel>['select'] = ['id', 'name', 'path'],
  ) {
    return this.fileRepository.findOne({ select: entityFields, where: { id } });
  }
}
