import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromConnectivity from '../reducers/connectivity.reducer';

// -------------------------Identifier  for connectivity state ----------------------------
export const connectivityStateIdentifier = 'connectivity';

// -------------------------Feature selectors for getting connectivity state ----------------------------
export const getConnectivityFeatureState = createFeatureSelector<fromConnectivity.ConnectivityInitialState>(connectivityStateIdentifier);

// -------------------------------Selectors for getting different properties from states ----------------------------
export const getHasInstructions = createSelector(
  getConnectivityFeatureState,
  state => {
    if (state) {
      return state.hasInstructions;
    }
  }
);

export const getConfigurations = createSelector(
  getConnectivityFeatureState,
  state => {
    if (state) {
      return state.configurationList;
    }
  }
);

export const getImportStatusList = createSelector(
  getConnectivityFeatureState,
  state => {
    if (state) {
      return state.importStatusList;
    }
  }
);

export const getImportStatusDetails = createSelector(
  getConnectivityFeatureState,
  state => {
    if (state) {
      return state.importStatusDetails;
    }
  }
);
