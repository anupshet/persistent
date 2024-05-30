// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MaterialModule } from './material-module';
import { BrCore } from './shared/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    BrCore
  ],
  exports: [],
  declarations: []
})
export class BrComponentLibraryModule {}
