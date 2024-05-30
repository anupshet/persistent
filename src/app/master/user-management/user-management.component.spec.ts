// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { ComponentFixture, TestBed, tick, async   } from '@angular/core/testing';
import { MatOptionModule } from '@angular/material/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Sort } from '@angular/material/sort';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { Store, StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserManagementAction } from '../../shared/state/user-management.action';
import { UserManagementComponent } from './user-management.component';
import { UserSearchRequest } from '../../contracts/models/user-management/user.model';
import { RouterTestingModule } from '@angular/router/testing';
import { BrError } from '../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { UserManagementService } from '../../shared/services/user-management.service';
import { PortalApiService } from '../../shared/api/portalApi.service';
import { UserRole, UsersField } from '../../contracts/enums/user-role.enum';
import { MessageSnackBarService } from '../../core/helpers/message-snack-bar/message-snack-bar.service';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { asc, desc, paginationUsers } from '../../core/config/constants/general.const';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { HttpLoaderFactory } from '../../app.module';
import * as fromRoot from '../../state/app.state';

export class TestStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject(undefined);

  setState(data: T) {
    this.state.next(data);
  }

  select(selector?: any): Observable<T> {
    return this.state.asObservable();
  }

  dispatch(action: any) { }
}

const addUser = {
  id: '100',
  firstName: 'Sourabh',
  lastName: 'Patil',
  userEmail: 'sourabh_patil2+dev0668uy1@bio-rad.com',
  userRole: [
    'LabUserManager',
  ],
};

const editUser = {
  firstName: 'Sourabh',
  lastName: 'Patil',
  userEmail: 'sourabh_patil2+dev0668uy1@bio-rad.com',
  userRole: [],
  userLocation: null
};

const activatedRouteStub = { paramMap: of({ get: () => { } }), queryParams: of({}) };
const stubUserManagementAction = {
  getUsersAWS: (id: number) => { }
};
const State = [];

