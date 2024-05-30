// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createReducer, on } from '@ngrx/store';

import { notificationActions } from '../actions';
import { UserNotification } from '../../models/notification.model';

export interface NotificationInitialState {
  notificationList: Array<UserNotification>;
  error: Error;
}

const initialState: NotificationInitialState = {
  notificationList: null,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(notificationActions.getNotificationList, state => ({
    ...state,
    error: null
  })),

  on(notificationActions.getNotificationListSuccess, (state, { notifications }) => ({
    ...state,
    error: null,
    notificationList: notifications
  })),

  on(notificationActions.getNotificationListFailure, (state, { error }) => ({
    ...state,
    error: error,
    notificationList: null
  })),

  on(notificationActions.dismissNotification, state => ({
    ...state,
    error: null
  })),

  on(notificationActions.dismissNotificationSuccess, (state, { notificationUuid }) => {
    const notificationList = [...state.notificationList];
    const index = notificationList.findIndex(element => element.notificationUuid === notificationUuid);
    notificationList.splice(index, 1);
    return {
      ...state,
      error: null,
      notificationList: notificationList
    };
  }),

  on(notificationActions.dismissNotificationFailure, (state, { error }) => ({
    ...state,
    error: error
  })),

  on(notificationActions.dismissAllNotification, state => ({
    ...state,
    error: null
  })),

  on(notificationActions.dismissAllNotificationSuccess, (state) => {
    return {
      ...state,
      error: null,
      notificationList: []
    };
  }),

  on(notificationActions.dismissAllNotificationFailure, (state, { error }) => ({
    ...state,
    error: error
  }))
);
