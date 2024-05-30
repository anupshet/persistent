// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Injectable } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import * as fromRoot from '../../../../state/app.state';
import { ApiService } from '../../../../shared/api/api.service';
import { unApi } from '../../../../core/config/constants/un-api-methods.const';
import { LabConfigResponse } from '../../models/report-info';
import { ConfigService } from '../../../../core/config/config.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { ApiConfig } from '../../../../core/config/config.contract';


@Injectable()
export class DynamicReportsService extends ApiService {
  public isAnalyticalSectionVisible = true;
  private isCreateBtnDisabled = new BehaviorSubject<boolean>(false);
  private isTemplateUpdated = new BehaviorSubject<boolean>(false);


  constructor(http: HttpClient, config: ConfigService, store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).portalUrl;
  }

  searchReport(accountId: string, locationId: string, date: string): Observable<LabConfigResponse> {
    const url = unApi.dynamicReporting.searchReport + '?AccountId=' + accountId + '&LocationId=' + locationId + '&YearMonth=' + date;
    return this.get<LabConfigResponse>(url, null, true);
  }

  enableOrDisableCreateButton(status: boolean) {
    this.isCreateBtnDisabled.next(status);
  }

  getCreateButtonStatus(): Observable<boolean> {
    return this.isCreateBtnDisabled.asObservable();
  }

  setTemplateUpdated(status: boolean) {
    this.isTemplateUpdated.next(status);
  }

  getTemplateUpdated(): boolean {
    return this.isTemplateUpdated.getValue();
  }
}
