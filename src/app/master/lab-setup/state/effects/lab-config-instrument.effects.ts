// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import * as ngrxStore from '@ngrx/store';
import * as actions from '../../state/actions';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, exhaustMap, filter, flatMap, map, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { first, cloneDeep } from 'lodash';
import * as fromSelector from '../../state/selectors';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import * as fromRoot from '..';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { LabInstrument, TreePill } from '../../../../contracts/models/lab-setup';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { urlPlaceholders } from '../../../../core/config/constants/un-url-placeholder.const';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { LabConfigInstrumentActions } from '../actions';
import { LabInstrumentValues } from '../../../../contracts/models/lab-setup/instrument.model';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { archiveState } from '../../../../core/config/constants/general.const';
import { Utility } from '../../../../core/helpers/utility';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrailValueData } from '../../../../shared/models/audit-tracking.model';

@Injectable()
export class LabconfigInstrumentEffects {

  private destroy$ = new Subject<boolean>();
  labConfigManufacturers$ = this.store.pipe(select(fromSelector.getLabManufacturers));
  selectedNode: any = null;
  instrumentData: LabInstrumentValues;
  manufacturersList: Manufacturer[] = [];
  locationId: string;
  constructor(
    private actions$: Actions<LabConfigInstrumentActions.LabConfigInstrumentActionsUnion>,
    private store: Store<fromRoot.LabSetupStates>,
    private codeListApiService: CodelistApiService,
    private navigationService: NavigationService,
    private portalApiService: PortalApiService,
    private appLogger: AppLoggerService,
    private spcRulesService: SpcRulesService,
    private appNavigationService: AppNavigationTrackingService,
  ) { }

  saveLabsetupInstrument$ = createEffect(() =>

    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.saveInstruments.type),
      map(action => action.labInstruments),
      flatMap((instruments: LabInstrumentValues) => {
        let _settings: Settings;
        let labInstruments: LabInstrument[];
        return forkJoin([
          this.portalApiService.upsertLabSetupNodeBatch(instruments.labConfigFormValues, instruments.nodeType),
          this.store.pipe(select(fromNavigationSelector.getShowSettingsCurrentVal)).pipe(take(1))
        ]).pipe(
          flatMap((response: Array<Array<LabInstrument> | boolean>) => {
            labInstruments = response[0] as Array<LabInstrument>;
            const showSettings = response[1] as boolean;
            const requests = [];
            requests.push(this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn), take(1)));
            if (showSettings) {
              _settings = cloneDeep(instruments.archivedSettings);
              _settings.entityId = labInstruments[0].id; // using 0th index as udpate settings only has one node to be updated.
              requests.push(this.spcRulesService.updateSettings(EntityType.LabInstrument, _settings));
            }
            return forkJoin(requests);
          }),
          flatMap((response: Array<boolean | Settings>) => {
            const isArchiveItemsToggleOn = response[0];
            const settings = response && response.length > 1 ? response.splice(1, response.length - 1) as Settings[] : [];
            if (settings.length > 0 && instruments.archivedSettings.hasOwnProperty(archiveState) &&
              instruments.archivedSettings.archiveState !== ArchiveState.NoChange) {
              if (instruments.archivedSettings.archiveState === ArchiveState.Archived && !isArchiveItemsToggleOn) {
                this.navigationService.gotoDashboard();
                return;
              }
            }
            return of(labInstruments);
          }),
          map((_labInstruments: LabInstrument[]) => {
            _labInstruments.map((value, j) => {
              _labInstruments[j].typeOfOperation = instruments.typeOfOperation;
            })
            return LabConfigInstrumentActions.saveInstrumentsSuccess({ labInstruments: _labInstruments });
          }),
          catchError((error) => {
            let manufacturerName: string;
            let name: string;
            if (instruments.typeOfOperation){
            this.codeListApiService.getInstruments(instruments.labConfigFormValues[0].manufacturerId)
              .pipe(filter(instrumentList => !!instrumentList), takeUntil(this.destroy$))
              .subscribe(instrumentList => {
                instrumentList.forEach(iteam => {
                  if (iteam.id === Number(instruments.labConfigFormValues[0].instrumentId)) {
                    manufacturerName = iteam['manufacturerName'];
                    name = iteam['name'];
                  }

                });
                const currentData = this.appNavigationService.fetchData();
                currentData.auditTrail.eventType = AuditTrackingAction.LabSetup,
                currentData.auditTrail.action = AuditTrackingAction.Add,
                currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Failure,
                currentData.auditTrail.currentValue.manufacturerName = [manufacturerName];
                currentData.auditTrail.currentValue.instrumentName = [name];
                currentData.auditTrail.currentValue.instrumentCustomName = [instruments.labConfigFormValues[0].instrumentCustomName];
                currentData.auditTrail.currentValue.instrumentSerial = [instruments.labConfigFormValues[0].instrumentSerial];

                this.appNavigationService.logAuditTracking(currentData, true);
              });
            } else {
              const currentData = this.appNavigationService.fetchData();
              const AnalyteSettingsValue: AuditTrailValueData = this.audiTrailCurrentPriorFailPayload(instruments.labConfigFormValues);
              const auditTrailPayload = this.appNavigationService.compareData(AnalyteSettingsValue);
              auditTrailPayload.auditTrail.eventType = AuditTrackingAction.Settings,
              auditTrailPayload.auditTrail.action = AuditTrackingAction.Update,
              auditTrailPayload.auditTrail.actionStatus = AuditTrackingActionStatus.Failure,
              auditTrailPayload.auditTrail.nodeType = currentData.auditTrail.nodeType,
              this.appNavigationService.logAuditTracking(auditTrailPayload, true);
            }
            return of(LabConfigInstrumentActions.saveInstrumentsFailure({ error }));
          }
          )
        );
      })
    )
  );

  audiTrailCurrentPriorDepartment(labInstruments) {

    this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentSelectedNode))
      .pipe(filter(selectedNode => !!selectedNode), takeUntil(this.destroy$))
      .subscribe((selectedNode: TreePill) => {
        this.selectedNode = selectedNode;
      })
    const current = {
      manufacturerName: labInstruments[0].instrumentInfo.manufacturerName,
      name: labInstruments[0].instrumentInfo.name,
      instrumentSerial: labInstruments[0].instrumentSerial,
      instrumentCustomName: labInstruments[0].instrumentCustomName,
    }
    const prior = {
      manufacturerName: this.selectedNode.instrumentInfo.manufacturerName,
      name: this.selectedNode.instrumentInfo.name,
      instrumentSerial: this.selectedNode.instrumentSerial,
      instrumentCustomName: this.selectedNode.instrumentCustomName,
    }
    return { current, prior };
  }

