import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { getEnvPath } from './common/helpers/env.helper';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigService } from './shared/typeorm/typeorm.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';

const envPath = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envPath,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeormConfigService }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
