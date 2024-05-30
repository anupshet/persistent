// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefineCustomControls } from './define-custom-controls/define-custom-controls.component';
import { CustomControlManagementComponent } from './custom-control-management.component';
import { AuthenticationGuard } from '../../security/guards';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';

const routes: Routes =
[
  {
    path: '',
    component: CustomControlManagementComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: unRouting.manageCustomControls.define,
        component: DefineCustomControls,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomControlRoutingModule { }
