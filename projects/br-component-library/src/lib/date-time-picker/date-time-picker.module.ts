import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material-module';
import { LocaleConverter } from '../shared/locale/locale-converter.service';
import { BrDateTimePickerComponent } from './date-time-picker.component';
import { BrCore } from '../shared/core.module';

// export const DATE_FORMATS: MatDateFormats = {
//   parse: {
//     dateInput: 'LL',
//   },
//   display: {
//     dateInput: 'LL',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

@NgModule({
  declarations: [BrDateTimePickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    BrCore,
    ReactiveFormsModule
   ],
   exports: [BrDateTimePickerComponent],
   providers: [
     LocaleConverter
    //  { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
    ]
})
export class BrDateTimePicker { }
