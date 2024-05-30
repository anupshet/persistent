// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { DuplicateNodeRequest } from './duplicate-node-request.model';

export class DuplicateControlRequest extends DuplicateNodeRequest {
  targetProductMasterLotId: number;
  parentNodes: Array<NodeInfo> = new Array();
}

export class DuplicateInstrumentRequest extends DuplicateNodeRequest {
  parentNodes: Array<NodeInfo> = new Array();
  locationId?: string;
}

export class NodeInfo {
  parentNodeId: string;
  displayName: string;
  targetEntityCustomName?: string;
}

export interface NewCopyNode {
  nodeIds: Array<string>;
  parentEntityId: string;
}
