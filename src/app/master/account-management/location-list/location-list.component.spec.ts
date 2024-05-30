// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';

import { LocationListComponent } from './location-list.component';
import { AccountManagementApiService } from '../account-management-api.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { LocationPage } from '../../../contracts/models/account-management/location-page.model';
import { LocationField } from '../../../contracts/enums/acccount-location-management.enum';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { BioRadUserRoles } from '../../../contracts/enums/user-role.enum';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../app.module';

describe('LocationListComponent', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;
  const initialState = {};
  const sampleLocation: LocationPage = {
    locations: [
      {
        'id': '3E69FD70FF3047CCB7BACA9E9B9ADTGB',
        'parentNodeId': 'group1',
        'parentNode': null,
        'nodeType': 2,
        'displayName': 'LabLab',
        'children': null,
        'labLocationName': 'AMain Lab 1',
        'locationTimeZone': 'America/Los_Angeles',
        'locationOffset': '0',
        'locationDayLightSaving': 'false',
        'labLocationContactId': '',
        'labLocationAddressId': '',
        'labLocationContact': {
          'entityType': 0,
          'searchAttribute': 'email',
          'firstName': 'Sample',
          'middleName': null,
          'lastName': 'User',
          'name': 'SampleUser',
          'email': 'sample_user1@bio-rad.com',
          'phone': '000-000-0000',
          'id': ''
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationAddress': {
          'entityType': 0,
          'searchAttribute': 'streetaddress2',
          'nickName': '123 Main St.',
          'streetAddress1': 'aaaaaaaa',
          'streetAddress2': 'aaaaaaaa',
          'streetAddress3': '',
          'streetAddress': 'aaaaaaaa',
          'suite': 'ABC',
          'city': 'Irvine',
          'state': 'CA',
          'country': 'AX',
          'zipCode': '92618',
          'id': ''
        },
        'shipTo': '1000000',
        'soldTo': '3000000',
        'orderNumber': '123456 qqq',
        'unityNextTier': 0,
        'unityNextInstalledProduct': null,
        'connectivityTier': 2,
        'connectivityInstalledProduct': null,
        'lotViewerLicense': 1,
        'lotViewerInstalledProduct': '12345678-33232',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'crossOverStudy': 1,
        'licenseNumberUsers': 0,
        'licenseAssignDate': new Date('2009-10-14T07:00:00.000Z'),
        'licenseExpirationDate': new Date('2010-01-14T07:00:00.000Z'),
        'primaryUnityLabNumbers': 'demo test 462',
        'locationCount': 7,
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100503',
        'groupName': 'A Good Group',
        'transformers': [
          {
            'id': '3925',
            'displayName': 'MISYS QC Detail Report Transformer v4.0'
          },
          {
            'id': '3940',
            'displayName': 'CPSI Data Detail Transformer v4.1'
          },
          {
            'id': '3926',
            'displayName': 'Meditech QC Summary Report Transformer v4.0'
          },
          {
            'id': '3975',
            'displayName': 'Meditech Data Review by Activity Transformer v4.3'
          }
        ],
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 1,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': '3E69FD70FF3047CCB7BACA9E9B9A458B',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'IND',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'DMain Lab 2',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Hoag Medical',
        'accountNumber': 'U100505',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': '3E69FD70FF3047CCB7BACA9E9B9RDD8B',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress3',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#3',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#3',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user3@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User-3',
          'middleName': '',
          'name': 'Sample User-3',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'CMain Lab 3',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 1,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 1,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100503',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 0,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': '3E69FD70FF3047CCB7BACA9E9B9ADD8P',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress1',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#1',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#1',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user1@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User',
          'middleName': '',
          'name': 'Sample User',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'BMain Lab 4',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 3,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 0,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'TCXDN694CMQKVT7XVLG0NJLKLAYKTA',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'EMain Lab 5',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': -1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Hoag Medical',
        'accountNumber': 'U100505',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'YKZGLBEDEG2N28HVE1EQVI35J5KVVE',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress3',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#3',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#3',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user3@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User-3',
          'middleName': '',
          'name': 'Sample User-3',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'ZMain Lab 6',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 1,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 1,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 1,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'B24PMBH4Y9WX066RNSMXX1KOEWFGUP',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'QMain Lab 7',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Hoag Medical',
        'accountNumber': 'U100505',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'Lab Group of America',
        'id': '5L553TXCJ0A3RH7JF3BF7RU8QB0Q2V',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress3',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#3',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#3',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user3@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User-3',
          'middleName': '',
          'name': 'Sample User-3',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'LMain Lab 8',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 1,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 1,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group5',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100503',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'Lab Group of America',
        'id': '1YO3JYFGPEC5QQ8GAZJYJKK4471XCO',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress1',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#1',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#1',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user1@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User',
          'middleName': '',
          'name': 'Sample User',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'VMain Lab 9',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 3,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group5',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 1,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'Lab Group of America',
        'id': 'PSZF6ZR600B601MN2Z6KA9JC72QH44',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'LMain Lab 10',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group5',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 1,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'B94F598B3BLFAI1SDBUKEEV25OEEAO',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Dayun',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Hoag Medical',
        'accountNumber': 'U100505',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'ZW3OI0BXKI0T3XBSAZR8VMK2N15V3H',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress3',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#3',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#3',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user3@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User-3',
          'middleName': '',
          'name': 'Sample User-3',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Aston Martin',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 1,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 1,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100503',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'TTYFXVEWO9FQXUDPMQ23C2ESW19C9N',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress1',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#1',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#1',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user1@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User',
          'middleName': '',
          'name': 'Sample User',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Carlsson',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 3,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 1,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'ABE5YTGMN28TJF3KZIYAXV5DT5CWVQ',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'MEagle',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Hoag Medical',
        'accountNumber': 'U100505',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'J66DTIXP3Z1A00GJ4L5YW66XGBFM9I',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress3',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#3',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#3',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user3@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User-3',
          'middleName': '',
          'name': 'Sample User-3',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Hongqi',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 1,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 1,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Hoag Medical',
        'accountNumber': 'U100505',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'V1KHGAJNT68JKJD998HAGLMQSB2QL4',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress3',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#3',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#3',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user3@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User-3',
          'middleName': '',
          'name': 'Sample User-3',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Main Lab 42',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2021-08-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 1,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 1,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100503',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': '7IGO98DXGUWUMTJBIRN7GA4ZY575XJ',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress1',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#1',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#1',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user1@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User',
          'middleName': '',
          'name': 'Sample User',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Peugeot',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 3,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 1,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'KSXL771UQBXTLFKTQIK0PZZ98EIDQL',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Wiesmann',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Hoag Medical',
        'accountNumber': 'U100505',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 2,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': 'TCJWQL8PUD6U4HUKEJKY0D7ZQ8O0Y0',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress3',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#3',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#3',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user3@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User-3',
          'middleName': '',
          'name': 'Sample User-3',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Leyland',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 1,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 1,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 1,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': '7GTSO1AEDSW9U7UQ1VDR4TOILWMWTR',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Genesis',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      },
      {
        'accountName': 'Kaiser Permanente',
        'accountNumber': 'U100504',
        'addOns': 1,
        'addOnsFlags': {
          'valueAssignment': true,
          'allowBR': false,
          'allowNonBR': false,
          'allowSiemensHematology': false,
          'allowSysmexHemostasis': false
        },
        'children': null,
        'connectivityInstalledProduct': '123-ah-563',
        'connectivityTier': 1,
        'crossOverStudy': 1,
        'displayName': 'LabLab',
        'groupName': 'A Good Group',
        'id': '7GTSO1AEDSW9U7UQ1VDR4TOILWMWTR',
        'labLocationAddress': {
          'city': 'Irvine',
          'country': 'AX',
          'entityType': 0,
          'id': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
          'nickName': '123 Main St.',
          'searchAttribute': 'streetaddress2',
          'state': 'CA',
          'streetAddress': '123 Main St. Ste.#2',
          'streetAddress1': '123 Main St.',
          'streetAddress2': 'Ste. ABC',
          'streetAddress3': '#2',
          'suite': 'ABC',
          'zipCode': '92618'
        },
        'labLocationAddressId': '60ae84d8-edca-4f7c-92e5-4b5bc3765f7b',
        'labLocationContact': {
          'email': 'sample_user2@bio-rad.com',
          'entityType': 0,
          'firstName': 'Sample',
          'id': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
          'lastName': 'User2',
          'middleName': '',
          'name': 'Sample User2',
          'phone': '000-000-0000',
          'searchAttribute': 'email'
        },
        'contactRoles': [BioRadUserRoles.BioRadManager],
        'labLocationContactId': 'cc0d384f-1598-4fd0-9c2c-9d5dac0dff3a',
        'labLocationName': 'Genesis',
        'licenseAssignDate': new Date('2009-10-14T07:00:00Z'),
        'licenseExpirationDate': new Date('2023-10-14T07:00:00Z'),
        'licenseNumberUsers': 0,
        'locationCount': 5,
        'locationDayLightSaving': 'false',
        'locationOffset': '0',
        'locationTimeZone': 'America/Los_Angeles',
        'lotViewerInstalledProduct': '678-46578-890',
        'lotViewerLicense': 0,
        'nodeType': 0,
        'orderNumber': '123456',
        'parentNode': null,
        'parentNodeId': 'group1',
        'primaryUnityLabNumbers': 'demo test 1234',
        'shipTo': '1000000',
        'soldTo': '2000000',
        'unityNextInstalledProduct': 'string',
        'unityNextTier': 1,
        'previousContactUserId': null,
        'labLanguagePreference': 'en-us'
      }
    ],
    totalPages: 2,
    pageSize: 20,
    totalItems: 21,
    pageIndex: 1
  };

  const ApiServiceStub = {
    searchLocations: () => {
      return of(sampleLocation);
    }
  };


  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockBrPermissionsService = {
    hasAccess: () => { },
  };

  const TRANSLATIONS_EN = require('../../../../assets/i18n/en.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationListComponent],
      imports: [
        MatTableModule,
        NgxPaginationModule,
        MatDialogModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),],
      providers: [
      provideMockStore({
        initialState
        // selectors: [
        //   { selector: fromNavigation.getCurrentlySelectedNode, value:  {}  }
        // ],
      }),
      { provide: AccountManagementApiService, useValue: ApiServiceStub },
      { provide: MessageSnackBarService, useValue: '' },
      { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
      { provide: BrPermissionsService, useValue: mockBrPermissionsService },
      { provide: NavigationService, useValue: of('') },
      TranslateService,
      HttpClient],
    })
      .compileComponents();
    fixture = TestBed.createComponent(LocationListComponent);
    component = fixture.componentInstance;
    component.locations = sampleLocation.locations;
    component.paginationConfig.itemsPerPage = sampleLocation.pageSize;
    component.totalPages = sampleLocation.totalPages;
    component.paginationConfig.totalItems = sampleLocation.totalItems;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct data in table rows ', () => {
    expect(component.locations).toEqual(sampleLocation.locations);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
      expect(tableRows.length).toBe(20);
      const labIdentificationCell = tableRows[0].children[0];
      expect(labIdentificationCell.children[0].children[0].innerText).toEqual(sampleLocation.locations[0].labLocationName);
      const address = sampleLocation.locations[0].labLocationAddress.streetAddress + ', ' + sampleLocation.locations[0].labLocationAddress.city + ', ' +
        sampleLocation.locations[0].labLocationAddress.state + ', ' + sampleLocation.locations[0].labLocationAddress.zipCode + ', ' +
        sampleLocation.locations[0].labLocationAddress.country;
      expect(labIdentificationCell.children[0].children[1].innerText).toEqual(address);
      const labContactCell = tableRows[0].children[1];
      expect(labContactCell.children[0].children[0].innerText).toEqual(sampleLocation.locations[0].labLocationContact.name);
      expect(labContactCell.children[0].children[1].innerText).toEqual(sampleLocation.locations[0].labLocationContact.email);
      const AccountInfoCell = tableRows[0].children[2];
      expect(AccountInfoCell.children[0].children[0].innerText).toEqual(sampleLocation.locations[0].accountName);
      expect(AccountInfoCell.children[0].children[1].innerText).toEqual(sampleLocation.locations[0].accountNumber);
      const groupNameCell = tableRows[0].children[3];
      expect(groupNameCell.children[0].innerText).toEqual(sampleLocation.locations[0].groupName);
      const locationsCell = tableRows[0].children[4];
      expect(locationsCell.children[0].innerText).toEqual(`${sampleLocation.locations[0].locationCount}`);
      // const licenseTypeCell = tableRows[0].children[5];
      expect(TRANSLATIONS_EN.ACCOUNTDETAILS.LOCATIONLIST.PEER).toEqual('Peer QC');
      expect(TRANSLATIONS_EN.ACCOUNTDETAILS.UNCONNECT).toEqual('UN Connect');
    });
  });

  it('should add correct class for multiple license status', () => {
    const licenseTypeEl = fixture.nativeElement.querySelectorAll('.spec-licenseType');
    expect(licenseTypeEl[0]).toHaveClass('sub-text');
    expect(licenseTypeEl[1]).toHaveClass('sub-text');
    expect(licenseTypeEl[2]).toHaveClass('sub-text');
    expect(licenseTypeEl[3]).toHaveClass('sub-text');
    expect(licenseTypeEl[4]).toHaveClass('main-text');
  });


  it('should render multiple license when available', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('mat-row');

    // Checking for the 1st Row
    let licenseTypeCell = tableRows[0].children[5];
    expect(TRANSLATIONS_EN.LOCATIONLIST.PEER).toEqual('Peer QC');

    // Checking for the 2nd Row
    licenseTypeCell = tableRows[1].children[5];
    expect(TRANSLATIONS_EN.LOCATIONLIST.UNUPLOAD).toEqual('UN Upload');

    // Checking for the 3rd Row
    licenseTypeCell = tableRows[2].children[5];
    expect(TRANSLATIONS_EN.LOCATIONLIST.UNCONNECT).toEqual('UN Connect');
    expect(TRANSLATIONS_EN.LOCATIONLIST.LOTVIEWER).toEqual('Lot Viewer');
    // Checking for the 4th Row
    licenseTypeCell = tableRows[3].children[5];
    expect(TRANSLATIONS_EN.LOCATIONLIST.VALUEASSIGNMENT).toEqual('Value Assignment');
    expect(licenseTypeCell.children[0].children[0].innerText).toEqual('DATAREVIEW.LOCATIONLIST.DAILYQC');
    // Checking for the 5th Row
    licenseTypeCell = tableRows[4].children[5];
    expect(TRANSLATIONS_EN.LOCATIONLIST.NONE).toEqual('None');
  });


  it('should display "Loading location..." message while locations are being fetched', () => {
    component.locations = null;
    fixture.detectChanges();

    let loadingLocationMessage = fixture.debugElement.query(By.css('.spec_locations_loading'));
    expect(loadingLocationMessage).toBeDefined();
    expect(loadingLocationMessage.nativeElement.textContent.length).toBeGreaterThan(0);
    expect(TRANSLATIONS_EN.LOCATIONLIST.LOADING).toEqual('Loading locations...');

    // Hide the message when locations are available
    component.locations = sampleLocation.locations;
    fixture.detectChanges();

    loadingLocationMessage = fixture.debugElement.query(By.css('.spec_locations_loading'));
    expect(loadingLocationMessage).toBeNull();
  });

  it('should display "No Location" message when locations are not present', () => {
    component.locations = [];
    fixture.detectChanges();

    const locationNoneFoundMessage = fixture.debugElement.query(By.css('.spec_locations_none_found'));
    expect(locationNoneFoundMessage).toBeDefined();
    expect(locationNoneFoundMessage.nativeElement.textContent.length).toBeGreaterThan(0);
    expect(TRANSLATIONS_EN.LOCATIONLIST.FOUND).toEqual('No locations found');
  });

  it('should hide the pagination controls when locations are not present or when only one location page is present', () => {
    component.locations = null;
    fixture.detectChanges();

    let paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();
    component.locations = sampleLocation.locations;
    component.paginationConfig.currentPage = sampleLocation.pageIndex;
    component.paginationConfig.itemsPerPage = sampleLocation.pageSize;
    component.paginationConfig.totalItems = sampleLocation.pageSize * sampleLocation.totalPages;
    fixture.detectChanges();

    paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();
  });

  it('should show the pagination controls when two location pages are present', () => {
    component.locations = sampleLocation.locations;
    component.paginationConfig.currentPage = sampleLocation.pageIndex;
    component.paginationConfig.itemsPerPage = sampleLocation.pageSize;
    component.paginationConfig.totalItems = sampleLocation.totalItems;
    fixture.detectChanges();

    const paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    expect(paginationButtons.length).toEqual(2);

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    expect(nextButton).toBeDefined();
    expect(nextButton.disabled).toBeFalsy();

    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    expect(prevButton).toBeDefined();
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should display locations based on the Page selected in Pagination when we have multiple pages', () => {
    // click on the next button in the pagination and check if locations are modified accordingly
    component.locations = sampleLocation.locations;
    component.paginationConfig.currentPage = sampleLocation.pageIndex;
    component.paginationConfig.itemsPerPage = sampleLocation.pageSize;
    component.paginationConfig.totalItems = sampleLocation.totalItems;
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    nextButton.click();
    fixture.detectChanges();
    expect(component.locations).toEqual(sampleLocation.locations);

    // click on the prev button in the pagination and check if locations are modified accordingly
    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    prevButton.click();
    fixture.detectChanges();
    expect(component.locations).toEqual(sampleLocation.locations);

    // click on the third page in the pagination and check if locations are modified accordingly
    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    const secondPageButton = paginationButtons[1].nativeElement;
    secondPageButton.click();
    fixture.detectChanges();
    expect(component.locations).toEqual(sampleLocation.locations);
  });

  // Since the format has been changed for fetching locations (temporarily), this test wont work for now
  it('should create correct number of pages for pagination', () => {
    component.ngOnInit();
    fixture.detectChanges();
    // Pagination Directive automatically generate pages based on totalItems and the PageSize
    expect(component.paginationConfig.totalItems).toEqual(sampleLocation.totalItems);
  });

  it('should display reset button only if category is selected or search input is not null', () => {
    component.selectedCategory = 0;
    component.searchInput = null;
    fixture.detectChanges();
    let resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    expect(resetBtn).toBeNull();

    component.selectedCategory = 2;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    expect(resetBtn.nativeElement).toBeDefined();
    expect(TRANSLATIONS_EN.LOCATIONLIST.RESET).toEqual('Reset');
  });

  it('should hide the reset button after it has been clicked', () => {
    component.selectedCategory = 1;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    let resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn')).nativeElement;
    resetBtn.click();
    fixture.detectChanges();
    expect(component.searchInput).toBeNull();
    expect(component.selectedCategory).toEqual(0);
    resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    fixture.detectChanges();
    expect(resetBtn).toBeNull();
  });

  it('should reset the category, serach-box and the results when reset button is clicked', () => {
    component.selectedCategory = 2;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    const resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn')).nativeElement;
    resetBtn.click();
    fixture.detectChanges();
    expect(component.searchInput).toBeNull();
    expect(component.selectedCategory).toEqual(0);
  });

  it('should send payload as per the category selected and the search input entered', () => {
    component.selectedCategory = 2;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(By.css('.spec-search-btn')).nativeElement;
    searchBtn.click();
    fixture.detectChanges();
    const mockSearchRequest = {
      groupId: '',
      searchString: 'sample search text',
      searchColumn: LocationField.LocationAccount,
      sortDescending: false,
      sortColumn: LocationField.LocationLabInfo,
      pageIndex: 1,
      pageSize: 20,
    };
    expect(component.locationSearchRequest).toEqual(mockSearchRequest);
  });

  it('should open update location form dialog on click on name of Lab', () => {
    expect(component.locations).toEqual(sampleLocation.locations);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
      expect(tableRows.length).toBe(20);
      const labIdentificationCell = tableRows[0].children[0];
      expect(labIdentificationCell.children[0].children[0].innerText).toEqual(sampleLocation.locations[0].labLocationName);
      const spy = spyOn(component, 'openLocationDetails').and.callThrough();
      fixture.detectChanges();
      labIdentificationCell.children[0].children[0].click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

});
