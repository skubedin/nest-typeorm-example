import * as process from 'process';
import { resolve } from 'path';
import { existsSync } from 'fs';

export function getEnvPath(dest: string) {
  const fallback = resolve(dest + '/.env');
  const env = process.env.NODE_ENV;
  const filename = env ? `${env}.env` : 'development.env';

  const filePath = resolve(`${dest}/${filename}`);

  if (existsSync(filePath)) return filePath;

  return fallback;
}
