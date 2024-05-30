import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelsComponent } from './panels.component';
import { AuthenticationGuard } from '../../security/guards';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { PanelComponent } from './containers/panel/panel.component';
import { PanelViewComponent } from './containers/panel-view/panel-view.component';
import { ChangeTrackerService } from '../../shared/guards/change-tracker/change-tracker.service';

const routes: Routes = [
  {
    path: '',
    component: PanelsComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: unRouting.panels.actions.add,
        component: PanelComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: unRouting.panels.actions.edit,
        component: PanelComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: unRouting.panels.actions.view,
        component: PanelViewComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        canDeactivate: [ChangeTrackerService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelsRoutingModule { }
