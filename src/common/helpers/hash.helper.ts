import * as bcrypt from 'bcrypt';

export async function createHash(password: string) {
  const saltOrRounds = 10;
  return bcrypt.hash(password, saltOrRounds);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
