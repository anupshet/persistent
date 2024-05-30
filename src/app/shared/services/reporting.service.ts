import { ITemplate } from './../../master/reporting/reporting.enum';
// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Injectable } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import * as fromRoot from '../../state/app.state';
import { ApiService } from '../api/api.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { ReportInfo } from '../../master/reporting/models/report-info';
import { ConfigService } from '../../core/config/config.service';
import { SpinnerService } from './spinner.service';
import { ApiConfig } from '../../core/config/config.contract';
import { StatisticsRequest, StatisticsResult } from '../...//./../../contracts/models/data-management/advanced-lj/lj-statistics.model';
import { ReportNotification } from '../navigation/models/report-notification.model';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { GenerateReport } from '../../master/reporting/models/template-response';

@Injectable()
export class DynamicReportingService extends ApiService {
  public isAnalyticalSectionVisible = true;
  isReset = new Subject<boolean>();
  private isSearchDataLoaded$ = new Subject<ITemplate>();

  constructor(http: HttpClient, config: ConfigService, store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).dynamicReportingUrl;
  }
  /* old methods need to remove later */
  create(reportRequestInfo: ReportInfo) {
    const path = unApi.dynamicReporting.generateReport;
    return this.post(path, reportRequestInfo, false);
  }

  viewPdfReport(payload: any) {
    const path = unApi.dynamicReporting.viewReport;
    return this.post(path, payload, true);
  }

  saveReport(payload: any) {
    const path = unApi.dynamicReporting.saveReport;
    return this.post(path, payload, false);
  }

  /* old methods need to remove later */

  getStatisticsPeerAndMethodData(statsRequest: StatisticsRequest[]): Observable<StatisticsResult[]> {
    const path = unApi.dynamicReporting.retrieveStatistics;
    return this.post(`${path}`, statsRequest, true);
  }

  getTemplateList(locationId: string): Observable<any> {
    const path = unApi.dynamicReporting.getTemplates;
    const data = { 'labLocationId': locationId };
    return this.post(path, data, true);
  }

  saveTemplate(template: ITemplate, showLoader: boolean): Observable<ITemplate> {
    const path = unApi.dynamicReporting.saveTemplate;
    return this.post(path, template, showLoader);
  }

  updateTemplate(data: ITemplate): Observable<ITemplate> {
    const url = unApi.dynamicReporting.updateTemplate;
    return this.put(url, data, true);
  }

  deleteTemplate(templateId: string) {
    const url = unApi.dynamicReporting.deleteTemplate.replace(urlPlaceholders.templatedId, templateId);
    return this.del(url, true);
  }

  getReportNotifications(locationId: string): Observable<Array<ReportNotification>> {
    const path = unApi.dynamicReporting.notificationsReport.replace(urlPlaceholders.locationId, locationId);
    return this.get<Array<ReportNotification>>(path);
  }

  dismissSingleReportNotification(notificationId: string) {
    const url = unApi.dynamicReporting.dismissNotificationReport.replace(urlPlaceholders.notificationId, notificationId);
    return this.del(url, true);
  }

  dismissAllReportNotifications(locationId: string) {
    const url = unApi.dynamicReporting.dismissAllNotificationReport.replace(urlPlaceholders.locationId, locationId);
    return this.del(url, true);
  }


  updateReportNotifications(notificationId: string) {
    const url = unApi.dynamicReporting.updateNotificationReport.replace(urlPlaceholders.notificationId, notificationId);
    return this.put(url, null, true);
  }

  createReport(data: GenerateReport): Observable<GenerateReport> {
    const url = unApi.dynamicReporting.createReport;
    return this.post(url, data, false);
  }

  saveReportInfo(reportInfo): Observable<any> {
    const url = unApi.dynamicReporting.saveReport;
    return this.post(url, reportInfo, false);
  }

  resetFields(status: boolean) {
    this.isReset.next(status);
  }

  getResetStatus(): Observable<boolean> {
    return this.isReset.asObservable();
  }

  setLoadedStatus(templateDetails: ITemplate) {
    this.isSearchDataLoaded$.next(templateDetails);
  }

  getLoadedStatus(): Observable<ITemplate> {
    return this.isSearchDataLoaded$.asObservable();
  }
}
