// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { orderBy } from 'lodash';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';
import { SideBarItem } from '../models/side-bar-item.model';
import { LabInstrument, LabTest, LabProduct } from '../../../contracts/models/lab-setup';
import { asc, sortOrder } from '../../../core/config/constants/general.const';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus } from '../../models/audit-tracking.model';

@Injectable()
export class NavSideBarService {
  constructor(
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService
  ) { }


  public action = AuditTrackingAction.View;
  public eventType = AuditTrackingAction.Sort;
  public actionStatus = AuditTrackingActionStatus.Success;
  public sortAction:string;
  public sortedData(currentSortData:string,priorSortData:string): AppNavigationTracking {

    const auditNavigationPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: this.eventType,
        action: this.action,
        actionStatus: this.actionStatus,
        currentValue: {
          sort:currentSortData
        },
        priorValue: {
          sort:priorSortData
        },
      },
    };

    return auditNavigationPayload;
  }

  public sendAuditTrailPayload(currentValues:string, priorValues:string,
    typeOfAction: string, eventType: string, actionStatus: string): void {
    const auditTrailPayload = this.appNavigationService
      .comparePriorAndCurrentValues(currentValues, priorValues, typeOfAction, eventType, actionStatus);
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
  }

  public getSideBarItems(sideNavItems: Array<TreePill>, isPanel = false): Array<SideBarItem> {
    let sideBarItems;
    if (sideNavItems.length > 0 && sideNavItems[0].nodeType === EntityType.LabInstrument) {
      sideBarItems = sideNavItems.map((sideNavItem: LabInstrument) => {
        return this.getInstrumentSideBarItem(sideNavItem);
      });
    } else if (sideNavItems.length > 0 && sideNavItems[0].nodeType === EntityType.LabProduct) {
      sideBarItems = sideNavItems.map((sideNavItem: LabProduct) => {
        return this.getControlSideBarItem(sideNavItem);
      });
    } else if (sideNavItems.length > 0 && sideNavItems[0].nodeType === EntityType.LabTest) {
      sideBarItems = sideNavItems.map((sideNavItem: LabTest) => {
        const sideNavItemTestSpec = sideNavItem.testSpecInfo;

        const itemsWithEquivalentNames: Array<LabTest> = sideNavItems.filter((itemToCompare: TreePill, index: number) => {
          return itemToCompare.id !== sideNavItem.id && itemToCompare.displayName === sideNavItem.displayName;
        }) as Array<LabTest>;

        let isMethodUnique = false, isReagentUnique = false, isReagentAndLotUnique = false,
          isCalibratorUnique = false, isCalibratorAndLotUnique = false, areReagentAndCalibratorLotsUnique = false,
          areMethodAndReagentUnique = false, areMethodAndReagentAndLotUnique = false, areMethodAndCalibratorUnique = false,
          areMethodAndCalibratorAndLotUnique = false, areMethodAndReagentAndCalibratorAndLotsUnique = false;

        // Determine which fields to display to distinguish duplicate analytes.
        if (itemsWithEquivalentNames.length > 0) {
          isMethodUnique = true, isReagentUnique = true, isReagentAndLotUnique = true,
            isCalibratorUnique = true, isCalibratorAndLotUnique = true, areReagentAndCalibratorLotsUnique = true,
            areMethodAndReagentUnique = true, areMethodAndReagentAndLotUnique = true, areMethodAndCalibratorUnique = true,
            areMethodAndCalibratorAndLotUnique = true, areMethodAndReagentAndCalibratorAndLotsUnique = true;

          itemsWithEquivalentNames.forEach(equivalentNameItem => {
            const equivalentNameItemTestSpec = equivalentNameItem.testSpecInfo;

            isMethodUnique = isMethodUnique && sideNavItemTestSpec.methodId !== equivalentNameItemTestSpec.methodId;
            isReagentUnique = isReagentUnique && sideNavItemTestSpec.reagentId !== equivalentNameItemTestSpec.reagentId;
            isReagentAndLotUnique = isReagentAndLotUnique && (sideNavItemTestSpec.reagentId !== equivalentNameItemTestSpec.reagentId ||
              sideNavItemTestSpec.reagentLotId !== equivalentNameItemTestSpec.reagentLotId);
            isCalibratorUnique = isCalibratorUnique && sideNavItemTestSpec.calibratorId !== equivalentNameItemTestSpec.calibratorId;
            isCalibratorAndLotUnique = isCalibratorAndLotUnique
              && (sideNavItemTestSpec.calibratorId !== equivalentNameItemTestSpec.calibratorId
                || sideNavItemTestSpec.calibratorLotId !== equivalentNameItemTestSpec.calibratorLotId);
            areReagentAndCalibratorLotsUnique = areReagentAndCalibratorLotsUnique
              && (sideNavItemTestSpec.reagentId !== equivalentNameItemTestSpec.reagentId
                || sideNavItemTestSpec.reagentLotId !== equivalentNameItemTestSpec.reagentLotId
                || sideNavItemTestSpec.calibratorId !== equivalentNameItemTestSpec.calibratorId
                || sideNavItemTestSpec.calibratorLotId !== equivalentNameItemTestSpec.calibratorLotId);
            areMethodAndReagentUnique = areMethodAndReagentUnique && (sideNavItemTestSpec.methodId !== equivalentNameItemTestSpec.methodId
              || sideNavItemTestSpec.reagentId !== equivalentNameItemTestSpec.reagentId);
            areMethodAndReagentAndLotUnique = areMethodAndReagentUnique
              && (sideNavItemTestSpec.methodId !== equivalentNameItemTestSpec.methodId
                || sideNavItemTestSpec.reagentId !== equivalentNameItemTestSpec.reagentId
                || sideNavItemTestSpec.reagentLotId !== equivalentNameItemTestSpec.reagentLotId);
            areMethodAndCalibratorUnique = areMethodAndCalibratorUnique
              && (sideNavItemTestSpec.methodId !== equivalentNameItemTestSpec.methodId
                || sideNavItemTestSpec.calibratorId !== equivalentNameItemTestSpec.calibratorId);
            areMethodAndCalibratorAndLotUnique = areMethodAndCalibratorUnique
              && (sideNavItemTestSpec.methodId !== equivalentNameItemTestSpec.methodId
                || sideNavItemTestSpec.calibratorId !== equivalentNameItemTestSpec.calibratorId
                || sideNavItemTestSpec.calibratorLotId !== equivalentNameItemTestSpec.calibratorLotId);
            areMethodAndReagentAndCalibratorAndLotsUnique = areMethodAndCalibratorUnique
              && (sideNavItemTestSpec.methodId !== equivalentNameItemTestSpec.methodId
                || sideNavItemTestSpec.reagentId !== equivalentNameItemTestSpec.reagentId
                || sideNavItemTestSpec.reagentLotId !== equivalentNameItemTestSpec.reagentLotId
                || sideNavItemTestSpec.calibratorId !== equivalentNameItemTestSpec.calibratorId
                || sideNavItemTestSpec.calibratorLotId !== equivalentNameItemTestSpec.calibratorLotId);
          });
        }

        return this.getAnalyteSideBarItem(sideNavItem, isMethodUnique, isReagentUnique, isReagentAndLotUnique,
          isCalibratorUnique, isCalibratorAndLotUnique, areReagentAndCalibratorLotsUnique, areMethodAndReagentUnique,
          areMethodAndReagentAndLotUnique, areMethodAndCalibratorUnique, areMethodAndCalibratorAndLotUnique,
          areMethodAndReagentAndCalibratorAndLotsUnique);
      });
    } else {
      sideBarItems = sideNavItems.map((sideNavItem: any) => {
        return this.getSideBarItem(sideNavItem);
      });
    }

    return isPanel ? sideBarItems : this.sortSideBarItems(sideBarItems);
  }

  getInstrumentSideBarItem(sideNavItem: LabInstrument): SideBarItem {
    const sideBarItem = this.getSideBarItem(sideNavItem);

    if (sideNavItem.instrumentCustomName) {
      // setting instrument custom name as the default name to display
      sideBarItem.primaryText = sideNavItem.instrumentCustomName;
      sideBarItem.additionalText = sideNavItem.instrumentInfo.name;
    }

    return sideBarItem;
  }

  getControlSideBarItem(sideNavItem: LabProduct): SideBarItem {
    const sideBarItem = this.getSideBarItem(sideNavItem);

    if (sideNavItem.productCustomName) {
      sideBarItem.secondaryText = sideNavItem.productInfo.name;
    }

    if (sideNavItem.lotInfo) {
      sideBarItem.additionalText = this.getTranslations('TRANSLATION.LOT') + ' ' + sideNavItem.lotInfo.lotNumber;
    }

    return sideBarItem;
  }

  getAnalyteSideBarItem(sideNavItem: LabTest, isMethodUnique: boolean, isReagentUnique: boolean,
    isReagentAndLotUnique: boolean, isCalibratorUnique: boolean, isCalibratorAndLotUnique: boolean,
    areReagentAndCalibratorLotsUnique: boolean,
    areMethodAndReagentUnique: boolean, areMethodAndReagentAndLotUnique: boolean, areMethodAndCalibratorUnique: boolean,
    areMethodAndCalibratorAndLotUnique: boolean, areMethodAndReagentAndCalibratorAndLotsUnique: boolean): SideBarItem {
    const sideBarItem = this.getSideBarItem(sideNavItem);

    // Show distinguishing attributes
    if (isMethodUnique || (areMethodAndReagentUnique && !isReagentUnique) || (areMethodAndReagentAndLotUnique && !isReagentAndLotUnique)
      || (areMethodAndCalibratorUnique && !isCalibratorUnique) || (areMethodAndCalibratorAndLotUnique && !isCalibratorAndLotUnique)
      || (areMethodAndReagentAndCalibratorAndLotsUnique && !areReagentAndCalibratorLotsUnique)) {
        sideBarItem.additionalText = this.getTranslations('TRANSLATION.METHOD') + sideNavItem.testSpecInfo.methodName;
    }

    if ((isReagentUnique || areMethodAndReagentUnique) && !isMethodUnique) {
      sideBarItem.additionalText
        += this.getTranslations('TRANSLATION.REAGENT') + sideNavItem.testSpecInfo.reagentName;
    }

    if ((isReagentAndLotUnique || areMethodAndReagentAndCalibratorAndLotsUnique) && !isMethodUnique && !isReagentUnique
      && !areMethodAndReagentUnique && !isCalibratorUnique && !areMethodAndCalibratorUnique) {
      sideBarItem.additionalText
        += this.getTranslations('TRANSLATION.REAGENTLOT') + sideNavItem.testSpecInfo.reagentLot.lotNumber;
    }

    if ((isCalibratorUnique || areMethodAndCalibratorUnique) && !isMethodUnique) {
      sideBarItem.additionalText
        += this.getTranslations('TRANSLATION.CALIBRATOR') + sideNavItem.testSpecInfo.calibratorName;
    }

    if ((isCalibratorAndLotUnique || areMethodAndReagentAndCalibratorAndLotsUnique) && !isMethodUnique
      && !isReagentUnique && !areMethodAndReagentUnique && !isReagentAndLotUnique && !areMethodAndReagentAndLotUnique
      && !isCalibratorUnique && !areMethodAndCalibratorUnique) {
      sideBarItem.additionalText
        += this.getTranslations('TRANSLATION.CALIBRATORLOT1')
        + sideNavItem.testSpecInfo.calibratorLot.lotNumber;
    }

    return sideBarItem;
  }

  getSideBarItem(sideNavItem: TreePill): SideBarItem {
    const sideBarItem = new SideBarItem();
    sideBarItem.node = sideNavItem;
    sideBarItem.primaryText = sideNavItem.displayName;
    sideBarItem.sortOrder = sideNavItem.sortOrder || 0;
    sideBarItem.entityId = sideNavItem.id;

    return sideBarItem;
  }

  sortSideBarItems(sideBarList: Array<SideBarItem>): any {
    return sideBarList = orderBy(sideBarList, [sortOrder, (node: SideBarItem) => node.primaryText.replace(/\s/g, '').toLocaleLowerCase(),
      (node: SideBarItem) => node.additionalText.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc, asc]);
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
