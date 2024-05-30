// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';
import { ApiConfig } from '../../../core/config/config.contract';
import { ConfigService } from '../../../core/config/config.service';
import { unApi } from '../../../core/config/constants/un-api-methods.const';
import { ApiService } from '../../../shared/api/api.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import * as fromRoot from '../../../state/app.state';
import { Panel } from '../../../contracts/models/panel/panel.model';
import { IPanelsAPIService } from '../../../contracts/interfaces/i-panels-api.service';
import { SortEntity, SortOrder } from '../../../shared/navigation/models/sort-entity.model';
import { urlPlaceholders } from '../../../core/config/constants/un-url-placeholder.const';
import { nodeTypeNames } from '../../../core/config/constants/general.const';
import { EntityType } from '../../../contracts/enums/entity-type.enum';

@Injectable()
export class PanelsApiService extends ApiService
  implements IPanelsAPIService {
  changedPanelList: TreePill[] = [];
  panelItemList: TreePill[];
  priorPanelList: TreePill[];
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = config.getConfig('api') ? (<ApiConfig>config.getConfig('api')).panelsUrl : '';
  }

  public panelItemListData(): TreePill[] {
    const panelsList = [];
    const panelsData = this.panelItemList;
    panelsData.map((value) => {
      if (value.children != null) {
        panelsList.push(value);
      }
    });
    return panelsList;
  }

  public resetPanelsData(): void {
    this.priorPanelList = [];
    this.changedPanelList = [];
    this.changedPanelList = [];
  }

  public priorPanelItemListData (priorPanelList): TreePill[] {
    const priorPanelsList = [];
    priorPanelList.map((value) => {
      if (value.children != null) {
        priorPanelsList.push(value);
      }
    });
    return priorPanelsList;
  }

  public addPanelData<T extends TreePill>(panel: Array<Panel>): Observable<T[]> {
    const url = unApi.panels;
    return this.post<T[]>(url, panel, true);
  }

  public updatePanelData<T extends TreePill>(panel: Array<Panel>): Observable<T[]> {
    const url = unApi.panels;
    return this.put<T[]>(url, panel, true);
  }

  public updateSortOrder(sortOrderPayload: SortOrder, nodeType: EntityType): Observable<SortEntity[]> {
    const url = unApi.updateSortOrder.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.put<SortEntity[]>(url, sortOrderPayload, true);
  }
}
