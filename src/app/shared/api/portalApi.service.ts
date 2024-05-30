// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { EntityType } from '../../contracts/enums/entity-type.enum';
import { IPortalAPIService } from '../../contracts/interfaces/i-portal-api.service';
import { TreePill } from '../../contracts/models/lab-setup/tree-pill.model';
import { LevelLoadRequest } from '../../contracts/models/portal-api/labsetup-data.model';
import { BasePortalDataEntity } from '../../contracts/models/portal-api/portal-data.model';
import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { ApiService } from './api.service';
import { QueryParameter } from '../../shared/models/query-parameter';
import { LotRenewalPayload } from '../../contracts/models/actionable-dashboard/actionable-dashboard.model';
import { User } from '../../contracts/models/user-management/user.model';
import { SpinnerService } from '../services/spinner.service';
import { AccountSettings } from '../../contracts/models/lab-setup/account-settings.model';
import * as fromRoot from '../../state/app.state';
import { includeArchivedItems, nodeTypeNames } from '../../core/config/constants/general.const';
import { DuplicateControlRequest, PayLoadWithAuditData, StartNewBrLotRequest } from '../../contracts/models/shared/duplicate-control-request.model';
import { Utility } from '../../core/helpers/utility';
import { CustomControlRequest, CustomControlDeleteRequest } from '../../contracts/models/control-management/custom-control-request.model';
import { LabProduct } from '../../contracts/models/lab-setup';

