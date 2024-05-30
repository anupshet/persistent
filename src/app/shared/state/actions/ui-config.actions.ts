import { createAction, union, props } from '@ngrx/store';

export const UpdateAnalyticalSectionState = createAction(
  '[Shared] [UIConfig] Update Analytical Section State',
  props<{ isAnalyticalSectionVisible: boolean }>()
);

export const UpdateTabOrderState = createAction(
  '[Shared] [UIConfig] Clear Has Instructions',
  props<{ UpdateTabOrderState: boolean }>()
);

export const UpdateViewReportState = createAction(
  '[Shared] [UIConfig] Clear Has Instructions',
  props<{ UpdateViewReportState: boolean }>()
);

const UIConfigActions = union({
  UpdateAnalyticalSectionState,
  UpdateTabOrderState,
  UpdateViewReportState
});

export type UIConfigActionsUnion = typeof UIConfigActions;