audiTrailCurrentPriorFailPayload(labInstruments) {
  let manufacturersName: string ;
  this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentSelectedNode))
    .pipe(filter(selectedNode => !!selectedNode), takeUntil(this.destroy$))
    .subscribe((selectedNode: TreePill) => {
      this.selectedNode = selectedNode;
    });

    this.store.dispatch(
      actions.LabConfigInstrumentActions.loadManufacturerList()
    );
    this.labConfigManufacturers$
      .pipe(filter(manufacturers => !!manufacturers), takeUntil(this.destroy$))
      .subscribe(manufacturers => {
        this.manufacturersList = manufacturers;
      });
    this.manufacturersList.forEach(manufacturers => {
      if ( manufacturers.manufacturerId === labInstruments[0].manufacturerId) {
        manufacturersName = manufacturers.name;
      }
    });
  const current = {
    manufacturerName: [manufacturersName] ,
    name: this.selectedNode.instrumentInfo.name,
    instrumentSerial: labInstruments[0].instrumentSerial,
    instrumentCustomName: labInstruments[0].instrumentCustomName,
  };
  const prior = {
    manufacturerName: [this.selectedNode.instrumentInfo.manufacturerName],
    name: this.selectedNode.instrumentInfo.name,
    instrumentSerial: this.selectedNode.instrumentSerial,
    instrumentCustomName: this.selectedNode.instrumentCustomName,
  };
  return { current, prior };
}

  updateInstrumentAuditTrail(labInstruments) {

    if (labInstruments) {
      const currentData = this.appNavigationService.fetchData();
      const AnalyteSettingsValue: AuditTrailValueData = this.audiTrailCurrentPriorDepartment(labInstruments);
      const auditTrailPayload = this.appNavigationService.compareData(AnalyteSettingsValue);
      auditTrailPayload.auditTrail.eventType = AuditTrackingAction.LabSetup,
        auditTrailPayload.auditTrail.action = AuditTrackingAction.Update,
        auditTrailPayload.auditTrail.actionStatus = AuditTrackingActionStatus.Success,
        auditTrailPayload.auditTrail.nodeType = currentData.auditTrail.nodeType,
        this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    }
  }
  addInstrumentAuditTrail(labInstruments) {
    const manufacturerName = [];
    const name = [];
    const instrumentCustomName = [];
    const instrumentSerial = [];
    const currentData = this.appNavigationService.fetchData();
    labInstruments.map((value, j) => {
      manufacturerName.push(labInstruments[j].instrumentInfo.manufacturerName);
      name.push(labInstruments[j].instrumentInfo.name);
      instrumentCustomName.push(labInstruments[j].instrumentCustomName);
      instrumentSerial.push(labInstruments[j].instrumentSerial);
    })

    currentData.auditTrail.eventType = AuditTrackingAction.LabSetup,
      currentData.auditTrail.action = AuditTrackingAction.Add,
      currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Success,
      currentData.auditTrail.currentValue.manufacturerName = manufacturerName;
    currentData.auditTrail.currentValue.instrumentName = name;
    currentData.auditTrail.currentValue.instrumentCustomName = instrumentCustomName;
    currentData.auditTrail.currentValue.instrumentSerial = instrumentSerial;
    this.appNavigationService.logAuditTracking(currentData, true);
  }
  saveInstrumentsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.saveInstrumentsSuccess.type),
      map(action => action.labInstruments),
      withLatestFrom(
        this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode)),
        this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))),
      tap(([labInstruments, selectedNode, location]) => {
        if (labInstruments) {
          const sortedLabInstruments = this.navigationService.sortNavItems(labInstruments);
          const firstInstrument = first(sortedLabInstruments);
          if (firstInstrument) {
            const saveNodeType = firstInstrument ? firstInstrument.nodeType : selectedNode.nodeType;
            const parentNodeId = firstInstrument ? firstInstrument.parentNodeId : selectedNode.parentNodeId;
            this.navigationService.setSelectedNodeById(Utility.getParentNodeType(saveNodeType,
              location.locationSettings.instrumentsGroupedByDept),
              parentNodeId, () => {
                this.store.dispatch(NavBarActions.setNodeItems({ nodeType: firstInstrument.nodeType, id: firstInstrument.id }));
              });
          }
        }
        if (labInstruments[0].typeOfOperation) {
          this.addInstrumentAuditTrail(labInstruments);
        } else {
          this.updateInstrumentAuditTrail(labInstruments);
        }
      })
    ),
    { dispatch: false }
  );

  saveLabsetupInstrumentFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.saveInstrumentsFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  loadManufacturerList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.loadManufacturerList.type),
      exhaustMap(() =>
        this.codeListApiService.getManufacturers(urlPlaceholders.manufacturerTypeInstrument,
          this.getLocationId()).pipe(
          map((manufacturers: Manufacturer[]) =>
            LabConfigInstrumentActions.loadManufacturerListSuccess({ manufacturers })
          ),
          catchError(error =>
            of(LabConfigInstrumentActions.loadManufacturerListFailure({ error }))
          )
        )
      )
    )
  );

  loadManufacturerListSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.loadManufacturerListSuccess.type)
    ),
    { dispatch: false }
  );

  loadManufacturerListFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.loadManufacturerListFailure.type)
    ),
    { dispatch: false }
  );

  deleteLabConfigurationInstrument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.deleteInstrument.type),
      map(action => action.instrument),
      flatMap((labInstrument: LabInstrument) =>
        this.portalApiService.deleteLabSetupNode(labInstrument.nodeType, labInstrument.id).pipe(
          map(() => LabConfigInstrumentActions.deleteInstrumentSuccess({ instrument: labInstrument })),
          catchError((error) => of(LabConfigInstrumentActions.deleteInstrumentFailure({ error })))
        )
      )
    )
  );

  deleteLabConfigurationInstrumentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.deleteInstrumentSuccess.type),
      map(action => action.instrument),
      withLatestFrom(
        this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode)),
        this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))),
      tap(([instrument, currentlySelectedNode, location]) => {
        if (currentlySelectedNode.nodeType === EntityType.LabInstrument) {
          this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: null }));
          this.store.dispatch(NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem: null }));
          const navigateToInstrument = (() => {
            const url = `${unRouting.labSetup.lab}/${unRouting.labSetup.instruments}/${instrument.parentNodeId}/${unRouting.labSetup.settings}`;
            return () => {
              this.navigationService.navigateToUrl(url, false, currentlySelectedNode,
                instrument.parentNodeId);
            };
          })();
          if (currentlySelectedNode && currentlySelectedNode.children === null) {
            this.navigationService.setSelectedNodeById(Utility.getParentNodeType(currentlySelectedNode.nodeType,
              location.locationSettings?.instrumentsGroupedByDept),
              currentlySelectedNode.parentNodeId, () => {
                this.store.dispatch(NavBarActions.removeItemsFromCurrentBranch({ 'item': currentlySelectedNode }));
                this.store.dispatch(NavBarActions.setNodeItems({
                  nodeType: EntityType.LabDepartment, id: currentlySelectedNode.parentNodeId
                }));
                this.store.dispatch(NavBarActions.setNodeFirstLeftNavItemSelected({
                  nodeType: EntityType.LabDepartment,
                  id: instrument.parentNodeId
                }));
                navigateToInstrument();
              });
          } else {
            this.store.dispatch(NavBarActions.setNodeFirstLeftNavItemSelected({
              nodeType: Utility.getParentNodeType(instrument.nodeType,
                location.locationSettings.instrumentsGroupedByDept), id: instrument.parentNodeId
            }));
          }
        }
      })
    ),
    { dispatch: false }
  );

  deleteLabConfigurationInstrumentFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigInstrumentActions.deleteInstrumentFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  getLocationId(): string {
    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation)).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.locationId = res?.id;
    });
    return this.locationId;
  }
}
