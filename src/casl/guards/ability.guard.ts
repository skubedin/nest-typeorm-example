import { createMongoAbility, ForcedSubject, MongoAbility, RawRuleOf } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource, IsNull } from 'typeorm';

import { Action, Subject } from '../../common/roles/constants';
import { PermissionEntity } from '../../common/roles/entities/permission.entity';
import { RequestUser } from '../../common/types/request';
import { User } from '../../users/entities/user.entity';
import { CHECK_ABILITY, RequiredRule } from '../decorators/abilities.decorator';

export type Abilities = [Action, Subject | ForcedSubject<Exclude<Subject, Subject.ALL>>];
export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly dataSource: DataSource) {}

  createAbility = (rules: RawRuleOf<AppAbility>[]) => createMongoAbility(rules);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];
    const request = context.switchToHttp().getRequest();
    // const userToken = request.cookie[this.config.get('BEARER_AUTH_KEY') || ''];

    try {
      // TODO Delete after creating AuthGuard
      const tempUser = (
        await this.dataSource
          .getRepository(User)
          .find({ where: { email: 'asd2@asd.asd' }, relations: { role: true } })
      )[0];
      const user: RequestUser = request.user || tempUser;
      const permissionsRepository = this.dataSource.manager.getRepository(PermissionEntity);
      const userPermissions = await permissionsRepository.find({
        select: ['id', 'scope', 'subject', 'action', 'conditions'],
        where: {
          role: { id: user.role.id },
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
      console.log('--->>> error', error);
      throw error;
    }
  }
}
