// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import * as ngrxStore from '@ngrx/store';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, takeUntil } from 'rxjs/operators';

import 'moment-timezone';

import { ReportType } from '../../../../contracts/enums/report-type';
import { LabInstrument } from '../../../../contracts/models/lab-setup/instrument.model';
import { unsubscribe } from '../../../../core/helpers/rxjs-helper';
import { Utility } from '../../../../core/helpers/utility';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ReportHelperService } from '../report-helper.service';
import { ReportingService } from '../reporting.service';
import * as fromRoot from '../../../../state/app.state';
import * as fromAuth from '../../../../shared/state/selectors';
import * as stateSelector from '../../../../shared/state/selectors';
import { notificationActions } from '../../../../shared/navigation/state/actions';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { ReportTimeoutMessageComponent } from '../../../../shared/components/report-timeout-message/report-timeout-message.component';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { NotificationApiService } from '../../../../shared/navigation/services/notificationApi.service';

@Component({
  selector: 'unext-preview-report',
  templateUrl: './preview-report.component.html',
  styleUrls: ['./preview-report.component.scss']
})

export class PreviewReportComponent implements OnInit, OnDestroy {
  noPdfGenerated = false;
  filename: string;
  correctiveActionsDefault: string;
  correctiveActionsDict = new Map<string, string>();
  btnActive = false;
  labTimeZone = '';
  locationId: string;
  showCorrectiveActionsField = false;
  allowSave = false;
  public previewBusy: Subscription;
  private routeServiceSubscription$: Subscription;
  private deleteTemporalSubscription$: Subscription;
  private authStateSubscription: Subscription;
  private currUserName: string;
  pdfData;
  isIE = false;
  instrument: LabInstrument;
  initInstrument: LabInstrument;
  existsOneLot = false;
  destroy$ = new Subject<boolean>();
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24]
  ];

  hasReportsCorrectiveActionsEntryPermission: boolean;
  hasReportsSaveAndDownloadPermission: boolean;

  constructor(
    public reportService: ReportingService,
    public dialogRef: MatDialogRef<PreviewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public reportingService: ReportingService,
    public reportHelperService: ReportHelperService,
    private appLoggerService: AppLoggerService,
    protected store: ngrxStore.Store<fromRoot.State>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private appNavigationService: AppNavigationTrackingService,
    private notificationApiService: NotificationApiService,
    private brPermissionsService: BrPermissionsService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    // capturing notification Id from notification panel for async display of report - 229996
    this.filename = this.data.fromNotification ? this.data.reportUrl : this.data.reportUrl.reportResultInfo.pdfFileUrl.split('/').pop();
    this.isIE = Utility.ieVersion() ? true : false;
    const reportType = this.data.reportType;

    if (reportType === ReportType.MonthlyEvalReport || reportType === ReportType.AllReports) {
      this.showCorrectiveActionsField = true;
    }

    // TODO: update this call to handle multiple levels, once we go beyond Instrument
    // this.allowSave = reportType === ReportType.AllReports && reportLevel === ReportLevel.Instrument;

    this.allowSave = reportType === ReportType.AllReports;
    this.btnActive = true;

    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!authState), takeUntil(this.destroy$))
      .subscribe(authState => {
        try {
          this.currUserName = authState.currentUser.firstName + ' ' + authState.currentUser.lastName;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.PreviewReportComponent + blankSpace + Operations.FetchUser)));
        }
      });

    // Use a promise with await to ensure we have timezone before other processing begins.
    this.store.pipe(ngrxStore.select(stateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), switchMap(labLocation => {
        this.labTimeZone = labLocation.locationTimeZone;
        this.locationId = labLocation.id;
        const pdfId = this.data.fromNotification ? this.data.reportMetaId : this.data.reportUrl.id;
        return this.reportingService.downloadPdfData(pdfId);
      }), takeUntil(this.destroy$))
      .subscribe((returnedPDFData: any) => {
        this.pdfData = returnedPDFData;
      },
        err => {
          this.appLoggerService.log('Report Preview PDF unable to be generated' + err.toString());
          this.noPdfGenerated = true;
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.toString(), null,
              (componentInfo.PreviewReportComponent + blankSpace + Operations.FetchPDFData)));
        });
    if (this.data.nodeWithGrandchildren) {
      let hasProducts: any;
      if (this.data.fromNotification) {
        hasProducts = (this.data.nodeWithGrandchildren.children.length) ? true : false;
      } else {
        hasProducts = (this.data.reportUrl?.reportRequestInfo?.instrumentInfo?.productInfos?.length) ? true : false;
      }
      if (hasProducts) {
        let productInfosArray: any;
        if (this.data.fromNotification) {
          productInfosArray = this.data.nodeWithGrandchildren.children.map(ele => ele.productInfo);
        } else {
          productInfosArray = this.data.reportUrl?.reportRequestInfo?.instrumentInfo?.productInfos;
        }
        const productMasterLotIds = [];
        for (let i = 0; i < productInfosArray.length; ++i) {
          productMasterLotIds.push(productInfosArray[i]['productMasterLotId']);
        }
        this.instrument = Object.assign({}, this.data.nodeWithGrandchildren);
        this.initInstrument = Object.assign({}, this.instrument);
        const filtered = [];
        if (!this.data.fromNotification) {
          this.instrument.children.forEach(child => {
            productMasterLotIds.forEach(id => {
              if (id === child.productMasterLotId) {
                filtered.push(child);
              }
            });
          });
        } else {
          this.data.instrumentChildren.forEach(child => {
            productMasterLotIds.forEach(id => {
              if (id === child.productMasterLotId) {
                filtered.push(child);
              }
            });
          });
        }

        const sorted = [];
        if (productMasterLotIds && productMasterLotIds.length > 0) {
          productMasterLotIds.forEach(id => {
            filtered.forEach(child => {
              if (id === child.productMasterLotId) {
                sorted.push(child);
              }
            });
          });
        }

        this.instrument.children = sorted;
        this.instrument.children.forEach(child => {
          this.correctiveActionsDict['' + child.lotInfo.lotNumber] = '';
          if (this.instrument.children.length === 1) {
            this.existsOneLot = true;
          }
        });
      }
    }

    this.hasReportsCorrectiveActionsEntryPermission = this.hasPermissionToAccess([Permissions.ReportsCorrectiveActionsEntry]);
    this.hasReportsSaveAndDownloadPermission = this.hasPermissionToAccess([Permissions.ReportsSaveAndDownload]);
  }

  onSave() {
    if (this.data.fromNotification) {
      if (this.data.nodeWithGrandchildren.children && this.data.nodeWithGrandchildren.children.length > 0) {
        let total = 0;
        const arr = [];
        let c = 0;

        this.data.nodeWithGrandchildren.children.forEach(inst => {
          if (inst.children && inst.children.length > 0) {
            total += inst.children.length;
          }
        });

        this.data.nodeWithGrandchildren.children.forEach(items => {
          if (items.children && items.children.length > 0) {
            items.children.forEach(testNode => {
              arr.push({
                productMasterLotId: parseInt(items.productMasterLotId, 10),
                testNodeId: testNode.id,
                ids: testNode.allTestSpecIds
              });
              c++;
            });
          }
        });
        if (c === total) {
          this.reportHelperService.setTestSpecIdsMatrix(arr);
        }
      }
    }
    this.data.lab.comments = this.correctiveActionsDefault;
    this.data.lab.signedBy = this.currUserName;
    this.data.lab.commentsDict = this.correctiveActionsDict;
    this.data.lab.signedOn = new Date();
    this.previewBusy = this.createReport(this.data.reportType, this.data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dialogRef.close();
        if (!!this.data?.notificationId) {
          this.removeNotification(this.data.notificationId);
        }
      });
    this.displayTimeoutReportDialog();
  }

  private createReport(reportType: ReportType, data: any) {
    return this.reportingService
      // temporarily replacing this until a sync/async solution is available
      // sending all report requests async
      // .create(this.reportType,
      .createTimeoutReport(reportType,
        this.reportHelperService.getReportRequestInfo(
          data.ancestors,
          data.node,
          this.locationId,
          +(data.yearMonth),
          data.langCode,
          data.lab,
          data.nodeWithGrandchildren,
          data.fromNotification
        ),
        true
      ).pipe(catchError(err => {
        if (err.status === 504) {
          let yearMonth: number;
          if (data.fromNotification) {
            yearMonth = +data.yearMonth;
          } else {
            const month = data.selectedMonth.toString().length > 1 ? data.selectedMonth.toString() : '0' + data.selectedMonth.toString();
            yearMonth = +(data.selectedYear.toString() + month);
          }
          this.reportService.createTimeoutReport(reportType,
            this.reportHelperService.getReportRequestInfo(data.ancestors, data.node,
              this.locationId,
              yearMonth,
              data.langCode,
              data.lab,
              data.nodeWithGrandchildren,
              true
            ), true)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
          this.dialogRef.close();
          this.displayTimeoutReportDialog();
        }
        return throwError(err);
      }));
  }

  displayTimeoutReportDialog() {
    const dialogRef = this.dialog.open(ReportTimeoutMessageComponent, {
      width: '450px',
      disableClose: true,
      data: {
        reportState: 'saved'
      }
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  removeNotification(notificationUuid: string) {
    try {
      this.store.dispatch(notificationActions.dismissNotification({ notificationUuid }));
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.NotificationComponent + blankSpace + Operations.dismissNotification)));
    }
  }

    /* checking Permissions */
    hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
      return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
    }

  ngOnDestroy() {
    unsubscribe(this.routeServiceSubscription$);
    unsubscribe(this.previewBusy);
    unsubscribe(this.deleteTemporalSubscription$);
    unsubscribe(this.authStateSubscription);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
