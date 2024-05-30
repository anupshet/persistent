// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
  SimpleChanges, ChangeDetectorRef, AfterViewChecked, ViewChild, ElementRef
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import * as actions from '../../../../shared/navigation/state/actions';
import * as _ from 'lodash';
import { AppUser } from '../../../../security/model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { HeaderType } from '../../../../contracts/enums/lab-setup/header-type.enum';
import { LabInstrument, TreePill } from '../../../../contracts/models/lab-setup';
import { LabInstrumentListPoint } from '../../../../contracts/models/lab-setup/instrument-list-point.model';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import * as generalConstants from '../../../../core/config/constants/general.const';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as selectors from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../../../state/app.state';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { LabInstrumentValues } from '../../../../contracts/models/lab-setup/instrument.model';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { hasAnalyteLevelNode } from '../../shared/lab-setup-helper';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import * as fromLabSetup from '../../../lab-setup/state/selectors';
import * as fromLabSetupRoot from '../../state';
import { DuplicateInstrumentRequest } from '../../../../contracts/models/lab-setup/duplicate-copy-request.model';
import { DuplicateInstrumentEntryComponent } from '../duplicate-instrument-entry/duplicate-instrument-entry.component';
import { TemplateType } from '../../../../contracts/enums/lab-setup/template-type.enum';
import { RequestNewConfigComponent } from '../../../../shared/components/request-new-config/request-new-config.component';
import { DuplicateInstrumentEntry } from '../../../../contracts/models/lab-setup/duplicate-copy-entry.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, AuditTrail } from '../../../../../app/shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { LocalizationService } from '../../../../shared/navigation/services/localizaton.service';

