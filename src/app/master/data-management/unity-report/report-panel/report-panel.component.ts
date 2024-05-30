// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, throwError } from 'rxjs';
import { takeUntil, flatMap, catchError, filter } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { PreviewReportComponent } from '../preview-report/preview-report.component';
import { ReportHelperService } from '../report-helper.service';
import { ReportingService } from '../reporting.service';
import { ReportType } from '../../../../contracts/enums/report-type';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LabInstrument } from '../../../../contracts/models/lab-setup';
import { Lab } from '../models/lab.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import * as fromRoot from '../../.././../state/app.state';
import { ReportTimeoutMessageComponent } from '../../../../shared/components/report-timeout-message/report-timeout-message.component';

@Component({
  selector: 'unext-report-panel',
  templateUrl: './report-panel.component.html',
  styleUrls: ['./report-panel.component.scss']
})
export class ReportPanelComponent implements OnInit, OnDestroy {
  @ViewChild('divClick') divClick: ElementRef;
  @Input() reports = [];
  @Input() reportType: ReportType;
  @Input() nodeWithGrandchildren: LabInstrument;
  @Input() newReportList: any;
  @Input() year: number;
  @Output() previewClose = new EventEmitter<boolean>();

  selectedMonth: string;
  yearMonth: number;
  labTestId: string;
  locationId: string;
  labId: string;
  selectedYear: string;
  labInfo: Lab;
  data: any;
  ancestors: any;
  bypassSecurity: any;
  listOfReports: any;
  private destroy$ = new Subject<boolean>();

  getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));

  get isAllReports(): boolean {
    return this.reportType === ReportType.AllReports;
  }

  get isMonthlyEvalReport(): boolean {
    return this.reportType === ReportType.MonthlyEvalReport;
  }

  get isLabComparison(): boolean {
    return this.reportType === ReportType.LabComparisonReport;
  }

  constructor(
    private sanitization: DomSanitizer,
    public dialog: MatDialog,
    public reportHelperService: ReportHelperService,
    private reportService: ReportingService,
    private portalService: PortalApiService,
    private navigationService: NavigationService,
    private errorLoggerService: ErrorLoggerService,
    private store: Store<fromRoot.State>,
  ) { }

  ngOnInit() {
    this.getCurrentLabLocation$.pipe(filter(labLocation => !!labLocation),
      takeUntil(this.destroy$)).subscribe(labLocation => {
        this.locationId = labLocation.id;
      });

    this.reportHelperService.createReport.pipe(
      flatMap((data: any) => {
        if (data.selectedMonth) {
          this.selectedMonth = data.selectedMonth;
        }

        if (data && this.selectedMonth) {
          const month = this.selectedMonth.toString().length > 1 ? this.selectedMonth.toString() : '0' + this.selectedMonth.toString();
          this.yearMonth = +(data.selectedYear.toString() + month);
          this.data = data;
          this.displayTimeoutReportDialog();

          return this.portalService.getLabSetupAncestors(data.node.nodeType, data.node.id).pipe(flatMap(ancestors => {
            this.ancestors = ancestors;
            return this.reportService
              // temporarily replacing this until a sync/async solution is available
              // sending all report requests
              // leaving the pipe catch error below to make restoring it later easier
              // .create(this.reportType,
              .createTimeoutReport(this.reportType,
                this.reportHelperService.getReportRequestInfo(ancestors, data.node,
                  this.locationId,
                  this.yearMonth,
                  data.langCode,
                  data.lab,
                  data.nodeWithGrandchildren,
                  false
                ),
                false);
          })).pipe(catchError(err => {
            if (err.status === 504) {
              this.displayTimeoutReportDialog();
              this.reportService.createTimeoutReport(this.reportType,
                this.reportHelperService.getReportRequestInfo(this.ancestors, data.node,
                  this.locationId,
                  this.yearMonth,
                  data.langCode,
                  data.lab,
                  data.nodeWithGrandchildren,
                  false
                ), false).subscribe();
            }
            return throwError(err);
          })
          );
        }
      }),

            // temporarily replacing this until a sync/async solution is available
            // sending all report requests
/*       flatMap((pdfData: any) => {
        // Reset all check boxes
        const reports = this.reports;
        reports.forEach((val, i) => {
          reports[i].checked = false;
        });

        return this.openOverlay(pdfData, this.data, this.yearMonth, null).afterClosed()
      }), */ takeUntil(this.destroy$))
      .subscribe(() => {
        this.navigationService.setSelectedNotificationId('');
        this.previewClose.emit(true);
      });
  }

  displayTimeoutReportDialog() {
    const dialogRef = this.dialog.open(ReportTimeoutMessageComponent, {
      width: '450px',
      disableClose: true,
      data: {
        reportState: 'generated'
      }
    });
    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe();
  }

  openOverlay(pdfData: any, data: any, yearMonth: number, metaId: string): MatDialogRef<PreviewReportComponent> {
    return this.dialog.open(PreviewReportComponent, {
      width: '80%',
      height: '80%',
      panelClass: 'modal-report',
      backdropClass: 'modal-report',
      data: {
        reportUrl: pdfData,
        node: data.node,
        reportType: ReportType.AllReports,
        yearMonth: yearMonth,
        lab: data.lab,
        langCode: data.langCode,
        ancestors: this.ancestors,
        nodeWithGrandchildren: this.nodeWithGrandchildren,
        fromNotification: false,
        reportMetaId: metaId
      },
      disableClose: true
    });
  }

  prepDownloadButton(selectReport: any) {
    this.reportService.downloadPdfData(selectReport.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((blob: any) => {
        try {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const newBlob = new Blob([blob], { type: 'application/pdf;base64' });
            window.navigator.msSaveOrOpenBlob(newBlob, this.generatedReportName(selectReport)); // For IE browser
          } else {
            const newblob = 'data:application/pdf;base64, ' + btoa(this.reportService.uint8ArrayToString(new Uint8Array(blob)));
            selectReport.reportResultInfo.jsonFileUrl = this.sanitization.bypassSecurityTrustUrl(`${newblob}`);
            setTimeout(() => {
              this.divClick.nativeElement.click();
            }, 500);
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.ReportPanelComponent + blankSpace + Operations.BlobExtraction)));
        }
      });
  }

  generatedReportName(selectReport: any): string {
    // Custom Instrument Name by default will either return the custom name or the default instrument name
    // if no custom name exists.
    try {
      return selectReport.reportRequestInfo.customInstrumentName + selectReport.month.toString()
        + selectReport.year.toString() + '.pdf';
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ReportPanelComponent + blankSpace + Operations.GetReports)));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.reports = null;
  }
}
