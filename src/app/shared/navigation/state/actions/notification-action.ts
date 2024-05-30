// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createAction, union, props } from '@ngrx/store';

import { UserNotification } from '../../models/notification.model';

export const getNotificationList = createAction(
  '[Notification] Get notification list ',
  props<{ locationId: string }>()
);

export const getNotificationListSuccess = createAction(
  '[Notification] Get notification list success',
  props<{ notifications: Array<UserNotification> }>()
);

export const getNotificationListFailure = createAction(
  '[Notification] Get notification list failure',
  props<{ error: Error }>()
);

export const dismissNotification = createAction(
  '[Notification] Dismiss notification',
  props<{ notificationUuid: string }>()
);

export const dismissNotificationSuccess = createAction(
  '[Notification] Dismiss notification success',
  props<{ notificationUuid: string }>()
);

export const dismissNotificationFailure = createAction(
  '[Notification] Dismiss notification failure',
  props<{ error: Error }>()
);

export const dismissAllNotification = createAction(
  '[Notification] Dismiss all notification',
  props<{ locationId: string }>()
);

export const dismissAllNotificationSuccess = createAction(
  '[Notification] Dismiss all notification success',
  props<{ locationId: string }>()
);

export const dismissAllNotificationFailure = createAction(
  '[Notification] Dismiss all notification failure',
  props<{ error: Error }>()
);

const notificationActions = union({
  getNotificationList,
  getNotificationListSuccess,
  getNotificationListFailure,
  dismissNotification,
  dismissNotificationSuccess,
  dismissNotificationFailure,
  dismissAllNotification,
  dismissAllNotificationSuccess,
  dismissAllNotificationFailure,
});

export type notificationActionsUnion = typeof notificationActions;
