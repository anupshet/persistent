import { createReducer, on } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { Department } from '../../../../contracts/models/lab-setup/index';
import { LabConfigDepartmentActions } from '../actions';

export interface LabConfigDepartmentState {
  labDepartments: Department[];
  error: Error;
  deleteDepartment: boolean;
}

export const labConfigDepartmentInitialState: LabConfigDepartmentState = {
  labDepartments: null,
  error: null,
  deleteDepartment: false
};

export const reducer = createReducer(
  labConfigDepartmentInitialState,
  on(LabConfigDepartmentActions.saveDepartmentsSuccess, (state, { labDepartments }) => ({
    ...state,
    error: null,
    labDepartments: labDepartments,
  })),

  on(LabConfigDepartmentActions.saveDepartmentsFailure, (state, { error }) => ({
    ...state,
    error: error,
    labDepartments: null,
  })),

  on(LabConfigDepartmentActions.deleteDepartmentSuccess, (state) => ({
    ...state,
    error: null,
    deleteDepartment: true,
  })),

  on(LabConfigDepartmentActions.deleteDepartmentFailure, (state, { error }) => ({
    ...state,
    error: error,
    deleteDepartment: false,
  })),
);
