export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Subject {
  ALL = 'all',
  PASSWORD = 'password',
  PROJECT = 'project',
  SCHEME = 'scheme',
  SUBJECT = 'subject',
  USER = 'user',
}

export enum Scope {
  ALL = 'all',
  SELF = 'self',
}

export enum Roles {
  ADMIN = 'Admin',
  USER = 'User',
}

export type Conditions = { [key: string]: unknown } | null | undefined;
