import { createReducer, on } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { LabConfigLocationActions } from '../actions';
import { LabLocation } from '../../../../contracts/models/lab-setup/lab-location.model';

export interface LabConfigLocationState {
  labLocation: LabLocation;
  error: Error;
}

export const labConfigLocationInitialState: LabConfigLocationState = {
  labLocation: null,
  error: null
};


export const reducer = createReducer(
  labConfigLocationInitialState,
  on(LabConfigLocationActions.returnToLabDefaults, (state, { lablocation }) => ({
    ...state,
    labLocation: lablocation
  })),

  on(LabConfigLocationActions.saveLabLocationSuccess, (state, { lablocation }) => ({
    ...state,
    error: null,
    labLocation: lablocation
  })),

  on(LabConfigLocationActions.saveLabLocationFailure, (state, { error }) => ({
    ...state,
    error: error,
    labLocation: null
  }))
);
