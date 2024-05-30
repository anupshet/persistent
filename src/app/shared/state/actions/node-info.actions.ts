// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { createAction, props, union } from '@ngrx/store';

import { TreePill } from '../../../contracts/models/lab-setup';
import { DataManagementInfo } from '../../../contracts/models/data-management/data-management-info.model';
import { EntityType } from '../../../contracts/enums/entity-type.enum';

export const updateNodeInfo = createAction(
  '[NodeInfo] Update Node Info Details',
  props<{ payload: DataManagementInfo }>()
);

export const getAncestors = createAction(
  '[NodeInfo] Get ancestors ',
  props<{ nodeType: EntityType, analyteIds: Array<string> }>()
);

export const getAncestorsSuccess = createAction(
  '[NodeInfo] Get ancestors success',
  props<{ ancestors: Array<Array<TreePill>> }>()
);

export const getAncestorsFailure = createAction(
  '[NodeInfo] Get ancestors failure',
  props<{ error: Error }>()
);

const nodeInfoActions = union({
  updateNodeInfo,
  getAncestors,
  getAncestorsSuccess,
  getAncestorsFailure
});

export type NodeInfoActionsUnion = typeof nodeInfoActions;
