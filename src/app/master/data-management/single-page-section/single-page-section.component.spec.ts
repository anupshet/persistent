// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AnalyteEntryType, AnalyteSummaryView, GlobalLabels, TranslationLabels } from 'br-component-library';
import { SinglePageSectionComponent } from './single-page-section.component';
import { PageSectionService } from '../../../shared/page-section/page-section.service';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { DataManagementSpinnerService } from '../../../shared/services/data-management-spinner.service';
import { LabDataApiService } from '../../../shared/api/labDataApi.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { RunsService } from '../../../shared/services/runs.service';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';
import {
  SummaryStatisticsTableService
} from '../analyte-detail-table/analytical-section/summary-statistics-table/summary-statistics-table.service';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { AuthenticationService } from '../../../security/services';
import { LabTestService } from '../../../shared/services/test-run.service';
import { DataManagementService } from '../../../shared/services/data-management.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { InProgressMessageTranslationService } from '../../../shared/services/inprogress-message-translation.service';
import { By } from '@angular/platform-browser';

import * as singlePageConst from './single-page-section.const';
import { LabLocation } from '../../../contracts/models/lab-setup';
import { Account } from '../../../contracts/models/account-management/account';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { LoggingApiService } from '../../../shared/api/logging-api.service';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus } from '../../../shared/models/audit-tracking.model';
import { HttpLoaderFactory } from '../../../app.module';

