// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, // needed
MatDialogRef } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { InfoTooltipComponent, BrInfoTooltip } from 'br-component-library';

import { SharedModule } from '../../shared/shared.module';
import { ConnectivityMappingApiService } from '../../shared/api/connectivityMappingApi.service';
import { FileReceiveApiService } from '../../shared/api/fileReceiveApi.service';
import { LabDataApiService } from '../../shared/api/labDataApi.service';
import { OrchestratorApiService } from '../../shared/api/orchestratorApi.service';
import { ParsingEngineApiService } from '../../shared/api/parsingEngineApi.service';
import { ConnectivityRoutingModule } from './connectivity-routing.module';
import { ConnectivityComponent, } from './connectivity.component';
import { ConnectivityDialogComponent } from './connectivity-dialog.component';
import {
  InstructionsComponent,
  InstructionsRulesComponent,
  InstructionsTableComponent } from './instructions';
import { InstructionsService } from './instructions/instructions.service';
import { ParsingEngineAdapterService } from './instructions/parsing-engine/parsing-engine-adapter.service';
import {
  DropdownFilterComponent,
  EntityMapComponent,
  InstrumentMapComponent,
  MapHeaderComponent,
  MappingComponent,
  MappingDialogComponent,
  ProductMapComponent,
  ReagentCalibratorDialogComponent,
  SideNavigationComponent,
  TestMapComponent
} from './mapping/';
import { MappingService } from './mapping/mapping.service';
import { ReagentCalibratorDialogService } from './mapping/test-map/reagent-calibrator-dialog/reagent-calibrator-dialog.service';
import { HeaderComponent } from './shared/header/header.component';
import { FileReceiveService } from './shared/services/file-receive.service';
import { LabDataService } from './shared/services/lab-data.service';
import { OrchestratorService } from './shared/services/orchestrator.service';
import { ParsingEngineService } from '../../shared/services/parsing-engine.service';
import { UploadComponent } from './upload/upload.component';
import { FileVerificationService } from './shared/services/file-verification.service';
import { HeaderService } from './shared/header/header.service';
import { ConnectivityStatusComponent } from './containers/connectivity-status/connectivity-status.component';
import { ConnectivityStatusDetailsComponent } from './components/connectivity-status-details/connectivity-status-details.component';
import { reducer as connectivityReducer } from './state/reducers/connectivity.reducer';
import { connectivityStateIdentifier } from './state/selectors';
import { ConnectivityEffects } from './state/effects/connectivity.effects';
import { ArchivedPanelComponent } from './mapping/shared/archived-panel/archived-panel.component';
import { ConnectivitySchedulerComponent } from './containers/connectivity-scheduler/connectivity-scheduler.component';
import { ConnectivitySchedulerDetailsComponent } from './components/connectivity-scheduler-details/connectivity-scheduler-details.component';
import { ConnectivitySlideGenListComponent } from './components/connectivity-slide-gen-list/connectivity-slide-gen-list.component';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { TransformerConfigurationComponent } from './configurations/transformer-configuration/transformer-configuration.component';
import { ErrorLogComponent } from './components/connectivity-status-details/error-log/error-log.component';
import { CommonConfigurationComponent } from './configurations/common-configuration/common-configuration.component';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    ConnectivityRoutingModule,
    SharedModule,
    PerfectScrollbarModule,
    BrInfoTooltip,
    StoreModule.forFeature(connectivityStateIdentifier, connectivityReducer),
    EffectsModule.forFeature([
      ConnectivityEffects
    ]),
    SharedTranslateModule,
  ],
  declarations: [
    ConnectivityComponent,
    UploadComponent,
    HeaderComponent,
    MappingComponent,
    EntityMapComponent,
    DropdownFilterComponent,
    MappingDialogComponent,
    MapHeaderComponent,
    SideNavigationComponent,
    InstrumentMapComponent,
    ProductMapComponent,
    TestMapComponent,
    ReagentCalibratorDialogComponent,
    InstructionsComponent,
    ConnectivityDialogComponent,
    InstructionsRulesComponent,
    InstructionsTableComponent,
    ConnectivityStatusComponent,
    ConnectivityStatusDetailsComponent,
    ArchivedPanelComponent,
    ConnectivitySchedulerComponent,
    ConnectivitySchedulerDetailsComponent,
    ConnectivitySlideGenListComponent,
    ConfigurationsComponent,
    TransformerConfigurationComponent,
    ErrorLogComponent,
    CommonConfigurationComponent,
  ],
  providers: [
    FileReceiveService,
    FileReceiveApiService,
    LabDataService,
    LabDataApiService,
    OrchestratorService,
    OrchestratorApiService,
    ParsingEngineService,
    ParsingEngineApiService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    MappingService,
    ConnectivityMappingApiService,
    ReagentCalibratorDialogService,
    InstructionsService,
    ParsingEngineAdapterService,
    FileVerificationService,
    HeaderService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    TranslateService,
  ],
  entryComponents: [
    MappingDialogComponent,
    ReagentCalibratorDialogComponent,
    InfoTooltipComponent,
    InstructionsComponent,
    ConnectivityComponent,
    InstructionsTableComponent,
  ]
})
export class ConnectivityModule {}
