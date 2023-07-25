import 'winston-daily-rotate-file';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { WinstonLogger } from './common/helpers/winston-logger.helper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: WinstonLogger,
  });
  const config: ConfigService = app.get(ConfigService);
  const port = config.get('PORT');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.register(helmet);
  app.setGlobalPrefix('api');

  const configSwagger = new DocumentBuilder()
    .setTitle('Example')
    .setDescription('Example NestJS with TypeORM')
    .setVersion('1.0.0')
    .addServer(config.get('BASE_URL'))
    .setContact(
      'Sergey Molodchenko (developer)',
      'https://sergey-molodchenko.vercel.app',
      's.skubedin@gmail.com',
    )
    .addCookieAuth('access-token')
    // .addBasicAuth()
    // .addOAuth2()
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter({ httpAdapter }));
  app.useGlobalInterceptors(new ErrorInterceptor());

  await app.listen(port, () => {
    WinstonLogger.log(`App listen on: ${config.get('BASE_URL')}`);
    WinstonLogger.log(`App listen on: ${config.get('BASE_URL')}/doc`);
  });
}

bootstrap();
