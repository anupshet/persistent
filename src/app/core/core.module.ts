import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ApiService } from '../shared/api/api.service';
import { ChangeTrackerService } from '../shared/guards/change-tracker/change-tracker.service';
import { throwIfAlreadyLoaded } from './helpers/module-import-guard';
import { GaActivitiesService } from './google-analytics/ga-activities.service';
import { AppLoggerService } from '../shared/services/applogger/applogger.service';
import { NotificationModule } from './notification/notification.module';
import { ConfirmNavigateGuard } from '../master/reporting/shared/guard/confirm-navigate.guard';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule, NotificationModule
  ],
  exports: [
    CommonModule, FormsModule, RouterModule, NotificationModule
  ],
  declarations: [],
  providers: [
    GaActivitiesService,
    ApiService,
    AppLoggerService,
    ChangeTrackerService,
    ConfirmNavigateGuard
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
