// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';


import { orderBy, cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import {
  Action,
  AnalyteEntry,
  AnalyteView,
  BasePoint,
  BaseSummary,
  CalibratorLot,
  ChangeLotModel,
  GlobalLabels,
  LevelData,
  LevelSummary,
  LevelValue,
  Lot,
  ReagentLot,
  TranslationLabels,
  UserComment,
} from 'br-component-library';
import { TestInfo } from '../../contracts/models/codelist-management/test-info.model';
import { BaseRawDataModel, RawDataType } from '../../contracts/models/data-management/base-raw-data.model';
import { AnalyteInfo } from '../../contracts/models/data-management/entity-info.model';
import {
  AnalyteSection,
  InstrumentSection,
  ProductSection,
} from '../../contracts/models/data-management/page-section/instrument-section.model';
import { RuleDisposition } from '../../contracts/enums/lab-setup/spc-rule-enums/spc-rule-disposition.enum';
import { PointDataResult, RunData, TestSpecInfo, Rule } from '../../contracts/models/data-management/run-data.model';
import { SummaryDataModel, SummaryDataResult } from '../../contracts/models/data-management/summary-data.model';
import { TestSpec } from '../../contracts/models/portal-api/labsetup-data.model';
import { Utility } from '../../core/helpers/utility';
import { AuthenticationService } from '../../security/services';
import { CodelistApiService } from '../api/codelistApi.service';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { AppLoggerService } from '../services/applogger/applogger.service';
import { LabTestService } from '../services/test-run.service';
import { RunsService } from '../services/runs.service';
import { LabDataCollection } from '../../contracts/models/data-management/runs-result.model';
import { LabProduct } from '../../contracts/models/lab-setup';
import { DataManagementService } from '../services/data-management.service';
import { asc } from '../../core/config/constants/general.const';
import { NavBarActions } from '../../shared/navigation/state/actions';
import * as ngrxStore from '@ngrx/store';
import * as fromRoot from '../../state/app.state';
@Injectable()
export class PageSectionService {
  priorAnalyteData: Array<AnalyteEntry> = [];
  currentAnalyteData: Array<AnalyteEntry> = [];
  changeCalibratorLotData: string;
  changeReagentLotData: string;
  changeLotData = false;
  constructor(
    private codeListService: CodelistApiService,
    private appLoggerService: AppLoggerService,
    private authService: AuthenticationService,
    private labTestService: LabTestService,
    private runsService: RunsService,
    private dateTimeHelper: DateTimeHelper,
    private dataManagementService: DataManagementService,
    private translate: TranslateService,
    private store: ngrxStore.Store<fromRoot.State>,
  ) { }

  public extractSortedAnalyteSectionsByProduct(productSections: Array<ProductSection>): Array<AnalyteSection> {
    const combinedAnalyteSections = new Array<AnalyteSection>();
    productSections.forEach(productSection => {
      productSection.analyteSections.forEach(analyte => {
        analyte.productName = productSection.product.displayName;
        analyte.lotNumber = productSection.product.lotInfo.lotNumber;
      });
      for (const analyteSection of productSection.analyteSections) {
        combinedAnalyteSections.push(analyteSection);
      }
    });
    return combinedAnalyteSections;
  }

  public extractAnalyteSections(instrumentSection: InstrumentSection): Array<AnalyteSection> {
    // Collects all analyte section objects from instrument section
    let analyteSections = new Array<AnalyteSection>();

    instrumentSection.productSections.forEach(productSection => {
      analyteSections = analyteSections.concat(productSection.analyteSections);
    });

    return orderBy(analyteSections, [
      (firstSortItem: AnalyteSection) => firstSortItem.analyteInfo.sortOrder,
      (secondSortItem: AnalyteSection) => secondSortItem.analyteInfo.testName.replace(/\s/g, '').toLocaleLowerCase()],
      [asc, asc]);
  }

  public extractSortedProductSections(instrumentSection: InstrumentSection, isPanel?: boolean): Array<ProductSection> {
    let productSections = instrumentSection.productSections.map(ps => ps);
    let archivedProductSections = [];
    const productIndexesToBeRemoved: number[] = [];
    productSections.forEach((productSection, index) => {
      if (productSection.product) {
        if (productSection.product.isArchived) {
          // separate out archived products
          productSection.analyteSections = orderBy(productSection.analyteSections,
            [(section: AnalyteSection) => section?.analyteInfo?.testName?.replace(/\s/g, '')?.toLocaleLowerCase()], [asc]);
          if (!productIndexesToBeRemoved.includes(index)) {
            productIndexesToBeRemoved.push(index);
          }
          archivedProductSections.push(productSection);
        } else {
          // separate out archived analytes if product is not archived
          const tempProductSection: ProductSection = new ProductSection();
          tempProductSection.product = cloneDeep(productSection.product);
          tempProductSection.analyteSections = [];
          const analyteIdsToBeRemoved: string[] = [];
          productSection.analyteSections.forEach((analyteSection, analyteIndex) => {
            if (analyteSection.analyteInfo.isArchived) {
              analyteIdsToBeRemoved.push(analyteSection.analyteInfo.labTestId);
              tempProductSection.analyteSections.push(analyteSection);
            }
          });
          if (tempProductSection.analyteSections.length) {
            productSection.analyteSections = productSection.analyteSections.filter((analyteSection: AnalyteSection) => {
              return !analyteIdsToBeRemoved.some((id: string) => analyteSection.analyteInfo.labTestId === id);
            });
            // order archived analytes
            tempProductSection.analyteSections = orderBy(tempProductSection.analyteSections,
              [(section: AnalyteSection) => section?.analyteInfo?.testName?.replace(/\s/g, '')?.toLocaleLowerCase()], [asc]);
            archivedProductSections.push(tempProductSection);
          }
        }
        if (!productSection.analyteSections.length) {
          // remove empty product from the list
          if (!productIndexesToBeRemoved.includes(index)) {
            productIndexesToBeRemoved.push(index);
          }
        }
      }
    });
    // order archived product sections alphabetical
    if (archivedProductSections.length) {
      for (let index = productIndexesToBeRemoved.length - 1; index > -1; index--) {
        productSections.splice(productIndexesToBeRemoved[index], 1);
      }
      if (isPanel) {
        archivedProductSections = orderBy(archivedProductSections, [(section: ProductSection) =>
          section?.analyteSections[0]?.analyteInfo?.testName?.replace(/\s/g, '')?.toLocaleLowerCase()], [asc]);
      } else {
        archivedProductSections = orderBy(archivedProductSections,
          [(section: ProductSection) => section?.product?.displayName?.replace(/\s/g, '')?.toLocaleLowerCase()], [asc]);
      }
    }

    if (!isPanel && productSections.length) {
      productSections = orderBy(productSections,
        [(firstSortItem: ProductSection) => (firstSortItem.product) ? firstSortItem.product.sortOrder : '',
        (secondSortItem: ProductSection) =>
          (secondSortItem.product) ? secondSortItem.product.displayName.replace(/\s/g, '').toLocaleLowerCase() : '',
        (thirdSortItem: ProductSection) => (thirdSortItem.product) ? thirdSortItem.product.lotInfo.lotNumber : ''], [asc, asc, asc]);
      productSections.forEach(productSection => {
        productSection.analyteSections = orderBy(productSection?.analyteSections, [
          (firstSortItem: AnalyteSection) => firstSortItem?.analyteInfo?.sortOrder,
          (secondSortItem: AnalyteSection) => secondSortItem?.analyteInfo?.testName.replace(/\s/g, '').toLocaleLowerCase()],
          [asc, asc]);
      });
    }
    // add archived items at the bottom of the list
    if (archivedProductSections.length) {
      productSections.push(...archivedProductSections);
    }

    return productSections;
  }

  public findAssociatedBaseRawData(
    baseRawDataSet: Array<BaseRawDataModel>,
    labTestId: string
  ): BaseRawDataModel {
    return baseRawDataSet.find(data => data.labTestId === labTestId);
  }

  public extractCumulativeLevelsInUse(
    analyteSections: Array<AnalyteSection>
  ): Array<number> {
    let cumulativeLevelsInUse = new Array<number>();
    analyteSections.forEach(analyteSection => {
      cumulativeLevelsInUse = cumulativeLevelsInUse.concat(
        analyteSection.analyteInfo.levelsInUse
      );
    });

    // Remove duplication
    cumulativeLevelsInUse = Array.from(new Set(cumulativeLevelsInUse));

    return cumulativeLevelsInUse.sort((n1, n2) => n1 - n2);
  }

  public getIsSummaryOnly(analyteSections: Array<AnalyteSection>): boolean {
    return (analyteSections.filter(as => !as.analyteInfo.isSummary).length === 0);
  }

  public getLatestAnalyteDateTime(
    currentLatestDateTime: Date,
    baseRawDataSet: Array<BaseRawDataModel>
  ): Date {
    let latestDateTime = currentLatestDateTime;
    if (baseRawDataSet) {
      baseRawDataSet.forEach(baseRawData => {
        // updated to localRawDataDateTime to fix bug 179777 based on offshore testing & backend feedback
        if (new Date(latestDateTime).getTime() < new Date(baseRawData.localRawDataDateTime).getTime()) {
          // Replacing Z to prevent double conversion with SinglePageSectionComponent getSummaryStats()
          latestDateTime = new Date(baseRawData.localRawDataDateTime.toString().replace('Z', ''));
        }
      });
    }

    return latestDateTime;
  }

  private isLotExpired(lot: Lot, dateTime: Date): boolean {
    return new Date(lot.shelfExpirationDate) < new Date(dateTime);
  }

  public async createAnalyteEntrySets(
    sortedAnalyteSections: Array<AnalyteSection>,
    cumulativeLevelsInUse: Array<number>,
    isRunEntryMode: boolean,
    currentDateTime: Date,
    timeZone: string
  ): Promise<Array<AnalyteEntry>> {
    const levelEntrySets = Array<AnalyteEntry>();
    const totalAnalytes = sortedAnalyteSections.length;

    for (let index = 0; index < totalAnalytes; index++) {
      const analyteSection = sortedAnalyteSections[index];

      const analyteEntry: AnalyteEntry = this.createSingleAnalyteEntry(
        '', analyteSection, cumulativeLevelsInUse, currentDateTime, timeZone, isRunEntryMode, index, totalAnalytes, null, true, false);

      await this.updateLots(analyteEntry, analyteSection.analyteInfo.codeListTestId.toString(), currentDateTime);

      levelEntrySets.push(analyteEntry);
    }

    return levelEntrySets;
  }

  public createSingleAnalyteEntry(
    id: string,
    analyteSection: AnalyteSection,
    cumulativeLevelsInUse: number[],
    currentDateTime: Date, timeZone: string,
    isRunEntryMode: boolean,
    index: number,
    totalAnalytes: number,
    baseRawDataModel: BaseRawDataModel,
    isEntry: boolean,
    isEditMode: boolean): AnalyteEntry {
    // SR 04272020: Replacing Z to prevent automatic UTC conversion by Date Object within Edit Dialog
    // Any date conversions are to be done by backend
    // Front-end is to display only the payload backend returns
    currentDateTime = new Date(currentDateTime.toString().replace('Z', ''));
    return {
      id: id,
      labTestId: analyteSection.analyteInfo.labTestId,
      testSpecId: analyteSection?.analyteInfo?.testSpecId ? Number(analyteSection.analyteInfo.testSpecId) : (baseRawDataModel === null ? 0 : baseRawDataModel.testSpecId),
      cumulativeLevels: cumulativeLevelsInUse,
      analyteName: analyteSection.analyteInfo.testName,
      analyteDateTime: currentDateTime,
      analyteDateTimeOffset: this.dateTimeHelper.getTimeZoneOffset(currentDateTime, timeZone),
      isSummary: analyteSection.analyteInfo.isSummary,
      isRunEntryMode: isRunEntryMode,
      analyteIndex: index,
      isSingleAnalyteMode: totalAnalytes === 1,
      levelDataSet: this.extractLevelDataSet(
        baseRawDataModel, analyteSection.analyteInfo, analyteSection.analyteInfo.isSummary, isEntry, isEditMode),
      action: null,
      totalAnalytes: totalAnalytes,
      changeLotData: this.createChangeLotData(analyteSection),
      correlatedTestSpecId: analyteSection.analyteInfo.correlatedTestSpecId
    };
  }

  private async updateLots(analyteEntry: AnalyteEntry, codeListTestId: string, currentDateTime: Date): Promise<void> {
    if (
      this.isLotExpired(
        analyteEntry.changeLotData.defaultReagentLot,
        currentDateTime
      ) ||
      this.isLotExpired(
        analyteEntry.changeLotData.defaultCalibratorLot,
        currentDateTime
      )
    ) {
      // bug219218 Dev2 UnityNext: Data Table page is displayed blank in case non-microslide reagent lot or calibrator lot is expired
      // const testInfo = await this.codeListService.getTestInfoFromCodeListAsync(codeListTestId);
      const testInfo = await this.codeListService.getTestSpecInfoFromCodeListAsync(codeListTestId);

      analyteEntry.changeLotData.reagentLots = await this.codeListService.getReagentLotsByReagentIdAsync(
        testInfo.reagentId.toString()
      );
      analyteEntry.changeLotData.calibratorLots = await this.codeListService.getCalibratorLotsByCalibratorIdAsync(
        testInfo.calibratorId.toString()
      );
    }
  }

  private createChangeLotData(analyteSection: AnalyteSection): ChangeLotModel {
    const changeLotModel: ChangeLotModel = {
      labTestId: analyteSection.analyteInfo.labTestId,
      reagentLots: null,
      calibratorLots: null,
      defaultReagentLot: analyteSection.analyteInfo.defaultReagentLot,
      defaultCalibratorLot: analyteSection.analyteInfo.defaultCalibratorLot,
      selectedReagentLot: null,
      selectedCalibratorLot: null,
      comment: null,
      errorMessages: null,
      ...this.getChangeLotDataLabels()
    };
    return changeLotModel;
  }

  public createMultipleAnalyteViewSets(
    sortedAnalyteSections: Array<AnalyteSection>,
    baseRawDataSet: Array<BaseRawDataModel>,
    cumulativeLevelsInUse: Array<number>,
    timeZone: string,
    isEditMode: boolean
  ): Array<AnalyteView> {
    const levelViewSets = new Array<AnalyteView>();
    if (sortedAnalyteSections) {
      sortedAnalyteSections.forEach(analyteSection => {
        if (baseRawDataSet) {
          baseRawDataSet.forEach(targetRawData => {
            if (targetRawData) {
              const analyteView = this.createAnalyteViewFromBaseRawData(
                analyteSection,
                targetRawData,
                cumulativeLevelsInUse,
                timeZone,
                isEditMode
              );

              if (analyteView) {
                levelViewSets.push(analyteView);
              }
            }
          });
        }
      });
    }

    return levelViewSets;
  }

  public createSingleAnalyteViewSets(
    sortedAnalyteSections: Array<AnalyteSection>,
    baseRawDataSet: Array<BaseRawDataModel>,
    cumulativeLevelsInUse: Array<number>,
    timeZone: string,
    isEditMode: boolean
  ): Array<AnalyteView> {
    const levelViewSets = new Array<AnalyteView>();

    sortedAnalyteSections.forEach(analyteSection => {
      const targetRawData = baseRawDataSet.find(x => x.labTestId === analyteSection.analyteInfo.labTestId);
      if (targetRawData) {
        const analyteView = this.createAnalyteViewFromBaseRawData(
          analyteSection,
          targetRawData,
          cumulativeLevelsInUse,
          timeZone,
          isEditMode
        );

        if (analyteView) {
          levelViewSets.push(analyteView);
        }
      }
    });

    return levelViewSets;
  }

  public createAnalyteViewFromBaseRawData(
    analyteSection: AnalyteSection,
    baseRawDataModel: BaseRawDataModel,
    cumulativeLevelsInUse: Array<number>,
    timeZone: string,
    isEditMode: boolean
  ): AnalyteView {
    // SR 04272020: Replacing Z to prevent automatic UTC conversion by Date Object
    // Any date conversions are to be done by backend
    // Front-end is to display only the payload backend returns
    // Adding If statement for Point Run Data TimeZone fix until backend changes
    // Offset conversion is not required as it is causing additional UTC conversion
    let analyteDateTime;
    if (baseRawDataModel.localRunDateTime) {
      analyteDateTime = new Date(baseRawDataModel.localRunDateTime.toString().replace('Z', ''));
    } else if (baseRawDataModel.localSummaryDateTime) {
      analyteDateTime = new Date(baseRawDataModel.localSummaryDateTime.toString().replace('Z', ''));
    } else {
      analyteDateTime = new Date(baseRawDataModel.localRawDataDateTime.toString().replace('Z', ''));
    }

    const levelDataSet = this.extractLevelDataSet(
      baseRawDataModel,
      analyteSection.analyteInfo,
      analyteSection.analyteInfo.isSummary,
      false,
      isEditMode
    );

    if (levelDataSet.length !== 0) {
      return {
        id: baseRawDataModel.id,
        dataSource: baseRawDataModel.dataSource.toString(),
        labTestId: analyteSection.analyteInfo.labTestId,
        testSpecId: baseRawDataModel === null ? 0 : baseRawDataModel.testSpecId,
        cumulativeLevels: cumulativeLevelsInUse,
        analyteName: analyteSection.analyteInfo.testName,
        analyteDateTime: analyteDateTime,
        analyteDateTimeOffset: this.dateTimeHelper.getTimeZoneOffset(analyteDateTime, timeZone),
        isSummary: analyteSection.analyteInfo.isSummary,
        userActions: baseRawDataModel.userActions,
        userComments: baseRawDataModel.userComments,
        userInteractions: baseRawDataModel.userInteractions,
        levelDataSet: levelDataSet
      } as AnalyteView;
    }
  }

  private extractLevelDataSet(
    baseRawData: BaseRawDataModel,
    analyteInfo: AnalyteInfo,
    isSummary: boolean,
    isEntry: boolean,
    isEditMode: boolean
  ): Array<LevelValue | LevelSummary> {
    return isSummary
      ? <Array<LevelSummary>>(
        this.createLevelDataObject(
          baseRawData, analyteInfo, isSummary, isEntry, isEditMode
        )
      )
      : <Array<LevelValue>>(
        this.createLevelDataObject(
          baseRawData, analyteInfo, isSummary, isEntry, isEditMode
        )
      );
  }

  private createLevelDataObject(
    baseRawDataModel: BaseRawDataModel,
    analyteInfo: AnalyteInfo,
    isSummary: boolean,
    isEntry: boolean,
    isEditMode: boolean
  ): Array<LevelData<BasePoint | BaseSummary>> {
    const levelEntrySet = Array<LevelData<BasePoint | BaseSummary>>();

    for (let i = 0; i < analyteInfo.levelsInUse.length; i++) {
      const level = analyteInfo.levelsInUse[i];
      const controlLotId = analyteInfo.controlLotIds[i];
      const decimalPlace = analyteInfo.decimalPlaces[i];

      const data = this.extractLevelData(
        baseRawDataModel,
        isSummary,
        isEntry,
        level,
        isEditMode
      );

      if (data != null) {
        const levelData: LevelData<BasePoint | BaseSummary> = {
          level: level,
          controlLotId: controlLotId,
          decimalPlace: decimalPlace,
          isPristine: true,
          data: data
        };

        levelEntrySet.push(levelData);
      }
    }

    return levelEntrySet;
  }

  private extractLevelData(
    baseRawDataModel: BaseRawDataModel,
    isSummary: boolean,
    isEntry: boolean,
    level: number,
    isEditMode: boolean
  ): BasePoint | BaseSummary {
    if (isEntry) {
      return isSummary ? new BaseSummary() : new BasePoint();
    }

    return isSummary
      ? this.extractBaseSummary(
        (baseRawDataModel as SummaryDataModel).results.find(
          x => x.controlLevel === level
        ), isEditMode
      )
      : this.extractBasePoint(
        (baseRawDataModel as RunData).results.find(
          x => x.controlLevel === level
        ),
        isEditMode
      );
  }

  public convertReasons(result: PointDataResult): Array<string> {
    let reasons = null;

    if (result.ruleViolated != null) {
      reasons = new Array<string>();
      result.ruleViolated.forEach(rule => {
        reasons.push(this.convertRule(rule));
      });
    }
    return reasons;
  }

  private convertRule(rule: Rule): string {
    let runReason = rule.category;
    if (rule.k) {
      runReason = runReason.replace('k', rule.k.toString());
    }
    if (rule.disposition === RuleDisposition.warning) {
      runReason += '[W]';
    }
    return runReason;
  }

  private extractBasePoint(pointDataResult: PointDataResult, isEditMode: boolean): BasePoint {
    let basePoint: BasePoint = null;
    if (pointDataResult) {
      basePoint = new BasePoint();
      basePoint.value = pointDataResult.resultValue;
      basePoint.resultStatus = this.runsService.extractPointDataResultStatus(pointDataResult);
      basePoint.ruleViolated = this.convertReasons(pointDataResult);
      basePoint.isAccepted = pointDataResult.isAccepted;
      basePoint.mean = pointDataResult.targetMean;
      basePoint.sd = pointDataResult.targetSD;
      if (pointDataResult.zScoreData) {
        basePoint.displayZScore = pointDataResult.zScoreData.display;
        basePoint.z = pointDataResult.zScoreData.zScore;
      }
    } else if (pointDataResult == null && isEditMode) {
      basePoint = {
        isAccepted: null,
        ruleViolated: null,
        resultStatus: null,
        value: null,
        z: null
      } as BasePoint;
    }
    return basePoint;
  }

  private extractBaseSummary(
    summaryDataResult: SummaryDataResult,
    isEditMode: boolean
  ): BaseSummary {
    let baseSummary: BaseSummary = null;
    if (summaryDataResult) {
      baseSummary = new BaseSummary();
      baseSummary = {
        mean: summaryDataResult.mean,
        sd: summaryDataResult.sd,
        cv: null, // Should be always null
        numPoints: summaryDataResult.nPts
      };
    } else if (isEditMode && summaryDataResult == null) {
      baseSummary = {
        cv: null,
        mean: null,
        numPoints: null,
        sd: null
      } as BaseSummary;
    }

    return baseSummary;
  }

  public async createSummaryDataModelAsync(
    analyteEntry: AnalyteEntry,
    analyteSection: AnalyteSection,
    labId: string,
    accountId: string,
    accountNumber: string,
    selectedDateTime: Date,
    enteredDateTime: Date,
    timeZone: string,
    isNew = true
  ): Promise<SummaryDataModel> {
    let testSpecId = analyteEntry.testSpecId.toString();

    // Detect Changes in Lot Selection
    let lotChanged =
      analyteEntry.changeLotData.defaultCalibratorLot.id !=
      analyteEntry.changeLotData.selectedCalibratorLot.id ||
      analyteEntry.changeLotData.defaultReagentLot.id !=
      analyteEntry.changeLotData.selectedReagentLot.id;

    // Only update testSpec if needed
    if(analyteEntry.testSpecId == 0 || lotChanged) {
      testSpecId = await this.getTestSpecIdByTestIdAndLotAsync(
        analyteSection.analyteInfo.testId,
        analyteEntry.changeLotData.selectedReagentLot,
        analyteEntry.changeLotData.selectedCalibratorLot
      );

      let labTest = await this.labTestService.getLabTest(analyteEntry.labTestId);
      if (labTest.testSpecId.toString() !== testSpecId.toString() || isNew) {
        labTest.testSpecId = Number(testSpecId);
        if (analyteEntry.analyteIndex === 1) {
        labTest = await this.labTestService.putLabTest(labTest).toPromise();
        }
      }
    }

    const summModel = new SummaryDataModel();
    if (analyteEntry.id) {
      summModel.id = analyteEntry.id;
    }
    summModel.labTestId = analyteSection.analyteInfo.labTestId;
    summModel.labInstrumentId = analyteSection.analyteInfo.instrumentId;
    summModel.labProductId = analyteSection.analyteInfo.productId;
    summModel.testId = +analyteSection.analyteInfo.testId;
    summModel.testSpecId = +testSpecId;
    summModel.labId = labId;
    summModel.accountId = accountId;
    summModel.accountNumber = accountNumber;
    summModel.labUnitId = analyteSection.analyteInfo.labUnitId;
    summModel.dataType = RawDataType.SummaryData;
    summModel.dataSource = LabDataCollection.RawDataStaging;
    summModel.userComments = this.getUserCommentsFromChangeLotModel(analyteEntry.changeLotData, new Date());

    summModel.rawDataDateTime = selectedDateTime;
    summModel.summaryDateTime = selectedDateTime;
    summModel.localSummaryDateTime = selectedDateTime;
    summModel.enteredDateTime = enteredDateTime;
    summModel.labLocationTimeZone = timeZone;
    summModel.results = new Array<SummaryDataResult>();

    const levelDataSet = analyteEntry.levelDataSet;
    for (let i = 0; i < levelDataSet.length; i++) {
      const levelData = <LevelSummary>levelDataSet[i];
      if (!levelData.isPristine) {
        const summaryDataResult = new SummaryDataResult();
        summaryDataResult.mean = levelData.data.mean;
        summaryDataResult.sd = levelData.data.sd;
        summaryDataResult.nPts = levelData.data.numPoints;
        summaryDataResult.controlLevel = levelData.level;
        summaryDataResult.controlLotId = levelData.controlLotId;
        summaryDataResult.lastModified = enteredDateTime; // TODO: Double check
        summModel.results.push(summaryDataResult);
      }
    }

    return summModel;
  }

  private async updateTestSpecInfo(testSpecInfo: TestSpecInfo, testSpecId: number, analyteSection: AnalyteSection) {
    if (!testSpecInfo.testSpecId) {
      testSpecInfo.testSpecId = testSpecId;
    }
    const product: LabProduct =
      await this.dataManagementService.getPortalProductByLabInstrumentProductLotIdAsync(analyteSection.analyteInfo.productId.toString());
    if (product) {
      if (!testSpecInfo.productId) {
        testSpecInfo.productId = +product.productId;
      }
      if (!testSpecInfo.productMasterLotId) {
        testSpecInfo.productMasterLotId = product.lotInfo.id;
      }
    }
    if (!testSpecInfo.labUnitId) {
      testSpecInfo.labUnitId = analyteSection.analyteInfo.labUnitId;
    }
  }

  public async createRunDataModelAsync(
    analyteEntry: AnalyteEntry,
    analyteSection: AnalyteSection,
    labId: string,
    accountId: string,
    accountNumber: string,
    selectedDateTime: Date,
    enteredDateTime: Date,
    timeZone: string
  ): Promise<RunData> {
    const testSpecId = await this.getTestSpecIdByTestIdAndLotAsync(
      analyteSection.analyteInfo.testId,
      analyteEntry.changeLotData.selectedReagentLot,
      analyteEntry.changeLotData.selectedCalibratorLot
    );

    let labTest = await this.labTestService.getLabTest(analyteEntry.labTestId);
    if (labTest.testSpecId !== testSpecId) {
      labTest.testSpecId = Number(testSpecId);
      labTest = await this.labTestService.putLabTest(labTest).toPromise();
    }

    const runModel: RunData = {
      labTestId: analyteSection.analyteInfo.labTestId,
      // BUG FIX 227902 SR and AJ 1-4-2022
      testId: +analyteSection.analyteInfo.testId,
      testSpecId: +testSpecId,
      correlatedTestSpecId: labTest.correlatedTestSpecId,
      labId: labId,
      labInstrumentId: analyteSection.analyteInfo.instrumentId,
      labProductId: analyteSection.analyteInfo.productId,
      accountId: accountId,
      accountNumber: accountNumber,
      labUnitId: analyteSection.analyteInfo.labUnitId,
      dataType: RawDataType.RunData,
      userComments: this.getUserCommentsFromChangeLotModel(analyteEntry.changeLotData, enteredDateTime),
      enteredDateTime: enteredDateTime,
      localRunDateTime: selectedDateTime,
      runDateTime: selectedDateTime,
      localRawDataDateTime: selectedDateTime,
      dataSource: undefined,
      evaluationRules: undefined,
      // flags: undefined,
      id: undefined,
      isLastMatch: undefined,
      isRestartFloat: undefined,
      labLocationTimeZone: timeZone,
      rawDataDateTime: selectedDateTime,
      results: new Array<PointDataResult>(), // defined below
      runReasons: undefined,
      upsertOptions: undefined, // may need
      userActions: this.getUserActionsFromChangeLotModel(analyteEntry?.changeLotData?.action),
      userInteractions: undefined
    };

    // add results
    const levelDataSet = analyteEntry.levelDataSet;
    for (let i = 0; i < levelDataSet.length; ++i) {
      const levelValue = <LevelValue>levelDataSet[i];
      if (!levelValue.isPristine) {
        const pointDataResult = new PointDataResult();
        pointDataResult.resultValue =  Utility.normalizeToRationalNumber(levelValue.data.value); // Compatibility fix, convert resultvalue to a number
        pointDataResult.controlLevel = levelValue.level;
        pointDataResult.controlLotId = levelValue.controlLotId;
        pointDataResult.lastModified = enteredDateTime;
        pointDataResult.measuredDateTime = selectedDateTime;
        runModel.results.push(pointDataResult);
      }
    }

    return runModel;
  }

  private getUserCommentsFromChangeLotModel(
    changeLotModel: ChangeLotModel,
    enteredDateTime: Date
  ): UserComment[] {
    let userComments: Array<UserComment>;
    const comment = changeLotModel.comment;
    if (!Utility.isEmpty(comment)) {
      userComments = new Array<UserComment>();
      userComments.push(this.createUserComment(comment, enteredDateTime));
    }
    return userComments;
  }

  private getUserActionsFromChangeLotModel(
    action: Action
  ): Action[] {
    let userActions: Array<Action>;
    if (!!action) {
      const user = this.authService.getCurrentUser();
      userActions = new Array<Action>();
      const userAction: Action = {
        actionId: action.actionId,
        actionName: action.actionName,
        userId: user.userOktaId,
        userFullName: user.firstName + ' ' + user.lastName,
        enterDateTime: action.enterDateTime
      };
      userActions.push(userAction);
    }
    return userActions;
  }

  private async getTestSpecIdByTestIdAndLotAsync(
    testId: string,
    reagentLot: ReagentLot,
    calibratotLot: CalibratorLot
  ): Promise<string> {
    const testInfo = await this.codeListService.getTestByIdAsync(testId.toString());
    if (!testInfo) {
      this.appLoggerService.log(
        'unable to get test info from codelist for test id : ' +
        testId.toString()
      );
    }
    return await this.getTestSpecIdAsync(testInfo, reagentLot, calibratotLot);
  }

  private async getTestSpecInfoByTestSpecIdAsync(
    testSpecId: number
  ): Promise<TestSpecInfo> {
    let testSpecInfo: TestSpecInfo = null;
    if (testSpecId) {
      testSpecInfo = await this.codeListService.getTestSpecByIdAsync(
        testSpecId.toString()
      );
    }
    return testSpecInfo;
  }

  private async getTestSpecIdAsync(
    testInfo: TestInfo,
    selectedReagentLot: ReagentLot,
    selectedCalibratorLot: CalibratorLot
  ): Promise<string> {
    if (!testInfo) {
      this.appLoggerService.log(
        'getTestSpecIdAsync - ArgumentNullException: testInfo'
      );
    }
    if (!selectedReagentLot) {
      this.appLoggerService.log(
        'getTestSpecIdAsync - ArgumentNullException: selectedReagentLot'
      );
    }
    if (!selectedCalibratorLot) {
      this.appLoggerService.log(
        'getTestSpecIdAsync - ArgumentNullException: selectedCalibratorLot'
      );
    }

    if (selectedReagentLot && selectedCalibratorLot) {
      let testSpecId = await this.codeListService.getTestSpecIdAsync(
        testInfo.analyteId.toString(),
        testInfo.methodId.toString(),
        testInfo.instrumentId.toString(),
        selectedReagentLot.id.toString(),
        testInfo.storageUnitId.toString(),
        selectedCalibratorLot.id.toString()
      );

      if (testSpecId.toString() === '-1') {
        const testSpec: TestSpec = new TestSpec();

        testSpec.analyteId = testInfo.analyteId;
        testSpec.methodId = testInfo.methodId;
        testSpec.instrumentId = testInfo.instrumentId;
        testSpec.reagentLotId = selectedReagentLot.id;
        testSpec.storageUnitId = testInfo.storageUnitId;
        testSpec.calibratorLotId = selectedCalibratorLot.id;

        const newTestSpec = await this.codeListService.postTestSpecAsync(testSpec);
        testSpecId = newTestSpec.id.toString();
      }

      return testSpecId;
    }
  }

  public extractValidAnalyteEntries(
    analyteForm: FormGroup,
    formControlNames: Array<string>
  ): Array<AnalyteEntry> {
    let validAnalyteEntries: Array<AnalyteEntry>;
    formControlNames.forEach(controlName => {
      const control = analyteForm.controls[controlName];
      if (control.valid && !control.pristine) {
        validAnalyteEntries = validAnalyteEntries
          ? validAnalyteEntries
          : new Array<AnalyteEntry>();

        validAnalyteEntries.push(control.value);
      }
    });

    return validAnalyteEntries;
  }

  public createPostBaseRawDataSet = async (
    analyteEntry: AnalyteEntry,
    sortedAnalyteSections: Array<AnalyteSection>,
    labId: string,
    accountId: string,
    accountNumber: string,
    selectedDateTime: Date,
    enteredDateTime: Date,
    timeZone: string
  ) => {
    const analyteSection = sortedAnalyteSections[analyteEntry.analyteIndex];
    if (analyteSection.analyteInfo.isSummary) {
      const summaryDataModel = await this.createSummaryDataModelAsync(
        analyteEntry,
        analyteSection,
        labId,
        accountId,
        accountNumber,
        selectedDateTime,
        enteredDateTime,
        timeZone
      );
      return <BaseRawDataModel>summaryDataModel;
    } else {
      const runDataModel = await this.createRunDataModelAsync(
        analyteEntry,
        analyteSection,
        labId,
        accountId,
        accountNumber,
        selectedDateTime,
        enteredDateTime,
        timeZone
      );
      return <BaseRawDataModel>runDataModel;
    }
  }

  public getGlobalLabels(): GlobalLabels {

    return {
      mean: this.getTranslation('TRANSLATION.MEAN1').toLocaleUpperCase(),
      sd: this.getTranslation('CHANGELOT.SDS').toLocaleUpperCase(),
      points: this.getTranslation('CHANGELOT.POINT').toLocaleUpperCase()
    } as GlobalLabels;
  }

  public getAnalyteEntryByFormControlName(
    analyteForm: FormGroup,
    formControlName: string
  ): AnalyteEntry {
    return <AnalyteEntry>analyteForm.controls[formControlName].value;
  }

  public setAnalyteEntryByFormControlName(
    analyteForm: FormGroup,
    formControlName: string,
    analyteEntry: AnalyteEntry
  ): void {
    analyteForm.controls[formControlName].setValue(analyteEntry);
  }

  public async getTestInfoAsync(
    labTestId: string,
    analyteSections: Array<AnalyteSection>
  ): Promise<TestInfo> {
    const codeListTestId = this.getCodeListTestId(labTestId, analyteSections);

    return await this.codeListService.getTestByIdAsync(codeListTestId);
  }

  private getCodeListTestId(
    labTestId: string,
    analyteSections: Array<AnalyteSection>
  ): string {
    return analyteSections.find(a => a.analyteInfo.labTestId === labTestId)
      .analyteInfo.testId;
  }

  private createUserComment(content: string, enteredDate: Date): UserComment {
    const user = this.authService.getCurrentUser();
    const userComment: UserComment = {
      userId: user.userOktaId,
      content: content,
      userFullName: user.firstName + ' ' + user.lastName,
      enterDateTime: enteredDate
    };

    return userComment;
  }

  public async updateTestSpecId(analyteEntry: AnalyteEntry, testId: string): Promise<void> {
    //update only if user changed selected calibratorlotid or reagentlotid.
    if ((analyteEntry.changeLotData.defaultReagentLot.id == analyteEntry.changeLotData.selectedReagentLot.id) &&
      (analyteEntry.changeLotData.defaultCalibratorLot.id == analyteEntry.changeLotData.selectedCalibratorLot.id))
      return;

    const oldTestInfo = await this.codeListService.getTestByIdAsync(testId);

    const oldTestSpec: TestSpec = {
      id: undefined,
      testId: undefined,
      analyteStorageUnitId: oldTestInfo.analyteStorageUnitId,
      analyteId: oldTestInfo.analyteId,
      methodId: oldTestInfo.methodId,
      instrumentId: oldTestInfo.instrumentId,
      reagentId: oldTestInfo.reagentId,
      reagentLot: undefined,
      reagentLotId: analyteEntry.changeLotData.selectedReagentLot.id,
      calibratorId: oldTestInfo.calibratorId,
      calibratorLotId: analyteEntry.changeLotData.selectedCalibratorLot.id,
      calibratorLot: undefined,
      storageUnitId: oldTestInfo.storageUnitId,
      analyteName: undefined,
      methodName: undefined,
      instrumentName: undefined,
      reagentManufacturerName: undefined,
      reagentManufacturerId: undefined,
      calibratorManufacturerName: undefined,
      calibratorManufacturerId: undefined,
      reagentName: undefined,
      calibratorName: undefined,
      storageUnitName: undefined
    };
    const newTestSpec = await this.codeListService.postTestSpecAsync(oldTestSpec);
    const labTest = await this.labTestService.getLabTest(analyteEntry.labTestId);
    labTest.testSpecId = Number(+newTestSpec.id);

    await this.labTestService.postLabTest(labTest);

    const labTestWithUpdatedTestSpecInfo = labTest;
    labTestWithUpdatedTestSpecInfo.testSpecInfo = newTestSpec;
    this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: labTestWithUpdatedTestSpecInfo }));
  }

  public updateDefaultLots(analyteEntries: Array<AnalyteEntry>) {
    analyteEntries.forEach(ae => {
      ae.changeLotData.defaultReagentLot = ae.changeLotData.selectedReagentLot;
      ae.changeLotData.defaultCalibratorLot = ae.changeLotData.selectedCalibratorLot;
    });
  }

  public populateTranslationLabelDictionary(translationLabelDictionary: TranslationLabels): TranslationLabels {
    translationLabelDictionary['errorLotExpired'] = this.getTranslation('PAGESECTION.EXPIRED');
    translationLabelDictionary['reagentLot'] = this.getTranslation('TRANSLATION.REAGENTLOT1');
    translationLabelDictionary['calibratorLot'] = this.getTranslation('TRANSLATION.CALIBRATOR1');
    translationLabelDictionary['addAComment'] = this.getTranslation('TRANSLATION.ADDACOMMENT');
    translationLabelDictionary['enterMeanValue'] = this.getTranslation('TRANSLATION.MEANVALUE');
    translationLabelDictionary['enterSDValue'] = this.getTranslation('TRANSLATION.SDVALUE');
    translationLabelDictionary['enterAllValues'] = this.getTranslation('TRANSLATION.ENTERALLVALUES');
    translationLabelDictionary['sdShouldBeZero'] = this.getTranslation('TRANSLATION.SDZERO');
    translationLabelDictionary['lotHasExpired'] = this.getTranslation('TRANSLATION.LOTHASEXPIRED');
    translationLabelDictionary['shouldBeGreaterThanZero'] = this.getTranslation('TRANSLATION.GREATERZERO');
    translationLabelDictionary['sdShouldBePositive'] = this.getTranslation('TRANSLATION.SDPOSITIVE');
    translationLabelDictionary['enterPointValue'] = this.getTranslation('TRANSLATION.POINTVALUE');
    translationLabelDictionary['expiredLotWarning'] = this.getTranslation('PAGESECTION.EXPIRED');

    return translationLabelDictionary;
  }

  public async getLotsByTestSpecIdAsync(testSpecId: number): Promise<ChangeLotModel> {
    const resultChangeLot = new ChangeLotModel();

    const testSpecInfo = await this.codeListService.getTestSpecByIdAsync(testSpecId.toString());
    let reagentLots;
    let calibratorLots;

    reagentLots = await this.codeListService.getReagentLotsByReagentIdAsync(
      testSpecInfo.reagentId.toString()
    );

    calibratorLots = await this.codeListService.getCalibratorLotsByCalibratorIdAsync(
      testSpecInfo.calibratorId.toString()
    );

    resultChangeLot.selectedCalibratorLot = calibratorLots.find(x => x.id === testSpecInfo.calibratorLotId);
    resultChangeLot.selectedReagentLot = reagentLots.find(x => x.id === testSpecInfo.reagentLotId);
    resultChangeLot.reagentLots = reagentLots;
    resultChangeLot.calibratorLots = calibratorLots;

    return resultChangeLot;
  }

  public getSelectedDateTime(dateOfMostRecentSummaryEntry: Date = null, screenLoadedDateTime = new Date(), timeZone = ''): Date {
    let selectedDateTime = this.dateTimeHelper.getLastDayOfPreviousMonth(timeZone);

    if (dateOfMostRecentSummaryEntry !== null) {
      const currentYear = screenLoadedDateTime.getFullYear();
      const currentMonth = screenLoadedDateTime.getMonth();
      const summaryYear = dateOfMostRecentSummaryEntry.getFullYear();
      const summaryMonth = dateOfMostRecentSummaryEntry.getMonth();

      if (summaryYear === currentYear && summaryMonth === currentMonth) {
        selectedDateTime = new Date(screenLoadedDateTime);
      }
    }

    return selectedDateTime;
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  public getChangeLotDataLabels(): Partial<ChangeLotModel> {
    return {
      labelCorrective: this.getTranslation('CHANGELOT.CORRECTIVE'),
      labelReagentLot: this.getTranslation('CHANGELOT.REAGENTLOT'),
      labelCalibratorLot: this.getTranslation('CHANGELOT.CALIBRATORLOT'),
      labelReagent: this.getTranslation('CHANGELOT.REAGENTLOT1'),
      labelCalibrator: this.getTranslation('CHANGELOT.CALIBRATORLOT1'),
      labelHide: this.getTranslation('CHANGELOT.HIDE'),
      labelShow: this.getTranslation('CHANGELOT.SHOW'),
      labelTestRuns: this.getTranslation('CHANGELOT.TESTRUNS'),
      labelForgot: this.getTranslation('CHANGELOT.FORGOT'),
      labelExpired: this.getTranslation('CHANGELOT.EXPIRED'),
      labelComment: this.getTranslation('CHANGELOT.COMMENT'),
    };
  }
}
