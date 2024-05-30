// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as fromRouter from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromDefineCustomControls from './reducers/define-custom-controls.reducer';

export interface CustomControlManagementStates {
  defineCustomControl: fromDefineCustomControls.DefineCustomControlsState;
  router: fromRouter.RouterReducerState;
}

export const reducers: ActionReducerMap<CustomControlManagementStates> = {
  defineCustomControl: fromDefineCustomControls.reducer,
  router: fromRouter.routerReducer,
};

export function logger(
  reducer: ActionReducer<CustomControlManagementStates>
): ActionReducer<CustomControlManagementStates> {
  return (state, action) => {
    const result = reducer(state, action);
    return result;
  };
}

export const DefineCustomControlsStateIdentifier = 'defineCustomControls';

export const metaReducers: MetaReducer<
CustomControlManagementStates
>[] = !environment.production ? [logger] : [];
