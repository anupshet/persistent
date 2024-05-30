// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AppNavigationTracking } from '../../../shared/models/audit-tracking.model';
import { OperationType } from '../../enums/lab-setup/operation-type.enum';
import { DuplicateNodeRequest } from '../lab-setup/duplicate-node-request.model';

export class DuplicateControlRequest extends DuplicateNodeRequest {
  parentNodes: Array<NodeInfo> = new Array();
}

export class NodeInfo {
  parentNodeId: string;
  displayName: string;
}

export class StartNewBrLotRequest {
  operationType: OperationType;
  sourceNodeId: string;
  control: StartNewLotControl;
  instruments: string[];
}

export class PayLoadWithAuditData<T> {
  audit: AppNavigationTracking;
  data: T;
}

export class StartNewLotControl {
  id: number;
  name?: string;
  accountId: string;
  lots: StartNewMasterLot[];
}

export class StartNewMasterLot {
  productId: number;
  productName?: string;
  lotNumber: string;
  expirationDate: Date;
  retainFixedCV: boolean;
}
