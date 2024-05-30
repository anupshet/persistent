// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import { DuplicateNodeEntry } from '../../../contracts/models/shared/duplicate-node-entry.model';
import {
  instrument, countToShowSelectAll, controls, selectAllInstruments,
  duplicateNodeArray, instrumentsArray, lotNumber, blankSpace, duplicateLotInstruments, nonBrManufacturerIdStr, valid,
} from '../../../core/config/constants/general.const';
import { ProductLot } from '../../../contracts/models/lab-setup/product-lots-list-point.model';
import { DuplicateControlRequest, NodeInfo, StartNewBrLotRequest, StartNewLotControl, StartNewMasterLot } from '../../../contracts/models/shared/duplicate-control-request.model';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { componentInfo, Operations } from '../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { InstrumentInfo, InstrumentListRequest } from '../../../contracts/models/shared/list-duplicate-lot-instruments.model';
import { OperationType } from '../../../contracts/enums/lab-setup/operation-type.enum';
import { DateTimeHelper } from '../../date-time/date-time-helper';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';
import { AuditTrackingAction, AuditTrackingActionStatus } from '../../models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { CustomControlMasterLot } from '../../../contracts/models/control-management/custom-control-master-lot.model';
import { CustomLotManagementComponent } from '../../../master/control-management/shared/components/custom-lot-management/custom-lot-management.component';
import * as fromAccountSelector from '../../../shared/state/selectors';
import { LabProduct } from '../../../contracts/models/lab-setup';

@Component({
  selector: 'unext-duplicate-node-entry',
  templateUrl: './duplicate-node-entry.component.html',
  styleUrls: ['./duplicate-node-entry.component.scss']
})
export class DuplicateNodeEntryComponent implements OnInit, AfterViewInit, OnChanges {
  _duplicateNodeInfo: DuplicateNodeEntry;
  get duplicateNodeInfo(): DuplicateNodeEntry {
    return this._duplicateNodeInfo;
  }
  @Input('duplicateNodeInfo')
  set duplicateNodeInfo(value: DuplicateNodeEntry) {
    this._duplicateNodeInfo = value;
    this.isNonBrLot = (this.duplicateNodeInfo?.sourceNode?.manufacturerId)?.toString() === nonBrManufacturerIdStr;
    // when this component is loaded 'duplicateNodeInfo' is triggered twice in a row. The second time has real data
    this.duplicateNodeInfoCounter++;
    if (value && value.availableLots && value.availableLots.length > 0) {
      this.lotList = this.duplicateNodeInfo.availableLots;
      // Ascending order
      if (value.availableLots.length > 1) {
        this.lotList = this.dateTimeHelper.sortByDateAsc(this.lotList, 'expirationDate');
      }
    }
  }
  _instrumentList: Array<InstrumentInfo>;
  get instrumentList(): Array<InstrumentInfo> {
    return this._instrumentList;
  }
  @Input('instrumentList')
  set instrumentList(value: Array<InstrumentInfo>) {
    this._instrumentList = value;
    if (value && value.length > 0 && this.duplicateFormGroup) {
      // sort by departmentName on string and number order
      this._instrumentList = this._instrumentList.slice().sort((a, b) =>
        a.departmentName.toLocaleLowerCase().localeCompare(b.departmentName.toLocaleLowerCase(), undefined, { numeric: true }));

      // sort by Instrument customName or instrumentName by string and number order
      this._instrumentList = this._instrumentList.slice().sort((a, b) =>
        ((a.customName) ? a.customName : a.instrumentName).toLocaleLowerCase().localeCompare(
          ((b.customName) ? b.customName : b.instrumentName).toLocaleLowerCase(), undefined, { numeric: true }));
      const index = this._instrumentList.findIndex(ele => ele.instrumentId === this.duplicateNodeInfo.sourceNode.parentNodeId);
      if (index !== -1) {
        // To bring instrument of the current control at the top of the List
        this._instrumentList.unshift(this._instrumentList.splice(index, 1)[0]);
      }
      this.enableDisableRadio();
      this.createInstrumentCheckboxes();
      this.isInstrumentSelected();
    }
  }

