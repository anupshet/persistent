/* © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved.*/
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { ApiService } from './api.service';
import { SpinnerService } from '../services/spinner.service';
import * as fromRoot from '../../state/app.state';

@Injectable()
export class FileReceiveApiService extends ApiService {
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).multiFileUploadUrl;
  }
}
