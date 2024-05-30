// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { RequestTestConfigActions } from '../actions';
import { LabSetupDefaultsService } from '../../services/lab-setup-defaults.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { TestConfiguration } from '../../models/test-configuration.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';

@Injectable()
export class LabRequestTestConfigurationEffects {
  constructor(
    private actions$: Actions<RequestTestConfigActions.RequestTestConfigActionsUnion>,
    private service: LabSetupDefaultsService,
    private appLogger: AppLoggerService
  ) { }

  requestTestConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestTestConfigActions.requestTestConfiguration.type),
      map(action => action.testConfig),
      exhaustMap((testConfiguration: TestConfiguration) =>
        this.service.post(testConfiguration, EntityType.LabTest).pipe(
          map(testConfig => RequestTestConfigActions.requestTestConfigurationSuccess({ testConfig })),
          catchError(error => of(RequestTestConfigActions.requestTestConfigurationFailure({ error })))
        )
      )
    )
  );

  requestTestConfigurationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestTestConfigActions.requestTestConfigurationSuccess.type)
    ),
    { dispatch: false }
  );

  requestTestConfigurationFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestTestConfigActions.requestTestConfigurationFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );
}
