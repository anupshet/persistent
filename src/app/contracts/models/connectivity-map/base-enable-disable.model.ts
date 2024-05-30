// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class BaseEnableDisableDelete {
  documentId: string;
  id: string;
}

export class ProductEnableDisableDelete {
  entityDetails: Array<CodeIDs>;
}

export class CodeIDs {
  documentId: string;
  id: string;
}

export class TestEnableDisableDelete {
  documentId: Array<string>;
  labProductId: string;
  code: string;
}
