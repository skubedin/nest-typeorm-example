import { Logger } from '@nestjs/common';

export async function errorLogPromiseHelper<T>(promise: Promise<T>): Promise<T | undefined> {
  try {
    return await promise;
  } catch (error) {
    new Logger().error(error);
    return;
  }
}