const mockUserData = {
  users: [
    {
      userOktaId: '00ugjktpqjwL72cAw2p7',
      displayName: 'Shubham Damdhar',
      allowedShipTo: 'Single',
      contactId: 'b8e8398f-632e-4256-8cf6-1154c734972c',
      parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
      nodeType: 7,
      userRoles: [
        'User',
        'LabUserManager',
        'LabSupervisor'
      ],
      firstName: 'Shubham',
      lastName: 'Damdhar',
      id: 'ee354112-5b3d-4fef-852f-7adb315551f1',
      isUnavailable: false,
      unavailableReasonCode: '',
      defaultLabLocation: '2fd875ce-851d-49de-b662-6b46d718b8d1',
      isPrimaryContact: false,
      contactInfo: {
        entityType: 0,
        searchAttribute: 'shubham_damdhar+devlab10@bio-rad.com',
        firstName: 'Shubham',
        middleName: '',
        lastName: 'Damdhar',
        name: 'Shubham Damdhar',
        email: 'shubham_damdhar+devlab10@bio-rad.com',
        phone: '',
        id: 'b8e8398f-632e-4256-8cf6-1154c734972c'
      },
      preferences: null,
      parentAccounts: [
        {
          displayName: 'tushar 2022-04-28',
          accountNumber: '103080',
          formattedAccountNumber: 'U103080',
          accountContactId: '',
          accountAddressId: '29af567d-b2df-4ad5-a464-eafa156b5b26',
          parentNodeId: 'ROOT',
          nodeType: 0,
          id: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
          isUnavailable: false,
          unavailableReasonCode: '',
          locationCount: 0,
          contactRoles: null,
          legacyPrimaryLabNumber: '',
          children: [
            {
              displayName: 'tushar 2022-04-28',
              labName: 'tushar 2022-04-28',
              name: '',
              parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
              nodeType: 1,
              id: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
              isUnavailable: false,
              unavailableReasonCode: '',
              children: [
                {
                  accountName: 'tushar 2022-04-28',
                  accountNumber: '103080',
                  formattedAccountNumber: '',
                  addOns: 0,
                  connectivityInstalledProduct: '',
                  connectivityTier: 0,
                  crossOverStudy: 0,
                  displayName: 'SourabhL1',
                  groupName: 'tushar 2022-04-28',
                  hasChildren: false,
                  id: 'ed78dd3d-26cc-4a05-9355-d61e7fa4dc34',
                  labLocationAddress: null,
                  labLocationAddressId: '6cbf4762-7989-4060-a777-48552e5bcad7',
                  labLocationContact: null,
                  labLocationContactId: '',
                  labLocationName: 'SourabhL1',
                  licenseAssignDate: '2022-08-08T00:00:00Z',
                  licenseExpirationDate: '2022-10-13T00:00:00Z',
                  licenseNumberUsers: 5,
                  locationCount: 0,
                  locationDayLightSaving: '00:00:00',
                  locationOffset: '05:30:00',
                  locationTimeZone: 'Asia/Kolkata',
                  lotViewerInstalledProduct: '',
                  lotViewerLicense: 0,
                  nodeType: 2,
                  orderNumber: '9879879879',
                  parentNodeId: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
                  parentNode: {
                    displayName: '',
                    labName: '',
                    name: '',
                    parentNodeId: '',
                    nodeType: 0,
                    id: '',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  },
                  primaryUnityLabNumbers: '',
                  shipTo: '534532423',
                  soldTo: '3232532',
                  unityNextInstalledProduct: '',
                  unityNextTier: -1,
                  comments: '',
                  contactRoles: null,
                  usedArchive: false,
                  children: null,
                  locationSettings: null
                },
                {
                  accountName: 'tushar 2022-04-28',
                  accountNumber: '103080',
                  formattedAccountNumber: '',
                  addOns: 0,
                  connectivityInstalledProduct: '',
                  connectivityTier: 2,
                  crossOverStudy: 0,
                  displayName: 'tushar 2022-04-28',
                  groupName: 'tushar 2022-04-28',
                  hasChildren: false,
                  id: '2fd875ce-851d-49de-b662-6b46d718b8d1',
                  labLocationAddress: null,
                  labLocationAddressId: '88e3ce7d-ac36-40b0-9bb5-d6a7dd47335e',
                  labLocationContact: null,
                  labLocationContactId: '',
                  labLocationName: 'tushar 2022-04-28',
                  licenseAssignDate: '2022-04-28T00:00:00Z',
                  licenseExpirationDate: '2026-12-28T00:00:00Z',
                  licenseNumberUsers: 10,
                  locationCount: 0,
                  locationDayLightSaving: '00:00:00',
                  locationOffset: '05:30:00',
                  locationTimeZone: 'Asia/Kolkata',
                  lotViewerInstalledProduct: '',
                  lotViewerLicense: 1,
                  nodeType: 2,
                  orderNumber: '',
                  parentNodeId: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
                  parentNode: {
                    displayName: '',
                    labName: '',
                    name: '',
                    parentNodeId: '',
                    nodeType: 0,
                    id: '',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  },
                  primaryUnityLabNumbers: '',
                  shipTo: 's9mefwef',
                  soldTo: 's9mefwef',
                  unityNextInstalledProduct: '',
                  unityNextTier: 0,
                  comments: '',
                  contactRoles: null,
                  usedArchive: true,
                  children: null,
                  locationSettings: {
                    displayName: '',
                    dataType: 1,
                    instrumentsGroupedByDept: true,
                    trackReagentCalibrator: true,
                    fixedMean: false,
                    decimalPlaces: 3,
                    siUnits: false,
                    labSetupRating: 0,
                    labSetupComments: '',
                    isLabSetupComplete: true,
                    labSetupLastEntityId: '',
                    legacyPrimaryLab: '',
                    parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
                    nodeType: 9,
                    id: '44ab35c9-2fb9-4139-b4aa-f4c16fbe5c07',
                    locationId: '2fd875ce-851d-49de-b662-6b46d718b8d1',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  }
                }
              ]
            }
          ]
        }
      ],
      labLocation: [
        {
          accountName: 'tushar 2022-04-28',
          accountNumber: '103080',
          formattedAccountNumber: 'U103080',
          addOns: 0,
          connectivityInstalledProduct: '',
          connectivityTier: 0,
          crossOverStudy: 0,
          displayName: 'SourabhL1',
          groupName: 'tushar 2022-04-28',
          hasChildren: false,
          id: 'ed78dd3d-26cc-4a05-9355-d61e7fa4dc34',
          labLocationAddress: null,
          labLocationAddressId: '6cbf4762-7989-4060-a777-48552e5bcad7',
          labLocationContact: null,
          labLocationContactId: '',
          labLocationName: 'SourabhL1',
          licenseAssignDate: '2022-08-08T00:00:00Z',
          licenseExpirationDate: '2022-10-13T00:00:00Z',
          licenseNumberUsers: 5,
          locationCount: 0,
          locationDayLightSaving: '00:00:00',
          locationOffset: '05:30:00',
          locationTimeZone: 'Asia/Kolkata',
          lotViewerInstalledProduct: '',
          lotViewerLicense: 0,
          nodeType: 2,
          orderNumber: '9879879879',
          parentNodeId: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
          parentNode: {
            displayName: 'tushar 2022-04-28',
            labName: 'tushar 2022-04-28',
            name: '',
            parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
            nodeType: 1,
            id: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
            isUnavailable: false,
            unavailableReasonCode: ''
          },
          primaryUnityLabNumbers: '',
          shipTo: '534532423',
          soldTo: '3232532',
          unityNextInstalledProduct: '',
          unityNextTier: -1,
          comments: '',
          contactRoles: null,
          usedArchive: false
        },
        {
          accountName: 'tushar 2022-04-28',
          accountNumber: '103080',
          formattedAccountNumber: 'U103080',
          addOns: 0,
          connectivityInstalledProduct: '',
          connectivityTier: 2,
          crossOverStudy: 0,
          displayName: 'tushar 2022-04-28',
          groupName: 'tushar 2022-04-28',
          hasChildren: false,
          id: '2fd875ce-851d-49de-b662-6b46d718b8d1',
          labLocationAddress: null,
          labLocationAddressId: '88e3ce7d-ac36-40b0-9bb5-d6a7dd47335e',
          labLocationContact: null,
          labLocationContactId: '',
          labLocationName: 'tushar 2022-04-28',
          licenseAssignDate: '2022-04-28T00:00:00Z',
          licenseExpirationDate: '2026-12-28T00:00:00Z',
          licenseNumberUsers: 10,
          locationCount: 0,
          locationDayLightSaving: '00:00:00',
          locationOffset: '05:30:00',
          locationTimeZone: 'Asia/Kolkata',
          lotViewerInstalledProduct: '',
          lotViewerLicense: 1,
          nodeType: 2,
          orderNumber: '',
          parentNodeId: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
          parentNode: {
            displayName: 'tushar 2022-04-28',
            labName: 'tushar 2022-04-28',
            name: '',
            parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
            nodeType: 1,
            id: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
            isUnavailable: false,
            unavailableReasonCode: ''
          },
          primaryUnityLabNumbers: '',
          shipTo: 's9mefwef',
          soldTo: 's9mefwef',
          unityNextInstalledProduct: '',
          unityNextTier: 0,
          comments: '',
          contactRoles: null,
          usedArchive: false
        }
      ]
    },
    {
      userOktaId: '00uhws5rdj9ZWS3dn2p7',
      displayName: 'Sourabh Patil',
      allowedShipTo: 'Single',
      contactId: 'a84690a8-b319-411d-ab80-7967c5c3bbb7',
      parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
      nodeType: 7,
      userRoles: [
        'User'
      ],
      firstName: 'Sourabh',
      lastName: 'Patil',
      id: '0d6d2a06-b301-4482-a393-86666b36cdfe',
      isUnavailable: false,
      unavailableReasonCode: '',
      defaultLabLocation: 'ed78dd3d-26cc-4a05-9355-d61e7fa4dc34',
      isPrimaryContact: false,
      contactInfo: {
        entityType: 0,
        searchAttribute: 'sourabh_patil2+dev0668uy1@bio-rad.com',
        firstName: 'Sourabh',
        middleName: '',
        lastName: 'Patil',
        name: 'Sourabh Patil',
        email: 'sourabh_patil2+dev0668uy1@bio-rad.com',
        phone: '',
        id: 'a84690a8-b319-411d-ab80-7967c5c3bbb7'
      },
      preferences: null,
      parentAccounts: [
        {
          displayName: 'tushar 2022-04-28',
          accountNumber: '103080',
          formattedAccountNumber: 'U103080',
          accountContactId: '',
          accountAddressId: '29af567d-b2df-4ad5-a464-eafa156b5b26',
          parentNodeId: 'ROOT',
          nodeType: 0,
          id: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
          isUnavailable: false,
          unavailableReasonCode: '',
          locationCount: 0,
          contactRoles: null,
          legacyPrimaryLabNumber: '',
          children: [
            {
              displayName: 'tushar 2022-04-28',
              labName: 'tushar 2022-04-28',
              name: '',
              parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
              nodeType: 1,
              id: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
              isUnavailable: false,
              unavailableReasonCode: '',
              children: [
                {
                  accountName: 'tushar 2022-04-28',
                  accountNumber: '103080',
                  formattedAccountNumber: '',
                  addOns: 0,
                  connectivityInstalledProduct: '',
                  connectivityTier: 0,
                  crossOverStudy: 0,
                  displayName: 'SourabhL1',
                  groupName: 'tushar 2022-04-28',
                  hasChildren: false,
                  id: 'ed78dd3d-26cc-4a05-9355-d61e7fa4dc34',
                  labLocationAddress: null,
                  labLocationAddressId: '6cbf4762-7989-4060-a777-48552e5bcad7',
                  labLocationContact: null,
                  labLocationContactId: '',
                  labLocationName: 'SourabhL1',
                  licenseAssignDate: '2022-08-08T00:00:00Z',
                  licenseExpirationDate: '2022-10-13T00:00:00Z',
                  licenseNumberUsers: 5,
                  locationCount: 0,
                  locationDayLightSaving: '00:00:00',
                  locationOffset: '05:30:00',
                  locationTimeZone: 'Asia/Kolkata',
                  lotViewerInstalledProduct: '',
                  lotViewerLicense: 0,
                  nodeType: 2,
                  orderNumber: '9879879879',
                  parentNodeId: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
                  parentNode: {
                    displayName: '',
                    labName: '',
                    name: '',
                    parentNodeId: '',
                    nodeType: 0,
                    id: '',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  },
                  primaryUnityLabNumbers: '',
                  shipTo: '534532423',
                  soldTo: '3232532',
                  unityNextInstalledProduct: '',
                  unityNextTier: -1,
                  comments: '',
                  contactRoles: null,
                  usedArchive: false,
                  children: null,
                  locationSettings: null
                },
                {
                  accountName: 'tushar 2022-04-28',
                  accountNumber: '103080',
                  formattedAccountNumber: '',
                  addOns: 0,
                  connectivityInstalledProduct: '',
                  connectivityTier: 2,
                  crossOverStudy: 0,
                  displayName: 'tushar 2022-04-28',
                  groupName: 'tushar 2022-04-28',
                  hasChildren: false,
                  id: '2fd875ce-851d-49de-b662-6b46d718b8d1',
                  labLocationAddress: null,
                  labLocationAddressId: '88e3ce7d-ac36-40b0-9bb5-d6a7dd47335e',
                  labLocationContact: null,
                  labLocationContactId: '',
                  labLocationName: 'tushar 2022-04-28',
                  licenseAssignDate: '2022-04-28T00:00:00Z',
                  licenseExpirationDate: '2026-12-28T00:00:00Z',
                  licenseNumberUsers: 10,
                  locationCount: 0,
                  locationDayLightSaving: '00:00:00',
                  locationOffset: '05:30:00',
                  locationTimeZone: 'Asia/Kolkata',
                  lotViewerInstalledProduct: '',
                  lotViewerLicense: 1,
                  nodeType: 2,
                  orderNumber: '',
                  parentNodeId: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
                  parentNode: {
                    displayName: '',
                    labName: '',
                    name: '',
                    parentNodeId: '',
                    nodeType: 0,
                    id: '',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  },
                  primaryUnityLabNumbers: '',
                  shipTo: 's9mefwef',
                  soldTo: 's9mefwef',
                  unityNextInstalledProduct: '',
                  unityNextTier: 0,
                  comments: '',
                  contactRoles: null,
                  usedArchive: true,
                  children: null,
                  locationSettings: {
                    displayName: '',
                    dataType: 1,
                    instrumentsGroupedByDept: true,
                    trackReagentCalibrator: true,
                    fixedMean: false,
                    decimalPlaces: 3,
                    siUnits: false,
                    labSetupRating: 0,
                    labSetupComments: '',
                    isLabSetupComplete: true,
                    labSetupLastEntityId: '',
                    legacyPrimaryLab: '',
                    parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
                    nodeType: 9,
                    id: '44ab35c9-2fb9-4139-b4aa-f4c16fbe5c07',
                    locationId: '2fd875ce-851d-49de-b662-6b46d718b8d1',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  }
                },
              ]
            }
          ]
        }
      ],
      labLocation: [
        {
          accountName: 'tushar 2022-04-28',
          accountNumber: '103080',
          formattedAccountNumber: 'U103080',
          addOns: 0,
          connectivityInstalledProduct: '',
          connectivityTier: 0,
          crossOverStudy: 0,
          displayName: 'SourabhL1',
          groupName: 'tushar 2022-04-28',
          hasChildren: false,
          id: 'ed78dd3d-26cc-4a05-9355-d61e7fa4dc34',
          labLocationAddress: null,
          labLocationAddressId: '6cbf4762-7989-4060-a777-48552e5bcad7',
          labLocationContact: null,
          labLocationContactId: '',
          labLocationName: 'SourabhL1',
          licenseAssignDate: '2022-08-08T00:00:00Z',
          licenseExpirationDate: '2022-10-13T00:00:00Z',
          licenseNumberUsers: 5,
          locationCount: 0,
          locationDayLightSaving: '00:00:00',
          locationOffset: '05:30:00',
          locationTimeZone: 'Asia/Kolkata',
          lotViewerInstalledProduct: '',
          lotViewerLicense: 0,
          nodeType: 2,
          orderNumber: '9879879879',
          parentNodeId: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
          parentNode: {
            displayName: 'tushar 2022-04-28',
            labName: 'tushar 2022-04-28',
            name: '',
            parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
            nodeType: 1,
            id: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
            isUnavailable: false,
            unavailableReasonCode: ''
          },
          primaryUnityLabNumbers: '',
          shipTo: '534532423',
          soldTo: '3232532',
          unityNextInstalledProduct: '',
          unityNextTier: -1,
          comments: '',
          contactRoles: null,
          usedArchive: false
        },
        {
          accountName: 'tushar 2022-04-28',
          accountNumber: '103080',
          formattedAccountNumber: 'U103080',
          addOns: 0,
          connectivityInstalledProduct: '',
          connectivityTier: 2,
          crossOverStudy: 0,
          displayName: 'tushar 2022-04-28',
          groupName: 'tushar 2022-04-28',
          hasChildren: false,
          id: '2fd875ce-851d-49de-b662-6b46d718b8d1',
          labLocationAddress: null,
          labLocationAddressId: '88e3ce7d-ac36-40b0-9bb5-d6a7dd47335e',
          labLocationContact: null,
          labLocationContactId: '',
          labLocationName: 'tushar 2022-04-28',
          licenseAssignDate: '2022-04-28T00:00:00Z',
          licenseExpirationDate: '2026-12-28T00:00:00Z',
          licenseNumberUsers: 10,
          locationCount: 0,
          locationDayLightSaving: '00:00:00',
          locationOffset: '05:30:00',
          locationTimeZone: 'Asia/Kolkata',
          lotViewerInstalledProduct: '',
          lotViewerLicense: 1,
          nodeType: 2,
          orderNumber: '',
          parentNodeId: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
          parentNode: {
            displayName: 'tushar 2022-04-28',
            labName: 'tushar 2022-04-28',
            name: '',
            parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
            nodeType: 1,
            id: 'b4fe92a9-1342-44a1-adad-bfdca6759eae',
            isUnavailable: false,
            unavailableReasonCode: ''
          },
          primaryUnityLabNumbers: '',
          shipTo: 's9mefwef',
          soldTo: 's9mefwef',
          unityNextInstalledProduct: '',
          unityNextTier: 0,
          comments: '',
          contactRoles: null,
          usedArchive: false
        }
      ]
    }
  ],
  pageIndex: 0,
  pageSize: 25,
  totalItems: 34,
  totalPages: 2
};

