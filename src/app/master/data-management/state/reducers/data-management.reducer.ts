import { createReducer, on } from '@ngrx/store';

import { dataManagementActions } from '../actions';
import { Level } from '../../../../contracts/models/data-management/runs-result.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { Header } from '../../../../contracts/models/data-management/header.model';
import { AnalyteInfo } from '../../../../contracts/models/data-management/entity-info.model';

export interface DataManagementState {
  dataPointPopup: Level;
  entityId: string;
  entityType: EntityType;
  entityName: string;
  productMasterLotId: string;
  controlLotIds: Array<number>;
  levelsInUse: Array<number>;
  decimalPlaces: Array<number>;
  headerData: Header;
  cumulativeAnalyteInfo: Array<AnalyteInfo>;
  displayName: string;
  dataEntryMode?: boolean;
}

const initialState: DataManagementState = {
  dataPointPopup: null,
  entityId: null,
  entityType: null,
  entityName: null,
  productMasterLotId: null,
  controlLotIds: null,
  levelsInUse: null,
  decimalPlaces: null,
  headerData: null,
  cumulativeAnalyteInfo: null,
  displayName: null
};

export const reducer = createReducer(
  initialState,
  on(dataManagementActions.UpdateDataManagementInfo, (state, { payload }) => ({
    ...state,
    ...payload
  })),
  on(dataManagementActions.UpdatePopupInfo, (state, { payload }) => ({
    ...state,
    dataPointPopup: payload
  })),
  on(dataManagementActions.ResetDataManagementInfo, state => ({
    ...state,
    ...initialState
  })),
  on(dataManagementActions.UpdateLevelsInUse, (state, { payload }) => ({
    ...state,
    levelsInUse: payload
  })),
  on(dataManagementActions.UpdateDecimalPlaces, (state, { payload }) => ({
    ...state,
    decimalPlaces: payload
  })),
  on(dataManagementActions.SetDataEntryMode, (state, { dataEntryMode }) => ({
    ...state,
    dataEntryMode: dataEntryMode
  }))
);
