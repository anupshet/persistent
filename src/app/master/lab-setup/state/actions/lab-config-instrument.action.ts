import { createAction, props, union } from '@ngrx/store';

import { LabInstrument, LabInstrumentValues } from '../../../../contracts/models/lab-setup/instrument.model';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { Error } from '../../../../contracts/models/shared/error.model';

export const saveInstruments = createAction(
  '[Lab Setup] Save Instruments',
  props<{ labInstruments: LabInstrumentValues }>()
);

export const saveInstrumentsSuccess = createAction(
  '[Lab Setup] Save Instruments Success',
  props<{ labInstruments: LabInstrument[] }>()
);

export const saveInstrumentsFailure = createAction(
  '[Lab Setup] Save Instruments Failure',
  props<{ error: Error }>()
);

export const loadManufacturerList = createAction(
  '[Lab Setup] Load Manufacturer List'
);

export const loadManufacturerListSuccess = createAction(
  '[Lab Setup] Load Manufacturer List Success',
  props<{ manufacturers: Manufacturer[] }>()
);

export const loadManufacturerListFailure = createAction(
  '[Lab Setup] Load Manufacturer List Failure',
  props<{ error: Error }>()
);

export const deleteInstrument = createAction(
  '[Lab Setup] delete Instrument',
  props<{ instrument: LabInstrument }>()
);

export const deleteInstrumentSuccess = createAction(
  '[Lab Setup] delete Instrument Success',
  props<{ instrument: LabInstrument }>()
);

export const deleteInstrumentFailure = createAction(
  '[Lab Setup] delete Instrument Failure',
  props<{ error: Error }>()
);

const labConfigInstrumentActions = union({
  saveInstruments,
  saveInstrumentsSuccess,
  saveInstrumentsFailure,
  loadManufacturerList,
  loadManufacturerListSuccess,
  loadManufacturerListFailure,
  deleteInstrument,
  deleteInstrumentSuccess,
  deleteInstrumentFailure
});

export type LabConfigInstrumentActionsUnion = typeof labConfigInstrumentActions;
