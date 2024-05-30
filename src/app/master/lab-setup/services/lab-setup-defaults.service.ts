// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../../shared/api/api.service';
import { LabTree } from '../../../contracts/models/lab-setup/lab-tree.model';
import { unApi } from '../../../core/config/constants/un-api-methods.const';
import { urlPlaceholders } from '../../../core/config/constants/un-url-placeholder.const';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { nodeTypeNames } from '../../../core/config/constants/general.const';

@Injectable()
export class LabSetupDefaultsService {

  // TODO: This whole service is just a shell and is not  done yet  !
  // The API for lab-setup-default page has to be created/verified if existing

  constructor(private apiService: ApiService
  ) { }

  getLabDirectory(nodeType: EntityType, accountId: string): Observable<LabTree> {
    const data = {
      accountId
    };
    const url = unApi.lab.labHierarchy.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.apiService.post<LabTree>(url, data, true);
  }

  getLabForContextLevel(nodeType: EntityType, accountId: string): Observable<LabTree> {
    return this.getLabDirectory(nodeType, accountId);
  }

  delete<T>(nodeType: EntityType, id: string): Observable<T> {
    const url = unApi.portal.labSetupDelete.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]).replace(urlPlaceholders.nodeId, id);
    return this.apiService.del(url, true);
  }

  get<T>(id: string): Observable<T> {
    const url = unApi.portal.labSetupGet.replace(urlPlaceholders.nodeId, id);
    return this.apiService.get<T>(url, null, true);
  }

  search<T>(searchString: string, type: string): Observable<T> {
    const url = unApi.portal.labSetupSearch
      .replace(urlPlaceholders.nodeType, type)
      .replace(urlPlaceholders.searchString, searchString);
    return this.apiService.get<T>(url, null, true);
  }

  list<T>(type: string): Observable<Array<T>> {
    const url = unApi.portal.labSetupList.replace(
      urlPlaceholders.nodeType,
      type
    );
    return this.apiService.get<Array<T>>(url, null, true);
  }

  post<T>(data: T, nodeType: EntityType): Observable<T> {
    const url = unApi.portal.labSetup.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.apiService.post<T>(url, data, true);
  }
}
