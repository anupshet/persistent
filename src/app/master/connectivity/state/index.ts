import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromConnectivityState from './reducers/connectivity.reducer';


export interface ConnectivityStates {
  connectivity: fromConnectivityState.ConnectivityInitialState;
}

export const reducers: ActionReducerMap<ConnectivityStates> = {
  connectivity: fromConnectivityState.reducer
};

// TODO: This need to be commented out later
// console.log all actions
export function logger(
  reducer: ActionReducer<ConnectivityStates>
): ActionReducer<ConnectivityStates> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  };
}

export const metaReducers: MetaReducer<
ConnectivityStates
>[] = !environment.production ? [logger] : [];