@Injectable()
export class PortalApiService extends ApiService
  implements IPortalAPIService {

  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService,
    private datePipe: DatePipe
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = config.getConfig('api') ? (<ApiConfig>config.getConfig('api')).portalUrl : '';
  }

  public getGrandChildren(nodeType: EntityType, nodeId: string, includedArchivedItems?: string): Observable<BasePortalDataEntity> {
    const data = {
      nodeId
    };
    let path = unApi.treeNode.instrumentReportsNodes.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    if (includedArchivedItems) {
      path = this.appendUrl(path, includeArchivedItems, includedArchivedItems);
    }
    path = this.appendUrl(path, 'IncludeAllTestSpecIds', 'true');
    return this.post(`${path}`, data, true);
  }

  public upsertPortalData(baseModel: BasePortalDataEntity): Observable<BasePortalDataEntity> {
    const url = unApi.portal.portalData;
    return this.post<BasePortalDataEntity>(url, baseModel, true);
  }

  public saveLabsetupDefaults(accountSettings: AccountSettings): Promise<AccountSettings> {
    const url = unApi.portal.accountSettings;
    return this.put<AccountSettings>(url, accountSettings, true).toPromise();
  }

  public deletePortalData(baseModel: BasePortalDataEntity): Observable<BasePortalDataEntity> {
    const url = unApi.portal.portalData;
    return this.delWithData<BasePortalDataEntity>(url, baseModel, true);
  }

  public getLabSetupNode<T extends TreePill>(nodeType: EntityType, nodeId: string, options: LevelLoadRequest,
    filterEntityType: EntityType = EntityType.None, queryParameters?: QueryParameter[], doNotshowBusy?: boolean, locationId?: string
  ): Observable<T> {
    // Fix for IE caching issue
    const dateTimeStamp = new Date();
    const date = this.datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    let url;
    // Call V2 api to fetch location
    if (nodeType === EntityType.LabLocation) {
        url = (Utility.isEmpty(nodeId) ? unApi.portal.labSetupGetNodeFromHeader : unApi.portal.labSetupGetV2)
          .replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType])
          .replace(urlPlaceholders.nodeId, nodeId);
    } else {
      url = (Utility.isEmpty(nodeId) ? unApi.portal.labSetupGetNodeFromHeader : unApi.portal.labSetupGet)
        .replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType])
        .replace(urlPlaceholders.nodeId, nodeId);
    }

    url = this.appendUrl(url, 'v', date.toString());
    if (options !== LevelLoadRequest.None) {
      url = this.appendUrl(url, urlPlaceholders.loadChildren, LevelLoadRequest[options]);
    }
    if (filterEntityType !== EntityType.None) {
      url = this.appendUrl(url, urlPlaceholders.childFilter, filterEntityType.toString());
    }
    if (queryParameters && queryParameters.length) {
      queryParameters.forEach(queryParameter => {
        url = this.appendUrl(url, queryParameter.key, queryParameter.value);
      });
    }
    if (locationId) {
      url = this.appendUrl(url, urlPlaceholders.labSetupLocationId, locationId);
    }
    return this.getWithError<T>(url, null, !doNotshowBusy);
  }

  public upsertLabSetupNodeBatch<T extends TreePill>(nodes: T[], nodeType: EntityType): Observable<T[]> {
    const url = unApi.portal.labSetupBatch.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.post<T[]>(url, nodes, true);
  }

  public getLabSetupNodeWithTestSettings<T extends TreePill>(nodeType: EntityType, nodeId: string, options: LevelLoadRequest,
    filterEntityType: EntityType = EntityType.None
  ): Observable<T> {
    let url = unApi.portal.labSetupGet
      .replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType])
      .replace(urlPlaceholders.nodeId, nodeId);
    if (options !== LevelLoadRequest.None) {
      url = this.appendUrl(url, urlPlaceholders.loadChildren, LevelLoadRequest[options]);
    }
    url = this.appendUrl(url, urlPlaceholders.loadTestSettings, 'true');
    if (filterEntityType !== EntityType.None) {
      url = this.appendUrl(url, urlPlaceholders.childFilter, filterEntityType.toString());
    }
    return this.getWithError<T>(url, null, true);
  }

  // AJT 06152022 bug fix UN7535 add spinner
  public getLabSetupAncestors<T extends TreePill>(nodeType: EntityType, nodeId: string): Observable<T[]> {
    const url = unApi.portal.labSetupGetAncestors.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType])
      .replace(urlPlaceholders.nodeId, nodeId);
    return this.get<T[]>(url, null, true);
  }

  public getLabSetupAncestorsMultiple<T extends TreePill>(nodeType: EntityType, nodeIds: string[],
    options: LevelLoadRequest = LevelLoadRequest.LoadUpToDepartment): Observable<T[][]> {
    const url = unApi.portal.labSetupGetAncestorsMultiple.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType])
      .replace(urlPlaceholders.loadParent, LevelLoadRequest[options]);
    return this.post<T[][]>(url, nodeIds, true);
  }

  public listLabSetupNode<T extends TreePill>(entity: new () => T, queryParameters: QueryParameter[]): Observable<T[]> {
    const entityInstance = new entity();
    let url = unApi.portal.labSetupList.replace(urlPlaceholders.nodeType, EntityType[entityInstance.nodeType]);

    queryParameters.forEach(queryParameter => {
      url = this.appendUrl(url, queryParameter.key, queryParameter.value);
    });

    return this.get<T[]>(url, null, true);
  }

  public listLabSetupNodeAndChildren<T1 extends TreePill, T2 extends TreePill>(entity: new () => T1, childEntity: new () => T2)
    : Observable<T1[]> {
    const entityInstance = new entity();
    const childEnityInstance = new childEntity();
    let url = unApi.portal.labSetupList.replace(urlPlaceholders.nodeType, EntityType[entityInstance.nodeType]);
    url = this.appendUrl(url, urlPlaceholders.loadChildren, urlPlaceholders.loadChildren);
    url = this.appendUrl(url, urlPlaceholders.childFilter, childEnityInstance.nodeType.toString());
    return this.get<T1[]>(url, null, true);
  }

  public searchLabSetupNode<T extends TreePill>(entity: new () => T, searchString: string, showBusy = true): Observable<T[]> {

    const entityInstance = new entity();
    const url = unApi.portal.labSetupSearch
      .replace(urlPlaceholders.nodeType, EntityType[entityInstance.nodeType])
      .replace(urlPlaceholders.searchString, searchString);
    return this.get<T[]>(url, null, showBusy);
  }

  // TODO: Remove v2 flag/url when all upsertLabSetupNode api support v2 response
  public upsertLabSetupNode<T extends TreePill>(node: T, nodeType: EntityType, isV2 = false): Observable<T> {
    const url = isV2 ? unApi.portal.labSetupV2.replace(urlPlaceholders.nodeTypeName,
      nodeTypeNames[nodeType]) : unApi.portal.labSetup.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.post<T>(url, node, true);
  }

  public deleteLabSetupNode(nodeType: EntityType, nodeId: string): Observable<boolean> {
    const url = unApi.portal.labSetupDelete.
      replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]).replace(urlPlaceholders.nodeId, nodeId);
    return this.del(url, true);
  }

  public duplicateLabProductNode(node: LotRenewalPayload, duplicateChildren: boolean, parentNodeId: string): Observable<LotRenewalPayload> {
    let url = unApi.portal.labSetupDuplicate.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[node.nodeType]);
    if (duplicateChildren) {
      url = this.appendUrl(url, urlPlaceholders.children, duplicateChildren.toString());
      url = this.appendUrl(url, urlPlaceholders.parentNodeId, parentNodeId);
    }
    return this.post(url, node);
  }

  public duplicateNode<T extends DuplicateControlRequest>(nodeType: EntityType, duplicateControlRequest: T[]): Observable<string[]> {
    const url = unApi.portal.duplicateNode.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.post(url, duplicateControlRequest, true);
  }

  getUsers(nodeType: EntityType, locationId: string): Observable<User> {
    return this.getLabSetupNode<User>(nodeType, null, LevelLoadRequest.LoadChildren, EntityType.User, null, null, locationId);
  }

  getAllowedRoles(): Observable<Array<string>> {
    const path = unApi.portal.allowedRoles;
    return this.get(`${path}`, null, false);
  }

  updateArchiveForNode(node: TreePill): Observable<any> {
    const url = unApi.portal.labSetup;
    return this.put<AccountSettings>(url, node, true);
  }

  getExpiredLotsV2(locationId: string, groupedByDept: boolean): Observable<Array<any>> {
    let path = unApi.portal.expiredLotsV2.replace(urlPlaceholders.nodeId, locationId);
    path = path + groupedByDept.toString();
    return this.get(`${path}`, null, false);
  }

  public postNonBrControlDefinitionsWithLabSetup(request: PayLoadWithAuditData<CustomControlRequest[]>): Observable<LabProduct[]> {
    const url = unApi.portal.labSetupAddNonBrControl;
    return this.post(url, request, true);
  }

  public deleteNonBrControlDefinition(request: PayLoadWithAuditData<{ control: CustomControlDeleteRequest; }>, showAsBusy?: boolean): Observable<boolean> {
    return this.delWithData(unApi.portal.labSetupCustomProductDelete, request, showAsBusy);
  }

  // TODO: Check return type during BE integration
  postNonBrMasterLotDefinition(request: PayLoadWithAuditData<StartNewBrLotRequest[]>): Observable<any> {
    const url = unApi.portal.labSetupStartNewNonBrLot;
    return this.post(url, request, true);
  }
}
