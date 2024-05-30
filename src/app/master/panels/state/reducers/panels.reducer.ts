import { createReducer, on } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { PanelActions } from '../actions';
import { Panel } from '../../../../contracts/models/panel/panel.model';

export interface PanelInitialState {
  panels: Array<Panel>;
  error: Error;
}

export const initialState: PanelInitialState = {
  panels: null,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(PanelActions.addPanel, (state, { panels }) => ({
    ...state,
    panels: panels
  })),

  on(PanelActions.addPanelSuccess, (state) => ({
    ...state,
    error: null
  })),

  on(PanelActions.addPanelFailure, (state, { error }) => ({
    ...state,
    error: error,
    panels: null
  })),

  on(PanelActions.updatePanel, (state, { panels }) => ({
    ...state,
    panels: panels
  })),

  on(PanelActions.updatePanelSuccess, (state) => ({
    ...state,
    error: null
  })),

  on(PanelActions.updatePanelFailure, (state, { error }) => ({
    ...state,
    error: error,
    panels: null
  })),

  on(PanelActions.deletePanelSuccess, (state) => ({
    ...state,
    error: null,
    deletePanel: true,
  })),

  on(PanelActions.deletePanelFailure, (state, { error }) => ({
    ...state,
    error: error,
    deletePanel: false,
  })),
);
