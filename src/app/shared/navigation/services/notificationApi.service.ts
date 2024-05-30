// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { select } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import * as ngrxStore from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from '../../../core/config/config.contract';
import { ConfigService } from '../../../core/config/config.service';
import { ApiService } from '../../api/api.service';
import { SpinnerService } from '../../services/spinner.service';
import * as fromRoot from '../../../state/app.state';
import { unApi } from '../../../core/config/constants/un-api-methods.const';
import { urlPlaceholders } from '../../../core/config/constants/un-url-placeholder.const';
import { UserNotification } from '../models/notification.model';
import { AudienceType } from '../../../core/notification/interfaces/audience-type';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus } from '../../models/audit-tracking.model';
import * as sharedStateSelector from '../../../shared/state/selectors';
import { ReportNotification } from '../models/report-notification.model';

@Injectable()
export class NotificationApiService extends ApiService {
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).notificationUrl;
    store.pipe(select(sharedStateSelector.getCurrentAccount));
  }

  public action = AuditTrackingAction.View;
  public eventType = AuditTrackingAction.Notification;
  public actionStatus = AuditTrackingActionStatus.Success;
  public ids: Array<UserNotification>;
  public getDismissId: string;
  public isDismissId = false;

  public notificationData(): AppNavigationTracking {
    const notificationIds = [];

    if (this.isDismissId) {
        notificationIds.push(this.getDismissId);
    } else {
      this.ids.map((value) => {
        notificationIds.push(value.notificationUuid);
      });
    }
    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: this.eventType,
        action: this.action,
        actionStatus: this.actionStatus,
        currentValue: {
          ids: notificationIds
        },
        priorValue: {},
      },
    };
    this.isDismissId = false;
    return auditNavigationPayload;
  }

  // added showBusy to supress busy indicator on async calls for fix 229996
  // future calls for sync ( when added) should pass true, async false
  getNotificationList(locationId: string, showBusy: boolean): Observable<Array<UserNotification>> {
    const url = `${unApi.notification.notification}/${locationId}`;
    return this.get<Array<UserNotification>>(url, null, false);
  }

  dismissNotification(audienceType: AudienceType, notificationUuid: string) {
    const data = { audienceId: audienceType };
    const url = unApi.notification.dismiss.replace(urlPlaceholders.notificationUuid, notificationUuid);
    return this.put(url, data, true);
  }

  dismissAllNotification(locationId: string) {
    const url = unApi.notification.dismissAll.replace(urlPlaceholders.locationId, locationId);
    return this.del(url, true);
  }
}
