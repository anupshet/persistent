import { createAction, props, union } from '@ngrx/store';

import { Error } from '../../../../contracts/models/shared/error.model';
import { TestConfiguration } from '../../models/test-configuration.model';

export const requestTestConfiguration = createAction(
  '[Lab Setup] Request Test Configuration',
  props<{ testConfig: TestConfiguration }>()
);

export const requestTestConfigurationSuccess = createAction(
  '[Lab Setup] Request Test Configuration Success',
  props<{ testConfig: TestConfiguration }>()
);

export const requestTestConfigurationFailure = createAction(
  '[Lab Setup] Request Test Configuration Failure',
  props<{ error: Error }>()
);

const requestTestConfigActions = union({
  requestTestConfiguration,
  requestTestConfigurationSuccess,
  requestTestConfigurationFailure
});

export type RequestTestConfigActionsUnion = typeof requestTestConfigActions;
