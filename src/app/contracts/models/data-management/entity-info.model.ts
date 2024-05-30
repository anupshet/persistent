// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ReagentLot, CalibratorLot } from 'br-component-library';

import { Header } from './header.model';

export class EntityInfo {
  headerData: Header;
  productMasterLotId: string;
  entityName: string;
  cumulativeAnalyteInfo: Array<AnalyteInfo>;
  displayName: '';
}

export class AnalyteInfo {
  testName: string;
  labTestId: string;
  controlLotIds: Array<number>;
  levelsInUse: Array<number>;
  decimalPlaces: Array<number>;
  productMasterLotId: string;
  productMasterLotExpiration: Date;
  codeListTestId: number;
  labUnitId: number;
  defaultReagentLot: ReagentLot;
  defaultCalibratorLot: CalibratorLot;
  instrumentId: string;
  productId: string;
  testId: string;
  isSummary: boolean;
  correlatedTestSpecId: string;
  testSpecId: string | number;
  isArchived: boolean;
  sortOrder: number;
}
