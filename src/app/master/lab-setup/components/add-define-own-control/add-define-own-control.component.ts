// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';

import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromAccountSelector from '../../../../shared/state/selectors';
import { Department, LabInstrument, LabLocation, LabProduct, TreePill } from '../../../../contracts/models/lab-setup';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { Operations, blankSpace, componentInfo } from '../../../../core/config/constants/error-logging.const';
import { icons } from '../../../../core/config/constants/icon.const';
import {
  levelCheckboxes, maxLengthForName, maxLengthForManufacturerName, maxLengthForCustomName, expirationStr, maxLengthLimitTextCode,
  controlNamePlaceholder, regexForWhiteSpaces, includeArchivedItems
} from '../../../../core/config/constants/general.const';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { Matrix } from '../../../../contracts/models/lab-setup/matrix.model';
import { AdditionalInstruments } from '../../../../contracts/models/lab-setup/additional-instrument.model';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { IconService } from '../../../../shared/icons/icons.service';
import { CustomControlRequest } from '../../../../contracts/models/control-management/custom-control-request.model';
import { CustomControl } from '../../../../contracts/models/control-management/custom-control.model';
import { CustomControlMasterLot } from '../../../../contracts/models/control-management/custom-control-master-lot.model';
import { ValidationErrorService } from '../../../../shared/api/validationError.service';
import { ControlManagementViewMode } from '../../../../master/control-management/shared/models/control-management.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { LotManagementEnum } from '../../../../master/control-management/shared/models/lot-management.enum';
import { MasterLotDialogComponent } from './../../../control-management/shared/components/master-lot-dialog/master-lot-dialog.component';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { CustomLotManagementComponent } from '../../../control-management/shared/components/custom-lot-management/custom-lot-management.component';
import * as fromSelector from '../../state/selectors';
import { ManufacturerProductDisplayItem } from '../../../../contracts/models/lab-setup/product-list.model';
import * as fromRoot from '../../state';
import * as actions from '../../state/actions';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { MultipleButtonDialogComponent } from '../../../../shared/components/multiple-button-dialog/multiple-button-dialog.component';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
@Component({
  selector: 'unext-add-define-own-control',
  templateUrl: './add-define-own-control.component.html',
  styleUrls: ['./add-define-own-control.component.scss'],
  providers: [UnityNextDatePipe]
})

