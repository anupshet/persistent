// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PanelsRoutingModule } from './panels-routing.module';
import { PanelsComponent } from './panels.component';
import { PanelViewComponent } from './containers/panel-view/panel-view.component';
import { panelstateIdentifier } from './state/selectors';
import { reducer as panelReducer } from './state/reducers/panels.reducer';
import { PanelEffects } from './state/effects/panels.effects';
import { SharedModule } from '../../shared/shared.module';
import { PanelComponent } from './containers/panel/panel.component';
import { PanelItemSelectionComponent } from './components/panel-item-selection/panel-item-selection.component';
import { PanelItemListComponent } from './components/panel-item-list/panel-item-list.component';
import { PanelsApiService } from './services/panelsApi.service';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';

@NgModule({
  declarations: [
    PanelsComponent,
    PanelComponent,
    PanelViewComponent,
    PanelItemSelectionComponent,
    PanelItemListComponent
  ],
  imports: [
    SharedModule,
    SharedTranslateModule,
    CommonModule,
    PanelsRoutingModule,
    MatTreeModule,
    MatCheckboxModule,
    StoreModule.forFeature(panelstateIdentifier, panelReducer),
    EffectsModule.forFeature([PanelEffects])
  ],
  providers: [
    PanelsApiService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    TranslateService
  ],
})
export class PanelsModule { }
