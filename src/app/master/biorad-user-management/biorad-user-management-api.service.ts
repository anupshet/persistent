// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromRoot from '../../state/app.state';
import { ApiService } from '../../shared/api/api.service';
import { ConfigService } from '../../core/config/config.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ApiConfig } from '../../core/config/config.contract';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { IBioRadUserManagementAPIService } from '../../contracts/interfaces/biorad-user-management-api.service';
import { BioRadUser, BioRadUserPageRequest, BioRadUserPageResponse } from '../../contracts/models/biorad-user-management/bio-rad-user.models';
import { AppUser } from '../../security/model';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';

@Injectable()
export class BioRadUserManagementApiService extends ApiService
  implements IBioRadUserManagementAPIService {

  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = config.getConfig('api') ? (<ApiConfig>config.getConfig('api')).portalUrl : '';
  }

  public searchBioRadUsers<T extends BioRadUserPageResponse>(bioRadUserPageRequest: BioRadUserPageRequest): Observable<T> {
    const url = unApi.portal.labSetupSearchBioRadUser;
    return this.post<T>(url, bioRadUserPageRequest, false);
  }

  public addBioRadUser<T extends AppUser>(bioRadUserData: BioRadUser): Observable<T> {
    const url = unApi.portal.labSetupBioRadUser;
    return this.post<T>(url, bioRadUserData, true);
  }

  public updateBioRadUser<T extends AppUser>(bioRadUserData: BioRadUser): Observable<T> {
    const url = unApi.portal.labSetupBioRadUser;
    return this.put<T>(url, bioRadUserData, true);
  }

  public deleteBioRadUser<T extends BioRadUser>(bioRadUserId: string): Observable<T> {
    const url = unApi.portal.labSetupBioRadUserDelete.replace(urlPlaceholders.nodeId, bioRadUserId);
    return this.del(url, true);
  }
}
