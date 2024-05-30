// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { LevelSummary, LevelValue } from '../../level-data.model';
import { Action, UserComment, UserInteraction } from '../page-section/analyte-user-info.model';
import { ChangeLotModel } from './change-lot.model';

export abstract class BaseAnalyte {
  id: string;
  labTestId: string;
  testSpecId: number;
  correlatedTestSpecId: string;
  cumulativeLevels: Array<number>;
  analyteName: string;
  analyteDateTime: Date;
  analyteDateTimeOffset: string;
  isSummary: boolean;
  levelDataSet: Array<LevelValue | LevelSummary>; // Implemented this way to allow a mix of point and summary objects.
}

export class AnalyteEntry extends BaseAnalyte {
  isRunEntryMode: boolean;
  analyteIndex: number;
  isSingleAnalyteMode: boolean;
  action: Action;
  totalAnalytes: number;
  changeLotData: ChangeLotModel;
}

export class AnalyteSummaryEntry extends AnalyteEntry {
  levelDataSet: Array<LevelSummary>;
}

export class AnalytePointEntry extends AnalyteEntry {
  levelDataSet: Array<LevelValue>;
}

export class AnalyteView extends BaseAnalyte {
  userComments: Array<UserComment>;
  userActions: Array<Action>;
  userInteractions: Array<UserInteraction> | Array<PezContent>;
  dataSource: string;
}

export class AnalyteSummaryView extends AnalyteView {
  levelDataSet: Array<LevelSummary>;
}

export class AnalytePointView extends AnalyteView {
  levelDataSet: Array<LevelValue>;
  isInsert: boolean;
}

class PezContent {
  userName: string;
  text: string;
  dateTime: Date;
  pezDateTimeOffset: string;
}
