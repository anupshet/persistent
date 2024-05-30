// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class Transformer {
  id: string;
  displayName: string;
  isAssigned?: boolean;
}
export class DynamicFormFieldRequest {
  transformerId?: string;
  parsingJobConfigId?: string;
  locationId: string;
}

export class SetTransformers {
  accountId: string;
  transformers: Transformer[];
}

export class TransformerFields {
  transformerId: string;
  instructionName: string;
  config: Array<Fields>;
}

export class Fields {
  key: string;
  label: string;
  type: string;
  value: string | boolean;
  isRequired: boolean;
  isGrouped?: boolean;
  isSummaryCheck?: boolean; // temporary added for HBOC and HMS transformer.
  groupName?: string;
  maxLength?: string;
  options?: Array<string>;
  validDateFormat?: Array<string>;
}

export class AddTransformerConfiguration {
  parsingJobConfigid: string;
  parsingJobName: string;
  accountId: string;
  data: TransformerConfiguration[];
  locationId: string;
}

export class DeleteConfiguration {
  parsingJobConfigId: string;
  accountId: string;
  locationId: string;
}

export class TransformerConfiguration {
  key: string;
  value: string;
}
