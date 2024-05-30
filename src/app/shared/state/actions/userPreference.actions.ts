import { createAction, props, union } from '@ngrx/store';

import { UserPreference } from '../../../contracts/models/portal-api/portal-data.model';

export const GetUserPreference = createAction(
  '[Shared] [UserPreference] Get user Preference',
  props<{ payload: UserPreference }>()
);

export const UpdateUserPreference = createAction(
  '[Shared] [UserPreference] Upadate User Preference',
  props<{ payload: UserPreference }>()
);

export const UpdateIsLoading = createAction(
  '[Shared] [UserPreference] Update Is Loading',
  props<{ payload: boolean }>()
);

const UserPreferenceActions = union({
  GetUserPreference,
  UpdateUserPreference,
  UpdateIsLoading
});

export type UserPreferenceActionsUnion = typeof UserPreferenceActions;
