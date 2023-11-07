import { promises } from 'node:fs';
import { resolve } from 'node:path';

const AUTHOR_KEYS = <const>['name', 'url', 'email'];
const DEFAULT_KEY = 'unknown';

type TAuthorKey = typeof DEFAULT_KEY | (typeof AUTHOR_KEYS)[number];
type TAuthor = { [key in TAuthorKey]?: string };

export async function parseAuthorHelper(filePath = 'AUTHOR'): Promise<TAuthor> {
  const file = await promises.readFile(resolve(filePath));

  const data = file.toString();

  const author = data.trim().split('\n');

  return author.reduce((author, value, index) => {
    author[AUTHOR_KEYS[index] || DEFAULT_KEY] = value;
    return author;
  }, {});
}
