// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { NewInstrumentConfig } from '../../models/new-instrument-config.model';
import { RequestInstrumentConfigActions } from '../actions';
import { LabSetupDefaultsService } from '../../services/lab-setup-defaults.service';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';

@Injectable()
export class LabRequestInstrumentConfigurationEffects {
  constructor(
    private actions$: Actions<RequestInstrumentConfigActions.RequestInstrumentConfigActionsUnion>,
    private service: LabSetupDefaultsService,
  ) { }

  requestInstrumentConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestInstrumentConfigActions.requestInstrumentConfiguration.type),
      map(action => action.instrumentConfig),
      exhaustMap((newInstrumentConfig: NewInstrumentConfig) =>
        this.service.post(newInstrumentConfig, EntityType.LabInstrument).pipe(
          map(instrumentConfig =>
            RequestInstrumentConfigActions.requestInstrumentConfigurationSuccess({ instrumentConfig })
          ),
          catchError(error =>
            of(RequestInstrumentConfigActions.requestInstrumentConfigurationFailure({ error }))
          )
        )
      )
    )
  );

  requestInstrumentConfigurationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestInstrumentConfigActions.requestInstrumentConfigurationSuccess.type),
      // TODO : Uncomment out after wiring up with services
      // tap(() => {
      //   this.store.dispatch(
      //   LabSetupActions.setCurrentActiveUrl({currentActiveUrl: unRouting.labSetup.labConfigInstrument.add
      //   }));
      // })
    ),
    { dispatch: false }
  );

  requestInstrumentConfigurationFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestInstrumentConfigActions.requestInstrumentConfigurationFailure.type),
      tap(() => {
        // this.store.dispatch(
        // LabSetupActions.setCurrentActiveUrl({currentActiveUrl: unRouting.labSetup.labConfigInstrument.add
        // }));
      })
    ),
    { dispatch: false }
  );
}
