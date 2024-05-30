// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from "@angular/core";
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { CustomControl } from "../../contracts/models/control-management/custom-control.model";
import { CustomControlMasterLot } from "../../contracts/models/control-management/custom-control-master-lot.model";
import { brManufacturerId } from '../../core/config/constants/general.const';
import { ManufacturerProductDisplayItem } from "../../contracts/models/lab-setup/product-list.model";

@Injectable({
  providedIn: "root"
})
export class ValidationErrorService {
  duplicateFound: boolean;
  duplicateFoundForMasterLotNumbers: boolean;
  duplicateCustomNames: boolean[] = [];
  data: (CustomControl | ManufacturerProductDisplayItem)[] = [];
  filteredBrControlData: ManufacturerProductDisplayItem[] = [];

  constructor() { }

  checkForDuplicateControlNames(itemValue: string, nonBrControlDefinitionsData: CustomControl[], controlsForm: FormGroup, pointIndex: number, currentlySelectedControls: ManufacturerProductDisplayItem[]): boolean[] {
    this.data = [];
    const value = itemValue?.toLowerCase()?.trim();
    this.duplicateCustomNames = [];
    this.filteredBrControlData = currentlySelectedControls?.filter(item => item?.manufacturerId === brManufacturerId);
    this.data = [...nonBrControlDefinitionsData, ...this.filteredBrControlData];
    const controlMap = {};
    let isDuplicate = false;
    const ownControls = controlsForm.get('ownControls') as FormArray;
    ownControls?.value?.forEach((control, index) => {
      const controlName = control?.controlName?.toLowerCase()?.trim();
      //check if the control name is in restricted list
      const isRestricted = this.data.some(restrictedItem => restrictedItem?.name?.toLowerCase()?.trim() === controlName);
      this.duplicateCustomNames[index] = isRestricted;

      // check if there are any duplicates
      if (controlMap[controlName] === undefined) {
        controlMap[controlName] = index;
      } else {
        //duplicate name detected
        this.duplicateCustomNames[index] = true;
        this.duplicateCustomNames[controlMap[controlName]] = true;
        isDuplicate = true;
      }
    })
    return this.duplicateCustomNames;
  }

  checkForDuplicateLotNumbers(value: string, testValidationData: CustomControl[], findDuplicateProductMasterLotNumber: CustomControlMasterLot[], controlsForm: FormGroup, existingProductMasterLotNumberList: CustomControlMasterLot[]): boolean {
    let isDuplicateExist: boolean;
    let filteredList = [];
    let duplicateErrMsg: boolean = this.duplicateFoundForMasterLotNumbers;
    const controlsFormArrayKey = Object.keys(controlsForm?.controls).find(key => controlsForm?.controls[key] instanceof FormArray);
    if (value) {
      if (testValidationData.length > 0) {

        testValidationData?.forEach(products => {
          filteredList = products.lots.filter(item => (item.lotNumber).toLowerCase().trim() === value);
          isDuplicateExist = filteredList.length > 0;
          this.duplicateFoundForMasterLotNumbers = isDuplicateExist || findDuplicateProductMasterLotNumber.length > 0;
          controlsForm.valueChanges.subscribe((formValue) => {
            existingProductMasterLotNumberList = formValue[controlsFormArrayKey].map(el => String(el.masterLotNumber).trim());
            findDuplicateProductMasterLotNumber = existingProductMasterLotNumberList.filter(
              (item, index) => existingProductMasterLotNumberList.indexOf(item) !== index);
            filteredList = products.lots.filter(item => (item.lotNumber).toLowerCase().trim() === value);
            isDuplicateExist = filteredList.length > 0;
            this.duplicateFoundForMasterLotNumbers = isDuplicateExist || findDuplicateProductMasterLotNumber.length > 0;
          });
        });
      } else {
        controlsForm.valueChanges.subscribe((formValue) => {
          existingProductMasterLotNumberList = formValue[controlsFormArrayKey].map(el => String(el.masterLotNumber).trim());
          findDuplicateProductMasterLotNumber = existingProductMasterLotNumberList.filter(
            (item, index) => existingProductMasterLotNumberList.indexOf(item) !== index);
          isDuplicateExist = filteredList.length > 0;
          this.duplicateFoundForMasterLotNumbers = isDuplicateExist || findDuplicateProductMasterLotNumber.length > 0;
          duplicateErrMsg = this.duplicateFoundForMasterLotNumbers;
        });
      }

    } else {
      duplicateErrMsg = false;
    }
    return duplicateErrMsg;
  }

  checkForValidDate(date) {
    const minDate = new Date(new Date().setHours(0, 0, 0, 0));
    const selectedDate = new Date(date);
    if (selectedDate < minDate) {
      return  false;
    }
    return true;
  }

  whiteSpacesValidator(control: AbstractControl): Object | null {
    if(control.value && control.value.trim() === '') {
      return { containsOnlyWhiteSpaces: true };
    }
    return null;
  }
}
