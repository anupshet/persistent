import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../material-module';
import { BrAnalyteSummaryViewComponent } from './analyte-summary-view.component';
import { BrPezCell } from '../pez-cell/pez-cell.module';
import { BrCore } from '../shared/core.module';

@NgModule({
  declarations: [
    BrAnalyteSummaryViewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    BrPezCell,
    BrCore
  ],
  exports: [
    BrAnalyteSummaryViewComponent
  ]
})
export class BrAnalyteSummaryView { }
