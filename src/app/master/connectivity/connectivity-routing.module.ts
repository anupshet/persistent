// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { ConnectivityDialogComponent } from './connectivity-dialog.component';
import { AuthenticationGuard } from '../../security/guards';

const routes: Routes = [
  {
    path: `${unRouting.connectivity.labs}`,
    canActivate: [AuthenticationGuard],
    component: ConnectivityDialogComponent,
    children: [
      {
        path: unRouting.connectivity.configurations,
      },
      {
        path: unRouting.connectivity.upload,
      },
      {
        path: unRouting.connectivity.status,
      },
      {
        path: unRouting.connectivity.mapping,
        children: [
          {
            path: '',
            redirectTo: `map/instrument`,
          },
          {
            path: unRouting.connectivity.map.instrument,
            children: []
          },
          {
            path: unRouting.connectivity.map.product,
            children: []
          },
          {
            path: unRouting.connectivity.map.test,
            children: []
          },
          {
            path: unRouting.connectivity.map.childProduct,
            children: []
          },
          {
            path: unRouting.connectivity.map.childTest,
            children: []
          }
        ]
      },
      {
        path: unRouting.connectivity.instructions,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectivityRoutingModule { }
