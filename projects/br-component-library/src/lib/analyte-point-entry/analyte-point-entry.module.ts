import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrDateTimePicker } from '../date-time-picker/date-time-picker.module';
import { MaterialModule } from '../material-module';
import { BrAnalytePointEntryComponent } from './analyte-point-entry.component';
import { BrChangeLot } from '../change-lot/change-lot.module';
import { BrCore } from '../shared/core.module';

@NgModule({
  declarations: [BrAnalytePointEntryComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    BrCore,
    BrDateTimePicker,
    BrChangeLot
   ],
   exports: [BrAnalytePointEntryComponent]
})
export class BrAnalytePointEntry { }
