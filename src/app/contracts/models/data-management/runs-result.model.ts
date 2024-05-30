import { CalibratorLot, ReagentLot } from 'br-component-library';
import {
  Action,
  UserComment,
  UserInteraction,
} from 'br-component-library';


export class RunsResult {
  runs: Run[];
  reagentLots: ReagentLot[];
  calibratorLots: CalibratorLot[];
  labTimeZone: string;
}

export class Run {
  dataSource: LabDataCollection;
  runId: string;
  runDateTime: Date;
  enteredDateTime: Date;
  actions: Action[];
  comments: UserComment[];
  interactions: UserInteraction[];
  levels: Level[];
  runReasons: string[];
  reagentLotId: number;
  calibratorLotId: number;
}

export class Level {
  level: number;
  controlLotId: number;
  value: number;
  cv: number;
  sd: number;
  mean: number;
  zScoreResult: ZScoreResult;
  isAccepted: boolean;
  resultStatus: ResultStatus;
  reasons: string[];
  measuredDateTime: Date;
  lastModified: Date;
}

export enum LabDataCollection {
  RawData = 0,
  RawDataStaging = 1
}

export enum ResultStatus {
  None,
  Accept,
  Warning,
  Reject
}

export class ZScoreResult {
  zScore: number;
  display: boolean;
}
