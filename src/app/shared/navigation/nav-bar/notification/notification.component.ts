// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import * as fromRoot from '../../../../state/app.state';
import * as navigationStateSelector from '../../state/selectors';
import { NotificationFeatureEnum, UserNotification } from '../../models/notification.model';
import { NotificationService } from '../../../../core/notification/services/notification.service';
import * as notificationAction from '../../state/actions/notification-action';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import * as sharedStateSelector from '../../../state/selectors';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import { UnityNextTier } from '../../../../contracts/enums/lab-location.enum';
import { NotificationApiService } from '../../services/notificationApi.service';
import { reports } from '../../../../core/config/constants/general.const';

@Component({
  selector: 'unext-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  public notifications: Array<UserNotification>;
  expandNotificationList = false;
  public timeZone: string;
  public labLocation: LabLocation;
  readonly featureType = NotificationFeatureEnum;


  protected destroy$ = new Subject<boolean>();

  constructor(
    protected store: Store<fromRoot.State>,
    private notificationService: NotificationService,
    private errorLoggerService: ErrorLoggerService,
    private notificationApiService: NotificationApiService,
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(
        filter(labLocation => !!labLocation && !!labLocation.id),
        takeUntil(this.destroy$)
      ).subscribe(labLocation => {
        this.labLocation = labLocation;
        this.timeZone = labLocation.locationTimeZone;
        this.update(this.labLocation.id);
      });

    this.store.pipe(select(navigationStateSelector.getNotificationList))
      .pipe(filter(notificationList => !!notificationList), takeUntil(this.destroy$)).subscribe(notificationList => {
        // filter report notifications
        this.notifications = notificationList.filter(singleNotification => singleNotification.featureId !== this.featureType.Reports);
        if (notificationList.length >= 1) {
          this.expandNotificationList = true;
          this.notificationApiService.ids = this.notifications;
        }
      });

    this.notificationService.$labStream.pipe(filter(result => !!result), takeUntil(this.destroy$))
      .subscribe(result => {
        if (!!this.labLocation.id && result.notificationType !== reports) { // do not reload notification for report type
          this.update(this.labLocation.id);
        }
      });
  }

  removeNotification(notificationUuid: string) {
    try {
      this.store.dispatch(notificationAction.dismissNotification({ notificationUuid }));
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.NotificationComponent + blankSpace + Operations.dismissNotification)));
    }
  }

  removeAllNotifications() {
    try {
      this.store.dispatch(notificationAction.dismissAllNotification({ locationId: this.labLocation.id }));
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.NotificationComponent + blankSpace + Operations.dismissAllNotification)));
    }
  }

  update(locationId: string): void {
    try {
      const unityNextTier = this.labLocation.unityNextTier;
      if (locationId && (unityNextTier === UnityNextTier.PeerQc || unityNextTier === UnityNextTier.DailyQc)) {
        this.store.dispatch(notificationAction.getNotificationList({ locationId: locationId }));
      }
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.NotificationComponent + blankSpace + Operations.updateNotification)));
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
