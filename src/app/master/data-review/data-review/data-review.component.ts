// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { createFeatureSelector, createSelector, select, Store } from '@ngrx/store';
import { PaginationInstance } from 'ngx-pagination';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Observable, Subject, Subscription, forkJoin, of } from 'rxjs';
import { debounceTime, filter, finalize, mergeMap, take, takeUntil } from 'rxjs/operators';
import { Action, BrDialogComponent, BrReviewSummaryComponent, CustomRegex, DialogResult, PezContent, UserInteraction } from 'br-component-library';
import { TranslateService } from '@ngx-translate/core';

import * as fromSelector from '../state/selectors';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../../shared/icons/icons.service';
import { StatusCode } from '../../../shared/api/status-codes.enum';
import { BenchReviewDataColumns, DisplayColumn, ReviewData, ReviewDataRequest, ReviewDataTableResult, ReviewFilter, ReviewFilterTypes, ReviewPaginationParams, ReviewType, RunReview,
   RunReviewSelection, UnReviewedDataCounts, UnReviewedDataRequest, UserReviewPreferences, NameId, 
   MissingTestPayload, MissingTestPopupData, MissingTestResponseData } from '../../../contracts/models/data-review/data-review-info.model';
import { addedBy, asc, blankSpace, pageItemsDisplay, paginationDataReview, 
  paginationDataReviewPerPage, benchReviewedBy, supervisorReviewedBy, missingTestPageItemsPerPage, includeArchivedItems } from '../../../core/config/constants/general.const';
import { DataReviewService } from '../../../shared/api/data-review.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { Operations, componentInfo } from '../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { Permissions } from '../../../security/model/permissions.model';
import { AnalyteLevelData, AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, AuditTrailPriorCurrentValues, ReviewSummaryHistory } from '../../../shared/models/audit-tracking.model';
import { User } from '../../../contracts/models/user-management/user.model';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import * as sharedStateSelector from '../../../shared/state/selectors';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { LevelSummary, ReviewSummary } from '../../../contracts/models/data-management/review-summary.model';
import { DataManagementService } from '../../../shared/services/data-management.service';
import { PointDataResult, ResultStatus, RunData } from '../../../contracts/models/data-management/run-data.model';
import { Utility } from '../../../core/helpers/utility';
import { Department, LabLocation, TreePill } from '../../../contracts/models/lab-setup';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { LevelLoadRequest } from '../../../contracts/models/portal-api/labsetup-data.model';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';
import { dataReviewActions } from '../../data-review/state/actions';
import { NavBarActions } from '../../../state/actions';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ManageExpectedTestComponent } from '../manage-expected-test/manage-expected-test.component';
import { AuthenticationService } from '../../../../app/security/services';
import { LabDataApiService } from '../../../shared/api/labDataApi.service';
import { UpsertRequestOptions } from '../../../contracts/models/data-management/base-raw-data.model';
import { RunsService } from '../../../shared/services/runs.service';
import { DataManagementSpinnerService } from '../../../shared/services/data-management-spinner.service';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { UnityNotification } from '../../../core/notification/interfaces/unity-notification';
import { MissingTestsComponent } from '../missing-tests/missing-tests.component';
import { AdvancedLjPanelComponent } from '../../data-management/advanced-lj/advanced-lj-panel/advanced-lj-panel.component';
import { QueryParameter } from '../../../shared/models/query-parameter';
import { AdditionalFilterDialogComponent } from '../additional-filter-dialog/additional-filter-dialog.component';
import { UnityNextNumericPipe } from '../../../shared/date-time/pipes/unity-numeric.pipe';
import { NavigationState } from '../../../shared/navigation/state/reducers/navigation.reducer';


@Component({
  selector: 'unext-data-review',
  templateUrl: './data-review.component.html',
  styleUrls: ['./data-review.component.scss'],
  providers: [UnityNextNumericPipe]
})

export class DataReviewComponent implements OnInit, OnDestroy {
  @ViewChild(PerfectScrollbarComponent) dataReviewScrollRef?: PerfectScrollbarComponent;
  @ViewChild('matSelectDepartment') matSelectDepartment : MatSelect;
  @ViewChild('matSelectInstrument') matSelectInstrument : MatSelect;  
  @ViewChild('matSelectPanel') matSelectPanel : MatSelect;  
  @ViewChild('additionalFilterComponent') additionalFilterComponent?: AdditionalFilterDialogComponent;
  public getDataReviewFeatureState$ = this.store.pipe(select(fromSelector.getDataReviewFeatureState));
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  public getCurrentAccount$ = this.store.pipe(select(sharedStateSelector.getCurrentAccount));
  public getNavigationState = createFeatureSelector<NavigationState>('navigation');
  public getLocale = createSelector(this.getNavigationState, (state) => state && state.locale ? state.locale : { country: 'US', lcid: 'en-US', value: 'en', name: 'English' });
  public navigationGetLocale$ = this.store.pipe(select(this.getLocale));
  public totalPages = 0;
  public selectedAllRun: boolean = false;
  public selectedAllRunCurrentPage: boolean = false;
  public selectedAllRunAllPage: boolean = false;
  readonly maxSize = pageItemsDisplay;
  paginationConfig: PaginationInstance = {
    id: paginationDataReview,
    itemsPerPage: paginationDataReviewPerPage,
    currentPage: 1,
    totalItems: 1,
  };
  unReviewedDataRequest = new UnReviewedDataRequest();
  sortInfo: Sort;

