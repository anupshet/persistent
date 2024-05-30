// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import * as fromSecuritySelector from '../../security/state/selectors';
import * as sharedStateSelector from '../../shared/state/selectors';
import * as fromRoot from '../../state/app.state';
import { Permissions } from '../model/permissions.model';

@Injectable()
export class BrPermissionsService {

  constructor(private store: Store<fromRoot.State>) { }
  getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));
  getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));

  hasAccess(permissionsAllowed: Array<Permissions>): boolean {
    let isAllowed = false;
    combineLatest([
      this.getCurrentUserState$,
      this.getCurrentLabLocation$,
    ]
    ).pipe(take(1))
      .subscribe(([currentUser, currentLabLocation]: any) => {
        if (currentUser) {
          let userPermissions: Array<Permissions> = currentUser?.permissions || [];
          if (currentLabLocation && currentLabLocation?.permissions && currentLabLocation?.permissions.length) {
            userPermissions = [...new Set([...userPermissions, ...currentLabLocation.permissions])].sort((a, b) => a - b);
          }
          if (userPermissions.length > 0) {
            isAllowed = permissionsAllowed.some(ele => userPermissions.includes(ele));
            return isAllowed;
          }
        }
      });
    return isAllowed;
  }
}
