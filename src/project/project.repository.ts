import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Repository } from 'typeorm/repository/Repository';

import { BaseRepository } from '../common/repositories/base.repository';
import { FastifyCustomRequest } from '../common/types/request';
import { Project } from './entities/project.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProjectRepository extends BaseRepository {
  // projectRepo: Repository<Project>;
  constructor(
    protected readonly dataSource: DataSource,
    @Inject(REQUEST) protected readonly req: FastifyCustomRequest,
  ) {
    super(dataSource, req);
  }

  findAll(options: FindManyOptions<Project>) {
    const projectRepository = this.dataSource.getRepository(Project);

    return projectRepository.find(options);
  }
}
