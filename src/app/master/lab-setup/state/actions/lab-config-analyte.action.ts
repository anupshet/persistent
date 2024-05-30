import { createAction, props, union } from '@ngrx/store';

import { LabTest } from '../../../../contracts/models/lab-setup/test.model';
import { Error } from '../../../../contracts/models/shared/error.model';
import { Analyte } from '../../../../contracts/models/lab-setup/analyte.model';
import { AnalyteConfig, AnalyteSettingsValues } from '../../../../contracts/models/lab-setup/settings.model';

// TODO: Note: Test & Analyte(a newly suggested name) have been used interchangeably. 'Analyte' is preferred.
export const saveAnalyte = createAction(
  '[Lab Setup] Save Analyte',
  // props<{ labAnalytes: LabTest[], settings: Settings }>()
  props<{ analyteConfigEmitter: AnalyteConfig, generateAnalyteFailATpayload: AnalyteSettingsValues }>()
);

export const saveAnalyteSuccess = createAction(
  '[Lab Setup] Save Analyte Success',
  props<{ labAnalytes: LabTest[] }>()
);

export const saveAnalyteFailure = createAction(
  '[Lab Setup] Save Analyte Failure',
  props<{ error: Error }>()
);

export const loadAnalyteList = createAction(
  '[Lab Setup] Load Analyte List',
  props<{ productMasterLotId: number, instrumentId: number }>()
);

export const loadAnalyteListSuccess = createAction(
  '[Lab Setup] Load Analyte List Success',
  props<{ analytes: Analyte[] }>()
);

export const loadAnalyteListFailure = createAction(
  '[Lab Setup] Load Analyte List Failure',
  props<{ error: Error }>()
);

export const deleteAnalyte = createAction(
  '[Lab Setup] Delete Analyte',
  props<{ analyte: LabTest }>()
);

export const deleteAnalyteSuccess = createAction(
  '[Lab Setup] Delete Analyte Success',
  props<{ analyte: LabTest }>()
);

export const deleteAnalyteFailure = createAction(
  '[Lab Setup] Delete Analyte Failure',
  props<{ error: Error }>()
);

export const clearError = createAction(
  '[Lab Setup] Clear Analyte Error',
  props<{ clearError: boolean }>()
);

const labConfigAnalyteActions = union({
  saveAnalyte,
  saveAnalyteSuccess,
  saveAnalyteFailure,
  loadAnalyteList,
  loadAnalyteListSuccess,
  loadAnalyteListFailure,
  deleteAnalyte,
  deleteAnalyteSuccess,
  deleteAnalyteFailure,
  clearError
});

export type LabConfigAnalyteActionsUnion = typeof labConfigAnalyteActions;
