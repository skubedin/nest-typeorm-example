import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const WinstonLogger = WinstonModule.createLogger({
  transports: [
    // let's log errors into its own file
    new winston.transports.DailyRotateFile({
      filename: `logs/%DATE%-error.log`,
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, // don't want to zip our logs
      maxFiles: '30d', // will keep log until they are older than 30 days
    }),
    // logging all level
    new winston.transports.DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, // don't want to zip our logs
      maxFiles: '30d', // will keep log until they are older than 30 days
    }),
    // we also want to see logs in our console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
    }),
  ],
});