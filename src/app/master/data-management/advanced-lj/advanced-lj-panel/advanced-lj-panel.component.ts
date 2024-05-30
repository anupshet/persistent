/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, fromEvent, Observable, of, Subject } from 'rxjs';
import { filter, takeUntil, take, delay, debounceTime } from 'rxjs/operators';
import * as ngrxStore from '@ngrx/store';
import { ungzip } from 'pako';
import { cloneDeep, flatMap as lodashFlatMap, orderBy, uniq } from 'lodash';

import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ImageToPdfService } from '../../../../shared/services/image-to-pdf.service';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromDataManagement from '../../../data-management/state/selectors';
import * as fromRoot from '../../../../../app/state/app.state';
import * as fromDataRoot from '../../../../state/app.state';
import { LabProduct, LabTest, TreePill } from '../../../../contracts/models/lab-setup';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { RunsService } from '../../../../shared/services/runs.service';
import { NodeInfoService } from '../../../../shared/services/node-info.service';
import { Header } from '../../../../contracts/models/data-management/header.model';
import { NodeInfoActions } from '../../../../shared/state/actions';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { TestSpecService } from '../../../../shared/services/test-spec.service';
import { TestSpec } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { PointDataResult } from '../../../../contracts/models/data-management/run-data.model';
import { asc, expiringDateFormat, nonBrManufacturerIdStr, resultsKey } from '../../../../core/config/constants/general.const';
import * as fromNodeInfo from '../../../../shared/state/selectors';
import { SummaryStatisticsTableService } from '../../analyte-detail-table/analytical-section/summary-statistics-table/summary-statistics-table.service';

import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { AdvancedLjChartHelperForRepeatedDates } from '../charting/advanced-lj-chart-helper-repeated-dates';
import { LjChart } from '../../../../contracts/models/data-management/advanced-lj/lj-chart.models';
import { BaseRawDataModel } from '../../../../contracts/models/data-management/base-raw-data.model';
import { Utility } from '../../../../core/helpers/utility';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { ConfigService } from '../../../../core/config/config.service';
import { AdvancedLjChartHelper } from '../charting/advanced-lj-chart-helper';
import {
  advancedLjFirstDay, advancedLjStatisticsCumulative, advancedLjStatisticsDays60, advancedLjStatisticsDays90,
  advancedLjToggleDebounceTime
} from '../../../../core/config/constants/advanced-lj.const';
import { StatisticsTypeEnum } from '../../../../contracts/enums/advanced-lj/lj-statistics.enum';
import { TimeframeEnum } from '../../../../contracts/enums/lab-setup/timeframe.enum';
import { StatisticsResult, LevelStatistics, StatisticsRequest } from '../../../../contracts/models/data-management/advanced-lj/lj-statistics.model';
import { SummaryStats } from '../../../../contracts/models/data-management/summary-stats.model';
import { LjChartEventType, LjChartMode, LjChartXAxisType, LjChartYAxisType } from '../../../../contracts/enums/advanced-lj/lj-chart.enum';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { DynamicReportingService } from '../../../../shared/services/reporting.service';

import { AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';

@Component({
  selector: 'unext-advanced-lj-panel',
  templateUrl: './advanced-lj-panel.component.html',
  styleUrls: ['./advanced-lj-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [UnityNextDatePipe, UnityNextNumericPipe]
})
export class AdvancedLjPanelComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('popup') el: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  placeholder_text: string;
  levelsInUse: Array<number>;
  selectedLevels: Array<number>;
  levelsToDisplay = 0;
  isOverlay = false;
  displayChart = true;
  analyteName = '';
  chartPngSrc = '';
  chartWidth: number;
  chartHeight: number;
  private isOverlayClicks = new Subject();
  readonly ljChartEventReagentLot = LjChartEventType.ReagentLotChange;
  readonly ljChartEventCalibratorLot = LjChartEventType.CalibratorLotChange;
  readonly ljChartEventMean = LjChartEventType.MeanChange;
  readonly ljChartEventSd = LjChartEventType.SdChange;
  chartEventFilterSelection = [
    this.ljChartEventReagentLot,
    this.ljChartEventCalibratorLot,
    this.ljChartEventMean,
    this.ljChartEventSd
  ];

  readonly ljChartYaxisOptionEvalMean = LjChartYAxisType.EvalMean;
  readonly ljChartYaxisOptionCumulativeMean = LjChartYAxisType.CumulativeMean;
  readonly ljChartYaxisOptionZscore = LjChartYAxisType.Zscore;
  yAxisOption = this.ljChartYaxisOptionEvalMean;
  yAxisOptionSaved = 0;   // Store the yAxisOption value for when overlay is enabled.
  readonly ljChartXaxisOptionSequence = LjChartXAxisType.Sequence;
  readonly ljChartXaxisOptionDate = LjChartXAxisType.Date;
  xAxisOption: LjChartXAxisType = this.ljChartXaxisOptionSequence;

  calibrator = '';
  method = '';
  reagent = '';
  unit = '';
  pdfHeaderArray = ['Create', 'Foo', 'Bar'];

  analyteNameNotFoundTranslated = this.getTranslation('TRANSLATION.NAME');

  private destroy$ = new Subject<boolean>();
  public navigationState$ = this.store.pipe(select(fromNavigationSelector.getNavigationState));
  public dataManagementState$ = this.dataManagementStore.pipe(ngrxStore.select(fromDataManagement.getDataManagementState));
  public getLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  public getAncestorsState$ = this.store.pipe(select(sharedStateSelector.getAncestors));
  analytesArray: Array<LabTest> = [];
  arrayPos: number;
  entityId: string;
  leftButtonDisabled = true;
  rightButtonDisabled = true;
  showAnalyteDescription = false;
  public currentLabTestId: string;
  public analyteDescriptionData: Header;
  public timeZone: string;
  public testSpecs: Array<TestSpec> = [];
  public currentAnalytePointResults: Array<PointDataResult> = [];
  public hierarchyText = '';
  public isTesting = false;
  public advancedLjChartHelper: AdvancedLjChartHelper;
  public comparison: StatisticsTypeEnum;
  public dateRange: TimeframeEnum;
  public comparisonOptions = StatisticsTypeEnum;
  public dateRangeOptions = TimeframeEnum;
  public yAxisStatistics: StatisticsResult;
  public tempStatistics: StatisticsResult;
  public earliestDataDateTime: Date;
  public latestDataDateTime: Date;
  expireDate: string;
  public isNavigationMenuPresent = false;
  public runDateTime: Date;

  protected timeFrameStartDate: Date;
  protected timeFrameEndDate: Date;
  protected appLocale: string;

  private currentlabInstrumentId: string;
  private currentTestId: string;
  private testSpecId: number | string;
  private productMasterLotId: string;
  private comparisonStatistics: StatisticsResult;
  private analyteId: number;
  private methodId: number;
  private statsStartYearMonth: string;
  private statsEndYearMonth: number;
  private labCumulativeYearMonth: string;
  private labUnitId: number;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.navigateNext[24],
    icons.navigateBefore[24],
    icons.download[24],
    icons.close[24]
  ];

  public ljChart: LjChart;
  public currDecimalPlace = 2;
  expiringDate: string;
  public hasOnlyNonBrControl = false;
  public navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appLoggerService: AppLoggerService,
    private imageToPdfService: ImageToPdfService,
    private store: Store<fromRoot.State>,
    private dataManagementStore: ngrxStore.Store<fromDataRoot.State>,
    private iconService: IconService,
    public runsService: RunsService,
    private nodeInfoService: NodeInfoService,
    private summaryStatisticsService: SummaryStatisticsTableService,
    private testSpecService: TestSpecService,
    private dateTimeHelper: DateTimeHelper,
    private errorLoggerService: ErrorLoggerService,
    private configService: ConfigService,
    private dynamicReportingService: DynamicReportingService,
    private _appNavigationService: AppNavigationTrackingService,
    private translateService: TranslateService,
    public unityNextDatePipe: UnityNextDatePipe,
    public unityNextNumericPipe: UnityNextNumericPipe
  ) {
    this.iconService.addIcons(this.iconsUsed);
    this.advancedLjChartHelper = new AdvancedLjChartHelperForRepeatedDates(runsService , unityNextDatePipe, unityNextNumericPipe);
  }

  ngOnInit() {
    this.appLocale = this.configService.getConfig('appLocale');

    // get timezone from lablocation
    this.getLabLocation$
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        this.timeZone = labLocation.locationTimeZone;
      });

    // Use lab test id from data property, if provided
    if (this.data && this.data.labTestId) {
      this.entityId = this.data.labTestId;
      this.currDecimalPlace = this.data.decimalPlaces;
      this.currentlabInstrumentId = this.data.labInstrumentId;
      this.runDateTime = this.data.runDateTime;   // If provided and is within a year, it will initialize the timeframe to include this date-time.
      this.isNavigationMenuPresent = false;

      this.store.dispatch(NodeInfoActions.getAncestors({ nodeType: EntityType.LabTest, analyteIds: [this.entityId] }));

      this.getAncestorsState$.pipe(filter(ancestors => !!ancestors && !!ancestors.length && !!ancestors[0].length
        && ancestors[0][0].id === this.entityId), take(1))
      .subscribe(ancestors => {
        this.productMasterLotId = (ancestors[0][1] as LabProduct).productMasterLotId;
        this.loadAnalyte([cloneDeep(ancestors[0][0])]);
      });
    } else {
    // Get current lab test Id from state if loaded from data table
    this.dataManagementState$
      .pipe(filter(dataManagementState => !!dataManagementState), takeUntil(this.destroy$))
      .subscribe(dataManagementState => {
        this.entityId = dataManagementState.entityId;
        if (
          dataManagementState.cumulativeAnalyteInfo &&
          dataManagementState.cumulativeAnalyteInfo.length > 0 &&
          dataManagementState.cumulativeAnalyteInfo[0].decimalPlaces.length > 0
        ) {
          this.currDecimalPlace = dataManagementState.cumulativeAnalyteInfo[0].decimalPlaces[0];
          this.currentlabInstrumentId = dataManagementState.cumulativeAnalyteInfo[0].instrumentId;
          this.productMasterLotId = dataManagementState.cumulativeAnalyteInfo[0].productMasterLotId;
        }
      });

    // Get current control array list, sort, and get pos of current analyte
    this.navigationState$
      .pipe(filter(navigationState => !!navigationState), take(1))
      .subscribe(navigationState => {
        // get array of children
        this.loadAnalyte(cloneDeep(navigationState.selectedNode.children));
        this.isNavigationMenuPresent = true;

        // populate the node info data for all analytes available.
        const analyteIds = this.analytesArray.map(analyte => analyte.id);
        this.store.dispatch(NodeInfoActions.getAncestors({ nodeType: EntityType.LabTest, analyteIds: analyteIds }));
      });
    }

    this.isOverlayClicks.pipe(
      debounceTime(advancedLjToggleDebounceTime),
      takeUntil(this.destroy$)
    ).subscribe((event: boolean) => {
      this.isOverlay = event;
      if (this.isOverlay) {
        this.yAxisOptionSaved = this.yAxisOption;
        this.yAxisOption = this.ljChartYaxisOptionZscore;
      } else {
        this.yAxisOption = this.yAxisOptionSaved;
      }
      this.populateChartContent(this.selectedLevels, this.isOverlay);
    });
    this.getAnalyteDescriptionData();
    this.checkControlManufacturer();
  }

  ngAfterViewInit() {
    // Delayed click handling for buttons using (https://rxjs.dev/api/operators/delay)
    if (this.isNavigationMenuPresent) {
      const leftAdvLjButtonClick = fromEvent(document.getElementById('leftAdvLjButton'), 'click');
      const rightAdvLjButtonClick = fromEvent(document.getElementById('rightAdvLjButton'), 'click');
      const delayedLeftAdvLjClicks = leftAdvLjButtonClick.pipe(delay(1000)); // each click emitted after 1 second
      const delayedRightAdvLjClicks = rightAdvLjButtonClick.pipe(delay(1000)); // each click emitted after 1 second
      delayedLeftAdvLjClicks.pipe(filter(clicked => !!clicked), takeUntil(this.destroy$)).subscribe(x => {
        this.navigateToAnalyte(--this.arrayPos);
      });
      delayedRightAdvLjClicks.pipe(filter(clicked => !!clicked), takeUntil(this.destroy$)).subscribe(x => {
        this.navigateToAnalyte(++this.arrayPos);
      });
    }
  }

  loadAnalyte(analytesArray) {
    // orderby sortOrder or orderBy displayName when sortOrder is 0 for all analytes
    this.analytesArray = orderBy(analytesArray, [
      (node: LabTest) => node.sortOrder,
      (node: LabTest) => node.displayName ? node.displayName.replace(/\s/g, '').toLocaleLowerCase() : ''
    ], [asc, asc]);
    this.analytesArray = this.analytesArray.filter(a => a.levelSettings?.dataType === 0); // Remove Summary Analytes
    this.arrayPos = this.analytesArray.findIndex(a => a.id === this.entityId);
    this.isNavDisabled();
    this.currentLabTestId = this.analytesArray && this.analytesArray[this.arrayPos] ? this.analytesArray[this.arrayPos]?.id : '';
    this.currentTestId = this.analytesArray && this.analytesArray[this.arrayPos] ? this.analytesArray[this.arrayPos]?.testId : '';
    this.testSpecId = this.analytesArray && this.analytesArray[this.arrayPos] ? this.analytesArray[this.arrayPos]?.testSpecId : '';
    this.analyteId = this.analytesArray && this.analytesArray[this.arrayPos] ?
      this.analytesArray[this.arrayPos]?.testSpecInfo?.analyteId : null;
    this.methodId = this.analytesArray && this.analytesArray[this.arrayPos] ?
      this.analytesArray[this.arrayPos]?.testSpecInfo?.methodId : null;
    this.labUnitId = +(this.analytesArray && this.analytesArray[this.arrayPos] ? this.analytesArray[this.arrayPos]?.labUnitId : null);
    this.loadAnalyteData();
  }

  getAnalyteDescriptionData() {
    // get analyte description data with gettting data from headerstate from store
    this.store.pipe(ngrxStore.select(fromNodeInfo.getNodeInfoState))
      .pipe(
        filter(nodeInfoState => !!nodeInfoState && !!nodeInfoState.headerData),
        takeUntil(this.destroy$)
      )
      .subscribe(nodeInfoState => {
        try {
          this.analyteDescriptionData = nodeInfoState.headerData;
          const instrumentName = this.analyteDescriptionData && this.analyteDescriptionData.instrumentAlias ?
            this.analyteDescriptionData.instrumentAlias : this.analyteDescriptionData.instrumentName;
          const controlName = this.analyteDescriptionData && this.analyteDescriptionData.customProductName ?
            this.analyteDescriptionData.customProductName : this.analyteDescriptionData.productName;
          const lotNumber = this.analyteDescriptionData && this.analyteDescriptionData.productMasterLotNumber ?
            this.analyteDescriptionData.productMasterLotNumber : '';
          this.expireDate = this.analyteDescriptionData && this.analyteDescriptionData.lotExpiringDate ?
            this.dateTimeHelper.getTimezoneFormattedDateTime(this.analyteDescriptionData.lotExpiringDate,
              this.timeZone, expiringDateFormat) : '';
          // for heirarchy text to be displayed underneath Analyte Name
          const expiringDate = this.unityNextDatePipe.transform(this.expireDate, 'mediumDate');
          const translationLot = this.getTranslation('TRANSLATION.LOT');
          const translationExpires = this.getTranslation('TRANSLATION.EXPIRES');
          this.hierarchyText = `${instrumentName} / ${controlName} ${translationLot} ${lotNumber} ${translationExpires} ${expiringDate}`;
          this.appLoggerService.log('analyteDescriptionData: ', this.analyteDescriptionData);
          // data for pdf download
          this.calibrator = this.analyteDescriptionData.calibrator;
          this.method = this.analyteDescriptionData.method;
          this.reagent = this.analyteDescriptionData.reagentName;
          this.unit = this.analyteDescriptionData.unit;
          this.expiringDate = expiringDate;

        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.AdvancedLjPanelComponent + blankSpace + Operations.GetDataManagementHeaderData)));
        }
      });

  }

  private navigateToAnalyte(position: number) {
    this.displayChart = false;
    this.currentLabTestId = this.analytesArray && this.analytesArray[position] ? this.analytesArray[position]?.id : '';
    if (this.analytesArray[position] &&
      this.analytesArray[position].levelSettings &&
      this.analytesArray[position].levelSettings.levels &&
      this.analytesArray[position].levelSettings.levels.length > 0 &&
      this.analytesArray[position].testId &&
      this.analytesArray[position].testSpecId
    ) {
      this.currentTestId = this.analytesArray[position].testId;
      this.testSpecId = this.analytesArray[position].testSpecId;
      this.analyteId = this.analytesArray[position]?.testSpecInfo?.analyteId;
      this.methodId = this.analytesArray[position]?.testSpecInfo?.methodId;
      this.labUnitId = +this.analytesArray[position]?.labUnitId;
      this.analytesArray[position].levelSettings.levels.forEach(lv => {
        if (lv.levelInUse) {
          this.currDecimalPlace = lv.decimalPlace;
        }
      });
    }
    this.loadAnalyteData();
    this.isNavDisabled();
  }

  async populateRawData() {
    // First date range is for the first 6 months of data
    const startDate1 = new Date();
    startDate1.setFullYear(startDate1.getFullYear() - 1);
    startDate1.setDate(startDate1.getDate() + 1);
    const endDate1 = new Date();
    endDate1.setMonth(endDate1.getMonth() - 6);

    // Second date range is for the last 6 months of data
    const startDate2 = new Date(endDate1);
    startDate2.setDate(startDate2.getDate() + 1);
    const endDate2 = new Date();

    this.currentAnalytePointResults = [];
    this.tempStatistics = null;

    const requestData: Array<Observable<string | StatisticsResult[]>> = [
      // Get the last year of data by fetching them in two 6-month batches.
      this.runsService.getRawDataForAdvancedLj(this.currentLabTestId, startDate1, endDate1, false),
      this.runsService.getRawDataForAdvancedLj(this.currentLabTestId, startDate2, endDate2, false)
    ];
    // Get the Peer and Method mean statisticsResult
    if (this.comparison !== this.comparisonOptions.LabMeanSD && this.dateRange) {
      requestData.push(this.getPeerAndMethodMeanStatisticsResults(this.comparison));
    } else {
      requestData.push(of(null));
    }

    await forkJoin(requestData).toPromise().then((rawData: [string, string, StatisticsResult[]]) => {
      let analyteRawData0 = new Array<BaseRawDataModel>();
      let analyteRawData1 = new Array<BaseRawDataModel>();
      let analyteCompStatisticsData2: StatisticsResult[];
      // rawData is base64 representation of the gzip JSON, so it must be uncompressed.
      try {
        if (rawData[0]) {
          analyteRawData0 = this.uncompressData(rawData[0]);
        }

        if (rawData[1]) {
          analyteRawData1 = this.uncompressData(rawData[1]);
        }

        if (rawData[2]) {
          analyteCompStatisticsData2 = rawData[2];
        }

      } catch (e) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, e.stack, e.message,
            (componentInfo.UserManagementComponent + blankSpace + Operations.UncompressingAdvLjResponse)));
      }

      if ((analyteRawData0 && analyteRawData0.length > 0) || (analyteRawData1 && analyteRawData1.length > 0)) {
        // flatten the data into a PointDataResult array
        if (analyteRawData0 && analyteRawData0.length > 0) {
          this.currentAnalytePointResults = this.getPointDataResultsList(analyteRawData0);
        }

        if (analyteRawData1 && analyteRawData1.length > 0) {
          this.currentAnalytePointResults = this.currentAnalytePointResults.concat(this.getPointDataResultsList(analyteRawData1));
        }

        this.currentAnalytePointResults.forEach(dataPoint => dataPoint.measuredDateTime = new Date(dataPoint.measuredDateTime));
        this.currentAnalytePointResults.sort((a, b) => a.measuredDateTime.getTime() < b.measuredDateTime.getTime() ? -1 : 1);

        // Enumerate and set result status for each point
        this.currentAnalytePointResults.forEach(point => {
          point.resultStatus = this.runsService.extractResultStatus(point);
          point.decimalPlace = this.currDecimalPlace;
        });

        // get the latest datapoints date and earliest datapoint date
        if (this.currentAnalytePointResults && this.currentAnalytePointResults.length > 0) {
          this.earliestDataDateTime = this.currentAnalytePointResults[0].measuredDateTime;
          this.latestDataDateTime = this.currentAnalytePointResults[this.currentAnalytePointResults.length - 1].measuredDateTime;
        }
      }

      // Set distinct levels
      this.levelsInUse = this.getLevelsFromData(this.currentAnalytePointResults);
      this.selectedLevels = this.levelsInUse;

      this.appLoggerService.log('currentAnalytePointResults: ', this.currentAnalytePointResults);
      this.appLoggerService.log('selectedLevels: ', this.levelsInUse);

      // assigning this api call here since above we need to get the updated analyte levels
      if (analyteCompStatisticsData2) {
        this.comparisonStatistics = {
          levelStatistics: this.createLevelStatisticsData(analyteCompStatisticsData2)
        };
      }

    }).then(() => {
      if (this.currentAnalytePointResults && this.currentAnalytePointResults.length > 0) {
        // getting the yearmonth of latest datapoint
        this.labCumulativeYearMonth = Utility.convertDateToYearMonth(this.currentAnalytePointResults
        [this.currentAnalytePointResults.length - 1].measuredDateTime);
        if (this.comparison === this.comparisonOptions.LabMeanSD && this.labCumulativeYearMonth) {
          // Get the Lab Cumulative mean statisticsData
          this.getLabCumulativeStatisticsResults().toPromise().then((summaryStatsData: SummaryStats) => {
            if (summaryStatsData) {
              this.comparisonStatistics = {
                levelStatistics: this.createLevelStatisticsData(summaryStatsData)
              };
              this.getTestSpecs();
            }
          });
        } else {
          this.getTestSpecs();
        }
      }
    });
  }

  // Get distinct TestSpecs
  private getTestSpecs() {
    const testSpecIds = this.currentAnalytePointResults
      ? this.getDistinctTestSpecIds(this.currentAnalytePointResults)
      : [];
    if (testSpecIds && testSpecIds.length > 0) {
      // get all testspecs from TestSpecsService
      this.testSpecService.getTestSpecs(testSpecIds).then(_testSpecs => {
        this.testSpecs = _testSpecs;
        this.appLoggerService.log('testSpecsData: ', this.testSpecs);
      }).then(() => {
        this.populateChartContent(this.selectedLevels, this.isOverlay);
      });
    }
  }

  private getHoverTextTranslations(): {} {
    return {
      level: this.getTranslation('TRANSLATION.LEVEL'),
      mean: this.getTranslation('TRANSLATION.MEAN'),
      sd: this.getTranslation('TRANSLATION.SD'),
      cv: this.getTranslation('TRANSLATION.CV'),
      zScore: this.getTranslation('ADVANCEDLJPANEL.ZSCORENODASH'),
      actions: this.getTranslation('ADVANCEDLJPANEL.ACTIONS'),
      reason: this.getTranslation('ADVANCEDLJPANEL.REASON')
    };
  }

  protected uncompressData(base64EncodedCompressedData: string): any {
    let returnObject: any;

    const uint8Array = Utility.base64ToUint8Array(base64EncodedCompressedData);
    this.appLoggerService.log('ALJ base64ToUint8Array', uint8Array);
    const uncompressedRawData = ungzip(uint8Array, { to: 'string' });
    this.appLoggerService.log('ALJ ungzip', uncompressedRawData);
    returnObject = JSON.parse(uncompressedRawData);
    this.appLoggerService.log('ALJ JSON parsed', returnObject);

    return returnObject;
  }

  protected getPointDataResultsList(analyteRawData: Array<BaseRawDataModel>): Array<PointDataResult> {
    let pointDataResults = new Array<PointDataResult>();

    if (analyteRawData && analyteRawData.length > 0) {
      analyteRawData = analyteRawData?.map(item =>
      ({
        ...item, results: item.results.map(res =>
        ({
          ...res,
          testSpecId: item.testSpecId,
          userActions: item.userActions,
          runId: item.id
        })
        )
      })
      );
      pointDataResults = lodashFlatMap(analyteRawData, resultsKey);
    }
    return pointDataResults;
  }

  public populateChartContent(selectedLevels: number[], isOverlay: boolean) {
    let chartMode = LjChartMode.Value;
    this.displayChart = false;

    if (isOverlay) {
      chartMode = LjChartMode.Overlay;
    } else if (this.yAxisOption === LjChartYAxisType.Zscore) {
      chartMode = LjChartMode.Zscore;
    }
    if (!this.isTesting && selectedLevels?.length > 0 && this.currentAnalytePointResults?.length > 0) {
      this.ljChart = (this.advancedLjChartHelper as AdvancedLjChartHelperForRepeatedDates)
        .GetChartContent(selectedLevels, this.timeFrameStartDate, this.timeFrameEndDate, this.currentAnalytePointResults,
          this.comparisonStatistics, this.timeZone, this.getHoverTextTranslations(), this.appLocale, this.testSpecs, this.xAxisOption,
          chartMode, this.canvas, this.chartEventFilterSelection, this.yAxisStatistics);
      this.displayChart = false;
      this.ljChart.config.xAxis.forEach(x => {
        if (x.range) {
          this.displayChart = true;
        }
      });
    }
  }

  async loadAnalyteData() {
    this.analyteDescriptionData = null;
    this.nodeInfoService.fetchHeaderDetails(this.currentLabTestId);
    await this.populateRawData();
  }

  getLevelsFromData(allResults: Array<PointDataResult>): Array<number> {
    return allResults && allResults.length ? uniq(allResults.map(point => point.controlLevel).sort((a, b) => a - b)) : [];
  }

  getDistinctTestSpecIds(data: PointDataResult[]): number[] {
    return data && data.length > 0 ? data.map(rundata => rundata.testSpecId)
      .filter((val, ind, self) => self.indexOf(val) === ind) : [];
  }

  // TODO: remove once integrated with the actual LJ panel component
  setTimeFrame(startDate: Date, endDate: Date): void {
    this.timeFrameStartDate = startDate;
    this.timeFrameEndDate = endDate;
    this.appLoggerService.log('Start Date: ' + startDate + ' ' + 'End Date: ' + endDate);
    this.populateChartContent(this.selectedLevels, this.isOverlay);
  }


  getAnalyteName(): string {
    this.analyteNameNotFoundTranslated = this.getTranslation('TRANSLATION.NAME');
    this.analyteName = this.analytesArray[this.arrayPos]?.displayName || this.analyteNameNotFoundTranslated;
    return this.analyteName;
  }

  disableButtons() {
    this.leftButtonDisabled = true;
    this.rightButtonDisabled = true;
    this.showAnalyteDescription = false;
  }
  // TODO: modify this method by giving correct image URL
  downloadPdf() {
    const startMonth = this.timeFrameStartDate.getMonth() + 1;
    const startDay = this.timeFrameStartDate.getDate();

    const currStartYear = this.timeFrameStartDate.getFullYear();
    const currStartMonth = startMonth > 9 ? startMonth : '0' + startMonth;
    const currStartDay = startDay > 9 ? startDay : '0' + startDay;
    const currStartDate = currStartYear + '-' + currStartMonth + '-' + currStartDay;

    const endMonth = this.timeFrameEndDate.getMonth() + 1;
    const endDay = this.timeFrameEndDate.getDate();

    const currEndYear = this.timeFrameEndDate.getFullYear();
    const currEndMonth = endMonth > 9 ? endMonth : '0' + endMonth;
    const currEndDay = endDay > 9 ? endDay : '0' + endDay;
    const currEndDate = currEndYear + '-' + currEndMonth + '-' + currEndDay;

    const fileName = this.analyteName + '_' + currStartDate + '_' + currEndDate + '_LJ.pdf';


    this.buildPDFHeader();
    // bug fix 224391 add extra padding if a single level or overlay displayed or both
    const padHeader = this.isOverlay || this.selectedLevels.length === 1;
    this.imageToPdfService.generatePdfFromImage(this.chartPngSrc, fileName, this.chartWidth,
       this.chartHeight, this.pdfHeaderArray, padHeader);
    this.updateAuditTrailData();
  }

  updateAuditTrailData(): void {
    this._appNavigationService.auditTrailDownloadData(AuditTrackingEvent.AdvancedLJChart);

  }

  private buildPDFHeader() {
    // This collects the translated values needed for the PDF report header
    // items not called with the getTranslationContent method are already translated
    this.pdfHeaderArray[0] = this.analyteName.trim();
    this.pdfHeaderArray[1] = this.hierarchyText.trim();
    this.pdfHeaderArray[2] = this.getTranslation('TRANSLATION.METHODS');
    this.pdfHeaderArray[3] = this.method.trim();
    this.pdfHeaderArray[4] = this.getTranslation('TRANSLATION.REAGENTS');
    this.pdfHeaderArray[5] = this.reagent.trim();
    this.pdfHeaderArray[6] = this.getTranslation('TRANSLATION.CALIBRATORS');
    this.pdfHeaderArray[7] = this.calibrator.trim();
    this.pdfHeaderArray[8] = this.getTranslation('TRANSLATION.UNITOFMEASURE');
    this.pdfHeaderArray[9] = this.unit.trim();
    this.pdfHeaderArray[10] = this.appLocale; // for future use
  }

  chartEventFilterChanged(evt) {
    this.appLoggerService.log('chartEventsFilterChanged', evt);
    this.populateChartContent(this.selectedLevels, this.isOverlay);
  }

  yAxisOptionChanged(evt) {
    this.yAxisOption = evt?.value;

    switch (this.yAxisOption) {
      case this.ljChartYaxisOptionCumulativeMean: {
        if (this.yAxisStatistics && this.yAxisStatistics.levelStatistics.length > 0 ||
          this.tempStatistics && this.tempStatistics.levelStatistics.length > 0) {
          if (!this.yAxisStatistics) {
            this.yAxisStatistics = this.tempStatistics;
          }
          this.populateChartContent(this.selectedLevels, this.isOverlay);
        } else {
          const _yAxisStatistics = this.getLabCumulativeStatisticsResults();
          if (_yAxisStatistics) {
            _yAxisStatistics
              .pipe(takeUntil(this.destroy$))
              .subscribe((statsData: SummaryStats) => {
                if (statsData && statsData.levels) {
                  this.yAxisStatistics = {
                    levelStatistics: this.createLevelStatisticsData(statsData)
                  };
                  this.populateChartContent(this.selectedLevels, this.isOverlay);
                }
              });
          }
        }
        break;
      }
      case this.ljChartYaxisOptionEvalMean: {
        if (this.yAxisStatistics) {
          this.tempStatistics = this.yAxisStatistics;
          this.yAxisStatistics = null;
        }
        this.populateChartContent(this.selectedLevels, this.isOverlay);
        break;
      }
      case this.ljChartYaxisOptionZscore: {
        if (this.yAxisStatistics) {
          this.tempStatistics = this.yAxisStatistics;
          this.yAxisStatistics = null;
        }
        this.populateChartContent(this.selectedLevels, this.isOverlay);
        break;
      }
    }
  }

  xAxisOptionChanged(evt) {
    this.xAxisOption = evt?.value;
    this.populateChartContent(this.selectedLevels, this.isOverlay);
  }

  isNavDisabled() {
    this.leftButtonDisabled = this.arrayPos === 0;
    this.rightButtonDisabled = this.arrayPos === this.analytesArray.length - 1;
  }

  levelsChange(event) {
    this.selectedLevels = event;
    this.populateChartContent(this.selectedLevels, this.isOverlay);
  }

  isOverlayChange(event) {
    this.isOverlayClicks.next(event);
  }

  receivePlotlyPng(event) {
    if (event) {
      this.chartPngSrc = event.src;
      this.chartWidth = event.width;
      this.chartHeight = event.height;
    }
  }

  toggleAnalyteDescription() {
    this.showAnalyteDescription = !this.showAnalyteDescription;
  }

  changeSelectionDropdowns() {
    if (this.comparison !== this.comparisonOptions.None) {
      this.comparisonStatistics = null;
      const _statisticsData = this.getFilteredStatisticsDataForAdvLj();
      if (_statisticsData) {
        _statisticsData
          .pipe(takeUntil(this.destroy$))
          .subscribe((statsData) => {
            if (statsData) {
              this.comparisonStatistics = {
                levelStatistics: this.createLevelStatisticsData(statsData)
              };
              if (this.comparisonStatistics.levelStatistics && this.comparisonStatistics.levelStatistics.length > 0) {
                this.populateChartContent(this.selectedLevels, this.isOverlay);
              }
            }
          });
      }
    } else {
      // Reset both the dropdowns;
      this.comparisonStatistics = null;
      this.comparison = null;
      this.dateRange = null;
      this.populateChartContent(this.selectedLevels, this.isOverlay);
    }
  }

  getFilteredStatisticsDataForAdvLj(): Observable<SummaryStats | StatisticsResult[]> {
    try {
      if (this.comparison === this.comparisonOptions.LabMeanSD) {
        return this.getLabCumulativeStatisticsResults();
      } else {
        if (this.dateRange && this.comparison) {
          // According to the date Range selected Set the StartMonthDate and EndMonth Date
          this.setStartAndEndMonthDates(this.dateRange);
          return this.getPeerAndMethodMeanStatisticsResults(this.comparison);
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AdvancedLjPanelComponent + blankSpace + Operations.getFilteredStatisticsDataForAdvLj)));
    }
  }

  setStartAndEndMonthDates(dateRange: number) {
    const current = new Date(); // For current Date;
    let newStartDate: Date;
    let convertToDate: Date;
    switch (dateRange) {
      case TimeframeEnum.Cumulative:
        // For Cumulative Date pass startYearMonth=000101 and endYearMonth=202106 (current month)
        this.statsStartYearMonth = advancedLjStatisticsCumulative;
        this.statsEndYearMonth = +Utility.convertDateToYearMonth(current);
        break;
      case TimeframeEnum.Days30:
        // For 30 Days
        this.statsStartYearMonth = Utility.convertDateToYearMonth(current);
        this.statsEndYearMonth = +Utility.convertDateToYearMonth(current);
        break;
      case TimeframeEnum.Days60:
        // For 60 Days
        newStartDate = new Date(current.getFullYear(), current.getMonth() - advancedLjStatisticsDays60, advancedLjFirstDay);
        convertToDate = new Date(newStartDate);
        this.statsStartYearMonth = Utility.convertDateToYearMonth(convertToDate);
        this.statsEndYearMonth = +Utility.convertDateToYearMonth(current);
        break;
      case TimeframeEnum.Days90:
        // For 90 Days
        newStartDate = new Date(current.getFullYear(), current.getMonth() - advancedLjStatisticsDays90, advancedLjFirstDay);
        convertToDate = new Date(newStartDate);
        this.statsStartYearMonth = Utility.convertDateToYearMonth(convertToDate);
        this.statsEndYearMonth = +Utility.convertDateToYearMonth(current);
        break;
      default:
        // pass the current month
        this.statsStartYearMonth = Utility.convertDateToYearMonth(current);
        this.statsEndYearMonth = +Utility.convertDateToYearMonth(current);
        break;
    }
  }

  getLabCumulativeStatisticsResults(): Observable<SummaryStats> {
    const _labCumulative$ = from(this.summaryStatisticsService
      .getSummaryStatsByLabMonthStatsInfoAndDate(
        this.currentLabTestId,
        this.currentlabInstrumentId,
        this.currentTestId,
        this.testSpecId,
        this.productMasterLotId,
        this.labCumulativeYearMonth,
        false
      ));
    return _labCumulative$;
  }

  getPeerAndMethodMeanStatisticsResults(statsType: number): Observable<StatisticsResult[]> {
    const statsRequest: Array<StatisticsRequest> = [
      {
        statsType: statsType,
        labInstrumentId: this.currentlabInstrumentId,
        analyteId: this.analyteId,
        testSpecId: +this.testSpecId,
        masterLotId: +this.productMasterLotId,
        methodId: this.methodId,
        startYearMonth: this.statsStartYearMonth,
        endYearMonth: this.statsEndYearMonth,
        labUnitId: this.labUnitId
      }
    ];
    return this.dynamicReportingService.getStatisticsPeerAndMethodData(statsRequest);
  }

  getStatisticsLabData(responseDate: SummaryStats): Array<LevelStatistics> {
    let tempStats: Array<LevelStatistics> = [];
    if (responseDate && responseDate.levels) {
      tempStats = responseDate.levels.filter(lv =>
        this.levelsInUse.includes(lv.controlLevel)
      ).map(lml => {
        const lab = lml['lab'];
        const levelStats: LevelStatistics = {
          level: lml.controlLevel,
          sd: lab.cumul.sd,
          mean: lab.cumul.mean,
          cv: lab.cumul.cv
        };
        return levelStats;
      });
      return tempStats;
    }
  }

  createLevelStatisticsData(statsData: SummaryStats | StatisticsResult[]): LevelStatistics[] {
    let levelStatisticsData: LevelStatistics[];
    if (!Array.isArray(statsData)) {
      if (statsData.levels && statsData?.levels.length > 0) {
        levelStatisticsData = this.getStatisticsLabData(statsData);
      }
    } else {
      if (statsData && statsData.length > 0 && statsData[0].levelStatistics
        && statsData[0].levelStatistics.length > 0) {
        levelStatisticsData = statsData[0].levelStatistics;
      }
    }
    return levelStatisticsData;
  }

  getTranslation(translationCode: string): string {
    let translatedContent: string;
    this.translateService.get(translationCode).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  checkControlManufacturer() {
    this.navigationCurrentlySelectedNode$.pipe(filter(currentNode => !!currentNode),
      takeUntil(this.destroy$)).subscribe((currentNode: LabProduct) => {
        this.hasOnlyNonBrControl = currentNode.nodeType === EntityType.LabControl ?
        currentNode?.productInfo?.manufacturerId?.toString() === nonBrManufacturerIdStr : this.checkManufacturerId(currentNode);
      });
  }

  checkManufacturerId(currentNode: LabProduct | TreePill): boolean {
    return currentNode?.children?.every((control: LabProduct) => control?.productInfo?.manufacturerId?.toString() === nonBrManufacturerIdStr);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
