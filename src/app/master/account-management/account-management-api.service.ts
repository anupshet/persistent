// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IAccountManagementAPIService } from '../../contracts/interfaces/i-account-management-api.service';
import { ApiService } from '../../shared/api/api.service';
import { ConfigService } from '../../core/config/config.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ApiConfig } from '../../core/config/config.contract';
import { LabLocation, TreePill } from '../../contracts/models/lab-setup';
import * as fromRoot from '../../state/app.state';
import { Lab } from '../../contracts/models/lab-setup/lab.model';
import { Account, AccountPageRequest, AccountPageResponse } from '../../contracts/models/account-management/account';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { nodeTypeNames } from '../../core/config/constants/general.const';
import { LabTree } from '../../contracts/models/lab-setup/lab-tree.model';
import { LocationPage, LocationSearchRequest } from '../../contracts/models/account-management/location-page.model';

@Injectable()
export class AccountManagementApiService extends ApiService
  implements IAccountManagementAPIService {

  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = config.getConfig('api') ? (<ApiConfig>config.getConfig('api')).portalUrl : '';
  }

  public searchAccounts<T extends AccountPageResponse>(accountPageRequest: AccountPageRequest): Observable<T> {
    const url = unApi.portal.labSetupSearchList.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.Account]);
    return this.post<T>(url, accountPageRequest, false);
  }

  public addAccount<T extends TreePill>(account: Account): Observable<T> {
    const url = unApi.portal.labSetupV2.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.Account]);
    return this.post<T>(url, account, true);
  }

  public updateAccount<T extends TreePill>(account: Account): Observable<T> {
    const url = unApi.portal.labSetupV2.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.Account]);
    return this.put<T>(url, account, true);
  }

  public getGroups(nodeType: EntityType, accountId: string): Observable<LabTree> {
    const nodeId = accountId;
    const data = {
      nodeId
    };
    const url = unApi.lab.labHierarchy.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.post<LabTree>(url, data);
  }

  public searchLocations<T extends LocationPage>(locationSearchRequest: LocationSearchRequest): Observable<T> {
    const url = unApi.portal.labSetupSearchLocationList.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.LabLocation]);
    return this.post<T>(url, locationSearchRequest, false);
  }

  public addLocation<T extends LabLocation>(location: LabLocation): Observable<T> {
    const url = unApi.portal.labSetupV2.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.LabLocation]);
    return this.post<T>(url, location, true);
  }

  public updateLocation<T extends LabLocation>(location: LabLocation): Observable<T> {
    const url = unApi.portal.labSetupV2.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.LabLocation]);
    return this.put<T>(url, location, true);
  }

  public deleteAccount<T extends TreePill>(accountId: string): Observable<T> {
    const url = unApi.portal.labSetupDeleteAccount.
      replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.Account]).replace(urlPlaceholders.nodeId, accountId);
    return this.del(url, true);
  }

  public addGroup<T extends TreePill>(group: Lab): Observable<T> {
    const url = unApi.portal.labSetupV2.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.Lab]);
    return this.post<T>(url, group, true);
  }

  public updateGroup<T extends TreePill>(group: Lab): Observable<T> {
    const url = unApi.portal.labSetupV2.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.Lab]);
    return this.post<T>(url, group, true);
  }

  public deleteGroup<T extends TreePill>(groupId: string): Observable<T> {
    const url = unApi.portal.labSetupDeleteV2.
      replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.Lab]).replace(urlPlaceholders.nodeId, groupId);
    return this.del(url, true);
  }

  public deleteUser<T extends TreePill>(userId: string): Observable<T> {
    const url = unApi.portal.labSetupDeleteV2.
      replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.User]).replace(urlPlaceholders.nodeId, userId);
    return this.del(url, true);
  }

  public deleteLocation<T extends TreePill>(locationId: string): Observable<T> {
    const url = unApi.portal.labSetupDeleteV2.
      replace(urlPlaceholders.nodeTypeName, nodeTypeNames[EntityType.LabLocation]).replace(urlPlaceholders.nodeId, locationId);
    return this.del(url, true);
  }
}
