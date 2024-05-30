import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';

import { BrMouseOver, BrValidators, ErrorStateMatcherMouseOver } from 'br-component-library';

import { Department } from './../../../../contracts/models/lab-setup/department.model';
import { User } from './../../../../contracts/models/user-management/user.model';
import { HeaderType } from '../../../../contracts/enums/lab-setup/header-type.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-lab-configuration-department',
  templateUrl: './lab-configuration-department.component.html',
  styleUrls: ['./lab-configuration-department.component.scss']
})
export class LabConfigurationDepartmentComponent implements OnInit, AfterViewInit {

  public type = HeaderType;
  @Input() currentNode: number;
  @Input() title: string;

  mouseOverSubmit = new BrMouseOver();
  errorStateMatcherMouseOver: ErrorStateMatcherMouseOver;
  errorStateMatchesForPassword: ErrorStateMatcherMouseOver;
  errorNames = BrValidators.ErrorNames;
  departments: FormArray;
  departmentForm: FormGroup;
  skipDepartmentAddClicked = false;
  isFormValid = false;
  skipDepartment = new FormControl();
  readonly numberOfInitialBlankDepartments = 3;
  public departmentNamePlaceholder = 'Department ';
  public managerNamePlaceholder = 'Manager name ';
  constructor(private formBuilder: FormBuilder, private errorLoggerService: ErrorLoggerService) { }

  @Input() labConfigurationDepartments: Department[] = [];
  @Input() errorMessage: string;

  @Output() saveLabConfigurationDepartment = new EventEmitter<Department[]>();
  @Output() skipLabConfigurationDepartmentAdd = new EventEmitter<null>();
  @Input() translationLabelDictionary: {};
  @Input() contacts: User[] = [];
  @Input() locationId: string;

  get departmentsGetter() {
    return this.departmentForm.get('departments') as FormArray;
  }

  ngOnInit() {
    try {
      this.errorStateMatcherMouseOver = new ErrorStateMatcherMouseOver(
        this.mouseOverSubmit
      );
      this.setInitForm();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnInit)));
    }
  }

  ngAfterViewInit() {
    try {
      this.sortContacts();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.SortContacts)));
    }
  }

  private populateLocalLabels(): void {
    if (this.translationLabelDictionary) {
      this.departmentNamePlaceholder = this.translationLabelDictionary[
        'department'
      ];
      this.managerNamePlaceholder = this.translationLabelDictionary['manager'];
    }
  }

  toggleSkipDeptCheckBox() {
    try {
      this.skipDepartmentAddClicked = !this.skipDepartmentAddClicked;
      this.skipDepartmentAddClicked ? this.departmentForm.disable() : this.departmentForm.enable();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.ToggleSkipDeptCheckBox)));
    }
  }

  setInitForm() {
    this.departmentForm = this.formBuilder.group({
      departments: this.formBuilder.array([])
    });
    this.addFormGroups(this.numberOfInitialBlankDepartments);
    this.populateLocalLabels();
  }

  addFormGroups(numberOfGroups: number) {
    for (let index = 0; index < numberOfGroups; index++) {
      this.addFormControl();
    }
  }

  addFormControl(departmentName?: string): void {
    this.departmentsGetter.push(this.createControlItem(departmentName));
  }

  getGroupAtIndex(index: number) {
    return (<FormGroup>this.departmentsGetter.at(index));
  }

  addDeptManagerControl(index?: number, departmentManager?: string): void {
    this.getGroupAtIndex(index).addControl('departmentManagerGroup', this.createDeptManagerItem(departmentManager));
  }

  createControlItem(departmentName?: string): FormGroup {
    return this.formBuilder.group({
      departmentName: [departmentName || ''],
    });
  }

  valuechange(newValue, index) {
    try {
      if (newValue) {
        this.isFormValid = this.departmentsGetter['controls'].some(control => control.get('departmentName').value);
        this.addDeptManagerControl(index);
        if (this.contacts.length === 1) {
          this.getGroupAtIndex(index).get('departmentManagerGroup').setValue({ departmentManager: this.contacts[0] });
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.ValueChange)));
    }
  }

  createDeptManagerItem(departmentManager?: string): FormGroup {
    if (this.contacts.length === 1) {
      return this.formBuilder.group({
        departmentManager: [departmentManager || '']
      });
    } else {
      return this.formBuilder.group({
        departmentManager: [departmentManager || '', Validators.required]
      });
    }
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

  createItem(departmentName?: string, managerName?: string): FormGroup {
    return this.formBuilder.group({
      departmentName: [
        departmentName || '',
        [Validators.minLength(2), Validators.maxLength(20)]
      ],
      departmentManager: [
        managerName || '',
        [Validators.minLength(2), Validators.maxLength(20)]
      ]
    });
  }

  onDepartmentAddSkip() {
    try {
      this.skipLabConfigurationDepartmentAdd.emit();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnDepartmentAddSkip)));
    }
  }

  onSubmit(formvalues: any) {
    try {
      const labConfigFormValues = [];
      formvalues.departments.forEach(department => {
        if (department && department.departmentName) {
          department.managerName =
            `${department.departmentManagerGroup.departmentManager.contactInfo.firstName}
           ${department.departmentManagerGroup.departmentManager.contactInfo.lastName}`;
          department.managerEmail = department.departmentManagerGroup.departmentManager.contactInfo.email;
          department.departmentManagerId = department.departmentManagerGroup.departmentManager.id;
          department.parentNodeId = this.locationId;
          labConfigFormValues.push({ ...new Department(), ...department });
        }
      });
      this.saveLabConfigurationDepartment.emit(labConfigFormValues);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  resetForm() {
    try {
      this.isFormValid = false;
      for (let i = this.departmentsGetter.length - 1; i >= 0; i--) {
        this.departmentsGetter.removeAt(i);
      }
      this.addFormGroups(this.numberOfInitialBlankDepartments);
      this.departmentForm.markAsPristine();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.ResetForm)));
    }
  }
}
