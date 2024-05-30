// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { select } from '@angular-redux/store';
import { Action, CalibratorLot, LabMonthLevel, ReagentLot } from 'br-component-library';
import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { filter, takeUntil, take, distinctUntilChanged } from 'rxjs/operators';
import * as ngrxStore from '@ngrx/store';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';

import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { RawDataPage } from '../../../contracts/models/data-management/raw-data-page.model';
import { RunData } from '../../../contracts/models/data-management/run-data.model';
import { Run, RunsResult } from '../../../contracts/models/data-management/runs-result.model';
import { SummaryStats } from '../../../contracts/models/data-management/summary-stats.model';
import { dataManagement } from '../../../core/config/constants/data-management.const';
import { unsubscribe } from '../../../core/helpers/rxjs-helper';
import { Utility } from '../../../core/helpers/utility';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { DataManagementSpinnerService } from '../../../shared/services/data-management-spinner.service';
import {
  SummaryStatisticsTableService,
} from './analytical-section/summary-statistics-table/summary-statistics-table.service';
import { RunsService } from '../../../shared/services/runs.service';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { unRouting } from '../../../core/config/constants/un-routing-methods.const';
import { UnityNotification } from '../../../core/notification/interfaces/unity-notification';
import { Header } from '../../../contracts/models/data-management/header.model';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../../shared/icons/icons.service';
import * as fromRoot from '../../../state/app.state';
import * as fromDataManagement from '../state/selectors';
import * as sharedStateSelector from '../../../shared/state/selectors';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';
import { DataManagementState } from '../state/reducers/data-management.reducer';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { LabTest, TreePill } from '../../../contracts/models/lab-setup';
import { InProgressMessageTranslationService } from '../../../shared/services/inprogress-message-translation.service';
import { Permissions } from '../../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { SpcRulesComponent } from '../../lab-setup/components/spc-rules/spc-rules.component';
@Component({
  selector: 'unext-analyte-detail-table',
  templateUrl: './analyte-detail-table.component.html',
  styleUrls: ['./analyte-detail-table.component.scss'],
  providers: [DecimalPipe]
})
export class AnalyteDetailTableComponent implements OnInit, OnDestroy {

  @Input() isArchived: boolean;
  @Input() isLeafArchived: boolean;
  @Input() levelName: string;
  public pageTitleEntityName: string;
  public headerData: Header;
  public runDataPageSet: Array<RunData>;
  public runsResult: RunsResult;
  public ljChartRuns: Array<Run>;
  public actions: Array<Action>;
  public levelsInUse: Array<number>;
  public decimalPlaces: Array<number>;
  public monthSummaryByLevel: Array<LabMonthLevel>;
  public labTestId: string;
  public labInstrumentId: string;
  public labProductId: string;
  public labUnitId: number;
  public accountId: string;
  public accountNumber: string;
  public codeListTestId: number;
  public testId: string;
  public controlLotIds: Array<number>;
  dataManagementStateObject: Object;
  public loadDataTable: boolean;
  public initDiffRuns = 0; // index of run to start for lj chart with half screen visibility (25 runs)
  public productMasterLotExpiration: Date;
  public productId: string;
  public productMasterLotId: number;
  public testSpecId: number;
  public labTimeZone: string;
  public labLocationId: string;
  public nextPageFirstRun: RunData;
  public prevPageLastRun: RunData;
  public analyteId: string;
  public analyteName: string;
  public spcRuleComponent: SpcRulesComponent;
  showPanelAncestorName = false;
  selectedNode: TreePill;

  // TODO Move to constant
  public pageNumber = 1;
  public inProgress = true;

