// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, Input, OnDestroy, OnInit, EventEmitter, Output,  ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as ngrxStore from '@ngrx/store';
import { select } from '@ngrx/store';

import * as fromRoot from '../../../../state/app.state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { icons } from '../../../../core/config/constants/icon.const';
import { isAddValue } from '../../../../core/config/constants/general.const';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { IconService } from '../../../../shared/icons/icons.service';
import { ConnectivitySlideGenListValidator, ReagentLotMetadata, SlideGenSchedule } from '../../shared/models/lab-lot-test.model';
import * as navigationStateSelector from '../../../../shared/navigation/state/selectors';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YY',
  },
  display: {
    dateInput: 'MM/DD/YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface NavigationState {
  locale?: object;
}
interface State {
navigation: NavigationState;
}

@Component({
  selector: 'unext-connectivity-slide-gen-list',
  templateUrl: './connectivity-slide-gen-list.component.html',
  styleUrls: ['./connectivity-slide-gen-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
})
export class ConnectivitySlideGenListComponent implements OnInit, OnDestroy {

  @Input() availableReagentLotMetadata: Array<ReagentLotMetadata>;
  @Input() singleSlideGenScheduleItem: Array<SlideGenSchedule>;
  @Input() labLotTestId: string;
  @Input() lastRunReagentLotId: number;
  @Input() controlExpirationDate: string;
  @Output() closeUpdate = new EventEmitter<boolean>();
  @Output() updateSlideGenSchedules = new EventEmitter<Array<SlideGenSchedule>>();
  @Output() onSchedulerRowsChanged = new EventEmitter();
  public timeZone: string;
  public slideGenForm: FormGroup;
  public slideGenList: FormArray;
  public slideGenListValidationArr: Array<ConnectivitySlideGenListValidator> = [];
  public firstRowEdited = false;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.delete[24],
    icons.addCircle[24]
  ];

  private destroy$ = new Subject<boolean>();
  selectedLang: any = { lcid: 'en-US' };

  public selectedTime: string;
  public selectedTimeEnd: string;
  getNavigationState = createFeatureSelector<NavigationState>('navigation');
  getLocale = createSelector(this.getNavigationState, (state) => state && state.locale ?
  state.locale : {country: 'US', lcid: 'en-US', value: 'en', name: 'English'});
  navigationGetLocale$ = this.store.pipe(select(this.getLocale));
  timeFormat;
  hoursValue;
  minutesValue;
  hoursFlag = true;
  minutesFlag = true;
  hoursValueEnd;
  minutesValueEnd;
  hoursFlagEnd = true;
  minutesFlagEnd = true;
  selectedTimeIndex;

  constructor(private formBuilder: FormBuilder,
    private store: ngrxStore.Store<fromRoot.State>, private iconService: IconService,
    private adapter: DateAdapter<any>,
    private _cdRef: ChangeDetectorRef
    ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.navigationGetLocale$
    .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
    .subscribe(loc => {
        this.timeFormat =  (loc.hasOwnProperty('timeFormat')) ? loc['timeFormat'] : 0;
    });
    this.getDateFormatString();
    this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        this.timeZone = labLocation.locationTimeZone;
      });
    if (this.singleSlideGenScheduleItem && this.singleSlideGenScheduleItem.length > 0) {
      this.preloadedFormInitialize();
    } else {
      this.initializeForm(); // initialize the form
    }
  }

  getDateFormatString() {
    this.store.pipe(select(navigationStateSelector.getLocale)).pipe(takeUntil(this.destroy$))
    .subscribe(
      (lang: any) => {
        this.adapter.setLocale(lang?.locale || lang?.lcid || this.selectedLang.lcid);
      }
    );
  }

  public isLotExpired() {
    const dateObj = new Date();
    return new Date(this.controlExpirationDate) < new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
  }

  public initializeForm() {
    this.slideGenForm = this.formBuilder.group({
      slideGenList: this.formBuilder.array([this.initItemRows(null, true)])
    });
    this.slideGenForm.valueChanges.subscribe(data => {
      if (!this.firstRowEdited) {
        if (this.slideGenForm.dirty) {
          this.firstRowEdited = true;
          this.slideGenListArray.at(0).get('startDate').setValidators(Validators.required);
          this.slideGenListArray.at(0).get('startDate').updateValueAndValidity();
          this.slideGenListArray.at(0).get('startTime').setValidators(Validators.required);
          this.slideGenListArray.at(0).get('startTime').updateValueAndValidity();
          this.slideGenListArray.at(0).get('endDate').setValidators(Validators.required);
          this.slideGenListArray.at(0).get('endDate').updateValueAndValidity();
          this.slideGenListArray.at(0).get('endTime').setValidators(Validators.required);
          this.slideGenListArray.at(0).get('endTime').updateValueAndValidity();
        }
      }
    });
  }

  public preloadedFormInitialize() {
    this.slideGenForm = this.formBuilder.group({
      slideGenList: this.formBuilder.array([])
    });
    this.singleSlideGenScheduleItem.forEach((ele, index) => {
      this.rowCountChanged();
      this.firstRowEdited = true;
      const singleFormDataElement = this.formBuilder.group({
        reagentLotId: [ele.reagentLotId, Validators.required],
        startDate: [ele.startDate, Validators.required],
        startTime: [this.getTimeString(ele.startDate), Validators.required],
        endDate: [ele.endDate, Validators.required],
        endTime: [this.getTimeString(ele.endDate), Validators.required],
      });
      this.slideGenListArray.push(singleFormDataElement);
      this.slideGenListValidationArr.push({
        startMinValue: index === 0 ? null : this.singleSlideGenScheduleItem[index - 1].endDate,
        startMaxValue: this.isLotExpired() ? new Date(this.controlExpirationDate) : new Date(ele.endDate),
        endMinValue: new Date(ele.startDate),
        endMaxValue: this.isLotExpired() ? new Date(this.controlExpirationDate) : new Date(),
        isRowInValid: false,
        isDuplicateReagentLot: false
      });
    });
  }

  /* Form operations */
  get slideGenListArray() {
    return this.slideGenForm.get('slideGenList') as FormArray;
  }

  get slideGenControls() {
    return (this.slideGenForm.get('slideGenList') as FormGroup).controls;
  }

  reagentLotSelectionChange() {
    this.slideGenForm.value.slideGenList.forEach((selectedReagent, ind) => this.onSlidegenChange(selectedReagent.reagentLotId, ind));
  }

  onSlidegenChange(value: number, index: number) {
    const duplicateReagentLots = this.slideGenForm.value.slideGenList.filter(selectedReagent => selectedReagent.reagentLotId === value);
    if (duplicateReagentLots.length === 1) {
      this.slideGenListValidationArr[index].isDuplicateReagentLot = false;
    }
    if (duplicateReagentLots.length > 1) {
      this.slideGenListValidationArr[index].isDuplicateReagentLot = true;
    }
  }

  public checkForDisable(value?: string) {
    if (value === isAddValue) {
      if (this.slideGenListValidationArr && this.slideGenListValidationArr.length > 0) {
        const inValidRow = this.slideGenListValidationArr.some(ele => ele.isRowInValid === true);
        const duplicateLots = this.slideGenListValidationArr.some(ele => ele.isDuplicateReagentLot === true);
        return !this.slideGenForm.valid || inValidRow || !this.firstRowEdited || duplicateLots;
      } else {
        return !this.slideGenForm.valid;
      }
    } else {
      if (this.slideGenListValidationArr && this.slideGenListValidationArr.length > 0) {
        const inValidRow = this.slideGenListValidationArr.some(ele => ele.isRowInValid === true);
        const duplicateLots = this.slideGenListValidationArr.some(ele => ele.isDuplicateReagentLot === true);
        return !this.slideGenForm.valid || inValidRow || duplicateLots;
      } else {
        return !this.slideGenForm.valid;
      }
    }
  }

  initItemRows(index: number, isFirst: boolean) {
    this.addValidationArr(index);
    let lastRunReagentLotIdIndex = -1;
    if (this.lastRunReagentLotId && isFirst) {
      lastRunReagentLotIdIndex = this.availableReagentLotMetadata.findIndex(slideEle => slideEle.id === this.lastRunReagentLotId);
    }
    if (lastRunReagentLotIdIndex !== -1 && this.firstRowEdited === false) {
      return this.formBuilder.group({
        reagentLotId: [lastRunReagentLotIdIndex === -1 ? null : this.lastRunReagentLotId],
        startDate: [null],
        startTime: [''],
        endDate: [null],
        endTime: [''],
      });
    } else {
      let currentStartTime = '';
      let currentStartDate = null;
      if (index != null) {
        const currentIndexDateTime = new Date(this.slideGenListArray.value[index].endDate);
        currentIndexDateTime.setTime(currentIndexDateTime.getTime() + 1000 * 60); // increase time by 1 minute
        currentStartTime = this.getTimeString(currentIndexDateTime);
        currentStartDate = currentIndexDateTime;
      }
      return this.formBuilder.group({
        reagentLotId: [lastRunReagentLotIdIndex === -1 ? null : this.lastRunReagentLotId, Validators.required],
        startDate: [index != null ? currentStartDate : null, Validators.required],
        startTime: [currentStartTime, Validators.required],
        endDate: [null, Validators.required],
        endTime: ['', Validators.required],
      });
    }
  }

  getTimeString(indexedDate: Date) {
    const timeValues = indexedDate?.toTimeString().split(':');
    return timeValues[0] + ':' + timeValues[1];
  }

  addInputControl(index: number) {
    this.rowCountChanged();
    this.slideGenListArray.push(this.initItemRows(index, false));
    this.onSlidegenChange(this.slideGenForm.value.slideGenList[this.slideGenForm.value.slideGenList.length - 1].reagentLotId, index + 1);
  }

  removeInputControl(index: number) {
    this.slideGenListArray.removeAt(index);
    const lastIndex = this.slideGenListValidationArr.length - 1;
    if (this.slideGenListArray.value.length > 1 && index !== lastIndex) {
      this.slideGenListValidationArr[index + 1].startMinValue = this.slideGenListArray.value[index - 1].endDate;
      this.slideGenListValidationArr[index + 1].endMinValue = this.slideGenListArray.value[index].startDate;
    }
    this.slideGenListValidationArr.splice(index, 1); // splice selected index so that validations are applied according
    this.slideGenForm.value.slideGenList.forEach((selectedReagentLot, ind) => this.onSlidegenChange(selectedReagentLot.reagentLotId, ind));
    this.checkForDisable();
  }

  private addValidationArr(index: number) {
    if (index != null) {
      this.slideGenListValidationArr.push({
        startMinValue: new Date(this.slideGenListArray.value[index].endDate),
        startMaxValue: this.isLotExpired() ? new Date(this.controlExpirationDate) : new Date(),
        endMinValue: new Date(this.slideGenListArray.value[index].endDate),
        endMaxValue: this.isLotExpired() ? new Date(this.controlExpirationDate) : new Date(),
        isRowInValid: false,
        isDuplicateReagentLot: false
      });
    } else {
      this.slideGenListValidationArr.push({
        startMinValue: null,
        startMaxValue: this.isLotExpired() ? new Date(this.controlExpirationDate) : new Date(),
        endMinValue: null,
        endMaxValue: this.isLotExpired() ? new Date(this.controlExpirationDate) : new Date(),
        isRowInValid: false,
        isDuplicateReagentLot: false
      });
    }
    this.rowCountChanged();
  }

  public submitSlideGenList() {
    if (this.slideGenForm.valid) {
      let slideGenScheduleList: Array<SlideGenSchedule> = this.slideGenListArray.value;
      slideGenScheduleList = slideGenScheduleList.map(slidegens => {
        return slidegens = {
          labLotTestId: this.labLotTestId,
          reagentLotId: slidegens.reagentLotId,
          startDate: slidegens.startDate,
          endDate: slidegens.endDate
        };
      });
      this.updateSlideGenSchedules.emit(slideGenScheduleList);
      this.resetForm();
    }
  }

  public resetForm() {
    this.slideGenForm.reset();
    this.firstRowEdited = false;
    this.closeUpdate.emit(true);
  }

  /* Form operations */

  /* Change Events */

  public startDateChange(dateValue: string, index) {
    const sDate = new Date(dateValue);
    this.slideGenListArray.value[index].startDate = sDate;
    if (index !== 0) {
      this.slideGenListValidationArr[index - 1].endMaxValue = sDate;
    }
    // call the combine Date and time and Update the array as well
    this.combineStartDateAndTimeAndUpdate(sDate, this.slideGenListArray.value[index].startTime, index);
    this.updateValidationArr(index);
    this.checkDateValidation(index);
  }


  public startTimeChange(timeValue, index) {
    this.slideGenListArray.value[index].startTime = timeValue;
    const selectedRowStartDate = this.slideGenListArray.value[index].startDate;
    if (index !== 0) {
      this.slideGenListValidationArr[index - 1].endMaxValue = selectedRowStartDate;
    }
    // call the combine Date and time and Update the array as well
    this.combineStartDateAndTimeAndUpdate(selectedRowStartDate, timeValue, index);
    this.updateValidationArr(index);
    this.checkDateValidation(index);
  }

  public endDateChange(dateValue: string, index) {
    const eDate = new Date(dateValue);
    this.slideGenListArray.value[index].endDate = eDate;
    // call the combine Date and time and Update the array as well
    this.combineEndDateAndTimeAndUpdate(eDate, this.slideGenListArray.value[index].endTime, index);
    this.updateValidationArr(index);
    this.checkDateValidation(index);
  }

  public endTimeChange(timeValue, index) {
    this.slideGenListArray.value[index].endTime = timeValue;
    const selectedRowEndDate = this.slideGenListArray.value[index].endDate;
    // call the combine Date and time and Update the array as well
    this.combineEndDateAndTimeAndUpdate(selectedRowEndDate, timeValue, index);
    this.updateValidationArr(index);
    this.checkDateValidation(index);
  }


  // use this function to combime date and time
  public combineStartDateAndTimeAndUpdate(date: Date, time: string, index: number) {
    const combinedStartDateTime = new Date(date);
    if (!time) {
      combinedStartDateTime.setHours(0);
      combinedStartDateTime.setMinutes(0);
      this.slideGenListArray.at(index).get('startDate').patchValue(combinedStartDateTime);
      this.slideGenListValidationArr[index].endMinValue = combinedStartDateTime; // update the current row endDate min Value Validator
    } else {
      const timeArr = time.split(':');
      combinedStartDateTime.setHours(Number(timeArr[0]));
      combinedStartDateTime.setMinutes(Number(timeArr[1]));
      this.slideGenListArray.at(index).get('startDate').patchValue(combinedStartDateTime);
      this.slideGenListValidationArr[index].endMinValue = combinedStartDateTime; // update the current row endDate min Value Validator
    }
  }

  public combineEndDateAndTimeAndUpdate(date: Date, time: string, index: number) {
    const combinedEndDateTime = new Date(date);
    if (!time) {
      combinedEndDateTime.setHours(0);
      combinedEndDateTime.setMinutes(0);
      this.slideGenListArray.at(index).get('endDate').patchValue(combinedEndDateTime);
      this.slideGenListValidationArr[index].startMaxValue = combinedEndDateTime; // update the current row startDate max Value Validator
    } else {
      const timeArr = time.split(':');
      combinedEndDateTime.setHours(Number(timeArr[0]));
      combinedEndDateTime.setMinutes(Number(timeArr[1]));
      this.slideGenListArray.at(index).get('endDate').patchValue(combinedEndDateTime);
      this.slideGenListValidationArr[index].startMaxValue = combinedEndDateTime; // update the current row startDate max Value Validator
    }
  }

  public checkDateValidation(index) {
    const startDateValid = this.slideGenListArray.at(index).get('startDate').valid;
    const startTimeValid = this.slideGenListArray.at(index).get('startTime').valid;
    const endDateValid = this.slideGenListArray.at(index).get('endDate').valid;
    const endTimeValid = this.slideGenListArray.at(index).get('endTime').valid;
    if (startDateValid && startTimeValid && endDateValid && endTimeValid) {
      if (index === 0) {
        const selectedRowStartDate = this.slideGenListArray.value[index].startDate;
        const selectedRowEndDate = this.slideGenListArray.value[index].endDate;
        if (selectedRowStartDate?.getTime() >= selectedRowEndDate?.getTime()) {
          this.slideGenListValidationArr[index].isRowInValid = true;
        } else {
          this.slideGenListValidationArr[index].isRowInValid = false;
        }

        if (index !== (this.slideGenListArray.value.length - 1)) {
          const nextRowStartDate = this.slideGenListArray.value[index + 1].startDate;
          const nextRowEndDate = this.slideGenListArray.value[index + 1].endDate;
          // check with current index endDate, current enddate need to be smaller then next rows date
          if (selectedRowEndDate?.getDate() === nextRowEndDate?.getDate()) {
            if (selectedRowEndDate?.getTime() >= nextRowEndDate?.getTime() || selectedRowEndDate.getTime() >= nextRowStartDate?.getTime()) {
              this.slideGenListValidationArr[index + 1].isRowInValid = true;
            } else if (selectedRowStartDate.getTime() >= nextRowEndDate.getTime()
              || selectedRowStartDate.getTime() >= nextRowStartDate.getTime()) {
              this.slideGenListValidationArr[index + 1].isRowInValid = false;
            } else {
              this.slideGenListValidationArr[index + 1].isRowInValid = false;
            }
          }
        }

      } else { // index is greater than 0
        const selectedRowStartDate = this.slideGenListArray.value[index].startDate;
        const selectedRowEndDate = this.slideGenListArray.value[index].endDate;

        if (index !== (this.slideGenListArray.value.length - 1)) {
          const nextRowStartDate = this.slideGenListArray.value[index + 1].startDate;
          const nextRowEndDate = this.slideGenListArray.value[index + 1].endDate;
          // check with current index endDate, current enddate need to be smaller then next rows date
          if (selectedRowEndDate?.getDate() === nextRowEndDate?.getDate()) {
            if (selectedRowEndDate?.getTime() >= nextRowEndDate?.getTime() || selectedRowEndDate.getTime() >= nextRowStartDate?.getTime()) {
              this.slideGenListValidationArr[index + 1].isRowInValid = true;
            } else if (selectedRowStartDate.getTime() >= nextRowEndDate.getTime()
              || selectedRowStartDate.getTime() >= nextRowStartDate.getTime()) {
              this.slideGenListValidationArr[index + 1].isRowInValid = true;
            } else {
              this.slideGenListValidationArr[index + 1].isRowInValid = false;
            }
          } else {
            if (selectedRowStartDate.getTime() >= nextRowEndDate.getTime()
              || selectedRowStartDate.getTime() >= nextRowStartDate.getTime()) {
              this.slideGenListValidationArr[index + 1].isRowInValid = true;
            } else if (selectedRowEndDate.getTime() >= nextRowEndDate.getTime()
              || selectedRowEndDate.getTime() >= nextRowStartDate.getTime()) {
              this.slideGenListValidationArr[index + 1].isRowInValid = true;
            } else {
              this.slideGenListValidationArr[index + 1].isRowInValid = false;
            }
          }
        }

        const lastRowStartDate = this.slideGenListArray.value[index - 1].startDate;
        const lastRowEndDate = this.slideGenListArray.value[index - 1].endDate;
        if (selectedRowStartDate?.getDate() === lastRowEndDate?.getDate()) {
          if (selectedRowEndDate?.getTime() <= lastRowEndDate?.getTime() || selectedRowEndDate.getTime() <= lastRowStartDate.getTime()) {
            this.slideGenListValidationArr[index].isRowInValid = true;
          } else if (selectedRowStartDate.getTime() <= lastRowEndDate.getTime()
            || selectedRowStartDate.getTime() <= lastRowStartDate.getTime()) {
            this.slideGenListValidationArr[index].isRowInValid = true;
          } else if (selectedRowStartDate?.getTime() >= selectedRowEndDate?.getTime()) {
            this.slideGenListValidationArr[index].isRowInValid = true;
          } else {
            this.slideGenListValidationArr[index].isRowInValid = false;
          }
        } else if (selectedRowStartDate?.getTime() >= selectedRowEndDate?.getTime()) {
          this.slideGenListValidationArr[index].isRowInValid = true;
        } else {
          this.slideGenListValidationArr[index].isRowInValid = false;
        }
      }
    }
  }

  // update the next index if the previous row values are changed
  private updateValidationArr(index: number) {
    const lastIndex = this.slideGenListValidationArr.length - 1;
    if (this.slideGenListArray.value.length > 1 && index !== lastIndex) {
      this.slideGenListValidationArr[index + 1].startMinValue = this.slideGenListArray.value[index].endDate;
      this.slideGenListValidationArr[index + 1].endMinValue = this.slideGenListArray.value[index].endDate;
    }
  }

  public rowCountChanged(): void {
    this.onSchedulerRowsChanged.emit();
  }

  onHoursChange(h, index, startTime) {
    const isStartTime = (startTime === 'start') ? true : false;
    this.selectedTimeIndex  = index;
    if (h) {
      h = parseInt(h);
      if (h > 23) {
        if (isStartTime) {
          this.hoursValue = 0;
          this.hoursFlag = true;
        } else {
          this.hoursValueEnd = 0;
          this.hoursFlagEnd = true;
        }
        this._cdRef.detectChanges();
      } else {
        if (isStartTime) {
          this.hoursValue = h;
          this.hoursFlag = false;
        } else {
          this.hoursValueEnd = h;
          this.hoursFlagEnd = false;
        }
      }
      this.validateTime(startTime);
    }
  }

  onMinutesChange(m, index, startTime) {
    const isStartTime = (startTime === 'start') ? true : false;
    this.selectedTimeIndex  = index;
    if (m) {
      m = parseInt(m);
      if (m > 59) {
        if (isStartTime) { 
          this.minutesValue = 0;
          this.minutesFlag = true;
        } else {
          this.minutesValueEnd = 0;
          this.minutesFlagEnd = true;
        }
        this._cdRef.detectChanges();
      } else {
        if (isStartTime) { 
          this.minutesValue = m;
          this.minutesFlag = false;
        } else {
          this.minutesValueEnd = m;
          this.minutesFlagEnd = false;
        }
      }
      this.validateTime(startTime);
    }
  }

  onBlur(startTime) {
    const isStartTime = (startTime === 'start') ? true : false;
    if (isStartTime) { 
      if (this.hoursValue < 10 && (this.hoursValue.toString().length === 1)) {
        this.hoursValue = '0' + this.hoursValue;
      }
      if (this.minutesValue < 10  && (this.minutesValue.toString().length === 1)) {
        this.minutesValue = '0' + this.minutesValue;
      }
    } else {
      if (this.hoursValueEnd < 10 && (this.hoursValueEnd.toString().length === 1)) {
        this.hoursValueEnd = '0' + this.hoursValueEnd;
      }
      if (this.minutesValueEnd < 10  && (this.minutesValueEnd.toString().length === 1)) {
        this.minutesValueEnd = '0' + this.minutesValueEnd;
      }
    }
  }

  validateTime(startTime) {
    const isStartTime = (startTime === 'start') ? true : false;
    const isTimeValid = (!this.hoursFlag && !this.minutesFlag) ? true : false;
    if (isStartTime) {
      if (isTimeValid) {
        const hrd = (this.hoursValue < 10  && (this.hoursValue.toString().length === 1)) ? '0' + this.hoursValue : this.hoursValue;
        const min = (this.minutesValue < 10  && (this.minutesValue.toString().length === 1)) ? '0' + this.minutesValue : this.minutesValue;
        const timeString = hrd + ':' + min;
        this.selectedTime = timeString;
        this.slideGenListArray.at(this.selectedTimeIndex).get('startTime').patchValue(this.selectedTime);
      } else {
        this.slideGenListArray.at(this.selectedTimeIndex).get('startTime').patchValue('');
      }
      this.startTimeChange(this.selectedTime, this.selectedTimeIndex);
    } else {
      if (isTimeValid) {
        const hrd = (this.hoursValueEnd < 10  && (this.hoursValueEnd.toString().length === 1)) ? '0' + this.hoursValueEnd : this.hoursValueEnd;
        const min = (this.minutesValueEnd < 10  && (this.minutesValueEnd.toString().length === 1)) ? '0' + this.minutesValueEnd : this.minutesValueEnd;
        const timeString = hrd + ':' + min;
        this.selectedTimeEnd = timeString;
        this.slideGenListArray.at(this.selectedTimeIndex).get('endTime').patchValue(this.selectedTimeEnd);
      } else {
        this.slideGenListArray.at(this.selectedTimeIndex).get('endTime').patchValue('');
      }
      this.endTimeChange(this.selectedTimeEnd, this.selectedTimeIndex);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
