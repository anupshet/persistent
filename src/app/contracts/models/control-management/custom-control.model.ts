// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CustomControlMasterLot } from '../control-management/custom-control-master-lot.model'

export class CustomControl{
  id: number;
  name: string;
  manufacturerId: string;
  manufacturerName: string;
  matrixId: number;
  accountId: string;
  lots: CustomControlMasterLot[];
  anyLabLotTests: boolean;
}
