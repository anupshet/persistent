// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as fromRouter from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromEvaluationMeanSdConfig from './reducers/evaluation-mean-sd-config.reducer';
import * as fromLabConfigAnalyte from './reducers/lab-config-analyte.reducer';
import * as fromLabConfigControl from './reducers/lab-config-control.reducer';
import * as fromLabConfigDepartment from './reducers/lab-config-department.reducer';
import * as fromLabConfigInstrument from './reducers/lab-config-instrument.reducer';
import * as fromLabConfigLocation from './reducers/lab-config-location.reducer';
import * as fromLabConfigSettings from './reducers/lab-config-settings.reducer';
import * as fromLabSetupDefaults from './reducers/lab-setup-defaults.reducer';


export interface LabSetupStates {
  labSetupDefault: fromLabSetupDefaults.LabSetupDefaultsState;
  labConfigDepartment: fromLabConfigDepartment.LabConfigDepartmentState;
  labConfigLocation: fromLabConfigLocation.LabConfigLocationState;
  labConfigInstrument: fromLabConfigInstrument.LabConfigInstrumentState;
  labConfigControl: fromLabConfigControl.LabConfigControlState;
  labConfigAnalyte: fromLabConfigAnalyte.LabConfigAnalyteState;
  labConfigSettings: fromLabConfigSettings.LabConfigSettingsState;
  router: fromRouter.RouterReducerState;
  evaluationMeanSdConfig: fromEvaluationMeanSdConfig.EvaluationMeanSdConfigState;
}

export const reducers: ActionReducerMap<LabSetupStates> = {
  labSetupDefault: fromLabSetupDefaults.reducer,
  labConfigDepartment: fromLabConfigDepartment.reducer,
  labConfigLocation: fromLabConfigLocation.reducer,
  labConfigInstrument: fromLabConfigInstrument.reducer,
  labConfigControl: fromLabConfigControl.reducer,
  labConfigAnalyte: fromLabConfigAnalyte.reducer,
  labConfigSettings: fromLabConfigSettings.reducer,
  router: fromRouter.routerReducer,
  evaluationMeanSdConfig: fromEvaluationMeanSdConfig.reducer
};

// TODO: This need to be commented out later
// console.log all actions
export function logger(
  reducer: ActionReducer<LabSetupStates>
): ActionReducer<LabSetupStates> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  };
}

export const RouterStateIdentifier = 'router';
export const LabSetupDefaultStateIdentifier = 'labSetupDefault';
export const LabConfigControlStateIdentifier = 'labConfigControl';
export const LabConfigAnalyteStateIdentifier = 'labConfigAnalyte';
export const LabConfigLocationIdentifier = 'labConfigLocation';
export const LabConfigDepartmentIdentifier = 'labConfigDepartment';
export const LabConfigInstrumentIdentifier = 'labConfigInstrument';
export const LabConfigSettingsIdentifier = 'labConfigSettings';
export const EvaluationMeanSdConfigIdentifier = 'evaluationMeanSdConfig';
export const LabConfigDuplicateLotsIdentifier = 'labConfigDuplicateLots';

export const metaReducers: MetaReducer<
  LabSetupStates
>[] = !environment.production ? [logger] : [];
