/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { InfoTooltipComponent, BrInfoTooltip, MaterialModule } from 'br-component-library';
import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';

import { SharedModule } from '../../shared/shared.module';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent, } from './reporting.component';
import { DynamicReportingService } from '../../shared/services/reporting.service';
import { environment } from 'src/environments/environment';
import { NewReportsComponent } from './new-reports/new-reports.component';
import { ReportParametersFilterComponent } from './new-reports/components/report-parameters-filter/report-parameters-filter.component';
import { SearchInLabconfigComponent } from './new-reports/components/search-in-labconfig/search-in-labconfig.component';
import { LabconfigSelectionComponent } from './new-reports/components/labconfig-selection/labconfig-selection.component';
import { ReportSelectedItemsComponent } from './new-reports/components/report-selected-items/report-selected-items.component';
import { LayoutModule } from '@angular/cdk/layout';
import { PastReportsComponent } from './past-reports/past-reports.component';
import { PastReportsFilterComponent } from './past-reports/filter-component/filter.component';
import { PastReportsTableComponent } from './past-reports/past-reports-table/past-reports-table.component';
import { PastReportsYearPickerComponent } from './past-reports/year-picker/year-picker.component';
import { PastReportsMonthPickerComponent } from './past-reports/month-picker/month-picker.component';
import { PastReportsPreviewComponent } from '../reporting/past-reports/preview/preview.component';
import { DynamicReportsService } from './new-reports/services/dynamic-reports.service';
import { ReportPreviewComponent } from './new-reports/components/report-preview/report-preview.component';
import { CorrectiveActionsComponent } from './new-reports/components/corrective-actions/corrective-actions.component';
import { ReportPreviewFooterComponent } from './new-reports/components/report-preview-footer/report-preview-footer.component';
import { ReportTemplatesComponent } from './new-reports/components/report-templates/report-templates.component';
import { ReportsGenericDialogComponent } from './new-reports/components/reports-generic-dialog/reports-generic-dialog.component';
import { NumberToMonthPipe } from '../../shared/pipes/number-to-month.pipe';
import { ConfirmNavigateGuard } from './shared/guard/confirm-navigate.guard';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    ReportingRoutingModule,
    SharedModule,
    PerfectScrollbarModule,
    BrInfoTooltip,
    MaterialModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    LayoutModule,
    NgxExtendedPdfViewerModule,
    SharedTranslateModule,
  ],
  exports: [
    MaterialModule,
  ],
  declarations: [
    ReportingComponent,
    NumberToMonthPipe,
    NewReportsComponent,
    ReportParametersFilterComponent,
    SearchInLabconfigComponent,
    LabconfigSelectionComponent,
    ReportSelectedItemsComponent,
    PastReportsComponent,
    PastReportsFilterComponent,
    PastReportsTableComponent,
    PastReportsYearPickerComponent,
    PastReportsMonthPickerComponent,
    PastReportsPreviewComponent,
    ReportPreviewComponent,
    CorrectiveActionsComponent,
    ReportPreviewFooterComponent,
    ReportTemplatesComponent,
    ReportsGenericDialogComponent
  ],
  providers: [
    NgxExtendedPdfViewerService,
    DynamicReportingService,
    DynamicReportsService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache({
            addTypename: false
          }),
          link: httpLink.create({
            uri: environment.api.dynamicReportingGraphqlUrl,
            method: 'POST',
            headers: new HttpHeaders().set('Authorization', 'Bearer ' +
            JSON.parse(localStorage.getItem('okta-token-storage')).accessToken.accessToken)
          })
        };
      },
      deps: [HttpLink]
    },
    ConfirmNavigateGuard,
    TranslateService
  ],
  entryComponents: [
    InfoTooltipComponent,
    ReportsGenericDialogComponent
  ]
})
export class ReportingModule { }