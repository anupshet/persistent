// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class ProductMap {
  code: string;
  lotNumber: string;
  lotLevel: number;
  entityId: string;
  entityDetails: Array<CodeProductIDs>
}

export class CodeProductIDs {
  documentId: string;
}
