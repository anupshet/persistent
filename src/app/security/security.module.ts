// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { throwIfAlreadyLoaded } from '../core/helpers/module-import-guard';
import { AuthenticationGuard } from './guards/authentication-guard.service';
import { PermissionGuard } from './guards/permission-guard.service';
import { SecurityConfigService } from './security-config.service';
import { SecurityRoutingModule } from './security-routing.module';
import { AuthEventService } from './services/auth.events.service';
import { AuthenticationService } from './services/authentication.service';
import { OktaService } from './services/okta.service';
import { Okta } from './services/okta.widget';
import { BrPermissionsService } from './services/permissions.service';
import { reducer } from './state/reducers/security.reducer';
import { securityStateIdentifier } from './state/selectors';
import { DataReviewGuard } from './guards/data-review-guard.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SecurityRoutingModule,
    StoreModule.forFeature(securityStateIdentifier, reducer)
  ],
  providers: [
    [
      SecurityConfigService,
      AuthenticationService,
      AuthEventService,
      AuthenticationGuard,
      PermissionGuard,
      DataReviewGuard,
      OktaService,
      Okta,
      BrPermissionsService
    ]
  ],
})
export class SecurityModule {
  constructor( @Optional() @SkipSelf() parentModule: SecurityModule) {
    throwIfAlreadyLoaded(parentModule, 'SecurityModule');
  }
}

