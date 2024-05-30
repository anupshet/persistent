/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { createReducer, on } from '@ngrx/store';

import { connectivityActions } from '../actions';
import { ImportStatuses } from '../../shared/models/connectivity-status.model';
import { ParsingInfo } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';

export interface ConnectivityInitialState {
  hasInstructions: boolean;
  importStatusList: ImportStatuses;
  importStatusDetails: ImportStatuses;
  error: Error;
  configurationList: ParsingInfo;
}

const initialState: ConnectivityInitialState = {
  hasInstructions: false,
  importStatusList: null,
  importStatusDetails: null,
  error: null,
  configurationList: null
};

export const reducer = createReducer(
  initialState,
  on(connectivityActions.ClearHasInstructions, (state, { payload }) => ({
    ...state,
    hasInstructions: payload
  })),

  on(connectivityActions.SetHasInstructions, (state, { payload }) => ({
    ...state,
    hasInstructions: payload
  })),

  on(connectivityActions.setConfigurationList, (state, { configurationList }) => ({
    ...state,
    configurationList: configurationList
  })),

  on(connectivityActions.getImportStatusList, state => ({
    ...state,
    error: null
  })),

  on(connectivityActions.getImportStatusListSuccess, (state, { importStatusList }) => ({
    ...state,
    error: null,
    importStatusList: importStatusList,
    importStatusDetails: null
  })),

  on(connectivityActions.getImportStatusListFailure, (state, { error }) => ({
    ...state,
    error: error,
    importStatusList: null
  })),

  on(connectivityActions.getImportStatusDetails, state => ({
    ...state,
    error: null
  })),

  on(connectivityActions.getImportStatusDetailsSuccess, (state, { importStatusDetails }) => ({
    ...state,
    error: null,
    importStatusDetails: importStatusDetails,
    importStatusList: null
  })),

  on(connectivityActions.getImportStatusDetailsFailure, (state, { error }) => ({
    ...state,
    error: error,
    importStatusDetails: null
  })),
);
