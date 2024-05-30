// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';

import { NavigationService } from '../../navigation.service';
import { UserPreference } from '../../../../contracts/models/portal-api/portal-data.model';
import { AppUser } from '../../../../security/model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import * as fromAuth from '../../../state/selectors';
import * as fromUserPreference from '../../../state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import * as fromRoot from '../../../../state/app.state';
import * as actions from '../../state/actions';
import { UserPreferenceState } from '../../../state/reducers/userPreference.reducer';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { LabSettingsDialogComponent } from '../../../components/lab-settings-dialog/lab-settings-dialog.component';
import { UserRole } from '../../../../contracts/enums/user-role.enum';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { UnityNextTier } from '../../../../contracts/enums/lab-location.enum';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import { LanguageDialogComponent } from '../../../../shared/components/language-dialog/language-dialog.component';
import { FeatureFlagsService } from '../../../../shared/services/feature-flags.service';

@Component({
  selector: 'unext-nav-bar-setting',
  templateUrl: './nav-bar-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./nav-bar-setting.component.scss']
})
export class NavBarSettingComponent implements OnInit, OnChanges, OnDestroy {
  currentUser: AppUser = null;
  currentAccountNumber: string;
  currentAccountId: string;
  currentLocationId: string;
  userRole: string[];
  protected cleanUp$ = new Subject<boolean>();
  userPreferenceSubscription: Subscription;
  userPreference: UserPreference;
  hasTests = false;
  overlapTrigger = true;
  isLabSetupCompleted = false;
  locationNode: LabLocation = null;
  isPeerQc: boolean;
  hasOnlyLotViewerLicence: boolean;
  ctsUserLaunchLab = false;
  isFeatureFlagActive: boolean;
  permissions = Permissions;

