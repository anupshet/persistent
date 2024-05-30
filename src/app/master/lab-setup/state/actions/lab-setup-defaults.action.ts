import { createAction, props, union } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { AccountSettings } from '../../../../contracts/models/lab-setup/account-settings.model';

export const saveAccountSettings = createAction(
  '[Lab Setup] Save Account Settings',
  props<{ accountSettings: AccountSettings, navigate: boolean }>()
);

export const saveAccountSettingsSuccess = createAction(
  '[Lab Setup] Save Account Settings Success',
  props<{ accountSettings: AccountSettings, navigate: boolean }>()
);

export const saveAccountSettingsFailure = createAction(
  '[Lab Setup] Save Account Settings Failure',
  props<{ error: Error }>()
);

export const loadAccountSettings = createAction(
  '[Lab Setup] Load Account Settings'
);

export const loadAccountSettingsSuccess = createAction(
  '[Lab Setup] Load Account Settings Success',
  props<{ accountSettings: AccountSettings }>()
);

export const loadAccountSettingsFailure = createAction(
  '[Lab Setup] Load Account Settings Failure',
  props<{ error: Error }>()
);

export const showAddUserCoachMark = createAction(
  '[Lab Setup] Show Add User Coach Mark',
  props<{ show: boolean }>()
);

const labSetupDefaultsActions = union({
  saveAccountSettings,
  saveAccountSettingsSuccess,
  saveAccountSettingsFailure,
  loadAccountSettings,
  loadAccountSettingsSuccess,
  loadAccountSettingsFailure,
  showAddUserCoachMark
});

export type LabSetupDefaultsActionsUnion = typeof labSetupDefaultsActions;
