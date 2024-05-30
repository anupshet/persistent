// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import * as fromRoot from '../../../../state/app.state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { ReportNotification, ReportStatusTypes } from '../../models/report-notification.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { DataTimeFormat } from '../../../../shared/date-time/data-time-formats';
import { allText, blankSpace, forwardSlash, hyphen, underscore } from '../../../../core/config/constants/general.const';
import { PastReportsFilterReportList } from '../../../../core/config/constants/past-reports.const';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { DynamicReportingService } from '../../../../shared/services/reporting.service';
import { NavigationService } from '../../navigation.service';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { multipleInstruments } from '../../../../core/config/constants/general.const';

@Component({
  selector: 'unext-report-notifications',
  templateUrl: './report-notifications.component.html',
  styleUrls: ['./report-notifications.component.scss']
})
export class ReportNotificationsComponent implements OnInit, OnChanges {
  @ViewChild('tabs') tabGroup: MatTabGroup;
  @Input() opened: boolean;
  @Input() notificationList: ReportNotification[];
  @Output() refreshNotificationList: EventEmitter<boolean> = new EventEmitter();
  public getAccountState$ = this.store.pipe(select(sharedStateSelector.getAuthState));
  readyReports: ReportNotification[] = [];
  generatingReports: ReportNotification[] = [];
  failedReports: ReportNotification[] = [];
  generatingReport = ReportStatusTypes.Generating;
  generatingSavingReport = ReportStatusTypes.GeneratingSaving;
  readyReport = ReportStatusTypes.Ready;
  readySavedReport = ReportStatusTypes.ReadySaved;
  failedReport = ReportStatusTypes.Error;
  failedSavingReport = ReportStatusTypes.ErrorSaved;

  locationId: string;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.progressSpinner[24],
    icons.removeCircle[24]
  ];
  reportList: Array<any> = PastReportsFilterReportList;

  constructor(private iconService: IconService,
    private store: Store<fromRoot.State>,
    private dynamicReportingService: DynamicReportingService,
    private errorLoggerService: ErrorLoggerService,
    private navigationService: NavigationService,
    private router: Router,
    private translate: TranslateService,
    private dateTimeHelper: DateTimeHelper) {
    this.iconService.addIcons(this.iconsUsed);
  }


  ngOnInit(): void {
    this.getAccountState$.pipe(filter(account => !!account), take(1))
      .subscribe(authStateCurrent => {
        try {
          this.locationId = authStateCurrent.currentUser.labLocationId;
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.notificationList && changes.notificationList?.currentValue && changes.notificationList?.currentValue.length > 0) {
      this.notificationList = changes.notificationList.currentValue;
      this.sortNotifications();
      setTimeout(() => {
        this.checkForEmptyTab();  // for switching the tab based on sorting done above
      }, 300);
    }
    if (changes.opened && changes.opened?.currentValue && changes.opened?.currentValue === true) {
      setTimeout(() => {
        this.checkForEmptyTab();
      }, 300);
    }
  }

  // Sorts notifications based on their status - ready, generating, failed
  sortNotifications() {
    this.generatingReports = [];
    this.readyReports = [];
    this.failedReports = [];
    if (this.notificationList && this.notificationList.length > 0) {
      for (const obj of this.notificationList) {
        if (obj.reportStatus === ReportStatusTypes.Generating || obj.reportStatus === ReportStatusTypes.GeneratingSaving) {
          this.generatingReports.push(obj);
        } else if (obj.reportStatus === ReportStatusTypes.Ready || obj.reportStatus === ReportStatusTypes.ReadySaved) {
          this.readyReports.push(obj);
        } else {
          this.failedReports.push(obj);
        }
      }
    }
  }

  /**
   * Displays name based on report type
   * @param report report for which name needs to be generated
   * @returns name
   */
  getName(report: ReportNotification): string {
    let date = this.dateTimeHelper.getYearAndMonth(report.yearMonth, DataTimeFormat.ShortDateWithMonthAndYear);
    date = this.removeAlphabets(date) + blankSpace + this.removeNumeric(date);
    const types = report.reportType.split(underscore);
    if (types.length > 2) {
      return this.getTranslations('REPORTPANEL.' + allText.toUpperCase()) + hyphen + date;
    } else {
      const names = this.reportList.filter(object => types.includes(object.value)).map(object => this.getTranslations(object.name));
      return (names.join(blankSpace + forwardSlash + blankSpace) + hyphen + date);
    }
  }

  removeAlphabets(string): string {
    return this.getTranslations('FILTERMONTHS.' + string.replace(/[^a-z]/gi, '').toUpperCase());
  }

  removeNumeric(string): string {
    return string.replace(/[^0-9]/gi, '');
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  /**
   * Displays description based on report type
   * @param report report for which description needs to be generated
   * @returns description
   */
  getDescription(reportName: String): string {
    if (reportName) {
      const nameSplit = reportName.split(' ');
      nameSplit.pop();
      let convertedString =  nameSplit.join(' ').trim();
      if (convertedString.includes(multipleInstruments))  {
        convertedString = this.getTranslationsForMultipleInstruments(convertedString);
      }
      return convertedString;
    }
    return '';
  }

  getTranslationsForMultipleInstruments(reportName: string): string {
    const regularExpression = /Multiple Instruments/gi;
    const translatedText = reportName.replace(regularExpression, this.getTranslations('REPORTNOTIFICATIONS.MULTIPLEINSTRUMENTS'));
    return translatedText;
  }

  dismissSingleNotification(notificationId: string, event: MouseEvent) {
    event.stopPropagation();
    this.dynamicReportingService.dismissSingleReportNotification(notificationId)
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          this.refreshNotificationList.emit(true);
        }
      }, (error) => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(error.message));
      });
  }

  dismissAllNotifications() {
    this.dynamicReportingService.dismissAllReportNotifications(this.locationId)
      .pipe(take(1))
      .subscribe((response) => {
        if (response) {
          this.refreshNotificationList.emit(true);
        }
      }, (error) => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(error.message));
      });
  }

  updateNotification(reportNotification: ReportNotification) {
    if (!reportNotification.isRead) {
      this.dynamicReportingService.updateReportNotifications(reportNotification.id)
        .pipe(take(1))
        .subscribe((response) => {
          if (response) {
            this.refreshNotificationList.emit(true);
          }
        }, (error) => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        });
    }
    this.openReport(reportNotification);
  }

  openReport(reportNotification: ReportNotification) {
    this.navigationService.setSelectedReportNotificationId(reportNotification.id);
    if (reportNotification.reportStatus === ReportStatusTypes.ReadySaved) {
      this.router.navigate([unRouting.reports + forwardSlash + unRouting.reporting.pastReports]);
    } else {
      if (!this.router.url.includes(unRouting.reporting.newReports)) {
        this.router.navigate([unRouting.reports + forwardSlash + unRouting.reporting.newReports]);
      }
    }

  }

  checkForEmptyTab() {
    if (this.tabGroup) {
      if (this.readyReports.length === 0 && this.generatingReports.length > 0) {
        this.tabGroup.selectedIndex = 1;
      } else if (this.readyReports.length === 0 && this.generatingReports.length === 0 && this.failedReports.length > 0) {
        this.tabGroup.selectedIndex = 2;
      } else if (this.readyReports.length > 0) {
        this.tabGroup.selectedIndex = 0;
      }
      setTimeout(() => {
        this.tabGroup.realignInkBar();  // for aligning the bottom ink-bar to the correct position after the tab will be switched
      }, 600);
    }
  }

  navigateToPastReport() {
    this.router.navigate([unRouting.reports + forwardSlash + unRouting.reporting.pastReports]);
  }
}
