import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUserManagement from '../reducers/user-management.reducer';

export const usersStateIdentifier = 'Users';

const getUserManagementFeatureState = createFeatureSelector<fromUserManagement.UsersState>(usersStateIdentifier);

export const getUserManagementState = createSelector(
  getUserManagementFeatureState,
  state => state
);
