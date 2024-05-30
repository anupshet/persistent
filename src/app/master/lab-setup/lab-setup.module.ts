// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { BrLevelsInUseModule, ErrorHandlingFormsModule, BrSelect, BrCore, BrInfoTooltip } from 'br-component-library';

import { EntityTypeService } from '../../shared/services/entity-type.service';
import { SharedModule } from '../../shared/shared.module';
import { LabConfigurationControlComponent } from './components/lab-configuration-control/lab-configuration-control.component';
import { LabConfigurationDepartmentComponent } from './components/lab-configuration-department/lab-configuration-department.component';
import { LabConfigurationLocationComponent } from './components/lab-configuration-location/lab-configuration-location.component';
import { LabSetupDefaultComponent } from './components/lab-setup-default/lab-setup-default.component';
import { LabSetupFeedbackComponent } from './components/lab-setup-feedback/lab-setup-feedback.component';
import { LabSetupHeaderComponent } from './components/lab-setup-header/lab-setup-header.component';
import { LabconfigControlEffects } from './state/effects/lab-config-control.effects';
import { LabconfigDepartmentEffects } from './state/effects/lab-config-department.effects';
import { LabconfigInstrumentEffects } from './state/effects/lab-config-instrument.effects';
import { LabConfigLocationEffects } from './state/effects/lab-config-location.effects';
import { LabSetupDefaultEffects } from './state/effects/lab-setup.defaults.effects';
import { LabConfigSettingsEffects } from './state/effects/lab-config-settings.effects';
import { LabRequestInstrumentConfigurationEffects } from './state/effects/request-instrument-config.effects';
import { LabRequestTestConfigurationEffects } from './state/effects/request-test-config.effects';
import { LabSetupRoutingModule } from './lab-setup-routing.module';
import { LabSetupComponent } from './lab-setup.component';
import { LabSetupDefaultsService } from './services/lab-setup-defaults.service';
import * as State from './state';
import { LabConfigAnalyteEffects } from './state/effects/lab-config-analyte.effects';
import { LabSetupDefaultContainerComponent } from './containers/lab-setup-default-container/lab-setup-default-container.component';
import {
  LabSetupFeedbackContainerComponent
} from './containers/lab-setup-feedback-container/lab-setup-feedback-container.component';
import { DepartmentManagementComponent } from './containers/department-management/department-management.component';
import { DepartmentConfigComponent } from './containers/department-config/department-config.component';
import { DepartmentEntryComponent } from './components/department-entry/department-entry.component';
import { AnalyteManagementComponent } from './containers/analyte-management/analyte-management.component';
import { AnalyteConfigComponent } from './containers/analyte-config/analyte-config.component';
import { AnalyteEntryComponent } from './components/analyte-entry/analyte-entry.component';
import { ControlManagementComponent } from './containers/control-management/control-management.component';
import { ControlConfigComponent } from './containers/control-config/control-config.component';
import { InstrumentManagementComponent } from './containers/instrument-management/instrument-management.component';
import { InstrumentEntryComponent } from './components/instrument-entry/instrument-entry.component';
import { InstrumentConfigComponent } from './containers/instrument-config/instrument-config.component';
import { SpcRulesComponent } from './components/spc-rules/spc-rules.component';
import { SpcRulesService } from './components/spc-rules/spc-rules.service';
import { SpcRulesDialogComponent } from './components/spc-rules-dialog/spc-rules-dialog.component';
import { LevelEvaluationMeanSdComponent } from './components/level-evaluation-mean-sd/level-evaluation-mean-sd.component';
import { ControlEntryComponent } from './components/control-entry/control-entry.component';
import { EvaluationMeanSdComponent } from './components/evaluation-mean-sd/evaluation-mean-sd.component';
import { EvaluationMeanSdConfigComponent } from './containers/evaluation-mean-sd-config/evaluation-mean-sd-config.component';
import { EvaluationMeanSdConfigEffects } from './state/effects/evaluation-mean-sd-config.effects';
import { UpdateSettingsDialogComponent } from './components/update-settings-dialog/update-settings-dialog.component';
import { DuplicateInstrumentEntryComponent } from './components/duplicate-instrument-entry/duplicate-instrument-entry.component';
import { DuplicateNodeComponent } from '../../shared/containers/duplicate-node/duplicate-node.component';
import { DuplicateNodeEntryComponent } from '../../shared/components/duplicate-node-entry/duplicate-node-entry.component';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';

