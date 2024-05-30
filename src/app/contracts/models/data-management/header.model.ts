/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
export class Header {
  analyteName: string;
  instrumentName: string;
  instrumentAlias: string;
  customProductName: string;
  productName: string;
  productMasterLotNumber: string;
  reagentName: string;
  reagentLotNumber: string;
  reagentLotId: number;
  method: string;
  unit: string;
  calibrator: string;
  calibratorLotNumber: string;
  calibratorLotId: number;
  codeListTestId: number;
  labUnitId: number;
  lotExpiringDate?: Date;
}
