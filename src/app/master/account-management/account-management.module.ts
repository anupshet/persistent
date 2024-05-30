// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from '../../shared/shared.module';
import { UserManagementApiService } from '../../shared/api/userManagementApi.service';
import { UserManagementService } from '../../shared/services/user-management.service';
import { AccountManagementRoutingModule } from './account-management-routing.module';
import { AccountManagementComponent } from './account-management.component';
import { reducer } from './state/account-management.reducer';
import { accountManagementStateIdentifier } from './state';
import { AccountFormComponent } from './account-form/account-form.component';
import { OrchestratorApiService } from '../../shared/api/orchestratorApi.service';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountManagementApiService } from './account-management-api.service';
import { LocationListComponent } from './location-list/location-list.component';
import { AccountsListComponent } from './accounts-list/accounts-list.component';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';
import { LocationUtilitiesService } from '../../shared/services/location-utilities.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    NgxPaginationModule,
    PerfectScrollbarModule,
    SharedModule,
    AccountManagementRoutingModule,
    SharedTranslateModule,
    StoreModule.forFeature(accountManagementStateIdentifier, reducer)
  ],
  declarations: [
    AccountManagementComponent,
    AccountFormComponent,
    AccountDetailsComponent,
    LocationListComponent,
    AccountsListComponent
  ],
  providers: [
    AccountManagementApiService,
    UserManagementService,
    UserManagementApiService,
    OrchestratorApiService,
    LocationUtilitiesService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }],
  entryComponents: [AccountFormComponent],
})
export class AccountManagementModule { }
