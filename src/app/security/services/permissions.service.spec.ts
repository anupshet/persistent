// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { inject, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BrPermissionsService } from './permissions.service';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { Permissions } from '../model/permissions.model';
import { LabLocation } from '../../contracts/models/lab-setup';


describe('BrPermissionsService', () => {
  const mockCurrentUser = {
    'firstName': 'Vinayak',
    'lastName': 'Yadav',
    'email': 'vinayak_yadav+dev20@bio-rad.com',
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
    'permissions': [4, 5, 6, 31, 33, 34, 35, 36, 37, 39, 40, 42],
    'userData': {
      'assignedLabNumbers': [],
      'defaultLab': ''
    },
    'id': 'fafc531c-963a-4c1f-92d1-0b3a78527389',
    'userName': '',
    'displayName': '',
    'labId': '',
    // change this to permission when removing old logic
  };

  const mockCurrentLabLocation: LabLocation = {
    accountName: 'tushar 2022-04-28',
    accountNumber: '103080',
    formattedAccountNumber: 'U103080',
    addOns: 1,
    addOnsFlags: {
      'valueAssignment': false,
      'allowBR': false,
      'allowNonBR': false,
      'allowSiemensHematology': false,
      'allowSysmexHemostasis': false
    },
    connectivityInstalledProduct: '',
    connectivityTier: 2,
    crossOverStudy: 0,
    displayName: 'tushar 2022-04-28',
    groupName: 'tushar 2022-04-28',
    hasChildren: true,
    id: '2fd875ce-851d-49de-b662-6b46d718b8d1',
    labLocationAddress: {
      entityType: 1,
      searchAttribute: '',
      nickName: '',
      streetAddress1: 'Pune',
      streetAddress2: '',
      streetAddress3: '',
      streetAddress: 'Pune',
      suite: '',
      city: 'pune',
      state: 'mh',
      country: 'IN',
      zipCode: '411098',
      id: '88e3ce7d-ac36-40b0-9bb5-d6a7dd47335e'
    },
    labLocationAddressId: '88e3ce7d-ac36-40b0-9bb5-d6a7dd47335e',
    labLocationContact: {
      entityType: 0,
      searchAttribute: 'tushar_adeshara+admin20220428@bio-rad.com',
      firstName: 'tushar',
      middleName: '',
      lastName: 'ad',
      name: 'tushar ad',
      email: 'tushar_adeshara+admin20220428@bio-rad.com',
      phone: '',
      id: 'b57950a0-36c5-4020-a69f-e3287504960a'
    },
    labLocationContactId: 'b57950a0-36c5-4020-a69f-e3287504960a',
    labLocationName: 'tushar 2022-04-28',
    licenseAssignDate: '2022-04-28T00:00:00Z',
    licenseExpirationDate: '2026-12-28T00:00:00Z',
    licenseNumberUsers: 50,
    locationCount: 0,
    locationDayLightSaving: '00:00:00',
    locationOffset: '05:30:00',
    locationTimeZone: 'Asia/Kolkata',
    lotViewerInstalledProduct: '',
    lotViewerLicense: 1,
    nodeType: 2,
    orderNumber: '',
    migrationStatus: '',
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
    children: null,
    previousContactUserId: '',
    primaryUnityLabNumbers: '',
    shipTo: 's9mefwef',
    soldTo: 's9mefwef',
    unityNextInstalledProduct: '',
    unityNextTier: 0,
    comments: '',
    contactRoles: null,
    usedArchive: true,
    islabsettingcompleted: true,
    permissions: [4, 5, 6, 31, 33, 34, 35, 36, 37, 39, 40, 42],
    locationSettings: {
      displayName: '',
      dataType: 1,
      instrumentsGroupedByDept: true,
      trackReagentCalibrator: false,
      fixedMean: false,
      decimalPlaces: 3,
      siUnits: false,
      labSetupRating: 0,
      labSetupComments: '',
      isLabSetupComplete: true,
      labSetupLastEntityId: '',
      legacyPrimaryLab: '',
      parentNodeId: '7d590d78-6cd2-4c6a-8301-81bc5d2a012f',
      parentNode: null,
      children: null,
      nodeType: 9,
      id: '44ab35c9-2fb9-4139-b4aa-f4c16fbe5c07',
      locationId: '2fd875ce-851d-49de-b662-6b46d718b8d1',
      isUnavailable: false,
      unavailableReasonCode: ''
    },
    labLanguagePreference: 'en-us'
  };

  let brPermissionsService: BrPermissionsService;
  let store: MockStore<any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgReduxTestingModule,
        StoreModule.forRoot([])
      ],
      providers: [
        BrPermissionsService,
        { provide: Store, useValue: {} },
        provideMockStore({}),
      ]
    });
    store = TestBed.get(Store);
  });

  beforeEach(inject(
    [BrPermissionsService],
    (service: BrPermissionsService) => {
      brPermissionsService = service;
      brPermissionsService.getCurrentUserState$ = of(mockCurrentUser);
      brPermissionsService.getCurrentLabLocation$ = of(mockCurrentLabLocation);
    }
  ));

  describe('Check for access according to permissions return from backend', () => {

    it('hasAccess to be called ', () => {
      const hasAccess = spyOn(brPermissionsService, 'hasAccess');
      brPermissionsService.hasAccess([4]);
      expect(hasAccess).toHaveBeenCalled();
    });

    it('Has Access should return true when we have required permission present in the permissions array', () => {
      const capturedValue: boolean = brPermissionsService.hasAccess([Permissions.UserAdd]);
      expect(capturedValue).toBeTruthy();
    });

    it('Has Access should return false when required permission is not present in the permissions array', () => {
      const capturedValue: boolean = brPermissionsService.hasAccess([Permissions.AccountAdd]);
      expect(capturedValue).toBeFalsy();
    });
  });
});
