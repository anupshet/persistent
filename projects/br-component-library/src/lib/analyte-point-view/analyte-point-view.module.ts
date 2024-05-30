import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material-module';
import { BrAnalytePointViewComponent } from './analyte-point-view.component';
import { BrPezCell } from '../pez-cell/pez-cell.module';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { BrCore } from '../shared/core.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false,
  suppressScrollY: true
};

@NgModule({
  declarations: [
    BrAnalytePointViewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrPezCell,
    PerfectScrollbarModule,
    BrCore
  ],
  exports: [
    BrAnalytePointViewComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class BrAnalytePointView {}
