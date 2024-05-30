// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideMockStore } from '@ngrx/store/testing';
import { StoreModule, Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
  BrDateTimePicker,
  CalibratorLot,
  ReagentLot
} from 'br-component-library';

import { LevelValue } from '../../../../contracts/models/data-management/level-value.model';
import { RunData } from '../../../../contracts/models/data-management/run-data.model';
import { RunInsertState } from '../../../../contracts/models/data-management/run-insert-state.model';
import { ConfigService } from '../../../../core/config/config.service';
import { dataManagement } from '../../../../core/config/constants/data-management.const';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { LabDataApiService } from '../../../../shared/api/labDataApi.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { TestTrackerService } from '../../../../shared/services/test-tracker.service';
import { RunsService } from '../../../../shared/services/runs.service';
import { RunInsertComponent } from './run-insert.component';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
import { DataManagementSpinnerService } from '../../../../shared/services/data-management-spinner.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { DataManagementService } from '../../../../shared/services/data-management.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking } from '../../../../shared/models/audit-tracking.model';
import { HttpLoaderFactory } from '../../../../app.module';

//TODO: TRUPTI - Check audit trail testcase
describe('Run Insert Component', () => {
  let component: RunInsertComponent;
  let fixture: ComponentFixture<RunInsertComponent>;
  const mockConfigService = jasmine.createSpyObj(['getConfig']);
  const mockRunsService = jasmine.createSpyObj([
    'getCachedComment',
    'setCachedComment',
    'updateTestSpecId',
    'filterExpiredLotsForSpecificDate',
    'isLotExpiredForSpecificDate',
    'postNewRunData',
    'getTranslation'
  ]);
  const mockCodelistApiService = jasmine.createSpyObj([
    'getTestByIdAsync',
    'getTestSpecByIdAsync'
  ]);

  const mockLabDataApiService = jasmine.createSpyObj([
    'getRawDataWithSearchParams'
  ]);

  const mockAppLoggerService = jasmine.createSpyObj(['log']);

  const mockTestTrackerService = jasmine.createSpyObj(['save', 'onLotChanged']);
  const mockChangeTrackerService = jasmine.createSpyObj([
    'canDeactivate',
    'setDirty',
    'resetDirty',
    'setOkAction'
  ]);

  const prepareAuditTrailPayloadData: AppNavigationTracking =  {
    auditTrail: {
      eventType: 'Analyte Data Table',
      action: 'Add',
      actionStatus: 'Success',
      priorValue: {},
      currentValue: {
        isComment: true,
        action: null,
        isAction: false,
        isReagentLot: true,
        reagentLotID: 79,
        reagentLotName: 'Unspecified ***',
        isCalibratorLot: true,
        calibratorLotID: 16,
        calibratorLotName: 'Unspecified ***',
        levelData: [
          {
            resultValue: 22,
            level: 1
          }
        ]
      },
      device_id: '71d26b6a-0f6b-40bc-bdcb-282076b672e8'
    }
  };

  const currentMockData: AppNavigationTracking = {
    auditTrail: {
      eventType: 'Analyte Data Table',
      action: 'Add',
      actionStatus: 'Success',
      priorValue: {},
      currentValue: {
        isComment: true,
        action: null,
        isAction: false,
        isReagentLot: true,
        reagentLotID: 79,
        reagentLotName: 'Unspecified ***',
        isCalibratorLot: true,
        calibratorLotID: 16,
        calibratorLotName: 'Unspecified ***',
        levelData: [
          {
            resultValue: 22,
            level: 1
          }
        ]
      },
      device_id: '71d26b6a-0f6b-40bc-bdcb-282076b672e8'
    }
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    prepareAuditTrailPayload: () => prepareAuditTrailPayloadData,
  };

  const mockDataManagementSpinnerService = jasmine.createSpyObj([
    'displaySpinner'
  ]);


  const mockDataManagementService = jasmine.createSpyObj([
    'getPortalProductByLabInstrumentProductLotIdAsync'
  ]);

  const mockDataTimeHelper = jasmine.createSpyObj([
    'getTimeZoneOffset',
    'isExpiredOnSpecificDate'
  ]);

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  @Component({
    selector: 'unext-point-data-entry',
    template: '<div></div>'
  })
  class FakePointDataEntryComponent {
    @Input() levelValues: Array<LevelValue>;
    @Input() isProductMasterLotExpired: boolean;
  }

  @Component({
    selector: 'unext-br-select',
    template: '<div></div>'
  })
  class FakeBrSelectComponent {
    @Input() placeholder: any;
    @Input() data: any;
    @Input() displayAttribute: any;
    @Input() emitValue: any;
    @Input() selectedChanged: any;
    @Input() hasError: any;
    @Input() errorMessage: any;
  }

  const initialState = {
    location: {
      displayName: 'Dev Lab',
      labLocationName: 'Dev Lab',
      locationTimeZone: 'America/Los_Angeles',
      locationOffset: '-08:00:00',
      locationDayLightSaving: '00:00:00'
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
      settings: null
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrDateTimePicker,
        BrowserAnimationsModule,
        BrowserModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot([]),
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
        RunInsertComponent,
        FakePointDataEntryComponent,
        FakeBrSelectComponent
      ],
      providers: [
        MessageSnackBarService,
        ChangeTrackerService,
        { provide: Store, useValue: mockStore },
        provideMockStore({ initialState: mockStore }),
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RunsService, useValue: mockRunsService },
        { provide: LabDataApiService, useValue: mockLabDataApiService },
        { provide: AppLoggerService, useValue: mockAppLoggerService },
        { provide: TestTrackerService, useValue: mockTestTrackerService },
        { provide: ChangeTrackerService, useValue: mockChangeTrackerService },
        {
          provide: DataManagementSpinnerService,
          useValue: mockDataManagementSpinnerService
        },
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        {
          provide: DataManagementService,
          useValue: mockDataManagementService
        },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService,
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunInsertComponent);
    component = fixture.componentInstance;
    component.levelValues = [];
    component.reagentLots = new Array<ReagentLot>();
    component.calibratorLots = new Array<CalibratorLot>();
    component.selectedReagentLot = new ReagentLot();
    component.selectedCalibratorLot = new CalibratorLot();
    component.labTimeZone = 'America/New_York';
    component.selectedDateTime = new Date();
    component.state = new RunInsertState();
    component.state.levelValues = [];
    component.state.selectedCalibratorLot = new CalibratorLot();
    component.state.selectedReagentLot = new ReagentLot();
    fixture.detectChanges();
  });

  xit('should be created', () => {
    expect(component).toBeTruthy();
  });

  //TODO: TRUPTI - Check audit trail testcase
  describe('should setup DateTime', () => {
    beforeEach(() => {
      component.reagentLots = new Array<ReagentLot>();
      component.calibratorLots = new Array<CalibratorLot>();
      component.selectedReagentLot = new ReagentLot();
      component.selectedCalibratorLot = new CalibratorLot();
      fixture.detectChanges();
    });

    xit('should check availableDateTo has value', () => {
      const todaysDate = new Date();

      component.ngOnInit();

      expect(component.availableDateTo.getTime()).toBeGreaterThan(
        todaysDate.getTime()
      );
    });

    xit('should check for prepareAuditTrailPayload', () => {
      spyOn(mockAppNavigationTrackingService, 'prepareAuditTrailPayload')
      .and.returnValue(currentMockData);
    });

    xit('should check availableDateFrom when isPastResultInsert is Allowed', () => {
      // arrange
      component.isPastResultInsertAllowed = false;

      component.ngOnInit();

      expect(component.availableDateFrom).toEqual(dataManagement.earliestDate);
    });

    xit('should check availableDateFrom when latestRunData is given and PastResultInsert not allowed', () => {
      const someRandomDate = new Date();
      someRandomDate.setFullYear(2011);
      component.latestRunData = new RunData();
      component.latestRunData.runDateTime = someRandomDate;
      component.isPastResultInsertAllowed = false;

      component.ngOnInit();

      expect(component.availableDateFrom).toEqual(
        component.latestRunData.runDateTime
      );
    });

    xit('should check availableDateFrom when latestRunData is not given and PastResultInsert not allowed', () => {
      component.latestRunData = null;
      component.isPastResultInsertAllowed = false;

      component.ngOnInit();

      expect(component.availableDateFrom).toEqual(dataManagement.earliestDate);
    });
  });
});
