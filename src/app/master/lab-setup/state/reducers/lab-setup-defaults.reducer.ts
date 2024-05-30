import { createReducer, on } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { LabSetupDefaultsActions } from '../actions';
import { AccountSettings } from '../../../../contracts/models/lab-setup/account-settings.model';

export interface LabSetupDefaultsState {
  accountSettings: AccountSettings;
  showAddUserCoachMark: boolean;
  error: Error;
}

export const labConfigDefaultsInitialState: LabSetupDefaultsState = {
  accountSettings: null,
  showAddUserCoachMark: false,
  error: null
};

export const reducer = createReducer(
  labConfigDefaultsInitialState,
  on(LabSetupDefaultsActions.saveAccountSettingsSuccess, (state, { accountSettings }) => ({
    ...state,
    error: null,
    accountSettings: accountSettings
  })),

  // on(LabSetupDefaultsActions.saveAccountSettingsFailure, (state, { error }) => ({
  //   ...state,
  //   error: error,
  //   accountSettings: null
  // })),

  on(LabSetupDefaultsActions.saveAccountSettings, (state, { accountSettings }) => ({
    ...state,
    error: null,
    accountSettings: accountSettings
  }))
);
