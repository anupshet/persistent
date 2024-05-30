// 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { createReducer, on } from '@ngrx/store';

import { dataReviewActions } from '../actions';

export interface DataReviewState {
  isSupervisorReview: boolean
}

const initialState: DataReviewState = {
  isSupervisorReview: false
};

export const reducer = createReducer(
  initialState,
  on(dataReviewActions.UpdateDataReviewInfo, (state, { payload }) => ({
    ...state,
    ...payload
  })),
  on(dataReviewActions.ResetDataReviewInfo, state => ({
    ...state,
    ...initialState
  }))
);