  public getCurrentLabLocation$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation));
  @Input() navIconName: string;
  @Input() hasConnectivityLicense: boolean;
  @Input() migrationPending: boolean;
  @Input() userLabId: string;
  @Input() userLocationId: string;
  @Input() userRoles: UserRole;
  @Input() hasNonBrLicense: boolean;

  constructor(
    private navigationService: NavigationService,
    private store: ngrxStore.Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    protected dialog: MatDialog,
    private translateService: TranslateService,
    private featureFlagsService: FeatureFlagsService
  ) { }

  ngOnInit() {
    this.initializeListeners();
    this.currentUserInfo();

    this.getCurrentLabLocation$
      .pipe(filter(getLocationState => !!getLocationState), takeUntil(this.cleanUp$))
      .subscribe((labLocation) => {
        if (labLocation) {
          const unityNextTier = labLocation.unityNextTier;

          this.ctsUserLaunchLab = true;
          this.locationNode = labLocation;
          this.hasOnlyLotViewerLicence = this.locationNode.lotViewerLicense === 1 && unityNextTier !== UnityNextTier.PeerQc
            && unityNextTier !== UnityNextTier.DailyQc;
          if (!!labLocation?.locationSettings) {
            this.isLabSetupCompleted = labLocation.locationSettings.isLabSetupComplete;
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.migrationPending && changes.migrationPending.currentValue) {
      this.migrationPending = changes.migrationPending.currentValue;
    }
  }
  initializeListeners() {
    if (this.featureFlagsService.hasClientInitialized()) {
      this.isFeatureFlagActive = this.featureFlagsService.getFeatureFlag('localization-toggle', false);
    } else {
      this.featureFlagsService.getClient().on('initialized', () => {
        const valueFlag = this.featureFlagsService.getFeatureFlag('localization-toggle');
        this.isFeatureFlagActive = valueFlag;
      });
    }
  }
  currentUserInfo() {
    // Listen to current user
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(
        filter(authState => {
          return !!(authState && authState.currentUser
            && (authState.currentUser.accountNumber && authState.directory));
        }),
        take(1),
        switchMap(authState => {
          try {
            const authStateCurrentUser = authState.currentUser;
            this.currentUser = authStateCurrentUser;
            this.currentAccountNumber = authStateCurrentUser.accountNumber;
            this.currentAccountId = authStateCurrentUser.accountId;

            this.userRole = this.currentUser.roles;
            // If new User, location might not be set to the user yet
            if (authStateCurrentUser.labLocationId) {
              this.currentLocationId = authStateCurrentUser.labLocationId;
            }
          } catch (error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
                (componentInfo.NavBarSettingComponent + blankSpace + Operations.FetchAuthState)));
          }

          this.hasTests = this.searchForTests(authState.directory);
          return this.store.pipe(ngrxStore.select(fromUserPreference.getUserPreferenceState));
        }), takeUntil(this.cleanUp$)
      )
      .subscribe((userPreferenceState: UserPreferenceState) => {
        if (userPreferenceState && userPreferenceState.userPreference) {
          this.userPreference = userPreferenceState.userPreference;
        }
      });
  }

  // currentNode is any type for now because of flexible hierarchy.
  public searchForTests(currentNode: any): boolean {
    // use a recursive post-order DFS to find tests
    let hasTests = false;
    if (!hasTests && currentNode) {
      if (currentNode.children && currentNode.children.length) {
        for (const node of currentNode.children) {
          if (node && node.nodeType === EntityType.LabTest) {
            hasTests = true;
            break;
          } else {
            hasTests = hasTests || this.searchForTests(node);
          }
        }
      } else if (currentNode.nodeType && currentNode.nodeType === EntityType.LabTest) {
        hasTests = true;
      }
    }
    return hasTests;
  }

  getCurrentLanguage(): string {
    const currentLanguage = this.translateService.currentLang.toLocaleLowerCase();
    return currentLanguage;
  }

  routeToHelpCenter() {
    const currentLang = this.getCurrentLanguage();
    window.open(`assets/pdf/reference_guide/UN_Reference_Guide_${currentLang}.pdf`, '_blank');
  }

  routeToHelpCenterSP() {
    window.open('https://www.qcnet.com/LinkClick.aspx?fileticket=_mgKHBh47co%3d&portalid=0');
  }

  navigateToUserManagement() {
    this.navigationService.routeToUserManagement(this.userLabId);
  }

  navigateToConnectivityMapping() {
    this.navigationService.routeToMapping(this.userLabId);
  }

  navigateToFileUpload() {
    this.navigationService.routeToFileUpload(this.userLabId);
  }

  navigateToAccountManagement() {
    this.navigationService.routeToAccountManagement();
  }

  navigateToBioRadUserManagement() {
    this.navigationService.routeToBioRadUserManagement();
  }

  navigateToDashboard() {
    this.navigationService.routeToDashboard();
  }

  navigateToManageControls(){
    this.navigationService.navigateToManageControls();
  }

  openLabSettingsDialog() {
    const dialogRef = this.dialog.open(LabSettingsDialogComponent, {
      width: '440px',
      height: 'auto',
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().pipe(
      take(1)
      ).subscribe(result => {
      if (result) {
        const accountSettings = result;
        try {
          this.store.dispatch(actions.LabSetupDefaultsActions.saveAccountSettings({ accountSettings, navigate: false }));
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.NavBarSettingComponent + blankSpace + Operations.OpenLabSettingsDialog)));
        }
      }
    });
  }

  openLabLanguageDialog() {
    const dialogRef = this.dialog.open(LanguageDialogComponent, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: {}
    });
  }

  openTermsOfUse() {
    const currentLang = this.getCurrentLanguage();
    window.open(`assets/pdf/terms_of_use/UN_Terms_Of_Use_${currentLang}.pdf`, '_blank');
  }

  openReleaseNotes() {
    const currentLang = this.getCurrentLanguage();
    window.open(`assets/pdf/release_notes/UN_Release_Notes_${currentLang}.pdf`, '_blank');
  }

  openReleaseNotesSP() {
    window.open('https://www.qcnet.com/LinkClick.aspx?fileticket=K_5jnHMIElk%3d&portalid=0');
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translateService.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy() {
    this.cleanUp$.next(true);
    this.cleanUp$.unsubscribe();
  }
}
