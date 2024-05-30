import { Injectable } from '@angular/core';
import * as OktaSignIn from '@okta/okta-signin-widget';

import { SecurityConfigService } from '../security-config.service';

@Injectable()
export class Okta {
  constructor(private config: SecurityConfigService) {}

  getWidget() {
    return new OktaSignIn(this.config.OktaConfig);
  }
}
