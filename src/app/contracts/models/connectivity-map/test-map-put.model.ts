// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class TestMap {
  code: string;
  productId: string;
  calibratorLotCode: string;
  calibratorLotId: number;
  reagentLots: any;
  isSlideGen: boolean;
  entityId: string;
  entityDetails: Array<TestCodeIDs>
}

export class TestCodeIDs {
  documentId: string;
}

