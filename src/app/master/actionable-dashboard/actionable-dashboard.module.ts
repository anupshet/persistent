// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrSelect } from 'br-component-library';
import { SharedModule } from '../../shared/shared.module';
import { ActionableDashboardComponent } from './actionable-dashboard.component';
import { AuthenticationService } from '../../security/services/authentication.service';
import { ExpiringLotsPanelComponent } from './components/expiring-lots-panel/expiring-lots-panel.component';
import { ExpiringLotsListComponent } from './components/expiring-lots-panel/expiring-lots-list/expiring-lots-list.component';
import { ExpiringLotsComponent } from './containers/expiring-lots/expiring-lots.component';
import { ExpiringLicenseComponent } from './containers/expiring-license/expiring-license.component';
import { ExpiringLicensePanelComponent } from './components/expiring-license-panel/expiring-license-panel.component';
import { GreetingComponent } from './components/greeting/greeting.component';
import {
  ProductLotRenewalDetailsComponent
} from './components/expiring-lots-panel/product-lot-renewal-details/product-lot-renewal-details.component';
import { ProductLotRenewalComponent } from './containers/expiring-lots/product-lot-renewal/product-lot-renewal.component';
import { UnityDateTimeModule } from '../../shared/date-time/unity-date-time.module';
import { IndicatorModule } from '../../shared/indicator/indicator.module';
import { LotviewerPanelComponent } from './components/lotviewer-panel/lotviewer-panel.component';
import { LotviewerComponent } from './containers/lotviewer/lotviewer.component';
import { LotviewerDialogComponent } from './components/lotviewer-dialog/lotviewer-dialog.component';
import { ActionableDashboardRoutingModule } from './actionable-dashboard-routing.module';
import { AccountUserSelectorComponent } from './containers/account-user-selector/account-user-selector.component';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';
import { QcReviewResultComponent } from './containers/qc-review-result/qc-review-result.component';
import { QcReviewResultPanelComponent } from './components/qc-review-result-panel/qc-review-result-panel.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    ActionableDashboardComponent,
    ExpiringLotsComponent,
    ExpiringLotsPanelComponent,
    ExpiringLotsListComponent,
    ExpiringLicenseComponent,
    ExpiringLicensePanelComponent,
    GreetingComponent,
    ProductLotRenewalDetailsComponent,
    ProductLotRenewalComponent,
    LotviewerPanelComponent,
    LotviewerComponent,
    LotviewerDialogComponent,
    AccountUserSelectorComponent,
    QcReviewResultComponent,
    QcReviewResultPanelComponent
  ],
  imports: [
    SharedModule,
    PerfectScrollbarModule,
    ActionableDashboardRoutingModule,
    UnityDateTimeModule,
    BrSelect,
    IndicatorModule,
    SharedTranslateModule
  ],
  entryComponents: [
    ProductLotRenewalComponent,
    LotviewerDialogComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    AuthenticationService
  ],
  exports: [
    ActionableDashboardComponent,
    LotviewerPanelComponent,
    LotviewerComponent
  ]
})
export class ActionableDashboardModule { }
