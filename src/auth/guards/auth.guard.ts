import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

import { IS_PUBLIC_API } from './is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic =
      this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_API, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    if (isPublic) return true;

    const token = this.extractTokenFromHeader(request);
    console.log('--->>> token', token);

    if (!token) throw new UnauthorizedException();

    try {
      const secret = this.configService.get('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });
      console.log('--->>> payload', payload);
      request.user = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest) {
    let accessToken = request.headers['authorization'];

    if (!accessToken) return undefined;
    if (Array.isArray(accessToken)) accessToken = accessToken[0];

    return accessToken.replace('Bearer ', '');
  }
}
