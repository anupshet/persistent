// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ActionReducerMap } from '@ngrx/store';

import * as fromDataReview from './reducers/data-review.reducer';

export interface DataReviewStates {
  dataReview: fromDataReview.DataReviewState;
}

export const reducers: ActionReducerMap<DataReviewStates> = {
  dataReview: fromDataReview.reducer
};

export const RouterStateIdentifier = 'router';
export const DataReviewStateIdentifier = 'DataReview';
