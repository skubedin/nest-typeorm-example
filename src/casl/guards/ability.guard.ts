import { createMongoAbility, ForcedSubject, MongoAbility, RawRuleOf } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource, IsNull } from 'typeorm';

import { Action, Subject } from '../../common/roles/constants';
import { PermissionEntity } from '../../common/roles/entities/permission.entity';
import { FastifyCustomRequest } from '../../common/types/request';
import { CHECK_ABILITY, RequiredRule } from '../decorators/abilities.decorator';

export type Abilities = [Action, Subject | ForcedSubject<Exclude<Subject, Subject.ALL>>];
export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly dataSource: DataSource) {}

  createAbility = (rules: RawRuleOf<AppAbility>[]) => createMongoAbility(rules);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];
    const request = context.switchToHttp().getRequest<FastifyCustomRequest>();

    try {
      const permissionsRepository = this.dataSource.manager.getRepository(PermissionEntity);
      const userPermissions = await permissionsRepository.find({
        select: ['id', 'scope', 'subject', 'action', 'conditions'],
        where: {
          role: { id: request.user.role.id },
          deletedAt: IsNull(),
        },
      });

      const ability = this.createAbility(Object(userPermissions));
      for (const rule of rules) {
        // const condition = rule.scope === Scope.SELF ? {} : {};
        const doesntHaveAbility = ability.cannot(rule.action, rule.subject);
        if (doesntHaveAbility) return false;
      }
      return true;
    } catch (error) {
      const logger = new Logger();
      logger.error(error);

      throw error;
    }
  }
}
