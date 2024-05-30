import { createAction, props, union } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { NewInstrumentConfig } from '../../models/new-instrument-config.model';

export const requestInstrumentConfiguration = createAction(
  '[Lab Setup] Request Instrument Configuration',
  props<{ instrumentConfig: NewInstrumentConfig }>()
);

export const requestInstrumentConfigurationSuccess = createAction(
  '[Lab Setup] Request Instrument Configuration Success',
  props<{ instrumentConfig: NewInstrumentConfig }>()
);

export const requestInstrumentConfigurationFailure = createAction(
  '[Lab Setup] Request Instrument Configuration Failure',
  props<{ error: Error }>()
);

const requestInstrumentConfigActions = union({
  requestInstrumentConfiguration,
  requestInstrumentConfigurationSuccess,
  requestInstrumentConfigurationFailure
});

export type RequestInstrumentConfigActionsUnion = typeof requestInstrumentConfigActions;
