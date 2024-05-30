// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { forkJoin, of } from 'rxjs';
import { catchError, exhaustMap, filter, flatMap, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import * as fromRoot from '..';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { AccountSettings } from '../../../../contracts/models/lab-setup/account-settings.model';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { Utility } from '../../../../core/helpers/utility';
import * as fromSecurity from '../../../../security/state/selectors';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { LabSetupDefaultsActions } from '../actions';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { includeArchivedItems } from '../../../../core/config/constants/general.const';
import { LocationActions } from '../../../../shared/state/actions';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { LabLocation } from '../../../../contracts/models/lab-setup';

@Injectable()
export class LabSetupDefaultEffects {
  constructor(
    private store: Store<fromRoot.LabSetupStates>,
    private actions$: Actions<LabSetupDefaultsActions.LabSetupDefaultsActionsUnion>,
    private portalApiService: PortalApiService,
    private appLogger: AppLoggerService,
    private router: Router,
    private appNavigationService: AppNavigationTrackingService
  ) { }

  saveLabsetupDefaults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabSetupDefaultsActions.saveAccountSettings.type),
      withLatestFrom(
        this.store.pipe(select(fromSecurity.getDirectory)),
        this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      ),
      exhaustMap(([action, directory, labLocation]) => {
        const navigate = action.navigate;
        let accountSettings = action.accountSettings;
        const priorLabSettingsValue = accountSettings['auditTrail']?.priorLabSettingsValue;
        const currentLabSettingsValue = accountSettings['auditTrail']?.currentLabSettingsValue;
        accountSettings = Object.assign({ ...labLocation.locationSettings }, { ...accountSettings });
        accountSettings.parentNodeId = directory.id.toString();
        accountSettings.nodeType = EntityType.AccountSettings;
        accountSettings.decimalPlaces = +accountSettings.decimalPlaces;
        accountSettings.locationId = labLocation.id;
        return forkJoin([this.portalApiService.saveLabsetupDefaults(accountSettings)]).pipe(
          map((accountSettingsGroup: Array<AccountSettings>) => {
            const _labLocation: LabLocation = cloneDeep(labLocation);
            _labLocation.locationSettings = accountSettingsGroup[0];
            _labLocation.islabsettingcompleted = true;
            this.store.dispatch(LocationActions.setCurrentLabLocation({ currentLabLocation: _labLocation }));
            if (accountSettings['auditTrail']['labSettingsDialogComponent']) {
              this.sendAuditTrailPayload(currentLabSettingsValue, priorLabSettingsValue);
            }
            return LabSetupDefaultsActions.saveAccountSettingsSuccess({ accountSettings: accountSettingsGroup[0], navigate: navigate });
          }),
          catchError(error => {
            const auditTrailPayload = this.comparePriorAndCurrentValues(currentLabSettingsValue, priorLabSettingsValue);
            auditTrailPayload.auditTrail.actionStatus = AuditTrackingActionStatus.Failure;
            this.appNavigationService.logAuditTracking(auditTrailPayload, true);
            return of(LabSetupDefaultsActions.saveAccountSettingsFailure({ error }));
          }
          )
        );
      })
    )
  );

  // TODO: Remove subscription here and call a new action to do this
  // TODO : Please avoid making subscription in effects as far as possible - use withLatestFromStore to subscribe to state
  saveAccountSettingsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabSetupDefaultsActions.saveAccountSettingsSuccess.type),
      flatMap(action => {
        return forkJoin([
          this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn), take(1)),
          of(action)
        ]);
      }),
      tap(([isArchiveItemsToggleOn, action]) => {
        const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
        this.portalApiService.getLabSetupNode(EntityType.Account, null,
          LevelLoadRequest.LoadUpToGrandchildren, EntityType.None, [queryParameter])
          .pipe(filter(account => !!account.children && !!account.children.length && action.navigate), take(1)).subscribe(account => {
            const locationNode = Utility.findTreeNodeByType(account.children, EntityType.LabLocation);

            if (locationNode) {
              action.accountSettings.instrumentsGroupedByDept ?
                this.router.navigateByUrl(
                  `${unRouting.labSetup.lab}/${unRouting.labSetup.departments}/${locationNode.id}/${unRouting.labSetup.settings}`)
                : this.router.navigateByUrl(
                  `${unRouting.labSetup.lab}/${unRouting.labSetup.instruments}/${locationNode.id}/${unRouting.labSetup.settings}`);
            }
          });
      })
    ),
    { dispatch: false }
  );

  saveAccountSettingsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabSetupDefaultsActions.saveAccountSettingsFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );
  // TODO: Future use code.
  // @Effect()
  // loadAccountSettings$ = this.actions$.pipe(
  //   ofType(LabSetupDefaultsActions.loadAccountSettings.type),
  //   exhaustMap(() =>
  //     this.levelService.getTestSettings().pipe(
  //       map((labSetupDefaults: LabSetupDefaults) =>
  //         LabSetupDefaultsActions.loadAccountSettingsSuccess({ labSetupDefaults })
  //       ),
  //       catchError(error =>
  //         of(LabSetupDefaultsActions.loadAccountSettingsFailure({ error }))
  //       )
  //     )
  //   )
  // );

  loadManufacturerListSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabSetupDefaultsActions.loadAccountSettingsSuccess.type)
    ),
    { dispatch: false }
  );

  loadManufacturerListFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabSetupDefaultsActions.loadAccountSettingsFailure.type)
    ),
    { dispatch: false }
  );

  /**
   * This function call audit trail endpoint
   * @param currentLabSetupValues Contains current lab setup values
   * @param priorLabSetupValues Contains prior lab setup values
   */
  private sendAuditTrailPayload(currentLabSetupValues, priorLabSetupValues): void {
    const auditTrailPayload = this.comparePriorAndCurrentValues(currentLabSetupValues, priorLabSetupValues);
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
  }

  /**
   * This function compares the prior and current lab settings values
   * @param currentLabSetupValues current lab setting values
   * @param priorLabSetupValues prior lab setting values
   * @returns unique lab setting properties
   */
  private comparePriorAndCurrentValues(currentLabSetupValues, priorLabSetupValues): AppNavigationTracking {
    currentLabSetupValues = !!currentLabSetupValues ? currentLabSetupValues : {};
    const payload: AppNavigationTracking = {
      auditTrail: {
        eventType: AuditTrackingEvent.Preferences,
        action: AuditTrackingAction.Update,
        actionStatus: AuditTrackingActionStatus.Success,
        priorValue: {},
        currentValue: {}
      }
    };
    Object.keys(currentLabSetupValues).forEach(i => {
      if (currentLabSetupValues[i] !== priorLabSetupValues[i]) {
        payload.auditTrail.priorValue[i] = priorLabSetupValues[i];
        payload.auditTrail.currentValue[i] = currentLabSetupValues[i];
      }
    });
    return payload;
  }
}


