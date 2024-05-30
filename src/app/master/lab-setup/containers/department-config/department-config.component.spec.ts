// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrSelect } from 'br-component-library';

import { ApiService } from '../../../../shared/api/api.service';
import { LabSetupDefaultsService } from '../../services/lab-setup-defaults.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
/** Import for Components */
import { DepartmentEntryComponent } from '../../components/department-entry/department-entry.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { DepartmentConfigComponent } from './department-config.component';
/** Import for models */
import { Department } from '../../../../contracts/models/lab-setup';
import * as actions from '../../state/actions';
import * as fromRoot from '../../state';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { LabDepartmentValues } from '../../../../contracts/models/lab-setup/department.model';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from 'src/app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';

describe('DepartmentConfigComponent', () => {
  let component: DepartmentConfigComponent;
  let fixture: ComponentFixture<DepartmentConfigComponent>;
  let store: MockStore<any>;
  let substore: MockStore<any>;
  let SpyonStore: any;
  const mockState = {};
  const autofixture = new Autofixture();
  const archivedSettings = autofixture.create(new Settings());

  const users = {
    'displayName': '100503',
    'accountNumber': '100503',
    'formattedAccountNumber': 'U100503',
    'sapNumber': '',
    'orderNumber': '',
    'accountAddressId': '65114ca9-6bb6-4474-ba3d-12d142026907',
    'accountContactId': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
    'accountLicenseType': 0,
    'licensedProducts': [
      {
        'product': 1,
        'fileOption': 0
      }
    ],
    'licenseNumberUsers': 20,
    'accountContact': {
      'entityType': 0,
      'searchAttribute': 'nikita_pawar+dev22@bio-rad.com',
      'firstName': 'Nikita',
      'middleName': '',
      'lastName': 'Pawar',
      'name': 'Nikita Pawar',
      'email': 'nikita_pawar+dev22@bio-rad.com',
      'phone': '',
      'id': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
      'featureInfo': {
        'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
      }
    },
    'accountAddress': {
      'entityType': 1,
      'searchAttribute': '',
      'nickName': '',
      'streetAddress1': 'Pune',
      'streetAddress2': '',
      'streetAddress3': '',
      'streetAddress': 'Pune',
      'suite': '',
      'city': '',
      'state': '',
      'country': 'IN',
      'zipCode': '',
      'id': '65114ca9-6bb6-4474-ba3d-12d142026907',
      'featureInfo': {
        'uniqueServiceName': 'Portal.Core.Models.Address/Portal.Core.Models.Address'
      }
    },
    'licenseAssignDate': '2020-02-12T08:36:41.324Z',
    'licenseExpirationDate': '2020-07-12T18:30:00Z',
    'comments': '',
    'primaryUnityLabNumbers': '',
    'migrationStatus': '',
    'accountSettings': {
      'displayName': '',
      'dataType': 1,
      'instrumentsGroupedByDept': true,
      'trackReagentCalibrator': false,
      'fixedMean': false,
      'decimalPlaces': 2,
      'siUnits': false,
      'labSetupRating': 0,
      'labSetupComments': '',
      'isLabSetupComplete': true,
      'labSetupLastEntityId': 'null',
      'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
      'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
      'parentNode': null,
      'nodeType': 9,
      'children': null
    },
    'id': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
    'parentNodeId': 'ROOT',
    'parentNode': null,
    'nodeType': 0,
    'children': [
      {
        'displayName': 'pratik thakare',
        'contactId': '4bd3b6e0-2845-4a29-9bec-6dbf2af86bc9',
        'userOktaId': '00u6att5uyrKTbE9U2p7',
        'userRoles': [
          'User'
        ],
        'contactInfo': {
          'entityType': 0,
          'searchAttribute': 'pratik_thakare+User@bio-rad.com',
          'firstName': 'pratik',
          'middleName': '',
          'lastName': 'thakare',
          'name': 'pratik thakare',
          'email': 'pratik_thakare+User@bio-rad.com',
          'phone': '',
          'id': '4bd3b6e0-2845-4a29-9bec-6dbf2af86bc9',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
        },
        'preferences': {
          'entityType': 2,
          'searchAttribute': 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
          'lastSelectedEntityId': null,
          'lastSelectedEntityType': 0,
          'termsAcceptedDateTime': '2020-02-12T08:54:55.968Z',
          'id': 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
          }
        },
        'parentAccounts': [
          {
            'displayName': '100503',
            'accountNumber': '100503',
            'formattedAccountNumber': 'U100503',
            'sapNumber': '',
            'orderNumber': '',
            'accountAddressId': '65114ca9-6bb6-4474-ba3d-12d142026907',
            'accountContactId': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
            'accountLicenseType': 0,
            'licensedProducts': [
              {
                'product': 1,
                'fileOption': 0
              }
            ],
            'licenseNumberUsers': 20,
            'accountContact': null,
            'accountAddress': null,
            'licenseAssignDate': '2020-02-12T08:36:41.324Z',
            'licenseExpirationDate': '2020-07-12T18:30:00Z',
            'comments': '',
            'primaryUnityLabNumbers': '',
            'migrationStatus': '',
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
              'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'id': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
            'parentNodeId': 'ROOT',
            'parentNode': null,
            'nodeType': 0,
            'children': null
          }
        ],
        'id': 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
        'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
        'parentNode': null,
        'nodeType': 7,
        'children': []
      },
      {
        'displayName': 'nilam pawar',
        'contactId': 'f2f57f89-5a0d-45cf-98bd-09adb2f28ef4',
        'userOktaId': '00u6ciixxaeWo1TTh2p7',
        'userRoles': [
          'User'
        ],
        'contactInfo': {
          'entityType': 0,
          'searchAttribute': 'nikita_pawar+dev_user21@persistent.com',
          'firstName': 'nilam',
          'middleName': '',
          'lastName': 'pawar',
          'name': 'nilam pawar',
          'email': 'nikita_pawar+dev_user21@persistent.com',
          'phone': '',
          'id': 'f2f57f89-5a0d-45cf-98bd-09adb2f28ef4',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
        },
        'preferences': {
          'entityType': 2,
          'searchAttribute': 'd12378dc-6090-4af2-9676-bae37dd3c64a',
          'lastSelectedEntityId': null,
          'lastSelectedEntityType': 0,
          'termsAcceptedDateTime': null,
          'id': 'd12378dc-6090-4af2-9676-bae37dd3c64a',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
          }
        },
        'parentAccounts': [
          {
            'displayName': '100503',
            'accountNumber': '100503',
            'formattedAccountNumber': 'U100503',
            'sapNumber': '',
            'orderNumber': '',
            'accountAddressId': '65114ca9-6bb6-4474-ba3d-12d142026907',
            'accountContactId': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
            'accountLicenseType': 0,
            'licensedProducts': [
              {
                'product': 1,
                'fileOption': 0
              }
            ],
            'licenseNumberUsers': 20,
            'accountContact': null,
            'accountAddress': null,
            'licenseAssignDate': '2020-02-12T08:36:41.324Z',
            'licenseExpirationDate': '2020-07-12T18:30:00Z',
            'comments': '',
            'primaryUnityLabNumbers': '',
            'migrationStatus': '',
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
              'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'id': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
            'parentNodeId': 'ROOT',
            'parentNode': null,
            'nodeType': 0,
            'children': null
          }
        ],
        'id': 'd12378dc-6090-4af2-9676-bae37dd3c64a',
        'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
        'parentNode': null,
        'nodeType': 7,
        'children': []
      },
      {
        'displayName': 'Neha Pagar',
        'contactId': 'ad13388d-3bac-4167-a53a-5439df492c62',
        'userOktaId': '00u6cikekrE3XqcBT2p7',
        'userRoles': [
          'User'
        ],
        'contactInfo': {
          'entityType': 0,
          'searchAttribute': 'nikita_pawar+dev_22_user@bio-rad.com',
          'firstName': 'Neha',
          'middleName': '',
          'lastName': 'Pagar',
          'name': 'Neha Pagar',
          'email': 'nikita_pawar+dev_22_user@bio-rad.com',
          'phone': '',
          'id': 'ad13388d-3bac-4167-a53a-5439df492c62',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
        },
        'preferences': {
          'entityType': 2,
          'searchAttribute': '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
          'lastSelectedEntityId': null,
          'lastSelectedEntityType': 0,
          'termsAcceptedDateTime': '2020-02-17T13:20:49.664Z',
          'id': '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
          }
        },
        'parentAccounts': [
          {
            'displayName': '100503',
            'accountNumber': '100503',
            'formattedAccountNumber': 'U100503',
            'sapNumber': '',
            'orderNumber': '',
            'accountAddressId': '65114ca9-6bb6-4474-ba3d-12d142026907',
            'accountContactId': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
            'accountLicenseType': 0,
            'licensedProducts': [
              {
                'product': 1,
                'fileOption': 0
              }
            ],
            'licenseNumberUsers': 20,
            'accountContact': null,
            'accountAddress': null,
            'licenseAssignDate': '2020-02-12T08:36:41.324Z',
            'licenseExpirationDate': '2020-07-12T18:30:00Z',
            'comments': '',
            'primaryUnityLabNumbers': '',
            'migrationStatus': '',
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
              'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'id': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
            'parentNodeId': 'ROOT',
            'parentNode': null,
            'nodeType': 0,
            'children': null
          }
        ],
        'id': '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
        'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
        'parentNode': null,
        'nodeType': 7,
        'children': []
      },
      {
        'displayName': 'mahesh janugade',
        'contactId': 'e698c9cc-eca4-464a-a54b-2e2524887e73',
        'userOktaId': '00u6cih3xuerXD5g02p7',
        'userRoles': [
          'User'
        ],
        'contactInfo': {
          'entityType': 0,
          'searchAttribute': 'mahesh_janugade+dev_user1@bio-rad.com',
          'firstName': 'mahesh',
          'middleName': '',
          'lastName': 'janugade',
          'name': 'mahesh janugade',
          'email': 'mahesh_janugade+dev_user1@bio-rad.com',
          'phone': '',
          'id': 'e698c9cc-eca4-464a-a54b-2e2524887e73',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
        },
        'preferences': {
          'entityType': 2,
          'searchAttribute': '8ec9544f-059c-4351-87a5-4a04c2f33c28',
          'lastSelectedEntityId': null,
          'lastSelectedEntityType': 0,
          'termsAcceptedDateTime': null,
          'id': '8ec9544f-059c-4351-87a5-4a04c2f33c28',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
          }
        },
        'parentAccounts': [
          {
            'displayName': '100503',
            'accountNumber': '100503',
            'formattedAccountNumber': 'U100503',
            'sapNumber': '',
            'orderNumber': '',
            'accountAddressId': '65114ca9-6bb6-4474-ba3d-12d142026907',
            'accountContactId': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
            'accountLicenseType': 0,
            'licensedProducts': [
              {
                'product': 1,
                'fileOption': 0
              }
            ],
            'licenseNumberUsers': 20,
            'accountContact': null,
            'accountAddress': null,
            'licenseAssignDate': '2020-02-12T08:36:41.324Z',
            'licenseExpirationDate': '2020-07-12T18:30:00Z',
            'comments': '',
            'primaryUnityLabNumbers': '',
            'migrationStatus': '',
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
              'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'id': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
            'parentNodeId': 'ROOT',
            'parentNode': null,
            'nodeType': 0,
            'children': null
          }
        ],
        'id': '8ec9544f-059c-4351-87a5-4a04c2f33c28',
        'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
        'parentNode': null,
        'nodeType': 7,
        'children': []
      },
      {
        'displayName': 'Nikita Pawar',
        'contactId': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
        'userOktaId': '00u6atq71s2yUBNJr2p7',
        'userRoles': [
          'Admin'
        ],
        'contactInfo': {
          'entityType': 0,
          'searchAttribute': 'nikita_pawar+dev22@bio-rad.com',
          'firstName': 'Nikita',
          'middleName': '',
          'lastName': 'Pawar',
          'name': 'Nikita Pawar',
          'email': 'nikita_pawar+dev22@bio-rad.com',
          'phone': '',
          'id': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
        },
        'preferences': {
          'entityType': 2,
          'searchAttribute': '9b576ae9-6352-4425-9b7d-399caa26c6f8',
          'lastSelectedEntityId': null,
          'lastSelectedEntityType': 0,
          'termsAcceptedDateTime': '2020-02-12T08:43:41.866Z',
          'id': '9b576ae9-6352-4425-9b7d-399caa26c6f8',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
          }
        },
        'parentAccounts': [
          {
            'displayName': '100503',
            'accountNumber': '100503',
            'formattedAccountNumber': 'U100503',
            'sapNumber': '',
            'orderNumber': '',
            'accountAddressId': '65114ca9-6bb6-4474-ba3d-12d142026907',
            'accountContactId': '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
            'accountLicenseType': 0,
            'licensedProducts': [
              {
                'product': 1,
                'fileOption': 0
              }
            ],
            'licenseNumberUsers': 20,
            'accountContact': null,
            'accountAddress': null,
            'licenseAssignDate': '2020-02-12T08:36:41.324Z',
            'licenseExpirationDate': '2020-07-12T18:30:00Z',
            'comments': '',
            'primaryUnityLabNumbers': '',
            'migrationStatus': '',
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
              'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'id': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
            'parentNodeId': 'ROOT',
            'parentNode': null,
            'nodeType': 0,
            'children': null
          }
        ],
        'id': '9b576ae9-6352-4425-9b7d-399caa26c6f8',
        'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
        'parentNode': null,
        'nodeType': 7,
        'children': []
      }
    ]
  };

  const mockPortalApiService = {
    getUsers: () => {
      return of(users);
    }
  };

  const mockApiService = {
    apiUrl: 'apiUrl',
    subscriptionKey: 'subscriptionKey'
  };

  const mockSpcRuleService = {
    getSettings: () => { }
  };

  const mockNavigationService = {};

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    subject: of(true),
    auditTrailViewData: () => {}
  };

  const selectedNodeData = {
    displayName: 'Nikitas Lab',
    labLocationName: 'Nikitas Lab',
    locationTimeZone: 'America/Indiana/Indianapolis',
    locationOffset: '-05:00:00',
    locationDayLightSaving: '00:00:00',
    labLocationContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
    labLocationAddressId: 'f29e65c1-83d6-476b-b492-f06880049c0b',
    labLocationContact: {
      entityType: 0,
      searchAttribute: 'nikita_pawar+dev22@bio-rad.com',
      firstName: 'Nikita',
      middleName: '',
      lastName: 'Pawar',
      name: 'Nikita Pawar',
      email: 'nikita_pawar+dev22@bio-rad.com',
      phone: '',
      id: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
      }
    },
    labLocationAddress: {
      entityType: 1,
      searchAttribute: '',
      nickName: '',
      streetAddress1: 'Pune',
      streetAddress2: '',
      streetAddress3: '',
      streetAddress: 'Pune',
      suite: '',
      city: '',
      state: '',
      country: 'IN',
      zipCode: '',
      id: 'f29e65c1-83d6-476b-b492-f06880049c0b',
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
      id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
      parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
      parentNode: null,
      nodeType: 9,
      children: null
    },
    hasOwnAccountSettings: false,
    id: '25dc4656-0670-47bd-be1c-0f12eaf3e20c',
    parentNodeId: '9da2e249-18d5-4f94-a5a0-06f6bf81db69',
    parentNode: null,
    nodeType: 2,
    children: [
      {
        displayName: 'Nikitas Dept',
        departmentName: 'Nikitas Dept',
        departmentManagerId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
        departmentManager: {
          entityType: 0,
          searchAttribute: 'nikita_pawar+dev22@bio-rad.com',
          firstName: 'Nikita',
          middleName: '',
          lastName: 'Pawar',
          name: 'Nikita Pawar',
          email: 'nikita_pawar+dev22@bio-rad.com',
          phone: '',
          id: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
          featureInfo: {
            uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
        },
        levelSettings: {
          levelEntityId: null,
          levelEntityName: null,
          parentLevelEntityId: null,
          parentLevelEntityName: null,
          minNumberOfPoints: 5,
          runLength: 4,
          dataType: 1,
          targets: null,
          rules: [
            {
              id: '2',
              category: '1k',
              k: 3,
              disposition: 'R'
            },
            {
              id: '1',
              category: '1k',
              k: 2,
              disposition: 'R'
            }
          ],
          levels: [
            {
              levelInUse: true,
              decimalPlace: 2
            }
          ],
          id: '9030a4a9-3916-4cf4-b174-7089c5baf6d5',
          parentNodeId: '387427a6-b47e-45e1-afc8-eb621303f3f4',
          parentNode: null,
          nodeType: 8,
          displayName: '9030a4a9-3916-4cf4-b174-7089c5baf6d5',
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
          id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 9,
          children: null
        },
        hasOwnAccountSettings: false,
        id: '387427a6-b47e-45e1-afc8-eb621303f3f4',
        parentNodeId: '25dc4656-0670-47bd-be1c-0f12eaf3e20c',
        parentNode: null,
        nodeType: 3,
        children: []
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
    showSettings: true,
    navigation: true
  };

  const securityData = {
    isLoggedIn: true,
    currentUser: {
      firstName: 'Nikita ',
      lastName: 'Pawar',
      email: 'nikita_pawar+dev22@bio-rad.com',
      userOktaId: '00u6atq71s2yUBNJr2p7',
      roles: [
        'Admin'
      ],
      accessToken: {
        accessToken: `eyJraWQiOiJPYWRzbHZzVDBQRU0tMUdya1FLQzd2TXY3bXVnc3B2NkdnMEx1NVczd
        S1NIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnVIOFhLMW90MEJtOVU0cm9JTkt1a0Rfa
        DhDM2UtRHhqenJ4Szh6Y1l3WkkiLCJpc3MiOiJodHRwczovL2Jpb3JhZC1leHQub2t0YS5jb20vb2F1dGgyL2
        F1czUzbmxtOTAwQkJLbFBuMnA3IiwiYXVkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJpYXQiOjE1ODM3Mzk4
        OTMsImV4cCI6MTU4Mzc0MzQ5MywiY2lkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJ1aWQiOiIwMHU2YXRxNz
        FzMnlVQk5KcjJwNyIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJuaWtpdGFfcGF3YXIrZGV2MjJA
        YmlvLXJhZC5jb20iLCJVc2VyTGFzdE5hbWUiOiJQYXdhciIsIlVzZXJGaXJzdE5hbWUiOiJOaWtpdGEgIiwiVX
        NlckVtYWlsIjoibmlraXRhX3Bhd2FyK2RldjIyQGJpby1yYWQuY29tIiwiVXNlckRpc3BsYXlOYW1lIjoiTmlr
        aXRhICBQYXdhciJ9.ow3UfX0S9YMKvhkWeRVyDF5hG3JSkFIShnswfRnN9xKVasyglxr_Nfdvp5dh0ETI8OqDn
        SLB6qGofOpYza6L244R0Pw4DTbjMLwrX3fhMX1zNrLXn3O6c7p89HFG2EcrrfpuvNZe7hyVBlKxg9GJfCWlvML
        De68Zxa8aQUWTxdYZnuPokJbRLFuN-gs9WdDE0mfTouNnCK4rPen-xPjfnUZRAMFA4bOdIcuNdEyD0PB8FpraQ
        R2yLXF1EHLl7Pab77RgXC-PWHBpL4vem02CkTTInd2oWnpEfyneNB74hQtD9xVkBxf_JaSylYNHqBMnkW_jEco
        HvUElo9zA0BAD2w`,
        expiresAt: 1583743492,
        tokenType: 'Bearer',
        scopes: [
          'openid',
          'email'
        ],
        authorizeUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/authorize',
        userinfoUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/userinfo'
      },
      accountNumber: '100503',
      accountId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
      accountNumberArray: [
        '100503'
      ],
      labLocationId: '25dc4656-0670-47bd-be1c-0f12eaf3e20c',
      labLocationIds: [
        '25dc4656-0670-47bd-be1c-0f12eaf3e20c'
      ],
      permissions: {},
      userData: {},
      id: '9b576ae9-6352-4425-9b7d-399caa26c6f8'
    },
    directory: {
      name: 'vishavajit',
      location: null,
      displayName: '100503',
      accountNumber: '100503',
      formattedAccountNumber: 'U100503',
      sapNumber: '',
      orderNumber: '',
      accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
      accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
      accountLicenseType: 0,
      licensedProducts: [
        {
          product: 1,
          fileOption: 0
        }
      ],
      licenseNumberUsers: 20,
      accountContact: {
        entityType: 0,
        searchAttribute: 'nikita_pawar+dev22@bio-rad.com',
        firstName: 'Nikita',
        middleName: '',
        lastName: 'Pawar',
        name: 'Nikita Pawar',
        email: 'nikita_pawar+dev22@bio-rad.com',
        phone: '',
        id: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
        }
      },
      accountAddress: {
        entityType: 1,
        searchAttribute: '',
        nickName: '',
        streetAddress1: 'Pune',
        streetAddress2: '',
        streetAddress3: '',
        streetAddress: 'Pune',
        suite: '',
        city: '',
        state: '',
        country: 'IN',
        zipCode: '',
        id: '65114ca9-6bb6-4474-ba3d-12d142026907',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
        }
      },
      licenseAssignDate: '2020-02-12T08:36:41.324Z',
      licenseExpirationDate: '2020-07-12T18:30:00Z',
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
        id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
        parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
      parentNodeId: 'ROOT',
      parentNode: null,
      nodeType: 0,
      children: [
        {
          displayName: 'Nikitas Lab',
          labName: 'Nikitas Lab',
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
            id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
            parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          id: '9da2e249-18d5-4f94-a5a0-06f6bf81db69',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 1,
          children: [
            {
              displayName: 'Nikitas Lab',
              labLocationName: 'Nikitas Lab',
              locationTimeZone: 'America/Indiana/Indianapolis',
              locationOffset: '-05:00:00',
              locationDayLightSaving: '00:00:00',
              labLocationContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              labLocationAddressId: 'f29e65c1-83d6-476b-b492-f06880049c0b',
              labLocationContact: {
                entityType: 0,
                searchAttribute: 'nikita_pawar+dev22@bio-rad.com',
                firstName: 'Nikita',
                middleName: '',
                lastName: 'Pawar',
                name: 'Nikita Pawar',
                email: 'nikita_pawar+dev22@bio-rad.com',
                phone: '',
                id: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
                featureInfo: {
                  uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
                }
              },
              labLocationAddress: {
                entityType: 1,
                searchAttribute: '',
                nickName: '',
                streetAddress1: 'Pune',
                streetAddress2: '',
                streetAddress3: '',
                streetAddress: 'Pune',
                suite: '',
                city: '',
                state: '',
                country: 'IN',
                zipCode: '',
                id: 'f29e65c1-83d6-476b-b492-f06880049c0b',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              hasOwnAccountSettings: false,
              id: '25dc4656-0670-47bd-be1c-0f12eaf3e20c',
              parentNodeId: '9da2e249-18d5-4f94-a5a0-06f6bf81db69',
              parentNode: null,
              nodeType: 2,
              children: []
            }
          ]
        },
        {
          displayName: 'pratik thakare',
          contactId: '4bd3b6e0-2845-4a29-9bec-6dbf2af86bc9',
          userOktaId: '00u6att5uyrKTbE9U2p7',
          userRoles: [
            'User'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'pratik_thakare+User@bio-rad.com',
            firstName: 'pratik',
            middleName: '',
            lastName: 'thakare',
            name: 'pratik thakare',
            email: 'pratik_thakare+User@bio-rad.com',
            phone: '',
            id: '4bd3b6e0-2845-4a29-9bec-6dbf2af86bc9',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: '2020-02-12T08:54:55.968Z',
            id: 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'nilam pawar',
          contactId: 'f2f57f89-5a0d-45cf-98bd-09adb2f28ef4',
          userOktaId: '00u6ciixxaeWo1TTh2p7',
          userRoles: [
            'User'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'nikita_pawar+dev_user21@persistent.com',
            firstName: 'nilam',
            middleName: '',
            lastName: 'pawar',
            name: 'nilam pawar',
            email: 'nikita_pawar+dev_user21@persistent.com',
            phone: '',
            id: 'f2f57f89-5a0d-45cf-98bd-09adb2f28ef4',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: 'd12378dc-6090-4af2-9676-bae37dd3c64a',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: null,
            id: 'd12378dc-6090-4af2-9676-bae37dd3c64a',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: 'd12378dc-6090-4af2-9676-bae37dd3c64a',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'Neha Pagar',
          contactId: 'ad13388d-3bac-4167-a53a-5439df492c62',
          userOktaId: '00u6cikekrE3XqcBT2p7',
          userRoles: [
            'User'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'nikita_pawar+dev_22_user@bio-rad.com',
            firstName: 'Neha',
            middleName: '',
            lastName: 'Pagar',
            name: 'Neha Pagar',
            email: 'nikita_pawar+dev_22_user@bio-rad.com',
            phone: '',
            id: 'ad13388d-3bac-4167-a53a-5439df492c62',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: '2020-02-17T13:20:49.664Z',
            id: '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'mahesh janugade',
          contactId: 'e698c9cc-eca4-464a-a54b-2e2524887e73',
          userOktaId: '00u6cih3xuerXD5g02p7',
          userRoles: [
            'User'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'mahesh_janugade+dev_user1@bio-rad.com',
            firstName: 'mahesh',
            middleName: '',
            lastName: 'janugade',
            name: 'mahesh janugade',
            email: 'mahesh_janugade+dev_user1@bio-rad.com',
            phone: '',
            id: 'e698c9cc-eca4-464a-a54b-2e2524887e73',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: '8ec9544f-059c-4351-87a5-4a04c2f33c28',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: null,
            id: '8ec9544f-059c-4351-87a5-4a04c2f33c28',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: '8ec9544f-059c-4351-87a5-4a04c2f33c28',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'Nikita Pawar',
          contactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
          userOktaId: '00u6atq71s2yUBNJr2p7',
          userRoles: [
            'Admin'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'nikita_pawar+dev22@bio-rad.com',
            firstName: 'Nikita',
            middleName: '',
            lastName: 'Pawar',
            name: 'Nikita Pawar',
            email: 'nikita_pawar+dev22@bio-rad.com',
            phone: '',
            id: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: '9b576ae9-6352-4425-9b7d-399caa26c6f8',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: '2020-02-12T08:43:41.866Z',
            id: '9b576ae9-6352-4425-9b7d-399caa26c6f8',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: '9b576ae9-6352-4425-9b7d-399caa26c6f8',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        }
      ]
    }
  };

  const departments: Array<Department> = [{
    children: [],
    departmentManagerGroup:{},
    departmentManager: {
      firstName: '',
      middleName: '',
      lastName: '',
      name: '',
      email: '',
      phone: '',
      id: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
      entityType: 8
    },
    levelSettings: {
      levelEntityId: null,
      levelEntityName: null,
      parentLevelEntityId: null,
      parentLevelEntityName: null,
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 0,
      targets: [{
        controlLotId: '261',
        controlLevel: '1',
        mean: 0,
        sd: 0,
        points: 0
      }],
      rules: [{
        id: '2',
        category: '1k',
        k: '3',
        disposition: 'N'
      }],
      levels: [{
        levelInUse: true,
        decimalPlace: 3
      }]
    },
    departmentManagerId: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
    departmentName: 'vishwajit Department1',
    displayName: 'vishwajit Department1',
    id: 'E0EB71CDDBCE4E849EF11140A063F732',
    nodeType: 3,
    parentNodeId: '4B84D29BDD4F40FDB2BA0B4CEE10EBCF'
  }];

  const StateArray = {
    security: securityData,
    navigation: navigationState,
    labConfigDepartment: {
      labDepartments: departments,
      error: Error,
      deleteDepartment: false
    }
  };

  const accountSettings = {
    'displayName': '',
    'dataType': 1,
    'instrumentsGroupedByDept': true,
    'trackReagentCalibrator': false,
    'fixedMean': false,
    'decimalPlaces': 2,
    'siUnits': false,
    'labSetupRating': 0,
    'labSetupComments': '',
    'isLabSetupComplete': true,
    'labSetupLastEntityId': 'null',
    'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
    'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
    'parentNode': null,
    'nodeType': 9,
    'children': null
  };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.DepartmentDelete, Permissions.DepartmentAdd, Permissions.DepartmentEdit];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DepartmentConfigComponent,
        DepartmentEntryComponent,
        LabSetupHeaderComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatCheckboxModule,
        BrSelect,
        MatIconModule,
        MatCardModule,
        MatSlideToggleModule,
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot(fromRoot.reducers),
        MatDialogModule,
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
        LabSetupDefaultsService,
        AppLoggerService,
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: ApiService, useValue: mockApiService },
        { provide: Store, useValue: StateArray },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: SpcRulesService, useValue: mockSpcRuleService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        provideMockStore(mockState),
        TranslateService,
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
    substore = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(StateArray);
    substore.setState(StateArray);
    fixture = TestBed.createComponent(DepartmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(mockPortalApiService, 'getUsers').and.returnValue(of(null));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Department entry form is displayed', () => {
    expect(fixture.debugElement.nativeElement.querySelector('unext-department-entry-component')).not.toBe(null);
  });

  it('Should Delete department called with id', () => {
    SpyonStore = spyOn(store, 'dispatch');
    const deptId = departments[0];
    component.onDeleteDepartment(deptId);
    expect(SpyonStore).toHaveBeenCalledTimes(1);
    expect(SpyonStore).toHaveBeenCalledWith(
      actions.LabConfigDepartmentActions.deleteDepartment({ department: deptId })
    );
  });

  it('Should save Department Lab Configuration', () => {
    SpyonStore = spyOn(store, 'dispatch');
    const typeOfOperation = true;
    const labDepartments: LabDepartmentValues = { labConfigFormValues: departments, archivedSettings: archivedSettings,typeOfOperation};
    component.saveLabConfigurationDepartment(labDepartments);
    expect(SpyonStore).toHaveBeenCalledTimes(1);
    expect(SpyonStore).toHaveBeenCalledWith(
      actions.LabConfigDepartmentActions.saveDepartments({ labDepartments})
    );
  });
});
