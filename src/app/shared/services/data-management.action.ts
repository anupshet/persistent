import * as ngrxStore from '@ngrx/store';
import { Injectable } from '@angular/core';

import * as fromRoot from '../../state/app.state';
import * as dataManagementActions from '../../master/data-management/state/actions/data-management.actions';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { DataManagementInfo } from '../../contracts/models/data-management/data-management-info.model';
import { EntityInfo } from '../../contracts/models/data-management/entity-info.model';

@Injectable()
export class DataManagementAction {
  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
  ) { }

  updateDataManagementInfo(
    entityId: string,
    entityType: EntityType,
    entityInfo: EntityInfo,
  ) {
    const dataManagementInfo: DataManagementInfo = {
      entityId: entityId,
      entityType: entityType,
      entityName: entityInfo.entityName,
      productMasterLotId: entityInfo.productMasterLotId,
      cumulativeAnalyteInfo: entityInfo.cumulativeAnalyteInfo,
      headerData: entityInfo.headerData,
      displayName: entityInfo.displayName
    };

    this.store.dispatch(dataManagementActions.UpdateDataManagementInfo({ payload: dataManagementInfo }));
  }
}
