import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

export function capitalizeFirstLetter(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const convertErrorMessage = (message = '') => message.toUpperCase().replace(/\s/g, '_');

function transformMessage(msg = '') {
  const cleared = msg.replace('.', ' ');
  const split = cleared.replace(/(?<!\s|^)(?<letter>[A-Z])/g, ' $<letter>');

  return capitalizeFirstLetter(split.toLowerCase());
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  logger = new Logger(ErrorInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        const { method, ip, url } = context.switchToHttp().getRequest();

        const messagesIsArray = Array.isArray(error.response?.message);
        if (messagesIsArray) {
          error.response.message = error.response.message.map((msg) => transformMessage(msg));
        }

        let formattedMessages =
          messagesIsArray && error?.response?.message.length > 1
            ? error?.response?.message.join('\n\t')
            : error?.response?.message;

        if (error.message) formattedMessages = error.message;

        let errorPath = '';
        if (error.stack) {
          const paths = [...error.stack.matchAll(/at\s.*\((?!node).*(?=\n)/gi)];
          errorPath = paths.at(-1)[0];
        }

        this.logger.error(
          `(${method}) ${url} - ${error.status || 500} - ${ip}
\tStack trace:\t\x1b[0;2;37m${error.stack.replace(/[\n\t]|\s{2,}/g, ' ')}\x1b[0m
\tError locate:
\t\t${errorPath}
\tmessages:
\t\t${formattedMessages}`,
        );

        if (error.response) {
          error.response.error = error.response.error
            ? convertErrorMessage(error.response.error)
            : convertErrorMessage(error.response.message);
        }

        throw error;
      }),
    );
  }
}
