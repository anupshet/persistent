// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { IRouterStateUrl } from '../contracts/interfaces/i-router-state-url';
import * as fromSecurity from '../security/state/reducers/security.reducer';
import * as fromAuth from '../shared/state/reducers/auth.reducer';
import * as fromUserPreference from '../shared/state/reducers/userPreference.reducer';
import * as fromNavigation from '../shared/navigation/state/reducers/navigation.reducer';
import * as fromLabLocation from '../shared/state/reducers/location.reducers';
import * as fromAccount from '../shared/state/reducers/account.reducers';
import * as fromUiConfig from '../shared/state/reducers/ui-config.reducer';
import { clearState } from './reducers/app.reducer';
import * as fromNotificationState from '../shared/navigation/state/reducers/notification.reducer';
import * as fromNodeInfo from '../shared/state/reducers/node-info.reducer';
import * as fromLabConfigDuplicateLots from '../shared/state/reducers/lab-config-duplicate-lots.reducer';

export interface State {
  security: fromSecurity.SecurityState;
  auth: fromAuth.AuthState;
  userPreference: fromUserPreference.UserPreferenceState;
  router: fromRouter.RouterReducerState<IRouterStateUrl>;
  navigation: fromNavigation.NavigationState;
  location: fromLabLocation.LocationState;
  account: fromAccount.AccountState;
  uiConfigState: fromUiConfig.UIConfigState;
  notification: fromNotificationState.NotificationInitialState;
  nodeInfoState: fromNodeInfo.NodeInfoState;
  labConfigDuplicateLots: fromLabConfigDuplicateLots.LabConfigDuplicateLotsState;
}

export const reducers: ActionReducerMap<State> = {
  security: fromSecurity.reducer,
  auth: fromAuth.reducer,
  userPreference: fromUserPreference.reducer,
  router: fromRouter.routerReducer,
  navigation: fromNavigation.reducer,
  location: fromLabLocation.reducer,
  account: fromAccount.reducer,
  uiConfigState: fromUiConfig.reducer,
  notification: fromNotificationState.reducer,
  nodeInfoState: fromNodeInfo.reducer,
  labConfigDuplicateLots: fromLabConfigDuplicateLots.reducer
};

export const metaReducers: MetaReducer<State>[] = [clearState];
