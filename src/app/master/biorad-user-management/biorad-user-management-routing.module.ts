// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from '../../security/guards';
import { BioRadUserManagementDialogComponent } from './biorad-user-management-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: BioRadUserManagementDialogComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BioRadUserManagementRoutingModule { }
