// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { NgModule } from '@angular/core';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {
  BrDatePicker,
  BrDateTimePicker,
  BrDialog,
  BrDialogComponent,
  BrPezCell,
  BrSelect,
  BrSummaryStatisticsTable,
  BrTimePicker,
  BrReviewSummary,
  BrCore
} from 'br-component-library';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
import { BrInfoTooltip } from 'br-component-library';

import { SharedModule } from '../../shared/shared.module';
import { DataReviewRoutingModule } from './data-review-routing.module';
import { DataReviewComponent } from './data-review/data-review.component';
import * as State from './state';

import { DataColumnsSettingsComponent } from './data-columns-settings/data-columns-settings.component';
import { AdditionalFilterDialogComponent } from './additional-filter-dialog/additional-filter-dialog.component';

import { ManageExpectedTestComponent } from './manage-expected-test/manage-expected-test.component';
import { MissingTestsComponent } from './missing-tests/missing-tests.component';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';
import { SummaryStatisticsTableService } from '../data-management/analyte-detail-table/analytical-section/summary-statistics-table/summary-statistics-table.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    PerfectScrollbarModule,
    NgxExtendedPdfViewerModule,
    CommonModule,
    SharedModule,
    DataReviewRoutingModule,
    BrSummaryStatisticsTable,
    BrDatePicker,
    BrTimePicker,
    BrDateTimePicker,
    BrSelect,
    BrDialog,
    BrPezCell,
    BrReviewSummary,
    BrCore,
    BrInfoTooltip,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    StoreModule.forFeature(State.DataReviewStateIdentifier, State.reducers.dataReview),
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    SharedTranslateModule
  ],
  declarations: [
    DataReviewComponent,
    DataColumnsSettingsComponent,
    AdditionalFilterDialogComponent,
    ManageExpectedTestComponent,
    MissingTestsComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    SummaryStatisticsTableService
  ],
})
export class DataReviewModule { }
