// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import * as State from './state';
import { CustomControlRoutingModule } from './custom-control-routing.module';
import { DefineCustomControls } from './define-custom-controls/define-custom-controls.component';
import { DefineCustomControlsEffects } from './state/effects/define-custom-controls.effects';
import { LabSetupModule } from '../lab-setup/lab-setup.module';
import { CustomControlManagementComponent } from './custom-control-management.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    CustomControlRoutingModule,
    LabSetupModule,
    CommonModule,
    StoreModule.forFeature(State.DefineCustomControlsStateIdentifier, State.reducers.defineCustomControl),

    EffectsModule.forFeature([
      DefineCustomControlsEffects
    ])
    ],
  declarations: [
    DefineCustomControls,
    CustomControlManagementComponent
  ]
})
export class CustomControlManagementModule { }
