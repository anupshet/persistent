// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, exhaustMap, flatMap, map, take, takeUntil, tap } from 'rxjs/operators';
import { first, cloneDeep } from 'lodash';

import * as fromRoot from '..';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { LabProduct } from '../../../../contracts/models/lab-setup/product.model';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { LabConfigControlActions } from '../actions';
import { ControlConfig, Settings, NonBrControlConfig } from '../../../../contracts/models/lab-setup/settings.model';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { archiveState } from '../../../../core/config/constants/general.const';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { Utility } from '../../../../core/helpers/utility';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, AuditTrailValueData } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { SpcRulesComponent } from '../../components/spc-rules/spc-rules.component';
import { ProductListRequest } from '../../../../contracts/models/lab-setup/product-list.model';

@Injectable()
export class LabconfigControlEffects {
  currentSelectedControl: LabProduct;
  controlsForm: FormGroup;
  _settings: Settings;
  @ViewChild(SpcRulesComponent) spcRuleComponent: SpcRulesComponent;
  get settings(): Settings {
    return this._settings;
  }

  @Input('settings')
  set settings(value: Settings) {
    this._settings = value;
  }

  isArchived = false;
  locationId: string;
  private destroy$ = new Subject<boolean>();

  constructor(
    private actions$: Actions<LabConfigControlActions.LabConfigControlActionsUnion>,
    private portalApiService: PortalApiService,
    private codeListService: CodelistApiService,
    private navigationService: NavigationService,
    private store: Store<fromRoot.LabSetupStates>,
    private spcRulesService: SpcRulesService,
    private appLogger: AppLoggerService,
    private appNavigationService: AppNavigationTrackingService
  ) { }

