import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromPanel from '../reducers/panels.reducer';

// -------------------------Identifier  for panels state ----------------------------
export const panelstateIdentifier = 'panel';

// -------------------------Feature selectors for getting connectivity state ----------------------------
export const getPanelState = createFeatureSelector<fromPanel.PanelInitialState>(panelstateIdentifier);

// -------------------------------Selectors for getting different properties from states ----------------------------
export const getPanelError = createSelector(getPanelState, (state) => {
  if (state) {
    return state.error;
  }
});

export const getPanel = createSelector(getPanelState, (state) => {
  if (state) {
    return state.panels;
  }
});
