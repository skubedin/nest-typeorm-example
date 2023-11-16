import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { WinstonLogger } from '../../common/helpers/winston-logger.helper';
import { PermissionsSeederService } from './permissions/permissions.service';
import { roles as rolesData } from './roles/data';
import { RolesSeederService } from './roles/roles.service';
import { InsertionRole, RolesRecord } from './types';
import { UsersSeederService } from './users/users.service';

@Injectable()
export class SeedersService {
  logger = WinstonLogger;

  constructor(
    private readonly usersSeederService: UsersSeederService,
    private readonly permissionsSeederService: PermissionsSeederService,
    private readonly rolesSeedersService: RolesSeederService,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    this.logger.log('Start seeding ...');

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const manager = queryRunner.manager;
      const roles = await this.createRoles(manager);

      const rolesMap = roles.reduce<RolesRecord>((map, role, index) => {
        map[rolesData[index].name] = role;
        return map;
      }, {});

      await this.createPermissions(manager, rolesMap);
      await this.createUsers(manager, rolesMap);

      await queryRunner.commitTransaction();

      this.logger.log('Successfully completed seeding');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createUsers(manager: EntityManager, roles: RolesRecord) {
    this.logger.log('Users seed start');
    await this.usersSeederService.create(manager, roles);
    this.logger.log('Users seed end successfully');
  }

  async createPermissions(manager: EntityManager, roles: RolesRecord) {
    this.logger.log('Permissions seed start');
    await this.permissionsSeederService.create(manager, roles);
    this.logger.log('Permissions seed end successfully');
  }

  async createRoles(manager: EntityManager): Promise<InsertionRole[]> {
    this.logger.log('Roles seed start');
    const result = await this.rolesSeedersService.create(manager);
    this.logger.log('Roles seed end successfully');

    return result.raw;
  }
}
