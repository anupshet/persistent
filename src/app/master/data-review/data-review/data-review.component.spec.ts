// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OktaAuthService } from '@okta/okta-angular';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { cloneDeep } from 'lodash';
import { StoreModule } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { BrPezCell, BrReviewSummary, TransformValuePipe } from 'br-component-library';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { DataReviewComponent } from './data-review.component';
import * as fromRoot from '../state';
import { DataReviewService } from '../../../shared/api/data-review.service';
import * as mockData from '../../../../../db.json';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { UserAction } from '../../../contracts/models/codelist-management/user-action.model';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { DataManagementService } from '../../../shared/services/data-management.service';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../shared/locale/locale-converter.service';
import { UserRole } from '../../../contracts/enums/user-role.enum';
import { ReviewData, ReviewFilter, ReviewFilterTypes } from '../../../contracts/models/data-review/data-review-info.model';
import { DataManagementAction } from '../../../shared/services/data-management.action';
import { DataManagementSpinnerService } from '../../../shared/services/data-management-spinner.service';
import { ReviewSummary } from '../../../contracts/models/data-management/review-summary.model';
import { User } from '../../../contracts/models/user-management/user.model';
import { paginationDataReview } from '../../../core/config/constants/general.const';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';
import { AuthenticationService } from '../../../../app/security/services/authentication.service';
import { ResultStatus, RunData } from '../../../contracts/models/data-management/run-data.model';
import { LabDataApiService } from '../../../shared/api/labDataApi.service';
import { RunsService } from '../../../shared/services/runs.service';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { UnityNotification } from '../../../core/notification/interfaces/unity-notification';
import { HttpLoaderFactory } from '../../../app.module';
import { TransformZscorePipe } from '../../../shared/pipes/transform-values.pipe';
import { UnityDateTimeDisplayComponent } from '../../../shared/date-time/unity-datetime-display/unity-datetime-display.component';
import { UnityDateTimePipe } from '../../../shared/date-time/pipes/unity-date-time.pipe';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';
import { NodeInfoService } from '../../../shared/services/node-info.service';
import { NodeInfoAction } from '../../../shared/state/node-info.action';
import { UnityNextNumericPipe } from '../../../shared/date-time/pipes/unity-numeric.pipe';
import { SummaryStatisticsTableService } from '../../data-management/analyte-detail-table/analytical-section/summary-statistics-table/summary-statistics-table.service';
import { ConfigService } from '../../../core/config/config.service';
import { DynamicReportingService } from '../../../shared/services/reporting.service';
import { AdditionalFilterDialogComponent } from '../additional-filter-dialog/additional-filter-dialog.component';
import { UnityNextDatePipe } from '../../../shared/date-time/pipes/unity-next-date.pipe';


