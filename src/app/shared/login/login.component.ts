// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { take, filter, switchMap, takeUntil, debounceTime } from 'rxjs/operators';
import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';

import * as fromRoot from '../../state/app.state';
import { AuthenticationService } from '../../security/services';
import * as sharedStateSelector from '../../shared/state/selectors';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { Cookies } from '../../core/helpers/cookies-helper';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { AuditTracking, AuditTrackingActionStatus, AuditTrackingAction } from '../models/audit-tracking.model';
import { LoggingApiService } from '../api/logging-api.service';
import { NavigationService } from '../navigation/navigation.service';
import { ErrorLoggerService } from '../services/errorLogger/error-logger.service';
import { OktaSessionService } from '../services/okta-session.service';
import { AppNavigationTrackingService } from '../services/appNavigationTracking/app-navigation-tracking.service';
import { HttpErrorService } from '../../security/services/http-errors.service';
import { Icon } from '../../contracts/models/shared/icon.model';
import { icons } from '../../core/config/constants/icon.const';
import { IconService } from '../icons/icons.service';
import { FeatureFlagsService } from '../services/feature-flags.service';
import { SecurityConfigService } from '../../security/security-config.service';

@Component({
  selector: 'unext-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginWidget: any;
  public isAuthenticated: boolean;
  public hasLicenseExpired: boolean;
  private destroy$ = new Subject<boolean>();
  public isIE11 = false;
  public getAccountState$ = this.store.pipe(select(sharedStateSelector.getCurrentAccount));
  icons = icons;
  isLocalizationActive: boolean = false;
  iconsUsed: Array<Icon> = [this.icons.lang[24]];
  isVisible: boolean = true;

  constructor(
    private authService: AuthenticationService,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    protected dialog: MatDialog,
    private loggingApiService: LoggingApiService,
    private securityConfigService: SecurityConfigService,
     private featureFlagsService: FeatureFlagsService,
    @Inject(LOCALE_ID) private serverLocale: string,
    private zone: NgZone,
    private errorLoggerService: ErrorLoggerService,
    public oktaSessionService: OktaSessionService,
    private httpErrorService: HttpErrorService,
    private appNavigationService: AppNavigationTrackingService,
    private iconService: IconService
  ) {

    this.loginWidget = this.authService.getLoginWidget();
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.featureFlagsService.getClient().on('initialized', () => {
      const valueFlag = this.featureFlagsService.getFeatureFlag('localization-toggle');
      this.isLocalizationActive = valueFlag;
      this.securityConfigService.setLocalizationUpdated(this.isLocalizationActive);
    });
    this.isIE11 = !!(window as any).MSInputMethodContext && !!(document as any).documentMode; // tslint:disable-line
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      try {
        this.hasLicenseExpired = !!params['licenseExpired'];
      } catch (error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
            (componentInfo.LoginComponent + blankSpace + Operations.HasLicenseExpired)));
      }
      this.processLogin();
    });
    this.authService.isAuthenticated().pipe(takeUntil(this.destroy$)).subscribe(authenticated => {
      try {
        this.isAuthenticated = authenticated;
        if (!this.isAuthenticated && !Cookies.isCookiesAccepted()) {
          Cookies.displayCookieDisclaimerMessage(this.dialog);
        }
      } catch (error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
            (componentInfo.LoginComponent + blankSpace + Operations.UserAuthenticated)));
      }
      if (authenticated) {
        this.zone.run(() => this.navigationService.routeToDashboard());
      } else if (!!this.activatedRoute.snapshot.queryParams.extlogin) {
        // Determine if we should redirect to the external (Okta) sign-in page.
        this.oktaSessionService.loginRedirect();
      } else {
        this.processLogin();
      }
    });
  }

  processLogin() {

    this.loginWidget.remove();
    this.loginWidget.showSignInToGetTokens({ scopes: ['openid', 'email'] }).then((tokens) => {
      // Store tokens
      let idToken = null;
      let accessToken = null;
      if (tokens) {
        // If the widget is configured for OIDC with multiple responseTypes, the
        // response will contain both the tokens
        if (tokens.hasOwnProperty('idToken')) {
          idToken = tokens.idToken;
        }
        if (tokens.hasOwnProperty('accessToken')) {
          accessToken = tokens.accessToken;
        }
      }
      this.loginWidget.remove();
      this.zone.run(() =>
        combineLatest([this.authService.authenticate(idToken, accessToken), this.httpErrorService._errorCode$])
          .pipe(debounceTime(0), switchMap(([result, error]: [boolean, string]) => {
            if (!result && error === Operations.NetworkError) {
              this.appNavigationService.logFailedLogin();
            } else if (result) {
              const _auditTracking: AuditTracking = { action: AuditTrackingAction.Login,
                actionStatus: AuditTrackingActionStatus.Pass, resource: '' };
              this.loggingApiService.auditTracking(_auditTracking).then(() => { }).catch((error) => {
                this.errorLoggerService.logErrorToBackend(
                  this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
                    (componentInfo.LoginComponent + blankSpace + Operations.AuditTracking)));
              });
              this.isVisible = false;
              this.navigationService.routeToDashboard(unRouting.login);
              return of(null);
            } else {
              return this.getAccountState$.pipe(filter(account => !!account), take(1));
            }
          }))
          .pipe(filter(result => !!result), takeUntil(this.destroy$)).subscribe(accountState => {
            if (accountState && this.authService.hasLicenseExpired(accountState)) {
              this.authService.forceLogOutWithLicenseExpiredMessage();
            } else {
              this.navigationService.navigateToLogin();
            }
          }));
    }).catch(function (error) {
      // This function is invoked with errors the widget cannot recover from:
      // Known errors: CONFIG_ERROR, UNSUPPORTED_BROWSER_ERROR
      if (this.errorLoggerService) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
            (componentInfo.LoginComponent + blankSpace + Operations.LoginShowSignInToGetTokensFails)));
      }
    });
  }

  // TODO: This method originates within authentication service, should be united as a global function
  clearUserLocalSession() {
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.LoginComponent + blankSpace + Operations.ClearStorage)));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
