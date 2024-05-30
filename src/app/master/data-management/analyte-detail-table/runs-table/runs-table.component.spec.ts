// © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved.
import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, Observable } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { CalibratorLot, ReagentLot, Action, UserComment, UserInteraction } from 'br-component-library';

import { RunData, TestSpecInfo } from '../../../../contracts/models/data-management/run-data.model';
import { RunInsertState } from '../../../../contracts/models/data-management/run-insert-state.model';
import { ValueCell } from '../../../../contracts/models/data-management/runs-table/value-cell.model';
import { ZScoreCell } from '../../../../contracts/models/data-management/runs-table/zscore-cell.model';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { TestTrackerService } from '../../../../shared/services/test-tracker.service';
import { RunsService } from '../../../../shared/services/runs.service';
import { RunsTableComponent } from './runs-table.component';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LevelEvaluationMeanSd } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { AwsApiService } from '../../../../shared/api/aws.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { DataManagementService } from '../../../../shared/services/data-management.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { HttpLoaderFactory } from '../../../../app.module';

//TODO: TRUPTI - Check audit trail testcase
describe('New Runs Table Component', () => {
  let component: RunsTableComponent;
  let fixture: ComponentFixture<RunsTableComponent>;

  @Component({
    selector: 'unext-run-insert',
    template: '<div></div>'
  })
  class FakeRunInsertComponent {
    @Input() state: RunInsertState;
    @Input() defaultReagentLotId: number;
    @Input() defaultCalibratorLotId: number;
    @Input() reagentLots: Array<ReagentLot>;
    @Input() calibratorLots: Array<CalibratorLot>;
    @Input() labTimeZone: string;
    @Input() controlLotIds: Array<number>;
    @Input() labTestId: number;
    @Input() codeListTestId: number;
    @Input() labId: number;
    @Input() labInstrumentId: string;
    @Input() labProductId: string;
    @Input() accountId: string;
    @Input() labUnitId: number;
    @Input() latestRunData: RunData;
    @Input() testId: string;
    @Input() productMasterLotExpiration: Date;
    @Input() productId: number;
    @Input() productMasterLotId: number;
    @Output() onNewRunPost: EventEmitter<RunData> = new EventEmitter<RunData>();
  }
  const mockDataLevelEvaluationMeanSd = [
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'level': 1,
      'meanEvaluationType': 1,
      'mean': 15.15,
      'sdEvaluationType': 2,
      'sd': 15.15,
      'sdIsCalculated': false,
      'cvEvaluationType': 2,
      'cv': 100,
      'cvIsCalculated': true
    }, {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'level': 2,
      'meanEvaluationType': 1,
      'mean': 15.15,
      'sdEvaluationType': 2,
      'sd': 15.15,
      'sdIsCalculated': false,
      'cvEvaluationType': 2,
      'cv': 100,
      'cvIsCalculated': true
    }
  ];
  class MockAwsApiService {
    getEvaluationMeanSdForRun(runId: string): Observable<Array<LevelEvaluationMeanSd>> {
      const data: Array<LevelEvaluationMeanSd> = mockDataLevelEvaluationMeanSd;
      return of(data);
    }
  }

  @Component({
    selector: 'unext-date-time-cell',
    template: '<div></div>'
  })
  class FakeDateTimeCellComponent {
    @Input() runDateTime: Date;
    @Input() isInsert: boolean;
  }

  @Component({
    selector: 'unext-value-cell',
    template: '<div></div>'
  })
  class FakeValueCellComponent {
    @Input()
    valueCell: ValueCell;
    @Input()
    decimalPlace: string;
  }

  @Component({
    selector: 'unext-zscore-cell',
    template: '<div></div>'
  })
  class FakeZscoreCellComponent {
    @Input()
    zScoreCell: ZScoreCell;
  }

  @Component({
    selector: 'unext-reason-cell',
    template: '<div></div>'
  })
  class FakeReasonCellComponent {
    @Input() reasons: string[];
  }

  @Component({
    selector: 'unext-br-pez-cell',
    template: '<div></div>'
  })
  class FakePezCell {
    @Input()
    actions: Action[];
    @Input()
    comments: UserComment[];
    @Input()
    interactions: UserInteraction[];
    @Input()
    pezDateTimeOffset: string;
  }

  const mockRunsService = jasmine.createSpyObj([
    'deleteRunData',
    'getTranslation'
  ]);

  const mockMessageSnackBarService = jasmine.createSpyObj([
    'showMessageSnackBar'
  ]);

  const mockTestTrackerService = jasmine.createSpyObj(['getEntity']);

  const mockPortalApiService = {
    getLabSetupNode: () => of({ testSpecInfo: null })
  };


  const mockCodelistApiService = jasmine.createSpyObj(['getTestSpecByIdAsync']);

  const mockdataManagementService = {
    updateEntityInfo: () => { },
    extractInteractions: () => [],
    staticTranslate: () => ''
  };

  const mockMatDialog = jasmine.createSpyObj(['open', 'close', 'closeAll']);

  const mockDataTimeHelper = jasmine.createSpyObj([
    'ConvertToDateFromDate',
    'getTimeZoneOffset'
  ]);

  const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false, suppressScrollY: true
  };
  const mockCodeListService = {
    getTestByIdAsync(codeListTestId: string) {
      return { reagentId: '', calibratorId: '' };
    },
    getReagentLotsByReagentIdAsync(reagentId: string, doNotshowBusy?: boolean) {
      return [new ReagentLot()];
    },
    getCalibratorLotsByCalibratorIdAsync(calibratorId: string, doNotshowBusy?: boolean) {
      return [new CalibratorLot()];
    }
  };
  const mockStore = {
    security: null,
    auth: {
      isLoggedIn: true,
      currentUser: {
        firstName: 'Sanjay',
        lastName: 'Chavan',
        email: 'sanjay_chavan+dev48@bio-rad.com',
        userOktaId: '00u79kzz0z27UEK7R2p7',
        roles: [
          'Admin'
        ],
        accessToken: {
          accessToken: 'eyJraWQiOiJPYWRzbHZzVDBQRU0tMUdya1FLQzd2TXY3bXVnc3B2NkdnMEx1NVczdS1NIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULldzODA5dWxwWlNpUzFuT3lORS1MdkdOSHNqa0trUExpWmVYZ2pmak5JZGsiLCJpc3MiOiJodHRwczovL2Jpb3JhZC1leHQub2t0YS5jb20vb2F1dGgyL2F1czUzbmxtOTAwQkJLbFBuMnA3IiwiYXVkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJpYXQiOjE1OTI1NTUwMDAsImV4cCI6MTU5MjU1ODYwMCwiY2lkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJ1aWQiOiIwMHU3OWt6ejB6MjdVRUs3UjJwNyIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJzYW5qYXlfY2hhdmFuK2RldjQ4QGJpby1yYWQuY29tIiwiVXNlckxhc3ROYW1lIjoiQ2hhdmFuIiwiVXNlckZpcnN0TmFtZSI6IlNhbmpheSIsIlVzZXJFbWFpbCI6InNhbmpheV9jaGF2YW4rZGV2NDhAYmlvLXJhZC5jb20iLCJVc2VyRGlzcGxheU5hbWUiOiJTYW5qYXkgQ2hhdmFuIn0.h0Dg36oCzpyDBU-6vZLy9KW7m2qPQZIASlTsURQVUgnS2VeiHujVewR-k6WK552GDyA7zVKOEC2phy3-hAusIy2LI0-tzFavbw8b6spHz6Hk7r9I0KY4aTghC6ULaJjZ_TMNl3xtjzmkgt8PVlczYfpVnohVILITvH0Lzc8yBFMSgb0ibjFAb7M-KJmHF2xBK5t8kkf6coZdNPPdRTpNLLKoHh2wc8pCmHp-g7Zkqr0erdF1Qa66UxA0b0cqmiqoCAHuyzS-7zISv1khHXxatjpxzAoJpvIvs7lw7GvEhZG5wDuy30MllJlcWn34AbbcuQHAGo-QCkRz-vaDADAPSw',
          expiresAt: 1592558579,
          tokenType: 'Bearer',
          scopes: [
            'openid',
            'email'
          ],
          authorizeUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/authorize',
          userinfoUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/userinfo'
        },
        accountNumber: '100896',
        accountId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
        accountNumberArray: [
          '100896'
        ],
        labLocationId: 'e5d86be8-4b11-4df1-85ac-214607e21884',
        labLocationIds: [
          'e5d86be8-4b11-4df1-85ac-214607e21884'
        ],
        permissions: {},
        userData: {},
        id: '2e8cf1ac-99fc-4754-a5df-d5aaef670635'
      },
      directory: {
        displayName: '100896',
        accountNumber: '100896',
        formattedAccountNumber: 'U100896',
        sapNumber: '',
        orderNumber: '',
        accountAddressId: '72dc081c-9233-4b13-b911-3cdebbd9b0f8',
        accountContactId: 'b588d1af-62f9-4aa3-a222-7a7869c44570',
        accountLicenseType: 0,
        licensedProducts: [
          {
            product: 1,
            fileOption: 1
          }
        ],
        licenseNumberUsers: 10,
        accountContact: {
          entityType: 0,
          searchAttribute: 'sanjay_chavan+dev48@bio-rad.com',
          firstName: 'Sanjay',
          middleName: '',
          lastName: 'Chavan',
          name: 'Sanjay Chavan',
          email: 'sanjay_chavan+dev48@bio-rad.com',
          phone: '',
          id: 'b588d1af-62f9-4aa3-a222-7a7869c44570',
          featureInfo: {
            uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
        },
        accountAddress: {
          entityType: 1,
          searchAttribute: '',
          nickName: '',
          streetAddress1: ' Hinjawadi - Wakad Rd',
          streetAddress2: '',
          streetAddress3: '',
          streetAddress: 'Hinjawadi - Wakad Rd',
          suite: '',
          city: 'Pimpri-Chinchwad',
          state: 'MH',
          country: 'IN',
          zipCode: '411057',
          id: '72dc081c-9233-4b13-b911-3cdebbd9b0f8',
          featureInfo: {
            uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
          }
        },
        licenseAssignDate: '2020-05-20T07:08:54.618Z',
        licenseExpirationDate: '2020-08-20T07:08:54.618Z',
        comments: '',
        primaryUnityLabNumbers: '',
        migrationStatus: '',
        accountSettings: {
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
          id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
          parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
          parentNode: null,
          nodeType: 9,
          children: null
        },
        shipTo: '2000000',
        soldTo: '1000000',
        id: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
        parentNodeId: 'ROOT',
        parentNode: null,
        nodeType: 0,
        children: [
          {
            displayName: 'Sanjay\'s Lab',
            labName: 'Sanjay\'s Lab',
            accountSettings: {
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
              id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
              parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
              parentNode: null,
              nodeType: 9,
              children: null
            },
            hasOwnAccountSettings: false,
            id: '0476341c-8d8c-496b-a096-c8d391efd492',
            parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
            parentNode: null,
            nodeType: 1,
            children: [
              {
                displayName: 'Sanjay\'s Lab',
                labLocationName: 'Sanjay\'s Lab',
                locationTimeZone: 'Asia/Kolkata',
                locationOffset: '05:30:00',
                locationDayLightSaving: '00:00:00',
                labLocationContactId: 'b588d1af-62f9-4aa3-a222-7a7869c44570',
                labLocationAddressId: '4da9871b-ea62-4487-90ce-48fa751e19ef',
                labLocationContact: {
                  entityType: 0,
                  searchAttribute: 'sanjay_chavan+dev48@bio-rad.com',
                  firstName: 'Sanjay',
                  middleName: '',
                  lastName: 'Chavan',
                  name: 'Sanjay Chavan',
                  email: 'sanjay_chavan+dev48@bio-rad.com',
                  phone: '',
                  id: 'b588d1af-62f9-4aa3-a222-7a7869c44570',
                  featureInfo: {
                    uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
                  }
                },
                labLocationAddress: {
                  entityType: 1,
                  searchAttribute: '',
                  nickName: '',
                  streetAddress1: ' Hinjawadi - Wakad Rd',
                  streetAddress2: '',
                  streetAddress3: '',
                  streetAddress: 'Hinjawadi - Wakad Rd',
                  suite: '',
                  city: 'Pimpri-Chinchwad',
                  state: 'MH',
                  country: 'IN',
                  zipCode: '411057',
                  id: '4da9871b-ea62-4487-90ce-48fa751e19ef',
                  featureInfo: {
                    uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
                  }
                },
                accountSettings: {
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
                  id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
                  parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
                  parentNode: null,
                  nodeType: 9,
                  children: null
                },
                hasOwnAccountSettings: false,
                id: 'e5d86be8-4b11-4df1-85ac-214607e21884',
                parentNodeId: '0476341c-8d8c-496b-a096-c8d391efd492',
                parentNode: null,
                nodeType: 2,
                children: []
              }
            ]
          },
          {
            displayName: 'Sanjay Chavan',
            contactId: 'b588d1af-62f9-4aa3-a222-7a7869c44570',
            userOktaId: '00u79kzz0z27UEK7R2p7',
            userRoles: [
              'Admin'
            ],
            contactInfo: {
              entityType: 0,
              searchAttribute: 'sanjay_chavan+dev48@bio-rad.com',
              firstName: 'Sanjay',
              middleName: '',
              lastName: 'Chavan',
              name: 'Sanjay Chavan',
              email: 'sanjay_chavan+dev48@bio-rad.com',
              phone: '',
              id: 'b588d1af-62f9-4aa3-a222-7a7869c44570',
              featureInfo: {
                uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
              }
            },
            preferences: {
              entityType: 2,
              searchAttribute: '2e8cf1ac-99fc-4754-a5df-d5aaef670635',
              lastSelectedEntityId: null,
              lastSelectedEntityType: 0,
              termsAcceptedDateTime: '2020-05-20T08:30:13.426Z',
              id: '2e8cf1ac-99fc-4754-a5df-d5aaef670635',
              featureInfo: {
                uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
              }
            },
            parentAccounts: [
              {
                displayName: '100896',
                accountNumber: '100896',
                formattedAccountNumber: 'U100896',
                sapNumber: '',
                orderNumber: '',
                accountAddressId: '72dc081c-9233-4b13-b911-3cdebbd9b0f8',
                accountContactId: 'b588d1af-62f9-4aa3-a222-7a7869c44570',
                accountLicenseType: 0,
                licensedProducts: [
                  {
                    product: 1,
                    fileOption: 1
                  }
                ],
                licenseNumberUsers: 10,
                accountContact: null,
                accountAddress: null,
                licenseAssignDate: '2020-05-20T07:08:54.618Z',
                licenseExpirationDate: '2020-08-20T07:08:54.618Z',
                comments: '',
                primaryUnityLabNumbers: '',
                migrationStatus: '',
                accountSettings: {
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
                  id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
                  parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
                  parentNode: null,
                  nodeType: 9,
                  children: null
                },
                shipTo: '2000000',
                soldTo: '1000000',
                id: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
                parentNodeId: 'ROOT',
                parentNode: null,
                nodeType: 0,
                children: null
              }
            ],
            id: '2e8cf1ac-99fc-4754-a5df-d5aaef670635',
            parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
            parentNode: null,
            nodeType: 7,
            children: []
          }
        ]
      }
    },
    userPreference: null,
    router: null,
    navigation: {
      selectedNode: {
        displayName: 'Test control',
        productId: '240',
        productMasterLotId: '223',
        productCustomName: 'Test control',
        productInfo: {
          id: 240,
          name: 'Diabetes (Liquichek)',
          manufacturerId: 2,
          manufacturerName: 'Bio-Rad',
          matrixId: 6,
          matrixName: 'Whole Blood'
        },
        lotInfo: {
          id: 223,
          productId: 240,
          productName: 'Diabetes (Liquichek)',
          lotNumber: '38580',
          expirationDate: '2020-10-31T00:00:00'
        },
        productLotLevels: [
          {
            id: '563',
            productMasterLotId: '223',
            productId: '240',
            productMasterLotNumber: '38580',
            lotNumber: '38581',
            level: 1,
            levelDescription: '1'
          },
          {
            id: '564',
            productMasterLotId: '223',
            productId: '240',
            productMasterLotNumber: '38580',
            lotNumber: '38582',
            level: 2,
            levelDescription: '2'
          },
          {
            id: '565',
            productMasterLotId: '223',
            productId: '240',
            productMasterLotNumber: '38580',
            lotNumber: '38583',
            level: 3,
            levelDescription: '3'
          }
        ],
        levelSettings: {
          levelEntityId: null,
          levelEntityName: 'LevelSetting',
          parentLevelEntityId: '28a442cc-92fc-42d0-85b6-700c9496545f',
          parentLevelEntityName: 'LabProduct',
          minNumberOfPoints: 0,
          runLength: 0,
          dataType: 0,
          targets: null,
          rules: null,
          levels: [
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            }
          ],
          id: '52c93907-7655-4232-82f2-396cd23e2814',
          parentNodeId: '28a442cc-92fc-42d0-85b6-700c9496545f',
          parentNode: null,
          nodeType: 8,
          displayName: '52c93907-7655-4232-82f2-396cd23e2814',
          children: null
        },
        accountSettings: {
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
          id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
          parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
          parentNode: null,
          nodeType: 9,
          children: null
        },
        hasOwnAccountSettings: false,
        id: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
        parentNodeId: '28a442cc-92fc-42d0-85b6-700c9496545f',
        parentNode: null,
        nodeType: 5,
        children: [
          {
            displayName: ' Hemoglobin A1c',
            testSpecId: '1',
            correlatedTestSpecId: '11535054496E4BABBDF8BEE875351096',
            testId: '1',
            labUnitId: '6',
            testSpecInfo: {
              id: 1,
              testId: 1,
              analyteStorageUnitId: 666,
              analyteId: 2566,
              analyteName: ' Hemoglobin A1c',
              methodId: 22,
              methodName: 'HPLC',
              instrumentId: 2749,
              instrumentName: 'D-10',
              reagentId: 664,
              reagentManufacturerId: null,
              reagentManufacturerName: 'Bio-Rad',
              reagentName: 'D-10 Dual HbA1c/A2/F (220-0201)',
              reagentLotId: 1,
              reagentLotNumber: 'Unspecified ***',
              reagentLot: {
                id: 1,
                reagentId: 664,
                lotNumber: 'Unspecified ***',
                shelfExpirationDate: '2068-11-02T16:50:23.827'
              },
              storageUnitId: 93,
              storageUnitName: '%',
              calibratorId: 1,
              calibratorManufacturerId: null,
              calibratorManufacturerName: 'Bio-Rad',
              calibratorName: 'D-10 Dual A2/F/A1c Calibrator',
              calibratorLotId: 1,
              calibratorLotNumber: 'Unspecified ***',
              calibratorLot: {
                id: 1,
                calibratorId: 1,
                lotNumber: 'Unspecified ***',
                shelfExpirationDate: '2068-11-02T16:50:23.827'
              }
            },
            levelSettings: {
              levelEntityId: null,
              levelEntityName: 'LevelSetting',
              parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
              parentLevelEntityName: 'LabTest',
              minNumberOfPoints: 0,
              runLength: 0,
              dataType: 0,
              targets: null,
              rules: null,
              levels: [
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                }
              ],
              id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
              parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
              parentNode: null,
              nodeType: 8,
              displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
              children: null
            },
            accountSettings: {
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
              id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
              parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
              parentNode: null,
              nodeType: 9,
              children: null
            },
            hasOwnAccountSettings: false,
            mappedTestSpecs: null,
            id: '798b574c-d7d0-4f5a-9be3-61e9cb927182',
            parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentNode: null,
            nodeType: 6,
            children: []
          },
          {
            displayName: ' Hemoglobin A1c',
            testSpecId: '5',
            correlatedTestSpecId: 'CF4619742EA04099A4A9463550E90305',
            testId: '5',
            labUnitId: '93',
            testSpecInfo: {
              id: 5,
              testId: 5,
              analyteStorageUnitId: 666,
              analyteId: 2566,
              analyteName: ' Hemoglobin A1c',
              methodId: 22,
              methodName: 'HPLC',
              instrumentId: 2749,
              instrumentName: 'D-10',
              reagentId: 693,
              reagentManufacturerId: null,
              reagentManufacturerName: 'Bio-Rad',
              reagentName: 'D-10 Dual A1c (220-0201)',
              reagentLotId: 3,
              reagentLotNumber: 'Unspecified ***',
              reagentLot: {
                id: 3,
                reagentId: 693,
                lotNumber: 'Unspecified ***',
                shelfExpirationDate: '2068-11-02T16:50:23.89'
              },
              storageUnitId: 93,
              storageUnitName: '%',
              calibratorId: 3,
              calibratorManufacturerId: null,
              calibratorManufacturerName: 'Bio-Rad',
              calibratorName: 'D-10 Dual A1c Calibrator',
              calibratorLotId: 3,
              calibratorLotNumber: 'Unspecified ***',
              calibratorLot: {
                id: 3,
                calibratorId: 3,
                lotNumber: 'Unspecified ***',
                shelfExpirationDate: '2068-11-02T16:50:23.89'
              }
            },
            levelSettings: {
              levelEntityId: null,
              levelEntityName: 'LevelSetting',
              parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
              parentLevelEntityName: 'LabTest',
              minNumberOfPoints: 0,
              runLength: 0,
              dataType: 0,
              targets: null,
              rules: null,
              levels: [
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                }
              ],
              id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
              parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
              parentNode: null,
              nodeType: 8,
              displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
              children: null
            },
            accountSettings: {
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
              id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
              parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
              parentNode: null,
              nodeType: 9,
              children: null
            },
            hasOwnAccountSettings: false,
            mappedTestSpecs: null,
            id: 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
            parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentNode: null,
            nodeType: 6,
            children: []
          },
          {
            displayName: ' Hemoglobin A1c',
            testSpecId: '4',
            correlatedTestSpecId: '3A1CA2C15B2E466C816278DEFE24740C',
            testId: '4',
            labUnitId: '6',
            testSpecInfo: {
              id: 4,
              testId: 4,
              analyteStorageUnitId: 666,
              analyteId: 2566,
              analyteName: ' Hemoglobin A1c',
              methodId: 22,
              methodName: 'HPLC',
              instrumentId: 2749,
              instrumentName: 'D-10',
              reagentId: 662,
              reagentManufacturerId: null,
              reagentManufacturerName: 'Bio-Rad',
              reagentName: 'D-10 HbA1c (220-0101)',
              reagentLotId: 2,
              reagentLotNumber: 'Unspecified ***',
              reagentLot: {
                id: 2,
                reagentId: 662,
                lotNumber: 'Unspecified ***',
                shelfExpirationDate: '2068-11-02T16:50:23.86'
              },
              storageUnitId: 93,
              storageUnitName: '%',
              calibratorId: 2,
              calibratorManufacturerId: null,
              calibratorManufacturerName: 'Bio-Rad',
              calibratorName: 'D-10 A1c Level 1, 2 Calibrator',
              calibratorLotId: 2,
              calibratorLotNumber: 'Unspecified ***',
              calibratorLot: {
                id: 2,
                calibratorId: 2,
                lotNumber: 'Unspecified ***',
                shelfExpirationDate: '2068-11-02T16:50:23.86'
              }
            },
            levelSettings: {
              levelEntityId: null,
              levelEntityName: 'LevelSetting',
              parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
              parentLevelEntityName: 'LabTest',
              minNumberOfPoints: 0,
              runLength: 0,
              dataType: 0,
              targets: null,
              rules: null,
              levels: [
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                }
              ],
              id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
              parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
              parentNode: null,
              nodeType: 8,
              displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
              children: null
            },
            accountSettings: {
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
              id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
              parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
              parentNode: null,
              nodeType: 9,
              children: null
            },
            hasOwnAccountSettings: false,
            mappedTestSpecs: null,
            id: '979c1151-e7f9-4d16-ab43-05189f7d2abe',
            parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentNode: null,
            nodeType: 6,
            children: []
          },
          {
            displayName: 'Hemoglobin F',
            testSpecId: '3',
            correlatedTestSpecId: '03C4E8B90B6F4A329C37AC4F07E39254',
            testId: '3',
            labUnitId: '93',
            testSpecInfo: {
              id: 3,
              testId: 3,
              analyteStorageUnitId: 250,
              analyteId: 290,
              analyteName: 'Hemoglobin F',
              methodId: 22,
              methodName: 'HPLC',
              instrumentId: 2749,
              instrumentName: 'D-10',
              reagentId: 664,
              reagentManufacturerId: null,
              reagentManufacturerName: 'Bio-Rad',
              reagentName: 'D-10 Dual HbA1c/A2/F (220-0201)',
              reagentLotId: 1,
              reagentLotNumber: 'Unspecified ***',
              reagentLot: {
                id: 1,
                reagentId: 664,
                lotNumber: 'Unspecified ***',
                shelfExpirationDate: '2068-11-02T16:50:23.827'
              },
              storageUnitId: 93,
              storageUnitName: '%',
              calibratorId: 1,
              calibratorManufacturerId: null,
              calibratorManufacturerName: 'Bio-Rad',
              calibratorName: 'D-10 Dual A2/F/A1c Calibrator',
              calibratorLotId: 1,
              calibratorLotNumber: 'Unspecified ***',
              calibratorLot: {
                id: 1,
                calibratorId: 1,
                lotNumber: 'Unspecified ***',
                shelfExpirationDate: '2068-11-02T16:50:23.827'
              }
            },
            levelSettings: {
              levelEntityId: null,
              levelEntityName: 'LevelSetting',
              parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
              parentLevelEntityName: 'LabTest',
              minNumberOfPoints: 0,
              runLength: 0,
              dataType: 0,
              targets: null,
              rules: null,
              levels: [
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                },
                {
                  levelInUse: false,
                  decimalPlace: 0
                }
              ],
              id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
              parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
              parentNode: null,
              nodeType: 8,
              displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
              children: null
            },
            accountSettings: {
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
              id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
              parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
              parentNode: null,
              nodeType: 9,
              children: null
            },
            hasOwnAccountSettings: false,
            mappedTestSpecs: null,
            id: 'bb1fe8b3-bc6a-4820-a35f-00c2028f3f00',
            parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentNode: null,
            nodeType: 6,
            children: []
          }
        ]
      },
      selectedLeaf: {
        displayName: ' Hemoglobin A1c',
        testSpecId: '5',
        correlatedTestSpecId: 'CF4619742EA04099A4A9463550E90305',
        testId: '5',
        labUnitId: '93',
        testSpecInfo: {
          id: 5,
          testId: 5,
          analyteStorageUnitId: 666,
          analyteId: 2566,
          analyteName: ' Hemoglobin A1c',
          methodId: 22,
          methodName: 'HPLC',
          instrumentId: 2749,
          instrumentName: 'D-10',
          reagentId: 693,
          reagentManufacturerId: null,
          reagentManufacturerName: 'Bio-Rad',
          reagentName: 'D-10 Dual A1c (220-0201)',
          reagentLotId: 3,
          reagentLotNumber: 'Unspecified ***',
          reagentLot: {
            id: 3,
            reagentId: 693,
            lotNumber: 'Unspecified ***',
            shelfExpirationDate: '2068-11-02T16:50:23.89'
          },
          storageUnitId: 93,
          storageUnitName: '%',
          calibratorId: 3,
          calibratorManufacturerId: null,
          calibratorManufacturerName: 'Bio-Rad',
          calibratorName: 'D-10 Dual A1c Calibrator',
          calibratorLotId: 3,
          calibratorLotNumber: 'Unspecified ***',
          calibratorLot: {
            id: 3,
            calibratorId: 3,
            lotNumber: 'Unspecified ***',
            shelfExpirationDate: '2068-11-02T16:50:23.89'
          }
        },
        levelSettings: {
          levelEntityId: null,
          levelEntityName: 'LevelSetting',
          parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
          parentLevelEntityName: 'LabTest',
          minNumberOfPoints: 0,
          runLength: 0,
          dataType: 0,
          targets: null,
          rules: null,
          levels: [
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            },
            {
              levelInUse: false,
              decimalPlace: 0
            }
          ],
          id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
          parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
          parentNode: null,
          nodeType: 8,
          displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
          children: null
        },
        accountSettings: {
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
          id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
          parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
          parentNode: null,
          nodeType: 9,
          children: null
        },
        hasOwnAccountSettings: false,
        mappedTestSpecs: null,
        id: 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
        parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
        parentNode: null,
        nodeType: 6,
        children: []
      },
      connectivityFullTree: null,
      error: null,
      isSideNavExpanded: true,
      selectedLink: null,
      hasConnectivityLicense: true,
      showSettings: true,
      selectedLeftNavItem: null,
      instrumentsGroupedByDept: true,
      settings: null,
      showArchivedItemsToggle: false,
      isArchiveItemsToggleOn: false
    },
    location: null,
    account: null,
    uiConfigState: {
      dataManagementUI: {
        isAnalyticalSectionVisible: false,
        isTabOrderRunEntry: true
      }
    },
    DataManagement: {
      dataPointPopup: null,
      entityId: 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
      entityType: 6,
      entityName: ' Hemoglobin A1c',
      controlLotIds: null,
      levelsInUse: null,
      decimalPlaces: null,
      headerData: {
        analyteName: ' Hemoglobin A1c',
        instrumentName: 'D-10',
        instrumentAlias: 'Test instrument',
        customProductName: 'Test control',
        productName: 'Test control',
        productMasterLotNumber: '38580',
        reagentName: 'D-10 Dual A1c (220-0201)',
        reagentLotNumber: 'Unspecified ***',
        reagentLotId: 3,
        method: 'HPLC',
        unit: '%',
        calibrator: 'D-10 Dual A1c Calibrator',
        calibratorLotNumber: 'Unspecified ***',
        calibratorLotId: 3,
        codeListTestId: 5,
        labUnitId: 93
      },
      cumulativeAnalyteInfo: [
        {
          controlLotIds: [
            563
          ],
          levelsInUse: [
            1
          ],
          decimalPlaces: [
            0
          ],
          instrumentId: '28a442cc-92fc-42d0-85b6-700c9496545f',
          productId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
          testName: ' Hemoglobin A1c',
          labTestId: 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
          correlatedTestSpecId: 'CF4619742EA04099A4A9463550E90305',
          testSpecId: '5',
          isSummary: false,
          productMasterLotId: '223',
          productMasterLotExpiration: '2020-10-31T00:00:00',
          codeListTestId: 5,
          labUnitId: 93,
          defaultReagentLot: {
            id: 3,
            reagentId: 693,
            lotNumber: 'Unspecified ***',
            shelfExpirationDate: '2068-11-02T16:50:23.89'
          },
          defaultCalibratorLot: {
            id: 3,
            calibratorId: 3,
            lotNumber: 'Unspecified ***',
            shelfExpirationDate: '2068-11-02T16:50:23.89'
          },
          testId: '5'
        }
      ]
    }
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    getDataTableATHistory: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PerfectScrollbarModule,
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
        RunsTableComponent,
        FakeRunInsertComponent,
        FakeDateTimeCellComponent,
        FakeValueCellComponent,
        FakeZscoreCellComponent,
        FakeReasonCellComponent,
        FakePezCell
      ],
      providers: [
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: RunsService, useValue: mockRunsService },
        {
          provide: MessageSnackBarService,
          useValue: mockMessageSnackBarService
        },
        { provide: AwsApiService, useClass: MockAwsApiService },
        { provide: TestTrackerService, useValue: mockTestTrackerService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        { provide: CodelistApiService, useValue: mockCodeListService },
        { provide: Store, useValue: mockStore },
        { provide: DataManagementService, useValue: mockdataManagementService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        provideMockStore({ initialState: mockStore }),
        TranslateService,
        DecimalPipe,
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    const firstRunData = new RunData();
    firstRunData.testSpecId = 101205;
    fixture = TestBed.createComponent(RunsTableComponent);
    component = fixture.componentInstance;
    component.runDataPageSet = [firstRunData];
    component.levelsInUse = [1, 3];
    component.reagentLots = new Array<ReagentLot>();
    component.calibratorLots = new Array<CalibratorLot>();
    component.indexes = { first: 0, last: 0 };
    component.licensedProducts = [{ product: 1, fileOption: 1 }];
    component.licensedProductTypeConnectivity = 1;

    const sampleTestSpecInfo: TestSpecInfo = new TestSpecInfo();
    sampleTestSpecInfo.testSpecId = 101205;
    sampleTestSpecInfo.calibratorLotId = 303;
    sampleTestSpecInfo.reagentLotId = 404;

    fixture.detectChanges();
  });


  it('should display "Manually enter data" link', () => {
    // Setting condition to display the link
    component.hasConnectivity = true;
    component.pagedRows = [];
    component.runDataPageSet = [];
    component.isRunInsertStateReady = true;

    fixture.detectChanges();
    const manuallyEnterTestRunLink = fixture.debugElement.nativeElement.querySelector('.manually-enter-test-run');
    expect(manuallyEnterTestRunLink).toBeTruthy();
  });

  it('should not display "Manually enter test run" link', () => {
    // Setting condition to display the link
    component.hasConnectivity = false;
    component.pagedRows = null;
    component.runDataPageSet = null;
    component.isRunInsertStateReady = false;

    fixture.detectChanges();
    const manuallyEnterTestRunLink = fixture.debugElement.nativeElement.querySelector('.manually-enter-test-run');
    expect(manuallyEnterTestRunLink).toBeFalsy();
  });

  it('should call deleteRun methode', () => {
    const saveSpy = spyOn(component, 'deleteRun');
    component.deleteRun(0);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should call generate Review Data on opening summary review panel', () => {
    const spyextractInteractions = spyOn(mockdataManagementService, 'extractInteractions');
    const data = {
      45345: [{
        auditTrail:
        {
          'action': 'Update',
          'actionStatus': 'Success',
          'firstName': '',
          'lastName': '',
          'currentValue': {
            'levelData': [
              {
                'level': 1,
                'resultValue': 122
              },
              {
                'level': 2,
                'resultValue': 1.433
              }
            ]
          },
          'eventType': 'Analyte Data Table',
          'priorValue': {
            'levelData': [
              {
                'level': 1,
                'resultValue': 12
              },
              {
                'level': 2,
                'resultValue': 1.4
              }
            ]
          },
          'device_id': '201edb65-1d20-4ea9-9758-dccc7f533c15',
          'run_id': 17472949,
          'runDateTime': '2023-11-23T13:55:20.194Z'
        }
      }]
    };
    const getRunhistory = spyOn(component, 'getRunHistory').and.returnValue(data);
    component.runRows = [
      {
        rowType: 0,
        dataSource: 0,
        runId: '45345',
        runIndex: 1,
        runDateTime: new Date(),
        levelSections: [],
        pezCell: {
          interactions: [], actions: [], comments: []
        },
        decimalPlaces: [0],
        isInsert: false,
        isRestartFloat: false
      }];
    component.openReviewSummaryDialog({ data: 'test' }, 0);
    component['generateReviewData'](component.runRows[0]);
    fixture.detectChanges();
    expect(spyextractInteractions).toHaveBeenCalled();
  });
});
