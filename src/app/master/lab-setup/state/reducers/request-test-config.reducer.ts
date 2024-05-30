import { createReducer, on } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { RequestTestConfigActions } from '../actions';
import { TestConfiguration } from '../../models/test-configuration.model';

export interface RequestTestConfigState {
  testConfiguration: TestConfiguration;
  error: Error;
}

export const requestTestConfigState: RequestTestConfigState = {
  testConfiguration : null,
  error: null
};


export const reducer = createReducer(
  requestTestConfigState,
  on(RequestTestConfigActions.requestTestConfigurationSuccess, (state, { testConfig }) => ({
    ...state,
    error: null,
    testConfiguration: testConfig
  })),

  on(RequestTestConfigActions.requestTestConfigurationFailure, (state, { error }) => ({
    ...state,
    error: error,
    testConfiguration: null
  })),
);
