import { createAction, props, union } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { AnalyteEvaluationMeanSd } from '../../../../contracts/models/lab-setup/analyte-evaluation-mean-sd.model';
import { TimeframeEnum } from '../../../../contracts/enums/lab-setup/timeframe.enum';
import {LevelFloatingStatistics } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';


export const getAnalyteEvaluationMeanSdList = createAction(
  '[Evaluation mean and sd] Get Analyte Evaluation Mean and Sd List',
  props<{ analyteIds: string[] }>()
);

export const getAnalyteEvaluationMeanSdListSuccess = createAction(
  '[Evaluation mean and sd] Get Analyte Evaluation Mean and Sd List Success',
  props<{ analyteEvaluationMeanSd: AnalyteEvaluationMeanSd[] }>()
);

export const getAnalyteEvaluationMeanSdListFailure = createAction(
  '[Evaluation mean and sd] Get Analyte Evaluation Mean and Sd List Failure',
  props<{ error: Error }>()
);

export const saveAnalyteEvaluationMeanSdList = createAction(
  '[Evaluation mean and sd] Save Analyte Evaluation Mean and Sd List',
  props<{ analyteEvaluationMeanSd: AnalyteEvaluationMeanSd[] }>()
);

export const saveAnalyteEvaluationMeanSdListSuccess = createAction(
  '[Evaluation mean and sd] Save Analyte Evaluation Mean and Sd List Success',
  props<{ analyteEvaluationMeanSd: AnalyteEvaluationMeanSd[] }>()
);

export const saveAnalyteEvaluationMeanSdListFailure = createAction(
  '[Evaluation mean and sd] Save Analyte Evaluation Mean and Sd List Failure',
  props<{ error: Error }>()
);

export const updateAnalyteEvaluationMeanSdList = createAction(
  '[Evaluation mean and sd] Update Analyte Evaluation Mean and Sd List',
  props<{ analyteEvaluationMeanSd: AnalyteEvaluationMeanSd[] }>()
);

export const updateAnalyteEvaluationMeanSdListSuccess = createAction(
  '[Evaluation mean and sd] Update Analyte Evaluation Mean and Sd List Success',
  props<{ analyteEvaluationMeanSd: AnalyteEvaluationMeanSd[] }>()
);

export const updateAnalyteEvaluationMeanSdListFailure = createAction(
  '[Evaluation mean and sd] Update Analyte Evaluation Mean and Sd List Failure',
  props<{ error: Error }>()
);
export const getAnalyteFloatingStatisticsList = createAction(
  '[Evaluation mean and sd] Get Analyte Floating Statistics List',
  props<{ analyteIds: string[], timeFrame: TimeframeEnum }>()
);

export const getAnalyteFloatingStatisticsListSuccess = createAction(
  '[Evaluation mean and sd] Get Analyte Floating Statistics List Success',
  props<{ levelFloatingStatistics: LevelFloatingStatistics[] }>()
);

export const getAnalyteFloatingStatisticsListFailure = createAction(
  '[Evaluation mean and sd] Get Analyte Floating Statistics List Failure',
  props<{ error: Error }>()
);

const evaluationMeanSdConfigActions = union({
  getAnalyteEvaluationMeanSdList,
  getAnalyteEvaluationMeanSdListSuccess,
  getAnalyteEvaluationMeanSdListFailure,
  saveAnalyteEvaluationMeanSdList,
  saveAnalyteEvaluationMeanSdListSuccess,
  saveAnalyteEvaluationMeanSdListFailure,
  updateAnalyteEvaluationMeanSdList,
  updateAnalyteEvaluationMeanSdListSuccess,
  updateAnalyteEvaluationMeanSdListFailure,
  getAnalyteFloatingStatisticsList,
  getAnalyteFloatingStatisticsListSuccess,
  getAnalyteFloatingStatisticsListFailure
});


export type evaluationMeanSdConfigActionsUnion = typeof evaluationMeanSdConfigActions;
