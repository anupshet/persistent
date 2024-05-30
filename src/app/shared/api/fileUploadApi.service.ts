import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { ApiService } from './api.service';
import * as fromRoot from '../../state/app.state';

@Injectable()
export class FileUploadApiService extends ApiService {

  constructor(http: HttpClient, config: ConfigService, store: ngrxStore.Store<fromRoot.State>) {
    super(http, config, store);
    this.apiUrl  = (<ApiConfig>config.getConfig('api')).connectivityUrl;
 }
}
