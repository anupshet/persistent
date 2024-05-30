import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material-module';
import { BrTimePickerComponent } from './time-picker.component';

@NgModule({
  declarations: [BrTimePickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
   ],
   exports: [BrTimePickerComponent]
})
export class BrTimePicker { }
