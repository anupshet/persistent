// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IRouterStateUrl } from '../../../../contracts/interfaces/i-router-state-url';
import * as fromNavigation from '../reducers/navigation.reducer';
import * as fromNotification from '../reducers/notification.reducer';

// -------------------------Identifier  for different navigation states ----------------------------
export const NavigationStateIdentifier = 'navigation';
export const RouterStateIdentifier = 'router';
export const notificationStateIdentifier = 'notification';

// -------------------------Feature selectors for getting different navigation states ----------------------------
export const getNavigationState = createFeatureSelector<fromNavigation.NavigationState>(NavigationStateIdentifier);
export const getStateRouterState = createFeatureSelector<RouterReducerState<IRouterStateUrl>>(RouterStateIdentifier);
export const getNotificationFeatureState = createFeatureSelector<fromNotification.NotificationInitialState>(notificationStateIdentifier);

// -------------------------------Selectors for getting different properties form states ----------------------------
export const getNavigationStateError = createSelector(getNavigationState, (state) => state.error);
export const getCurrentlySelectedNode = createSelector(getNavigationState, (state) => state ? state.selectedNode : null);
export const getCurrentlySelectedLeaf = createSelector(getNavigationState, (state) => state ? state.selectedLeaf : null);
export const getSelectedLeftNavItem = createSelector(getNavigationState, (state) => state ? state.selectedLeftNavItem : null);
export const getShowSettingsCurrentVal = createSelector(getNavigationState, (state) => state ? state.showSettings : false);
export const getInstrumentsGroupedByDeptVal = createSelector(getNavigationState, (state) => state ? state.instrumentsGroupedByDept : true);
export const getSideNavState = createSelector(getNavigationState, (state) => state ? state.isSideNavExpanded : false);
export const getCurrentBranchState = createSelector(getNavigationState, (state) => state ? state.currentBranch : []);
export const navigateToContent = createSelector(getNavigationState, (state) => state.selectedLink);
export const getConnectivityState = createSelector(getNavigationState, (state) => state ? state.hasConnectivityLicense : false);
export const getNavigationRouterState = createSelector(getStateRouterState, (router) => router ? router.state : null);
export const getCurrentSelectedNode = createSelector(getNavigationState,
  (state) => state ? (state.selectedLeaf ? state.selectedLeaf : state.selectedNode) : null);
export const getConnectivityFullTree = createSelector(getNavigationState,
  (state) => state ? state.connectivityFullTree : null);
export const getCustomSortModeState =
  createSelector(getNavigationState, (state) => state && state.isCustomSortMode ? state.isCustomSortMode : false);
export const getNotificationId =
  createSelector(getNavigationState, (state) => state && state.selectedNotificationId ? state.selectedNotificationId : null);
export const getReportNotificationId =
  createSelector(getNavigationState, (state) => state && state.selectedReportNotificationId ? state.selectedReportNotificationId : null);
export const getLocale = createSelector(getNavigationState, (state) => state && state.locale ? state.locale : {country: 'US', lcid: 'en-US', value: 'en', name: 'English'});

export const getNotificationList = createSelector(
  getNotificationFeatureState,
  state => {
    if (state) {
      return state.notificationList;
    }
  }
);
export const getIsArchiveItemsToggleOn = createSelector(
  getNavigationState,
  state => {
    if (state) {
      return state.isArchiveItemsToggleOn;
    }
  });

export const getIsAccountUserSelectorOn = createSelector(
  getNavigationState,
  state => {
    if (state) {
      return state.isAccountUserSelectorOn;
    }
  });

export const selectPreviousUrl = createSelector(
  getNavigationState,
  state => {
    if (state) {
      return state.previousUrl;
    }
  }
);
export const getHasNonBrLicenseCurrentVal = createSelector(getNavigationState, (state) => state ? state.hasNonBrLicense : false);

