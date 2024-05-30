// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { cloneDeep } from 'lodash';

import { blankSpace, hyphen } from '../../../../../core/config/constants/general.const';
import {
  ControlInfo, OutlieredLots, ProductMasterLots, CorrectiveActionsFormValue,
  CorrectiveActionInfo
} from '../../../models/report-info';
import { LabConfig } from '../../../reporting.enum';
import { icons } from '../../../../../core/config/constants/icon.const';

@Component({
  selector: 'unext-corrective-actions',
  templateUrl: './corrective-actions.component.html',
  styleUrls: ['./corrective-actions.component.scss']
})

export class CorrectiveActionsComponent implements OnInit, OnChanges {
  @ViewChildren('matSelectRef') matSelectRefs: QueryList<MatSelect>;
  correctiveActionForm: FormGroup;
  lotData: OutlieredLots[] = [];
  optionsLength: number;
  selectAllCheckedIndex: number;
  labConfig = LabConfig;
  icons = icons;
  @Input() outlieredLots: OutlieredLots[];
  @Output() correctiveActionFormStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() correctiveActionPayload: EventEmitter<CorrectiveActionInfo> = new EventEmitter<CorrectiveActionInfo>();
  config: any = {
    suppressScrollX: false, suppressScrollY: false
  };

  constructor(private formBuilder: FormBuilder) {
    this.correctiveActionForm = this.formBuilder.group({
      correctiveFormsArray: this.formBuilder.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if another notification is clicked then need to reset corrective actions form
    if (changes?.outlieredLots.currentValue && changes?.outlieredLots?.previousValue !== changes?.outlieredLots?.currentValue) {
      this.correctiveFormsArray.clear();
      this.correctiveActionForm.reset();
      this.lotData = [];
      this.setOutLieredLots();
    }
  }

  setOutLieredLots() {
    this.optionsLength = 0;
    this.selectAllCheckedIndex = -1;
    this.outlieredLots?.forEach((instrument: OutlieredLots) => {
      const instrumentModifiedName = instrument.customName
        ? instrument.instrumentName + hyphen + instrument.customName
        : instrument.serialNumber
          ? instrument.instrumentName + hyphen + instrument.serialNumber
          : instrument.instrumentName;
      const controlObj = {
        instrumentName: instrumentModifiedName,
        customNameOrSerialNumber: instrument.customName || instrument.serialNumber,
        controls: [],
        instrumentId: instrument.instrumentId
      };
      instrument.controls.forEach((control: ControlInfo) => {
        const lotObj = {
          controlName: control.controlName,
          lots: control.lots.map((lot: ProductMasterLots) => ({
            lotName: lot.customName
              ? lot.customName + blankSpace + lot.lotNumber
              : this.labConfig.lot + blankSpace + lot.lotNumber,
            masterLotId: lot.masterLotId,
            isDisabled: false,
            instrumentId: instrument.instrumentId
          }))
        };
        this.optionsLength += lotObj.lots.length;
        controlObj.controls.push(lotObj);
      });
      this.lotData.push(controlObj);
    });
  }

  ngOnInit(): void {
    /* Listen to form changes and emit following events -
    Form validity to enable to or disable save report button
    Corrective actions payload to be sent on click of save report button */
    this.correctiveActionForm.valueChanges.subscribe((formValue) => {
      this.correctiveActionFormStatus.emit(this.correctiveActionForm.invalid);
      if (this.correctiveActionForm.valid) {
        this.onSaveCorrectiveActions();
      }
    });
  }

  get correctiveFormsArray(): FormArray {
    return this.correctiveActionForm.controls['correctiveFormsArray'] as FormArray;
  }

  /**
   * Adds form on click of add corrective action button
   * Handle Select All button status for the newly added form
   * If there are options selected in existing forms disable those in the newly added form
   */
  addForm() {
    this.correctiveFormsArray.push(this.createFormGroup());
    setTimeout(() => {
      if (this.correctiveFormsArray.length > 1) {
        this.handleSelectAll();
        this.disableOptions(this.getSelectedOptionsInAllForms());
      }
    });
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      lots: new FormControl([], Validators.required),
      lotComment: new FormControl('', Validators.required),
      selectedOptions: new FormControl([]),
      previousOptions: new FormControl([]),
      lotData: new FormControl(cloneDeep(this.lotData)),
      isSelected: new FormControl(false),
      isSelectAllDisabled: new FormControl(this.optionsLength < 2 ? true : false)
    });
  }

