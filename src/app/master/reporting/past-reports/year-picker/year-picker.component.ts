import {
  Component,
  Input,
  ViewChild,
  OnChanges, 
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormGroup,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;

export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'past-reports-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS }
  ],
})
export class PastReportsYearPickerComponent implements OnChanges {

  @ViewChild(MatDatepicker) _picker: MatDatepicker<Moment>;
  @Input('form') form: FormGroup;
  @Input('yrsBefore') yrsBefore;
  @Input('dataSource') dataSource: Array<any> = [];
  @Output('yearChanged') yearChanged: EventEmitter<any> = new EventEmitter<any>();

  inputCtrl: any;
  selectedDate: any;
  max: any;
  min: any;

  constructor() {
  }

  ngOnInit(){
    this.setMinMaxDates();
  }

  setMinMaxDates(){
    this.max = new Date();
    let d: any = new Date();
    d.setMonth(0);
    d.setDate(1);
    this.min = new Date(d);
    this.min.setDate(1);
    this.min.setFullYear(this.min.getFullYear() - this.yrsBefore);
    this.selectedDate = new Date();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.yrsBefore) {
        this.setMinMaxDates();
      }
    }
  }

  _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {
    datepicker.close();
    chosenDate.set({ date: 1 });
    this.selectedDate = chosenDate;
    this.yearChanged.emit(this.selectedDate);
    this.inputCtrl = chosenDate;
    this.form.controls['year'].setValue(chosenDate.year());
  }

  _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }

}
