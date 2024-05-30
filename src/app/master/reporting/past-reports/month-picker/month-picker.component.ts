import {
  Component,
  Input,
  SimpleChange,
  ViewChild,
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

export const MONTH_MODE_FORMATS = {
  parse: {
    dateInput: 'MMMM',
  },
  display: {
    dateInput: 'MMMM',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'past-reports-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_MODE_FORMATS }
  ],
})
export class PastReportsMonthPickerComponent {

  @ViewChild(MatDatepicker) _picker: MatDatepicker<Moment>;
  @Input() form: FormGroup;
  @Input('min') min: any;
  @Input('dataSource') dataSource: Array<any> = [];
  max:any;
  inputCtrl: any;

  constructor() {
  }

  ngOInit() { }

  ngOnChanges(change: SimpleChange ){
    this.setInitilaDate();
  }

  setInitilaDate(){
    this.inputCtrl = null;
    this.form.controls['month'].setValue(null);
    let selectedDate: any = new Date(this.min);
    let currentDate: any = new Date();
    if(selectedDate.getFullYear() < currentDate.getFullYear()){
      currentDate.setFullYear(selectedDate.getFullYear());
      currentDate.setMonth(11);
      this.max = currentDate;
    }else{
      currentDate.setMonth(0);
      this.min = new Date(currentDate).setDate(1);
      this.max = new Date();
    }
  }

  yearChanged(event:any){
    let currentDate = new Date(event);
    this.max = currentDate;
    this.min = currentDate;
    this.setInitilaDate();
  }

  /** send the focus away from the input so it doesn't open again */
  _takeFocusAway = (datepicker: MatDatepicker<Moment>) => { };

  monthSelectHandler(chosenDate: any, datepicker: MatDatepicker<Moment>) {
    datepicker.close();
    chosenDate.set({ date: 1 });
    this.inputCtrl = new Date(chosenDate);
    this.form.controls['month'].setValue(this.inputCtrl.getMonth());
  }

  _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }

}
