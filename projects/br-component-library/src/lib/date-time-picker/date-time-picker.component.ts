/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved. */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  Renderer2,
  Inject,
  OnDestroy,
  ChangeDetectorRef,

} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  getTimeZoneAdjustedDateTime,
  getTime,
  setTime,
  hasTimeParts,
  getBrowserAdjustedDateTime,
  isTimeInputSupported,
  isValidRegex,
  getOffset
} from '../shared/utility-functions';
import { CustomRegex, UnityNextDatePipe } from '../shared';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { select } from '@ngrx/store';
import * as ngrxSelector from '@ngrx/store';

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
  selector: 'br-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UnityNextDatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrDateTimePickerComponent),
      multi: true
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})

export class BrDateTimePickerComponent implements OnInit, OnChanges, ControlValueAccessor, OnDestroy {
  @Input() translationLabels: any;
  @Input() availableDateFrom: Date;
  @Input() availableDateTo: Date;
  @Input() selectedDateTime: Date;
  @Input() readOnlyDate = false; // Label or not
  @Input() canSelectDate = true; // Allow calendar popup funcionality
  @Input() canInputDate = true; // Allow manual date input
  @Input() canSelectTime = true;
  @Input() elementName: string;
  @Input() errorMessage: string;
  @Input() resetFormDateTime: Date;
  @Input() displayInline = true;
  @Input() showChangeDateButton = false; // Shows 'ChangeDate' button
  @Input() hideLabel = false;
  @Input() timeZone: string;
  @Input() isEditMode: boolean;
  @Input() isDisabled: boolean;
  @Input()  shortDate = false;
  @Input() currentLanguage: string;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() isTimeInputValid = new EventEmitter<boolean>();
  @ViewChild('picker', { static: false }) picker: MatDatepicker<Date>;

  public selectedTime: string;
  isTimeInputSupported: boolean = null;
  public timeZoneAdjustedDateTime: Date;
  private initialized = false;
  private IeTimeRegex = new RegExp(CustomRegex.MILITARY_TIME);
  onChange: any = () => { };
  onTouched: any = () => { };
  private destroy$ = new Subject<boolean>();
  getNavigationState = createFeatureSelector<NavigationState>('navigation');
  getLocale = createSelector(this.getNavigationState, (state) => state && state.locale ?
  state.locale : {country: 'US', lcid: 'en-US', value: 'en', name: 'English'});
  navigationGetLocale$ = this.store.pipe(select(this.getLocale));
  timeFormat;
  hoursValue;
  hoursValueOriginal;
  minutesValue;
  minutesValueOriginal;
  hoursFlag = true;
  minutesFlag = true;
  selectedLang: any = { lcid: 'en-US' };

  constructor(private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private language: string,
    @Inject(MAT_DATE_FORMATS) public dataDatePicker: any,
    private renderer: Renderer2,
    private store: ngrxSelector.Store<State>,
    private _cdRef: ChangeDetectorRef,
    ) {
      this.navigationGetLocale$
      .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
      .subscribe(loc => {
          this.getShortDateFormatString(loc);
          this.timeFormat =  (loc.hasOwnProperty('timeFormat')) ? loc['timeFormat'] : 0;
          this.sleep(100).then(() => {
            this._cdRef.detectChanges();
            this._cdRef.markForCheck();
            this.initSetHoursMinutes();
          });
      });
  }

  checkForTimeInputSupport(): boolean {
    if (this.isTimeInputSupported != null) {
      return this.isTimeInputSupported;
    }
    this.isTimeInputSupported = isTimeInputSupported(this.renderer);
  }

