/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as ngrxStore from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { catchError, exhaustMap, map, tap, filter, takeUntil } from 'rxjs/operators';

import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ImportStatuses, ImportStatusParam } from '../../shared/models/connectivity-status.model';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { connectivityActions } from '../actions';
import * as fromConnectivity from '../../state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';

@Injectable()
export class ConnectivityEffects implements OnDestroy {
  labLocationId: string;
  protected destroy$ = new Subject<boolean>();

  constructor(
    private actions$: Actions<connectivityActions.connectivityActionsUnion>,
    private orchestratorApiService: OrchestratorApiService,
    private appLogger: AppLoggerService,
    private store: ngrxStore.Store<fromConnectivity.ConnectivityStates>,
    private errorLoggerService: ErrorLoggerService
  ) {
    this.fetchCurrentLocation();
  }

  fetchCurrentLocation() {
    this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        try {
          this.labLocationId = labLocation.id;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.ConnectivityEffects + blankSpace + Operations.FetchCurrentLocation)));
        }
      });
  }

  getImportStatusList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectivityActions.getImportStatusList.type),
      map(action => action),
      exhaustMap(() =>
        this.orchestratorApiService.getLogRecords(this.labLocationId).pipe(
          map((importStatusList: ImportStatuses) =>
            connectivityActions.getImportStatusListSuccess({ importStatusList })
          ),
          catchError(error =>
            of(connectivityActions.getImportStatusListFailure({ error }))
          )
        )
      )
    )
  );

  getImportStatusListSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectivityActions.getImportStatusListSuccess.type)
    ),
    { dispatch: false }
  );

  getImportStatusListFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectivityActions.getImportStatusListFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  getImportStatusDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectivityActions.getImportStatusDetails.type),
      map(action => action.importStatusParam),
      exhaustMap((importStatusParam: ImportStatusParam) =>
        this.orchestratorApiService.getLogRecordsById(importStatusParam.objectId).pipe(
          map((importStatusDetails: ImportStatuses) =>
            connectivityActions.getImportStatusDetailsSuccess({ importStatusDetails })
          ),
          catchError(error =>
            of(connectivityActions.getImportStatusDetailsFailure({ error }))
          )
        )
      )
    )
  );

  getImportStatusDetailsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectivityActions.getImportStatusDetailsSuccess.type)
    ),
    { dispatch: false }
  );

  getImportStatusDetailsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectivityActions.getImportStatusDetailsFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
