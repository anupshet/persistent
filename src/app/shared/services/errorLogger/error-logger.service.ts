// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { filter, distinctUntilChanged, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as ngrxStore from '@ngrx/store';

import { version } from '../../../../../package.json';
import * as fromRoot from '../../../state/app.state';
import { AppUser } from '../../../security/model';
import * as fromAuth from '../../../shared/state/selectors';
import { AuthState } from '../../state/reducers/auth.reducer';
import { getBrowserDetails } from '../../../core/helpers/browser-detection-helper';
import { appSource, applicationName } from '../../../core/config/constants/error-logging.const';
import { Severity } from '../../../contracts/enums/error-type.enum';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { LoggingApiService } from '../../api/logging-api.service';
import { Operations } from '../../../core/config/constants/error-logging.const';
@Injectable()
export class ErrorLoggerService {
  public user: AppUser;
  maxLogPerMin = 10;
  maxLogPerSession = 50;
  secLevel = 1000;
  logCounter = 0;
  totalLog = 0;
  minFlag = false;
  lastMinCount = 0;
  currentTime = new Date().getTime();
  static errorLogs = new Array<BrError>();

  constructor(private loggingApiService: LoggingApiService,
    store: Store<fromRoot.State>) {
    store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!authState.currentUser), distinctUntilChanged())
      .subscribe((authState: AuthState) => {
        this.user = authState.currentUser;
      });

  }
  populateErrorObject(errorType: number, errorMessage?: string, message?: string, operation?: string): BrError {
    const errorDateTime = new Date().toISOString();
    const errorTypeInpt = errorType;
    const errMessage = errorMessage;
    const msg = message;
    const operationInput = operation;
    const url = window.location.href;
    const clientType = getBrowserDetails().name;
    const clientVersion = getBrowserDetails().version;
    const startDateTime = null;
    const endDateTime = null;
    const source = appSource;
    const sourceVersion = version;
    const application = applicationName;
    const severity = Severity.Error;
    // 20201002: Made userId and accountId optional, to allow Error logging BEFORE user login, at the okta login screen
    let userId = '';
    let accountId = '';
    if (this.user) {
      userId = this.user.userOktaId;
      accountId = this.user.accountId;
    }
    const brErrorObj = new BrError(errorDateTime, errorTypeInpt, errMessage, operationInput, url, clientType, clientVersion,
      userId, accountId, source, sourceVersion, startDateTime, endDateTime, msg, application, severity);
    return brErrorObj;
  }

  logErrorToBackend(error: BrError) {
    // a fix for UN-20833: do not call ErrorLoggerService/loggingApiService if user is unauthenticated, operation is unknown and occured in login component
    const loginError = error.operation === "Unknown" && error.url.includes("login") && !error.userId;
    const launchDarklyError = error.operation === Operations.LaunchDarklyFeatureFlagError || error.operation === Operations.LaunchDarklyServiceConnectionError;
    const ignoreLogging = loginError || launchDarklyError;
    if(ignoreLogging) {
      return;
    }
    const totalLogsInSession = ErrorLoggerService.errorLogs.filter((errorLog) => errorLog.message === error.message);
    const logsInLastMinute = ErrorLoggerService.errorLogs.filter((errorLog) =>
      errorLog.message === error.message && errorLog.startDateTime.getTime() > (new Date()).getTime() - 60000);
    const logsInLastSecond = ErrorLoggerService.errorLogs.filter((errorLog) =>
      errorLog.message === error.message && errorLog.startDateTime.getTime() > (new Date()).getTime() - 1000);
    // Below logic will throttle the Error submission.
    if (!((totalLogsInSession && totalLogsInSession.length >= 50) ||
      (logsInLastMinute && logsInLastMinute.length >= 10) ||
      (logsInLastSecond && logsInLastSecond.length >= 1))) {
      error.startDateTime = new Date();
      ErrorLoggerService.errorLogs.push(error);
      this.loggingApiService.logError(error).pipe(take(1))
        .subscribe();
    }
  }
}

