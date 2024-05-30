import { createReducer, on } from '@ngrx/store';

import { Analyte } from '../../../../contracts/models/lab-setup/analyte.model';
import { LabTest } from '../../../../contracts/models/lab-setup/test.model';
import { Error } from '../../../../contracts/models/shared/error.model';
import { LabConfigAnalyteActions } from '../actions';

export interface LabConfigAnalyteState {
  error: Error;
  labAnalytes: LabTest[];
  analytes: Analyte[];
  deleteAnalyte: boolean;
}

export const labConfigAnalyteInitialState: LabConfigAnalyteState = {
  error: null,
  labAnalytes: null,
  analytes: null,
  deleteAnalyte: false
};

export const reducer = createReducer(
  labConfigAnalyteInitialState,
  on(LabConfigAnalyteActions.loadAnalyteListSuccess, (state, { analytes }) => ({
    ...state,
    error: null,
    analytes: analytes
  })),

  on(LabConfigAnalyteActions.loadAnalyteListFailure, (state, { error }) => ({
    ...state,
    error: error,
    analytes: null
  })),

  on(LabConfigAnalyteActions.saveAnalyteSuccess, (state, { labAnalytes }) => ({
    ...state,
    error: null,
    labAnalytes: labAnalytes
  })),

  on(LabConfigAnalyteActions.saveAnalyteFailure, (state, { error }) => ({
    ...state,
    error: error,
    labAnalytes: null
  })),

  on(LabConfigAnalyteActions.deleteAnalyteSuccess, (state) => ({
    ...state,
    error: null,
    deleteAnalyte: true
  })),

  on(LabConfigAnalyteActions.deleteAnalyteFailure, (state, { error }) => ({
    ...state,
    error: error,
    deleteAnalyte: false
  })),

  on(LabConfigAnalyteActions.clearError, (state) => ({
    ...state,
    error: null
  })),
);
