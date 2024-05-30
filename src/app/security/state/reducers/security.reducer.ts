// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createReducer, on } from '@ngrx/store';

import { SecurityActions } from '../actions';
import { LabTree } from '../../../contracts/models/lab-setup/lab-tree.model';
import { AppUser } from '../../model';

export interface SecurityState {
  isLoggedIn: boolean;
  currentUser: AppUser;
  directory: LabTree;
}

const intialState: SecurityState = {
  isLoggedIn: false,
  currentUser: null,
  directory: null
};

export const reducer = createReducer(
  intialState,
    on(SecurityActions.UpdateLabDirectory, (state, { payload }) => ({
      ...state,
      isLoggedIn: true,
      directory: payload
    })),

    on(SecurityActions.UserAuthenticationUpdate, (state, { payload }) => ({
      ...state,
      currentUser: payload ? payload.currentUser : null,
      isLoggedIn: payload ? true : false,
      directory: payload ? state.directory : null
    })),

    on(SecurityActions.UserLoggedOut, state => ({
      ...state,
      currentUser: null,
      directory: null,
      isLoggedIn: false
    })),

    on(SecurityActions.UserTokenRefreshed, (state, { payload }) => ({
      ...state,
      currentUser: payload,
      isLoggedIn: true
    }))
  );
