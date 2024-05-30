// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Store, createFeatureSelector, createSelector, select } from '@ngrx/store';
import { filter, takeUntil, take } from 'rxjs/operators';
import { BrMouseOver, ErrorStateMatcherMouseOver } from 'br-component-library';
import { cloneDeep, isEqual } from 'lodash';


import * as actions from '../../../../shared/navigation/state/actions';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import {
  textFieldCharLimit, name, controlAddLimit, level, used, controlName, controlInfo, controlLimitMessageTextCode,
  controlInfoCustomName,
  controlInfoLotNumber,
  decimalPlace, nonBrManufacturerId, brManufacturerId,
  nonBrControlText, openSquareParenthesis, closeSquareParenthesis, instrumentNamePlaceholder, includeArchivedItems
} from '../../../../core/config/constants/general.const';
import { ProductLot } from '../../../../contracts/models/lab-setup/product-lots-list-point.model';
import { ManufacturerProduct, ProductOperationMenuItem, ProductOperations, ProductMenuItem, ManufacturerProductDisplayItem} from '../../../../contracts/models/lab-setup/product-list.model';
import { LabProduct } from '../../../../contracts/models/lab-setup';
import { icons } from '../../../../core/config/constants/icon.const';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { IconService } from '../../../../shared/icons/icons.service';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { LevelDisplayItem } from '../../../../contracts/models/portal-api/level-test-settings.model';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { HeaderType } from '../../../../contracts/enums/lab-setup/header-type.enum';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { SpcRulesService } from '../spc-rules/spc-rules.service';
import { Settings, SettingsParameter, ControlSettingsValues, NonBrControlConfig } from '../../../../contracts/models/lab-setup/settings.model';
import { LabConfigSettingsActions } from '../../state/actions';
import { EvaluationMeanSdConfigComponent } from '../../containers/evaluation-mean-sd-config/evaluation-mean-sd-config.component';
import { SpcRulesComponent } from '../spc-rules/spc-rules.component';
import { getSettings, hasAnalyteLevelNode } from '../../shared/lab-setup-helper';
import { LevelSettings } from '../../../../contracts/models/lab-setup/levels-settings.model';
import { UpdateSettingsDialogComponent } from '../update-settings-dialog/update-settings-dialog.component';
import { RuleName } from '../../../../contracts/enums/lab-setup/spc-rule-enums/rule-name.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { DuplicateNodeComponent } from '../../../../shared/containers/duplicate-node/duplicate-node.component';
import { DuplicateNodeEntry } from '../../../../contracts/models/shared/duplicate-node-entry.model';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { DataEntryMode } from '../../../../contracts/models/lab-setup/data-entry-mode.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, AuditTrailValueData } from '../../../../../app/shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AppUser } from '../../../../security/model';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { CustomControlRequest } from '../../../../contracts/models/control-management/custom-control-request.model';
import { ControlManagementViewMode } from '../../../control-management/shared/models/control-management.enum';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { CustomControl } from '../../../../contracts/models/control-management/custom-control.model';
import { NavigationState } from '../../../../shared/navigation/state/reducers/navigation.reducer';

@Component({
  selector: 'unext-control-entry',
  templateUrl: './control-entry.component.html',
  styleUrls: ['./control-entry.component.scss'],
  providers: [UnityNextDatePipe]
})

