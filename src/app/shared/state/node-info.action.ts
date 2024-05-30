import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../state/app.state';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { EntityInfo } from '../../contracts/models/data-management/entity-info.model';
import { DataManagementInfo } from '../../contracts/models/data-management/data-management-info.model';
import { NodeInfoActions } from './actions';

@Injectable()
export class NodeInfoAction {
  constructor(
    private store: Store<fromRoot.State>,
  ) { }

  updateNodeManagementInfo(
    entityId: string,
    entityType: EntityType,
    entityInfo: EntityInfo,
  ) {
    const nodeManagementInfo: DataManagementInfo = {
      entityId: entityId,
      entityType: entityType,
      entityName: entityInfo.entityName,
      productMasterLotId: entityInfo.productMasterLotId,
      cumulativeAnalyteInfo: entityInfo.cumulativeAnalyteInfo,
      headerData: entityInfo.headerData,
      displayName: entityInfo.displayName
    };

    this.store.dispatch(NodeInfoActions.updateNodeInfo({ payload: nodeManagementInfo }));
  }
}
