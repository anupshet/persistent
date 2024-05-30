/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromDataManagement from '../reducers/data-management.reducer';

export const dataManagementStateIdentifier = 'DataManagement';

export const getDataManagementFeatureState = createFeatureSelector<fromDataManagement.DataManagementState>(dataManagementStateIdentifier);

export const getDataManagementState = createSelector(
  getDataManagementFeatureState, state => state
);

export const getDataPointPopup = createSelector(
  getDataManagementFeatureState,
  state => state.dataPointPopup
);

export const getDataEntryMode = createSelector(getDataManagementFeatureState, state => state && state.dataEntryMode ? state.dataEntryMode: false);
