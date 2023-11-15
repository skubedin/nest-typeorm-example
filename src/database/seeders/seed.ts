import 'winston-daily-rotate-file';

import { NestFactory } from '@nestjs/core';

import { SeedersModule } from './seeders.module';
import { SeedersService } from './seeders.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedersModule);
  const seeders = await appContext.get(SeedersService);

  await seeders.seed();
  await appContext.close();
}

(async () => await bootstrap())();
