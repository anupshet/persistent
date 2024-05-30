import { createReducer, on } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { LabConfigSettingsActions } from '../actions';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';

export interface LabConfigSettingsState {
  error: Error;
  settings: Settings;
}

export const labConfigSettingsInitialState: LabConfigSettingsState = {
  error: null,
  settings: null
};

export const reducer = createReducer(
  labConfigSettingsInitialState,
  on(LabConfigSettingsActions.getSettings, (state) => ({
    ...state,
    error: null
  })),

  on(LabConfigSettingsActions.getSettingsSuccess, (state, { settings }) => ({
    ...state,
    error: null,
    settings: settings
  })),

  on(LabConfigSettingsActions.getSettingsFailure, (state, { error }) => ({
    ...state,
    error: error,
    settings: null
  })),

  on(LabConfigSettingsActions.setSettings, (state) => ({
    ...state,
    error: null
  })),

  on(LabConfigSettingsActions.setSettingsSuccess, (state, { settings }) => {
      return {
        ...state,
        error: null,
        settings: settings
      };
  }),

  on(LabConfigSettingsActions.setSettingsFailure, (state, { error }) => ({
    ...state,
    error: error,
    settings: null
  }))
);
