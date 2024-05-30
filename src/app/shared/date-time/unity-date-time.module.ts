// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnityDateTimePipe } from './pipes/unity-date-time.pipe';
import { UnityDateTimeDisplayComponent } from './unity-datetime-display/unity-datetime-display.component';
import { UnityNextDatePipe } from './pipes/unity-next-date.pipe';
import { UnityNextNumericPipe } from './pipes/unity-numeric.pipe';
import { UnDateFormatPipe } from './pipes/unDateFormat.pipe';
import { UnextTimePeriodPipe } from './pipes/unext-time-period.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    UnityDateTimePipe,
    UnityDateTimeDisplayComponent,
    UnityNextDatePipe,
    UnityNextNumericPipe,
    UnDateFormatPipe,
    UnextTimePeriodPipe
  ],
  declarations: [
    UnityDateTimePipe,
    UnityDateTimeDisplayComponent,
    UnityNextDatePipe,
    UnityNextNumericPipe,
    UnDateFormatPipe,
    UnextTimePeriodPipe
  ]
})
export class UnityDateTimeModule { }
