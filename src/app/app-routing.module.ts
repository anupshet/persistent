// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaCallbackComponent } from '@okta/okta-angular';

import { environment } from '../environments/environment.prod';
import { unRouting } from './core/config/constants/un-routing-methods.const';
import { PermissionGuard } from './security/guards';
import {
  AccountManagementAccessPermissions, BioradUserManagementAccessPermissions, DataManagementAccessPermissions,
  DataReviewPermissions, LabAccessPermissions, PanelsAccessPermissions, UserManagementAccessPermissions, NonBRLotManagementPermissions
} from './security/model/permissions.model';
import { ChangeTrackerService } from './shared/guards/change-tracker/change-tracker.service';
import { DataReviewGuard } from './security/guards/data-review-guard.service';

const appRoutes: Routes = [
  {
    path: unRouting.connectivity.connectivity,
    loadChildren: () => import('./master/connectivity/connectivity.module').then(m => m.ConnectivityModule),
  },
  {
    path: unRouting.reports,
    loadChildren: () => import('./master/reporting/reporting.module').then(m => m.ReportingModule),
  },
  {
    path: unRouting.dataManagement.data,
    loadChildren: () => import('./master/data-management/data-management.module').then(m => m.DataManagementModule),
    canLoad: [PermissionGuard],
    data: { permissions: DataManagementAccessPermissions },
    canDeactivate: [ChangeTrackerService]
  },
  {
    path: unRouting.dataManagement.reportPdf,
    loadChildren: () => import('./master/data-management/data-management.module').then(m => m.DataManagementModule),
    canLoad: [PermissionGuard],
    data: { permissions: 'DatamanagementAccess' },
    canDeactivate: [ChangeTrackerService]
  },
  {
    path: unRouting.dataReview.review,
    canLoad: [DataReviewGuard],
    data: { permissions: DataReviewPermissions },
    loadChildren: () => import('./master/data-review/data-review.module').then(m => m.DataReviewModule),
    canDeactivate: [ChangeTrackerService]
  },
  {
    path: unRouting.userManagement,
    loadChildren: () => import('./master/user-management/user-management.module').then(m => m.UserManagementModule),
    canLoad: [PermissionGuard],
    data: { permissions: UserManagementAccessPermissions }
  },
  {
    path: unRouting.accountManagement,
    loadChildren: () => import('./master/account-management/account-management.module').then(m => m.AccountManagementModule),
    canLoad: [PermissionGuard],
    data: { permissions: AccountManagementAccessPermissions }
  },
  {
    path: unRouting.bioradUserManagement,
    loadChildren: () => import('./master/biorad-user-management/biorad-user-management.module').then(m => m.BioRadUserManagementModule),
    canLoad: [PermissionGuard],
    data: { permissions: BioradUserManagementAccessPermissions }
  },
  {
    path: unRouting.actionableDashboard,
    loadChildren: () => import('./master/actionable-dashboard/actionable-dashboard.module').then(m => m.ActionableDashboardModule)
  },
  {
    path: unRouting.labSetup.lab,
    loadChildren: () => import('./master/lab-setup/lab-setup.module').then(m => m.LabSetupModule),
    canLoad: [PermissionGuard],
    data: { permissions: LabAccessPermissions },
    canDeactivate: [ChangeTrackerService]
  },
  {
    path: unRouting.panels.panel,
    loadChildren: () => import('./master/panels/panels.module').then(m => m.PanelsModule),
    canLoad: [PermissionGuard],
    data: { permissions: PanelsAccessPermissions },
    canDeactivate: [ChangeTrackerService]
  },
  {
    path: unRouting.manageCustomControls.define,
    loadChildren: () => import('./master/control-management/custom-control-management.module').then(m => m.CustomControlManagementModule),
    canLoad: [PermissionGuard],
    data: { permissions: NonBRLotManagementPermissions },
    canDeactivate: [ChangeTrackerService]
  },
  {
    path: unRouting.callback,
    component: OktaCallbackComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,
    { enableTracing: !environment.production, onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' }
    //  { enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
