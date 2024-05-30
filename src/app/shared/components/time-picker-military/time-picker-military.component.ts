// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef,  HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as ngrxSelector from '@ngrx/store';

interface NavigationState {
  locale?: object,
}
interface State {
  navigation: NavigationState;
}

@Component({
  selector: 'unext-time-picker-military',
  templateUrl: './time-picker-military.component.html',
  styleUrls: ['./time-picker-military.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerMilitaryComponent),
      multi: true
    }
  ]
})
export class TimePickerMilitaryComponent implements OnInit, ControlValueAccessor {
private destroy$ = new Subject<boolean>();
@Input() placeHolder: string;
@Input() elementName: string;
@Input() time: string;
@Input() timeDisabled: boolean;
@Input() emitValue: boolean;
@Input() showResetBtn: boolean;
@Output() timeChanged = new EventEmitter<String>();
getNavigationState = createFeatureSelector<NavigationState>('navigation');
getLocale = createSelector(this.getNavigationState, (state) => state && state.locale ? state.locale : { country: 'US', lcid: 'en-US', value: 'en', name: 'English' });
navigationGetLocale$ = this.store.pipe(select(this.getLocale));
timeFormat;
timeSelected: string;
hoursValue;
hoursValueOriginal;
minutesValue;
minutesValueOriginal;
hoursFlag = true;
minutesFlag = true;

  onChange: any = () => {};
  onTouched: any = () => {};
  constructor(
    private el: ElementRef,
    private _cdRef: ChangeDetectorRef,
    private store: ngrxSelector.Store<State>,
  ) { }

  ngOnInit() {
    this.timeDisabled = this.timeDisabled ? this.timeDisabled : false;
    this.timeSelected = this.time;
    if (this.timeSelected) {
      this.initSetHoursMinutes();
    }

    this.navigationGetLocale$
    .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
    .subscribe(loc => {
      if (loc) {
        this.timeFormat =  (loc.hasOwnProperty('timeFormat')) ? loc['timeFormat'] : 0;
      }
    });
  }

  get value() {
    return this.timeSelected;
  }

  set value(val) {
    this.timeSelected = val;
    this.emitSelected();
    this.onChange(val);
    this.onTouched();
  }


  emitSelected() {
    if (this.emitValue) {
      this.timeChanged.emit(this.timeSelected);
    }
  }

  // We implement this method to keep a reference to the onChange
  // callback function passed by the forms API
  registerOnChange(fn) {
    this.onChange = fn;
  }
  // We implement this method to keep a reference to the onTouched
  // callback function passed by the forms API
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  // This is a basic setter that the forms API is going to use
  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  initSetHoursMinutes() {
    if (this.timeSelected) {
      const timeSelected = this.timeSelected.split(':');
      const hours = Number(timeSelected[0]);
      const minutes = Number(timeSelected[1]);
      this.hoursValue = hours;
      this.hoursValueOriginal = hours;
      this.minutesValue = minutes;
      this.minutesValueOriginal = minutes;
      this.hoursFlag = false;
      this.minutesFlag = false;
      this.onBlur();
    }
  }

  reset() {
    if (this.hoursValue) {
      this.hoursValue = this.hoursValueOriginal;
      this.minutesValue = this.minutesValueOriginal;
      this.hoursFlag = false;
      this.minutesFlag = false;
    } else {
      this.hoursValue = null;
      this.minutesValue = null;
      this.hoursFlag = true;
      this.minutesFlag = true;
    }
    this._cdRef.detectChanges();
    this.validateTime();
  }

  onHoursChange(h) {
    if (h) {
      h = parseInt(h);
      if (h > 23) {
        this.hoursValue = null;
        this._cdRef.detectChanges();
        this.hoursFlag = true;
      } else {
        this.hoursValue = h;
        this.hoursFlag = false;
      }
      this.validateTime();
    }
  }

  onMinutesChange(m) {
    if (m) {
      m = parseInt(m);
      if (m > 59) {
        this.minutesValue = null;
        this._cdRef.detectChanges();
        this.minutesFlag = true;
      } else {
        this.minutesValue = m;
        this.minutesFlag = false;
      }
      this.validateTime();
    }
  }

  onBlur() {
    if (this.hoursValue < 10 && (this.hoursValue.toString().length === 1)) {
      this.hoursValue = '0' + this.hoursValue;
    }
    if (this.minutesValue < 10  && (this.minutesValue.toString().length === 1)) {
      this.minutesValue = '0' + this.minutesValue;
    }
  }

  validateTime() {
    const isTimeValid = (!this.hoursFlag && !this.minutesFlag) ? true : false;
    if (isTimeValid) {
      const hrd = (this.hoursValue < 10  && (this.hoursValue.toString().length === 1)) ? '0' + this.hoursValue : this.hoursValue;
      const min = (this.minutesValue < 10  && (this.minutesValue.toString().length === 1)) ? '0' + this.minutesValue : this.minutesValue;
      const timeString = hrd + ':' + min;
      this.timeSelected = timeString;
      this.emitSelected();
    }
  }


}
