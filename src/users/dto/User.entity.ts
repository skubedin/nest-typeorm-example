import { Expose, plainToInstance } from 'class-transformer';

export class UserEntity {
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() email: string;
  @Expose() id: string;
}

function plainToUser<T>(user: T[]): UserEntity[];
function plainToUser<T>(user: T): UserEntity;
function plainToUser(user: unknown): unknown {
  return plainToInstance(UserEntity, user, { excludeExtraneousValues: true });
}

export { plainToUser };
