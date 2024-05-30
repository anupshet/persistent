// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CalibratorLot, ReagentLot } from 'br-component-library';

export enum LevelLoadRequest {
  None = 0,
  LoadChildren = 1,
  LoadAllDescendants = 2,
  LoadUpToGrandchildren = 3,
  LoadUpToDepartment = 4
}

export enum LicenseType {
  Base = 0,
  Premium = 1,
  Enterprise = 2
}

export enum LicensedProductType {
  None = 0,
  Connectivity = 1,
  MissionControl = 2,
  Eqas = 3,
  LotViewer = 4,
}

export enum ConnectivityOption {
  None = 0,
  Delimited = 1
}

export class LicensedProduct {
  product: LicensedProductType;
  fileOption: ConnectivityOption;
}

export class Instrument {
  id: number;
  name: string;
  manufacturerId: string;
  manufacturerName: string;
}

export class Product {
  id: number;
  name: string;
  manufacturerId: string;
  manufacturerName: string;
  matrixId: number;
  matrixName: string;
}

export class ProductMasterLot {
  id: number;
  productId: number;
  productName: string;
  lotNumber: string;
  expirationDate: Date;
  lotWithExpirationDate?: string;
}

export class TestSpec {
  id: number;
  testId: number;
  analyteStorageUnitId: number;
  analyteId: number;
  methodId: number;
  instrumentId: number;
  reagentId: number;
  reagentLot: ReagentLot;
  reagentLotId: number;
  calibratorId: number;
  calibratorLotId: number;
  calibratorLot: CalibratorLot;
  storageUnitId: number;

  analyteName: string;
  methodName: string;
  instrumentName: string;
  reagentManufacturerName: string;
  reagentManufacturerId?: string;
  calibratorManufacturerName: string;
  calibratorManufacturerId?: string;
  reagentName: string;
  calibratorName: string;
  storageUnitName: string;

  reagentLotNumber?: string;
  calibratorLotNumber?: string;
}

export class QCProductLot {
  id: string;
  productMasterLotId: string;
  productId: string;
  productMasterLotNumber: string;
  lotNumber: string;
  level: number;
  levelDescription: string;
}
