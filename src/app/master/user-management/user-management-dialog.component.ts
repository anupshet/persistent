// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { take } from 'rxjs/operators';

import { UserManagementComponent } from './user-management.component';
import * as fromRoot from '../../state/app.state';
import * as fromSharedSelector from '../../shared/state/selectors';
import * as fromSecuritySelector from '../../security/state/selectors';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { Permissions } from '../../security/model/permissions.model';
import { MigrationStates } from '../../contracts/enums/migration-state.enum';


@Component({
  selector: 'unext-usermanagement-dialog',
  template: ``
})
export class UserManagementDialogComponent implements OnInit {

  dialogRef;
  isNavigationVisible: boolean;
  permissions = Permissions;
  migrationState: string;

  public getAccountState$ = this.store.pipe(select(fromSharedSelector.getCurrentAccount));
  public getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));

  constructor(
    private dialog: MatDialog,
    private store: Store<fromRoot.State>,
    private navigationService: NavigationService,
    private errorLoggerService: ErrorLoggerService,
    private router: Router,
    private brPermissionsService: BrPermissionsService,
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
    this.dialogRef = this.dialog.open(UserManagementComponent, {
      id: 'user-management-dialog',
      panelClass: 'cdk-biorad-user-management',
      autoFocus: true,
      disableClose: true
    });

    this.dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      try {
        this.store.pipe(select(fromSharedSelector.getCurrentLabLocation)).pipe(take(1))
          .subscribe((selectedNode) => {
            if (selectedNode) {
              this.dialogRef = undefined;
              this.migrationState = selectedNode.migrationStatus.toLowerCase();
              /*FIX 14026 AJT If Lab role or CTS role (reports run permission is for lab and CTS users)
               reset tree which adds left nav, otherwise do not show left nav*/
              (this.hasPermissionToAccess([this.permissions.ReportsRun]) &&
                this.migrationState === MigrationStates.Completed || this.migrationState === MigrationStates.Empty.valueOf()) ?
                this.navigationService.resetTree(selectedNode) :
                this.router.navigate([unRouting.actionableDashboard]);
            } else {
              this.router.navigate([unRouting.actionableDashboard]);
            }
          });
      } catch (error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
            (componentInfo.UserManagementDialogComponent + blankSpace + Operations.AfterCloseDialog)));
      }
    });
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

}