//TODO: TRUPTI - Check audit trail testcase
describe('SinglePageSectionComponent', () => {
  let component: SinglePageSectionComponent;
  let fixture: ComponentFixture<SinglePageSectionComponent>;

  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking', 'getAuditTrailHistory']);

  @Component({ selector: 'unext-analytical-section', template: '<div></div>' })
  class AnalyticalSectionStubComponent {
    @Input() isSummary: boolean;
    @Input() monthSummaryByLevel: [];
    @Input() decimalPlaces: [];
  }

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'br-analyte-summary-entry', template: '<div></div>' })
  class BrAnalyteSummaryEntryStubComponent {
    @Input() formControlName: string;
    @Input() selectedDate: Date;
    @Input() analyteEntryType: AnalyteEntryType;
    @Input() translationLabelDictionary: TranslationLabels;
    @Input() enableSubmit: boolean;
    @Input() isRunEntryMode: boolean;
    @Input() availableDateTo: Date;
    @Input() availableDateFrom: Date;
    @Input() isSingleEditMode = false;
    @Input() timeZone: string;
    @Input() isProductMasterLotExpired: boolean;
  }

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'br-analyte-summary-view', template: '<div></div>' })
  class BrAnalyteSummaryViewStubComponent {
    @Input() formControlName: string;
    @Input() analyteView: AnalyteSummaryView;
    @Input() globalLabels: GlobalLabels;
    @Input() translationLabelDictionary: TranslationLabels;
    @Input() isSinglePageSummary: boolean;
    @Input() dateTimeOffset: string;
  }
  class MockNotificationService {
    public get $labTestStream() {
      return of(null);
    }
    public subscribeLabTestToHubWithoutUnsubscribePrevious() { }
    public subscribeLabTestToHub() { }
  }

  const prepareAuditTrailPayloadData: AppNavigationTracking = {
    accountName: 'Testing_FeatureEdge',
    accountNumber: '203295',
    account_id: 'ea750fa2-c89b-4ed5-805b-648ab9be5fce',
    auditTrail: {
      'eventType': 'Lab Setup',
      'action': 'Update',
      'actionStatus': 'Success',
      'runDateTime': new Date(),
      'priorValue': {
        'dataType': 0,
        'trackReagentCalibrator': false,
        'decimalPlaces': 2
      },
      'currentValue': {
        'dataType': 1,
        'trackReagentCalibrator': true,
        'decimalPlaces': 1
      }
    },
    awsCorrelationId: '',
    eventDateTime: new Date(),
    localDateTime: new Date(),
    groupName: 'Testing_FeatureEdge',
    group_id: 'e67e8741-2e94-4073-b550-9698f961b155',
    locationName: 'Testing_FeatureEdge',
    location_id: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
    userRoles: ['Admin'],
    user_id: '00uh0hremzn62Egrg2p7',
    hasDepartments: false
  };

  const currentMockData = {
    'isAccepted': true,
    'labTestId': '695b5a03-69b6-485a-b3bd-b8efedaa95b1',
    'labInstrumentId': '8fbbbf1f-c125-4080-9a02-c5460ae2f25c',
    'labProductId': '9dd216f6-65bf-4275-a733-3948ec604ebc',
    'testId': 1118,
    'testSpecId': 1119,
    'labId': '00000000-0000-0000-0000-000000000000',
    'accountId': 'e8435a3b-ff52-4d48-9b90-413bb713ec1f',
    'accountNumber': '103151',
    'labUnitId': 63,
    'dataType': 1,
    'dataSource': 1,
    'rawDataDateTime': '2023-03-01T07:59:59.999Z',
    'summaryDateTime': '2023-03-01T07:59:59.999Z',
    'localSummaryDateTime': '2023-03-01T07:59:59.999Z',
    'enteredDateTime': '2023-03-02T11:42:46.709Z',
    'labLocationTimeZone': 'America/Los_Angeles',
    'results': [
      {
        'isAccepted': true,
        'mean': 22,
        'sd': 33,
        'nPts': 44,
        'controlLevel': 1,
        'controlLotId': 2561,
        'lastModified': '2023-03-02T11:42:46.709Z'
      }
    ]
  };

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const accountState: Account = {
    accountName: 'test',
    accountAddress: {
      entityType: 1,
      streetAddress1: '21 Technology Drive',
      streetAddress2: '',
      streetAddress3: '',
      city: '',
      state: '',
      country: 'US',
      zipCode: '',
      id: '30114426-9a0f-4901-bdb1-20327584045a',
      streetAddress: 'Rajiv Gandhi IT Park Pune',
      suite: '',
      searchAttribute: '',
      nickName: ''
    },
    shipTo: '',
    soldTo: '',
    accountAddressId: '30114426-9a0f-4901-bdb1-20327584045a',
    accountContact: {
      firstName: 'Vishwajit',
      lastName: 'Shinde',
      name: 'Vishwajit Shinde',
      email: 'vishwajit_shinde+dev20@bio-rad.com',
    },
    accountContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
    accountLicenseType: 0,
    accountNumber: '100469',
    comments: '',
    displayName: '100469',
    formattedAccountNumber: 'U100469',
    id: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
    licenseAssignDate: new Date('2020-02-08T03:55:17.832Z'),
    licenseExpirationDate: new Date('2025-02-14T08:00:00Z'),
    licenseNumberUsers: 1,
    licensedProducts: [
      {
        product: 1,
        fileOption: 1
      }
    ],
    nodeType: 0,
    migrationStatus: null,
    orderNumber: '',
    parentNodeId: 'ROOT',
    primaryUnityLabNumbers: null,
    sapNumber: '',
    labName: 'labname',
    lotViewer: '',
    children: [],
    previousContactUserId: null,
    languagePreference: 'en-us'
  };

  const location: LabLocation = {
    'id': '669b42c2-355d-4e88-af85-e34d74d90920',
    'parentNodeId': '99415057-1026-4c22-b687-5198ec44a5ab',
    'parentNode': {
      'displayName': 'Dev2 Internal Account1',
      'id': '99415057-1026-4c22-b687-5198ec44a5ab',
      'isUnavailable': false,
      'labName': 'Dev2 Internal Account1',
      'nodeType': 1,
      'parentNodeId': 'bf1d67a6-a43a-46ac-bafc-992b8305f421'
    },
    'nodeType': 2,
    'displayName': 'Amazing Lab Center',
    'children': null,
    'labLocationName': 'test after',
    'locationTimeZone': '',
    'locationOffset': '',
    'locationDayLightSaving': '',
    'labLocationContactId': '9753dfcb-448c-4faa-b5f0-e5a40f47033a',
    'labLocationAddressId': '57c048df-7904-4d9d-aed1-77e64ab760fb',
    'labLocationContact': {
      'entityType': 0,
      'firstName': 'rock',
      'lastName': 'doe',
      'name': 'rockdoe',
      'email': 'rock@gms.com',
      'id': ''
    },
    'contactRoles': [],
    'labLocationAddress': {
      'entityType': 0,
      'nickName': '123 Main St.',
      'streetAddress1': 'demoi',
      'streetAddress2': 'Ste. ABC',
      'streetAddress': 'demoi',
      'city': 'ee',
      'state': 'eee',
      'country': 'AX',
      'zipCode': '234234',
      'id': ''
    },
    'shipTo': '1234',
    'soldTo': '123456',
    'orderNumber': 'U100503',
    'unityNextTier': 1,
    'unityNextInstalledProduct': null,
    'connectivityTier': 1,
    'connectivityInstalledProduct': null,
    'lotViewerLicense': 1,
    'lotViewerInstalledProduct': null,
    'addOns': 1,
    'addOnsFlags': {
      'valueAssignment': true,
      'allowBR': false,
      'allowNonBR': false,
      'allowSiemensHematology': false,
      'allowSysmexHemostasis': false
    },
    // 'crossOverStudy': 1,
    'licenseNumberUsers': 12223,
    'licenseAssignDate': new Date('2022-04-28T13:10:26.889Z'),
    'licenseExpirationDate': new Date('2022-06-28T13:10:26.889Z'),
    'hasChildren': true,
    'locationCount': 3,
    'accountName': 'Amazing Lab Center',
    'accountNumber': 'U100503',
    'groupName': 'Another Group',
    'formattedAccountNumber': 'U100503',
    'transformers': null,
    'usedArchive': true,
    'previousContactUserId': null,
    'labLanguagePreference': 'en-us'
  };

  const mockAuditTrailValues = [
    {
      accountName: 'AB Testing Lab Data Upload ',
      eventDateTime: '2023-02-22T07:30:44.693Z',
      auditTrail: {
        action: 'Update',
        actionStatus: 'Success',
        firstName: '',
        lastName: '',
        currentValue: {
          isAction: true,
          action: 'Control reconstituted new',
          isComment: true,
          comment: 'New point edit test 1',
          levelData: [
            {
              level: 1,
              resultValue: 2
            }
          ]
        },
        eventType: 'Analyte Data Table',
        priorValue: {
          levelData: [
            {
              level: 1,
              resultValue: 1
            }
          ]
        },
        device_id: '71d26b6a-0f6b-40bc-bdcb-282076b672e8',
        run_id: 15939134,
        runDateTime: '2023-02-22T07:30:44.693Z',
        oktaId: '887696gjhi8'
      }
    }
  ];

  const mockLabDataService = {
    getLatestSummaryDataByLabTestIdAsync: () => of(['test'])
  };

  const mockPortalApiService = {
    getLabSetupNode: () => of({ testSpecInfo: null })
  };

  const mockAppNavigationTrackingService = {
    getDataTableATHistory: () => of({ 8799: [mockAuditTrailValues[0]] }),
    prepareAuditTrailPayload: () => { },
    fetchData: () => prepareAuditTrailPayloadData,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PerfectScrollbarModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
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
      declarations: [
        SinglePageSectionComponent,
        AnalyticalSectionStubComponent,
        BrAnalyteSummaryEntryStubComponent,
        BrAnalyteSummaryViewStubComponent,
      ],
      providers: [
        { provide: Store, useValue: singlePageConst.mockStore },
        provideMockStore({ initialState: singlePageConst.mockStore }),
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: singlePageConst.DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: MatDialog, useValue: singlePageConst.mockMatDialog },
        // { provide: PageSectionService, useValue: mockPageSectionService },
        PageSectionService,
        { provide: DataManagementService, useValue: singlePageConst.mockDataManagementService },
        { provide: AuthenticationService, useValue: singlePageConst.mockAuthenticationService },
        { provide: LabTestService, useValue: singlePageConst.mockLabTestService },
        { provide: CodelistApiService, useValue: singlePageConst.mockCodelistApiService },
        { provide: DataManagementSpinnerService, useValue: singlePageConst.mockDataManagementSpinnerService },
        { provide: MessageSnackBarService, useValue: '' },
        { provide: RunsService, useValue: singlePageConst.mockRunsService },
        { provide: NotificationService, useValue: singlePageConst.mockNotificationService },
        { provide: DateTimeHelper, useValue: singlePageConst.mockDateTimeHelper },
        { provide: ChangeTrackerService, useValue: {} },
        { provide: AppLoggerService, useValue: {} },
        { provide: NavigationService, useValue: singlePageConst.mockNavigationService },
        { provide: LabDataApiService, useValue: singlePageConst.mockLabDataApiService },
        { provide: ErrorLoggerService, useValue: singlePageConst.mockErrorLoggerService },
        { provide: SummaryStatisticsTableService, useValue: singlePageConst.mockSummaryStatService },
        { provide: InProgressMessageTranslationService, useValue: singlePageConst.mockInprogressMessageService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: LoggingApiService, useValue: loggingApiServiceMock },
        { provide: LabDataApiService, useValue: mockLabDataService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        TranslateService,
        DecimalPipe,
        HttpClient,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePageSectionComponent);
    component = fixture.componentInstance;
    component.licensedProducts = [{ product: 1, fileOption: 1 }];
    component.licensedProductTypeConnectivity = 1;
    component.instrumentSection = {
      instrument: null,
      productSections: [
        {
          product: null,
          analyteSections: [{
            analyteInfo: {
              testName: 'test',
              labTestId: 'test',
              controlLotIds: [1, 2, 3],
              levelsInUse: [1, 2, 3],
              decimalPlaces: [1, 2, 3],
              productMasterLotId: 'test',
              productMasterLotExpiration: new Date(),
              codeListTestId: 1,
              labUnitId: 1,
              defaultReagentLot: {
                reagentId: 0,
                id: 0,
                lotNumber: '',
                reagentCategory: 2,
                shelfExpirationDate: new Date()
              },
              defaultCalibratorLot: {
                calibratorId: 0,
                id: 0,
                lotNumber: '',
                shelfExpirationDate: new Date()
              },
              instrumentId: 'test',
              productId: 'test',
              testId: 'test',
              isSummary: false,
              correlatedTestSpecId: 'test',
              testSpecId: 'test',
              isArchived: false,
              sortOrder: 0
            }
          }]
        }
      ]
    };
    component.getAccountState$ = of(accountState);
    component.getLocationState$ = of(location);
    component.entityType = 6;
    component.cumulativeLevelsInUse = [2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check for action type update', () => {
    component.typeOfAction = 'Update',
      expect(component.typeOfAction).toEqual(AuditTrackingAction.Update);
  });

  it('should check for prepareAuditTrailPayload', () => {
    component.auditTrailDetails = prepareAuditTrailPayloadData;
    spyOn(mockAppNavigationTrackingService, 'prepareAuditTrailPayload');
    component['sendAuditTrailPayload'](currentMockData, {}, prepareAuditTrailPayloadData,
      AuditTrackingAction.Add, AuditTrackingActionStatus.Success);
    expect(mockAppNavigationTrackingService.prepareAuditTrailPayload).toHaveBeenCalled();
  });

  it('should create for Instrument Entity', () => {
    component.entityType = 4;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should create for Control Entity', () => {
    component.entityType = 5;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display "Manually enter data" link', () => {
    component.hasConnectivity = true;
    component.instrumentSection.productSections[0].analyteSections[0].analyteInfo.testId = '1';
    fixture.detectChanges();
    const manuallyEnterSummaryLink = fixture.debugElement.nativeElement.querySelector('.manually-enter-summary');
    expect(manuallyEnterSummaryLink).toBeTruthy();
  });

  it('should not display "Manually enter summary" link', async () => {
    component.hasConnectivity = false;
    component.instrumentSection.productSections[0].analyteSections[0].analyteInfo.testId = '1';
    const manuallyEnterSummaryLink = fixture.debugElement.nativeElement.querySelector('.manually-enter-summary');
    fixture.detectChanges();
    expect(manuallyEnterSummaryLink).toBeNull();
    fixture.whenStable().then(() => {
      expect(manuallyEnterSummaryLink).toBeNull();
    });
  });

  it('should navigate to panel settings', async () => {
    component['labTestId'] = '2566';
    component.inProgress = false;
    const spyObj = spyOn(component, 'gotoEditAnalyte').and.callThrough();
    fixture.detectChanges();
    const btnElem = fixture.debugElement.query(By.css('.spec_edit_nav'));
    expect(btnElem).toBeTruthy();
    btnElem.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spyObj).toHaveBeenCalled();
    });
  });

  it('should display "Manually enter data" link for summary', () => {
    // Setting condition to desplay the link
    component.licensedProducts = [{ product: 1, fileOption: 1 }];
    component.licensedProductTypeConnectivity = 1;
    component.instrumentSection.productSections[0].analyteSections[0].analyteInfo.testId = '1';
    component.instrumentSection.productSections[0].analyteSections[0].analyteInfo.isSummary = true;
    fixture.detectChanges();
    const manuallyEnterSummaryLink = fixture.debugElement.nativeElement.querySelector('.manually-enter-summary');
    expect(manuallyEnterSummaryLink).toBeTruthy();
  });

  it('should open dialog for edit', () => {
    const spy = spyOn(component, 'openDataEditDialog').and.callThrough();
    component.analyteViewSets = singlePageConst.analyteViewSets;
    component.baseRawDataSet = singlePageConst.baseRawDataSet;
    component.openDataEditDialog(0);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
