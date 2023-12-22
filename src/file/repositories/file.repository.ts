import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseRepository } from '../../common/repositories/base.repository';
import { FileModel } from '../models/file.entity';

export class FileRepository extends BaseRepository {
  create(entity: QueryDeepPartialEntity<FileModel>) {
    const repo = this.getRepository(FileModel);
    return repo.insert(entity);
  }

  delete(id: string) {
    const repo = this.getRepository(FileModel);
    return repo.delete(id);
  }

  findOne(entity: FindOneOptions<FileModel>) {
    const repo = this.getRepository(FileModel);
    return repo.findOne(entity);
  }
}
