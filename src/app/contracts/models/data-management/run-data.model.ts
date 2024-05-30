/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Action } from 'br-component-library';
import {
  BaseRawDataModel
} from './base-raw-data.model';
import { EvaluationType } from '../../enums/lab-setup/evaluation-type.enum';
import { ReagentLot } from '../lab-setup/reagent-lot.model';
import { CalibratorLot } from '../lab-setup/calibrator-lot.model';
import { LjChartEvent } from './advanced-lj/lj-chart.models';

export class RunData extends BaseRawDataModel {
  runDateTime: Date;
  localRunDateTime: Date;
  enteredDateTime: Date;
  results: Array<PointDataResult>;
  evaluationRules: Array<Rule>;
  isRestartFloat: boolean;
  labLocationTimeZone: string;
  runReasons: Array<string>;
  isAccepted?: boolean;
  mean?: number;
  sd?: number;
  nPts?: number;
  onlyCommentAdded?: boolean;
}

export class UpsertRequestOptions {
  // can be null when adding
  forceRuleEngineReEval: boolean; // only matters when edit, true if latest run
  isInsertOperation: boolean; // ture if inserting
}

export class TestSpecInfo {
  id: number;
  testId: number;
  testSpecId: number;
  analyteId: number;
  methodId: number;
  instrumentId: number;
  storageUnitId: number;
  reagentId: number;
  reagentLotId: number;
  calibratorId: number;
  calibratorLotId: number;
  productId: number;
  productMasterLotId: number;
  labUnitId: number;
  reagentLot?: ReagentLot;
  calibratorLot?: CalibratorLot;
}

export class BaseRawDataLevel {
  lastModified: Date;
  controlLotId: number;
  controlLevel: number;
}

export class PointDataResult extends BaseRawDataLevel {
  measuredDateTime: Date;
  resultValue: number;
  targetNPts: number;
  targetMean: number;
  targetSD: number;
  targetCV: number;
  zScoreData: ZScoreResult;
  isAccepted: boolean;
  isRuleEngineIgnored: boolean;
  ruleViolated: Array<Rule>;
  editByInfo: AddEditBy;
  resultStatus: ResultStatus;
  reasons: Array<string>;
  mean?: number;
  sd?: number;
  nPts?: number;
  peerMean?: number;
  peerSD?: number;
  peerCV?: number;
  // extra parameters need after adding logic related to evaluation-mean-sd
  meanEvaluationType?: EvaluationType;
  sdEvaluationType?: EvaluationType;
  sdIsCalculated?: boolean;
  cvEvaluationType?: EvaluationType;
  cvIsCalculated?: boolean;
  testSpecId?: number;
  decimalPlace?: number;
  userActions?: Array<Action>;
  chartEvent?: LjChartEvent;
  runId: string;
  ruleRange?:Array<string>;
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

export class Rule {
  category: string;
  k: number;
  disposition: string;
}

export class AddEditBy {
  source: string;
}
