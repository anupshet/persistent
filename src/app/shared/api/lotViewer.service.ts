// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { ApiService } from './api.service';
import { SpinnerService } from '../services/spinner.service';
import * as fromRoot from '../../state/app.state';
import { LotviewerReportType } from '../../contracts/enums/lotviewer/lotviewer-reporttype.enum';
import { LotviewerEmbedUrl } from '../../contracts/models/lotviewer/lotviewer-embed-url.model';
import { unApi } from '../../core/config/constants/un-api-methods.const';

@Injectable()
export class LotViewerService extends ApiService {
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).lotViewerUrl;
  }

  getLotviewerReport(lotviewerReportType: LotviewerReportType, locationPayload: any): Observable<LotviewerEmbedUrl> {
    const path = unApi.lotviewerReport
      .replace('{lotviewerReportType}', lotviewerReportType);
    return this.post(`${path}`, locationPayload, false);
  }

}
