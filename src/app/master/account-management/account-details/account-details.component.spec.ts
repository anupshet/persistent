// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {HttpClientTestingModule } from "@angular/common/http/testing";
import { cloneDeep } from 'lodash';

import { AccountDetailsComponent } from './account-details.component';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { Account } from '../../../contracts/models/account-management/account';
import { AccountManagementApiService } from '../account-management-api.service';
import { OrchestratorApiService } from '../../../shared/api/orchestratorApi.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';
import { LabLocation } from '../../../contracts/models/lab-setup';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { MigrationStates } from '../../../contracts/enums/migration-state.enum';
import * as accountData from '../../../../../db.json';
import { Lab } from '../../../contracts/models/lab-setup/lab.model';
import { BioRadUserRoles } from '../../../contracts/enums/user-role.enum';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { ErrorsInterceptor } from '../../../contracts/enums/http-errors.enum';
import { Permissions } from '../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../app.module';
import { LocationUtilitiesService } from '../../../shared/services/location-utilities.service';
import { FeatureFlagsService } from '../../../shared/services/feature-flags.service';
import { UnityNextTier } from '../../../contracts/enums/lab-location.enum';

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;

  let sampleAccount;
  let sampleAccountWithGroups = accountData.accounts[2];
  let sampleGroups: Array<Lab>;

  const formBuilder: FormBuilder = new FormBuilder();
  const assignDate = new Date('2022-04-28T00:00:00.000Z');
  const expiryDate = new Date('2022-06-28T00:00:00.000Z');
  const mockNewLocation = {
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
    'contactRoles': [BioRadUserRoles.BioRadManager],
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
    'unityNextTier': -1,
    'unityNextInstalledProduct': null,
    'connectivityTier': 0,
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
    'licenseAssignDate': new Date(assignDate),
    'licenseExpirationDate': new Date(expiryDate),
    'hasChildren': true,
    'locationCount': 3,
    'accountName': 'Amazing Lab Center',
    'accountNumber': 'U100503',
    'groupName': 'Another Group',
    'formattedAccountNumber': 'U100503',
    'transformers': null,
    'migrationStatus': MigrationStates.Completed,
    'previousContactUserId': null,
   'labLanguagePreference': 'en-US'
  };

  const mockNewLocation2 = {
    'id': '9I1GN0B9RGP78WFCO195CIO372TXX48A',
    'parentNodeId': 'group2',
    'parentNode': null,
    'nodeType': 2,
    'displayName': 'Amazing Lab Center',
    'children': null,
    'labLocationName': 'test after',
    'locationTimeZone': 'America/Los_Angeles',
    'locationOffset': '0',
    'locationDayLightSaving': 'false',
    'labLocationContactId': '',
    'labLocationAddressId': '',
    'labLocationContact': {
      'entityType': 0,
      'searchAttribute': 'email',
      'firstName': 'rock',
      'middleName': null,
      'lastName': 'doe',
      'name': 'rockdoe',
      'email': 'rock@gms.com',
      'phone': '000-000-0000',
      'id': ''
    },
    'contactRoles': [BioRadUserRoles.BioRadManager],
    'labLocationAddress': {
      'entityType': 0,
      'searchAttribute': 'streetaddress2',
      'nickName': '123 Main St.',
      'streetAddress1': 'demoi',
      'streetAddress2': 'Ste. ABC',
      'streetAddress3': '#1',
      'streetAddress': 'demoi',
      'suite': 'ABC',
      'city': 'ee',
      'state': 'eee',
      'country': 'AX',
      'zipCode': '234234',
      'id': ''
    },
    'shipTo': '1234',
    'soldTo': '123456',
    'orderNumber': 'U100503',
    'unityNextTier': -1,
    'unityNextInstalledProduct': null,
    'connectivityTier': 0,
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
    'licenseAssignDate': new Date(assignDate),
    'licenseExpirationDate': new Date(expiryDate),
    'hasChildren': true,
    'locationCount': 3,
    'accountName': 'Amazing Lab Center',
    'accountNumber': 'U100503',
    'groupName': 'Another Group',
    'formattedAccountNumber': 'U100503',
    'transformers': null,
    'migrationStatus': MigrationStates.Completed,
    'previousContactUserId': null,
    // 'labLanguagePreference': 'en-us'
  };
  const mockNewLocation3 = {
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
    'contactRoles': [BioRadUserRoles.BioRadManager],
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
    'unityNextTier': 0,
    'unityNextInstalledProduct': null,
    'connectivityTier': 1,
    'connectivityInstalledProduct': null,
    'lotViewerLicense': 1,
    'lotViewerInstalledProduct': null,
    'addOns': 1,
    'addOnsFlags': {
      'valueAssignment': false,
      'allowBR': false,
      'allowNonBR': false,
      'allowSiemensHematology': false,
      'allowSysmexHemostasis': false
    },
    // 'crossOverStudy': 1,
    'licenseNumberUsers': 12223,
    'licenseAssignDate': new Date(assignDate),
    'licenseExpirationDate': new Date(expiryDate),
    'hasChildren': true,
    'locationCount': 3,
    'accountName': 'Amazing Lab Center',
    'accountNumber': 'U100503',
    'groupName': 'Another Group',
    'formattedAccountNumber': 'U100503',
    'transformers': null,
    'migrationStatus': MigrationStates.Completed,
    'previousContactUserId': null,
    // 'labLanguagePreference': 'en-us'
  };

  const mockGroupForm = formBuilder.group({
    groupName: ['', [Validators.required, Validators.maxLength(50)]]
  });

  const groupFormValue = {
    'groupName': 'Add-Group-Test'
  };

  const groupFormUpdateValue = {
    'groupName': 'Group-Update-Test'
  };

  const mockAccount = {
    'id': 'account1',
    'parentNodeId': null,
    'parentNode': null,
    'nodeType': 0,
    'displayName': 'Amazing Lab Center',
    'accountName': 'Amazing Lab Center',
    'children': null,
    'accountNumber': '100503',
    'formattedAccountNumber': 'U100503',
    'accountAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
    'accountContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
    'accountContact': {
      'entityType': 0,
      'searchAttribute': 'email',
      'firstName': 'Sample',
      'middleName': '',
      'lastName': 'User',
      'name': 'Sample User',
      'email': 'sample_user1@bio-rad.com',
      'phone': '000-000-0000',
      'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a'
    },
    'contactRoles': [BioRadUserRoles.BioRadManager],
    'accountAddress': {
      'entityType': 0,
      'streetAddress1': '123 Main St.',
      'streetAddress2': 'Ste. ABC',
      'streetAddress3': '#1',
      'streetAddress': '123 Main St. Ste. ABC #1',
      'city': 'Irvine',
      'state': 'CA',
      'country': 'AX',
      'zipCode': '92618',
      'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b'
    },
    'licenseAssignDate': new Date('2020-02-07T18:23:17.585Z'),
    'licenseExpirationDate': new Date('2026-02-13T08:00:00Z'),
    'hasChildren': true,
    'locationCount': 2,
    'previousContactUserId': null,
    'permissions': [
      Permissions.AccountListView,
      Permissions.LocationListView,
      Permissions.ViewAccount,
      Permissions.ViewLocation,
      Permissions.LaunchLocation,
      Permissions.AccountAdd,
      Permissions.AccountEdit,
      Permissions.AccountDelete,
      Permissions.GroupAdd,
      Permissions.GroupEdit,
      Permissions.GroupDelete,
      Permissions.LocationAdd,
      Permissions.LocationEdit,
      Permissions.LocationDelete
    ],
    // 'languagePreference': 'en-us'
  };

  const mockGroup = {
    id: 'group1',
    displayName: 'Test Group',
    nodeType: 1,
    parentNodeId: 'account1'
  };

  const searchLocation = {
    'locations': [
      {
        'accountName': 'QA Lab 7.21.20',
        'accountNumber': '200270',
        'formattedAccountNumber': 'U200270',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': false,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'connectivityInstalledProduct': '',
        'connectivityTier': 0,
        'crossOverStudy': 0,
        'displayName': '17th Medical Group Air Force Base',
        'groupName': ' QA Lab 7.21.20',
        'hasChildren': false,
        'id': '4e3f70e9-a6f2-4bf9-9843-75ec4d070f3b',
        'labLocationAddress': {
          'entityType': 1,
          'searchAttribute': '',
          'nickName': '',
          'streetAddress1': 'addres11',
          'streetAddress2': '',
          'streetAddress3': '',
          'streetAddress': 'addres11',
          'suite': '',
          'city': 'Pune',
          'state': 'CA',
          'country': 'IN',
          'zipCode': '411009',
          'id': '81294391-08d6-4d8e-898d-c7a5f0929043'
        },
        'labLocationAddressId': '81294391-08d6-4d8e-898d-c7a5f0929043',
        'labLocationContact': {
          'entityType': 0,
          'searchAttribute': 'monika_ghube+connectivityloc5qa@bio-rad.com',
          'firstName': 'Monika',
          'middleName': '',
          'lastName': 'Ghube',
          'name': 'Monika Ghube',
          'email': 'monika_ghube+connectivityLoc5qa@bio-rad.com',
          'phone': '',
          'id': '49c3affe-ec36-46dd-ac36-95bf360a2f2a'
        },
        'labLocationContactId': '49c3affe-ec36-46dd-ac36-95bf360a2f2a',
        'labLocationName': '17th Medical Group Air Force Base',
        'licenseAssignDate': '2022-08-30T00:00:00Z',
        'licenseExpirationDate': '2022-08-31T00:00:00Z',
        'licenseNumberUsers': 0,
        'locationCount': 2,
        'locationDayLightSaving': '00:00:00',
        'locationOffset': '05:30:00',
        'locationTimeZone': 'Asia/Kolkata',
        'lotViewerInstalledProduct': '',
        'lotViewerLicense': 0,
        'nodeType': 2,
        'orderNumber': '14244',
        'migrationStatus': '',
        'parentNodeId': '4c4a7320-d9fd-432a-b498-6119e94a5515',
        'parentNode': {
          'displayName': 'QA Lab 7.21.20',
          'labName': ' QA Lab 7.21.20',
          'name': '',
          'parentNodeId': 'a3f930ae-70d5-4d9e-8d39-4e8313f43307',
          'nodeType': 1,
          'id': '4c4a7320-d9fd-432a-b498-6119e94a5515',
          'isUnavailable': false,
          'unavailableReasonCode': ''
        },
        'primaryUnityLabNumbers': '',
        'previousContactUserId': '',
        'shipTo': '14648056',
        'soldTo': '478899',
        'unityNextInstalledProduct': '',
        'unityNextTier': 0,
        'comments': '',
        'contactRoles': [
          'Admin'
        ],
        'usedArchive': false,
        'islabsettingcompleted': false,
        'children': null,
        'locationSettings': {
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
          'id': '635b3412-679a-4201-97f4-c6df45bcfab6',
          'parentNodeId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
          'parentNode': null,
          'nodeType': 9,
          'children': null,
        },
        // 'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'QA Lab 7.21.20',
        'accountNumber': '200270',
        'formattedAccountNumber': 'U200270',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': false,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'connectivityInstalledProduct': '',
        'connectivityTier': 2,
        'crossOverStudy': 0,
        'displayName': 'QA Lab 7.21.20',
        'groupName': ' QA Lab 7.21.201',
        'hasChildren': true,
        'id': '2260edb2-3445-46dd-8a3f-34c84a23f304',
        'labLocationAddress': {
          'entityType': 1,
          'searchAttribute': '',
          'nickName': '',
          'streetAddress1': '21 Technology Dr',
          'streetAddress2': '',
          'streetAddress3': '',
          'streetAddress': '21 Technology Dr',
          'suite': '',
          'city': 'Irvine',
          'state': 'CA',
          'country': 'US',
          'zipCode': '92618',
          'id': 'c1f3f8d1-6431-43c5-af3d-1d3122648fae'
        },
        'labLocationAddressId': 'c1f3f8d1-6431-43c5-af3d-1d3122648fae',
        'labLocationContact': {
          'entityType': 0,
          'searchAttribute': 'adrian_mcsorely+qa721@bio-rad.com',
          'firstName': 'Adrian',
          'middleName': '',
          'lastName': 'McSorely',
          'name': 'Adrian McSorely',
          'email': 'adrian_mcsorely+qa721@bio-rad.com',
          'phone': '',
          'id': '6debe74d-1d2a-4735-8a35-2287ac3c44ae'
        },
        'labLocationContactId': '6debe74d-1d2a-4735-8a35-2287ac3c44ae',
        'labLocationName': 'QA Lab 7.2.20',
        'licenseAssignDate': '2020-07-21T00:00:00Z',
        'licenseExpirationDate': '2023-12-26T00:00:00Z',
        'licenseNumberUsers': 4,
        'locationCount': 2,
        'locationDayLightSaving': '01:00:00',
        'locationOffset': '-08:00:00',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '',
        'lotViewerLicense': 0,
        'nodeType': 2,
        'orderNumber': '',
        'migrationStatus': '',
        'parentNodeId': '4c4a7320-d9fd-432a-b498-6119e94a5515',
        'parentNode': {
          'displayName': 'QA Lab 7.21.10',
          'labName': 'QA Lab 7.21.10',
          'name': '',
          'parentNodeId': 'a3f930ae-70d5-4d9e-8d39-4e8313f43307',
          'nodeType': 1,
          'id': '4c4a7320-d9fd-432a-b498-6119e94a5515',
          'isUnavailable': false,
          'unavailableReasonCode': ''
        },
        'primaryUnityLabNumbers': '',
        'previousContactUserId': '',
        'shipTo': 'AM_July21_1',
        'soldTo': 'AM_July21_11',
        'unityNextInstalledProduct': '',
        'unityNextTier': 0,
        'comments': '',
        'contactRoles': [
          'Admin'
        ],
        'usedArchive': false,
        'islabsettingcompleted': true,
        'children': null,
        'locationSettings': {
          'displayName': '',
          'dataType': 1,
          'instrumentsGroupedByDept': true,
          'trackReagentCalibrator': false,
          'fixedMean': false,
          'decimalPlaces': 2,
          'siUnits': false,
          'labSetupRating': 0,
          'labSetupComments': '',
          'isLabSetupComplete': false,
          'labSetupLastEntityId': 'null',
          'id': '635b3412-679a-4201-97f4-c6df45bcfab6',
          'parentNodeId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
          'parentNode': null,
          'nodeType': 9,
          'children': null,
        },
        // 'labLanguagePreference': 'en-us'
      }
    ],
    'pageIndex': 1,
    'totalPages': 1,
    'pageSize': 20,
    'totalItems': 2
  };

  const transformersArray = [
    {
      'id': 1273,
      'displayName': 'universal flex file transformers 6.1',
      'isAssigned': true
    },
    {
      'id': 2831,
      'displayName': 'universal flex file transformers 4.1',
      'isAssigned': false
    },
    {
      'id': 3212,
      'displayName': 'universal flex file transformers 2.8',
      'isAssigned': true
    }
  ];

  let locationsPageList = accountData.locations.slice(0, 20);

  let locationPage = {
    locations: locationsPageList,
    pageIndex: 1,
    totalPages: 65,
    pageSize: 20,
    totalItems: 1289
  };

  const locationResponse = {
    country: "México",
    countryCode: "MX",
    countryCodeISO3: "MEX",
    countrySubdivision: "Aguascalientes",
    freeformAddress: "xyz, abc, 15555, Aguascalientes, Aguascalientes",
    localName: "Aguascalientes",
    municipality: "Aguascalientes",
    municipalitySubdivision: "abc",
    postalCode: "20210",
    streetName: "xyz",
    streetNumber: "120",
  };

  const ApiServiceStub = {
    getAccounts: (pageIndex: number = 0) => {
      return of([accountData.accounts]);
    },
    getGroups: () => {
      return of(sampleAccountWithGroups);
    },
    addLocation: (): Observable<LabLocation> => {
      return of(mockNewLocation);
    },
    updateLocation: (): Observable<LabLocation> => {
      return of(mockNewLocation);
    },
    addGroup: () => {
      return of();
    },
    updateGroup: () => {
      return of(groupFormUpdateValue);
    },
    deleteGroup: () => {
      return of(sampleGroups);
    },
    searchLocations: () => {
      return of(locationPage);
    },
    deleteUser: (): Observable<any> => {
      return of({});
    },
  };

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockOrchestratorApiService = {
    getConnectivityTransformers: (accountId: string) => null
  };

  const changeState = {
    hasChanges: false,
    okCustomAction: null,
    customPromptAction: null,
    cancelCustomAction: null,
    currentDialogRef: null
  };

  const mockChangeTrackerService = {
    getDialogRef(customCallback: Function) {
      changeState.currentDialogRef = customCallback;
    },
    resetDirty: () => { }
  };

  const mockUserManagementService = {
    response: 'test',
    queryUserByEmail: (email: string) => {
      return of(mockUserManagementService.response);
    }
  };

  const mockDataTimeHelperDate = {
    convertDateToUTCWithoutTime: () => {
      return Date;
    },
  };

  const dialogRefStub = {
    close: () => { },
    afterClosed: () => of(false)
  };

  const dialogStub = {
    open: () => dialogRefStub,
    close: () => { }
  };

  const mockBrPermissionsService = {
    hasAccess: () => { },
  };

  const TRANSLATIONS_EN = require('../../../../assets/i18n/en.json');

  const mockLocationService = {
    validateAddress: (addressParams) => {
      return of({
        hasError: false,
        hasCorrection: false,
        message: '',
        result: locationResponse
      })
    },
    addressCleanUp: (dirtyAddress)=> {
      return { state: '', city: '', zipCode: '', address: '' }
    }
  };

  const mockFeatureFlagsService = {
    hasClientInitialized: () => true,
    getFeatureFlag: () => true,
    getClient: () => { return { on: () => {} }; }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        MatDialogModule,
        NgxPaginationModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        AccountDetailsComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: dialogStub },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: MessageSnackBarService },
        { provide: MatSnackBar },
        { provide: AccountManagementApiService, useValue: ApiServiceStub },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: OrchestratorApiService, useValue: mockOrchestratorApiService },
        { provide: ChangeTrackerService, useValue: mockChangeTrackerService },
        { provide: UserManagementService, useValue: mockUserManagementService },
        { provide: DateTimeHelper, useValue: mockDataTimeHelperDate },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService,
        { provide: LocationUtilitiesService, useValue: mockLocationService },
        { provide: FeatureFlagsService, useValue: mockFeatureFlagsService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;
    sampleAccount = accountData.accounts;
    sampleAccountWithGroups = accountData.accounts[2];
    sampleGroups = sampleAccountWithGroups.children;
    locationsPageList = accountData.locations.slice(0, 20);
    locationPage = {
      locations: locationsPageList,
      pageIndex: 1,
      totalPages: 65,
      pageSize: 20,
      totalItems: 1289
    };
    mockNewLocation.previousContactUserId = null;
    dialogRefStub.afterClosed = () => of(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display account name and number', () => {
    component.account = {
      id: sampleAccount[0].id,
      displayName: sampleAccount[0].displayName,
      accountNumber: sampleAccount[0].accountNumber,
      formattedAccountNumber: sampleAccount[0].formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const accountNameElement = fixture.debugElement.query(By.css('#spec_account_name')).nativeElement;
    const accountNumberElement = fixture.debugElement.query(By.css('#spec_account_number')).nativeElement;

    expect(accountNameElement).toBeDefined();
    expect(accountNameElement.textContent).toEqual(sampleAccount[0].displayName);
    expect(accountNumberElement).toBeDefined();
    expect(accountNumberElement.textContent).toEqual(sampleAccount[0].formattedAccountNumber);
  });

  it('should display multiple group names', () => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const groupNameElements = fixture.debugElement.queryAll(By.css('.group-list-child'));

    expect(groupNameElements).toBeDefined();
    expect(groupNameElements).toHaveSize(sampleAccountWithGroups.children.length);
  });

  it('should display one group for a single group account', () => {
    sampleAccount = accountData.accounts[0];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const accountNameElement = fixture.debugElement.query(By.css('#spec_account_name')).nativeElement;
    const accountNumberElement = fixture.debugElement.query(By.css('#spec_account_number')).nativeElement;

    expect(accountNameElement).toBeDefined();
    expect(accountNameElement.textContent).toEqual(sampleAccount.displayName);
    expect(accountNumberElement).toBeDefined();
    expect(accountNumberElement.textContent).toEqual(sampleAccount.formattedAccountNumber);

    const groupNameElements = fixture.debugElement.queryAll(By.css('.group-list-child'));

    expect(groupNameElements).toBeDefined();
    expect(groupNameElements).toHaveSize(1);
    expect(groupNameElements[0].nativeElement.textContent.trim()).toEqual(sampleAccountWithGroups.children[0].displayName);
  });

  it('should display no groups for account with no groups', () => {
    sampleAccount = accountData.accounts[18];
    sampleGroups = [];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const accountNameElement = fixture.debugElement.query(By.css('#spec_account_name')).nativeElement;
    const accountNumberElement = fixture.debugElement.query(By.css('#spec_account_number')).nativeElement;

    expect(accountNameElement).toBeDefined();
    expect(accountNameElement.textContent).toEqual(sampleAccount.displayName);
    expect(accountNumberElement).toBeDefined();
    expect(accountNumberElement.textContent).toEqual(sampleAccount.formattedAccountNumber);

    const groupNameElements = fixture.debugElement.queryAll(By.css('.spec_group_name'));
    expect(groupNameElements).toBeDefined();
    expect(groupNameElements).toHaveSize(0);

    const groupNoneFoundMessage = fixture.debugElement.queryAll(By.css('.spec_groups_none_found'));
    expect(groupNoneFoundMessage).toBeDefined();
    expect(groupNoneFoundMessage).toHaveSize(1);
    expect(groupNoneFoundMessage[0].nativeElement.textContent.length).toBeGreaterThan(0);
  });

  it('should display loading groups message', () => {
    component.account = {
      id: sampleAccount[0].id,
      displayName: sampleAccount[0].displayName,
      accountNumber: sampleAccount[0].accountNumber,
      formattedAccountNumber: sampleAccount[0].formattedAccountNumber
    } as Account;
    // Set groups to original state
    sampleGroups = null;
    sampleAccountWithGroups = null;
    component.groups = sampleGroups;
    component.ngOnInit();
    fixture.detectChanges();

    const accountNameElement = fixture.debugElement.query(By.css('#spec_account_name')).nativeElement;
    const accountNumberElement = fixture.debugElement.query(By.css('#spec_account_number')).nativeElement;

    expect(accountNameElement).toBeDefined();
    expect(accountNameElement.textContent).toEqual(sampleAccount[0].displayName);
    expect(accountNumberElement).toBeDefined();
    expect(accountNumberElement.textContent).toEqual(sampleAccount[0].formattedAccountNumber);

    let groupNameElements = fixture.debugElement.queryAll(By.css('.spec_group_name'));

    expect(groupNameElements).toBeDefined();
    expect(groupNameElements).toHaveSize(0);

    const groupNoneFoundMessage = fixture.debugElement.queryAll(By.css('.spec_groups_loading'));
    expect(groupNoneFoundMessage).toBeDefined();
    expect(groupNoneFoundMessage).toHaveSize(1);
    expect(groupNoneFoundMessage[0].nativeElement.textContent.length).toBeGreaterThan(0);

    sampleAccountWithGroups = sampleAccount[0];
    component.ngOnInit();
    fixture.detectChanges();

    groupNameElements = fixture.debugElement.queryAll(By.css('.group-list-child'));

    expect(groupNameElements).toBeDefined();
    expect(groupNameElements).toHaveSize(1);
  });

  it('should display group dropdown', () => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;
    component.ngOnInit();
    fixture.detectChanges();
    const groupDropdown = fixture.debugElement.query(By.css('.group-dropdown')).nativeElement;
    expect(groupDropdown).toBeDefined();
  });

  it('should display group drop-down when there are more than one groups', fakeAsync(() => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();
    const groupDropdown = fixture.debugElement.query(By.css('.group-dropdown')).nativeElement;
    expect(groupDropdown).toBeDefined();
    groupDropdown.click();
    fixture.detectChanges();

    const matOption = fixture.debugElement.queryAll(By.css('.group-select'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(matOption.length).toEqual(1);
    });
  }));

 it('should not display group drop-down for 0 or 1 groups', () => {
    // No groups
    sampleAccount = accountData.accounts[18];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.group-dropdown'))).toBeNull();

    // One group
    sampleAccount = accountData.accounts[0];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.group-dropdown'))).toBeNull();
  });

  it('should automatically select first group and display locations', () => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const locationItems = fixture.debugElement.queryAll(By.css('.location-parent-single-item'));
    expect(locationItems.length).toEqual(locationsPageList.length);
  });

  it('should display locations on selecting groups', fakeAsync(() => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const groupDropdown = fixture.debugElement.query(By.css('.group-dropdown')).nativeElement;
    expect(groupDropdown).toBeDefined();
    groupDropdown.click();
    fixture.detectChanges();

    const matOption = fixture.debugElement.queryAll(By.css('.group-select'));
    matOption[0].nativeElement.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const locationItems = fixture.debugElement.queryAll(By.css('.location-parent-single-item'));
      expect(locationItems.length).toEqual(locationsPageList.length);
    });
  }));

  it('should display no locations found', () => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    locationPage.locations = [];
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;
    component.ngOnInit();
    fixture.detectChanges();

    const groupDropdown = fixture.debugElement.query(By.css('.group-dropdown')).nativeElement;
    expect(groupDropdown).toBeDefined();
    groupDropdown.click();
    fixture.detectChanges();

    component.ngOnInit();
    fixture.detectChanges();

    const locationNoneFoundMessage = fixture.debugElement.query(By.css('.spec_locations_none_found'));
    expect(locationNoneFoundMessage).toBeDefined();
    expect(TRANSLATIONS_EN.ACCOUNTDETAILS.NOLOCATIONS).toEqual('No locations found');
  });

  it('should hide the pagination controls when locations are not present or when only one location page is present', () => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const groupDropdown = fixture.debugElement.query(By.css('.group-dropdown')).nativeElement;
    expect(groupDropdown).toBeDefined();
    groupDropdown.click();
    fixture.detectChanges();

    const matOption = fixture.debugElement.queryAll(By.css('.group-select'));
    matOption[0].nativeElement.click();
    fixture.detectChanges();

    let paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).not.toBeNull();

    locationPage.totalPages = 1;
    component.ngOnInit();
    fixture.detectChanges();

    paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();
  });

  it('should show the pagination controls when two or more location pages are present', () => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const groupDropdown = fixture.debugElement.query(By.css('.group-dropdown')).nativeElement;
    expect(groupDropdown).toBeDefined();
    groupDropdown.click();
    fixture.detectChanges();

    const matOption = fixture.debugElement.queryAll(By.css('.group-select'));
    matOption[0].nativeElement.click();
    fixture.detectChanges();

    const paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    expect(paginationButtons.length).toEqual(5);

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    expect(nextButton).toBeDefined();
    expect(nextButton.disabled).toBeFalsy();

    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    expect(prevButton).toBeDefined();
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should create correct number of pages for pagination', () => {
    sampleAccount = accountData.accounts[1];
    sampleAccountWithGroups = sampleAccount;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const groupDropdown = fixture.debugElement.query(By.css('.group-dropdown')).nativeElement;
    expect(groupDropdown).toBeDefined();
    groupDropdown.click();
    fixture.detectChanges();

    const matOption = fixture.debugElement.queryAll(By.css('.group-select'));
    matOption[0].nativeElement.click();
    fixture.detectChanges();

    component.paginationConfig.currentPage = locationPage.pageIndex + 1;
    component.paginationConfig.itemsPerPage = locationPage.pageSize;
    component.paginationConfig.totalItems = locationPage.totalItems;
    fixture.detectChanges();

    const paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    expect(paginationButtons.length).toEqual(component.maxSize);
  });

  it('Test a form group element count', () => {
    component.loadLocationForm = true;
    component.initializeLocationForm(null);
    fixture.detectChanges();
    const formElement = fixture.debugElement.nativeElement.querySelectorAll('input');
    expect(formElement.length).toEqual(16);
  });

  it('should load transformers list and display dropdown for connectivity transformers', () => {
    component.loadLocationForm = true;
    component.initializeLocationForm(null);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector('.spec_transformers');
    expect(compiled).toBeTruthy();
  });

  it('should display dropdown for addOns', () => {
    component.loadLocationForm = true;
    component.initializeLocationForm(null);
    fixture.detectChanges();
    const compiled = fixture.debugElement.query(By.css('.spec-addOns'));
    expect(compiled).toBeDefined();
  });

  it('check initial form values', () => {
    component.loadLocationForm = true;
    component.initializeLocationForm(null);
    fixture.detectChanges();
    const locationFormValues = {
      orderNumber: '',
      unityNextTier: '',
      unityNextInstalledProduct: '',
      connectivityTier: '',
      connectivityInstalledProduct: '',
      lotViewerLicense: '',
      lotViewerInstalledProduct: '',
      addOns: '',
      addOnsFlags: '',
      // crossOverStudy: '',
      licenseExpirationDate: '',
      licenseLength: '',
      licenseNumberUsers: '',
      shipTo: '',
      soldTo: '',
      labLocationName: '',
      labLocationAddress: '',
      labLocationAddressSecondary: '',
      labLocationCountryId: '',
      labLocationState: '',
      labLocationCity: '',
      locationZipCode: '',
      labContactEmail: '',
      labContactFirst: '',
      labContactLast: '',
      licenseAssignDate: new Date(Date.now()),
    };
    expect((component.locationForm.value).toString()).toEqual(locationFormValues.toString());
  });

  it('should set license expiration date when start date is not null', () => {
    component.loadLocationForm = true;
    const licenseStart = new Date();
    const monthsToAdd = 1;
    component.initializeLocationForm(null);
    fixture.detectChanges();
    component.locationForm.controls.licenseLength.setValue(monthsToAdd);
    component.calculateLicenseExpireDate();
    fixture.detectChanges();
    expect(component.locationForm.value.licenseAssignDate).not.toBeNull();
    const licenseEnd = new Date(licenseStart);
    licenseEnd.setMonth(licenseEnd.getMonth() + monthsToAdd);
    // added set seconds to 0 to remove intermittant nuisance errror when seconds are off
    expect((component.locationForm.value.licenseExpirationDate.setSeconds(0, 0)).toString()).
    toEqual((licenseEnd.setSeconds(0, 0)).toString());
  });

  it('should not set license expiration date when start date is fnull', () => {
    component.loadLocationForm = true;
    component.initializeLocationForm(null);
    fixture.detectChanges();
    component.locationForm.controls.licenseAssignDate.setValue(null);
    const monthsToAdd = 1;
    component.locationForm.controls.licenseLength.setValue(monthsToAdd);
    component.calculateLicenseExpireDate();
    fixture.detectChanges();
    expect(component.locationForm.value.licenseAssignDate).toEqual(null);
    expect(component.locationForm.value.licenseExpirationDate).toEqual('');
  });

  it('should create location', () => {
    component.account = mockAccount;
    component.ngOnInit();
    fixture.detectChanges();
    component.loadLocationForm = true;
    expect(component.displayName).toEqual(mockAccount.displayName);
    expect(component.formattedAccountNumber).toEqual(mockAccount.formattedAccountNumber);
    expect(component.isLoadedFromAccount).toEqual(true);
    expect(component.editLocationMode).toEqual(false);
    component.initializeLocationForm(null);
    fixture.detectChanges();
    const locationFormValues = {
      orderNumber: '12345',
      unityNextTier: '1',
      unityNextInstalledProduct: '',
      connectivityTier: '1',
      addOns: '',
      connectivityInstalledProduct: '',
      lotViewerLicense: '0',
      lotViewerInstalledProduct: '',
      // crossOverStudy: '1',
      licenseAssignDate: new Date(),
      licenseExpirationDate: new Date('2022-06-28T19:17:15.165Z'),
      licenseLength: '',
      licenseNumberUsers: 6,
      shipTo: '11111',
      soldTo: '22222',
      labLocationName: 'Demo Location',
      labLocationAddress: 'california new west coast',
      labLocationAddressSecondary: '',
      labLocationCountryId: '3',
      labLocationState: 'california',
      labLocationCity: 'california',
      locationZipCode: '5233008',
      labContactEmail: 'demo@gm.com',
      labContactFirst: 'demo',
      labContactLast: 'client',
      transformers: '',
      comments: '',
      labLanguagePreference: 'en-US'
    };
    component.locationForm.setValue(locationFormValues);
    const spy = spyOn(component, 'checkFormValidity').and.callThrough();
    fixture.detectChanges();
    component.checkFormValidity();
    expect(component.locationForm.controls.labContactFirst.disabled).toBeFalse();
    expect(component.locationForm.controls.labContactLast.disabled).toBeFalse();
    expect(component.locationForm.controls.labContactEmail.disabled).toBeFalse();
    const button = fixture.debugElement.nativeElement.querySelector('.spec_add_location');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should prefill the location form and then click on update', async(() => {
    component.loadLocationForm = true;
    component.account = sampleAccount;
    component.location = mockNewLocation;
    component.ngOnInit();
    fixture.detectChanges();
    const locationSpy = spyOn(component, 'openLocationForm').and.callThrough();
    fixture.detectChanges();
    component.openLocationForm(mockNewLocation);
    fixture.detectChanges();
    expect(locationSpy).toHaveBeenCalled();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.displayName).toEqual(mockNewLocation.displayName);
      expect(component.formattedAccountNumber).toEqual(mockNewLocation.formattedAccountNumber);
      expect(component.isLoadedFromAccount).toEqual(false);
      expect(component.editLocationMode).toEqual(true);

      component.initializeLocationForm(mockNewLocation);
      const formValue = component.locationForm.value;

      expect(formValue.orderNumber).toEqual(mockNewLocation.orderNumber);
      expect(formValue.unityNextTier).toEqual(mockNewLocation.unityNextTier);
      expect(formValue.unityNextInstalledProduct).toEqual(mockNewLocation.unityNextInstalledProduct);
      expect(formValue.connectivityTier).toEqual(undefined);
      expect(formValue.connectivityInstalledProduct).toEqual(mockNewLocation.connectivityInstalledProduct);
      expect(formValue.lotViewerLicense).toEqual(mockNewLocation.lotViewerLicense);
      expect(formValue.lotViewerInstalledProduct).toEqual(mockNewLocation.lotViewerInstalledProduct);
      expect(component.getSelectedAddOns()).toEqual(mockNewLocation.addOnsFlags);
      // expect(formValue.crossOverStudy).toEqual(mockNewLocation.crossOverStudy);
      expect(formValue.licenseAssignDate)
        .toEqual(new Date(mockNewLocation.licenseAssignDate.setMinutes(mockNewLocation.licenseAssignDate.getMinutes()
          + mockNewLocation.licenseAssignDate.getTimezoneOffset())));
      expect(formValue.licenseExpirationDate)
        .toEqual(new Date(mockNewLocation.licenseExpirationDate.setMinutes(mockNewLocation.licenseExpirationDate.getMinutes()
          + mockNewLocation.licenseExpirationDate.getTimezoneOffset())));
      expect(formValue.licenseLength).toEqual('');
      expect(formValue.licenseNumberUsers).toEqual(String(mockNewLocation.licenseNumberUsers));
      expect(formValue.shipTo).toEqual(mockNewLocation.shipTo);
      expect(formValue.soldTo).toEqual(mockNewLocation.soldTo);
      expect(formValue.labLocationName).toEqual(mockNewLocation.labLocationName);
      expect(formValue.labLocationAddress).toEqual(mockNewLocation.labLocationAddress.streetAddress);
      expect(formValue.labLocationAddressSecondary).toEqual(mockNewLocation.labLocationAddress.streetAddress2);
      expect(formValue.labLocationCountryId).toEqual(mockNewLocation.labLocationAddress.country);
      expect(formValue.labLocationState).toEqual(mockNewLocation.labLocationAddress.state);
      expect(formValue.labLocationCity).toEqual(mockNewLocation.labLocationAddress.city);
      expect(formValue.locationZipCode).toEqual(mockNewLocation.labLocationAddress.zipCode);
      expect(formValue.labContactEmail).toEqual(mockNewLocation.labLocationContact.email);
      expect(formValue.labContactFirst).toEqual(mockNewLocation.labLocationContact.firstName);
      expect(formValue.labContactLast).toEqual(mockNewLocation.labLocationContact.lastName);

      const spy = spyOn(component, 'checkFormValidity').and.callThrough();

      fixture.detectChanges();
      component.checkFormValidity();

      const button = fixture.debugElement.nativeElement.querySelector('.spec_update_location');

      button.click();
      expect(spy).toHaveBeenCalled();
    });
  }));

  it('should prefill the location form with Unity Next tier and Connectivity tier populated and then click on update', async(() => {
    component.loadLocationForm = true;
    component.account = sampleAccount;
    component.location = mockNewLocation3;
    component.ngOnInit();
    fixture.detectChanges();
    const locationSpy = spyOn(component, 'openLocationForm').and.callThrough();
    fixture.detectChanges();
    component.openLocationForm(mockNewLocation3);
    fixture.detectChanges();
    expect(locationSpy).toHaveBeenCalled();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.displayName).toEqual(mockNewLocation3.displayName);
      expect(component.formattedAccountNumber).toEqual(mockNewLocation3.formattedAccountNumber);
      expect(component.isLoadedFromAccount).toEqual(false);
      expect(component.editLocationMode).toEqual(true);
      component.initializeLocationForm(mockNewLocation3);
      const formValue = component.locationForm.value;
      expect(formValue.orderNumber).toEqual(mockNewLocation3.orderNumber);
      expect(formValue.unityNextTier).toEqual(mockNewLocation3.unityNextTier);
      expect(formValue.unityNextInstalledProduct).toEqual(mockNewLocation3.unityNextInstalledProduct);
      expect(formValue.connectivityTier).toEqual(mockNewLocation3.connectivityTier);
      expect(formValue.connectivityInstalledProduct).toEqual(mockNewLocation3.connectivityInstalledProduct);
      expect(formValue.lotViewerLicense).toEqual(mockNewLocation3.lotViewerLicense);
      expect(formValue.lotViewerInstalledProduct).toEqual(mockNewLocation3.lotViewerInstalledProduct);
      expect(component.getSelectedAddOns()).toEqual(mockNewLocation3.addOnsFlags);
      // expect(formValue.crossOverStudy).toEqual(mockNewLocation3.crossOverStudy);
      expect(formValue.licenseAssignDate)
        .toEqual(new Date(mockNewLocation3.licenseAssignDate.setMinutes(mockNewLocation3.licenseAssignDate.getMinutes()
          + mockNewLocation3.licenseAssignDate.getTimezoneOffset())));
      expect(formValue.licenseExpirationDate)
        .toEqual(new Date(mockNewLocation3.licenseExpirationDate.setMinutes(mockNewLocation3.licenseExpirationDate.getMinutes()
          + mockNewLocation3.licenseExpirationDate.getTimezoneOffset())));
      expect(formValue.licenseLength).toEqual('');
      expect(formValue.licenseNumberUsers).toEqual(String(mockNewLocation.licenseNumberUsers));
      expect(formValue.shipTo).toEqual(mockNewLocation3.shipTo);
      expect(formValue.soldTo).toEqual(mockNewLocation3.soldTo);
      expect(formValue.labLocationName).toEqual(mockNewLocation3.labLocationName);
      expect(formValue.labLocationAddress).toEqual(mockNewLocation3.labLocationAddress.streetAddress);
      expect(formValue.labLocationAddressSecondary).toEqual(mockNewLocation3.labLocationAddress.streetAddress2);
      expect(formValue.labLocationCountryId).toEqual(mockNewLocation3.labLocationAddress.country);
      expect(formValue.labLocationState).toEqual(mockNewLocation3.labLocationAddress.state);
      expect(formValue.labLocationCity).toEqual(mockNewLocation3.labLocationAddress.city);
      expect(formValue.locationZipCode).toEqual(mockNewLocation3.labLocationAddress.zipCode);
      expect(formValue.labContactEmail).toEqual(mockNewLocation3.labLocationContact.email);
      expect(formValue.labContactFirst).toEqual(mockNewLocation3.labLocationContact.firstName);
      expect(formValue.labContactLast).toEqual(mockNewLocation3.labLocationContact.lastName);
      const spy = spyOn(component, 'checkFormValidity').and.callThrough();
      fixture.detectChanges();
      component.checkFormValidity();
      const button = fixture.debugElement.nativeElement.querySelector('.spec_update_location');
      button.click();
      expect(spy).toHaveBeenCalled();
    });
  }));

  it('should enable the Connectivity tier field for UnityNextTier Peer QC and Advanced QC', () => {
    const mockLocation = cloneDeep(mockNewLocation3);

    mockLocation.unityNextTier = UnityNextTier.None;
    component.initializeLocationForm(mockLocation);
    let locationFormControls = component.locationForm.controls;
    let formValue = component.locationForm.value;
    expect(formValue.unityNextTier).toEqual(mockLocation.unityNextTier);
    expect(locationFormControls['unityNextTier'].disabled).toBeFalse();
    expect(locationFormControls['connectivityTier'].disabled).toBeTrue();

    mockLocation.unityNextTier = UnityNextTier.PeerQc;
    component.initializeLocationForm(mockLocation);
    locationFormControls = component.locationForm.controls;
    formValue = component.locationForm.value;
    expect(formValue.unityNextTier).toEqual(mockLocation.unityNextTier);
    expect(locationFormControls['unityNextTier'].disabled).toBeFalse();
    expect(locationFormControls['connectivityTier'].disabled).toBeFalse();

    mockLocation.unityNextTier = UnityNextTier.DailyQc;
    component.initializeLocationForm(mockLocation);
    locationFormControls = component.locationForm.controls;
    formValue = component.locationForm.value;
    expect(formValue.unityNextTier).toEqual(mockLocation.unityNextTier);
    expect(locationFormControls['unityNextTier'].disabled).toBeFalse();
    expect(locationFormControls['connectivityTier'].disabled).toBeFalse();
  });

  it('should check for Edit Location form', async () => {
    component.loadLocationForm = true;
    component.account = sampleAccount;
    component.location = mockNewLocation;
    component.ngOnInit();
    fixture.detectChanges();
    const locationSpy = spyOn(component, 'openLocationForm').and.callThrough();
    fixture.detectChanges();
    component.openLocationForm(mockNewLocation);
    fixture.detectChanges();
    expect(locationSpy).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.displayName).toEqual(mockNewLocation.displayName);
    expect(component.formattedAccountNumber).toEqual(mockNewLocation.accountNumber);
    expect(component.isLoadedFromAccount).toEqual(false);
    expect(component.editLocationMode).toEqual(true);
    const button = fixture.debugElement.nativeElement.querySelector('.spec_update_location');
    expect(button).not.toBeNull();
  });

  it('should check for Add Location form', async () => {
    component.account = mockAccount;
    component.location = null;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.displayName).toEqual(mockAccount.displayName);
    expect(component.formattedAccountNumber).toEqual(mockAccount.formattedAccountNumber);
    expect(component.isLoadedFromAccount).toEqual(true);
    expect(component.editLocationMode).toEqual(false);
    const locationSpy = spyOn(component, 'openLocationForm').and.callThrough();
    fixture.detectChanges();
    component.openLocationForm(null);
    fixture.detectChanges();
    expect(locationSpy).toHaveBeenCalled();
    expect(component.loadLocationForm).toEqual(true);
    const addButton = fixture.debugElement.nativeElement.querySelector('.spec_add_location');
    expect(addButton).not.toBeNull();
  });

  it('should update location and not present previous contact deletion dialog', () => {
    component.account = sampleAccount;
    component.location = mockNewLocation;
    component.selectedGroup = mockGroup;
    component.openLocationForm(mockNewLocation);
    component.locationForm.enable();
    fixture.detectChanges();
    component.locationForm.setValue({
      ...component.locationForm.value,
      labLocationState: mockNewLocation.labLocationAddress.state,
      labLocationCity: mockNewLocation.labLocationAddress.city,
      locationZipCode: mockNewLocation.labLocationAddress.zipCode,
    });
    component.locationForm.controls['labLocationAddress'].setValue(mockNewLocation.labLocationAddress.streetAddress);
    // spyOn(component['accountManagementApiService'], 'deleteUser').and.callThrough();
    spyOn(component['accountManagementApiService'], 'updateLocation').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    mockNewLocation.previousContactUserId = null;

    component.updateLocation();
    fixture.detectChanges();

    // expect(component['accountManagementApiService'].deleteUser).not.toHaveBeenCalled();
    expect(component['accountManagementApiService'].updateLocation).toHaveBeenCalled();
    expect(component.dialog.open).not.toHaveBeenCalled();
  });

  it('should update location and present previous contact deletion dialog', () => {
    component.account = sampleAccount;
    component.location = mockNewLocation;
    component.selectedGroup = mockGroup;
    component.openLocationForm(mockNewLocation);
    component.locationForm.enable();
    component.locationForm.setValue({
      ...component.locationForm.value,
      labLocationState: mockNewLocation.labLocationAddress.state,
      labLocationCity: mockNewLocation.labLocationAddress.city,
      locationZipCode: mockNewLocation.labLocationAddress.zipCode,
    });
    component.locationForm.controls['labLocationAddress'].setValue(mockNewLocation.labLocationAddress.streetAddress);
    spyOn(component['accountManagementApiService'], 'updateLocation').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    mockNewLocation.previousContactUserId = 'b1de4052-28a5-479f-b637-ef258e0e2578';

    component.updateLocation();
    fixture.detectChanges();

    expect(component['accountManagementApiService'].updateLocation).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
    mockNewLocation.previousContactUserId = null;
  });

  it('should send request to delete previous user when previous contact deletion confirmation dialog returns true', () => {
    dialogRefStub.afterClosed = () => of(true);
    component.account = sampleAccount;
    component.location = mockNewLocation;
    component.selectedGroup = mockGroup;
    component.openLocationForm(mockNewLocation);
    component.locationForm.enable();
    component.locationForm.setValue({
      ...component.locationForm.value,
      labLocationState: mockNewLocation.labLocationAddress.state,
      labLocationCity: mockNewLocation.labLocationAddress.city,
      locationZipCode: mockNewLocation.labLocationAddress.zipCode,
    });
    component.locationForm.controls['labLocationAddress'].setValue(mockNewLocation.labLocationAddress.streetAddress);
    spyOn(component['accountManagementApiService'], 'updateLocation').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    spyOn(component['accountManagementApiService'], 'deleteUser').and.callThrough();
    mockNewLocation.previousContactUserId = 'b1de4052-28a5-479f-b637-ef258e0e2578';

    component.updateLocation();
    fixture.detectChanges();

    expect(component['accountManagementApiService'].updateLocation).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component['accountManagementApiService'].deleteUser).toHaveBeenCalled();
    mockNewLocation.previousContactUserId = null;
    dialogRefStub.afterClosed = () => of(false);
  });

  it('should not send request to delete previous user when previous contact deletion confirmation dialog returns false', () => {
    dialogRefStub.afterClosed = () => of(false);
    component.account = sampleAccount;
    component.location = mockNewLocation;
    component.selectedGroup = mockGroup;
    component.openLocationForm(mockNewLocation);
    component.locationForm.enable();
    component.locationForm.setValue({
      ...component.locationForm.value,
      labLocationState: mockNewLocation.labLocationAddress.state,
      labLocationCity: mockNewLocation.labLocationAddress.city,
      locationZipCode: mockNewLocation.labLocationAddress.zipCode,
    });
    component.locationForm.controls['labLocationAddress'].setValue(mockNewLocation.labLocationAddress.streetAddress);
    spyOn(component['accountManagementApiService'], 'updateLocation').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    spyOn(component['accountManagementApiService'], 'deleteUser').and.callThrough();
    mockNewLocation.previousContactUserId = 'b1de4052-28a5-479f-b637-ef258e0e2578';

    component.updateLocation();
    fixture.detectChanges();

    expect(component['accountManagementApiService'].updateLocation).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component['accountManagementApiService'].deleteUser).not.toHaveBeenCalled();
    mockNewLocation.previousContactUserId = null;
  });

  it('should present error for case where licensed number of users count is less than existing user', () => {
    component.account = sampleAccount;
    component.location = mockNewLocation;
    component.selectedGroup = mockGroup;
    // Have update location return error code labsetup-109
    ApiServiceStub.updateLocation = () => throwError({
      error: {
        errorCode: ErrorsInterceptor.labsetup109
      }
    });
    component.openLocationForm(mockNewLocation);
    component.locationForm.enable();
    component.locationForm.setValue({
      ...component.locationForm.value,
      labLocationState: mockNewLocation.labLocationAddress.state,
      labLocationCity: mockNewLocation.labLocationAddress.city,
      locationZipCode: mockNewLocation.labLocationAddress.zipCode,
    });
    component.locationForm.controls['labLocationAddress'].setValue(mockNewLocation.labLocationAddress.streetAddress);
    spyOn(component['accountManagementApiService'], 'updateLocation').and.callThrough();
    spyOn(component.locationForm.controls['licenseNumberUsers'], 'setErrors').and.callThrough();
    mockNewLocation.previousContactUserId = null;

    component.updateLocation();
    fixture.detectChanges();

    expect(component['accountManagementApiService'].updateLocation).toHaveBeenCalled();
    expect(component.locationForm.controls['licenseNumberUsers'].setErrors).toHaveBeenCalledOnceWith({ invalid: true, userCount: true });

    ApiServiceStub.updateLocation = (): Observable<LabLocation> => {
      return of(mockNewLocation);
    };
  });

  it('should display add a group Button', () => {
    const addAGroupButton = fixture.debugElement.nativeElement.querySelector('.group-button');
    expect(addAGroupButton).toBeDefined();
  });

  it('should display add group form on clicking add group button', fakeAsync(() => {
    spyOn(component, 'addAGroup');
    const addAGroupButton = fixture.debugElement.nativeElement.querySelector('.group-button');
    addAGroupButton.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.addAGroup).toHaveBeenCalled();
      const addGroupForm = fixture.debugElement.nativeElement.querySelector('.add-group-items');
      expect(addGroupForm).toBeDefined();
    });
  }));

  it('Test a group form element count', fakeAsync(() => {
    component.account = {
      id: sampleAccount[0].id,
      displayName: sampleAccount[0].displayName,
      accountNumber: sampleAccount[0].accountNumber,
      formattedAccountNumber: sampleAccount[0].formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const addAGroupButton = fixture.debugElement.nativeElement.querySelector('.group-button');
    addAGroupButton.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const addGroupForm = fixture.debugElement.nativeElement.querySelector('.add-group-items');
      expect(addGroupForm).toBeDefined();
      const formElement = fixture.debugElement.nativeElement.querySelectorAll('input');
      expect(formElement.length).toEqual(1);
    });
  }));

  it('check initial group form values', () => {
    component.account = mockAccount;
    const groupFormValues = {
      groupName: ''
    };
    expect(mockGroupForm.value).toEqual(groupFormValues);
  });

  it('should add group', fakeAsync(() => {
    component.account = {
      id: sampleAccount[0].id,
      displayName: sampleAccount[0].displayName,
      accountNumber: sampleAccount[0].accountNumber,
      formattedAccountNumber: sampleAccount[0].formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const addAGroupButton = fixture.debugElement.nativeElement.querySelector('.group-button');
    addAGroupButton.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.groupForm.setValue(groupFormValue);
      fixture.detectChanges();
      const spyObj = spyOn(component['accountManagementApiService'], 'addGroup').and.callThrough();
      component.saveGroup();
      fixture.detectChanges();
      expect(component['accountManagementApiService'].addGroup).toHaveBeenCalled();
    });
  }));

  it('should display added group', fakeAsync(() => {
    component.account = {
      id: sampleAccount[0].id,
      displayName: sampleAccount[0].displayName,
      accountNumber: sampleAccount[0].accountNumber,
      formattedAccountNumber: sampleAccount[0].formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const addAGroupButton = fixture.debugElement.nativeElement.querySelector('.group-button');
    addAGroupButton.click();
    fixture.detectChanges();

    component.groupForm.setValue(groupFormValue);
    fixture.detectChanges();

    const addGroup = fixture.debugElement.nativeElement.querySelector('.spec-add-group');
    addGroup.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const groupNameElements = fixture.debugElement.queryAll(By.css('.group-list-child'));
      expect(groupNameElements.length).toEqual(sampleAccountWithGroups.children.length);
    });
  }));

  it('should display warning popup on clicking cancel , if form has unsaved data', fakeAsync(() => {
    component.account = {
      id: sampleAccount[0].id,
      displayName: sampleAccount[0].displayName,
      accountNumber: sampleAccount[0].accountNumber,
      formattedAccountNumber: sampleAccount[0].formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const addAGroupButton = fixture.debugElement.nativeElement.querySelector('.group-button');
    addAGroupButton.click();
    fixture.detectChanges();

    component.groupForm.setValue(groupFormValue);
    fixture.detectChanges();

    const cancelGroup = fixture.debugElement.nativeElement.querySelector('.spec-cancel-group');
    cancelGroup.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const warningBox = fixture.debugElement.nativeElement.querySelector('#spec_warningBox');
      expect(warningBox).toBeDefined();
    });
  }));

  it('should edit group', () => {
    component.account = {
      id: sampleAccount[0].id,
      displayName: sampleAccount[0].displayName,
      accountNumber: sampleAccount[0].accountNumber,
      formattedAccountNumber: sampleAccount[0].formattedAccountNumber
    } as Account;

    component.ngOnInit();
    fixture.detectChanges();

    const addAGroupButton = fixture.debugElement.nativeElement.querySelector('.group-button');
    addAGroupButton.click();
    fixture.detectChanges();

    component.groupForm.patchValue(groupFormUpdateValue);
    fixture.detectChanges();

    const spyObj = spyOn(component, 'saveEditedGroup').and.callThrough();
    component.saveEditedGroup(groupFormUpdateValue);
    fixture.detectChanges();
    expect(spyObj).toHaveBeenCalled();
  });

  it('should delete group', () => {
    sampleAccount = accountData.accounts[1];
    sampleGroups = accountData.groups.filter(group => group.parentNodeId === sampleAccount.id);
    component.groups = sampleGroups;
    component.account = {
      id: sampleAccount.id,
      displayName: sampleAccount.displayName,
      accountNumber: sampleAccount.accountNumber,
      formattedAccountNumber: sampleAccount.formattedAccountNumber
    } as Account;
    component.addGroupBtnSelected = false;
    component.editGroupButton = false;
    component.displayDeleteWarning = false;

    component.ngOnInit();
    fixture.detectChanges();

    component.displayDeleteWarning = true;
    component.editedGroup = <Lab><unknown>'group1';
    fixture.detectChanges();

    const deleteConfirmIcon = fixture.debugElement.query(By.css('.spec-confirm-delete')).nativeElement;
    expect(deleteConfirmIcon).toBeDefined();
    deleteConfirmIcon.click();
    fixture.detectChanges();

    const spyObj = spyOn(component, 'deleteGroup').and.callThrough();
    component.deleteGroup();
    fixture.detectChanges();
    expect(spyObj).toHaveBeenCalled();
  });

  it('should display delete icon lab setup is not completed for location', () => {
    component.loadLocationForm = false;
    component.locationsData = searchLocation.locations;
    component.locationsData[0].hasChildren = false;
    fixture.detectChanges();
    const deleteIcon = fixture.debugElement.query(By.css('.spec-location-delete')).nativeElement;
    expect(deleteIcon).toBeTruthy();
  });

  it('should open confirm delete dialog on click on delete icon', () => {
    component.loadLocationForm = false;
    component.locationsData = searchLocation.locations;
    component.locationsData[0].hasChildren = false;
    const spy = spyOn(component, 'openDeleteLocationDialog').and.callThrough();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.spec-location-delete')).nativeElement;
    btn.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should hide language drop-down when feature flag for localization is not enabled and display it if enabled', () => {
    component.isLocalizationActive = false;
    component.loadLocationForm = true;
    component.initializeLocationForm(null);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('unext-language-dropdown')).toBe(null);
    component.isLocalizationActive = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('unext-language-dropdown')).not.toBe(null);
  });

  it('should send default language preference en-US when adding location when localization feature flag is not enabled', () => {
    component.isLocalizationActive = false;
    component.account = mockAccount;
    component.ngOnInit();
    fixture.detectChanges();
    component.loadLocationForm = true;
    expect(component.displayName).toEqual(mockAccount.displayName);
    expect(component.formattedAccountNumber).toEqual(mockAccount.formattedAccountNumber);
    expect(component.isLoadedFromAccount).toEqual(true);
    expect(component.editLocationMode).toEqual(false);
    component.initializeLocationForm(null);
    fixture.detectChanges();
    const locationFormValues = {
      orderNumber: '12345',
      unityNextTier: '1',
      unityNextInstalledProduct: '',
      connectivityTier: '1',
      connectivityInstalledProduct: '',
      lotViewerLicense: '0',
      lotViewerInstalledProduct: '',
      addOns: 1,
      addOnsFlags: {
        'valueAssignment': false,
        'allowBR': true,
        'allowNonBR': false,
        'allowSiemensHematology': false,
        'allowSysmexHemostasis': false
      },
      licenseAssignDate: new Date(),
      licenseExpirationDate: new Date('2022-06-28T19:17:15.165Z'),
      licenseLength: '',
      licenseNumberUsers: 6,
      shipTo: '11111',
      soldTo: '22222',
      labLocationName: 'Demo Location',
      labLocationAddress: 'california new west coast',
      labLocationAddressSecondary: '',
      labLocationCountryId: '3',
      labLocationState: 'california',
      labLocationCity: 'california',
      locationZipCode: '5233008',
      labContactEmail: 'demo@example.com',
      labContactFirst: 'demo',
      labContactLast: 'client',
      transformers: '',
      comments: ''
    };
    component.locationForm.patchValue(locationFormValues);
    component.locationForm.patchValue({ labLocationAddress: mockNewLocation.labLocationAddress.streetAddress1});
    const addLocationSpy = spyOn(component['accountManagementApiService'], 'addLocation').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    mockNewLocation.previousContactUserId = null;
    fixture.detectChanges();
    component.addLocation();
    expect(addLocationSpy.calls.allArgs()).toHaveSize(1);
    expect(addLocationSpy.calls.allArgs()[0]).toHaveSize(1);
    expect(addLocationSpy.calls.allArgs()[0][0].labLanguagePreference).toEqual(component.defaultLanguageValue);
    expect(component.dialog.open).not.toHaveBeenCalled();
  });

  it('should send selected locations\'s current language preference when updating a location and localization feature flag is not enabled', () => {
    component.isLocalizationActive = false;
    component.account = sampleAccount;
    component.location = mockNewLocation;
    component.selectedGroup = mockGroup;
    component.openLocationForm(mockNewLocation);
    component.locationForm.enable();
    fixture.detectChanges();
    component.locationForm.setValue({
      ...component.locationForm.value,
      labLocationState: mockNewLocation.labLocationAddress.state,
      labLocationCity: mockNewLocation.labLocationAddress.city,
      locationZipCode: mockNewLocation.labLocationAddress.zipCode,
    });
    component.locationForm.controls['labLocationAddress'].setValue(mockNewLocation.labLocationAddress.streetAddress);
    spyOn(component['accountManagementApiService'], 'deleteUser').and.callThrough();
    const updateLocationSpy = spyOn(component['accountManagementApiService'], 'updateLocation').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    mockNewLocation.previousContactUserId = null;
    component.updateLocation();
    fixture.detectChanges();
    expect(component['accountManagementApiService'].deleteUser).not.toHaveBeenCalled();
    expect(component['accountManagementApiService'].updateLocation).toHaveBeenCalled();
    expect(updateLocationSpy.calls.allArgs()).toHaveSize(1);
    expect(updateLocationSpy.calls.allArgs()[0]).toHaveSize(1);
    expect(updateLocationSpy.calls.allArgs()[0][0].labLanguagePreference).toEqual(mockNewLocation.labLanguagePreference);
    expect(component.dialog.open).not.toHaveBeenCalled();
  });
});
