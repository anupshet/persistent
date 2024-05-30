// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Codes } from './connectivity-map-tree.model';

export class Chip {
  documentId: string;
  entityId: string;
  parentId: string;
  levelId: string;
  lotLevel?: number;
  code: string;
  disabled: boolean;
  id?: string;
  parsingJobConfigId?: string;
  reagentLotCodes: Array<Codes>;
  calibratorLotCodes: Array<Codes>;
}
