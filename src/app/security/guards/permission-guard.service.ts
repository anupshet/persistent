// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { select, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

import { AuthenticationService } from '../services';
import * as fromRoot from '../../state/app.state';
import * as sharedStateSelector from '../../shared/state/selectors';
import { BrPermissionsService } from '../services/permissions.service';

@Injectable()
export class PermissionGuard implements CanLoad {
  protected labId: number;
  private _accountState;

  public getAccountState$ = this.store.pipe(select(sharedStateSelector.getCurrentAccount));

  constructor(
    private authService: AuthenticationService,
    private brPermissionsService: BrPermissionsService,
    private store: Store<fromRoot.State>,
    private router: Router
  ) { }

  canLoad(route: Route): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          return false;
        } else {
          this.getAccountState$.pipe(filter(account => !!account), take(1)).subscribe(accountState => {
            this._accountState = accountState;
          });
          if (this.authService.hasLicenseExpired(this._accountState)) {
            this.authService.logOut();
            this.authService.forceLogOutWithLicenseExpiredMessage();
            return false;
          } else {
            return this.checkUserAccess(route);
          }
        }
      })
    );
  }

  private checkUserAccess(route: Route): boolean {

    if (Array.isArray(route.data['permissions'])) {
      const hasAccess = this.brPermissionsService.hasAccess(route.data['permissions']);
      if (hasAccess) {
        return true;
      } else {
        this.router.navigate(['/no-access']);
        return false;
      }
    }
  }
}