  private dataManagementStateSubscription: Subscription;
  private notificationSubscription: Subscription;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.edit[24]
  ];

  // commented out PBI#161587 3/2/2020
  // @HostListener('window:resize', ['$event'])
  @ViewChild('chartContainer')

  // Not used but critical to run the application for unknown reason, should be removed if possible
  el: ElementRef;

  @select(['summaryStatsState', 'summaryStats'])
  summaryStats$: Observable<SummaryStats>;

  public reagentLots: Array<ReagentLot>;
  public calibratorLots: Array<CalibratorLot>;
  public defaultReagentLotId: number;
  public defaultCalibratorLotId: number;
  private destroy$ = new Subject<boolean>();
  analytesArray: Array<LabTest> = [];

  public navigationState$ = this.store.pipe(ngrxStore.select(fromNavigationSelector.getNavigationState));
  public getAccountState$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentAccount));
  progressHeader: any;
  progressMessage: any;
  permissions = Permissions;

  constructor(
    public runsService: RunsService,
    private notification: NotificationService,
    private codeListService: CodelistApiService,
    private summaryStatisticsService: SummaryStatisticsTableService,
    private dataManagementSpinnerService: DataManagementSpinnerService,
    private navigationService: NavigationService,
    private store: ngrxStore.Store<fromRoot.State>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private inProgressMsgService: InProgressMessageTranslationService,
    private appNavigationService: AppNavigationTrackingService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentlySelectedNode))
      .pipe(filter((selectedNode => !!selectedNode && !!selectedNode.children)), takeUntil(this.destroy$))
      .subscribe((selectedNode: TreePill) => {
        this.showPanelAncestorName = selectedNode.nodeType === EntityType.Panel;
      });
    this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentSelectedNode))
      .pipe(filter(selectedNode => !!selectedNode), takeUntil(this.destroy$))
      .subscribe((selectedNode: TreePill) => {
        this.selectedNode = selectedNode;
        if (selectedNode && selectedNode.isUnavailable) {
          this.progressHeader = this.inProgressMsgService.setProgressMessage(selectedNode.unavailableReasonCode).progressHeader;

          this.progressMessage = this.inProgressMsgService.setProgressMessage(selectedNode.unavailableReasonCode).progressMessage;
        } else {
          this.inProgress = false;
        }
      });

    this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        try {
          this.labLocationId = labLocation.id;
          this.labTimeZone = labLocation.locationTimeZone;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.AnalyteDetailTableComponent + blankSpace + Operations.FetchCurrentLocation)));
        }
      });

    this.getAccountState$
      .pipe(filter(account => !!account), take(1))
      .subscribe(accounts => {
        try {
          if (accounts.id) {
            this.accountId = accounts.id;
          }
          if (accounts.accountNumber) {
            this.accountNumber = accounts.accountNumber;
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.AnalyteDetailTableComponent + blankSpace + Operations.FetchAccountState)));
        }
      });

    this.dataManagementStateSubscription = this.store.pipe(ngrxStore.select(fromDataManagement.getDataManagementState))
      .pipe(distinctUntilChanged(
        (newObj: DataManagementState, prevObj: DataManagementState) =>
          newObj.entityId === prevObj.entityId &&
          newObj.entityName === prevObj.entityName &&
          _.isEqual(
            newObj.cumulativeAnalyteInfo,
            prevObj.cumulativeAnalyteInfo
          )
      ), filter(dataManagementState => !Utility.isEmpty(dataManagementState) && !Utility.isEmpty(dataManagementState.headerData)
        && this.isLabTest(+dataManagementState.entityType)))
      .subscribe(dataManagementState => {
        try {
          this.headerData = dataManagementState.headerData;
          const analyteInfo = dataManagementState.cumulativeAnalyteInfo[0];

          this.clearTableData();
          this.pageTitleEntityName = this.headerData.analyteName;
          this.defaultReagentLotId = this.headerData.reagentLotId;
          this.defaultCalibratorLotId = this.headerData.calibratorLotId;

          this.labTestId = dataManagementState.entityId;
          this.labInstrumentId = analyteInfo.instrumentId;
          this.labProductId = analyteInfo.productId;
          this.levelsInUse = analyteInfo.levelsInUse;
          this.decimalPlaces = analyteInfo.decimalPlaces;
          this.controlLotIds = analyteInfo.controlLotIds;
          this.codeListTestId = this.headerData.codeListTestId;
          // AJ 1.11.2022 bug fix 227902
          this.labUnitId = analyteInfo.labUnitId;
          this.testId = analyteInfo.testId;
          this.productMasterLotExpiration = analyteInfo.productMasterLotExpiration;
          this.productId = analyteInfo.productId;
          this.productMasterLotId = +analyteInfo.productMasterLotId;
          this.testSpecId = +analyteInfo.testSpecId;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.AnalyteDetailTableComponent + blankSpace + Operations.FetchDataManagement)));
        }
        this.subscribeToNotification(this.labTestId);
        this.getRunDataPageSet(this.labTestId, this.pageNumber);
      });

    this.retrieveUserActions();
  }

  private getRunDataPageSet(labTestId: string, pageNumber: number): void {
    this.runsService.getRawDataPageByLabTestId(labTestId, pageNumber, null, null, true).then(rawDataPage => {
      this.processRunData(rawDataPage);
    });
  }

  private subscribeToNotification(labTestId: string): void {
    this.notification.subscribeLabTestToHub(labTestId);
    this.notificationSubscription = this.notification.$labTestStream.subscribe(
      (data: UnityNotification) => {
        if (this.labTestId === labTestId) {
          this.getRunDataPageSet(labTestId, this.pageNumber);
        }
      }
    );
  }

  private processRunData(rawData: RawDataPage): void {
    this.runDataPageSet = <Array<RunData>>rawData.runData;
    this.nextPageFirstRun = <RunData>rawData.nextPageFirstRun;
    this.prevPageLastRun = <RunData>rawData.prevPageLastRun;

    if (rawData.runData.length > 0) {
      const yearMonth = Utility.convertDateToYearMonth(
        this.runDataPageSet[0].runDateTime
      );
      this.summaryStatisticsService
        .getSummaryStatsByLabMonthStatsInfoAndDate(
          this.labTestId.toString(),
          this.labInstrumentId,
          this.testId,
          this.testSpecId,
          this.productMasterLotId.toString(),
          yearMonth,
          true
        ).then(summaryStats => {
          if (summaryStats && summaryStats.levels) {
            this.monthSummaryByLevel = summaryStats.levels.filter(lv =>
              this.levelsInUse.includes(lv.controlLevel)
            ).map(lml => {
              // Map lab month level from ({ controlLevel: number, lab: { month: BaseSummary, cumul: BaseSummary} }) to LabMonthLevel.
              // TODO: Fix upstream where object is created so map doesn't have to be added.
              // https://y19kimh4ga.execute-api.us-west-1.amazonaws.com/Prod/LabData/stats/B5E32826EE954D55AC91689F4E2B7753/201907
              // GetStats in StatsEndpoint.cs
              const lab = lml['lab'];
              const labMonthLevel: LabMonthLevel = {
                controlLevel: lml.controlLevel,
                cumul: lab.cumul,
                month: lab.month
              };

              return labMonthLevel;
            });
          }
        });
      this.populateMissingRunProperties(this.runDataPageSet);
      this.updateLJChartRuns(0);
    } else {
      this.ljChartRuns = new Array<Run>();
      this.monthSummaryByLevel = new Array<LabMonthLevel>();
    }

    this.dataManagementSpinnerService.displaySpinner(false);
  }

  private retrieveUserActions(): void {
    this.codeListService.getUserActionsAsync().then(actions => {
      this.actions = new Array<Action>();
      actions.forEach(action => {
        this.actions.push({
          actionId: action.id,
          actionName: action.description
        } as Action);
      });
    });
  }

  public updateLJChartRuns(topRunIndex: number): void {
    this.runsResult = this.runsService.convertRunDataPageSetToRunsResult(
      this.runDataPageSet
    );

    const numberOfRuns = this.runsResult.runs.length;
    const numberOfRunsBelowTopRunIndex = numberOfRuns - topRunIndex;

    if (numberOfRunsBelowTopRunIndex < dataManagement.ljChartMaxRuns) {
      this.initDiffRuns = this.calculateInitDiffRuns(
        numberOfRunsBelowTopRunIndex
      );
      topRunIndex = numberOfRuns - dataManagement.ljChartFullRuns;
    }

    if (topRunIndex < 0) {
      topRunIndex = 0;
      this.initDiffRuns = 0;
    }

    this.ljChartRuns = this.runsResult.runs.slice(
      topRunIndex,
      topRunIndex + dataManagement.ljChartFullRuns
    );
  }

  auditEditdata(){
    //for edit functionality create function
    this.navigationState$.pipe(filter(navigationState => !!navigationState), take(1))
      .subscribe(navigationState => {
        this.analytesArray = cloneDeep(navigationState.selectedNode.children);
        this.analyteId = this.analytesArray[0].id;
        this.analyteName = this.analytesArray[0].displayName;
        this.appNavigationService.analyteId = this.analyteId;
        this.appNavigationService.analyteName = this.analyteName;
      })
  }

  gotoEditAnalyte(): void {

    const url = `/${unRouting.labSetup.lab}/${unRouting.labSetup.analytes}/${this.labTestId}/${unRouting.labSetup.settings}`;
    this.navigationService.navigateToUrl(url, true, this.selectedNode, this.labTestId);
    //to call auditEditdata
    this.auditEditdata();
  }

  private calculateInitDiffRuns(numberOfRunsBelowTopRunIndex: number): number {
    let initDiffRuns = 0;
    initDiffRuns = dataManagement.ljChartMaxRuns - numberOfRunsBelowTopRunIndex;
    initDiffRuns =
      initDiffRuns > dataManagement.ljChartHalfRuns
        ? dataManagement.ljChartHalfRuns
        : initDiffRuns;
    return initDiffRuns;
  }

  public loadNextPage(): void {
    this.pageNumber++;
  }

  public loadPrevPage(): void {
    this.pageNumber--;
  }

  public isRunRestarted(pageNumber: number): void {
    this.getRunDataPageSet(this.labTestId, pageNumber);
  }

  private isLabTest(entityType: EntityType): boolean {
    this.loadDataTable = entityType === EntityType.LabTest;
    return this.loadDataTable;
  }

  private clearTableData(): void {
    this.monthSummaryByLevel = null;
    this.runDataPageSet = null;
  }

  private populateMissingRunProperties(runDataPageSet: Array<RunData>): void {
    runDataPageSet.forEach(runData => {
      runData.localRunDateTime = new Date(runData.localRunDateTime);
      runData.runDateTime = new Date(runData.runDateTime);
      runData.enteredDateTime = new Date(runData.enteredDateTime);

      runData.results.forEach(result => {
        result.measuredDateTime = new Date(result.measuredDateTime);

        result.targetCV = Utility.calculateCV(
          result.targetSD,
          result.targetMean
        );

        result.resultStatus = this.runsService.extractResultStatus(result);
        result.reasons = this.runsService.convertReasons(result);
      });
      runData.runReasons = this.runsService.convertRunReasons(runData);
    });
  }

  ngOnDestroy() {
    unsubscribe(this.dataManagementStateSubscription);
    unsubscribe(this.notificationSubscription);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
