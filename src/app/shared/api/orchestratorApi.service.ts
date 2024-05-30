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
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { Transformer, SetTransformers, AddTransformerConfiguration, TransformerFields, DeleteConfiguration } from '../../contracts/models/account-management/transformers.model';
import { EdgeBoxIdentifier } from '../../master/connectivity/instructions/models/parsing-properties.model';
import { StatusFileDownloadInfo, StatusPage, StatusesPaginationRequest } from '../../master/connectivity/shared/models/connectivity-status.model';

@Injectable()
export class OrchestratorApiService extends ApiService {
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).multiFileUploadUrl;
  }

  getLogRecords(locationId: string) {
    const data = {
      locationId
    };
    const url = unApi.connectivity.getStatuses;
    return this.post(url, data, true);
  }

  getStatusPages(statusesPaginationRequest: StatusesPaginationRequest) {
    const url = unApi.connectivity.getStatuses;
    return this.post<StatusPage>(url, statusesPaginationRequest, true);
  }

  getLogRecordsById(objectId: string) {
    let url = unApi.connectivity.getStatusesId;
    if (objectId) {
      url = url.replace('{objectId}', objectId);
    }
    return this.get(url, null, true);
  }

  getLogRecordFileUrlById(statusID: string) {
    let url = unApi.connectivity.getStatusFileUrlById;
    if (statusID) {
      url = url.replace('{statusId}', statusID);
    }
    return this.get<StatusFileDownloadInfo>(url, null, true).toPromise();
  }

  public async getConnectivityTransformers(accountId: string, locationId: string): Promise<Array<Transformer>> {
    const url = unApi.connectivity.getTransformers;
    const data = {
      accountId: accountId ? accountId : null,
      locationId: locationId ? locationId : null
    };
    return await this.post<Array<Transformer>>(url, data).toPromise();
  }

  public setConnectivityTransformers(node: any): Promise<Array<SetTransformers>> {
    const url = unApi.connectivity.setTransformers;
    return this.post<Array<SetTransformers>>(url, node).toPromise();
  }

  public getTransformersFields(data: any): Promise<TransformerFields> {
    const url = unApi.connectivity.getTransformerFields;
    return this.post<TransformerFields>(url, data, true).toPromise();
  }

  public addTransformerConfiguration(data: any): Observable<Array<AddTransformerConfiguration>> {
    const url = unApi.connectivity.addTransformerConfiguration;
    return this.post<Array<AddTransformerConfiguration>>(url, data, true);
  }

  public updateTransformerConfiguration(data: any): Observable<Array<AddTransformerConfiguration>> {
    const url = unApi.connectivity.updateTransformerConfiguration;
    return this.put<Array<AddTransformerConfiguration>>(url, data, true);
  }

  public getEdgeBoxIdentifiers(accountId: string, locationId: string): Promise<EdgeBoxIdentifier> {
    const url = unApi.connectivity.getEdgeBoxIdentifiers;
    const data = {
      accountId,
      locationId
    };
    return this.post<EdgeBoxIdentifier>(url, data, true).toPromise();
  }

  public deleteConfiguration(data: DeleteConfiguration) {
    const url = unApi.connectivity.deleteConfiguration;
    return this.delWithData(url, data, true);
  }
}
