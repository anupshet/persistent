// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createReducer, on } from '@ngrx/store';

import { NewCopyNode } from '../../../contracts/models/lab-setup/duplicate-copy-request.model';
import { Error } from '../../../contracts/models/shared/error.model';
import { LabConfigDuplicateLotsActions } from '../actions';

export interface LabConfigDuplicateLotsState {
  error: Error;
  nodeIds: Array<string>;
  newNodeInfo: NewCopyNode;
}

// TODO: Check type during BE integration
export interface NBrLotState {
  error: Error;
  nodeIds: Array<any>;
}

export const existingNBrLotsState: NBrLotState = {
  error: null,
  nodeIds: null,
};

export const labConfigDuplicateLotsInitialState: LabConfigDuplicateLotsState = {
  error: null,
  nodeIds: null,
  newNodeInfo: null
};

export const reducer = createReducer(
  labConfigDuplicateLotsInitialState,
  on(LabConfigDuplicateLotsActions.duplicateLot, (state) => ({
    ...state,
    error: null
  })),

  on(LabConfigDuplicateLotsActions.duplicateLotSuccess, (state, { nodeIds }) => {
    return {
      ...state,
      error: null,
      nodeIds: nodeIds
    };
  }),

  on(LabConfigDuplicateLotsActions.duplicateLotFailure, (state, { error }) => ({
    ...state,
    error: error,
    nodeIds: null
  })),

  on(LabConfigDuplicateLotsActions.duplicateInstrumentRequest, (state) => ({
    ...state,
    error: null
  })),

  on(LabConfigDuplicateLotsActions.duplicateInstrumentRequestSuccess, (state, { newNodeInfo }) => {
    return {
      ...state,
      error: null,
      nodeIds: newNodeInfo.nodeIds,
      newNodeInfo
    };
  }),

  on(LabConfigDuplicateLotsActions.duplicateInstrumentRequestFailure, (state, { error }) => ({
    ...state,
    error: error,
    nodeIds: null,
    newNodeInfo: null
  })),

  on(LabConfigDuplicateLotsActions.ClearState, () => ({
    ...labConfigDuplicateLotsInitialState
  })),

  on(LabConfigDuplicateLotsActions.defineNBrLot, (state) => ({
    ...state,
    error: null
  })),

  on(LabConfigDuplicateLotsActions.defineNBrLotSuccess, (state, { nodeIds }) => {
    return {
      ...state,
      error: null,
      nodeIds: nodeIds
    };
  }),

  on(LabConfigDuplicateLotsActions.defineNBrLotFailure, (state, { error }) => ({
    ...state,
    error: error,
    nodeIds: null
  })),
);
