// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as State from '..';
import { DefineCustomControlsState } from '../reducers/define-custom-controls.reducer';

export const getControlState = createFeatureSelector<DefineCustomControlsState>(State.DefineCustomControlsStateIdentifier);

export const getDefineCustomControls = createSelector(getControlState, (state) => {
  if (state) {
    return state.controls;
  }
});
export const getDefineCustomControlsError = createSelector(getControlState, (state) => {
  if (state) {
    return state.error;
  }
});