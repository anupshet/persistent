// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { orderBy, isEqual } from 'lodash';

import { DuplicateInstrumentEntry } from '../../../../contracts/models/lab-setup/duplicate-copy-entry.model';
import { Department, LabLocation, TreePill } from '../../../../contracts/models/lab-setup';
import { asc, customName, duplicateInstrumentArray, textFieldCharLimit, department, blankSpace } from '../../../../core/config/constants/general.const';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { NavigationState } from '../../../../shared/navigation/state/reducers/navigation.reducer';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { DuplicateInstrumentRequest, NodeInfo } from '../../../../contracts/models/lab-setup/duplicate-copy-request.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import * as fromRoot from '../../state';
import * as fromDuplicateSelector from '../../../../shared/state/selectors';
import { StatusCode } from '../../../../shared/api/status-codes.enum';
import { OperationType } from '../../../../contracts/enums/lab-setup/operation-type.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { LocalizationService } from '../../../../shared/navigation/services/localizaton.service';

@Component({
  selector: 'unext-duplicate-instrument-entry',
  templateUrl: './duplicate-instrument-entry.component.html',
  styleUrls: ['./duplicate-instrument-entry.component.scss']
})
export class DuplicateInstrumentEntryComponent implements OnInit, OnDestroy {
  @Output() copyNodeRequest = new EventEmitter<Array<DuplicateInstrumentRequest>>();

  _duplicateNodeInfo: DuplicateInstrumentEntry;
  get duplicateNodeInfo(): DuplicateInstrumentEntry {
    return this._duplicateNodeInfo;
  }
  @Input('duplicateNodeInfo')
  set duplicateNodeInfo(value: DuplicateInstrumentEntry) {
    this._duplicateNodeInfo = value;
  }
  @Input() resetForm: boolean;
  public duplicateInstrumentForm: FormGroup;
  public numOfFormGroups = 1;
  public departmentPlaceholder: string;
  public departmentList: Array<Department>;
  public labLocation: LabLocation;
  public isInstrumentModelDuplicate = false;
  public isCustomNameDuplicate = false;
  public isCustomNameUnique = false;
  public selectedDepartment: Department;
  public isDepartmentAvailable = true;
  protected destroy$ = new Subject<boolean>();
  permissions = Permissions;

