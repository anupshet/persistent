// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule, BrSelect, BrInfoTooltip } from 'br-component-library';
import { DuplicateNodeComponent } from './duplicate-node.component';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { DuplicateNodeEntryComponent } from '../../components/duplicate-node-entry/duplicate-node-entry.component';
import { TreePill } from '../../../contracts/models/lab-setup';
import { LabConfigurationApiService } from '../../services/lab-configuration.service';
import { InstrumentListRequest } from '../../../contracts/models/shared/list-duplicate-lot-instruments.model';
import { PortalApiService } from '../../api/portalApi.service';
import { ConfigService } from '../../../core/config/config.service';
import { AppLoggerService } from '../../services/applogger/applogger.service';
import { CodelistApiService } from '../../api/codelistApi.service';
import { DateTimeHelper } from '../../date-time/date-time-helper';
import { LocaleConverter } from '../../locale/locale-converter.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../app.module';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';

describe('DuplicateNodeComponent', () => {
  let component: DuplicateNodeComponent;
  let fixture: ComponentFixture<DuplicateNodeComponent>;
  let de: DebugElement;
  let store: MockStore;

  const mockBrPermissionsService = {
    hasAccess: () => true,
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
        permissions: [],
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
                shelfExpirationDate: '2068-11-02T16:50:23.827',
                reagentCategory: 1
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
                shelfExpirationDate: '2068-11-02T16:50:23.89',
                reagentCategory: 1
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
                shelfExpirationDate: '2068-11-02T16:50:23.86',
                reagentCategory: 1
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
                shelfExpirationDate: '2068-11-02T16:50:23.827',
                reagentCategory: 1
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
            shelfExpirationDate: '2068-11-02T16:50:23.89',
            reagentCategory: 1
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

  const mockData = {
    duplicateNodeInfo: {
      sourceNode: new TreePill(),
      userId: null,
      parentDisplayName: null,
      availableLots: []
    },
    placeholder: ''
  };

  const formBuilder: FormBuilder = new FormBuilder();

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockLabConfigurationApiService = {
    getDuplicateLotInstruments: () => null
  };


  const mockInstrumentNode = {
    'displayName': 'BARCHITECT c16000',
    'instrumentId': '1254',
    'instrumentCustomName': 'BARCHITECT c16000',
    'instrumentSerial': '',
    'instrumentInfo': {
      'id': 1254,
      'name': 'ARCHITECT c16000',
      'manufacturerId': 1,
      'manufacturerName': 'Abbott'
    },
    'accountSettings': null,
    'hasOwnAccountSettings': false,
    'isArchived': false,
    'sortOrder': 0,
    'id': '6b2bd56e-048c-459a-a7bb-78bdf7b77ecb',
    'parentNodeId': 'ab9582f6-5c58-4c82-a7b5-b6011c16ee14',
    'parentNode': null,
    'nodeType': 4,
    'children': [
      {
        'displayName': 'Assayed Chemistry',
        'productId': '2',
        'productMasterLotId': '74',
        'productCustomName': '',
        'productInfo': {
          'id': 2,
          'name': 'Assayed Chemistry',
          'manufacturerId': 2,
          'manufacturerName': 'Bio-Rad',
          'matrixId': 3,
          'matrixName': 'Serum'
        },
        'lotInfo': {
          'id': 74,
          'productId': 2,
          'productName': 'Assayed Chemistry',
          'lotNumber': '26450',
          'expirationDate': '2021-05-31T00:00:00'
        },
        'productLotLevels': [
          {
            'id': '119',
            'productMasterLotId': '74',
            'productId': '2',
            'productMasterLotNumber': '26450',
            'lotNumber': '26451',
            'level': 1,
            'levelDescription': '1'
          },
          {
            'id': '120',
            'productMasterLotId': '74',
            'productId': '2',
            'productMasterLotNumber': '26450',
            'lotNumber': '26452',
            'level': 2,
            'levelDescription': '2'
          }
        ],
        'levelSettings': {
          'levelEntityId': null,
          'levelEntityName': 'LevelSetting',
          'parentLevelEntityId': 'ccc6a7c6-30fe-4535-abd8-209bb90e48e5',
          'parentLevelEntityName': 'LabProduct',
          'minNumberOfPoints': 0,
          'runLength': 0,
          'dataType': 1,
          'targets': null,
          'rules': null,
          'levels': [
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            }
          ],
          'id': '8abc0de4-40a1-ffcf-8d68-efea2eec5a28',
          'parentNodeId': 'ccc6a7c6-30fe-4535-abd8-209bb90e48e5',
          'parentNode': null,
          'nodeType': 8,
          'displayName': '8abc0de4-40a1-ffcf-8d68-efea2eec5a28',
          'children': null,
          'isUnavailable': false,
          'unavailableReasonCode': null
        },
        'accountSettings': null,
        'hasOwnAccountSettings': false,
        'isArchived': false,
        'sortOrder': 0,
        'id': 'ccc6a7c6-30fe-4535-abd8-209bb90e48e5',
        'parentNodeId': '6b2bd56e-048c-459a-a7bb-78bdf7b77ecb',
        'parentNode': null,
        'nodeType': 5,
        'children': [

        ],
        'isUnavailable': false,
        'unavailableReasonCode': 'null'
      },
      {
        'displayName': 'Assayed Chemistry',
        'productId': '2',
        'productMasterLotId': '69',
        'productCustomName': '',
        'productInfo': {
          'id': 2,
          'name': 'Assayed Chemistry',
          'manufacturerId': 2,
          'manufacturerName': 'Bio-Rad',
          'matrixId': 3,
          'matrixName': 'Serum'
        },
        'lotInfo': {
          'id': 69,
          'productId': 2,
          'productName': 'Assayed Chemistry',
          'lotNumber': '23000',
          'expirationDate': '2022-12-31T00:00:00'
        },
        'productLotLevels': [
          {
            'id': '105',
            'productMasterLotId': '69',
            'productId': '2',
            'productMasterLotNumber': '23000',
            'lotNumber': '23001',
            'level': 1,
            'levelDescription': '1'
          },
          {
            'id': '106',
            'productMasterLotId': '69',
            'productId': '2',
            'productMasterLotNumber': '23000',
            'lotNumber': '23002',
            'level': 2,
            'levelDescription': '2'
          },
          {
            'id': '107',
            'productMasterLotId': '69',
            'productId': '2',
            'productMasterLotNumber': '23000',
            'lotNumber': '23003',
            'level': 3,
            'levelDescription': '3'
          },
          {
            'id': '108',
            'productMasterLotId': '69',
            'productId': '2',
            'productMasterLotNumber': '23000',
            'lotNumber': '23004',
            'level': 4,
            'levelDescription': '4'
          },
          {
            'id': '109',
            'productMasterLotId': '69',
            'productId': '2',
            'productMasterLotNumber': '23000',
            'lotNumber': '23005',
            'level': 5,
            'levelDescription': '5'
          },
          {
            'id': '110',
            'productMasterLotId': '69',
            'productId': '2',
            'productMasterLotNumber': '23000',
            'lotNumber': '23006',
            'level': 6,
            'levelDescription': '6'
          }
        ],
        'levelSettings': null,
        'accountSettings': null,
        'hasOwnAccountSettings': false,
        'isArchived': false,
        'sortOrder': 0,
        'id': 'eee6422c-ce23-412b-aa6f-d2604b035e2c',
        'parentNodeId': '6b2bd56e-048c-459a-a7bb-78bdf7b77ecb',
        'parentNode': null,
        'nodeType': 5,
        'children': [],
        'isUnavailable': true,
        'unavailableReasonCode': 'URC000001'
      }
    ],
    'isUnavailable': false,
    'unavailableReasonCode': 'null'
  };

  const mockMasterLots = [
    {
      'id': 70,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '26410',
      'expirationDate': new Date('2019-01-31T00:00:00'),
      'lotWithExpirationDate': '',
    },
    {
      'id': 71,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '26420',
      'expirationDate': new Date('2019-09-30T00:00:00'),
      'lotWithExpirationDate': ''
    },
    {
      'id': 73,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '26440',
      'expirationDate': new Date('2020-11-30T00:00:00'),
      'lotWithExpirationDate': ''
    },
    {
      'id': 74,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '26450',
      'expirationDate': new Date('2021-05-31T00:00:00'),
      'lotWithExpirationDate': ''
    },
    {
      'id': 959,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '26460',
      'expirationDate': new Date('2022-07-31T00:00:00'),
      'lotWithExpirationDate': ''
    },
    {
      'id': 72,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '26430',
      'expirationDate': new Date('2020-03-29T00:00:00'),
      'lotWithExpirationDate': ''
    },
    {
      'id': 1122,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '40370',
      'expirationDate': new Date('2021-04-30T00:00:00'),
      'lotWithExpirationDate': ''
    },
    {
      'id': 69,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '23000',
      'expirationDate': new Date('2022-12-31T00:00:00'),
      'lotWithExpirationDate': ''
    }
  ];

  const mockLocationData = {
    accountName: 'AB Testing Lab Data Upload',
    accountNumber: '103151',
    addOns: 4,
    addOnsFlags: {
      'valueAssignment': false,
      'allowBR': false,
      'allowNonBR': true,
      'allowSiemensHematology': false,
      'allowSysmexHemostasis': false
    },
    children: [],
    comments: '',
    connectivityInstalledProduct: '',
    connectivityTier: 2,
    contactRoles: null,
    crossOverStudy: 0,
    displayName: 'AB Testing Lab Data Upload',
    formattedAccountNumber: 'U103151',
    groupName: 'AB Testing Lab Data Upload',
    hasChildren: false,
    id: 'b178042a-c832-47b6-9fd6-7a9d6f0a72d5',
    islabsettingcompleted: true,
    labLocationAddress: null,
    labLocationAddressId: 'c4fd85b3-98cf-4a79-987d-fb8e9e285a03',
    labLocationContact: null,
    labLocationContactId: '',
    labLocationName: 'AB Testing Lab Data Upload',
    licenseAssignDate: '2022-05-25T00:00:00Z',
    licenseExpirationDate: '2024-05-27T00:00:00Z',
    licenseNumberUsers: 5,
    locationCount: 0,
    locationDayLightSaving: '01:00:00',
    locationOffset: '-08:00:00',
    locationTimeZone: 'America/Los_Angeles',
    lotViewerInstalledProduct: '',
    lotViewerLicense: 1,
    migrationStatus: '',
    nodeType: 2,
    orderNumber: '',
    parentNode: {
      id: 'b178042a-c832-47b6-9fd6-7a9d6f0a72d5', displayName: 'AB Testing Lab Data Upload',
      labName: 'AB Testing Lab Data Upload', name: '',
      parentNodeId: 'e8435a3b-ff52-4d48-9b90-413bb713ec1f', nodeType: 1
    },
    parentNodeId: 'c200b94b-8a9d-4242-8a89-39d83d8e17fc',
    permissions: [4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    previousContactUserId: '',
    primaryUnityLabNumbers: '',
    shipTo: '052522AFG3',
    soldTo: '052522AFG3',
    unityNextInstalledProduct: '',
    unityNextTier: 1,
    usedArchive: false
  };


  const mockPortalApiService = {
    getLabSetupNode: () => of(mockInstrumentNode)
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    comparePriorAndCurrentValues: () => { }
  };

  const mockCodelistApiService = {
    getProductMasterLotsByProductId: () => {
      return of(mockMasterLots);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DuplicateNodeComponent,
        DuplicateNodeEntryComponent
      ],
      imports: [
        StoreModule.forRoot([]),
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        HttpClientModule,
        BrSelect,
        BrInfoTooltip,
        BrowserAnimationsModule,
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
        MockStore,
        { provide: FormBuilder, useValue: formBuilder },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: LabConfigurationApiService, useValue: mockLabConfigurationApiService },
        { provide: Store, useValue: mockStore },
        { provide: DatePipe, useClass: DatePipe },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        ConfigService,
        AppLoggerService,
        DateTimeHelper,
        LocaleConverter,
        provideMockStore({ initialState: mockStore }),
        TranslateService,
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(mockStore);
    fixture = TestBed.createComponent(DuplicateNodeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call duplicationRequest method when data emited from child component', () => {
    const outputData = {
      instrumentDisplayName: 'abc',
      manufacturerId: 11111,
      nodeType: 5,
      parentNodeId: 'xxxxxxxxxxxx',
      productId: 'yyyyyyyyyy',
      productCustomName: 'xyz',
      productMasterLotId: 222222,
      sourceNodeId: 333333
    };
    const duplicateNodeEntryComp = de.query(By.directive(DuplicateNodeEntryComponent));
    const cmp = duplicateNodeEntryComp.componentInstance;
    cmp.duplicateNodeInfo = mockData.duplicateNodeInfo;
    spyOn(component, 'duplicationRequest').and.callThrough();
    cmp.duplicationRequest.emit([outputData]);
    expect(component.duplicationRequest).toHaveBeenCalled();
  });

  it('should call instrumentListRequest method when requested from child component', () => {
    const spyon = spyOn(component, 'instrumentListRequest').and.callThrough();
    const listRequest: InstrumentListRequest = {
      labInstrumentId: '7312db45-d7f3-4873-893f-67417212ea71',
      productId: '33',
      sourceProductMasterLotId: '26450',
      targetProductMasterLotId: '26460'
    };
    const duplicateNodeEntryComp = de.query(By.directive(DuplicateNodeEntryComponent));
    const cmp = duplicateNodeEntryComp.componentInstance;
    cmp.instrumentListRequest.emit(listRequest);
    expect(spyon).toHaveBeenCalled();
  });

  it('should call filterExistingLots', () => {
    component.currentLocation = mockLocationData;
    const spy = spyOn(component, 'filterExistingLots');
    component.availableLots = mockMasterLots;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should call filterExpiredLots when available lots gets populated', () => {
    component.currentLocation = mockLocationData;
    const spy = spyOn(component, 'filterExpiredLots');
    const duplicateNodeEntryComp = de.query(By.directive(DuplicateNodeEntryComponent));
    const cmp = duplicateNodeEntryComp.componentInstance;
    cmp.emitValue = false;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should call startNewBrLotRequest method when data emited from child component', () => {
    const mockRequestData = [
      {
        'control': {
          'id': 826,
          'name': 'Plano Coag8',
          'lots': [
            {
              'productId': 826,
              'productName': 'Plano Coag8',
              'lotNumber': '112255',
              'expirationDate': '2024-10-31T00:00:00Z',
              'retainFixedCV': true
            }
          ]
        },
        'instruments': [
          '254b8959-4c2a-45a3-b255-520d6013b741'
        ]
      }
    ];
    const duplicateNodeEntryComp = de.query(By.directive(DuplicateNodeEntryComponent));
    const cmp = duplicateNodeEntryComp.componentInstance;
    cmp.duplicateNodeInfo = mockData.duplicateNodeInfo;
    spyOn(store, 'dispatch');
    spyOn(component, 'startNewBrLotRequest').and.callThrough();
    cmp.startNewBrLotRequest.emit([mockRequestData]);
    expect(component.startNewBrLotRequest).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  });
});
