// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ActionableItemType } from './actionableItem.model';

export class ExpiredLots {
  labInstrumentId: string;
  labProductId: string;
  productId: number;
  productName: string;
  lotNumber: string;
  productMasterLotId: number;
  expirationDate: Date;
  isExpired: boolean;
  productCustomName: string;
  actionableType?: ActionableItemType;
  manufacturerId?: string;
}
