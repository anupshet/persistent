// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';

import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil, take, tap, flatMap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { LabDataApiService } from '../../../../shared/api/labDataApi.service';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { Reagent } from '../../../../contracts/models/codelist-management/reagent.model';
import { Unit } from '../../../../contracts/models/codelist-management/unit.model';
import { LabProduct, LabTest, TreePill } from '../../../../contracts/models/lab-setup';
import { Analyte } from '../../../../contracts/models/lab-setup/analyte.model';
import { CalibratorLot } from '../../../../contracts/models/lab-setup/calibrator-lot.model';
import { Calibrator } from '../../../../contracts/models/lab-setup/calibrator.model';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { Method } from '../../../../contracts/models/lab-setup/method.model';
import { ReagentLot } from '../../../../contracts/models/lab-setup/reagent-lot.model';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { Level, LevelSettingsDto } from '../../../../contracts/models/portal-api/level-test-settings.model';
import { Error } from '../../../../contracts/models/shared/error.model';
import {
  displayName, instrumentId, instrumentInfo, productMasterLotId, productLotLevels, minimumNumberPoints, includeArchivedItems
} from '../../../../core/config/constants/general.const';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../state';
import * as actions from '../../state/actions';
import * as fromSelector from '../../state/selectors';
import * as fromLabConfigSettingsSelector from '../../state/selectors';
import { TestSpec } from '../../../../contracts/models/portal-api/labsetup-data.model';
import * as fromSecurity from '../../../../security/state/selectors';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import { TreeNodesService } from '../../../../shared/services/tree-nodes.service';
import { SettingsParameter, Settings, AnalyteSettingsValues, AnalyteConfig } from '../../../../contracts/models/lab-setup/settings.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { AnalyteEntryComponent } from '../../components/analyte-entry/analyte-entry.component';

