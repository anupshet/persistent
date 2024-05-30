// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { filter, takeUntil, flatMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import * as _moment from 'moment';
import * as _ from 'lodash';

import { RunsService } from '../../../shared/services/runs.service';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { Department } from '../../../contracts/models/lab-setup/department.model';
import { LabLocation } from '../../../contracts/models/lab-setup/lab-location.model';
import { Lab } from './models/lab.model';
import { ReportHelperService } from './report-helper.service';
import { LabDataApiService } from '../../../shared/api/labDataApi.service';
import { ReportingService } from './reporting.service';
import { ReportType } from '../../../contracts/enums/report-type';
import { CustomCalendarHeaderComponent } from './custom-calendar-header/custom-calendar-header.component';
import { LabInstrument } from '../../../contracts/models/lab-setup/instrument.model';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import * as fromRoot from '../../../state/app.state';
import * as selectors from '../../../shared/navigation/state/selectors';
import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';
import { ConfigService } from '../../../core/config/config.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import * as navigationStateSelector from '../../../shared/navigation/state/selectors';
import { PreviewReportComponent } from './preview-report/preview-report.component';
import { UserNotification } from '../../../shared/navigation/models/notification.model';
import { LabProduct } from '../../../contracts/models/lab-setup';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { Permissions } from '../../../security/model/permissions.model';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'unext-unity-report',
  templateUrl: './unity-report.component.html',
  styleUrls: ['./unity-report.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
})
export class UnityReportComponent implements OnInit, OnDestroy {
  // trying out Mat-date picker
  maxDate = new Date();
  // Caluclate Min date
  minDate = new Date();

  date = new FormControl(moment());
  instrumentStateSubscription: Subscription;
  instrumentModelName: string;
  customCalendarHeader = CustomCalendarHeaderComponent;
  createReportSelectedYear: number;
  createReportSelectedMonth: number;
  instrumentModel: LabInstrument;

