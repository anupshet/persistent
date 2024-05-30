// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil, take } from 'rxjs/operators';
import * as ngrxStore from '@ngrx/store';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';

import { AnalyteEntry, AnalyteEntryType, BrDialogComponent, DialogResult, LabMonthLevel } from 'br-component-library';

import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { BaseRawDataModel } from '../../../contracts/models/data-management/base-raw-data.model';
import { InstrumentSection, AnalyteSection } from '../../../contracts/models/data-management/page-section/instrument-section.model';
import { SummaryDataModel } from '../../../contracts/models/data-management/summary-data.model';
import { dataManagement } from '../../../core/config/constants/data-management.const';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { unsubscribe } from '../../../core/helpers/rxjs-helper';
import { Utility } from '../../../core/helpers/utility';
import { UnityNotification } from '../../../core/notification/interfaces/unity-notification';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { LabDataApiService } from '../../../shared/api/labDataApi.service';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';
import { DataEntryEditComponent } from '../analyte-data-entry/data-entry-edit/data-entry-edit.component';
import {
  SummaryStatisticsTableService,
} from '../analyte-detail-table/analytical-section/summary-statistics-table/summary-statistics-table.service';
import { RunsService } from '../../../shared/services/runs.service';
import { DataManagementSpinnerService } from '../../../shared/services/data-management-spinner.service';
import { PageSectionBase } from '../../../shared/page-section/page-section-base';
import { PageSectionService } from '../../../shared/page-section/page-section.service';
import { LabDataCollection } from '../../../contracts/models/data-management/runs-result.model';
import { LicensedProduct, LicensedProductType } from '../../../contracts/models/portal-api/labsetup-data.model';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { unRouting } from '../../../core/config/constants/un-routing-methods.const';
import { defaultLabId } from '../../../core/config/constants/general.const';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../../shared/icons/icons.service';
import * as fromRoot from '../../../state/app.state';
import * as fromDataManagement from '../state/selectors';
import * as sharedStateSelector from '../../../shared/state/selectors';
import * as navigationStateSelector from '../../../shared/navigation/state/selectors';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';
import { Header } from '../../../contracts/models/data-management/header.model';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';
import { InProgressMessageTranslationService } from '../../../shared/services/inprogress-message-translation.service';
import { NewRequestConfigType } from '../../../contracts/enums/lab-setup/new-request-config-type.enum';
import { RequestNewConfigComponent } from '../../../shared/components/request-new-config/request-new-config.component';
import { TemplateType } from '../../../contracts/enums/lab-setup/template-type.enum';
import { ConnectivityTier } from '../../../contracts/enums/lab-location.enum';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import {
  AnalyteLevelData, AppNavigationTracking, AuditTrackingAction,
  AuditTrackingActionStatus, AuditTrackingEvent, ReviewSummaryContent, ReviewSummaryHistory
} from '../../../shared/models/audit-tracking.model';
import { DataManagementService } from '../../../shared/services/data-management.service';
import { User } from '../../../contracts/models/user-management/user.model';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { UnityNextNumericPipe } from '../../../shared/date-time/pipes/unity-numeric.pipe';
import { SpinnerService } from '../../../shared/services/spinner.service';
@Component({
  selector: 'unext-single-page-section',
  templateUrl: './single-page-section.component.html',
  styleUrls: ['./single-page-section.component.scss'],
  providers: [UnityNextNumericPipe]
})
export class SinglePageSectionComponent extends PageSectionBase implements OnInit, OnDestroy, AfterViewInit {
  [x: string]: any;
  @Input() instrumentSection: InstrumentSection;
  @Input() entityType: EntityType;
  @Input() isSummary: boolean;
  @Input() isArchived: boolean;
  @Input() isLeafArchived: boolean;
  @Input() analyteNode: TreePill;
  @Input() levelName: string;

  isAnalyticalSectionVisible$: Observable<boolean>;

