import { Action, Roles, Scope, Subject } from '../../../common/roles/constants';

export const permissions = [
  {
    roleName: Roles.ADMIN,
    action: Action.Manage,
    scope: Scope.ALL,
    subject: Subject.ALL,
  },
  {
    roleName: Roles.USER,
    action: Action.Read,
    scope: Scope.ALL,
    subject: Subject.USER,
  },
  {
    roleName: Roles.USER,
    action: Action.Manage,
    scope: Scope.SELF,
    subject: Subject.PROJECT,
  },
];