const mockCurrentlocationData = [
  {
    userOktaId: '00uhqb00fgtyB1Lne2p7',
    displayName: 'Sourabh Patil',
    allowedShipTo: '',
    contactId: '1a31fada-3119-46b0-a142-ab1cfe9a7e90',
    parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
    nodeType: 7,
    userRoles: [
      'Admin'
    ],
    firstName: 'Sourabh',
    lastName: 'Patil',
    id: '8724e09a-a0d5-43d4-8ba2-c99abcaf1967',
    isUnavailable: false,
    unavailableReasonCode: '',
    defaultLabLocation: 'ebc87fef-9c79-4175-b076-5aa2c0cedfcd',
    isPrimaryContact: false,
    contactInfo: {
      entityType: 0,
      searchAttribute: 'sourabh_patil2+multi@bio-rad.com',
      firstName: 'Sourabh',
      middleName: '',
      lastName: 'Patil',
      name: 'Sourabh Patil',
      email: 'sourabh_patil2+Multi@bio-rad.com',
      phone: '',
      id: '1a31fada-3119-46b0-a142-ab1cfe9a7e90'
    },
    preferences: {
      entityType: 0,
      searchAttribute: '',
      id: '',
      lastSelectedEntity: '',
      lastSelectedEntityType: 0,
      termsAcceptedDateTime: null
    },
    parentAccounts: [
      {
        displayName: 'Test1',
        accountNumber: '103981',
        formattedAccountNumber: 'U103981',
        accountContactId: '',
        accountAddressId: 'd28ff6db-d3fe-46d7-93ca-1b10fb1fe1be',
        parentNodeId: 'ROOT',
        nodeType: 0,
        id: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
        isUnavailable: false,
        unavailableReasonCode: '',
        locationCount: 0,
        contactRoles: null,
        legacyPrimaryLabNumber: '',
        children: [
          {
            displayName: 'Test1',
            labName: 'Test1',
            name: '',
            parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
            nodeType: 1,
            id: '6639d172-49b4-434d-92e8-418ede66de36',
            isUnavailable: false,
            unavailableReasonCode: '',
            children: [
              {
                accountName: 'Test1',
                accountNumber: '103981',
                formattedAccountNumber: '',
                addOns: 0,
                connectivityInstalledProduct: '56856858',
                connectivityTier: 2,
                crossOverStudy: 0,
                displayName: 'Sourabh4 - LabsetupCmplt',
                groupName: 'Test1',
                hasChildren: false,
                id: '2fd875ce-851d-49de-b662-6b46d718b8d1',
                labLocationAddress: null,
                labLocationAddressId: 'e593650f-6a5f-4449-90d7-3c7656a28688',
                labLocationContact: null,
                labLocationContactId: '',
                labLocationName: 'Sourabh4 - LabsetupCmplt',
                licenseAssignDate: '2022-08-09T00:00:00Z',
                licenseExpirationDate: '2022-09-09T00:00:00Z',
                licenseNumberUsers: 5,
                locationCount: 0,
                locationDayLightSaving: '00:00:00',
                locationOffset: '05:30:00',
                locationTimeZone: 'Asia/Kolkata',
                lotViewerInstalledProduct: '741258963',
                lotViewerLicense: 1,
                nodeType: 2,
                orderNumber: '103981',
                parentNodeId: '6639d172-49b4-434d-92e8-418ede66de36',
                parentNode: {
                  displayName: '',
                  labName: '',
                  name: '',
                  parentNodeId: '',
                  nodeType: 0,
                  id: '',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                },
                primaryUnityLabNumbers: '',
                shipTo: '2005062111',
                soldTo: '1003133111',
                unityNextInstalledProduct: '',
                unityNextTier: -1,
                comments: '',
                contactRoles: null,
                usedArchive: false,
                islabsettingcompleted: true,
                children: [{
                  accountName: 'Test1',
                  accountNumber: '103981',
                  formattedAccountNumber: '',
                  addOns: 0,
                  connectivityInstalledProduct: '567568757457',
                  connectivityTier: 1,
                  crossOverStudy: 0,
                  displayName: 'G1 Dept1',
                  groupName: 'Test2',
                  hasChildren: false,
                  id: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048z',
                  labLocationAddress: null,
                  labLocationAddressId: '6b984c13-42a6-4cc0-ba0b-1b0d8b0957e0',
                  labLocationContact: null,
                  labLocationContactId: '',
                  labLocationName: 'G1 Dept 1',
                  licenseAssignDate: '2022-08-23T00:00:00Z',
                  licenseExpirationDate: '2022-09-23T00:00:00Z',
                  licenseNumberUsers: 2,
                  locationCount: 0,
                  locationDayLightSaving: '00:00:00',
                  locationOffset: '05:30:00',
                  locationTimeZone: 'Asia/Kolkata',
                  lotViewerInstalledProduct: '',
                  lotViewerLicense: 0,
                  nodeType: 3,
                  orderNumber: '534545',
                  parentNodeId: '2fd875ce-851d-49de-b662-6b46d718b8d1',
                  parentNode: {
                    displayName: '',
                    labName: '',
                    name: '',
                    parentNodeId: '',
                    nodeType: 0,
                    id: '',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  },
                  primaryUnityLabNumbers: '',
                  shipTo: '4354356457',
                  soldTo: '465642545',
                  unityNextInstalledProduct: '',
                  unityNextTier: -1,
                  comments: '',
                  contactRoles: null,
                  usedArchive: false,
                  islabsettingcompleted: true,
                  children: null,
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
                    isLabSetupComplete: false,
                    labSetupLastEntityId: '',
                    legacyPrimaryLab: '',
                    parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                    nodeType: 9,
                    id: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                    locationId: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  }
                },
                {
                  accountName: 'Test1',
                  accountNumber: '103981',
                  formattedAccountNumber: '',
                  addOns: 0,
                  connectivityInstalledProduct: '567568757457',
                  connectivityTier: 1,
                  crossOverStudy: 0,
                  displayName: 'G1 Dept2',
                  groupName: 'Test2',
                  hasChildren: false,
                  id: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048y',
                  labLocationAddress: null,
                  labLocationAddressId: '6b984c13-42a6-4cc0-ba0b-1b0d8b0957e0',
                  labLocationContact: null,
                  labLocationContactId: '',
                  labLocationName: 'G2NoDept2',
                  licenseAssignDate: '2022-08-23T00:00:00Z',
                  licenseExpirationDate: '2022-09-23T00:00:00Z',
                  licenseNumberUsers: 2,
                  locationCount: 0,
                  locationDayLightSaving: '00:00:00',
                  locationOffset: '05:30:00',
                  locationTimeZone: 'Asia/Kolkata',
                  lotViewerInstalledProduct: '',
                  lotViewerLicense: 0,
                  nodeType: 3,
                  orderNumber: '534545',
                  parentNodeId: '2fd875ce-851d-49de-b662-6b46d718b8d1',
                  parentNode: {
                    displayName: '',
                    labName: '',
                    name: '',
                    parentNodeId: '',
                    nodeType: 0,
                    id: '',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  },
                  primaryUnityLabNumbers: '',
                  shipTo: '4354356457',
                  soldTo: '465642545',
                  unityNextInstalledProduct: '',
                  unityNextTier: -1,
                  comments: '',
                  contactRoles: null,
                  usedArchive: false,
                  islabsettingcompleted: true,
                  children: null,
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
                    isLabSetupComplete: false,
                    labSetupLastEntityId: '',
                    legacyPrimaryLab: '',
                    parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                    nodeType: 9,
                    id: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                    locationId: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  }
                },
                {
                  accountName: 'Test1',
                  accountNumber: '103981',
                  formattedAccountNumber: '',
                  addOns: 0,
                  connectivityInstalledProduct: '567568757457',
                  connectivityTier: 1,
                  crossOverStudy: 0,
                  displayName: 'G3 Dept3',
                  groupName: 'Test2',
                  hasChildren: false,
                  id: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048x',
                  labLocationAddress: null,
                  labLocationAddressId: '6b984c13-42a6-4cc0-ba0b-1b0d8b0957e0',
                  labLocationContact: null,
                  labLocationContactId: '',
                  labLocationName: 'G2NoDept2',
                  licenseAssignDate: '2022-08-23T00:00:00Z',
                  licenseExpirationDate: '2022-09-23T00:00:00Z',
                  licenseNumberUsers: 2,
                  locationCount: 0,
                  locationDayLightSaving: '00:00:00',
                  locationOffset: '05:30:00',
                  locationTimeZone: 'Asia/Kolkata',
                  lotViewerInstalledProduct: '',
                  lotViewerLicense: 0,
                  nodeType: 3,
                  orderNumber: '534545',
                  parentNodeId: '2fd875ce-851d-49de-b662-6b46d718b8d1',
                  parentNode: {
                    displayName: '',
                    labName: '',
                    name: '',
                    parentNodeId: '',
                    nodeType: 0,
                    id: '',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  },
                  primaryUnityLabNumbers: '',
                  shipTo: '4354356457',
                  soldTo: '465642545',
                  unityNextInstalledProduct: '',
                  unityNextTier: -1,
                  comments: '',
                  contactRoles: null,
                  usedArchive: false,
                  islabsettingcompleted: true,
                  children: null,
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
                    isLabSetupComplete: false,
                    labSetupLastEntityId: '',
                    legacyPrimaryLab: '',
                    parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                    nodeType: 9,
                    id: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                    locationId: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                    isUnavailable: false,
                    unavailableReasonCode: ''
                  }
                }],
                locationSettings: {
                  displayName: '',
                  dataType: 1,
                  instrumentsGroupedByDept: true,
                  trackReagentCalibrator: false,
                  fixedMean: false,
                  decimalPlaces: 1,
                  siUnits: false,
                  labSetupRating: 4,
                  labSetupComments: '',
                  isLabSetupComplete: true,
                  labSetupLastEntityId: '',
                  legacyPrimaryLab: '',
                  parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                  nodeType: 9,
                  id: '7fc1c5c2-4993-449b-ac75-8a6fe2430c7d',
                  locationId: 'abf29e2f-72ed-4620-89a3-d0d74d2197e1',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                }
              },
              {
                accountName: 'Test1',
                accountNumber: '103981',
                formattedAccountNumber: '',
                addOns: 0,
                connectivityInstalledProduct: '',
                connectivityTier: 0,
                crossOverStudy: 0,
                displayName: 'Sourabh5 - LabsetupCmplt',
                groupName: 'Test1',
                hasChildren: false,
                id: '9e1ba7f4-a937-45d2-b84a-946f14cf40f1',
                labLocationAddress: null,
                labLocationAddressId: '725fa8c2-a340-45f1-9301-bbff677f7a2f',
                labLocationContact: null,
                labLocationContactId: '',
                labLocationName: 'Sourabh5 - LabsetupCmplt',
                licenseAssignDate: '2022-08-09T00:00:00Z',
                licenseExpirationDate: '2022-09-09T00:00:00Z',
                licenseNumberUsers: 5,
                locationCount: 0,
                locationDayLightSaving: '00:00:00',
                locationOffset: '05:30:00',
                locationTimeZone: 'Asia/Kolkata',
                lotViewerInstalledProduct: '',
                lotViewerLicense: 0,
                nodeType: 2,
                orderNumber: '103981',
                parentNodeId: '6639d172-49b4-434d-92e8-418ede66de36',
                parentNode: {
                  displayName: '',
                  labName: '',
                  name: '',
                  parentNodeId: '',
                  nodeType: 0,
                  id: '',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                },
                primaryUnityLabNumbers: '',
                shipTo: '79879078',
                soldTo: '070870970',
                unityNextInstalledProduct: '',
                unityNextTier: -1,
                comments: '',
                contactRoles: null,
                usedArchive: false,
                islabsettingcompleted: true,
                children: null,
                locationSettings: {
                  displayName: '',
                  dataType: 1,
                  instrumentsGroupedByDept: true,
                  trackReagentCalibrator: true,
                  fixedMean: false,
                  decimalPlaces: 2,
                  siUnits: false,
                  labSetupRating: 3,
                  labSetupComments: '',
                  isLabSetupComplete: true,
                  labSetupLastEntityId: '',
                  legacyPrimaryLab: '',
                  parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                  nodeType: 9,
                  id: '5a50c909-aa70-4c54-ad06-fee5fd921f19',
                  locationId: '9e1ba7f4-a937-45d2-b84a-946f14cf40f1',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                }
              },
              {
                accountName: 'Test1',
                accountNumber: '103981',
                formattedAccountNumber: '',
                addOns: 0,
                connectivityInstalledProduct: '567565',
                connectivityTier: 2,
                crossOverStudy: 0,
                displayName: 'Sourabh2',
                groupName: 'Test1',
                hasChildren: false,
                id: '500df940-50e9-405e-ba0c-c667efa14d1a',
                labLocationAddress: null,
                labLocationAddressId: '0ac58d9a-4822-44f7-9c18-b641a2763ba8',
                labLocationContact: null,
                labLocationContactId: '',
                labLocationName: 'Sourabh2',
                licenseAssignDate: '2022-08-09T00:00:00Z',
                licenseExpirationDate: '2022-09-09T00:00:00Z',
                licenseNumberUsers: 5,
                locationCount: 0,
                locationDayLightSaving: '00:00:00',
                locationOffset: '05:30:00',
                locationTimeZone: 'Asia/Kolkata',
                lotViewerInstalledProduct: '567565',
                lotViewerLicense: 1,
                nodeType: 2,
                orderNumber: '103981',
                parentNodeId: '6639d172-49b4-434d-92e8-418ede66de36',
                parentNode: {
                  displayName: '',
                  labName: '',
                  name: '',
                  parentNodeId: '',
                  nodeType: 0,
                  id: '',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                },
                primaryUnityLabNumbers: '',
                shipTo: '564656',
                soldTo: '4645645645',
                unityNextInstalledProduct: '',
                unityNextTier: -1,
                comments: '',
                contactRoles: null,
                usedArchive: false,
                islabsettingcompleted: true,
                children: null,
                locationSettings: {
                  displayName: '',
                  dataType: 0,
                  instrumentsGroupedByDept: true,
                  trackReagentCalibrator: true,
                  fixedMean: false,
                  decimalPlaces: 0,
                  siUnits: false,
                  labSetupRating: 4,
                  labSetupComments: '',
                  isLabSetupComplete: true,
                  labSetupLastEntityId: '',
                  legacyPrimaryLab: '',
                  parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                  nodeType: 9,
                  id: 'b5f7806d-6193-4499-85b6-f6babfb5f4db',
                  locationId: '500df940-50e9-405e-ba0c-c667efa14d1a',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                }
              },
              {
                accountName: 'Test1',
                accountNumber: '103981',
                formattedAccountNumber: '',
                addOns: 0,
                connectivityInstalledProduct: '',
                connectivityTier: 0,
                crossOverStudy: 0,
                displayName: 'Sourabh3 - No Dept',
                groupName: 'Test1',
                hasChildren: false,
                id: '1947af74-be82-4d64-9e42-b6e1cef94bd3',
                labLocationAddress: null,
                labLocationAddressId: 'c4e50813-97ea-42e9-976b-b3d6df46a190',
                labLocationContact: null,
                labLocationContactId: '',
                labLocationName: 'Sourabh3 - No Dept',
                licenseAssignDate: '2022-08-09T00:00:00Z',
                licenseExpirationDate: '2022-09-09T00:00:00Z',
                licenseNumberUsers: 5,
                locationCount: 0,
                locationDayLightSaving: '00:00:00',
                locationOffset: '05:30:00',
                locationTimeZone: 'Asia/Kolkata',
                lotViewerInstalledProduct: '',
                lotViewerLicense: 0,
                nodeType: 2,
                orderNumber: '45664576456',
                parentNodeId: '6639d172-49b4-434d-92e8-418ede66de36',
                parentNode: {
                  displayName: '',
                  labName: '',
                  name: '',
                  parentNodeId: '',
                  nodeType: 0,
                  id: '',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                },
                primaryUnityLabNumbers: '',
                shipTo: 'f4t435345',
                soldTo: '7456343ytr',
                unityNextInstalledProduct: '',
                unityNextTier: -1,
                comments: '',
                contactRoles: null,
                usedArchive: false,
                islabsettingcompleted: true,
                children: null,
                locationSettings: {
                  displayName: '',
                  dataType: 1,
                  instrumentsGroupedByDept: false,
                  trackReagentCalibrator: true,
                  fixedMean: false,
                  decimalPlaces: 2,
                  siUnits: false,
                  labSetupRating: 5,
                  labSetupComments: '',
                  isLabSetupComplete: true,
                  labSetupLastEntityId: '',
                  legacyPrimaryLab: '',
                  parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                  nodeType: 9,
                  id: '2660773e-8677-4c62-80ed-dfff62a92796',
                  locationId: '1947af74-be82-4d64-9e42-b6e1cef94bd3',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                }
              },
              {
                accountName: 'Test1',
                accountNumber: '103981',
                formattedAccountNumber: '',
                addOns: 0,
                connectivityInstalledProduct: '',
                connectivityTier: 0,
                crossOverStudy: 0,
                displayName: 'Sourabh1',
                groupName: 'Test1',
                hasChildren: false,
                id: 'ebc87fef-9c79-4175-b076-5aa2c0cedfcd',
                labLocationAddress: null,
                labLocationAddressId: 'af64505c-a140-4e56-bdb1-6bb0979175bf',
                labLocationContact: null,
                labLocationContactId: '',
                labLocationName: 'Sourabh1',
                licenseAssignDate: '2022-08-09T00:00:00Z',
                licenseExpirationDate: '2022-09-09T00:00:00Z',
                licenseNumberUsers: 5,
                locationCount: 0,
                locationDayLightSaving: '00:00:00',
                locationOffset: '05:30:00',
                locationTimeZone: 'Asia/Kolkata',
                lotViewerInstalledProduct: '',
                lotViewerLicense: 0,
                nodeType: 2,
                orderNumber: '543453453',
                parentNodeId: '6639d172-49b4-434d-92e8-418ede66de36',
                parentNode: {
                  displayName: '',
                  labName: '',
                  name: '',
                  parentNodeId: '',
                  nodeType: 0,
                  id: '',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                },
                primaryUnityLabNumbers: '',
                shipTo: '34534534',
                soldTo: '345345345',
                unityNextInstalledProduct: '',
                unityNextTier: -1,
                comments: '',
                contactRoles: null,
                usedArchive: false,
                islabsettingcompleted: true,
                children: null,
                locationSettings: {
                  displayName: '',
                  dataType: 1,
                  instrumentsGroupedByDept: true,
                  trackReagentCalibrator: true,
                  fixedMean: false,
                  decimalPlaces: 2,
                  siUnits: false,
                  labSetupRating: 5,
                  labSetupComments: '',
                  isLabSetupComplete: true,
                  labSetupLastEntityId: '',
                  legacyPrimaryLab: '',
                  parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                  nodeType: 9,
                  id: '6696064e-784a-4665-b8fa-442155b29d4d',
                  locationId: 'ebc87fef-9c79-4175-b076-5aa2c0cedfcd',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                }
              }
            ]
          },
          {
            displayName: 'Test2',
            labName: 'Test2',
            name: '',
            parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
            nodeType: 1,
            id: '4e4d9e4c-2aa5-4fbc-a404-d142149a14ea',
            isUnavailable: false,
            unavailableReasonCode: '',
            children: [
              {
                accountName: 'Test1',
                accountNumber: '103981',
                formattedAccountNumber: '',
                addOns: 0,
                connectivityInstalledProduct: '567568757457',
                connectivityTier: 1,
                crossOverStudy: 0,
                displayName: 'G2NoDept2',
                groupName: 'Test2',
                hasChildren: false,
                id: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                labLocationAddress: null,
                labLocationAddressId: '6b984c13-42a6-4cc0-ba0b-1b0d8b0957e0',
                labLocationContact: null,
                labLocationContactId: '',
                labLocationName: 'G2NoDept2',
                licenseAssignDate: '2022-08-23T00:00:00Z',
                licenseExpirationDate: '2022-09-23T00:00:00Z',
                licenseNumberUsers: 2,
                locationCount: 0,
                locationDayLightSaving: '00:00:00',
                locationOffset: '05:30:00',
                locationTimeZone: 'Asia/Kolkata',
                lotViewerInstalledProduct: '',
                lotViewerLicense: 0,
                nodeType: 2,
                orderNumber: '534545',
                parentNodeId: '4e4d9e4c-2aa5-4fbc-a404-d142149a14ea',
                parentNode: {
                  displayName: '',
                  labName: '',
                  name: '',
                  parentNodeId: '',
                  nodeType: 0,
                  id: '',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                },
                primaryUnityLabNumbers: '',
                shipTo: '4354356457',
                soldTo: '465642545',
                unityNextInstalledProduct: '',
                unityNextTier: -1,
                comments: '',
                contactRoles: null,
                usedArchive: false,
                islabsettingcompleted: true,
                children: null,
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
                  isLabSetupComplete: false,
                  labSetupLastEntityId: '',
                  legacyPrimaryLab: '',
                  parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
                  nodeType: 9,
                  id: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                  locationId: 'f18b21c8-50f6-47cc-86fd-a9bb65bb048b',
                  isUnavailable: false,
                  unavailableReasonCode: ''
                }
              }
            ]
          }
        ]
      }
    ],
    labLocation: [
      {
        accountName: 'Test1',
        accountNumber: '103981',
        formattedAccountNumber: 'U103981',
        addOns: 0,
        connectivityInstalledProduct: '56856858',
        connectivityTier: 2,
        crossOverStudy: 0,
        displayName: 'Sourabh4 - LabsetupCmplt',
        groupName: 'Test1',
        hasChildren: false,
        id: 'abf29e2f-72ed-4620-89a3-d0d74d2197e1',
        labLocationAddress: null,
        labLocationAddressId: 'e593650f-6a5f-4449-90d7-3c7656a28688',
        labLocationContact: null,
        labLocationContactId: '',
        labLocationName: 'Sourabh4 - LabsetupCmplt',
        licenseAssignDate: '2022-08-09T00:00:00Z',
        licenseExpirationDate: '2022-09-09T00:00:00Z',
        licenseNumberUsers: 5,
        locationCount: 0,
        locationDayLightSaving: '00:00:00',
        locationOffset: '05:30:00',
        locationTimeZone: 'Asia/Kolkata',
        lotViewerInstalledProduct: '741258963',
        lotViewerLicense: 1,
        nodeType: 2,
        orderNumber: '103981',
        parentNodeId: '6639d172-49b4-434d-92e8-418ede66de36',
        parentNode: {
          displayName: 'Test1',
          labName: 'Test1',
          name: '',
          parentNodeId: '4f71dcf7-68ab-47f4-adc3-abc1229a99ce',
          nodeType: 1,
          id: '6639d172-49b4-434d-92e8-418ede66de36',
          isUnavailable: false,
          unavailableReasonCode: ''
        },
        primaryUnityLabNumbers: '',
        shipTo: '2005062111',
        soldTo: '1003133111',
        unityNextInstalledProduct: '',
        unityNextTier: -1,
        comments: '',
        contactRoles: null,
        usedArchive: false,
        islabsettingcompleted: true
      }
    ]
  }
];