  public singleSummaryAnalyteSection: AnalyteSection;
  public labDataCollection = LabDataCollection;
  public labIdSubscription: Subscription;
  public analyticalSectionSubscription: Subscription;
  public locationTimeZone: string;
  public analyteEntryType: AnalyteEntryType;
  private numberOfRuns = dataManagement.numberOfRuns;
  public monthSummaryByLevel: Array<LabMonthLevel>;
  public decimalPlaces: Array<number>;
  public isAnalyticalSectionVisible = true;
  public initialSelectedDate: Date;
  private latestAnalyteDateTime: Date = dataManagement.earliestDate;
  private labTestId: string;
  public testId: string;
  private labInstrumentId: string;
  private labProductId: string;
  private testSpecId: number;
  private productMasterLotId: string;
  public isProductMasterLotExpired = false;
  private productMasterLotExpiration: Date;
  public licensedProducts: LicensedProduct[] = [];
  public licensedProductTypeConnectivity = LicensedProductType.Connectivity;
  public isDataEntryFormsVisible: boolean;
  public analyteEntryYears = [];
  public headerData: Header;
  public analyteDataTableValues: AnalyteEntry[];
  private dataManagementStateSubscription: Subscription;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.edit[24]
  ];
  showPanelAncestorName = false;
  selectedNode: TreePill;
  historyData: ReviewSummaryContent = {};
  analyteEntry: AnalyteEntry;
  public translationLabels = this.getTranslationLabels();

  public getAccountState$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentAccount));
  public getLocationState$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation));
  public inProgress = true;
  progressHeader: string;
  progressMessage: string;
  public hasConnectivity = false;
  permissions = Permissions;
  auditTrailDetails: AppNavigationTracking;
  constructor(
    public dialog: MatDialog,
    pageSectionService: PageSectionService,
    @Inject(CodelistApiService) codeListService: CodelistApiService,
    @Inject(DataManagementSpinnerService) dataManagementSpinnerService: DataManagementSpinnerService,
    @Inject(LabDataApiService) labDataService: LabDataApiService,
    @Inject(MessageSnackBarService) messageSnackBar: MessageSnackBarService,
    @Inject(RunsService) runsService: RunsService,
    @Inject(NotificationService) notification: NotificationService,
    @Inject(DateTimeHelper) dateTimeHelper: DateTimeHelper,
    @Inject(ChangeTrackerService) changeTrackerService: ChangeTrackerService,
    @Inject(AppLoggerService) appLoggerService: AppLoggerService,
    @Inject(ngrxStore.Store) store: ngrxStore.Store<fromRoot.State>,
    @Inject(AppNavigationTrackingService) _appNavigationService: AppNavigationTrackingService,
    elem: ElementRef,
    renderer: Renderer2,
    private summaryStatisticsService: SummaryStatisticsTableService,
    private navigationService: NavigationService,
    private iconService: IconService,
    private cd: ChangeDetectorRef,
    private errorLoggerService: ErrorLoggerService,
    private inProgressMsgService: InProgressMessageTranslationService,
    private portalApiService: PortalApiService,
    private brPermissionsService: BrPermissionsService,
    public newConfigDialog: MatDialog,
    public appNavigationService: AppNavigationTrackingService,
    public dataManagementService: DataManagementService,
    private translate: TranslateService,
    private unityNextNumericPipe: UnityNextNumericPipe,
    private spinnerService: SpinnerService,

  ) {
    super(
      pageSectionService,
      codeListService,
      dataManagementSpinnerService,
      labDataService,
      messageSnackBar,
      runsService,
      notification,
      dateTimeHelper,
      changeTrackerService,
      appLoggerService,
      translate,
      elem,
      renderer,
      store,
      dialog,
      _appNavigationService,
    );
    this.iconService.addIcons(this.iconsUsed);
  }
  navigationGetLocale$ = this.store.pipe(ngrxStore.select(navigationStateSelector.getLocale));
  private screenLoadedDateTime: Date;
  public newRequestConfigType = NewRequestConfigType;
  public destroy$ = new Subject<boolean>();

  async ngOnInit() {
    super.ngOnInit();
    this.startSpinner();
    this.getCurrentSelectLanguage();
    this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentlySelectedNode))
      .pipe(filter((selectedNode => !!selectedNode && !!selectedNode.children)), takeUntil(this.destroy$))
      .subscribe((selectedNode: TreePill) => {
        this.showPanelAncestorName = selectedNode.nodeType === EntityType.Panel;
      });

    const analyteInfo = this.instrumentSection.productSections && this.instrumentSection.productSections[0].analyteSections
      && this.instrumentSection.productSections[0].analyteSections[0].analyteInfo;

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

    this.labTestId = analyteInfo && analyteInfo.labTestId;
    this.productMasterLotExpiration = analyteInfo && analyteInfo.productMasterLotExpiration;

    this.testId = analyteInfo.testId;

    this.isTabOrderRunEntry = true;

    this.isAnalyticalSectionVisible$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getAnalyticalSectionState));

    this.analyticalSectionSubscription = this.isAnalyticalSectionVisible$.subscribe(isAnalyticalSectionVisible => {
      try {
        this.isAnalyticalSectionVisible = isAnalyticalSectionVisible ? true : false;
      } catch (err) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.SinglePageSectionComponent + blankSpace + Operations.FetchAnalyticalSection)));
      }
    });

    // SR 031202020: TASK 163054 LabId is set to default hardcode value in GUID format to align with the backend requirement
    this.labId = defaultLabId;
    this.navigationGetLocale$.pipe(takeUntil(this.destroy$))
    .subscribe(() => this.getHistoryData());
    this.getAccountState$
      .pipe(filter(account => !!account), take(1))
      .subscribe(account => {
        try {
          this.accountId = account.id;
          this.accountNumber = account.accountNumber;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.SinglePageSectionComponent + blankSpace + Operations.FetchAccount)));
        }
      });

    this.getLocationState$
      .pipe(filter(labLocation => !!labLocation), take(1))
      .subscribe(labLocationState => {

        this.locationTimeZone = labLocationState.locationTimeZone;
        try {
          if (labLocationState.connectivityTier === ConnectivityTier.UNConnect ||
            labLocationState.connectivityTier === ConnectivityTier.UNUpload) {
            this.hasConnectivity = true;
            this.isDataEntryFormsVisible = false;
          }
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.SinglePageSectionComponent + blankSpace + Operations.FetchCurrentLocation)));
        }
      });

    this.dateTimeOffset = this.dateTimeHelper.getTimeZoneOffset(this.selectedDateTime, this.timeZone);
    this.selectedDateTime = new Date();
    this.screenLoadedDateTime = new Date();

    this.availableDateFrom = new Date();
    this.availableDateFrom.setMonth(this.availableDateFrom.getMonth() - 120);

    // Collects entity information such as entity name and entity lot,
    this.extractEntityData(this.instrumentSection, this.entityType);

    this.analyteEntrySets = await this.pageSectionService.createAnalyteEntrySets(
      this.sortedAnalyteSections,
      this.cumulativeLevelsInUse,
      false,
      this.selectedDateTime,
      this.timeZone
    );

    this.analyteForm = this.createForm(
      this.sortedAnalyteSections,
      this.analyteEntrySets
    );

    // Update the Change Tracker
    this.updateChangeTracker();

    const summaryLabTestIds = this.sortedAnalyteSections
      .filter(as => as.analyteInfo.isSummary)
      .map(as => as.analyteInfo.labTestId);

    const runDataLabTestIds = this.sortedAnalyteSections
      .filter(as => !as.analyteInfo.isSummary)
      .map(as => as.analyteInfo.labTestId);

    const summaryIdsExist = summaryLabTestIds.length > 0;
    const runDataIdsExist = runDataLabTestIds.length > 0;
    const singleLabTestId = summaryLabTestIds[0];
    if (summaryIdsExist) {
      this.setSingleSummaryAnalyteSection(singleLabTestId);
      this.loadSingleSummaryDataAndStats(singleLabTestId);
      this.subscribeToNotificationSingleSummary(this.labTestId);
      this.stopSpinner();
    }

    if (runDataIdsExist) {
      this.labDataService
        .getRunDataByLabTestIdsAsync(runDataLabTestIds)
        .then(runData => {
          this.latestAnalyteDateTime = this.pageSectionService.getLatestAnalyteDateTime(
            this.latestAnalyteDateTime,
            runData
          );

          this.analyteViewSets = this.analyteViewSets.concat(
            this.pageSectionService.createMultipleAnalyteViewSets(
              this.sortedAnalyteSections,
              runData,
              this.cumulativeLevelsInUse,
              this.timeZone,
              false
            )
          );
          this.getHistoryData();
          this.stopSpinner();
        });
    }

    if (!summaryIdsExist && !runDataIdsExist) {
      // Spinner starts at DataManagement component
      this.stopSpinner();
    }

    this.columnsToDisplay = this.columnsToDisplay.concat(
      this.cumulativeLevelsInUse.map(lv => lv.toString())
    );

    this.analyteEntryType =
      this.sortedAnalyteSections.length > 1
        ? AnalyteEntryType.Multi
        : AnalyteEntryType.Single;

    this.decimalPlaces = analyteInfo.decimalPlaces;
    this.labTestId = analyteInfo.labTestId;
    this.labInstrumentId = analyteInfo.instrumentId;
    this.labProductId = analyteInfo.productId;
    this.testSpecId = +analyteInfo.testSpecId;
    this.productMasterLotId = analyteInfo.productMasterLotId;

    this.decimalPlaces = this.sortedAnalyteSections[0].analyteInfo.decimalPlaces;

    this.store.pipe(ngrxStore.select(fromDataManagement.getDataManagementState))
      .pipe(filter(dataManagementState => !Utility.isEmpty(dataManagementState) && !Utility.isEmpty(dataManagementState.headerData)),
        takeUntil(this.destroy$))
      .subscribe(dataManagementState => {
        try {
          this.headerData = dataManagementState.headerData;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.SinglePageSectionComponent + blankSpace + Operations.GetDataManagementHeaderData)));
        }
      });

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.translationLabels = this.getTranslationLabels();
    });
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewChecked() {
    if (!this.hasConnectivity) {
      this.isDataEntryFormsVisible = true;
    }
  }

  getHistoryData() {
    this.spinnerService.displaySpinner(true);
    this.appNavigationService.getDataTableATHistory(this.labTestId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      // Fetch user names for history panel
      const historyVal: ReviewSummaryHistory = data;
      const usersOktaIds = [];
      const users = [];
      const fetchedUsers = [];
      let historyUser: string;
      Object.entries(data).forEach(([runId, runHistory]) => {
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
          Object.entries(historyVal).forEach(([key, runHistory]) => {
            runHistory.forEach(history => {
              const user = users.filter(userHistory => userHistory['oktaId'] === history.oktaId);
              history.userName = !!user[0].userName ? user[0].userName : '';
              const historyData = cloneDeep(historyVal[key]);
              const levelData = cloneDeep(historyData);
              levelData.forEach((val) => {
                val.auditTrail.currentValue.levelData.forEach((result) => {
                  result.mean = this.unityNextNumericPipe.transform(result.mean);
                  result.sd = this.unityNextNumericPipe.transform(result.sd);
                });
              });
              const temp = this.dataManagementService.extractInteractions(levelData, this.timeZone);
              this.historyData[key] = temp;
              if (this.analyteViewSets.find(item => item.id === key)) {
                this.analyteViewSets.find(item => item.id === key).userInteractions = temp;
              }
            });
          });
        });
        this.spinnerService.displaySpinner(false);
    }, (error) => {
      this.spinnerService.displaySpinner(false);
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.SinglePageSectionComponent + blankSpace + Operations.FetchCurrentLocation)));
    });
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
  toggleDataEntryFormVisibility(): void {
    this.isDataEntryFormsVisible = !this.isDataEntryFormsVisible;
  }

  gotoEditAnalyte(): void {
    const url = `/${unRouting.labSetup.lab}/${unRouting.labSetup.analytes}/${this.labTestId}/${unRouting.labSetup.settings}`;
    this.navigationService.navigateToUrl(url, true, this.selectedNode, this.labTestId);
  }

  extractEntityData(
    instrumentSection: InstrumentSection,
    entityType: EntityType
  ): void {
    try {
      this.sortedProductSections = this.pageSectionService.extractSortedProductSections(
        instrumentSection
      );
      this.sortedAnalyteSections = this.pageSectionService.extractAnalyteSections(instrumentSection);

      switch (+entityType) {
        case EntityType.LabInstrument:
          this.pageTitleEntityName = instrumentSection.instrument.instrumentInfo.name;
          break;
        case EntityType.LabProduct:
          this.pageTitleEntityName =
            instrumentSection.productSections[0].product.productInfo.name;
          this.pageTitleProductLot =
            instrumentSection.productSections[0].product.lotInfo.lotNumber;
          break;
        case EntityType.LabTest:
          this.pageTitleEntityName =
            instrumentSection.productSections[0].analyteSections[0].analyteInfo.testName;
          break;
        default:
          this.pageTitleEntityName = '';
          break;
      }

      // Collects all the levels used in page
      this.cumulativeLevelsInUse = this.pageSectionService.extractCumulativeLevelsInUse(
        this.sortedAnalyteSections
      );
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SinglePageSectionComponent + blankSpace + Operations.EntityDataExtraction)));
    }
  }

  getSummaryStatistics(summaryLabTestId: string): void {
    try {
      // get latest date from current datatable data first: fixes bug 179777
      const latestDataTableEntryDateTime = this.pageSectionService
        .getLatestAnalyteDateTime(dataManagement.earliestDate, this.baseRawDataSet);
      const yearMonth = Utility.convertDateToYearMonth(latestDataTableEntryDateTime);
      this.summaryStatisticsService.getSummaryStatsByLabMonthStatsInfoAndDate(
        summaryLabTestId,
        this.labInstrumentId,
        this.testId,
        this.testSpecId,
        this.productMasterLotId,
        yearMonth,
        true)
        .then(summaryStats => {
          if (summaryStats && summaryStats.levels) {
            this.monthSummaryByLevel = summaryStats.levels.filter(lv =>
              this.cumulativeLevelsInUse.includes(lv.controlLevel))
              .map(lml => {
                // Map lab month level from ({ controlLevel: number, lab: { month: BaseSummary, cumul: BaseSummary} }) to LabMonthLevel.
                // TODO: Fix upstream where object is created so map doesn't have to be added.
                // https://y19kimh4ga.execute-api.us-west-1.amazonaws.com/Prod/LabData/stats/B5E32826EE954D55AC91689F4E2B7753/201907
                // GetStats in StatsEndpoint.cs
                const lab = lml['lab'];
                const labMonthLevel: LabMonthLevel = {
                  controlLevel: lml.controlLevel,
                  cumul: lab?.cumul,
                  month: lab?.month
                };

                return labMonthLevel;
              });
          } else {
            this.monthSummaryByLevel = null;
          }
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SinglePageSectionComponent + blankSpace + Operations.GetSummaryStatistics)));
    }
  }

  public openDataEditDialog(dataIndex: number): void {
    try {
      this.startSpinner();
      let dialogReference = null;

      const currentAnalyteView = this.analyteViewSets[dataIndex];
      const currentBaseRawDataModel = this.baseRawDataSet.find
        (x => x.labTestId === currentAnalyteView.labTestId && x.id === currentAnalyteView.id);

      const currentAnalyteEntry = this.pageSectionService.createSingleAnalyteEntry(
        currentAnalyteView.id,
        this.singleSummaryAnalyteSection,
        this.cumulativeLevelsInUse,
        this.baseRawDataSet[dataIndex].localSummaryDateTime,
        this.timeZone,
        true,
        dataIndex + 1,
        this.sortedAnalyteSections.length,
        currentBaseRawDataModel,
        false,
        true
      );

      Promise.all([
        this.codeListService.getReagentLotsByReagentIdAsync(currentAnalyteEntry.changeLotData.defaultReagentLot.reagentId.toString(), true),
        this.codeListService.getCalibratorLotsByCalibratorIdAsync(
          currentAnalyteEntry.changeLotData.defaultCalibratorLot.calibratorId.toString(), true),
      ]).then(lots => {
        currentAnalyteEntry.changeLotData.reagentLots = lots[0];
        currentAnalyteEntry.changeLotData.calibratorLots = lots[1];
        dialogReference = this.dialog.open(DataEntryEditComponent, {
          panelClass: 'cdk-run-edit',
          backdropClass: 'cdk-overlay-run-edit',
          data: currentAnalyteEntry
        });

        dialogReference.componentInstance.cancelDataEntryEditEvent.pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.closePopUp();
        });

        dialogReference.componentInstance.requestNewConfig.pipe(takeUntil(this.destroy$)).subscribe((type: NewRequestConfigType) => {
          this.requestNewConfiguration(type);
        });

        dialogReference.componentInstance.submitDataEntryEditEvent.pipe(takeUntil(this.destroy$)).subscribe(async (data: AnalyteEntry) => {
          // tslint:disable-next-line: max-line-length
          // SR 09182020: Ensure time zone is re-adjusted based on dateTimeOffset and correct editing order for multiple analyte data entries in the same month
          data.analyteDateTime = new Date(data.analyteDateTime.setHours(23, 59, 59, 999));
          const tempDateTime = this.dateTimeHelper.formatDateTime(data.analyteDateTime, this.timeZone);
          const timeZoneAdjustedDateTime = new Date(tempDateTime);

          await this.pageSectionService.createSummaryDataModelAsync(
            data,
            this.singleSummaryAnalyteSection,
            this.labId,
            this.accountId,
            this.accountNumber,
            timeZoneAdjustedDateTime,
            this.getEnteredDateTime(data.id),
            this.timeZone, false).then((summaryDataModel) => {
              this.convertResults(summaryDataModel);
              this.labDataService.putDataJson(summaryDataModel).pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.updateBaseRawDataModelSet(summaryDataModel);
                // TODO: TRUPTI - Check if correct
                const levelDataSet = cloneDeep(this.pageSectionService.priorAnalyteData[0].levelDataSet);
                const levelData = [];
                levelDataSet.map((value) => {
                  levelData.push({
                    'level': value.level,
                    'mean': value.data.mean,
                    'numPoints': value.data.numPoints,
                    'sd': value.data.sd,
                  });
                });
                const priorlevelDataList = { 'levelData': levelData };
                this.logAuditTrail(summaryDataModel, priorlevelDataList, AuditTrackingAction.Update, AuditTrackingActionStatus.Success);
                this.closePopUp();
                this.stopSpinner();
              }, error => {
                const priorSummaryAnalyte = cloneDeep(this.pageSectionService.priorAnalyteData);
                const levelData = [];
                priorSummaryAnalyte.map((value) => {
                  levelData.push({
                    'level': value.level,
                    'mean': value.data.mean,
                    'numPoints': value.data.numPoints,
                    'sd': value.data.sd,
                  });
                });
                const levelDataList = { 'levelData': levelData };
                this.logAuditTrail(summaryDataModel, levelDataList, AuditTrackingAction.Update, AuditTrackingActionStatus.Failure);
                this.closePopUp();
                this.stopSpinner();
              }
              );
            });
        });

        const onDeleteSub = dialogReference.componentInstance.onDelete.subscribe((data) => {
          try {
            this.openDeleteDialog(data);
          } catch (err) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
                (componentInfo.SinglePageSectionComponent + blankSpace + Operations.GetData)));
          }
        });

        dialogReference.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(() => {
          onDeleteSub.unsubscribe();
        });
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SinglePageSectionComponent + blankSpace + Operations.GetDataDialogEditIndex)));
    }
  }

  getEnteredDateTime(id: string): Date {
    if (this.baseRawDataSet && id) {
      const singleSummaryById = this.baseRawDataSet.find(x => x.id === id) as SummaryDataModel;
      if (singleSummaryById) {
        return singleSummaryById.enteredDateTime;
      }
    }
  }

  openDeleteDialog(data): void {
    const deleteDialogRef = this.dialog.open(BrDialogComponent, {
      data: {
        title: this.getTranslations('SINGLEPAGESECTION.TESTRUN'),
        cancelButton: this.getTranslations('SINGLEPAGESECTION.CANCEL'),
        confirmButton: this.getTranslations('SINGLEPAGESECTION.CONFIRMDELETE'),
      }
    });

    const onButtonClick = deleteDialogRef.componentInstance.buttonClicked.subscribe((dialogResult) => {
      switch (dialogResult) {
        case DialogResult.OK:
          this.deleteData(data);
          break;
        case DialogResult.Cancel:
          return deleteDialogRef.close();
        default:
          return DialogResult.None;
      }
    },
      error => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.toString(), null,
            (componentInfo.SinglePageSectionComponent + blankSpace + Operations.GetDataDialogEditIndex)));
      },
      deleteDialogRef.afterClosed().subscribe(() => {
        onButtonClick.unsubscribe();
      }));
  }

  deleteData(data): void {
    const deleteItemIndex = this.analyteViewSets.findIndex(x => x.id === data.id);
    let summaryDataModel = this.baseRawDataSet.find(x => x.id === data.id);
    summaryDataModel = Object.assign(summaryDataModel, {
      labInstrumentId: this.labInstrumentId,
      labProductId: this.labProductId,
      accountId: this.accountId,
      accountNumber: this.accountNumber,
      labId: this.labId
    });
    this.labDataService.deleteData(summaryDataModel.id, summaryDataModel).subscribe(() => {
      this.updateBaseRawDataModelSet(summaryDataModel);
      this.logAuditTrail(summaryDataModel, {}, AuditTrackingAction.Delete, AuditTrackingActionStatus.Success);
      this.closePopUp();
      this.analyteViewSets.splice(deleteItemIndex, 1);
      this.stopSpinner();
    }, error => {
      this.logAuditTrail(summaryDataModel, {}, AuditTrackingAction.Delete, AuditTrackingActionStatus.Failure);
      this.closePopUp();
    }
    );
  }


  private setSingleSummaryAnalyteSection(singleLabTestId: string) {
    this.singleSummaryAnalyteSection = this.sortedAnalyteSections
      .find(x => x.analyteInfo.labTestId === singleLabTestId && x.analyteInfo.isSummary);
  }

  public subscribeToNotificationSingleSummary(labTestId: string): void {
    this.notification.subscribeLabTestToHub(labTestId);
    unsubscribe(this.notificationSubscription);
    this.notificationSubscription = this.notification.$labTestStream.subscribe(
      (data: UnityNotification) => {
        this.updateSingleSummaryAnalyteView(data.correlationId);
      }
    );
  }

  public updateSingleSummaryAnalyteView(labTestId: string): void {
    // 20200917 If statement added to match pageSection component logic of filtering notifications to only intended Ids
    if (labTestId === this.labTestId) {
      this.loadSingleSummaryDataAndStats(labTestId);
    }
  }

  public loadSingleSummaryDataAndStats(labTestId: string): void {
    this.labDataService.getLatestSummaryDataByLabTestIdAsync(labTestId, undefined, false).then(baseRawDataSet => {
      this.baseRawDataSet = baseRawDataSet;
      this.latestAnalyteDateTime = this.pageSectionService.getLatestAnalyteDateTime(
        this.latestAnalyteDateTime,
        baseRawDataSet
      );
      const analyteViewSets = this.pageSectionService.createMultipleAnalyteViewSets(
        this.sortedAnalyteSections,
        baseRawDataSet,
        this.cumulativeLevelsInUse,
        this.timeZone,
        false
      );

      this.analyteViewSets = analyteViewSets;
      this.getHistoryData();

      this.checkEntriesForSameYear();

      this.getSummaryStatistics(labTestId);

      this.setSelectedDateTimeBasedOnSummaryData(baseRawDataSet);

      this.stopSpinner();
    });

  }

  public checkEntriesForSameYear() {
    const analyteEntryYears = [];
    this.analyteViewSets.forEach((element) => {
      analyteEntryYears.push(element.analyteDateTime.getFullYear());
    });
    this.analyteEntryYears = [];
    analyteEntryYears.some((element, index) => {
      const isSameYearEntryExist = analyteEntryYears.indexOf(element) !== index ? true : false;
      this.analyteEntryYears.push(isSameYearEntryExist);
    });
  }

  public async submitSingleSummAsync(): Promise<void> {
    this.startSpinner();
    const validAnalyteEntries = this.pageSectionService.extractValidAnalyteEntries(
      this.analyteForm,
      this.formControlNames
    );
    this.analyteEntry = validAnalyteEntries[0];
    if (!validAnalyteEntries) {
      return; // No valid entries
    }

    const enteredDateTime = new Date();
    // Performs each BaseRawDataSet creation in async parallel
    const promises = validAnalyteEntries.map(validEntry =>
      this.pageSectionService.createPostBaseRawDataSet(
        validEntry,
        this.sortedAnalyteSections,
        this.labId,
        this.accountId,
        this.accountNumber,
        this.selectedDateTime,
        enteredDateTime,
        this.timeZone
      )
    );

    // Waits until all async parallel creation process completes
    const postBaseRawDataSets = await Promise.all(promises);
    const singleRawDataModel = postBaseRawDataSets[0];
    this.convertResults(singleRawDataModel);
    this.logAuditTrail(singleRawDataModel, {}, AuditTrackingAction.Add, AuditTrackingActionStatus.Success);
    singleRawDataModel.auditDetails = this.auditTrailDetails;
    try {
      if (singleRawDataModel) {
        await this.labDataService.postDataAsync(singleRawDataModel);
      }
    } catch {
      singleRawDataModel.auditDetails.auditTrail.actionStatus = AuditTrackingActionStatus.Failure;
      this.appNavigationService.logAuditTracking(this.auditTrailDetails, true);
    }

    const lotUpdatePromises = postBaseRawDataSets.map(async baseRawData => {
      const analyteEntry = validAnalyteEntries.find(
        ae => ae.labTestId === baseRawData.labTestId
      );
      const analyteInfo = this.sortedAnalyteSections.find(
        as => as.analyteInfo.labTestId === baseRawData.labTestId
      ).analyteInfo;

      this.pageSectionService.updateTestSpecId(
        analyteEntry,
        analyteInfo.testId
      );
    });

    await Promise.all(lotUpdatePromises);

    this.pageSectionService.updateDefaultLots(validAnalyteEntries);

    this.resetForm();
    this.cancel();
    this.stopSpinner();
  }

  private sendAuditTrailPayload(currentData, priorData, currentSummaryAnalyte, typeOfAction, actionStatus): void {
    const auditNavigationPayload = this.appNavigationService.fetchData();
    auditNavigationPayload.auditTrail.device_id = currentSummaryAnalyte.labTestId;
    auditNavigationPayload.auditTrail.run_id = currentSummaryAnalyte.id;
    auditNavigationPayload.auditTrail.currentValue = currentData;
    auditNavigationPayload.auditTrail.priorValue = priorData;
    auditNavigationPayload.auditTrail.action = typeOfAction;
    auditNavigationPayload.auditTrail.actionStatus = actionStatus;
    auditNavigationPayload.auditTrail.eventType = AuditTrackingEvent.AnalyteDataTable;
    if (typeOfAction === AuditTrackingAction.Add) {
      const summaryDate = moment(currentSummaryAnalyte?.summaryDateTime);
      auditNavigationPayload.auditTrail.currentValue.runDate = !!summaryDate && !!this.locationTimeZone ?
        summaryDate.tz(this.locationTimeZone).format('MMM DD, YYYY') : null;
      this.auditTrailDetails = this.appNavigationService.prepareAuditTrailPayload(auditNavigationPayload);
      if (!!this.auditTrailDetails?.auditTrail) {
        this.auditTrailDetails.auditTrail.runDateTime = currentSummaryAnalyte?.summaryDateTime;
      }
    } else {
      this.appNavigationService.logAuditTracking(auditNavigationPayload, true);
    }
    this.pageSectionService.currentAnalyteData = [];
  }

  logAuditTrail(currentSummaryAnalyte, priorlevelDataSet, typeOfAction: string, actionStatus: string) {
    const currentAnalyteData = this.pageSectionService.currentAnalyteData[0];
    const currentValue: Array<AnalyteLevelData> = [];
    const currentlevelData: Array<AnalyteLevelData> = [];
    let currentSummary = {};
    let primarySummary = {};
    const current = currentlevelData;
    const prior = priorlevelDataSet.levelData;
    let currentData: Array<AnalyteLevelData> = [];
    let priorData: Array<AnalyteLevelData> = [];
    currentSummaryAnalyte.results.map(element => {
      const currentValueObj = {
        'mean': element.mean,
        'sd': element.sd,
        'numPoints': element.nPts,
        'level': element.controlLevel,
      };
      currentlevelData.push(currentValueObj);
    });

    if (typeOfAction === AuditTrackingAction.Update) {
      const priorSummaryAnalyteData = this.pageSectionService.priorAnalyteData[0];
      let date: moment.Moment;
      date = moment(priorSummaryAnalyteData.analyteDateTime);
      const chnagedValues = this.appNavigationService.currentPriorChangeValue(current, prior);
      const currentDate = currentAnalyteData.analyteDateTime.toString().substring(0, 15);
      const priorDate = priorSummaryAnalyteData.analyteDateTime.toString().substring(0, 15);
      primarySummary = {
        'runDate': currentDate !== priorDate ? date.tz(this.locationTimeZone).format('MMM DD, YYYY') : null,
        'comment': !!priorSummaryAnalyteData.changeLotData.comment ? priorSummaryAnalyteData.changeLotData.comment : null,
        'isComment': !!priorSummaryAnalyteData.changeLotData.comment ? true : false,
        'action': !!priorSummaryAnalyteData.action ? priorSummaryAnalyteData.action : null,
        'isAction': !!priorSummaryAnalyteData.action ? true : false,
        'reagentLotName': currentAnalyteData.changeLotData.defaultReagentLot.lotNumber,
        'calibratorLotName': currentAnalyteData.changeLotData.defaultCalibratorLot.lotNumber,
        'levelData': chnagedValues.priorValues,
      };
      date = moment(currentAnalyteData.analyteDateTime);

      currentSummary = {
        'runDate': currentDate !== priorDate ? date.tz(this.locationTimeZone).format('MMM DD, YYYY') : null,
        'comment': !!currentAnalyteData.changeLotData.comment ? currentAnalyteData.changeLotData.comment : null,
        'isComment': !!currentAnalyteData.changeLotData.comment ? true : false,
        'action': !!currentAnalyteData.action ? currentAnalyteData.action : null,
        'isAction': !!currentAnalyteData.action ? true : false,
        'reagentLotName': currentAnalyteData.changeLotData.selectedReagentLot.lotNumber,
        'calibratorLotName': currentAnalyteData.changeLotData.selectedCalibratorLot.lotNumber,
        'levelData': chnagedValues.currentValues,
      };

      const data = {
        current: currentSummary,
        prior: primarySummary,
      };

      const auditNavigationPayload = cloneDeep(this.appNavigationService.compareData(data));
      currentData = [];
      priorData = [];
      this.sendAuditTrailPayload(auditNavigationPayload.auditTrail.currentValue, auditNavigationPayload.auditTrail.priorValue,
        currentSummaryAnalyte, typeOfAction, actionStatus);
    } else {
      currentSummary = {
        'comment': currentSummaryAnalyte?.userComments ? currentSummaryAnalyte?.userComments[0].content : null,
        'isComment': currentSummaryAnalyte?.userComments != null ? true : false,
        'action': !!this.baseRawDataSet[0]?.userActions ? this.baseRawDataSet[0].userActions : null,
        'isAction': !!this.baseRawDataSet[0]?.userActions ? true : false,
        'isReagentLot': typeOfAction === AuditTrackingAction.Add ?
          (this.analyteEntry?.changeLotData?.selectedReagentLot != null) : (this.sortedAnalyteSections[0].analyteInfo != null),
        'reagentLotID': typeOfAction === AuditTrackingAction.Add ?
          (this.analyteEntry?.changeLotData?.selectedReagentLot.reagentId) :
          this.sortedAnalyteSections[0].analyteInfo.defaultReagentLot.reagentId,
        'reagentLotName': typeOfAction === AuditTrackingAction.Add ?
          (this.analyteEntry?.changeLotData?.selectedReagentLot.lotNumber) :
          (this.sortedAnalyteSections[0].analyteInfo.defaultReagentLot.lotNumber),
        'isCalibratorLot': typeOfAction === AuditTrackingAction.Add ?
          (this.analyteEntry?.changeLotData?.selectedCalibratorLot != null) :
          (this.sortedAnalyteSections[0].analyteInfo != null),
        'calibratorLotID': typeOfAction === AuditTrackingAction.Add ?
          (this.analyteEntry?.changeLotData?.selectedCalibratorLot?.calibratorId) :
          (this.sortedAnalyteSections[0].analyteInfo.defaultCalibratorLot.calibratorId),
        'calibratorLotName': typeOfAction === AuditTrackingAction.Add ?
          (this.analyteEntry?.changeLotData?.selectedCalibratorLot?.lotNumber) :
          (this.sortedAnalyteSections[0].analyteInfo.defaultCalibratorLot.lotNumber),
        'levelData': typeOfAction !== AuditTrackingAction.Update ? currentlevelData : currentData,
      };
      currentValue.push(currentSummary);
      this.sendAuditTrailPayload(currentSummary, {}, currentSummaryAnalyte, typeOfAction, actionStatus);
    }
  }

  private closePopUp(): void {
    this.dialog.closeAll();
  }

  private updateBaseRawDataModelSet(summaryDataModel: BaseRawDataModel): void {
    const baseRawDataModelIndex = this.baseRawDataSet.findIndex(x => x.id === summaryDataModel.id);
    this.baseRawDataSet[baseRawDataModelIndex] = summaryDataModel;
  }

  public cancel(): void {
    this.setSelectedDateTimeBasedOnSummaryData(this.baseRawDataSet as SummaryDataModel[]);
  }

  protected updateSelectedDateTime(selectedDateTime: Date): void {
    this.selectedDateTime = selectedDateTime;
    this.isProductMasterLotExpired =
      this.dateTimeHelper.isExpiredOnSpecificDate(this.productMasterLotExpiration, selectedDateTime);
  }

  private setSelectedDateTime(dateOfMostRecentSummaryEntry: Date = null) {
    this.updateSelectedDateTime(this.pageSectionService.getSelectedDateTime(dateOfMostRecentSummaryEntry,
      this.screenLoadedDateTime, this.timeZone));
  }

  private setSelectedDateTimeBasedOnSummaryData(summaryData: SummaryDataModel[]): void {
    if (summaryData && summaryData.length > 0 && summaryData[0].localSummaryDateTime) {
      this.setSelectedDateTime(new Date(summaryData[0].localSummaryDateTime));
    } else {
      this.setSelectedDateTime(null);
    }
    this.initialSelectedDate = this.selectedDateTime;
  }

  private convertResults(summaryDataModel: BaseRawDataModel): void {
    for (let i = 0; i < summaryDataModel.results.length; i++) {
      summaryDataModel.results[i].mean = +summaryDataModel.results[i].mean;
      summaryDataModel.results[i]['sd'] = +summaryDataModel.results[i]['sd'];
      summaryDataModel.results[i]['nPts'] = +summaryDataModel.results[i]['nPts'];
    }
  }

  requestNewConfiguration(type: NewRequestConfigType) {
    let templateId, name;
    switch (type) {
      case this.newRequestConfigType.CalibratorLot:
        templateId = TemplateType.CalibratorLot;
        name = this.getTranslations('SINGLEPAGESECTION.LABELCALIBRATORLOT');
        break;
      case this.newRequestConfigType.ReagentLot:
        templateId = TemplateType.ReagentLot;
        name = this.getTranslations('SINGLEPAGESECTION.LABELREAGENTLOT');
        break;
      default:
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, '', Operations.defaultCaseRequestNewConfig,
            (componentInfo.SinglePageSectionComponent + blankSpace + Operations.defaultCaseRequestNewConfig)));
        break;
    }
    this.newConfigDialog.open(RequestNewConfigComponent, {
      width: '450px',
      data: {
        templateId: templateId,
        name: name
      }
    });
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    unsubscribe(this.labIdSubscription);
    unsubscribe(this.analyticalSectionSubscription);
    unsubscribe(this.notificationSubscription);
    unsubscribe(this.dataManagementStateSubscription);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  getTranslationLabels() {
    return {
      peergroup: this.getTranslations('ENTRYSAVE.PEERGROUP'),
      cancel: this.getTranslations('ENTRYSAVE.CANCEL'),
      change: this.getTranslations('DATETIMEPICKER.CHANGE'),
      date: this.getTranslations('DATETIMEPICKER.DATE'),
      mean: this.getTranslations('TRANSLATION.MEAN'),
      sd: this.getTranslations('TRANSLATION.SD'),
      points: this.getTranslations('TRANSLATION.POINTS'),
      expired: this.getTranslations('ANALYTESUMMARYENTRY.LOTEXPIRED'),
      na: this.getTranslations('ANALYTESUMMARYENTRY.NA'),
      submit: this.getTranslations('ANALYTESUMMARYENTRY.SUBMIT'),
      editdata: this.getTranslations('ANALYTESUMMARYVIEW.EDITDATA'),
      nodata: this.getTranslations('ANALYTESUMMARYVIEW.NODATA'),
    }
  };
}
