import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { Observable } from 'rxjs';

import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { ApiService } from '../api/api.service';
import { SpinnerService } from '../services/spinner.service';
import * as fromRoot from '../../state/app.state';
import { PresignedUrls } from './request-new-config/new-configuration.model';
import { FileName } from './upload-config-file/upload-config-file.model';
import { unApi } from '../../core/config/constants/un-api-methods.const';

@Injectable({
  providedIn: 'root'
})
export class RequestNewConfigEmailService extends ApiService {
  apiUrl: string;
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).sendEmailUrl;
  }

  public requestUrls(fileName: Array<FileName>): Observable<any> {
    const url = unApi.emailSender.presignedURL;
    return this.post<Array<PresignedUrls>>(url, fileName, true);
  }

  public async sendFile(url: string, file: any): Promise<any> {
    return await this.putFile(`${url}`, file, true).toPromise();
  }

  public requestFileUpload(data: any): Observable<any> {
    const url = unApi.emailSender.send;
    return this.post<Array<PresignedUrls>>(url, data, true);
  }
}