import { AddDefineOwnControlComponent } from './components/add-define-own-control/add-define-own-control.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    LabSetupComponent,
    LabSetupDefaultComponent,
    LabConfigurationLocationComponent,
    LabConfigurationDepartmentComponent,
    LabConfigurationControlComponent,
    LabSetupFeedbackComponent,
    LabSetupDefaultContainerComponent,
    LabSetupFeedbackContainerComponent,
    DepartmentManagementComponent,
    DepartmentConfigComponent,
    DepartmentEntryComponent,
    AnalyteManagementComponent,
    AnalyteConfigComponent,
    AnalyteEntryComponent,
    AnalyteEntryComponent,
    ControlManagementComponent,
    ControlConfigComponent,
    InstrumentManagementComponent,
    SpcRulesComponent,
    SpcRulesDialogComponent,
    InstrumentEntryComponent,
    InstrumentConfigComponent,
    ControlEntryComponent,
    LevelEvaluationMeanSdComponent,
    EvaluationMeanSdComponent,
    EvaluationMeanSdConfigComponent,
    UpdateSettingsDialogComponent,
    DuplicateInstrumentEntryComponent
  ],
  imports: [
    SharedModule,
    SharedTranslateModule,
    LabSetupRoutingModule,
    PerfectScrollbarModule,
    BrInfoTooltip,
    BrSelect,
    BrLevelsInUseModule,
    ErrorHandlingFormsModule,
    MatSelectModule,
    BrCore,
    MatDialogModule,
    StoreModule.forFeature(State.LabSetupDefaultStateIdentifier, State.reducers.labSetupDefault),
    StoreModule.forFeature(State.LabConfigLocationIdentifier, State.reducers.labConfigLocation),
    StoreModule.forFeature(State.LabConfigDepartmentIdentifier, State.reducers.labConfigDepartment),
    StoreModule.forFeature(State.LabConfigInstrumentIdentifier, State.reducers.labConfigInstrument),
    StoreModule.forFeature(State.LabConfigControlStateIdentifier, State.reducers.labConfigControl),
    StoreModule.forFeature(State.LabConfigAnalyteStateIdentifier, State.reducers.labConfigAnalyte),
    StoreModule.forFeature(State.LabConfigSettingsIdentifier, State.reducers.labConfigSettings),
    StoreModule.forFeature(State.EvaluationMeanSdConfigIdentifier, State.reducers.evaluationMeanSdConfig),

    // TODO : Confirm how many effects there will be approximately & combine these into one
    EffectsModule.forFeature([
      LabConfigAnalyteEffects,
      LabconfigControlEffects,
      LabconfigDepartmentEffects,
      LabconfigInstrumentEffects,
      LabConfigLocationEffects,
      LabSetupDefaultEffects,
      LabConfigSettingsEffects,
      LabRequestInstrumentConfigurationEffects,
      LabRequestTestConfigurationEffects,
      EvaluationMeanSdConfigEffects
    ])
  ],
  exports: [AddDefineOwnControlComponent,LabSetupHeaderComponent],
  providers: [
    SpcRulesService,
    LabSetupDefaultsService,
    EntityTypeService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    TranslateService
  ],
  entryComponents: [
    SpcRulesDialogComponent,
    EvaluationMeanSdConfigComponent,
    DuplicateNodeComponent,
    DuplicateNodeEntryComponent
  ],
})
export class LabSetupModule { }
