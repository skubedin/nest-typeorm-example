import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_API = Symbol('IS_PUBLIC_API');
export const IsPublic = () => SetMetadata(IS_PUBLIC_API, true);
