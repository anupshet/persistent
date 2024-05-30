import { createReducer, on } from '@ngrx/store';

import { LabProduct } from '../../../../contracts/models/lab-setup';
import { Error } from '../../../../contracts/models/shared/error.model';
import { LabConfigControlActions } from '../actions';
import { ManufacturerProduct } from '../../../../contracts/models/lab-setup/product-list.model';

export interface LabConfigControlState {
  error: Error;
  labControls: LabProduct[];
  masterControls: ManufacturerProduct[];
  nodeIds: Array<string>;
}

export const labConfigControlInitialState: LabConfigControlState = {
  error: null,
  labControls: null,
  masterControls: null,
  nodeIds: null
};

export const reducer = createReducer(
  labConfigControlInitialState,
  on(LabConfigControlActions.loadControlListSuccess, (state, { masterControls }) => ({
    ...state,
    error: null,
    masterControls: masterControls
  })),

  on(LabConfigControlActions.loadControlListFailure, (state, { error }) => ({
    ...state,
    error: error,
    masterControls: null
  })),

  on(LabConfigControlActions.saveControlSuccess, (state, { labControls }) => ({
    ...state,
    error: null,
    labControls: labControls
  })),

  on(LabConfigControlActions.saveControlFailure, (state, { error }) => ({
    ...state,
    error: error,
    labControls: null
  })),

  on(LabConfigControlActions.deleteControlSuccess, (state) => ({
    ...state,
    error: null
  })),

  on(LabConfigControlActions.deleteControlFailure, (state, { error }) => ({
    ...state,
    error: error
  })),
);