  tempReviewResults: Array<ReviewData>;
  dataReviewResults: Array<ReviewData>;
  dataReviewTableResults: Array<ReviewDataTableResult>;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.settings[24],
    icons.close[24],
    icons.filter[24],
    icons.manageSearch[24],
    icons.replay18[18],
    icons.missingTests[22]
  ];
  dataSource: BenchReviewDataColumns[];
  displayedColumns = ['checkDataColumn', 'Analyte', 'Date', 'settings'];
  
  itemsSelected: number = 0;
  totalCount: number = 0;

  public actions: Array<Action>;
  public selectedForReview: FormArray;
  public formGroup: FormGroup;
  public formGroupEditRun: FormGroup;
  public labTimeZone: string;
  public selectedDateTime: Date;
  public dateTimeOffset: string;
  public labLocationId: string;
  public reviewType: ReviewType;
  public isReviewedButtonEnabled = false;
  public isSubmittingReview = false;
  public filterCounts: UnReviewedDataCounts;

  readonly permissions = Permissions;
  readonly regexRationalNumber = CustomRegex.RATIONAL_NUMBER;
  protected destroy$ = new Subject<boolean>();
  protected notificationSubject$ = new Subject<boolean>();
  protected formChangesSubscription: Subscription;
  private historyData: Record<string, ReviewSummaryHistory> = {};
  private fetchedUsers = new Array<User>();
  selectedColumns = [];
  childData = [];
  readonly analyteColumnName = 'Analyte';
  readonly dateColumnName = 'Date';
  readonly timeColumnName = 'Time';
  readonly levelColumnName = 'Level';
  readonly resultsColumnName = 'Results';
  readonly zScoreColumnName = 'Z-score';
  readonly rulesColumnName = 'Rules';
  readonly evalMeanColumnName = 'Eval Mean';
  readonly evalSdColumnName = 'Eval SD';
  readonly evalCvColumnName = 'Eval CV';
  readonly peerMeanColumnName = 'Peer Mean';
  readonly peerSdColumnName = 'Peer SD';
  readonly peerCvColumnName = 'Peer CV';
  readonly byColumnName = 'By';
  readonly statusColumnName = 'Status';
  readonly dialogBoxWidth = '464';
  readonly confirmationDialogBoxWidth = '533';
  isDateColumnVisible = true;
  isTimeColumnVisible = true;
  isLevelColumnVisible = true;
  isResultsColumnVisible = true;
  isZscoreColumnVisible = true;
  isRulesColumnVisible = true;
  isEvalMeanColumnVisible = true;
  isEvalSdColumnVisible = true;
  isEvalCvColumnVisible = true;
  isPeerMeanColumnVisible = true;
  isPeerSdColumnVisible = true;
  isPeerCvColumnVisible = true;
  isByColumnVisible = true;
  isStatusColumnVisible = true;
  runReviewItems = new Array<RunReviewSelection>();
  private readonly selectedRunField = 'selectedRun';
  private readonly actionField = 'action';
  private readonly commentField = 'comment';
  getCheckedColName = [];
  getCheckedCheckBox = [];
  savePreferenceLayers: Array<DisplayColumn> = [];
  savePreferenceArray: any = [];
  savePreferenceData: UserReviewPreferences;
  departmentList : NameId[] = [];
  perviousFilterValues: NameId[] = [];
  labInstrumentList: NameId[] = [];
  labInstrumentListArray: NameId[] = [];
  filterInstrumentArray: NameId[] = [];
  panelItemList: NameId[] = [];
  isDisabledPanel = false;
  isDisabledDepartment: boolean;
  isInstrumentsGroupedByDept : boolean = false;
  valueAll: NameId = {displayName : 'All'};
  selectedDepartments: NameId[] = [this.valueAll];
  selectedInstruments: NameId[] = [this.valueAll];
  selectedPanels: NameId[] = [];
  departmentTooltip: NameId[] = [this.valueAll];
  instrumentTooltip: NameId[] = [this.valueAll];
  panelTooltip: NameId[] = [this.valueAll];
  isViewItemsDisabled = true;
  isResetDisabled = true;
  isLabWithoutDep : boolean = false;
  labLocation: LabLocation;
  labLocationChildren: Array<TreePill>;
  isDisabledInstrument: boolean = false;
  selectDepartment: boolean = false;
  noNewResultFlag: boolean = false;
  allItemsReviewFlag: boolean = false;
  refreshResultFlag: boolean = false;
  isCheckedDepartment: boolean[] = [false];
  allInstrumentArray: Array<string> = [];
  hasSupervisorAccess: boolean = false;
  toggleLinkText: string;
  missingTestsCount: number;
  usercomments:  Array<string> = [];
  filterTypes: ReviewFilter[] = [
    {
      filterType: ReviewFilterTypes.Accepted,
      include: false
    },
    {
      filterType: ReviewFilterTypes.Warning,
      include: false
    },
    {
      filterType: ReviewFilterTypes.Rejected,
      include: false
    },
    {
      filterType: ReviewFilterTypes.ActionAndComments,
      include: false
    },
    {
      filterType: ReviewFilterTypes.Violations,
      include: false
    },
    {
      filterType: ReviewFilterTypes.Last30Days,
      include: false
    }
  ];

  isEditingRun = false;
  runIdInEdit: string;
  runInEdit: ReviewData;
  isUpdatingRun = false;
  filterCountsNum: UnReviewedDataCounts;
  btnClick = new Subject();
  public readonly ResultStatusWarning = ResultStatus.Warning;
  public readonly ResultStatusRejected = ResultStatus.Reject;
  violationsCheck: boolean =  false;
  acceptedFilterObj = {} as ReviewFilter;
  violationFilterCheck = false;
  warningFilterCheck  = false;
  correctiveAction: Array<string> = [];
  // missing test payload data
  labDepartments: Array<string> = [];
  labInstruments: Array<string> = [];
  actionTitle: string;
  commentTitle: string;
  actionLogsTitle: string;
  atText: string;
  connectivityText: string = 'Connectivity';
  constructor(
    private store: Store<fromSelector.DateReviewStates>,
    private iconService: IconService,
    private codeListService: CodelistApiService,
    private dataManagementService: DataManagementService,
    private dataReviewApiService: DataReviewService,
    private dateTimeHelper: DateTimeHelper,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private messageSnackBar: MessageSnackBarService,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    public appNavigationService: AppNavigationTrackingService,
    private portalApiService: PortalApiService,
    private navigationService: NavigationService,
    private changeTrackerService: ChangeTrackerService,
    private authService: AuthenticationService,
    private labDataService: LabDataApiService,
    private runsService: RunsService,
    protected notification: NotificationService,
    private dataManagementSpinnerService: DataManagementSpinnerService,
    private dialogRef: MatDialogRef<BrDialogComponent, any> = null,
    private translate: TranslateService,
    private unityNextNumericPipe: UnityNextNumericPipe
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.actionTitle = this.getTranslation('PEZDIALOG.ACTIONS');
    this.commentTitle = this.getTranslation('PEZDIALOG.COMMENTS');
    this.actionLogsTitle = this.getTranslation('PEZDIALOG.ACTIONLOGS');
    this.atText = this.getTranslation('PEZDIALOG.AT');
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.actionTitle = this.getTranslation('PEZDIALOG.ACTIONS');
      this.commentTitle = this.getTranslation('PEZDIALOG.COMMENTS');
      this.actionLogsTitle = this.getTranslation('PEZDIALOG.ACTIONLOGS');
      this.atText = this.getTranslation('PEZDIALOG.AT');
      if (this.tempReviewResults && this.tempReviewResults.length) {
        this.getHistoryCount();
      }
    });

    // Initially set isSupervisorReview to true if has SupervisorReview permission
    this.reviewType = ReviewType.Bench;
    if (this.hasPermissionToAccess([Permissions.SupervisorReview])) {
      this.reviewType = ReviewType.Supervisor;
      this.hasSupervisorAccess = true;
      this.toggleLinkText = "DATAREVIEW.SWITCHTOBENCHREVIEW";
    }

    // CTS user
    if (this.hasPermissionToAccess([Permissions.SupervisorReviewViewOnly])) {
      this.reviewType = ReviewType.Bench;
      this.hasSupervisorAccess = true;
      this.toggleLinkText = "DATAREVIEW.SWITCHTOSUPERVISORREVIEW";
    }

    this.store.dispatch(dataReviewActions.UpdateDataReviewInfo({
      payload: {
        isSupervisorReview: this.reviewType === ReviewType.Supervisor
      }
    }
    ));

    this.getCurrentLabLocation$
      .pipe(
        filter(labLocation => !!(labLocation?.id)),
        take(1))
      .subscribe(labLocation => {
        this.store.dispatch(NavBarActions.setDefaultNode({ selectedNode: labLocation }));
        this.labLocationId = labLocation.id;
        this.labTimeZone = labLocation.locationTimeZone;
        const visibleColumns = [this.dateColumnName, this.timeColumnName, this.levelColumnName, this.resultsColumnName, this.zScoreColumnName, this.rulesColumnName, this.evalMeanColumnName, this.evalSdColumnName, this.byColumnName, this.statusColumnName ];
        this.updateVisibleColumns(visibleColumns);
        this.unReviewedDataRequest.paginationParams = new ReviewPaginationParams();
        this.setInitForm([]);
        this.unReviewedDataRequest.paginationParams.pageIndex = 0;
        this.unReviewedDataRequest.paginationParams.pageSize = this.paginationConfig.itemsPerPage;
        this.unReviewedDataRequest.paginationParams.sortDescending = true;
        this.initializeReviewDataList();
        this.retrieveUserActions();
      }, err => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.DataReviewComponent + blankSpace + Operations.FetchCurrentLocation)));
      });
    //Added logic for select multiple filters at a time:debouncetime
    this.btnClick
      .pipe(
        debounceTime(1000),
        takeUntil(this.destroy$))
      .subscribe(() => {
        this.onClickFiltersDebounceTime();
      });

    this.navigationGetLocale$
    .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
    .subscribe(() => {
      if (this.tempReviewResults && this.tempReviewResults.length) {
        this.getHistoryCount();
      }
    });
  }

  openManageExpectedTestsDialog() {
  const dialogRef = this.dialog.open(ManageExpectedTestComponent, {
      panelClass: 'manage-expected-tests-dialog',
      data: {
        labLocation: this.labLocation,
        reviewType : this.reviewType
      },
      disableClose: true,
      closeOnNavigation: false
    })
    dialogRef.afterClosed().pipe(take(1)).subscribe(res=> {
      if(res !=undefined){
        this.missingTestsCount = res;
      }
    })
  }

  updateTooltips() {
    this.departmentTooltip = this.selectedDepartments.length ? this.departmentList : [];
    this.instrumentTooltip = this.selectedInstruments.length ? this.labInstrumentList : [];
    this.panelTooltip = this.selectedPanels.length ? this.panelItemList : [];
  }

  onResetFilter() {
    this.labInstrumentList = this.labInstrumentListArray;
    this.selectedDepartments = this.isLabWithoutDep ? [] : [this.valueAll].concat(this.departmentList);
    this.selectedInstruments = [this.valueAll].concat(this.labInstrumentList);
    this.selectedPanels = [];
    this.isViewItemsDisabled = true;
    
    // Resetting the filters
    if(this.departmentList.length === 0) {
      if(this.labInstrumentList.length > 0) {
        this.isDisabledInstrument = false;
      }
    } else {
      this.isDisabledDepartment = false;
      this.isDisabledInstrument = false;
    }
    // Updating the tooltips
    this.updateTooltips();

    // Resetting the unReviewedDataRequest
    this.unReviewedDataRequest.labDepartments = this.isDisabledDepartment? [] : this.departmentList.map(item => item?.id);
    this.unReviewedDataRequest.labInstruments = this.isDisabledInstrument? [] : this.labInstrumentListArray.map(item => item?.id);
    this.unReviewedDataRequest.labPanels = this.isDisabledPanel? [] : this.panelItemList.map(item => item.id);
    // Loading data
    this.viewFilteredItems();
    
    // Disabling the reset button after resetting
    this.isResetDisabled = true;
  }

  openMissingTestsPopUp(){
    const paginationParams = this.unReviewedDataRequest.paginationParams;
    paginationParams.searchString = '';
    paginationParams.searchColumn = 1;
    paginationParams.sortColumn = 1;
    paginationParams.sortDescending = false;
    paginationParams.pageIndex = 0;
    paginationParams.pageSize = missingTestPageItemsPerPage;
    let payload: MissingTestPayload = {
      paginationParams: paginationParams,
      labLocationId: this.labLocationId,
      reviewType: this.reviewType,
      labDepartments: this.unReviewedDataRequest.labDepartments,
      labInstruments: this.unReviewedDataRequest.labInstruments,
      labPanels: this.unReviewedDataRequest.labPanels
    };
    this.dataReviewApiService.getMissingTests(payload)
      .pipe(take(1))
      .subscribe((res:MissingTestResponseData) => {
        if(res.missingTests !== null) {
          let missingTestPopUpData:MissingTestPopupData = {
            labLocationId: payload.labLocationId,
            reviewType: payload.reviewType,
            labDepartments: payload.labDepartments,
            labInstruments:payload.labInstruments,
            labPanels: payload.labPanels,
            instrumentsGroupedByDept: this.labLocation.locationSettings.instrumentsGroupedByDept,
            response: res
          }
          const dialogRef = this.dialog.open(MissingTestsComponent, {
            panelClass: 'missing-tests-dialog',
            data: missingTestPopUpData
          });
          dialogRef.afterClosed().pipe(take(1)).subscribe(res=> {
            if(res){
              this.missingTestsCount = 0;
            }
          })
        }

      }, error => {
          if (error.error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
                (componentInfo.DataReviewComponent + blankSpace + Operations.GetMissingTestsData)));
          }
      });
  }

  openAdvancedLjDialog (labTestId: string, labInstrumentId: string, decimalPlaces: number, runDateTime: Date) {
    this.dialog.open(AdvancedLjPanelComponent, {
      panelClass: 'cdk-AdvancedLj',
      data: {
        labTestId: labTestId,
        labInstrumentId: labInstrumentId,
        decimalPlaces: decimalPlaces,
        runDateTime: runDateTime
      }
    });
  }

  initializeReviewDataList() {
    this.sortInfo = { active: this.displayedColumns[0], direction: asc };
    const paginationParams = this.unReviewedDataRequest.paginationParams;
    paginationParams.searchString = '';
    paginationParams.searchColumn = 1;
    paginationParams.sortColumn = 1;
    paginationParams.sortDescending = true;
    paginationParams.pageIndex = 0;
    paginationParams.pageSize = this.paginationConfig.itemsPerPage;

    const queryParameters = [new QueryParameter(includeArchivedItems, 'false')];
    this.portalApiService.getLabSetupNode<LabLocation>(EntityType.LabLocation, this.labLocationId,
      LevelLoadRequest.LoadAllDescendants, EntityType.None, queryParameters, true)
      .pipe(take(1))
      .subscribe((labLocation: LabLocation) => {
        this.labLocation = labLocation;
        this.unReviewedDataRequest.labLocationId = labLocation.id;
        this.unReviewedDataRequest.reviewType = this.reviewType;
        this.unReviewedDataRequest.labDepartments = [];
        this.unReviewedDataRequest.labInstruments = [];

        if (labLocation.locationSettings.instrumentsGroupedByDept) {
          if (labLocation.children && labLocation.children.length > 0) {
            this.labLocationChildren = labLocation.children;
            this.labLocationChildren
              .filter(nodeItem => nodeItem.nodeType === EntityType.LabDepartment && nodeItem.children?.length > 0 && Utility.hasAnalyteLevelNode(nodeItem))
              .forEach(department => {
                const dep = department as Department;
                let depData = new NameId();
                depData.displayName = dep.displayName;
                depData.id = dep.id;
                this.departmentList.push(depData);
                this.isDisabledDepartment = (this.departmentList.length === 0) ? true : false;
                if (dep.children) {
                  let tempLabInstrumentArray : NameId[] = []; // for sorting the instruments of its department
                  this.unReviewedDataRequest.labDepartments.push(dep.id);
                  this.labDepartments.push(dep.id);
                  dep.children
                  .filter(nodeItem => Utility.hasAnalyteLevelNode(nodeItem))
                  .forEach(labInstrument => {
                    this.unReviewedDataRequest.labInstruments.push(labInstrument.id);
                    this.labInstruments.push(labInstrument.id);
                    let insData = new NameId();
                    insData.displayName = labInstrument.displayName;
                    insData.id = labInstrument.id;
                    tempLabInstrumentArray.push(insData)
                  });
                  tempLabInstrumentArray.sort((a, b) => (a.displayName < b.displayName ? -1 : 1));
                  this.labInstrumentList.push(...tempLabInstrumentArray);
                  this.labInstrumentListArray = this.labInstrumentList;
                }
              });
            this.labLocationChildren
              .filter(nodeItem => nodeItem.nodeType === EntityType.Panel)
              .forEach(panelListItem => {
                let panelData = new NameId();
                panelData.displayName = panelListItem.displayName;
                panelData.id = panelListItem.id;
                this.panelItemList.push(panelData);
              });
          }
        } else {
          if (labLocation.children && labLocation.children.length > 0) {
            this.isLabWithoutDep = true;
            const labLocationChildren: Array<TreePill> = labLocation.children;
            this.isInstrumentsGroupedByDept = true;
            this.isDisabledDepartment = (this.departmentList.length === 0) ? true : false;
            if(this.isDisabledDepartment) {
              this.selectedDepartments = [];
            }
            labLocationChildren
              .filter(nodeItem => nodeItem.nodeType === EntityType.LabInstrument && Utility.hasAnalyteLevelNode(nodeItem))
              .forEach(labInstrument => {
                this.unReviewedDataRequest.labInstruments.push(labInstrument.id);
                let insData = new NameId();
                insData.displayName = labInstrument.displayName;
                insData.id = labInstrument.id;
                this.labInstrumentList.push(insData);
                this.labInstrumentListArray = this.labInstrumentList;
              });
            labLocationChildren
              .filter(nodeItem => nodeItem.nodeType === EntityType.Panel)
              .forEach(panelListItem => {
                let panelData = new NameId();
                panelData.displayName = panelListItem.displayName;
                panelData.id = panelListItem.id;
                this.panelItemList.push(panelData);
              });
          }
        }
        this.selectedDepartments = this.isDisabledDepartment? [] : [this.valueAll].concat( this.departmentList);
        this.selectedInstruments = [this.valueAll].concat(this.labInstrumentList);
        this.isDisabledPanel = this.panelItemList.length === 0;
        this.updateTooltips();
        this.loadDataReviewList(this.unReviewedDataRequest);
        this.getUserReviewPreferences();
        this.setPreviousFilteredVaules();
      });
  }

  toggleBetweenBenchAndSupervisor() {
    const isAnyRunSelected = (this.formGroup.get('selectedForReview') as FormArray).controls.some(selectedForReviewItem =>
      selectedForReviewItem.get('selectedRun').value
    );
    let isBenchReview = this.reviewType === ReviewType.Bench;
    if (isAnyRunSelected) {
      this.dialogRef = this.dialog.open(BrDialogComponent, {
        panelClass: 'br-dialog-component-panel-class',
        data: {
          title: this.getTranslation("DATAREVIEW.CHANGETRACKERTITLE"),
          subTitle: isBenchReview ? this.getTranslation("DATAREVIEW.SWITCHTOSUPERVISORREVIEWSUBTITLECONFIRM") : this.getTranslation("DATAREVIEW.SWITCHTOBENCHREVIEWSUBTITLECONFIRM"),
          cancelButton: this.getTranslation("DATAREVIEW.CANCELBUTTON"),
          confirmButton: this.getTranslation("DATAREVIEW.MARKANDSWITCHBUTTON"),
          xbutton: true,
          showConfirmButtonFirst: true,
          customWidth: this.confirmationDialogBoxWidth
        }
      });
      this.dialogRef.componentInstance.buttonClicked
        .pipe(take(1))
        .subscribe(
          async dialogResult => {
            if (dialogResult === DialogResult.Cancel) {
              this.dialogRef.close();
            } else if (dialogResult === DialogResult.OK) {
              this.reviewSelectedRunReviews(()=> {
                this.updateDataAccordingToReviewType();
              })
              this.dialogRef.close();
            }
          }
        );
    } else {
      this.toggleReviewType();
    }
  }

  toggleReviewType() {
    let isBenchReview = this.reviewType === ReviewType.Bench
    this.dialogRef = this.dialog.open(BrDialogComponent, {
      panelClass: 'br-dialog-component-panel-class',
      data: {
        title: isBenchReview ? this.getTranslation("DATAREVIEW.SWITCHTOSUPERVISORREVIEWQUESTION") : this.getTranslation("DATAREVIEW.SWITCHTOBENCHREVIEWQUESTION"),
        cancelButton: this.getTranslation("DATAREVIEW.NO"),
        confirmButton: this.getTranslation("DATAREVIEW.YES"),
        xbutton: true,
        showConfirmButtonFirst: true,
        customWidth: this.dialogBoxWidth
      }
    });

    this.dialogRef.componentInstance.buttonClicked
      .pipe(take(1))
      .subscribe(
        async dialogResult => {
          if (dialogResult === DialogResult.Cancel) {
            this.dialogRef.close();
          } else if (dialogResult === DialogResult.OK) {
            this.updateDataAccordingToReviewType();
          }
        }
      );
  }

  updateDataAccordingToReviewType() {
    let isBenchReview = this.reviewType === ReviewType.Bench;
    this.toggleLinkText = isBenchReview ? "DATAREVIEW.SWITCHTOBENCHREVIEW" : "DATAREVIEW.SWITCHTOSUPERVISORREVIEW";
    this.reviewType = isBenchReview ? ReviewType.Supervisor : ReviewType.Bench;
    this.unReviewedDataRequest.reviewType = this.reviewType;
    this.filterTypes.forEach((filter => {
      filter.include = false;
    }))
    this.runReviewItems.forEach(runItem => runItem.selected = false);  //to uncheck the checkboxes after switching the review type
    this.onResetFilter(); // resets the filters and also reloads the data
    this.usercomments = [];
    this.correctiveAction = [];
    this.additionalFilterComponent.formReset();
    this.dialogRef.close();
  }

  getSelectedItems(selectedItems : NameId[]){
    return selectedItems.map(item => item.displayName);
  }

  toggleCheckboxesInstrument(selected: boolean) {
    this.selectedInstruments = selected ? [this.valueAll].concat(this.labInstrumentList) : [];
    this.changeFilterInstrument()
  }
  
  toggleCheckboxesPanel(selected: boolean) {
    this.selectedPanels = selected ? [this.valueAll].concat(this.panelItemList) : [];
    this.changeFilterPanel();
  }

  toggleCheckboxesDepartment(selected: boolean) {
    this.selectedDepartments = selected ? [this.valueAll].concat(this.departmentList) : [];
    this.changeFilterDepartment();
  }

  setPreviousFilteredVaules() {
    this.perviousFilterValues = [];
    this.perviousFilterValues.push(...this.selectedDepartments, ...this.selectedInstruments, ...this.selectedPanels);
  }

  viewFilteredItems() {
    this.setPreviousFilteredVaules();
    let allRunsLoadedFlag : boolean = false;
    let isAllDepartmentsSelected = this.selectedDepartments[0] === this.valueAll;
    let isAllInstrumentsSelected = this.selectedInstruments[0] === this.valueAll;
    let isAllPanelsSelected = this.selectedPanels[0] === this.valueAll;

    this.unReviewedDataRequest.labDepartments = isAllDepartmentsSelected ? this.departmentList.map(item => item?.id) : this.selectedDepartments.map(item => item.id);
    this.unReviewedDataRequest.labInstruments = isAllInstrumentsSelected ? this.labInstrumentList.map(item => item?.id) : this.selectedInstruments.map(item => item.id);
    this.unReviewedDataRequest.labPanels = isAllPanelsSelected ? this.panelItemList.map(item => item.id) : this.selectedPanels.map(item => item.id);
    this.unReviewedDataRequest.reviewType = this.reviewType;
    this.onDataReviewPageChange(1);

    //Resetting the button to disabled after loading the data
    this.isViewItemsDisabled = true;
    if(isAllDepartmentsSelected || this.isDisabledDepartment) {
      if(isAllInstrumentsSelected) {
        allRunsLoadedFlag = true;
      }
    }
    this.isResetDisabled = allRunsLoadedFlag;
  }

  changeFilterDepartment() {
  // Resetting filter to default value when empty
    if(this.selectedDepartments[0] === this.valueAll && this.selectedDepartments.length === this.departmentList.length + 1) {
      this.departmentTooltip = this.selectedDepartments.slice(1);
    } else if(this.selectedDepartments.length === this.departmentList.length && this.selectedDepartments[0] !== this.valueAll){
      this.selectedDepartments = [this.valueAll].concat(this.departmentList);
      this.departmentTooltip = this.departmentList;
    } else if(this.selectedDepartments.length === this.departmentList.length && this.selectedDepartments[0] === this.valueAll) {
      this.selectedDepartments = this.selectedDepartments.slice(1);
      this.departmentTooltip = this.selectedDepartments;
    } else {
      this.departmentTooltip = this.selectedDepartments;
    }
    // Resetting instrument filter on department selection change
    this.selectedInstruments = [];
    // Populating labInstrumentList again based on department selections
    this.labInstrumentList = [];
    if (this.selectedDepartments.length > 0 && this.selectedDepartments[0].displayName === this.valueAll.displayName) {
      this.labInstrumentList = this.labInstrumentListArray;
      this.selectedInstruments = [this.valueAll].concat(this.labInstrumentListArray);
    } else {
      this.selectDepartment = true;
      this.filterInstrumentArray = [];
      this.selectedDepartments.forEach(department=>{
        let tempLabInstrumentArray: NameId[] = [];
        let selectedDepartmentData = this.labLocationChildren.filter(item => item.id === department.id)
        selectedDepartmentData.forEach(filterInstrument => {
          if(filterInstrument.children && filterInstrument.children.length > 0) {
            filterInstrument.children
              .filter(nodeItem => Utility.hasAnalyteLevelNode(nodeItem))
              .forEach(labInstrument => {
                let insData = new NameId();
                insData.displayName = labInstrument.displayName;
                insData.id = labInstrument.id;
                tempLabInstrumentArray.push(insData);
            });
          }
        });
        tempLabInstrumentArray.sort((a, b) => (a.displayName < b.displayName ? -1 : 1));
        this.filterInstrumentArray.push(...tempLabInstrumentArray);
      });
      this.labInstrumentList.push(...this.filterInstrumentArray);
      this.selectDepartment = true;
    }
    this.selectedInstruments = this.selectedDepartments.length? [this.valueAll].concat(this.labInstrumentList) : [];
    //Updating instrument tooltip and etc by calling this function
    this.changeFilterInstrument();
  }

  changeFilterPanel() {
    this.isResetDisabled = false;
    
    //Disabling Department and Instrument filters
    if (!this.isDisabledDepartment || !this.isDisabledInstrument) {
      this.isDisabledDepartment = true;
      this.isDisabledInstrument = true;
    }
    //Resetting the department and instrument filters become empty
    this.selectedDepartments = [];
    this.selectedInstruments = [];

    //Resetting tooltips
    this.updateTooltips();

    if(this.selectedPanels.length === this.panelItemList.length && this.selectedPanels[0] !== this.valueAll){
      this.selectedPanels = [this.valueAll].concat(this.panelItemList);
    } else if(this.selectedPanels.length === this.panelItemList.length && this.selectedPanels[0] === this.valueAll) {
      this.selectedPanels = this.selectedPanels.slice(1);
      this.panelTooltip = this.selectedPanels;
    } else {
      this.panelTooltip = this.selectedPanels[0] != this.valueAll ? this.selectedPanels: this.panelItemList;
    }

    //Resetting isViewItemsDisabled
    if(JSON.stringify(this.perviousFilterValues) === JSON.stringify([...this.selectedDepartments,...this.selectedInstruments, ...this.selectedPanels]) || 
      this.selectedPanels.length === 0) {
      this.isViewItemsDisabled = true;
    } else {
      this.isViewItemsDisabled = false;
    }
  }

  changeFilterInstrument() {
    //To reset filter to default value when empty
    if(this.selectedInstruments.length === this.labInstrumentList.length && this.selectedInstruments[0] !== this.valueAll && this.selectedDepartments.length > 0){
      this.selectedInstruments = [this.valueAll].concat(this.labInstrumentList);
    } 
    if(this.selectedInstruments.length === this.labInstrumentList.length && this.selectedInstruments[0] === this.valueAll) {
      this.selectedInstruments = this.selectedInstruments.slice(1);
    }
    if(this.selectedInstruments[0] === this.valueAll) {
      this.instrumentTooltip = this.labInstrumentList;
    } else {
      this.instrumentTooltip = this.selectedInstruments;
    }
    //Resetting isViewItemsDisabled
    if(JSON.stringify(this.perviousFilterValues) === JSON.stringify([...this.selectedDepartments,...this.selectedInstruments, ...this.selectedPanels]) || 
        !this.isDisabledDepartment && this.selectedDepartments.length === 0 || 
        !this.isDisabledInstrument && this.selectedInstruments.length === 0 ) {
      this.isViewItemsDisabled = true;
    } else {
      this.isViewItemsDisabled = false;
    }
  }

  getCalculatedCV(sd: number, mean: number): number {
    return Utility.calculateCV(sd, mean);
  }

  // Load the data review list and map the pagination configuration
  private loadDataReviewList(unReviewedDataRequest: UnReviewedDataRequest) {
    const pageNumber = unReviewedDataRequest.paginationParams.pageIndex || 0;
    unReviewedDataRequest.paginationParams.pageIndex = pageNumber;
    this.dataReviewTableResults = null;

    // Updating isSupervisorReview
    this.store.dispatch(dataReviewActions.UpdateDataReviewInfo({
      payload: {
        isSupervisorReview: this.reviewType === ReviewType.Supervisor
      }
    }));

    // Clear previous page notifications
    this.notificationSubject$.next(true);

    // Toggle out of edit mode
    if (this.isEditingRun) {
      this.toggleEditRun(null);

      if (this.isUpdatingRun) {
        this.isUpdatingRun = false;
        this.dataManagementSpinnerService.displaySpinner(false);
      }
    }

    this.dataReviewApiService.getDataReviewData(unReviewedDataRequest)
      .pipe(take(1))
      .subscribe(unReviewedDataResponse => {
        this.missingTestsCount = unReviewedDataResponse?.missingTestsCount;
        let reviewData = unReviewedDataResponse?.results?.reviewData || [];
        this.filterCounts = unReviewedDataResponse?.counts;
        this.filterCountsNum = this.filterCounts;
        if (reviewData.length > 0) {
          // Setting allItemsReviewFlag to false as data is present
          this.allItemsReviewFlag = false;
          // Populate/update runReviewItems array which tracks the selections of runs across all pages.
          unReviewedDataResponse.results.runIdsOfAllPages.forEach(runId => {
            if (!this.runReviewItems.find(runReviewItems => runReviewItems.runId === +runId)) {
              const runReviewSelection = new RunReviewSelection();
              runReviewSelection.runId = +runId;
              runReviewSelection.selected = false;
              this.runReviewItems.push(runReviewSelection);
            }

            // Remove review data runs that are not found in runIdsOfAllPages.
            for (let i = 0; i < this.runReviewItems.length; i++) {
              if (!unReviewedDataResponse.results.runIdsOfAllPages.find(runId => this.runReviewItems[i].runId === +runId)) {
                this.runReviewItems.splice(i, 1);
              }
            }

            // Enable reviewed button if there are any selections of runs in any of the pages.
            this.isReviewedButtonEnabled = this.hasReviewSelections();
          });

          for (const item of reviewData) {
            if (item.results) {
              for (const data of item.results) {
                data.reasons = this.runsService.convertReasons(data);
                data.resultStatus = this.runsService.extractResultStatus(data);
              }

              item.addedBy = this.getAddedByUser(item);
            }
          }
        } else {
          this.dataReviewResults = reviewData;
          this.dataReviewTableResults = [];
          if(this.refreshResultFlag) {
            this.noNewResultFlag =true;
          }
          if(this.selectedAllRunAllPage || this.selectedAllRunCurrentPage) {
            this.allItemsReviewFlag =true;
            this.openMissingTestsPopUp();
          }
        }
        this.totalCount = unReviewedDataResponse?.results?.totalItems;
        this.setInitForm(reviewData);
        this.tempReviewResults = reviewData;
        this.paginationConfig.itemsPerPage = this.paginationConfig.itemsPerPage;
        this.totalPages = unReviewedDataResponse.results.totalPages;
        this.paginationConfig.totalItems = unReviewedDataResponse.results.totalItems;
        this.paginationConfig.currentPage = this.paginationConfig.currentPage <= this.totalPages ? this.paginationConfig.currentPage : 1;

        let labTestIds = reviewData.map(rd => rd.labTestId);
        labTestIds = [...new Set(labTestIds)];
        this.subscribeToNotification(labTestIds);
        this.getAuditHistory(labTestIds);
      }, error => {
        this.dataReviewTableResults = [];
        this.runReviewItems = [];

        if (error.error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              (componentInfo.DataReviewComponent + blankSpace + Operations.GetDataReviewData)));
        }
        this.messageSnackBar.showMessageSnackBar(this.getTranslation('DATAREVIEW.LOADDATAREVIEWLISTERROR'));
      });
  }

  private flattenDataReviewResultsByLevelResult(dataReviewResults: Array<ReviewData>): Array<ReviewDataTableResult> {
    let dataReviewTableResults = new Array<ReviewDataTableResult>();
    let departmentId: string;
    let labInstrumentId: string;
    let labProductId: string;

    if (dataReviewResults && dataReviewResults.length) {
      for (let i = 0, len = dataReviewResults.length; i < len; i++) {
        const reviewDataItem = dataReviewResults[i];
        if (reviewDataItem.results && reviewDataItem.results.length) {
          const reviewDataResults = reviewDataItem.results;
          let placeholderRows = 0;
          
          if (reviewDataResults.length < 3) {
            placeholderRows = 3 - reviewDataResults.length;
          }

          // Add header if hierarchy changes
          if (reviewDataItem.departmentId !== departmentId || reviewDataItem.labInstrumentId !== labInstrumentId || reviewDataItem.labProductId !== labProductId) {
            const dataReviewTableResult: ReviewDataTableResult = cloneDeep(reviewDataItem);
            dataReviewTableResult.isHeaderRow = true;
            dataReviewTableResult.headerLotExpirationDate = moment(dataReviewTableResult.lotExpiringDate).tz(this.labTimeZone).format('MMM DD YYYY');
            dataReviewTableResults.push(dataReviewTableResult);

            departmentId = reviewDataItem.departmentId;
            labInstrumentId = reviewDataItem.labInstrumentId;
            labProductId = reviewDataItem.labProductId;
          }

          for (let j = 0, lenLevelResults = reviewDataResults.length; j < lenLevelResults; j++) {
            const dataReviewTableResult: ReviewDataTableResult = cloneDeep(reviewDataItem);
            dataReviewTableResult.rowNum = i;
            dataReviewTableResult.levelResult = reviewDataResults[j];
            dataReviewTableResult.isPlaceholderRow = false;
            if (j === 0) {
              dataReviewTableResult.rowSpan = lenLevelResults + placeholderRows;
            }
            dataReviewTableResult.resultIndex = j;
            dataReviewTableResults.push(dataReviewTableResult);
          }

          for (let k = 0; k < placeholderRows; k++) {
            const dataReviewTableResult: ReviewDataTableResult = cloneDeep(reviewDataItem);
            dataReviewTableResult.rowNum = i;
            dataReviewTableResult.isPlaceholderRow = true;
            dataReviewTableResults.push(dataReviewTableResult);
          }
        }
      }
    }

    return dataReviewTableResults;
  }

  public isPlaceholderRow(index: number, row: ReviewDataTableResult) : boolean {
    return row.isPlaceholderRow && !row.isHeaderRow;
  }

  public isNotPlaceholderRow(index: number, row: ReviewDataTableResult) : boolean {
    return !row.isPlaceholderRow && !row.isHeaderRow;
  }

  public isHeaderRow(index, row: ReviewDataTableResult): boolean{
    return row.isHeaderRow;
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  setInitForm(reviewData: Array<ReviewData>) {
    // Add form group for each run for tracking their respective form fields to the form array
    let reviewDataFormGroup: Array<FormGroup> = [];

    if (reviewData && reviewData.length > 0) {
      for (let i = 0; i < reviewData.length; i++) {
        const runId = reviewData[i].id;
        // Initialize form items based on runReviewItems array.
        const runReviewSelection = this.runReviewItems
          .find(runReviewSelection => runReviewSelection.runId === +runId);
          
        reviewDataFormGroup.push(
          this.formBuilder.group({
            runId: [runId],
            selectedRun: [runReviewSelection && runReviewSelection.selected],
            action: [runReviewSelection ? runReviewSelection.userAction : null],
            comment: [runReviewSelection ? runReviewSelection.userComment : null]
          })
        );
      }
    }

    this.selectedForReview = this.formBuilder.array(reviewDataFormGroup);
    // Initialize main form group of table
    this.formGroup = this.formBuilder.group({
      selectedForReview: this.selectedForReview
    });
    // Apply permissions to form for view-only access for CTS User
    if (!this.hasPermissionToAccess([this.permissions.BenchReview, this.permissions.SupervisorReview])) {
      this.formGroup.disable();

      // Enable action list for viewing by CTS user
      (this.formGroup.get('selectedForReview') as FormArray).controls.forEach(selectedForReviewItem => {
        selectedForReviewItem.get('action').enable();
      });
    }

    // Synchonize runReviewSelections with the current form state
    this.formGroup.valueChanges.pipe(
      debounceTime(100),
      takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val && val.selectedForReview && val.selectedForReview.length > 0) {
          val.selectedForReview.forEach(val => {
            const runReviewSelection = this.runReviewItems.find(runReviewSelection => runReviewSelection.runId === val.runId);
           
            if (runReviewSelection) {
              runReviewSelection.selected = val[this.selectedRunField];
              runReviewSelection.userAction = val[this.actionField] || null;
              runReviewSelection.userComment = val[this.commentField] || null;
            }
          });
        }
        this.itemsSelected = this.totalRunsSelectedForAll();

        // Enable reviewed button if there are any selections of runs in any of the pages.
        this.isReviewedButtonEnabled = this.hasReviewSelections();
      });

    if (this.hasPermissionToAccess([this.permissions.BenchReview, this.permissions.SupervisorReview])) {
      this.setupChangeTracker();

      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.setupChangeTracker();
      });
    }
  }

  hasReviewSelections(): boolean {
    return this.runReviewItems.some(runReviewItem => runReviewItem.selected);
  }

  reviewSelectedRunReviews(customActionAfterReview: Function) {
    this.isSubmittingReview = true;
    const reviewDataRequest = new ReviewDataRequest();

    const runReviews = this.runReviewItems
      .filter(runReviewItem => runReviewItem.selected)
      .map(runReviewItem => {
        let runReview = new RunReview();
        runReview.runId = runReviewItem.runId;
        runReview.userAction = runReviewItem.userAction;
        runReview.userComment = runReviewItem.userComment;
        return runReview;
      });
    
    const auditTrailPayload = this.appNavigationService.createAuditTrailPayload({"runReviews":[...runReviews]},
      AuditTrackingEvent.DataReview, AuditTrackingAction.Review, AuditTrackingActionStatus.Success, AuditTrackingAction.Review);
    const auditTrailFinalPayload = this.appNavigationService.prepareAuditTrailPayload(auditTrailPayload);

    reviewDataRequest.reviewType = this.reviewType;
    reviewDataRequest.runReviews = runReviews;
    reviewDataRequest.auditDetails = auditTrailFinalPayload;

    this.dataReviewApiService.reviewData(reviewDataRequest)
      .pipe(
        finalize(() => {
          this.isSubmittingReview = false;
        }),
        take(1)
      )
      .subscribe(
        () => {
          this.itemsSelected = 0;
          this.changeTrackerService.resetDirty();
          if (customActionAfterReview) {
            customActionAfterReview();
          } else {
            this.loadDataReviewList(this.unReviewedDataRequest);
            this.scrollTop();
          }
          this.usercomments = [];
          this.correctiveAction = [];
        },
        err => {
          this.changeTrackerService.setDirty();
          if (err.error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.HTTP, err.stack, err.message,
                (componentInfo.DataReviewComponent + blankSpace + Operations.ReviewData)));
          }
          this.messageSnackBar.showMessageSnackBar(this.getTranslation('DATAREVIEW.LOADDATAREVIEWLISTERROR'));
        });
  }

  eventHandler(event) {
    const visibleColumns = Object.values(event) as Array<string>;
    this.updateVisibleColumns(visibleColumns);
  }

  additionalEventHandler(event) {
    const last30DaysEnabled = event.find(filterValue => filterValue.filterType === ReviewFilterTypes.Last30Days).include;
    const violationsEnabled = event.find(filterValue => filterValue.filterType === ReviewFilterTypes.Violations).include;
    this.filterTypes.find(filterValue => filterValue.filterType === ReviewFilterTypes.Violations).include = violationsEnabled;
    this.filterTypes.find(filterValue => filterValue.filterType === ReviewFilterTypes.Last30Days).include = last30DaysEnabled;
    
    if(violationsEnabled) {
      this.filterTypes.forEach(filter => {
        if(filter.filterType === ReviewFilterTypes.Warning || filter.filterType === ReviewFilterTypes.Rejected || filter.filterType === ReviewFilterTypes.Violations) {
          filter.include = true;
        } else if(filter.filterType === ReviewFilterTypes.Accepted || filter.filterType === ReviewFilterTypes.ActionAndComments) {
          filter.include = false;
        }
      });
    } else {
      let selectedFilters = this.filterTypes.filter(filter=>(filter.include === true) && (filter.filterType != ReviewFilterTypes.Last30Days));
      if(selectedFilters.map(filter=>filter.filterType).includes(ReviewFilterTypes.Warning) && selectedFilters.map(filter=>filter.filterType).includes(ReviewFilterTypes.Rejected) && selectedFilters.length === 2) {
      this.filterTypes.find(filterValue => filterValue.filterType === ReviewFilterTypes.Warning).include = false;
      this.filterTypes.find(filterValue => filterValue.filterType === ReviewFilterTypes.Rejected).include = false;
      }
    }
    this.unReviewedDataRequest.reviewFilters  = this.filterTypes;
    this.onDataReviewPageChange(1);
  }

  showDisplayColumn() {
    this.displayedColumns = ['checkDataColumn', 'Analyte', 'Date', 'settings'];
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

  private getAuditHistory(labTestIds: Array<string>) {
    // Get History data from Audit Trail
    const labTestHistoryRequests = [];

    if (labTestIds && labTestIds.length) {
      labTestIds = [...new Set(labTestIds)];    // Distinct ids
      labTestIds.forEach(labTestId => {
        labTestHistoryRequests.push(this.appNavigationService.getDataTableATHistory(labTestId));
      });

      const usersOktaIds = [];
      const fetchUserRequests: Array<Observable<Array<User>>> = [];

      forkJoin(...labTestHistoryRequests)
        .pipe(
          filter(labTestHistory => !!labTestHistory),
          mergeMap((labTestHistories: Array<ReviewSummaryHistory>) => {
            labTestHistories.forEach(labTestHistory => {
              Object.entries(labTestHistory).forEach(([runId, runHistory]) => {
                runHistory.forEach(history => {
                  if (!!history.oktaId && usersOktaIds.indexOf(history.oktaId) === -1) {
                    usersOktaIds.push(history.oktaId);
                  }

                  this.historyData[history.auditTrail.device_id] = labTestHistory;
                });
              });
            });

            usersOktaIds.forEach(oktaId => {
              fetchUserRequests.push(this.portalApiService.searchLabSetupNode(User, oktaId, false));
            });

            return fetchUserRequests.length > 0 ? forkJoin(fetchUserRequests) : of([]);
          }),
          take(1),
        ).subscribe(userLists => {
          userLists.flat().forEach(userData => {
            this.fetchedUsers.push(userData);
          });
          Object.entries(this.historyData).forEach(([labTestId, reviewSummaryHistory]) => {
            Object.entries(reviewSummaryHistory).forEach(([runId, appNavigationTrackingList]) => {
              appNavigationTrackingList.forEach(appNavigationTracking => {
                const user = this.fetchedUsers.find(userHistory => userHistory.userOktaId === appNavigationTracking.oktaId);
                appNavigationTracking.userName = user ? `${user.firstName} ${user.lastName}` : '';
              });
            });
          });

          this.getHistoryCount();
        }, err => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.DataReviewComponent + blankSpace + Operations.LoadRunHistory)));
        });
    }
  }

  openReviewSummaryDialog(event, reviewData: ReviewData): MatDialogRef<BrReviewSummaryComponent> {
    let dialogRef: MatDialogRef<BrReviewSummaryComponent>;
    try {
      const runDateTime = reviewData.runDateTime;
      event.stopPropagation();
      dialogRef = this.dialog.open(BrReviewSummaryComponent, {
        panelClass: 'cdk-review-summary',
        backdropClass: 'cdk-overlay-review-summary',
        data: {
          reviewData: this.generateReviewSummary(reviewData),
          dateTimeData: { dateDayTime: runDateTime }
        }
      });
      dialogRef.afterClosed().pipe(take(1)).subscribe();
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.DataReviewComponent + blankSpace + Operations.OpenReviewSummaryDialog));
    }

    return dialogRef;
  }

  private generateReviewSummary(runRow: ReviewData): ReviewSummary {
    const reviewSummary: ReviewSummary = {
      levelSummaries: new Array<LevelSummary>(),
      actions: new Array<PezContent>(),
      comments: new Array<PezContent>(),
      interactions: new Array<PezContent>()
    };

    reviewSummary.actions = this.extractActions(runRow);
    reviewSummary.comments = this.extractComments(runRow);
    reviewSummary.interactions = runRow.interactions;

    return reviewSummary;
  }

  private extractActions(runRow: ReviewData): Array<PezContent> {
    const actions: Array<PezContent> = new Array<PezContent>();

    if (runRow.userActions != null) {
      runRow.userActions.forEach(runAction => {
        const timeZoneOffset = this.dateTimeHelper.getTimeZoneOffset(runAction.enterDateTime, this.labTimeZone);

        const action: PezContent = {
          userName: runAction.userFullName,
          dateTime: runAction.enterDateTime,
          text: runAction.actionName,
          pezDateTimeOffset: timeZoneOffset
        };
        actions.push(action);
      });
    }

    return actions;
  }

  private extractComments(runRow: ReviewData): Array<PezContent> {
    const comments: Array<PezContent> = new Array<PezContent>();

    if (runRow.userComments != null) {
      runRow.userComments.forEach(runComment => {
        const timeZoneOffset = this.dateTimeHelper.getTimeZoneOffset(runComment.enterDateTime, this.labTimeZone);

        const comment: PezContent = {
          userName: runComment.userFullName,
          dateTime: runComment.enterDateTime,
          text: runComment.content,
          pezDateTimeOffset: timeZoneOffset
        };
        comments.push(comment);
      });
    }

    return comments;
  }

  getRunHistory(runRow: ReviewData): ReviewSummaryHistory {
    const reviewHistory = this.historyData ? this.historyData[runRow.labTestId] : null;
    return reviewHistory ?
      Object.keys(reviewHistory)
        .filter(key => key.includes(runRow.id))
        .reduce((obj, key) => {
          return Object.assign(obj, {
            [key]: reviewHistory[key]
          });
        }, {}) : null;
  }

  getHistoryCount() {
    this.tempReviewResults.forEach((run) => {
      if (!!run.id) {
        const runHistory = this.getRunHistory(run);

        if (runHistory) {
          const levelData = cloneDeep(runHistory[run.id]);
          levelData?.forEach((val) => {
            val.auditTrail.currentValue.levelData?.forEach((result) => {
              result.resultValue = this.unityNextNumericPipe.transform(result.resultValue);
            });
          });

          run.interactions = this.dataManagementService.extractInteractions(levelData, this.labTimeZone);
        } else {
          run.interactions = new Array<PezContent>();
        }

        const addedDataLabel = this.dataManagementService.staticTranslate('HISTORYMESSAGES.ADDED');
        const reviewedDataLabel = this.dataManagementService.staticTranslate("DATAREVIEW.BENCHREVIEWEDBY");
        const supevisorReviewedDataLabel = this.dataManagementService.staticTranslate("DATAREVIEW.SUPERVISORREVIEWEDBY");
        const hasAddedDataItem = run.interactions.some(runInteraction => runInteraction.text.indexOf(addedDataLabel) >= 0);

        if (run.userInteractions && run.userInteractions.length) {
          run.interactions = run.interactions.concat(run.userInteractions
            .filter(userInteraction => userInteraction && ((String(userInteraction.interactionType) === addedBy && !hasAddedDataItem)
              || String(userInteraction.interactionType) === benchReviewedBy || String(userInteraction.interactionType) === supervisorReviewedBy))
            .map(userInteraction => {
              const interaction = new PezContent();
              let interactionText: string;

              interaction.dateTime = userInteraction.enterDateTime;
              interaction.pezDateTimeOffset = this.dateTimeHelper.getTimeZoneOffset(userInteraction.enterDateTime, this.labTimeZone);

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

        if (run.interactions && run.interactions.length) {
          run.userInteractions = run.interactions.map(interactionItem => {
            const userInteraction = new UserInteraction();
            userInteraction.enterDateTime = interactionItem.dateTime;
            userInteraction.userFullName = interactionItem.userName;
            userInteraction.content = interactionItem.text;
            return userInteraction;
          });
        }
      }
    });

    this.dataReviewTableResults = this.flattenDataReviewResultsByLevelResult(this.tempReviewResults);
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  onDataReviewPageChange(dataReviewPageIndex: number) {
    this.paginationConfig.currentPage = dataReviewPageIndex;
    this.unReviewedDataRequest.paginationParams.pageIndex = dataReviewPageIndex - 1;
    this.loadDataReviewList(this.unReviewedDataRequest);
    this.scrollTop();
  }

  totalRunsSelectedForAll(): number {
    let count = 0;
    this.runReviewItems.forEach(runItem => {
      if(runItem.selected == true) {
        count++;
      }
    });
    return count;
  }

   //to show check mark on UI for selected run items(working on current and all select functionality)
  applySelectAll(value) {
    (this.formGroup.get('selectedForReview') as FormArray).controls.forEach((control, index) => {
      control.patchValue({
        selectedRun: value
      });
    })
    this.itemsSelected = this.totalRunsSelectedForAll();
  }

  selectAllAnalyteRunsOnCurrentPage() {
    this.selectedAllRun = false;
    this.runReviewItems.forEach(runItem => runItem.selected = false);
    this.applySelectAll(true);
    this.selectedAllRunCurrentPage = true;
  }

  selectAllAnalyteRunsOnAllPages() {
    this.runReviewItems.forEach(runItem => runItem.selected = true);
    this.selectionFlag(true);
    this.selectedAllRunAllPage = true;
    this.itemsSelected = this.totalRunsSelectedForAll();
  }

  selectionFlag(value) {
    this.selectedAllRun = value;
    this.applySelectAll(value);
  }

  selectAllCheckboxChange(event: MatCheckboxChange): void {
    if (!event.checked) {
      if (this.selectedAllRunAllPage) {
        this.selectionFlag(false);
        this.runReviewItems.forEach(runItem => runItem.selected = false);
        this.itemsSelected = this.totalRunsSelectedForAll();
      }
    }
  }

  //Dashboard Navigation
  public goToDashboard() {
    this.navigationService.navigateToDashboard(this.labLocationId);
  }
  refreshResults() {
    this.loadDataReviewList(this.unReviewedDataRequest);
    this.scrollTop();
    this.refreshResultFlag = true;
  }

  onClickFiltersDebounceTime() {
    this.onDataReviewPageChange(1);  // load data
  }

  onClickFilters(filterTypes: ReviewFilter) {
    filterTypes.include = !filterTypes.include;
    this.filterTypes.find(filterValue => filterValue.filterType === filterTypes.filterType).include = filterTypes.include;
    let selectedFilters = this.filterTypes.filter(filter=>(filter.include === true) && (filter.filterType != ReviewFilterTypes.Last30Days));    
    if(selectedFilters.map(filter=>filter.filterType).includes(ReviewFilterTypes.Warning) && selectedFilters.map(filter=>filter.filterType).includes(ReviewFilterTypes.Rejected) && selectedFilters.length === 2) {
      this.filterTypes.find(filterValue => filterValue.filterType === ReviewFilterTypes.Violations).include = true;
      this.additionalFilterComponent.formValueReset(true);
    } else {
      this.filterTypes.find(filterValue => filterValue.filterType === ReviewFilterTypes.Violations).include = false;  
      this.additionalFilterComponent.formValueReset(false);
    }
    const sortParams = this.filterTypes.filter(type => type.include);
    this.unReviewedDataRequest.reviewFilters = this.filterTypes;
    this.btnClick.next();
  }

  setupChangeTracker(): void {
    const me = this;

    me.formChangesSubscription = me.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          const isAnyRunSelected = (this.formGroup.get('selectedForReview') as FormArray).controls.some(selectedForReviewItem =>
            selectedForReviewItem.get('selectedRun').value
          );
          if (isAnyRunSelected) {
            me.changeTrackerService.setDirty();
          } else {
            me.changeTrackerService.resetDirty();
          }
        }
      );

    this.changeTrackerService.customTitle = this.getTranslation("DATAREVIEW.CHANGETRACKERTITLE");
    this.changeTrackerService.customSubTitle = this.getTranslation("DATAREVIEW.CHANGETRACKERSUBTITLE");
    this.changeTrackerService.customConfirmButtonText = this.getTranslation("DATAREVIEW.CHANGETRACKERCONFIRMTITLE");
    this.changeTrackerService.customCancelButtonText = this.getTranslation("DATAREVIEW.CHANGETRACKERCANCELTITLE");
    this.changeTrackerService.showConfirmButtonFirst = true;
    this.changeTrackerService.customWidth = 600;

    this.changeTrackerService.setOkAction(function () {
      me.reviewSelectedRunReviews(function () {
        me.changeTrackerService.resetDirty();
        me.changeTrackerService.dialog.closeAll();
        me.changeTrackerService.canDeactivateSubject.next(true);
      });
    });
  }

  /** function to get user review prefernces */
  getUserReviewPreferences() {
    const user = this.authService.getCurrentUser();
    this.dataReviewApiService.getUserReviewPreferences(user?.id)
      .pipe(take(1))
      .subscribe(userReviewPreferences => {
        this.savePreferenceData = userReviewPreferences;
        Object.entries(userReviewPreferences).forEach(([key, value], i) => {
          const checkboxvalue: DisplayColumn = {
            columnName: `${key}`,
            id: i,
            isChecked: value
          };
          this.savePreferenceArray.push(checkboxvalue);
          if (value === true) {
            this.getCheckedColName.push(`${key}`);
          }
        });
        this.getCheckedColName.forEach((item) => {
          item = this.dataReviewApiService.dataColumnsHandler(item);

          if (item !== this.analyteColumnName) {
            this.getCheckedCheckBox.push(item);
          }
        });
        this.savePreferenceLayers.push(this.savePreferenceArray);
        this.updateVisibleColumns(this.getCheckedCheckBox);
      }, error => {
        if (error.error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              (componentInfo.DataReviewComponent + blankSpace + Operations.GetDataReviewData)));
        }
        this.messageSnackBar.showMessageSnackBar(this.getTranslation('DATAREVIEW.LOADDATAREVIEWLISTERROR'));
      });
  }

  updateVisibleColumns(visibleColumns: Array<string>) {
    const dataResultsColumns = [];
    if (visibleColumns && visibleColumns.length) {
      this.isDateColumnVisible = visibleColumns.indexOf(this.dateColumnName) >= 0;
      if (this.isDateColumnVisible) {
        dataResultsColumns.push(this.dateColumnName);
      }

      this.isTimeColumnVisible = visibleColumns.indexOf(this.timeColumnName) >= 0;
      if (this.isTimeColumnVisible) {
        dataResultsColumns.push(this.timeColumnName);
      }

      this.isLevelColumnVisible = visibleColumns.indexOf(this.levelColumnName) >= 0;

      if (this.isLevelColumnVisible) {
        dataResultsColumns.push(this.levelColumnName);
      }

      this.isResultsColumnVisible = visibleColumns.indexOf(this.resultsColumnName) >= 0;

      if (this.isResultsColumnVisible) {
        dataResultsColumns.push(this.resultsColumnName);
      }

      this.isZscoreColumnVisible = visibleColumns.indexOf(this.zScoreColumnName) >= 0;

      if (this.isZscoreColumnVisible) {
        dataResultsColumns.push(this.zScoreColumnName);
      }

      this.isRulesColumnVisible = visibleColumns.indexOf(this.rulesColumnName) >= 0;

      if (this.isRulesColumnVisible) {
        dataResultsColumns.push(this.rulesColumnName);
      }

      this.isEvalMeanColumnVisible = visibleColumns.indexOf(this.evalMeanColumnName) >= 0;

      if (this.isEvalMeanColumnVisible) {
        dataResultsColumns.push(this.evalMeanColumnName);
      }

      this.isEvalSdColumnVisible = visibleColumns.indexOf(this.evalSdColumnName) >= 0;

      if (this.isEvalSdColumnVisible) {
        dataResultsColumns.push(this.evalSdColumnName);
      }

      this.isEvalCvColumnVisible = visibleColumns.indexOf(this.evalCvColumnName) >= 0;

      if (this.isEvalCvColumnVisible) {
        dataResultsColumns.push(this.evalCvColumnName);
      }

      this.isPeerMeanColumnVisible = visibleColumns.indexOf(this.peerMeanColumnName) >= 0;

      if (this.isPeerMeanColumnVisible) {
        dataResultsColumns.push(this.peerMeanColumnName);
      }

      this.isPeerSdColumnVisible = visibleColumns.indexOf(this.peerSdColumnName) >= 0;

      if (this.isPeerSdColumnVisible) {
        dataResultsColumns.push(this.peerSdColumnName);
      }

      this.isPeerCvColumnVisible = visibleColumns.indexOf(this.peerCvColumnName) >= 0;

      if (this.isPeerCvColumnVisible) {
        dataResultsColumns.push(this.peerCvColumnName);
      }

      this.isByColumnVisible = visibleColumns.indexOf(this.byColumnName) >= 0;

      if (this.isByColumnVisible) {
        dataResultsColumns.push(this.byColumnName);
      }

      this.isStatusColumnVisible = visibleColumns.indexOf(this.statusColumnName) >= 0;

      if (this.isStatusColumnVisible) {
        dataResultsColumns.push(this.statusColumnName);
      }
    }

    this.displayedColumns = ['checkDataColumn', 'Analyte', ...dataResultsColumns, 'settings'];
  }

  subscribeToNotification(labTestIds: Array<string>): void {
    if (labTestIds && labTestIds.length > 0) {
      labTestIds.forEach(labTestId => {
        this.notification.subscribeLabTestToHubWithoutUnsubscribePrevious(labTestId);
      });

      this.notification.$labTestStream
      .pipe(takeUntil(this.notificationSubject$))
      .subscribe(
        (data: UnityNotification) => {
          if (data && labTestIds.findIndex(labTestId => labTestId === data.correlationId) >= 0) {
            this.loadDataReviewList(this.unReviewedDataRequest);
          }
        }
      );
    }
  }

  toggleEditRun(run: ReviewData) {
    this.isEditingRun = !this.isEditingRun;
    this.runIdInEdit = this.isEditingRun ? run.id : null;
    this.runInEdit = this.isEditingRun ? cloneDeep(run) : null;

    if (this.isEditingRun) {
      this.formGroup.disable();
    } else if (this.hasPermissionToAccess([this.permissions.BenchReview, this.permissions.SupervisorReview])) {
      this.formGroup.enable();
    }
  }

  toggleAccepted($event: MatSlideToggleChange, runResult: PointDataResult) {
    runResult.isAccepted = $event.checked;
  }

  isEditRunFormChanged(): boolean {
    // Current run has original values before form changes.
    const currentRun = this.dataReviewTableResults.find(run => run.id === this.runInEdit.id);

    return currentRun && this.runInEdit.results.some((element, index) => {
      const currentRunResult = currentRun.results[index];
      return element.resultValue !== currentRunResult.resultValue || element.isAccepted !== currentRunResult.isAccepted;
    });
  }

  updateRun(originalRun: ReviewData, runInEdit: ReviewData) {
    this.isUpdatingRun = true;
    this.dataManagementSpinnerService.displaySpinner(true);
    const runData = new RunData();

    runData.id = runInEdit.id;
    runData.testSpecId = runInEdit.testSpecId;
    runData.correlatedTestSpecId = runInEdit.correlatedTestSpecId;
    runData.accountId = runInEdit.accountId;
    runData.accountNumber = runInEdit.accountNumber;
    runData.labId = runInEdit.labId;
    runData.labInstrumentId = runInEdit.labInstrumentId;
    runData.labProductId = runInEdit.labProductId;
    runData.labTestId = runInEdit.labTestId;
    runData.labUnitId = runInEdit.labUnitId;
    runData.labLocationTimeZone = this.labTimeZone;
    runData.runDateTime = runInEdit.runDateTime;
    runData.enteredDateTime = runInEdit.enteredDateTime;
    runData.dataType = runInEdit.dataType;
    runData.rawDataDateTime = runInEdit.rawDataDateTime;
    runData.localRawDataDateTime = runInEdit.localRawDataDateTime;
    runData.localRunDateTime = runInEdit.runDateTime;
    runData.upsertOptions = runInEdit.upsertOptions;
    runData.results = this.updateResults(runInEdit, runInEdit.results);
    this.updateLastModifiedDates(originalRun, runInEdit);

    runData.results.forEach(level => {
      level.resultValue =  Utility.normalizeToRationalNumber(level.resultValue);
    });

    runData.results = this.filterEmptyValueLevels(runInEdit);
    runData.userActions = [];
    runData.userComments = [];
    runData.userInteractions = [];

    this.labDataService.getRunDataByLabTestIdsAsync([runInEdit.labTestId])
    .then(data => {
      if (data.length > 0 && data[0].results && data[0].results.length > 0
        && data[0].id === runInEdit.id && runInEdit.upsertOptions === null) {
          runData.upsertOptions = new UpsertRequestOptions();
          runData.upsertOptions.forceRuleEngineReEval = true;
      }
    }, err => {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DataReviewComponent + blankSpace + Operations.GetLatestRunData)));
    })
    .catch(() => {
      this.isUpdatingRun = false;
      this.dataManagementSpinnerService.displaySpinner(false);
      this.messageSnackBar.showMessageSnackBar(this.getTranslation("DATAREVIEW.RESULTSCOULDNOTBEEDITED"));
    });

    if (this.isUpdatingRun) {
      this.runsService
      .putRunEditData(runData)
      .then((editedRunData: RunData) => {
        if (editedRunData) {
          this.logUpdateRunToAuditTrail(originalRun, runInEdit, AuditTrackingActionStatus.Success);
        }
      }, (err) => {
        this.logUpdateRunToAuditTrail(originalRun, runInEdit, AuditTrackingActionStatus.Failure);
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.DataReviewComponent + blankSpace + Operations.UpdateRunDataRecord)));
      })
      .catch(() => {
        this.isUpdatingRun = false;
        this.dataManagementSpinnerService.displaySpinner(false);
        this.messageSnackBar.showMessageSnackBar(this.getTranslation("DATAREVIEW.RESULTSCOULDNOTBEEDITED"));
      });
    }
  }

  private updateResults(
    initRunData: RunData,
    pointDataResults: Array<PointDataResult>
  ): Array<PointDataResult> {
    const updatedResults = new Array<PointDataResult>();

    pointDataResults.forEach(pointDataResult => {
      if (this.isLevelInResult(initRunData, pointDataResult.controlLevel)) {
        updatedResults.push(pointDataResult);
      } else {
        if (pointDataResult.resultValue !== null) {
          pointDataResult.measuredDateTime = new Date();
          pointDataResult.lastModified = new Date();
          updatedResults.push(pointDataResult);
        }
      }
    });

    return updatedResults;
  }

  private updateLastModifiedDates(initRunData: RunData, runData: RunData): void {
    const lastModifiedDate = new Date();

    initRunData.results.forEach(initLevelResult => {
      const newLevelResult = runData.results.find(result => result.controlLevel === initLevelResult.controlLevel);
      if (newLevelResult) {
        if (initLevelResult.resultValue !== newLevelResult.resultValue) {
          newLevelResult.lastModified = lastModifiedDate;
        } else {
          newLevelResult.lastModified = initLevelResult.lastModified;
        }
      }
    });
  }

  public isLevelInResult(initRunData: RunData, level: number): boolean {
    return initRunData.results.filter(result => result.controlLevel === level).length > 0;
  }
  
  private filterEmptyValueLevels(runData: RunData): Array<PointDataResult> {
    const levels: Array<PointDataResult> = [];
    runData.results.forEach(level => {
      if (level.resultValue !== null && level.resultValue.toString() !== '') {
        levels.push(level);
      }
    });

    return levels;
  }

  scrollTop() {
    if (this.dataReviewScrollRef && this.dataReviewScrollRef.directiveRef) {
      this.dataReviewScrollRef.directiveRef.scrollToTop();
    }
  }

  logUpdateRunToAuditTrail(originalRun: ReviewData, runInEdit: ReviewData, actionStatus: AuditTrackingActionStatus) {
    let currentPointValue: AuditTrailPriorCurrentValues;
    let priorPointValue: AuditTrailPriorCurrentValues;
    const currentLevelData: AnalyteLevelData[] = [];
    const priorPointAnalyte = originalRun.results;
    const priorLevelData: AnalyteLevelData[] = [];

    priorPointAnalyte.map(element => {
      const priorValueObj: AnalyteLevelData = {
        'resultValue': element.resultValue,
        'level': element.controlLevel,
        'isAccept': element.isAccepted,
      };
      priorLevelData.push(priorValueObj);
    });

    runInEdit.results.map(element => {
      const currentValueObj: AnalyteLevelData = {
        'resultValue': element.resultValue,
        'level': element.controlLevel,
        'isAccept': element.isAccepted,
      };
      currentLevelData.push(currentValueObj);
    });

    let date: any;
    date = moment(runInEdit.runDateTime);
    const selectedRunDate = date.tz(this.labTimeZone).format('MMM DD, YYYY');
    const selectedRunStringTimeAmPm = date.tz(this.labTimeZone).format('hh:mm A');

    currentPointValue = {
      'isReagentLot': false,
      'isCalibratorLot': false,
      'levelData': currentLevelData,
      'runDate': selectedRunDate,
      'runStringTime': selectedRunStringTimeAmPm,
      'restartFloat': false,
    };

    priorPointValue = {
      'isReagentLot': false,
      'isCalibratorLot': false,
      'levelData': priorLevelData,
      'runDate': selectedRunDate,
      'runStringTime': selectedRunStringTimeAmPm,
      'restartFloat': false
    };

    const auditNavigationPayload: AppNavigationTracking = this.appNavigationService.comparePriorAndCurrentValues
      (currentPointValue, priorPointValue, AuditTrackingAction.Update, AuditTrackingEvent.AnalyteDataTable,
        actionStatus);
    auditNavigationPayload.auditTrail.device_id = runInEdit.labTestId;
    auditNavigationPayload.auditTrail.run_id = runInEdit.id;

    if (auditNavigationPayload.auditTrail.currentValue.levelData?.length) {
      delete auditNavigationPayload.auditTrail.currentValue['levelData'];
      delete auditNavigationPayload.auditTrail.priorValue['levelData'];
      const resultLevelData = this.appNavigationService.currentPriorChangeValue(currentLevelData, priorLevelData);
      if (resultLevelData.currentValues?.length) {
        auditNavigationPayload.auditTrail.currentValue.levelData = resultLevelData.currentValues;
      }
      if (resultLevelData.priorValues?.length) {
        auditNavigationPayload.auditTrail.priorValue.levelData = resultLevelData.priorValues;
      }
    }

    this.appNavigationService.logAuditTracking(auditNavigationPayload, true);
  }

  public getAddedByUser(dataReviewResult: ReviewData): string {
    if (dataReviewResult.userInteractions && dataReviewResult.userInteractions.length) {
      const addedByItem = dataReviewResult.userInteractions.find(userInteration => /AddedBy/i.test(String(userInteration.interactionType)));

      if (addedByItem) {
        return addedByItem.userFullName;
      }
    }

    return '';
  }

  ngOnDestroy() {
    this.changeTrackerService.customTitle = null;
    this.changeTrackerService.customSubTitle = null;
    this.changeTrackerService.customConfirmButtonText = null;
    this.changeTrackerService.customCancelButtonText = null;
    this.changeTrackerService.showConfirmButtonFirst = false;
    this.changeTrackerService.customWidth = null;
    this.notificationSubject$.next(true);
    this.notificationSubject$.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
