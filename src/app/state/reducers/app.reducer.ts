import { ActionReducer, INIT } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { State } from '../app.state';
import { UserActions } from '../actions';

export function clearState(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: Action): State => {
    if (action.type === UserActions.ResetApp.type) {
      return reducer( undefined, {type: INIT});
    }
    return reducer(state, action);
  };
}
