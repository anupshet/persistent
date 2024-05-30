// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createAction, props, union } from '@ngrx/store';

import { LabTree } from '../../../contracts/models/lab-setup/lab-tree.model';
import { AppUser } from '../../../security/model/app-user.model';
import { AuthState } from '../reducers/auth.reducer';

export const UserAuthenticationUpdate = createAction(
  '[Shared] [Auth] User Authentication Update',
  props<{ payload: AuthState }>()
);

export const UpdateLabDirectory = createAction(
  '[Shared] [Auth] Upadate Lab Directory',
  props<{ payload: LabTree }>()
);

export const RestoreUserFromToken = createAction(
  '[Shared] [Auth] Restore User From Token',
  props<{ payload: AppUser }>()
);

export const UserLoggedOut = createAction(
  '[Shared] [Auth] User Logged Out',
);

const AuthActions = union({
  UserAuthenticationUpdate,
  UpdateLabDirectory,
  RestoreUserFromToken,
  UserLoggedOut
});

export type AuthActionsUnion = typeof AuthActions;
