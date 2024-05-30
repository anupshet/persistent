import { createAction, props, union } from '@ngrx/store';

import { LabLocation } from '../../../contracts/models/lab-setup';
import { LabLocationContact } from '../../../contracts/models/lab-setup';

export const clearCurrentLabLocation = createAction(
  '[Shared] [Location] Clear Current Lab Location'
);

export const clearCurrentLabLocationContact = createAction(
  '[Shared] [Location] Clear Current Lab Location Contact'
);

export const setCurrentLabLocation = createAction(
  '[Shared] [Location] Set Current Lab Location',
  props<{ currentLabLocation: LabLocation }>()
);

export const setCurrentLabLocationContact = createAction(
  '[Shared] [Location] Set Current Lab Location Contact',
  props<{ currentLabLocationContact: LabLocationContact }>()
);

const locationActions = union({
  clearCurrentLabLocation,
  clearCurrentLabLocationContact,
  setCurrentLabLocation,
  setCurrentLabLocationContact
});

export type LocationActionsUnion = typeof locationActions;
