import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { BrMouseOver, ErrorStateMatcherMouseOver } from 'br-component-library';
import { cloneDeep } from 'lodash';

import { HeaderType } from '../../../../contracts/enums/lab-setup/header-type.enum';
import { LabProduct, TreePill } from '../../../../contracts/models/lab-setup';
import { ManufacturerProduct } from '../../../../contracts/models/lab-setup/product-list.model';
import { ProductLot } from '../../../../contracts/models/lab-setup/product-lots-list-point.model';
import { LabSetupHeader } from '../../../../contracts/models/lab-setup/lab-setup-header.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { IconService } from '../../../../shared/icons/icons.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-lab-configuration-control',
  templateUrl: './lab-configuration-control.component.html',
  styleUrls: ['./lab-configuration-control.component.scss']
})

export class LabConfigurationControlComponent implements OnInit, OnDestroy, AfterViewChecked {
  public type = HeaderType;
  controls: FormArray;
  controlsForm: FormGroup;
  errorStateMatcherMouseOver: ErrorStateMatcherMouseOver;
  errorStateMatchesForPassword: ErrorStateMatcherMouseOver;
  mouseOverSubmit = new BrMouseOver();
  readonly numberOfInitialBlankControls = 4;
  public controlNamePlaceholder = 'Control name';
  public lotNumberPlaceholder = 'Lot number ';
  public customNamePlaceholder = 'Custom name(optional) ';
  public labSetupControlsHeaderNode = 5;
  public lots: ProductLot[] = [];
  isFormValid = false;
  lotIdsToBeSkipped: Array<number> = [];
  pointIndex: number;
  loadLotsFlag = false;
  public labSetupControlsHeader: LabSetupHeader;
  private destroy$ = new Subject<boolean>();
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24],
    icons.menu[24],
  ];

  @Input() instrumentId: string;
  @Input() labConfigurationControls: Array<ManufacturerProduct> = [];

  _lotsList: Array<Array<ProductLot>> = [];
  get lotList(): Array<Array<ProductLot>> {
    return this._lotsList;
  }

  @Input('lotList')
  set lotList(value: Array<Array<ProductLot>>) {
    this._lotsList = value;
    if (this._lotsList.length > 0) {
      this.onLoadLots();
    }
  }

  @Input() translationLabelDictionary: {};
  @Input() errorMessage: string;
  @Input() title: string;
  @Output() saveLabConfigrationControl = new EventEmitter<LabProduct[]>();
  @Output() loadLots = new EventEmitter();

  _currentlySelectedControls: Array<TreePill> = [];
  get currentlySelectedControls(): Array<TreePill> {
    return this._currentlySelectedControls;
  }

  @Input('currentlySelectedControls')
  set currentlySelectedControls(value: Array<TreePill>) {
    this._currentlySelectedControls = value;
  }

  get controlsGetter() {
    return this.controlsForm.get('controls') as FormArray;
  }

  constructor(private formBuilder: FormBuilder,
    public changeDetectionRef: ChangeDetectorRef,
    private dateTimeHelper: DateTimeHelper,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit() {
    try {
      this.errorStateMatcherMouseOver = new ErrorStateMatcherMouseOver(this.mouseOverSubmit);
      this.setInitForm();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnInit)));
    }
  }

  ngAfterViewChecked() {
    if (!this.changeDetectionRef['destroyed']) {
      this.changeDetectionRef.detectChanges();
    }
  }

  setInitForm() {
    this.controlsForm = this.formBuilder.group({
      controls: this.formBuilder.array([])
    });
    this.addFormGroups(this.numberOfInitialBlankControls);
    this.populateLocalLabels();
  }

  private populateLocalLabels(): void {
    if (this.translationLabelDictionary) {
      this.controlNamePlaceholder = this.translationLabelDictionary['controlName'];
      this.lotNumberPlaceholder = this.translationLabelDictionary['lotNumber'];
      this.customNamePlaceholder = this.translationLabelDictionary['customName'];
    }
  }

  addFormGroups(numberOfGroups: number) {
    for (let index = 0; index < numberOfGroups; index++) {
      this.addFormControl();
    }
  }

  addFormControl(controlName?: string): void {
    this.controlsGetter.push(this.createControlItem(controlName));
  }

  getGroupAtIndex(index: number) {
    return (<FormGroup>this.controlsGetter.at(index));
  }

  addFormLotControl(index?: number, lotNumber?: string, customName?: string): void {
    this.getGroupAtIndex(index).addControl('controlInfo', this.createLotItem(lotNumber, customName));
  }

  createControlItem(controlName?: string): FormGroup {
    return this.formBuilder.group({
      controlName: [controlName || ''],
    });
  }

  createLotItem(lotNumber?: string, customName?: string): FormGroup {
    return this.formBuilder.group({
      lotNumber: [lotNumber || '', Validators.required],
      customName: [customName || '', [Validators.minLength(2), Validators.maxLength(30)]]
    });
  }

  onControlSelectChange(controlId: string, pointIndex: number) {
    try {
      this.loadLotsFlag = false;
      this.pointIndex = pointIndex;
      if (controlId) {
        this.addFormLotControl(pointIndex);
        this.lotList[pointIndex] = [];
        this.controlsGetter.value.forEach((product) => {
          if (product.controlName.id === controlId && product.controlInfo.lotNumber !== '') {
            this.lotIdsToBeSkipped.push(product.controlInfo.lotNumber.id);
          }
        });

        this.loadLots.emit({ controlId, pointIndex });
        this.isControlSelected();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnControlSelectChange)));
    }
  }

  onLotChange(lotId) {
    if (lotId) {
      this.isControlSelected();
    }
  }

  onSubmit(formvalues: any) {
    try {
      const labConfigFormValues = [];
      formvalues.controls.forEach(control => {
        if (control.controlName && control.controlInfo) {
          control.manufacturerId = control.controlName.manufacturerId;
          control.name = control.controlName.name;
          control.productId = control.controlInfo.lotNumber.productId;
          control.productMasterLotId = control.controlInfo.lotNumber.id;
          control.customName = control.customName;
          control.parentNodeId = this.instrumentId;
          labConfigFormValues.push({ ...new LabProduct(), ...control });
        }
      });
      this.saveLabConfigrationControl.emit(labConfigFormValues);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  isControlSelected() {
    this.isFormValid = this.controlsGetter['controls'].some(control => control.get('controlName').value);
  }

  resetForm() {
    try {
      this.isFormValid = false;
      for (let i = this.controlsGetter.length - 1; i >= 0; i--) {
        this.controlsGetter.removeAt(i);
      }
      this.lotList.length = 0;
      this.addFormGroups(this.numberOfInitialBlankControls);
      this.controlsForm.markAsPristine();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.ResetForm)));
    }
  }

  onResetClicked(selectedIndex: number) {
    try {
      this.loadLotsFlag = false;
      this.controlsGetter.removeAt(selectedIndex);
      this.lotList.length = 0;
      this.addFormControl();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnResetClicked)));
    }
  }

  onLoadLots(): void {
    try {
      this.filterExpiredLots();
      this.filterExistingLots();
      if (this.lotIdsToBeSkipped && this.lotIdsToBeSkipped.length) {
        this.lotIdsToBeSkipped.forEach((lotId) => {
          const arrayIndex = this._lotsList[this.pointIndex].findIndex(lot => lotId === lot.id);
          if (arrayIndex > -1) {
            this._lotsList[this.pointIndex].splice(arrayIndex, 1);
          }
        });
      }
      this.loadLotsFlag = true;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnLoadLots)));
    }
  }

  public filterExistingLots(): void {
    this._currentlySelectedControls.forEach((control: LabProduct) => {
      const arrayIndex = this._lotsList[this.pointIndex].findIndex(lot => control.lotInfo.id === lot.id);
      if (arrayIndex > -1) {
        this._lotsList[this.pointIndex].splice(arrayIndex, 1);
      }
    });
  }

  public filterExpiredLots(): void {
    const _lotListOrigin = cloneDeep(this._lotsList);
    _lotListOrigin[this.pointIndex].forEach(
      lot => {
        const arrayIndex = this._lotsList[this.pointIndex].findIndex(_lot => this.dateTimeHelper.isExpired(_lot.expirationDate));
        if (arrayIndex > -1) {
          this._lotsList[this.pointIndex].splice(arrayIndex, 1);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
