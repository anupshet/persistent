import {
  BaseRawDataModel
} from './base-raw-data.model';
import { BaseRawDataLevel } from './run-data.model';

export class SummaryDataModel extends BaseRawDataModel {
  summaryDateTime: Date;
  localSummaryDateTime: Date;
  enteredDateTime: Date;
  rawDataInsertedDateTime: Date;
  results: Array<SummaryDataResult>;
  labLocationTimeZone: string;
  isAccepted = true;
  mean?: number;
  sd?: number;
  nPts?: number;
}

export class SummaryDataResult implements BaseRawDataLevel {
  lastModified: Date;
  controlLotId: number;
  controlLevel: number;
  isAccepted = true; // Since entry of summary data is not going to trigger rule engine for evaluation,
                      // IsAccepted property is always going to be true.
  mean: number;
  sd: number;
  nPts: number;
}