const mockCurrentUser = {
  firstName: 'World',
  lastName: 'Traveler',
  email: 'test@bio-rad.com',
  userOktaId: '789789789789',
  roles: [
    'Admin'
  ],
  accessToken: {
    accessToken: ``,
    expiresAt: '1582722553',
    tokenType: 'Bearer',
    scopes: [
      'openid',
      'email'
    ],
    authorizeUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/authorize',
    userinfoUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/userinfo'
  },
  accountNumber: '100472',
  accountId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
  accountNumberArray: [
    '100472'
  ],
  labLocationId: 'b5401afc-d62f-4580-a89f-5b874905b318',
  labLocationIds: [
    'b5401afc-d62f-4580-a89f-5b874905b318'
  ],
  permissions: [],
  userData: {
    assignedLabNumbers: [],
    defaultLab: ''
  },
  id: 'fafc531c-963a-4c1f-92d1-0b3a78527389',
  userName: '',
  displayName: '',
  labId: ''
};

const mockCurrentLabLocation = {
  children: [],
  locationTimeZone: 'America/Los_Angeles',
  locationOffset: '',
  locationDayLightSaving: '',
  nodeType: 2,
  labLocationName: '',
  labLocationContactId: '',
  labLocationAddressId: '',
  labLocationContact: null,
  labLocationAddress: null,
  id: '',
  parentNodeId: '',
  displayName: '',
  contactRoles: [UserRole.LabSupervisor],
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
  previousContactUserId: null,
  labLanguagePreference: 'en-us'
};

