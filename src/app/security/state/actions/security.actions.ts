// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createAction, props, union } from '@ngrx/store';

import { AppUser } from '../../model';
import { LabTree } from '../../../contracts/models/lab-setup/lab-tree.model';
import { AuthState } from '../../../shared/state/reducers/auth.reducer';

export const UpdateLabDirectory = createAction(
  '[Security] Update Lab Directory',
  props<{ payload: LabTree }>()
);

export const UserAuthenticationUpdate = createAction(
  '[Security] User Athentication Update',
  props<{ payload: AuthState }>()
);

export const UserLoggedOut = createAction(
  '[Security] User Logged-out'
);

export const UserTokenRefreshed = createAction(
  '[Security] User Token Refreshed',
  props<{ payload: AppUser }>()
);

const SecurityActions = union({
  UpdateLabDirectory,
  UserAuthenticationUpdate,
  UserLoggedOut,
  UserTokenRefreshed
});

export type SecurityActionsUnion = typeof SecurityActions;
