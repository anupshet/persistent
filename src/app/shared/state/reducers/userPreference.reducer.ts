import { createReducer, on } from '@ngrx/store';

import { UserPreference } from '../../../contracts/models/portal-api/portal-data.model';
import { UserPreferenceActions } from '../actions';

export interface UserPreferenceState {
  userPreference: UserPreference;
  isLoading: boolean;
}

const initialState: UserPreferenceState = {
  userPreference: null,
  isLoading: true
};

export const reducer = createReducer(
  initialState,
    on(UserPreferenceActions.GetUserPreference, (state, { payload }) => ({
        ...state,
        userPreference: payload
      })),

    on(UserPreferenceActions.UpdateUserPreference, (state, { payload }) => ({
        ...state,
        userPreference: payload
      })),

    on(UserPreferenceActions.UpdateIsLoading, (state, { payload }) => ({
        ...state,
        isLoading: payload
      }))
    );
