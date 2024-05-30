import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from '../../security/guards';
import { UserManagementDialogComponent } from './user-management-dialog.component';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementDialogComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: ':id',
        component: UserManagementComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