  /**
   * Apply all selections
   * Disable selected options in other forms
   * Disable select all in other forms if its selected currently
   * @param index index number of the form for which Apply button is clicked
   * @param correctiveFormGroup form reference for which Apply button is clicked
   */
  onApply(index: number, correctiveFormGroup: FormGroup) {
    const previousOptions = correctiveFormGroup.get('previousOptions');
    const selectedOptions = correctiveFormGroup.get('selectedOptions').value;
    if (selectedOptions.length) {
      previousOptions.setValue(selectedOptions);
    } else {
      previousOptions.setValue([]);
    }
    if (selectedOptions[0] === 0) {
      correctiveFormGroup.get('isSelected').setValue(true);
    } else {
      correctiveFormGroup.get('isSelected').setValue(false);
    }
    if (!correctiveFormGroup.get('isSelected').value) {
      selectedOptions.map((option: ProductMasterLots) => option.originIndex = index);
      if (index === this.selectAllCheckedIndex) {
        this.selectAllCheckedIndex = -1;
      }
    } else {
      this.selectAllCheckedIndex = index;
    }
    this.disableOptions(this.getSelectedOptionsInAllForms(), false, index);
    this.handleSelectAll();
    this.cancelDropdown(index);
  }

  /**
   * Closes dropdown
   * @param matSelectRef Mat select Reference
   */
  cancelDropdown(index: number) {
    const dropdown = this.getMatSelectReference(index);
    dropdown.close();
  }

  /**
   * Remove form group from form array when cross button is clicked
   * Enable options which were selected in this form
   * Enable select all if it was a part of this form
   * @param index index of the form which needs to be remove
   * @param correctiveFormGroup current form group reference
   */
  removeForm(index: number) {
    const currentSelectedOptions = this.correctiveFormsArray.at(index).get('selectedOptions').value;
    this.correctiveFormsArray.at(index).reset();
    this.correctiveFormsArray.removeAt(index);
    setTimeout(() => {
      const selectedOptions = this.getSelectedOptionsInAllForms();
      if (this.selectAllCheckedIndex === index) {
        this.selectAllCheckedIndex = -1;
      } else {
        if (this.selectAllCheckedIndex > index) {
          this.selectAllCheckedIndex--;
        }
        this.disableOptions(currentSelectedOptions, true);
      }
      this.handleSelectAll();
      selectedOptions.map(option => {
        if (option.originIndex > index) {
          option.originIndex = option.originIndex - 1;
        }
      });
    });
  }

  /**
   * Create corrective actions object to passed as payload
   * Categorize selectes lots basced on their instrument Id
   * Add allLotsComment if select all is checked in any of the forms
   */
  onSaveCorrectiveActions() {
    const correctiveActions: CorrectiveActionInfo = {
      instrumentInfo: [],
    };
    const selectedLots = (this.correctiveFormsArray.getRawValue().filter(form => !form.isSelected)).map(this.getLotsAndCorrectiveAction);
    selectedLots.forEach(form => {
      form.lots.forEach(lot => {
        const index = correctiveActions.instrumentInfo.map(instrument => instrument.instrumentId).indexOf(lot.instrumentId);
        if (index > -1) {
          correctiveActions.instrumentInfo[index].control.push(lot);
        } else {
          correctiveActions.instrumentInfo.push({ instrumentId: lot.instrumentId, control: [lot] });
        }
        delete lot.instrumentId;
      });
    });
    if (this.selectAllCheckedIndex !== -1) {
      correctiveActions.allLotsComment = this.correctiveFormsArray.at(this.selectAllCheckedIndex)?.get('lotComment').value;
    }
    this.correctiveActionPayload.emit(correctiveActions);
  }

  // prepare data to be saved list of corrective actions
  getLotsAndCorrectiveAction(form: CorrectiveActionsFormValue): CorrectiveActionsFormValue {
    form.lots = form.lots.map(lot => ({
      masterLotId: lot.masterLotId,
      lotComment: form.lotComment,
      instrumentId: lot.instrumentId
    }));
    return form;
  }

  // Set back to earlier selections when cancel is clicked or in other case other than apply
  handleCheckboxSelection(correctiveFormGroup: FormGroup) {
    const previousOptions = correctiveFormGroup.get('previousOptions').value;
    const selectedOptions = correctiveFormGroup.get('selectedOptions');
    if (previousOptions.length) {
      selectedOptions.setValue(previousOptions);
    } else {
      selectedOptions.setValue([]);
    }
  }

  /**
 * Get the current mat select reference
 * @param index index number of form of the current Mat select item
 * @returns Mat select reference
 */
  getMatSelectReference(index: number): MatSelect | undefined {
    const matSelectArray = this.matSelectRefs.toArray();
    if (index >= 0 && index < matSelectArray.length) {
      return matSelectArray[index];
    }
    return undefined;
  }

  /**
   * Toggle options based on click of Select All option
   * @param index index of the current form group for which select all button is clicked
   * @param correctiveFormGroup current form group referenfe
   */
  toggleAllSelection(index: number, correctiveFormGroup: FormGroup) {
    if (!correctiveFormGroup.get('isSelectAllDisabled').value) {
      const dropdown = this.getMatSelectReference(index);
      if (dropdown.options.first.selected) {
        correctiveFormGroup.get('isSelected').setValue(true);
        dropdown.options.map((item: MatOption) => item.select());
      } else {
        correctiveFormGroup.get('isSelected').setValue(false);
        dropdown.options.forEach((item: MatOption) => item.deselect());
      }
    }
  }

  // Check and uncheck select all option based on selections of other options
  handleSelectAllCheckbox(index: number, correctiveFormGroup: FormGroup, option: ProductMasterLots) {
    if (this.optionsLength > 1 && !option.isDisabled) {
      const dropdown = this.getMatSelectReference(index);
      const allSelectedOption = dropdown.options.first;
      if (allSelectedOption.selected) {
        correctiveFormGroup.get('isSelected').setValue(false);
        allSelectedOption.deselect();
        dropdown.options.map((item: MatOption) => item.disabled ? item.deselect() : null);
        return false;
      }
      if (correctiveFormGroup.get('selectedOptions').value.length === this.optionsLength && !allSelectedOption.disabled) {
        allSelectedOption.select();
        correctiveFormGroup.get('isSelected').setValue(true);
      }
    }
  }

  // Disable select all from other forms if its already selected once
  handleSelectAll() {
    if (this.optionsLength > 1) {
      this.correctiveFormsArray.controls.forEach((formGroup: FormGroup, formIndex: number) => {
        if (this.selectAllCheckedIndex !== -1 && formIndex !== this.selectAllCheckedIndex) {
          if (this.selectAllCheckedIndex !== formIndex) {
            formGroup.get('isSelectAllDisabled').setValue(true);
          }
        } else {
          formGroup.get('isSelectAllDisabled').setValue(false);
        }
      });
    }
  }

  /**
   * When an option is selected disable that option in other forms
   * @param selectedOptions already selected options that need to be disabled
   */
  disableOptions(selectedOptions: ProductMasterLots[], removeAction?: boolean, index?: number) {
    const selectedIdsAndOrigins = selectedOptions.map((selectedOption: ProductMasterLots) =>
    ({
      masterLotId: selectedOption['masterLotId'], originIndex: selectedOption['originIndex'],
      instrumentId: selectedOption['instrumentId']
    }));
    this.correctiveFormsArray.controls.forEach((formGroup: FormGroup, formIndex: number) => {
      formGroup.get('lotData').value.forEach(instrument => {
        instrument.controls.forEach(control => {
          control.lots.forEach(option => {
            for (const element of selectedIdsAndOrigins) {
              if (removeAction) {
                if (element.masterLotId === option.masterLotId && element.instrumentId === option.instrumentId) {
                  option.isDisabled = false;
                }
              } else {
                if (formIndex !== element.originIndex) {
                  if (element.masterLotId === option.masterLotId && element.instrumentId === option.instrumentId) {
                    option.isDisabled = true;
                    return;
                  } else {
                    option.isDisabled = false;
                  }
                } else {
                  if (!(element.masterLotId === option.masterLotId && element.instrumentId === option.instrumentId)) {
                    option.isDisabled = false;
                  }
                }
              }
            }
            if (!selectedIdsAndOrigins.length && index !== formIndex) {
              option.isDisabled = false;
            }
          });
        });
      });
    });
  }

  // Find out all selected options in all forms
  getSelectedOptionsInAllForms(): ProductMasterLots[] {
    let selectedOptions = [];
    this.correctiveFormsArray.controls.forEach((form: FormGroup) => {
      if (!form.get('isSelected').value && form.get('selectedOptions').value.length > 0) {
        selectedOptions = selectedOptions.concat(form.get('selectedOptions').value);
      }
    });
    return selectedOptions;
  }

  // set selected property to true when an option is selected and store the last index of selected element
  // This is used to append characters like hyphen and comma in display format
  changeSelectedStatus(option: ProductMasterLots, control: ControlInfo, instrument: OutlieredLots,
    correctiveFormGroup: FormGroup, isOptionSelected: boolean) {
    const lotDataValue = correctiveFormGroup.get('lotData').value;
    option.selected = isOptionSelected;
    control.selected = control.lots.some(opt => opt.selected);
    instrument.selected = instrument.controls.some(ctrl => ctrl.selected);
    control.lastSelectedIndex = control.lots.map(opt => opt.selected).lastIndexOf(true);
    instrument.lastSelectedIndex = instrument.controls.map(ctrl => ctrl.selected).lastIndexOf(true);
    lotDataValue.lastInstrumentIndex = lotDataValue.map(instr => instr.selected).lastIndexOf(true);
  }
}
