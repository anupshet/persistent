// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { BrInfoTooltip } from 'br-component-library';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule as CommonSharedModule } from '../shared.module';
import { ParsingEngineService } from '../services/parsing-engine.service';
import { NavSideBarLinkComponent } from './components/nav-side-bar/nav-side-bar-link/nav-side-bar-link.component';
import { NavSideBarComponent } from './components/nav-side-bar/nav-side-bar.component';
import { NavBarLabComponent } from './nav-bar/nav-bar-lab/nav-bar-lab.component';
import { NavBarSettingComponent } from './nav-bar/nav-bar-setting/nav-bar-setting.component';
import { NavBarUserComponent } from './nav-bar/nav-bar-user/nav-bar-user.component';
import { NavBarTopComponent } from './nav-bar/nav-bar.component';
import { NavCurrentLocationComponent } from './nav-header/nav-current-location/nav-current-location.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { NavHierarchyComponent } from './nav-header/nav-hierarchy/nav-hierarchy.component';
import { NavSideBarService } from './services/nav-side-bar.service';
import { NotificationComponent } from './nav-bar/notification/notification.component';
import { NotificationListComponent } from './nav-bar/notification/notification-list/notification-list.component';
import { NotificationApiService } from './services/notificationApi.service';
import { PanelsApiService } from '../../master/panels/services/panelsApi.service';
import { ReportNotificationsComponent } from './nav-header/report-notifications/report-notifications.component';
import { DynamicReportingService } from '../services/reporting.service';

@NgModule({
  declarations: [
    NavBarTopComponent,
    NavBarUserComponent,
    NavBarLabComponent,
    NavBarSettingComponent,
    NavHeaderComponent,
    NavHierarchyComponent,
    NavCurrentLocationComponent,
    NavSideBarComponent,
    NavSideBarLinkComponent,
    NotificationComponent,
    NotificationListComponent,
    ReportNotificationsComponent
  ],
  exports: [
    NavBarTopComponent,
    NavBarUserComponent,
    NavBarLabComponent,
    NotificationComponent,
    NavBarSettingComponent,
    NavSideBarComponent,
    NavSideBarLinkComponent,
    NavHeaderComponent
  ],
  imports: [
    PerfectScrollbarModule,
    CommonSharedModule,
    BrInfoTooltip,
    RouterModule,
    BrowserAnimationsModule,
    TranslateModule
  ],
  providers: [
    ParsingEngineService,
    NavSideBarService,
    NotificationApiService,
    PanelsApiService,
    DynamicReportingService,
    TranslateService
  ]
})
export class NavigationModule { }
