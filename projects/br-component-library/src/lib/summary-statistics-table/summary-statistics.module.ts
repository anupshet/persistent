import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaterialModule } from '../material-module';
import { BrSummaryBoxComponent } from './summary-box/summary-box.component';
import { BrSummaryStatisticsTableComponent } from './summary-statistics-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrCore } from '../shared/core.module';

@NgModule({
  declarations: [
    BrSummaryBoxComponent,
    BrSummaryStatisticsTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    BrCore
   ],
   providers: [
    DecimalPipe
   ],
   exports: [
    BrSummaryBoxComponent,
    BrSummaryStatisticsTableComponent
  ]
})
export class BrSummaryStatisticsTable { }