  // TODO : Change it to accept an array after the backend is ready to accept an array of controls
  saveLabConfigurationControl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigControlActions.saveControl.type),
      map(action => action.controlConfigEmitter),
      flatMap((controlConfigEmitter: ControlConfig) => {
        let _settings: Settings;
        let controls: LabProduct[];
        return this.portalApiService.upsertLabSetupNodeBatch(controlConfigEmitter.labControls, controlConfigEmitter.nodeType).pipe(
          flatMap((_labControls: LabProduct[]) => {
            controls = _labControls;
            let entityIds = [];
            _settings = cloneDeep(controlConfigEmitter.settings);
            entityIds = controls.map(element => element.id);
            _settings.entityIds = entityIds;
            const request = [];
            if (_settings.levelSettings || _settings.ruleSettings || _settings.runSettings) {
              if (_settings.levelSettings && _settings.levelSettings.id === '') {
                request.push(this.spcRulesService.createSettings(_settings.entityType, _settings));
              } else {
                _settings.entityId = _settings.entityIds[0]; // using 0th index as udpate settings only has one node to be updated.
                delete _settings.entityIds;
                request.push(this.spcRulesService.updateSettings(_settings.entityType, _settings));
              }
            }
            return forkJoin([
              this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn), take(1)),
              ...request
            ]);
          }),
          flatMap((response: Array<boolean | Settings>) => {
            const isArchiveItemsToggleOn = response[0];
            const settings = response && response.length > 1 ? response.splice(1, response.length - 1) as Settings[] : [];
            let isArchiveStateChanged = false;
            if (settings.length > 0 && controlConfigEmitter.settings.hasOwnProperty(archiveState) &&
              controlConfigEmitter.settings.archiveState !== ArchiveState.NoChange) {
              isArchiveStateChanged = true;
            }
            this.isArchived = (isArchiveStateChanged && isArchiveItemsToggleOn) ? true : false;
            if (isArchiveStateChanged && controlConfigEmitter.settings.archiveState === ArchiveState.Archived && !isArchiveItemsToggleOn) {
              this.navigationService.gotoDashboard();
              return;
            }
            return of(controls);
          }),
          map((labControls: LabProduct[]) => {
            labControls.map((value, j) => {
              labControls[j].typeOfOperation = controlConfigEmitter.typeOfOperation;
            })
            return LabConfigControlActions.saveControlSuccess({ labControls });
          }),
          catchError((error) => {
            let lotNum: string;
            let customName: string;
            const action = (this.isArchived) ? AuditTrackingAction.Archive : AuditTrackingAction.Add;
            if (!controlConfigEmitter.typeOfOperation) {
              this.codeListService.getProductMasterLotsByProductId(controlConfigEmitter.labControls[0].productId).pipe()
                .subscribe(productLotList => {
                  productLotList.forEach(lotData => {
                    if (lotData['id'] === Number(controlConfigEmitter.labControls[0]?.productMasterLotId)) {
                      lotNum = lotData['lotNumber'];
                      customName = lotData['productName'];
                    }

                  });
                  const currentData = this.appNavigationService.fetchData();
                  currentData.auditTrail.eventType = AuditTrackingAction.LabSetup,
                    currentData.auditTrail.action = action,
                    currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Failure,
                    currentData.auditTrail.currentValue.controlName = [customName];
                  currentData.auditTrail.currentValue.lotNumber = [lotNum];
                  currentData.auditTrail.currentValue.customName = [controlConfigEmitter.labControls[0]?.productCustomName];
                  this.appNavigationService.logAuditTracking(currentData, true);
                });

            } else {
              const currentData = this.appNavigationService.fetchData();
              const controlSettingsValue: AuditTrailValueData = this.audiTrailCurrentPriorFailControlPayload({ controlConfigEmitter });
              const statusFail = this.appNavigationService.comparePriorAndCurrentValues(controlSettingsValue.current,
                controlSettingsValue.prior, AuditTrackingAction.Update, AuditTrackingAction.LabSetup, AuditTrackingActionStatus.Failure);
              this.appNavigationService.logAuditTracking(statusFail, true);
            }
            return of(LabConfigControlActions.saveControlFailure({ error }));

          })
        );
      })
    )
  );

  loadLabConfigurationControlList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigControlActions.loadControlList.type),
      map(action => action.request),
      exhaustMap((request: ProductListRequest) =>
        this.codeListService.getProductsByInstrumentAndLocationId(request.instrumentId, this.getLocationId()).pipe(
          map(masterControls => {
            masterControls = masterControls.sort((a, b) => (a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? -1 : 1));
            return LabConfigControlActions.loadControlListSuccess({ masterControls });
          }),
          catchError(error =>
            of(LabConfigControlActions.loadControlListFailure({ error }))
          )
        )
      )
    )
  );

  compareInputData(): AuditTrailValueData {
    const currentLevel = this.appNavigationService.controlsForm.value.levels;
    const priorLevel = this.appNavigationService.controlData.levelSettings.levels.map(element => element.levelInUse);
    let currentRuleSettings = this.appNavigationService.spcRuleComponent.spcRulesForm.value.ruleSettings;
    let priorRuleSettings = cloneDeep(this.appNavigationService.spcRuleComponent.ruleSettings);
    const currentIsSummary = this.appNavigationService.controlsForm.value.dataEntryMode;
    const priorIsSummary = this.appNavigationService.settings.levelSettings.isSummary;
    const leveldata = currentLevel.map((a, i) => priorLevel[i] !== undefined ? priorLevel[i] : false);
    priorRuleSettings = priorRuleSettings.map((a) => ({ ruleId: a.ruleId,
      value: a.value !== null ? parseInt(a.value) : null,
      disposition: a.disposition }));
    currentRuleSettings = currentRuleSettings.map((a) => ({ ruleId: a.ruleId,
      value: a.value !== null ? parseInt(a.value) : null,
      disposition: a.disposition }));

    let ruleSettingsdata;
    if (priorRuleSettings) {
      ruleSettingsdata = currentRuleSettings.map((a, i) => priorRuleSettings[i] !== undefined ? priorRuleSettings[i] : null);
    } else {
      ruleSettingsdata = priorRuleSettings;
      currentRuleSettings = currentRuleSettings;
    }
    return {
      current: {
        levels: currentLevel,
        ruleSettings: currentRuleSettings,
        isSummary: currentIsSummary
      },
      prior: {
        levels: leveldata,
        ruleSettings: ruleSettingsdata,
        isSummary: priorIsSummary
      }
    };
  }

  audiTrailCurrentPriorControl(labControls): AuditTrailValueData {
    const data = this.appNavigationService.controlData;
    const inputData = this.compareInputData();
    const decimalPlaces = (parseInt(this.appNavigationService.controlsForm.value.decimalPlaces))
    const current = {
      controlName: [labControls[0].lotInfo.productName],
      lotNumber: [labControls[0].lotInfo.lotNumber],
      productCustomName: labControls[0].productCustomName,
      levels: inputData.current.levels,
      decimalPlaces: decimalPlaces,
      archived: labControls[0].isArchived,
      ruleSettings: inputData.current.ruleSettings,
      isSummary: inputData.current.isSummary,
    }
    const prior = {
      controlName: [data.productInfo.name],
      lotNumber: [data.lotInfo.lotNumber],
      productCustomName: data.productCustomName,
      levels: inputData.prior.levels,
      decimalPlaces: data.levelSettings.levels[0].decimalPlace,
      archived: data.isArchived,
      ruleSettings: inputData.prior.ruleSettings,
      isSummary: inputData.prior.isSummary,
    };
    return { current, prior };
  }

  audiTrailCurrentPriorFailControlPayload(labControls) {
    const data = this.appNavigationService.controlData;
    const inputData = this.compareInputData();
    const decimalPlaces = (parseInt(this.appNavigationService.controlsForm.value.decimalPlaces))
    const current = {
      controlName: [data.lotInfo?.productName],
      lotNumber: [data.lotInfo?.lotNumber],
      productCustomName: data.productCustomName,
      levels: inputData.current.levels,
      decimalPlaces: decimalPlaces,
      archived: data.isArchived,
      ruleSettings: inputData.current.ruleSettings,
      isSummary: inputData.current.isSummary,
    }
    const prior = {
      controlName: [data.productInfo.name],
      lotNumber: [data.lotInfo.lotNumber],
      productCustomName: data.productCustomName,
      levels: inputData.prior.levels,
      decimalPlaces: data.levelSettings.levels[0].decimalPlace,
      archived: data.isArchived,
      ruleSettings: inputData.prior.ruleSettings,
      isSummary: inputData.prior.isSummary,
    };
    return { current, prior };
  }

  addAuditTrailControl(labControls) {
    const controlName = [];
    const lotNumber = [];
    const customName = [];
    const currentData = this.appNavigationService.fetchData();
    labControls.map((value, j) => {
      controlName.push(labControls[j].lotInfo.productName);
      lotNumber.push(labControls[j].lotInfo.lotNumber);
      customName.push(labControls[j].productCustomName);
    })
    currentData.auditTrail.eventType = AuditTrackingAction.LabSetup,
      currentData.auditTrail.action = AuditTrackingAction.Add,
      currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Success
    currentData.auditTrail.currentValue.controlName = controlName;
    currentData.auditTrail.currentValue.lotNumber = lotNumber;
    currentData.auditTrail.currentValue.customName = customName;
    this.appNavigationService.logAuditTracking(currentData, true);
  }

  updateAuditTrailControl(labControls) {
    if (labControls) {
      const action = (this.isArchived) ? AuditTrackingAction.Archive : AuditTrackingAction.Update;
      const AnalyteSettingsValue: AuditTrailValueData = this.audiTrailCurrentPriorControl(labControls);
      const auditTrailPayload = this.appNavigationService.comparePriorAndCurrentValues(AnalyteSettingsValue.current,
        AnalyteSettingsValue.prior, action, AuditTrackingAction.LabSetup, AuditTrackingActionStatus.Success);
      this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    }
  }

  saveLabConfigurationControlSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigControlActions.saveControlSuccess.type),
      map(action => action.labControls),
      flatMap((labControls: LabProduct[]) => {
        return forkJoin([
          of(labControls),
          this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode), take(1)),
          this.store.pipe(select(sharedStateSelector.getCurrentLabLocation), take(1))
        ]);
      }),
      tap(([labControls, selectedNode, location]) => {
        if (labControls) {
          const sortedLabControls = this.navigationService.sortNavItems(labControls);
          const firstControl = first(sortedLabControls);
          if (firstControl) {
            const nodeType = firstControl ? firstControl.nodeType : selectedNode.nodeType;
            const parentNodeId = firstControl ? firstControl.parentNodeId : selectedNode.parentNodeId;
            this.navigationService.setSelectedNodeById(Utility.getParentNodeType(nodeType,
              location.locationSettings.instrumentsGroupedByDept),
              parentNodeId, () => {
                this.store.dispatch(NavBarActions.setNodeItems({ nodeType: firstControl.nodeType, id: firstControl.id }));
              });
          }
        }
        if (labControls[0].typeOfOperation) {
          this.updateAuditTrailControl(labControls);
        } else {
          this.addAuditTrailControl(labControls);
        }
      })
    ),
    { dispatch: false }
  );

  saveLabConfigurationControlFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigControlActions.saveControlFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  deleteLabConfigurationControl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigControlActions.deleteControl.type),
      map(action => action.control),
      flatMap((labControl: LabProduct) => {
        return this.portalApiService.deleteLabSetupNode(labControl.nodeType, labControl.id).pipe(
          map((_labControl: boolean) => {
            return LabConfigControlActions.deleteControlSuccess({ control: labControl });
          }),
          catchError((error) => {
            return of(LabConfigControlActions.deleteControlFailure({ error }));
          })
        );
      })
    )
  );

  // TODO: Standardize this logic place for all nodes accepting node id, leaf and perform the deleting and updating nodes

  deleteLabConfigurationControlSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigControlActions.deleteControlSuccess.type),
      map(action => action.control),
      flatMap((control) => {
        return forkJoin([of(control), this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode), take(1)),
        this.store.pipe(select(sharedStateSelector.getCurrentLabLocation), take(1))]);
      }),
      tap(([control, currentlySelectedNode, location]) => {
        if (currentlySelectedNode.nodeType === EntityType.LabProduct) {
          this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: null }));
          this.store.dispatch(NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem: null }));
          const navigateToControl = (() => {
            const url = `${unRouting.labSetup.lab}/${unRouting.labSetup.controls}/${control.parentNodeId}/${unRouting.labSetup.settings}`;
            return () => { this.navigationService.navigateToUrl(url, false, currentlySelectedNode, control.parentNodeId); };
          })();
          if (currentlySelectedNode && currentlySelectedNode.children === null) {
            this.navigationService.setSelectedNodeById(Utility.getParentNodeType(currentlySelectedNode.nodeType,
              location.locationSettings?.instrumentsGroupedByDept), currentlySelectedNode.parentNodeId, () => {
                this.store.dispatch(NavBarActions.removeItemsFromCurrentBranch({ 'item': currentlySelectedNode }));
                this.store.dispatch(NavBarActions.setNodeItems({
                  nodeType: EntityType.LabInstrument, id: currentlySelectedNode.parentNodeId
                }));
                this.store.dispatch(NavBarActions.setNodeFirstLeftNavItemSelected({
                  nodeType: EntityType.LabInstrument,
                  id: control.parentNodeId
                }));
                navigateToControl();
              });
          } else {
            this.store.dispatch(NavBarActions.setNodeFirstLeftNavItemSelected({
              nodeType: EntityType.LabInstrument,
              id: control.parentNodeId
            }));
          }
        }
      })
    ),
    { dispatch: false }
  );

  deleteLabConfigurationControlFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigControlActions.deleteControlFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  addCustomControl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigControlActions.addCustomControl.type),
      map(action => action.customControlEmitter),
      flatMap((customControlEmitter: NonBrControlConfig) => {
        const productPayload = this.appNavigationService.includeATDataToPayload(customControlEmitter.request, AuditTrackingAction.Add,
        AuditTrackingActionStatus.Pending, AuditTrackingEvent.NBRControl);
        let _settings: Settings;
        let controls: LabProduct[];
        return this.portalApiService.postNonBrControlDefinitionsWithLabSetup(productPayload).pipe(
          flatMap((labControls: LabProduct[]) => {
            let entityIds = [];
            controls = labControls;
            _settings = cloneDeep(customControlEmitter.settings);
            entityIds = controls.map(element => element.id);
            _settings.entityIds = entityIds;
            const request = [];
            if (_settings.levelSettings && _settings.levelSettings.id === '') {
              request.push(this.spcRulesService.createSettings(_settings.entityType, _settings));
            }
            return forkJoin([
              this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn), take(1)),
              ...request
            ]);
          }),
          flatMap((response: Array<boolean | Settings>) => {
            return of(controls);
          }),
          map((labControls: LabProduct[]) => {
            //expected end result of adding custom control(when adding the control to labsetup) is same as adding a control to lab setup.
            return LabConfigControlActions.saveControlSuccess({ labControls });
          }),
          catchError((error) => {
            return of(LabConfigControlActions.saveControlFailure({ error }));
          })
        );
      }))
  );

  getLocationId(): string {
    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation)).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.locationId = res?.id;
    });
    return this.locationId;
  }
}
