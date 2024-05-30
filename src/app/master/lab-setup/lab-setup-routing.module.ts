import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { AuthenticationGuard } from '../../security/guards';
import { AnalyteManagementComponent } from './containers/analyte-management/analyte-management.component';
import { ControlManagementComponent } from './containers/control-management/control-management.component';
import { DepartmentManagementComponent } from './containers/department-management/department-management.component';
import { InstrumentManagementComponent } from './containers/instrument-management/instrument-management.component';
import { LabSetupDefaultContainerComponent } from './containers/lab-setup-default-container/lab-setup-default-container.component';
import { LabSetupFeedbackContainerComponent } from './containers/lab-setup-feedback-container/lab-setup-feedback-container.component';
import { LabSetupComponent } from './lab-setup.component';

const routes: Routes =
  [
    {
      path: '',
      component: LabSetupComponent,
      canActivate: [AuthenticationGuard],
      children: [
        {
          path: unRouting.labSetup.labConfigDepartment.settings,
          component: DepartmentManagementComponent,
          runGuardsAndResolvers: 'paramsOrQueryParamsChange'
        },
        {
          path: unRouting.labSetup.labDefault,
          component: LabSetupDefaultContainerComponent,
          runGuardsAndResolvers: 'paramsOrQueryParamsChange'
        },
        {
          path: unRouting.labSetup.labConfigInstrument.settings,
          component: InstrumentManagementComponent,
          runGuardsAndResolvers: 'paramsOrQueryParamsChange'
        },
        {
          path: unRouting.labSetup.labConfigControl.settings,
          component: ControlManagementComponent,
          runGuardsAndResolvers: 'paramsOrQueryParamsChange'
        },
        {
          path: unRouting.labSetup.labConfigAnalyte.settings,
          component: AnalyteManagementComponent,
          runGuardsAndResolvers: 'paramsOrQueryParamsChange'
        },
        {
          path: unRouting.labSetup.labConfigSetUpFeedback.add,
          component: LabSetupFeedbackContainerComponent
        }
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabSetupRoutingModule { }
