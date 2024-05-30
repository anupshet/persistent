// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as fromRoot from '../../state/app.state';
import * as sharedStateSelector from '../../shared/state/selectors';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { Permissions } from '../../security/model/permissions.model';
import { BrPermissionsService } from '../../security/services/permissions.service';

@Component({
  selector: 'unext-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})

export class AccountManagementComponent implements OnInit, OnDestroy {
  tabIndex = null;
  accountId: string;
  public getAccountState$ = this.store.pipe(select(sharedStateSelector.getAuthState));
  protected destroy$ = new Subject<boolean>();
  permissions = Permissions;
  constructor(
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService
  ) { }

  ngOnInit() {
    this.getCurrentAccountId();
     // adding this if condition since we need to load location tab if the account tab is disabled
     if (this.hasPermissionToAccess([Permissions.AccountListView])) {
      this.tabIndex = 0;
    } else if (this.hasPermissionToAccess([Permissions.LocationListView])) {
      this.tabIndex = 1;
    }
  }

  getCurrentAccountId() {
    this.getAccountState$.pipe(filter(account => !!account), take(1))
      .subscribe(authStateCurrent => {
        try {
          this.accountId = authStateCurrent.currentUser.accountId;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.AccountManagementComponent + blankSpace + Operations.FetchAccount)));
        }
      });
  }

  changeTab(event) {
    this.tabIndex = event.index;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
