import { Action, Scope, Subject } from '../../../common/roles/constants';

export const permissions = [
  {
    roleIndex: 0,
    action: Action.Manage,
    scope: Scope.ALL,
    subject: Subject.ALL,
  },
  {
    roleIndex: 1,
    action: Action.Read,
    scope: Scope.ALL,
    subject: Subject.USER,
  },
  {
    roleIndex: 1,
    action: Action.Manage,
    scope: Scope.SELF,
    subject: Subject.PROJECT,
  },
];
