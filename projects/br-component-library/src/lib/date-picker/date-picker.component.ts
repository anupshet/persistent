
/* AJ believes this is no longer used */

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
  selector: 'br-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-us'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class BrDatePickerComponent implements OnInit {
  @Input() translationLabels: any;
  @Input() public displayDate: Date;
  @Input() public availableDateFrom: Date;
  @Input() public availableDateTo: Date;
  @Input() public disableTextInput: boolean;


  @Input() set appLocale(appLocale: string) {
    this.adapter.setLocale(appLocale);
  }

  @Output() public onDateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  public serializedDate: FormControl;

  constructor(private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.displayDate = this.displayDate || new Date();
    this.serializedDate = new FormControl(this.displayDate);
  }

  public onDateChange(selectedDate: Date): void {
    this.onDateSelected.emit(selectedDate);
  }
}