@Component({
  selector: 'unext-instrument-entry',
  templateUrl: './instrument-entry.component.html',
  styleUrls: ['./instrument-entry.component.scss']
})
export class InstrumentEntryComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() manufacturers: Array<Manufacturer>;
  @Input() labInstrument: Array<LabInstrument>;
  @Input() title: string;
  @Input() departmentId: string;
  @Input() allInstrumentInDep: Array<LabInstrument>;
  @Input() isParentArchived: boolean;
  @Output() labInstruments = new EventEmitter<LabInstrumentValues>();
  @Output() loadInstruments = new EventEmitter<{}>();
  @Output() deletedInstrument = new EventEmitter();
  @Output() restInstrumentConfigData = new EventEmitter();
  @ViewChild('content') content: ElementRef;
  @Output() copyNodeRequest = new EventEmitter<Array<DuplicateInstrumentRequest>>();
  @ViewChild(DuplicateInstrumentEntryComponent) duplicateInstrumentEntryComponent: DuplicateInstrumentEntryComponent;

  type = HeaderType;
  instruments: FormArray;
  instrumentForm: FormGroup;
  instrumentManufacturerPlaceholder: string;
  manufacturerSearchPlaceholder: string;
  modelSearchPlaceholder: string;
  noResults: string;
  instrumentModelPlaceholder: string;
  instrumentLimitMessage = '';
  selectedNode: any;
  duplicateFound: Array<boolean> = [];
  duplicateSerialFound: Array<boolean> = [];
  duplicateInstrumentModelFound: Array<boolean> = [];
  showSettings = true;
  decimalPlaceData = generalConstants.decimalPlace;
  formValueNotSet = true;
  isFormValid = false;
  noChildren = true;
  canDeleteInstrument = false;
  pointIndexOfInstrument: number;
  instrumentModelData: { id: string, name: string, manufacturerName: string };
  cancelButtonEnabled = false;
  isFormSubmitting = false;
  duplicateFoundFlag = true;
  formState = false;
  showArchivedFilterToggle = false;
  public duplicateNodeInfo: DuplicateInstrumentEntry;
  public currentUser: AppUser;
  matrixError = {
    instrument: [],
    customName: [],
    serialNumber: []
  };

  protected destroy$ = new Subject<boolean>();
  readonly instrumentAddLimit = generalConstants.instrumentAddLimit;
  hideAddInstrumentLink = true;

  // RR 20200320 - Temporarily hide settings fields until there is a decison to propagate these or remove them from the backend.
  //               Once decided, this property should be removed.
  public readonly showSettingsFields = false;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.addCircleOutline[24],
    icons.delete[24],
    icons.close[24],
  ];
  overlayHeight: string;
  overlayWidth: string;
  public isToggledToNotArchived: boolean;
  permissions = Permissions;

  numberOfInitialBlankControlsOnUpdate = 1
  numberOfInitialBlankControls = 3

  constructor(private formBuilder: FormBuilder,
    private store: Store<fromRoot.State>,
    private labSetupStore: Store<fromLabSetupRoot.LabSetupStates>,
    private navigationService: NavigationService,
    public dialog: MatDialog,
    private iconService: IconService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private errorLoggerService: ErrorLoggerService,
    private appNavigationService: AppNavigationTrackingService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService,
    private localizationService: LocalizationService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.AddIcons)));
    }
  }

  _instrumentList: Array<Array<LabInstrumentListPoint>> = [];
  get instrumentList(): Array<Array<LabInstrumentListPoint>> {
    return this._instrumentList;
  }

  @Input('instrumentList')
  set instrumentList(value: Array<Array<LabInstrumentListPoint>>) {
    try {
      this._instrumentList = value;
      if (this.formValueNotSet && this.showSettings && this._instrumentList) {
        this.updateForm();
      }
      if (this.cancelButtonEnabled && this.selectedNode && this.showSettings) {
        const instModel = this.getGroupAtIndex(0).get([generalConstants.instrumentInfo, generalConstants.instrumentModel].join('.'));
        if (instModel) {
          instModel.setValue(this.instrumentList[0].find(item => item.id === this.selectedNode.instrumentInfo.id));
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.SetInstrumentList)));
    }
  }

  navigationShowSettings$ = this.store.pipe(select(fromNavigationSelector.getNavigationState));
  archiveToggleState$ = this.labSetupStore.pipe(select(fromLabSetup.getSettings));

  ngOnInit() {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.populateLabels();
    });
    this.appNavigationService.auditTrailViewData(AuditTrackingAction.Settings);
    try {
      this.router.events.pipe(takeUntil(this.destroy$)).subscribe(
        (event) => {
          if (event instanceof NavigationEnd) {
            if (this.showSettings) {
              this.setInitForm();
              this.formValueNotSet = true;
              this.updateForm();
            }
          }
        });
      this.navigationShowSettings$.pipe(takeUntil(this.destroy$)).subscribe((result) => {
        if (result && result.showSettings !== undefined) {
          this.showSettings = result.showSettings;
        }
      });
      this.archiveToggleState$.pipe(takeUntil(this.destroy$)).subscribe((settings) => {
        if (settings && settings.archiveState === ArchiveState.NotArchived) {
          this.isToggledToNotArchived = false;
        }
      });
      this.setInitForm();
      if (this.selectedNode) {
        this.showArchivedFilterToggle = hasAnalyteLevelNode(this.selectedNode);
      } else {
        this.showArchivedFilterToggle = false;
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.OnInit)));
    }
  }

  setWidthHeight(parent, actionCard) {
    if (parent && actionCard) {
      if (!this.isParentArchived) {
        this.overlayHeight = (parseInt(parent.clientHeight, 0) - parseInt(actionCard.clientHeight, 0)).toString();
      } else {
        this.overlayHeight = parent.clientHeight;
      }
      this.overlayWidth = parent.offsetWidth;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      if (this.content && this.selectedNode.isArchived) {
        const contentParent = this.content.nativeElement.offsetParent;
        const actionCard = contentParent.children[2];
        this.setWidthHeight(contentParent, actionCard);
      }
      if (changes.instrumentList && changes.instrumentList.currentValue
        && changes.instrumentList.currentValue.length !== 0 && this.formValueNotSet && this.showSettings) {
        this.updateForm();
      }
      if (changes.instrumentList && changes.instrumentList.currentValue &&
        changes.instrumentList.currentValue[this.pointIndexOfInstrument] && this.instrumentsGetter && !this.showSettings) {
        const getInstrumentModel = this.instrumentsGetter[generalConstants.controls][this.pointIndexOfInstrument]
          .get(generalConstants.instrumentInfo).get(generalConstants.instrumentModel);
        if (changes.instrumentList.currentValue[this.pointIndexOfInstrument].length === 1) {
          getInstrumentModel.setValidators(Validators.nullValidator);
          getInstrumentModel.setValue(changes.instrumentList?.currentValue[this.pointIndexOfInstrument][0]);
        } else {
          getInstrumentModel.setValidators(Validators.required);
        }
        getInstrumentModel.updateValueAndValidity();
      }

      if (changes.manufacturers && changes.manufacturers.currentValue && changes.manufacturers.currentValue.length > 0
        && this.formValueNotSet && this.selectedNode && this.selectedNode.instrumentInfo &&
        this.selectedNode.instrumentInfo.manufacturerId) {

        const selectedManufacturer = changes.manufacturers.currentValue.find(item => item.manufacturerId ===
          this.selectedNode.instrumentInfo.manufacturerId);
        if (selectedManufacturer) {
          this.onInstrumentManufacturerSelect(selectedManufacturer);
          this.updateForm();
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.OnChange)));
    }
  }
  naviagtionSelectedNode$ = this.store.pipe(select(selectors.getCurrentlySelectedNode));
  navigationSelectedLeaf$ = this.store.pipe(select(selectors.getCurrentlySelectedLeaf));
  navigationCurrentBranch$ = this.store.pipe(select(selectors.getCurrentBranchState));
  getSelectedNode() {
    this.naviagtionSelectedNode$.pipe(takeUntil(this.destroy$)).subscribe((selectedNode) => {
      if (selectedNode && selectedNode.nodeType === EntityType.LabInstrument) {
        this.setSelectedNode(selectedNode);
      } else {
        this.navigationSelectedLeaf$.pipe(takeUntil(this.destroy$)).subscribe((selectedLeaf) => {
          if (selectedLeaf && selectedLeaf.nodeType === EntityType.LabInstrument) {
            this.setSelectedNode(selectedLeaf);
          }
        });
      }
    });
  }

  setSelectedNode(selectedNode: TreePill) {
    this.selectedNode = selectedNode as LabInstrument;
    const _duplicateNodeInfo = new DuplicateInstrumentEntry();
    _duplicateNodeInfo.sourceNode = this.selectedNode;
    this.duplicateNodeInfo = _.cloneDeep(_duplicateNodeInfo);
    if (this.selectedNode && this.selectedNode.children && this.selectedNode.children.length > 0) {
      this.canDeleteInstrument = true;
    }
    if (this.manufacturers && this.manufacturers.length && this.formValueNotSet) {
      const selectedManufacturer = this.manufacturers.find(item => item.manufacturerId ===
        this.selectedNode.instrumentInfo.manufacturerId);
      if (selectedManufacturer) {
        this.onInstrumentManufacturerSelect(selectedManufacturer);
        this.updateForm();
      }
    }
  }

  updateForm() {
    if (this.instrumentForm && !_.isEmpty(this.selectedNode) && this.formValueNotSet) {
      if (this.instrumentList.length !== 0) {
        if (this.selectedNode.instrumentInfo) {
          this.getGroupAtIndex(0).get(generalConstants.instrumentManufacturer).setValue(this.manufacturers.find(item =>
            item.manufacturerId === this.selectedNode.instrumentInfo.manufacturerId));
        }
        const instModel = this.getGroupAtIndex(0).get([generalConstants.instrumentInfo, generalConstants.instrumentModel].join('.'));
        if (instModel) {
          instModel.setValue(this.instrumentList[0].find(item => item.id === this.selectedNode.instrumentInfo.id));
        }
        const instCustomName = this.getGroupAtIndex(0).get([generalConstants.instrumentInfo, generalConstants.customName].join('.'));
        const instSerialNumber = this.getGroupAtIndex(0).get([generalConstants.instrumentInfo, generalConstants.serialNumber].join('.'));
        const instIsArchived = this.getGroupAtIndex(0).get([generalConstants.instrumentInfo, generalConstants.isArchived].join('.'));
        this.noChildren = !this.selectedNode.children || this.selectedNode.children.length === 0;
        if (instCustomName && instModel.value !== '') {
          instCustomName.setValue(this.selectedNode.instrumentCustomName);
        }
        if (instSerialNumber && instModel.value !== '') {
          instSerialNumber.setValue(this.selectedNode.instrumentSerial);
        }
        if (instModel && instCustomName && instSerialNumber) {
          this.formValueNotSet = false;
        }
        if (instIsArchived) {
          instIsArchived.setValue(this.selectedNode ? this.selectedNode.isArchived : false);
        }
      }
    }
  }

  resetForm() {
    try {
      this.formValueNotSet = true;
      this.duplicateSerialFound = [];
      this.duplicateInstrumentModelFound = [];
      this.duplicateFound = [];
      if (this.showSettings) {
        this.cancelButtonEnabled = true;
        this.updateForm();
        this.duplicateInstrumentEntryComponent.setInitForm();
      } else {
        this.isFormValid = false;
        this.instrumentList = [];
        for (let i = this.instrumentsGetter.length - 1; i >= 0; i--) {
          this.instrumentsGetter.removeAt(i);
        }
        this.addFormGroups(this.numberOfInitialBlankControls);
        if ( this.numberOfInitialBlankControls > 1) {
          this.addInstrumentResetDefault();
        }
        this.instrumentForm.reset();
        this.restInstrumentConfigData.emit();
      }
      this.instrumentForm.markAsPristine();
      this.instrumentForm.markAsUntouched();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.ResetForm)));
    }
  }

  populateLabels() {
    this.instrumentManufacturerPlaceholder = this.getTranslation('INSTRUMENTENTRY.INSTRUMENTMANU');
    this.instrumentModelPlaceholder = this.getTranslation('INSTRUMENTENTRY.INSTRUMENTMODEL');
    this.instrumentLimitMessage = this.getTranslation('INSTRUMENTENTRY.INSTRUMENTLIMIT1') + ' ' + this.instrumentAddLimit.toString() + ' ' + this.getTranslation('INSTRUMENTENTRY.INSTRUMENTLIMIT');
    this.manufacturerSearchPlaceholder = this.getTranslation('INSTRUMENTENTRY.SEARCHMANUFACTURERSPLACEHOLDER');
    this.modelSearchPlaceholder = this.getTranslation('INSTRUMENTENTRY.SEARCHMODELSPLACEHOLDER');
    this.noResults = this.getTranslation('INSTRUMENTENTRY.SEARCHNORESULTS');
  }

  checkFormState() {
    let formValues = null;
    if (this.instrumentForm.value.instruments[0]?.instrumentInfo) {
      formValues = {
        instrumentCustomName: this.instrumentForm?.value?.instruments[0]?.instrumentInfo.customName,
        instrumentSerial: this.instrumentForm?.value?.instruments[0]?.instrumentInfo.serialNumber,
        instrumentModel: this.instrumentForm?.value?.instruments[0]?.instrumentInfo.instrumentModel,
        isArchived: this.instrumentForm?.value?.instruments[0]?.instrumentInfo.isArchived,
        instrumentManufacturer: this.instrumentForm?.value?.instruments[0]?.instrumentManufacturer
      };
    } else {
      formValues = {
        instrumentCustomName: '',
        instrumentSerial: '',
        instrumentModel: '',
        isArchived: false,
        instrumentManufacturer: ''
      };
    }

    let selectedNodeValues = null;

    if (this.selectedNode) {
      selectedNodeValues = {
        instrumentCustomName: this.selectedNode.instrumentCustomName,
        instrumentSerial: this.selectedNode.instrumentSerial,
        instrumentModel: this.selectedNode.instrumentInfo,
        isArchived: this.selectedNode.isArchived,
        instrumentManufacturer: {
          manufacturerId: this.selectedNode.instrumentInfo.manufacturerId,
          name: this.selectedNode.instrumentInfo.manufacturerName
        }
      };
    } else {
      selectedNodeValues = {
        instrumentCustomName: '',
        instrumentSerial: '',
        instrumentModel: '',
        isArchived: false,
        instrumentManufacturer: {
          manufacturerId: '',
          name: ''
        }
      };
    }

    this.formState = _.isEqual(formValues, selectedNodeValues);
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  onNameChange(itemValue, pointIndex, instrumentModelId?: number) {
    try {
      if (itemValue !== null) {
        if (this.showSettings) {
          this.checkFormState();
        }
        itemValue = itemValue.trim();
        if (this.allInstrumentInDep) {
          this.allInstrumentInDep = this.allInstrumentInDep.filter(item => item.id !== this.selectedNode.id);
          const instrumentListWithDisplayName = [];
          this.allInstrumentInDep.forEach(element => {
            instrumentListWithDisplayName.push(element.instrumentCustomName);
          });
          if (itemValue) {
            this.duplicateFound[pointIndex] = this.allInstrumentInDep.find(item => item.instrumentCustomName.toLowerCase() ===
              itemValue.toLowerCase()) ||
              this.isNameDuplicate(itemValue, pointIndex, generalConstants.customName, instrumentListWithDisplayName) ? true : false;
            if (this.duplicateFound[pointIndex] || (!this.duplicateFound[pointIndex] && this.duplicateInstrumentModelFound[pointIndex])) {
              this.duplicateInstrumentModelFound[pointIndex] = false;
            }
            if (!this.duplicateFound[pointIndex] && !this.duplicateInstrumentModelFound[pointIndex]
              && this.instrumentsGetter?.value[pointIndex]?.instrumentInfo.customName === ''
              && this.instrumentsGetter?.value[pointIndex]?.instrumentInfo.customName !== this.selectedNode.instrumentCustomName) {
              this.onInstrumentChange(this.instrumentsGetter?.controls[pointIndex]['controls']
                .instrumentInfo.controls.instrumentModel?.value?.id, pointIndex);
            }
          } else {
            this.duplicateFound[pointIndex] = false;
            this.isNameDuplicate(itemValue, pointIndex, generalConstants.customName, instrumentListWithDisplayName);
          }
          this.updateDuplicateInstruments();
          this.checkValidation();
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.OnNameChange)));
    }
  }

  private updateDuplicateInstruments() {
    if (this.instrumentsGetter?.controls && this.instrumentsGetter?.controls.length) {
      this.instrumentsGetter?.controls.forEach((instrument, index) => {
        const instrumentInfoVal = instrument['controls'].instrumentInfo?.controls;
        if (instrumentInfoVal?.instrumentModel?.value.id) {
          this.duplicateInstrumentModelFound[index] = this.instrumentsGetter?.controls.some((_instrument, selfIndex) => {
            if (index !== selfIndex) {
              const _instrumentInfo = _instrument['controls'].instrumentInfo?.controls;
              return instrumentInfoVal?.instrumentModel?.value.id === _instrumentInfo?.instrumentModel?.value.id &&
                instrumentInfoVal?.customName.value.trim() === _instrumentInfo?.customName.value.trim();
            }
          }) || this.allInstrumentInDep?.some((_instrument) => {
            return instrumentInfoVal?.instrumentModel?.value.id === _instrument?.instrumentInfo?.id &&
              instrumentInfoVal?.customName.value.trim() === _instrument?.instrumentCustomName.trim();
          });
        } else {
          this.duplicateInstrumentModelFound[index] = false;
        }
      });
    }
  }

  onSerialNoChange(itemValue, pointIndex) {
    try {
      if (itemValue) {
        if (this.showSettings) {
          this.checkFormState();
        }
        itemValue = itemValue.trim();
        if (this.allInstrumentInDep) {
          this.allInstrumentInDep = this.allInstrumentInDep.filter(item => item.id !== this.selectedNode.id);
          const instrumentListWithSerialName = [];
          this.allInstrumentInDep.forEach(element => {
            instrumentListWithSerialName.push(element.instrumentSerial);
          });
          if (itemValue) {
            this.duplicateSerialFound[pointIndex] =
              this.allInstrumentInDep.find(item => item.instrumentSerial.toLowerCase() === itemValue.toLowerCase())
                || this.isNameDuplicate(itemValue, pointIndex, generalConstants.serialNumber, instrumentListWithSerialName) ? true : false;
          } else {
            this.duplicateSerialFound[pointIndex] = false;
            this.isNameDuplicate(itemValue, pointIndex, generalConstants.serialNumber, instrumentListWithSerialName);
          }
          this.checkValidation();
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.OnSerialNoChange)));
    }
  }

  onInstrumentChange(itemValue, pointIndex) {
    try {
      if (this.showSettings) {
        this.checkFormState();
      }
      if (this.allInstrumentInDep?.length >= 1) {
        this.allInstrumentInDep = this.allInstrumentInDep.filter(item => item.id !== this.selectedNode.id);
        const instrumentModelList = [];
        this.allInstrumentInDep.forEach(element => {
          instrumentModelList.push(element.instrumentInfo.id);
        });
        if (itemValue) {
          this.checkDuplicateInstrumentModelFound(pointIndex, itemValue, instrumentModelList);
        } else {
          this.duplicateInstrumentModelFound[pointIndex] = false;
          this.isNameDuplicate(itemValue, pointIndex, generalConstants.instrumentModel, instrumentModelList);
        }
        if (!this.showSettings) {
          this.resetFormValue(pointIndex);
        }
        if (this.showSettings && !this.formValueNotSet && this.duplicateInstrumentModelFound[pointIndex] &&
          (this.instrumentsGetter?.value[pointIndex]?.instrumentInfo.customName === this.selectedNode.instrumentCustomName)) {
          this.onNameChange(this.instrumentsGetter?.value[pointIndex]?.instrumentInfo.customName, pointIndex, itemValue);
        }
        this.checkValidation();
      } else {
        // we just created a a new department
        const dupArr = this.isNameDuplicate(itemValue, pointIndex, generalConstants.instrumentModel, []);
        if (dupArr) {
          this.duplicateInstrumentModelFound[pointIndex] = true;
          this.checkValidation();
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.OnInstrumentChange)));
    }
  }

  private checkDuplicateInstrumentModelFound(pointIndex: any, itemValue: any, instrumentModelList: any[]) {
    this.duplicateInstrumentModelFound[pointIndex] =
      this.allInstrumentInDep.find(item => this.isNameDuplicate(itemValue, pointIndex,
        generalConstants.instrumentModel, instrumentModelList)) ? true : false;
  }

  isNameDuplicate(newValue: string, ownIndex: number, propertyName: string, listWithAdditionalProperty?: any[]) {
    const instrumentsNames = this.instrumentsGetter.value;
    let instrumentInfo = instrumentsNames.map(item => item.instrumentInfo);
    instrumentInfo = JSON.parse(JSON.stringify(instrumentInfo, function (key, value) { return (value === undefined) ? '' : value; }));
    let names = [];

    if (propertyName === generalConstants.instrumentModel) {
      names = instrumentInfo.map(item => item[propertyName] ? item[propertyName].id : '');
    } else {
      names = instrumentInfo.map(item => item && item[propertyName] ? item[propertyName].trim() : '');
    }
    if (listWithAdditionalProperty) {
      names = [...names, ...listWithAdditionalProperty];
    }
    this.updateOldFlagsOfDuplicateData(names, propertyName);
    let hasDup;
    if (propertyName === generalConstants.instrumentModel) {
      hasDup = names.filter((val: string, index: number) => {
        if (index === ownIndex) {
          return;
        }
        return val === newValue ? true : false;
      });
    } else {
      hasDup = names.filter((val: string, index: number) => {
        if (index === ownIndex) {
          return;
        }
        return val.toLowerCase() === newValue.toLowerCase() ? true : false;
      });
    }
    return hasDup.length > 0 ? true : false;
  }

  private updateOldFlagsOfDuplicateData(names: any[], propertyName: string) {
    const dupElementList = _(names).groupBy().pickBy(x => x.length > 1).keys().value();
    const filtered = dupElementList.filter(Boolean);

    if (filtered.length === 0) {
      if (propertyName === generalConstants.instrumentModel) {
        this.duplicateInstrumentModelFound.forEach((element, key) => {
          this.duplicateInstrumentModelFound[key] = false;
        });
      } else if (propertyName === generalConstants.serialNumber) {
        this.duplicateSerialFound.forEach((element, key) => {
          this.duplicateSerialFound[key] = false;
        });
      } else if (propertyName === generalConstants.customName) {
        this.duplicateFound.forEach((element, key) => {
          this.duplicateFound[key] = false;
        });
      }
    }
  }

  checkValidation() {
    this.duplicateFoundFlag = !this.duplicateFound.some(flag => flag)
      && !this.duplicateSerialFound.some(flag => flag) && !this.duplicateInstrumentModelFound.some(flag => flag);
  }

  onInstrumentManufacturerSelect(item, index?) {
    try {
      if (item && typeof index !== 'undefined' && this.showSettings) {
        this.checkFormState();
      }
      if (item) {
        const manufacturerId = item.manufacturerId;
        let pointIndex;
        if (this.showSettings) {
          pointIndex = '0';
        } else {
          pointIndex = index;
        }
        this.pointIndexOfInstrument = pointIndex;

        this.addFormInstrument(pointIndex, null, null, null, this.selectedNode.isArchived);
        if (manufacturerId) {
          this.loadInstruments.emit({ manufacturerId, pointIndex });
        }
        // just in case
        this.duplicateSerialFound[pointIndex] = false;
        this.duplicateInstrumentModelFound[pointIndex] = false;
        this.duplicateFound[pointIndex] = false;
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.OnInstrumentManufacturerSelect)));
    }
  }

  resetFormValue(pointIndex) {
    const instCustomName = this.getGroupAtIndex(pointIndex).get([generalConstants.instrumentInfo, generalConstants.customName].join('.'));
    if (instCustomName && instCustomName.value !== '') {
      instCustomName.setValue('');
    }
    const instSerialNumber =
      this.getGroupAtIndex(pointIndex).get([generalConstants.instrumentInfo, generalConstants.serialNumber].join('.'));
    if (instSerialNumber && instSerialNumber.value !== '') {
      instSerialNumber.setValue('');
    }
  }

  cf_onRemoveItem(pointIndex) {
    const formValues = this.instrumentForm?.controls.instruments;
    let hasErrors = false;

    // do nothing if you click remove button without choosing manufacturer
    if (this.getGroupAtIndex(pointIndex).get(generalConstants.instrumentManufacturer).value === '') {
      return false;
    }

    // if one instrument reset the form
    if (this.cf_isOneInstrumentSelected(formValues) && this.instrumentsGetter.length <= 3) {
      this.resetForm();
      return false;
    }

    // remove item from formValues
    formValues['controls'][pointIndex].controls.instrumentManufacturer.value = '';
    const instModel = this.instrumentsGetter[generalConstants.controls][pointIndex]
      .get(generalConstants.instrumentInfo).get(generalConstants.instrumentModel);
    if (instModel) {
      instModel.setValue('');
    }
    delete formValues['controls'][pointIndex].controls.instrumentInfo.value;

    // fake reset in form itself for that group of items
    this.instrumentsGetter.setControl(pointIndex, this.createItem());
    this.instrumentList[pointIndex] = null;
    this.resetFormValue(pointIndex);

    this.cf_checkInstrument(formValues);
    this.cf_checkName(formValues);
    this.cf_checkSerialNumber(formValues);

    this.cf_clearAllErrorMsgs();

    hasErrors = (
      this.matrixError.instrument.length ||
      this.matrixError.customName.length ||
      this.matrixError.serialNumber.length) ? true : false;

    if (hasErrors) {
      this.cf_onErrors();
    }

    this.isInstrumentSelected();
    this.updateDuplicateInstruments();
    this.checkValidation();
    this.onClearDetermineEnabledControls(pointIndex);
  }

  cf_isOneInstrumentSelected(formValues): boolean {
    let c = 0;
    formValues.controls.forEach((instrument) => {
      if (instrument?.controls.instrumentManufacturer.value) {
        c++;
      }
    });
    return (c === 1) ? true : false;
  }

  cf_checkInstrument(formValues) {
    const errs = [];
    const instrumentModelList = [];
    const instrumentListWithDisplayName = [];
    const formInstruments = [];

    this.allInstrumentInDep?.forEach(element => {
      instrumentModelList.push(element.instrumentInfo.id);
    });

    this.allInstrumentInDep?.forEach(element => {
      instrumentListWithDisplayName.push(element.instrumentCustomName.toLowerCase());
    });

    formValues?.controls?.forEach((instrument) => {
      const instrumentInfo = instrument?.controls?.instrumentInfo?.controls;
      if (instrumentInfo?.instrumentModel?.value && instrumentInfo?.instrumentModel?.value?.id !== '') {
        formInstruments.push(instrumentInfo?.instrumentModel?.value?.id);
      }
    });

    formValues?.controls?.forEach((instrument, index) => {
      const instrumentInfo = instrument?.controls?.instrumentInfo?.controls;
      if (instrumentInfo?.instrumentModel?.value && instrumentInfo?.instrumentModel?.value?.id !== '') {
        // push index of item if already exist and it doenst have custom name
        instrumentModelList?.forEach(id => {
          if (instrumentInfo?.instrumentModel?.value?.id === id) {
            if (this.cf_isCustomNameDuplicate(instrumentInfo.customName?.value, index, instrumentListWithDisplayName)) {
              errs.push(index);
            }
          }
        });
        // push index of item if there is duplicate in the form and it doenst have custom name
        const duplicates = this.cf_duplicates(formInstruments);
        duplicates.forEach(id => {
          if ((instrumentInfo?.instrumentModel?.value?.id).toString() === id) {
            if (this.cf_isCustomNameDuplicate(instrumentInfo.customName?.value, index, instrumentListWithDisplayName)) {
              errs.push(index);
            }
          }
        });
      }
    });

    // set customName in matrixError as an empty array if no errors or an array with indexes of items with errors
    const arr = errs.filter((v, i, a) => a.indexOf(v) === i);
    this.cf_setMatrixError('instrument', arr);
  }

  cf_isCustomNameDuplicate(name, index, instrumentListWithDisplayName): boolean {
    if (name) {
      return this.isNameDuplicate(name.trim(), index, generalConstants.customName, instrumentListWithDisplayName);
    }
    return false;
  }

  cf_checkName(formValues) {

    const errs = [];
    const instrumentListWithDisplayName = [];
    const formCustomNames = [];

    this.allInstrumentInDep.forEach(element => {
      instrumentListWithDisplayName.push(element.instrumentCustomName.toLowerCase());
    });

    formValues.controls.forEach((instrument) => {
      const instrumentInfo = instrument?.controls?.instrumentInfo?.controls;
      if (instrumentInfo && instrumentInfo.customName?.value !== '') {
        formCustomNames.push(instrumentInfo.customName?.value);
      }
    });

    formValues.controls.forEach((instrument, index) => {
      const instrumentInfo = instrument?.controls?.instrumentInfo?.controls;
      if (instrumentInfo && instrumentInfo.customName?.value !== '') {
        instrumentListWithDisplayName.forEach(name => {
          if (instrumentInfo.customName?.value.toLowerCase() === name) {
            errs.push(index);
          }
        });

        const duplicates = this.cf_duplicates(formCustomNames);
        duplicates.forEach(name => {
          if (instrument.instrumentInfo.customName.toLowerCase() === name) {
            errs.push(index);
          }
        });
      }
    });
    const arr = errs.filter((v, i, a) => a.indexOf(v) === i);
  }

  cf_checkSerialNumber(formValues) {

    const errs = [];
    const instrumentListWithSerialName = [];
    const formSerialNumber = [];

    this.allInstrumentInDep.forEach(element => {
      instrumentListWithSerialName.push(element.instrumentSerial);
    });

    formValues.controls.forEach((instrument) => {
      const instrumentInfo = instrument?.controls?.instrumentInfo?.controls;
      if (instrumentInfo && instrumentInfo.serialNumber?.value !== '') {
        formSerialNumber.push(instrumentInfo.serialNumber?.value);
      }
    });

    formValues.controls.forEach((instrument, index) => {
      const instrumentInfo = instrument?.controls?.instrumentInfo?.controls;
      if (instrumentInfo && instrumentInfo.serialNumber?.value !== '') {
        instrumentListWithSerialName.forEach(no => {
          if (instrumentInfo.serialNumber?.value === no) {
            errs.push(index);
          }
        });

        const duplicates = this.cf_duplicates(formSerialNumber);
        duplicates.forEach(no => {
          if (instrument.instrumentInfo.serialNumber === no) {
            errs.push(index);
          }
        });
      }
    });

    const arr = errs.filter((v, i, a) => a.indexOf(v) === i);
    this.cf_setMatrixError('serialNumber', arr);
  }

  cf_setMatrixError(k, v) {
    this.matrixError[k] = v;
  }

  // returns array of duplicate strings
  // cf_duplicates(['tom','bob','bob','ana']) will return ['bob']
  cf_duplicates(arr): Array<any> {
    const uniq = arr.map((name) => {
      return {
        count: 1,
        name: name
      };
    }).reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count;
      return a;
    }, {});
    return Object.keys(uniq).filter((a) => uniq[a] > 1);
  }

  cf_clearAllErrorMsgs() {
    this.duplicateSerialFound = [];
    this.duplicateInstrumentModelFound = [];
    if (this.instrumentsGetter?.controls && this.instrumentsGetter?.controls?.length) {
      const instrumentModelList = [];
      this.allInstrumentInDep.forEach(element => {
        instrumentModelList.push(element.instrumentInfo.id);
      });
      this.instrumentsGetter?.controls.forEach((instrument, index) => {
        const instrumentInfo = instrument['controls'].instrumentInfo?.controls;
        if (instrumentInfo?.instrumentModel?.value.id) {
          this.checkDuplicateInstrumentModelFound(index, instrumentInfo?.instrumentModel?.value.id, instrumentModelList);
        } else {
          this.duplicateInstrumentModelFound[index] = false;
        }
      });
    }
    this.duplicateFound = [];
  }

  cf_onErrors() {
    if (this.matrixError.instrument.length) {
      this.matrixError.instrument.forEach(i => {
        this.duplicateInstrumentModelFound[i] = true;
      });
    }
    if (this.matrixError.customName.length) {
      this.matrixError.customName.forEach(i => {
        this.duplicateFound[i] = true;
      });
    }
    if (this.matrixError.serialNumber.length) {
      this.matrixError.serialNumber.forEach(i => {
        this.duplicateSerialFound[i] = true;
      });
    }
  }


  onSubmit(formValues, typeOfOperation) {
    try {
      const labConfigFormValues = [];
      let instrumentToSave;
      this.isFormSubmitting = true;
      const nodeType = EntityType.LabInstrument;
      let archiveState = ArchiveState.NoChange;

      formValues?.instruments?.controls.forEach(instrument => {
        const instrumentManufacturer = instrument?.controls?.instrumentManufacturer.value;
        const instrumentInfo = instrument?.controls?.instrumentInfo?.controls;
        if (instrument && instrumentManufacturer && instrumentManufacturer?.manufacturerId
          && instrumentInfo && instrumentInfo?.instrumentModel?.value && instrumentInfo?.instrumentModel?.value?.id) {
          instrumentToSave = {
            parentNodeId: this.showSettings ? this.selectedNode.parentNodeId : this.departmentId,
            instrumentCustomName: instrumentInfo.customName?.value,
            instrumentId: instrumentInfo.instrumentModel?.value?.id,
            manufacturerId: instrumentManufacturer?.manufacturerId,
            instrumentSerial: instrumentInfo?.serialNumber?.value,
            nodeType: EntityType.LabInstrument
          } as LabInstrument;

          if (this.showSettings) {
            instrumentToSave.id = this.selectedNode.id;
            if (this.selectedNode && this.selectedNode.isArchived !== instrumentInfo.isArchived?.value) {
              archiveState = instrumentInfo.isArchived?.value ? ArchiveState.Archived : ArchiveState.NotArchived;
            }
          }
          if (!this.showSettings || (this.showSettings && (archiveState !== ArchiveState.NotArchived))) {
            labConfigFormValues.push(instrumentToSave);
          }
        }
      });
      const archivedSettings: Settings = this.showSettings ? {
        entityId: instrumentToSave.id,
        entityType: EntityType.LabInstrument,
        levelSettings: null,
        runSettings: null,
        ruleSettings: [],
        hasEvaluationMeanSd: false,
        parentEntityId: this.showSettings ? this.selectedNode.parentNodeId : this.departmentId,
        archiveState: archiveState
      } : null;
      if (archiveState !== ArchiveState.NoChange) {
        this.archiveAuditTrail(archiveState);
      }
      this.labInstruments.emit({ labConfigFormValues, archivedSettings, nodeType, typeOfOperation });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  greyOutForm() {
    return this.showSettings && (this.isToggledToNotArchived || (this.archiveGetter && this.archiveGetter.value));
  }

  redirectToControl(event) {
    // Adding event handling for MS Edge browser
    event.preventDefault();
    this.navigationService.navigateToUrl(`lab-setup/controls/${this.selectedNode.id}/settings`, false, this.selectedNode);
  }

  setInitForm() {
    if (this.instrumentForm) {
      this.instrumentForm.reset();
    } else {
      this.instrumentForm = this.formBuilder.group({
        instruments: this.formBuilder.array([])
      });
    }

    if (this.showSettings) {
      this.addFormGroups(this.numberOfInitialBlankControlsOnUpdate);
      this.getSelectedNode();
    } else {
      this.selectedNode = true;
      if (this.instrumentsGetter.length === 0) {
        this.addFormGroups(this.numberOfInitialBlankControls);
      }
    }
    this.populateLabels();
    if (this.hasPermissionToAccess([Permissions.InstrumentAddViewOnly, Permissions.InstrumentEditViewOnly])) {
      this.instrumentForm.disable();
    } else {
      this.instrumentForm.enable();
      this.addInstrumentResetDefault();
    }
  }

  addFormGroups(numberOfGroups: number) {
    for (let index = 0; index < numberOfGroups; index++) {
      this.addFormManufacturer();
    }
  }

  addFormManufacturer(instrumentManufacturer?: string): void {
    this.hideAddInstrumentLink = true;
    if (this.instrumentsGetter) {
      this.instrumentsGetter.push(this.createItem(instrumentManufacturer));
    }
    this.determineEnableAddInstrumentLink();
  }

  get instrumentsGetter() {
    return this.instrumentForm.get(generalConstants.instruments) as FormArray;
  }

  getGroupAtIndex(index: number) {
    return (<FormGroup>this.instrumentsGetter.at(index));
  }

  addFormInstrument(index?: number, instrument?: string, customName?: string, serialNumber?: string, isArchived?: boolean): void {
    this.getGroupAtIndex(index).addControl(generalConstants.instrumentInfo,
      this.createInstrumentItem(instrument, customName, serialNumber, isArchived));
  }

  createItem(instrumentManufacturer?: string): FormGroup {
    return this.formBuilder.group({
      instrumentManufacturer: [instrumentManufacturer || '']
    });
  }

  createInstrumentItem(instrument?, customName?, serialNumber?, isArchived?) {
    return this.formBuilder.group({
      instrumentModel: [instrument || '', [Validators.required]],
      customName: [customName || '', [Validators.maxLength(generalConstants.textFieldCharLimit)]],
      serialNumber: [serialNumber || '',
      [Validators.maxLength(generalConstants.textFieldCharLimit), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      isArchived: [isArchived || false]
    });
  }

  onRequestInstrumentConfig() {
    this.dialog.open(RequestNewConfigComponent, {
      width: '450px',
      data: {
        templateId: TemplateType.Instrument,
        name: this.getTranslation('INSTRUMENTENTRY.INSTRUMENT')
      }
    });
  }

  isInstrumentSelected() {
    this.isFormValid = this.instrumentsGetter[generalConstants.controls]
      .some(control => control.get(generalConstants.instrumentManufacturer).value);
  }

  onInstrumentSelectChange(item, pointIndex) {
    try {
      if (item && item.id) {
        this.instrumentModelData = item;
        this.isInstrumentSelected();
        this.onInstrumentChange(item.id, pointIndex);
        this.updateDuplicateInstruments();
        this.enableAdditionalInstrumentsOnSelect(pointIndex);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.OnInstrumentSelectChange)));
    }
  }

  deleteInstrumentAuditTrail(selectedNode) {
    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: AuditTrackingEvent.LabSetup,
        action: AuditTrackingAction.Delete,
        actionStatus: AuditTrackingActionStatus.Success,
        currentValue: {
          manufacturerName: selectedNode.instrumentInfo.manufacturerName,
          name: selectedNode.instrumentInfo.name,
        },
      },
    };
    this.appNavigationService.logAuditTracking(auditNavigationPayload, true);
  }

  deleteInstrument(): void {
    try {
      this.openConfirmLinkDialog(this.selectedNode);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.InstrumentEntryComponent + blankSpace + Operations.DeleteInstrument)));
    }
  }

  private openConfirmLinkDialog(selectedNode): void {
    const displayName = selectedNode.displayName;
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: { displayName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletedInstrument.emit(selectedNode);
        this.deleteInstrumentAuditTrail(selectedNode);
      }
    });
  }

  onArchiveToggle(event, content) {
    this.store.dispatch(actions.NavBarActions.toggleArchiveItems({ isArchiveItemsToggleOn: event.checked }));

    if (event.checked && !this.isToggledToNotArchived) {
      const contentParent = content.offsetParent;
      this.overlayHeight = (parseInt(contentParent.clientHeight, 0) - parseInt(contentParent.children[1].clientHeight, 0)).toString();
      this.overlayWidth = contentParent.offsetWidth;
    } else if (!event.checked && this.selectedNode.isArchived) {
      this.isToggledToNotArchived = true;
    } else {
      return false;
    }
  }

  get archiveGetter() {
    if (this.getGroupAtIndex(0).get('instrumentInfo')) {
      return this.getGroupAtIndex(0).get('instrumentInfo').get('isArchived');
    } else {
      return null;
    }
  }

  disableUpdate() {
    if ((this.archiveGetter && this.archiveGetter.pristine) &&
      (!this.isFormValid || !this.instrumentForm.valid || !this.duplicateFoundFlag || this.formState)) {
      return true;
    } else {
      return false;
    }
  }

  copyInstrument(requests: DuplicateInstrumentRequest[]) {
    this.copyInstrumentAuditTrail(requests);
    this.copyNodeRequest.emit(requests);
  }

  disableCancel() {
    return !this.duplicateInstrumentEntryComponent.duplicateInstrumentForm.valid;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  isInstrumentTouched() {
    const { instruments } = this.instrumentForm.value
    return instruments.some(instrument => instrument.instrumentManufacturer !== '' && instrument.instrumentManufacturer !== null)
  }

  // default only first control enabled, hide add additional controls link
  addInstrumentResetDefault() {
    this.getGroupAtIndex(1).get(generalConstants.instrumentManufacturer).disable();
    this.getGroupAtIndex(2).get(generalConstants.instrumentManufacturer).disable();
    this.hideAddInstrumentLink = true;
  }

  // hide or show additional instrument controls
  enableAdditionalInstrumentsOnSelect(pointIndex : number){
    if ( !this.instrumentForm.hasError('required') ) {
      let [emptyControlExists, emptyControlIndex] = this.findFirstEmptyControl(pointIndex, true);
      if (emptyControlExists) {
        this.getGroupAtIndex(emptyControlIndex).get(generalConstants.instrumentManufacturer).enable();
      }
    }
    this.determineEnableAddInstrumentLink();
  }

    // if there are enabled form controls that do not have a selected manufacturer do not enable add instruments link
  determineEnableAddInstrumentLink() {
    const lengthValue = this.instrumentsGetter.length;
    let emptyControlsValue = 0;
    for (let i = 0; i < lengthValue; i++) {
      if (this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).value === '' ||
        this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).value === null){
        emptyControlsValue++;
      }
    }
    this.hideAddInstrumentLink = (emptyControlsValue === 0) ? false : true;
  }

  // if there are empty form controls
  findFirstEmptyControl(pointIndex:number , addInstrument: boolean): [boolean , number] {
    const lengthValue = this.instrumentsGetter.length;
    for (let i = 0; i < lengthValue; i++) {
        if ((this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).value === '' ||
        this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).value === null)){
          let anotherEmptyControlsIndex = i;
          return [true, anotherEmptyControlsIndex];
      }
    }
    return [false, 99];  // if none found 99 is an unused placeholder and exceeds valid array length
  }

  onClearDetermineEnabledControls(pointIndex : number) {
    this.hideAddInstrumentLink = true;
    const lengthValue = this.instrumentsGetter.length;
    // first control is empty, disable all other empty controls
    if (pointIndex === 0) {
      // set i to 1 to skip disabling this control
      for (let i = 1; i < lengthValue; i++) {
        if ((this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).value === '' ||
        this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).value === null)){
          this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).disable();
        }
      }
    } else {
      // check to see if this control or another control should be disabled if niether, this control remains enabled
      let [emptyControlExists, emptyControlIndex] = this.findFirstEmptyControl(pointIndex, false);
      if (emptyControlExists) {
        this.getGroupAtIndex(emptyControlIndex).get(generalConstants.instrumentManufacturer).enable();
        // disable other empty controls if none do nothing
        // start at control after first empty
        for (let i = emptyControlIndex + 1; i < lengthValue; i++) {
          if ((this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).value === '' ||
          this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).value === null)){
            this.getGroupAtIndex(i).get(generalConstants.instrumentManufacturer).disable();
          }
        }
      }
    }
  }

  // #region audit trail
  private copyInstrumentAuditTrail(requests: DuplicateInstrumentRequest[]) {
    const { displayName = '', targetEntityCustomName = '' } = requests[0].parentNodes[0];
    const auditTrail: AuditTrail = {
      eventType: AuditTrackingAction.LabSetup,
      action: AuditTrackingAction.Copy,
      actionStatus: AuditTrackingActionStatus.Success,
      currentValue: {
        displayName,
        targetEntityCustomName,
      }
    };
    this.appNavigationService.logAuditTracking({ auditTrail }, true);
  }

  private archiveAuditTrail(archiveState: ArchiveState) {
    const action = archiveState === ArchiveState.Archived ? AuditTrackingAction.Archive : AuditTrackingAction.Unarchive;
    const auditTrail = {
      eventType: AuditTrackingAction.LabSetup,
      actionStatus: AuditTrackingActionStatus.Success,
      action
    };
    this.appNavigationService.logAuditTracking({ auditTrail }, true);
  }
  // end #region audit trail

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
