// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { combineLatest, forkJoin, of } from 'rxjs';
import { catchError, flatMap, map, tap, filter, take, distinctUntilChanged } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { LabConfigSettingsActions } from '../actions';
import * as fromRoot from '../../../../state/app.state';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { Settings, SettingsParameter } from '../../../../contracts/models/lab-setup/settings.model';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { includeArchivedItems } from '../../../../core/config/constants/general.const';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { Utility } from '../../../../core/helpers/utility';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrailPriorCurrentValues, AuditTrailValueData } from '../../../../shared/models/audit-tracking.model';

@Injectable()
export class LabConfigSettingsEffects {
  public prevMinimumNumberOfPoints: number;
  public currentMinimumNumberOfPoints: number;

  constructor(
    private actions$: Actions<LabConfigSettingsActions.LabConfigSettingsActionsUnion>,
    private appLogger: AppLoggerService,
    private store: Store<fromRoot.State>,
    private spcRulesService: SpcRulesService,
    private portalApiService: PortalApiService,
    private navigationService: NavigationService,
    private appNavigationService: AppNavigationTrackingService,
  ) { }

  getSettingsSpcRules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigSettingsActions.getSettings.type),
      map(action => action.settingsParameter),
      flatMap((settingsParameter: SettingsParameter) => {
        return this.spcRulesService.getSettings(settingsParameter.entityType, settingsParameter.entityId, settingsParameter.parentEntityId)
          .pipe(filter(settingsData => !!settingsData))
          .pipe(map((settings: Settings) => {
            this.prevMinimumNumberOfPoints = settings.runSettings.minimumNumberOfPoints;
            return LabConfigSettingsActions.getSettingsSuccess({ settings });
          }),
            catchError((error) => {
              return of(LabConfigSettingsActions.getSettingsFailure({ error }));
            })
          );
      })
    )
  );

  getSettingsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigSettingsActions.getSettingsSuccess.type)
    ),
    { dispatch: false }
  );

  getSettingsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigSettingsActions.getSettingsFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  // VS 20200708 - Will be in use for future enhancement
  setSettingsSpcRules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigSettingsActions.setSettings.type),
      map(action => action.settings),
      flatMap((settings: Settings) => {
        this.currentMinimumNumberOfPoints = (settings.runSettings !== null) ? settings.runSettings.minimumNumberOfPoints : null;
        const response =
          (settings.levelSettings && settings.levelSettings.id === '') ?
            this.spcRulesService.createSettings(settings.entityType, settings) : this.spcRulesService.updateSettings(settings.entityType, settings);
        return response
          .pipe(map(() => {
            return LabConfigSettingsActions.setSettingsSuccess({ settings });
          }),
            catchError((error) => {
              return of(LabConfigSettingsActions.setSettingsFailure({ error }));
            })
          );
      })
    )
  );

  navigationSelectedNodeState$ = this.store.pipe(select(fromNavigationSelector.getCurrentSelectedNode));
  navigationState$ = this.store.pipe(select(fromNavigationSelector.getNavigationState));
  locationState$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
  setSettingsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigSettingsActions.setSettingsSuccess.type),
      map(action => action.settings),
      flatMap((settings: Settings) => {
        return forkJoin([
          of(settings),
          this.store.pipe(select(fromNavigationSelector.getShowSettingsCurrentVal), take(1)),
        ]);
      }),
      tap(([settings, showSettings]) => {
        if (settings) {
          const prevMinNumOfPoints = this.appNavigationService.minimumNumberOfPoints;
          if ((prevMinNumOfPoints) &&  prevMinNumOfPoints !== this.currentMinimumNumberOfPoints){
            this.sendAuditTrailPayload(AuditTrackingActionStatus.Success);
          }
          const settingsParameter: SettingsParameter = {
            // this is for updating a single entity, so used 0th index directly
            entityType: settings.entityType,
            entityId: showSettings ? settings.entityId : settings.entityIds[0],
            parentEntityId: settings.parentEntityId
          };
          this.store.dispatch(LabConfigSettingsActions.getSettings({ settingsParameter }));
          if (settings.archiveState === ArchiveState.NotArchived) {
            combineLatest([this.navigationSelectedNodeState$, this.navigationState$, this.locationState$]).pipe(take(1))
              .subscribe(([selectedNode, navigation, location]) => {
                const queryParameter = new QueryParameter(includeArchivedItems, (navigation.isArchiveItemsToggleOn ? true : false)
                  .toString());
                this.portalApiService.getLabSetupNode(selectedNode.nodeType, selectedNode.id,
                  LevelLoadRequest.LoadUpToGrandchildren,
                  EntityType.None, [queryParameter])
                  .pipe(take(1))
                  .pipe(distinctUntilChanged()).subscribe((updatedNode) => {
                    if (updatedNode.children && updatedNode.children.length > 0) {
                      this.store.dispatch(NavBarActions.setDefaultNode({ selectedNode: updatedNode }));
                    } else {
                      this.navigationService.setSelectedNodeById(Utility.getParentNodeType(updatedNode?.nodeType, location.locationSettings.instrumentsGroupedByDept),
                        updatedNode.parentNodeId, () => {
                          this.store.dispatch(NavBarActions.setNodeItems({ nodeType: updatedNode.nodeType, id: updatedNode.id }));
                        });
                    }
                    this.store.dispatch(NavBarActions.setItemToCurrentBranch({ currentBranchItem: updatedNode }));
                  });
              });
          }
        }
      })
    ),
    { dispatch: false }
  );

  setSettingsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigSettingsActions.setSettingsFailure.type),
      tap((x) => {
        this.sendAuditTrailPayload(AuditTrackingActionStatus.Failure);
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  private sendAuditTrailPayload(auditTrackingActionStatus: string): void {
    if (this.prevMinimumNumberOfPoints === 0 && this.appNavigationService.minimumNumberOfPoints) {
      this.prevMinimumNumberOfPoints  =  this.appNavigationService.minimumNumberOfPoints;
    }

    const currentValue: AuditTrailPriorCurrentValues = {
      minimumNumberOfPoints: this.currentMinimumNumberOfPoints,
    };

    const priorValue: AuditTrailPriorCurrentValues = {
      minimumNumberOfPoints: this.prevMinimumNumberOfPoints,
    };
    if (currentValue.minimumNumberOfPoints !== null && (currentValue.minimumNumberOfPoints !== priorValue.minimumNumberOfPoints)) {
      const auditTrailPayload = this.appNavigationService
        .comparePriorAndCurrentValues(currentValue, priorValue, AuditTrackingAction.Update,
          AuditTrackingAction.eval, auditTrackingActionStatus);
      this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    }
  }

}
