// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {from as observableFrom,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Utility } from '../../core/helpers/utility';
import { SecurityConfigService } from '../security-config.service';
import { authEventNames, AuthEventService } from './auth.events.service';
import { Okta } from './okta.widget';

import { AppNavigationTrackingService } from '../../shared/services/appNavigationTracking/app-navigation-tracking.service';

const IdTokenKey = 'idToken';
const AccessTokenKey = 'accessToken';

@Injectable()
export class OktaService {
  private oktaSignIn;

  constructor(
    private widget: Okta,
    private config: SecurityConfigService,
    private authEvent: AuthEventService,
    private appNavigationService: AppNavigationTrackingService) {
    this.oktaSignIn = widget.getWidget();

    this.oktaSignIn.authClient.tokenManager.on('expired', (key, expiredToken) => {
      this.authEvent.raise(authEventNames.AUTH_EVENT_TOKEN_EXPIRED, expiredToken);
    });

    this.oktaSignIn.authClient.tokenManager.on('error', function (err) {
      this.authEvent.raise(authEventNames.AUTH_EVENT_TOKEN_ERROR, err);
    });

    this.oktaSignIn.authClient.tokenManager.on('refreshed', (key, newToken, oldToken) => {
      this.authEvent.raise(authEventNames.AUTH_EVENT_TOKEN_REFRESHED, newToken);
    });

    this.oktaSignIn.on('afterError', (context, error) => {
      this.appNavigationService.logFailedLogin();
    });
  }

  getWidget() {
    return this.oktaSignIn;
  }

  addToken(token) {
    this.oktaSignIn.authClient.tokenManager.add(IdTokenKey, token);
  }

  refreshToken() {
    return this.oktaSignIn.authClient.tokenManager.renew(IdTokenKey);
  }

  getToken() {
    return this.oktaSignIn.authClient.tokenManager.get(IdTokenKey);
  }

  removeToken() {
    this.oktaSignIn.authClient.tokenManager.remove(IdTokenKey);
  }

  addAccessToken(token) {
    this.oktaSignIn.authClient.tokenManager.add(AccessTokenKey, token);
  }

  getAccessToken() {
    return this.oktaSignIn.authClient.tokenManager.get(AccessTokenKey);
  }

  removeAccessToken() {
    this.oktaSignIn.authClient.tokenManager.remove(AccessTokenKey);
  }

  signOut(callback: () => void) {
    // TODO: Sanjay - use the logout method from oktaSession.service.ts file this is merged
    // this.oktaSignIn.signOut();
  }

  checkSession(): Observable<any> { const pr = Utility.promiseFactory<any>(); 
    this.oktaSignIn.authClient.isAuthenticated().then((t) => { 
      if (t) this.oktaSignIn.authClient.getUser().then((u) => { 
        if (u) { pr.resolve(u); } 
        pr.resolve(null); }); 
        else pr.resolve(null); }); 
        return observableFrom(pr.promise); }

  
 }
