import { createReducer, on } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { EvaluationMeanSdConfigActions } from '../actions';
import { AnalyteEvaluationMeanSd } from '../../../../contracts/models/lab-setup/analyte-evaluation-mean-sd.model';
import { LevelFloatingStatistics } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { TimeframeEnum } from '../../../../contracts/enums/lab-setup/timeframe.enum';


export interface EvaluationMeanSdConfigState {
  error: Error;
  requestedFloatingStatsTimeframe: TimeframeEnum;
  entityEvaluationMeanSdGroup: Array<AnalyteEvaluationMeanSd>;
  analyteFloatingStatisticsGroup: Array<LevelFloatingStatistics>;
}

export const evaluationMeanSdConfigStateInitialState: EvaluationMeanSdConfigState = {
  error: null,
  requestedFloatingStatsTimeframe: null,
  entityEvaluationMeanSdGroup: null,
  analyteFloatingStatisticsGroup: null
};

export const reducer = createReducer(
  evaluationMeanSdConfigStateInitialState,
  on(EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdListSuccess, (state, { analyteEvaluationMeanSd }) => ({
    ...state,
    error: null,
    entityEvaluationMeanSdGroup: analyteEvaluationMeanSd
  })),

  on(EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdListFailure, (state, { error }) => ({
    ...state,
    error: error,
    entityEvaluationMeanSdGroup: null
  })),

  // TODO: Need to work on this because of data issues in pagination functionality data is not getting properly bind
  // on(EvaluationMeanSdConfigActions.saveAnalyteEvaluationMeanSdListSuccess, (state, { analyteEvaluationMeanSd }) => ({
  //   ...state,
  //   error: null,
  //   entityEvaluationMeanSdGroup: analyteEvaluationMeanSd
  // })),

  on(EvaluationMeanSdConfigActions.saveAnalyteEvaluationMeanSdListFailure, (state, { error }) => ({
    ...state,
    error: error,
    entityEvaluationMeanSdGroup: null
  })),

  // TODO: Need to work on this because of data issues in pagination functionality data is not getting properly bind
  // on(EvaluationMeanSdConfigActions.updateAnalyteEvaluationMeanSdListSuccess, (state, { analyteEvaluationMeanSd }) => ({
  //   ...state,
  //   error: null,
  //   entityEvaluationMeanSdGroup: null
  // })),

  on(EvaluationMeanSdConfigActions.updateAnalyteEvaluationMeanSdListFailure, (state, { error }) => ({
    ...state,
    error: error,
    entityEvaluationMeanSdGroup: null
  })),

  on(EvaluationMeanSdConfigActions.getAnalyteFloatingStatisticsListSuccess, (state, { levelFloatingStatistics }) => ({
    ...state,
    error: null,
    analyteFloatingStatisticsGroup: levelFloatingStatistics
  })),

  on(EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdListFailure, (state, { error }) => ({
    ...state,
    error: error,
    analyteFloatingStatisticsGroup: null
  })),
);
