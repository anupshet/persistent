// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { of, Subject, combineLatest } from 'rxjs';
import { debounceTime, filter, takeUntil,  delay, tap} from 'rxjs/operators';
import {
  AfterViewChecked, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Output
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as ngrxStore from '@ngrx/store';

import * as fromRoot from '../../state/app.state';
import { componentInfo, Operations } from '../../core/config/constants/error-logging.const';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { ExpiredItem } from '../../contracts/models/actionable-dashboard/actionableItem.model';
import { LabLocation } from '../../contracts/models/lab-setup';
import { MigrationStates } from '../../contracts/enums/migration-state.enum';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import * as fromSecuritySelector from '../../security/state/selectors';
import { SecurityState } from '../../security/state/reducers/security.reducer';
import { AppUser } from '../../security/model';
import { Permissions } from '../../security/model/permissions.model';
import { DashBoardAccessPermissions } from '../../security/model/permissions.model';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { AuthenticationService } from '../../security/services/authentication.service';
import * as sharedStateSelector from '../../shared/state/selectors';
import * as fromNavigationSelector from '../../shared/navigation/state/selectors';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { AppNavigationTrackingService } from '../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import { getLoginPayload } from '../../../app/shared/models/audit-tracking.model';
import { UserRole, BioRadUserRoles } from '../../contracts/enums/user-role.enum';
import * as fromAuth from '../../shared/state/selectors';
import { AuthState } from '../../shared/state/reducers/auth.reducer';
import { UnityNextTier } from '../../contracts/enums/lab-location.enum';
 
@Component({
  selector: 'unext-actionable-dashboard',
  templateUrl: './actionable-dashboard.component.html',
  styleUrls: ['./actionable-dashboard.component.scss'],
})
export class ActionableDashboardComponent
  implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  firstName: string;
  lastName: string;
  isAuthenticated = false;
  isLabSetupCompleted;
  currentUser: AppUser = null;
  hasExpiringLots = true;
  hasExpiringLicense = true;
  primaryLabNumbers: string;
  labId: string;
  labLocation: LabLocation;
  hasExpiringFlag = true;
  loaderCounter = 0;
  private destroy$ = new Subject<boolean>();
  hasLotViewerLicense = false;
  labMigrationUrl: string;
  hasLotViewer = false;
  userLocationId: string;
  showLocationSelector = false;
  migrationState: string;
  navigationOrigin: string;
  isNoLocationRole = false;
  isViewReady = false;
  unityNextTierDailyQc =  UnityNextTier.DailyQc;
  

  /*
    two commented out selectors below might be originally added for alternative implementation of isAuthStateComplete() and setUser()
  // public getAccountState$ = this.store.pipe(select(sharedStateSelector.getCurrentAccount));
  // public getDirectoryState$ = this.store.pipe(select(fromSecurity.getDirectory));

    the commented out selector below might be originally added for alternative implementation of setLocation()
  // public getLocationState$ = this.store.pipe(select(sharedStateSelector.getLocationState));
  */
  public getSecurityState$ = this.store.pipe(select(fromSecuritySelector.getSecurityState));
  public getIsAccountUserSelectorOn$ = this.store.pipe(select(fromNavigationSelector.getIsAccountUserSelectorOn));
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
  permissions = Permissions;
  
  @Input() isLoading: any;
  @Output() isSalesRole: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthenticationService,
    public changeDetectionRef: ChangeDetectorRef,
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private navigationService: NavigationService,
    private appNavigationService: AppNavigationTrackingService
  ) { }

  ngOnInit() {
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
    .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), takeUntil(this.destroy$))
    .subscribe((authState: AuthState) => {
      if (authState && authState.isLoggedIn && authState.currentUser.roles) {
        this.isNoLocationRole = (
          authState.currentUser.roles.length === 1 &&
          ( authState.currentUser.roles[0] === UserRole.AccountUserManager ||
            authState.currentUser.roles[0] === BioRadUserRoles.BioRadManager ||
            authState.currentUser.roles[0] === BioRadUserRoles.LotViewerSales
          )) ? true : false;
      }
    });

    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => this.navigationOrigin = params.get(unRouting.navigationOrigin));
    this.getIsAccountUserSelectorOn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isVisible => this.showLocationSelector = isVisible);
    combineLatest([
      this.getSecurityState$,
      this.getCurrentLabLocation$,
    ])
      .pipe(
        debounceTime(0),
        filter(([authState, location]: [SecurityState, LabLocation]) =>
          this.isAuthStateComplete(authState) &&
          this.isUserStateComplete(authState) &&
          this.isLocationStateComplete(location)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([authState, location]: [SecurityState, LabLocation]) => {
        try {
          this.setUser(authState);
          if (!this.isNoLocationRole) {
            this.setLocation(location);
          }
          if (this.navigationOrigin === unRouting.login) {
            this.logLogin(location, authState.currentUser);
          }
        } catch (error) {
          this.logError(error);
        }
      });

      const obs = of(true).pipe(delay(5000),
        tap(() => {
          this.isViewReady = true;
        })
      );
      const sub = obs.subscribe(() => {
        sub.unsubscribe();
      })
  }

  ngAfterViewChecked() {
    if (!this.changeDetectionRef['destroyed']) {
      this.changeDetectionRef.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setLoaderFlag(changes.isLoading.currentValue);
  }

  private logLogin(location: LabLocation, user: AppUser) {
    const payload = getLoginPayload({ ...location }, { ...user });
    this.appNavigationService.logAuditTracking(payload, true);
  }

  // #region setters for user, location, and location selector visibility
  private isLocationStateComplete = (location: LabLocation): boolean => {
    if (this.isNoLocationRole) {
      return true;
    } else {
      return Boolean(location?.locationSettings);
    }
  }

  private isUserStateComplete = (authState: SecurityState): boolean =>
    Boolean(authState.currentUser.id);

  private isAuthStateComplete = (authState: SecurityState): boolean =>
    Boolean(authState?.currentUser?.accountNumber) &&
    Boolean(authState?.currentUser?.roles?.length) &&
    Boolean(authState?.directory)
    ||
    this.hasPermissionToAccess(DashBoardAccessPermissions);

  private setLocation(location: LabLocation) {
    this.labLocation = location;
    this.isLabSetupCompleted = location.locationSettings?.isLabSetupComplete;
    this.hasLotViewerLicense = location.lotViewerLicense === 1;
    // Listen to migrationState
    this.migrationState = this.migrationState ?? location.migrationStatus?.toLowerCase();
  }

  private setUser(authState: SecurityState) {
    this.isAuthenticated = Boolean(authState);
    this.currentUser = authState?.currentUser;
    this.firstName = this.currentUser?.firstName;
    this.lastName = this.currentUser?.lastName;
  }

  private logError({ stack }) {
    const message = `${componentInfo.ActionableDashboardComponent} ${Operations.GetUserRoleAndTimeZone}`;
    const error = this.errorLoggerService.populateErrorObject(ErrorType.Script, stack, null, message);
    this.errorLoggerService.logErrorToBackend(error);
    return of(null);
  }
  // #endregion

  // this shows in LINT as unreferenced code, but this is bound to the click event in the HTML for expired lots
  private onExpiryLotsFlagGenerated(hasExpiringLotsFlag: boolean) {
    this.hasExpiringLots = true;
    this.setLoaderFlag(ExpiredItem.hasExpiringLotsFlag);
  }
  public onExpiryLicenceFlagGenerated(hasExpiringLicenseFlag: boolean) {
    this.hasExpiringLicense = hasExpiringLicenseFlag;
    this.setLoaderFlag(ExpiredItem.hasExpiringLicenseFlag);
  }
  private setLoaderFlag(hasExpiringItemFlag: string) {
    if (hasExpiringItemFlag === ExpiredItem.hasExpiringLotsFlag) {
      this.loaderCounter++;
    } else
      if (hasExpiringItemFlag === ExpiredItem.hasExpiringLicenseFlag) {
        this.loaderCounter++;
      } else if (!hasExpiringItemFlag) {
        this.loaderCounter++;
      }
    if (this.loaderCounter === 3) {
      this.hasExpiringFlag = false;
    }
  }

  onLocationChanged(locationId: string): void {
    this.userLocationId = locationId;
    this.navigateToDashboard();
  }

  navigateToDashboard() {
    this.navigationService.navigateToDashboard(this.userLocationId);
  }

  /* checking Permissions */
  hasPermissionToAccess(permissions: Array<number>): boolean {
    return permissions ? this.brPermissionsService.hasAccess(permissions) : false;
  }
  isMigrationCompleted(): boolean {
    if (this.migrationState) {
      return (
        this.migrationState === MigrationStates.Completed ||
        this.migrationState === MigrationStates.Empty.valueOf()
      );
    }
    return true;
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
