import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material-module';
import { BrDatePickerComponent } from './date-picker.component';

@NgModule({
  declarations: [BrDatePickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [BrDatePickerComponent]
})
export class BrDatePicker {}