  @ViewChild('customLotManagement') customLotManagement: CustomLotManagementComponent;
  @Input() hasNonBrLicense: boolean;
  @Output() duplicationRequest = new EventEmitter<Array<DuplicateControlRequest>>();
  @Output() startNewBrLotRequest = new EventEmitter<Array<StartNewBrLotRequest>>();
  @Output() instrumentListRequest = new EventEmitter<InstrumentListRequest>();
  public lotList: ProductLot[];
  public duplicateFormGroup: FormGroup;
  public noOfFormGroups = 1;
  private _allLotList: CustomControlMasterLot[];
  public selectLotPlaceholder = '';
  public countToShowSelectAll = countToShowSelectAll;
  public selectAllInstrument = true;
  public showInstrumentCheckboxes = false;
  public operationType = OperationType;
  public emitValue = true;
  public duplicateNodeInfoCounter = 0;
  public currentLotNumber = '';
  public permissions = Permissions;
  isNonBrLot: boolean;
  isCustomMasterLotFormValid = true;
  startDatePickerValue = new Date();
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];

  public currentAccount$ = this.store.pipe(select(fromAccountSelector.getAccountState));
  accountId: string;

  @Input('allAvailableLots')
  set allAvailableLots(value) {
    this._allLotList = value;
  }
  get allAvailableLots() {
    return this._allLotList;
  }

  instrumentSelectionValidator: ValidatorFn = (control: FormArray): ValidationErrors | null => {
    const _instruments = control.controls;

    return (_instruments && _instruments.length > 0 && !this.isInstrumentSelected())
      ? { instrumentSelected: false }
      : null;
  }

  constructor(private formBuilder: FormBuilder,
    private iconService: IconService,
    private dialogRef: MatDialogRef<any>,
    private errorLoggerService: ErrorLoggerService,
    private dateTimeHelper: DateTimeHelper,
    private appNavigationService: AppNavigationTrackingService,
    private brPermissionsService: BrPermissionsService,
    public translate: TranslateService,
    private store: Store) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.currentAccount$.pipe(take(1)).subscribe((res) => {
      this.accountId = res?.currentAccountSummary?.id;
    });
    this.setInitForm();
    this.sendAuditTrailPayload();
  }

  ngAfterViewInit(): void {
    this.checkNonBrMasterLotForm({});
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['duplicateNodeInfo']) {
      this.currentLotNumber = this.duplicateNodeInfo?.sourceNode?.lotInfo?.lotNumber ? `(${this.getTranslations('DUPLICATENODEENTRY.LOT')} ${this.duplicateNodeInfo.sourceNode.lotInfo.lotNumber})` : '';
      if (this.isNonBrLot && (!this.lotList || this.lotList?.length <= 0)) {
        this.getListOfInstruments();
      }
    }
  }

  getInstrumentName(instrumentInfo: InstrumentInfo): string {
    return instrumentInfo?.customName ? `${instrumentInfo.customName} (${instrumentInfo?.instrumentName})` :
      instrumentInfo?.instrumentName;
  }

  checkNonBrMasterLotForm(event: Object) {
    if (this.isNonBrLot && (!this.lotList || this.lotList?.length <= 0)) {
      this.duplicateControlGroupsGetter.controls[0].get(lotNumber).setValidators([]);
      this.duplicateControlGroupsGetter.controls[0].get(lotNumber).updateValueAndValidity();
      this.isCustomMasterLotFormValid = this.hasNonBrLicense && this.customLotManagement?.masterLotDataForm.status === valid;
    } else {
      this.isCustomMasterLotFormValid = this.lotList?.length >= 1 && !!event;
    }
  }

  sendAuditTrailPayload(): void {
    const auditTrailPayload = this.appNavigationService.comparePriorAndCurrentValues({}, {},
      AuditTrackingAction.View, AuditTrackingAction.Dashboard, AuditTrackingActionStatus.Success);
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
  }

  createInstrumentCheckboxes() {
    this.showInstrumentCheckboxes = true;
    this.createInstrumentList(0, this.instrumentList.length);
    const index = this.instrumentList.findIndex(ele => ele.instrumentId === this.duplicateNodeInfo.sourceNode.parentNodeId);
    if (index !== -1) {
      const currentInstrument = this.instrumentArrayGetter.at(index).get(instrument);
      currentInstrument.setValue(true);
      currentInstrument.disable();
    }
  }

  setInitForm() {
    this.duplicateFormGroup = this.formBuilder.group({
      duplicateNodeArray: this.formBuilder.array([])
    });
    this.populateLocalLabels();
    this.addFormGroup(this.noOfFormGroups);
  }

  addFormGroup(noOfGroups) {
    for (let index = 0; index < noOfGroups; index++) {
      this.addFormControl();
    }
  }

  addFormControl() {
    const group = this.formBuilder.group({
      lotNumber: ['' || '', [Validators.required]],
      retainFixedCV: [false],
      duplicateLotInstruments: [OperationType.Copy, Validators.required],
      selectAllInstruments: [false],
      instrumentsArray: this.formBuilder.array([], this.instrumentSelectionValidator),
    });
    this.duplicateControlGroupsGetter.push(group);
  }

  get duplicateControlGroupsGetter() {
    return this.duplicateFormGroup ? this.duplicateFormGroup.get(duplicateNodeArray) as FormArray : null;
  }

  get instrumentArrayGetter() {
    return this.duplicateControlGroupsGetter ? this.duplicateControlGroupsGetter.at(0).get(instrumentsArray) as FormArray : null;
  }

  createInstrumentList(startValue: number, delimiter: number) {
    for (let i = startValue; i < delimiter; i++) {
      this.addAnotherInstrument();
    }
  }

  addAnotherInstrument(_instrument?: boolean) {
    this.instrumentArrayGetter.push(this.createInstrument(_instrument));
  }

  createInstrument(_instrument?: boolean): FormGroup {
    return this.formBuilder.group({
      instrument: new FormControl(_instrument || false)
    });
  }

  selectAllInstruments(e) {
    this.selectAllInstrument = e.checked;
    this.instrumentArrayGetter[controls].forEach((value) => {
      if (this.selectAllInstrument) {
        value.get(instrument).setValue(true);
      } else {
        if (!value.get(instrument).disabled) {
          value.get(instrument).setValue(false);
        }
      }
    });
  }

  onCurrentMultipleInstrumentChange(selectedValue: string) {
    try {
      if (selectedValue === OperationType.Duplicate) {
        this.getListOfInstruments();
        this.showInstrumentCheckboxes = true;
      } else {
        this.resetInstrumentList();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DuplicateNodeEntryComponent + blankSpace + Operations.OnCurrentMultipleInstrumentChange)));
    }
  }

  private resetInstrumentList() {
    this.showInstrumentCheckboxes = false;
    this.instrumentArrayGetter.clear();
    this.duplicateControlGroupsGetter.at(0).get(selectAllInstruments).setValue(false);
    this.selectAllInstrument = false;
  }

  private getListOfInstruments(isCalledOnLotChange?: boolean) {
    if (isCalledOnLotChange) {
      this.resetInstrumentList();
    }
    const listRequest = new InstrumentListRequest();
    const lotInfo = this.duplicateControlGroupsGetter?.controls[0]?.get(lotNumber).value;
    listRequest.labInstrumentId = this.duplicateNodeInfo.sourceNode.parentNodeId;
    listRequest.productId = this.duplicateNodeInfo.sourceNode.productId;
    listRequest.sourceProductMasterLotId = this.duplicateNodeInfo.sourceNode.productMasterLotId;
    listRequest.targetProductMasterLotId = lotInfo.id;
    this.instrumentListRequest.emit(listRequest);
  }

  private enableDisableRadio() {
    if (this.instrumentList.length > 1) {
      this.duplicateControlGroupsGetter.controls[0].get(duplicateLotInstruments).setValue(this.operationType.Duplicate);
    } else {
      this.resetInstrumentList();
    }
  }

  onSelectInstrument(e) {
    if (!e.checked && this.selectAllInstrument) {
      this.duplicateControlGroupsGetter.at(0).get(selectAllInstruments).setValue(false);
      this.selectAllInstrument = false;
    }
  }

  isInstrumentSelected() {
    return this.instrumentArrayGetter[controls].some((_instrument) => _instrument.get(instrument).value === true);
  }

  duplicateNode(formValues) {
    try {
      let startNewBrLotRequestArray: Array<StartNewBrLotRequest>;
      const duplicateControlRequestArray = new Array<DuplicateControlRequest>();
      const sourceNode = this.duplicateNodeInfo.sourceNode;
      const instrumentsNodeInfo = new Array<NodeInfo>();
      const onInstrumentNodeInfo = new NodeInfo();
      onInstrumentNodeInfo.parentNodeId = this.duplicateNodeInfo.sourceNode.parentNodeId;
      onInstrumentNodeInfo.displayName = this.duplicateNodeInfo.parentDisplayName;
      instrumentsNodeInfo.push(onInstrumentNodeInfo);
      formValues.duplicateNodeArray.forEach(element => {
        const duplicateControlRequest = new DuplicateControlRequest();
        if (element.instrumentsArray && element.instrumentsArray.length > 0) {
          element.instrumentsArray.forEach((ele, index) => {
            const onMultipleInstrumentNodeInfo = new NodeInfo();
            // As first element will default selected and disabled, actual index of other elements from instrumentList will be index + 1
            const actualIndex = index + 1;
            const instrumetInfo = this.instrumentList[actualIndex];
            if (ele.instrument) {
              onMultipleInstrumentNodeInfo.parentNodeId = instrumetInfo.instrumentId;
              onMultipleInstrumentNodeInfo.displayName = instrumetInfo.customName ? instrumetInfo.customName : instrumetInfo.instrumentName;
              instrumentsNodeInfo.push(onMultipleInstrumentNodeInfo);
            }
          });
        }
        duplicateControlRequest.nodeType = sourceNode.nodeType;
        duplicateControlRequest.operationType = element.duplicateLotInstruments;
        duplicateControlRequest.parentNodes = instrumentsNodeInfo;
        duplicateControlRequest.targetProductMasterLotId = element.lotNumber.id;
        duplicateControlRequest.sourceNodeId = sourceNode.id;
        duplicateControlRequest.retainFixedCV = element.retainFixedCV;
        duplicateControlRequestArray.push(duplicateControlRequest);

        /* Create new master lot payload for non Br control with no lots */
        if (this.isNonBrLot && (!this.lotList || this.lotList?.length <= 0)) {
          const productName = this.duplicateNodeInfo?.sourceNode?.productInfo?.name ?
            this.duplicateNodeInfo?.sourceNode?.productInfo?.name : '';
          const productId = this.duplicateNodeInfo?.sourceNode?.productId ?
            parseInt(this.duplicateNodeInfo?.sourceNode?.productId, 10) : null;
          const control: StartNewLotControl = {
            id: productId,
            name: productName,
            accountId: this.accountId,
            lots: []
          };
          const instruments: string[] = instrumentsNodeInfo.map(nodeInfo => nodeInfo.parentNodeId);
          const customMasterLot: StartNewMasterLot = {
            productId: productId,
            lotNumber: this.customLotManagement?.masterLotDataForm?.controls['masterLotNumber']?.value,
            expirationDate: (this.customLotManagement?.masterLotDataForm?.controls['expirationDate']?.value).toDate(),
            productName: productName,
            retainFixedCV: element.retainFixedCV
          };
          startNewBrLotRequestArray = this.startNewNonBRLot(control, customMasterLot, instruments,
            sourceNode, duplicateControlRequest.operationType);
        }
      });
      (this.isNonBrLot && (!this.lotList || this.lotList?.length <= 0)) ? this.startNewBrLotRequest.emit(startNewBrLotRequestArray) :
        this.duplicationRequest.emit(duplicateControlRequestArray);
      this.sendAuditTrailPayload();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DuplicateNodeEntryComponent + blankSpace + Operations.OnDuplicateNode)));
    }
  }

  startNewNonBRLot(control: StartNewLotControl, lot: StartNewMasterLot, instruments: string[],
    sourceNode: LabProduct, operationType: OperationType): Array<StartNewBrLotRequest> {
    const startNewBrLotRequestArray = new Array<StartNewBrLotRequest>();
    const startNewBrLotRequest = new StartNewBrLotRequest();
    startNewBrLotRequest.control = control;
    startNewBrLotRequest.control.lots.push(lot);
    startNewBrLotRequest.instruments = instruments;
    startNewBrLotRequest.sourceNodeId = sourceNode?.id;
    startNewBrLotRequest.operationType = operationType;
    startNewBrLotRequestArray.push(startNewBrLotRequest);
    return startNewBrLotRequestArray;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onLotChange(event) {
    this.checkNonBrMasterLotForm(event);
    if (event && this.lotList.length === 1 && this.duplicateControlGroupsGetter
      && !isEqual(this.duplicateControlGroupsGetter.controls[0].get(lotNumber).value, event)) {
      this.duplicateControlGroupsGetter.controls[0].get(lotNumber).setValue(event);
    } else if (typeof event !== 'string') {
      this.getListOfInstruments(true);
    }
  }

  private populateLocalLabels(): void {
    this.selectLotPlaceholder = this.getTranslations('TRANSLATION.SELECTLOT');
  }

  resetForm() {
    try {
      this.setInitForm();
      this.showInstrumentCheckboxes = false;
      if (this.isNonBrLot && (!this.lotList || this.lotList?.length <= 0)) {
        this.customLotManagement.initializeForm();
        this.customLotManagement.masterLotDataForm.markAsPristine();
        this.checkNonBrMasterLotForm({});
        // Set instrument radio buttons to original state for no nbr lots available
        this.enableDisableRadio();
        this.createInstrumentCheckboxes();
        this.isInstrumentSelected();
      }
      this.duplicateFormGroup.markAsPristine();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.DuplicateNodeEntryComponent + blankSpace + Operations.ResetForm)));
    }
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  private getTranslations(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
