// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountManagementComponent } from './account-management.component';

const routes: Routes =
[
  { path: '',
  component: AccountManagementComponent,
  children: [
    {
      path: '',
      component: AccountManagementComponent
    },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountManagementRoutingModule { }
