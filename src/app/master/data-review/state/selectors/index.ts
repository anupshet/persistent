// 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromDataReview from '../reducers/data-review.reducer';

export const dataReviewStateIdentifier = 'DataReview';

export const getDataReviewFeatureState = createFeatureSelector<fromDataReview.DataReviewState>(dataReviewStateIdentifier);

export interface DateReviewStates {
  DataReviewState: fromDataReview.DataReviewState
}

export const getDataReviewState = createSelector(
  getDataReviewFeatureState, state => state
);
