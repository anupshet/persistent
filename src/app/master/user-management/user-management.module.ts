// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';

import { BrSelect } from 'br-component-library';

import { SharedModule } from '../../shared/shared.module';
import { UserManagementApiService } from '../../shared/api/userManagementApi.service';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementAction } from '../../shared/state/user-management.action';
import { UserManagementDialogComponent } from './user-management-dialog.component';
import { UserManagementComponent } from './user-management.component';
import { UserManagementService } from '../../shared/services/user-management.service';
import { reducer } from './state/reducers/user-management.reducer';
import { usersStateIdentifier } from './state/selectors';
import { SharedTranslateModule } from '../../shared/translate/shared-translate.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    UserManagementRoutingModule,
    PerfectScrollbarModule,
    SharedModule,
    StoreModule.forFeature(usersStateIdentifier, reducer),
    BrSelect,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedTranslateModule,
  ],
  declarations: [
    UserManagementDialogComponent,
    UserManagementComponent
  ],
  providers: [
    UserManagementService,
    UserManagementAction,
    UserManagementApiService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: MatDialogRef, useValue: {} },
    TranslateService
  ],
  entryComponents: [
    UserManagementComponent,
  ]
})
export class UserManagementModule { }
