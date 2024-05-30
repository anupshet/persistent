import { RawDataType } from '../data-management/base-raw-data.model';

export enum DataEntryMode {
  // These may change when backend is fleshed out
  Summary = RawDataType.SummaryData,
  Point = RawDataType.RunData
}
