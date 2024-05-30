/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import * as fromRoot from '../../state/app.state';
import * as sharedStateSelector from '../../shared/state/selectors';
import { PortalApiService } from '../api/portalApi.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { NodeInfoAction } from '../state/node-info.action';
import { LabInstrument, LabProduct, LabTest, TreePill } from '../../contracts/models/lab-setup';
import { EntityInfo } from '../../contracts/models/data-management/entity-info.model';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { Unit } from '../../contracts/models/codelist-management/unit.model';
import { Header } from '../../contracts/models/data-management/header.model';
import { ProductMasterLot, TestSpec } from '../../contracts/models/portal-api/labsetup-data.model';

@Injectable({
  providedIn: 'root'
})
export class NodeInfoService {
  public entityType = EntityType.LabTest;
  public analyteId: string;
  public getAncestorsState$ = this.store.pipe(select(sharedStateSelector.getAncestors));
  private headerData = new BehaviorSubject<Header>(null);
  public currentHeaderData = this.headerData.asObservable();

  constructor(
    private store: Store<fromRoot.State>,
    private portalApiService: PortalApiService,
    private codeListService: CodelistApiService,
    private nodeInfoAction: NodeInfoAction,
  ) { }

  fetchHeaderDetails(analyteId) {
    this.analyteId = analyteId;
    this.getAncestorsState$.pipe(filter(ancestors => !!ancestors), take(1))
      .subscribe(ancestors => {
        const ancestorsMultiple = ancestors.filter((value, index, items) =>
          (value.some((item) => item.id === this.analyteId)) ? items[index] : null);
        if (ancestorsMultiple.length >= 1) {
          this.getNodeInfo(ancestorsMultiple[0]);
        } else {
          this.portalApiService.getLabSetupAncestorsMultiple<TreePill>(EntityType.LabTest, [this.analyteId])
            .pipe(filter(_ancestors => !!_ancestors), take(1))
            .subscribe(_ancestors => {
              const _ancestorsMultiple = _ancestors[0];
              this.getNodeInfo(_ancestorsMultiple);
            });
        }
      });
  }

  private async getNodeInfo(ancestorsMultiple) {
    // getEntityInfo to collect node info details
    const tempEntityInfo = await this.getEntityInfo(ancestorsMultiple);
    if (tempEntityInfo) {
      this.nodeInfoAction.updateNodeManagementInfo(this.analyteId, this.entityType, tempEntityInfo);
    }
  }

  private async getEntityInfo(entities: TreePill[], ancestors?: TreePill[]): Promise<EntityInfo> {
    const tempEntityInfo = new EntityInfo();
    const labTest = (entities) ? <LabTest>entities[0] : null;
    const prod = (entities) ? <LabProduct>entities[1] : null;
    const inst = (entities) ? <LabInstrument>entities[2] : null;
    tempEntityInfo.entityName = (labTest) ? labTest.displayName : '';

    if (labTest && labTest.nodeType === EntityType.LabTest) {
      const unitName: string = <string>await this.getUnitName(prod.lotInfo.id, labTest.testSpecInfo.analyteId,
        labTest.testSpecInfo.instrumentId, labTest.labUnitId);
      tempEntityInfo.headerData = this.getHeaderInfo(labTest.testSpecInfo, inst.instrumentCustomName, prod.displayName,
        prod.productCustomName, prod.lotInfo, unitName);
      this.headerData.next(tempEntityInfo.headerData);
    }
    return tempEntityInfo;
  }

  private async getUnitName(prodlotInfoId: number, analyteId: number, instrumentId: number, labUnitId: string): Promise<string> {
    let unit: Unit[];
    await this.codeListService.getUnits(
      prodlotInfoId,
      analyteId,
      instrumentId
    ).toPromise()
      .then((units: Unit[]) => {
        unit = units.filter((_unit) => _unit.id === +labUnitId);
      });

    return unit[0]?.name;
  }

  private getHeaderInfo(testSpec: TestSpec, customInstrumentName: string, productName: string,
    customProductName: string, lotInfo: ProductMasterLot, unitName: string): Header {
    const tempHeader: Header = {
      analyteName: testSpec.analyteName,
      instrumentName: testSpec.instrumentName,
      instrumentAlias: customInstrumentName,
      customProductName: customProductName,
      productName: productName,
      productMasterLotNumber: lotInfo.lotNumber,
      reagentName: testSpec.reagentName,
      reagentLotNumber: testSpec.reagentLot && testSpec.reagentLot.lotNumber || null,
      reagentLotId: testSpec.reagentLot && testSpec.reagentLot.id || null,
      method: testSpec.methodName,
      unit: unitName,
      calibrator: testSpec.calibratorName,
      calibratorLotNumber: testSpec.calibratorLot && testSpec.calibratorLot.lotNumber || null,
      calibratorLotId: testSpec.calibratorLot && testSpec.calibratorLot.id || null,
      codeListTestId: testSpec.testId,
      labUnitId: testSpec.storageUnitId,
      lotExpiringDate: lotInfo.expirationDate
    };
    return tempHeader;
  }
}
