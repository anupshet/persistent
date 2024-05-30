/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { AuthenticationGuard } from '../../security/guards';
import { DataManagementComponent } from './data-management.component';
import { AnalyteDataEntryComponent } from './analyte-data-entry/analyte-data-entry.component';
import { ChangeTrackerService } from '../../shared/guards/change-tracker/change-tracker.service';

const routes: Routes = [
  {
    path: '',
    component: DataManagementComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        redirectTo: 'table',
        pathMatch: 'full'
      },
      {
        path: unRouting.dataManagement.table,
        component: AnalyteDataEntryComponent,
        canDeactivate: [ChangeTrackerService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule {}
