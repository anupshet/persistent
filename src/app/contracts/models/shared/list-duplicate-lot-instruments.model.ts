// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class InstrumentInfo {
  instrumentId: string;
  instrumentName: string;
  customName: string;
  departmentName: string;
}

export class InstrumentListRequest {
  labInstrumentId: string;
  productId: string;
  sourceProductMasterLotId: string;
  targetProductMasterLotId: string;
}
