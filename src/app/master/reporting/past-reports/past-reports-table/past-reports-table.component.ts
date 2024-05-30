// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, ViewChild, Input, SimpleChanges, AfterViewInit, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { PastReportList, PastReportsFilterReportList, months, reportTypes } from '../../../../core/config/constants/past-reports.const';
import { PastReportsPreviewComponent } from '../preview/preview.component';
import { Permissions } from '../../../../security/model/permissions.model';
import {
  AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus,
  AuditTrackingEvent
} from '../../../../../app/shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import { icons } from '../../../../core/config/constants/icon.const';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { IconService } from '../../../../shared/icons/icons.service';
import { asc, multipleInstruments, reportsFirstPage, reportsItemsPerPage } from '../../../../core/config/constants/general.const';


@Component({
  selector: 'unext-past-reports-table',
  templateUrl: './past-reports-table.component.html',
  styleUrls: ['./past-reports-table.component.scss']
})
export class PastReportsTableComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(PerfectScrollbarComponent) pastReportsComponentRef?: PerfectScrollbarComponent;

  @Input() tableData: Array<PastReportList> = [];
  @Input() resetFilter;

  // templateName - add this after template is add
  displayedColumns: string[] = ['name', 'type', 'year', 'month', 'signedBy', 'createdOn', 'actions'];
  dataSource: MatTableDataSource<PastReportList>;
  @ViewChild(MatSort) sort: MatSort;
  months: Array<string> = months;
  permissions = Permissions;
  isDefaultSorting = true;

  configPagination = {
    currentPage: reportsFirstPage,
    itemsPerPage: reportsItemsPerPage
  };

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.arrowBack[24],
    icons.sortActive[24],
    icons.refreshBlue[24]
  ];

  constructor(
    public dailogRef: MatDialog,
    private appNavigationService: AppNavigationTrackingService,
    private iconService: IconService,
    private translate: TranslateService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  onDownload(item: PastReportList) {
    const currentValue: object = {
      reportCreatedOn: item.createdOn,
      reportDownloadFileName: item.downloadFileName,
      reportType: item.type
    };

    window.open(item.downloadPreSigned, '_blank');

    fetch(item.downloadPreSigned, { mode: 'no-cors' })
      .then((response) => {
        this.sendAuditTrailPayload(currentValue, AuditTrackingEvent.Report,
          AuditTrackingAction.Download, AuditTrackingActionStatus.Success);
      }).catch(error => {
        this.sendAuditTrailPayload(currentValue, AuditTrackingEvent.Report,
          AuditTrackingAction.Download, AuditTrackingActionStatus.Failure);
      });
  }

  ngOnInit(): void {
    this.splitPages();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['resetFilter'] && this.tableData.length) {
      this.splitPages();
      this.defaultSorting();
    } else {
      this.splitPages();
    }
    this.configPagination.currentPage = reportsFirstPage;
  }

  splitPages() {
    this.dataSource = new MatTableDataSource(this.tableData);
    if (this.isDefaultSorting && this.dataSource.data.length > 0) {
      this.defaultSorting();
      this.isDefaultSorting = false;
    }
  }

  getTranslationsForMultipleInstruments(reportName: string): string {
    if (reportName.includes(multipleInstruments)) {
      const regularExpression = /Multiple Instruments/gi;
      const translatedText = reportName.replace(regularExpression, this.getTranslation('REPORTNOTIFICATIONS.MULTIPLEINSTRUMENTS'));
      return translatedText;
    }
    return reportName;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  defaultSorting() {
    if (this.sort) {
      const sortState: Sort = { active: 'createdOn', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
      const sortHeader = this.sort.sortables.get('createdOn');
      if (sortHeader) {
        sortHeader['_setAnimationTransitionState']({ toState: 'active' });
      }
    }
  }

  openPreview(item: PastReportList) {
    const auditTrailViewCurrentValue: object = {
      reportCreatedOn: item.createdOn,
      reportDownloadFileName: item.downloadFileName,
      reportType: item.type
    };
    const data: object = {
      ...item,
      auditTrailViewCurrentValue
    };

    const dialog = this.dailogRef.open(PastReportsPreviewComponent, {
      width: '100%',
      height: '650px',
      data
    });

  }

  getMonthLabel(month: number): string {
    return this.getTranslation('FILTERMONTHS.' + this.months[month - 1].toUpperCase());
  }

  getReportTypes(report: string) {
    if (report.length === 1) {
      const types = PastReportsFilterReportList.filter(ele => ele.value === report).map(ro => ro.name);
      return [this.getTranslation(types[0])];
    } else {
      const reportArr = report.split('_');
      const result = [];
      reportArr.filter(function (item) {
        return PastReportsFilterReportList.filter(ele => {
          if (ele.value === item) {
            result.push(ele.name);
          }
        });
      });
      return result.map(ele => this.getTranslation(ele));
    }
  }

  public sendAuditTrailPayload(reportData: any, eventType: string, action: string, actionStatus: string): void {
    const auditTrailFinalPayload = this.prepareAuditTrailPayload(reportData, eventType, action, actionStatus);
    this.appNavigationService.logAuditTracking(auditTrailFinalPayload, true);
  }

  public prepareAuditTrailPayload(reportData: any, eventType: string, action: string, actionStatus: string): AppNavigationTracking {
    const auditPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: eventType,
        action: action,
        actionStatus: actionStatus,
        currentValue: { ...reportData },
      }
    };
    return auditPayload;
  }

  sortData(sort: Sort): void {
    this.dataSource.sort = null;
    // templateName - add this after template is add
    const columnList = ['name', 'type', 'signedBy', 'createdOn'];
    if (columnList.includes(sort.active)) {
      const sortedData = this.tableData.slice();
      sortedData.sort(
        (a: PastReportList, b: PastReportList) => sort.direction === asc
          ? this.sortAlphanumeric(a[sort.active], b[sort.active])
          : this.sortAlphanumeric(b[sort.active], a[sort.active])
      );
      this.dataSource.data = [...sortedData];
    } else if (sort.active === this.displayedColumns[3]) {
      const sortedData = this.tableData.slice();
      if (sort.direction === asc) {
        sortedData.sort((a, b) => a.month - b.month);
      } else {
        sortedData.sort((a, b) => b.month - a.month);
      }
      this.dataSource.data = [...sortedData];
    } if (sort.active === this.displayedColumns[2]) {
      const sortedData = this.tableData.slice();
      if (sort.direction === asc) {
        sortedData.sort((a, b) => a.year - b.year);
      } else {
        sortedData.sort((a, b) => b.year - a.year);
      }
      this.dataSource.data = [...sortedData];
    }
    this.scrollTop();
  }

  sortAlphanumeric(a: string, b: string): number {
    return a.localeCompare(b, 'en', { numeric: true });
  }

  scrollTop() {
    if (this.pastReportsComponentRef && this.pastReportsComponentRef.directiveRef) {
      this.pastReportsComponentRef.directiveRef.scrollToTop();
    }
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

}


