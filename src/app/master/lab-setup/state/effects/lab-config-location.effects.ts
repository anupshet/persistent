// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { LabLocation } from '../../../../contracts/models/lab-setup/lab-location.model';
import { LabConfigLocationActions } from '../actions';
import { LabSetupDefaultsService } from '../../services/lab-setup-defaults.service';

@Injectable()
export class LabConfigLocationEffects {
  constructor(
    private actions$: Actions<LabConfigLocationActions.LabConfigLocationActionsUnion>,
    private service: LabSetupDefaultsService
  ) { }

  saveLabsetupLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigLocationActions.saveLabLocation.type),
      map(action => action.lablocation),
      exhaustMap((labLocation: LabLocation) =>
        this.service.post(labLocation, labLocation.nodeType).pipe(
          map(lablocation =>
            LabConfigLocationActions.saveLabLocationSuccess({ lablocation })
          ),
          catchError(error =>
            of(LabConfigLocationActions.saveLabLocationFailure({ error }))
          )
        )
      )
    )
  );

  saveLabsetupLocationsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigLocationActions.saveLabLocationSuccess.type)
    ),
    { dispatch: false }
  );

  loginRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigLocationActions.saveLabLocationFailure.type)
    ),
    { dispatch: false }
  );
}
