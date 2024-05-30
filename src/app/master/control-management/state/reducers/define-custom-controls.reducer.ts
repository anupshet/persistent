// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createReducer, on } from '@ngrx/store';

import { DefineCustomControlsActions } from '../actions';
import { Error } from '../../../../contracts/models/shared/error.model';
import { CustomControl } from '../../../../contracts/models/control-management/custom-control.model';

export interface DefineCustomControlsState {
  error: Error;
  controls: CustomControl[];
}

export const defineCustomControlsInitialState: DefineCustomControlsState = {
  error: null,
  controls: null,
};

export const reducer = createReducer(
  defineCustomControlsInitialState,
  on(DefineCustomControlsActions.addCustomControlSuccess, (state, { }) => ({
    ...state,
    error: null
  })),

  on(DefineCustomControlsActions.addCustomControlFailure, (state, { error }) => ({
    ...state,
    error: error,
    controls: null
  })),
);
