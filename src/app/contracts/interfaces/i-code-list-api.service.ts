// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CalibratorLot, ReagentLot } from 'br-component-library';

import { TestInfo } from '../models/codelist-management/test-info.model';
import { TestSpecInfo } from '../models/data-management/run-data.model';

export interface ICodeListAPIService {
  getReagentLotsByReagentIdAsync(reagentId: string, doNotshowBusy?: boolean): Promise<ReagentLot[]>;

  getCalibratorLotsByCalibratorIdAsync(
    calibratorId: string, doNotshowBusy?: boolean
  ): Promise<CalibratorLot[]>;

  getTestSpecIdAsync(
    analyteId: string,
    methodId: string,
    instrumentId: string,
    reagentLotId: string,
    unitId: string,
    calibratorLotId: string
  ): Promise<string>;

  getTestSpecByIdAsync(testSpecId: string): Promise<TestSpecInfo>;

  getTestSpecInfoFromCodeListAsync(testSpecId: string): Promise<TestSpecInfo>;

  getTestInfoFromCodeListAsync(testId: string): Promise<TestInfo>;

  getTestByIdAsync(testId: string): Promise<TestInfo>;
}
