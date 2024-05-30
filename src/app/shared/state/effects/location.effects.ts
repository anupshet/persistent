import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { LocationActions } from '../actions';
import { LabLocation } from '../../../contracts/models/lab-setup';

@Injectable()
export class LocationEffects {
  constructor(
    private actions$: Actions<LocationActions.LocationActionsUnion>
  ) { }

  setLabLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationActions.setCurrentLabLocation.type),
      map(action => action.currentLabLocation),
      map((currentLabLocation: LabLocation) => LocationActions.setCurrentLabLocation({ currentLabLocation })
      )
    )
  );
}
