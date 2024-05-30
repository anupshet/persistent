import { createReducer, on } from '@ngrx/store';

import { AccountActions } from '../actions';
import { Account } from '../../../contracts/models/account-management/account';

export interface AccountState {
  currentAccountSummary: Account;
  error: Error;
}

export const accountInitialState: AccountState = {
  currentAccountSummary: null,
  error: null
};

export const reducer = createReducer(
  accountInitialState,
  on(AccountActions.setAccount, (state, { account }) => ({
    ...state,
    currentAccountSummary: account
  })),

  on(AccountActions.setAccountSuccess, (state, { account }) => ({
    ...state,
    error: null,
    currentAccountSummary: account
  })),

  on(AccountActions.setAccountFailure, (state, { error }) => ({
    ...state,
    error: error
  })),

  on(AccountActions.getAccount, (state) => ({
    ...state,
    error: null
  })),

  on(AccountActions.getAccountSuccess, (state, { account }) => ({
    ...state,
    error: null,
    currentAccountSummary: account
  })),

  on(AccountActions.getAccountFailure, (state, { error }) => ({
    ...state,
    error: error
  })),
);
