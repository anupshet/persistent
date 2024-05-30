import { createReducer, on } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { NewInstrumentConfig } from '../../models/new-instrument-config.model';
import { RequestInstrumentConfigActions } from '../actions';

export interface RequestNewInstrumenttrolState {
  newInstrumentConfig: NewInstrumentConfig;
  error: Error;
}

export const requestNewInstrumenttrolState: RequestNewInstrumenttrolState = {
  newInstrumentConfig: null,
  error: null
};

export const reducer = createReducer(
  requestNewInstrumenttrolState,
  on(RequestInstrumentConfigActions.requestInstrumentConfigurationSuccess, (state, { instrumentConfig }) => ({
    ...state,
    error: null,
    newInstrumentConfig: instrumentConfig
  })),

  on(RequestInstrumentConfigActions.requestInstrumentConfigurationFailure, (state, { error }) => ({
    ...state,
    error: error,
    newInstrumentConfig: null
  })),
);
