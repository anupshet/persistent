/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { Observable } from 'rxjs';

import {
  BaseRawDataModel,
  RawDataType
} from '../models/data-management/base-raw-data.model';
import { RawDataPage } from '../models/data-management/raw-data-page.model';
import { SummaryDataModel } from '../models/data-management/summary-data.model';
import { RunData } from '../models/data-management/run-data.model';
import { YearMonth } from '../models/lab-data/year-month.model';

export interface ILabDataAPIService {
  getRawDataPageByLabTestId(
    labTestId: string,
    page: number,
    rawDataType: RawDataType,
    runs: number,
    controlLotIds?: string,
    rundaterange?: string
  ): Observable<RawDataPage>;

  getSummaryDataByLabTestIdsAsync(
    labTestId: string[],
    runs?: number,
    runDateTime?: Date
  ): Promise<SummaryDataModel[]>;

  getRunDataByLabTestIdsAsync(
    labTestId: string[],
    runDateTime?: Date
  ): Promise<RunData[]>;

  getLatestSummaryDataByLabTestIdAsync(
    labTestId: string,
    rawDataDateTime: Date
  ): Promise<SummaryDataModel[]>;

  getLatestRunDataByLabTestIdAsync(
    labTestId: string,
    rawDataDateTime: Date
  ): Promise<RunData[]>;

  getRawDataByLabTestIds(
    runDataLabTestId: string[],
    summaryDataLabTestId: string[],
    rawDataDateTime: Date,
    runs?: number,
  ): BaseRawDataModel[];

  getRawDataWithSearchParamsAsync(
    labTestIds: string[],
    rawDataDateTime: Date,
    rawDataType: RawDataType
  ): Promise<BaseRawDataModel[]>;

  getRawDataForAdvancedLj(
    labTestId: string,
    startDate: Date,
    endDate: Date,
    doNotShowBusy?: boolean
  ): Observable<string>;

  postDataAsync(data: BaseRawDataModel): Promise<BaseRawDataModel>;

  postDataBatchAsync(
    baseRawDataModel: BaseRawDataModel[]
  ): Promise<BaseRawDataModel[]>;

  putData(
    baseRawDataModel: BaseRawDataModel
  ): Observable<BaseRawDataModel>;

  putDataBatchAsync(
    baseRawDataModel: BaseRawDataModel[]
  ): Promise<BaseRawDataModel[]>;

  deleteData(runId: string, baseRawData: BaseRawDataModel): Observable<BaseRawDataModel>;

  getYearsAndMonthsWithDataPoints(
    year: number,
    labTestIds: string
  ): Observable<YearMonth>;
}
