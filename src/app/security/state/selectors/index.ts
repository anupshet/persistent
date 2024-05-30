// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSecurity from '../reducers/security.reducer';

export const securityStateIdentifier = 'security';

const getSecurityFeatureState = createFeatureSelector<fromSecurity.SecurityState>(securityStateIdentifier);

export const getSecurityState = createSelector(
  getSecurityFeatureState,
  state => state
);

export const isLoggedIn = createSelector(
  getSecurityFeatureState,
  state => state.isLoggedIn
);

// TODO: Check if the below selector is required and can be removed
export const isLabSetupCompleted = createSelector(
  getSecurityFeatureState,
  state => {
    if (state && state.directory && state.directory.accountSettings) {
      return state.directory.accountSettings.isLabSetupComplete;
    }
  }
);

export const getCurrentUser = createSelector(
  getSecurityFeatureState,
  state => {
    return state ? state.currentUser : null;
  }
);

export const getCurrentUserDisplayName = createSelector(
  getCurrentUser,
  state => {
    if (state) {
      let displayName = state.firstName + ' ' + state.lastName;
      if (displayName.length > 16) {
        displayName = displayName.toString().substring(0, 16) + '...';
      }
      return displayName;
    }
  }
);

export const getCurrentUserId = createSelector(
  getCurrentUser,
  state => state.userOktaId
);

export const getCurrentUserLabLocationId = createSelector(
  getCurrentUser,
  state => state.labLocationId
);

export const getUserRole = createSelector(
  getCurrentUser,
  state => {
    if (state) {
      return state.roles;
    }
  }
);

export const getDirectory = createSelector(
  getSecurityFeatureState,
  state => state ? state.directory : null
);