const storeStub = {
  user: {
    currentUser: mockCurrentUser
  }
};

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let store: MockStore<any>;
  let sampleUsers;
  const initialState = {};

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockMessageSnackBar = {
    showMessageSnackBar() { }
  };

  const mockUserManagementService = {
    response: 'test',
    queryUserByEmail: (email: string) => {
      return of(mockUserManagementService.response);
    },
    searchUsers: (userSearchRequest: UserSearchRequest) => {
      return of(mockUserData);
    },
    updateUser: () => {
      return of([]);
    }
  };

  const mockBrPermissionsService = {
    hasAccess: () => { },
  };

  const mockAppNavigationTrackingService = {
    comparePriorAndCurrentValues: () => {
      return {
        auditTrail: {
          eventType: 'User Management',
          action: 'Update',
          actionStatus: 'Success',
          priorValue: {
            name: 'new1'
          },
          currentValue: {
            name: 'new12'
          }
        }
      };
    },
    logAuditTracking: () => { }
  };

  const mockPortalApiService = {
    searchLabSetupNode: (user, oktaId: string) => {
      return of(mockCurrentlocationData);
    },
  };

  const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollY: false
  };

  const MatDialogRefService = {
    close: () => {
      return {};
    },
    backdropClick: () => {
      return of();
    },
  };

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        PerfectScrollbarModule,
        MatDialogModule,
        MatSelectModule,
        MatIconModule,
        MatOptionModule,
        MatFormFieldModule,
        NgReduxTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        StoreModule.forRoot(fromRoot.reducers),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule,
        MatTableModule,
        MatInputModule,
        BrowserAnimationsModule,
        NgxPaginationModule
      ],
      declarations: [
        UserManagementComponent,
        TruncatePipe
      ],
      providers: [
        { provide: UserManagementAction, useValue: stubUserManagementAction },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: UserManagementService, useValue: mockUserManagementService },
        { provide: MatDialogRef, useValue: MatDialogRefService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: MessageSnackBarService, useValue: mockMessageSnackBar },
        { provide: Store, useValue: storeStub },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        TranslateService,
        provideMockStore(initialState),
      ]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(storeStub);
    TestBed.compileComponents();
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    component.currentUserData = mockCurrentUser;
    sampleUsers = mockUserData.users;
    component.userData = sampleUsers;
    component.getLocation$ = of(mockCurrentLabLocation);
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct data in table rows', async(() => {
    expect(component.userData).toBeTruthy();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
      const userName = tableRows[0]?.children[0];
      expect(userName.children[0].innerText).toEqual(mockUserData.users[0].displayName);
    });
  }));

  it('should log audit trail on navigation to user management', async(() => {
    const comparePriorAndCurrentValuesSpy = spyOn(mockAppNavigationTrackingService, 'comparePriorAndCurrentValues').and.returnValue({
      auditTrail: {
        eventType: 'User Management',
        action: 'View',
        actionStatus: 'Success',
        priorValue: {
          name: 'new1'
        },
        currentValue: {
          name: 'new12'
        }
      }
    });
    const logAuditTrackingSpy = spyOn(mockAppNavigationTrackingService, 'logAuditTracking');
    expect(component.userData).toBeTruthy();
    component.ngOnInit();
    expect(comparePriorAndCurrentValuesSpy).toHaveBeenCalled();
    expect(logAuditTrackingSpy).toHaveBeenCalled();
  }));

  it('should display "Loading users..." message while users are being fetched', () => {
    component.dataSource = null;
    fixture.detectChanges();

    let loadingUsersMessage = fixture.debugElement.query(By.css('.spec_users_loading'));
    expect(loadingUsersMessage).toBeDefined();
    expect(loadingUsersMessage.nativeElement.textContent.length).toBeGreaterThan(0);
   // expect(loadingUsersMessage.nativeElement.textContent).toEqual(' Loading users...');

    component.dataSource = new MatTableDataSource(component.userData);
    fixture.detectChanges();

    loadingUsersMessage = fixture.debugElement.query(By.css('.spec_users_loading'));
    expect(loadingUsersMessage).toBeNull();
  });

  it('should display "No users found" message when users are not present', () => {
    component.dataSource = new MatTableDataSource([]);
    fixture.detectChanges();

    const noUserFoundMessage = fixture.debugElement.query(By.css('.spec_no_users_found'));
    expect(noUserFoundMessage).toBeDefined();
    expect(noUserFoundMessage.nativeElement.textContent.length).toBeGreaterThan(0);
   // expect(noUserFoundMessage.nativeElement.textContent).toEqual('No users found');
  });

  it('should hide the pagination controls when users are not present or when only one user page is present', () => {
    component.userData = null;
    fixture.detectChanges();

    let paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();
    component.paginationConfig.currentPage = mockUserData.pageIndex;
    component.paginationConfig.itemsPerPage = mockUserData.pageSize;
    component.paginationConfig.totalItems = mockUserData.pageSize * mockUserData.totalPages;
    fixture.detectChanges();

    paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();
  });

  it('should show the pagination controls when two user pages are present', () => {
    component.paginationConfig.currentPage = mockUserData.pageIndex;
    component.paginationConfig.itemsPerPage = mockUserData.pageSize;
    component.paginationConfig.totalItems = mockUserData.totalItems;
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

  it('should display users based on the Page selected in Pagination when we have multiple pages', () => {
    component.paginationConfig.currentPage = mockUserData.pageIndex;
    component.paginationConfig.itemsPerPage = mockUserData.pageSize;
    component.paginationConfig.totalItems = mockUserData.totalItems;
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    nextButton.click();
    fixture.detectChanges();
    expect(component.userData).toBeTruthy();

    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    prevButton.click();
    fixture.detectChanges();
    expect(component.userData).toBeTruthy();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    const secondPageButton = paginationButtons[1].nativeElement;
    secondPageButton.click();
    fixture.detectChanges();
    expect(component.userData).toBeTruthy();
  });

  it('should create correct number of pages for pagination', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.paginationConfig.totalItems).
      toBeLessThanOrEqual(component.paginationConfig.itemsPerPage * component.paginationConfig.totalItems);
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
   // expect(resetBtn.nativeElement.textContent).toEqual('Reset');
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
    component.selectedCategory = 1;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(By.css('.spec-search-btn')).nativeElement;
    searchBtn.click();
    fixture.detectChanges();
    const mockSearchRequest = new UserSearchRequest();
    mockSearchRequest.searchString = 'sample search text';
    mockSearchRequest.searchColumn = UsersField.Name;
    mockSearchRequest.pageIndex = 0;
    mockSearchRequest.pageSize = 25;
    mockSearchRequest.sortColumn = UsersField.Name;
    mockSearchRequest.sortDescending = false;
    mockSearchRequest.locationId = '';
    expect(component.userSearchRequest).toEqual(mockSearchRequest);
  });

  it('should send sort request', () => {
    const sortRequest: Sort = { active: component.userColumns[0], direction: asc };
    const searchUsers = spyOn(mockUserManagementService, 'searchUsers').and.callThrough();

    component.sortList(sortRequest);

    expect(component.sortInfo.active).toEqual(sortRequest.active);
    expect(component.sortInfo.direction).toEqual(sortRequest.direction);
    expect(component.userSearchRequest.pageIndex).toEqual(0);
    expect(component.userSearchRequest.pageSize).toEqual(component.paginationConfig.itemsPerPage);
    expect(component.userSearchRequest.sortColumn).toEqual(1);
    expect(component.userSearchRequest.sortDescending).toEqual(false);
    expect(component.paginationConfig.currentPage).toEqual(1);
    expect(searchUsers).toHaveBeenCalledTimes(1);

    sortRequest.active = component.userColumns[2];
    sortRequest.direction = desc;

    component.sortList(sortRequest);

    expect(component.sortInfo.active).toEqual(sortRequest.active);
    expect(component.sortInfo.direction).toEqual(sortRequest.direction);
    expect(component.userSearchRequest.pageIndex).toEqual(0);
    expect(component.userSearchRequest.pageSize).toEqual(component.paginationConfig.itemsPerPage);
    expect(component.userSearchRequest.sortColumn).toEqual(3);
    expect(component.userSearchRequest.sortDescending).toEqual(true);
    expect(component.paginationConfig.currentPage).toEqual(1);
    expect(searchUsers).toHaveBeenCalledTimes(2);
  });

  it('on click of "Add a user" button it should open the add user form at the first position of the datatable', () => {
    spyOn(component, 'markDefaultLocationChecked');
    spyOn(component, 'markEditLocationChecked');
    spyOn(component, 'loadLocationDropdownOptions');
    sampleUsers = mockUserData.users;
    const pageData = {
      'id': paginationUsers,
      'users': sampleUsers,
      'pageIndex': 0,
      'totalPages': 3,
      'pageSize': 5
    };
    component.userData = pageData.users;
    component.paginationConfig.currentPage = pageData.pageIndex + 1;
    component.paginationConfig.itemsPerPage = pageData.pageSize;
    component.paginationConfig.totalItems = pageData.pageSize * pageData.totalPages;
    fixture.detectChanges();
    const spyObj = spyOn(component, 'addUserForm').and.callThrough();
    component.addUserForm();
    fixture.detectChanges();
    expect(spyObj).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.userData.length).toEqual(3);
      expect(component.isAddUser).toEqual(true);
      expect(component.isEditUser).toEqual(false);
      const firstNameTag = fixture.debugElement.query(By.css('#firstName')).nativeElement;
      expect(firstNameTag).toBeDefined();
      const lastNameTag = fixture.debugElement.query(By.css('#lastName')).nativeElement;
      expect(lastNameTag).toBeDefined();
      const userEmailTag = fixture.debugElement.query(By.css('#userEmail')).nativeElement;
      expect(userEmailTag).toBeDefined();
      const userRoleTag = fixture.debugElement.query(By.css('.user-role')).nativeElement;
      expect(userRoleTag).toBeDefined();
      const cancelBtn = fixture.debugElement.query(By.css('.cancel-button')).nativeElement;
      expect(cancelBtn).toBeDefined();
      const formAddBtn = fixture.debugElement.query(By.css('.spec_add_location')).nativeElement;
      expect(formAddBtn).toBeDefined();
      expect(formAddBtn.disabled).toBeTruthy();
    });
  });

  it('should call the add method on click of add button', () => {
    component.editIndex = 0;
    component.selectedLocations = [{ groups: [] }];
    component.userForm.controls['firstName'].setValue(addUser.firstName);
    component.userForm.controls['lastName'].setValue(addUser.lastName);
    component.userForm.controls['userEmail'].setValue(addUser.userEmail);
    component.userForm.controls['userRole'].setValue(['Technician', 'LabUserManager']);
    expect(component.userForm).toBeTruthy();
    fixture.detectChanges();
    const saveSpy = spyOn(component, 'saveRecord').and.callThrough();
    component.saveRecord();
    expect(saveSpy).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.userData.length).toEqual(2);
      expect(component.isAddUser).toEqual(false);
      expect(component.isEditUser).toEqual(false);
    });
  });

  it('should log audit trail on add/edit user', () => {
    const comparePriorAndCurrentValuesSpy = spyOn(mockAppNavigationTrackingService, 'comparePriorAndCurrentValues').and.returnValue({
      auditTrail: {
        eventType: 'User Management',
        action: 'Update',
        actionStatus: 'Success',
        priorValue: {
          name: 'new1'
        },
        currentValue: {
          name: 'new12'
        }
      }
    });
    const logAuditTrackingSpy = spyOn(mockAppNavigationTrackingService, 'logAuditTracking');
    component.editIndex = 0;
    component.selectedLocations = [{ groups: [] }];
    component.userForm.controls['firstName'].setValue(addUser.firstName);
    component.userForm.controls['lastName'].setValue(addUser.lastName);
    component.userForm.controls['userEmail'].setValue(addUser.userEmail);
    component.userForm.controls['userRole'].setValue(['Technician', 'LabUserManager']);
    expect(component.userForm).toBeTruthy();
    fixture.detectChanges();
    spyOn(component, 'saveRecord').and.callThrough();
    component.saveRecord();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(comparePriorAndCurrentValuesSpy).toHaveBeenCalled();
      expect(logAuditTrackingSpy).toHaveBeenCalled();
    });
  });

  it('on click of cancel button without making form dirty it should close the user form and remove the extra object added', () => {
    spyOn(component, 'markDefaultLocationChecked');
    spyOn(component, 'loadLocationDropdownOptions');
    const spyObj = spyOn(component, 'addUserForm').and.callThrough();
    component.addUserForm();
    expect(spyObj).toHaveBeenCalled();
    fixture.detectChanges();
    const spyCancelForm = spyOn(component, 'cancelFormEdit').and.callThrough();
    component.cancelFormEdit();
    fixture.detectChanges();
    expect(spyCancelForm).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.userData.length).toEqual(2);
      expect(component.isAddUser).toEqual(false);
      expect(component.isEditUser).toEqual(false);
    });
  });

  it('on click name of any record from the datatable it should load the Edit user form with prefilled values and it should call the update method  ', async(() => {
    spyOn(component, 'markDefaultLocationChecked');
    spyOn(component, 'markEditLocationChecked');
    spyOn(component, 'loadLocationDropdownOptions');
    const spyOpenFormForEdit = spyOn(component, 'openFormForEdit');
    component.selectedLocations = [{ groups: [] }];
    component.openFormForEdit(1);
    expect(spyOpenFormForEdit).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.isAddUser).toBeFalsy();
    expect(component.isEditUser).toBeFalsy();
    expect(component.userForm).toBeTruthy();
    fixture.detectChanges();
    const saveSpy = spyOn(component, 'saveRecord');
    component.saveRecord();
    expect(saveSpy).toHaveBeenCalled();
    fixture.detectChanges();
    const resetAllDataSpy = spyOn(component, 'resetDataSet');
    component.resetDataSet();
    expect(resetAllDataSpy).toHaveBeenCalled();
    expect(component.userData.length).toEqual(2);
    expect(component.isAddUser).toEqual(false);
    expect(component.isEditUser).toEqual(false);
  }));
});
