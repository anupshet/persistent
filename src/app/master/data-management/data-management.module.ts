/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

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
  BrReviewSummaryComponent,
  BrCore
} from 'br-component-library';
import { NgxExtendedPdfViewerService, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';

import { SharedModule } from '../../shared/shared.module';
import { AllowRationalNumberDirective } from '../../core/directives/allow-rational-number.directive';
import {
  UnityDateTime,
  UnityDateTimeFormatter
} from '../../core/helpers/DateTimes/unity-next-DateTime.pipe';
import { CodelistApiService } from '../../shared/api/codelistApi.service';
import { LabDataApiService } from '../../shared/api/labDataApi.service';
import {
  TransformSummaryStatsPipe
} from '../../shared/pipes/transform-values.pipe';
import { EntityTypeService } from '../../shared/services/entity-type.service';
import { TreeNodesService } from '../../shared/services/tree-nodes.service';
import { AnalyteDataEntryComponent } from './analyte-data-entry/analyte-data-entry.component';
import { AnalyteDetailTableComponent } from './analyte-detail-table/analyte-detail-table.component';
import { AnalyticalSectionComponent } from './analyte-detail-table/analytical-section/analytical-section.component';
import { LevelToggleComponent } from './analyte-detail-table/analytical-section/level-toggle/level-toggle.component';
import { LevelToggleService } from './analyte-detail-table/analytical-section/level-toggle/level-toggle.service';
import { LjChartPopupComponent } from './analyte-detail-table/analytical-section/lj-chart/lj-chart-popup/lj-chart-popup.component';
import { LjChartPopupService } from './analyte-detail-table/analytical-section/lj-chart/lj-chart-popup/lj-chart-popup.service';
import { LjChartComponent } from './analyte-detail-table/analytical-section/lj-chart/lj-chart.component';
import {
  SummaryStatisticsTableService
} from './analyte-detail-table/analytical-section/summary-statistics-table/summary-statistics-table.service';
import { RunEditDataComponent } from './analyte-detail-table/run-edit-data/run-edit-data.component';
import { RunInsertComponent } from './analyte-detail-table/run-insert/run-insert.component';
import { DateTimeCellComponent } from './analyte-detail-table/runs-table/run-cell/date-time-cell/date-time-cell.component';
import { ReasonCellComponent } from './analyte-detail-table/runs-table/run-cell/reason-cell/reason-cell.component';
import { ValueCellComponent } from './analyte-detail-table/runs-table/run-cell/value-cell/value-cell.component';
import { ZscoreCellComponent } from './analyte-detail-table/runs-table/run-cell/zscore-cell/zscore-cell.component';
import { RunsTableComponent } from './analyte-detail-table/runs-table/runs-table.component';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';
import { AnalyteDetailTooltipComponent } from './header/analyte-detail-tooltip/analyte-detail-tooltip.component';
import { PointDataEntryComponent } from './shared/point-data-entry/point-data-entry.component';
import { dataManagementStateIdentifier } from './state/selectors';
import { ReportingService } from './unity-report/reporting.service';
import { reducer } from './state/reducers/data-management.reducer';
import { PreviewReportComponent } from './unity-report/preview-report/preview-report.component';
import { ReportHelperService } from './unity-report/report-helper.service';
import { ReportPanelComponent } from './unity-report/report-panel/report-panel.component';
import { UnityReportComponent } from './unity-report/unity-report.component';
import { DataEntryEditComponent } from './analyte-data-entry/data-entry-edit/data-entry-edit.component';
import { CustomCalendarHeaderComponent } from './unity-report/custom-calendar-header/custom-calendar-header.component';
import { InfoTooltipComponent, BrInfoTooltip } from 'br-component-library';
import { NavSecondaryNavComponent } from './nav-secondary-nav/nav-secondary-nav.component';
import { QuickAccessReportComponent } from './nav-secondary-nav/quick-access-report/quick-access-report.component';
import { SinglePageSectionComponent } from './single-page-section/single-page-section.component';
import { AdvancedLjPanelComponent } from './advanced-lj/advanced-lj-panel/advanced-lj-panel.component';
import { AdvancedLjLevelsComponent } from './advanced-lj/advanced-lj-levels/advanced-lj-levels.component';
import { AdvancedLjTimeframeComponent } from './advanced-lj/advanced-lj-timeframe/advanced-lj-timeframe.component';
import { AdvancedLjChartComponent } from './advanced-lj/advanced-lj-chart/advanced-lj-chart.component';
import { AnalyteDescriptionComponent } from './shared/analyte-description/analyte-description.component';
import { DynamicReportingService } from '../../shared/services/reporting.service';
import { environment } from '../../../environments/environment';
import { SortByPipe } from './shared/pipes/sort-by.pipe';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';
import { LabSetupModule } from '../lab-setup/lab-setup.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    PerfectScrollbarModule,
    NgxExtendedPdfViewerModule,
    SharedTranslateModule,
    SharedModule,
    DataManagementRoutingModule,
    BrSummaryStatisticsTable,
    BrDatePicker,
    BrTimePicker,
    BrDateTimePicker,
    BrSelect,
    BrDialog,
    BrPezCell,
    BrReviewSummary,
    BrCore,
    StoreModule.forFeature(dataManagementStateIdentifier, reducer),
    BrInfoTooltip,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    LabSetupModule
  ],
  declarations: [
    UnityDateTime,
    UnityDateTimeFormatter,
    DataManagementComponent,
    AnalyteDetailTooltipComponent,
    AnalyteDetailTableComponent,
    ReportPanelComponent,
    RunsTableComponent,
    RunEditDataComponent,
    UnityReportComponent,
    LjChartComponent,
    LevelToggleComponent,
    LjChartPopupComponent,
    TransformSummaryStatsPipe,
    PreviewReportComponent,
    AllowRationalNumberDirective,
    DateTimeCellComponent,
    ValueCellComponent,
    ZscoreCellComponent,
    ReasonCellComponent,
    AnalyticalSectionComponent,
    RunInsertComponent,
    PointDataEntryComponent,
    AnalyteDataEntryComponent,
    DataEntryEditComponent,
    CustomCalendarHeaderComponent,
    PreviewReportComponent,
    ReportPanelComponent,
    NavSecondaryNavComponent,
    QuickAccessReportComponent,
    SinglePageSectionComponent,
    SortByPipe
  ],
  entryComponents: [
    DataEntryEditComponent,
    RunEditDataComponent,
    PreviewReportComponent,
    BrDialogComponent,
    BrReviewSummaryComponent,
    CustomCalendarHeaderComponent,
    InfoTooltipComponent
  ],
  providers: [
    NgxExtendedPdfViewerService,
    SummaryStatisticsTableService,
    RunsTableComponent,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ReportingService,
    DynamicReportingService,
    LevelToggleService,
    LjChartPopupService,
    TreeNodesService,
    EntityTypeService,
    CodelistApiService,
    LabDataApiService,
    ReportHelperService,
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          defaultOptions: {
            query: {
              fetchPolicy: 'no-cache'
            }
          },
          cache: new InMemoryCache({
            addTypename: false
          }),
          link: httpLink.create({
            uri: environment.api.dynamicReportingGraphqlUrl,
            method: 'POST',
            headers: new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('okta-token-storage'))
            .accessToken.value)
          })
        };
      },
      deps: [HttpLink]},
      TranslateService
  ]
})
export class DataManagementModule { }
