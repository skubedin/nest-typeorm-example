import { Injectable } from '@nestjs/common';

import { WinstonLogger } from '../../common/helpers/winston-logger.helper';
import { PermissionsSeederService } from './permissions/permissions.service';
import { RolesSeederService } from './roles/roles.service';
import { UsersSeederService } from './users/users.service';

@Injectable()
export class SeedersService {
  logger = WinstonLogger;

  constructor(
    private readonly usersSeederService: UsersSeederService,
    private readonly permissionsSeederService: PermissionsSeederService,
    private readonly rolesSeedersService: RolesSeederService,
  ) {}

  async seed() {
    try {
      this.logger.log('Start seeding ...');

      await this.createUsers();
      await this.createPermissions();
      await this.createRoles();

      this.logger.log('Successfully completed seeding');
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createUsers() {
    this.logger.log('Users seed start');
    await Promise.all(await this.usersSeederService.create());
    this.logger.log('Users seed end successfully');
  }

  async createPermissions() {
    this.logger.log('Permissions seed start');
    await Promise.all(await this.permissionsSeederService.create());
    this.logger.log('Permissions seed end successfully');
  }

  async createRoles() {
    this.logger.log('Roles seed start');
    await Promise.all(await this.rolesSeedersService.create());
    this.logger.log('Roles seed end successfully');
  }
}
