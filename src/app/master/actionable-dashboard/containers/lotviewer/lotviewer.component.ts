// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as ngrxSelector from '@ngrx/store';
import { filter, take, takeUntil } from 'rxjs/operators';
import { sleep } from 'br-component-library';
import { Subject } from 'rxjs';
import { select } from '@ngrx/store';

import * as fromRoot from './../../../../state/app.state';
import * as fromAuth from '../../../../shared/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import { LotviewerDialogComponent } from '../../components/lotviewer-dialog/lotviewer-dialog.component';
import { LotviewerEmbedUrl } from '../../../../contracts/models/lotviewer/lotviewer-embed-url.model';
import { LotviewerReportService } from '../.././services/lotviewer-report.service';
import { LotviewerReportType } from '../../../../contracts/enums/lotviewer/lotviewer-reporttype.enum';
import { AuditTracking, AuditTrackingActionStatus, AuditTrackingAction } from '../../../../shared/models/audit-tracking.model';
import { LoggingApiService } from '../../../../shared/api/logging-api.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { AuthState } from '../../../../shared/state/reducers/auth.reducer';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';

export interface DialogData {
  ruleName: string;
  note: string;
  imagePath: string;
  powerBIToken: string;
  powerBIEmbedUrl: string;
  powerBIReportId: string;
  powerBIRole: string;
}

@Component({
  selector: 'unext-lotviewer',
  templateUrl: './lotviewer.component.html',
  styleUrls: ['./lotviewer.component.scss']
})
export class LotviewerComponent implements OnInit, OnDestroy {
  powerBIcredentials: LotviewerEmbedUrl;
  lotviewerReportType: LotviewerReportType;
  powerBIToken: string;
  powerBIEmbedUrl: string;
  powerBIReportId: string;
  powerBIReportType: string;
  authState: AuthState;
  private destroy$ = new Subject<boolean>();
  public getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));
  permissions = Permissions;


  constructor(
    public dialog: MatDialog,
    private loggingApiService: LoggingApiService,
    public lotviewerReportService: LotviewerReportService,
    private store: ngrxSelector.Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
  ) { }


  ngOnInit() {
    if (this.brPermissionsService.hasAccess([Permissions.LotViewerSalesReport])
    && !(this.brPermissionsService.hasAccess([Permissions.LotViewerUserReport]))) {
      this.lotviewerReportType = LotviewerReportType.LotVisiblitySales;
      this.powerBIReportType = LotviewerReportType.LotVisiblitySales;
      // AJT fix 12830 sending dummy payload to backend since salespersons are not associated to locations
      const locationPayload = {
        locationId: 'salesperson',
        allowedShipTo:  null
      };
      this.lotviewerReportCall(locationPayload);
    } else if (this.brPermissionsService.hasAccess([Permissions.LotViewerUserReport])) {
      this.lotviewerReportType = LotviewerReportType.LotVisiblityUser;
      this.powerBIReportType = LotviewerReportType.LotVisiblityUser;
      this.getPowerBICredentials();
    }
  }

  getPowerBICredentials() {
    this.store.pipe(ngrxSelector.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!authState.directory || !!authState.currentUser.roles), takeUntil(this.destroy$))
      .subscribe(authState => {
        try {
          if (authState) {
            this.authState = authState;
          }
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.LotviewerComponent + blankSpace + Operations.FetchAuthState)));
        }
      });

    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        if (labLocation) {
          const currentUser = this.authState?.directory?.children.find(ele => ele.userOktaId === this.authState?.currentUser?.userOktaId);
          const locationPayload = {
            locationId: labLocation?.id,
            allowedShipTo: currentUser ? currentUser.allowedShipTo : null
          };
          this.lotviewerReportCall(locationPayload);
        }
      });

  }

  lotviewerReportCall(locationPayload: any) {
    this.lotviewerReportService.getLotviewerReport(this.lotviewerReportType, locationPayload).pipe(take(1))
      .subscribe(response => {
        if (response) {
          this.powerBIcredentials = response;
          this.powerBIToken = this.powerBIcredentials.embedToken.token;
          this.powerBIEmbedUrl = this.powerBIcredentials.embedUrl;
          this.powerBIReportId = this.powerBIcredentials.reportId;
          const millisecondsFromNow = +(new Date(response.embedToken.expiration)) - (+(new Date()));
          sleep(millisecondsFromNow).then(() => {
            this.getPowerBICredentials();
          }
          );
        }
      });
  }

  openDialog() {
    try {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '95%';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.height = '95%';
      dialogConfig.panelClass = 'lotviewer-dialog-container';

      dialogConfig.data = {
        powerBIToken: this.powerBIToken,
        powerBIEmbedUrl: this.powerBIEmbedUrl,
        powerBIReportId: this.powerBIReportId,
        powerBIReportType: this.powerBIReportType
      };
      const dialogRef = this.dialog.open(LotviewerDialogComponent, dialogConfig);
      const _auditTracking: AuditTracking = {
        action: AuditTrackingAction.ViewQCLotViewer,
        actionStatus: AuditTrackingActionStatus.Pass,
        resource: ''
      };
      this.loggingApiService.auditTracking(_auditTracking).then(() => { });
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.LotviewerComponent + blankSpace + Operations.OpenDialog));
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
