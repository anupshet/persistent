import {
  Action, UserComment, UserInteraction, BasePoint, BaseSummary
} from 'br-component-library';
import { SummaryDataModel, SummaryDataResult } from './summary-data.model';
import { RunData, PointDataResult } from './run-data.model';
import { AppNavigationTracking } from '../../../shared/models/audit-tracking.model';

export abstract class BaseRawDataModel {
  dataSource: LabDataCollection;

  id: string;
  labTestId: string;
  testId: number;
  testSpecId: number;
  correlatedTestSpecId: string;
  labInstrumentId: string;
  labProductId: string;
  labId: string;
  accountId: string;
  accountNumber: string;
  labUnitId: number;
  // flags: Array<RawDataFlags>;
  rawDataDateTime: Date;
  localRawDataDateTime: Date;
  localRunDateTime?: Date;
  localSummaryDateTime?: Date;
  upsertOptions?: UpsertRequestOptions;

  dataType: RawDataType;
  isLastMatch: boolean;
  auditDetails?: AppNavigationTracking;
  userActions: Array<Action>;
  userComments: Array<UserComment>;
  userInteractions: Array<UserInteraction>;
  results: Array<RunData | SummaryDataModel | PointDataResult | SummaryDataResult | BasePoint | BaseSummary>;
}

export class UpsertRequestOptions {
  // can be null when adding
  forceRuleEngineReEval: boolean; // only matters when edit, true if latest run
  isInsertOperation: boolean; // true if inserting
}

export enum RawDataFlags {
  Edited, Inserted
}

export enum RawDataType {
  RunData = 0,
  SummaryData = 1
}

export enum DataType {
  RunData, SummaryData
}

export enum LabDataCollection {
  RawData = 0,
  RawDataStaging = 1
}