  public currentSelectedBranch$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  public getErrors$ = this.labSetupStore.pipe(select(fromDuplicateSelector.getDuplicateLotsStateError));

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<NavigationState>,
    private portalApiService: PortalApiService,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private labSetupStore: Store<fromRoot.LabSetupStates>,
    private translate: TranslateService,
    private localizationService: LocalizationService
  ) { }

  ngOnInit(): void {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.populateDepartmentPlaceholder();
    });
    this.setInitForm();
    this.currentSelectedBranch$
      .pipe(take(1)).subscribe((currentBranch: TreePill[]) => {
        try {
          if (currentBranch?.length && currentBranch[0]?.id) {
            this.portalApiService.getLabSetupNode(currentBranch[0].nodeType, currentBranch[0].id, LevelLoadRequest.LoadUpToGrandchildren)
              .pipe(filter(_node => !!_node), take(1)).subscribe((node: LabLocation) => {
                this.labLocation = node;
                this.loadDepartmentData();
              });
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
              (componentInfo.DuplicateInstrumentEntryComponent + blankSpace + Operations.GetDepartmentListFromCurrentBranch)));
        }

      });

    // Display error message to indicate request was not successful.
    this.getErrors$.pipe(filter(hasError => !!hasError), takeUntil(this.destroy$))
      .subscribe((hasError) => {
        if (hasError.error.status === StatusCode.BadRequest) {
          this.isCustomNameUnique = true;
        }
      });
  }
  populateDepartmentPlaceholder(): void {
    this.departmentPlaceholder = this.getTranslation('DUPLICATEINSTRUMENTENTRY.TODEPARTMENT');
  }
  loadDepartmentData() {
    this.isDepartmentAvailable = this.labLocation.children.some(node => node.nodeType === EntityType.LabDepartment);
    if (this.isDepartmentAvailable) {
      const children = this.labLocation.children as any[];
      const departmentData = children.filter(child => child.nodeType !== EntityType.Panel);
      this.departmentList = orderBy(departmentData, [(node: Department) => node.displayName.replace(/\s/g, '')
        .toLocaleLowerCase()], [asc]);
    } else {
      // if lab with no departments
      this.removeDepartmentControlIfNoDepartments();
    }
  }

  setInitForm() {
    this.duplicateInstrumentForm = this.formBuilder.group({
      duplicateInstrumentArray: this.formBuilder.array([])
    });
    this.addFormGroup(this.numOfFormGroups);
    if (this.hasPermissionToAccess([Permissions.InstrumentAdd])) {
      this.duplicateInstrumentForm.enable();
    } else {
      this.duplicateInstrumentForm.disable();
    }
  }

  addFormGroup(numOfGroups) {
    for (let index = 0; index < numOfGroups; index++) {
      this.addFormControl();
    }
  }
  addFormControl() {
    const group = this.formBuilder.group({
      department: [this.departmentList && this.departmentList.length === 1 ? this.departmentList[0] : '', Validators.required],
      customName: ['' || '', [Validators.minLength(1), Validators.maxLength(textFieldCharLimit)]]
    });
    this.duplicateInstrumentGroupGetter.push(group);
    this.removeDepartmentControlIfNoDepartments();
  }

  removeDepartmentControlIfNoDepartments() {
    if (!this.isDepartmentAvailable && this.duplicateInstrumentGroupGetter) {
      const duplicateFormGroup = <FormGroup>this.duplicateInstrumentGroupGetter.at(0);
      duplicateFormGroup.removeControl(department);
      duplicateFormGroup.get(customName)
        .setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(textFieldCharLimit)]);
      duplicateFormGroup.get(customName).updateValueAndValidity();
      this.checkValidConfiguration();
    }
  }

  get duplicateInstrumentGroupGetter() {
    return this.duplicateInstrumentForm ? this.duplicateInstrumentForm.get(duplicateInstrumentArray) as FormArray : null;
  }

  onDepartmentChange(_department: Department) {
    this.selectedDepartment = _department;
    this.checkValidConfiguration();
  }

  onCustomNameChange() {
    this.checkValidConfiguration();
  }

  checkValidConfiguration() {
    const _customName = this.duplicateInstrumentGroupGetter ? this.duplicateInstrumentGroupGetter.at(0).get(customName).value : '';
    const children = this.labLocation?.children as any[];
    const allInstrumentInsideDepartment = (this.isDepartmentAvailable && this.selectedDepartment) ? this.selectedDepartment?.children :
      // if lab with no departments
      ((this.labLocation && !this.isDepartmentAvailable) ? children.filter(node => node.nodeType !== EntityType.Panel)
        : []);
    this.isInstrumentModelDuplicate = allInstrumentInsideDepartment
      .some(inst => isEqual(inst.instrumentInfo, this.duplicateNodeInfo.sourceNode.instrumentInfo)) && !_customName;
    this.isCustomNameDuplicate = _customName ? allInstrumentInsideDepartment
      .some(inst => inst.instrumentCustomName === _customName) : false;
  }

  copyInstrument(formValues) {
    try {
      const instrumentNode = ({ department, customName: targetEntityCustomName = '' }): NodeInfo => ({
        parentNodeId: this.isDepartmentAvailable ? department?.id ?? '' : this.labLocation?.id ?? '',
        displayName: this.isDepartmentAvailable ? department?.displayName ?? '' : this.labLocation?.displayName ?? '',
        targetEntityCustomName
      });
      const parentNodes: NodeInfo[] = formValues.duplicateInstrumentArray.map(instrumentNode);
      const { nodeType, id: sourceNodeId } = this.duplicateNodeInfo.sourceNode;
      const request: DuplicateInstrumentRequest = {
        nodeType,
        operationType: OperationType.Copy,
        parentNodes,
        sourceNodeId,
        // TASK 204627: Send retainFixedCV flag from UI
        retainFixedCV: true, // as suggested harcoding this value to be true for copy instruments
      }
      this.copyNodeRequest.emit([request]);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DuplicateInstrumentEntryComponent + blankSpace + Operations.CopyRequest)));
    }
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
