// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store, select as _select } from '@ngrx/store';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AppUser } from '../../../security/model';
import { AuthenticationService } from '../../../security/services/authentication.service';
import * as fromRoot from './../../../state/app.state';
import * as fromAuth from '../../state/selectors';
import { UserActions } from '../../../state/actions';
import { PortalDataDocumentType } from '../../../contracts/models/portal-api/portal-data.model';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import * as fromUserPreference from '../../state/selectors';
import { AuthState } from '../../state/reducers/auth.reducer';

@Component({
  selector: 'unext-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.scss']
})
export class UserBarComponent implements OnInit, OnDestroy {

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.person[24]
  ];

  constructor(
    private authService: AuthenticationService,
    private store: Store<fromRoot.State>,
    private iconService: IconService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  currentUser: AppUser;

  @Input() userName: string;
  isAuthenticated = false;

  locationIds = [];

  private userPreferenceNodeType: PortalDataDocumentType;
  private destroy$ = new Subject<boolean>();

  onSelect(value) {
    if (value === 'Logout') {
      this.authService.logOut().subscribe(authenticated => {
        this.store.dispatch(UserActions.ResetApp());
      });
    }
  }

  ngOnInit() {
    // Listen to current user
    this.store.pipe(_select(fromAuth.getAuthState))
      .pipe(filter(response => !!(response && response.currentUser)), takeUntil(this.destroy$))
      .subscribe((response: AuthState) => {
        this.currentUser = response.currentUser;
        this.userName = this.currentUser.firstName + ' ' + response.currentUser.lastName;
        if (this.userName.length > 16) {
          this.userName = this.userName.toString().substring(0, 16) + '...';
        }
      });

    this.store.pipe(_select(fromUserPreference.getUserPreferenceState))
      .pipe(takeUntil(this.destroy$))
      .subscribe(userPref => {
        if (userPref && userPref.userPreference) {
          this.userPreferenceNodeType = userPref.userPreference.entityType;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
