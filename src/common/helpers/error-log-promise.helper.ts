import { WinstonLogger } from './winston-logger.helper';

export async function errorLogPromiseHelper<T>(promise: Promise<T>): Promise<T | undefined> {
  try {
    return await promise;
  } catch (error) {
    WinstonLogger.error(error);
    return;
  }
}
