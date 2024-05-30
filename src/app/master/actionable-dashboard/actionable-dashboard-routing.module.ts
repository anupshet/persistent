// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from '../../security/guards';
import { ActionableDashboardComponent } from './actionable-dashboard.component';

const routes: Routes =
  [
    {
      path: '',
      component: ActionableDashboardComponent,
      canActivate: [AuthenticationGuard]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ActionableDashboardRoutingModule { }
