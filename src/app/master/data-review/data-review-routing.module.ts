// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { AuthenticationGuard } from '../../security/guards';
import { DataReviewComponent } from './data-review/data-review.component';
import { ChangeTrackerService } from '../../shared/guards/change-tracker/change-tracker.service';

const routes: Routes = [
  {
    path: unRouting.dataReview.dataReview,
    pathMatch: 'full',
    component: DataReviewComponent,
    canActivate: [AuthenticationGuard],
    canDeactivate: [ChangeTrackerService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataReviewRoutingModule {}