  chosenYearHandler(normalizedYear: _moment.Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedSelection: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedSelection.year());
    ctrlValue.month(normalizedSelection.month());
    ctrlValue.day(normalizedSelection.day());
    this.date.setValue(ctrlValue);
    this.createReportSelectedYear = normalizedSelection.year();
    this.createReportSelectedMonth = normalizedSelection.month() + 1;
    datepicker.close();
  }

  id: string;
  entity: any;
  entityType: EntityType;
  labName: string;
  reportInfo: Lab = new Lab();
  department: Department = new Department();
  labLocation: LabLocation = new LabLocation();
  appLocale: string;
  reports: Array<{
    year: number;
    month: number;
    reportMetaList: Array<any>;
    checked: boolean;
  }> = [];

  years: Array<{ year: number; active: boolean }> = [];
  selectedYear: number;
  selectedMonth: number;
  months = [];
  startYear = 2014;
  enableCreateReport = true;
  isProcessing = false;
  isInitialized = false;
  ancestors: any;
  nodeAndGrandchildren: LabInstrument;
  instrumentChildren: LabProduct[];
  newReportsList: any;

  // Manage tabs behaviors
  selectedReportType = ReportType.AllReports;
  showLabMonthlyEvaluationReport = false;
  showLabComparisonReport = false;
  showAllReports = true;
  private destroy$ = new Subject<boolean>();

  permissions = Permissions;

  constructor(
    private config: ConfigService,
    private reportingService: ReportingService,
    private reportHelperService: ReportHelperService,
    private portalService: PortalApiService,
    private storeNg: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    public runsService: RunsService,
    protected labDataService: LabDataApiService,
    private navigationService: NavigationService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // Set Min Calendar Date Selector
    this.minDate.setMonth(this.minDate.getMonth() - 2);
    this.appLocale = this.config.getConfig('appLocale');

    // Navigation logic here
    this.storeNg.pipe(select(selectors.getCurrentlySelectedNode)
    ).pipe(
      // Ensure this is called only once per entity by checking the id.
      filter(selectedNode => selectedNode && this.id !== selectedNode.id)
    ).pipe(
      flatMap((selectedNode: TreePill) => {
        // If different entity, update page
        this.entity = selectedNode;
        this.entityType = selectedNode.nodeType;
        this.id = selectedNode.id;
        this.instrumentModelName = selectedNode.displayName;

        if (this.isReportableEntity()) {
          this.reloadReportList();
        }

        //adding this to subscribe to the iot core service so that we can refresh the report list for the user when notification is received - 229996
        this.notificationService.$labStream.pipe(filter(result => !!result), takeUntil(this.destroy$))
          .subscribe(() => {
            this.reloadReportList();
          });

        // Get Ancestor information for generating report
        // Get Analytes for Instrument report
        return combineLatest([this.portalService.getLabSetupAncestors(selectedNode.nodeType, selectedNode.id),
        this.portalService.getGrandChildren(selectedNode.nodeType, selectedNode.id, 'true')]);
      }),
      takeUntil(this.destroy$))
      .subscribe(([ancestors, withGrandchildren]) => {
        try {
          this.ancestors = _.cloneDeep(ancestors);
          this.nodeAndGrandchildren = _.cloneDeep(withGrandchildren);
          this.instrumentChildren = _.cloneDeep(withGrandchildren.children);
          // capturing notification Id from notification panel for async display of report - 229996
          this.storeNg.pipe(select(navigationStateSelector.getNotificationId))
            .pipe(filter(notificationId => !!notificationId), takeUntil(this.destroy$)).subscribe(notificationId => {
              this.checkNotificationListAndOptions(notificationId);
            });
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.UnityReportComponent + blankSpace + Operations.GetAncestors)));
        }

      });
    }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  isReportableEntity() {
    const type = +this.entityType;
    return (type === EntityType.LabInstrument);
  }

  setupReport(reportType: ReportType, entityId: string) {
    this.reports = [];
    this.months = [];

    this.reportingService.getAllReports(entityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((returned: any) => {
        try {
          this.reports = returned.filter(report => report.isTempReport === false);
          if (this.reports.length > 0) {
            this.setYear(this.reports);
            this.setMonths();
            this.setReportsPDFs(this.reports);
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.UnityReportComponent + blankSpace + Operations.GetReports)));
        }
      });
  }

  setYear(reportList: any = null) {
    this.years = [];
    if (reportList) {
      // generate a year list based on report list received
      for (const receivedList of reportList) {
        const previousActiveState = (receivedList.year === this.selectedYear);
        this.years.push({ year: receivedList.year, active: previousActiveState });
      }

      // remove duplicates
      const forDuplicates = {};
      this.years = this.years.filter(obj => !forDuplicates[obj.year] && (forDuplicates[obj.year] = true));

      // sort years array
      const compareYears = function (year1, year2) {
        if (year1.year > year2.year) { return -1; }
        if (year1.year < year2.year) { return 1; }
        return 0;
      };

      this.years = this.years.sort(compareYears);

    } else {
      // generate a generic list of years
      for (let y = new Date().getFullYear(); y >= this.startYear; y--) {
        this.years.push({ year: y, active: false });
      }
    }

    // Set default year
    if (!this.selectedYear) {
      this.selectedYear = this.years[0].year;
      this.years[0].active = true;
    }
  }

  setReportsPDFs(reportsList) {
    try {
      this.reports = [];

      // setup Reports Array
      for (const listData of reportsList) {
        this.reports.push({
          year: listData.year,
          month: listData.month,
          reportMetaList: [],
          checked: false
        });
      }
      // Populate links by year and month
      for (const ymReportList of this.reports) {
        ymReportList.reportMetaList = reportsList.filter(
          r => r.year === ymReportList.year && r.month === ymReportList.month
        );
      }

      // sort reports array by month
      const compareMonths = function (report1, report2) {
        if (report1.month > report2.month) { return -1; }
        if (report1.month < report2.month) { return 1; }
        return 0;
      };

      this.reports = this.reports.sort(compareMonths);

      // remove duplicates
      const tempForFiltering = [];
      for (const yearEntry of this.years) {
        const currentYear = yearEntry.year;
        let startingMonth = 12;
        for (const reportEntry of this.reports) {
          if (reportEntry.year === currentYear && reportEntry.month <= startingMonth) {
            startingMonth = reportEntry.month - 1;
            tempForFiltering.push(reportEntry);
          }
        }
      }
      this.reports = tempForFiltering;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.UnityReportComponent + blankSpace + Operations.GetReports)));
    }
  }

  onYearClicked(index: number, selectedYear: number) {
    try {
      // Mark all years as not active so it's not highlighted
      this.years.map(year => (year.active = false));
      // Mark year just clicked as active so it's highlighted
      this.years[index].active = true;
      this.selectedYear = selectedYear;
      this.setupReport(this.selectedReportType, this.entity.id);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.UnityReportComponent + blankSpace + Operations.FetchClickedYearDetails)));
    }

  }

  setMonths() {
    // Send only reports for that year to the Report Panel
    const reportsFilteredByYear = this.reports.filter(item => item.year === this.selectedYear);
    this.months = reportsFilteredByYear;
  }

  private getRunDataPageSet(labTestId: string, pageNumber: number): any {
    const res = this.runsService.getRawDataPageByLabTestId(labTestId, pageNumber, null, null, true).then(rawDataPage => {
      const testSpecIds = [];
      rawDataPage.runData.forEach(runData => {
        testSpecIds.push(runData.testSpecId);
      });
      return [...new Set(testSpecIds)];
    });
    return res;
  }

  private createReport(arr: object, request): void {
    this.reportHelperService.setTestSpecIdsMatrix(arr);
    this.reportHelperService.createReport.next(request);
  }

  onCreateReport(): void {
    this.isProcessing = true;

    const request = {
      node: this.entity,
      selectedYear: this.date.value.year(),
      langCode: this.appLocale,
      lab: this.getLab(),
      selectedMonth: this.date.value.month() + 1,
      nodeWithGrandchildren: this.nodeAndGrandchildren
    };
    if (this.nodeAndGrandchildren.children && this.nodeAndGrandchildren.children.length > 0) {
      let total = 0;
      const arr = [];
      let c = 0;

      this.nodeAndGrandchildren.children.forEach(inst => {
        if (inst.children && inst.children.length > 0) {
          total += inst.children.length;
        }
      });

      this.nodeAndGrandchildren.children.forEach(items => {
        if (items.children && items.children.length > 0) {
          items.children.forEach(testNode => {
            arr.push({
              productMasterLotId: parseInt(items.productMasterLotId, 10),
              testNodeId: testNode.id,
              ids: testNode.allTestSpecIds
            });
            c++;
            if (c === total) {
              this.createReport(arr, request);
            }
          });
        }
      });
    }
  }

  onMenuOptionClicked(menuOption: ReportType) {
    try {
      this.selectedReportType = menuOption;
      this.setMenuOptions(
        menuOption === ReportType.MonthlyEvalReport,
        menuOption === ReportType.LabComparisonReport,
        menuOption === ReportType.AllReports
      );
      this.setupReport(menuOption, this.entity.id);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.UnityReportComponent + blankSpace + Operations.GetMenuInfo)));
    }

  }

  setMenuOptions(
    monthlyEvaluation: boolean,
    labComparison: boolean,
    allReports: boolean
  ) {
    try {
      this.showLabMonthlyEvaluationReport = monthlyEvaluation;
      this.showLabComparisonReport = labComparison;
      this.showAllReports = allReports;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.UnityReportComponent + blankSpace + Operations.GetMenuInfo)));
    }
  }

  private getLab() {
    const lab = new Lab();
    // populate LabName by ancestors:
    for (const ancestorLab of this.ancestors) {
      if (ancestorLab.nodeType === EntityType.Lab) {
        lab.accountName = ancestorLab.displayName;
      }
    }

    // populate LabLocationInfo
    for (const labLocation of this.ancestors) {
      if (labLocation.nodeType === EntityType.LabLocation) {
        lab.labTimeZone = labLocation.locationTimeZone;
        lab.labName = labLocation.displayName;
        lab.streetAddress = labLocation.labLocationAddress.streetAddress1;
        lab.streetAddress2 = labLocation.labLocationAddress.streetAddress2;
        lab.city = labLocation.labLocationAddress.city;
        lab.state = labLocation.labLocationAddress.state;
        lab.subDivision = labLocation.labLocationAddress.state;
        lab.country = labLocation.labLocationAddress.country;
        lab.zipcode = labLocation.labLocationAddress.zipCode;
      }
    }

    // populate LabDepartmentInfo
    for (const labDepartment of this.ancestors) {
      if (labDepartment.nodeType === EntityType.LabDepartment) {
        lab.deptName = labDepartment.displayName;
        lab.deptSupervisorName = labDepartment.departmentManager.name;
      }
    }
    return lab;
  }

  onPreviewClose(): void {
    this.reloadReportList();
  }

  private reloadReportList(): void {
    // Should only refresh year-month list after dialog is closed for All-Reports.
    // This is the only report type where reports are saved and the counts will change.
    this.isProcessing = false;
    if (this.selectedReportType === ReportType.AllReports) {
      this.setupReport(this.selectedReportType, this.entity.id);
    }
  }

  // capturing notification Id from notification panel for async display of report - 229996
  checkNotificationListAndOptions(notificationId: string) {
    if (notificationId) {
      this.storeNg.pipe(select(navigationStateSelector.getNotificationList))
        .pipe(filter(notificationList => !!notificationList), takeUntil(this.destroy$)).subscribe(notificationList => {
          const singleNotification: UserNotification = notificationList.find(ele => ele.notificationUuid === notificationId);
          if (singleNotification && singleNotification.notificationSpecificData) {
            let isTempPdfUrl = singleNotification.notificationSpecificData?.reports.pdfUrl.substring(0, 4) === 'temp' ? true : false;
            if (isTempPdfUrl) {
              const reportData = singleNotification.notificationSpecificData?.reports;
              this.openPdfOverlayForSave(reportData?.pdfUrl, +reportData?.yearMonth, reportData?.metaId, singleNotification?.notificationUuid).afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                  this.navigationService.setSelectedNotificationId('');
                  this.onPreviewClose();
                })
            }
          }
        });
    }
  }

  openPdfOverlayForSave(pdfUrl: string, yearMonth: number, metaId: string, notificationUuid: string): MatDialogRef<PreviewReportComponent> {
    return this.dialog.open(PreviewReportComponent, {
      id: 'report-dialog',
      width: '80%',
      height: '80%',
      panelClass: 'modal-report',
      backdropClass: 'modal-report',
      data: {
        reportUrl: pdfUrl,
        node: this.entity,
        reportType: ReportType.AllReports,
        yearMonth: yearMonth,
        lab: this.getLab(),
        langCode: this.appLocale,
        ancestors: this.ancestors,
        nodeWithGrandchildren: this.nodeAndGrandchildren,
        fromNotification: true,
        reportMetaId: metaId,
        instrumentChildren: this.instrumentChildren,
        notificationId: notificationUuid
      },
      disableClose: true
    });
  }

}