  ngOnInit() {
    this.getDateFormatString();
    if (this.selectedDateTime) {
      this.selectedDateTime = new Date(this.selectedDateTime);
    } else {
      this.selectedDateTime = new Date();
    }

    const dateTimeOffset = this.getOffset(this.selectedDateTime, this.timeZone);

    // SR 09182020: Check if date picker is used within Edit dialog and apply dateTime changes accordingly
    if (this.isEditMode) {
      this.availableDateTo = this.availableDateTo;
      this.availableDateFrom = this.availableDateFrom;
      this.timeZoneAdjustedDateTime = this.selectedDateTime;
    } else {
      if (this.availableDateTo) {
        this.availableDateTo = getTimeZoneAdjustedDateTime(this.availableDateTo, dateTimeOffset);
      }
      if (this.availableDateFrom) {
        this.availableDateFrom = getTimeZoneAdjustedDateTime(this.availableDateFrom, dateTimeOffset);
      }

      this.timeZoneAdjustedDateTime = getTimeZoneAdjustedDateTime(this.selectedDateTime, dateTimeOffset);
      this.selectedTime = getTime(this.timeZoneAdjustedDateTime);
    }

    this.checkForTimeInputSupport();
    this.initialized = true;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedDateTime'] && this.initialized) {
      const dateTimeOffset = this.getOffset(this.selectedDateTime, this.timeZone);
      this.timeZoneAdjustedDateTime = getTimeZoneAdjustedDateTime(this.selectedDateTime, dateTimeOffset);
      this.selectedTime = getTime(this.timeZoneAdjustedDateTime);
      // This is for 24hrs picker
      const timeSelected = this.selectedTime.split(':'); 
      this.hoursValue = Number(timeSelected[0]);
      this.minutesValue = Number(timeSelected[1]);
      this.onBlur();
    } else if (simpleChanges['selectedDateTime'] && this.isEditMode) {
      this.timeZoneAdjustedDateTime = this.selectedDateTime; // Handling onChanges when selecting date in Edit dialog
    }
  }

  get value() {
    return this.selectedDateTime;
  }

  set value(val: Date) {
    this.selectedDateTime = val;

    const dateTimeOffset = this.getOffset(this.selectedDateTime, this.timeZone);
    this.timeZoneAdjustedDateTime = getTimeZoneAdjustedDateTime(this.selectedDateTime, dateTimeOffset);
    this.selectedTime = getTime(this.timeZoneAdjustedDateTime);
    if (this.isEditMode) {
      this.timeZoneAdjustedDateTime = this.selectedDateTime;
    }

    this.onChange(val);
    this.onTouched();
  }

  getDateFormatString() {
    this.navigationGetLocale$.pipe(filter(loc => !!loc), takeUntil(this.destroy$)).subscribe(loc => {
      this.selectedLang = loc;
      this.currentLanguage = this.selectedLang.language === 'zh' ? 'zh-CN' : this.selectedLang.language;
      this.adapter.setLocale(this.currentLanguage);
    });
  }

  onDateChange($event) {
    if ($event.value) {
      this.selectedDateTime = new Date($event.value);
      this.timeZoneAdjustedDateTime = new Date($event.value);
      if (this.selectedTime) {
        this.timeZoneAdjustedDateTime = setTime(this.timeZoneAdjustedDateTime, this.selectedTime);
        const dateTimeOffset = this.getOffset(this.timeZoneAdjustedDateTime, this.timeZone);
        this.selectedDateTime = getBrowserAdjustedDateTime(this.timeZoneAdjustedDateTime, dateTimeOffset);
      }

      this.dateSelected.emit(this.selectedDateTime);
      this.onChange(this.selectedDateTime);
      this.onTouched();
    }
  }

  onTimeChange() {

    if (hasTimeParts(this.selectedTime)) {
      if (!this.isTimeInputSupported && !isValidRegex(this.selectedTime, this.IeTimeRegex)) {
        this.isTimeInputValid.emit(false);
        return;
      }
      this.updateTime();
    }
    if (this.canSelectTime && !hasTimeParts(this.selectedTime)) {
      this.isTimeInputValid.emit(false);
    }
  }

  private updateTime() {
    this.timeZoneAdjustedDateTime = setTime(this.timeZoneAdjustedDateTime, this.selectedTime);
    const dateTimeOffset = this.getOffset(this.timeZoneAdjustedDateTime, this.timeZone);
    this.selectedDateTime = getBrowserAdjustedDateTime(this.timeZoneAdjustedDateTime, dateTimeOffset);

    this.dateSelected.emit(this.selectedDateTime);
    this.isTimeInputValid.emit(true);

    this.onChange(this.selectedDateTime);
    this.onTouched();
  }

  private getOffset(date: Date, timeZone: string): string {
    return getOffset(date, timeZone);
  }

  dateChangeClicked() {
    this.picker.open();
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
  writeValue(value: Date) {
    if (value) {
      this.value = new Date(value);
      return;
    }
    this.value = this.resetFormDateTime ? new Date(this.resetFormDateTime.toISOString()) : new Date();
  }


  initSetHoursMinutes() {
    if (this.selectedTime) {
      const timeSelected = this.selectedTime.split(':');
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
    this.onBlur();
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
      this.selectedTime = timeString;
    }
    this.onTimeChange();
  }

  getShortDateFormatString(selectedLanguage) {
    const shortDateFormatOptions = {
      'en-US': {
        0: 'M/DD/YY',
        1: 'DD/M/YY',
        2: 'YY/M/DD',
      },
      'en-GB': {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "fr-FR": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "fr-CA": {
        0: 'MM-DD-YYYY',
        1: 'DD-MM-YYYY',
        2: 'YYYY-MM-DD',
      },
      "es-ES": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "it-IT": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "pt-PT": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "pl-PL": {
        0: 'MM.DD.YYYY',
        1: 'DD.MM.YYYY',
        2: 'YYYY.MM.DD',
      },
      "hu-HU": {
        0: 'MM.DD.YYYY',
        1: 'DD.MM.YYYY',
        2: 'YYYY.MM.DD',
      },
      "de-DE": {
        0: 'MM.DD.YYYY',
        1: 'DD.MM.YYYY',
        2: 'YYYY.MM.DD',
      },
      "ru-RU": {
        0: 'MM.DD.YYYY',
        1: 'DD.MM.YYYY',
        2: 'YYYY.MM.DD',
      },
      "ko-KR": {
        0: 'M.DD.YYYY',
        1: 'DD.M.YYYY',
        2: 'YYYY.M.DD',
      },
      "ja-JP": {
        0: 'MM/DD/YYYY',
        1: 'DD/MM/YYYY',
        2: 'YYYY/MM/DD',
      },
      "zh-CN": {
        0: 'M/DD/YYYY',
        1: 'DD/M/YYYY',
        2: 'YYYY/M/DD',
      }
    };
    if (shortDateFormatOptions[selectedLanguage.locale] && shortDateFormatOptions[selectedLanguage.locale][selectedLanguage.dateFormat]) {
      this.dataDatePicker.display.dateInput = shortDateFormatOptions[selectedLanguage.locale][selectedLanguage.dateFormat];
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
