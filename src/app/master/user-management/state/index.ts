import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromUserMangementState from './reducers/user-management.reducer';


export interface UsersState {
  usermanagement: fromUserMangementState.UsersState;
}

export const reducers: ActionReducerMap<UsersState> = {
  usermanagement: fromUserMangementState.reducer
};

export function logger(
  reducer: ActionReducer<UsersState>
): ActionReducer<UsersState> {
  return (state, action) => {
    const result = reducer(state, action);
    return result;
  };
}

export const metaReducers: MetaReducer<
UsersState
>[] = !environment.production ? [logger] : [];
