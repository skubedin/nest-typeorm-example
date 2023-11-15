import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvPath } from '../../common/helpers/env.helper';
import { TypeormConfigService } from '../../shared/typeorm/typeorm.service';
import { PermissionsSeedersModule } from './permissions/permissions.module';
import { RolesSeedersModule } from './roles/roles.module';
import { SeedersService } from './seeders.service';
import { UsersSeedersModule } from './users/users.module';

const envPath = getEnvPath('src/common/envs');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envPath,
      isGlobal: true,
    }),
    PermissionsSeedersModule,
    RolesSeedersModule,
    TypeOrmModule.forRootAsync({ useClass: TypeormConfigService }),
    UsersSeedersModule,
  ],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
