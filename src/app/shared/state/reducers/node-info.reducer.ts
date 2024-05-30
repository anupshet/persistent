import { createReducer, on } from '@ngrx/store';

import { NodeInfoActions } from '../actions';
import { DataManagementInfo } from '../../../contracts/models/data-management/data-management-info.model';
import { TreePill } from '../../../contracts/models/lab-setup';

export interface NodeInfoState {
  currentNodeInfo: DataManagementInfo,
  ancestors: Array<Array<TreePill>>
}

const initialState: NodeInfoState = {
  currentNodeInfo: null,
  ancestors: null
};

export const reducer = createReducer(
  initialState,
  on(NodeInfoActions.updateNodeInfo, (state, { payload }) => ({
    ...state,
    currentNodeInfo: payload
  })),

  on(NodeInfoActions.getAncestors, (state) => ({
    ...state,
    error: null
  })),

  on(NodeInfoActions.getAncestorsSuccess, (state, { ancestors }) => ({
    ...state,
    error: null,
    ancestors
  })),

  on(NodeInfoActions.getAncestorsFailure, (state, { error }) => ({
    ...state,
    error: error,
    ancestors: []
  }))
);
