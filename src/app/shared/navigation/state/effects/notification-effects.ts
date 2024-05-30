// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { notificationActions } from '../actions';
import { NotificationApiService } from '../../services/notificationApi.service';
import { UserNotification } from '../../models/notification.model';
import { AudienceType } from '../../../../core/notification/interfaces/audience-type';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus } from '../../../../shared/models/audit-tracking.model';

@Injectable()
export class NotificationEffects {
  constructor(
    private actions$: Actions<notificationActions.notificationActionsUnion>,
    private notificationApiService: NotificationApiService,
    private appLogger: AppLoggerService,
    private appNavigationService: AppNavigationTrackingService,
  ) { }

  getNotificationList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.getNotificationList),
      map(action => action.locationId),
      exhaustMap((locationId: string) =>
        this.notificationApiService.getNotificationList(locationId, true).pipe(
          map((notifications: Array<UserNotification>) =>
            notificationActions.getNotificationListSuccess({ notifications })
          ),
          catchError(error =>
            of(notificationActions.getNotificationListFailure({ error }))
          )
        )
      )
    )
  );

  getNotificationListSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.getNotificationListSuccess),
    ),
    { dispatch: false }
  );

  getNotificationListFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.getNotificationListFailure),
      tap((x) => {
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  dismissNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.dismissNotification),
      map(action => action.notificationUuid),
      exhaustMap((notificationUuid: string) =>
        this.notificationApiService.dismissNotification(AudienceType.Lab, notificationUuid).pipe(
          map(() =>
            notificationActions.dismissNotificationSuccess({ notificationUuid })
          ),
          catchError(error =>
            of(notificationActions.dismissNotificationFailure({ error }))
          )
        )
      )
    )
  );

  dismissNotificationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.dismissNotificationSuccess),
      tap(() => {
        this.notificationApiService.action = AuditTrackingAction.Clear;
        this.appNavigationService.logAuditTracking(this.notificationApiService.notificationData(), true);
        })
    ),
    { dispatch: false }
  );

  dismissNotificationFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.dismissNotificationFailure),
      tap((x) => {
        this.notificationApiService.action = AuditTrackingAction.Clear;
        this.notificationApiService.actionStatus = AuditTrackingActionStatus.Failure;
        this.appNavigationService.logAuditTracking(this.notificationApiService.notificationData(), true);
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );

  dismissAllNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.dismissAllNotification),
      map(action => action.locationId),
      exhaustMap((locationId: string) =>
        this.notificationApiService.dismissAllNotification(locationId).pipe(
          map(() =>
            notificationActions.dismissAllNotificationSuccess({ locationId })
          ),
          catchError(error =>
            of(notificationActions.dismissAllNotificationFailure({ error }))
          )
        )
      )
    )
  );

  dismissAllNotificationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.dismissAllNotificationSuccess),
      tap(() => {
        this.notificationApiService.action = AuditTrackingAction.ClearAll,
        this.appNavigationService.logAuditTracking(this.notificationApiService.notificationData(), true);
        })
    ),
    { dispatch: false }
  );

  dismissAllNotificationFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.dismissAllNotificationFailure),
      tap((x) => {
        this.notificationApiService.action = AuditTrackingAction.ClearAll;
        this.notificationApiService.actionStatus = AuditTrackingActionStatus.Failure;
        this.appNavigationService.logAuditTracking(this.notificationApiService.notificationData(), true);
        this.appLogger.error(x);
      })
    ),
    { dispatch: false }
  );
}
