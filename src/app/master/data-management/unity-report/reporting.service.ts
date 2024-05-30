// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from '../../../core/config/config.contract';
import { ConfigService } from '../../../core/config/config.service';
import { unApi } from '../../../core/config/constants/un-api-methods.const';
import { ApiService } from '../../../shared/api/api.service';
import { MonthlyReport } from './models/monthly-report';
import { urlPlaceholders } from '../../../core/config/constants/un-url-placeholder.const';
import { SpinnerService } from '../../../shared/services/spinner.service';
import * as fromRoot from '../../../state/app.state';

@Injectable()
export class ReportingService extends ApiService {
  constructor(http: HttpClient, config: ConfigService, store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).peerGroupReportingUrl;
  }

  // fix 229996
  // changed busy to false for async
  // may need to make it configurable for sync and async
  getAllReports(id: string) {
    const path = unApi.dataManagement.reporting.getAllReports
      // .replace('{reportLevel}', reportLevel.toString())
      .replace('{reportLevel}', 'Instrument')
      .replace('{entityId}', id);
    return this.get(`${path}`, null, false);
  }

  // fix 229996
  // changed busy to false for async
  // may need to make it configurable for sync and async
  create(reportType: string, reportRequestInfo: MonthlyReport, save: boolean) {
    const path = unApi.dataManagement.reporting.generateAllReports
      .replace('{reportType}', reportType)
      .replace('{reportLevel}', 'Instrument')
      // .replace('{reportLevel}', reportLevel.toString()) Enable when other than instrument generateable
      .replace('{save}', save.toString());
    return this.postForPdf(path, reportRequestInfo, false);
  }

  createTimeoutReport(reportType: string, reportRequestInfo: MonthlyReport, isAsyncSave: boolean) {
    const path = unApi.dataManagement.reporting.generateTimeoutReports
      .replace('{reportType}', reportType)
      .replace('{reportLevel}', 'Instrument')
      .replace('{save}', isAsyncSave.toString());
    return this.post(path, reportRequestInfo, false);
  }

  // fix 229996
  // changed busy to false for async
  // may need to make it configurable for sync and async
  downloadPdfData(reportId: string) {
    const path = unApi.dataManagement.reporting.getReportPDF
    .replace(urlPlaceholders.reportId, reportId);
    // as of 2020/02/03 backend is returning base64
    return this.get(path, 'arraybuffer', false);
  }

  uint8ArrayToString(u8a) {
    const CHUNK_SZ = 0x2000;
    const c = [];
    for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
    }
    return c.join('');
  }
}
