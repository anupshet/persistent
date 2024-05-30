import { createAction, props, union } from '@ngrx/store';

import { Account } from '../../../contracts/models/account-management/account';

export const setAccount = createAction(
  '[Account] Set account summary ',
  props<{ account: Account }>()
);

export const setAccountSuccess = createAction(
  '[Account] Set account summary success',
  props<{ account: Account }>()
);

export const setAccountFailure = createAction(
  '[Account] Set account summary failure',
  props<{ error: Error }>()
);

export const getAccount = createAction(
  '[Account] Get account summary ',
  props<{ accountId: string }>()
);

export const getAccountSuccess = createAction(
  '[Account] Get account summary success',
  props<{ account: Account }>()
);

export const getAccountFailure = createAction(
  '[Account] Get account summary failure',
  props<{ error: Error }>()
);

const accountActions = union({
  setAccount,
  setAccountSuccess,
  setAccountFailure,
  getAccount,
  getAccountSuccess,
  getAccountFailure
});

export type AccountActionsUnion = typeof accountActions;
