import 'winston-daily-rotate-file';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { WinstonLogger } from './common/helpers/winston-logger.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: WinstonLogger,
  });
  const config: ConfigService = app.get(ConfigService);
  const port = config.get('PORT');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter({ httpAdapter }));
  app.useGlobalInterceptors(new ErrorInterceptor());

  await app.listen(port, () => {
    WinstonLogger.log(`App listen on: ${config.get('BASE_URL')}`);
  });
}

bootstrap();
