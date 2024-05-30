// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { BioRadUserManagementComponent } from './biorad-user-management.component';

@Component({
  selector: 'unext-usermanagement-dialog',
  template: ``
})
export class BioRadUserManagementDialogComponent implements OnInit {
  dialogRef;
  migrationState: string;
  isNavigationVisible: boolean;

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.openDialog();
  }

  ngOnInit() {
    this.dialogRef = null;
  }

  openDialog(): void {
    this.dialogEvents();
  }

  dialogEvents(): void {
    if (this.dialogRef !== undefined) {
      return;
    }

    this.dialogRef = this.dialog.open(BioRadUserManagementComponent, {
      panelClass: 'cdk-biorad-user-management',
      id: 'bioRad-user-management',
      autoFocus: true,
      disableClose: true
    });

    this.dialogRef.afterClosed()
    .pipe(
      take(1)
    )
    .subscribe(() => {
      this.router.navigate([unRouting.actionableDashboard]);
    });
  }
}
