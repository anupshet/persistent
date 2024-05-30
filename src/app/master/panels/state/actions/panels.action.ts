import { createAction, props, union } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { DeletePanelConfig, Panel } from '../../../../contracts/models/panel/panel.model';
import { AuditTrackingSort } from '../../../../shared/models/audit-tracking.model';

export const addPanel = createAction(
  '[Panel] Add Panel',
  props<{ panels: Array<Panel>, sort?: AuditTrackingSort }>()
);

export const addPanelSuccess = createAction(
  '[Panel] Add Panel Success',
  props<{ locationId: string, sort?: AuditTrackingSort }>()
);

export const addPanelFailure = createAction(
  '[Panel] Add Panel Failure',
  props<{ error: Error }>()
);

export const updatePanel = createAction(
  '[Panel] Update Panel',
  props<{ panels: Array<Panel>, sort?: AuditTrackingSort }>()
);

export const updatePanelSuccess = createAction(
  '[Panel] Update Panel Success',
  props<{ locationId: string, sort?: AuditTrackingSort }>()
);

export const updatePanelFailure = createAction(
  '[Panel] Update Panel Failure',
  props<{ error: Error }>()
);

export const deletePanel = createAction(
  '[Panel] Delete Panel',
  props<{ deletePanelConfig: DeletePanelConfig}>()
);

export const deletePanelSuccess = createAction(
  '[Panel] Delete Panel Success',
  props<{ locationId: string }>()
);

export const deletePanelFailure = createAction(
  '[Panel] Delete Panel Failure',
  props<{ error: Error }>()
);

const panelActions = union({
  addPanel,
  addPanelSuccess,
  addPanelFailure,
  updatePanel,
  updatePanelSuccess,
  updatePanelFailure,
  deletePanel,
  deletePanelSuccess,
  deletePanelFailure
});

export type PanelActionsUnion = typeof panelActions;
