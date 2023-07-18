import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: FastifyRequest, res: FastifyReply['raw'], next: () => void) {
    const userAgent = req.headers['user-agent'] || '';

    res.on('close', () => {
      const { statusCode } = res;

      this.logger.log(`[${req.method}] ${req.url} - ${statusCode} - (${userAgent}) ${req.ip}`);
    });

    if (next) next();
  }
}
