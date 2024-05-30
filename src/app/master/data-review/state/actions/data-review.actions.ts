// 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { createAction, props, union } from '@ngrx/store';

import { DataReviewInfo } from '../../../../contracts/models/data-review/data-review-info.model';


export const UpdateDataReviewInfo = createAction(
  '[Data Review] Update Data Review Info',
  props<{ payload: DataReviewInfo }>()
);

export const ResetDataReviewInfo = createAction(
  '[Data Review] Reset Data Review Info'
);

const DataReviewActions = union({
  UpdateDataReviewInfo,
  ResetDataReviewInfo
});

export type DataReviewActionsUnion = typeof DataReviewActions;
