import { LabInstrument } from '../../../contracts/models/lab-setup/instrument.model';

export class ActionableItem {
  productName: string;
  id: string;
  productId: string;
  actionableType: ActionableItemType;
  expirationDate: Date;
  parentInstrument: LabInstrument;
}

export enum ActionableItemType {
  Product = 0,
  Reagent = 1,
  Calibrator = 2
}

export interface SortedListItem {
  sortedExpirationDate: string;
  sortedDisplayNameItemList: any[];
}

export enum ExpiredItem {
  hasExpiringLotsFlag = 'hasExpiringLotsFlag',
  hasExpiringLicenseFlag = 'hasExpiringLicenseFlag'
}
