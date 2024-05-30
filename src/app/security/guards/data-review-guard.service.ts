// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { select, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

import { AuthenticationService } from '../services';
import * as fromRoot from '../../state/app.state';
import * as sharedStateSelector from '../../shared/state/selectors';
import { BrPermissionsService } from '../services/permissions.service';
import { UnityNextTier } from '../../contracts/enums/lab-location.enum';
import { LabLocation } from '../../contracts/models/lab-setup';

@Injectable()
export class DataReviewGuard implements CanLoad {
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  private labLocation: LabLocation;

  constructor(
    private authService: AuthenticationService,
    private brPermissionsService: BrPermissionsService,
    private store: Store<fromRoot.State>
  ) { }

  canLoad(route: Route): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          return false;
        } else {
          this.getCurrentLabLocation$.pipe(filter(labLocation => !!labLocation), take(1)).subscribe(labLocationState => {
            this.labLocation = labLocationState;
          });

          const hasAccess = this.brPermissionsService.hasAccess(route.data['permissions']);
          return hasAccess && this.labLocation.unityNextTier === UnityNextTier.DailyQc;
        }
      })
    );
  }
}
