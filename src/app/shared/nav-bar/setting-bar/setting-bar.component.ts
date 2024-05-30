// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest } from 'rxjs';
import { filter, switchMap, takeUntil, take, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import * as ngrxStore from '@ngrx/store';
import * as fromRoot from '../../../state/app.state';
import * as fromAuth from '../../state/selectors';
import * as fromUserPreference from '../../state/selectors';
import * as sharedStateSelector from '../../state/selectors';
import * as navigationStateSelector from '../../../shared/navigation/state/selectors';

import { AppLoggerService } from '../../services/applogger/applogger.service';
import { LicensedProductType } from '../../../contracts/enums/licensed-product-type.enum';
import { NavigationService } from '../../navigation/navigation.service';
import { ReleaseNoteComponent } from './release-note/release-note.component';
import { UserMessagesDialogComponent } from './tos-modal/user-messages-modal-dialog.component';
import { UserMessage } from '../../../contracts/models/user-preference/user-message.model';
import { AuthenticationService } from '../../../security/services';
import { UserPreference } from '../../../contracts/models/portal-api/portal-data.model';
import { UserPreferenceAction } from '../../services/user-preference/user-preference.action';
import { AuthState } from '../../state/reducers/auth.reducer';
import { BioRadUserRoles } from '../../../contracts/enums/user-role.enum';

const TERMS_OF_USE_FILE = 'terms_of_use';
const RELEASE_NOTES_PATH = 'unitynextreleasenotes';

@Component({
  selector: 'unext-setting-bar',
  templateUrl: './setting-bar.component.html',
  styleUrls: ['./setting-bar.component.scss']
})
export class SettingBarComponent implements OnInit, OnDestroy {

  userLabId: string;
  userLocationId: string;
  userOktaId: string;
  userPreference: UserPreference;
  hasConnectivityLicense = false;
  userMessages: Array<Partial<UserMessage>> = [];
  isMessageModalOpen = false;
  private userId: string;
  bioRadUserRoles = BioRadUserRoles;
  showTermsForExternal: boolean;
  selectedLang: any = { lcid: 'en-US' };

  private destroy$ = new Subject<boolean>();

  getAccountState = this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentAccount));
  getUserPreference = this.store.pipe(ngrxStore.select(fromUserPreference.getUserPreferenceState));
  getLocale = this.store.pipe(ngrxStore.select(navigationStateSelector.getLocale));

  constructor(
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private store: ngrxStore.Store<fromRoot.State>,
    private appLogger: AppLoggerService,
    public authService: AuthenticationService,
    public navigationSvc: NavigationService,
    public translateService: TranslateService,
    private userPreferenceAction: UserPreferenceAction
  ) {}

  ngOnInit() {
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => authState && authState.isLoggedIn && authState.currentUser ? true : false),
        switchMap((authState: AuthState) => {
          const user = authState.currentUser;
          if (user.roles && user.roles.length) {
            authState.currentUser.roles.forEach(roleList => {
              if (roleList.includes(BioRadUserRoles.LotViewerSales)) {
                this.showTermsForExternal = false;
                this.appLogger.log('Has LotViewerSales Role: ');
              } else if (roleList.includes(BioRadUserRoles.BioRadManager)) {
                this.showTermsForExternal = false;
                this.appLogger.log('Has BioRadManager Role: ');
              } else if (roleList.includes(BioRadUserRoles.CTSUser)) {
                this.showTermsForExternal = false;
                this.appLogger.log('Has CTSUser Role: ');
              } else if (roleList.includes(BioRadUserRoles.QCPUser)) {
                this.showTermsForExternal = false;
                this.appLogger.log('Has QCPUser Role: ');
              } else {
                this.showTermsForExternal = true;
              }
            });
          }

          this.userLabId = user.accountNumber;
          this.userLocationId = user.labLocationId;
          this.userOktaId = user.userOktaId;
          this.userId = user.id;
          this.appLogger.log('user', this.userLabId);

          this.getAccountState.pipe(filter(account => !!account), take(1)).subscribe(accountState => {
            const licensedProducts =
              accountState === null
                ? null
                : accountState.licensedProducts;
            if (licensedProducts && licensedProducts.length > 0) {
              for (const product of licensedProducts) {
                // TODO: use switch when more products are added
                if (
                  product.hasOwnProperty('product') &&
                  product.product === LicensedProductType.Connectivity &&
                  product.hasOwnProperty('fileOption') &&
                  product.fileOption === 1
                ) {
                  this.hasConnectivityLicense = true;
                }
              }
            }
          });

          return combineLatest([this.getUserPreference, this.getLocale]);
        })
      )
      .pipe(
        debounceTime(0),
        filter(([userPreferenceState, lang]) => Boolean(userPreferenceState?.userPreference) && Boolean(lang)),
        takeUntil(this.destroy$)
      ).subscribe(([userPreferenceState, lang]) => {
        this.selectedLang = lang;
        this.userPreference = userPreferenceState.userPreference;
        this.userId = this.userPreference.id;
        // Accepting terms should be skipped for Bio-Rad internal users
          if (!this.isMessageModalOpen && !this.userPreference.termsAcceptedDateTime && this.showTermsForExternal) {
            this.userMessages = this.getUserMessages();
            if (this.userMessages[0].message) {
              this.openMessagesModal();
            }
          }

      });
  }

  getUserMessages(): Partial<UserMessage>[] {
    const languageCode = this.selectedLang.value;
    const baseUrl = 'https://www.qcnet.com';
    const termOfUseFile = languageCode === 'en' ? `${TERMS_OF_USE_FILE}.pdf` : `${TERMS_OF_USE_FILE}_${languageCode}.pdf`;
    const releaseNotesPath = languageCode === 'en' ? `${RELEASE_NOTES_PATH}` : `${RELEASE_NOTES_PATH}_${languageCode}`;
    const termAndConditionMessage = {
      message: this.getTranslation('USER.YOUAGREE'),
      linkText: this.getTranslation('USER.TERMS'),
      linkUrl: `${baseUrl}/portals/0/unity%20next/${termOfUseFile}`,
      requiresUserAction: true,
      updatedOn: new Date('03/02/2019')
    };
    const releaseNotesMessage = {
      message: this.getTranslation('USER.YOUREAD'),
      linkText: this.getTranslation('USER.RELEASENOTES'),
      linkUrl: `${baseUrl}/${releaseNotesPath}`,
      requiresUserAction: false,
      updatedOn: new Date('01/01/1971')
    };
    const acceptedDate = this.userPreference.termsAcceptedDateTime ? new Date(this.userPreference.termsAcceptedDateTime).getTime() : 0;
    return [termAndConditionMessage, releaseNotesMessage].filter(userMessage =>
      userMessage.requiresUserAction && userMessage.updatedOn.getTime() > acceptedDate);
  }

  openMessagesModal() {
    this.isMessageModalOpen = true; // record modal is open
    const dialogRef = this.dialog.open(UserMessagesDialogComponent, {
      panelClass: 'modal-parsing',
      backdropClass: 'modal-parsing',
      data: {
        userMessages: this.userMessages
      },
      autoFocus: true,
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMessageModalOpen = false; // record modal is closed
        if (result) {
          const userPrefSubmit: UserPreference = {
            id: this.userId,
            entityType: this.userPreference.entityType,
            lastSelectedEntityId: this.userPreference.lastSelectedEntityId,
            lastSelectedEntityType: this.userPreference.lastSelectedEntityType,
            termsAcceptedDateTime: new Date(), // agreed upon date is recorded
            userMessages: null // TODO: Need to send userMessages later
          };
          this.userPreferenceAction.updateUserPreference(userPrefSubmit);

          this.userMessages = []; // user messages have been addressed
        } else {
          this.dialog.closeAll();
          this.authService.logOut();
          this.navigationSvc.navigateToLogin();
        }
      });
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translateService.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  // #region component's template event handlers
  navigateToLabSetup() {
    this.navigationService.routeToLabManagement(
      this.userLocationId,
      this.userLabId
    );
  }

  navigateToConnectivityMapping(event) {
    this.navigationService.routeToMapping(this.userLabId);
  }

  navigateToFileUpload() {
    this.navigationService.routeToFileUpload(this.userLabId);
  }

  navigateToAccountManagement() {
    this.navigationService.routeToAccountManagement();
  }

  navigateToDashboard() {
    this.navigationService.routeToDashboard();
  }

  openDialog() {
    this.dialog.open(ReleaseNoteComponent);
  }

  openTermsOfUse() {
    const url = this.userMessages.find(userMessage => userMessage.linkUrl.includes(TERMS_OF_USE_FILE))?.linkUrl;
    if (url) {
      window.open(url);
    }
  }

  openReleaseNotes() {
    const url = this.userMessages.find(userMessage => userMessage.linkUrl.includes(RELEASE_NOTES_PATH))?.linkUrl;
    if (url) {
      window.open(url);
    }
  }
  // #endregion
}
