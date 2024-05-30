// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createAction, props, union } from "@ngrx/store";

import { CustomControlRequest } from "../../../../contracts/models/control-management/custom-control-request.model";

export const addCustomControl = createAction(
  'Add Custom Control',
  props<{ product: CustomControlRequest[] }>()
);

export const addCustomControlSuccess = createAction(
  'Add Custom Control Success',
  props<{ }>()
);

export const addCustomControlFailure = createAction(
  'Add Custom Control Failure',
  props<{ error: Error  }>()
);

const defineCustomControlsActions = union({
  addCustomControl,
  addCustomControlSuccess,
  addCustomControlFailure
});

export type DefineCustomControlsActionsUnion = typeof defineCustomControlsActions;
