import * as ngrxStore from '@ngrx/store';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { LabLocation } from '../../../contracts/models/lab-setup/lab-location.model';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import * as fromRoot from '../../../state/app.state';
import * as fromAuth from '../../state/selectors';
import { AuthState } from '../../state/reducers/auth.reducer';

@Component({
  selector: 'unext-lab-bar',
  templateUrl: './lab-bar.component.html',
  styleUrls: ['./lab-bar.component.scss']
})
export class LabBarComponent implements OnInit, OnDestroy {
  @Input() labName: string;
  isAuthenticated = false;
  selectedLocationName: string;
  selectedLocationId: number;
  currentLabId: string;
  currentLabName: string;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.scienceBeaker[32],
  ];

  private destroy$ = new Subject<boolean>();

  @Input() options: LabLocation[];

  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
    private iconService: IconService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    // Listen to current user
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(response => !!(response && response.currentUser)), takeUntil(this.destroy$))
      .subscribe((response: AuthState) => {
        if (response && response.currentUser) {
          this.currentLabId = response.currentUser.accountNumber;
        }
      });

    // def value
    this.labName = '';
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(lab => !!(lab && lab.directory)), takeUntil(this.destroy$))
      .subscribe((lab: AuthState) => {
        if (lab && lab.directory) {
          this.labName = lab.directory.name;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
