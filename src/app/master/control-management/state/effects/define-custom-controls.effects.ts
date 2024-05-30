// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, flatMap, map, take, tap } from 'rxjs/operators';

import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { DefineCustomControlsActions } from '../actions';
import { CustomControlRequest } from '../../../../contracts/models/control-management/custom-control-request.model';
import * as fromRoot from '..';
import * as fromCustomControlSelector from '../selectors';
import * as fromAccountSelector from '../../../../shared/state/selectors';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { CodelistApiService } from '../../../../../app/shared/api/codelistApi.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';


@Injectable()
export class DefineCustomControlsEffects {

  constructor(
    private actions$: Actions<DefineCustomControlsActions.DefineCustomControlsActionsUnion>,
    private store: Store<fromRoot.CustomControlManagementStates>,
    private portalApiService: PortalApiService,
    private codeListService: CodelistApiService,
    private appLogger: AppLoggerService,
    private appNavigationService: AppNavigationTrackingService
  ) { }

  addCustomControl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DefineCustomControlsActions.addCustomControl.type),
      map(action => action.product),
      flatMap((product: CustomControlRequest[]) => {
        const productPayload = this.appNavigationService.includeATDataToPayload(product, AuditTrackingAction.Add,
        AuditTrackingActionStatus.Pending, AuditTrackingEvent.NBRControl);
        return this.portalApiService.postNonBrControlDefinitionsWithLabSetup(productPayload).pipe(
          map(() => {
            return DefineCustomControlsActions.addCustomControlSuccess({});
          }),
          catchError((error) => {
            return of(DefineCustomControlsActions.addCustomControlFailure({ error }));
          })
        );
      }))
  );

  //Tested on MockData, need to test on API
  addCustomControlSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DefineCustomControlsActions.addCustomControlSuccess.type),
      map(action => action),
      tap(() => {
        const customControlSuccess$ = this.store.pipe(select(fromCustomControlSelector.getDefineCustomControls));
        const currentAccount$ = this.store.pipe(select(fromAccountSelector.getAccountState));
        customControlSuccess$.pipe(take(1)).subscribe(() => {
          currentAccount$.pipe(take(1)).subscribe((res: any) => {
            const accountId = res?.currentAccountSummary?.id;
            if (accountId) {
              this.codeListService?.getNonBrControlDefinitions(accountId).pipe(take(1)).subscribe((data) => {
                return data;
              }, err => {
                //TODO
              });
            }
          });
        });
      })
    ),
    { dispatch: false }
  );

  addCustomControlFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DefineCustomControlsActions.addCustomControlFailure.type),
      tap((error) => {
        this.appLogger.error(error);
      })
    ),
    { dispatch: false }
  );
}
