// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.

import { NgModule } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';

import { SharedModule } from '../../shared/shared.module';
import { BioRadUserManagementComponent } from './biorad-user-management.component';
import { BioRadUserManagementDialogComponent } from './biorad-user-management-dialog.component';
import { BioRadUserManagementRoutingModule } from './biorad-user-management-routing.module';
import { BioRadUserManagementApiService } from './biorad-user-management-api.service';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    BioRadUserManagementRoutingModule,
    PerfectScrollbarModule,
    SharedModule,
    SharedTranslateModule,
  ],
  declarations: [
    BioRadUserManagementDialogComponent,
    BioRadUserManagementComponent
  ],
  providers: [
    BioRadUserManagementApiService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: MatDialogRef, useValue: {} },
    TranslateService
  ],
  entryComponents: [
    BioRadUserManagementComponent
  ]
})
export class BioRadUserManagementModule { }
