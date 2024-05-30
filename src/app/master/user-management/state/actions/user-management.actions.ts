import { createAction, props, union } from '@ngrx/store';

import { User } from '../../../../contracts/models/user-management/user.model';

export const GetUsers = createAction(
  '[Users] Get Users',
  props<{ payload: User[] }>()
);

export const AddUsers = createAction(
  '[Users] Add Users',
  props<{ payload: User }>()
);

export const UpdateUsers = createAction(
  '[Users] Update Users',
  props<{ payload: User }>()
);

export const DeleteUsers = createAction(
  '[Users] Delete Users',
  props<{ payload: User }>()
);

export const ClearUsersState = createAction(
  '[Users] Clear User State'
);

const UserManagementActions = union({
  GetUsers,
  AddUsers,
  UpdateUsers,
  DeleteUsers,
  ClearUsersState
});

export type UserManagementActionsUnion = typeof UserManagementActions;
