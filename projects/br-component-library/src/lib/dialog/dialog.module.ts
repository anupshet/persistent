import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { MaterialModule } from '../material-module';
import { BrDialogComponent } from './dialog.component';

@NgModule({
  declarations: [BrDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MaterialModule
  ],
  exports: [BrDialogComponent]
})
export class BrDialog { }
