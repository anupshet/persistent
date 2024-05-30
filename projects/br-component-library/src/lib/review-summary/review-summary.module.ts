// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { BrDateTimePicker } from '../date-time-picker/date-time-picker.module';
import { MaterialModule } from '../material-module';
import { BrReviewSummaryComponent } from './review-summary.component';
import { BrCore } from './../shared/core.module';
import { DatePipe } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [BrReviewSummaryComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
    BrDateTimePicker,
    BrCore,
    PerfectScrollbarModule
  ],
  providers: [DatePipe],
  exports: [BrReviewSummaryComponent]
})
export class BrReviewSummary { }
