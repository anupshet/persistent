// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select as ngrxSelect, select, Store } from '@ngrx/store';
import * as ngrxSelector from '@ngrx/store';

import { takeUntil, filter, take } from 'rxjs/operators';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable, Subscription, Subject, forkJoin } from 'rxjs';
import { cloneDeep } from 'lodash';

import {
  BrDialogComponent,
  BrReviewSummaryComponent,
  CalibratorLot,
  PezContent,
  ReagentLot,
  DialogResult
} from 'br-component-library';
import { TranslateService } from '@ngx-translate/core';

import { UserAction } from '../../../../contracts/models/codelist-management/user-action.model';
import { LevelValue } from '../../../../contracts/models/data-management/level-value.model';
import { LevelSummary, ReviewSummary } from '../../../../contracts/models/data-management/review-summary.model';
import { RunData } from '../../../../contracts/models/data-management/run-data.model';
import { RunInsertState } from '../../../../contracts/models/data-management/run-insert-state.model';
import { LabDataCollection } from '../../../../contracts/models/data-management/runs-result.model';
import { LevelSection } from '../../../../contracts/models/data-management/runs-table/level-section.model';
import { PezCell } from '../../../../contracts/models/data-management/runs-table/pez-cell.model';
import { RowType, RunRow } from '../../../../contracts/models/data-management/runs-table/run-row.model';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { unsubscribe } from '../../../../core/helpers/rxjs-helper';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { RunEditDataComponent } from '../run-edit-data/run-edit-data.component';
import { RunInsertComponent } from '../run-insert/run-insert.component';
import { RunsService } from '../../../../shared/services/runs.service';
import { GridScrollBase } from './grid-scroll';
import { Utility } from '../../../../core/helpers/utility';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { LicensedProduct, LicensedProductType } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { LabTest } from '../../../../contracts/models/lab-setup/test.model';
import * as selectors from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../../../state/app.state';
import * as fromDataManagement from '../../state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import * as navigationStateSelector from '../../../../shared/navigation/state/selectors';
import { LevelEvaluationMeanSd } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { AwsApiService } from '../../../../shared/api/aws.service';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { addedBy, includeArchivedItems, level7MinWIdth, level8MinWIdth, level9MinWIdth, benchReviewedBy, supervisorReviewedBy } from '../../../../core/config/constants/general.const';
import { DataManagementService } from '../../../../shared/services/data-management.service';
import { ConnectivityTier } from '../../../../contracts/enums/lab-location.enum';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import {
  AppNavigationTracking,
  AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, ReviewSummaryHistory
} from '../../../../shared/models/audit-tracking.model';
import { User } from '../../../../contracts/models/user-management/user.model';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';

