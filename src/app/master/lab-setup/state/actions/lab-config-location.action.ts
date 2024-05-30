import { createAction, props, union } from '@ngrx/store';

import { LabLocation } from '../../../../contracts/models/lab-setup/lab-location.model';
import { Error } from '../../../../contracts/models/shared/error.model';

export const returnToLabDefaults = createAction(
  '[Lab Setup] Return To Lab Defaults',
  props<{ lablocation: LabLocation }>()
);

export const saveLabLocation = createAction(
  '[Lab Setup] Save Lab Location',
  props<{ lablocation: LabLocation }>()
);

export const saveLabLocationSuccess = createAction(
  '[Lab Setup] Save Lab Location Success',
  props<{ lablocation: LabLocation }>()
);

export const saveLabLocationFailure = createAction(
  '[Lab Setup] Save Lab Location Failure',
  props<{ error: Error }>()
);

const labConfigLocationActions = union({
  returnToLabDefaults,
  saveLabLocation,
  saveLabLocationSuccess,
  saveLabLocationFailure
});

export type LabConfigLocationActionsUnion = typeof labConfigLocationActions;
