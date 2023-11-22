import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

import { cleanJwtTokenHelper } from '../../common/helpers/clean-jwt-token.helper';
import { UserFromAuthGuard } from '../../common/types/request';
import { UserRepository } from '../../users/user.repository';
import { IS_PUBLIC_API } from './is-public.decorator';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const isPublic =
      this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_API, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    if (isPublic) return true;

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const secret = this.configService.get('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });

      const user: UserFromAuthGuard = await this.userRepository.findOne({
        relations: {
          role: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: {
            id: true,
            name: true,
          },
        },
        where: {
          id: payload.sub,
        },
      });

      if (!user) throw new UnauthorizedException();

      request['user'] = { ...payload, ...user };
    } catch (e) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest) {
    let accessToken = request.headers['authorization'];

    if (!accessToken) return undefined;
    if (Array.isArray(accessToken)) accessToken = accessToken[0];

    return cleanJwtTokenHelper(accessToken);
  }
}
