import { createAction, props, union } from '@ngrx/store';

import { Department, LabDepartmentValues } from '../../../../contracts/models/lab-setup/department.model';
import { Error } from '../../../../contracts/models/shared/error.model';

export const saveDepartments = createAction(
  '[Lab Setup] Save Departments',
  props<{ labDepartments: LabDepartmentValues }>()
);

export const saveDepartmentsSuccess = createAction(
  '[Lab Setup] Save Departments Success',
  props<{ labDepartments: Department[]}>()
);

export const saveDepartmentsFailure = createAction(
  '[Lab Setup] Save Departments Failure',
  props<{ error: Error }>()
);

export const deleteDepartment = createAction(
  '[Lab Setup] Delete Department',
  props<{ department: Department }>()
);

export const deleteDepartmentSuccess = createAction(
  '[Lab Setup] Delete Department Success',
  props<{ department: Department}>()
);

export const deleteDepartmentFailure = createAction(
  '[Lab Setup] Delete Department Failure',
  props<{ error: Error }>()
);


const labConfigDepartmentActions = union({
  saveDepartments,
  saveDepartmentsSuccess,
  saveDepartmentsFailure,
  deleteDepartment,
  deleteDepartmentSuccess,
  deleteDepartmentFailure
});

export type LabConfigDepartmentActionsUnion = typeof labConfigDepartmentActions;
