import { EntityType } from '../../enums/entity-type.enum';
import { OperationType } from '../../enums/lab-setup/operation-type.enum';

export class DuplicateNodeRequest {
  nodeType: EntityType;
  sourceNodeId: string;
  targetProductMasterLotId?: number;
  operationType: OperationType;
  retainFixedCV: boolean;
}
