import { BaseRawDataModel } from './base-raw-data.model';

export class RawDataPage {
  prevPageLastRun: BaseRawDataModel;
  nextPageFirstRun: BaseRawDataModel;
  runData: Array<BaseRawDataModel>;
}
