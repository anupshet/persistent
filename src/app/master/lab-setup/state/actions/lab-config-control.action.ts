import { createAction, props, union } from '@ngrx/store';

import { LabProduct } from '../../../../contracts/models/lab-setup/product.model';
import { Error } from '../../../../contracts/models/shared/error.model';
import { ManufacturerProduct, ProductListRequest} from '../../../../contracts/models/lab-setup/product-list.model';
import { ControlConfig, NonBrControlConfig } from '../../../../contracts/models/lab-setup/settings.model';


// TODO: Note: Product & Control(a newly suggested name) have been used interchangeably. 'Control' is preferred.
export const saveControl = createAction(
  '[Lab Setup] Save Control',
  props<{ controlConfigEmitter: ControlConfig }>()
);

export const saveControlSuccess = createAction(
  '[Lab Setup] Save Control Success',
  props<{ labControls: LabProduct[] }>()
);

export const saveControlFailure = createAction(
  '[Lab Setup] Save Control Failure',
  props<{ error: Error }>()
);

export const loadControlList = createAction(
  '[Lab Setup] Load Control List',
  props<{ request: ProductListRequest}>()
);

export const loadControlListSuccess = createAction(
  '[Lab Setup] Load Control List Success',
  props<{ masterControls: ManufacturerProduct[] }>()
);

export const loadControlListFailure = createAction(
  '[Lab Setup] Load Control List Failure',
  props<{ error: Error }>()
);

export const deleteControl = createAction(
  '[Lab Setup] delete Control',
  props<{ control: LabProduct }>()
);

export const deleteControlSuccess = createAction(
  '[Lab Setup] delete Control Success',
  props<{ control: LabProduct }>()
);

export const deleteControlFailure = createAction(
  '[Lab Setup] delete Control Failure',
  props<{ error: Error }>()
);

export const addCustomControl = createAction(
  '[Lab Setup] Add Custom Control',
  props<{ customControlEmitter: NonBrControlConfig }>()
);

export const addCustomControlSuccess = createAction(
  '[Lab Setup] Add Custom Control Success',
  props < { labControls: LabProduct[] }>()
);

export const addCustomControlFailure = createAction(
  '[Lab Setup] Add Custom Control Failure',
  props<{ error: Error  }>()
);


const labConfigControlActions = union({
  saveControl,
  saveControlSuccess,
  saveControlFailure,
  loadControlList,
  loadControlListSuccess,
  loadControlListFailure,
  deleteControl,
  deleteControlSuccess,
  deleteControlFailure,
  addCustomControl
});

export type LabConfigControlActionsUnion = typeof labConfigControlActions;
