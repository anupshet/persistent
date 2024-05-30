// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../shared/api/api.service';
import { CodeList } from '../../contracts/models/code-list.model';
import { LabTree } from '../../contracts/models/lab-setup/lab-tree.model';
import { Lab } from '../../contracts/models/lab-setup/lab.model';
import { NodeService } from '../../contracts/node.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { nodeTypeNames } from '../../core/config/constants/general.const';

@Injectable()
export class LabSetupService implements NodeService {
  constructor(private apiService: ApiService) { }

  private getLab(labId: number): Observable<Lab> {
    return this.apiService.get<Lab>(`portal/labs/${labId}`);
  }

  getLabDirectory(nodeType: EntityType, accountId: string): Observable<LabTree> {
    const nodeId = accountId;
    const data = {
      nodeId
    };
    const url = unApi.lab.labHierarchy.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.apiService.post<LabTree>(url, data);
  }



  getDetailsById(id: number, codeList?: CodeList): Observable<Lab> {
    return this.getLab(id);
  }
}
