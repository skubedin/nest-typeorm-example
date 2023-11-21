import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtConfigService } from './auth/jwt-config.service';
import { CaslModule } from './casl/casl.module';
import { getEnvPath } from './common/helpers/env.helper';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { TypeormConfigService } from './shared/typeorm/typeorm.service';
import { UsersModule } from './users/users.module';

const envPath = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envPath,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
    }),
    ThrottlerModule.forRoot({
      limit: 30,
      ttl: 60,
    }),
    UsersModule,
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