describe('DataReviewComponent', () => {
  let component: DataReviewComponent;
  let fixture: ComponentFixture<DataReviewComponent>;
  let sampleDataReview;
  let submitEl;
  let dialog: MatDialog;
  const unreviewedDataResponse = mockData.data;

  const mockCodelistApiService = {
    getUserActionsAsync() { return new Promise<Array<UserAction>>(null); }
  };

  const authServiceStub = {
    getCurrentUser: () => { },
    getMigrationState: () => { },
    logOut: () => {
      return of([]);
    },
  };

  const mockDataReviewService = {
    getDataReviewData: () => {
      return of(unreviewedDataResponse);
    },
    reviewData: () => {
      return of();
    },
    getUserReviewPreferences: () => {
      return of();
    },
    dataColumnsHandler: () => {
      return of();
    }

  };

  const formBuilder: FormBuilder = new FormBuilder();

  let hasPermission = false;

  const mockBrPermissionsService = {
    hasAccess: () => hasPermission,
  };

  const mockMessageSnackBarService = {
    showMessageSnackBar: () => {
      return {};
    }
  };
  
  const mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateToDashboard']);

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const userNode = {
    firstName: 'Sample',
    lastName: 'User',
    email: 'sample_user2@bio-rad.com',
    userOktaId: '00ujrhs678678678'
  } as User;

  let atHistory = null;

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    comparePriorAndCurrentValues: AppNavigationTrackingService.prototype.comparePriorAndCurrentValues,
    currentPriorChangeValue: AppNavigationTrackingService.prototype.currentPriorChangeValue,
    getDataTableATHistory: () => of(atHistory),
    createAuditTrailPayload: () => { },
    prepareAuditTrailPayload: () => { }
  };

  const mockLabDataApiService = {
    getRunDataByLabTestIdsAsync: () => of([new RunData()]).toPromise()
  };

  const mockRunsService = {
    putRunEditData: () => of(cloneDeep(component.runInEdit)).toPromise(),
    convertReasons: () => ['1-3s[R]'],
    extractResultStatus: () => ResultStatus.Reject
  };

  const mockNotification: UnityNotification = {
    correlationId: 'ac3a14d7-ec5c-4c21-8654-557c05b6680c',
    audienceType: 2,
    audienceKey: '2',
    notificationType: 'DataPointProcess',
    payload: {
      id: '',
      isSuccess: true
    },
    timeUtc: new Date(),
  };

  const mockNotificationService = {
    $labTestStream: new Subject<UnityNotification>(),
    subscribeLabTestToHubWithoutUnsubscribePrevious: () => { }
  };

  const mockTestSpecSummaryStatisticsTableService = {
      getSummaryStatsByLabMonthStatsInfoAndDate: () => of([]).toPromise()
  };

  const mockTestSpecDynamicReportingService = {
      getStatisticsPeerAndMethodData: () => of([]).toPromise()
  }

  const mockConfigService = {
    getConfig: (string): string => {
      return 'en-US';
    }
  };

  const mockCurrentLabLocation = {
    children: [],
    locationTimeZone: 'America/Los_Angeles',
    locationOffset: '',
    locationDayLightSaving: '',
    nodeType: 2,
    labLocationName: '',
    labLocationContactId: '',
    labLocationAddressId: '',
    labLocationContact: null,
    labLocationAddress: null,
    id: 'a1de4052-28a5-479f-b637-ef258e0e2578',
    parentNodeId: '',
    displayName: '',
    contactRoles: [UserRole.Technician, UserRole.LabSupervisor],
    locationSettings: {
      displayName: '',
      dataType: 1,
      instrumentsGroupedByDept: true,
      trackReagentCalibrator: false,
      fixedMean: false,
      decimalPlaces: 2,
      siUnits: false,
      labSetupRating: 0,
      labSetupComments: '',
      isLabSetupComplete: true,
      labSetupLastEntityId: 'null',
      id: '635b3412-679a-4201-97f4-c6df45bcfab6',
      parentNodeId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
      parentNode: null,
      nodeType: 9,
      children: null,
      isLabSetupCompleted: true
    },
    previousContactUserId: null
  };

  const mockDataReviewFeatureState = {
    isSupervisorReview: false
  };

  const mockOktaAuthService = jasmine.createSpyObj([
    'signInWithRedirect',
    'tokenManager'
  ]);

  const mockPortalApiService = {
    getLabSetupNode: () => of(mockCurrentLabLocation),
    searchLabSetupNode: () => of([userNode])
  };

  const mockLabLocationChildrenData = [
    {
      departmentName : "Dept A1",
      displayName : "Dept A1",
      id : "bae7f11c-6146-46dc-a226-327d7426838e",
      nodeType : 3,
      parentNodeId : "04f2fdd8-ae79-40bb-abf3-239cfc0ce682",
      children: [
        {
          displayName : 'AU5400',
          id : "bae7f11c-6146-46dc-a226-327d7426838e",
          nodeType : 3,
          parentNodeId : "04f2fdd8-ae79-40bb-abf3-239cfc0ce682",
        }
      ]
    },
    {
      departmentName : "Biochemistry1",
      displayName : "Biochemistry1",
      id : "bae7f11c-6146-46dc-a226-327d7426838f",
      nodeType : 4,
      parentNodeId : "04f2fdd8-ae79-40bb-abf3-239cfc0ce683",
      children: [
        {
          displayName : 'Instrument Example',
          id : "bae7f11c-6146-46dc-a226-327d7426838e",
          nodeType : 3,
          parentNodeId : "04f2fdd8-ae79-40bb-abf3-239cfc0ce682",
          children:[
            {
              id: "string",
              nodeType: 5,
              parentNodeId: "string",
              displayName: "string",
              levelSettings: null,
              accountSettings: null,
              hasOwnAccountSettings: false,
              isUnavailable: false,
              unavailableReasonCode: "string",
              isArchived: false,
              sortOrder: 1,
              permissions: null,
              reportCreate: "string",
              children: [
                {
                  id: "string",
                  nodeType: 6,
                  parentNodeId: "string",
                  displayName: "string",
                  levelSettings: null,
                  accountSettings: null,
                  hasOwnAccountSettings: false,
                  isUnavailable: false,
                  unavailableReasonCode: "string",
                  isArchived: false,
                  sortOrder: 1,
                  permissions: null,
                  reportCreate: "string"  
                }
              ]
            },
          ]
        },
        {
          displayName : 'Instrument Example 2',
          id : "bae7f11c-6146-46dc-a226-327d7426838e",
          nodeType : 3,
          parentNodeId : "04f2fdd8-ae79-40bb-abf3-239cfc0ce682",
          children:[
            {
              id: "string",
              nodeType: 5,
              parentNodeId: "string",
              displayName: "string",
              levelSettings: null,
              accountSettings: null,
              hasOwnAccountSettings: false,
              isUnavailable: false,
              unavailableReasonCode: "string",
              isArchived: false,
              sortOrder: 1,
              permissions: null,
              reportCreate: "string",
              children: [
                {
                  id: "string",
                  nodeType: 6,
                  parentNodeId: "string",
                  displayName: "string",
                  levelSettings: null,
                  accountSettings: null,
                  hasOwnAccountSettings: false,
                  isUnavailable: false,
                  unavailableReasonCode: "string",
                  isArchived: false,
                  sortOrder: 1,
                  permissions: null,
                  reportCreate: "string"  
                }
              ]
            },
          ]
        },
        {
          displayName : 'Instrument Example 3',
          id : "bae7f11c-6146-46dc-a226-327d7426838e",
          nodeType : 3,
          parentNodeId : "04f2fdd8-ae79-40bb-abf3-239cfc0ce682",
          children:[
            {
              id: "string",
              nodeType: 5,
              parentNodeId: "string",
              displayName: "string",
              levelSettings: null,
              accountSettings: null,
              hasOwnAccountSettings: false,
              isUnavailable: false,
              unavailableReasonCode: "string",
              isArchived: false,
              sortOrder: 1,
              permissions: null,
              reportCreate: "string",
              children: [
                {
                  id: "string",
                  nodeType: 6,
                  parentNodeId: "string",
                  displayName: "string",
                  levelSettings: null,
                  accountSettings: null,
                  hasOwnAccountSettings: false,
                  isUnavailable: false,
                  unavailableReasonCode: "string",
                  isArchived: false,
                  sortOrder: 1,
                  permissions: null,
                  reportCreate: "string"  
                }
              ]
            },
          ]
        }
      ]
    }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        MatTableModule,
        NgxPaginationModule,
        MatDialogModule,
        BrPezCell,
        BrReviewSummary,
        MatTooltipModule,
        MatMenuModule,
        StoreModule.forRoot(fromRoot.reducers),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        DataReviewComponent,
        TransformValuePipe,
        TransformZscorePipe,
        DecimalPipe,
        UnityDateTimeDisplayComponent,
        UnityDateTimePipe,
        UnityNextNumericPipe,
        UnityNextDatePipe
      ],
      providers: [
        { provide: CodelistApiService, useValue: mockCodelistApiService},
        { provide: DataReviewService, useValue: mockDataReviewService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: MessageSnackBarService, useValue: mockMessageSnackBarService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: AuthenticationService, useValue: authServiceStub },
        { provide: OktaAuthService, useValue: mockOktaAuthService },
        { provide: LabDataApiService, useValue: mockLabDataApiService },
        { provide: RunsService, useValue: mockRunsService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: MatDialogRef, useValue: {} },
        { provide: SummaryStatisticsTableService, useValue: mockTestSpecSummaryStatisticsTableService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: DynamicReportingService, useValue: mockTestSpecDynamicReportingService },
        DateTimeHelper,
        LocaleConverter,
        DataManagementSpinnerService,
        DataManagementAction,
        DataManagementService,
        ChangeTrackerService,
        TranslateService,
        DecimalPipe,
        AppLoggerService,
        NodeInfoService,
        NodeInfoAction
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataReviewComponent, AdditionalFilterDialogComponent],
    });
    fixture = TestBed.createComponent(DataReviewComponent);
    component = fixture.componentInstance;
    component.updateVisibleColumns([
      component.dateColumnName,
      component.timeColumnName,
      component.levelColumnName,
      component.resultsColumnName,
      component.zScoreColumnName,
      component.rulesColumnName,
      component.evalMeanColumnName,
      component.evalSdColumnName,
      component.byColumnName,
      component.statusColumnName
    ]);
    component.getCurrentLabLocation$ = of(mockCurrentLabLocation);
    component.getDataReviewFeatureState$ = of(mockDataReviewFeatureState);
    atHistory = {};
    hasPermission = true;
    fixture.detectChanges();
    submitEl = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Accepted Count values', () => {
    component.dataReviewTableResults = [];
    fixture.detectChanges();

    let acceptCount = fixture.debugElement.query(By.css('#acceptedCount'));
    expect(acceptCount.nativeElement.innerText).toEqual('55');

    const rejectedCount = fixture.debugElement.query(By.css('#rejectCount'));
    expect(rejectedCount.nativeElement.innerText).toEqual('16');

    const warningCount = fixture.debugElement.query(By.css('#warningCount'));
    expect(warningCount.nativeElement.innerText).toEqual('24');

    const actionAndCommentsCount = fixture.debugElement.query(By.css('#ActionCommentCount'));
    expect(actionAndCommentsCount.nativeElement.innerText).toEqual('19');
  });

  it('should display "No runs available for review" when the results are empty', () => {
    component.dataReviewTableResults = [];
    fixture.detectChanges();
    const noRunfound = fixture.debugElement.nativeElement.querySelector('#no-run-available');
    expect(noRunfound.innerText).toContain('DATAREVIEW.NORUNSAVAILABLEFORREVIEW');
  });

  it('should display "Loading runs..." message while results are being fetched', () => {
    const dataReviewTableResultsOriginal = component.dataReviewTableResults;
    component.dataReviewTableResults = null;
    fixture.detectChanges();

    let loadingRunsMessage = fixture.debugElement.nativeElement.querySelector('#spec_data_review_loading');
    expect(loadingRunsMessage).toBeDefined();
    expect(loadingRunsMessage.innerText).toContain('DATAREVIEW.LOADINGRUNS...');

    // Hide the message when runs are available
    component.dataReviewTableResults = dataReviewTableResultsOriginal;
    fixture.detectChanges();

    loadingRunsMessage = fixture.debugElement.nativeElement.querySelector('#spec_data_review_loading');
    expect(loadingRunsMessage).toBeNull();
  });

  it('should display analyte details in the review data results', () => {
    const noRunfound = fixture.debugElement.nativeElement.querySelector('#no-run-available');
    expect(noRunfound).toBeNull();
    const tableRows = fixture.debugElement.queryAll(By.css('.review-data'));
    const resultRows = component.dataReviewTableResults.filter(row => !row.isPlaceholderRow && !row.isHeaderRow);
    expect(tableRows.length).toBe(resultRows.length);
    for (let i = 0; i < tableRows.length; i++) {
      const tableRow = tableRows[i];

      if (resultRows[i].resultIndex === 0) {
        // Checkbox
        expect(tableRow.children[0].nativeElement.innerHTML).toContain('mat-checkbox');
     
        // Analyte details box
        const analyteName = tableRow.children[1].query(By.css('.analyte-name'));

        expect(analyteName.nativeElement.innerText.trim()).toBe(resultRows[i].analyteName.toUpperCase());
      
        const actionsItem = tableRow.children[1].query(By.css('.spc_pezcell_actions_number'));
        if (resultRows[i].userActions && resultRows[i].userActions.length > 0) {
          expect(actionsItem.nativeElement.innerText).toEqual(resultRows[i].userActions.length.toString());
        } else {
          expect(actionsItem).toBeNull();
        }
        const commentsItem = tableRow.children[1].query(By.css('.spc_pezcell_comments_number'));
        if (resultRows[i].userComments && resultRows[i].userComments.length > 0) {
          expect(commentsItem.nativeElement.innerText).toEqual(resultRows[i].userComments.length.toString());
        } else {
          expect(commentsItem).toBeNull();
        }

        const interactionsItem = tableRow.children[1].query(By.css('.spc_pezcell_interactions_number'));
        if (resultRows[i].userInteractions && resultRows[i].userInteractions.length > 0) {
          expect(interactionsItem.nativeElement.innerText).toEqual(resultRows[i].userInteractions.length.toString());
        } else {
          expect(interactionsItem).toBeNull();
        }

        const reagentLot = tableRow.children[1].query(By.css('.reagent_lot'));
        expect(reagentLot.nativeElement.innerText.trim()).toEqual(resultRows[i].reagentLotNumber);

        const calibratorLot = tableRow.children[1].query(By.css('.calibrator_lot'));
        expect(calibratorLot.nativeElement.innerText.trim()).toEqual(resultRows[i].calibratorLotNumber);
      }
    }
  });

  it('should display data rows', () => {
    const tableRows = fixture.debugElement.queryAll(By.css('.review-data'));
    let totalResultRows = 0;
    unreviewedDataResponse.results.reviewData.forEach(reviewData => {
      totalResultRows += reviewData.results.length;
    });
    const resultRows = component.dataReviewTableResults.filter(row => !row.isPlaceholderRow && !row.isHeaderRow);

    expect(tableRows.length).toBe(totalResultRows);

    tableRows.forEach((row, i) => {
      expect(row.nativeElement).toBeDefined();

      if (resultRows[i].resultIndex === 0) {
        expect(row.children).toHaveSize(component.displayedColumns.length);
        expect(row.children[1].nativeElement).toBeDefined();
        expect(row.children[1].nativeElement.innerText).toBeDefined();
      }

      if (i < 2) {
        const isRejected = row.nativeElement.innerHTML.indexOf('is-reject') >= 0;
        expect(isRejected).toBeTrue();
      }
    });
  });

  it('should hide the pagination controls when dataReview are not present or when only one dataReviewData page is present', () => {
    sampleDataReview = null;
    component.dataReviewTableResults = sampleDataReview;
    fixture.detectChanges();

    let paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();

    const pageData = {
      'id': paginationDataReview,
      'dataReviewTableResults': sampleDataReview,
      'pageIndex': 0,
      'totalPages': 1,
      'pageSize': 25
    };
    component.dataReviewTableResults = pageData.dataReviewTableResults;
    component.paginationConfig.currentPage = pageData.pageIndex + 1;
    component.paginationConfig.itemsPerPage = pageData.pageSize;
    component.paginationConfig.totalItems = pageData.pageSize * pageData.totalPages;
    fixture.detectChanges();

    paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();
  });

  it('should show the pagination controls when two dataReview pages are present', () => {
    const pageData = {
      'id': paginationDataReview,
      'dataReviewTableResults': component.dataReviewTableResults,
      'pageIndex': 0,
      'totalPages': 2,
      'pageSize': 25
    };
    component.dataReviewTableResults = pageData.dataReviewTableResults;
    component.paginationConfig.currentPage = pageData.pageIndex + 1;
    component.paginationConfig.itemsPerPage = pageData.pageSize;
    component.paginationConfig.totalItems = pageData.pageSize * pageData.totalPages;
    fixture.detectChanges();

    const paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    expect(paginationButtons.length).toEqual(2);

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    expect(nextButton).toBeDefined();
    expect(nextButton.disabled).toBeFalsy();

    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    expect(prevButton).toBeDefined();
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should display dataReviewTableResults based on the Page selected in Pagination when we have multiple pages', () => {
    // click on the next button in the pagination and check if dataReviewTableResults are modified accordingly
    sampleDataReview = component.dataReviewTableResults;
    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    nextButton.click();
    fixture.detectChanges();

    // click on the prev button in the pagination and check if dataReviewTableResults are modified accordingly
    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    prevButton.click();
    fixture.detectChanges();
    expect(component.dataReviewTableResults).toEqual(sampleDataReview);

    // click on the third page in the pagination and check if dataReviewTableResults are modified accordingly
    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    const secondPageButton = paginationButtons[2].nativeElement;
    secondPageButton.click();
    fixture.detectChanges();
    expect(component.dataReviewTableResults).toEqual(sampleDataReview);
  });

  it('should include history interactions when present for data', () => {
    atHistory = mockData.atHistory;
    component.labLocationId = null;
    component.ngOnInit();
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('.review-data'));
    const resultRows = component.dataReviewTableResults.filter(row => !row.isPlaceholderRow && !row.isHeaderRow);
    expect(tableRows.length).toBe(resultRows.length);

    const reviewDataRecord: ReviewData = Object.assign(new ReviewData(), unreviewedDataResponse.results.reviewData[0]);
    const tableRow = tableRows[0];

    const actionsItem = tableRow.children[1].query(By.css('.spc_pezcell_actions_number'));
    expect(actionsItem.nativeElement.innerText).toEqual(reviewDataRecord.userActions.length.toString());
 
    const commentsItem = tableRow.children[1].query(By.css('.spc_pezcell_comments_number'));
    expect(commentsItem.nativeElement.innerText).toEqual(reviewDataRecord.userComments.length.toString());

    const interactionsItem = tableRow.children[1].query(By.css('.spc_pezcell_interactions_number'));
    expect(interactionsItem.nativeElement.innerText).toEqual('3');
  
    const dialogRef = component.openReviewSummaryDialog(new Event(''), reviewDataRecord);
    fixture.detectChanges();

    const reviewSummary = dialogRef.componentInstance.data.reviewData as ReviewSummary;
    const reviewSummaryActions = reviewSummary.actions;
    const reviewDataRecordUserActions = reviewDataRecord.userActions;

    expect(reviewSummaryActions).toHaveSize(reviewDataRecordUserActions.length);

    for (let i = 0; i < reviewSummaryActions.length; i++) {
      expect(reviewSummaryActions[i].userName).toEqual(reviewDataRecordUserActions[i].userFullName);
      expect(reviewSummaryActions[i].dateTime).toEqual(reviewDataRecordUserActions[i].enterDateTime);
      expect(reviewSummaryActions[i].text).toEqual(reviewDataRecordUserActions[i].actionName);
    }

    const reviewSummaryComments = reviewSummary.comments;
    const reviewDataRecordUserComments = reviewDataRecord.userComments;

    expect(reviewSummaryComments).toHaveSize(reviewDataRecordUserActions.length);

    for (let i = 0; i < reviewSummaryComments.length; i++) {
      expect(reviewSummaryComments[i].userName).toEqual(reviewDataRecordUserComments[i].userFullName);
      expect(reviewSummaryComments[i].dateTime).toEqual(reviewDataRecordUserComments[i].enterDateTime);
      expect(reviewSummaryComments[i].text).toEqual(reviewDataRecordUserComments[i].content);
    }

    const reviewSummaryInteractions = reviewSummary.interactions;
    const reviewDataRecordInteractions = reviewDataRecord.interactions;

    expect(reviewSummaryInteractions).toHaveSize(reviewDataRecordInteractions.length);

    for (let i = 0; i < reviewSummaryComments.length; i++) {
      expect(reviewSummaryInteractions[i].userName).toEqual(`${userNode.firstName} ${userNode.lastName}`);
      expect(reviewSummaryInteractions[i].dateTime).toEqual(reviewDataRecordInteractions[i].dateTime);
      expect(reviewSummaryInteractions[i].text).toEqual('HISTORYMESSAGES.UPDATEDACTIONCOMMENT');
    }

    dialogRef.close();
  });

  it('should hide reviewed button based on hasPermissionToAccess', () => {
    hasPermission = false;
    fixture.detectChanges();
    let reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
    expect(reviewedButton).toBeNull();

    hasPermission = true;
    fixture.detectChanges();
    reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
    expect(reviewedButton).toBeDefined();
  });

  it('should enable reviewed button when review items are selected', fakeAsync(() => {
    const selectedForReviewArray = component.formGroup.get('selectedForReview') as FormArray;
    expect(selectedForReviewArray).toBeDefined();
    expect(selectedForReviewArray.controls).toBeDefined();
    expect(selectedForReviewArray.length).toEqual(unreviewedDataResponse.results.reviewData.length);
    let checkedBoxes = selectedForReviewArray.controls.filter(reviewDataFormGroup => reviewDataFormGroup.get('selectedRun').value === true);
    expect(checkedBoxes.length).toEqual(0);
    let reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
    expect(reviewedButton).toBeDefined();
    expect(reviewedButton.disabled).toBeTrue();

    component.applySelectAll(true);
    tick(250);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      checkedBoxes = selectedForReviewArray.controls.filter(reviewDataFormGroup => reviewDataFormGroup.get('selectedRun').value === true);
      expect(checkedBoxes.length).toEqual(unreviewedDataResponse.results.reviewData.length);
      reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
      expect(reviewedButton).toBeDefined();
      expect(reviewedButton.disabled).toBeFalse();
    });
  }));

  it('should send review data request', fakeAsync(() => {
    spyOn(mockDataReviewService, 'reviewData').and.callThrough();
    component.applySelectAll(true)
    tick(250);
    fixture.detectChanges();

    let reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
    expect(reviewedButton).toBeDefined();
    expect(reviewedButton.disabled).toBeFalse();
    reviewedButton.click();
    expect(mockDataReviewService.reviewData).toHaveBeenCalledTimes(1);
  }));

  it('should display dropdown for department', () => {
    component.departmentList = [{displayName: 'Dept A1'}, {displayName: 'Biochemistry1'}, {displayName: 'Chemistry C'}];
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#department')).toBeTruthy();
  });

  it('should display dropdown for instrument', () => {
    component.departmentList = [{displayName: 'AU5400'}, {displayName: 'New Instrument'}, {displayName: 'CopiedInstrumentAU5400'}];
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#labInstrument')).toBeTruthy();
  });

  it('should display dropdown for panel', () => {
    component.departmentList = [{displayName: 'Panel A'}, {displayName: 'demo 1'}];
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#panelItem')).toBeTruthy();
  });

  it('should set to true disables the view item button', () => {
    component.isViewItemsDisabled = true;
    component.actions = null;
    fixture.detectChanges();
    expect(submitEl.nativeElement.querySelector('button').disabled).toBeTruthy();
   });

   it('should set to false enables the view item button', () => {
    component.isViewItemsDisabled = false;
    component.actions = null;
    fixture.detectChanges();
    expect(submitEl.nativeElement.querySelector('button').disabled).toBeFalsy();
   });

  it('should display "All items have been reviewed" when the results are empty', () => {
    component.allItemsReviewFlag = true;
    fixture.detectChanges();
    const noRunfound = fixture.debugElement.nativeElement.querySelector('#all-data-reviewed');
    expect(noRunfound.innerText).toContain('DATAREVIEW.ALLITEMSHAVEBEENREVIEWED');
  });

  it('should called select all analyte runs on all pages', () => {
    spyOn(component, 'applySelectAll');
    component.runReviewItems = [{
      runId: 12,
      selected: false,
      userAction: 'test action',
      userComment: 'test comment'
    }];
    
    component.selectAllAnalyteRunsOnAllPages();
    expect(component.runReviewItems[0].selected).toEqual(true);
    expect(component.applySelectAll).toHaveBeenCalledWith(true);
    
  });

  it('should called select all analyte runs on current page', () => {
    spyOn(component, 'applySelectAll');
    component.selectAllAnalyteRunsOnCurrentPage();
    expect(component.applySelectAll).toHaveBeenCalledWith(true);
  });

  it('should called dashboard navigate', () => {
    component.labLocationId= 'ec7d4336-ac4a-4a97-b9c9-741efb50a806';
    component.goToDashboard();
    expect(mockNavigationService.navigateToDashboard).toHaveBeenCalled();
  });

  it('should put row into edit mode after clicking edit icon', fakeAsync(() => {
    expect(component.isEditingRun).toBeFalse();
    expect(component.runIdInEdit).toBeUndefined();
    expect(component.runInEdit).toBeUndefined();

    let editIcon = fixture.debugElement.nativeElement.querySelector('.ic_edit');
    expect(editIcon).not.toBeNull();
    let editIconDisabled = fixture.debugElement.nativeElement.querySelector('.ic_edit_gray');
    expect(editIconDisabled).toBeNull();
    let cancelButton = fixture.debugElement.nativeElement.querySelector('.cancel-button');
    expect(cancelButton).toBeNull();
    let updateButton = fixture.debugElement.nativeElement.querySelector('.update-button');
    expect(updateButton).toBeNull();
    expect(component.formGroup.disabled).toBeFalse();

    component.applySelectAll(true);
    tick(250);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const selectedForReviewArray = component.formGroup.get('selectedForReview') as FormArray;
      const checkedBoxes = selectedForReviewArray.controls.filter(reviewDataFormGroup => reviewDataFormGroup.get('selectedRun').value === true);
      expect(checkedBoxes.length).toEqual(unreviewedDataResponse.results.reviewData.length);
      checkedBoxes.forEach(checkbox => {
        expect(checkbox.disabled).toBeFalse();
      });

      let reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
      expect(reviewedButton).toBeDefined();
      expect(reviewedButton.disabled).toBeFalse();

      // Go into edit mode
      editIcon.click();
      fixture.detectChanges();

      expect(component.isEditingRun).toBeTrue();
      expect(component.runIdInEdit).toEqual(component.dataReviewTableResults[1].id);
      expect(component.runInEdit).toEqual(component.dataReviewTableResults[1]);

      editIcon = fixture.debugElement.nativeElement.querySelector('.ic_edit');
      expect(editIcon).toBeNull();
      editIconDisabled = fixture.debugElement.nativeElement.querySelector('.ic_edit_gray');
      expect(editIconDisabled).not.toBeNull();
      cancelButton = fixture.debugElement.nativeElement.querySelector('.cancel-button');
      expect(cancelButton).not.toBeNull();
      updateButton = fixture.debugElement.nativeElement.querySelector('.update-button');
      expect(updateButton).not.toBeNull();
      expect(component.formGroup.disabled).toBeTrue();

      checkedBoxes.forEach(checkbox => {
        expect(checkbox.disabled).toBeTrue();
      });

      reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
      expect(reviewedButton).toBeDefined();
      expect(reviewedButton.disabled).toBeTrue();
    });
  }));

  it('should exit edit mode after canceling', fakeAsync(() => {
    let editIcon = fixture.debugElement.nativeElement.querySelector('.ic_edit');

    // Go into edit mode
    editIcon.click();
    fixture.detectChanges();

    expect(component.isEditingRun).toBeTrue();
    expect(component.runIdInEdit).toEqual(component.dataReviewTableResults[1].id);
    expect(component.runInEdit).toEqual(component.dataReviewTableResults[1]);

    editIcon = fixture.debugElement.nativeElement.querySelector('.ic_edit');
    expect(editIcon).toBeNull();
    let editIconDisabled = fixture.debugElement.nativeElement.querySelector('.ic_edit_gray');
    expect(editIconDisabled).not.toBeNull();
    let cancelButton = fixture.debugElement.nativeElement.querySelector('.cancel-button');
    expect(cancelButton).not.toBeNull();
    let updateButton = fixture.debugElement.nativeElement.querySelector('.update-button');
    expect(updateButton).not.toBeNull();
    expect(component.formGroup.disabled).toBeTrue();

    component.applySelectAll(true);
    tick(250);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const selectedForReviewArray = component.formGroup.get('selectedForReview') as FormArray;
      const checkedBoxes = selectedForReviewArray.controls.filter(reviewDataFormGroup => reviewDataFormGroup.get('selectedRun').value === true);
      checkedBoxes.forEach(checkbox => {
        expect(checkbox.disabled).toBeTrue();
      });

      let reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
      expect(reviewedButton).toBeDefined();
      expect(reviewedButton.disabled).toBeTrue();

      // Exit edit mode
      let cancelButton = fixture.debugElement.nativeElement.querySelector('.cancel-button');
      cancelButton.click();
      fixture.detectChanges();

      expect(component.isEditingRun).toBeFalse();
      expect(component.runIdInEdit).toBeNull();
      expect(component.runInEdit).toBeNull();
  
      editIcon = fixture.debugElement.nativeElement.querySelector('.ic_edit');
      expect(editIcon).not.toBeNull();
      editIconDisabled = fixture.debugElement.nativeElement.querySelector('.ic_edit_gray');
      expect(editIconDisabled).toBeNull();
      cancelButton = fixture.debugElement.nativeElement.querySelector('.cancel-button');
      expect(cancelButton).toBeNull();
      updateButton = fixture.debugElement.nativeElement.querySelector('.update-button');
      expect(updateButton).toBeNull();

      expect(component.formGroup.disabled).toBeFalse();
      checkedBoxes.forEach(checkbox => {
        expect(checkbox.disabled).toBeFalse();
      });

      reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
      expect(reviewedButton).toBeDefined();
      expect(reviewedButton.disabled).toBeFalse();
    });
  }));

  it('should call refreshResults', () => {
    component.refreshResults();
    fixture.detectChanges();
    expect(component.refreshResultFlag).toBeTruthy();
  });

  it('should call onClickFilters', () => {
    const event: ReviewFilter[] = [{
        filterType: ReviewFilterTypes.Accepted,
        include: false
    }, ]
    component.onClickFilters(event[0])
    fixture.detectChanges();
    expect(component.filterTypes[0].include).toBeTruthy();
  });

  it('should call selectAllCheckboxChange', () => {
    component.selectedAllRunAllPage = true;
    const spy = spyOn(component, 'totalRunsSelectedForAll').and.callThrough();
    const event: MatCheckboxChange = {
      checked: false,
      source: {} as MatCheckbox
    }
    component.selectAllCheckboxChange(event);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should call toggleCheckboxesDepartment', () => {
    component.labLocationChildren = mockLabLocationChildrenData; // assigning mock data to labLocationChildren
    component.toggleCheckboxesDepartment(true);
    fixture.detectChanges();
    expect(component.selectedDepartments).toBeTruthy([component.valueAll]);
  });

  it('should call toggleCheckboxesInstrument', () => {
    component.labLocationChildren = mockLabLocationChildrenData; // assigning mock data to labLocationChildren
    component.toggleCheckboxesInstrument(true);
    fixture.detectChanges();
    expect(component.selectedInstruments).toBeTruthy([component.valueAll]);
  });

  it('should call toggleCheckboxesPanel', () => {
    component.labLocationChildren = mockLabLocationChildrenData; // assigning mock data to labLocationChildren
    component.toggleCheckboxesPanel(true);
    fixture.detectChanges();
    expect(component.selectedPanels).toBeTruthy([component.valueAll]);
  });

  it('should call changeFilterDepartment and set labInstrumentList based on selectedDepartments', () => {
    component.labLocationChildren = mockLabLocationChildrenData; // assigning mock data to labLocationChildren
    component.selectedDepartments = [component.valueAll];
    fixture.detectChanges();
    component.changeFilterDepartment();
    expect(component.labInstrumentList).toEqual(component.labInstrumentListArray);
    fixture.detectChanges();
    component.selectedDepartments  = [{ displayName : 'Biochemistry1', id : "bae7f11c-6146-46dc-a226-327d7426838f"}];
    component.changeFilterDepartment();
    fixture.detectChanges();
    let instrumentNameArray = ['Instrument Example', 'Instrument Example 2', 'Instrument Example 3'];
    expect(component.labInstrumentList.map(instrument=>instrument.displayName)).toEqual(instrumentNameArray);
  });

  it('should call changeFilterDepartment and update selectedDepartments based on selection', () => {
    component.labLocationChildren = mockLabLocationChildrenData; // assigning mock data to labLocationChildren
    component.selectedDepartments = [{displayName : 'All', id : '12345'}]; // selected all instruments
    fixture.detectChanges();
    component.changeFilterDepartment();
    fixture.detectChanges();
    let departmentNameArray = ['All'];
    expect(component.selectedDepartments.map(department=>department.displayName)).toEqual(departmentNameArray);
    expect(component.isViewItemsDisabled).toBeFalsy(); // VIEW ITEMS BUTTON should be enabled after filter selection
  });
  
  it('should call changeFilterInstrument and update selectedInstruments based on selection', () => {
    component.labLocationChildren = mockLabLocationChildrenData; // assigning mock data to labLocationChildren
    component.selectedInstruments = [{displayName : 'All', id : '12345'}]; // selected all instruments
    fixture.detectChanges();
    component.changeFilterInstrument();
    fixture.detectChanges();
    let instrumentNameArray = ['All'];
    expect(component.selectedInstruments.map(instrument=>instrument.displayName)).toEqual(instrumentNameArray);
    expect(component.isViewItemsDisabled).toBeFalsy(); // // VIEW ITEMS BUTTON should be enabled after filter selection
  });

  it('should call changeFilterPanel and update selectedPanels based on selection', () => {
    component.labLocationChildren = mockLabLocationChildrenData; // assigning mock data to labLocationChildren
    component.selectedPanels = [{displayName : 'All', id : '12345'}]; // selected all instruments
    fixture.detectChanges();
    component.changeFilterPanel();
    fixture.detectChanges();
    let panelNameArray = ['All'];
    expect(component.selectedPanels.map(panel=>panel.displayName)).toEqual(panelNameArray);
    expect(component.isViewItemsDisabled).toBeFalsy(); // // VIEW ITEMS BUTTON should be enabled after filter selection
  });

  it('should show tooltips on hovering on the dynamic filters', () => {
    const dynamicFilter: HTMLElement = fixture.nativeElement.querySelector('.dynamic-filter');
    dynamicFilter.dispatchEvent(new MouseEvent('mouseover'));
    fixture.detectChanges();
    const tooltipContent = fixture.nativeElement.querySelector('.tooltipContent');
    expect(tooltipContent).toBeTruthy();
  });

  it('should call totalRunsSelectedForAll', () => {
    component.runReviewItems = [{
      runId: 12,
      selected: false,
      userAction: 'test action',
      userComment: 'test comment'
    },
    {
      runId: 15,
      selected: true,
      userAction: 'test action',
      userComment: 'test comment'
    }];
    const count = component.totalRunsSelectedForAll();
    fixture.detectChanges();
    expect(count).toEqual(1);
  });

  it('should test template values', () => {
    component.itemsSelected = 0;
    component.totalCount = 12;
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('.runCount')).nativeElement;
    expect(text.textContent).toContain('0/12');
  });

  it('should send update run request', fakeAsync(() => {
    spyOn(mockLabDataApiService, 'getRunDataByLabTestIdsAsync').and.callThrough();
    spyOn(mockRunsService, 'putRunEditData').and.callThrough();
    spyOn(mockAppNavigationTrackingService, 'logAuditTracking').and.callThrough();
    spyOn(mockDataReviewService, 'getDataReviewData').and.callThrough();

    sampleDataReview = mockData.data.results.reviewData;
    component.toggleEditRun(component.dataReviewTableResults[0]);
    fixture.detectChanges();

    expect(component.isUpdatingRun).toBeFalse();
    
    let valueInputElements = fixture.debugElement.queryAll(By.css('.data-result-input'));
    let acceptedToggleElements = fixture.debugElement.queryAll(By.css('[name="isAccepted"]'));

    expect(valueInputElements.length).toEqual(2);
    expect(valueInputElements[0].nativeElement.disabled).toBeFalse();
    expect(valueInputElements[1].nativeElement.disabled).toBeFalse();

    expect(acceptedToggleElements.length).toEqual(2);
    expect(valueInputElements[0].nativeElement.disabled).toBeFalse();
    expect(valueInputElements[1].nativeElement.disabled).toBeFalse();

    component.updateRun(sampleDataReview[0], component.runInEdit);
    fixture.detectChanges();
    tick(500);
    expect(component.isUpdatingRun).toBeTrue();
    
    valueInputElements = fixture.debugElement.queryAll(By.css('.data-result-input'));
    acceptedToggleElements = fixture.debugElement.queryAll(By.css('[name="isAccepted"]'));

    expect(valueInputElements.length).toEqual(2);
    expect(valueInputElements[0].nativeElement.disabled).toBeTrue();
    expect(valueInputElements[1].nativeElement.disabled).toBeTrue();

    expect(acceptedToggleElements.length).toEqual(2);
    expect(valueInputElements[0].nativeElement.disabled).toBeTrue();
    expect(valueInputElements[1].nativeElement.disabled).toBeTrue();

    expect(mockLabDataApiService.getRunDataByLabTestIdsAsync).toHaveBeenCalled();
    expect(mockRunsService.putRunEditData).toHaveBeenCalled();
    tick(500);

    expect(mockAppNavigationTrackingService.logAuditTracking).toHaveBeenCalled();

    mockNotificationService.$labTestStream.next(mockNotification);
    fixture.detectChanges();
    tick(500);
  
    expect(component.isUpdatingRun).toBeFalse();
    
    valueInputElements = fixture.debugElement.queryAll(By.css('.data-result-input'));
    acceptedToggleElements = fixture.debugElement.queryAll(By.css('[name="isAccepted"]'));

    expect(valueInputElements.length).toEqual(0);
    expect(acceptedToggleElements.length).toEqual(0);

    expect(mockDataReviewService.getDataReviewData).toHaveBeenCalled();

    discardPeriodicTasks();
  }));

  it('toggle link should only be visible to Supervisor Reviewer', () => {
    component.hasSupervisorAccess = true;
    fixture.detectChanges();
    let toggleLink = fixture.debugElement.nativeElement.querySelector('.toggle-link');
    expect(toggleLink).not.toBeNull();
    component.hasSupervisorAccess = false;
    fixture.detectChanges();
    toggleLink = fixture.debugElement.nativeElement.querySelector('.toggle-link');
    expect(toggleLink).toBeNull();
  });

  it('should open Advanced LJ dialog', () => {
    const advLJSpy = spyOn(component, 'openAdvancedLjDialog').and.callThrough();
    const advancedLjLinks = fixture.debugElement.queryAll(By.css('.advanced-lj-button'));
    expect(advancedLjLinks).toBeDefined();
    expect(advancedLjLinks).toHaveSize(2);
    advancedLjLinks[0].nativeElement.click();
    fixture.detectChanges();

    const advancedLjDialog = fixture.debugElement.nativeElement.querySelector('.cdk-AdvancedLj');
    expect(advancedLjDialog).toBeDefined();

    expect(advLJSpy).toHaveBeenCalledTimes(1);
    const advLJDialogArgs = advLJSpy.calls.allArgs();
    expect(advLJDialogArgs[0][0]).toEqual(component.dataReviewTableResults[0].labTestId);
    expect(advLJDialogArgs[0][1]).toEqual(component.dataReviewTableResults[0].labInstrumentId);
    expect(advLJDialogArgs[0][2]).toEqual(component.dataReviewTableResults[0].decimalPlaces);
    expect(advLJDialogArgs[0][3]).toEqual(component.dataReviewTableResults[0].runDateTime);
  });

  it('should support CTS user', () => {
    spyOn(component, 'hasPermissionToAccess').and.returnValue(false);
    fixture.detectChanges();

    const selectAllCheckbox = fixture.debugElement.nativeElement.querySelector('#spec_select_all_checkbox');
    const selectAllDropdown = fixture.debugElement.nativeElement.querySelector('#spec_select_all_dropdown');
    const reviewedButton = fixture.debugElement.nativeElement.querySelector('#spec_reviewed_button');
    const missingTestsLink = fixture.debugElement.nativeElement.querySelector('#spec_missing_tests');

    expect(selectAllCheckbox.className.indexOf('mat-checkbox-disabled')).toBeGreaterThanOrEqual(0);
    expect(selectAllDropdown.className.indexOf('mat-select-disabled')).toBeGreaterThanOrEqual(0);
    expect(reviewedButton).toBeNull();
    expect(missingTestsLink).toBeNull();
  });

  it('has section header', () => {
    const sectionHeader = fixture.debugElement.nativeElement.querySelector('.section-header');
    expect(sectionHeader).toBeDefined();
    expect(sectionHeader.innerHTML).toContain(unreviewedDataResponse.results.reviewData[0].customProductName);
    expect(sectionHeader.innerHTML).toContain(unreviewedDataResponse.results.reviewData[0].productMasterLotNumber);
    expect(sectionHeader.innerHTML).toContain(unreviewedDataResponse.results.reviewData[0].departmentName);
    expect(sectionHeader.innerHTML).toContain(unreviewedDataResponse.results.reviewData[0].instrumentAlias);
  });
});
