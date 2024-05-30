// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createAction, props, union } from '@ngrx/store';

import { DuplicateInstrumentRequest, NewCopyNode } from '../../../contracts/models/lab-setup/duplicate-copy-request.model';
import { DuplicateControlRequest, StartNewBrLotRequest } from '../../../contracts/models/shared/duplicate-control-request.model';
import { Error } from '../../../contracts/models/shared/error.model';

export const duplicateLot = createAction(
  '[Duplicate Lots] Duplicate Lot',
  props<{ duplicateLotEmitter: DuplicateControlRequest[] }>()
);

export const duplicateLotSuccess = createAction(
  '[Duplicate Lots] Duplicate Lot Success',
  props<{ nodeIds: Array<string> }>()
);

export const duplicateLotFailure = createAction(
  '[Duplicate Lots] Duplicate Lot Failure',
  props<{ error: Error }>()
);

export const duplicateInstrumentRequest = createAction(
  '[Duplicate Lots] Duplicate Instrument Request',
  props<{ copyNodeRequest: DuplicateInstrumentRequest[] }>()
);

export const duplicateInstrumentRequestSuccess = createAction(
  '[Duplicate Lots] Duplicate Instrument Request Success',
  props<{ newNodeInfo: NewCopyNode }>()
);

export const duplicateInstrumentRequestFailure = createAction(
  '[Duplicate Lots] Duplicate Instrument Request Failure',
  props<{ error: Error }>()
);

export const ClearState = createAction(
  '[Duplicate Lots] Clear State'
);

export const defineNBrLot = createAction(
  '[Duplicate Lots] Define Non Bio-Rad Lot',
  props<{ startNewBrLotEmitter: StartNewBrLotRequest[] }>()
);

// TODO: Check type during BE integration
export const defineNBrLotSuccess = createAction(
  '[Duplicate Lots] Define existing Non Bio-Rad Lots success',
  props<{ nodeIds: Array<string> }>()
);

export const defineNBrLotFailure = createAction(
  '[Duplicate Lots] Define Non Bio-rad Lots Failure',
  props<{ error: Error }>()
);

const labConfigDuplicateLotActions = union({
  duplicateLot,
  duplicateLotSuccess,
  duplicateLotFailure,
  duplicateInstrumentRequest,
  duplicateInstrumentRequestSuccess,
  duplicateInstrumentRequestFailure,
  defineNBrLot,
  defineNBrLotSuccess,
  defineNBrLotFailure,
  ClearState
});

export type LabConfigDuplicateLotActionsUnion = typeof labConfigDuplicateLotActions;
