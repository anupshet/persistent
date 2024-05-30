import { createReducer, on } from '@ngrx/store';

import { UIConfigActions } from '../actions';

export interface UIConfigState {
  dataManagementUI: DataManagementUIConfig;
}

export interface DataManagementUIConfig {
  isAnalyticalSectionVisible: boolean;
  isTabOrderRunEntry: boolean;
  isViewReport: boolean;
}

const UIConfigInitialState: UIConfigState = {
  dataManagementUI: {
    isAnalyticalSectionVisible: true,
    isTabOrderRunEntry: true,
    isViewReport: false
  }
};

export const reducer = createReducer(
  UIConfigInitialState,
  on(UIConfigActions.UpdateAnalyticalSectionState, (state, { isAnalyticalSectionVisible }) => ({
    ...state,
    dataManagementUI: { ...state.dataManagementUI, isAnalyticalSectionVisible: isAnalyticalSectionVisible }
  })),

  on(UIConfigActions.UpdateTabOrderState, (state, { UpdateTabOrderState }) => ({
    ...state,
    dataManagementUI: { ...state.dataManagementUI, tabOrderNewState: UpdateTabOrderState }
  })),

  on(UIConfigActions.UpdateViewReportState, (state, { UpdateViewReportState }) => ({
    ...state,
    dataManagementUI: { ...state.dataManagementUI, isViewReport: UpdateViewReportState }
  }))
);
