// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, OnChanges, ElementRef, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import * as ngrxStore from '@ngrx/store';
import { select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { filter, takeUntil, debounceTime, take } from 'rxjs/operators';
import { ReagentLot, CalibratorLot, ReagentCategory, TranslationLabels } from 'br-component-library';
import * as _ from 'lodash';
import * as fromRoot from '../../../../state/app.state';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import * as selectors from '../../../../shared/navigation/state/selectors';
import { Analyte } from '../../../../contracts/models/lab-setup/analyte.model';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { Unit } from '../../../../contracts/models/codelist-management/unit.model';
import { Reagent } from '../../../../contracts/models/codelist-management/reagent.model';
import { Method } from '../../../../contracts/models/lab-setup/method.model';
import { Calibrator } from '../../../../contracts/models/lab-setup/calibrator.model';
import { LevelLoadRequest, TestSpec } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { HeaderType } from '../../../../contracts/enums/lab-setup/header-type.enum';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { IconService } from '../../../../shared/icons/icons.service';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import {
  id as _id, unUnspecifiedEntry, decimalPlace, analyteAddLimit, level, used,
  defaultDecimalPlaceValue, includeArchivedItems, maxLengthForSearchAnalyte,
  minLengthForSearchAnalyte, analyteSearchFilterLength
} from '../../../../core/config/constants/general.const';
import { TreeNodesService } from '../../../../shared/services/tree-nodes.service';
import { EvaluationMeanSdConfigComponent } from '../../containers/evaluation-mean-sd-config/evaluation-mean-sd-config.component';
import { LabTest } from '../../../../contracts/models/lab-setup';
import { Settings, AnalyteSettingsValues } from '../../../../contracts/models/lab-setup/settings.model';
import { LevelDisplayItem } from '../../../../contracts/models/portal-api/level-test-settings.model';
import { SpcRulesComponent } from '../spc-rules/spc-rules.component';
import { getSettings } from '../../shared/lab-setup-helper';
import { UpdateSettingsDialogComponent } from '../update-settings-dialog/update-settings-dialog.component';
import { RuleName } from '../../../../contracts/enums/lab-setup/spc-rule-enums/rule-name.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { RequestNewConfigComponent } from '../../../../shared/components/request-new-config/request-new-config.component';
import { TemplateType } from '../../../../contracts/enums/lab-setup/template-type.enum';
import { NewRequestConfigType } from '../../../../contracts/enums/lab-setup/new-request-config-type.enum';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { Error } from '../../../../contracts/models/shared/error.model';
import { ErrorsInterceptor } from '../../../../contracts/enums/http-errors.enum';

@Component({
  selector: 'unext-analyte-entry-component',
  templateUrl: './analyte-entry.component.html',
  styleUrls: ['./analyte-entry.component.scss']
})
export class AnalyteEntryComponent implements OnInit, OnDestroy, OnChanges {
  public type = HeaderType;
  analytes: FormArray;
  analyteForm: FormGroup;
  analytesAddClicked = false;
  checked = true;
  levels: Array<LevelDisplayItem>;
  defaultLevels: Array<LevelDisplayItem>;
  public isSummary = true;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.delete[24],
    icons.menu[24],
    icons.close[24],
  ];
  isReagentMicroslide = false;
  public isSelectReagentLotsCheckboxSelectedByUser = false;
  public isSelectCalibratorLotsCheckboxSelectedByUser = false;

  private destroy$ = new Subject<boolean>();
  _settingsNew: Settings;
  disableRulesPristine = true;
  rulesPristine = true;
  isRulesFormValid = true;
  public analyteSearchFilter: string = '';
  @Input('settingsNew')
  set settingsNew(value: Settings) {
    if (value) {
      this._settingsNew = value;
      this.analyteForm?.get('defaultControls.decimalPlaces')?.setValue((this.settingsNew && this.settingsNew.levelSettings) ?
      this.settingsNew.levelSettings.decimalPlaces.toString() : defaultDecimalPlaceValue.toString());
      this.getLevelSettings(this.settingsNew.levelSettings, this.settingsNew['productLots']);
      this.analyteForm?.get('defaultControls.summaryDataEntry')?.setValue(this.summaryDataEntry);
      this.archivedGetter?.setValue(this.settingsNew.archiveState === 1 ? true : false);
    }
  }
  get settingsNew() {
    return this._settingsNew;
  }

  get archivedGetter() {
    return this.analyteForm ? this.analyteForm?.get('archived') as FormControl : null;
  }
  getLevelSettings(levelSettings, productLots) {
    try {
      if (levelSettings.levels)
        this.levels = levelSettings.levels;
      else {
        this.levels = [];
        for (let i = 0; i < productLots.length; i++) {
          const keyName = level + productLots[i].level + used;
          if (levelSettings) {
            const defaultValue = levelSettings[keyName];
            this.levels.push({ decimalPlace: productLots[i].level, levelInUse: defaultValue , disabled: false });
          }
          else {
            this.levels.push({ decimalPlace: productLots[i].level, levelInUse: false, disabled : false });
          }
        }
      }
      this.summaryDataEntry = levelSettings ? levelSettings.isSummary : true;
      this.onChangeLevelInUse();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.GetLevelSettings)));
    }
    this.defaultLevels = _.cloneDeep(this.levels);
  }

  @ViewChild(SpcRulesComponent) spcRuleComponent: SpcRulesComponent;

  public overlayHeight: string;
  public overlayWidth: string;
  public isToggledToNotArchived: boolean;
  onArchiveToggle(event, content) {
    if (event.checked && !this.isToggledToNotArchived) {
      const contentParent = content.offsetParent;
      const actionCard = contentParent.children[1];
      this.setWidthHeight(contentParent, actionCard);
    } else if (!event.checked && this.settingsNew && this.settingsNew.archiveState === 1) {
      this.isToggledToNotArchived = true;
    } else {
      this.isToggledToNotArchived = false;
      return false;
    }
  }

  setWidthHeight(parent, actionCard) {
    if (!this.isParentArchived) {
      this.overlayHeight = (parseInt(parent.clientHeight, 0) - parseInt(actionCard.clientHeight + 100, 0)).toString();
    } else {
      this.overlayHeight = parent.clientHeight;
    }
    this.overlayWidth = parent.offsetWidth;
  }


  @Input() showSettings: boolean;
  @Input() hasAnalyteDataPoints: boolean;
  @Input() floatPointData: number;
  @Input() isParentArchived: boolean;


  _errorObject: Error;
  get errorObject(): Error {
    return this._errorObject;
  }
  @Input('errorObject')
  set errorObject(value: Error) {
    this._errorObject = value;
    if (value) {
      this.isFormSubmitting = false;
    }

    // Unable to make the change at this time error
    this.isUnableToMakeTheChangeError = value?.error?.error === ErrorsInterceptor.labsetup135;

    // Changes not allowed error
    this.isChangesNotAllowedError = value?.error?.error === ErrorsInterceptor.labsetup136;
  }

  _units: Array<Array<Unit>> = [];
  public selectedUnitsData: Unit;
  get units(): Array<Array<Unit>> {
    return this._units;
  }

  @Input('units')
  set units(value: Array<Array<Unit>>) {
    try {
      this._units = value;
      if (this.showSettings && this.selectedData && this.units[0] && this.units[0].length) {
        this.selectedUnitsData = this.getSelectedDataByKey(this.selectedData.selectedAnalyteUnitId, this.units[0]);
        if (this.analytesGetter && this.selectedUnitsData) {
          this.getGroupAtIndex(0)?.get('analyteInfo.unit').setValue(this.selectedUnitsData);
        }
      }

      if (this.showSettings && this.selectedData && this.selectedData.selectedAnalyteUnitId) {
        this.setValuesByControlName('unit', this.selectedData.selectedAnalyteUnitId, this.units[0]);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SetUnits)));
    }
  }

  _allReagents: Array<Array<Reagent>> = [];
  public selectedReagentData: Reagent;
  get allReagents(): Array<Array<Reagent>> {
    return this._allReagents;
  }

  @Input('allReagents')
  set allReagents(value: Array<Array<Reagent>>) {
    try {
      const ids = _.difference(this.getIndexes(value), this.getIndexes(this.allReagents));
      this._allReagents = value;

      if (ids.length) {
        this.checkIsReagentMicroslide();
        if (this.showSettings && this.selectedData && this._allReagents && this._allReagents[0]) {
          this.selectedReagentData = this.getSelectedDataByKey(this.selectedData.selectedAnalyteReagentId, this._allReagents[0]);
        }
        this.getManufacturerFromReagentList(ids[0]);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SetAllReagents)));
    }
  }

  _allCalibrators: Array<Array<Calibrator>> = [];
  public selectedCalibratorData: Calibrator;
  get allCalibrators(): Array<Array<Calibrator>> {
    return this._allCalibrators;
  }

  @Input('allCalibrators')
  set allCalibrators(value: Array<Array<Calibrator>>) {
    try {
      const ids = _.difference(this.getIndexes(value), this.getIndexes(this.allCalibrators));
      this._allCalibrators = value;
      if (ids.length) {
        if (this.showSettings && this.selectedData && this._allCalibrators && this._allCalibrators[0]) {
          this.selectedCalibratorData = this.getSelectedDataByKey(this.selectedData.selectedAnalyteCalibratorId, this._allCalibrators[0]);
        }
        this.getManufacturerFromCalibratorList(ids[0]);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SetAllCalibrators)));
    }
  }

  _labConfigurationAnalytes: Array<Analyte> = [];
  get labConfigurationAnalytes(): Array<Analyte> {
    return this._labConfigurationAnalytes;
  }

  @Input('labConfigurationAnalytes')
  set labConfigurationAnalytes(value: Array<Analyte>) {
    try {
      this._labConfigurationAnalytes = value;
      if (!this.showSettings || !this.analytesGetter) {
        this.setInitForm();
        this.appNavigationService.analyteForm = this.analyteForm;
      }
      if (this.labConfigurationAnalytes && (this.analytesGetter && this.analytesGetter.length === 0)) {
        this.createInitModel(0, this.labConfigurationAnalytes.length);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SetLabConfigurationAnalytes)));
    }
  }

  _reagentLots: Array<Array<ReagentLot>> = [];
  public selectedReagentLotData: ReagentLot;
  get reagentLots(): Array<Array<ReagentLot>> {
    return this._reagentLots;
  }

  public isReagentLotNumberPresent: Array<boolean> = [];
  @Input('reagentLots')
  set reagentLots(value: Array<Array<ReagentLot>>) {
    try {
      this._reagentLots = value;
      // if no lot number then do not show the lot no input
      if (!this.showSettings) {
        this._reagentLots.forEach((element, index) => {
          // Bug fix 232185: Display reagent lot number for slidegen when only 1 reagent lot is available.
          if (element.length >= 1) {
            this.isReagentLotNumberPresent[index] = true;

            // If checkbox to select reagent lots is unchecked, then default to unspecified value.
            // Otherwise, user will see and select lot.
            if (!this.selectReagentLots) {
              const unspecifiedValue = element.find(rls => rls.lotNumber === unUnspecifiedEntry);
              if (!!unspecifiedValue) {
                this.getGroupAtIndex(index)?.get('analyteInfo.reagentLots').setValue(unspecifiedValue);
              }
            }
          } else {
            this.isReagentLotNumberPresent[index] = false;
          }
          this.updateReagentLotNumberSelection();
        });
      }

      if (this.showSettings && this.selectedData) {
        this.selectedReagentLotData = this.getSelectedDataByKey(this.selectedData.selectedAnalyteReagentLotId, this._reagentLots[0]);
        if (this.analytesGetter && this.selectedReagentLotData) {
          this.getGroupAtIndex(0)?.get('analyteInfo.reagentLots').setValue(this.selectedReagentLotData);
        }
      }

      if (this.showSettings && this.selectedData && this.selectedData.selectedAnalyteReagentLotId) {
        this.setValuesByControlName('reagentLots', this.selectedData.selectedAnalyteReagentLotId, this.reagentLots[0]);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SetReagentLots)));
    }
  }

  _methods: Array<Array<Method>> = [];
  public selectedMethodsData: Method;
  get methods(): Array<Array<Method>> {
    return this._methods;
  }

  @Input('methods')
  set methods(value: Array<Array<Method>>) {
    try {
      this._methods = value;
      if (this.showSettings && this.selectedData) {
        this.selectedMethodsData = this.getSelectedDataByKey(this.selectedData.selectedAnalyteMethodId, this._methods[0]);
        if (this.analytesGetter && this.selectedMethodsData) {
          this.getGroupAtIndex(0)?.get('analyteInfo.method').setValue(this.selectedMethodsData);
        }
      }

      if (this.showSettings && this.selectedData && this.selectedData.selectedAnalyteMethodId) {
        this.setValuesByControlName('method', this.selectedData.selectedAnalyteMethodId, this.methods[0]);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SetMethods)));
    }
  }

  _calibratorLots: Array<Array<CalibratorLot>> = [];
  public selectedCalibratorLotsData: CalibratorLot;
  get calibratorLots(): Array<Array<CalibratorLot>> {
    return this._calibratorLots;
  }

  public isCalibratorLotNumberPresent: Array<boolean> = [];
  @Input('calibratorLots')
  set calibratorLots(value: Array<Array<CalibratorLot>>) {
    try {
      this._calibratorLots = value;

      // if no lot number then do not show the lot no input
      if (!this.showSettings) {
        this._calibratorLots.forEach((element, index) => {
          if (element.length > 1) {
            this.isCalibratorLotNumberPresent[index] = true;

            // If checkbox to select calibrator lots is unchecked, then default to unspecified value.
            // Otherwise, user will see and select lot.
            if (!this.selectCalibratorLots) {
              const unspecifiedValue = element.find(rls => rls.lotNumber === unUnspecifiedEntry);
              if (!!unspecifiedValue) {
                this.getGroupAtIndex(index)?.get('analyteInfo.calibratorLots').setValue(unspecifiedValue);
              }
            }
          } else {
            this.isCalibratorLotNumberPresent[index] = false;
          }
        });
      }
      if (this.showSettings && this.selectedData) {
        this.selectedCalibratorLotsData = this.getSelectedDataByKey(
          this.selectedData.selectedAnalyteCalibratorLotId, this._calibratorLots[0]);
        if (this.analytesGetter && this.selectedCalibratorLotsData) {
          this.getGroupAtIndex(0)?.get('analyteInfo.calibratorLots').setValue(this.selectedCalibratorLotsData);
        }
      }

      if (this.showSettings && this.selectedData && this.selectedData.selectedAnalyteCalibratorLotId) {
        this.setValuesByControlName('calibratorLots', this.selectedData.selectedAnalyteCalibratorLotId, this.calibratorLots[0]);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SetCalibratorLots)));
    }
  }

  @Input() instrumentId: number;
  @Input() errorMessage: string;
  @Input() translationLabelDictionary: TranslationLabels;
  @Input() defaultManufacturer: Manufacturer;
  @Input() title: string;
  @Input() trackByReagentAndCalibratorLot: boolean;
  @Input() instrumentName: string;
  @Input() selectedData: any;
  @Input() controlId: string;
  @Input() duplicateAnalytes: Array<number>;  // Input from AnalyteConfigComponent that indicates duplicate configurations by testspec
  @Input() existingAnalyteTestSpecs: Array<TestSpec>;  // Existing testspecs for analytes already created
  @Input() currentSelected: LabTest;
  @Output() saveLabConfigurationAnalyte = new EventEmitter<AnalyteSettingsValues>();
  @Output() loadUnits = new EventEmitter<number>();
  @Output() loadReagents = new EventEmitter<number>();
  @Output() loadCalibrators = new EventEmitter();
  @Output() loadReagentLots = new EventEmitter();
  @Output() loadCalibratorLots = new EventEmitter();
  @Output() deleteAnalyteId = new EventEmitter<string>();

  public decimalPlace = decimalPlace;
  public manufacturersList: Manufacturer[];
  public labSetupAnalyteHeaderImage = 6;
  public reagentManufacturerPlaceholder: string;
  public reagentPlaceholder: string;
  public lotNumberPlaceholder: string;
  public calibratorManufacturerPlaceholder: string;
  public calibratorPlaceholder: string;
  public methodPlaceholder: string;
  public unitOfMeasurePlaceholder: string;
  public selectAllAnalytesCheck = false;
  public reagentErrorMsg: string;
  public calibratorErrorMsg: string;
  public methodErrorMsg: string;
  public unitErrorMsg: string;
  public isValidForm = false;
  public defaultReagents: boolean;
  public defaultCalibrators: boolean;
  isFormSubmitting = false;
  isUnableToMakeTheChangeError = false;
  isChangesNotAllowedError = false;
  public headerTitleSuffix: string;
  public headerTitleText = '';

  reagentManufacturers: Array<Array<Manufacturer>> = [];
  public selectedReagentManufacturerData: Manufacturer;
  reagents: Array<Array<Reagent>> = [];
  calibratorManufacturers: Array<Array<Manufacturer>> = [];
  public selectedCalibratorManufacturerData: Manufacturer;
  calibrators: Array<Array<Calibrator>> = [];
  public summaryDataEntry = true;
  public isReagentManufacturerPresent: Array<boolean> = [];
  public isCalibratorManufacturerPresent: Array<boolean> = [];
  readonly analyteAddLimit = analyteAddLimit;
  public totalAnalytesSelected: number;
  public notAllowedIndex: number = null;
  public selectReagentLots = false;
  public selectCalibratorLots = false;
  public sideNavItemsList: any;
  public occupiedReagentIds = [];
  public reagentFlag = [];
  public newRequestConfigType = NewRequestConfigType;
  public onReagentSelectData = {
    reagentId: null,
    index: null
  };
  permissions = Permissions;

  public getCurrentLabLocation$ = this.store.select(sharedStateSelector.getCurrentLabLocation);

  // Ensure at least one level-in-use is checked.
  levelsInUseValidator: ValidatorFn = (control: FormArray): ValidationErrors | null => {
    return (!this.levels || !this.levels.length || this.levels.filter(lvl => lvl.levelInUse).length === 0)
      ? { levelsInUseSelected: false }
      : null;
  }
  @ViewChild('content') content: ElementRef;
  public maxLengthForSearchAnalyte = maxLengthForSearchAnalyte;
  public minLengthForSearchAnalyte = minLengthForSearchAnalyte;
  public analyteSearchFilterLength = analyteSearchFilterLength;

  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private iconService: IconService,
    private spcRulesService: SpcRulesService,
    private treeNodesService: TreeNodesService,
    private portalApiService: PortalApiService,
    private updateSettingsDialog: MatDialog,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  get analytesGetter() {
    return this.analyteForm ? this.analyteForm.get('analytes') as FormArray : null;
  }

  ngOnInit() {
    this.appNavigationService.auditTrailViewData(AuditTrackingAction.Settings);
    this.populateLabels();
    this.headerTitleText = (this.title) ? this.headerTitleSuffix + ' ' + this.title : '';
    if (!this.showSettings && this.controlId) {
      this.fetchAllAnalytes();
    }
    this.appNavigationService.currentSelected = this.currentSelected;
    this.appNavigationService.archivedGetter = this.archivedGetter.value;
    this.appNavigationService.decimalPlaces = (parseInt(this.analyteForm.value.defaultControls.decimalPlaces));
    this.appNavigationService.controlsForm = this.analyteForm.value.defaultControls.levels;

    this.getSideNavItemsList();
    if (this.hasPermissionToAccess([Permissions.AnalyteAdd, Permissions.AnalyteEdit])) {
      this.analyteForm.enable();
    } else {
      this.analyteForm.disable();
    }
  }

  onSearchChange(searchValue: string): void {
    this.analyteSearchFilter = searchValue.toLowerCase();
  }

  isAnalyteVisible(analyteIndex: number) {
    if (this.analyteSearchFilter.length < minLengthForSearchAnalyte || this.labConfigurationAnalytes.length <= analyteIndex)
      return true;

    return this.labConfigurationAnalytes[analyteIndex].name.toLowerCase().includes(this.analyteSearchFilter);
  }

  showNoAnalytes() {
    if (this.analyteSearchFilter && this.analyteSearchFilter.length > analyteSearchFilterLength) {
      return this.labConfigurationAnalytes.some(analyte => analyte.name.toLowerCase().includes(this.analyteSearchFilter));
    } else {
      return true;
    };
  }

  getSideNavItemsList(): void {
    this.store.pipe(select(selectors.getCurrentlySelectedNode))
      .pipe(filter((selectedNode => !!selectedNode && !!selectedNode.children)), takeUntil(this.destroy$))
      .subscribe((selectedNode: TreePill) => {
        if (selectedNode && selectedNode.children) {
          this.sideNavItemsList = selectedNode.children;
          this.setOccupiedReagentIds();
        }
      });
  }

  setOccupiedReagentIds(): void {
    const itemList = this.sideNavItemsList;
    if (itemList && itemList.length) {
      for (let i = 0; i < itemList.length; i++) {
        // AJT bug fix 231798
        // using node type to skip population at control level
        // only populate at analyte level
        if (itemList[i].nodeType === EntityType.LabTest) {
          this.occupiedReagentIds.push(itemList[i].testSpecInfo.reagentLot.reagentId);
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.content && (this.isParentArchived || (this.settingsNew && this.settingsNew.archiveState === ArchiveState.Archived))) {
      const contentParent = this.content.nativeElement.offsetParent;
      const actionCard = contentParent.children[2];
      this.setWidthHeight(contentParent, actionCard);
    } else {
      this.overlayHeight = '0';
      this.overlayWidth = '0';
    }

    if (changes['hasAnalyteDataPoints']) {
      this.onReagentSelect(this.onReagentSelectData.reagentId, this.onReagentSelectData.index);
    }
    if (changes['showSettings']) {
      this.resetForm();
    }
  }

  createInitModel(startValue: number, delimiter: number) {
    for (let i = startValue; i < delimiter; i++) {
      this.addAnotherAnalyte();
    }
  }
  getGroupAtIndex(index: number): FormGroup {
    return (<FormGroup>this.analytesGetter.at(index));
  }

  addAnotherAnalyte(analyte?: boolean) {
    this.analytesGetter.push(this.createAnalyte(analyte));
    this.setReagentFlag();
    if (this.showSettings) {
      this.getGroupAtIndex(0)?.get('analyte').setValue(true);
      this.onSelectAnalyte(0);
    }
  }

  setReagentFlag(): void {
    for (let i = 0; i < this.analytesGetter.length; i++) {
      this.reagentFlag[i] = false;
    }
  }

  addAnalyteInfo(
    index?: number, reagentManufacturer?: string, reagents?: string, reagentLots?: string, calibratorManufacturer?: string,
    calibrator?: string, calibratorLots?: string, method?: string, unitOfMeasure?: string): void {
    const formGroup = this.getGroupAtIndex(index);
    formGroup.addControl
      ('analyteInfo', this.createAnalyteInfo(
        reagentManufacturer, reagents, reagentLots, calibratorManufacturer, calibrator, calibratorLots, method, unitOfMeasure, index
      ));

    // Subscribe to changes in value and run custom validation.
    formGroup.valueChanges.pipe(
      filter(val => val.analyte),
      debounceTime(100),
      takeUntil(this.destroy$)
    )
      .subscribe(val => {
        try {
          const analyteInfoFormGroup = formGroup.controls.analyteInfo as FormGroup;
          if (analyteInfoFormGroup) {
            analyteInfoFormGroup.controls.idx.updateValueAndValidity();
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
              (componentInfo.AnalyteEntryComponent + blankSpace + Operations.AddAnalyteInfo)));
        }
      });
  }

  createAnalyteInfo(
    reagentManufacturer?: string, reagents?: string, reagentLots?: string, calibratorManufacturer?: string,
    calibrator?: string, calibratorLots?: string, method?: string, unitOfMeasure?: string, idx?: number
  ): FormGroup {
    return this.formBuilder.group({
      reagentManufacturer: [reagentManufacturer || '', Validators.required],
      reagents: [reagents || '', Validators.required],
      reagentLots: [reagentLots || '', Validators.required],
      calibratorManufacturer: [calibratorManufacturer || '', Validators.required],
      calibrator: [calibrator || '', Validators.required],
      calibratorLots: [calibratorLots || '', Validators.required],
      method: [method || '', Validators.required],
      unit: [unitOfMeasure || '', Validators.required],
      idx: [idx, this.validateForNoDuplicateTestSpecs.bind(this)]
    });
  }

  createAnalyte(analyte?: boolean): FormGroup {
    return this.formBuilder.group({
      analyte: new FormControl(analyte || false)
    });
  }

  createDefaultInitControls(): FormGroup {
    return this.formBuilder.group({
      levels: new FormArray([], this.levelsInUseValidator),
      decimalPlaces: [(this.settingsNew && this.settingsNew.levelSettings) ?
        this.settingsNew.levelSettings.decimalPlaces.toString() : defaultDecimalPlaceValue.toString(),
      [Validators.required]],
      summaryDataEntry: new FormControl(this.settingsNew && this.settingsNew.levelSettings ?
        this.settingsNew.levelSettings.isSummary : true),
      defaultReagents: new FormControl(this.defaultReagents),
      defaultCalibrators: new FormControl(this.defaultCalibrators),
      selectAllAnalytes: new FormControl(false),
      selectReagentLots: new FormControl(this.selectReagentLots),
      selectCalibratorLots: new FormControl(this.selectCalibratorLots)
    });
  }

  // Hide and set reagent and calibrator lot as true if trackReagentCalibrator is true from account settings
  setReagentCalibratorValue() {
    let showReagentCalibratorCheckbox: boolean;
    this.getCurrentLabLocation$.pipe(filter(location => !!location), take(1))
      .subscribe(location => {
        if (location && location.locationSettings) {
          if (location.locationSettings.trackReagentCalibrator) {
            showReagentCalibratorCheckbox = false;
            this.selectReagentLots = true;
            this.analyteForm?.get('defaultControls.selectReagentLots').setValue(true);
            this.selectCalibratorLots = true;
            this.analyteForm?.get('defaultControls.selectCalibratorLots').setValue(true);
          } else {
            showReagentCalibratorCheckbox = true;
            this.selectReagentLots = this.isSelectReagentLotsCheckboxSelectedByUser || this.isReagentMicroslide ? true : false;
            this.selectCalibratorLots = this.isSelectCalibratorLotsCheckboxSelectedByUser ? true : false;
          }
        }
      });
    return showReagentCalibratorCheckbox;
  }

  onSubmit(formvalues: any, submitDataOnEvaluationPage?: boolean, typeOfOperation?: boolean) {
    try {
      this.appNavigationService.spcRuleComponent = this.spcRuleComponent;
      this.isUnableToMakeTheChangeError = false;
      this.isChangesNotAllowedError = false;
      this.allReagents = [];
      this.setReagentFlag();
      if (!submitDataOnEvaluationPage) {
        this.isFormSubmitting = true;
      }
      const labConfigFormValues = [];
      let analyteNodes: Array<TestSpec>;
      let newSettingsFormValue: Settings;
      const existingArchiveState = this.settingsNew.archiveState === ArchiveState.Archived ? true : false;

      if (formvalues.analytes && formvalues.analytes.length > 0) {
        formvalues.analytes.forEach((analyte, index) => {
          if (analyte.analyte === true) {
            const analyteData = {
              analyteId: this.labConfigurationAnalytes[index].id,
              calibratorId: analyte.analyteInfo.calibrator.id,
              calibratorLotId: analyte.analyteInfo.calibratorLots.id,
              reagentId: analyte.analyteInfo.reagents.id,
              reagentLotId: analyte.analyteInfo.reagentLots.id,
              storageUnitId: analyte.analyteInfo.unit.id,
              instrumentId: this.instrumentId,
              methodId: analyte.analyteInfo.method.id
            } as TestSpec;

            const decimalPlaces = +(formvalues && formvalues.defaultControls && formvalues.defaultControls.decimalPlaces);
            newSettingsFormValue = _.cloneDeep(this.settingsNew);
            newSettingsFormValue.levelSettings.decimalPlaces = decimalPlaces;
            this.levels.forEach((item) => {
              newSettingsFormValue.levelSettings[level + item.decimalPlace + used] = item.levelInUse;
            });
            if (this.showSettings) {
              if (existingArchiveState !== formvalues.archived) {
                newSettingsFormValue.archiveState = formvalues.archived ? ArchiveState.Archived : ArchiveState.NotArchived;
                const archiveAction = formvalues.archived ? AuditTrackingAction.Archive : AuditTrackingAction.Unarchive;
                this.archiveAuditTrailAnalyte(archiveAction);
              } else {
                newSettingsFormValue.archiveState = ArchiveState.NoChange;
              }
              newSettingsFormValue.runSettings.minimumNumberOfPoints = this.floatPointData;
              newSettingsFormValue.levelSettings.isSummary = (formvalues && formvalues.defaultControls.summaryDataEntry) ?
                formvalues.defaultControls.summaryDataEntry : false;
              this.spcRuleComponent.spcRulesForm.value.ruleSettings.forEach((value, key) => {
                if (this.spcRuleComponent.spcRulesForm.value.ruleSettings[key]['value'] !== null) {
                  this.spcRuleComponent.spcRulesForm.value.ruleSettings[key]['value'] = parseFloat(value.value);
                }
              });

              newSettingsFormValue = getSettings(newSettingsFormValue,
                this.spcRuleComponent.spcRulesForm.value.ruleSettings, this.settingsNew);
            } else {

              newSettingsFormValue.levelSettings.id = '';
              newSettingsFormValue.archiveState = ArchiveState.NoChange;
            }
            if (!this.showSettings || (this.showSettings && newSettingsFormValue.archiveState !== ArchiveState.NotArchived)) {
              labConfigFormValues.push(analyteData);
            }
          }
        });
      }
      analyteNodes = labConfigFormValues;
      if (submitDataOnEvaluationPage) {
        (!this.checkFormDefaultStatus() ?
          this.openEvaluationMeanSdDialog(newSettingsFormValue) : this.openEvaluationMeanSdDialog());
      } else {
        this.saveLabConfigurationAnalyte.emit({ analytes: analyteNodes, settings: newSettingsFormValue, typeOfOperation: typeOfOperation });
        this.isFormSubmitting = false;
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  greyOutForm() {
    return this.showSettings && (this.archivedGetter.value || this.isToggledToNotArchived || this.isParentArchived);
  }

  greyOutAddForm() {
    return !this.showSettings && this.isParentArchived;
  }

  hideArchiveToggle() {
    return this.showSettings && !this.isParentArchived;
  }

  setInitForm() {
    try {
      this.totalAnalytesSelected = 0;
      this.headerTitleText = '';
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.populateLabels();
        this.headerTitleText = (this.title) ? this.headerTitleSuffix + ' ' + this.title : '';
      });
      this.headerTitleText = (this.title) ? this.headerTitleSuffix + ' ' + this.title : '';
      this.isValidForm = false;
      if (!this.showSettings) {
        this.defaultReagents = true;
        this.defaultCalibrators = true;
      }

      if (this.analyteForm) {
        this.analyteForm.reset();
      }

      this.setReagentCalibratorValue();
      this.analyteForm = this.formBuilder.group({
        defaultControls: this.createDefaultInitControls(),
        analytes: new FormArray([]),
        archived: new FormControl(false)
      });
      //  remove the decimal places validations when settings is false
      if (!this.showSettings && this.analyteForm) {
        this.analyteForm?.get('defaultControls.decimalPlaces').clearValidators();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SetInitForm)));
    }
  }

  get analyteFormDefaultControls() {
    return this.analyteForm?.get('defaultControls') as FormGroup;
  }

  onSelectAnalyte(i: number) {
    try {
      this.isAnalyteSelected();
      if (this.getGroupAtIndex(i)?.get('analyte').value) {
        this.totalAnalytesSelected++;
        this.emitValues(i);
        this.addAnalyteInfo(i);
      } else {
        this.totalAnalytesSelected--;
        this.getGroupAtIndex(i).removeControl('analyteInfo');
        this.removeElements(i);
        this.checkIsReagentMicroslide();
        this.updateReagentLotNumberSelection();
      }
      this.reagentFlag[i] = false;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.OnSelectAnalyte)));
    }
  }

  checkSelectedAnalytesCount(index: number) {
    this.notAllowedIndex = (this.totalAnalytesSelected === analyteAddLimit &&
      !this.getGroupAtIndex(index)?.get('analyte').value) ? index : null;
  }

  private removeElements(index: number) {
    this.units[index] = undefined;
    this.allReagents[index] = undefined;
    this.allCalibrators[index] = undefined;
  }

  public onChangeLevelInUse(event?) {
    try {
      this.handleLevelsState();
      if (this.showSettings) {
        if (event) {
          this.spcRuleComponent.levelsInUse = 0;
          this.levels.forEach(ele => {
            if (ele.levelInUse === true) {
              this.spcRuleComponent.levelsInUse++;
            }
          });
          if (event.checked) {
            this.levelsCheckedDetails();
          } else if (this.spcRuleComponent.levelsInUse === 2 && this.summaryDataEntry === false) {
            // Bug fix 185733: Ensure level settings warning dialog is displayed only for Point data
            this.confirmationDialogRulesHiding(event);
          }
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.OnChangeLevelInUse)));
    }
  }

  levelsCheckedDetails() {
    this.spcRuleComponent.rules.find(rule => rule.name === RuleName._2of32s).isVisible = true;
    if (this.spcRuleComponent.levelsInUse <= 2) {
      this.spcRuleComponent.rules.find(rule => rule.name === RuleName._2of32s).isVisible = false;
    }
  }

  confirmationDialogRulesHiding(event) {
    try {
      this.spcRuleComponent.rules.find(rule => rule.name === RuleName._2of32s).isVisible = true;

      if (this.spcRuleComponent.levelsInUse <= 2) {
        const confirmDialogRef = this.updateSettingsDialog.open(
          UpdateSettingsDialogComponent,
          {
            width: '1017px',
            data: { message: this.getTranslation('ANALYTEENTRY.TRILEVEL') }
          }
        );
        confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.spcRuleComponent.rules.find(rule => rule.name === RuleName._2of32s).isVisible = false;
          } else {
            this.spcRuleComponent.rules.find(rule => rule.name === RuleName._2of32s).isVisible = true;
            event.source.checked = true;
          }
        });
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.ConfirmationDialogRulesHiding)));
    }
  }

  public handleLevelsState(): void {
    try {
      if (this.levels.filter(lvl => lvl.levelInUse).length === 1) {
        this.levels.forEach(lvl => {
            lvl.disabled = lvl.levelInUse;
        });
      } else {
        this.enableAllLevels();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.LevelsInUseDisable)));
    }
  }

  public enableAllLevels(): void {
    this.levels?.forEach(lvl => {
      lvl.disabled = false;
    });
  }

  private getIndexes(value: Array<any>) {
    return value.map((item, index) => item && item.length ? index : -1).filter(item => item >= 0);
  }

  onDefaultReagentManufacturerClick(e) {
    this.defaultReagents = e.checked;
    this.analytesGetter['controls'].forEach((value, key) => {
      if (value['controls'].analyte.value) {
        this.getManufacturerFromReagentList(key);
      }
    });
  }

  emitValues(index: number): void {
    this.loadUnits.emit(index);
    this.loadReagents.emit(index);
  }

  getManufacturerFromReagentList(index: number) {
    try {
      const tempAllReagent = Object.assign([], this.allReagents);
      this.reagentManufacturers[index] = [];
      this.reagents[index] = [];
      this.reagentLots[index] = [];
      this.methods[index] = [];
      // check if manufacturer present for the reagents
      this.isReagentManufacturerPresent[index] =
        tempAllReagent[index].find(r => r.manufacturerId === this.defaultManufacturer.manufacturerId);
      if (this.defaultReagents) {
        if (this.isReagentManufacturerPresent[index]) {
          tempAllReagent[index] = tempAllReagent[index].filter(r =>
            r.manufacturerId === this.defaultManufacturer.manufacturerId
          );
        }
      }
      tempAllReagent[index] = tempAllReagent[index].sort((a: Reagent, b: Reagent) => (a.name < b.name ? -1 : 1));
      const allReagentManufacturer = tempAllReagent[index].map(mp => {
        return { manufacturerId: mp.manufacturerId, name: mp.manufacturerName };
      });
      const manufacturerReagentFlag = {};
      this.reagentManufacturers[index] = allReagentManufacturer
        .filter(m => {
          if (manufacturerReagentFlag[m.manufacturerId]) {
            return false;
          } else {
            manufacturerReagentFlag[m.manufacturerId] = true;
            return true;
          }
        })
        .sort((a, b) => (a.name <= b.name ? -1 : 1));

      if (this.reagentManufacturers[index].length === 1) {
        this.getGroupAtIndex(index)?.get('analyteInfo.reagentManufacturer').setValue(this.reagentManufacturers[index][0]);
      }

      if (this.showSettings && this.selectedReagentData) {
        const tempSelectedManufacturer =
          this.getSelectedDataByKey(this.selectedReagentData.manufacturerId, tempAllReagent[0]);
        this.selectedReagentManufacturerData = {
          manufacturerId: tempSelectedManufacturer.manufacturerId,
          name: tempSelectedManufacturer.manufacturerName
        };

        this.setValuesByControlName('reagentManufacturer',
          this.selectedReagentManufacturerData.manufacturerId, this.reagentManufacturers[0]);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.GetManufacturerFromReagentList)));
    }
  }

  onReagentManufacturerSelect(manufacturerId: string, index: number): void {
    if (manufacturerId && this.allReagents && this.allReagents[index]) {
      this.reagents[index] = [];
      this.reagentLots[index] = [];
      this.methods[index] = [];
      this.reagents[index] = this.allReagents[index].filter(
        r => r.manufacturerId === manufacturerId
      );
    }

    if (this.showSettings && this.selectedData && this.selectedData.selectedAnalyteReagentId && this.reagents.length) {
      this.setValuesByControlName('reagents', this.selectedData.selectedAnalyteReagentId, this.reagents[0]);
    }
  }

  onReagentSelect(reagentId: number, index: number) {
    if (reagentId) {
      this.onReagentSelectData = {
        reagentId,
        index
      };
      this.checkIsReagentMicroslide(reagentId, index);
      this.showSettings ? this.valideReagentEdit(reagentId, index) : this.valideReagent(reagentId, index);
      this.allCalibrators[index] = undefined;
      this.loadReagentLots.emit({ reagentId, index });
      this.loadCalibrators.emit({ reagentId, index });
    }
  }

  valideReagentEdit(reagentId: number, index: number) {
    const itemList = this.sideNavItemsList;
    if (itemList && itemList.length) {
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].testSpecInfo) {
          if (itemList[i].testSpecInfo.analyteName === this.currentSelected.testSpecInfo.analyteName) {
            if (reagentId !== this.currentSelected.testSpecInfo.reagentLot.reagentId) {
              for (let y = 0; y < this.occupiedReagentIds.length; y++) {
                this.reagentFlag[index] = (reagentId === this.occupiedReagentIds[y]) ? true : false;
                if (this.reagentFlag[index]) {
                  break;
                }
              }
            } else {
              this.reagentFlag[index] = false;
            }
            break;
          }
        }
      }
    }
  }

  valideReagent(reagentId: number, index: number) {
    const itemList = this.sideNavItemsList;
    if (itemList && itemList.length) {
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].testSpecInfo) {
          this.reagentFlag[index] =
            (itemList[i].testSpecInfo.analyteName === this.labConfigurationAnalytes[index].name &&
              reagentId === itemList[i].testSpecInfo.reagentLot.reagentId) ? true : false;
          if (this.reagentFlag[index]) {
            break;
          }
        }
      }
    }
  }

  onDefaultReagentCalibratorClick(e) {
    this.defaultCalibrators = e.checked;
    this.analytesGetter['controls'].forEach((value, key) => {
      if (value['controls'].analyte.value) {
        this.getManufacturerFromCalibratorList(key);
      }
    });
  }

  getManufacturerFromCalibratorList(index: number) {
    try {
      const tempAllCalibrator = Object.assign([], this.allCalibrators);
      this.calibratorManufacturers[index] = [];
      this.calibrators[index] = [];
      this.calibratorLots[index] = [];
      // check if manufacturer present for the calibrators
      this.isCalibratorManufacturerPresent[index] = tempAllCalibrator[index].find(r =>
        r.manufacturerId === this.defaultManufacturer.manufacturerId);
      if (this.defaultCalibrators) {
        if (this.isCalibratorManufacturerPresent[index]) {
          tempAllCalibrator[index] = tempAllCalibrator[index].filter(r =>
            r.manufacturerId === this.defaultManufacturer.manufacturerId
          );
        }
      }

      tempAllCalibrator[index] = tempAllCalibrator[index].sort((a: Calibrator, b: Calibrator) => (a.name < b.name ? -1 : 1));
      const allCalibratorManufacturer = tempAllCalibrator[index].map(mp => {
        return { manufacturerId: mp.manufacturerId, name: mp.manufacturerName };
      });
      const manufacturerCalibratorFlag = {};
      this.calibratorManufacturers[index] = allCalibratorManufacturer
        .filter(m => {
          if (manufacturerCalibratorFlag[m.manufacturerId]) {
            return false;
          } else {
            manufacturerCalibratorFlag[m.manufacturerId] = true;
            return true;
          }
        })
        .sort((a, b) => (a.name <= b.name ? -1 : 1));

      if (this.showSettings && this.selectedCalibratorData) {
        const tempSelectedManufacturer =
          this.getSelectedDataByKey(this.selectedCalibratorData.manufacturerId, tempAllCalibrator[0]);
        this.selectedCalibratorManufacturerData = {
          manufacturerId: tempSelectedManufacturer.manufacturerId,
          name: tempSelectedManufacturer.manufacturerName
        };

        this.setValuesByControlName('calibratorManufacturer',
          this.selectedCalibratorManufacturerData.manufacturerId, this.calibratorManufacturers[0]);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.GetManufacturerFromCalibratorList)));
    }
  }

  onCalibratorManufacturerSelect(manufacturerId: string, index: number) {
    if (manufacturerId && this.allCalibrators && this.allCalibrators[index]) {
      this.calibrators[index] = [];
      this.calibratorLots[index] = [];
      this.calibrators[index] = this.allCalibrators[index].filter(
        c => c.manufacturerId === manufacturerId
      );
    }

    if (this.showSettings && this.selectedData && this.selectedData.selectedAnalyteCalibratorId && this.calibrators.length) {
      this.setValuesByControlName('calibrator', this.selectedData.selectedAnalyteCalibratorId, this.calibrators[0]);
    }
  }

  onCalibratorSelect(calibratorId: number, index: number) {
    if (calibratorId) {
      this.loadCalibratorLots.emit({ calibratorId, index });
    }
  }

  populateLabels() {
    this.reagentManufacturerPlaceholder = this.getTranslation('ANALYTEENTRY.MANUFACTURER');
    this.reagentPlaceholder = this.getTranslation('ANALYTEENTRY.REAGENTPLACEHOLDER');
    this.lotNumberPlaceholder = this.getTranslation('ANALYTEENTRY.LOTPLACEHOLDER');
    this.calibratorManufacturerPlaceholder = this.getTranslation('ANALYTEENTRY.CALIBRATORMANUFACTUREPLACEHOLDER');
    this.calibratorPlaceholder = this.getTranslation('ANALYTEENTRY.CALIBRATORPLACEHOLDER');
    this.methodPlaceholder = this.getTranslation('ANALYTEENTRY.METHOD');
    this.unitOfMeasurePlaceholder = (!this.showSettings) ? this.getTranslation('ANALYTEENTRY.UNIT') : this.getTranslation('ANALYTEENTRY.UNITOFMEASURE');
    this.reagentErrorMsg = this.getTranslation('ANALYTEENTRY.REAGENT');
    this.calibratorErrorMsg = this.getTranslation('ANALYTEENTRY.CALIBRATOR');
    this.methodErrorMsg = this.getTranslation('ANALYTEENTRY.SEEMETHOD');
    this.unitErrorMsg = this.getTranslation('ANALYTEENTRY.SEEUNIT');
    this.headerTitleSuffix = this.getTranslation('ANALYTEENTRY.ANALYTESHEADER');
  }

  requestNewConfiguration(type: NewRequestConfigType) {
    let templateId, name;
    switch (type) {
      case this.newRequestConfigType.Analyte:
        templateId = TemplateType.Analyte;
        name = this.getTranslation('ANALYTEENTRY.ANALYTESHEADER');
        break;
      case this.newRequestConfigType.Calibrator:
        templateId = TemplateType.Calibrator;
        name = this.getTranslation('ANALYTEENTRY.CALIBRATORPLACEHOLDER');
        break;
      case this.newRequestConfigType.CalibratorLot:
        templateId = TemplateType.CalibratorLot;
        name = this.getTranslation('ANALYTEENTRY.CALIBRATORLOT1');
        break;
      case this.newRequestConfigType.Reagent:
        templateId = TemplateType.Reagent;
        name = this.getTranslation('ANALYTEENTRY.REAGENTPLACEHOLDER');
        break;
      case this.newRequestConfigType.ReagentLot:
        templateId = TemplateType.ReagentLot;
        name = this.getTranslation('ANALYTEENTRY.REAGENT1');
        break;
      default:
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, '', Operations.defaultCaseRequestNewConfig,
            (componentInfo.AnalyteEntryComponent + blankSpace + Operations.defaultCaseRequestNewConfig)));
        break;
    }
    this.dialog.open(RequestNewConfigComponent, {
      width: '450px',
      data: {
        templateId: templateId,
        name: name
      }
    });

  }

  isAnalyteSelected() {
    this.isValidForm = this.analytesGetter['controls'].some((analytes) => {
      if (analytes?.get('analyte').value === true) {
        return true;
      }
    });
  }

  isSpcRulesFormPristine() {
    if (this.spcRuleComponent.rulesSettingsGetter) {
      return this.spcRuleComponent.rulesSettingsGetter.pristine;
    } else {
      return true;
    }
  }

  onDisableChange(event) {
    this.disableRulesPristine = event;
  }

  setSpcValidity(event) {
    this.isRulesFormValid = event;
  }

  checkRulesPristine(event) {
    this.rulesPristine = event;
  }

  checkFormDefaultStatus() {
    let analyteInfoPristine = false;
    let summaryDataPristine = false;
    let decimalPlacePristine = true;
    const isArchivePristine = this.archivedGetter.pristine;
    const levelsPristine = _.isEqual(this.defaultLevels, this.levels);
    const currentSummaryData = this.analyteFormDefaultControls?.get('summaryDataEntry').value;
    this.appNavigationService.spcRuleComponent = this.spcRuleComponent;
    const defaultSummaryData = this.settingsNew && this.settingsNew.levelSettings ? this.settingsNew.levelSettings.isSummary : true;
    if (this.showSettings && this.selectedData) {
      delete this.selectedData.selectedAnalyteReagentManufacturerId;
      delete this.selectedData.selectedAnalyteCalibratorManufacturerId;

      // current values selected in form
      const currentFromValues = {
        selectedAnalyteReagentId: (this.getGroupAtIndex(0)?.get('analyteInfo.reagents') &&
          this.getGroupAtIndex(0)?.get('analyteInfo.reagents').value) ?
          this.getGroupAtIndex(0)?.get('analyteInfo.reagents').value.id : '',
        selectedAnalyteCalibratorId: (this.getGroupAtIndex(0)?.get('analyteInfo.calibrator') &&
          this.getGroupAtIndex(0)?.get('analyteInfo.calibrator').value) ?
          this.getGroupAtIndex(0)?.get('analyteInfo.calibrator').value.id : '',
        selectedAnalyteReagentLotId: (this.getGroupAtIndex(0)?.get('analyteInfo.reagentLots') &&
          this.getGroupAtIndex(0)?.get('analyteInfo.reagentLots').value) ?
          this.getGroupAtIndex(0)?.get('analyteInfo.reagentLots').value.id : '',
        selectedAnalyteCalibratorLotId: (this.getGroupAtIndex(0)?.get('analyteInfo.calibratorLots') &&
          this.getGroupAtIndex(0)?.get('analyteInfo.calibratorLots').value) ?
          this.getGroupAtIndex(0)?.get('analyteInfo.calibratorLots').value.id : '',
        selectedAnalyteMethodId: (this.getGroupAtIndex(0)?.get('analyteInfo.method') &&
          this.getGroupAtIndex(0)?.get('analyteInfo.method').value) ?
          this.getGroupAtIndex(0)?.get('analyteInfo.method').value.id : '',
        selectedAnalyteUnitId: (this.getGroupAtIndex(0)?.get('analyteInfo.unit') &&
          this.getGroupAtIndex(0)?.get('analyteInfo.unit').value && this.getGroupAtIndex(0)?.get('analyteInfo.unit').value.id) ?
          this.getGroupAtIndex(0)?.get('analyteInfo.unit').value.id.toString() : '',
        isArchived: this.archivedGetter ? this.archivedGetter.value : false
      };
      // compare current form values with previously saved and default selected values
      if (_.isEqual(currentFromValues, this.selectedData)) {
        analyteInfoPristine = true;
      }

      if (currentSummaryData === defaultSummaryData) {
        summaryDataPristine = true;
      }

      const defaultDecimalPlaces = this.settingsNew && this.settingsNew.levelSettings ?
        this.settingsNew.levelSettings.decimalPlaces : defaultDecimalPlaceValue;
      if (!_.isEqual(Number(this.analyteForm?.get('defaultControls.decimalPlaces').value), defaultDecimalPlaces)) {
        decimalPlacePristine = false;
      }
      if (this.disableRulesPristine && analyteInfoPristine && summaryDataPristine
        && decimalPlacePristine && levelsPristine && this.rulesPristine && isArchivePristine) {
        return true;
      } else {
        if (!this.analyteForm.valid || !this.isRulesFormValid) {
          return true;
        }
        return false;
      }
    } else {
      // for labsetup screen
      return (!this.analyteForm.touched || !this.analyteForm.dirty ||
        !this.analyteForm.valid || !this.analytesGetter.touched || !this.isValidForm);
    }
  }

  resetForm() {
    try {
      this.isUnableToMakeTheChangeError = false;
      this.isChangesNotAllowedError = false;
      this.spcRulesService.setResetRules(true);
      this.setReagentFlag();
      if (!this.showSettings) {
        this.totalAnalytesSelected = 0;
        this.isValidForm = false;
        this.analytesGetter['controls'].forEach((value, key) => {
          value?.get('analyte').setValue(false);
          this.getGroupAtIndex(key).removeControl('analyteInfo');
          this.removeElements(key);
        });
        this.analyteFormDefaultControls.patchValue({
          defaultReagents: true,
          defaultCalibrators: true,
          selectAllAnalytes: false
        });
        this.defaultCalibrators = true;
        this.defaultReagents = true;
        this.levels?.forEach((item) => {
          // PBI 198752: When adding analytes to  control the levels in use should default to ON
          item.levelInUse = true;
        });
        this.enableAllLevels();
      } else {
        const isReset = true;
        this.summaryDataEntry = this.settingsNew?.levelSettings ? this.settingsNew?.levelSettings.isSummary : true;
        this.analyteFormDefaultControls.patchValue({
          decimalPlaces: (this.settingsNew && this.settingsNew?.levelSettings) ?
            this.settingsNew.levelSettings.decimalPlaces.toString() : '',
          summaryDataEntry: this.summaryDataEntry
        });
        this.onChangeLevelInUse();
        this.setValuesByControlName('reagentManufacturer',
          this.selectedReagentManufacturerData?.manufacturerId, this.reagentManufacturers[0], isReset);
        this.setValuesByControlName('reagents', this.selectedData.selectedAnalyteReagentId, this.reagents[0], isReset);
        this.setValuesByControlName('reagentLots', this.selectedData.selectedAnalyteReagentLotId, this.reagentLots[0], isReset);
        this.setValuesByControlName('calibratorManufacturer',
          this.selectedCalibratorManufacturerData?.manufacturerId, this.calibratorManufacturers[0], isReset);
        this.setValuesByControlName('calibrator', this.selectedData.selectedAnalyteCalibratorId, this.calibrators[0], isReset);
        this.setValuesByControlName('calibratorLots', this.selectedData.selectedAnalyteCalibratorLotId, this.calibratorLots[0], isReset);
        this.setValuesByControlName('unit', this.selectedData.selectedAnalyteUnitId, this.units[0], isReset);
        this.setValuesByControlName('method', this.selectedData.selectedAnalyteMethodId, this.methods[0], isReset);
        this.archivedGetter.setValue(this.selectedData ? this.selectedData.isArchived : false);
        this.levels = _.cloneDeep(this.defaultLevels);
      }
      // on reset make form prestine and untouched
      this.analyteForm.markAsPristine();
      this.analyteForm.markAsUntouched();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.ResetForm)));
    }
  }

  getSelectedDataByKey(value: number | string, array: Array<any>) {
    return array.find(x => (x.id && x.id.toString()) === (value && value.toString()) ||
      (x.manufacturerId && x.manufacturerId.toString()) === (value && value.toString()));
  }

  getSelectedDataByIndexId(id: number | string, array: Array<any>) {
    return array?.findIndex(x => (x.id && x.id.toString()) === (id && id.toString()) ||
      (x.manufacturerId && x.manufacturerId.toString()) === (id && id.toString()));
  }

  setValuesByControlName(controlName: string, idToFind: string | number, array: Array<any>, isReset?: boolean) {
    if (array) {
      const selectedIndex = this.getSelectedDataByIndexId(
        idToFind, array
      );
      if (!this.getGroupAtIndex(0)?.get('analyteInfo.' + controlName).value || isReset) {
        this.getGroupAtIndex(0)?.get('analyteInfo.' + controlName).setValue(array[selectedIndex]);
      }
    }
  }

  onSelect(value) {
  }

  onSummaryDataEntryChange(arg: boolean) {
    this.summaryDataEntry = arg;
  }

  selectAllAnalytes(e) {
    try {
      this.selectAllAnalytesCheck = e.checked;
      this.isValidForm = (this.selectAllAnalytesCheck) ? true : false;
      this.analytesGetter['controls'].forEach((value, key) => {
        if (this.selectAllAnalytesCheck) {
          value?.get('analyte').setValue(true);
          if (!value?.get('analyteInfo')) {
            this.emitValues(key);
            this.addAnalyteInfo(key);
          }
        } else {
          value?.get('analyte').setValue(false);
          this.getGroupAtIndex(key).removeControl('analyteInfo');
          this.removeElements(key);
        }
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AnalyteEntryComponent + blankSpace + Operations.SelectAllAnalytes)));
    }
  }

  deleteAuditTrailAnalyte() {
    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: AuditTrackingEvent.LabSetup,
        action: AuditTrackingAction.Delete,
        actionStatus: AuditTrackingActionStatus.Success,
        currentValue: {
          manufacturerName: this.analyteForm.value.analytes[0].analyteInfo.reagentManufacturer.name,
          reagentName: this.analyteForm.value.analytes[0].analyteInfo.reagentLots.reagentName,
          lotNumber: this.analyteForm.value.analytes[0].analyteInfo.reagentLots.lotNumber,
          calibratorName: this.analyteForm.value.analytes[0].analyteInfo.calibratorManufacturer.name,
          method: this.analyteForm.value.analytes[0].analyteInfo.method.name,
          unit: this.analyteForm.value.analytes[0].analyteInfo.unit.name,
          isSummary: this.settingsNew.levelSettings.isSummary,
          decimalPlaces: this.analyteForm.value.defaultControls.decimalPlaces,
        },
      },
    };
    this.appNavigationService.logAuditTracking(auditNavigationPayload, true);
  }

  deleteAnalyte() {
    this.openConfirmLinkDialog();
  }

  archiveAuditTrailAnalyte(archiveAction: string) {
    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: AuditTrackingAction.LabSetup,
        action: archiveAction,
        actionStatus: AuditTrackingActionStatus.Success,
        currentValue: {
          manufacturerName: this.analyteForm.value.analytes[0].analyteInfo.reagentManufacturer.name,
          reagentName: this.analyteForm.value.analytes[0].analyteInfo.reagentLots.reagentName,
          lotNumber: this.analyteForm.value.analytes[0].analyteInfo.reagentLots.lotNumber,
          calibratorName: this.analyteForm.value.analytes[0].analyteInfo.calibratorManufacturer.name,
          method: this.analyteForm.value.analytes[0].analyteInfo.method.name,
          unit: this.analyteForm.value.analytes[0].analyteInfo.unit.name,
          isSummary: this.settingsNew.levelSettings.isSummary,
          decimalPlaces: this.analyteForm.value.defaultControls.decimalPlaces,
        },
      },
    };
    this.appNavigationService.logAuditTracking(auditNavigationPayload, true);
  }

  async fetchAllAnalytes() {
    const queryParameter = new QueryParameter(includeArchivedItems, 'true');
    const labProduct = await this.portalApiService.getLabSetupNode(
      EntityType.LabProduct,
      this.controlId,
      LevelLoadRequest.LoadChildren,
      EntityType.None,
      [queryParameter]).toPromise();
    if (labProduct && labProduct.children) {
      this.existingAnalyteTestSpecs = labProduct && labProduct.children?.map((a: LabTest) => a.testSpecInfo);
    }
  }

  doesMatchExistingTestSpecs(idx: number) {
    const analyte = this.analyteForm.value.analytes[idx];
    if (analyte && analyte.analyte && analyte.analyteInfo) {
      const analyteInfo = analyte.analyteInfo;
      const enteredAnalyteTestSpec = {
        analyteId: this.labConfigurationAnalytes[idx].id,
        calibratorId: analyteInfo.calibratorLots.calibratorId,
        calibratorLotId: analyteInfo.calibratorLots.id,
        reagentId: analyteInfo.reagentLots.reagentId,
        reagentLotId: analyteInfo.reagentLots.id,
        storageUnitId: analyteInfo.unit.id,
        instrumentId: this.instrumentId,
        methodId: analyteInfo.method.id
      } as TestSpec;

      // If editing (in settings)
      if (this.selectedData) {
        const analyteItem = this.selectedData;
        const selectedAnalyteTestSpec = {
          analyteId: this.labConfigurationAnalytes[idx].id,
          calibratorId: analyteItem.selectedAnalyteCalibratorId,
          calibratorLotId: analyteItem.selectedAnalyteCalibratorLotId,
          reagentId: analyteItem.selectedAnalyteReagentId,
          reagentLotId: analyteItem.selectedAnalyteReagentLotId,
          storageUnitId: +analyteItem.selectedAnalyteUnitId,
          instrumentId: this.instrumentId,
          methodId: analyteItem.selectedAnalyteMethodId
        } as TestSpec;

        // If the selections match the existing analyte, then we are okay.
        if (this.treeNodesService.getMatchingTestSpecs([enteredAnalyteTestSpec], [selectedAnalyteTestSpec]).length > 0) {
          return false;
        }
      }

      // If the new selections are found in the list of existing siblings, then return true.
      return this.treeNodesService.getMatchingTestSpecs(this.existingAnalyteTestSpecs, [enteredAnalyteTestSpec]).length > 0;
    }
  }

  // Ensure no duplicate selection is made. The inputControl contains the index of the analyte in the list.
  validateForNoDuplicateTestSpecs(selectedAnalyte: AbstractControl): ValidationErrors {
    // There are two similar checks here for the following reasons:
    // 1. Check currently loaded siblings in state for a duplicate testspec (if new) using 'existingAnalytes'.
    // 2. Use this.duplicateAnalytes will indicate the analyteIds of any testspecs being added that already exist. This list
    //    will be freshly updated after submitting from this component.
    const analyteInfoIndex = Number(selectedAnalyte?.value);
    if(isNaN(analyteInfoIndex) || !this.doesMatchExistingTestSpecs(analyteInfoIndex)) {
      return null;
    }
    return this.hasDuplicateAnalytes(analyteInfoIndex) ? { valid: false } : null;
  }

  // helper functions for validateForNoDuplicateTestSpecs and
  // conditional rendering of DuplicateAnalyteError and
  // DuplicateAnalyteUnitMeasureError
  // #region
  hasSingleUnit(analyteInfoIndex: number): boolean {
    const hasReagentFlag = this.reagentFlag[analyteInfoIndex];
    return !hasReagentFlag && this._units[analyteInfoIndex]?.length > 1;
  }

  hasMultipleUnits(analyteInfoIndex: number): boolean {
    const hasReagentFlag = this.reagentFlag[analyteInfoIndex];
    return !hasReagentFlag && this._units[analyteInfoIndex]?.length > 1;
  }

  /**
   * returns is Invalid Analyte Info Index
   */
  isInvalidAnalyteInfoIndex(analyteInfoIndex: number): boolean {
    const analyteForm = this.getGroupAtIndex(analyteInfoIndex);
    const controls = analyteForm.controls.analyteInfo['controls'];
    return controls['idx'].invalid;
  }

  hasDuplicateAnalytes(analyteInfoIndex: number): boolean {
    const analyte = (this.labConfigurationAnalytes ?? [])[analyteInfoIndex];
    return this.duplicateAnalytes?.includes(analyte?.id);
  }
  // #endregion

  private openConfirmLinkDialog(): void {
    const _displayName = this.labConfigurationAnalytes[0].name;
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: { _displayName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAnalyteId.emit();
        this.deleteAuditTrailAnalyte();
      }
    });
  }

  openEvaluationMeanSdDialog(newSettingsFormValue?) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1017px';
    dialogConfig.disableClose = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.data = {
      entity: this.currentSelected,
      hasEvaluationMeanSd: (this.settingsNew && this.settingsNew.hasEvaluationMeanSd) ? this.settingsNew.hasEvaluationMeanSd : false,
      settingsValues: (newSettingsFormValue ? newSettingsFormValue : null)
    };
    this.dialog.open(EvaluationMeanSdConfigComponent, dialogConfig);
  }

  cf_onRemoveItem(pointIndex) {
    this.getGroupAtIndex(pointIndex)?.get('analyte').setValue(false);
    this.onSelectAnalyte(pointIndex);
  }

  public onSelectReagentLotsChanged(event) {
    this.isSelectReagentLotsCheckboxSelectedByUser = event.checked;
  }

  public onSelectCalibratorLotsChanged(event) {
    this.isSelectCalibratorLotsCheckboxSelectedByUser = event.checked;
  }

  private checkIsReagentMicroslide(reagentId?: number, selectedIndex?: number): void {
    // If reagent category for analyte is microslide, then select reagent lot number checkbox will be checked and disabled
    this.isReagentMicroslide = this.allReagents.some((reagents: Array<Reagent>, index) => {
      if (selectedIndex >= 0 && selectedIndex === index && reagentId) {
        // find the selected reagent and see if that is microslide or not.
        const selectedReagent = reagents.find((reagent: Reagent) => reagent.id === reagentId);
        return !!selectedReagent && +selectedReagent.reagentCategoryId === ReagentCategory.Microslide;
      } else {
        return !!reagents && !!reagents[0] && +reagents[0].reagentCategoryId === ReagentCategory.Microslide;
      }
    });
  }

  private updateReagentLotNumberSelection(): void {
    const analyteFormControlsReagentLotNumber = this.analyteFormDefaultControls?.get('selectReagentLots');
    if (this.isReagentMicroslide) {
      this.selectReagentLots = true;
      analyteFormControlsReagentLotNumber.disable();
    } else {
      analyteFormControlsReagentLotNumber.enable();
    }
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
