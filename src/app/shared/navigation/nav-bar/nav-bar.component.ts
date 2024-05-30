// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as ngrxSelector from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';
import { select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { MigrationStates } from '../../../contracts/enums/migration-state.enum';
import { Lab } from '../../../contracts/models/lab-setup/lab.model';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { unRouting } from '../../../core/config/constants/un-routing-methods.const';
import { AuthenticationService } from '../../../security/services';
import { IconService } from '../../icons/icons.service';
import * as actions from '../state/actions';
import { UserActions } from '../../../state/actions';
import * as fromRoot from './../../../state/app.state';
import { NavigationService } from '../../navigation/navigation.service';
import * as sharedStateSelector from '../../state/selectors';
import * as fromAuth from '../../state/selectors';
import { AuditTracking, AuditTrackingActionStatus, AuditTrackingAction, AppNavigationTracking } from '../../models/audit-tracking.model';
import { LoggingApiService } from '../../api/logging-api.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { OktaSessionService } from '../../services/okta-session.service';
import { ConnectivityTier, UnityNextTier } from '../../../contracts/enums/lab-location.enum';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { LabLocation } from '../../../contracts/models/lab-setup';
import { ConfirmNavigateGuard } from '../../../master/reporting/shared/guard/confirm-navigate.guard';

@Component({
  selector: 'unext-nav-bar-top',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarTopComponent implements OnInit, OnDestroy {

  isLabSetupCompleted = false;
  migrationPending = false;
  userName: string;
  userLocationId: string;
  userLab: Lab[];
  icons = icons;
  routes = unRouting;
  iconsUsed: Array<Icon> = [icons.accountCircle[18],
  icons.settings[24], icons.notificationsNone[24], icons.logo,
  icons.lang[24]
  ];
  hasConnectivityLicense = false;
  hasNonBrLicense = false;
  userRoles: Array<string>;
  labId: string;
  public goToDashboardToolTip: string;
  public goToBioRadToolTip: string;
  public GoToQcnetToolTip: string;
  private destroy$ = new Subject<boolean>();
  permissions = Permissions;
  enableUnityNextLogo = false;
  ctsUserLocationId = '0';
  showLanguageSelector: boolean;

  @Input() version: string;
  xmlData: any = {};

  public getLocationState$ = this.store.pipe(ngrxSelector.select(sharedStateSelector.getCurrentLabLocation));


  constructor(
    private iconService: IconService,
    private meta: Meta,
    private authenticationService: AuthenticationService,
    private navigationService: NavigationService,
    private store: ngrxSelector.Store<fromRoot.State>,
    private loggingApiService: LoggingApiService,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private oktaSessionService: OktaSessionService,
    private appNavigationService: AppNavigationTrackingService,
    private authService: AuthenticationService,
    private confirmNavigate: ConfirmNavigateGuard,
    private router: Router,
    public translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    // Add Meta tag for version number
    if (this.version) {
      this.meta.addTag({ name: 'UnityNextVersion:', content: this.version });
    }

    this.getLocationState$
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$))
      .subscribe(labLocationState => {
        // enables Unity Next Icon to load dashboard
        this.enableUnityNextLogo = true;
        this.ctsUserLocationId = labLocationState.id;
        try {
          this.labId = labLocationState.parentNodeId;
          this.isLabSetupCompleted = labLocationState?.locationSettings?.isLabSetupComplete;
          const migrationState = labLocationState?.migrationStatus?.toLowerCase();
          this.migrationPending =
            !(migrationState === MigrationStates.Completed.valueOf()
              || migrationState === MigrationStates.Empty.valueOf());
          if (labLocationState.connectivityTier === ConnectivityTier.UNConnect ||
            labLocationState.connectivityTier === ConnectivityTier.UNUpload) {
            this.hasConnectivityLicense = true;
            this.setConnectivityLicense();
          } else {
            this.hasConnectivityLicense = false;
          }
          if (labLocationState.unityNextTier === UnityNextTier.DailyQc) {
            this.hasNonBrLicense = labLocationState.addOnsFlags ? labLocationState.addOnsFlags.allowNonBR : false;
            this.store.dispatch(actions.NavBarActions.setHasNonBrLicense({ hasNonBrLicense: this.hasNonBrLicense }));
          }
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.NavBarTopComponent + blankSpace + Operations.FetchCurrentLocation)));
        }
      });

    this.store.pipe(ngrxSelector.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!authState.directory || !!authState.currentUser.roles), takeUntil(this.destroy$))
      .subscribe(authState => {
        try {
          if (authState.directory) {
            this.userLab = authState.directory.children.filter(c => c.nodeType === EntityType.Lab);
          }
          if (authState.currentUser) {
            /* if location is viewed by CTSUser there will be no current user
            lab location, read value from state for launched lab as ctsUserLocationId */
            this.userLocationId = authState.currentUser.labLocationId ? authState.currentUser.labLocationId : this.ctsUserLocationId;
            const combinedName = authState.currentUser.firstName.toString() + ' ' + authState.currentUser.lastName.toString();
            this.userName = combinedName;
            if (this.hasConnectivityLicense) {
              this.setConnectivityLicense();
            }
          }
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.NavBarTopComponent + blankSpace + Operations.FetchAuthState)));
        }
      });
  }

  onLocationChanged(locationId: string): void {
    this.userLocationId = locationId;
    this.navigateToDashboard();
  }

  async navigateToDashboard() {
    if (this.router.url.includes(unRouting.reports)) {
      const result = await this.confirmNavigate.confirmationModal();
      if (!result) {
        return;
      }
      this.navigationService.navigateToDashboard(this.userLocationId);
    } else {
      this.navigationService.navigateToDashboard(this.userLocationId);
    }
  }

  private setConnectivityLicense() {
    if (this.brPermissionsService.hasAccess([this.permissions.ConnectivityEnableDisableUserViewOnly]) && !this.migrationPending) {
      this.store.dispatch(actions.NavBarActions.setConnectivityIconData({ hasConnectivityData: true }));
    }
  }

  logOff(emittedResult: boolean) {
    let locationData: LabLocation;
    this.store
      .pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(
        filter((labLocation) => !!labLocation),
        takeUntil(this.destroy$)
      )
      .subscribe((labLocation) => {
        locationData = labLocation;
      });
    const userOktaId = this.authService.getCurrentUser().userOktaId;
    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: AuditTrackingAction.Logout,
        action: AuditTrackingAction.Logout,
        actionStatus: AuditTrackingActionStatus.Success,
        currentValue: {
          group_id: locationData?.parentNodeId ? locationData.parentNodeId : '',
          groupName: locationData?.groupName ? locationData.groupName : '',
          user_id: userOktaId,
          location_id: locationData?.id ? locationData.id : '',
          locationName: locationData?.labLocationName ? locationData.labLocationName : '',
        },
      },
    };
    if (emittedResult) {
      const _auditTracking: AuditTracking = {
        action: AuditTrackingAction.Logout,
        actionStatus: AuditTrackingActionStatus.Pass,
        resource: ''
      };
      this.loggingApiService.auditTracking(_auditTracking).then(() => { }).catch((error) => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
            (componentInfo.NavBarTopComponent + blankSpace + Operations.AuditTracking)));
      });
      this.userName = null;
      this.userLab = null;
      this.migrationPending = false;
      this.appNavigationService.logAuditTracking(auditNavigationPayload, true);

      setTimeout(() => {
        this.oktaSessionService.logout();
        this.authenticationService.logOut().toPromise().then(() => {
          this.store.dispatch(UserActions.ResetApp());
        }).catch((error) => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.NavBarTopComponent + blankSpace + Operations.UserLogOut)));
        });
      }, 1000);
    }
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
