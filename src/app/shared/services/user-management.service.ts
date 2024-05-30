// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { User, OKTAUser, UserSearchRequest, AddEditUserRequest, UserPage } from '../../contracts/models/user-management/user.model';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { UserManagementApiService } from '../../shared/api/userManagementApi.service';
import * as fromRoot from '../../state/app.state';
import * as fromAuth from '../state/selectors';
import { AuthState } from '../state/reducers/auth.reducer';
import { ApiService } from '../api/api.service';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { nodeTypeNames } from '../../core/config/constants/general.const';
import { EntityType } from '../../contracts/enums/entity-type.enum';

@Injectable()
export class UserManagementService implements OnDestroy {
  private userData = new BehaviorSubject<Array<User>>([]);
  currentUsers = this.userData.asObservable();
  private labId = '';
  private destroy$ = new Subject<boolean>();

  constructor(
    private userManagementApiService: UserManagementApiService,
    private store: ngrxStore.Store<fromRoot.State>,
    private apiService: ApiService
  ) {
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        this.labId = authState.currentUser.accountNumber;
      });
  }

  updateUserData(usersData: Array<User>) {
    this.userData.next(usersData);
  }

  queryUserByEmail(email: string): Observable<string> {
    const data = {
      email
    };
    const url = unApi.userManagement.userCheck;
    return this.userManagementApiService.post<string>(url, data);
  }

  updateUser(user: AddEditUserRequest, nodeType: EntityType): Observable<any> {
    const url = unApi.portal.labSetupV3.replace(urlPlaceholders.nodeTypeName,
      nodeTypeNames[nodeType]);
    return this.apiService.post<AddEditUserRequest>(url, user, true);
  }

  public deleteAnUser(userId: string): Observable<any> {
    const url = unApi.portal.labSetupDeleteV2.
      replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.User]).replace(urlPlaceholders.nodeId, userId);
    return this.apiService.del(url, true);
  }


  searchUsers<T extends UserPage>(userSearchRequest: UserSearchRequest): Observable<UserPage> {
    const url = unApi.portal.labSetupSearchList.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.User]);
    return this.apiService.post<T>(url, userSearchRequest, false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

