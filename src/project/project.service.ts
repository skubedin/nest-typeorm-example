import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { FastifyCustomRequest } from '../common/types/request';
import { ProjectRepository } from './project.repository';

@Injectable({ scope: Scope.REQUEST })
export class ProjectService {
  constructor(
    @Inject(REQUEST) private readonly req: FastifyCustomRequest,
    private readonly projectRepository: ProjectRepository,
  ) {}

  findAll() {
    return this.projectRepository.findAll({
      where: {
        user: {
          id: this.req.user?.id,
        },
      },
    });
  }
}
