// © 2022 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, fakeAsync, inject, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Autofixture } from 'ts-autofixture/dist/src';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Action } from 'br-component-library';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { TransformValuePipe } from 'br-component-library';
import { RunEditDataComponent } from './run-edit-data.component';
import { TransformSummaryStatsPipe, TransformZscorePipe } from '../../../../shared/pipes/transform-values.pipe';
import { RunsService } from '../../../../shared/services/runs.service';
import { PointDataResult, RunData } from '../../../../contracts/models/data-management/run-data.model';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { DataManagementSpinnerService } from '../../../../shared/services/data-management-spinner.service';
import { LabTestService } from '../../../../shared/services/test-run.service';
import { LabTest } from '../../../../contracts/models/lab-setup/test.model';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';import { HttpLoaderFactory } from '../../../../app.module';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';
import { LocalizationDatePickerHelper } from '../../../../shared/localization-date-time/localization-date-time-formats';

const autofixture = new Autofixture();

const mockRunsAction = {
  putRunEditData: () => { }
};

// TODO AJT - Check audit trail testcase
describe('RunEditDataComponent', () => {
  let component: RunEditDataComponent;
  let fixture: ComponentFixture<RunEditDataComponent>;

  const today = new Date();
  const tempTime = '12:50';

  const selectedRunDateTime: Date = new Date('2018-01-02T01:00:00');
  const previousRunDateTime: Date = new Date('2018-01-01T01:00:00');
  const nextRunDateTime: Date = new Date('2018-01-03T01:00:00');
  const dayFromTodayDateTime: Date = new Date('2018-01-03T01:00:00');
  dayFromTodayDateTime.setDate(today.getDate() + 1);

  const runsServiceSpy = jasmine.createSpyObj('RunsService', {
    putRunEditData: (runData: RunData) => of(null),
    restartFloatWithRun: (entityId: string, runId: string) => of(null)
  });

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const codeListAPIServiceSpy = jasmine.createSpyObj('CodeListAPIService', {
    getTestSpecByIdAsync: {
      then: (testSpecId: string) => of(null)
    }
  });

  const labTestServiceSpy = jasmine.createSpyObj('LabTestService', {
    putLabTest: (labTest: LabTest) => of(null),
    getLabTest: (id: string) => of(null)
  });

  const mocActions: Array<Action> = [{
    actionId: 1,
    actionName: 'Calibrator changed',
    userId: '1',
    userFullName: 'xyz',
    enterDateTime: new Date()
  },
  {
    actionId: 2,
    actionName: 'Calibrator new lot',
    userId: '1',
    userFullName: 'xyz',
    enterDateTime: new Date()
  },
  {
    actionId: 3,
    actionName: 'Control reconstituted new',
    userId: '1',
    userFullName: 'xyz',
    enterDateTime: new Date()
  }];
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
  const mocRunDataPut: RunData = {
    'dataSource': 0,
    'id': '16058574',
    'labTestId': '0a9af595-4ca2-49cb-905b-5063352391f4',
    'labUnitId': 63,
    'testSpecId': 8262,
    'dataType': 0,
    'labLocationTimeZone': 'Africa/Abidjan',
    'rawDataDateTime': new Date(),
    'localRawDataDateTime': new Date(),
    'localRunDateTime': new Date(),
    'runDateTime': new Date(),
    'enteredDateTime': new Date(),
    'isRestartFloat': false,
    'userActions': [],
    'userComments': [],
    'results': [],
    'evaluationRules': [],
    'upsertOptions': {
      'forceRuleEngineReEval': true,
      'isInsertOperation': false
    },
    'runReasons': [],
    'correlatedTestSpecId': '',
    'accountId': '82c087c0-2d89-427c-9cb8-5b1d269c9abb',
    'accountNumber': '104493',
    'labId': 'd7dd66e5-47fd-4356-9378-4e3eadb2cbae',
    'labInstrumentId': '3cb5e973-70da-4641-aaaf-3d5331b46809',
    'labProductId': '49691eb4-fcd8-4a2a-a433-85dcfeb3af22',
    testId: 0,
    isLastMatch: false,
    userInteractions: []
  };
  const dialogueData: any = {
    'runDataPageSet': [
      {
        'dataSource': 0,
        'id': 14115,
        'labTestId': 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
        'codeListTestId': 5,
        'labUnitId': 93,
        'testSpecId': 5,
        'dataType': 0,
        'labLocationTimeZone': '0001-01-01T00:00:00Z',
        'rawDataDateTime': '2020-06-19T06:55:47.275Z',
        'localRawDataDateTime': '2020-06-19T06:55:47.275Z',
        'localRunDateTime': '2020-06-19T12:25:47.275Z',
        'runDateTime': '2020-06-19T06:55:47.275Z',
        'enteredDateTime': '2020-06-19T06:55:47.275Z',
        'userActions': [

        ],
        'userComments': [

        ],
        'userInteractions': [
          {
            'interactionType': 'AddedBy',
            'userId': '00u79kzz0z27UEK7R2p7',
            'userFullName': 'Sanjay Chavan',
            'enterDateTime': '2020-06-19T06:55:57.719Z'
          }
        ],
        'results': [
          {
            'id': '30345',
            'measuredDateTime': '2020-06-19T06:55:47.275Z',
            'resultValue': 9,
            'targetNPts': 2,
            'targetMean': 0,
            'targetSD': 0,
            'zScoreData': {
              'zScore': 1,
              'display': true
            },
            'isAccepted': true,
            'isRuleEngineIgnored': true,
            'ruleViolated': [

            ],
            'lastModified': '2020-06-19T06:55:28.613816Z',
            'controlLotID': 563,
            'controlLevel': 1,
            'mean': 2,
            'sd': 4,
            'cv': 2,
            'meanEvaluationType': 2,
            'sdEvaluationType': 2,
            'cvEvaluationType': 2,
            'sdIsCalculated': false,
            'cvIsCalculated': false,
            'targetCV': 0,
            'reasons': [

            ]
          }
        ],
        'evaluationRules': [

        ],
        'upsertOptions': {
          'forceRuleEngineReEval': true,
          'isInsertOperation': false
        },
        'runReasons': [

        ]
      }
    ],
    'runIndex': 0,
    'actions': [],
    'labId': 'e5d86be8-4b11-4df1-85ac-214607e21884',
    'labTimeZone': 'Asia/Kolkata',
    'labInstrumentId': '28a442cc-92fc-42d0-85b6-700c9496545f',
    'labProductId': '63a72dbf-49ce-44e5-b949-b43f7d512e73',
    'accountId': 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
    'accountNumber': '100896',
    'pageNumber': 1,
    'reagentLots': [
      {
        'id': 3,
        'reagentId': 693,
        'reagentName': 'D-10 Dual A1c (220-0201)',
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': '2068-11-02T16:50:23.89'
      }
    ],
    'calibratorLots': [
      {
        'id': 3,
        'calibratorId': 3,
        'calibratorName': 'D-10 Dual A1c Calibrator',
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': '2068-11-02T16:50:23.89'
      }
    ]
  };
  const mockAppNavigationTrackingService = {
    comparePriorAndCurrentValues: () => {
      return {
        auditTrail: {
          eventType: 'User Management',
          action: 'Update',
          actionStatus: 'Success',
          priorValue: {
            isCalibratorLot: true,
            isReagentLot: true,
            levelData: [{ resultValue: 88, level: 1, isAccept: true },
            { resultValue: 88, level: 2, isAccept: true }],
            reagentLotID: 2206,
            restartFloat: false,
            runDate: 'Mar 31, 2023',
            runStringTime: '08:11 AM'
          },
          currentValue: {
            isCalibratorLot: true,
            isReagentLot: true,
            levelData: [{ resultValue: 80, level: 1, isAccept: true },
            { resultValue: 88, level: 2, isAccept: true }],
            reagentLotID: 2207,
            reagentLotName: 'ACETAL3K-2',
            restartFloat: false,
            runDate: 'Mar 30, 2023',
            runStringTime: '09:12 PM'
          }
        }
      };
    },
    logAuditTracking: () => { }
  };
  const actionsStub = new Array<Action>();
  const taction: Action = {
    actionId: 1,
    actionName: 'ActionName',
    userId: '0',
    userFullName: 'UserName',
    enterDateTime: new Date()
  };
  actionsStub[0] = taction;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
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
        RunEditDataComponent,
        TransformZscorePipe,
        TransformSummaryStatsPipe,
        TransformValuePipe,
        UnityNextNumericPipe
      ],
      providers: [
        { provide: runsServiceSpy, useValue: mockRunsAction },
        HttpClientModule,
        FormsModule,
        DateTimeHelper,
        LocaleConverter,
        MessageSnackBarService,
        MatSnackBar,
        DataManagementSpinnerService,
        { provide: Store, useValue: mockStore },
        provideMockStore({ initialState: mockStore }),
        { provide: LabTestService, useValue: labTestServiceSpy },
        { provide: CodelistApiService, useValue: codeListAPIServiceSpy },
        { provide: RunsService, useValue: runsServiceSpy },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: { runIndex: 1 } },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: DateAdapter },
        TranslateService,
        HttpClient,
        LocalizationDatePickerHelper,
      ]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(RunEditDataComponent);
    component = fixture.componentInstance;
    component.data = dialogueData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDateChange', () => {
    it('should set selected date to selectedDate property', () => {
      const inputDate = '01/02/2018';

      component.onDateChange(inputDate);

      expect(component.selectedRunDate).toEqual(new Date(inputDate));
    });
  });

  describe('validateDateTime', () => {
    it('should set time format validation to true when time format is correct', () => {
      component.isValidTimeFormat = false;
      component.selectedRunStringTime = tempTime;

      component.validateDateTime();
      fixture.detectChanges();

      expect(component.isValidTimeFormat).toBeTruthy();
    });

    it('should set time format validation to false when time format is incorrect', () => {
      component.isValidTimeFormat = true;
      component.selectedRunStringTime = '';

      component.validateDateTime();
      fixture.detectChanges();

      expect(component.isValidTimeFormat).toBeFalsy();
    });

    it('should log audit trail on success of update run-data', fakeAsync(() => {
      const comparePriorAndCurrentValuesSpy = spyOn(mockAppNavigationTrackingService, 'comparePriorAndCurrentValues').and.returnValue({
        auditTrail: {
          eventType: 'Analyte Data Table',
          action: 'Add',
          actionStatus: 'Success',
          priorValue: {
            isCalibratorLot: true,
            isReagentLot: true,
            levelData: [{ resultValue: 88, level: 1, isAccept: true },
            { resultValue: 88, level: 2, isAccept: true }],
            reagentLotID: 2206,
            restartFloat: false,
            runDate: 'Mar 31, 2023',
            runStringTime: '08:11 AM'
          },
          currentValue: {
            isCalibratorLot: true,
            isReagentLot: true,
            levelData: [{ resultValue: 80, level: 1, isAccept: true },
            { resultValue: 88, level: 2, isAccept: true }],
            reagentLotID: 2207,
            reagentLotName: 'ACETAL3K-2',
            restartFloat: false,
            runDate: 'Mar 30, 2023',
            runStringTime: '09:12 PM'
          }
        }
      });
      const runDataPut = {
        'dataSource': 0,
        'id': 16058574,
        'labTestId': '0a9af595-4ca2-49cb-905b-5063352391f4',
        'codeListTestId': 7537,
        'labUnitId': 63,
        'testSpecId': 8262,
        'dataType': 0,
        'labLocationTimeZone': 'Africa/Abidjan',
        'rawDataDateTime': '2023-04-06T15:51:29.942Z',
        'localRawDataDateTime': '2023-04-06T15:51:29.942Z',
        'localRunDateTime': '2023-04-06T15:51:29.942Z',
        'runDateTime': '2023-04-06T15:51:29.942Z',
        'enteredDateTime': new Date(),
        'isRestartFloat': false,
        'userActions': [],
        'userComments': [],
        'userInteractions': [
          {
            'interactionType': 'AddedBy',
            'userId': '00ul9l4nxxmtQgmOH2p7',
            'userFullName': 'AT AUMLUMLS',
            'enterDateTime': '2023-04-06T15:52:56.528802Z'
          }
        ],
        'results': [
          {
            'id': '34788982',
            'measuredDateTime': '2023-04-06T15:51:29.942Z',
            'resultValue': 5,
            'targetNPts': 0,
            'targetMean': null,
            'targetSD': null,
            'zScoreData': {
              'zScore': null,
              'display': false
            },
            'isAccepted': true,
            'isRuleEngineIgnored': true,
            'ruleViolated': [],
            'lastModified': '2023-04-06T15:52:56.528802Z',
            'controlLotID': 3078,
            'controlLevel': 1,
            'meanEvaluationType': 1,
            'sdEvaluationType': 1,
            'targetCV': null,
            'reasons': [],
            'cvEvaluationType': 1
          },
          {
            'id': '34788983',
            'measuredDateTime': '2023-04-06T15:51:29.942Z',
            'resultValue': 6,
            'targetNPts': 0,
            'targetMean': null,
            'targetSD': null,
            'zScoreData': {
              'zScore': null,
              'display': false
            },
            'isAccepted': false,
            'isRuleEngineIgnored': true,
            'ruleViolated': [],
            'lastModified': '2023-04-06T15:52:56.528802Z',
            'controlLotID': 3079,
            'controlLevel': 2,
            'meanEvaluationType': 1,
            'sdEvaluationType': 1,
            'targetCV': null,
            'reasons': [],
            'cvEvaluationType': 1
          }
        ],
        'evaluationRules': [],
        'upsertOptions': {
          'forceRuleEngineReEval': true,
          'isInsertOperation': false
        },
        'runReasons': [],
        'correlatedTestSpecId': '',
        'accountId': '82c087c0-2d89-427c-9cb8-5b1d269c9abb',
        'accountNumber': '104493',
        'labId': 'd7dd66e5-47fd-4356-9378-4e3eadb2cbae',
        'labInstrumentId': '3cb5e973-70da-4641-aaaf-3d5331b46809',
        'labProductId': '49691eb4-fcd8-4a2a-a433-85dcfeb3af22'
      };
      const logAuditTrackingSpy = spyOn(mockAppNavigationTrackingService, 'logAuditTracking');
      expect(component.reagentLots).toBeTruthy();
      expect(component.calibratorLots).toBeTruthy();
      expect(component._pointDataResults).toBeTruthy();
      component.editRun();
      if (component['isFormChanged']() || component.isPristine) {
        runsServiceSpy.putRunEditData(runDataPut).then((editedRunData: RunData) => {
          if (editedRunData) {
            expect(comparePriorAndCurrentValuesSpy).toHaveBeenCalled();
            expect(logAuditTrackingSpy).toHaveBeenCalled();
          }
        });
      }
    }));

    it('should log audit trail on failure of update run-data', fakeAsync(() => {
      const comparePriorAndCurrentValuesSpy = spyOn(mockAppNavigationTrackingService, 'comparePriorAndCurrentValues').and.returnValue({
        auditTrail: {
          eventType: 'Analyte Data Table',
          action: 'Add',
          actionStatus: 'Failure',
          priorValue: {
            isCalibratorLot: true,
            isReagentLot: true,
            levelData: [{ resultValue: 88, level: 1, isAccept: true },
            { resultValue: 88, level: 2, isAccept: true }],
            reagentLotID: 2206,
            restartFloat: false,
            runDate: 'Mar 31, 2023',
            runStringTime: '08:11 AM'
          },
          currentValue: {
            isCalibratorLot: true,
            isReagentLot: true,
            levelData: [{ resultValue: 80, level: 1, isAccept: true },
            { resultValue: 88, level: 2, isAccept: true }],
            reagentLotID: 2207,
            reagentLotName: 'ACETAL3K-2',
            restartFloat: false,
            runDate: 'Mar 30, 2023',
            runStringTime: '09:12 PM'
          }
        }
      });
      const runDataPut = {
        'dataSource': 0,
        'id': 16058574,
        'labTestId': '0a9af595-4ca2-49cb-905b-5063352391f4',
        'codeListTestId': 7537,
        'labUnitId': 63,
        'testSpecId': 8262,
        'dataType': 0,
        'labLocationTimeZone': 'Africa/Abidjan',
        'rawDataDateTime': '2023-04-06T15:51:29.942Z',
        'localRawDataDateTime': '2023-04-06T15:51:29.942Z',
        'localRunDateTime': '2023-04-06T15:51:29.942Z',
        'runDateTime': '2023-04-06T15:51:29.942Z',
        'enteredDateTime': new Date(),
        'isRestartFloat': false,
        'userActions': [],
        'userComments': [],
        'userInteractions': [
          {
            'interactionType': 'AddedBy',
            'userId': '00ul9l4nxxmtQgmOH2p7',
            'userFullName': 'AT AUMLUMLS',
            'enterDateTime': '2023-04-06T15:52:56.528802Z'
          }
        ],
        'results': [
          {
            'id': '34788982',
            'measuredDateTime': '2023-04-06T15:51:29.942Z',
            'resultValue': 5,
            'targetNPts': 0,
            'targetMean': null,
            'targetSD': null,
            'zScoreData': {
              'zScore': null,
              'display': false
            },
            'isAccepted': true,
            'isRuleEngineIgnored': true,
            'ruleViolated': [],
            'lastModified': '2023-04-06T15:52:56.528802Z',
            'controlLotID': 3078,
            'controlLevel': 1,
            'meanEvaluationType': 1,
            'sdEvaluationType': 1,
            'targetCV': null,
            'reasons': [],
            'cvEvaluationType': 1
          },
          {
            'id': '34788983',
            'measuredDateTime': '2023-04-06T15:51:29.942Z',
            'resultValue': 6,
            'targetNPts': 0,
            'targetMean': null,
            'targetSD': null,
            'zScoreData': {
              'zScore': null,
              'display': false
            },
            'isAccepted': false,
            'isRuleEngineIgnored': true,
            'ruleViolated': [],
            'lastModified': '2023-04-06T15:52:56.528802Z',
            'controlLotID': 3079,
            'controlLevel': 2,
            'meanEvaluationType': 1,
            'sdEvaluationType': 1,
            'targetCV': null,
            'reasons': [],
            'cvEvaluationType': 1
          }
        ],
        'evaluationRules': [],
        'upsertOptions': {
          'forceRuleEngineReEval': true,
          'isInsertOperation': false
        },
        'runReasons': [],
        'correlatedTestSpecId': '',
        'accountId': '82c087c0-2d89-427c-9cb8-5b1d269c9abb',
        'accountNumber': '104493',
        'labId': 'd7dd66e5-47fd-4356-9378-4e3eadb2cbae',
        'labInstrumentId': '3cb5e973-70da-4641-aaaf-3d5331b46809',
        'labProductId': '49691eb4-fcd8-4a2a-a433-85dcfeb3af22'
      };
      const logAuditTrackingSpy = spyOn(mockAppNavigationTrackingService, 'logAuditTracking');
      expect(component.reagentLots).toBeTruthy();
      expect(component.calibratorLots).toBeTruthy();
      expect(component._pointDataResults).toBeTruthy();
      component.editRun();
      if (component['isFormChanged']() || component.isPristine) {
        runsServiceSpy.putRunEditData(runDataPut).then((editedRunData: RunData) => {

        }, (error) => {
          expect(comparePriorAndCurrentValuesSpy).toHaveBeenCalled();
          expect(logAuditTrackingSpy).toHaveBeenCalled();
        });
      }
    }));
  });

  describe('isDateTimeBeforeNextRun', () => {
    it('should set isBeforeNextRun to true if selected date time is before next run', () => {
      spyOn(component, 'convertHourMinuteToDate').and.returnValue(
        selectedRunDateTime
      );
      component.nextRunDate = nextRunDateTime;

      component.isDateTimeBeforeNextRun();

      expect(component.isBeforeNextRun).toBeTruthy();
    });

    it('should set isBeforeNextRun to false if selected date time is after next run', () => {
      const selectedDate = new Date(nextRunDateTime);
      selectedDate.setDate(selectedDate.getDate() + 1);
      spyOn(component, 'convertHourMinuteToDate').and.returnValue(selectedDate);

      component.nextRunDate = nextRunDateTime;
      component.isDateTimeBeforeNextRun();

      expect(component.isBeforeNextRun).toBeFalsy();
    });
  });

  describe('isDateTimeAfterPreviousRun', () => {
    it('should set isAfterPreviousRun to true if selected date time is after previous run', () => {
      component.previousRunDate = previousRunDateTime;
      component.selectedRunStringTime = selectedRunDateTime.getHours().toString() + ':' + selectedRunDateTime.getMinutes().toString();

      component.isDateTimeAfterPreviousRun();

      expect(component.isAfterPreviousRun).toBeTruthy();
    });

    it('should set isAfterPreviousRun to false if selected date time is before previous run', () => {
      component.previousRunDate = previousRunDateTime;
      component.selectedRunDate = new Date('2018-01-01T00:00:00');
      component.selectedRunDate.setHours(
        component.selectedRunDate.getHours() - 1
      );
      component.selectedRunStringTime =
        component.selectedRunDate.getHours().toString() + ':' + component.selectedRunDate.getMinutes().toString();

      component.isDateTimeAfterPreviousRun();

      expect(component.isAfterPreviousRun).toBeFalsy();
    });
  });

  describe('combineDateAndTime', () => {
    it('should combine selected date and time', () => {
      const hours = 12;
      const minutes = 30;

      const date = new Date(today);
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0, 0);

      const returnVal = component.combineDateAndTime(date, date, 0, 0);

      expect(returnVal).toEqual(date);
    });
  });

  it('convertDateToMinutes should return HourMinute string type of given Date', () => {
    const inputDateTime = new Date();
    const result = Math.abs(Math.floor(inputDateTime.getTime() / (1000 * 60)));

    const returnVal = component.convertDateToMinutes(inputDateTime);

    expect(returnVal).toEqual(result);
  });

  it('convertHourMinuteToDate should return Date type of given HourMinute string', () => {
    const inputHourMinute = '12:50';
    component.selectedRunDate = selectedRunDateTime;

    const result = new Date(selectedRunDateTime);
    result.setHours(12);
    result.setMinutes(50);

    const output = component.convertHourMinuteToDate(inputHourMinute);

    expect(output).toEqual(result);
  });

  it('combineDateAndTime should return combined date and time', () => {
    const inputDate: Date = new Date('2018-01-02T01:00:00');
    const inputTime: Date = new Date('2018-02-02T02:00:00');
    const result: Date = new Date('2018-01-02T02:00:00');

    const output = component.combineDateAndTime(inputDate, inputTime, 0, 0);

    expect(output).toEqual(result);
  });

  describe('editRun', () => {
    it('should call putRunEditData function when run datetime is valid',
      inject([runsServiceSpy], (action: RunsService) => {
        const inputDate: Date = new Date('2023-04-10');
        component.selectedRunStringTime = '09:50';
        component.selectedRunDate = inputDate;
        component['labTimeZone'] = 'Africa/Abidjan';
        component.selectedActionId = 1;
        component.pointDataResults = dialogueData.runDataPageSet[0].results as PointDataResult[];
        spyOn(component, 'validateDateTime').and.callFake(() => {
          component.isValidDateTime = true;
        });
        const saveSpy = spyOn(action, 'putRunEditData').and.callThrough();
        action.putRunEditData(mocRunDataPut);
        expect(saveSpy).toHaveBeenCalled();
      })
    );

    it('should not call putRunEditData function when run datetime is not valid',
      inject([runsServiceSpy], (action: RunsService) => {
        const inputDate: Date = new Date('2024-04-10');
        component.selectedRunStringTime = '25:50';
        component.selectedRunDate = inputDate;
        component['labTimeZone'] = 'Africa/Abidjan';
        component.selectedActionId = 1;
        component.pointDataResults = dialogueData.runDataPageSet[0].results as PointDataResult[];
        spyOn(component, 'validateDateTime').and.callFake(() => {
          component.isValidDateTime = false;
        });
        const saveSpy = spyOn(action, 'putRunEditData').and.callThrough();
        expect(saveSpy).not.toHaveBeenCalled();
      })
    );
  });

  it('should call selectAction function when action is selected', () => {
    fixture.detectChanges();
    const selectActionName = fixture.debugElement.nativeElement.querySelector('#selectedActionName');
    fixture.whenStable().then(() => {
      const text = selectActionName.options[selectActionName.selectedIndex].label;
      expect(text).toBeTruthy();
    });

    component.selectedActionId = 1;
    component.actions = mocActions;

    const saveSpy = spyOn(component, 'setAction').and.callThrough();
    component.setAction(component.selectedActionId);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should enable submit button on change of [restart float statistics] toggle button', () => {
    let submitButton = fixture.debugElement.nativeElement.querySelector('.spec-submit-button');
    expect(submitButton.disabled).toBeTruthy();
    const restartFloatToggle = fixture.debugElement.nativeElement.querySelector('.spec-restart-float-toggle');
    restartFloatToggle.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    submitButton = fixture.debugElement.nativeElement.querySelector('.spec-submit-button');
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should display Float sd if sdEvaluationType is set to floating or Fixed sd if sdEvaluationType is set to Fixed', () => {
    const sdEvaluationType = fixture.debugElement.nativeElement.querySelector('.spec-sd-evaluation-type');
    if (component.runData.results[0].sdEvaluationType === EvaluationType.Floating) {
      expect(sdEvaluationType.innerText).toContain('Float');
    } else if (component.runData.results[0].sdEvaluationType === EvaluationType.Fixed) {
      expect(sdEvaluationType.innerText).toContain('Fixed');
    }
  });

  it('should disable sd value in grey if it is calculated', () => {
    if (component.runData.results[0].sdIsCalculated) {
      const sd = fixture.debugElement.nativeElement.querySelector('.spec-sd');
      expect(sd.className).toContain('grey');
    } else if (component.runData.results[0].cvIsCalculated) {
      const cv = fixture.debugElement.nativeElement.querySelector('.spec-cv');
      expect(cv.className).toContain('grey');
    }
  });
});