export class ControlEntryComponent implements OnInit, OnDestroy, AfterViewChecked {
  controls: FormArray;
  controlsForm: FormGroup;
  errorStateMatcherMouseOver: ErrorStateMatcherMouseOver;
  errorStateMatchesForPassword: ErrorStateMatcherMouseOver;
  mouseOverSubmit = new BrMouseOver();
  isTestAvailable = false;
  public type = HeaderType;
  public currentUser: AppUser;
  public numberOfInitialBlankControls = 0;
  public currentLotExpirationDate;
  public controlNamePlaceholder: string;
  public controlSearchPlaceholder: string;
  public noResults: string;
  public lotNumberPlaceholder: string;
  public controlLimitMessage: string;
  public labSetupControlsHeaderNode = 5;
  public lots: ProductLot[] = [];
  hasNoSearchResultList = true;
  isFormValid = false;
  isFormSubmitting = false;
  assignedLotIds: Array<number> = [];
  assignedProductIds: Array<number> = [];
  pointIndex: number;
  isDataEntry = false;
  loadLotsFlag = [false, false, false, false, false];
  private destroy$ = new Subject<boolean>();
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24],
    icons.menu[24],
    icons.addCircleOutline[24],
    icons.delete[24],
    icons.close[24],
  ];
  lotListOriginal: Array<Array<ProductLot>> = [];
  _lotsList: Array<Array<ProductLot>> = [];
  _settings: Settings;
  _showSettings: boolean;
  currentSelectedControl: LabProduct;
  _labConfigurationControls: Array<ManufacturerProductDisplayItem> = [];
  summary = true;
  public hasChildren: boolean;
  public navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  public navigationCurrentlySelectedLeaf$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  getNavigationState = createFeatureSelector<NavigationState>('navigation');
  getLocale = createSelector(this.getNavigationState, (state) => state && state.locale ?
    state.locale : { country: 'US', lcid: 'en-US', value: 'en', name: 'English' });
  navigationGetLocale$ = this.store.pipe(select(this.getLocale));
  public overlayHeight: string;
  public overlayWidth: string;

  @Input() instrumentId: string;
  @Input() floatPointData: number;
  @Input() isParentArchived: boolean;
  @Input() isDefineOwnControlAvailable: boolean;
  @Output() isDefineControlsClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild(SpcRulesComponent) spcRuleComponent: SpcRulesComponent;

  private _sourceNode: LabProduct;
  private _instrumentDisplayName: string;
  showArchivedFilterToggle = false;
  private readonly includeArchivedItemsParameterValue = 'true';
  private controlsFlag = false;
  public hideAddControlLink = true;
  flag = [false, false, false, false, false];
  removedId: number;
  duplicateCustomName: Array<boolean> = [];
  isDuplicateCustomName: boolean;
  permissions = Permissions;
  expText: string;
  public viewType: string;
  public showDefineOwnControlForm = false;
  private defineOwnControlOption: ProductOperationMenuItem;
  public isDefineOwnControlVisible = true;
  public controlManagementViewMode: ControlManagementViewMode = ControlManagementViewMode.DefineAndAdd;
  public changesToControls = false;
  public summeryPristine = true;

  get settings(): Settings {
    return this._settings;
  }

  @Input('settings')
  set settings(value: Settings) {
    this._settings = value;
    if (this._settings && this.showSettings) {
      this.updateSettingsFormData();
    }
  }

  private _isToggledToNotArchived: boolean;
  @Input('isToggledToNotArchived')
  set isToggledToNotArchived(value: boolean) {
    this._isToggledToNotArchived = value;
  }
  get isToggledToNotArchived() {
    return this._isToggledToNotArchived;
  }

  get archivedGetter() {
    return this.controlsForm.get('archived');
  }

  onArchiveToggle(event, content) {
    this.store.dispatch(actions.NavBarActions.toggleArchiveItems({ isArchiveItemsToggleOn: event.checked }));

    if (event.checked && !this.isToggledToNotArchived) {
      const contentParent = content.offsetParent;
      const actionCard = contentParent.children[2];
      this.setWidthHeight(contentParent, actionCard);
    } else if (!event.checked && this.sourceNode && this.sourceNode.isArchived) {
      this.isToggledToNotArchived = true;
    } else {
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

  get lotList(): Array<Array<ProductLot>> {
    return this._lotsList;
  }

  @Input('lotList')
  set lotList(value: Array<Array<ProductLot>>) {
    this._lotsList = value;

    if (this._lotsList && this._lotsList.length > 0) {
      const labConfigurationControls = this._labConfigurationControls.length;
      const len = this._lotsList[0] && this._lotsList[0].length ? this._lotsList[0].length : 0;

      // UN-24439 :- To add/edit control it should have minimum 1 lot.
      if (labConfigurationControls === 1 && len < 1 && !this.controlsFlag) {
        if (this.controlsGetter?.length !== 2) {
          this.controlsGetter.removeAt(this.controlsGetter?.length - len);
        }
        if (len === 1) {
          this.controlsGetter.removeAt(1);
        }
        this.controlsFlag = true;
        this.numberOfInitialBlankControls = (len === 1) ? 1 : 2;
        this.hideAddControlLink = true;
      }
      this.navigationGetLocale$.pipe(filter(loc => !!loc), takeUntil(this.destroy$)).subscribe(() => {
        this.onLoadLots();
      });
    }
  }

  get showSettings(): boolean {
    return this._showSettings;
  }

  @Input('showSettings')
  set showSettings(value: boolean) {
    this._showSettings = value;
    if (this.showSettings) {
      this.numberOfInitialBlankControls = 1;
    } else {
      this.numberOfInitialBlankControls = 3;
    }
  }

  @Input('sourceNode')
  set sourceNode(value: LabProduct) {
    if (value) {
      this._sourceNode = value;
      this.hasChildren = (this._sourceNode && this._sourceNode?.children?.length > 0) ? true : false;
    }
  }

  get sourceNode() {
    return this._sourceNode;
  }

  @Input('instrumentDisplayName')
  set instrumentDisplayName(value: string) {
    if (value) {
      this._instrumentDisplayName = value;
    }
  }

  get instrumentDisplayName() {
    return this._instrumentDisplayName;
  }

  public decimalPlaceData = decimalPlace;
  public controlAddLimit = controlAddLimit;
  levels: Array<LevelDisplayItem>;
  defaultLevels: Array<LevelDisplayItem>;
  defaultDecimalPlace;
  defaultDataType: DataEntryMode;
  @Input() errorMessage: string;
  @Input() title: string;
  @Input() selectedLeaf: string;
  @Input() labConfigurationControlsList: ProductMenuItem[];
  @Output() saveLabConfigrationControl = new EventEmitter<ControlSettingsValues>();
  @Output() loadLots = new EventEmitter();
  @Output() deletedControl = new EventEmitter();
  @Output() resetControl = new EventEmitter();
  @Output() addNonBRControlDefinition = new EventEmitter<NonBrControlConfig>();
  public currentAccount$ = this.store.pipe(select(sharedStateSelector.getAccountState));
  accountId: string;
  nonBrControlDefinitionsData: CustomControl[] = [];

  _currentlySelectedControls: Array<LabProduct> = [];
  get currentlySelectedControls(): Array<LabProduct> {
    return this._currentlySelectedControls;
  }

  @Input('currentlySelectedControls')
  set currentlySelectedControls(value: Array<LabProduct>) {
    this._currentlySelectedControls = value;
  }

  @Input('labConfigurationControls')
  set labConfigurationControls(value: Array<ManufacturerProduct>) {
    this._labConfigurationControls = this.getLabConfigurationControlsWithDisplayName(value);
  }

  get controlsGetter() {
    return this.controlsForm ? this.controlsForm.get('controls') as FormArray : null;
  }

  @ViewChild('content') content: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private iconService: IconService,
    private store: Store<fromRoot.LabSetupStates>,
    public dialog: MatDialog,
    private spcRulesService: SpcRulesService,
    private updateSettingsDialog: MatDialog,
    private brPermissionsService: BrPermissionsService,
    private errorLoggerService: ErrorLoggerService,
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService,
    private unityNextDatePipe: UnityNextDatePipe,
    private codeListService: CodelistApiService,
    private portalAPIService: PortalApiService,
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.AddIcons)));
    }

    this.defineOwnControlOption = {
      name: this.getTranslation('CONTROLENTRY.DEFINEOWNCONTROL'),
      operationId: ProductOperations.DefineOwnControl
    };
  }

  ngOnInit() {
    this.appNavigationService.auditTrailViewData(AuditTrackingAction.Settings);
    try {
      this.errorStateMatcherMouseOver = new ErrorStateMatcherMouseOver(this.mouseOverSubmit);
      this.setInitForm();
      this.appNavigationService.controlData = this.currentSelectedControl;
      this.appNavigationService.controlsForm = this.controlsForm;
      if (!this.showSettings) {
        this.checkDefaultAccountSettings();
      }
      if (this.showDefineOwnControlForm) {
        this.getNonBrControls();
      }
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.populateLabels();
        this.bringLotsWithExpirationDate();
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.OnInit)));
    }
  }

  // Adds display name property for controls that are not manufactured by Bio-Rad.
  getLabConfigurationControlsWithDisplayName(controls: Array<ManufacturerProduct>): Array<ManufacturerProductDisplayItem> {
    const controlsWithDisplayName: ManufacturerProductDisplayItem[] = [];
    if (controls) {
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        let displayName: string;
        if (control.manufacturerId === nonBrManufacturerId) {
          if (!this.isDefineOwnControlAvailable) {
            continue;
          }
          displayName = this.getCustomizedProductDisplayName(control.name, nonBrControlText);
        } else if (control.manufacturerId === brManufacturerId) {
          displayName = control.name;
        } else {
          displayName = this.getCustomizedProductDisplayName(control.name, control.manufacturerName);
        }
        controlsWithDisplayName.push({
          displayName: displayName, name: control.name, id: control.id, manufacturerId: control.manufacturerId,
          manufacturerName: control.manufacturerName
        });
      }
    }
    return controlsWithDisplayName;
  }

  getCustomizedProductDisplayName(name: string, manufacturerDefinition: string) {
    return name + blankSpace + openSquareParenthesis + manufacturerDefinition + closeSquareParenthesis;
  }

  checkSearchList(event) {
    if (event) {
      const isFilteredListEmpty = event?.filteredData?.length === 1 && event?.filteredData[0] === this.noResults;
      this.hasNoSearchResultList = event?.searchText?.length === 0 || (event?.searchText?.length > 0 && isFilteredListEmpty);
    }
  }

  ngAfterViewChecked() {
    if (this.content && ((this.settings && this.settings.archiveState === ArchiveState.Archived) || this.isParentArchived)) {
      const contentParent = this.content.nativeElement.offsetParent;
      const actionCard = contentParent.children[3];
      this.setWidthHeight(contentParent, actionCard);
    }
  }

  getNonBrControls() {
    this.currentAccount$.pipe(take(1)).subscribe((res: any) => {
      this.accountId = res?.currentAccountSummary?.id;
      if (!this.accountId) {
        this.navigationCurrentlySelectedNode$.pipe(take(1)).subscribe(data => {
          this.accountId = data?.parentNodeId;
        });
      }
      if (this.accountId) {
        this.codeListService?.getNonBrControlDefinitions(this.accountId).pipe(take(1)).subscribe((data) => {
          this.nonBrControlDefinitionsData = data;
        }, error => {
          if (error.error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
                componentInfo.DefineCustomControlsComponent + blankSpace + Operations.GetCustomControls));
          }
        });
      }
    });
  }

  checkDefaultAccountSettings() {
    this.getCurrentLabLocation$.pipe(filter(location => !!location),
      take(1)).subscribe(location => {
        if (location && location.locationSettings) {
          this.defaultDecimalPlace = location.locationSettings.decimalPlaces;
          this.defaultDataType = location.locationSettings.dataType;
        }
      });
  }

  summaryToggleHandler(arg: boolean) {
    const prevData = this.settings.levelSettings.isSummary;
    if (arg === prevData) {
      this.controlsForm.get('dataEntryMode').markAsPristine();
      this.summeryPristine = true;
    } else {
      this.summeryPristine = false;
    }
    this.summary = arg;
    this.spcRulesService.setResetRules(true);
  }

  setInitForm() {
    this.controlsForm = this.formBuilder.group({
      dataEntryMode: [this.summary],
      defaultControls: new FormControl(),
      controls: this.formBuilder.array([]),
      archived: new FormControl(false)
    });
    this.addFormGroups(this.numberOfInitialBlankControls);
    this.populateLabels();
    if (this.showSettings) {
      this.loadSelectedNodeData();
    }
    if (this.hasPermissionToAccess([Permissions.ControlAdd, Permissions.ControlEdit,
       Permissions.ControlAddViewOnly, Permissions.ControlEditViewOnly])) {
      this.controlsForm.enable();
      this.addControlResetDefault();
    } else {
      this.controlsForm.disable();
    }
  }

  loadSelectedNodeData() {
    this.navigationCurrentlySelectedNode$
      .pipe(filter(currentSelectedNode => !!currentSelectedNode), takeUntil(this.destroy$))
      .subscribe((currentSelectedNode: LabProduct) => {
        if (currentSelectedNode.nodeType === EntityType.LabProduct) {
          this.currentSelectedControl = currentSelectedNode;
          const settingsParameter: SettingsParameter = {
            entityType: EntityType.LabProduct,
            entityId: currentSelectedNode.id,
            parentEntityId: currentSelectedNode.parentNodeId
          };
          this.showArchivedFilterToggle = hasAnalyteLevelNode(currentSelectedNode);
          this.store.dispatch(LabConfigSettingsActions.getSettings({ settingsParameter }));

          const queryParameter = new QueryParameter(includeArchivedItems, this.includeArchivedItemsParameterValue);
          this.portalAPIService.getLabSetupNode<LabProduct>(
            currentSelectedNode.nodeType, currentSelectedNode.id, LevelLoadRequest.LoadChildren, EntityType.None, [queryParameter], false)
            .pipe(take(1))
            .subscribe((node) => {
              this.isTestAvailable = node.children?.length > 0;
            });
        } else {
          this.navigationCurrentlySelectedLeaf$
            .pipe(filter(currentSelectedLeaf => !!currentSelectedLeaf), takeUntil(this.destroy$))
            .subscribe((currentSelectedLeaf: LabProduct) => {
              if (currentSelectedLeaf.nodeType === EntityType.LabProduct) {
                this.currentSelectedControl = currentSelectedLeaf;
                const settingsParameter = {
                  entityType: EntityType.LabProduct,
                  entityId: currentSelectedLeaf.id,
                  parentEntityId: currentSelectedLeaf.parentNodeId
                };
                this.showArchivedFilterToggle = hasAnalyteLevelNode(currentSelectedLeaf);
                this.store.dispatch(LabConfigSettingsActions.getSettings({ settingsParameter }));
              }
            });
        }
      });
    this.updateFormData();
  }

  updateFormData() {
    if (this._labConfigurationControls && this._labConfigurationControls.length && this.getGroupAtIndex(0)) {
      const arrayIndexControl = this._labConfigurationControls.findIndex(control => control.id === this.currentSelectedControl?.productId);
      if (arrayIndexControl !== -1) {
        const controlData = this._labConfigurationControls[arrayIndexControl];
        this.getGroupAtIndex(0)?.get(controlName)?.setValue(controlData);
      }
      this.archivedGetter.setValue(this.sourceNode ? !!this.sourceNode.isArchived : false);
    }
  }

  updateSettingsFormData() {
    this.appNavigationService.settings = this.settings;
    try {
      if (this.controlsForm) {
        this.controlsForm.get('dataEntryMode')
          .setValue(this.settings.levelSettings ? this.settings.levelSettings.isSummary : true);
        if (this.controlsForm.get('decimalPlaces')) {
          this.controlsForm.get('decimalPlaces').setValue(this.settings.levelSettings ? this.settings?.
            levelSettings?.decimalPlaces?.toString()
            : this.defaultDecimalPlace?.toString());
        } else {
          this.controlsForm.addControl('decimalPlaces',
            new FormControl(this.settings.levelSettings ? this.settings?.levelSettings?.decimalPlaces?.toString()
              : this.defaultDecimalPlace?.toString()));
        }
        this.summary = this.settings.levelSettings ? this.settings.levelSettings.isSummary : true;
        this.getNewLevels(this.settings.levelSettings, this.currentSelectedControl.productLotLevels);
        this.archivedGetter.setValue(this.sourceNode.isArchived);
        this.defaultLevels = cloneDeep(this.levels);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.UpdateSettingsFormData)));
    }
  }

  isSpcRulesFormPristine() {
    if (this.spcRuleComponent && this.spcRuleComponent.rulesSettingsGetter) {
      this.appNavigationService.spcRuleComponent = this.spcRuleComponent;
      return this.spcRuleComponent.rulesSettingsGetter.pristine;
    } else {
      return true;
    }
  }

  isControlArchieved(checked) {
    const toggle = this.sourceNode.isArchived;
    if (toggle === checked) {
      this.archivedGetter.markAsPristine();
    }
  }


  checkAllcontrolsForChanges() {
    const isArchivePristine = this.archivedGetter?.pristine;
    const levelsPristine = isEqual(this.defaultLevels, this.levels);
    const decimalPlacePristine =  this.controlsForm.get('decimalPlaces')?.pristine;
    const controlsPristine = this.getGroupAtIndex(0).get(controlName) ? this.getGroupAtIndex(0).get(controlName)?.pristine : true;
    const customNamePristine = this.getGroupAtIndex(0).get(controlInfoCustomName).value.trim() ===
    this.currentSelectedControl?.productCustomName?.trim();

    if (decimalPlacePristine && levelsPristine && customNamePristine && controlsPristine && isArchivePristine) {
      this.changesToControls = false;
    } else {
      this.changesToControls = true;
    }
  }

  disableUpdate() {
    try {
      if (this.showSettings) {
        this.isControlSelected();
        this.checkAllcontrolsForChanges(); /* code to compare individual components if pristine */
        let lotNumberPristine = true; /* lot number form element not showing proper state of the form  */

        if (this._lotsList && this._lotsList.length > 0 && this._lotsList[0].length > 0) { // Verify both array and sub array are not empty
          let arrayIndexLot = this._lotsList[0]
            .findIndex(lot => lot.lotNumber === this.currentSelectedControl.lotInfo.lotNumber);
          if (arrayIndexLot < 0) {
            arrayIndexLot = 0;
          }
          lotNumberPristine = (this.getGroupAtIndex(0).get(controlInfoLotNumber) &&
            this.getGroupAtIndex(0).get(controlInfoLotNumber).value) ?
            isEqual(this.getGroupAtIndex(0).get(controlInfoLotNumber).value?.id, this._lotsList[0][arrayIndexLot].id) : true;
        }
        if (this.isSpcRulesFormPristine() && !this.changesToControls && lotNumberPristine) {
          return true;
        } else {
          if (!this.controlsForm.valid || !this.isFormValid ||
            (this.spcRuleComponent && !this.spcRuleComponent.isSpcFormValid) && !this.changesToControls) {
            return true;
          }
          return false;
        }
      } else {
        return (this.isFormSubmitting || this.controlsForm?.pristine || !this.controlsForm.valid);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.DisableUpdate)));
    }
  }


  public handleLevelsState(): void {
    if (this.levels.filter(lvl => lvl.levelInUse).length === 1) {
      this.levels.forEach(lvl => {
        lvl.disabled = lvl.levelInUse;
      });
    } else {
      this.enableAllLevels();
    }
  }

  public enableAllLevels(): void {
    this.levels.forEach(lvl => {
      lvl.disabled = false;
    });
  }

  populateLabels() {
    this.controlNamePlaceholder = this.getTranslation('CONTROLENTRY.CONTROLNAME');
    this.lotNumberPlaceholder = this.getTranslation('CONTROLENTRY.LOTNUMBER');
    this.controlLimitMessage = this.getTranslation('CONTROLENTRY.CONTROLADDLIMIT')?.replace(controlLimitMessageTextCode,
    this.controlAddLimit.toString());

    this.controlSearchPlaceholder = this.getTranslation('CONTROLENTRY.SEARCHPLACEHOLDER');
    this.noResults = this.getTranslation('CONTROLENTRY.SEARCHNORESULTS');
    this.defineOwnControlOption.name = this.getTranslation('CONTROLENTRY.DEFINEOWNCONTROL');
  }

  addAnalyte(event): void {
    // Adding event handling for MS Edge browser
    event.preventDefault();
    const url =
      `/${unRouting.labSetup.lab}/${unRouting.labSetup.analytes}/${this.currentSelectedControl.id}/${unRouting.labSetup.settings}`;
    this.navigationService.navigateToUrl(url, false, this.currentSelectedControl);
  }

  getNewLevels(levelSettings, productLotLevel) {
    if (levelSettings?.levels) {
      this.levels = levelSettings.levels;
    } else {
      this.levels = [];
      for (let i = 0; i < productLotLevel.length; i++) {
        const keyName = level + productLotLevel[i].level + used;
        if (levelSettings) {
          const defaultValue = levelSettings[keyName];
          this.levels.push({ decimalPlace: productLotLevel[i].level, levelInUse: defaultValue , disabled: false });
        } else {
          this.levels.push({ decimalPlace: productLotLevel[i].level, levelInUse: false, disabled : false });
        }
      }
    }
  }

  addFormGroups(numberOfGroups: number) {
    for (let index = 0; index < numberOfGroups; index++) {
      this.addFormControl();
    }
  }

  addFormControl(controlNameItem?: string): void {
    this.hideAddControlLink = true;
    this.controlsGetter.push(this.createControlItem(controlNameItem));
    this.determineEnableAddControlLink();
  }

  getGroupAtIndex(index: number) {
    return (<FormGroup>this.controlsGetter.at(index));
  }

  addFormLotControl(index?: number, lotNumber?: string, customName?: string): void {
    this.getGroupAtIndex(index).addControl('controlInfo', this.createLotItem(lotNumber, customName));
  }

  createControlItem(controlNameItem?: string): FormGroup {
    return this.formBuilder.group({
      controlName: [controlNameItem || ''],
    });
  }

  createLotItem(lotNumber?: string, customName?: string): FormGroup {
    return this.formBuilder.group({
    lotNumber: [lotNumber || '', Validators.required],
      customName: [customName || '', [Validators.minLength(1), Validators.maxLength(textFieldCharLimit)]]
    });
  }

  isDefineOwnControlItem(item: ProductMenuItem): boolean {
    if ((item as ProductOperationMenuItem) === undefined || (item as ProductOperationMenuItem).operationId === undefined) {
      return false;
    }
    return (item as ProductOperationMenuItem).operationId === ProductOperations.DefineOwnControl;
  }

  onControlSelectChange(control: any, pointIndex) {
    this.controlsForm.updateValueAndValidity();
    this.loadLotsFlag[pointIndex] = false;
    this.flag[pointIndex] = (control?.manufacturerName) ? true : false;
    this.removedId = undefined;

    if (control && typeof control !== 'string') {
      if (this.isDefineOwnControlItem(control)) {
        this.showDefineOwnControlForm = true;
        this.getNonBrControls();
        this.title = this.getTranslation('CONTROLENTRY.DEFINECONTROLTITLE')?.replace(instrumentNamePlaceholder, this.selectedLeaf);
      } else {
        // Provided this check since the br-select component is not working properly
        const controlId = control.id;
        this.pointIndex = pointIndex;
        this.lotList[pointIndex] = [];

        this.isDefineOwnControlVisible = false;

        // remove that lot id from assigniedLotIds
        const lotToBeRemoved = this.getGroupAtIndex(pointIndex)?.get(controlInfoLotNumber)?.value;
        if (lotToBeRemoved) {
          this.removedId = lotToBeRemoved.id;
          const removeIndex = this.assignedLotIds.findIndex(item => item === this.removedId);
          if (removeIndex > -1) {
            this.assignedLotIds[removeIndex] = undefined;
          }
        }

        this.loadLots.emit({ controlId, pointIndex });
        if (!this.showSettings) {
          this.addFormLotControl(pointIndex);
        }
        this.getGroupAtIndex(pointIndex)?.get(controlInfoLotNumber)?.setValue('');
        this.getGroupAtIndex(pointIndex)?.get(controlInfoCustomName)?.setValue('');
        this.isControlSelected();
      }
    }
  }

  onDecimalDataChange(decimalData) {
    const prevData = this.settings.levelSettings.decimalPlaces.toString();
    if (decimalData === prevData) {
      this.controlsForm.get('decimalPlaces').markAsPristine();
    }
  }

  // Added below function because br-select needs output function
  onLotChange(lot, pointIndex) {
    if (lot && (!this.assignedLotIds.includes(lot.id))) {
      this.isControlSelected();
      this.assignedLotIds[pointIndex] = lot.id;
      this.assignedProductIds[pointIndex] = lot.productId;
      this.enableAdditionalControlsOnSelect(pointIndex);
    }
    if (lot){
      this.filterAssignedLots();
    }
  }

  onCustomNameChange(itemValue, pointIndex) {
    this.duplicateCustomName[pointIndex] = false;
     this.currentlySelectedControls?.forEach((element) => {
      if (element.productCustomName.trim() && element.productCustomName.trim() === itemValue.trim() &&
        this.currentSelectedControl?.productCustomName?.trim() !== itemValue.trim()) {
        this.duplicateCustomName[pointIndex] = true;
      }
    });
    this.controlsGetter?.value?.forEach((element, index) => {
      const customName = element.controlInfo?.customName.trim();
      if (pointIndex !== index && customName) {
        if (customName && customName === itemValue.trim()) {
          this.duplicateCustomName[pointIndex] = true;
        } else if (customName &&
          !this.currentlySelectedControls.some(_element => _element.productCustomName.trim() === customName) &&
          this.controlsGetter.value.filter(_element => _element.controlInfo?.customName.trim() === customName).length <= 1) {
          this.duplicateCustomName[index] = false;
        }
      }
    });
    this.updateCustomNameDuplicateStatus();
  }

  private updateCustomNameDuplicateStatus() {
    this.isDuplicateCustomName = this.duplicateCustomName.some(item => item);
  }

  onLevelsChange(event?) {
    try {
      this.handleLevelsState();
      this.spcRuleComponent.levelsInUse = 0;
      this.levels.forEach(ele => {
        if (ele.levelInUse === true) {
          this.spcRuleComponent.levelsInUse++;
        }
      });
      if (event) {
        if (event.checked) {
          this.levelsCheckedDetails();
        } else if (this.spcRuleComponent.levelsInUse === 2) {
          this.confirmationDialogRulesHiding(event);
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.OnChangeLevelInUse)));
    }
    this.defaultLevels = cloneDeep(this.levels);
  }

  levelsCheckedDetails() {
    this.spcRuleComponent.rules.find(rule => rule.name === RuleName._2of32s).isVisible = true;
    if (this.spcRuleComponent.levelsInUse <= 2) {
      this.spcRuleComponent.rules.find(rule => rule.name === RuleName._2of32s).isVisible = false;
    }
  }

  confirmationDialogRulesHiding(event) {
    this.spcRuleComponent.rules.find(rule => rule.name === RuleName._2of32s).isVisible = true;
    if (this.spcRuleComponent.levelsInUse <= 2) {
      const confirmDialogRef = this.updateSettingsDialog.open(
        UpdateSettingsDialogComponent,
        {
          width: '1017px',
          data: { message: this.getTranslation('CONTROLENTRY.TRILEVEL') }
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
  }
  isControlSelected() {
    this.isFormValid = this.controlsGetter['controls'].some(control => control.get('controlName').value);
  }

  resetForm() {
    try {
      this.lotList = [];
      this.lotListOriginal = [];
      this.assignedLotIds = [];
      this.assignedProductIds = [];
      this.loadLotsFlag = [false, false, false, false, false];
      this.flag = [false, false, false, false, false];
      this.duplicateCustomName = [];
      this.updateCustomNameDuplicateStatus();
      this.isDefineOwnControlVisible = true;
      if (this.showSettings) {
        this.spcRulesService.setResetRules(true);
        this.controlsForm.reset();
        this.updateFormData();
        this.updateSettingsFormData();
        this.spcRuleComponent.spcRulesForm.markAsUntouched();
        this.spcRuleComponent.spcRulesForm.markAsPristine();
      } else {
        this.isFormValid = false;
        for (let i = this.controlsGetter?.length - 1; i >= 0; i--) {
          this.controlsGetter.removeAt(i);
        }
        this.addFormGroups(this.numberOfInitialBlankControls);
        if ( this.numberOfInitialBlankControls > 1) {
          this.addControlResetDefault();
        }
        this.controlsForm.markAsPristine();
        this.resetControl.emit();
      }
      this.controlsForm.markAsPristine();
      this.controlsForm.markAsUntouched();
      this.archivedGetter.setValue(this.sourceNode ? !!this.sourceNode.isArchived : false);
      this.levels = cloneDeep(this.defaultLevels);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.ResetForm)));
    }
  }

  closeDefineControlsTab() {
    this.showDefineOwnControlForm = false;
    this.isDefineControlsClosed.emit(this.showDefineOwnControlForm);
    this.resetForm();
  }

  onResetClicked(selectedIndex: number) {
    this.loadLotsFlag[selectedIndex] = false;
    this.flag[selectedIndex] = false;
    this.getGroupAtIndex(selectedIndex)?.get(controlName)?.setValue('');
    this.getGroupAtIndex(selectedIndex)?.get(controlInfoCustomName)?.setValue('');
    this.getGroupAtIndex(selectedIndex).removeControl(controlInfo);
    this.getGroupAtIndex(selectedIndex).reset();
    this.getGroupAtIndex(selectedIndex).markAsPristine();
    this.getGroupAtIndex(selectedIndex).markAsUntouched();
    this.lotList[selectedIndex] = [];
    this.lotListOriginal[selectedIndex] = [];
    this.removedId = undefined;
  }

  onLoadLots(): void {
    this.expText = this.getTranslation('CONTROLENTRY.EXP');
    try {
      this.lotListOriginal = this._lotsList;
      this.filterExistingLots();
      if (this.showSettings && this.currentSelectedControl.productInfo.name === this.getGroupAtIndex(0).get('controlName').value.name) {
        const productSelected = Object.assign({}, this.currentSelectedControl.lotInfo, {
          lotWithExpirationDate: this.currentSelectedControl.lotInfo.lotNumber.concat('\xa0\xa0\xa0\xa0'
            + this.expText + ' ' + this.unityNextDatePipe.transform(this.currentSelectedControl.lotInfo.expirationDate, 'mediumDate'))
        });

        this._lotsList[0].push(productSelected);

        const arrayIndexLot = this._lotsList[0]
          .findIndex(lot => lot.lotNumber === this.currentSelectedControl.lotInfo.lotNumber);
        this.addFormLotControl(0);
        this.getGroupAtIndex(0).get(controlInfoLotNumber).setValue(this._lotsList[0][arrayIndexLot]);
        this.currentLotExpirationDate = this._lotsList[0][arrayIndexLot].expirationDate;
        this.getGroupAtIndex(0).get(controlInfoCustomName).setValue(this.currentSelectedControl.productCustomName);
      }
      this.bringLotsWithExpirationDate();
      this.loadLotsFlag[this.pointIndex] = true;
      this.getGroupAtIndex(0).get(controlInfoLotNumber)?.markAsPristine();
      this.getGroupAtIndex(0).get(controlInfoLotNumber)?.markAsUntouched();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.OnLoadLots)));
    }
  }

  bringLotsWithExpirationDate() {
    this._lotsList?.forEach(lots => {
      if (lots) {
        lots.map((lot) => {
          return lot.lotWithExpirationDate = lot.lotNumber.concat('\xa0\xa0\xa0\xa0'
            + this.expText + ' ' + this.unityNextDatePipe.transform(lot.expirationDate, 'mediumDate'));
        });
      }
    });
  }


  // Filtering assignedlots from all selected lot list
  filterAssignedLots() {
    const availableLots = cloneDeep(this.lotListOriginal);
    if (this.assignedLotIds && this.assignedLotIds.length) {
      this.assignedLotIds?.forEach((lotId, skipId) => {
        availableLots?.forEach((availableLot, index) => {
          if (availableLot) {
            const arrayIndex = availableLot.findIndex(lot => lotId === lot.id);
            // filtering  avilable lots except currently selected indexed Lots
            if (arrayIndex > -1 && skipId !== index) {
              availableLot.splice(arrayIndex, 1);
            }
            availableLots[index] = availableLot;
          }
        });
      });
    }
    this._lotsList = this.lotList; // this is done because sorting and filtering was removed

    if (!isEqual(availableLots, this._lotsList)) {
      this._lotsList = availableLots;
    }
    return this._lotsList;
  }


  public filterExistingLots(): void {
    if (this.currentlySelectedControls && this.currentlySelectedControls.length > 0) {
      this._currentlySelectedControls?.forEach(control => {
        const arrayIndex = this._lotsList[this.pointIndex].findIndex(lot => control.lotInfo.id === lot.id);
        if (arrayIndex > -1) {
          this._lotsList[this.pointIndex].splice(arrayIndex, 1);
        }
      });
      this.bringLotsWithExpirationDate();
    }
  }

  deleteAuditTrailControl(selectedControl) {
    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: AuditTrackingEvent.LabSetup,
        action: AuditTrackingAction.Delete,
        actionStatus: AuditTrackingActionStatus.Success,
        currentValue: {
          controlName: selectedControl.lotInfo.productName,
          lotNumber: selectedControl.lotInfo.lotNumber,
          levels: selectedControl.levelSettings.levels,
          productCustomName: selectedControl.productCustomName,
          isSummary: this.settings.levelSettings.isSummary,
        },
      },
    };
    this.appNavigationService.logAuditTracking(auditNavigationPayload, true);
  }


  public onSubmit(formvalues: any, submitDataOnEvaluationPage?: boolean, typeOfOperation?: boolean) {
    try {
      this.isFormSubmitting = true;
      const labConfigFormValues = [];
      let newSettingsFormValue: Settings = new Settings();
      formvalues?.controls?.controls?.forEach(control => {
        const controlToSave = cloneDeep(control);
        if (control?.controls?.controlName.value && control?.controls?.controlInfo.value) {
          const DecimalPlaceValue = (formvalues?.decimalPlaces && formvalues?.decimalPlaces.value)
            ? +formvalues?.decimalPlaces?.value : this.defaultDecimalPlace;
          if (this.showSettings) {
            const settings: Settings = cloneDeep(this.settings);
            this.levels?.forEach((value) => {
              settings.levelSettings[level + value.decimalPlace + used] = value.levelInUse;
            });

            settings.runSettings.minimumNumberOfPoints = this.floatPointData;
            settings.levelSettings.isSummary = formvalues && formvalues?.dataEntryMode?.value;
            settings.levelSettings.decimalPlaces = DecimalPlaceValue;
            settings.archiveState = ArchiveState.NoChange;
            if (this.sourceNode && this.sourceNode.isArchived !== formvalues?.archived?.value) {
              settings.archiveState = formvalues?.archived?.value ? ArchiveState.Archived : ArchiveState.NotArchived;
            }
            this.spcRuleComponent.spcRulesForm.value.ruleSettings?.forEach((value, key) => {
              if (this.spcRuleComponent.spcRulesForm.value.ruleSettings[key]['value'] !== null) {
                this.spcRuleComponent.spcRulesForm.value.ruleSettings[key]['value'] = parseFloat(value.value);
              }
            });
            newSettingsFormValue = getSettings(settings, this.spcRuleComponent.spcRulesForm.value.ruleSettings, this.settings);

            controlToSave.id = this.currentSelectedControl.id; // For the time being
          } else {
            this.checkDefaultAccountSettings();
            newSettingsFormValue.levelSettings = new LevelSettings();
            const defaultLevelSettings = {
              id: '',
              isSummary: this.defaultDataType === DataEntryMode.Summary ? true : false,
              decimalPlaces: this.defaultDecimalPlace,
              level1Used: false,
              level2Used: false,
              level3Used: false,
              level4Used: false,
              level5Used: false,
              level6Used: false,
              level7Used: false,
              level8Used: false,
              level9Used: false
            };
            newSettingsFormValue.levelSettings = defaultLevelSettings;
          }

          controlToSave.manufacturerId = control?.controls?.controlName?.value?.manufacturerId;
          controlToSave.productId = control.controls?.controlInfo?.value?.lotNumber?.productId;
          controlToSave.productMasterLotId = control.controls?.controlInfo?.value?.lotNumber?.id;
          controlToSave.customName = control?.controls?.controlInfo?.value?.customName;
          controlToSave.parentNodeId = this.instrumentId;

          [controlName, controlInfo, name]?.forEach((key) => {
            delete controlToSave[key];
          });
          if (!this.showSettings || (this.showSettings && newSettingsFormValue.archiveState !== ArchiveState.NotArchived)) {
            labConfigFormValues.push({ ...new LabProduct(), ...controlToSave });
          }
        }
      });

      //Remove logAuditTracking once when in lab-config-conrol.effects >  saveLabConfigurationControl$ > aws method stops returing error when unarchive
      if (this.settings?.archiveState && this.settings.archiveState === 1) {
        const auditTrailPayload: AppNavigationTracking = this.appNavigationService
          .comparePriorAndCurrentValues({}, {}, AuditTrackingAction.Unarchive,
            AuditTrackingEvent.LabSetup, AuditTrackingActionStatus.Success);
        this.appNavigationService.logAuditTracking(auditTrailPayload, true);
      }

      if (submitDataOnEvaluationPage) {
        (!this.disableUpdate() ?
          this.openEvaluationMeanSdDialog(newSettingsFormValue) : this.openEvaluationMeanSdDialog());
      } else {
        this.openUpdateSettingsDialog(labConfigFormValues, newSettingsFormValue, typeOfOperation);
      }
    } catch (err) {

      const auditTrailPayload: AppNavigationTracking = this.appNavigationService
        .comparePriorAndCurrentValues({}, {}, AuditTrackingAction.Unarchive,
          AuditTrackingEvent.LabSetup, AuditTrackingActionStatus.Failure);
      this.appNavigationService.logAuditTracking(auditTrailPayload, true);

      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  deleteControl(): void {
    try {
      this.openConfirmLinkDialog(this.currentSelectedControl);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.DeleteControl)));
    }
  }

  openDuplicateNodeDialog() {
    try {
      const availableLots = cloneDeep(this.filterAssignedLots()[this.pointIndex]);
      const existingIndex = availableLots.findIndex(lot => lot.id === this.sourceNode.lotInfo.id);
      availableLots.splice(existingIndex, 1);
      const sourceNode: LabProduct = Object.assign({}, this.sourceNode, { manufacturerId: this.sourceNode?.productInfo?.manufacturerId });
      const duplicateNodeInfo: DuplicateNodeEntry = {
        sourceNode: sourceNode,
        userId: '',
        parentDisplayName: '',
        availableLots: availableLots
      };
      this.dialog.open(DuplicateNodeComponent, {
        width: '450px',
        data: { duplicateNodeInfo }
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.OpenDuplicateLotsDialog)));
    }
  }

  private openConfirmLinkDialog(selectedControl): void {
    const displayText = selectedControl.displayName;
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: { displayText }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletedControl.emit(selectedControl);
        this.deleteAuditTrailControl(selectedControl);
      }
    });
  }

  openEvaluationMeanSdDialog(newSettingsFormValue?) {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '1017px';
      dialogConfig.disableClose = true;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.data = {
        entity: this.currentSelectedControl,
        hasEvaluationMeanSd: (this.settings && this.settings.hasEvaluationMeanSd) ? this.settings.hasEvaluationMeanSd : false,
        settingsValues: (newSettingsFormValue ? newSettingsFormValue : null)
      };
      this.dialog.open(EvaluationMeanSdConfigComponent, dialogConfig);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.OpenEvaluationMeanSdDialog)));
    }
  }

  openUpdateSettingsDialog(labConfigFormValues, newSettingsFormValue, typeOfOperation) {
    try {
      if (this.showSettings && (!this.spcRuleComponent.spcRulesForm.pristine)) {
        const confirmDialogRef = this.updateSettingsDialog.open(
          UpdateSettingsDialogComponent,
          {
            width: '1017px',
            data: {
              message: this.getTranslation('CONTROLENTRY.RULESETTINGS')
            }
          }
        );
        confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.saveLabConfigrationControl.emit({
              labConfigFormValues: labConfigFormValues,
              settings: newSettingsFormValue, typeOfOperation: typeOfOperation
            });
          }
        });
      } else {
        this.saveLabConfigrationControl.emit({
          labConfigFormValues: labConfigFormValues,
          settings: newSettingsFormValue, typeOfOperation: typeOfOperation
        });
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.ControlEntryComponent + blankSpace + Operations.OpenUpdateSettingsDialog)));
    }
  }

  addNonBrControlDefinitionsWithLabSetup(request: CustomControlRequest[]) {
    const settings = new Settings();
    settings.levelSettings = {
      id: '',
      isSummary: this.defaultDataType === DataEntryMode.Summary ? true : false,
      decimalPlaces: this.defaultDecimalPlace,
      level1Used: false,
      level2Used: false,
      level3Used: false,
      level4Used: false,
      level5Used: false,
      level6Used: false,
      level7Used: false,
      level8Used: false,
      level9Used: false
    };
    settings.entityType = EntityType.LabControl;
    const customControlEmitter = {
      request: request, settings: settings
    };
    this.addNonBRControlDefinition.emit(customControlEmitter);
  }

  greyOutForm() {
    return this.showSettings && (this.archivedGetter.value || this.isToggledToNotArchived || this.isParentArchived);
  }

  greyOutAddForm() {
    return !this.showSettings && this.isParentArchived;
  }

  cf_onRemoveItem(pointIndex, hasNoAvailableLots: boolean) {
    // if 'X' pressed without selected the lot, don't do anything
    if (!this.lotList[pointIndex]) {
      return false;
    }
    const bioRadSelectedControls = this.controlsGetter['controls'].filter(obj => obj.value.controlName)
      .filter(val => val.value.controlName?.operationId !== ProductOperations.DefineOwnControl);
    if (bioRadSelectedControls.length === 1) {
      this.isDefineOwnControlVisible = true;
    }

    if (!hasNoAvailableLots) {
      // if one lot (and additionl controls not added) reset the form or we just have one Control Name
      if ((this.cf_isOneLotSelected() && this.controlsGetter?.length <= 3) || this.cf_isOnelabLonfigurationControls()) {
        this.resetForm();
        return false;
      } else if (this.cf_isOneLotSelected()) {
        this.isFormValid = false;
      }
    } else {
      // if has no available lots left
      this.onResetClicked(pointIndex);
      this.filterAssignedLots();
      this.lotList[pointIndex] = [];
      this.lotListOriginal[pointIndex] = [];
      this.duplicateCustomName[pointIndex] = false;
      this.updateCustomNameDuplicateStatus();
      return false;
    }

    // populate lot fields with its original values
    this.controlsGetter.controls?.forEach((control, index) => {
      this.lotList[index] = this.lotListOriginal[index];
    });

    this.loadLotsFlag[pointIndex] = false;
    this.flag[pointIndex] = false;
    this.duplicateCustomName[pointIndex] = false;
    this.updateCustomNameDuplicateStatus();

    // remove that lot id from assigniedLotIds
    const lotToBeRemoved = this.getGroupAtIndex(pointIndex).get(controlInfoLotNumber).value;

    this.getGroupAtIndex(pointIndex).get(controlName).setValue('');
    this.getGroupAtIndex(pointIndex).get(controlInfoCustomName).setValue('');
    this.getGroupAtIndex(pointIndex).removeControl(controlInfo);
    this.getGroupAtIndex(pointIndex).reset();
    this.getGroupAtIndex(pointIndex).markAsPristine();
    this.getGroupAtIndex(pointIndex).markAsUntouched();

    this.removedId = lotToBeRemoved.id;
    const removeIndex = this.assignedLotIds.findIndex(item => item === this.removedId);
    this.assignedLotIds[removeIndex] = undefined;
    this.filterAssignedLots();
    this.lotList[pointIndex] = [];
    this.lotListOriginal[pointIndex] = [];
    if (!this.isFormValid) {
      this.controlsForm.markAsPristine();
    }
    this.onClearDetermineEnabledControls(pointIndex);
  }

  cf_isOneLotSelected(): boolean {
    let c = 0;
    this.lotList?.forEach((item) => {
      if (item && item.length) {
        c++;
      }
    });
    return (c === 1) ? true : false;
  }

  cf_isOnelabLonfigurationControls(): boolean {
    const labConfigurationControls = this._labConfigurationControls.length;
    return (labConfigurationControls === 1) ? true : false;
  }

  // default only first control enabled, hide add additional controls link
  addControlResetDefault() {
    this.getGroupAtIndex(1).get(controlName).disable();
    this.getGroupAtIndex(2).get(controlName).disable();
    this.hideAddControlLink = true;
  }

  // hide or show additional product controls
  enableAdditionalControlsOnSelect(pointIndex : number){
    if ( !this.controlsForm.hasError('required') ) {
      let [emptyControlExists, emptyControlIndex] = this.findFirstEmptyControl(pointIndex, true);
      if (emptyControlExists) {
        this.getGroupAtIndex(emptyControlIndex).get(controlName).enable();
      }
    }
    this.determineEnableAddControlLink();
  }

  // if there are enabled form controls that do not have a selected manufacturer do not enable add control link
  determineEnableAddControlLink() {
    const lengthValue = this.controlsGetter.length;
    let emptyControlsValue = 0;
    for (let i = 0; i < lengthValue; i++) {
      if (this.getGroupAtIndex(i).get(controlName).value === '' ||
        this.getGroupAtIndex(i).get(controlName).value === null){
        emptyControlsValue++;
      }
    }
    this.hideAddControlLink = (emptyControlsValue === 0) ? false : true;
  }

  // if there are empty form controls
  findFirstEmptyControl(pointIndex:number , addInstrument: boolean): [boolean , number] {
    const lengthValue = this.controlsGetter.length;
    for (let i = 0; i < lengthValue; i++) {
        if ((this.getGroupAtIndex(i).get(controlName).value === '' ||
        this.getGroupAtIndex(i).get(controlName).value === null)){
          let anotherEmptyControlsIndex = i;
          return [true, anotherEmptyControlsIndex];
      }
    }
    return [false, 99];  // if none found 99 is an unused placeholder and exceeds valid array length
  }

  onClearDetermineEnabledControls(pointIndex : number) {
    this.hideAddControlLink = true;
    const lengthValue = this.controlsGetter.length;
    // first control is empty, disable all other empty controls
    if (pointIndex === 0) {
      // set i to 1 to skip disabling this control
      for (let i = 1; i < lengthValue; i++) {
        if ((this.getGroupAtIndex(i).get(controlName).value === '' ||
        this.getGroupAtIndex(i).get(controlName).value === null)){
          this.getGroupAtIndex(i).get(controlName).disable();
        }
      }
    } else {
      // check to see if this control or another control should be disabled if niether, this control remains enabled
      let [emptyControlExists, emptyControlIndex] = this.findFirstEmptyControl(pointIndex, false);
      if (emptyControlExists) {
        this.getGroupAtIndex(emptyControlIndex).get(controlName).enable();
        // disable other empty controls if none do nothing
        // start at control after first empty
        for (let i = emptyControlIndex + 1; i < lengthValue; i++) {
          if ((this.getGroupAtIndex(i).get(controlName).value === '' ||
          this.getGroupAtIndex(i).get(controlName).value === null)){
            this.getGroupAtIndex(i).get(controlName).disable();
          }
        }
      }
    }
    this.filterAssignedLots();
  }


  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
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
