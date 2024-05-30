// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Observable } from 'rxjs';

import { TreePill } from '../models/lab-setup/tree-pill.model';
import { LevelLoadRequest } from '../models/portal-api/labsetup-data.model';
import { BasePortalDataEntity } from '../models/portal-api/portal-data.model';
import { QueryParameter } from '../../shared/models/query-parameter';
import { EntityType } from '../enums/entity-type.enum';

export interface IPortalAPIService {
  upsertPortalData(baseModel: BasePortalDataEntity): Observable<BasePortalDataEntity>;

  deletePortalData(baseModel: BasePortalDataEntity): Observable<BasePortalDataEntity>;

  getLabSetupNode<T extends TreePill>(nodeType : EntityType, nodeId: string, options: LevelLoadRequest): Observable<T>;

  listLabSetupNode<T extends TreePill>(entity: new () => T, queryParameters: QueryParameter[]): Observable<T[]>;

  searchLabSetupNode<T extends TreePill>(entity: new () => T, searchString: string): Observable<T[]>;

  upsertLabSetupNode<T extends TreePill>(node: T, nodeType: EntityType): Observable<T>;

  upsertLabSetupNodeBatch<T extends TreePill>(node: T[], nodeType: EntityType): Observable<T[]>;

  deleteLabSetupNode(nodeType: EntityType, nodeId: string): Observable<boolean>;

  getAllowedRoles(): Observable<Array<string>>;
}
