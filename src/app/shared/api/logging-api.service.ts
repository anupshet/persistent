/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { ApiService } from './api.service';
import { SpinnerService } from '../services/spinner.service';
import * as fromRoot from '../../state/app.state';
import { ILoggingAPIService } from '../../contracts/interfaces/i-logging-api.service';
import { AuditTracking, ReviewSummaryHistory } from '../models/audit-tracking.model';
import { BrError } from '../../contracts/models/shared/br-error.model';
@Injectable()
export class LoggingApiService extends ApiService
  implements ILoggingAPIService {
  path: string;
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).loggingUrl;
  }

  /**
   * This method is used to post audit trail details in db
   * @param payload Contains audit trail details
   * @param isValidUser is user authenticated or not
   * @returns post call response
   */
  public appNavigationTracking(payload: any, isValidUser: boolean): Observable<any> {
    isValidUser
      ? this.path = this.apiUrl + '/' + unApi.labData.navAuditTracking
      : this.path = this.apiUrl + '/' + unApi.labData.navAuditTrackingNonauth;

    return this.postAuditTrackingNavigation(this.path, payload, false);
  }

  public getAuditTrailHistory(device_Id: string): Observable<ReviewSummaryHistory> {
    this.path = this.apiUrl + '/' + unApi.labData.navAuditTrackingHistory;
    const appendParams = this.appendUrl(unApi.labData.navAuditTrackingHistory, 'device_id', device_Id);
    return this.get(appendParams, null, false);
  }

  public auditTracking(auditTrackingModel: AuditTracking): Promise<any> {
    const path = unApi.labData.auditTracking;
    return this.post(path, auditTrackingModel, false).toPromise();
  }

  public logError(error: BrError): Observable<any> {
    const path = unApi.trackingLog.errorLogger;
    return this.post(path, error, false);
  }
}
