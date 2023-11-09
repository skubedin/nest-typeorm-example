import 'winston-daily-rotate-file';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { WinstonLogger } from './common/helpers/winston-logger.helper';
import { AppModule } from './app.module';
import { API_VERSION_HEADER } from './common/constants/headers';
import { parseAuthorHelper } from './common/helpers/parse-author.helper';
import { errorLogPromiseHelper } from './common/helpers/error-log-promise.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: WinstonLogger,
  });
  const config: ConfigService = app.get(ConfigService);
  const port = config.get('PORT');

  const baseURL = config.get('BASE_URL');
  const apiPrefix = config.get('API_PREFIX') || '';
  const apiVersion = config.get('API_VERSION') || '1';
  const apiVersionsList = new Array(+apiVersion).fill(0).map((_, i) => String(+apiVersion - i));

  app
    .enableVersioning({
      type: VersioningType.CUSTOM,
      defaultVersion: apiVersion,
      extractor: (req: FastifyRequest) => req.headers[API_VERSION_HEADER] || apiVersionsList,
    })
    .setGlobalPrefix(apiPrefix);

  await app.register(helmet);

  const author = await errorLogPromiseHelper(parseAuthorHelper('AUTHOR'));

  const configSwagger = new DocumentBuilder()
    .setTitle('Example')
    .setDescription('Example NestJS with TypeORM')
    .setVersion('1.0.0')
    .addServer(baseURL)
    .setContact(author?.name, author?.url, author?.email)
    // .addCookieAuth('access-token')
    // .addBasicAuth()
    // .addOAuth2()
    .addBearerAuth({
      type: 'http',
      name: 'access-token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter({ httpAdapter }));
  app.useGlobalInterceptors(new ErrorInterceptor());

  await app.listen(port, () => {
    WinstonLogger.log(`App listen on: ${baseURL}`);
    WinstonLogger.log(`App listen on: ${baseURL}/doc`);
  });
}

bootstrap();
