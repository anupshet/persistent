import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { take } from 'rxjs/operators';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { NgBusyModule } from 'ng-busy';
import { DatePipe } from '@angular/common';

import { MaterialModule } from 'br-component-library';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ConfigService } from '../../../core/config/config.service';
import { ReportHelperService } from './report-helper.service';
import { RunsService } from '../../../shared/services/runs.service';
import { ReportingService } from './reporting.service';
import { UnityReportComponent } from './unity-report.component';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { ReportType } from '../../../contracts/enums/report-type';
import { LabDataApiService } from '../../../shared/api/labDataApi.service';
import { DataManagementSpinnerService } from '../../../shared/services/data-management-spinner.service';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import * as fromRoot from '../../../shared/navigation/state/reducers/navigation.reducer';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

describe('UnityReportComponent', () => {
  let component: UnityReportComponent;
  let fixture: ComponentFixture<UnityReportComponent>;
  let store: MockStore<any>;
  const initialState = {};
  const testReports = [
    { year: 2019, month: 4, reportMetaList: Array(2), checked: false }
    , { year: 2019, month: 3, reportMetaList: Array(4), checked: false }
    , { year: 2019, month: 1, reportMetaList: Array(6), checked: false }
    , { year: 2018, month: 12, reportMetaList: Array(1), checked: false }
    , { year: 2018, month: 3, reportMetaList: Array(1), checked: false }
    , { year: 2018, month: 1, reportMetaList: Array(2), checked: false }
    , { year: 2016, month: 2, reportMetaList: Array(1), checked: false }
    , { year: 2015, month: 3, reportMetaList: Array(2), checked: false }
    , { year: 2014, month: 7, reportMetaList: Array(1), checked: false }
    , { year: 2013, month: 9, reportMetaList: Array(1), checked: false }
    , { year: 2012, month: 1, reportMetaList: Array(2), checked: false }

  ];

  const mockRunsService = jasmine.createSpyObj([
    'getCachedComment',
    'setCachedComment',
    'updateTestSpecId',
    'filterExpiredLotsForSpecificDate',
    'isLotExpiredForSpecificDate',
    'postNewRunData',
    'getTranslation'
  ]);

  class MockNotificationService {
    public get $labStream() {
      return of(2);
    }
  }

  const selectedNodeData = {
    'displayName': 'VisionLabs',
    'labLocationName': 'VisionLabs',
    'locationTimeZone': 'Asia/Calcutta',
    'locationOffset': 0,
    'locationDayLightSaving': false,
    'labLocationContactId': '6f318bd0-7f91-438d-806a-202bed731e4b',
    'labLocationAddressId': '0a7408a4-e1aa-4084-ba2f-fe39dbddbd50',
    'labLocationContact': {
      'entityType': 0,
      'searchAttribute': 'nikita_pawar@bio-rad.com',
      'firstName': 'Nikita',
      'middleName': '',
      'lastName': 'P',
      'name': 'Nikita P',
      'email': 'nikita_pawar@bio-rad.com',
      'phone': '8436583465',
      'id': '6f318bd0-7f91-438d-806a-202bed731e4b'
    },
    'labLocationAddress': {
      'entityType': 1,
      'searchAttribute': '',
      'nickName': '',
      'streetAddress1': 'Wakad Street, Data 25',
      'streetAddress2': 'Blog 43',
      'streetAddress3': 'Phase 25',
      'streetAddress': 'Wakad Street, Data 25, Blog 43, Phase 25',
      'suite': 'Blog 43',
      'city': 'Pune25',
      'state': 'MH5',
      'country': 'IN',
      'zipCode': '25',
      'id': '0a7408a4-e1aa-4084-ba2f-fe39dbddbd50'
    },
    'id': '5774EC11568346B4A8DDD243066C03B5',
    'parentNodeId': '42F4F17FE0144E198CC75902A8F12FF4',
    'parentNode': null,
    'nodeType': 2,
    'children': [
      {
        'displayName': 'Nikitas dept',
        'departmentName': 'Nikitas dept',
        'departmentManagerId': 'AD835C58FBA84BBEA443FB0E023EEF6A',
        'departmentManager': {
          'entityType': 0,
          'searchAttribute': '',
          'firstName': '',
          'middleName': '',
          'lastName': '',
          'name': '',
          'email': '',
          'phone': '',
          'id': 'AD835C58FBA84BBEA443FB0E023EEF6A'
        },
        'id': '3D48CC24D3F944679C01ACE3B201031D',
        'parentNodeId': '5774EC11568346B4A8DDD243066C03B5',
        'parentNode': null,
        'nodeType': 3,
        'children': []
      }
    ]
  };

  const navigationState = {
    selectedNode: selectedNodeData,
    selectedLeaf: null,
    currentBranch: [],
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: false,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: true
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        PerfectScrollbarModule,
        HttpClientModule,
        NgReduxTestingModule,
        NgBusyModule,
        StoreModule.forRoot(fromRoot.reducer)
      ],
      declarations: [UnityReportComponent],
      providers: [
        provideMockStore({
          initialState
          // selectors: [
          //   { selector: fromNavigation.getCurrentlySelectedNode, value:  {}  }
          // ],
        }),
        // tslint:disable-next-line: no-use-before-declare
        { provide: ConfigService, useValue: mockConfigService },
        // tslint:disable-next-line: no-use-before-declare
        { provide: ReportingService, useValue: mockReportingService },
        // tslint:disable-next-line: no-use-before-declare
        { provide: ReportHelperService, useValue: mockReportHelperService },
        // tslint:disable-next-line: no-use-before-declare
        { provide: LabDataApiService, useValue: mockLabDataService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: RunsService, useValue: mockRunsService },
        { provide: NavigationService, useValue: of('') },
        { provide: NotificationService, useClass: MockNotificationService },
        DataManagementSpinnerService,
        PortalApiService,
        SpinnerService,
        DatePipe,
        { provide: TranslateService, useValue: { get: tag => of(tag) } },
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    store.setState(navigationState);
    fixture = TestBed.createComponent(UnityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properly', () => {
    component.selectedReportType = ReportType.AllReports;
    component.reports = testReports;
    store.setState(navigationState);
    fixture.detectChanges();
    store.pipe(take(1)).subscribe(state => {
      expect(state.selectedNode).toBe(selectedNodeData);
    });
  });

  it('should set months', () => {
    component.selectedYear = 2019;
    component.reports = testReports;
    component.ngOnInit();
    component.setMonths();
    expect(component.months.length).toEqual(3);

    component.selectedYear = 2016;
    component.reports = testReports;
    component.ngOnInit();
    component.setMonths();
    expect(component.months.length).toEqual(1);
  });

  it('should set menu options', () => {
    // Monthly Eval
    component.setMenuOptions(true, false, false);
    expect(component.showLabMonthlyEvaluationReport).toBeTruthy();
    expect(component.showLabComparisonReport).toBeFalsy();
    expect(component.showAllReports).toBeFalsy();

    // Lab Comparison
    component.setMenuOptions(false, true, false);
    expect(component.showLabMonthlyEvaluationReport).toBeFalsy();
    expect(component.showLabComparisonReport).toBeTruthy();
    expect(component.showAllReports).toBeFalsy();

    // All Reports
    component.setMenuOptions(false, false, true);
    expect(component.showLabMonthlyEvaluationReport).toBeFalsy();
    expect(component.showLabComparisonReport).toBeFalsy();
    expect(component.showAllReports).toBeTruthy();
  });

  it('determines reportable entity', () => {
    component.entityType = EntityType.LabTest;
    expect(component.isReportableEntity()).toBeFalsy();
    component.entityType = EntityType.LabProduct;
    expect(component.isReportableEntity()).toBeFalsy();
    component.entityType = EntityType.LabLocation;
    expect(component.isReportableEntity()).toBeFalsy();
    component.entityType = EntityType.LabDepartment;
    expect(component.isReportableEntity()).toBeFalsy();
    component.entityType = EntityType.LabInstrument;
    expect(component.isReportableEntity()).toBeTruthy();
  });

  const mockConfigService = {
    getConfig: () => of({})
  };
  const mockLabDataService = {
    getYearsAndMonthsWithDataPoints: () => of([
      { year: 2018, month: 9 },
      { year: 2018, month: 10 }
    ])
  };
  const mockReportingService = {
    getAll: () => of({})
  };
  const mockReportHelperService = {};
});
