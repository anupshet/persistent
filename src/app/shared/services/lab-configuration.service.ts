// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { ApiService } from '../api/api.service';
import { SpinnerService } from './spinner.service';
import * as fromRoot from '../../state/app.state';
import { ILabConfigurationAPIService } from '../../contracts/interfaces/i-lab-configuration-api.service';
import { InstrumentInfo, InstrumentListRequest } from '../../contracts/models/shared/list-duplicate-lot-instruments.model';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { LabLotTest, LabLotTestType } from '../../master/connectivity/shared/models/lab-lot-test.model';

@Injectable()
export class LabConfigurationApiService extends ApiService
  implements ILabConfigurationAPIService {

  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = config.getConfig('api') ? (<ApiConfig>config.getConfig('api')).labConfigurationUrl : '';
  }

  public getDuplicateLotInstruments(duplicateLotInstrumentrequest: InstrumentListRequest): Observable<Array<InstrumentInfo>> {
    const targetProductMasterLotId = duplicateLotInstrumentrequest.targetProductMasterLotId ?
      duplicateLotInstrumentrequest.targetProductMasterLotId : '0';
    const url = unApi.portal.duplicateLotInstruments.replace(urlPlaceholders.instrumentId, duplicateLotInstrumentrequest.labInstrumentId)
      .replace(urlPlaceholders.productId, duplicateLotInstrumentrequest.productId)
      .replace(urlPlaceholders.sourceProductMasterLotId, duplicateLotInstrumentrequest.sourceProductMasterLotId)
      .replace(urlPlaceholders.targetProductMasterLotId, targetProductMasterLotId);
    return this.get<Array<InstrumentInfo>>(`${url}`, null, true);
  }

  public getTests(locationId: string, type: LabLotTestType, id?: string, showBusy: boolean = true): Observable<Array<LabLotTest>> {
    const data = {
      locationId
    };
    let url = unApi.labconfiguration.tests;
    if (id) {
      url = this.appendUrl(url, urlPlaceholders.idKey, id);
    }
    if (type) {
      url = this.appendUrl(url, urlPlaceholders.type, type);
    }
    return this.post<Array<LabLotTest>>(url, data, showBusy);
  }

  protected appendUrl(url: string, queryKey: string, queryValue: string): string {
    if (queryValue) {
      if (!url.includes('?')) {
        url += '?';
      } else {
        url += '&';
      }
      url += queryKey + '=' + queryValue;
    }
    return url;
  }
}
