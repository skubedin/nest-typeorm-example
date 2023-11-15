import { existsSync } from 'fs';
import { resolve } from 'path';
import * as process from 'process';

export function getEnvPath(dest: string) {
  const env = process.env.NODE_ENV;
  const filename = env ? `.${env}.env` : '.development.env';

  const filePath = resolve(`${dest}/${filename}`);

  if (existsSync(filePath)) return filePath;

  const fallback = resolve(dest + '/.env');
  return fallback;
}
