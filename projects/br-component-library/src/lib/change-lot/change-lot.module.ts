import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material-module';
import { BrSelect } from '../select/select.module';
import { BrChangeLotComponent } from './change-lot.component';

@NgModule({
  declarations: [BrChangeLotComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    BrSelect
  ],
  exports: [BrChangeLotComponent]
})
export class BrChangeLot {}
