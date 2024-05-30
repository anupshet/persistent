// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Subscription, Subject } from 'rxjs';
import { takeUntil, delay, tap, filter, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

// TODO: Remove ONLY when fix the following error: ERROR in src/app/master/connectivity/instructions/parsing-engine/parsing-engine
// -adapter.service.ts(25,26): error TS2580: Cannot find name 'require'. Do you need to install type definitions for node?
//  Try `npm i @types/node`.
import { logging } from 'protractor';
import { GaActivitiesService } from './core/google-analytics/ga-activities.service';
import { AppUser } from './security/model';
import { AuthenticationService } from './security/services';
import { MigrationStates } from './contracts/enums/migration-state.enum';
import { version } from '../../package.json';
import { SpinnerService } from './shared/services/spinner.service';
import { VersionCheckService } from './shared/version-check.service';
import {
  accountForm, accountLocationForm, bioRadUserManagementDialog,
  IS_LOCALHOST, logoutWarningTimer, signoutTimer, userManagementDialog
} from './core/config/constants/general.const';
import { getLocationValue, INACTIVE_LOGOUT_AUDIT_TRAIL, INACTIVE_LOGOUT_PAYLOAD } from './shared/models/audit-tracking.model';
import { LoggingApiService } from './shared/api/logging-api.service';
import { ErrorLoggerService } from './shared/services/errorLogger/error-logger.service';
import { componentInfo, Operations } from './core/config/constants/error-logging.const';
import { ErrorType } from './contracts/enums/error-type.enum';
import { UserActions } from './state/actions';
import { LogoutWarningDialogComponent } from './shared/components/logout-warning-dialog/logout-warning-dialog.component';
import { ErrorMessageComponent } from './shared/components/error-message/error-message.component';
import { Cookies } from './core/helpers/cookies-helper';
import { environment } from '../environments/environment';
import * as actions from './state/actions';
import { unRouting } from './core/config/constants/un-routing-methods.const';
import { HttpErrorService } from './security/services/http-errors.service';
import * as sharedStateSelector from './shared/state/selectors';
import { AppNavigationTrackingService } from './shared/services/appNavigationTracking/app-navigation-tracking.service';
import { ConfirmNavigateGuard } from './master/reporting/shared/guard/confirm-navigate.guard';

@Component({
  selector: 'unext-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUser: AppUser;
  loggedIn = false;
  migrationNeeded = false;
  userInactiveWarning;
  userInactiveLogout;
  isWarningDialogOpen: boolean;
  public version: string = version;
  public isPerfectScrollbarEnabled = true;
  public isBusy = false;
  public isIE11 = false;
  private routerSubscription: Subscription;

  private destroy$ = new Subject<boolean>();
  isSideNavExpanded$ = this.store.pipe(select(state => state.navigation.isSideNavExpanded));
  public hideSideNav = true;

  constructor(
    private appNavigationService: AppNavigationTrackingService,
    private authenticationService: AuthenticationService,
    private googleAnalytics: GaActivitiesService,
    public router: Router,
    private store: Store<any>,
    public spinnerService: SpinnerService,
    protected dialog: MatDialog,
    private versionCheckService: VersionCheckService,
    private loggingApiService: LoggingApiService,
    private errorLoggerService: ErrorLoggerService,
    private httpErrorService: HttpErrorService,
    private confirmNavigate: ConfirmNavigateGuard,
    public translate: TranslateService,
  ) {
    if (Cookies.isCookiesAccepted()) {
      if (Cookies.checkCookiesValue('false')) {
        const disableGoogleAnalytics = 'ga-disable-' + environment.googleAnalyticsId;
        window[disableGoogleAnalytics] = true;
      } else {
        this.googleAnalytics.create();
      }
    }

    // this.googleAnalytics.create();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (Cookies.checkCookiesValue('true')) {
          this.googleAnalytics.pageView(event.urlAfterRedirects);
        }
        this.isPerfectScrollbarEnabled = (event['url'].includes('/table')) ? true : false;
      }
    });
    this.setTimeout();
  }

  // TODO: Since we already have an app.effect in place fully wired up with the store, we can move this call there !
  ngOnInit() {
    this.translate.setDefaultLang('en');
    this.initializeErrors();
    this.isIE11 = !!(window as any).MSInputMethodContext && !!(document as any).documentMode; // tslint:disable-line
    this.authenticationService.authenticationState.pipe(
      takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.loggedIn = isLoggedIn;
        this.setTimeout();
      });
    this.authenticationService.migrationState.pipe(
      takeUntil(this.destroy$))
      .subscribe((migrationStatus: MigrationStates) => {
        if (migrationStatus === MigrationStates.Empty || migrationStatus === MigrationStates.Completed) {
          this.migrationNeeded = false;
        } else {
          this.migrationNeeded = true;
        }
      });


    // Only do Version Check if not running in Localhost:4200 (ng serve)
    // npm run build-prod + npx serve dist can still be used to test version
    if (!IS_LOCALHOST) {
      // Version check service configured to check local version.json
      const versionJsonURL = window.location.origin + '/../version.json';

      // Version Check on load
      this.versionCheckService.checkVersion(versionJsonURL);

      // Version Check on navigate
      this.routerSubscription = this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
          this.versionCheckService.checkVersion(versionJsonURL);
        }
      });
    }
  }

  private initializeErrors() {
    this.httpErrorService
      ._errorCode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((errors) => {
        if (errors) {
          const formDialog = this.dialog.openDialogs.find(dialog => (dialog.id === accountForm) ||
            (dialog.id === accountLocationForm) || (dialog.id === bioRadUserManagementDialog)
            || (dialog.id === userManagementDialog));
          if (!formDialog) {
            this.dialog.closeAll();
          }
          const dialogRef = this.dialog.open(ErrorMessageComponent, {
            width: '450px',
            data: errors
          });
        }
      });
  }

  setTimeout() {
    if (this.loggedIn) {
      if (this.userInactiveWarning) {
        clearTimeout(this.userInactiveWarning);
      }
      if (this.userInactiveLogout) {
        clearTimeout(this.userInactiveLogout);
      }
      this.userInactiveWarning = setTimeout(() => this.displayWarningDialog(), logoutWarningTimer);
      this.userInactiveLogout = setTimeout(() => this.relogin(), signoutTimer);
    }
  }

  @HostListener('window:keydown')
  @HostListener('window:click')
  @HostListener('window:mousemove')
  @HostListener('window:keyup') refreshUserState() {
    if (!this.isWarningDialogOpen) {
      this.setTimeout();
    }
  }

  private displayWarningDialog(): void {
    const dialogRef = this.dialog.open(LogoutWarningDialogComponent, {
      width: '450px',
      data: {}
    });
    this.isWarningDialogOpen = true;
    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe(isLogout => {
        isLogout && this.relogin();
        this.isWarningDialogOpen = false;
        this.setTimeout();
      });
  }

  async relogin() {
    if (this.router.url.includes(unRouting.reports)) {
      await this.confirmNavigate.navigateWithoutModal();
    }
    this.dialog.closeAll();
    this.logLogout();
    this.authenticationService.logOut().toPromise()
      .then(() => this.store.dispatch(UserActions.ResetApp()))
      .catch(this.logError(Operations.UserLogOut));
  }

  onActivate(e) {
    setTimeout(() => {
      const componentName = e.constructor.name;
      const path = document.location.href;
     this.isPerfectScrollbarEnabled = (
        componentName === 'AccountManagementComponent' || componentName === 'DataManagementComponent') || (path.includes('/table')
        || componentName === 'ReportingComponent') ? true : false;
    }, 100);

    const hideSideNavBar =
      this.router.url.includes(unRouting.labSetup.labDefault) ||
      this.router.url.includes(unRouting.accountManagement) ||
      this.router.url.includes(unRouting.reporting.newReports) ||
      this.router.url.includes(unRouting.reporting.pastReports) ||
      this.router.url.includes(unRouting.dataReview.review);
    if (hideSideNavBar) {
      this.store.dispatch(actions.NavBarActions.toggleNavigationbar({ isSideNavExpanded: false }));
    } else {
      this.store.dispatch(actions.NavBarActions.toggleNavigationbar({ isSideNavExpanded: true }));
    }

    this.hideSideNav = this.router.url.includes(unRouting.dataReview.review);
  }

  ngAfterViewInit() {
    this.spinnerService.spinnerStatus
      .pipe(
        delay(0),
        tap(displaySpinner => {
          this.isBusy = displaySpinner;
        })
      ).pipe(
        takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  private logError(operation: string): (error) => void {
    operation = `${componentInfo.AppComponent} ${operation}`;
    const service = this.errorLoggerService;
    return function ({ stack, message }) {
      message = `${stack}, message: ${message}`;
      const error = service.populateErrorObject(ErrorType.Script, stack || ' ', message, operation);
      service.logErrorToBackend(error);
    };
  };

  private logLogout() {
    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter((labLocation) => !!labLocation), take(1))
      .subscribe(location => {
        this.loggingApiService.auditTracking(INACTIVE_LOGOUT_PAYLOAD)
          .catch(this.logError(Operations.AuditTracking));
        const currentValue = getLocationValue(location);
        this.appNavigationService.logAuditTracking({ auditTrail: { ...INACTIVE_LOGOUT_AUDIT_TRAIL, currentValue } }, true);
      });
  }
}
