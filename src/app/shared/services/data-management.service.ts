// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { uniq } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import { PezContent } from 'br-component-library/public_api';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { EntityInfo, AnalyteInfo } from '../../contracts/models/data-management/entity-info.model';
import { DataManagementSpinnerService } from './data-management-spinner.service';
import { DataManagementAction } from './data-management.action';
import { TestSpec, LevelLoadRequest } from '../../contracts/models/portal-api/labsetup-data.model';
import { TreePill, LabTest, LabInstrument, LabProduct } from '../../contracts/models/lab-setup';
import { Header } from '../../contracts/models/data-management/header.model';
import { PortalApiService } from '../api/portalApi.service';
import { LevelSettingsDto } from '../../contracts/models/portal-api/level-test-settings.model';
import { RawDataType } from '../../contracts/models/data-management/base-raw-data.model';
import { CodelistApiService } from '../api/codelistApi.service';
import { Unit } from '../../contracts/models/codelist-management/unit.model';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { AnalyteLevelData, AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrail } from '../models/audit-tracking.model';
import {
  calibratorLotName, genericData, historyRunDate, historyRunTime, isAccept,
  levelMean, levelSD, levelText, levelValue, reagentLotName,
} from '../../core/config/constants/general.const';

@Injectable()
export class DataManagementService {
  public isAnalyticalSectionVisible = true;
  private interactions: Array<PezContent> = new Array<PezContent>();

  constructor(
    private portalApiService: PortalApiService,
    private dataManagementAction: DataManagementAction,
    private busySpinnerService: DataManagementSpinnerService,
    private codeListService: CodelistApiService,
    private dateTimeHelper: DateTimeHelper,
    private translate: TranslateService,
  ) { }

  public async getPortalProductByLabInstrumentProductLotIdAsync(labInstrumentProductLotId: string): Promise<LabProduct> {
    return this.portalApiService.getLabSetupNode<LabProduct>
      (EntityType.LabProduct, labInstrumentProductLotId, LevelLoadRequest.None).toPromise();
  }

  public updateEntityInfo(entityId: string, entityType: EntityType, node: TreePill): void {
    this.busySpinnerService.displaySpinner(true);
    this.updateDataManagementStateWithDecendants(entityId, entityType, node);
  }

  public async updateEntityInfoAsync(entityId: string, entityType: EntityType, node: TreePill): Promise<void> {
    this.busySpinnerService.displaySpinner(true);
    await this.updateDataManagementStateWithDecendants(entityId, entityType, node);
  }

  private async updateDataManagementStateWithDecendants(
    entityId: string, entityType: EntityType, node: TreePill): Promise<void> {
    // Must pass in ancestor control and instrument for analytes.
    if (entityType === EntityType.LabTest) {
      this.portalApiService.getLabSetupAncestors<TreePill>(entityType, entityId)
        .pipe(take(1))
        .subscribe(async ancestors => {
          const tempEntityInfo = await this.getEntityInfo(ancestors[0], ancestors);

          if (tempEntityInfo) {
            this.dataManagementAction.updateDataManagementInfo(entityId, entityType, tempEntityInfo);
          }
        });
    } else if (entityType === EntityType.Panel) {
      let entityIds: string[] = node.children.map(analyte => analyte.id);
      entityIds = uniq(entityIds);
      const ancestors: TreePill[][] = await this.portalApiService
        .getLabSetupAncestorsMultiple<TreePill>(EntityType.LabTest, entityIds).toPromise();
      const tempEntityInfo = await this.getEntityInfo(node, null, ancestors);
      if (tempEntityInfo) {
        this.dataManagementAction.updateDataManagementInfo(entityId, entityType, tempEntityInfo);
      }
    } else {
      const tempEntityInfo = await this.getEntityInfo(node);

      if (tempEntityInfo) {
        this.dataManagementAction.updateDataManagementInfo(entityId, entityType, tempEntityInfo);
      }
    }
  }

