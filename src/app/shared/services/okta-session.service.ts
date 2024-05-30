// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { OktaAuthService } from '@okta/okta-angular';

@Injectable({
  providedIn: 'root'
})
export class OktaSessionService {

  constructor(public oktaAuth: OktaAuthService) { }

  public loginRedirect(): void {
    this.oktaAuth.signInWithRedirect({
      originalUri: '/'
    });
  }

  public logout() {
    this.oktaAuth.signOut();
    this.oktaAuth.tokenManager.clear();
  }
}
