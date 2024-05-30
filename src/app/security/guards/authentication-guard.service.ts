import { select, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  NavigationExtras,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { AuthenticationService } from '../services';
import * as fromRoot from '../../state/app.state';
import * as sharedStateSelector from '../../shared/state/selectors';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  public getAccountState$ = this.store.pipe(select(sharedStateSelector.getCurrentAccount));

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private store: Store<fromRoot.State>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(authenticated => {
        if (authenticated) {
          return true;
        }

        this.authService.redirectUrl = state.url;

        // Set our navigation extras object
        // that contains our global query params and fragment
        const navigationExtras: NavigationExtras = {
          queryParams: {},
          fragment: ''
        };

        // Handle expired license
        this.getAccountState$.pipe(filter(account => !!account), take(1)).subscribe(accountState => {
          if (this.authService.hasLicenseExpired(accountState)) {
            this.authService.forceLogOutWithLicenseExpiredMessage();
            return false;
          }
        });

        // Navigate to the login page
        this.router.navigate([unRouting.login], navigationExtras);
        return false;
      })
    );
  }
}
