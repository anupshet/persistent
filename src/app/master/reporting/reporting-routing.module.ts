// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { AuthenticationGuard } from '../../security/guards';
import { ReportingComponent, } from './reporting.component';
import { PastReportsComponent } from './past-reports/past-reports.component';
import { NewReportsComponent } from './new-reports/new-reports.component';
import { ConfirmNavigateGuard } from './shared/guard/confirm-navigate.guard';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    canActivate: [AuthenticationGuard],
    children: [
      { path: '', redirectTo: unRouting.reporting.newReports },
      {
        path: unRouting.reporting.newReports,
        component: NewReportsComponent,
        canDeactivate: [ConfirmNavigateGuard]
      },
      {
        path: unRouting.reporting.pastReports,
        component: PastReportsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
