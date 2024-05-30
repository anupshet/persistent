/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { unApi } from '../../../../core/config/constants/un-api-methods.const';
import { FileReceiveApiService } from '../../../../shared/api/fileReceiveApi.service';
import { ApiService } from '../../../../shared/api/api.service';
import { ConfigService } from '../../../../core/config/config.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import * as fromRoot from '../../../../state/app.state';
import { UpdateStatus } from '../models/connectivity-status.model';

@Injectable()
export class FileReceiveService extends ApiService {
  constructor(
    private fileReceiveApi: FileReceiveApiService,
    http: HttpClient,
    config: ConfigService,
    spinnerService: SpinnerService,
    store: Store<fromRoot.State>
  ) {
    super(http, config, store, spinnerService);
  }

  postFiles(data): Observable<any> {
    const apiUrl = unApi.connectivity.uploadFiles;
    return this.fileReceiveApi.post(apiUrl, data, true).pipe(map(res => res));
  }

  updateFileStatus(data): Observable<UpdateStatus> {
    const apiUrl = unApi.connectivity.updateStatus;
    return this.fileReceiveApi.putJson(apiUrl, data, true).pipe(map(res => res));
  }

}
