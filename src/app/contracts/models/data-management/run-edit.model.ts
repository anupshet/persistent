import { LabDataCollection } from './runs-result.model';

export class RunEdit {
  dataSource: LabDataCollection;
  labTestId: string;
  runId: string;
  runDateTime: Date;
  enteredDateTime: Date;
  levels: Array<DataLevel>;
  actionId: number;
  actionName: string;
  comment: string;
  reagentLotId: number;
  calibratorLotId: number;
  labTimeZone: string;
  isLatestRun: boolean;
  IsDataValueChanged: boolean;
}

export class DataLevel {
  controlLotId: number;
  controlLevel: number;
  value: number;
  isAccepted: boolean;
  lastModified: Date;
}
