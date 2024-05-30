import { createReducer, on } from '@ngrx/store';

import { UserManagementActions } from '../actions';
import { User } from '../../../../contracts/models/user-management/user.model';

export interface UsersState {
  currentUsers: Array<User>;
}

export const initialState: UsersState = {
  currentUsers: null
};

export const reducer = createReducer(
  initialState,
  on(UserManagementActions.GetUsers, (state, { payload }) => ({
    ...state,
    currentUsers: payload
  })),

  on(UserManagementActions.AddUsers, (state, { payload }) => {
    let addUsers = state.currentUsers;
      addUsers = [payload, ...addUsers];
      return { ...state, currentUsers: addUsers };
  }),

  on(UserManagementActions.UpdateUsers, (state, { payload }) => {
    let updateUsers = state.currentUsers;
      const user = payload;
      const userToUpdate = updateUsers.find(u => u.id === user.id);
      const userIndex = updateUsers.indexOf(userToUpdate);
      updateUsers = updateUsers
        .slice(0, userIndex)
        .concat([payload])
        .concat(updateUsers.slice(userIndex + 1));
      return { ...state, currentUsers: updateUsers };
  }),

  on(UserManagementActions.DeleteUsers, (state, { payload }) => {
    let deleteUsers = state.currentUsers;
      const userInPayload = payload;
      const userToDelete = deleteUsers.find(u => u.id === userInPayload.id);
      const userInd = deleteUsers.indexOf(userToDelete);
      deleteUsers = deleteUsers
      .slice(0, userInd)
      .concat(deleteUsers.slice(userInd + 1));
      return { ...state, currentUsers: deleteUsers };
  }),

  on(UserManagementActions.ClearUsersState, () => ({
    ...initialState
  }))
);
