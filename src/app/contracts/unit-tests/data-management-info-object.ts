import { DataManagementInfo } from '../models/data-management/data-management-info.model';
import { AnalyteInfo } from '../models/data-management/entity-info.model';
import { CalibratorLot, ReagentLot } from 'br-component-library';

export class DataManagementInfoObject {
  static analyteInfo: AnalyteInfo = {
    testName: 'analyte',
    labTestId: '0',
    productMasterLotId: '123',
    productMasterLotExpiration: new Date(2019, 5, 6),
    controlLotIds: [199, 200, 201, 202],
    levelsInUse: [1, 2, 3, 4],
    decimalPlaces: [1, 2, 3, 4],
    labUnitId: 1,
    codeListTestId: 1,
    defaultCalibratorLot: new CalibratorLot(),
    defaultReagentLot: new ReagentLot(),
    instrumentId: '1',
    productId: '1',
    testId: '1',
    isSummary: false,
    correlatedTestSpecId: 'AJKAGHDKAD1873612JJHGJ123',
    testSpecId: '123'
  };

  static dataManagementInfo: DataManagementInfo = {
    entityId: '100',
    entityType: 5,
    entityName: 'Glucose',
    cumulativeAnalyteInfo: [DataManagementInfoObject.analyteInfo],
    headerData: null,
    productMasterLotId: '123',
    displayName: ''
  };
}
