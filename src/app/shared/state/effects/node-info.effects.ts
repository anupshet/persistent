// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, tap, catchError, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { NodeInfoActions } from '../actions';
import { PortalApiService } from '../../api/portalApi.service';
import { AppLoggerService } from '../../services/applogger/applogger.service';
import { TreePill } from '../../../contracts/models/lab-setup';

@Injectable()
export class NodeInfoEffects {
  constructor(
    private actions$: Actions<NodeInfoActions.NodeInfoActionsUnion>,
    private portalApiService: PortalApiService,
    private appLogger: AppLoggerService,
  ) { }

  getAncestors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeInfoActions.getAncestors.type),
      exhaustMap((action) =>
        this.portalApiService.getLabSetupAncestorsMultiple(action.nodeType, action.analyteIds).pipe(
          map((ancestors: Array<Array<TreePill>>) =>
            NodeInfoActions.getAncestorsSuccess({ ancestors })
          ),
          catchError(error =>
            of(NodeInfoActions.getAncestorsFailure({ error }))
          )
        )
      )
    )
  );

  getAncestorsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeInfoActions.getAncestorsSuccess.type)
    ),
    { dispatch: false }
  );

  getAncestorsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NodeInfoActions.getAncestorsFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );
}
