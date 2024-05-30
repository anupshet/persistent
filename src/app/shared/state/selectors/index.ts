// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromLocation from '../reducers/location.reducers';
import * as fromAccount from '../reducers/account.reducers';
import * as fromUIConfig from '../reducers/ui-config.reducer';
import * as fromAuth from '../reducers/auth.reducer';
import * as fromUserPreference from '../reducers/userPreference.reducer';
import * as fromNodeInfo from '../reducers/node-info.reducer';
import * as fromLabConfigDuplicateLotsState from '../reducers/lab-config-duplicate-lots.reducer';

// -------------------------Identifier  for different navigation states ----------------------------
export const LocationStateIdentifier = 'location';
export const AccountStateIdentifier = 'account';
export const UIConfigStateIdentifier = 'uiConfigState';
export const authStateIdentifier = 'auth';
export const userPreferenceStateIdentifier = 'userPreference';
export const nodeInfoStateIdentifier = 'nodeInfoState';
export const labConfigDuplicateLotsIdentifier = 'labConfigDuplicateLots';

// -------------------------Feature selectors for getting different navigation states ----------------------------
export const getLocationState = createFeatureSelector<fromLocation.LocationState>(LocationStateIdentifier);
export const getAccountState = createFeatureSelector<fromAccount.AccountState>(AccountStateIdentifier);
const getUIConfigFeatureState = createFeatureSelector<fromUIConfig.UIConfigState>(UIConfigStateIdentifier);
const authState = createFeatureSelector<fromAuth.AuthState>(authStateIdentifier);
const userPreferenceState = createFeatureSelector<fromUserPreference.UserPreferenceState>(userPreferenceStateIdentifier);
const nodeInfoState = createFeatureSelector<fromNodeInfo.NodeInfoState>(nodeInfoStateIdentifier);
export const getDuplicateLotsState =
  createFeatureSelector<fromLabConfigDuplicateLotsState.LabConfigDuplicateLotsState>(labConfigDuplicateLotsIdentifier);

  export const defineNBrLotState =
  createFeatureSelector<fromLabConfigDuplicateLotsState.NBrLotState>(labConfigDuplicateLotsIdentifier);

// -------------------------------Selectors for getting different properties from states ----------------------------
export const getCurrentLabLocation = createSelector(getLocationState, (state) => state ? state.currentLabLocation : null);
export const getCurrentLabLocationContact = createSelector(getLocationState, (state) => state ? state.currentLabLocationContact : null);
export const getCurrentAccount = createSelector(getAccountState, (state) => state ? state.currentAccountSummary : null);
export const getNodeInfoState = createSelector(nodeInfoState, (state) => state ? state.currentNodeInfo : null);
export const getAnalyticalSectionState = createSelector(
  getUIConfigFeatureState,
  state => state.dataManagementUI.isAnalyticalSectionVisible
);

export const getTabOrderState = createSelector(
  getUIConfigFeatureState,
  state => state.dataManagementUI.isTabOrderRunEntry
);

export const getViewReportState = createSelector(
  getUIConfigFeatureState,
  state => state.dataManagementUI.isViewReport
);


export const getViewRepotState = createSelector(
  getUIConfigFeatureState,
  state => state.dataManagementUI.isViewReport
);

export const getAuthState = createSelector(
  authState,
  state => state
);

export const getUserLoginStatus = createSelector(
  authState,
  state => state.isLoggedIn
);

export const getCurrentUser = createSelector(
  authState,
  state => state.currentUser
);

export const getDirectory = createSelector(
  authState,
  state => state.directory
);

export const getUserPreferenceState = createSelector(
  userPreferenceState,
  state => state
);

export const getAncestors = createSelector(
  nodeInfoState,
  (state) => state?.ancestors
  );

export const getDuplicateLotsStateError = createSelector(getDuplicateLotsState, (state) => {
  if (state) {
    return state.error;
  }
});

export const getDuplicateLotsIds = createSelector(getDuplicateLotsState, (state) => {
  if (state) {
    return state.nodeIds;
  }
});

export const defineNBrlot = createSelector(defineNBrLotState, (state) => {
  if (state) {
    return state.nodeIds;
  }
});

export const defineNBrlotError = createSelector(defineNBrLotState, (state) => {
  if (state) {
    return state.error;
  }
});
