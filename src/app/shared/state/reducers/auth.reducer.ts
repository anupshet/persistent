import { createReducer, on } from '@ngrx/store';

import { AppUser } from '../../../security/model';
import { LabTree } from '../../../contracts/models/lab-setup/lab-tree.model';
import { AuthActions } from '../actions';

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: AppUser;
  directory: LabTree;
}

const initialState: AuthState = {
  isLoggedIn: false,
  currentUser: null,
  directory: null
};

export const reducer = createReducer(
  initialState,
    on(AuthActions.UpdateLabDirectory, (state, { payload }) => ({
      ...state,
      directory: payload
    })),

    on(AuthActions.RestoreUserFromToken, (state, { payload }) => ({
      ...state,
      currentUser: payload,
      isLoggedIn: true
    })),

    on(AuthActions.UserLoggedOut, state => ({
      ...state,
      ...initialState
    })),
);
