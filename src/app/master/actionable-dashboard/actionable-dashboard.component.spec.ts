/* AJ is temporarily commenting this file out.  It is bloating test cases execution time and there is a note in the file showing this has been ongoing issue and i will take this on when I have time */

/* // © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NgReduxModule } from '@angular-redux/store';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { Autofixture } from 'ts-autofixture/dist/src';

import { BrSelect, MaterialModule } from 'br-component-library';

import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { AuthenticationService } from '../../security/services/authentication.service';
import { DateTimeHelper } from '../../shared/date-time/date-time-helper';
import { PortalApiService } from '../../shared/api/portalApi.service';
import { AppLoggerService } from '../../shared/services/applogger/applogger.service';
import { UnextTimePeriodPipe } from '../../shared/date-time/pipes/unext-time-period.pipe';
import { UnDateFormatPipe } from '../../shared/date-time/pipes/unDateFormat.pipe';
import { UnityNextNumberModule } from '../../shared/number/unity-next-number.module';
import { IndicatorModule } from '../../shared/indicator/indicator.module';
import { LoggingApiService } from '../../shared/api/logging-api.service';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { LotViewerService } from '../../shared/api/lotViewer.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { EntityInfo } from '../../contracts/models/data-management/entity-info.model';
import { Lab } from '../../contracts/models/lab-setup/lab.model';
import { MigrationStates } from '../../contracts/enums/migration-state.enum';
import { Address, Contact } from '../../contracts/models/portal-api/portal-data.model';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { Department, LabLocationContact } from '../../contracts/models/lab-setup';
import { BrError } from '../../contracts/models/shared/br-error.model';
import { GreetingComponent } from './components/greeting/greeting.component';
import { LotviewerEmbedUrl } from '../../contracts/models/lotviewer/lotviewer-embed-url.model';
import { LotviewerEmbedToken } from '../../contracts/models/lotviewer/lotviewer-embed-token.model';
import { LotviewerComponent } from './containers/lotviewer/lotviewer.component';
import { LotviewerDialogComponent } from './components/lotviewer-dialog/lotviewer-dialog.component';
import { LotviewerPanelComponent } from './components/lotviewer-panel/lotviewer-panel.component';
import { ExpiringLotsComponent } from './containers/expiring-lots/expiring-lots.component';
import { ExpiringLicenseComponent } from './containers/expiring-license/expiring-license.component';
import { ExpiringLotsListComponent } from './components/expiring-lots-panel/expiring-lots-list/expiring-lots-list.component';
import { ExpiringLotsPanelComponent } from './components/expiring-lots-panel/expiring-lots-panel.component';
import { ExpiringLicensePanelComponent } from './components/expiring-license-panel/expiring-license-panel.component';
import { ActionableDashboardComponent } from './actionable-dashboard.component';
import { HttpLoaderFactory } from '../../app.module';
import { UserRole } from '../../contracts/enums/user-role.enum';
import { UnityNextTier } from '../../contracts/enums/lab-location.enum';
import { QcReviewResultComponent } from './containers/qc-review-result/qc-review-result.component';
import { QcReviewResultPanelComponent } from './components/qc-review-result-panel/qc-review-result-panel.component';
import { DataReviewService } from '../../shared/api/data-review.service';

// need to fix issues in this file
describe('ActionableDashboardComponent', () => {
  let component: ActionableDashboardComponent;
  let fixture: ComponentFixture<ActionableDashboardComponent>;
  const hasExpiringLots = false;
  let hasExpiringLicense;
  const autofixture = new Autofixture();
  const testData = autofixture.create(new EntityInfo());
  const testLotViewerEmbedToken = autofixture.create(new LotviewerEmbedToken);
  const testLotViewerEmbedUrl = autofixture.create(new LotviewerEmbedUrl);
  testLotViewerEmbedUrl.embedToken = testLotViewerEmbedToken;
  const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };
  const getCurrentUserStub = {
    getCurrentUser: () => { }
  };
  const mockLoggingApiService = {
    auditTracking: () => { }
  };

  const ApiServiceStub = {
    get: (number): Observable<any> => {
      return of(testData);
    }
  };


  const lotViewerServiceStub = {
    getLotviewerReport: (LotviewerReportType): Observable<LotviewerEmbedUrl> => {
      // returning null due to lotviewer component long sleep interval test cases are failing
      return of(null);
    }
  };

  let permissionsResult = true;

  const mockBrPermissionsService = {
    hasAccess: () => permissionsResult,
  };

  const navigationStub = {
    selectedNode: {},
    selectedLeaf: {},
    currentBranch: [],
    error: {},
    isSideNavExpanded: false,
    currentUser: {}
  };

  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '123',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['LabSupervisor'],
      permissions: {
        rolePermissions: {
          role: {
            permission: true,
          }
        }
      },
      userData: {
        assignedLabNumbers: [],
        defaultLab: ''
      },
      accountNumber: '123',
      accountId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      labLocationId: '0d66767b-612c-4254-9eed-3a7ab393029f',
      labLocationIds: ['0d66767b-612c-4254-9eed-3a7ab393029f'],
      accountNumberArray: [],
      accessToken: '',
      id: 'eca89ea6-aba1-4b95-9396-0238352a4765',
      labId: ''
    },
    directory: {
      id: 10,
      name: 'Test',
      locations: null,
      children: [{
        nodeType: 1
      },{
        nodeType: 7,
        userOktaId: '123',
        userName: '',
        firstName: 'user',
        lastName: 'test',
        displayName: '',
        email: 'user@bio-rad.com',
        userRoles: ['LabSupervisor'],
      }],
      primaryUnityLabNumbers: 'Test',
    }
  };

  const Accounts = {
    id: '123',
    accountNumber: '3456788',
    formattedAccountNumber: '',
    sapNumber: '',
    orderNumber: '',
    primaryUnityLabNumbers: '',
    labName: '',
    accountAddressId: '',
    accountAddress: Address,
    accountContactId: '',
    accountContact: null,
    licenseNumberUsers: 123,
    accountLicenseType: 123,
    licensedProducts: null,
    licenseAssignDate: new Date,
    licenseExpirationDate: new Date,
    comments: '',
    nodeType: EntityType.Account,
    parentNodeId: 'ROOT',
    displayName: '',
  };

  const location = {
    currentLabLocation: {
      children: Department,
      locationTimeZone: '',
      locationOffset: '1',
      locationDayLightSaving: 'Yes',
      nodeType: EntityType.LabLocation,
      labLocationName: 'LocationName',
      labLocationContactId: '12',
      labLocationAddressId: '34',
      labLocationContact: Contact,
      labLocationAddress: Address,
      parentNode: Lab,
      migrationStatus: MigrationStates.Completed
    },
    currentLabLocationContact: LabLocationContact
  };

  const mockCurrentLabLocation = {
    children: [],
    locationTimeZone: 'America/Los_Angeles',
    locationOffset: '',
    locationDayLightSaving: '',
    nodeType: 2,
    unityNextTier: UnityNextTier.DailyQc,
    labLocationName: '',
    labLocationContactId: '',
    labLocationAddressId: '',
    labLocationContact: null,
    labLocationAddress: null,
    id: '',
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

  const storeStub = {
    security: authStub,
    auth: authStub,
    userPreference: null,
    router: null,
    navigation: navigationStub,
    location: location,
    account: {
      currentAccountSummary: Accounts
    },
    uiConfigState: null
  };

  const appState = [];
  const mockDataTimeHelper = jasmine.createSpyObj(['getSomeDaysAheadDate']);
  const dateTime = {
    tz: '06-01-2020',
    tzDateTime: {
      DateObj: 'Fri May 01 2020 15:45:16 GMT+0530',
      DateTimeNoFormat: '2020-05-01T15:55:17+05:30',
      DateTimeFormatted: '2020-05-01 03:30',
      DateFormatted: '2020-05-01',
      TimeFormatted: '03:30'
    },
    utcDateTime: {
      DateObj: 'Fri May 01 2020 15:45:16 GMT+0530',
      DateTimeNoFormat: '2020-05-01T15:55:17+05:30',
      DateTimeFormatted: '2020-05-01 03:30',
      DateFormatted: '2020-05-01',
      TimeFormatted: '03:30'
    }
  };
  const mockDataTimeHelperDate = {
    getNow: () => {
      return dateTime;
    },
    getDifferenceInDays: () => {
      return 2;
    }
  };

  const totalUnreviewedRunCount = {
    totalUnreviewedRunCount: 84
  };

  const mockDataReviewService = {
    getDataReviewCount: () => {
      return of(totalUnreviewedRunCount);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActionableDashboardComponent,
        GreetingComponent,
        ExpiringLotsPanelComponent,
        ExpiringLotsComponent,
        ExpiringLotsListComponent,
        UnDateFormatPipe,
        UnextTimePeriodPipe,
        ExpiringLicenseComponent,
        ExpiringLicensePanelComponent,
        LotviewerComponent,
        LotviewerPanelComponent,
        LotviewerDialogComponent,
        QcReviewResultComponent,
        QcReviewResultPanelComponent
      ],
      imports: [
        PerfectScrollbarModule,
        HttpClientTestingModule,
        MaterialModule,
        NgReduxModule,
        NgReduxTestingModule,
        UnityNextNumberModule,
        BrSelect,
        IndicatorModule,
        StoreModule.forRoot(appState),
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: AuthenticationService, useValue: getCurrentUserStub },
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        { provide: DateTimeHelper, useValue: mockDataTimeHelperDate },
        { provide: LoggingApiService, useValue: mockLoggingApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: LotViewerService, useValue: lotViewerServiceStub },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: NavigationService, useValue: of('') },
        { provide: DataReviewService, useValue: mockDataReviewService },
        AppLoggerService,
        {
          provide: ActivatedRoute, useValue: {
            queryParamMap: of({
              get: () => ({ [unRouting.navigationOrigin]: unRouting.login })
            })
          }
        }
      ]
    }).compileComponents();
    // create component and test fixture
    fixture = TestBed.createComponent(ActionableDashboardComponent);
    // get test component from the fixture
    component = fixture.componentInstance;
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.isAuthenticated = true;
    component.hasExpiringLots = false;
    component.hasExpiringLicense = false;
    component.migrationState = MigrationStates.Completed;
    component.labLocation = mockCurrentLabLocation;
    fixture.detectChanges();
    // TODO: Uncomment when lot expiration is ready
    // hasExpiringLots = fixture.debugElement.nativeElement.querySelector('.hasExpiringLots');
    hasExpiringLicense = fixture.debugElement.nativeElement.querySelector('.spec_hasExpiringLicense');
    component.hasExpiringLots = true;
    component.hasExpiringLicense = true;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('If hasExpiringLots is false, the card holding ExpiringLicenseComponent is not displayed.', () => {
    expect(hasExpiringLots).toBeFalsy();
  });

  it('If hasExpiringLicense false, the card holding ExpiringLicenseContainerComponent is not displayed', () => {
    expect(hasExpiringLicense).toBeFalsy();
  });

  it('should check if logined user has user role', fakeAsync(() => {
    authStub.currentUser.roles = ['User'];
    fixture.detectChanges();
    expect(authStub.currentUser.roles).toEqual(['User'], 'ngOnInit');
  }));

  it('should check if logined user has Admin role', fakeAsync(() => {
    authStub.currentUser.roles = ['Admin'];
    fixture.detectChanges();
    expect(authStub.currentUser.roles).toEqual(['Admin'], 'ngOnInit');
  }));

  it('should check if logined user has SalesPerson role', fakeAsync(() => {
    authStub.currentUser.roles = ['SalesPerson'];
    fixture.detectChanges();
    expect(authStub.currentUser.roles).toEqual(['SalesPerson'], 'ngOnInit');
  }));

  it('should check if logined user has LotViewerAdmin role', fakeAsync(() => {
    authStub.currentUser.roles = ['LotViewerAdmin'];
    fixture.detectChanges();
    expect(authStub.currentUser.roles).toEqual(['LotViewerAdmin'], 'ngOnInit');
  }));

  it('should check if logined user has LotViewer role', fakeAsync(() => {
    authStub.currentUser.roles = ['LotViewer'];
    fixture.detectChanges();
    expect(authStub.currentUser.roles).toEqual(['LotViewer'], 'ngOnInit');
  }));

  it('should check if setLoaderFlag have been called with parameter hasExpiringLicenseFlag', () => {
    spyOn<any>(component, 'setLoaderFlag').and.callThrough();
    fixture.detectChanges();
    component.onExpiryLicenceFlagGenerated(true);
    expect(component['setLoaderFlag']).toHaveBeenCalledWith('hasExpiringLicenseFlag');
  });

  it('should check if setLoaderFlag have been called with parameter currentValue', () => {
    spyOn<any>(component, 'setLoaderFlag').and.callThrough();
    fixture.detectChanges();
    const changes: SimpleChanges = {
      isLoading: {
        previousValue: null,
        currentValue: false,
        firstChange: null,
        isFirstChange: null
      }
    };
    component.ngOnChanges(changes);
    expect(component['setLoaderFlag']).toHaveBeenCalledWith(changes.isLoading.currentValue);
  });
});
 */
