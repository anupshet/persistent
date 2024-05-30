// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.

import {
  AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter,
  Input, OnInit, Output, ViewChild, OnDestroy
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { BrMouseOver, BrValidators, ErrorStateMatcherMouseOver } from 'br-component-library';
import * as _ from 'lodash';

import * as generalConstants from '../../../../core/config/constants/general.const';
import * as fromRoot from '../../../../state/app.state';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { icons } from '../../../../core/config/constants/icon.const';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { IconService } from '../../../../shared/icons/icons.service';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { HeaderType } from '../../../../contracts/enums/lab-setup/header-type.enum';
import { Department, LabDepartmentValues } from '../../../../contracts/models/lab-setup/department.model';
import { DataEntryMode } from '../../../../contracts/models/lab-setup/data-entry-mode.enum';
import { User } from '../../../../contracts/models/user-management/user.model';
import { AppUser } from '../../../../security/model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction } from '../../../../shared/models/audit-tracking.model';

@Component({
  selector: 'unext-department-entry-component',
  templateUrl: './department-entry.component.html',
  styleUrls: ['./department-entry.component.scss']
})
export class DepartmentEntryComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  public type = HeaderType;
  @Input() title: string;

  mouseOverSubmit = new BrMouseOver();
  errorStateMatcherMouseOver: ErrorStateMatcherMouseOver;
  errorStateMatchesForPassword: ErrorStateMatcherMouseOver;
  department: Department;
  errorNames = BrValidators.ErrorNames;
  departmentsArray: FormArray;
  departmentForm: FormGroup;
  isFormValid = false;
  hasDepartment: boolean;
  readonly numberOfInitialBlankDepartments = 3;
  public managerNamePlaceholder: string;
  summary = DataEntryMode.Summary;
  public contact: User;
  public currentUser: AppUser;
  showDeleteDepartment = true;
  isFormSubmitting = false;
  public decimalPlaceData = generalConstants.decimalPlace;
  readonly departmentAddLimit = generalConstants.departmentsAddLimit;
  public duplicateFound: Array<boolean> = [];
  archiveState: boolean;
  private destroy$ = new Subject<boolean>();
  permissions = Permissions;

  public getInstrumentsGroupedByDeptVal$ = this.store.pipe(select(fromNavigationSelector.getInstrumentsGroupedByDeptVal));
  // RR 20200320 - Temporarily hide settings fields until there is a decison to propagate these or remove them from the backend.
  //               Once decided, this property should be removed.
  public readonly showSettingsFields = false;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.delete[24]
  ];
  public overlayHeight: string;
  public overlayWidth: string;

  @Input() departments: Array<Department>;
  @Input() errorMessage: string;
  @Input() showSettings: boolean;
  @Output() saveLabConfigurationDepartment = new EventEmitter<LabDepartmentValues>();
  @Input() translationLabelDictionary: {};
  @Input() location: LabLocation;
  @Input() isToggledToNotArchived: boolean;
  @Input() currentNodeArchive: boolean;
  @Input() showArchivedFilterToggle: boolean;
  @Output() deleteDepartmentId = new EventEmitter<string>();

  private _contacts: Array<User>;
  @Input('contacts')
  set contacts(value: Array<User>) {
    this._contacts = value;
    if (value && this.departments && this.departments[0]) {
      this.contact = value.find(item => item.contactId === this.departments[0].departmentManager.id);
      this.addDeptManagerControl(0, this.contact);
    }
  }

  get contacts() {
    return this._contacts;
  }

  get departmentsGetter() {
    return this.departmentForm?.get('departmentsArray') as FormArray;
  }

  get archiveGetter() {
    return this.departmentsGetter?.at(0)?.get('archived') as FormControl;
  }

  @ViewChild('content') content: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private store: Store<fromRoot.State>,
    public dialog: MatDialog,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
  this.appNavigationService.departmentData = this.departments;
    this.appNavigationService.subject.pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.hasDepartment = val;
    });
    if (this.hasDepartment) {
      this.appNavigationService.auditTrailViewData(AuditTrackingAction.Settings);
    }
    try {
      this.errorStateMatcherMouseOver = new ErrorStateMatcherMouseOver(
        this.mouseOverSubmit
      );
      this.setInitForm();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.DepartmentEntryComponent + blankSpace + Operations.OnInit)));
    }
  }

  ngAfterViewInit() {
    try {
      this.sortContacts();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.DepartmentEntryComponent + blankSpace + Operations.SortContacts)));
    }
  }
  ngAfterViewChecked() {
    if (this.content && this.showSettings && this.departments[0].isArchived) {
      this.overlayHeight = this.content.nativeElement.offsetHeight;
    }
  }

  setInitForm() {
    const department = this.departments ? this.departments[0] : null;
    if (this.showSettings && department) {
      this.isFormValid = true;
      this.departmentForm = this.formBuilder.group({
        departmentsArray: this.formBuilder.array([])
      });
      this.archiveState = department.isArchived ? department.isArchived : false;
      this.addFormControl(department.departmentName, this.archiveState);
      this.disableForm();
    } else {
      this.departmentForm = this.formBuilder.group({
        departmentsArray: this.formBuilder.array([])
      });
      this.addFormGroups(this.numberOfInitialBlankDepartments);
      this.disableForm();
    }
    this.populateLocalLabels();
    if (department && department.children && department.children.length > 0) {
      this.showDeleteDepartment = false;
    }

  }

  disableForm() {
    if (this.hasPermissionToAccess([Permissions.DepartmentAdd, Permissions.DepartmentEdit])) {
      this.departmentForm.enable();
    } else {
      this.departmentForm.disable();
    }
  }

  addFormGroups(numberOfGroups: number) {
    for (let index = 0; index < numberOfGroups; index++) {
      this.addFormControl();
    }
  }

  addFormControl(departmentName?: string, archived?: boolean): void {
    this.departmentsGetter?.push(this.createControlItem(departmentName, archived));
  }

  createControlItem(departmentName?: string, archived?: boolean): FormGroup {
    return this.formBuilder.group({
      departmentName: [departmentName || ''],
      archived: [archived || false]
    });
  }

  getGroupAtIndex(index: number) {
    return (<FormGroup>this.departmentsGetter?.at(index));
  }

  addDeptManagerControl(index?: number, departmentManager?: User): void {
    this.getGroupAtIndex(index)?.addControl('departmentManagerGroup', this.createDeptManagerItem(departmentManager));
  }

  private updateOldFlagsOfDuplicateData(names: []) {
    const dupElementList = _(names).groupBy().pickBy(x => x.length > 1).keys().value();
    const filtered = dupElementList.filter(function (el) {
      return el !== '';
    });
    if (filtered.length === 0) {
      for (const key in this.duplicateFound) {
        if (this.duplicateFound[key]) {
          this.duplicateFound[key] = false;
        }
      }
    }
  }

  isNameDuplicate(newValue: string, ownIndex: number) {
    const departmentNames = this.departmentsGetter.value;
    const names = departmentNames.map(item => item.departmentName.trim());

    const hasDup = names.filter((val: string, index: number) => {
      if (index === ownIndex) {
        return;
      }
      this.updateOldFlagsOfDuplicateData(names);
      return val.toLowerCase().trim() === newValue.toLowerCase().trim() ? true : false;
    });

    return hasDup.length > 0 ? true : null;
  }

  checkValidation(duplicateFlagList) {
    let duplicateCount = 0;
    let lengthCount = 0;
    duplicateFlagList.forEach((element, key) => {
      if (!duplicateFlagList[key]) {
        duplicateCount = duplicateCount + 1;
      }
      lengthCount = lengthCount + 1;
    });
    return duplicateCount === lengthCount ? true : false;
  }

  valuechange(newValue, index) {
    try {
      if (newValue) {
        if (this.location?.children?.length && ((this.departments[index] ? newValue !== this.departments[index].departmentName : true))) {
          const children = this.location.children as Department[];
          this.duplicateFound[index] =
            children.find(item => (item.nodeType === EntityType.LabDepartment) ?
              (item.departmentName.toLowerCase().trim() === newValue.toLowerCase().trim()) : false)
              || this.isNameDuplicate(newValue, index) ? true : false;
        }
        this.isFormValid = this.checkValidation(this.duplicateFound);
        if (this.isFormValid) {
          this.addDeptManagerControl(index);
          if (this.contacts && this.contacts.length === 1) {
            this.getGroupAtIndex(index).get('departmentManagerGroup').setValue({
              departmentManager: this.contacts[0],
            });
          }
        }
      } else if (newValue === '') {
        // This makes the form invalid and disables the button when the user deletes the department name.
        this.isFormValid = false;
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.DepartmentEntryComponent + blankSpace + Operations.ValueChange)));
    }
  }

  createDeptManagerItem(departmentManager?: User): FormGroup {
    return this.formBuilder.group({
      departmentManager: [departmentManager || '', Validators.required]
    });
  }

  sortContacts() {
    if (this.contacts && this.contacts.length) {
      const _contacts = Object.assign([], this.contacts);
      this.contacts = null;
      /* TODO: Br-select library component is not working as expected
        in case of single array element. So for the time, did this fix (applied timeout). */
      setTimeout(() => {
        this.contacts = _contacts.sort(
          (u1, u2) =>
            (u1.firstName + u1.lastName) > (u2.firstName + u2.lastName) ? 1 : -1
        );
      }, 1);
    }
  }

  private populateLocalLabels(): void {
    this.managerNamePlaceholder = this.getTranslation('DEPARTMENTENTRY.MANAGERNAME')
  }

  onManagerSelectChange(item) {
    try {
      if (item.id !== undefined) {
        this.departmentForm.patchValue({
          phone: [item || '', [Validators.minLength(1), Validators.maxLength(120)]]
        });
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.DepartmentEntryComponent + blankSpace + Operations.OnManagerSelectChange)));
    }
  }

  deleteDepartment(department) {
    try {
      this.openConfirmLinkDialog(department);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.DepartmentEntryComponent + blankSpace + Operations.DeleteDepartment)));
    }
  }

  private openConfirmLinkDialog(selectedNode): void {
    const displayName = this.departments[0].displayName;
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: { displayName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDepartmentId.emit(selectedNode);
      }
    });
  }

  public enableSubmit(): boolean {
    if (this.isFormSubmitting) {
      return !this.isFormSubmitting;
    } else if (this.departmentForm.valid && !this.departmentForm.pristine) {
      if (this.duplicateFound.filter(duplicate => duplicate).length > 0) {
        return false;
      }
      if (this.isFormValid) {
        return true;
      }
      if (this.archiveGetter.value !== this.departments[0].isArchived) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

  greyOutForm() {
    return this.showSettings && (this.isToggledToNotArchived || (this.archiveGetter && this.archiveGetter.value));
  }

  onArchiveToggle(event, content) {
    if (event.checked && !this.isToggledToNotArchived) {
      this.overlayHeight = content.offsetHeight;
    } else if (!event.checked && this.departments[0].isArchived) {
      this.isToggledToNotArchived = true;
    } else {
      return false;
    }
  }

  onSubmit(formValues: any,typeOfOperation) {
    try {
      this.isFormSubmitting = true;
      const labConfigFormValues = [];
      let archivedSettings: Settings;
      formValues.departmentsArray.forEach(department => {
        let departmentToSave;
        if (department && department.departmentName) {
          departmentToSave = {
            departmentName: department.departmentName,
            departmentManagerId: department.departmentManagerGroup.departmentManager.contactId,
            nodeType: EntityType.LabDepartment,
            parentNodeId: this.location.id
          } as Department;

          if (this.showSettings) {
            let isArchived = ArchiveState.NoChange;
            if (department && this.departments && this.departments.length && department.archived !== this.departments[0].isArchived) {
              isArchived = department.archived ? ArchiveState.Archived : ArchiveState.NotArchived;
            }
            archivedSettings = {
              entityId: this.departments[0].id, // using 0th index as udpate settings only has one node to be updated.
              entityType: EntityType.LabDepartment,
              levelSettings: null,
              runSettings: null,
              ruleSettings: [],
              hasEvaluationMeanSd: false,
              parentEntityId: this.showSettings ? this.departments[0].parentNodeId : this.departments[0].id,
              archiveState: isArchived
            };
            departmentToSave.id = this.departments[0].id;
          }

          labConfigFormValues.push({ ...departmentToSave });
        }
      });
      this.saveLabConfigurationDepartment.emit({ labConfigFormValues, archivedSettings, typeOfOperation });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.DepartmentEntryComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  resetForm() {
    try {
      this.duplicateFound = [];
      if (!this.showSettings) {
        // reset if in Add department
        this.isFormValid = false;
        for (let i = this.departmentsGetter.length - 1; i >= 0; i--) {
          this.departmentsGetter.removeAt(i);
        }
        this.setInitForm();
      } else {
        // reset if in Edit department
        const department = this.departments ? this.departments[0] : null;
        const selectedDepartmentManager = this.contacts.filter(item => item.contactId === department.departmentManager.id);
        this.getGroupAtIndex(0).get(generalConstants.departmentManagerGroup).
          get(generalConstants.departmentManager).patchValue(selectedDepartmentManager[0]);
        this.getGroupAtIndex(0).get(generalConstants.departmentName).setValue((department) ? department.departmentName : '');
        this.archiveGetter.setValue(department ? department.isArchived : false);
      }
      this.departmentForm.markAsPristine();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.DepartmentEntryComponent + blankSpace + Operations.ResetForm)));
    }
  }

  // br-select needs event to be attached, to detect and set value assigned after reset.
  onSelect(value) {
  }
  onManagerNameChange(value) {
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.appNavigationService.subject.next(false);
  }
}
