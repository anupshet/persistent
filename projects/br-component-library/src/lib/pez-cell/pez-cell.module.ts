import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MaterialModule } from '../material-module';
import { BrPezCellComponent } from './pez-cell.component';
import { BrPezDialogComponent } from './pez-dialog/pez-dialog.component';
import { BrCore } from '../shared/core.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [BrPezCellComponent, BrPezDialogComponent],
  entryComponents: [BrPezDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    BrCore,
  ],
  exports: [BrPezCellComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class BrPezCell {}
