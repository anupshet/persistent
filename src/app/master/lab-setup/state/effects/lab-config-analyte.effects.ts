// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import { of, forkJoin } from 'rxjs';
import { catchError, map, tap, flatMap, withLatestFrom, take } from 'rxjs/operators';
import { first, cloneDeep } from 'lodash';

import { LabConfigAnalyteActions } from '../actions';
import * as fromRoot from '../../../../state/app.state';
import { LabTest } from '../../../../contracts/models/lab-setup/test.model';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LabTestService } from '../../../../shared/services/test-run.service';
import { Analyte } from '../../../../contracts/models/lab-setup/analyte.model';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import * as actions from '../../state/actions';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { archiveState, entityId, includeArchivedItems, urlId, urltype } from '../../../../core/config/constants/general.const';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { Utility } from '../../../../core/helpers/utility';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrailValueData } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { SpcRulesComponent } from '../../components/spc-rules/spc-rules.component';

import { RemapAnalyteDialogComponent } from '../../../../shared/components/remap-analyte-dialog/remap-analyte-dialog.component';

@Injectable()
export class LabConfigAnalyteEffects {
  analyteForm: FormControl;
  _settingsNew: Settings;
  currentSelected: LabTest;
  public summaryDataEntry = true;

  auditTrailAddAnalyteCurrentValue: object = {};
  @ViewChild(SpcRulesComponent) spcRuleComponent: SpcRulesComponent;
  constructor(
    private actions$: Actions<LabConfigAnalyteActions.LabConfigAnalyteActionsUnion>,
    private store: Store<fromRoot.State>,
    private portalApiService: PortalApiService,
    private labTestService: LabTestService,
    private navigationService: NavigationService,
    private spcRulesService: SpcRulesService,
    private appLogger: AppLoggerService,
    private appNavigationService: AppNavigationTrackingService,
    public dialog: MatDialog,
  ) { }

