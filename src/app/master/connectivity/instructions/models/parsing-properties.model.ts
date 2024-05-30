// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class ParsingProperties {
  fieldDelimiter: string | string[];
  codeFields: CodeFields;
  staticInstrument: string;
  dateFormat: string;
  dateField: number;
  timeField: number;
  result: Result;
  headerRows: number;
  footerRows: number;
}

export class CodeFields {
  instrument: number;
  productLot: number;
  productLevel: number;
  analyte: number;
  calibratorLot: number;
  reagentLot: number;
}

export class Result {
  point: number;
  summary: Summary;
}

export class Summary {
  mean: number;
  sd: number;
  numPts: number;
}

export class ParsingInfo {
  instructionName: string;
  config: ParsingConfig;
  accountId?: string;
  id?: string;
  name?: string;
  edgeBoxIdentifier: string;
}

export class ParsingConfig {
  instrumentCodeField: string;
  staticInstrumentCode: string;
  controlLotCodeField: string;
  analyteCodeField: string;
  dateTimeFormat: string;
  dateField: string;
  timeField: string;
  capturedDateTime: string;
  resultField: string;
  meanField: string;
  sdField: string;
  numPointsField: string;
  decimalSeparator: string;
  separateQualitativeFromQuantitative: boolean;
}

export class EdgeBoxIdentifier {
  edgeBoxIdentifiers: Array<string>;
}
