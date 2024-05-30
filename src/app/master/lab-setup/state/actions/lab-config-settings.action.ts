import { createAction, props, union } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { Settings, SettingsParameter } from '../../../../contracts/models/lab-setup/settings.model';

export const getSettings = createAction(
  '[Navigation] Get the settings item from Spc Rules',
  props<{ settingsParameter: SettingsParameter }>()
);

export const getSettingsSuccess = createAction(
  '[Navigation] Get the settings item from Spc Rules success',
  props<{ settings: Settings }>()
);

export const getSettingsFailure = createAction(
  '[Navigation] Get the settings item from Spc Rules failure',
  props<{ error: Error }>()
);

export const setSettings = createAction(
  '[Navigation] Set the settings item from Spc Rules',
  props<{ settings: Settings}>()
);

export const setSettingsSuccess = createAction(
  '[Navigation] Set the settings item from Spc Rules success',
  props<{ settings: Settings}>()
);

export const setSettingsFailure = createAction(
  '[Navigation] Set the settings item from Spc Rules failure',
  props<{ error: Error}>()
);

const labConfigSettingsActions = union({
  getSettings,
  getSettingsSuccess,
  getSettingsFailure,
  setSettings,
  setSettingsSuccess,
  setSettingsFailure,
});

export type LabConfigSettingsActionsUnion = typeof labConfigSettingsActions;
