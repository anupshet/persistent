import { AccountManagementActions } from './account-management.actions';

export interface AccountManagementState {
  temp?: string;
}

const initialState: AccountManagementState = {

};

export function reducer(state = initialState, action: AccountManagementActions): AccountManagementState {
  switch (action.type) {

    default:
      return state;
  }
}
