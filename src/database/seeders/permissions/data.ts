import { Action, Roles, Scope, Subject } from '../../../common/roles/constants';

export const permissions = [
  {
    roleName: Roles.ADMIN,
    action: Action.MANAGE,
    scope: Scope.ALL,
    subject: Subject.ALL,
  },
  {
    roleName: Roles.USER,
    action: Action.READ,
    scope: Scope.ALL,
    subject: Subject.USER,
  },
  {
    roleName: Roles.USER,
    action: Action.MANAGE,
    scope: Scope.SELF,
    subject: Subject.PROJECT,
  },
];
