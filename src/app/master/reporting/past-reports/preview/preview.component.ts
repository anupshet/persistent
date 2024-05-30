import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../../app/shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import {  months, reportTypes } from '../../../../core/config/constants/past-reports.const';

@Component({
    selector: 'past-reports-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})

export class PastReportsPreviewComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PastReportsPreviewComponent>,
    private _appNavigationService: AppNavigationTrackingService,
  ) {}

  ngOnInit() {
    const element: any = document.getElementById('previewpdf');
    element.src = this.data.viewPreSigned + '#zoom=FitH';

    element.onload = () => {
       this.sendAuditTrailPayload(this.data.auditTrailViewCurrentValue, AuditTrackingEvent.Report,
        AuditTrackingAction.View, AuditTrackingActionStatus.Success);
    };
    element.onerror = () => {
      this.sendAuditTrailPayload(this.data.auditTrailViewCurrentValue, AuditTrackingEvent.Report,
        AuditTrackingAction.View, AuditTrackingActionStatus.Failure);
    };
  }

  OnClose() {
      this.dialogRef.close();
  }

  getReportTypes(report: number){
      if (report === 0) {
        return [reportTypes[0]];
      } else if (report === 1) {
        return [reportTypes[1]];
      } else if (report === 2) {
        return reportTypes;
      } else if (report === 3) {
        return [reportTypes[2]];
      }
    }

    getMonthLabel(month: number) {
      return months[month - 1];
    }

    public sendAuditTrailPayload(reportData: any, eventType: string, action: string, actionStatus: string): void {
      const auditTrailFinalPayload = this.prepareAuditTrailPayload(reportData, eventType, action, actionStatus);
      this._appNavigationService.logAuditTracking(auditTrailFinalPayload, true);
    }

    public prepareAuditTrailPayload(reportData: any, eventType: string, action: string, actionStatus: string): AppNavigationTracking {
      const auditPayload: AppNavigationTracking = {
        auditTrail: {
          eventType: eventType,
          action: action,
          actionStatus: actionStatus,
          currentValue: {...reportData},
        }
      };
      return auditPayload;
    }
}
