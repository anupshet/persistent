/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { createAction, union, props } from '@ngrx/store';

import { ImportStatuses, ImportStatusParam } from '../../shared/models/connectivity-status.model';
import { ParsingInfo } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';

export const SetHasInstructions = createAction(
  '[Connectivity] Set Has Instructions',
  props<{ payload: true }>()
);

export const ClearHasInstructions = createAction(
  '[Connectivity] Clear Has Instructions',
  props<{ payload: false }>()
);

export const getImportStatusList = createAction(
  '[Connectivity] Get Import status list',
  props<{ accountId: string }>()
);

export const getImportStatusListSuccess = createAction(
  '[Connectivity] Get Import status list success',
  props<{ importStatusList: ImportStatuses }>()
);

export const getImportStatusListFailure = createAction(
  '[Connectivity] Get Import status list failure',
  props<{ error: Error }>()
);

export const getImportStatusDetails = createAction(
  '[Connectivity] Get Import status details',
  props<{ importStatusParam: ImportStatusParam }>()
);

export const getImportStatusDetailsSuccess = createAction(
  '[Connectivity] Get Import status details success',
  props<{ importStatusDetails: ImportStatuses }>()
);

export const getImportStatusDetailsFailure = createAction(
  '[Connectivity] Get Import status details failure',
  props<{ error: Error }>()
);

export const setPreviousUrl = createAction(
  '[Connectivity] Set Previous URL',
  props<{ url: string }>()
);

export const setConfigurationList = createAction(
  '[Connectivity] Get Import status details failure',
  props<{ configurationList: ParsingInfo }>()
);

const connectivityActions = union({
  SetHasInstructions,
  setPreviousUrl,
  ClearHasInstructions,
  getImportStatusList,
  getImportStatusListSuccess,
  getImportStatusListFailure,
  getImportStatusDetails,
  getImportStatusDetailsSuccess,
  getImportStatusDetailsFailure,
  setConfigurationList
});

export type connectivityActionsUnion = typeof connectivityActions;
