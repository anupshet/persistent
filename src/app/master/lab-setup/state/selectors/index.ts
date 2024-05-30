// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as State from '..';
import { EvaluationMeanSdConfigState } from '../reducers/evaluation-mean-sd-config.reducer';
import { LabConfigAnalyteState } from '../reducers/lab-config-analyte.reducer';
import { LabConfigControlState } from '../reducers/lab-config-control.reducer';
import { LabConfigDepartmentState } from '../reducers/lab-config-department.reducer';
import { LabConfigInstrumentState } from '../reducers/lab-config-instrument.reducer';
import { LabConfigLocationState } from '../reducers/lab-config-location.reducer';
import { LabConfigSettingsState } from '../reducers/lab-config-settings.reducer';
import { LabSetupDefaultsState } from '../reducers/lab-setup-defaults.reducer';

export const getLabSetupRouterState =
  createFeatureSelector<State.LabSetupStates, RouterReducerState>(State.RouterStateIdentifier);
export const getSetupDefaultState =
  createFeatureSelector<State.LabSetupStates, LabSetupDefaultsState>(State.LabSetupDefaultStateIdentifier);
export const getControlState = createFeatureSelector<State.LabSetupStates, LabConfigControlState>(State.LabConfigControlStateIdentifier);
export const getLocationState = createFeatureSelector<State.LabSetupStates, LabConfigLocationState>(State.LabConfigLocationIdentifier);
export const getDepartmentState =
  createFeatureSelector<State.LabSetupStates, LabConfigDepartmentState>(State.LabConfigDepartmentIdentifier);
export const getSettingsState = createFeatureSelector<State.LabSetupStates, LabConfigSettingsState>(State.LabConfigSettingsIdentifier);
export const getInstrumentState =
  createFeatureSelector<State.LabSetupStates, LabConfigInstrumentState>(State.LabConfigInstrumentIdentifier);
export const getAnalyteFeatureState =
  createFeatureSelector<State.LabSetupStates, LabConfigAnalyteState>(State.LabConfigAnalyteStateIdentifier);
export const getEvaluationMeanSdConfigState =
  createFeatureSelector<State.LabSetupStates, EvaluationMeanSdConfigState>(State.EvaluationMeanSdConfigIdentifier);

// Selectors for getting Lab Config Default Items
export const getLabSetupDefaultsError = createSelector(getSetupDefaultState, (state) => {
  if (state) {
    return state.error;
  }
});
export const getLabSetupDefaults = createSelector(getSetupDefaultState, (state) => {
  if (state) {
    return state.accountSettings;
  }
});

// Selectors for getting Lab Config Location Items
export const getLabConfigLocationError = createSelector(getLocationState, (state) => {
  if (state) {
    return state.error;
  }
});
export const getLabConfigLocations = createSelector(getLocationState, (state) => {
  if (state) {
    return state.labLocation;
  }
});

// Selectors for getting Instruments Items
export const getLabInstruments = createSelector(getInstrumentState, (state) => {
  if (state) {
    return state.labInstruments;
  }
});
export const getLabManufacturers = createSelector(getInstrumentState, (state) => {
  if (state) {
    return state.manufacturers;
  }
});
export const getLabConfigInstrumentError = createSelector(getInstrumentState, (state) => {
  if (state) {
    return state.error;
  }
});

// Selectors for getting Lab Config Department Items
export const getLabConfigDepartmentError = createSelector(getDepartmentState, (state) => {
  if (state) {
    return state.error;
  }
});
export const getLabConfigDepartments = createSelector(getDepartmentState, (state) => {
  if (state) {
    return state.labDepartments;
  }
});

// Selectors for getting Lab Config Control Items
export const getLabConfigControls = createSelector(getControlState, (state) => {
  if (state) {
    return state.labControls;
  }
});
export const getLabConfigControlError = createSelector(getControlState, (state) => {
  if (state) {
    return state.error;
  }
});
export const getLabConfigControlList = createSelector(getControlState, (state) => {
  if (state) {
    return state.masterControls;
  }
});

// Selectors for getting analyte state Items
export const getAnalyteState = createSelector(getAnalyteFeatureState, (state) => {
  if (state) {
    return state;
  }
});

export const getSettings = createSelector(getSettingsState,
  (state) => state ? state.settings : null);


// Selectors for EvaluationMeanSd
export const getEvaluationMeanSdConfig = createSelector(getEvaluationMeanSdConfigState, (state) => {
  if (state) {
    return state;
  } else {
    return null;
  }
});

export const getFloatPointDetails = createSelector(getSettingsState, (state) => {
  if (state) {
    return state.settings && state.settings.runSettings.minimumNumberOfPoints;
  } else {
    return null;
  }
});

export const getEvaluationMeanSdData = createSelector(getEvaluationMeanSdConfigState, (state) => {
  if (state) {
    return state.entityEvaluationMeanSdGroup;
  } else {
    return null;
  }
});

export const getanalyteFloatingStatisticsData = createSelector(getEvaluationMeanSdConfigState, (state) => {
  if (state) {
    return state.analyteFloatingStatisticsGroup;
  } else {
    return null;
  }
});
