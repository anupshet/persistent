// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { BehaviorSubject, from as observableFrom, of, Observable, Subscription, combineLatest, Subject } from 'rxjs';
import { take, distinctUntilChanged, switchMap, filter, takeUntil, catchError } from 'rxjs/operators';

import { Account } from '../../contracts/models/account-management/account';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { unsubscribe } from '../../core/helpers/rxjs-helper';
import { Utility } from '../../core/helpers/utility';
import { LabSetupService } from '../../shared/services/lab-setup.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import * as fromRoot from '../../state/app.state';
import { AppUser, AuthSession } from '../model';
import * as securityActions from '../state/actions/security.actions';
import { authEventNames, AuthEventService } from './auth.events.service';
import { OktaService } from './okta.service';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { PortalApiService } from '../../shared/api/portalApi.service';
import { User } from '../../contracts/models/user-management/user.model';
import { UserPreferenceAction } from '../../shared/services/user-preference/user-preference.action';
import { MigrationStates } from '../../contracts/enums/migration-state.enum';
import { LocationActions, AccountActions, UserPreferenceActions } from '../../shared/state/actions';
import { LabLocation } from '../../contracts/models/lab-setup';
import { AuthActions } from '../../shared/state/actions';
import { Lab } from '../../contracts/models/lab-setup/lab.model';
import { BrPermissionsService } from './permissions.service';
import { LabAccessPermissions } from '../model/permissions.model';
import { BioRadUserRoles } from '../../contracts/enums/user-role.enum';
import * as actions from '../../state/actions';
import { LocalizationService } from '../../shared/navigation/services/localizaton.service';

const _session = new BehaviorSubject<AuthSession>(null);

@Injectable()
export class AuthenticationService implements OnDestroy {

  redirectUrl: string;

  private session = _session;
  private sessionChanges = this.session
    .asObservable()
    .pipe(distinctUntilChanged());
  authenticationState = new BehaviorSubject<boolean>(false);
  migrationState = new BehaviorSubject<MigrationStates>(MigrationStates.Empty);
  private authEventChangesSubscription: Subscription;
  private loadSessionAndTokenSubscription: Subscription;
  private isAuthenticatedLoadSessionAndTokenSubscription: Subscription;
  private oktaCheckSessionSubscription: Subscription;
  private updateAuthSessionSubscription: Subscription;
  private setAccountSummarySubscription: Subscription;
  private getLabDirectorySubscription: Subscription;
  private tokenRefreshUpdateAuthSessionSubscription: Subscription;
  private migrationStateSubscription: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(
    private okta: OktaService,
    private labSetupService: LabSetupService,
    private authEvent: AuthEventService,
    private userPreferenceAction: UserPreferenceAction,
    private navigationSvc: NavigationService,
    private route: Router,
    private store: Store<fromRoot.State>,
    private portalApi: PortalApiService,
    private brPermissionsService: BrPermissionsService,
    private localizationService: LocalizationService
  ) {
    this.authEventChangesSubscription = authEvent
      .changes()
      .subscribe(changes => {
        if (
          changes &&
          changes.event === authEventNames.AUTH_EVENT_TOKEN_REFRESHED
        ) {
          this.onTokenRefreshed(changes.data);
        } else if (
          // Ensure that if token is error or token not found, logout
          changes &&
          changes.event ===
          (authEventNames.AUTH_EVENT_TOKEN_NOTFOUND ||
            authEventNames.AUTH_EVENT_TOKEN_ERROR)
        ) {
          this.logOut();
        }
      });
  }

