// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

export class ProductMenuItem {
  name: string;
}

export enum ProductOperations {
  DefineOwnControl = 1
}

export class ProductOperationMenuItem extends ProductMenuItem {
  operationId: ProductOperations;
}

export class ManufacturerProduct extends ProductMenuItem {
  id: string;
  manufacturerId: number;
  manufacturerName: string;
}

export class ManufacturerProductDisplayItem extends ManufacturerProduct {
  displayName: string;
}

export class RuleSettings {
  value: number| null;
  ruleId: number;
  disposition: string
}

export class ProductListRequest {
  instrumentId: string;
  accountId: string;
}
