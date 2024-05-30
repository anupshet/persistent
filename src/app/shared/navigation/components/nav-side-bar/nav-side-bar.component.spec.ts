// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store, StoreModule } from '@ngrx/store';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { cloneDeep } from 'lodash';

import { NavSideBarComponent } from './nav-side-bar.component';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { NavigationService } from '../../navigation.service';
import { NavSideBarService } from '../../services/nav-side-bar.service';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import { NotificationService } from '../../../../core/notification/services/notification.service';
import { PortalApiService } from '../../../api/portalApi.service';
import { AuthenticationService } from '../../../../security/services';
import { PanelsApiService } from '../../../../master/panels/services/panelsApi.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { TreePill } from '../../../../contracts/models/lab-setup';
import { includeArchivedItems } from '../../../../core/config/constants/general.const';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

describe('NavSideBarComponent', () => {
  let component: NavSideBarComponent;
  let fixture: ComponentFixture<NavSideBarComponent>;
  const initialState = {};
  const State = [];
  let store: MockStore<any>;

  const nodeList = [
    {
      'nodeType': 2,
      'displayName': 'New Mexico',
      'id': '72285DC498024F1DADCF8E9BC12DCDD3',
      'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
      'instrumentInfo': {
        'id': 1254,
        'name': 'ARCHITECT c16000',
        'manufacturerId': '1',
        'manufacturerName': 'Abbott'
      },
      'children': [],
      'instrumentCustomName': 'abc',
      'productCustomName': 'abcd',
      'productInfo': {
        'name': 'product'
      },
      'isArchived': true
    },
    {
      'nodeType': 2,
      'displayName': 'test data',
      'id': '72243DC498024F1DADCF8E9BC12DCDD3',
      'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
      'instrumentInfo': {
        'id': 1254,
        'name': 'ARCHITECT c16000',
        'manufacturerId': '1',
        'manufacturerName': 'Abbott'
      },
      'children': [],
      'instrumentCustomName': 'abc',
      'productCustomName': 'abcd',
      'productInfo': {
        'name': 'product'
      }
    },
    {
      'nodeType': 2,
      'displayName': 'New Mexico',
      'id': '72285DC498024F1DADCF8E9BC12DCDD3',
      'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
      'instrumentInfo': {
        'id': 1254,
        'name': 'ARCHITECT c16000',
        'manufacturerId': '1',
        'manufacturerName': 'Abbott'
      },
      'children': [],
      'instrumentCustomName': 'abc',
      'productCustomName': 'abcd',
      'productInfo': {
        'name': 'product'
      }
    },
    {
      'nodeType': 2,
      'displayName': 'test data 2',
      'id': '72285DC498024F43ADCF8E9BC12DCDD3',
      'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
      'instrumentInfo': {
        'id': 1254,
        'name': 'ARCHITECT c16000',
        'manufacturerId': '1',
        'manufacturerName': 'Abbott'
      },
      'children': [],
      'instrumentCustomName': 'abc',
      'productCustomName': 'abcd',
      'productInfo': {
        'name': 'product'
      }
    },
    {
      'id': '12344',
      'name': 'Daily Test1',
      'children': [],
      'nodeType': 10,
      'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
      'displayName': 'Daily Test1',
      'panelItemIds': []
    },
    {
      'id': '123456',
      'name': 'Daily Test2',
      'children': [],
      'nodeType': 10,
      'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
      'displayName': 'Daily Test2',
      'panelItemIds': []
    }
  ];

  const selectedNodeData = {
    'nodeType': 2,
    'displayName': 'New Mexico',
    'id': '72285DC498024F1DADCF8E9BC12DCDD3',
    'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
    'children': nodeList
  };

  const mockCurrentBranch = [
    {
      displayName: 'Ajs lab',
      labLocationName: 'Ajs lab',
      locationTimeZone: 'America/Los_Angeles',
      locationOffset: '-08:00:00',
      locationDayLightSaving: '01:00:00',
      labLocationContactId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
      labLocationAddressId: '6239b09a-ed9b-43ec-8b41-03fa44a31a9f',
      labLocationContact: null,
      labLocationAddress: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      id: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
      parentNodeId: '6414a6bb-be30-40a5-82d5-48088dd3064c',
      parentNode: null,
      nodeType: 2,
      children: [],
      isUnavailable: false,
      unavailableReasonCode: ''
    },
    {
      displayName: 'NewAccount1',
      departmentName: 'NewAccount1',
      departmentManagerId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
      departmentManager: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      isArchived: false,
      id: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
      parentNodeId: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
      parentNode: null,
      nodeType: 3,
      children: [],
      isUnavailable: false,
      unavailableReasonCode: ''
    },
    {
      displayName: 'D-10',
      instrumentId: '2749',
      instrumentCustomName: '',
      instrumentSerial: '',
      instrumentInfo: {
        id: 2749,
        name: 'D-10',
        manufacturerId: 2,
        manufacturerName: 'Bio-Rad'
      },
      accountSettings: null,
      hasOwnAccountSettings: false,
      isArchived: false,
      id: 'dd01541f-fbbc-4740-915b-46917eb0fceb',
      parentNodeId: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
      parentNode: null,
      nodeType: 4,
      children: [],
      isUnavailable: false,
      unavailableReasonCode: ''
    },
    {
      displayName: 'Diabetes (Liquichek Vista)',
      productId: '405',
      productMasterLotId: '217',
      productCustomName: '',
      productInfo: {
        id: 405,
        name: 'Diabetes (Liquichek Vista)',
        manufacturerId: 2,
        manufacturerName: 'Bio-Rad',
        matrixId: 6,
        matrixName: 'Whole Blood'
      },
      lotInfo: {
        id: 217,
        productId: 405,
        productName: 'Diabetes (Liquichek Vista)',
        lotNumber: '55710V',
        expirationDate: '2021-11-30T00:00:00'
      },
      productLotLevels: null,
      levelSettings: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      isArchived: false,
      id: '4fcc18a9-ea28-4df0-b938-3f694c788438',
      parentNodeId: 'dd01541f-fbbc-4740-915b-46917eb0fceb',
      parentNode: null,
      nodeType: 5,
      children: [],
      isUnavailable: false,
      unavailableReasonCode: ''
    },
    {
      displayName: ' Hemoglobin A1c',
      testSpecId: '5',
      correlatedTestSpecId: 'F34508AEE1ED4219AD20DCC2D001F2F7',
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
      levelSettings: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      mappedTestSpecs: null,
      isArchived: false,
      id: '36610b51-fbd8-487e-a05f-3bb312ac35bb',
      parentNodeId: '4fcc18a9-ea28-4df0-b938-3f694c788438',
      parentNode: null,
      nodeType: 6,
      children: [],
      isUnavailable: false,
      unavailableReasonCode: ''
    }
  ];

  const selectedNode = {
    'displayName': 'Diabetes',
    'productId': '11',
    'productMasterLotId': '206',
    'productCustomName': '',
    'productInfo': {
      'id': 11,
      'name': 'Diabetes',
      'manufacturerId': '2',
      'manufacturerName': 'Bio-Rad',
      'matrixId': 6,
      'matrixName': 'Whole Blood'
    },
    'lotInfo': {
      'id': 206,
      'productId': 11,
      'productName': 'Diabetes',
      'lotNumber': '33980',
      'expirationDate': new Date('2021-03-31T00:00:00')
    },
    'levelSettings': {
      'levelEntityId': 'B9D1F12F287241F4B91A51F6C7298FA2',
      'levelEntityName': 'LabTest',
      'parentLevelEntityId': 'ADFC9711D8DA4D299EBBEC045C77CDD9',
      'parentLevelEntityName': 'LabProduct',
      'minNumberOfPoints': 5,
      'runLength': 4,
      'dataType': 1,
      'targets': [],
      'rules': [
        {
          'id': '2',
          'category': '1k',
          'k': '3',
          'disposition': 'R'
        },
        {
          'id': '1',
          'category': '1k',
          'k': '2',
          'disposition': 'R'
        }
      ],
      'levels': [
        {
          'levelInUse': true,
          'decimalPlace': 2
        },
        {
          'levelInUse': true,
          'decimalPlace': 2
        }
      ],
      'id': 'edbdad7d-e5da-4a00-9f68-1aafd9c7a4a1',
      'parentNodeId': 'e8bee5e0-fec3-48fe-9676-95986997fcba',
      'parentNode': null,
      'nodeType': 8,
      'displayName': 'edbdad7d-e5da-4a00-9f68-1aafd9c7a4a1',
      'children': null
    },
    'productLotLevels': [
      {
        'id': '513',
        'productMasterLotId': '205',
        'productId': '11',
        'productMasterLotNumber': '33970',
        'lotNumber': '33971',
        'level': 1,
        'levelDescription': '1'
      }],
    'hasOwnAccountSettings': false,
    'id': 'e8bee5e0-fec3-48fe-9676-95986997fcba',
    'parentNodeId': '473b7eb6-60a0-4cbe-ae4a-ecba63d0fce0',
    'parentNode': null,
    'nodeType': 5,
    'isArchived': true,
    'children': [{
      'id': '1',
      'parentNodeId': '1',
      'children': [],
      'nodeType': 6,
      'testSpecId': '1',
      'labUnitId': '12',
      'testSpecInfo': null,
      'testId': '1',
      'correlatedTestSpecId': '23',
      'displayName': 'name',
      'parentNode': {
        'id': '1',
        'displayName': 'Diabetes',
        'parentNodeId': '11',
        'manufacturerId': '',
        'children': [],
        'nodeType': 6,
        'productId': '',
        'productMasterLotId': '',
        'productCustomName': '',
        'productInfo': null,
        'lotInfo': null,
        'parentNode': null,
        'levelSettings': null,
        'productLotLevels': [
          {
            'id': '513',
            'productMasterLotId': '205',
            'productId': '11',
            'productMasterLotNumber': '33970',
            'lotNumber': '33971',
            'level': 1,
            'levelDescription': '1'
          }]
      },
      'mappedTestSpecs': 'spec'
    }, {
      'id': '1',
      'parentNodeId': '1',
      'children': [],
      'nodeType': 6,
      'testSpecId': '1',
      'labUnitId': '12',
      'testSpecInfo': null,
      'testId': '1',
      'correlatedTestSpecId': '23',
      'displayName': 'name',
      'parentNode': {
        'id': '1',
        'displayName': 'Diabetes',
        'parentNodeId': '11',
        'manufacturerId': '',
        'children': [],
        'nodeType': 6,
        'productId': '',
        'productMasterLotId': '',
        'productCustomName': '',
        'productInfo': null,
        'lotInfo': null,
        'parentNode': null,
        'levelSettings': null,
        'productLotLevels': [
          {
            'id': '513',
            'productMasterLotId': '205',
            'productId': '11',
            'productMasterLotNumber': '33970',
            'lotNumber': '33971',
            'level': 1,
            'levelDescription': '1'
          }]
      },
      'mappedTestSpecs': 'spec'
    }]
  };

  const navigationState = {
    selectedNode: selectedNode,
    selectedLeaf: null,
    currentBranch: [],
    error: null,
    isSideNavExpanded: false,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: true,
    navigation: true,
    selectedLeftNavItem: selectedNode,
    showArchivedItemsToggle: true,
    isArchiveItemsToggleOn: false
  };

  const mockPanelApiService = {
    getLabSetupNode: () => of(selectedNodeData)
  };

  const accountState = {
    currentAccountSummary: {
      accountAddress: {
        entityType: 1,
        streetAddress1: '21 Technology Drive',
        streetAddress2: '',
        streetAddress3: '',
        streetAddress: '21 Technology Drive',
        city: 'Irvine',
        state: 'Ca',
        country: 'US',
        zipCode: '92618',
        id: '0e32785f-c59b-499b-8990-04f6bf8ced14',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
        }
      },
      accountAddressId: '0e32785f-c59b-499b-8990-04f6bf8ced14',
      accountContact: {
        entityType: 0,
        searchAttribute: 'antonio_tavares+devnew04@bio-rad.com',
        firstName: 'AJ',
        middleName: '',
        lastName: 'Tavares',
        name: 'AJ Tavares',
        email: 'antonio_tavares+devnew04@bio-rad.com',
        phone: '',
        id: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
        }
      },
      accountContactId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
      accountLicenseType: 0,
      accountName: 'test',
      accountNumber: '100921',
      comments: '',
      displayName: '100921',
      formattedAccountNumber: 'U100921',
      id: '14a5d14d-46d3-495d-b396-8b48315b45f6',
      licenseAssignDate: new Date('2020-06-03T17:44:20.981Z'),
      licenseExpirationDate: new Date('2026-06-03T17:44:20.981Z'),
      licenseNumberUsers: 10,
      licensedProducts: [
        {
          product: 1,
          fileOption: 1
        }
      ],
      migrationStatus: null,
      nodeType: 0,
      orderNumber: '',
      parentNodeId: 'ROOT',
      primaryUnityLabNumbers: null,
      sapNumber: '',
      usedArchive: true,
      shipTo: '',
      soldTo: '',
      labName: '',
      lotViewer: '',
      children: [],
      previousContactUserId: null,
      languagePreference: 'en-us'
    },
    error: null
  };

  const location = {
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

  const stateArray = {
    navigation: navigationState,
    account: accountState,
    location: location
  };

  const mockNavigationService = {
    sortNavItems: () => {
    },
    routeTo: (url: string) => {
      of(url);
    },
    subject: () => { of(true); },
    setSelectedNotificationId: jasmine.createSpy(''),
    navigateToUrl: jasmine.createSpy('navigate'),
    setStateForSelectedNode: jasmine.createSpy('setStateForSelectedNode'),
    SecondaryNavSelectedTabIndex: { emit: () => { } },
  };

  const sideBarListItems = [{
    primaryText: 'test primaryText',
    secondaryText: 'test secondaryText',
    additionalText: 'test additionalText',
    node: selectedNode,
    sortOrder: 1,
    entityId: '',
  }, {
    primaryText: 'test primaryText',
    secondaryText: 'test secondaryText',
    additionalText: 'test additionalText',
    node: selectedNodeData,
    sortOrder: 2,
    entityId: '',
  }];

  let navSideBarServiceInstance: NavSideBarService;

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockNotification = {
    correlationId: '111-111-111-111',
    audienceType: 2,
    audienceKey: 2,
    notificationType: 'LotDuplication',
    payload: {
      id: '',
      isSuccess: true
    },
    timeUtc: new Date(),
  };

  const mockNotificationService = {
    $labStream: of(mockNotification),
    subscribeLabTestToHubWithoutUnsubscribePrevious: () => { },
    subscribeLabTestToHub: () => { }
  };

  const mockPortalApiService = {
    getLabSetupNode: (nodeId: string, options: LevelLoadRequest,
      filterEntityType: EntityType = EntityType.None, queryParameters?: QueryParameter[],
      doNotshowBusy?: boolean): Observable<TreePill> => {
      if (queryParameters[0]?.key === includeArchivedItems && queryParameters[0]?.value === (true).toString()) {
        return of(selectedNodeData);
      } else {
        const _selectedNodeData: TreePill = cloneDeep(selectedNodeData);
        _selectedNodeData.children = _selectedNodeData.children.filter((child: TreePill) => !child.isArchived);
        return of(_selectedNodeData);
      }
    }
  };

  const getCurrentUserStub = {
    hasDefaultSystemAccess: () => {
      return true;
    }
  };

  const mockCurrentUser = {
    'firstName': 'Pratik',
    'lastName': 'Thakare',
    'email': 'pratik_thakare+dev20@bio-rad.com',
    'userOktaId': '00u69n49iubpFpXmE2p7',
    'roles': [
      'Admin'
    ],
    'accessToken': {
      'accessToken': `eyJraWQiOiJPYWRzbHZzVDBQRU0tMUdya1FLQzd2TXY3bXVnc3B2NkdnMEx1NVczd
      S1NIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnVaUnRRczB3SW1Bc0ozcDl3ejlOTEN
      zSTJYcHJMaUoxVm1VeGxuSUlmeVkiLCJpc3MiOiJodHRwczovL2Jpb3JhZC1leHQub2t0YS5jb20vb2F1
      dGgyL2F1czUzbmxtOTAwQkJLbFBuMnA3IiwiYXVkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJpYXQiO
      jE1ODI3MTg5NTIsImV4cCI6MTU4MjcyMjU1MiwiY2lkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJ1aW
      QiOiIwMHU2OW40OWl1YnBGcFhtRTJwNyIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJwcmF
      0aWtfdGhha2FyZStkZXYyMEBiaW8tcmFkLmNvbSIsIlVzZXJMYXN0TmFtZSI6IlRoYWthcmUiLCJVc2Vy
      Rmlyc3ROYW1lIjoiUHJhdGlrIiwiVXNlckVtYWlsIjoicHJhdGlrX3RoYWthcmUrZGV2MjBAYmlvLXJhZ
      C5jb20iLCJVc2VyRGlzcGxheU5hbWUiOiJQcmF0aWsgVGhha2FyZSJ9.JdB-JPL8XAIYJ7m5dyrRK4P9C
      _he8AiIeio_1TacYR6r62TPIatbdYURA4XuTSBws5NxJ76WTXWww_G35eN7tdRjW6FZOJu6AWp0xsAwfs
      GhtOj6T4pwwkB5KsyHXo39cWYcD8skCEBv7svH4sneUypQSpBYRWAqfVog9FCoPcAhbh_jw5kotG6nj3Y
      SOMDQSkm1hR_XEAjbeUGpX57rjQGXi4cD_VBvHDFAMT19dwEcnxJiuSwlYoZwNeUG5SX54xBtb8h5RGNd
      WFeg9plh-wjHGImxaoIceQ-hxUY-6f8A9camDc-0paEv4qI7Evb7sOrBFWiQfYHvJFVGPvr-SA`,
      'expiresAt': '1582722553',
      'tokenType': 'Bearer',
      'scopes': [
        'openid',
        'email'
      ],
      'authorizeUrl': 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/authorize',
      'userinfoUrl': 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/userinfo'
    },
    'accountNumber': '100472',
    'accountId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
    'accountNumberArray': [
      '100472'
    ],
    'labLocationId': 'b5401afc-d62f-4580-a89f-5b874905b318',
    'labLocationIds': [
      'b5401afc-d62f-4580-a89f-5b874905b318'
    ],
    'permissions': [],
    'userData': {
      'assignedLabNumbers': [],
      'defaultLab': ''
    },
    'id': 'fafc531c-963a-4c1f-92d1-0b3a78527389',
    'userName': '',
    'displayName': '',
    'labId': ''
  };

  class MockRouterServices {
    readonly url = '/data/dfbe213d-0935-4ede-ac8c-86f79e6fa146/6/table';
    public ne = new NavigationEnd(0, 'http://localhost:4200', 'http://localhost:4200');
    public events = new Observable(observer => {
      observer.next(this.ne);
      observer.complete();
    });
  }

  // mock service
  const mockAppNavigationTrackingService = {
    resetData: () => { },
    subject: () => { of(true); }
  };


  const mockBrPermissionsService = {
    hasAccess: () => true,
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(State),
        MatSidenavModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [NavSideBarComponent],
      providers: [
        { provide: AuthenticationService, useValue: getCurrentUserStub },
        { provide: Store, useValue: stateArray },
        provideMockStore({ initialState }),
        { provide: NavigationService, useValue: mockNavigationService },
        NavSideBarService,
        { provide: PanelsApiService, useValue: mockPanelApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useClass: MockRouterServices },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService,
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        TranslateService
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
    store.setState(stateArray);
    fixture = TestBed.createComponent(NavSideBarComponent);
    component = fixture.componentInstance;
    navSideBarServiceInstance = fixture.debugElement.injector.get(NavSideBarService);
  }));

  beforeEach(() => {
    component.sideBarList = navSideBarServiceInstance.getSideBarItems(nodeList);
    navigationState.isSideNavExpanded = true;
    store.setState(stateArray);
    component.getCurrentUserState$ = of(mockCurrentUser);
    component.currentAccountState$ = of(accountState.currentAccountSummary);
    component.getCurrentLabLocation$ = of(location);
  });

  afterEach(() => {
    navigationState.isSideNavExpanded = false;
    store.setState(stateArray);
    component.sideBarList = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads list when nodeType is LabInstrument', () => {
    nodeList[0].nodeType = EntityType.LabInstrument;
    component.sideBarList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#sideNav')).not.toBe(null);
  });

  it('loads list when nodeType is LabProduct', () => {
    nodeList[0].nodeType = EntityType.LabProduct;
    component.sideBarList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#sideNav')).not.toBe(null);
  });

  it('should toggle nav bar', () => {
    fixture.detectChanges();
    const navbar = fixture.debugElement.nativeElement.querySelector('.spec_toggle_navbar');
    navbar.click();
    fixture.detectChanges();
    const sidenavClosed = fixture.debugElement.nativeElement.querySelector('.ctn-sidenav-closed');
    expect(sidenavClosed).toBeTruthy();
  });

  it('should call change method on slide change', () => {
    const SpyOn = spyOn(component, 'toggleArchivedItems');
    component.showArchivedItemsToggle = true;
    fixture.detectChanges();
    const archivedItemsToggle = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec-archive-items-toggle');
    const event = new Event('change');
    archivedItemsToggle.dispatchEvent(event);
    expect(SpyOn).toHaveBeenCalled();
  });

  it('loads list when nodeType is Panel', () => {
    nodeList[2].nodeType = EntityType.Panel;
    component.sideBarList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#sideNav')).not.toBe(null);
  });

  it('Should check if Link routes to Add Panel.', () => {
    fixture.detectChanges();
    const sypOn = spyOn(mockNavigationService, 'routeTo');
    component.showPanel = true;
    fixture.detectChanges();
    const link = fixture.debugElement.nativeElement.querySelector('.spec_gotoAddPanel');
    link.click();
    expect(sypOn).toHaveBeenCalledWith('/panel/add');
  });

  it('Should check custom sort enable when click on sort button of Panel', () => {
    fixture.detectChanges();
    component.showPanel = true;
    component.showSortOpts = false;
    const spy = spyOn(component, 'toggleSortOptionsPanels').and.callThrough();
    fixture.detectChanges();
    const sortButtonElement = fixture.debugElement.query(By.css('.spec_panel_btn_sort')).nativeElement;
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_atoz'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_done'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_cancel'))).toBeFalsy();
    sortButtonElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_atoz'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_done'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_cancel'))).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('Should check custom panel sort is disabled when not permitted', () => {
    fixture.detectChanges();
    component.showPanel = true;
    component.showSortOpts = false;
    const spy = spyOn(component, 'toggleSortOptionsPanels').and.callThrough();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_atoz'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_done'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_cancel'))).toBeFalsy();
    const sortButtonElement = fixture.debugElement.query(By.css('.spec_panel_btn_sort')).nativeElement;
    const originalHasPermissionToAccess = component.hasAddPermissionToAccess;
    component.hasPermissionToAccess = () => false;
    fixture.detectChanges();
    sortButtonElement.click();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_atoz'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_done'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_panel_btn_cancel'))).toBeFalsy();
    expect(spy).not.toHaveBeenCalled();
    component.hasAddPermissionToAccess = originalHasPermissionToAccess;
  });

  it('Should check custom sort enable other than panel when click on sort button', () => {
    component.showSideBarItems = true;
    const spy = spyOn(component, 'toggleSortOptions').and.callThrough();
    const originalUsedArchive = location.usedArchive;
    location.usedArchive = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.spec_btn_atoz'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_btn_done'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_btn_cancel'))).toBeFalsy();
    const sortButtonElement = fixture.debugElement.query(By.css('.spec_btn_sort')).nativeElement;
    sortButtonElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.spec_btn_atoz'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.spec_btn_done'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.spec_btn_cancel'))).toBeTruthy();
    expect(spy).toHaveBeenCalled();
    location.usedArchive = originalUsedArchive;
  });

  it('Should check custom sort is disabled when not permitted', () => {
    component.showSideBarItems = true;
    const spy = spyOn(component, 'toggleSortOptions').and.callThrough();
    const originalUsedArchive = location.usedArchive;
    location.usedArchive = false;
    const originalHasPermissionToAccess = component.hasAddPermissionToAccess;
    component.hasPermissionToAccess = () => false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.spec_btn_atoz'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_btn_done'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_btn_cancel'))).toBeFalsy();
    const sortButtonElement = fixture.debugElement.query(By.css('.spec_btn_sort')).nativeElement;
    sortButtonElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.spec_btn_atoz'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_btn_done'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spec_btn_cancel'))).toBeFalsy();
    expect(spy).not.toHaveBeenCalled();
    location.usedArchive = originalUsedArchive;
    component.hasAddPermissionToAccess = originalHasPermissionToAccess;
  });

  it('Should check custum sort cancel when click on panel cancel button', async () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'resetPanels').and.callThrough();
    component.showPanel = true;
    component.showSortOpts = false;
    component.showSortOptsPanels = true;
    component.panelList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    const sortButtonElement = fixture.debugElement.query(By.css('.spec_panel_btn_sort')).nativeElement;
    sortButtonElement.click();
    spyOn(component, 'toggleSortOptionsPanels').and.callThrough();
    component.toggleSortOptionsPanels();
    const cancelPanelButtonElement = fixture.debugElement.query(By.css('.spec_panel_btn_cancel')).nativeElement;
    cancelPanelButtonElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const atozButtonElement = fixture.debugElement.query(By.css('.spec_panel_btn_atoz'));
      const doneButtonElement = fixture.debugElement.query(By.css('.spec_panel_btn_done'));
      expect(spy).toHaveBeenCalled();
      expect(atozButtonElement).toEqual(null);
      expect(doneButtonElement).toEqual(null);
    });

  });

  it('Should check custum sort cancel other than panel when click on cancel button', async () => {
    const spy = spyOn(component, 'resetSideBarItems').and.callThrough();
    component.showSortOpts = true;
    component.showSideBarItems = true;
    component.panelList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    const sortButtonElement = fixture.debugElement.query(By.css('.spec_btn_sort')).nativeElement;
    sortButtonElement.click();
    const cancelButtonElement = fixture.debugElement.query(By.css('.spec_btn_cancel')).nativeElement;
    cancelButtonElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const atozButtonElement = fixture.debugElement.query(By.css('.spec_btn_atoz'));
      const doneButtonElement = fixture.debugElement.query(By.css('.spec_btn_done'));
      expect(spy).toHaveBeenCalled();
      expect(atozButtonElement).toEqual(null);
      expect(doneButtonElement).toEqual(null);
    });
  });

  it('Should call sortSideBarPanels on click of A-Z button', async () => {
    const spy = spyOn(component, 'sortSideBarPanels').and.callThrough();
    component.showSortOpts = true;
    component.showSideBarItems = true;
    component.sortedSideBarList = sideBarListItems;
    component.panelList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    const atozButtonElement = fixture.debugElement.query(By.css('.spec_btn_atoz')).nativeElement;
    atozButtonElement.click();
    component.sortSideBarPanels(sideBarListItems);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('Should call sortSideBarItems on click of A-Z button', async () => {
    const spy = spyOn(component, 'sortSideBarItems').and.callThrough();
    component.showSortOpts = true;
    component.showSideBarItems = true;
    component.sortedSideBarList = sideBarListItems;
    component.panelList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    const atozButtonElement = fixture.debugElement.query(By.css('.spec_btn_atoz')).nativeElement;
    atozButtonElement.click();
    component.sortSideBarItems(sideBarListItems);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('Should call onSubmit on click of Done button', async () => {
    const spy = spyOn(component, 'onSubmit').and.callThrough();
    component.showSortOpts = true;
    component.showSideBarItems = true;
    component.sortedSideBarList = sideBarListItems;
    component.panelList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    const submitButtonElement = fixture.debugElement.query(By.css('.spec_btn_done')).nativeElement;
    submitButtonElement.click();
    component.onSubmit(false);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('Should call onSubmit on click of Done button when panel MDE', async () => {
    const spy = spyOn(component, 'onSubmit').and.callThrough();
    component.showSortOpts = true;
    component.showSideBarItems = true;
    component.sortedSideBarList = sideBarListItems;
    component.panelList = navSideBarServiceInstance.getSideBarItems(nodeList);
    fixture.detectChanges();
    const submitButtonElement = fixture.debugElement.query(By.css('.spec_btn_done')).nativeElement;
    submitButtonElement.click();
    component.onSubmit(true);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should check if the archived items are shown when changing archived items toggle', async () => {
    fixture.detectChanges();
    // show there are no items available in archived array
    expect(component.sortedSideBarArchiveList.length).toEqual(0);
    // change the toggle to on
    component.isArchiveItemsToggleOn = true;
    const archivedItemsToggle = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec-archive-items-toggle');
    const event = new Event('change');
    archivedItemsToggle.dispatchEvent(event);
    // calling setSideBarList manually as the store dispatch is not working from spec in this case.
    component.setSideBarList(selectedNodeData);
    fixture.detectChanges();
    // make sure the API call returns proper value including archived items
    fixture.whenStable().then(() => {
      // show there are items present in the archived array
      expect(component.sortedSideBarArchiveList.length).toEqual(1);
    });
  });

  it('Should check if Link routes to Add Department.', () => {
    fixture.detectChanges();
    component.selectedNode = mockCurrentBranch[0];
    component.instGroupedByDept = true;
    fixture.detectChanges();
    const goToAddLink = fixture.debugElement.nativeElement.querySelector('.spec_goto_add_link');
    goToAddLink.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(mockNavigationService.navigateToUrl)
      .toHaveBeenCalledWith('/lab-setup/departments/3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e/settings', false, component.selectedNode);
    expect(mockNavigationService.setSelectedNotificationId);
  });

  it('Should check if Link routes to Add Instrument.', () => {
    fixture.detectChanges();
    component.selectedNode = mockCurrentBranch[1];
    component.selectedNode = mockCurrentBranch[1];
    fixture.detectChanges();
    const goToAddLink = fixture.debugElement.nativeElement.querySelector('.spec_goto_add_link');
    goToAddLink.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(mockNavigationService.navigateToUrl)
      .toHaveBeenCalledWith('/lab-setup/instruments/5376a8d5-a6b3-47ad-a752-1b7491fdb348/settings', false, component.selectedNode);
    expect(mockNavigationService.setSelectedNotificationId);
  });

  it('Should check if Link routes to Add Control.', () => {
    fixture.detectChanges();
    component.selectedNode = mockCurrentBranch[2];
    fixture.detectChanges();
    const goToAddLink = fixture.debugElement.nativeElement.querySelector('.spec_goto_add_link');
    goToAddLink.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(mockNavigationService.navigateToUrl)
      .toHaveBeenCalledWith('/lab-setup/controls/dd01541f-fbbc-4740-915b-46917eb0fceb/settings', false, component.selectedNode);
    expect(mockNavigationService.setSelectedNotificationId);
  });

  it('Should check if Link routes to Add Analyte.', () => {
    fixture.detectChanges();
    component.selectedNode = mockCurrentBranch[3];
    fixture.detectChanges();
    const goToAddLink = fixture.debugElement.nativeElement.querySelector('.spec_goto_add_link');
    goToAddLink.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(mockNavigationService.setStateForSelectedNode)
      .toHaveBeenCalledWith(null, false, '/lab-setup/analytes/4fcc18a9-ea28-4df0-b938-3f694c788438/settings');
    expect(mockNavigationService.setSelectedNotificationId);
  });

  it('Should check if Link routes to Add Analyte', () => {
    const accountSateMock = cloneDeep(accountState.currentAccountSummary);
    accountSateMock.usedArchive = false;
    component.currentAccountState$ = of(accountSateMock);
    fixture.detectChanges();
    component.selectedNode = mockCurrentBranch[3];
    fixture.detectChanges();
    const goToAddLink = fixture.debugElement.nativeElement.querySelector('.spec_goto_add_link');
    goToAddLink.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(mockNavigationService.setStateForSelectedNode)
      .toHaveBeenCalledWith(null, false, '/lab-setup/analytes/4fcc18a9-ea28-4df0-b938-3f694c788438/settings');
    expect(mockNavigationService.setSelectedNotificationId);
  });

  it('Should show PanelList if correct permissions are granted', () => {
    const panelList = fixture.debugElement.nativeElement.querySelector('.spec-panel-list');
    expect(panelList).toBeDefined();
  });

  it('Should show Add Panel button if correct permissions are granted', () => {
    const addPanelBtn = fixture.debugElement.nativeElement.querySelector('.spec_gotoAddPanel');
    expect(addPanelBtn).toBeDefined();
  });
});
