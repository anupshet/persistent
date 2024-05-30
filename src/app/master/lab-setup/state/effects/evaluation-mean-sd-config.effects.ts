// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { AnalyteEvaluationMeanSd } from '../../../../contracts/models/lab-setup/analyte-evaluation-mean-sd.model';
import { LevelFloatingStatistics } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { AwsApiService } from '../../../../shared/api/aws.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { EvaluationMeanSdConfigActions } from '../actions';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrailPriorCurrentValues, AuditTrailValueData } from '../../../../shared/models/audit-tracking.model';
@Injectable()
export class EvaluationMeanSdConfigEffects {
  public priorEvaluationMeanSdLevelValues;
  public currentEvaltionMeanSdLevelValues;
  typeOfAction: string;
  entityId: string;

  constructor(
    private actions$: Actions<EvaluationMeanSdConfigActions.evaluationMeanSdConfigActionsUnion>,
    private appLogger: AppLoggerService,
    private awsApiService: AwsApiService,
    private appNavigationService: AppNavigationTrackingService,
  ) { }

  saveAnalyteEvaluationMeanSdList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.saveAnalyteEvaluationMeanSdList.type),
      map(action => action),
      flatMap((itemData) => 
        this.awsApiService.evaluationMeanSdSave(itemData.analyteEvaluationMeanSd).pipe(
          map(() => {
            this.currentEvaltionMeanSdLevelValues = itemData.analyteEvaluationMeanSd;
            return EvaluationMeanSdConfigActions.saveAnalyteEvaluationMeanSdListSuccess({
              analyteEvaluationMeanSd: itemData.analyteEvaluationMeanSd
            });
          }),
          catchError(error =>
            of(EvaluationMeanSdConfigActions.saveAnalyteEvaluationMeanSdListFailure({ error }))
          )
        )
      )
    )
  );

  saveAnalyteEvaluationMeanSdListSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.saveAnalyteEvaluationMeanSdListSuccess.type),
      map(action => action),
      tap((x) => {
       this.typeOfAction =  AuditTrackingAction.Add;
        this.sendAuditTrailPayload(AuditTrackingActionStatus.Success);
      })
    ),
    { dispatch: false }
  );

  saveAnalyteEvaluationMeanSdListFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.saveAnalyteEvaluationMeanSdListFailure.type),
      tap((x) => {
        this.appLogger.error(x);
        this.typeOfAction =  AuditTrackingAction.Add;
        this.sendAuditTrailPayload(AuditTrackingActionStatus.Failure);
      })
    ),
    { dispatch: false }
  );

  updateAnalyteEvaluationMeanSdList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.updateAnalyteEvaluationMeanSdList.type),
      map(action => action),
      flatMap((itemData) => {
        this.currentEvaltionMeanSdLevelValues = itemData.analyteEvaluationMeanSd;
        return this.awsApiService.evaluationMeanSdUpdate(itemData.analyteEvaluationMeanSd).pipe(
          map(() => {
            return EvaluationMeanSdConfigActions.updateAnalyteEvaluationMeanSdListSuccess({
              analyteEvaluationMeanSd: itemData.analyteEvaluationMeanSd
            });
          }),
          catchError(error => {
            return of(EvaluationMeanSdConfigActions.updateAnalyteEvaluationMeanSdListFailure({ error }))
          })
        );
      })
    )
  );

  updateAnalyteEvaluationMeanSdListSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.updateAnalyteEvaluationMeanSdListSuccess.type),
      map(action => action),
      tap((x) => {
        this.typeOfAction =  AuditTrackingAction.Update;
        this.sendAuditTrailPayload(AuditTrackingActionStatus.Success);
      })
    ),
    { dispatch: false }
  );

  updateAnalyteEvaluationMeanSdListFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.updateAnalyteEvaluationMeanSdListFailure.type),
      tap((x) => {
        this.typeOfAction =  AuditTrackingAction.Update;
        this.sendAuditTrailPayload(AuditTrackingActionStatus.Failure);
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  getAnalyteEvaluationMeanSdList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdList.type),
      map(action => action),
      flatMap((itemData) => 
        this.awsApiService.evaluationMeanSdItemsRequest(itemData.analyteIds).pipe(
          map((analyteEvaluationMeanSd: AnalyteEvaluationMeanSd[]) => {
            this.priorEvaluationMeanSdLevelValues = analyteEvaluationMeanSd && analyteEvaluationMeanSd.length > 0 ? cloneDeep(analyteEvaluationMeanSd) : null;
            return EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdListSuccess({
              analyteEvaluationMeanSd: analyteEvaluationMeanSd
            });
          }),
          catchError(error =>
            of(EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdListFailure({ error }))
          )
        )
      )
    )
  );

  getAnalyteEvaluationMeanSdListSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdListSuccess.type),
      map(action => action)
    ),
    { dispatch: false }
  );

  getAnalyteEvaluationMeanSdListFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdListFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  getAnalyteFloatingStatisticsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.getAnalyteFloatingStatisticsList.type),
      map(action => action),
      flatMap((itemData) =>
        this.awsApiService.floatingStatisticsRequest(itemData.analyteIds, itemData.timeFrame).pipe(
          map((levelFloatingStatistics: LevelFloatingStatistics[]) => {
            return EvaluationMeanSdConfigActions.getAnalyteFloatingStatisticsListSuccess({ levelFloatingStatistics });
          }),
          catchError(error =>
            of(EvaluationMeanSdConfigActions.getAnalyteFloatingStatisticsListFailure({ error }))
          )
        )
      )
    )
  );

  getAnalyteFloatingStatisticsListFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EvaluationMeanSdConfigActions.getAnalyteFloatingStatisticsListFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  public prepareAuditTrailProirCurrentValuesMultipleAnalyte(): AuditTrailValueData {
    const priorValue: AuditTrailPriorCurrentValues = {
      floatingStatistcsFlag: this.appNavigationService.evaluationFloatPointValues.prior.floatingStatistcsFlag,
      floatType: this.appNavigationService.evaluationFloatPointValues.prior.floatType,
      levelEvlMeanSdDataCollection: this.priorEvaluationMeanSdLevelValues
    };

    const currentValue: AuditTrailPriorCurrentValues = {
      floatingStatistcsFlag: this.appNavigationService.evaluationFloatPointValues.current.floatingStatistcsFlag,
      floatType: this.appNavigationService.evaluationFloatPointValues.current.floatType,
      levelEvlMeanSdDataCollection: this.currentEvaltionMeanSdLevelValues
    };
    return { current: currentValue, prior: priorValue };
  }

  public prepareAuditTrailProirCurrentValuesSingleAnalyte(): AuditTrailValueData {
    const levelEvaluationMeanSdData = [];
    this.currentEvaltionMeanSdLevelValues = this.currentEvaltionMeanSdLevelValues[0].levelEvaluationMeanSds;
    let pr = cloneDeep(this.priorEvaluationMeanSdLevelValues);

    if (pr !== null) {
      this.entityId =  this.currentEvaltionMeanSdLevelValues[0].entityId;
      let analyteIndex = null;
      pr.forEach((analyte, index) => {
       if (this.entityId === analyte.entityId) {
        analyteIndex = index;
       }
      });
      if (analyteIndex !== null) {
        pr = pr[analyteIndex].levelEvaluationMeanSds;
      } else {
       pr = null;
      }
    }
 
    for (let i = 0; i < pr?.length; i++) {
      for (let j = 0; j < this.currentEvaltionMeanSdLevelValues?.length; j++) {
        if (pr[i].level === this.currentEvaltionMeanSdLevelValues[j].level) {
          levelEvaluationMeanSdData[i] = this.currentEvaltionMeanSdLevelValues[j];
          break;
        } else {
          levelEvaluationMeanSdData[i] = pr[i];
        }
      }
    }

    if (pr === null) {
      for (let j = 0; j < this.currentEvaltionMeanSdLevelValues?.length; j++) {
        if (
          (this.currentEvaltionMeanSdLevelValues[j].mean !== null ||  this.currentEvaltionMeanSdLevelValues[j].cv !== null || this.currentEvaltionMeanSdLevelValues[j].sd !== null) || 
          (this.currentEvaltionMeanSdLevelValues[j].mean === null && this.currentEvaltionMeanSdLevelValues[j].meanEvaluationType === 1) ||
          (this.currentEvaltionMeanSdLevelValues[j].sd === null && this.currentEvaltionMeanSdLevelValues[j].sdEvaluationType === 1)
        ) {
          levelEvaluationMeanSdData.push(this.currentEvaltionMeanSdLevelValues[j]);
        }
      } 
    }

    const priorValue: AuditTrailPriorCurrentValues = {
      floatingStatistcsFlag: this.appNavigationService.evaluationFloatPointValues.prior.floatingStatistcsFlag,
      floatType: this.appNavigationService.evaluationFloatPointValues.prior.floatType,
      levelEvalMeanSdData: (pr) ? pr.reverse() : []
    };

    const currentValue: AuditTrailPriorCurrentValues = {
      floatingStatistcsFlag: this.appNavigationService.evaluationFloatPointValues.current.floatingStatistcsFlag,
      floatType: this.appNavigationService.evaluationFloatPointValues.current.floatType,
      levelEvalMeanSdData:  levelEvaluationMeanSdData.reverse(),
    };
    if (pr === null) {
      currentValue['levelEvlMeanSdData'] = [...levelEvaluationMeanSdData].reverse();
    }
    return { current: currentValue, prior: priorValue };
  }

  /**
     * This function call audit trail endpoint
     * @param currentEvalMeanSdValues Contains current evaluation mean sd values
     * @param priorEvalMeanSdValues Contains prior evaluation values
     */

  private sendAuditTrailPayload(auditTrackingActionStatus: string): void { 
    let auditTrailPayload;
    const isSingleAnalyte =  (this.currentEvaltionMeanSdLevelValues.length === 1) ? true : false;
    let evaluationMeanSDData = (isSingleAnalyte) ?
      this.prepareAuditTrailProirCurrentValuesSingleAnalyte() : this.prepareAuditTrailProirCurrentValuesMultipleAnalyte();
    if (isSingleAnalyte) {
      const currentLevelEvalMeanSdData = cloneDeep(evaluationMeanSDData.current.levelEvalMeanSdData);
      const priorLevelEvalMeanSdData = cloneDeep(evaluationMeanSDData.prior.levelEvalMeanSdData);
      auditTrailPayload = this.appNavigationService
        .comparePriorAndCurrentValues(evaluationMeanSDData.current, evaluationMeanSDData.prior, this.typeOfAction,
          AuditTrackingAction.eval, auditTrackingActionStatus);
          auditTrailPayload.auditTrail.run_id = this.entityId;
      if (auditTrailPayload.auditTrail.currentValue.levelEvalMeanSdData?.length) {
        delete auditTrailPayload.auditTrail.currentValue['levelEvalMeanSdData'];
        delete auditTrailPayload.auditTrail.priorValue['levelEvalMeanSdData'];
        const resultLevelData = this.appNavigationService.currentPriorChangeValue(currentLevelEvalMeanSdData, priorLevelEvalMeanSdData);
        if (resultLevelData.currentValues?.length) {
          auditTrailPayload.auditTrail.currentValue.levelEvalMeanSdData = resultLevelData.currentValues;
        }
        if (resultLevelData.priorValues?.length) {
          auditTrailPayload.auditTrail.priorValue.levelEvalMeanSdData = resultLevelData.priorValues;
        }
      }
    } else {
      const reshapedData = this.appNavigationService.
        currentPriorValueCvMeanSdDataCollectionReshaped( evaluationMeanSDData.current, evaluationMeanSDData.prior);
        auditTrailPayload = this.appNavigationService
      .comparePriorAndCurrentValues(reshapedData.current, reshapedData.prior, this.typeOfAction,
        AuditTrackingAction.eval, auditTrackingActionStatus);
    }
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    this.typeOfAction =  AuditTrackingAction.Update;
  }
}
