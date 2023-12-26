import 'winston-daily-rotate-file';

import fastifyCookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { FastifyRequest } from 'fastify';

import { AppModule } from './app.module';
import { API_VERSION_HEADER } from './common/constants/headers';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { errorLogPromiseHelper } from './common/helpers/error-log-promise.helper';
import { parseAuthorHelper } from './common/helpers/parse-author.helper';
import { WinstonLogger } from './common/helpers/winston-logger.helper';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';

const CORS = {
  origin:
    'http://localhost,http://localhost:3000,http://localhost:4567,http://localhost:5173'.split(','),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: CORS,
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

  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });

  await app.register(fastifyCookie, { secret: config.get('COOKIE_SECRET') });
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: config.get('MAX_FILE_SIZE'),
    },
  });

  const author = await errorLogPromiseHelper(parseAuthorHelper('AUTHOR'));

  const configSwagger = new DocumentBuilder()
    .setTitle('NestJS Example')
    .setDescription('Example NestJS with TypeORM')
    .setVersion('1.0.0')
    .addServer(baseURL)
    .setContact(author?.name, author?.url, author?.email)
    // .addCookieAuth('access-token')
    // .addBasicAuth()
    // .addOAuth2()
    .addBearerAuth({
      type: 'http',
    })
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter({ httpAdapter }));
  app.useGlobalInterceptors(new ErrorInterceptor());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port, '0.0.0.0', () => {
    WinstonLogger.log(`App listen on: ${baseURL}`);
    WinstonLogger.log(`App listen on: ${baseURL}/doc`);
  });
}

(() => bootstrap())();