@Component({
  selector: 'unext-runs-table',
  templateUrl: './runs-table.component.html',
  styleUrls: ['./runs-table.component.scss'],
  providers: [UnityNextNumericPipe]
})
export class RunsTableComponent extends GridScrollBase
  implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  isRunNewVisible = false;
  selectedRunIndex: number;
  public labDataCollection = LabDataCollection;
  private isAnalyticalSectionVisibleSubscription: Subscription;
  public viewEditDataToolTip: string;
  private historyData: ReviewSummaryHistory = {};

  @Output()
  updateLJChartRuns: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  loadPrevPage: EventEmitter<any> = new EventEmitter();
  @Output()
  loadNextPage: EventEmitter<any> = new EventEmitter();
  @Output()
  isRunRestarted: EventEmitter<number> = new EventEmitter();
  @Input()
  actions = Array<UserAction>();
  @Input()
  runDataPageSet: Array<RunData>;
  @Input()
  levelsInUse: Array<number>;
  @Input()
  decimalPlaces: Array<number>;
  @Input()
  prevPageLastRun: RunData;
  @Input()
  nextPageFirstRun: RunData;
  @Input()
  pageNumber: number;
  @Input()
  labTimeZone: string;
  @Input()
  defaultReagentLotId: number;
  @Input()
  defaultCalibratorLotId: number;
  @Input()
  labTestId: string;
  @Input()
  labInstrumentId: string;
  @Input()
  labProductId: string;
  @Input()
  accountId: string;
  @Input()
  accountNumber: string;
  @Input()
  controlLotIds: Array<number>;
  @Input()
  codeListTestId: number;
  @Input()
  labId: string;
  @Input()
  labUnitId: number;
  @Input()
  testId: string;
  @Input()
  productMasterLotExpiration: Date;
  @Input()
  productId: string;
  @Input()
  productMasterLotId: number;
  @Input()
  isArchived: boolean;
  @Input()
  isLeafArchived: boolean;

  runRows = Array<RunRow>();
  @ViewChild(RunInsertComponent) runInsertChildComponent: RunInsertComponent;
  public isAnalyticalSectionVisible = true;
  public rowType = RowType;
  public dateTimeOffset: string;

  timer: any;
  isPointerOnDialog = false;
  isPezDialogOpen = false;
  @ViewChild('tableContent') tableContent: PerfectScrollbarComponent;
  isAnalyticalSectionVisible$: Observable<boolean>;
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  public getAccountState$ = this.store.pipe(ngrxSelect(sharedStateSelector.getCurrentAccount));
  public getLocationState$ = this.store.pipe(ngrxSelector.select(sharedStateSelector.getCurrentLabLocation));

  private timeZoneSubscription: Subscription;
  private timeZone: string;
  public selectedDateTime: Date;

  public runInsertState: RunInsertState;
  public isRunInsertStateReady: boolean;

  public reagentLots: Array<ReagentLot>;
  public calibratorLots: Array<CalibratorLot>;

  public licensedProducts: LicensedProduct[];
  public licensedProductTypeConnectivity = LicensedProductType.Connectivity;
  public isDataEntryFormsVisible: boolean;

  private destroy$ = new Subject<boolean>();
  isSideNavExpanded: boolean;
  isRunInsertHasVisableLot = false;
  runInsertDifferentDate = false;
  minWidth: string;
  public lastRunReagentLotId: number;
  public lastRunCalibratorLotId: number;

  public hasConnectivity = false;
  public defaultReagentLot: ReagentLot;
  public defaultCalibratorLot: CalibratorLot;
  isRenderingLongCell = false;
  public labTest: LabTest;
  public runInsertFullyVisable = false;
  public controlLevel: number;
  public resultValue: number;
  selectedLang: any = { lcid: 'en-US' };
  currentLanguage: string;
  actionTitle: string;
  commentTitle: string;
  atText: string;
  public auditTrailPayload: AppNavigationTracking = {
    auditTrail: {
      eventType: AuditTrackingEvent.AnalyteDataTable,
      action: AuditTrackingAction.Add,
      actionStatus: AuditTrackingActionStatus.Success,
      priorValue: {},
      currentValue: {}
    }
  };

  constructor(
    public dialog: MatDialog,
    private runsService: RunsService,
    private portalApiService: PortalApiService,
    private messageSnackBar: MessageSnackBarService,
    private dateTimeHelper: DateTimeHelper,
    private codeListService: CodelistApiService,
    private store: Store<fromRoot.State>,
    private awsApiService: AwsApiService,
    private dataManagementService: DataManagementService,
    private errorLoggerService: ErrorLoggerService,
    public appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService,
    private unityNextNumericPipe: UnityNextNumericPipe,
  ) {
    super();
  }

  ngOnInit() {
    this.getCurrentSelectLanguage();
    this.actionTitle = this.getTranslations('PEZDIALOG.ACTIONS');
    this.commentTitle = this.getTranslations('PEZDIALOG.COMMENTS');
    this.atText = this.getTranslations('PEZDIALOG.AT');
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.actionTitle = this.getTranslations('PEZDIALOG.ACTIONS');
      this.commentTitle = this.getTranslations('PEZDIALOG.COMMENTS');
      this.atText = this.getTranslations('PEZDIALOG.AT');
    });
    try {
      this.populateLabels();

      this.isAnalyticalSectionVisible$ = this.store.pipe(ngrxSelect(sharedStateSelector.getAnalyticalSectionState));

      this.isAnalyticalSectionVisibleSubscription = this.isAnalyticalSectionVisible$.subscribe(
        isAnalyticalSectionVisible => {
          this.isAnalyticalSectionVisible = isAnalyticalSectionVisible
            ? true
            : false;
        }
      );
      this.timeZone = this.labTimeZone;
      this.dateTimeOffset = this.dateTimeHelper.getTimeZoneOffset(this.selectedDateTime, this.timeZone);

      try {
        this.getLots(this.codeListTestId, false);
      } catch (error) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
            componentInfo.RunTableComponent + blankSpace + Operations.FetchDataManagement));
      }

      this.getLocationState$
        .pipe(filter(labLocation => !!labLocation), take(1))
        .subscribe(labLocationState => {
          try {
            if (labLocationState.connectivityTier === ConnectivityTier.UNConnect ||
              labLocationState.connectivityTier === ConnectivityTier.UNUpload) {
              this.hasConnectivity = true;
              this.isDataEntryFormsVisible = false;
            }
          } catch (error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
                (componentInfo.RunTableComponent + blankSpace + Operations.FetchCurrentLocation)));
          }
        });

    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunTableComponent + blankSpace + Operations.OnInit));
    }
  }
  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
  ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes.runDataPageSet) {
        const runDataPageSet = <Array<RunData>>(
          changes.runDataPageSet.currentValue
        );
        if (runDataPageSet != null) {
          this.updateTableContent(runDataPageSet);
        }
      }
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunTableComponent + blankSpace + Operations.UpdateTableContent));
    }
  }

  ngAfterViewChecked() {
    if (!this.hasConnectivity && this.runInsertState && this.defaultCalibratorLot && this.defaultReagentLot) {
      this.isDataEntryFormsVisible = true;
      this.setOptionsShowed(false);
      this.runInsertDifferentDate = false;
      this.isRunInsertHasVisableLot = false;
    }
  }

  isSideNavExpanded$ = this.store.pipe(ngrxSelect(selectors.getSideNavState),
    takeUntil(this.destroy$)).subscribe((isSideNavExpanded: boolean) => {
      this.isSideNavExpanded = isSideNavExpanded;
    });


  toggleDataEntryFormVisibility(): void {
    if (!this.isArchived) {
      this.isDataEntryFormsVisible = !this.isDataEntryFormsVisible;
      this.runInsertDifferentDate = false;
      this.isRunInsertHasVisableLot = this.isDataEntryFormsVisible ? this.runInsertState.isLotVisible || false : false;
    }
  }

  private async getLots(codeListTestId: number, doNotshowBusy?: boolean): Promise<void> {
    const test = await this.codeListService.getTestByIdAsync(codeListTestId.toString());

    Promise.all([
      this.codeListService.getReagentLotsByReagentIdAsync(test.reagentId.toString(), doNotshowBusy),
      this.codeListService.getCalibratorLotsByCalibratorIdAsync(test.calibratorId.toString(), doNotshowBusy)
    ]).then(lots => {
      // Get History data from Audit Trail
      this.appNavigationService.getDataTableATHistory(this.labTestId).pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.historyData = data;

        // Fetch user names for history panel
        const usersOktaIds = [];
        const users = [];
        const fetchedUsers = [];
        let historyUser: string;
        Object.entries(this.historyData).forEach(([runId, runHistory]) => {
          runHistory.forEach(history => {
            if (!!history.oktaId && usersOktaIds.indexOf(history.oktaId) === -1) {
              usersOktaIds.push(history.oktaId);
            }
          });
        });

        usersOktaIds.forEach(oktaId => {
          fetchedUsers.push(this.portalApiService.searchLabSetupNode(User, oktaId, false));
        });

        forkJoin(...fetchedUsers)
          .pipe(filter(currentUser => !!currentUser), takeUntil(this.destroy$))
          .subscribe(userState => {
            userState.flat().forEach(userData => {
              historyUser = `${userData.firstName} ${userData.lastName}`;
              users.push({ oktaId: userData.userOktaId, userName: historyUser });
            });
            Object.entries(this.historyData).forEach(([runId, runHistory]) => {
              runHistory.forEach(history => {
                const user = users.filter(userHistory => userHistory['oktaId'] === history.oktaId);
                history.userName = !!user[0].userName ? user[0].userName : '';
                this.getHistoryCount();
              });
            });
          });
      });

      this.reagentLots = lots[0];
      this.reagentLots = this.reagentLots?.sort((a, b) => (a.lotNumber).localeCompare(b.lotNumber));    // Sorted ReagentLots List
      this.calibratorLots = lots[1];
      this.setupRunInsertState(doNotshowBusy);
    });
  }

  getHistoryCount() {
    this.runRows.forEach(row => row.pezCell.interactions = []);
    this.runRows.forEach((run) => {
      if (!!run.runId) {
        if (this.runRows.find(row => row.runId === run.runId)) {
          this.runRows.find(row => row.runId === run.runId).pezCell.interactions = this.getInteractions(run);
        }
      }
    });
  }

  private async setupRunInsertState(doNotshowBusy?: boolean) {
    this.runInsertState = new RunInsertState();
    this.runInsertState.levelValues = new Array<LevelValue>();
    this.levelsInUse.forEach(levelVal => {
      this.runInsertState.levelValues.push({
        level: levelVal,
        value: undefined
      });
    });

    const isArchiveItemsToggleOn = await this.store.pipe(ngrxSelect(selectors.getIsArchiveItemsToggleOn), take(1)).toPromise();
    const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
    this.labTest = await this.portalApiService
      .getLabSetupNode<LabTest>(EntityType.LabTest, this.labTestId,
        LevelLoadRequest.None, EntityType.None, [queryParameter], true).toPromise();
    const labTestTestSpecInfo = this.labTest.testSpecInfo;

    if (this.labTest && labTestTestSpecInfo &&
      labTestTestSpecInfo.reagentLotId !== 0 && labTestTestSpecInfo.calibratorLotId !== 0) {
      this.defaultReagentLotId = labTestTestSpecInfo.reagentLotId;
      this.defaultCalibratorLotId = labTestTestSpecInfo.calibratorLotId;
    }

    this.runInsertState.selectedReagentLot = this.reagentLots.find(
      r => r.id === this.defaultReagentLotId
    );
    this.runInsertState.selectedCalibratorLot = this.calibratorLots.find(
      c => c.id === this.defaultCalibratorLotId
    );
    this.defaultReagentLot = this.reagentLots.find(
      r => r.id === this.defaultReagentLotId
    );

    this.defaultCalibratorLot = this.calibratorLots.find(
      c => c.id === this.defaultCalibratorLotId
    );

    this.isRunInsertStateReady = true;
  }

  public onNewRunPost(insertedRun: RunData): void {
    try {
      if (insertedRun) {
        const insertIndex = this.runDataPageSet.findIndex(
          r =>
            new Date(r.runDateTime).getTime() <=
            new Date(insertedRun.runDateTime).getTime()
        );

        insertedRun = this.fixRunDate(insertedRun);
        this.runDataPageSet.splice(insertIndex, 0, insertedRun);

        this.updateTableContent(this.runDataPageSet);
        this.isRunInsertHasVisableLot = false;
      }
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunTableComponent + blankSpace + Operations.OnNewRunPost));
    }
  }

  public onInsertDifferentDate(): void {
    this.runInsertDifferentDate = true;
  }

  public onSavedSelectedReagentId(id) {
    this.lastRunReagentLotId = id;
  }

  public onSavedSelectedCalibratorId(id) {
    this.lastRunCalibratorLotId = id;
  }

  private fixRunDate(runData: RunData): RunData {
    // Temporaly fix
    runData.localRunDateTime = new Date(runData.localRunDateTime);
    runData.runDateTime = new Date(runData.runDateTime);
    runData.enteredDateTime = new Date(runData.enteredDateTime);
    if (runData.results) {
      runData.results.forEach(result => {
        result.measuredDateTime = new Date(result.measuredDateTime);
      });
    }
    return runData;

  }

  private updateTableContent(runDataPageSet: Array<RunData>): void {
    if (this.levelsInUse) {
      this.convertRunDataPageSetToRunsRow(runDataPageSet);
    }

    this.setOptionsShowed(false);
    this.updateVirtualScrollbar(this.runRows.length);
    this.updateRowIndexes();
    this.updatePageRows(this.runRows);
    this.resetVerticalScrollbarPosition();
  }

  triggerScrollStopEvent(): void {
    if (this._scrollTimeout) {
      window.clearTimeout(this._scrollTimeout);
    }
    this._scrollTimeout = setTimeout(() => {
      this._scrollTimeout = null;
      this.updateLJChartRuns.emit(this.indexes.first);
    }, 250);
  }

  updateFixedScrollAndClosePezModal(event) {
    this.updateFixedScroll(event);
    this.dialog.closeAll();
  }

  isLotVisable(event) {
    this.runInsertFullyVisable = !this.runInsertFullyVisable;
    this.setOptionsShowed(event);
    this.isRunInsertHasVisableLot = event;
  }

  private convertRunDataPageSetToRunsRow(runDataPageSet: Array<RunData>): void {
    this.runRows = new Array<RunRow>();
    this.runRows.push({
      rowType: RowType.InsertComponent,
      dataSource: null,
      runId: null,
      runIndex: null,
      runDateTime: null,
      levelSections: [],
      pezCell: new PezCell(),
      decimalPlaces: [],
      isInsert: false,
      isRestartFloat: false
    });
    let runIndex = 1;
    runDataPageSet.forEach(runData => {
      const runRow: RunRow = {
        rowType: RowType.Run,
        dataSource: runData.dataSource,
        runId: runData.id,
        runIndex: runIndex,
        runDateTime: runData.runDateTime,
        levelSections: [],
        pezCell: new PezCell(),
        decimalPlaces: [],
        isInsert: runData.upsertOptions.isInsertOperation,
        isRestartFloat: runData.isRestartFloat
      };

      const pezCellInfo: PezCell = {
        actions: runData.userActions,
        comments: runData.userComments,
        interactions: runData.userInteractions
      };
      runRow.pezCell = pezCellInfo;
      if (this.levelsInUse && runData.results) {
        if (this.levelsInUse.length === 7) {
          this.minWidth = level7MinWIdth;
        } else if (this.levelsInUse.length === 8) {
          this.minWidth = level8MinWIdth;
        } else if (this.levelsInUse.length === 9) {
          this.minWidth = level9MinWIdth;
        }
        this.levelsInUse.forEach(levelInUse => {
          const result = runData.results.filter(
            lv => lv.controlLevel === levelInUse
          )[0];

          let valueCell = null;
          if (result != null) {
            valueCell = {
              value: result.resultValue,
              isAccepted: result.isAccepted,
              resultStatus: result.resultStatus
            };
            if (valueCell.value > 9999) {
              if (!this.isRenderingLongCell) {
                this.isRenderingLongCell = true;
              }
            }
          }

          // let zScoreCell = new ZScoreCell();
          let zScoreCell = null;
          if (
            result != null &&
            result.zScoreData != null &&
            result.zScoreData.zScore != null
          ) {
            zScoreCell = {
              zScore: result.zScoreData.zScore,
              display: result.zScoreData.display
            };
          }

          const levelSection: LevelSection = {
            levelNumber: result ? result.controlLevel : null,
            valueCell: valueCell,
            zScoreCell: zScoreCell,
            reasons: result ? result.reasons : null
          };

          runRow.levelSections.push(levelSection);
        });
      }

      runIndex++;
      this.runRows.push(runRow);
    });
  }

  openRunEditDialog(runIndex: number): void {
    try {
      if (
        this.isArchived || this.pagedRows[runIndex].dataSource === LabDataCollection.RawDataStaging
      ) {
        return;
      }

      this.selectedRunIndex = runIndex;

      runIndex = this.pagedRows[runIndex].runIndex;
      runIndex--; // Important for RunInsert component row adjustment
      this.awsApiService.getEvaluationMeanSdForRun(this.runDataPageSet[runIndex].id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((levelEvaluationMeanSds: Array<LevelEvaluationMeanSd>) => {
          for (const result of this.runDataPageSet[runIndex].results) {
            const levelEvaluationMeanSd = levelEvaluationMeanSds
              .find(_levelEvaluationMeanSd => _levelEvaluationMeanSd.level === result.controlLevel);
            if (levelEvaluationMeanSd) {
              result.meanEvaluationType = levelEvaluationMeanSd.meanEvaluationType;
              result.targetMean = levelEvaluationMeanSd.mean || result.targetMean;
              result.sdEvaluationType = levelEvaluationMeanSd.sdEvaluationType;
              result.targetSD = levelEvaluationMeanSd.sd || result.targetSD;
              result.sdIsCalculated = levelEvaluationMeanSd.sdIsCalculated;
              result.cvEvaluationType = levelEvaluationMeanSd.cvEvaluationType;
              result.targetCV = levelEvaluationMeanSd.cv || result.targetCV;
              result.cvIsCalculated = levelEvaluationMeanSd.cvIsCalculated;
            } else {
              result.meanEvaluationType = EvaluationType.Floating;
              result.sdEvaluationType = EvaluationType.Floating;
              result.cvEvaluationType = EvaluationType.Floating;
            }
            if (!result.zScoreData.display) {
              result.meanEvaluationType = result.meanEvaluationType || EvaluationType.Floating;
              result.sdEvaluationType = result.sdEvaluationType || EvaluationType.Floating;
              result.cvEvaluationType = result.cvEvaluationType || EvaluationType.Floating;
              result.targetMean = result.targetMean || null;
              result.targetSD = result.targetSD || null;
              result.targetCV = result.targetCV || null;
              result.zScoreData.zScore = result.zScoreData.zScore || null;
            }
          }
          const dialogRef = this.dialog.open(RunEditDataComponent, {
            panelClass: 'cdk-run-edit',
            backdropClass: 'cdk-overlay-run-edit',
            data: {
              runDataPageSet: this.runDataPageSet,
              runIndex: runIndex,
              actions: this.actions,
              labId: this.labId,
              labTimeZone: this.labTimeZone,
              labInstrumentId: this.labInstrumentId,
              labProductId: this.labProductId,
              accountId: this.accountId,
              accountNumber: this.accountNumber,
              nextPageFirstRun: this.nextPageFirstRun,
              prevPageLastRun: this.prevPageLastRun,
              pageNumber: this.pageNumber,
              reagentLots: this.reagentLots,
              calibratorLots: this.calibratorLots
            }
          });

          const onEditSub = dialogRef.componentInstance.onEdit.subscribe(
            editedRunData => {
              editedRunData = this.fixRunDate(editedRunData);
              this.runDataPageSet[runIndex] = editedRunData;
              this.updateTableContent(this.runDataPageSet);
            }
          );

          const onDeleteSub = dialogRef.componentInstance.onDelete.subscribe(() => {
            this.openRunDeleteDialog(runIndex);
          });

          dialogRef.afterClosed().subscribe((isRunRestarted) => {
            if (isRunRestarted) {
              this.isRunRestarted.emit(this.pageNumber);
            }
            this.dataManagementService.updateEntityInfo(this.labTestId, EntityType.LabTest, this.labTest);
            onEditSub.unsubscribe();
            onDeleteSub.unsubscribe();
            this.selectedRunIndex = -1;
          });
        });
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunTableComponent + blankSpace + Operations.OpenRunEditDialog));
    }
  }

  openReviewSummaryDialog(event, runIndex: number): void {
    try {
      const runDateTime = this.pagedRows[runIndex].runDateTime;
      event.stopPropagation();
      runIndex = this.pagedRows[runIndex].runIndex;
      this.runRows[runIndex].decimalPlaces = this.decimalPlaces;
      const dialogRef = this.dialog.open(BrReviewSummaryComponent, {
        panelClass: 'cdk-review-summary',
        backdropClass: 'cdk-overlay-review-summary',
        data: {
          reviewData: this.generateReviewData(this.runRows[runIndex]),
          dateTimeData: { dateDayTime: runDateTime }
        }
      });
      dialogRef.afterClosed().subscribe();
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunTableComponent + blankSpace + Operations.OpenReviewSummaryDialog));
    }
  }

  openRunDeleteDialog(runIndex: number): void {
    try {
      const deleteDialogRef = this.dialog.open(BrDialogComponent, {
        data: {
          title: this.getTranslation('TRANSLATION.TESTRUN'),
          cancelButton: this.getTranslation('TRANSLATION.CANCEL'),
          confirmButton: this.getTranslation('TRANSLATION.CONFIRMDELETE')
        }
      });

      const onButtonClick = deleteDialogRef.componentInstance.buttonClicked.subscribe(
        dialogResult => {
          switch (dialogResult) {
            case DialogResult.OK:
              return this.deleteRun(runIndex);
            case DialogResult.Cancel:
              return deleteDialogRef.close();
            default:
              return DialogResult.None;
          }
        },
        error => { },
        deleteDialogRef.afterClosed().subscribe(() => {
          onButtonClick.unsubscribe();
        })
      );
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunTableComponent + blankSpace + Operations.OpenRunDeleteDialog));
    }
  }

  logAuditTrail(data) {
    const auditNavigationPayload: any = {
      auditTrail: {
        ...this.auditTrailPayload.auditTrail,
        currentValue: {},
        device_id: data.labTestId,
        run_id: data.id,
        priorValue: {},
      },
    };
    const levelData = [];
    let currentSummary = {};
    data.results.forEach(element => {
      const currentValueObj: any = {
        'resultValue': element.resultValue,
        'controlLevel': element.controlLevel,
      };
      levelData.push(currentValueObj);
    });

    currentSummary = {
      'comment': data?.userComments ? data?.userComments[0].content : null,
      'isComment': data?.userComments != null ? true : false,
      'action': data?.userActions ? data?.userActions[0].actionName : null,
      'isAction': data?.userActions != null ? true : false,
      'isReagentLot': this.reagentLots != null ? true : false,
      'reagentLotID': this.reagentLots ? this.reagentLots[0].id : null,
      'reagentLotName': this.reagentLots ? this.reagentLots[0].lotNumber : null,
      'isCalibratorLot': this.calibratorLots != null ? true : false,
      'calibratorLotID': this.calibratorLots ? this.calibratorLots[0].id : null,
      'calibratorLotName': this.calibratorLots ? this.calibratorLots[0].lotNumber : null,
      'levelData': levelData,
    };
    Object.assign(auditNavigationPayload.auditTrail, { currentValue: currentSummary });
    this.appNavigationService.logAuditTracking(auditNavigationPayload, true);
  }

  deleteRun(runIndex: number): void {
    this.runDataPageSet[runIndex] = Object.assign(this.runDataPageSet[runIndex], {

      labInstrumentId: this.labInstrumentId,
      labProductId: this.labProductId,
      accountId: this.accountId,
      accountNumber: this.accountNumber,
      labId: this.labId
    });
    this.runsService
      .deleteRunData(this.runDataPageSet[runIndex])
      .then((data) => {
        if (!!data) {
          this.auditTrailPayload.auditTrail.action = AuditTrackingAction.Delete;
          this.logAuditTrail(this.runDataPageSet[runIndex]);
        }
        this.runDataPageSet.splice(runIndex, 1);
        this.dialog.closeAll();
        this.updateTableContent(this.runDataPageSet);
        this.updateLJChartRuns.emit(this.indexes.first);

        // Might use message snackbar later
        // this.messageSnackBar.showMessageSnackBar(
        // this.getTranslation('TRANSLATION.RESULTBEENDELETED');
        // );
      }, (error) => {
        this.auditTrailPayload.auditTrail.action = AuditTrackingAction.Delete;
        this.auditTrailPayload.auditTrail.actionStatus = AuditTrackingActionStatus.Failure;
        this.logAuditTrail(this.runDataPageSet[runIndex]);
        this.dialog.closeAll();
      }
      )
      .catch(() => {
        this.messageSnackBar.showMessageSnackBar(this.getTranslation('TRANSLATION.RESULTNOTDELETED'));
      });
  }

  getRows(): Array<RunRow> {
    return this.runRows;
  }

  updateTableScrollBar() {
    if (this.tableContent) {
      this.tableContent.directiveRef.update();
    }
  }

  showRunNew(): void {
    this.isRunNewVisible = !this.isRunNewVisible;
    this.updateTableScrollBar();
  }

  updatePrevPage() {
    this.loadPrevPage.emit(this.pageNumber);
  }

  updateNextPage() {
    this.loadNextPage.emit(this.pageNumber);
  }

  private generateReviewData(runRow: RunRow): ReviewSummary {
    const reviewData: ReviewSummary = {
      levelSummaries: new Array<LevelSummary>(),
      actions: new Array<PezContent>(),
      comments: new Array<PezContent>(),
      interactions: new Array<PezContent>()
    };

    reviewData.actions = this.extractActions(runRow);
    reviewData.comments = this.extractComments(runRow);
    reviewData.interactions = this.getInteractions(runRow);
    return reviewData;
  }

  private getInteractions(runRow: RunRow): Array<PezContent> {
    const addedDataLabel = this.dataManagementService.staticTranslate('HISTORYMESSAGES.ADDED');
    const reviewedDataLabel = this.dataManagementService.staticTranslate("DATAREVIEW.BENCHREVIEWEDBY");
    const supevisorReviewedDataLabel = this.dataManagementService.staticTranslate("DATAREVIEW.SUPERVISORREVIEWEDBY");
  
    const runData = this.runDataPageSet.find(runData => runData.id === runRow.runId);
    const runHistory = this.getRunHistory(runRow);
    const levelData = cloneDeep(runHistory[runRow.runId]);
    levelData?.forEach((val) => {
      val.auditTrail.currentValue.levelData?.forEach((result) => {
        result.resultValue = this.unityNextNumericPipe.transform(result.resultValue);
      });
    });
    let interactions =
      this.dataManagementService.extractInteractions(levelData, this.labTimeZone);

    if (runData && runData.userInteractions && runData.userInteractions.length) {
      const hasAddedDataItem = interactions.some(runInteraction => runInteraction.text.indexOf(addedDataLabel) >= 0);
      interactions = interactions.concat(runData.userInteractions
      .filter(userInteraction => userInteraction  && ((String(userInteraction.interactionType) === addedBy && !hasAddedDataItem)
        || String(userInteraction.interactionType) === benchReviewedBy || String(userInteraction.interactionType) === supervisorReviewedBy))
      .map(userInteraction => {
        const interaction = new PezContent();
        let interactionText: string;

        interaction.dateTime = userInteraction.enterDateTime;
        interaction.pezDateTimeOffset = this.dateTimeOffset;

        switch (String(userInteraction.interactionType)) {
          case addedBy:
            interactionText = addedDataLabel;
            break;
          case benchReviewedBy:
            interactionText = reviewedDataLabel;
            break;
          case supervisorReviewedBy:
            interactionText = supevisorReviewedDataLabel;
            break;
        }

        interaction.text = interactionText;
        interaction.userName = userInteraction.userFullName;
        return interaction;
      }))
      .sort((runInteraction1, runInteraction2) =>
        new Date(runInteraction2.dateTime).getTime() - new Date(runInteraction1.dateTime).getTime()
      );
    }

    return interactions;
  }

  private extractActions(runRow: RunRow): Array<PezContent> {
    const actions: Array<PezContent> = new Array<PezContent>();

    if (runRow.pezCell.actions != null) {
      runRow.pezCell.actions.forEach(runAction => {
        const timeZoneOffset = this.dateTimeHelper.getTimeZoneOffset(runAction.enterDateTime, this.labTimeZone);

        const action: PezContent = {
          userName: runAction.userFullName,
          dateTime: runAction.enterDateTime,
          text: runAction.actionName,
          pezDateTimeOffset: timeZoneOffset,
          labelHeader: this.getTranslation('REVIEWSUMMARY.ACTIONS'),
          labelAt: this.getTranslation('REVIEWSUMMARY.AT')
        };
        actions.push(action);
      });
    }

    return actions;
  }

  private extractComments(runRow: RunRow): Array<PezContent> {
    const comments: Array<PezContent> = new Array<PezContent>();

    if (runRow.pezCell.comments != null) {
      runRow.pezCell.comments.forEach(runComment => {
        const timeZoneOffset = this.dateTimeHelper.getTimeZoneOffset(runComment.enterDateTime, this.labTimeZone);

        const comment: PezContent = {
          userName: runComment.userFullName,
          dateTime: runComment.enterDateTime,
          text: runComment.content,
          pezDateTimeOffset: timeZoneOffset,
          labelHeader: this.getTranslation('REVIEWSUMMARY.COMMENTS'),
          labelAt: this.getTranslation('REVIEWSUMMARY.AT')
        };
        comments.push(comment);
      });
    }

    return comments;
  }

  getRunHistory(runRow: RunRow) {
    return Object.keys(this.historyData)
      .filter(key => key.includes(runRow.runId))
      .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: this.historyData[key]
        });
      }, {});
  }

  populateLabels() {
    this.viewEditDataToolTip = this.isArchived ? '' : this.getTranslation('TRANSLATION.EDITDATA');
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(async lang => {
      this.viewEditDataToolTip = this.isArchived ? '' : this.getTranslation('TRANSLATION.EDITDATA');
    });
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  getCurrentSelectLanguage() {
    this.navigationGetLocale$.pipe(take(1))
      .subscribe(
        (lang) => {
          this.selectedLang = lang;
          this.currentLanguage = this.selectedLang.language;
        }
      );
  }

  ngOnDestroy() {
    unsubscribe(this.isAnalyticalSectionVisibleSubscription);
    unsubscribe(this.timeZoneSubscription);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

