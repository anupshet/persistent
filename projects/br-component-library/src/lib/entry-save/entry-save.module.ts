import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material-module';
import { BrEntrySaveComponent } from './entry-save.component';
import { BrDateTimePicker } from '../date-time-picker/date-time-picker.module';

@NgModule({
  declarations: [BrEntrySaveComponent],
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, BrDateTimePicker],
  exports: [BrEntrySaveComponent]
})
export class BrEntrySaveModule {}