@Component({
  selector: 'unext-analyte-config-component',
  templateUrl: './analyte-config.component.html',
  styleUrls: ['./analyte-config.component.scss']
})
export class AnalyteConfigComponent implements OnInit, OnDestroy {
  @Input() showSettings: boolean;
  @Input() selectedNodeDisplayName: string;
  @ViewChild(AnalyteEntryComponent) analyteEntryObj: AnalyteEntryComponent;
  public errorMessage: string = null;
  public instrumentId: number;
  public instrumentName: string;
  public productMasterLotId: number;
  public analyteParentNodeId: string;
  public units: Array<Array<Unit>> = [];
  public allReagents: Array<Array<Reagent>> = [];
  public allCalibrators: Array<Array<Calibrator>> = [];
  public reagentLots: Array<Array<ReagentLot>> = [];
  public methods: Array<Array<Method>> = [];
  public calibratorLots: Array<Array<CalibratorLot>> = [];
  public manufacturer: Manufacturer = new Manufacturer();
  private destroy$ = new Subject<boolean>();
  public labConfigurationAnalytes: Analyte[] = [];
  public trackByReagentAndCalibratorLot: boolean;
  public levels: Array<Level> = [];
  public newLevels = [];
  public currentAnalyteId: number;
  public currentAnalyteInstrumentId: number;
  public currentAnalyteReagentId: number;
  public currentAnalyteCalibratorId: number;
  public dataTableUrl: string;
  public testId: string;
  public isSummary: boolean;
  public selectedData: any;
  public selectedAnalyte: LabTest;
  public showAnalyteData: any;
  public duplicateAnalytes: Array<number> = [];  // list of analyte ids that indicates duplicate configurations by testspec
  public existingAnalyteTestSpecs: Array<TestSpec> = [];
  public isParentArchived: boolean;
  hasAnalyteDataPoints = true;
  labConfigAnalytes$ = this.store.pipe(select(fromSelector.getAnalyteState));
  securityDirectory$ = this.store.pipe(select(fromSecurity.getDirectory));
  currentSelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  currentSelectedBranch$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  currentSelectedLeaf$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  public settingsAnalyte$ = this.store.pipe(select(fromLabConfigSettingsSelector.getSettings));
  public labConfigAnalyteFloatPoint$ = this.store.pipe(select(fromLabConfigSettingsSelector.getFloatPointDetails));
  public getArchiveToggle$ = this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn));
  public notFirstTime: boolean;
  public titleDisplayName: string;
  currentSelected: LabTest;
  currentSelectedNode: TreePill;
  public errorObject: Error;
  settingsNew: Settings;
  public levelSettings: LevelSettingsDto = new LevelSettingsDto();
  public producLots = [];
  floatPointData: number;
  showArchivedFilterToggle = false;
  isToggledToNotArchived: boolean;
  analytes: TestSpec[] = [];
  constructor(
    private router: Router,
    private codeListService: CodelistApiService,
    private dateTimeHelper: DateTimeHelper,
    private store: Store<fromRoot.LabSetupStates>,
    private portalApiService: PortalApiService,
    private labDataService: LabDataApiService,
    private treeNodesService: TreeNodesService,
    private errorLoggerService: ErrorLoggerService,
  ) {
    if (this.router.events) {
      this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
        try {
          if (event instanceof NavigationEnd && this.router.url.includes('analytes')) {
            if (!this.showSettings && this.notFirstTime) {
              this.initialize();
            }
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.AnalyteConfigComponent + blankSpace + Operations.FormInitialization)));
        }
      });
    }
  }

  ngOnInit() {
    this.newLevels = [];
    this.initialize();
    this.notFirstTime = true;
    this.labConfigAnalyteFloatPoint$.pipe(filter(floatData => !!floatData), takeUntil(this.destroy$))
      .subscribe(floatData => {
        this.floatPointData = floatData;
      });
  }

  public initialize() {
    try {
      this.securityDirectory$.pipe(filter(result => !!result), take(1))
        .subscribe(result => {
          if (result && result.accountSettings) {
            this.trackByReagentAndCalibratorLot = result.accountSettings.trackReagentCalibrator;
          }
        });
      // check for any error occured during add or update
      this.labConfigAnalytes$.pipe(filter(result => !!result), takeUntil(this.destroy$))
        .subscribe(result => {
          if (result && result.error) {
            const _errorObject = Object.assign({}, result.error);
            this.errorObject = _errorObject;
          }
        });
      if (!this.showSettings) {
        this.allReagents = [];
        this.units = [];
        this.loadHeaderTitleData();
      } else {
        this.loadCurrentNodeAndLeaf();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.FormInitialization)));
    }
  }

  loadAnalytes() {
    this.labConfigAnalytes$.pipe(filter(result => !!result.analytes), takeUntil(this.destroy$))
      .subscribe(result => {
        const _labConfigurationAnalytes = JSON.parse(JSON.stringify(result.analytes));
        this.labConfigurationAnalytes = _labConfigurationAnalytes;
      });
  }

  public onLoadUnits(index: number) {
    try {
      if (!this.units[index] && this.labConfigurationAnalytes.length) {
        if (!this.productMasterLotId) {
          this.getArchiveToggle$.pipe(take(1))
            .pipe(flatMap(isArchiveItemsToggleOn => {
              const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
              return this.portalApiService.getLabSetupNode(
                EntityType.LabProduct,
                this.analyteParentNodeId,
                LevelLoadRequest.None,
                EntityType.None,
                [queryParameter]);
            })).pipe(filter(productData => !!productData), take(1))
            .pipe(flatMap((productData: LabProduct) => {
              this.productMasterLotId = +productData.productMasterLotId;
              if (!this.instrumentId) {
                this.instrumentId = +productData.parentNodeId;
              }
              return this.codeListService.getUnits(
                this.productMasterLotId,
                this.labConfigurationAnalytes[index].id,
                this.instrumentId
              ).pipe(filter(units => !!units), takeUntil(this.destroy$));
            })).subscribe((units) => {
              const _units = Object.assign([], this.units);
              _units[index] = units;
              this.units = _units;
            });
        } else {
          this.codeListService.getUnits(
            this.productMasterLotId,
            this.labConfigurationAnalytes[index].id,
            this.instrumentId
          ).pipe(filter(units => !!units), takeUntil(this.destroy$))
            .subscribe((units: Unit[]) => {
              const _units = Object.assign([], this.units);
              _units[index] = units;
              this.units = _units;
            });
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.OnLoadUnits)));
    }
  }

  public onLoadReagents(index: number) {
    try {
      if (!this.productMasterLotId) {
        this.getArchiveToggle$.pipe(take(1))
          .pipe(flatMap(isArchiveItemsToggleOn => {
            const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
            return this.portalApiService.getLabSetupNode(
              EntityType.LabProduct,
              this.analyteParentNodeId,
              LevelLoadRequest.None,
              EntityType.None,
              [queryParameter]);
          })).pipe(filter(productData => !!productData), take(1))
          .pipe(flatMap((productData: LabProduct) => {
            this.productMasterLotId = +productData.productMasterLotId;
            if (!this.instrumentId) {
              this.instrumentId = +productData.parentNodeId;
            }
            return this.codeListService.getReagents(
              this.productMasterLotId,
              this.labConfigurationAnalytes[index].id,
              this.instrumentId
            ).pipe(filter(reagents => !!reagents), takeUntil(this.destroy$));
          })).subscribe((reagents: Reagent[]) => {
            const _allReagents = Object.assign([], this.allReagents);
            _allReagents[index] = reagents;
            this.allReagents = _allReagents;
          });
      } else {
        this.codeListService.getReagents(
          this.productMasterLotId,
          this.labConfigurationAnalytes[index].id,
          this.instrumentId
        ).pipe(filter(reagents => !!reagents), takeUntil(this.destroy$))
          .subscribe((reagents: Reagent[]) => {
            const _allReagents = Object.assign([], this.allReagents);
            _allReagents[index] = reagents;
            this.allReagents = _allReagents;
          });
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.OnLoadReagents)));
    }
  }

  public onLoadCalibrators(reagentId: number, index: number) {
    try {
      this.codeListService.getCalibrators(
        this.labConfigurationAnalytes[index].id,
        this.instrumentId,
        reagentId
      ).pipe(filter(calibrators => !!calibrators), takeUntil(this.destroy$))
        .subscribe((calibrators: Calibrator[]) => {
          const _allCalibrators = Object.assign([], this.allCalibrators);
          _allCalibrators[index] = calibrators;
          this.allCalibrators = _allCalibrators;
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.OnLoadCalibrators)));
    }
  }

  public onLoadReagentLots(reagentId: number, index: number) {
    try {
      const reagentLots$ = this.codeListService.getReagentLotsByReagentId(reagentId.toString());
      const methods$ = this.codeListService.getMethods(
        this.labConfigurationAnalytes[index].id,
        this.instrumentId,
        reagentId
      );

      reagentLots$.pipe(filter(reagentLots => !!reagentLots), takeUntil(this.destroy$))
        .subscribe((reagentLots: ReagentLot[]) => {
          reagentLots = reagentLots.filter(reagentlot => !this.dateTimeHelper.isExpired(reagentlot.shelfExpirationDate));
          reagentLots = reagentLots?.sort((a, b) => (a.lotNumber).localeCompare(b.lotNumber));

          const _reagentLots = Object.assign([], this.reagentLots);
          _reagentLots[index] = reagentLots;
          this.reagentLots = _reagentLots;
        });

      methods$.pipe(filter(methods => !!methods), takeUntil(this.destroy$))
        .subscribe((methods: Method[]) => {
          const _methods = Object.assign([], this.methods);
          _methods[index] = methods;
          this.methods = _methods;
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.OnLoadReagentLots)));
    }
  }

  public onLoadCalibratorLots(calibratorId: number, index: number) {
    try {
      const calibratoLots$ = this.codeListService.getCalibratorLotsByCalibratorId(calibratorId.toString());
      calibratoLots$.pipe(filter(calibratorLots => !!calibratorLots), takeUntil(this.destroy$))
        .subscribe((calibratorLots: CalibratorLot[]) => {
          calibratorLots = calibratorLots.filter(
            calibrator => !this.dateTimeHelper.isExpired(calibrator.shelfExpirationDate)
          );
          calibratorLots = calibratorLots.sort((a, b) =>
            this.dateTimeHelper.getDifferenceInDays(b.shelfExpirationDate, a.shelfExpirationDate));

          const _calibratorLots = Object.assign([], this.calibratorLots);
          _calibratorLots[index] = calibratorLots;
          this.calibratorLots = _calibratorLots;
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.OnLoadCalibratorLots)));
    }
  }

  saveLabConfigurationAnalyte(analyteEmitterValue: AnalyteSettingsValues) {
    try {
      const labAnalyteTestSpecInfo = analyteEmitterValue.analytes;
      const typeOfOperation = analyteEmitterValue.typeOfOperation;
      const settings = cloneDeep(analyteEmitterValue.settings);
      const labAnalytes: LabTest[] = [];
      const analyteEntryFormValues = labAnalyteTestSpecInfo;
      let returnedTestSpecArray: TestSpec[];
      if (labAnalyteTestSpecInfo.length > 0) {
        this.getArchiveToggle$.pipe(take(1))
          .pipe(flatMap(isArchiveItemsToggleOn => {
            const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
            return this.portalApiService.getLabSetupNode(
              EntityType.LabProduct,
              this.analyteParentNodeId,
              LevelLoadRequest.LoadChildren,
              EntityType.LabTest,
              [queryParameter]);
          }))
          .pipe(tap(async control => {
            let existingAnalyteTestSpecs = [];
            if (control && control.children && control.children.length > 0) {
              existingAnalyteTestSpecs = control && control.children.map((a: LabTest) => a.testSpecInfo);
            }

            let matchingTestSpecs = this.treeNodesService.getMatchingTestSpecs(existingAnalyteTestSpecs,
              analyteEntryFormValues);

            // Remove the selected analyte node's testspec from the matching testSpecs so it is not flagged as a duplicate error.
            if (this.selectedAnalyte) {
              const selectedAnalyteTestSpec =
                this.treeNodesService.getMatchingTestSpecs(matchingTestSpecs, [this.selectedAnalyte.testSpecInfo]);
              if (matchingTestSpecs && matchingTestSpecs.length > 0) {
                matchingTestSpecs = matchingTestSpecs.filter(testSpec => {
                  return testSpec !== selectedAnalyteTestSpec[0];
                });
              }
            }

            // If no matching testspecs found, then save.
            if (!matchingTestSpecs.length) {
              returnedTestSpecArray = await this.codeListService.postTestSpecsInBatchAsync(analyteEntryFormValues)
                .then(res => res)
                .catch(err => { throw err; });

              returnedTestSpecArray.forEach((testSpecReturned, i) => {
                const generatedAnalyteData = new LabTest();
                // tslint:disable-next-line:no-shadowed-variable
                const generateAnalyteFailATpayload = new TestSpec();
                generatedAnalyteData.testSpecId = testSpecReturned.id.toString();
                generatedAnalyteData.testId = testSpecReturned.testId.toString();
                generatedAnalyteData.labUnitId = analyteEntryFormValues[i].storageUnitId.toString();
                generatedAnalyteData.parentNodeId = this.analyteParentNodeId;
                generatedAnalyteData.nodeType = EntityType.LabTest;
                settings.entityType = EntityType.LabTest;
                // Pass this data to Fail AT payload
                generateAnalyteFailATpayload.calibratorName = testSpecReturned.calibratorName;
                generateAnalyteFailATpayload.reagentName = testSpecReturned.reagentName;
                generateAnalyteFailATpayload.storageUnitName = testSpecReturned.storageUnitName;
                generateAnalyteFailATpayload.methodName = testSpecReturned.methodName;
                generateAnalyteFailATpayload.calibratorManufacturerName = testSpecReturned.calibratorManufacturerName;
                generateAnalyteFailATpayload.reagentManufacturerName = testSpecReturned.reagentManufacturerName;
                generateAnalyteFailATpayload.reagentLotNumber = testSpecReturned.reagentLotNumber;
                generateAnalyteFailATpayload.calibratorLotNumber = testSpecReturned.calibratorLotNumber;

                // If we're in Settings mode, set node id and settings
                if (this.showSettings && this.testId && this.testId.length > 0) {
                  generatedAnalyteData.id = this.testId;
                }

                labAnalytes.push(generatedAnalyteData);
                this.analytes.push(generateAnalyteFailATpayload);
              });

              delete (settings['productLots']);
              settings.runSettings = {
                'minimumNumberOfPoints': settings.runSettings.minimumNumberOfPoints ?
                  settings.runSettings.minimumNumberOfPoints : minimumNumberPoints,
                'floatStatsStartDate': null
              };
              const analyteConfigEmitter: AnalyteConfig = { labAnalytes: labAnalytes, settings: settings,
                 nodeType: settings.entityType, typeOfOperation: typeOfOperation };
              const generateAnalyteFailATpayload: AnalyteSettingsValues = {
                analytes: this.analytes,
                settings: new Settings
              };
              this.store.dispatch(actions.LabConfigAnalyteActions.saveAnalyte({ analyteConfigEmitter, generateAnalyteFailATpayload }));
            } else {
              // If matching testspecs found, there are duplicates. Return analyte ids that correspond.
              this.duplicateAnalytes = matchingTestSpecs.map(testspec => testspec.analyteId);
            }
          }))
          .pipe(take(1))
          .subscribe();
      } else {
        settings.entityType = EntityType.LabTest;
        delete (settings['productLots']);
        settings.runSettings = {
          'minimumNumberOfPoints': settings.runSettings.minimumNumberOfPoints ?
            settings.runSettings.minimumNumberOfPoints : minimumNumberPoints,
          'floatStatsStartDate': null
        };
        this.store.dispatch(actions.LabConfigSettingsActions.setSettings({ settings: settings }));
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.SaveLabConfigurationAnalyte)));
    }
  }

  loadCurrentNodeAndLeaf() {
    this.currentSelectedBranch$.pipe(filter(currentBranch => !!currentBranch), take(1))
      .subscribe((currentBranch) => {
        const panel = currentBranch.filter(ele => ele.nodeType === EntityType.Panel);
        if (panel.length) {
          combineLatest([
            this.currentSelectedLeaf$,
            this.getArchiveToggle$
          ]).pipe(take(1)).subscribe(([currentSelectedLeaf, isArchiveItemsToggleOn]) => {
            const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
            this.portalApiService.getLabSetupNode(currentSelectedLeaf.nodeType, currentSelectedLeaf.id,
              LevelLoadRequest.None, EntityType.None, [queryParameter])
              .pipe(takeUntil(this.destroy$)).subscribe((parent: LabProduct) => {
                this.isParentArchived = !!parent.isArchived;
              });
          });
        } else {
          this.isParentArchived = (currentBranch && currentBranch.filter(ele => ele.nodeType === EntityType.LabProduct)[0]) ?
            currentBranch.filter(ele => ele.nodeType === EntityType.LabProduct)[0].isArchived : false;
        }
      });

    this.currentSelectedNode$
      .pipe(filter(currentSelectedNode => !!currentSelectedNode), take(1))
      .subscribe((currentSelectedNode) => {
        this.currentSelectedNode = currentSelectedNode;
        if (currentSelectedNode.nodeType === EntityType.LabProduct && currentSelectedNode.hasOwnProperty(productMasterLotId)) {
          this.setControlRelatedData();
        }
      });

    this.currentSelectedLeaf$
      .pipe(filter(currentSelectedLeaf => !!currentSelectedLeaf),
        take(1))
      .subscribe((currentSelected: LabTest) => {
        if (currentSelected) {
          this.currentSelected = currentSelected;
          this.testId = currentSelected.id;
          const currentLeafAnalyte = currentSelected.testSpecInfo;
          this.analyteParentNodeId = currentSelected.parentNodeId;
          this.loadCurrentAnalyteLeafData(currentSelected);
          this.newLevels = this.newLevels;
          this.labConfigurationAnalytes = [{ id: currentLeafAnalyte.analyteId, name: currentLeafAnalyte.analyteName }];
          const settingsParameter: SettingsParameter = {
            entityType: currentSelected.nodeType, entityId: currentSelected.id,
            parentEntityId: currentSelected.parentNodeId
          };
          this.store.dispatch(actions.LabConfigSettingsActions.getSettings({ settingsParameter }));

          // If selectedNode is Panel then get control data through API call from analyte's parentNodeId
          if (this.currentSelectedNode && this.currentSelectedNode.nodeType === EntityType.Panel) {
            this.getArchiveToggle$.pipe(take(1))
              .pipe(flatMap(isArchiveItemsToggleOn => {
                const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
                return this.portalApiService.getLabSetupNode(
                  EntityType.LabProduct,
                  this.analyteParentNodeId,
                  LevelLoadRequest.LoadChildren,
                  EntityType.None,
                  [queryParameter]);
              }))
              .pipe(filter(productData => !!productData), take(1))
              .subscribe((productDetails) => {
                this.currentSelectedNode = productDetails;
                if (productDetails.nodeType === EntityType.LabProduct && productDetails.hasOwnProperty(productMasterLotId)) {
                  this.setControlRelatedData();
                }
              });
          }
        }
      });
  }

  setControlRelatedData() {
    this.productMasterLotId = this.currentSelectedNode[productMasterLotId];
    this.analyteParentNodeId = this.currentSelectedNode.id;
    this.existingAnalyteTestSpecs = this.currentSelectedNode.children
      ? this.currentSelectedNode.children.map((a: LabTest) => a.testSpecInfo) : [];
    this.loadSettings(this.currentSelectedNode[productLotLevels]);
  }

  loadCurrentAnalyteLeafData(currentSelected: LabTest) {
    const currentLeafAnalyte = currentSelected.testSpecInfo;
    this.selectedAnalyte = currentSelected;
    this.currentAnalyteId = currentLeafAnalyte.analyteId;
    this.instrumentId = currentLeafAnalyte.instrumentId;
    this.instrumentName = currentLeafAnalyte.instrumentName;

    this.selectedData = {
      selectedAnalyteReagentId: currentLeafAnalyte.reagentId,
      selectedAnalyteCalibratorId: currentLeafAnalyte.calibratorId,
      selectedAnalyteReagentLotId: currentLeafAnalyte.reagentLotId,
      selectedAnalyteCalibratorLotId: currentLeafAnalyte.calibratorLotId,
      selectedAnalyteMethodId: currentLeafAnalyte.methodId,
      selectedAnalyteUnitId: currentSelected.labUnitId,
      selectedAnalyteReagentManufacturerId: currentLeafAnalyte.reagentManufacturerId,
      selectedAnalyteCalibratorManufacturerId: currentLeafAnalyte.calibratorManufacturerId,
      isArchived: currentSelected.isArchived
    };

    // Check for data and if it exists, disable summary-point toggle.
    if (currentSelected.levelSettings && currentSelected.levelSettings.dataType) {
      this.labDataService.getSummaryDataByLabTestIdsAsync([currentSelected.id], 1)
        .then(data => {
          this.hasAnalyteDataPoints = data.length > 0 && data[0].results && data[0].results.length > 0;
        });
    } else {
      this.labDataService.getRunDataByLabTestIdsAsync([currentSelected.id])
        .then(data => {
          this.hasAnalyteDataPoints = data.length > 0 && data[0].results && data[0].results.length > 0;
        });
    }
  }

  loadHeaderTitleData() {
    combineLatest(
      this.currentSelectedNode$,
      this.currentSelectedBranch$,
      this.currentSelectedLeaf$
    ).pipe(take(1)).subscribe(([currentSelectedNode, currentBranch, currentSelectedLeaf]) => {
      const currentBranchData = currentBranch;
      let _instrumentInfo;
      let node: TreePill;
      if (currentSelectedNode && currentSelectedNode.nodeType === EntityType.LabProduct
        && currentSelectedNode.hasOwnProperty(productMasterLotId)) {
        this.existingAnalyteTestSpecs = currentSelectedNode.children
          ? currentSelectedNode.children.map((a: LabTest) => a.testSpecInfo) : [];
        currentBranch = currentBranch.filter(ele => ele.nodeType === EntityType.LabInstrument);
        this.instrumentId = Number(currentBranch[0] ? currentBranch[0][instrumentId] : 0);
        this.instrumentName = currentBranch[0] ? currentBranch[0][displayName] : '';
        _instrumentInfo = currentBranch[0] ? currentBranch[0][instrumentInfo] : null;
        node = currentSelectedNode;
        this.currentSelectedNode = currentSelectedNode;
        this.isParentArchived = currentSelectedNode.isArchived;
      } else if (currentSelectedNode && currentSelectedNode.nodeType === EntityType.LabInstrument) {
        this.instrumentId = Number(currentSelectedNode[instrumentId]);
        this.instrumentName = currentSelectedNode[displayName];
        _instrumentInfo = currentSelectedNode[instrumentInfo];
        node = currentSelectedNode;
      }
      if (currentSelectedLeaf && currentSelectedLeaf.nodeType === EntityType.LabProduct
        && currentSelectedLeaf.hasOwnProperty(productMasterLotId)) {
        node = currentSelectedLeaf;
      }
      if (node) {
        this.titleDisplayName = node.displayName;
        this.manufacturer = {
          manufacturerId: _instrumentInfo ? _instrumentInfo.manufacturerId : '',
          name: _instrumentInfo ? _instrumentInfo.manufacturerName : ''
        };
        this.productMasterLotId = node[productMasterLotId];
        const selectedNode = currentBranchData.find(ele => ele.nodeType === EntityType.LabProduct);
        this.analyteParentNodeId = node.nodeType === EntityType.LabProduct ? node.id : selectedNode?.id;
        if (EntityType.LabProduct) {
          this.titleDisplayName = selectedNode?.displayName;
        }
        if (node.levelSettings) {
          this.getLevelsettings();
        } else {
          // to get levelsettings from product require test settings API call
          this.portalApiService.getLabSetupNode(node.nodeType, node.id, LevelLoadRequest.None)
            .pipe(filter(productData => !!productData), take(1))
            .subscribe((productDetails) => {
              this.getLevelsettings(); // Might be removed later after thorough testing
            });
        }
        const settingsParameter: SettingsParameter = { entityType: node.nodeType, entityId: node.id, parentEntityId: node.parentNodeId };
        this.store.dispatch(actions.LabConfigSettingsActions.getSettings({ settingsParameter }));
      }
      if ((currentSelectedLeaf && currentSelectedLeaf[productLotLevels]) || (currentSelectedNode && currentSelectedNode[productLotLevels])){
        const currentNode = (currentSelectedNode && currentSelectedNode[productLotLevels]) ? currentSelectedNode : currentSelectedLeaf;
        this.loadSettings(currentNode[productLotLevels], currentNode.levelSettings ?
          currentNode.levelSettings.levels[0].decimalPlace : null);
      } else {
        const urlParts = this.router.url.split('/');
        const analyteId = urlParts[urlParts.length - 2];
        const selectedAnalyte = currentSelectedNode.children?.find(ele => ele.id === analyteId);
        this.loadSettings(selectedAnalyte[productLotLevels], selectedAnalyte.levelSettings ?
          selectedAnalyte.levelSettings.levels[0].decimalPlace : null);
      }
    });
  }

  getLevelsettings() {
    if (this.productMasterLotId && this.instrumentId) {
      this.loadAnalytesIntoStore(this.productMasterLotId, this.instrumentId);
    }
  }

  loadAnalytesIntoStore(_productMasterLotId: number, _instrumentId: number) {
    try {
      this.store.dispatch(
        actions.LabConfigAnalyteActions.loadAnalyteList({ productMasterLotId: _productMasterLotId, instrumentId: _instrumentId })
      );
      this.loadAnalytes();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.LoadAnalytesIntoStore)));
    }
  }

  onDeleteAnalyte() {
    try {
      this.store.dispatch(actions.LabConfigAnalyteActions.deleteAnalyte({ analyte: this.currentSelected }));
      // Manually invoking navigation state since datatable routing messes up with nav state sometimes
      // TODO : Might need to revisit after removing all ngRedux
      this.store.dispatch(NavBarActions.setShowSettings({ showSettings: false }));
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteConfigComponent + blankSpace + Operations.OnDelete)));
    }
  }

  setErrorMessage(data: Error) {
    data = null;
    this.errorMessage = data ? data.error : null;
  }

  loadSettings(productLots, decimalPlace?) {
    this.settingsAnalyte$
      .pipe(filter(settings => !!settings), takeUntil(this.destroy$))
      .subscribe(settings => {
        this.producLots = productLots;
        const settingsTemp = cloneDeep(settings);
        settingsTemp['productLots'] = this.producLots;
        if (settingsTemp.levelSettings) {
          settingsTemp.levelSettings.decimalPlaces = decimalPlace ? decimalPlace : settings.levelSettings.decimalPlaces;
        }
        if (settingsTemp.archiveState === ArchiveState.NotArchived && this.analyteEntryObj) {
          this.analyteEntryObj.isToggledToNotArchived = false;
        }
        if (settingsTemp.levelSettings.id) {
          this.settingsNew = settingsTemp;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(actions.LabConfigAnalyteActions.clearError({ clearError: true }));
  }
}
