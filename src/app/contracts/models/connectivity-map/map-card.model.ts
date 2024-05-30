// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CalibratorLot } from '../lab-setup/calibrator-lot.model';
import { ReagentLot } from '../lab-setup/reagent-lot.model';
import { Codes } from './connectivity-map-tree.model';

export interface Card {
  codes: Array<Code>;
}

export class InstrumentCard implements Card {
  locationName: string;
  locationId: string;
  departmentName: string;
  departmentId: string;

  instrumentModelName: string;
  instrumentId: string;
  instrumentAlias: string;

  codes: Array<Code>;
  badgeCount: number;
}

export class ProductCard {
  locationId: string;
  departmentId: string;
  instrumentId: string;
  productId: string;
  productName: string;
  productMasterLotNumber: string;
  controlLotLevelIds: Array<string>;
  levels: Array<number>;

  productLevels: Array<ProductLevel>;
  badgeCount: number;
}

export class ProductLevel {
  codes: Array<Code>;
  controlLotLevelId: string;
  level: number;
}

export class TestCard implements Card {
  locationId: string;
  departmentId: string;
  instrumentId: string;
  productId: string;
  labTestId: string;
  codeListTestId: string;
  analyteName: string;
  calibratorLots: Array<CalibratorLot>;
  reagentLots: Array<ReagentLot>;
  linkedCalibratorLotCodes: Array<Codes>;
  linkedReagentLotCodes: Array<Codes>;

  codes: Array<Code>;
  methodName: string;
}

export class Code {
  code: string;
  documentId: string;
}
