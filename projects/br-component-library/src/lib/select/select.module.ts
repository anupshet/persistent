// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material-module';
import { BrSelectComponent } from './select.component';
import { TextHighlightPipe } from '../shared';

@NgModule({
  declarations: [BrSelectComponent, TextHighlightPipe],
  imports: [CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [BrSelectComponent, TextHighlightPipe]
})
export class BrSelect { }
