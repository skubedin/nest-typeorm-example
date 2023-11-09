import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, concatMap, finalize, Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { FastifyReply } from 'fastify';

export const ENTITY_MANAGER_KEY = Symbol('ENTITY_MANAGER_KEY');

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<FastifyReply>();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    req[ENTITY_MANAGER_KEY] = queryRunner.manager;

    return next.handle().pipe(
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        return data;
      }),
      catchError(async (error) => {
        await queryRunner.rollbackTransaction();
        throw error;
      }),
      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}
