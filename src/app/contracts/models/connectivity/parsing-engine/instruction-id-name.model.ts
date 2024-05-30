// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class InstructionIdName {
  id: string;
  name: string;
}

export class ParsingJob {
  id: string;
  type: string;
}

export class ParsingInfo {
  configs: Array<ParsingJobConfig>;
  unassociatedEdgeDeviceIds: Array<string>;
}

export class ParsingJobConfig {
  createdTime?: string;
  id: string;
  isGenericASTM?: boolean;
  name: string;
  edgeDeviceIds: Array<string>;
  handlesSlideGen?: boolean;
  isConfigured?: boolean;
  transformerName?: string;
  transformerId?: string;
  configType?: string;
  isHavingMappings?: boolean;
  isDeletable?: boolean;
}
