// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { EntityType } from "../../../contracts/enums/entity-type.enum";

export class SortEntity {
  entityId: string;
  sortOrder: number;

  constructor(entityId: string, sortOrder?: number) {
    this.entityId = entityId;
    this.sortOrder = sortOrder ? sortOrder : 0;
  }
}

export class SortOrder {
  parentNodeId: string;
  sortEntity: Array<SortEntity>;
  nodeType: EntityType
}