export class AddDefineOwnControlComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren('customLotManagement') customLotManagements: QueryList<CustomLotManagementComponent>;
  customLotManagementInstances: CustomLotManagementComponent[] = [];

  @Input() title: string;
  @Output() addNonBRControlDefinition = new EventEmitter<CustomControlRequest[]>();
  @Input() viewMode: ControlManagementViewMode;
  @Input() controlToEdit: CustomControl;
  @Input() nonBrControlDefinitionsData: CustomControl[];
  @Input() currentlySelectedControls: LabProduct[];
  isLoading = false;
  @Output() closeDefineControlsTab = new EventEmitter<boolean>();
  @Output() editCustomControl = new EventEmitter<CustomControl>();
  @Output() deleteCustomControl = new EventEmitter<CustomControl>();
  @Output() currentSelectedNode = new EventEmitter<TreePill>();

  public matrixData: Matrix[] = [];
  public additionalInstrumentData: AdditionalInstruments[] = [];
  public levelCheckboxes = levelCheckboxes;
  public allowAddAnother = true;
  public levelsGroup: FormGroup;

  controlData: CustomControl;
  selectedMatrix: {};
  originalLot: CustomControlMasterLot;
  originalLotsList: CustomControlMasterLot[] = [];
  controlCount = 1;
  controlsForm: FormGroup;
  today = new FormControl(new Date());
  startDatePickerValue = this.today.value;
  public currentSelectedBranch$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  public currentAccount$ = this.store.pipe(select(fromAccountSelector.getAccountState));
  public labConfigControlList$ = this.labSetupStore.pipe(select(fromSelector.getLabConfigControlList));
  public getIsArchiveItemsToggleOn$ = this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn));
  accountId: string;
  public instruments: (Department | LabInstrument)[] = [];
  icons = icons;
  maxAllowedCount = 10;
  buttonTitle: string;
  currentInstrumentId: string;
  submitButtonText: string;
  manufacturerMaxLengthErrorMessage: string;
  controlMaxLengthErrorMessage: string;
  customNameMaxLengthErrorMessage: string;
  ControlManagementViewMode = ControlManagementViewMode;
  labConfigurationControlsList: ManufacturerProductDisplayItem[] = [];

  iconsUsed: Array<Icon> = [
    icons.close[18],
    icons.delete[24],
    icons.edit[24],
    icons.addCircle[24],
  ];
  private destroy$ = new Subject<boolean>();
  duplicateControlNamesFound: boolean[] = [];
  duplicateMasterLotNumbersFound: boolean[] = [];
  controlNames: string[] = [];
  masterLotNumbers: string[] = [];
  existingProductMasterLotNumberList: CustomControlMasterLot[] = [];
  displayDuplicateErrMsg: boolean[] = [];
  findDuplicateProductMasterLotNumber: CustomControlMasterLot[] = [];
  permissions = Permissions;
  formIndex = 0;
  showDialog = false;
  controlsFormInitialValue: Object;
  controlsFormStatus = true;
  duplicateCustomNames: boolean[] = [];
  isDuplicateCustomName: boolean;
  isDuplicateControlName: boolean;
  validDate: boolean[] = [];
  dateCheck: boolean;
  enableCancelButton = false;
  navigationCurrentlySelectedNode$ = this.labSetupStore.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  isArchiveItemsToggleOn;
  selectedInstrumentId: string;
  filteredControlNames: CustomControl[];
  confirmSubmission = false;
  selectedLevels: boolean[] = [];
  selectedNode: TreePill;
  isControlNameChanged = false;

  constructor(private formBuilder: FormBuilder,
    private iconService: IconService,
    private store: Store<any>,
    private codeListService: CodelistApiService,
    private validationErrorService: ValidationErrorService,
    private brPermissionsService: BrPermissionsService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private unityNextDatePipe: UnityNextDatePipe,
    private messageSnackBar: MessageSnackBarService,
    private errorLoggerService: ErrorLoggerService,
    private labSetupStore: Store<fromRoot.LabSetupStates>,
    private portalApiService: PortalApiService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AddDefineOwnControlComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnChanges() {
    if (this.viewMode === ControlManagementViewMode.Edit) {
      this.init();
    }
  }

  ngOnInit() {
    this.init();
  }
  init() {
    this.navigationCurrentlySelectedNode$.pipe(filter(currentSelectedNode => !!currentSelectedNode), takeUntil(this.destroy$))
    .subscribe((currentSelectedNode) => {
      this.selectedNode = currentSelectedNode;
      this.selectedInstrumentId = currentSelectedNode['id'];
      this.loadControlsIntoStore(this.selectedInstrumentId);
    });
    this.customLotManagements?.forEach(instance => {
      this.customLotManagementInstances.push(instance);
    });
    this.setInitForm();
    this.loadMatrixData();
    this.loadAccountData();
    this.handleModeVariation();
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.handleModeVariation();
    });
    this.updateFormStatus();
    this.loadControls();

    this.manufacturerMaxLengthErrorMessage = this.getTranslation('ADDDEFINEOWNCONTROL.MANUFACTURERMAXLENGTHERROR')
      ?.replace(maxLengthLimitTextCode, maxLengthForManufacturerName.toString());
    this.controlMaxLengthErrorMessage = this.getTranslation('ADDDEFINEOWNCONTROL.CONTROLMAXLENGTHERROR')
      ?.replace(maxLengthLimitTextCode, maxLengthForName.toString());
    this.customNameMaxLengthErrorMessage = this.getTranslation('ADDDEFINEOWNCONTROL.CUSTOMNAMEMAXLENGTHERROR')
      ?.replace(maxLengthLimitTextCode, maxLengthForName.toString());

    if (this.viewMode === ControlManagementViewMode.Define || this.viewMode === ControlManagementViewMode.DefineAndAdd) {
      this.controlsFormStatus = false;
    }
  }

  trackStatusOfControlsForm() {
    this.getOwnControls()?.forEach((item: FormGroup) => {
      this.controlsFormInitialValue = item?.value;
      item?.valueChanges?.pipe(distinctUntilChanged((prev, next) =>
        JSON.stringify(prev) === JSON.stringify(next)), takeUntil(this.destroy$))
        ?.subscribe(() => {
          this.isLoading = false;
          this.controlsFormStatus = JSON.stringify(item?.value) === JSON.stringify(this.controlsFormInitialValue);
        });
    });
  }

  setInitForm() {
    this.controlsForm = this.formBuilder.group({
      ownControls: this.formBuilder.array([this.viewMode !== ControlManagementViewMode.Edit ?
        this.createBlankControlFormGroup() : this.createControlFormGroup(this.controlToEdit)])
    });
    if (this.viewMode === ControlManagementViewMode.Edit) {
      this.controlData = this.controlToEdit;
    }
  }

  loadControlsIntoStore(instrumentId: string) {
    this.labConfigurationControlsList = [];
    this.labSetupStore.dispatch(actions.LabConfigControlActions.loadControlList({
      request: { accountId: this.accountId, instrumentId: instrumentId } }
    ));
  }

  loadControls() {
    this.labConfigurationControlsList = [];
    this.labConfigControlList$
    .pipe(filter(labConfigurationMasterControls => !!labConfigurationMasterControls), takeUntil(this.destroy$))
    .subscribe((labConfigurationMasterControls: ManufacturerProductDisplayItem[]) => {
      this.labConfigurationControlsList = [];
      this.labConfigurationControlsList = this.labConfigurationControlsList.concat(labConfigurationMasterControls);
    });
  }


  loadMatrixData() {
    this.codeListService.getMatrixDefinitionsAsync().then(matrix => {
      this.matrixData = matrix;
      if (this.viewMode === ControlManagementViewMode.Edit) {
        this.selectedMatrix = this.matrixData.find(m => m?.matrixId === this.controlToEdit?.matrixId);
        this.getOwnControls()[0].get('matrix').setValue(this.selectedMatrix);
        this.trackStatusOfControlsForm();
      }
    });
  }

  loadAccountData() {
    this.currentAccount$.pipe(take(1)).subscribe((res: any) => {
      this.accountId = res?.currentAccountSummary?.id;
      if (!this.nonBrControlDefinitionsData) {
        this.codeListService?.getNonBrControlDefinitions(this.accountId, true).pipe(take(1)).subscribe((data) => {
          this.nonBrControlDefinitionsData = data;
        }, error => {
          if (error.error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, this.getLoadErrorMessage(),
                componentInfo.DefineCustomControlsComponent + blankSpace + Operations.GetCustomControls));
          }
        });
      }
    });
  }

  handleModeVariation() {
    switch (this.viewMode) {
      case ControlManagementViewMode.Define:
        this.submitButtonText = this.getTranslation('ADDDEFINEOWNCONTROL.DEFINE');
        break;
      case ControlManagementViewMode.DefineAndAdd:
        this.getAdditionalInstrumentData();
        this.submitButtonText = this.getTranslation('ADDDEFINEOWNCONTROL.DEFINEADD');
        break;
      case ControlManagementViewMode.Edit:
        this.getAdditionalInstrumentData();
        this.submitButtonText = this.getTranslation('ADDDEFINEOWNCONTROL.UPDATE');
        break;
      default:
        this.submitButtonText = this.getTranslation('ADDDEFINEOWNCONTROL.DEFINE');
        break;
    }
  }

  getExpirationStr(lot: CustomControlMasterLot) {
    const expirationDate = this.unityNextDatePipe.transform(lot?.expirationDate, 'mediumDate');
    return lot?.lotNumber + expirationStr + expirationDate;
  }

  getAdditionalInstrumentData() {
    this.filteredControlNames = [];
    this.getIsArchiveItemsToggleOn$.pipe(take(1)).subscribe((res: any) => { this.isArchiveItemsToggleOn = res; });
    this.currentSelectedBranch$.pipe(take(1)).subscribe((currentBranch: LabLocation[]) => {
      if (currentBranch?.length && currentBranch[0]?.id) {
        const currentInstrument = currentBranch.find(child => child.nodeType === EntityType.LabInstrument);
        this.currentInstrumentId = currentInstrument?.id;
        const locationSelected = currentBranch[0]?.id;
        const selectedNodetype = currentBranch[0]?.nodeType;
        const queryParameter = new QueryParameter(includeArchivedItems, (this.isArchiveItemsToggleOn).toString());
        this.portalApiService.getLabSetupNode(selectedNodetype, locationSelected,
          LevelLoadRequest.LoadAllDescendants, EntityType.None, [queryParameter])
          .pipe(take(1))
          .subscribe((selectedNode: LabLocation) => {
            if (selectedNode) {
              this.additionalInstrumentData = [];
              this.filteredControlNames = [];
              const selectedNodeData = cloneDeep(selectedNode);
              if (selectedNode.locationSettings.instrumentsGroupedByDept) {
                selectedNodeData.children.forEach(dept => {
                  if (dept.nodeType === EntityType.LabDepartment) {
                    dept.children?.forEach(instrument => {
                      if (this.viewMode === ControlManagementViewMode.Edit) {
                        if (instrument?.children != null) {
                          instrument?.children?.forEach((control) => {
                            if (control?.productInfo?.id === this.controlToEdit?.id) {
                              this.filteredControlNames.push(control);
                            }
                          });
                        }
                      }
                      if (instrument.id !== this.selectedInstrumentId) {
                        this.additionalInstrumentData.push({name: instrument.displayName, departmentName: dept.departmentName,
                          instrumentName: instrument.instrumentCustomName ?
                          instrument.instrumentInfo.name : null, id: instrument.id});
                      }
                    });
                  }
                });
                if (this.filteredControlNames.length <= 1) {
                  this.confirmSubmission = true;
                }
              } else {
                selectedNodeData.children.forEach(instrument => {
                  if (instrument.nodeType === EntityType.LabInstrument && instrument.id !== this.selectedInstrumentId) {
                  this.additionalInstrumentData.push({name: instrument.displayName, instrumentName: instrument.instrumentCustomName ?
                    instrument.instrumentInfo.name : null, id: instrument.id});
                  }
                });
              }
            }
          });
      }
    });
  }

  createLevelsForm(): FormArray {
    let levels;
    const form = new FormArray([], [Validators.required]);
    this.selectedLevels = [];
    this.levelCheckboxes.forEach(l => {
      if (this.viewMode === ControlManagementViewMode.Edit && this.controlToEdit) {
        // decision is to present levels of first lot as levels of control as non br concept is slightly different than regular controls.
        if (this.controlToEdit?.lots?.length > 0) {
          this.controlToEdit?.lots?.forEach(item => {
            if (item?.levelInfo) {
              levels = item?.levelInfo?.includes(l);
            }
          });
          this.selectedLevels.push(levels);
          form.push(new FormControl(levels));
        }  else {
          form.push(new FormControl(this.controlToEdit?.lots[0]?.levelInfo?.includes(l)));
        }
      } else {
        form.push(new FormControl(false));
      }
    });
    return form;
  }

  createBlankControlFormGroup(): FormGroup {
    return new FormGroup({
      controlName: new FormControl('', [Validators?.required,
      this.checkForAlphanumericValuesWithSpecialChars,
      this.validationErrorService?.whiteSpacesValidator, Validators?.maxLength(maxLengthForName)]),
      manufacturer: new FormControl('', [Validators?.required,
      this.checkForAlphanumericValues,
      this.validationErrorService?.whiteSpacesValidator, Validators?.maxLength(maxLengthForManufacturerName)]),
      customName: new FormControl('', [Validators?.maxLength(maxLengthForCustomName)]),
      masterLotNumber: new FormControl('', [Validators?.required]),
      expirationDate: new FormControl('', [Validators?.required]),
      matrix: new FormControl('', [Validators.required]),
      additionalInstruments: new FormControl(''),
      levelCheckboxesForm: this.createLevelsForm()
    });
  }

  createControlFormGroup(control: CustomControl): FormGroup {
    this.dateCheck = true;
    this.isLoading = true;
    const matrixForm = this.matrixData.length === 0 ? new FormControl('', [Validators.required]) :
      new FormControl(this.matrixData.find(matrix => matrix?.matrixId === control?.matrixId), [Validators.required]);

    return new FormGroup({
      controlName: new FormControl(control?.name?.replace(regexForWhiteSpaces, blankSpace)?.trim(), [Validators.required,
        Validators.maxLength(maxLengthForName),
        this.checkForAlphanumericValuesWithSpecialChars, this.validationErrorService.whiteSpacesValidator]),
        manufacturer: new FormControl(control?.manufacturerName?.replace(regexForWhiteSpaces, blankSpace)?.trim(),
        [Validators.required, this.checkForAlphanumericValues,
        this.validationErrorService.whiteSpacesValidator, Validators.maxLength(maxLengthForManufacturerName)]),
      masterLotNumber: new FormControl(''),
      masterLotNumberDropdown: new FormControl(control?.lots[0], [Validators.required]),
      matrix: matrixForm,
      levelCheckboxesForm: this.createLevelsForm()
    });
  }

  getLotManagementData(masterLotData: FormGroup, formIndex?: number) {
    const value = masterLotData.value;
    if (masterLotData.valid) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
    this.getOwnControls()[formIndex]?.get('masterLotNumber')?.setValue(value?.masterLotNumber);
    if (value?.expirationDate) {
      const expDate = value.expirationDate;
      this.checkDate(expDate, formIndex);
    }
    if (masterLotData.value.masterLotNumber !== null || masterLotData.value.expirationDate !== null) {
      this.enableCancelButton = true;
    }
  }

  checkForAlphanumericValuesWithSpecialChars(control: FormControl): Object | null {
    const value = control.value;
    const regexForAlphanumeric = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-=| ]*$/;
    if (!regexForAlphanumeric.test(value)) {
      return { invalidInput: true };
    }
    return null;
  }

  checkForAlphanumericValues(control: FormControl): Object | null {
    const value = control.value;
    const regexForAlphaNumericValue = /^[a-zA-Z0-9 ]*$/;
    if (!regexForAlphaNumericValue.test(value)) {
      return { invalidInput: true };
    }
    return null;
  }

  anyLevelSelected(formIndex: number) {
    const formVal = this.getOwnControls()[formIndex].value;
    return formVal.levelCheckboxesForm?.includes(true);
  }

  getOwnControls() {
    return (this.controlsForm.get('ownControls') as FormArray).controls;
  }
  addOwnControlFormGroup() {
    this.controlCount++;
    if (this.controlCount > this.maxAllowedCount) {
      this.controlCount = this.maxAllowedCount;
    } else {
      const ownControls = this.controlsForm.get('ownControls') as FormArray;
      ownControls.push(this.createBlankControlFormGroup());
      this.updateFormStatus();
    }
    if (this.controlCount === this.maxAllowedCount) {
      this.allowAddAnother = false;
    }
  }

  updateFormStatus() {
    this.getOwnControls()?.forEach((ownControl: FormGroup, index: number) => {
      ownControl?.valueChanges?.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.dateCheck = true;
        if (this.anyLevelSelected(index)) {
          (ownControl?.controls?.levelCheckboxesForm as FormArray).controls.forEach(item => {
            item.setErrors(null);
          });
        }
      });
    });
  }

  onRemoveOwnControlForm(i: number) {
    this.controlCount--;
    this.allowAddAnother = true;
    this.dateCheck = true;
    const ownControls = this.controlsForm.get('ownControls') as FormArray;
    if (ownControls.length > 1) {
      ownControls.removeAt(i);
    } else {
      ownControls.reset();
    }
    this.updateFormStatus();
  }

  editMasterLotData(lot: CustomControlMasterLot) {
    this.originalLot = { ...lot };
    this.showDialog = true;
    const dialogRef = this.dialog.open(MasterLotDialogComponent, {
      data: {
        title: this.getTranslation('ADDDEFINEOWNCONTROL.UPDATELOTTITLE')?.replace(controlNamePlaceholder, this.controlToEdit?.name),
        formData: lot,
        mode: LotManagementEnum.Edit,
        lotsList: this.controlToEdit?.lots
      },

      disableClose: true
    });
    dialogRef?.afterClosed()?.subscribe((result) => {
      if (result === true) {
        this.showDialog = false;
        return;
      }
      lot.expirationDate = result.expirationDate;
      lot.lotNumber = result.masterLotNumber;
      lot.accountId = this.accountId;
      this.updateNonBRLot(lot);
      this.showDialog = false;
    });
  }

  onAddNewLot() {
    this.originalLotsList = { ...this.controlToEdit.lots };
    const newLot = new CustomControlMasterLot;
    this.showDialog = true;
    const dialogRef = this.dialog.open(MasterLotDialogComponent, {
      data: {
        title: this.getTranslation('ADDDEFINEOWNCONTROL.ADDNEWLOTTITLE')?.replace(controlNamePlaceholder, this.controlToEdit?.name),
        mode: LotManagementEnum.Add,
        lotsList: this.controlToEdit?.lots
      },
      disableClose: true
    });
    dialogRef?.afterClosed()?.subscribe((result) => {
      if (result === true) {
        this.showDialog = false;
        return;
      }
      newLot.id = null; // We are setting to null for New Lot and API will generate
      newLot.expirationDate = result.expirationDate;
      newLot.lotNumber = result.masterLotNumber;
      newLot.accountId = this.accountId;
      newLot.productId = this.controlToEdit?.lots[0].productId;
      this.addNewNonBRLot(newLot);
      this.showDialog = false;
    });
  }

  addNewNonBRLot(lot: CustomControlMasterLot) {
    this.codeListService.postAddNewNonBRLot(lot).pipe(take(1)).subscribe((response: CustomControlMasterLot) => {
      if (response) {
        this.controlToEdit?.lots.push(response);
        this.isLoading = false;
        this.controlsFormStatus = false;
      }
    }, (error) => {
      if (error.error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.message, this.getAddLotErrorMessage(),
            (componentInfo.AddDefineOwnControlComponent + blankSpace + Operations.AddNewNonBRLot)));
      }
      this.messageSnackBar.showMessageSnackBar(this.getAddLotErrorMessage());
      this.controlToEdit.lots = this.originalLotsList;
    });
  }

  updateNonBRLot(editedLot: CustomControlMasterLot) {
    this.codeListService?.putNonBRLot(editedLot).pipe(take(1)).subscribe((response: CustomControlMasterLot) => {
      if (response) {
        this.controlToEdit.lots.find(lot => lot.id === editedLot.id).lotNumber = response.lotNumber;
        this.controlToEdit.lots.find(lot => lot.id === editedLot.id).expirationDate = response.expirationDate;
      }
    }, (error) => {
      if (error.error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.message, this.getEditLotErrorMessage(),
            (componentInfo.AddDefineOwnControlComponent + blankSpace + Operations.UpdateNonBRLot)));
      }
      this.messageSnackBar.showMessageSnackBar(this.getEditLotErrorMessage());
      this.controlToEdit.lots.find(lot => lot.id === editedLot.id).lotNumber = this.originalLot.lotNumber;
      this.controlToEdit.lots.find(lot => lot.id === editedLot.id).expirationDate = this.originalLot.expirationDate;
    });
  }

  onSubmit() {
    if (this.viewMode === ControlManagementViewMode.Define || this.viewMode === ControlManagementViewMode.DefineAndAdd) {
      this.addNonBRControlDefinition.emit(this.getCustomControlRequest());
      this.isLoading = true;
    } else if (this.viewMode === ControlManagementViewMode.Edit) {
      if (this.filteredControlNames.length > 1 && this.isControlNameChanged) {
        this.showConfirmDialog();
      } else {
        this.editCustomControl.emit(this.getCustomControltoEdit());
        this.currentSelectedNode.emit(this.selectedNode);
      }
    }
  }

  onDeleteControlClicked(control: CustomControl) {
    this.deleteCustomControl.emit(control);
  }

  showConfirmDialog() {
    const dialogRef = this.dialog.open(MultipleButtonDialogComponent, {
      width: '390px',
      data: {
        message : [this.getTranslation('ADDDEFINEOWNCONTROL.CONTROLNAMECHANGEMESSAGE')],
        cancelButton: true,
        cancelButtonText: this.getTranslation('ACCOUNTDETAILS.ADDRESSCONFIRM.CANCEL'),
        buttons: [
          {
            text: this.getTranslation('CONFIRMDELETEDIALOG.CONFIRM'),
            returns: 'CONFIRM',
            flat: true,
            color: 'primary'
          }
        ],
        isCloseIconDisabled: true
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === this.getTranslation('CONFIRMDELETEDIALOG.CONFIRM')) {
        this.confirmSubmission = true;
        this.editCustomControl.emit(this.getCustomControltoEdit());
        this.currentSelectedNode.emit(this.selectedNode);
      } else {
        this.confirmSubmission = false;
      }
    });
  }

  getCustomControlFromForm(val: AbstractControl): CustomControl {
    const value = val.value;
    const levels = [];
    for (let i = 0; i < value?.levelCheckboxesForm?.length; i++) {
      if (value.levelCheckboxesForm[i]) {
        // levels start from 1, not 0.
        levels.push(i + 1);
      }
    }
    const customControl = { accountId: this.accountId,
      manufacturerName: value?.manufacturer, name: value?.controlName, matrixId: value?.matrix?.matrixId } as CustomControl;
    if (this.viewMode === ControlManagementViewMode.Edit) {
      customControl.id = this.controlToEdit?.id;
      customControl.anyLabLotTests = this.controlToEdit?.anyLabLotTests;
      // need to assign new levels to all existing lots of the control.
      const updatedLots = [];
      this.controlToEdit?.lots?.forEach(lot => {
        updatedLots.push({
          accountId: this.accountId, lotNumber: lot?.lotNumber,
          expirationDate: lot?.expirationDate, productName: lot?.productName, levelInfo: levels, id: lot?.id, productId: lot?.productId
        } as CustomControlMasterLot);
      });
      customControl.lots = updatedLots;
    } else {
      const lot = {
        accountId: this.accountId, lotNumber: value?.masterLotNumber,
        expirationDate: value?.expirationDate, productName: value?.controlName, levelInfo: levels
      } as CustomControlMasterLot;
      customControl.lots = [lot];
    }
    return customControl;
  }

  getCustomControls(): CustomControl[] {
    const controlsToAdd = [];
    this.getOwnControls()?.forEach((val) => {
      controlsToAdd.push(this.getCustomControlFromForm(val));
    });
    return controlsToAdd;
  }

  getCustomControlRequest(): CustomControlRequest[] {
    const controlsToAdd = [];
    const customControls = this.getCustomControls();
    this.getOwnControls()?.forEach((val, index) => {
      const value = val?.value;
      const controlToAdd = { control: customControls[index] } as CustomControlRequest;
      if (this.viewMode === ControlManagementViewMode.DefineAndAdd) {
        controlToAdd.customName = value?.customName;
        controlToAdd.instruments = [this.currentInstrumentId];
        const additionalInstruments = value?.additionalInstruments;
        if (additionalInstruments.length > 0) {
          additionalInstruments?.forEach((inst) => {
            if (inst.id !== undefined) {
              controlToAdd?.instruments?.push(inst?.id);
            }
          });
        }
      } else if (this.viewMode === ControlManagementViewMode.Define) {
        // those fields are not required but we still need to send them to comply with BE.
        controlToAdd.customName = '';
        controlToAdd.instruments = [];
      }
      controlsToAdd.push(controlToAdd);
    });
    return controlsToAdd;
  }

  getCustomControltoEdit(): CustomControl {
    // only one control to edit is possible.
    return this.getCustomControlFromForm(this.getOwnControls()[0]);
  }

  onControlNameChange(value: string, index: number) {
    this.formIndex = index;
    this.isLoading = false;
    if (this.viewMode === ControlManagementViewMode.Edit) {
      if (value?.trim() === this.controlToEdit?.name?.trim()) {
        this.displayDuplicateErrMsg[index] = false;
        this.isControlNameChanged = false;
      } else {
        this.isControlNameChanged = true;
        const validatedForms = this.validationErrorService.checkForDuplicateControlNames(
        value, this.nonBrControlDefinitionsData, this.controlsForm, index, this.labConfigurationControlsList);
        this.displayDuplicateErrMsg[index] = validatedForms[index];
      }
    } else {
      const validatedForms  = this.validationErrorService.checkForDuplicateControlNames(
      value?.trim(), this.nonBrControlDefinitionsData, this.controlsForm, index, this.labConfigurationControlsList);
      this.displayDuplicateErrMsg = validatedForms;
    }
    this.updateDuplicateControlNameStatus();
  }

  checkDate(expDate ,  index: number) {
    this.formIndex = index;
    this.validDate[index] = this.validationErrorService.checkForValidDate(expDate);
    if (this.validDate[index] === true) {
      this.getOwnControls()[index]?.get('expirationDate')?.setValue(expDate);
    }
  }

  isValidDate(value, index) {
    this.validDate[index] = value;
    this.dateCheck = this.validDate.every(val => val === true);
  }

  updateDuplicateControlNameStatus() {
    this.isDuplicateControlName = this.displayDuplicateErrMsg?.some(item => item);
  }

  onCustomNameChange(itemValue: string, pointIndex: number) {
    this.isLoading = false;
    this.duplicateCustomNames[pointIndex] = false;
    if (itemValue?.trim() === '' || itemValue?.trim() === null) {
      this.duplicateCustomNames[pointIndex] = false;
      return;
    }

    this.currentlySelectedControls.forEach(item => {
      if (item?.productCustomName?.trim() === itemValue?.trim()) {
        this.duplicateCustomNames[pointIndex] = true;
      }
    });
    const controlsForm = this.controlsForm.get('ownControls') as FormArray;
    controlsForm?.value?.forEach((control, index) => {
      const customName = control?.customName?.trim();
      if (pointIndex !== index && customName) {
        if (customName && customName === itemValue?.trim()) {
          this.duplicateCustomNames[pointIndex] = true;
        } else if (customName &&
          !this.currentlySelectedControls?.some(_element => _element.productCustomName?.trim() === customName) &&
          controlsForm?.value?.filter(_element => _element?.controlInfo?.customName?.trim() === customName).length <= 1) {
          this.duplicateCustomNames[index] = false;
        }
      }
    });
    this.updateCustomNameDuplicateStatus();
  }

  private updateCustomNameDuplicateStatus() {
    this.isDuplicateCustomName = this.duplicateCustomNames.some(item => item);
  }

  resetForm() {
    this.isLoading = true;
    switch (this.viewMode) {
      case ControlManagementViewMode.Define:
        this.controlsForm.reset();
        this.closeDefineControlsTab.emit(true);
        break;
      case ControlManagementViewMode.DefineAndAdd:
        this.customLotManagements.forEach(instance => {
          instance.masterLotDataForm.reset();
        });
        this.controlsForm.reset();
        this.enableCancelButton = false;
        break;
      case ControlManagementViewMode.Edit:
        this.resetToDefault(this.controlData);
        break;
    }
  }

  resetToDefault(controlData) {
    this.controlsForm.markAsPristine();
    const selectedLevels = this.createLevelsForm();
    this.controlsForm.controls.ownControls.patchValue([{
      controlName: controlData.name ? controlData.name.replace(regexForWhiteSpaces, blankSpace)?.trim() : '',
      manufacturer: controlData.manufacturerName ? controlData.manufacturerName.replace(regexForWhiteSpaces, blankSpace)?.trim() : '',
      masterLotNumber: this.controlData.lots[0]?.lotNumber,
      masterLotNumberDropdown: this.controlData.lots[0],
      matrix: this.selectedMatrix ? this.selectedMatrix : {},
      levelCheckboxesForm: selectedLevels.value
    }]);
    this.controlsFormStatus = true;
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  private getLoadErrorMessage(): string {
    return this.getTranslation('ADDDEFINEOWNCONTROL.UNABLETOLOAD');
  }

  private getAddLotErrorMessage(): string {
    return this.getTranslation('ADDDEFINEOWNCONTROL.UNABLETOADDLOT');
  }

  private getEditLotErrorMessage(): string {
    return this.getTranslation('ADDDEFINEOWNCONTROL.UNABLETOEDITLOT');
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
