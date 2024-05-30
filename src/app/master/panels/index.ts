import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import * as fromPanel from './state/reducers/panels.reducer';

export interface PanelStates {
  panel: fromPanel.PanelInitialState;
}

export const reducers: ActionReducerMap<PanelStates> = {
  panel: fromPanel.reducer
};

// TODO: This need to be commented out later
// console.log all actions
export function logger(
  reducer: ActionReducer<PanelStates>
): ActionReducer<PanelStates> {
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
  PanelStates
>[] = !environment.production ? [logger] : [];