  private async getEntityInfo(entity: TreePill, ancestors?: TreePill[], arrayAncestors?: TreePill[][]): Promise<EntityInfo> {
    const tempEntityInfo = new EntityInfo();
    tempEntityInfo.entityName = entity.displayName;
    tempEntityInfo.cumulativeAnalyteInfo = new Array<AnalyteInfo>();
    switch (entity.nodeType) {
      case EntityType.LabInstrument:
        if (entity.children && entity.children.length > 0) {
          for (const labProduct of entity.children) {
            if (labProduct.children && labProduct.children.length > 0) {
              for (const lt of labProduct.children) {
                const analyteInfo: AnalyteInfo =
                  <AnalyteInfo>await this.getCumulativeAnalyteInfo(<LabTest>lt, <LabProduct>labProduct);
                tempEntityInfo.cumulativeAnalyteInfo.push(analyteInfo);
              }
            }
          }
        }
        break;
      case EntityType.LabProduct:
        if (entity.children && entity.children.length > 0) {
          for (const lt of entity.children) {
            const analyteInfo: AnalyteInfo = <AnalyteInfo>await this.getCumulativeAnalyteInfo(<LabTest>lt, <LabProduct>entity);
            tempEntityInfo.cumulativeAnalyteInfo.push(analyteInfo);
          }
        }
        break;
      case EntityType.Panel:
        for (const _ancestors of arrayAncestors) {
          const _entity: LabProduct = _ancestors[1] as LabProduct;
          const analytes = entity.children.filter((child: TreePill) => child.parentNodeId === _entity.id);
          if (analytes.length > 0) {
            for (const lt of analytes) {
              const analyteInfo: AnalyteInfo = <AnalyteInfo>await this.getCumulativeAnalyteInfo(<LabTest>lt, <LabProduct>_entity);
              tempEntityInfo.cumulativeAnalyteInfo.push(analyteInfo);
            }
          }
        }
        break;
      case EntityType.LabTest:
        const labTest = <LabTest>entity;
        const prod = <LabProduct>ancestors.find(o => o.nodeType === EntityType.LabProduct);
        const inst = <LabInstrument>ancestors.find(o => o.nodeType === EntityType.LabInstrument);
        const _analyteInfo: AnalyteInfo = <AnalyteInfo>await this.getCumulativeAnalyteInfo(labTest, prod);
        tempEntityInfo.cumulativeAnalyteInfo.push(_analyteInfo);
        const unitName: string = <string>await this.getUnitName(prod.lotInfo.id, labTest.testSpecInfo.analyteId,
          labTest.testSpecInfo.instrumentId, labTest.labUnitId);
        // TODO: Fix headerData for point entry
        tempEntityInfo.headerData = this.getHeaderInfo(labTest.testSpecInfo, inst.instrumentCustomName, prod.displayName,
          prod.productCustomName, prod.lotInfo.lotNumber, unitName);
        break;
      default:
        break;
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
        unit = units.filter((item) => item?.id === +labUnitId);
      });

