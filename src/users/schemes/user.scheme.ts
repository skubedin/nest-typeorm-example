import { Expose, plainToInstance } from 'class-transformer';

export class UserScheme {
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() email: string;
  @Expose() id: string;
}

function plainToUser<T>(user: T[]): UserScheme[];
function plainToUser<T>(user: T): UserScheme;
function plainToUser(user: unknown): unknown {
  return plainToInstance(UserScheme, user, { excludeExtraneousValues: true });
}

export { plainToUser };
