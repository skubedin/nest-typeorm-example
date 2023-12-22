import { Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

import { BaseRepository } from '../common/repositories/base.repository';
import { Project } from './models/project.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProjectRepository extends BaseRepository {
  constructor(protected readonly dataSource: DataSource) {
    super();
  }

  findAll(options: FindManyOptions<Project>) {
    const projectRepository = this.dataSource.getRepository(Project);

    return projectRepository.find(options);
  }
}
