// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import * as ngrxSelector from '@ngrx/store';

import * as fromNavigationSelector from '../../shared/navigation/state/selectors';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { ConnectivityComponent } from './connectivity.component';
import * as fromRoot from '../../state/app.state';
import * as fromAuth from '../../shared/state/selectors';
import * as fromSharedSelector from '../../shared/state/selectors';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { MigrationStates } from '../../contracts/enums/migration-state.enum';
import { LabLocation } from '../../contracts/models/lab-setup';

@Component({
  selector: 'unext-connectivity-dialog',
  template: ``
})
export class ConnectivityDialogComponent implements OnInit, OnDestroy {
  dialogRef;
  labLocation: LabLocation;
  labId: string;
  userId: string;
  userName: string;
  accountId: string;
  accountNumber: string;
  accountLocationTimeZone: string;
  migrationState: string;

  private destroy$ = new Subject<boolean>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private store: Store<fromRoot.State>,
    private navigationService: NavigationService,
  ) {
    this.openDialog();
  }

  ngOnInit() {
    this.dialogRef = null;
  }

  openDialog(): void {
    this.store.pipe(select(fromSharedSelector.getCurrentLabLocation)).pipe(filter(location => !!location), takeUntil(this.destroy$))
      .subscribe((location) => {
        this.labLocation = location;
        this.labId = location.parentNodeId;
        this.accountLocationTimeZone = location.locationTimeZone;
        this.migrationState = location.migrationStatus?.toLowerCase();
      });

    this.store.pipe(select(fromAuth.getAuthState))
      .pipe(filter(authStateCurrent => !!authStateCurrent && !!authStateCurrent.currentUser), takeUntil(this.destroy$))
      .subscribe(authStateCurrent => {
        if (authStateCurrent) {
          this.userId = authStateCurrent.currentUser?.id;
          this.userName = authStateCurrent.currentUser.firstName + ' ' + authStateCurrent.currentUser.lastName;
          this.accountId = authStateCurrent.directory?.id?.toString();
          this.accountNumber = authStateCurrent.currentUser.accountNumber;
          this.dialogEvents();
        }
      });
  }

  dialogEvents(): void {
    if (this.dialogRef !== undefined) {
      return;
    }

    this.dialogRef = this.dialog.open(ConnectivityComponent, {
      panelClass: 'cdk-instructions',
      autoFocus: true,
      maxHeight: '90%',
      data: {
        labId: this.labId,
        userId: this.userId,
        userName: this.userName,
        accountId: this.accountId,
        accountNumber: this.accountNumber,
        accountLocationTimeZone: this.accountLocationTimeZone
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = undefined;
      if (this.migrationState === MigrationStates.Completed || this.migrationState === MigrationStates.Empty.valueOf()) {
        // Fetch PreviousUrl from store and navigate user to previous opened page.
        this.store.pipe(ngrxSelector.select(fromNavigationSelector.selectPreviousUrl))
          .pipe(take(1))
          .subscribe(returnUrl => {
            if (returnUrl) {
              this.router.navigateByUrl(returnUrl);
            } else {
              this.navigationService.resetTree(this.labLocation);
            }
          });
      } else {
        this.router.navigate([unRouting.actionableDashboard]);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
