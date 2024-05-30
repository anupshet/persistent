import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

import { MaterialModule } from '../material-module';
import { InfoTooltipComponent } from './info-tooltip.component';

@NgModule({
  declarations: [InfoTooltipComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MaterialModule
  ],
  exports: [InfoTooltipComponent]
})
export class BrInfoTooltip { }
