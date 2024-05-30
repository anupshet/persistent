// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ngrxStore from '@ngrx/store';

import * as LDClient from 'launchdarkly-js-client-sdk';

import * as fromRoot from '../../state/app.state';
import * as fromAuth from '../../shared/state/selectors';
import { filter, take } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import { FeatureFlag } from '../../core/config/config.contract';
import { AuthState } from '../../shared/state/reducers/auth.reducer';
import { AuthEventService, AuthenticationService, authEventNames } from '../../security/services';
import { ErrorLoggerService } from './errorLogger/error-logger.service';
import { blankSpace, componentInfo, Operations } from '../../core/config/constants/error-logging.const'
import { ErrorType } from '../../contracts/enums/error-type.enum';


export interface LDClientUserContext {
  firstName?: string,
  lastName?: string,
  name?: string,
  email?: string
}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsService implements OnDestroy {

  private client: LDClient.LDClientBase;
  private isClientInitialized: boolean = false;
  private featureFlagConfig: FeatureFlag;
  private context: LDClient.LDContext = {
    kind: 'user',
    key: ''
  };
  private logger: LDClient.LDLogger = LDClient.basicLogger({level: 'warn'});
  private clientConfig: LDClient.LDOptions = {
    logger: this.logger
  }

  constructor(
    private store: Store<fromRoot.State>,
    private configService: ConfigService,
    private authenticationService: AuthenticationService,
    private authEvent: AuthEventService,
    private errorLoggerService: ErrorLoggerService
  ) {
    this.featureFlagConfig = this.configService.getConfig('featureFlag');
    this.context.key = this.featureFlagConfig.contextKey;
    this.initializeClient();

    this.authEvent.changes()
      .subscribe(changes => {
        if (changes && changes.event === authEventNames.AUTH_EVENT_SESSION_LOADED) {
          this.initializeClientWithUserContext();
        }
      });
  }

  async ngOnDestroy() {
    await this.client.close();
}

  initializeClient(): void {
    this.authenticationService.authenticationState
      .pipe(take(1))
      .subscribe((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.initializeClientWithUserContext();
        } else {
          this.client = LDClient.initialize(this.featureFlagConfig.apiKey, this.context, this.clientConfig);
          this.testClientReadiness();
        }
      });
  }

  initializeClientWithUserContext(): void {
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), take(1))
      .subscribe((authState: AuthState) => {
        if (authState && authState.isLoggedIn) {
          // Commented out since PII is used but enable this if filtering by user is desired

          //const { firstName, lastName, email } = authState.currentUser
          // this.context = {
          //   ...this.context,
          //   firstName,
          //   lastName,
          //   email,
          //   name: firstName + ' ' + lastName
          // }
          this.client = LDClient.initialize(this.featureFlagConfig.apiKey, this.context, this.clientConfig);
          this.testClientReadiness()
        }
      });
  }

  async testClientReadiness(): Promise<void> {
    await this.client.waitForInitialization().then(() => {
      this.isClientInitialized = true;
    }).catch(err => {
      this.isClientInitialized = false;
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          componentInfo.FeatureFlagsService + blankSpace + Operations.LaunchDarklyServiceConnectionError));
    });
  }

  getClient(): LDClient.LDClientBase {
    return this.client;
  }

  getFeatureFlag(featureFlag: string, defaultValue?: LDClient.LDFlagValue ): LDClient.LDFlagValue {
    let featureFlagValue: LDClient.LDFlagValue;
    try {
      if ( defaultValue ) {
        featureFlagValue = this.client.variation(featureFlag, defaultValue);
      } else {
        featureFlagValue = this.client.variation(featureFlag);
      }
      if (featureFlagValue === undefined) {
        throw new Error("Feature Flag value could not be defined or there is an error with Launch Darkly Services.");
      }
      return featureFlagValue;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, null, err,
          componentInfo.FeatureFlagsService + blankSpace + Operations.LaunchDarklyFeatureFlagError));
    }
  }

  hasClientInitialized(): boolean {
    return this.isClientInitialized;
  }

  async shutDownClient(): Promise<void> {
    await this.client.close().then(() => {
      this.isClientInitialized = false;
    });
  }

}
