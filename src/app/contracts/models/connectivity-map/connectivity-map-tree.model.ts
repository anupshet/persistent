// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
interface CalibratorLot {
  id?: number;
  codes: Codes[];
}

interface ReagentLot {
  id?: number;
  codes: Codes[];
}

export interface Test {
  id?: string;
  codes: Codes[];
  reagentLot: ReagentLot [];
  calibratorLot: CalibratorLot [];
}

export interface LevelCode {
  id?: string;
  lotLevel: number;
  codes: Codes[];
  test: Test[];
}

export interface Product {
  id?: string;
  levelCodes: LevelCode[];
}

export class ConnectivityMapTree {
  id: string;
  labId: string;
  locationId: string;
  departmentId: string;
  instrumentId: string;
  codes: Codes[];
  product: Product[];
  parsingJobConfigId?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class Codes {
  code: string;
  disabled?: boolean;
  id?: string;
  parsingJobConfigId?: string;
}
