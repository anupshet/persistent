import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import * as AppActions from '../actions/app.actions';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions<AppActions.AppActions>,
    private router: Router
  ) { }

  logout: Observable<Action> = createEffect(() =>
    this.actions$.pipe(ofType(AppActions.ResetApp),
    tap(() => {
      if (this.router.url.indexOf(unRouting.login) === -1) {
        this.router.navigate([unRouting.login]);
      }
    })
  ),
  { dispatch: false }
  );
}
