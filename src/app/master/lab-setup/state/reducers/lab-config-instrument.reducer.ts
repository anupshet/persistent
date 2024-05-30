import { createReducer, on } from '@ngrx/store';

import { LabInstrument } from '../../../../contracts/models/lab-setup/index';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { Error } from '../../../../contracts/models/shared/error.model';
import { LabConfigInstrumentActions } from '../actions';

export interface LabConfigInstrumentState {
  labInstruments: LabInstrument[];
  manufacturers: Manufacturer[];
  error: Error;
}

export const labConfigInstrumentInitialState: LabConfigInstrumentState = {
  labInstruments: null,
  manufacturers: null,
  error: null
};

export const reducer = createReducer(
  labConfigInstrumentInitialState,
  on(LabConfigInstrumentActions.saveInstrumentsSuccess, (state, { labInstruments }) => ({
    ...state,
    error: null,
    labInstruments: labInstruments,
  })),

  on(LabConfigInstrumentActions.saveInstrumentsFailure, (state, { error }) => ({
    ...state,
    error: error,
    labInstruments: null
  })),

  on(LabConfigInstrumentActions.loadManufacturerListSuccess, (state, { manufacturers }) => ({
    ...state,
    error: null,
    manufacturers: manufacturers
  })),

  on(LabConfigInstrumentActions.loadManufacturerListFailure, (state, { error }) => ({
    ...state,
    error: error,
    manufacturers: null
  })),
);