  // TODO : Change it to accept an array after the backend is ready to accept an array of analytes
  // TODO : Also change the flatmap to switchMap or exhaustMap
  onSummaryDataEntryChange(arg: boolean) {
    this.summaryDataEntry = arg;
  }
  get archivedGetter() {
    return this.analyteForm ? this.analyteForm.get('archived') as FormControl : null;
  }
  get settingsNew() {
    return this._settingsNew;
  }
  get analyteFormLevels() {
    return this.analyteForm.get('defaultControls').get('levels') as FormControl;
  }
  saveLabConfigurationAnalyte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigAnalyteActions.saveAnalyte.type),
      map(action => action),
      flatMap((data) => {
        let analytes: LabTest[];
        return this.portalApiService.upsertLabSetupNodeBatch(data.analyteConfigEmitter.labAnalytes,
           data.analyteConfigEmitter.nodeType).pipe(
          flatMap((_analytes: LabTest[]) => {
            analytes = _analytes;
            let entityIds = [];
            const _settings = cloneDeep(data.analyteConfigEmitter.settings);
            entityIds = analytes.map(element => element.id);
            _settings.entityIds = entityIds;
            const request = [];
            if (_settings.levelSettings || _settings.ruleSettings || _settings.runSettings) {
              if (_settings.levelSettings && _settings.levelSettings.id === '') {
                if (_settings.hasOwnProperty(entityId)) {
                  delete _settings.entityId;
                }
                request.push(this.spcRulesService.postSettings(_settings.entityType, _settings));
              } else {
                _settings.entityId = _settings.entityIds[0]; // using 0th index as udpate settings only has one node to be updated.
                delete _settings.entityIds;
                request.push(this.spcRulesService.updateSettings(_settings.entityType, _settings));
              }
            }
            if (analytes && analytes.some(el => el.isRemapRequired === true)) {
              this.displayRemapAnalyteDialog();
            }
            return forkJoin([
              this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn), take(1)),
              ...request
            ]);
          }),
          flatMap((response: Array<boolean | Settings>) => {
            const isArchiveItemsToggleOn = response[0];
            const settings = response && response.length > 1 ? response.splice(1, response.length - 1) as Settings[] : [];
            const labSetupNodes = [];
            let isArchiveStateChanged = false;
            if (settings.length > 0 && data.analyteConfigEmitter.settings.hasOwnProperty(archiveState) &&
            data.analyteConfigEmitter.settings.archiveState !== ArchiveState.NoChange) {
              isArchiveStateChanged = true;
            }
            analytes.forEach(analyte => {
              if (!(isArchiveStateChanged && data.analyteConfigEmitter.settings.archiveState === ArchiveState.Archived &&
                !isArchiveItemsToggleOn)) {
                const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
                labSetupNodes.push(this.portalApiService.getLabSetupNode<LabTest>(
                  EntityType.LabTest, analyte.id, LevelLoadRequest.LoadChildren, EntityType.LabInstrument, [queryParameter]));
              } else {
                this.navigationService.gotoDashboard();
                return;
              }
            });
            return forkJoin([...labSetupNodes]);
          }),
          map((labAnalytes: LabTest[]) => {
            labAnalytes.map((value, j) => {
              labAnalytes[j].typeOfOperation = data.analyteConfigEmitter.typeOfOperation;
            });
            this.auditTrailAddAnalyteCurrentValue = labAnalytes;
            return LabConfigAnalyteActions.saveAnalyteSuccess({ labAnalytes });
          }),
          catchError((error) => {
              if (!data.analyteConfigEmitter.typeOfOperation) {
                const currentData = this.appNavigationService.fetchData();
                currentData.auditTrail.eventType = AuditTrackingAction.LabSetup,
                  currentData.auditTrail.action = AuditTrackingAction.Add,
                  currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Failure,
                  currentData.auditTrail.currentValue.analyteName = [data.generateAnalyteFailATpayload.analytes[0].reagentName],
                  currentData.auditTrail.currentValue.calibratorName = [data.generateAnalyteFailATpayload.analytes[0].calibratorName],
                  currentData.auditTrail.currentValue.method = [data.generateAnalyteFailATpayload.analytes[0].methodName],
                  currentData.auditTrail.currentValue.unit = [data.generateAnalyteFailATpayload.analytes[0].storageUnitName],
                  this.appNavigationService.logAuditTracking(currentData, true);

              } else {
                const AnalyteSettingsValue: AuditTrailValueData = this.audiTrailCurrentPriorFailATPayoad(data);
                const statusFail = this.appNavigationService.comparePriorAndCurrentValues(AnalyteSettingsValue.current,
                  AnalyteSettingsValue.prior, AuditTrackingAction.Update, AuditTrackingAction.LabSetup, AuditTrackingActionStatus.Failure);
                this.appNavigationService.logAuditTracking(statusFail, true);
              }
              return of(LabConfigAnalyteActions.saveAnalyteFailure({ error }));
            })
          );
      })
    )
  );

  loadLabConfigurationAnalyteList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigAnalyteActions.loadAnalyteList.type),
      map(action => action),
      flatMap((data: any) => {
        return this.labTestService.getAnalytes(data.productMasterLotId, data.instrumentId).pipe(
          map((analytes: Analyte[]) => LabConfigAnalyteActions.loadAnalyteListSuccess({ analytes })),
          catchError(error => of(LabConfigAnalyteActions.loadAnalyteListFailure({ error })))
        );
      })
    )
  );
  compareInputData() {
    let currentRuleSettings = [];
    currentRuleSettings = this.appNavigationService.spcRuleComponent.spcRulesForm.value.ruleSettings;
    let priorRuleSettings = cloneDeep(this.appNavigationService.spcRuleComponent.ruleSettings);
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
    return { ruleSettingsdata, currentRuleSettings };
  }

  audiTrailCurrentPriorData(labAnalytes): AuditTrailValueData {
    const data = this.compareInputData();
    const priorAnalyteValues = this.appNavigationService.currentSelected;
    const currentAnalyteValues = labAnalytes[0];
    const currentLeveldata = this.appNavigationService?.analyteForm?.value?.defaultControls?.levels;
    const leveldata = priorAnalyteValues?.levelSettings?.levels?.map(element => element.levelInUse);
    const priorLeveldata = currentLeveldata?.map((a, i) => leveldata[i] !== undefined ? leveldata[i] : false);
    const current = {
      regentManufacturerName: currentAnalyteValues.testSpecInfo.reagentManufacturerName,
      regentName: currentAnalyteValues.testSpecInfo.reagentName,
      regentLotNumber: currentAnalyteValues.testSpecInfo.reagentLotNumber,
      calibratorManufacturerName: currentAnalyteValues.testSpecInfo.calibratorManufacturerName,
      calibratorName: currentAnalyteValues.testSpecInfo.calibratorName,
      calibratorLotNumber: currentAnalyteValues.testSpecInfo.calibratorLotNumber,
      method: currentAnalyteValues.testSpecInfo.methodName,
      unit: currentAnalyteValues.labUnitId,
      isSummary: currentAnalyteValues.levelSettings.dataType === 1 ? true : false,
      isArchived: currentAnalyteValues.isArchived,
      decimalPlaces: currentAnalyteValues.levelSettings.levels[0].decimalPlace,
      levels: currentLeveldata,
      ruleSetting: data.currentRuleSettings
    };
    const prior = {
      regentManufacturerName: priorAnalyteValues.testSpecInfo.reagentManufacturerName,
      regentName: priorAnalyteValues.testSpecInfo.reagentName,
      regentLotNumber: priorAnalyteValues.testSpecInfo.reagentLotNumber,
      calibratorManufacturerName: priorAnalyteValues.testSpecInfo.calibratorManufacturerName,
      calibratorName: priorAnalyteValues.testSpecInfo.calibratorName,
      calibratorLotNumber: priorAnalyteValues.testSpecInfo.calibratorLotNumber,
      method: priorAnalyteValues.testSpecInfo.methodName,
      unit: priorAnalyteValues.labUnitId,
      isSummary: priorAnalyteValues.levelSettings.dataType === 1 ? true : false,
      isArchived: priorAnalyteValues.isArchived,
      decimalPlaces: priorAnalyteValues.levelSettings.levels[0].decimalPlace,
      levels: priorLeveldata,
      ruleSetting: data.ruleSettingsdata
    };
    return { current, prior };
  }

  audiTrailCurrentPriorFailATPayoad(analyte): AuditTrailValueData {
    const analyteData = analyte.generateAnalyteFailATpayload;
    const data = this.compareInputData();
    const priorAnalyteValues = this.appNavigationService.currentSelected;
    const currentAnalyteValues = analyte.analyteConfigEmitter;
    const currentLeveldata = this.appNavigationService?.analyteForm?.value?.defaultControls?.levels;
    const leveldata = priorAnalyteValues?.levelSettings?.levels.map(element => element.levelInUse);
    const priorLeveldata = currentLeveldata.map((a, i) => leveldata[i] !== undefined ? leveldata[i] : false);

    const current = {
      regentManufacturerName: analyteData.analytes[0].reagentManufacturerName,
      regentName: analyteData.analytes[0].reagentName,
      regentLotNumber: analyteData.analytes[0].reagentLotNumber,
      calibratorManufacturerName: analyteData.analytes[0].calibratorManufacturerName,
      calibratorName: analyteData.analytes[0].calibratorName,
      calibratorLotNumber: analyteData.analytes[0].calibratorLotNumber,
      method: analyteData.analytes[0].methodName,
      unit: analyteData.analytes[0].storageUnitName,
      isSummary: currentAnalyteValues.settings?.levelSettings.isSummary,
      isArchived: currentAnalyteValues.settings?.levelSettings.isArchived,
      decimalPlaces: currentAnalyteValues.settings?.levelSettings.decimalPlaces,
      levels: currentLeveldata,
      ruleSetting: data.currentRuleSettings
    };
    const prior = {
      regentManufacturerName: priorAnalyteValues.testSpecInfo.reagentManufacturerName,
      regentName: priorAnalyteValues.testSpecInfo.reagentName,
      regentLotNumber: priorAnalyteValues.testSpecInfo.reagentLotNumber,
      calibratorManufacturerName: priorAnalyteValues.testSpecInfo.calibratorManufacturerName,
      calibratorName: priorAnalyteValues.testSpecInfo.calibratorName,
      calibratorLotNumber: priorAnalyteValues.testSpecInfo.calibratorLotNumber,
      method: priorAnalyteValues.testSpecInfo.methodName,
      unit: priorAnalyteValues.testSpecInfo.storageUnitName,
      isSummary: priorAnalyteValues.levelSettings.dataType === 1 ? true : false,
      isArchived: priorAnalyteValues.isArchived,
      decimalPlaces: priorAnalyteValues.levelSettings.levels[0].decimalPlace,
      levels: priorLeveldata,
      ruleSetting: data.ruleSettingsdata
    };
    return { current, prior };
  }

  updateAuditTrailAnalyte(analyte) {
    const AnalyteSettingsValue: AuditTrailValueData = this.audiTrailCurrentPriorData(analyte);
    if (analyte) {
      const currentData = this.appNavigationService.fetchData();
      const auditTrailPayload = this.appNavigationService.comparePriorAndCurrentValues(AnalyteSettingsValue.current,
        AnalyteSettingsValue.prior, AuditTrackingAction.Update, AuditTrackingAction.LabSetup, AuditTrackingActionStatus.Success);
      this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    }
  }

  addAuditTrailAnalyte(labAnalytes) {

    const name = [];
    const calibratorName = [];
    const unit = [];
    const method = [];
    const currentData = this.appNavigationService.fetchData();
    labAnalytes.map((value, j) => {
      name.push(labAnalytes[j].testSpecInfo.reagentName);
      calibratorName.push(labAnalytes[j].testSpecInfo.calibratorName);
      method.push(labAnalytes[j].testSpecInfo.methodName);
      unit.push(labAnalytes[j].testSpecInfo.storageUnitName);

    });
    currentData.auditTrail.eventType = AuditTrackingAction.LabSetup,
      currentData.auditTrail.action = AuditTrackingAction.Add,
      currentData.auditTrail.actionStatus = AuditTrackingActionStatus.Success,
      currentData.auditTrail.currentValue.analyteName = name;
    currentData.auditTrail.currentValue.calibratorName = name;
    currentData.auditTrail.currentValue.method = method;
    currentData.auditTrail.currentValue.unit = unit;
    this.appNavigationService.logAuditTracking(currentData, true);
  }

  saveLabConfigurationAnalyteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigAnalyteActions.saveAnalyteSuccess.type),
      map(action => action.labAnalytes),
      withLatestFrom(
        this.store.pipe(select(fromNavigationSelector.getShowSettingsCurrentVal)),
        this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf)),
        this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode)),
        this.store.pipe(select(sharedStateSelector.getCurrentLabLocation)),
        this.store.pipe(select(fromSecuritySelector.getCurrentUser))),
      tap(([labAnalytes, showSettings, selectedLeaf, selectedNode, location, currentUser]) => {
        if (labAnalytes) {
          const firstAnalyte = first(this.navigationService.sortNavItems(labAnalytes));
          if (!selectedNode) {
            this.navigationService.setSelectedNodeById(selectedNode.nodeType, selectedNode.id, () => {
              const url = unRouting.dataManagement.data.replace(urlId, selectedNode.id).replace(urltype, selectedNode.nodeType.toString());
              this.navigationService.routeTo(url); // navigate to data table page as per the new updates from POs (bug: 217781)
            });
          } else {
            if (!showSettings) {
              const locationSettings = location && location.locationSettings;
              if (locationSettings && !locationSettings.isLabSetupComplete) {
                this.store.dispatch(
                  actions.LabSetupDefaultsActions
                    .saveAccountSettings({ accountSettings: { ...locationSettings, isLabSetupComplete: true }, navigate: false })
                );
                this.navigationService.navigateToFeedBackPage(selectedNode.id, showSettings, firstAnalyte.id);
              } else {
                if (selectedNode.nodeType === EntityType.LabTest && labAnalytes.length) {
                  this.navigationService.setSelectedNodeById(
                    Utility.getParentNodeType(selectedNode?.nodeType, selectedNode.accountSettings?.instrumentsGroupedByDept),
                    selectedNode.parentNodeId, () => { // get new data and update the state
                      // update state for leaf node i.e. new analyte
                      this.navigationService.setSelectedNodeById(labAnalytes[0].nodeType, labAnalytes[0].id, () => {
                        const url = unRouting.dataManagement.data
                          .replace(urlId, labAnalytes[0].id).replace(urltype, labAnalytes[0].nodeType.toString());
                        this.navigationService.routeTo(url); // navigate to data table page as per the new updates from POs (bug: 217781)
                      });
                    });
                } else {
                  this.navigationService.navigateToDashboard(currentUser.labLocationId, false);
                }
              }
            } else {
              // Saving settings
              // when analyte under panel then set selected node as panel otherwise
              const nodeId = (selectedNode.nodeType === EntityType.Panel) ? selectedNode.id : selectedLeaf.parentNodeId;
              const nodeType = (selectedNode.nodeType === EntityType.Panel) ? EntityType.Panel : EntityType.LabProduct;
              this.navigationService.setSelectedNodeById(nodeType, nodeId, () => {
                this.store.dispatch(NavBarActions.setNodeItems({ nodeType: EntityType.LabTest, id: firstAnalyte.id }));
              });
            }
          }
        }
        if (labAnalytes[0].typeOfOperation) {
          this.updateAuditTrailAnalyte(labAnalytes);
        } else {
          this.addAuditTrailAnalyte(labAnalytes);
        }
      })
    ),
    { dispatch: false }
  );

  saveLabConfigurationAnalyteFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigAnalyteActions.saveAnalyteFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  deleteAnalyte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigAnalyteActions.deleteAnalyte.type),
      map(action => action.analyte),
      flatMap((analyte: LabTest) => {
        return this.portalApiService.deleteLabSetupNode(analyte.nodeType, analyte.id).pipe(
          map((labAnalytes: boolean) => {
            return LabConfigAnalyteActions.deleteAnalyteSuccess({ analyte: analyte });
          }),
          catchError((error) => {
            return of(LabConfigAnalyteActions.deleteAnalyteFailure({ error }));
          })
        );
      })
    )
  );

  deleteAnalyteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigAnalyteActions.deleteAnalyteSuccess.type),
      map(action => action.analyte),
      withLatestFrom(this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode)),
        this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf))),
      tap(([analyte, currentlySelectedNode, currentlySelectedLeaf]) => {
        if (currentlySelectedLeaf.nodeType === EntityType.LabTest) {
          this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: null }));
          this.store.dispatch(NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem: null }));
          const navigateToAnalyte = (() => {
            const url = `${unRouting.labSetup.lab}/${unRouting.labSetup.analytes}/${analyte.parentNodeId}/${unRouting.labSetup.settings}`;
            return () => { this.navigationService.navigateToUrl(url, false, currentlySelectedNode, analyte.parentNodeId); };
          })();
          if (currentlySelectedNode.children.length === 1) {
            this.store.dispatch(NavBarActions.setNodeFirstLeftNavItemSelected({
              nodeType: EntityType.LabInstrument,
              id: currentlySelectedNode.parentNodeId
            }));
            navigateToAnalyte();
          } else {
            this.store.dispatch(NavBarActions.setNodeFirstLeftNavItemSelected({
              nodeType: EntityType.LabProduct,
              id: analyte.parentNodeId
            }));
          }
        }
      })
    ),
    { dispatch: false }
  );

  deleteAnalyteFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabConfigAnalyteActions.deleteAnalyteFailure.type),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  displayRemapAnalyteDialog() {
    const dialogRef = this.dialog.open(RemapAnalyteDialogComponent, {
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().pipe(take(1))
      .subscribe();
  }

}