    return unit[0]?.name;
  }

  private async getCumulativeAnalyteInfo(analyte: LabTest, labProduct: LabProduct): Promise<AnalyteInfo> {
    const levelsInUse = new Array<number>();
    const decimalPlaces = new Array<number>();
    const instrumentId = labProduct.parentNodeId;
    const productId = labProduct.id;
    const productMastLot = labProduct.lotInfo;
    const levelSettings: LevelSettingsDto = analyte.levelSettings;
    if (levelSettings && levelSettings.levels) {
      for (let i = 0; i < levelSettings.levels.length; i++) {
        if (levelSettings.levels[i].levelInUse) {
          levelsInUse.push(i + 1);
          decimalPlaces.push(+levelSettings.levels[i].decimalPlace);
        }
      }
    }

    const controlLotIds = new Array<number>();
    labProduct.productLotLevels.forEach(productLotLevel => {
      if (levelsInUse.includes(productLotLevel.level)) {
        controlLotIds.push(parseInt(productLotLevel.id, 10));
      }
    });

    const tempAnalyteInfo: AnalyteInfo = {
      controlLotIds: controlLotIds,
      levelsInUse: levelsInUse,
      decimalPlaces: decimalPlaces,
      instrumentId: instrumentId,
      productId: productId,
      testName: analyte.displayName,
      labTestId: analyte.id,
      correlatedTestSpecId: analyte.correlatedTestSpecId,
      testSpecId: analyte.testSpecId,
      isSummary: levelSettings && levelSettings.dataType === RawDataType.SummaryData ? true : false,
      productMasterLotId: productMastLot.id.toString(),
      productMasterLotExpiration: productMastLot.expirationDate,
      codeListTestId: +analyte.testSpecId,
      labUnitId: +analyte.labUnitId,
      defaultReagentLot: analyte.testSpecInfo.reagentLot,
      defaultCalibratorLot: analyte.testSpecInfo.calibratorLot,
      testId: analyte.testSpecInfo.testId.toString(),
      isArchived: analyte.isArchived,
      sortOrder: analyte.sortOrder
    };
    return tempAnalyteInfo;
  }

  private getHeaderInfo(testSpec: TestSpec, customInstrumentName: string, productName: string,
    customProductName: string, productMasterLotNumber: string, unitName: string): Header {
    const tempHeader: Header = {
      analyteName: testSpec.analyteName,
      instrumentName: testSpec.instrumentName,
      instrumentAlias: customInstrumentName,
      customProductName: customProductName,
      productName: productName,
      productMasterLotNumber: productMasterLotNumber,
      reagentName: testSpec.reagentName,
      reagentLotNumber: testSpec.reagentLot && testSpec.reagentLot.lotNumber || null,
      reagentLotId: testSpec.reagentLot && testSpec.reagentLot.id || null,
      method: testSpec.methodName,
      unit: unitName,
      calibrator: testSpec.calibratorName,
      calibratorLotNumber: testSpec.calibratorLot && testSpec.calibratorLot.lotNumber || null,
      calibratorLotId: testSpec.calibratorLot && testSpec.calibratorLot.id || null,
      codeListTestId: testSpec.testId,
      labUnitId: testSpec.storageUnitId
    };

    return tempHeader;
  }

  /** Process summary review history data start */

  extractInteractions(data: Array<AppNavigationTracking>, labTimeZone: string): Array<PezContent> {
    this.interactions = [];
    if (!!data) {
      data.forEach(runHistoryData => {
        const timeZoneOffset = this.dateTimeHelper.getTimeZoneOffset(runHistoryData?.auditTrail?.runDateTime, labTimeZone);

        const primaryInteraction: PezContent = {
          userName: runHistoryData.userName,
          dateTime: runHistoryData?.auditTrail?.runDateTime,
          text: this.getPrimaryInteraction(runHistoryData?.auditTrail),
          pezDateTimeOffset: timeZoneOffset,
          labelHeader: this.getTranslation('REVIEWSUMMARY.HISTORY'),
          labelAt: this.getTranslation('REVIEWSUMMARY.AT')
        };

        if (!!primaryInteraction.text) {
          this.interactions.push(primaryInteraction);
        }
        this.getSecondaryInteraction(runHistoryData, timeZoneOffset);
      });
    }
    return this.interactions;
  }

  getPrimaryInteraction(auditTrackingData: AuditTrail) {
    let primaryInteraction = null;
    if (auditTrackingData.actionStatus === AuditTrackingActionStatus.Success) {
      if (auditTrackingData.action === AuditTrackingAction.Add) {
         primaryInteraction = this.staticTranslate('HISTORYMESSAGES.ADDED');
      } else if (auditTrackingData.action === AuditTrackingAction.Update && (!!auditTrackingData?.currentValue?.isAction
        && !!auditTrackingData?.currentValue?.isComment)) {
          primaryInteraction = this.staticTranslate('HISTORYMESSAGES.UPDATEDACTIONCOMMENT');
      } else if (auditTrackingData.action === AuditTrackingAction.Update && (!auditTrackingData?.currentValue?.isAction
        && !!auditTrackingData?.currentValue?.isComment)) {
        primaryInteraction = this.staticTranslate('HISTORYMESSAGES.UPDATED');
      } else if (auditTrackingData.action === AuditTrackingAction.Update && (!!auditTrackingData?.currentValue?.isAction
        && !auditTrackingData?.currentValue?.isComment)) {
       primaryInteraction = this.staticTranslate('HISTORYMESSAGES.UPDATEDACTION');
      } else {
        // Use this.staticTranslate(TRANSLATION.TRANSLATION_CODE.EDITED_DATA) for generic edit statement
        primaryInteraction = '';
      }
    }
    return primaryInteraction;
  }

  getSecondaryInteraction(runHistoryData: AppNavigationTracking, timeZoneOffset: string) {
    const auditTrackingData = runHistoryData?.auditTrail;
    if (auditTrackingData.actionStatus === AuditTrackingActionStatus.Success &&
      !!runHistoryData.auditTrail.currentValue && auditTrackingData.action === AuditTrackingAction.Update) {
      const secondaryInteraction: PezContent = {
        userName: runHistoryData.userName,
        dateTime: runHistoryData?.auditTrail?.runDateTime,
        text: null,
        pezDateTimeOffset: timeZoneOffset
      };
      if (!!auditTrackingData.currentValue?.calibratorLotName) {
        secondaryInteraction.text = this.dynamicTranslate
        ('HISTORYMESSAGES.CALIBRATORLOT', calibratorLotName,
          auditTrackingData.currentValue.calibratorLotName);
        this.interactions.push({ ...secondaryInteraction });
      }
      if (!!auditTrackingData.currentValue?.reagentLotName) {
        secondaryInteraction.text = this.dynamicTranslate('HISTORYMESSAGES.REAGENTLOT', reagentLotName,
          auditTrackingData.currentValue.reagentLotName);
        this.interactions.push({ ...secondaryInteraction });
      }
      if (!!auditTrackingData.currentValue.restartFloat) {
         secondaryInteraction.text = this.staticTranslate('HISTORYMESSAGES.ENABLED');
        this.interactions.push({ ...secondaryInteraction });
      }
      if (!!auditTrackingData.currentValue.runDate || !!auditTrackingData.currentValue.runStringTime) {
        const data = [];
        const runDate = auditTrackingData.currentValue.runDate ?
          this.dynamicTranslate('HISTORYMESSAGES.RUNDATE', historyRunDate,
            auditTrackingData.currentValue.runDate) : null;
        const runTime = auditTrackingData.currentValue.runStringTime ?
          this.dynamicTranslate('HISTORYMESSAGES.RUNTIME', historyRunTime,
            auditTrackingData.currentValue.runStringTime) : null;
        if (!!runDate) { data.push(runDate); }
        if (!!runTime) { data.push(runTime); }
        const dateTime = data.join(', ');
        secondaryInteraction.text = this.dynamicTranslate('HISTORYMESSAGES.CHANGED', genericData, dateTime);
        this.interactions.push({ ...secondaryInteraction });
      }
      if (!!auditTrackingData.currentValue.levelData) {
        const levelInfo = this.phraseLevelData(auditTrackingData.currentValue.levelData);
        secondaryInteraction.text = this.dynamicTranslate('HISTORYMESSAGES.CHANGED', genericData, levelInfo);
        this.interactions.push({ ...secondaryInteraction });
      }
    }
  }

  phraseLevelData(levelData: AnalyteLevelData[]) {
    const data = [];
    levelData.forEach((levelInfo: AnalyteLevelData) => {
      const tempData = [];
      tempData.push(levelInfo.controlLevel ?
        this.dynamicTranslate('HISTORYMESSAGES.LEVEL', levelText,
          levelInfo.controlLevel) :
        this.dynamicTranslate('HISTORYMESSAGES.LEVEL', levelText,
          levelInfo.level));
      tempData.push((levelInfo.resultValue || levelInfo.numPoints) ?
        this.dynamicTranslate('HISTORYMESSAGES.TO', levelValue,
          (levelInfo.resultValue ? levelInfo.resultValue : levelInfo.numPoints)) : null);
      tempData.push(levelInfo.sd ?
        this.dynamicTranslate('HISTORYMESSAGES.SD', levelSD,
          levelInfo.sd) : null);
      tempData.push(levelInfo.mean ?
        this.dynamicTranslate('HISTORYMESSAGES.MEANTO', levelMean,
          levelInfo.mean) : null);
      tempData.push(Object.keys(levelInfo).includes(isAccept) ? (levelInfo.isAccept ?
        this.staticTranslate('CONNECTIVITYSCHEDULAR.ACCEPTED')
        : this.staticTranslate('HISTORYMESSAGES.REJECTED')) : null);
      data.push(tempData.join(' '));
    });
    return data.join(', ');
  }

  // History data translation for strings only
  public staticTranslate(translationCode: string) {
    return this.getTranslation(translationCode);
  }

  // History data translation for strings with dynamic value
  private dynamicTranslate(translationCode: string, key: string, text: string | number | Date) {
    let tempText = this.getTranslation(translationCode);
    tempText = tempText?.replace(key, text.toString());
    return tempText;
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  /** Process summary review history data end */
}
