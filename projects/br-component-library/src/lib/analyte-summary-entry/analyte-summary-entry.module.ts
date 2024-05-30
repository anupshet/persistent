import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material-module';
import { BrAnalyteSummaryEntryComponent } from './analyte-summary-entry.component';
import { BrDateTimePicker } from '../date-time-picker/date-time-picker.module';
import { BrChangeLot } from '../change-lot/change-lot.module';
import { BrCore } from '../shared/core.module';

@NgModule({
  declarations: [BrAnalyteSummaryEntryComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    BrCore,
    BrDateTimePicker,
    BrChangeLot
   ],
   exports: [BrAnalyteSummaryEntryComponent]
})
export class BrAnalyteSummaryEntry { }
