import { createAction, props, union } from '@ngrx/store';

import { Level } from '../../../../contracts/models/data-management/runs-result.model';
import { DataManagementInfo } from '../../../../contracts/models/data-management/data-management-info.model';

export const UpdatePopupInfo = createAction(
  '[Data Management] Update Popup Info',
  props<{ payload: Level }>()
);

export const UpdateDataManagementInfo = createAction(
  '[Data Management] Update Data Management Info',
  props<{ payload: DataManagementInfo }>()
);

export const ResetDataManagementInfo = createAction(
  '[Data Management] Reset Data Management Info'
);

export const UpdateLevelsInUse = createAction(
  '[Data Management] Update Levels in use',
  props<{ payload: Array<number> }>()
);

export const UpdateDecimalPlaces = createAction(
  '[Data Management] Update Decimal Places',
  props<{ payload: Array<number> }>()
);

export const SetDataEntryMode = createAction(
  '[Data Management] Set data entry mode',
  props<{ dataEntryMode: boolean }>()
);

const DataManagementActions = union({
  UpdatePopupInfo,
  UpdateDataManagementInfo,
  ResetDataManagementInfo,
  UpdateLevelsInUse,
  UpdateDecimalPlaces,
  SetDataEntryMode
});

export type DataManagementActionsUnion = typeof DataManagementActions;
