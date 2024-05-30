import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrLevelsInUseComponent } from './levels-in-use.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BrLevelsInUseComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [BrLevelsInUseComponent]
})
export class BrLevelsInUseModule { }