  ngOnDestroy() {
    // TODO - an alternative is to have a generic Subscribe[]
    // and loop through if global vars are only being set for
    // unsubscribe usage
    unsubscribe(this.authEventChangesSubscription);
    unsubscribe(this.loadSessionAndTokenSubscription);
    unsubscribe(this.isAuthenticatedLoadSessionAndTokenSubscription);
    unsubscribe(this.oktaCheckSessionSubscription);
    unsubscribe(this.updateAuthSessionSubscription);
    unsubscribe(this.setAccountSummarySubscription);
    unsubscribe(this.getLabDirectorySubscription);
    unsubscribe(this.tokenRefreshUpdateAuthSessionSubscription);
    unsubscribe(this.migrationStateSubscription);

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  clearUserLocalSession() {
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch (e) { }
  }

  getLoginWidget() {
    return this.okta.getWidget();
  }

  authenticate(idToken = null, accessToken = null): Observable<boolean> {
    if (idToken) {
      this.okta.addToken(idToken);
    }

    if (accessToken) {
      this.okta.addAccessToken(accessToken);
    }

    const pr = Utility.promiseFactory<boolean>();

    this.loadSessionAndTokenSubscription = this.loadSessionAndToken().subscribe(
      result => {
        if (result) {
          this.authEvent.raise(authEventNames.AUTH_EVENT_AUTHENTICATED);
          pr.resolve(true);
        } else {
          pr.resolve(false);
        }
      }
    );

    return observableFrom(pr.promise);
  }

  refreshToken() {
    const pr = Utility.promiseFactory<boolean>();

    this.okta
      .refreshToken()
      .then(newToken => {
        pr.resolve(true);
      })
      .catch(error => {
        pr.reject(error);
      });
    return observableFrom(pr.promise);
  }

  isAuthenticated(): Observable<boolean> {
    const pr = Utility.promiseFactory<boolean>();
    const result = observableFrom(pr.promise);

    const currentSession = this.session.getValue();
    this.okta.getToken().then((token) => {
      if (token && currentSession && currentSession.sessionToken && currentSession.jwtToken && currentSession.user) {
        pr.resolve(true);
      } else {
        this.isAuthenticatedLoadSessionAndTokenSubscription = this.loadSessionAndToken().subscribe((loadResult: boolean) => {
          pr.resolve(loadResult);
        });
      }
    });
    return result;
  }

  logOut(): Observable<boolean> {
    this.clearUserLocalSession();
    if (this.route.url.indexOf(unRouting.login) === -1) {
      this.route.navigate([unRouting.login]);
    }
    const pr = Utility.promiseFactory<boolean>();
    this.okta.signOut(() => {
      this.session.next(null);
      this.okta.removeToken();
      pr.resolve(true);
      this.authEvent.raise(authEventNames.AUTH_EVENT_LOGOUT);
    });
    this.authenticationState.next(false);
    return observableFrom(pr.promise);
  }

  getCurrentUser(): AppUser {
    const currentSession = this.session.getValue();
    if (currentSession && currentSession.user) {
      return currentSession.user;
    }
    return null;
  }

  getIdToken(): Observable<any> {
    const pr = Utility.promiseFactory<any>();
    const currentSession = this.session.getValue();
    if (
      currentSession &&
      currentSession.jwtToken &&
      currentSession.jwtToken.idToken
    ) {
      pr.resolve(currentSession.jwtToken.idToken);
    }

    this.okta.getToken().then((token) => {
      if (token) {
        pr.resolve(token.idToken);
      } else {
        pr.resolve(null);
      }
    });
    return observableFrom(pr.promise);
  }

  getAccessToken(): Promise<string> {
    return new Promise(resolve => {
      const currentSession = this.session.getValue();
      if (currentSession?.user?.accessToken) {
        resolve(currentSession.user.accessToken.accessToken);
      }

      this.okta.getAccessToken().then((token) => {
        resolve(token ? token.accessToken : null);
      }).catch((error) => {
        resolve(null);
      });
    });
  }

  getSessionChanges() {
    return this.sessionChanges;
  }

  getSessionValue() {
    return this.session.getValue();
  }

  private loadSessionAndToken(): Observable<boolean> {
    const pr = Utility.promiseFactory<boolean>();

    this.oktaCheckSessionSubscription = this.okta
      .checkSession().pipe(
        take(1))
      .subscribe(session => {
        let hasAuthData = true;
        this.okta.getToken().then((token) => {
          if (!token) {
            this.authEvent.raise(authEventNames.AUTH_EVENT_TOKEN_NOTFOUND);
            hasAuthData = false;
          }

          if (!hasAuthData) {
            this.updateAuthSession();
            this.okta.removeToken();
            pr.resolve(false);
            return;
          }

          if (token) {
            this.authEvent.raise(authEventNames.AUTH_EVENT_SESSION_LOADED);
            this.updateAuthSessionSubscription = this.updateAuthSession(
              token,
              session
            ).subscribe(result => {
              pr.resolve(result);
            });
          }
        });
      });

    return observableFrom(pr.promise);
  }

  private updateAuthSession(token = null, session = null): Observable<boolean> {
    const pr = Utility.promiseFactory<boolean>();

    if (!token && !session) {
      this.session.next(null);
      this.authenticationState.next(false);
      pr.resolve(false);
      return observableFrom(pr.promise);
    }

    let currentAuth = this.session.getValue();
    if (!currentAuth) {
      currentAuth = new AuthSession();
    }

    if (session) {
      currentAuth.sessionToken = session;
    }

    if (token) {
      currentAuth.jwtToken = token;
      this.createAppUserFromToken(token).then((user: AppUser) => {
        currentAuth.user = user;
        this.fetchUserNode(currentAuth, pr);
      });
    } else {
      this.fetchUserNode(currentAuth, pr);
    }
    return observableFrom(pr.promise);
  }

  private fetchUserNode(currentAuth: AuthSession, pr: { promise: Promise<boolean>; resolve: any; reject: any; }) {
    const user = Object.assign({}, currentAuth.user);

    // Allow Chrome incognito usage (possibly temporary bug with RxJs subscribeTo.js)
    this.portalApi.searchLabSetupNode<User>(User, user.userOktaId).pipe(
      catchError(error => of(null)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(userNode => {
      if (userNode && userNode.length) {
        const currentUser = userNode[0];
        const userPreference = currentUser.preferences;
       this.localizationService.setLanguage(currentUser);
        user.id = currentUser.id;
        if (currentUser.defaultLabLocation && currentUser.labLocation && currentUser.labLocation.length > 0) {
          const defaultLabLocation = currentUser.labLocation.find(l => l.id === currentUser.defaultLabLocation);
          this.store.dispatch(LocationActions.setCurrentLabLocation({ currentLabLocation: defaultLabLocation }));
        }
        // preference from search/User call is added into store for later use
        this.store.dispatch(UserPreferenceActions.UpdateUserPreference({ payload: userPreference }));
        if (currentUser.parentAccounts && currentUser.parentAccounts.length) {
          const account = currentUser.parentAccounts[0];
          if (user && !user.roles) {
            user.roles = currentUser.userRoles;
          }

          if (currentUser && currentUser.hasOwnProperty('permissions')) {
            user.permissions = currentUser.permissions;
          }

          if (account === null) {
            if (user.roles.indexOf(BioRadUserRoles.BioRadManager) >= 0) {
              this.logInSessionAndState(currentAuth, user);
              pr.resolve(true);
            } else {
              this.logOutSessionAndState();
              pr.resolve(false);
            }
          } else {
            const licenseHasExpired = this.hasLicenseExpired(account, user);
            if (!licenseHasExpired) {
              user.accountId = account.id; // Attach account id to user
              this.logInSessionAndState(currentAuth, user);
              pr.resolve(true);
            } else {
              this.forceLogOutWithLicenseExpiredMessage();
              this.logOutSessionAndState();
              pr.resolve(false);
            }
          }
        } else {
          this.logInSessionAndState(currentAuth, user);
          pr.resolve(true);
        }
      } else {
        this.logOutSessionAndState();
        // Leave this as a console error so it is prominently displayed. It will indicate case where we cannot get
        // user or account info for a particular Okta user.
        console.error('Unable to retrieve user node and account for user by oktaId.', user);
        pr.resolve(false);
      }
    });
  }

  isAccountManagerOnly(user: AppUser): boolean {
    if (user === null) {
      return false;
    }

    const roles = user.roles;
    return (
      roles.indexOf(BioRadUserRoles.BioRadManager) >= 0);
  }

  hasLicenseExpired(account: Account, user: AppUser = null): boolean {
    if (user === null) {
      user = this.getCurrentUser();
    }

    if (!account) {
      return false;
    }

    // If not ready or Account Manager, then disregard.
    if (account === null || !user?.roles || !user?.roles?.length || this.isAccountManagerOnly(user)) {
      return false;
    }

    const today = new Date();
    const licenseExpDate = new Date(account.licenseExpirationDate);
    licenseExpDate.setHours(23, 59, 59, 99);
    return today > licenseExpDate;
  }

  private logInSessionAndState(currentAuth: AuthSession, currentUser: AppUser) {
    const updatedUser = this.createNewAppUser(currentUser, currentUser?.labLocationId, currentUser?.labLocationIds, currentUser?.id);
    this.store.dispatch(AuthActions.RestoreUserFromToken({ payload: updatedUser }));
    this.store.dispatch(securityActions.UserTokenRefreshed({ payload: updatedUser }));


    const newSession = Object.assign({}, currentAuth, new AuthSession());
    newSession.user = currentUser;
    this.session.next(newSession);
    this.authenticationState.next(true);

    this.updateUserAccessDirectory(currentAuth, currentUser);
  }

  private logOutSessionAndState() {
    this.logOut();
    this.session.next(null);
    this.authenticationState.next(false);
  }

  private createAppUserFromToken(token): Promise<AppUser> {
    return new Promise(resolve => {
      this.okta.getAccessToken().then((accessToken) => {
        const parsedToken = JSON.parse(atob(accessToken.accessToken.split('.')[1]));
        let user: AppUser = null;
        if (token && token.claims) {
          user = new AppUser({
            firstName: token.claims.UserFirstName,
            lastName: token.claims.UserLastName,
            email: token.claims.email,
            userOktaId: token.claims.UserId,
            roles: token.claims.UserRoles || null,
            accessToken: accessToken,
          });
        } else {
          // no claims, so parse manually
          user = new AppUser({
            firstName: parsedToken.UserFirstName,
            lastName: parsedToken.UserLastName,
            email: parsedToken.UserEmail,
            userOktaId: parsedToken.uid,
            roles: parsedToken.UserRoles || null,
            accessToken: accessToken,
          });
        }
        // These two statements need to execute, else 401 invalid header
        // when attempting to make API calls
        this.store.dispatch(AuthActions.RestoreUserFromToken({ payload: user }));
        this.store.dispatch(securityActions.UserTokenRefreshed({ payload: user }));

        resolve(user);
      }).catch((error) => {
        resolve(null);
        // TODO: implement error logger here.
      });
    });
  }

  private updateUserAccessDirectory(currentAuth: AuthSession, user: AppUser) {
    // skip this for lotviewer and QCP roles since there is no lab associated to them
    if (user.accountId && user.roles && user.roles.length > 0 && !user.roles.includes(BioRadUserRoles.QCPUser)
     && this.hasPermissionToAccess(LabAccessPermissions)) {
      // TODO: Stop use of full-tree call once new navigation and lab-setup module is in place.
      this.labSetupService.getLabDirectory(EntityType.Account, user.accountId).pipe(
        switchMap(directoryResponse => {
          const directoryResponse$ = of(directoryResponse);
          const userNode$: Observable<User[]> = this.portalApi.searchLabSetupNode<User>(User, user.userOktaId);
          return combineLatest(directoryResponse$, userNode$);
        }),
        filter(([directoryResponse, userNode]) => (directoryResponse && directoryResponse.children &&
          userNode && userNode.length > 0 && userNode[0].userRoles && userNode[0].parentAccounts[0].accountNumber) ? true : false),
        takeUntil(this.ngUnsubscribe),
        switchMap(([directoryResponse, userNode]) => {
          const userId = this.getUserNode(directoryResponse.children, user.userOktaId).id;

          this.store.dispatch(AuthActions.UpdateLabDirectory({ payload: directoryResponse }));
          this.store.dispatch(securityActions.UpdateLabDirectory({ payload: directoryResponse }));

          // Set location state
          const defaultLabLocationId: string = userNode[0].defaultLabLocation;
          const LabLocationIds = [];
          // Set all assigned Lab Location Ids in state.
          if (userNode[0].labLocation) {
            userNode[0].labLocation.forEach(el => LabLocationIds.push(el.id));
          }
          const userLab: Lab[] = directoryResponse.children.filter(c => c.nodeType === EntityType.Lab);
          let defaultLabLocation: LabLocation;
          userLab.forEach(el => {
            const node = el.children?.find(ele => ele.id === defaultLabLocationId);
            if (node) {
              defaultLabLocation = node;
              return;
            }
          });
          this.store.dispatch(LocationActions.setCurrentLabLocation({ currentLabLocation: defaultLabLocation }));

          // Map directory obj to account object. Only include relevant summary properties.
          const account = {
            accountAddress: directoryResponse['accountAddress'],
            accountAddressId: directoryResponse['accountAddressId'],
            accountContact: directoryResponse['accountContact'],
            accountContactId: directoryResponse['accountContactId'],
            accountLicenseType: directoryResponse['accountLicenseType'],
            accountNumber: directoryResponse['accountNumber'],
            comments: directoryResponse['comments'],
            displayName: directoryResponse['displayName'],
            formattedAccountNumber: directoryResponse['formattedAccountNumber'],
            id: directoryResponse.id.toString(),
            licenseAssignDate: directoryResponse['licenseAssignDate'],
            licenseExpirationDate: directoryResponse['licenseExpirationDate'],
            licenseNumberUsers: directoryResponse['licenseNumberUsers'],
            licensedProducts: directoryResponse['licensedProducts'],
            migrationStatus: String(directoryResponse['migrationStatus'] || MigrationStates.Empty).trim().toLowerCase(),
            nodeType: directoryResponse['nodeType'],
            orderNumber: directoryResponse['orderNumber'],
            parentNodeId: directoryResponse['parentNodeId'],
            primaryUnityLabNumbers: directoryResponse['primaryUnityLabNumbers'],
            sapNumber: directoryResponse['sapNumber'],
            usedArchive: directoryResponse['usedArchive']
          } as Account;


          // TODO (20200220): Clearing out primnaryUnityLabNumbers if account already exists, to prevent retrigger of migration State
          if (account.id.length + account.accountNumber.length + account.formattedAccountNumber.length > 0) {
            account.primaryUnityLabNumbers = null;
          }

          this.store.dispatch(AccountActions.setAccount({ account }));
          this.migrationState.next(account.migrationStatus);
          user.roles = userNode[0].userRoles;

          const appUser = {
            ...user,
            accountNumber: account.accountNumber,
            accountNumberArray: [account.accountNumber]
          };
          const updatedUser = this.createNewAppUser(appUser, defaultLabLocationId, LabLocationIds, userId);
          this.store.dispatch(AuthActions.RestoreUserFromToken({ payload: updatedUser }));
          this.store.dispatch(securityActions.UserTokenRefreshed({ payload: updatedUser }));

          const newSession = Object.assign({}, currentAuth, new AuthSession());
          newSession.user = updatedUser;

          this.session.next(newSession);
          this.authenticationState.next(true);
          return this.userPreferenceAction.getUserPreference();
        }),
        filter(userPreference => userPreference ? true : false),
        takeUntil(this.ngUnsubscribe)
      )
        .subscribe(userPreference => {
          // TODO: Restore after back-end call for saving user preferences is up and running.
          // const up = <UserPreference>userPreference;
          // if (up && up.lastSelectedEntityId) {
          this.userPreferenceAction.updateIsLoading(false);
          // }
        });
    } else {
      this.portalApi.searchLabSetupNode<User>(User, user.userOktaId).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(userNodes => {
          if (userNodes && userNodes.length > 0) {
            user.roles = userNodes[0].userRoles;
            user.labLocationId = userNodes[0].labLocation ? userNodes[0].labLocation[0]?.id : null;
            user.allowedShipTo = userNodes[0].allowedShipTo;
            user.permissions = userNodes[0].permissions;
            user.id = userNodes[0].id;
            this.store.dispatch(AuthActions.RestoreUserFromToken({ payload: user }));
            this.store.dispatch(securityActions.UserTokenRefreshed({ payload: user }));
            const newSession = Object.assign({}, currentAuth, new AuthSession());
            newSession.user = user;

            this.session.next(newSession);
            this.authenticationState.next(true);
          }
          this.navigationSvc.routeToDashboard();
        });
    }
  }

  private getUserNode(users: User[], userOktaId: string): User {
    return users.find(usr => usr.nodeType === EntityType.User && userOktaId === usr.userOktaId);
  }

  private createNewAppUser(
    user: AppUser,
    labLocationId: string,
    labLocationIds: string[],
    userId: string
  ): AppUser {
    // TODO: Just clone new user from existing.
    return new AppUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userOktaId: user.userOktaId,
      roles: user.roles,
      accessToken: user.accessToken,
      accountNumber: user.accountNumber,
      accountId: user.accountId,
      accountNumberArray: user.accountNumberArray,
      labLocationId: labLocationId,
      labLocationIds: labLocationIds,
      displayName: user.displayName,
      permissions: user.permissions,
      userData: user.userData,
      userName: user.userName,
      id: userId,
    });
  }

  private onTokenRefreshed(newToken) {
    if (newToken) {
      this.tokenRefreshUpdateAuthSessionSubscription = this.updateAuthSession(
        newToken
      ).subscribe(result => {
        if (!result) {
          this.forceLogOutWithLicenseExpiredMessage();
        }
      });
    }
  }

  forceLogOutWithLicenseExpiredMessage() {
    this.navigationSvc.navigateToLoginWithQueryParams({
      queryParams: { licenseExpired: true }
    });
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

}
