// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, take, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { maxLengthForLotNumber, maxLengthLimitTextCode } from '../../../../../core/config/constants/general.const';
import { LotManagementEnum } from '../../../../../master/control-management/shared/models/lot-management.enum';
import { CustomControlMasterLot } from '../../../../../contracts/models/control-management/custom-control-master-lot.model';
import { ValidationErrorService } from '../../../../../shared/api/validationError.service';

@Component({
  selector: 'unext-custom-lot-management',
  templateUrl: './custom-lot-management.component.html',
  styleUrls: ['./custom-lot-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomLotManagementComponent implements OnInit, OnDestroy {
  @Input() data: CustomControlMasterLot;
  @Input() lotsList: CustomControlMasterLot[];
  @Output() formData = new EventEmitter<Object>();
  @Output() isFormUpdated = new EventEmitter<boolean>();
  @Output() isValidDate = new EventEmitter<boolean>();

  masterLotDataForm: FormGroup;
  startDate = new Date();
  lotNumberMaxLengthErrorMessage: string;
  masterLotNumberFormValue: Object;
  isFormValueUpdated = true;
  private destroy$ = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private validationErrorService: ValidationErrorService,  ) { }

  ngOnInit(): void {
    this.getFutureDateForTomorrow();
    this.initializeForm();
    this.updateMasterLotDataForm();

    this.lotNumberMaxLengthErrorMessage = this.getTranslation('CUSTOMCONTROLLOTMANAGEMENT.LOTNUMBERMAXLENGTHERROR')
    ?.replace(maxLengthLimitTextCode, maxLengthForLotNumber.toString());
  }

  initializeForm(): FormGroup {
    return this.masterLotDataForm = this.formBuilder?.group({
      masterLotNumber: [LotManagementEnum.Edit ? this.data?.lotNumber?.trim() : '', [Validators.required,
      Validators.maxLength(maxLengthForLotNumber),
      this.checkForAlphanumericValues, this.validateLotNumbers?.bind(this), this.validationErrorService.whiteSpacesValidator]],
      expirationDate: [LotManagementEnum.Edit ? this.data?.expirationDate : '', [Validators.required , this.checkForValidDate?.bind(this)]]
    });
  }

  updateMasterLotDataForm() {
    this.masterLotNumberFormValue = this.masterLotDataForm.value;
    this.masterLotDataForm.valueChanges.pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.destroy$)).subscribe(formValue => {
        this.getFutureDateForTomorrow();
        this.isFormValueUpdated = JSON.stringify(this.masterLotNumberFormValue) === JSON.stringify(formValue);
        this.isFormUpdated.emit(this.isFormValueUpdated);
        this.formData.emit(this.masterLotDataForm);
      });
  }

  getFutureDateForTomorrow(): number {
    return this.startDate.setDate(this.startDate.getDate() + 1);
  }

  checkForAlphanumericValues(control: AbstractControl): Object | null {
    const value = control.value;
    const regexForAlphaNumericValue = /^[a-zA-Z0-9 ]*$/;
    if (!regexForAlphaNumericValue.test(value)) {
      return { invalidInput: true };
    }
    return null;
  }

  checkForValidDate(control: AbstractControl) {
    const valid = this.validationErrorService.checkForValidDate(new Date(control.value));
    if (!valid) { this.isValidDate.emit(false); return { invalidDate: true };
    } else { this.isValidDate.emit(true); return null; }
  }

  validateLotNumbers(control: AbstractControl): Object | null {
    const lotNumber = control?.value;
    if (control.dirty) {
      const isLotNumberExists = this.lotsList?.some((item: CustomControlMasterLot) =>
      item?.lotNumber?.toLowerCase() === lotNumber?.toLowerCase()?.trim());
      if (isLotNumberExists) {
        return { lotNumberExists: true };
      }
    }
    return null;
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
