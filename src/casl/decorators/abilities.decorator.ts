import { SetMetadata } from '@nestjs/common';

import type { Action, Conditions, Scope, Subject } from '../../common/roles/constants';

export const CHECK_ABILITY = Symbol('CHECK_ABILITY');

export type RequiredRule = {
  action?: Action;
  subject?: Subject;
  scope?: Scope;
  conditions?: Conditions;
};

export const Abilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
