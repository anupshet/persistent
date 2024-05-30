// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { inject, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { HttpClientModule } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { AppNavigationTrackingService } from './app-navigation-tracking.service';
import { LoggingApiService } from '../../api/logging-api.service';
import { ConfigService } from '../../../core/config/config.service';
import { AppLoggerService } from '../applogger/applogger.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, AuditTrail,
  AuditTrailPriorCurrentValues, FAILED_LOGIN_AUDIT_TRAIL_PAYLOAD} from '../../models/audit-tracking.model';
import { LabLocation } from '../../../contracts/models/lab-setup/lab-location.model';
import { AppUser } from './../../../security/model/app-user.model';
import { NavigationState } from '../../navigation/state/reducers/navigation.reducer';

describe('AppNavigationTrackingService', () => {
  const dateNow = Date.now();
  let service: AppNavigationTrackingService;
  const navigationState: NavigationState = {
    selectedNode: null,
    selectedLeaf: null,
    currentBranch: [],
    error: null,
    isSideNavExpanded: false,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: false,
    connectivityFullTree: null,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: false,
    settings: null,
    showArchivedItemsToggle: false,
    isArchiveItemsToggleOn: false,
    showAccountUserSelectorToggle: false,
    isAccountUserSelectorOn: false,
    hasNonBrLicense: false
  };
  const loggingApiServiceMock = jasmine.createSpyObj<LoggingApiService>('LoggingApiService', {
    appNavigationTracking: of(null)
  });
  const ConfigServiceStub = {
    getConfig: () => {
      return { 'auditTrail': '' };
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: LoggingApiService, useValue: loggingApiServiceMock },
        { provide: ConfigService, useValue: ConfigServiceStub },
        { provide: Store, useValue: [] },
        AppLoggerService,
        AppNavigationTrackingService,
        provideMockStore({})
      ],
    });
  });

  beforeEach(inject(
    [AppNavigationTrackingService],
    (_service: AppNavigationTrackingService) => {
      service = _service;
      service.currentBranch$ = of(navigationState.currentBranch);
    }
  ));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(dateNow));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call prepareAuditTrailPayload method & audit tracking api- appNavigationTracking', () => {
    const payload = {
      auditTrail: {
        'eventType': 'Lab Setup',
        'action': 'Update',
        'actionStatus': 'Success',
        'priorValue': {
          'dataType': 0,
          'trackReagentCalibrator': false,
          'decimalPlaces': 2
        },
        'currentValue': {
          'dataType': 1,
          'trackReagentCalibrator': true,
          'decimalPlaces': 1
        }
      }
    };
    service.isUserDataFetched = true;
    service.currentUserData = {
      accessToken: '',
      accountId: 'ea750fa2-c89b-4ed5-805b-648ab9be5fce',
      accountNumber: '203295',
      accountNumberArray: ['203295'],
      displayName: '',
      email: 'pooja_piplpalle+Dev2LAb@bio-rad.com',
      firstName: 'Pooja',
      id: '50f9d5e7-6eea-4756-ac55-17d05432c636',
      labLocationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      labLocationIds: ['4ebf2f52-3936-4203-bf93-3f8befab64eb'],
      lastName: 'Piplpalle',
      roles: ['Admin'],
      userOktaId: '00uh0hremzn62Egrg2p7',
      userData: {
        assignedLabNumbers: [1],
        defaultLab: ''
      },
      permissions: [],
      userName: '',
      labId: ''
    };
    service.currentUserLocationData = {
      accountName: 'Testing_FeatureEdge',
      accountNumber: '203295',
      displayName: 'Testing_FeatureEdge',
      groupName: 'Testing_FeatureEdge',
      hasChildren: false,
      id: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      islabsettingcompleted: true,
      labLocationAddress: null,
      labLocationAddressId: 'ad59b4bd-c15d-48a7-8626-fae0060e3805',
      labLocationContact: null,
      labLocationContactId: '',
      labLocationName: 'Testing_FeatureEdge',
      licenseAssignDate: '2022-06-27T00:00:00Z',
      licenseExpirationDate: '2022-09-27T00:00:00Z',
      licenseNumberUsers: 1,
      locationCount: 0,
      locationDayLightSaving: '01:00:00',
      locationOffset: '-05:00:00',
      locationSettings: null,
      locationTimeZone: 'America/New_York',
      lotViewerInstalledProduct: '',
      lotViewerLicense: 1,
      migrationStatus: '',
      nodeType: 2,
      orderNumber: '',
      parentNode: null,
      parentNodeId: 'e67e8741-2e94-4073-b550-9698f961b155',
      primaryUnityLabNumbers: '',
      shipTo: '4325643',
      soldTo: '523534',
      unityNextInstalledProduct: '',
      unityNextTier: 0,
      usedArchive: true,
      children: null,
      contactRoles: null,
      previousContactUserId: '',
      labLanguagePreference: 'en-US'
    };
    const prepareAuditTrailPayloadData: AppNavigationTracking = {
      accountName: 'Testing_FeatureEdge',
      accountNumber: '203295',
      account_id: 'ea750fa2-c89b-4ed5-805b-648ab9be5fce',
      auditTrail: {
        'eventType': 'Lab Setup',
        'action': 'Update',
        'actionStatus': 'Success',
        'priorValue': {
          'dataType': 0,
          'trackReagentCalibrator': false,
          'decimalPlaces': 2
        },
        'currentValue': {
          'dataType': 1,
          'trackReagentCalibrator': true,
          'decimalPlaces': 1
        }
      },
      awsCorrelationId: '',
      eventDateTime: new Date(),
      localDateTime: new Date(),
      groupName: 'Testing_FeatureEdge',
      group_id: 'e67e8741-2e94-4073-b550-9698f961b155',
      locationName: 'Testing_FeatureEdge',
      location_id: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      userRoles: ['Admin'],
      user_id: '50f9d5e7-6eea-4756-ac55-17d05432c636',
      oktaId: '00uh0hremzn62Egrg2p7',
      hasDepartments: false
    };

    service.logAuditTracking(payload, true).then(() => {
      expect(loggingApiServiceMock['appNavigationTracking']).toHaveBeenCalledWith(service.auditTrailPayload, true);
    });
  });



  it('compare current prior change value', () => {
    const current = [
      {
          'mean': 2,
          'sd': 3,
          'numPoints': 4,
          'level': 2
      }
    ];

    const prior = [
      {
          'mean': 3,
          'sd': 4,
          'numPoints': 5,
          'level': 2
      }
    ];

    const currentValues = [
      {
          'mean': 2,
          'sd': 3,
          'numPoints': 4,
          'level': 2
      }
    ];

    const priorValues = [
      {
          'mean': 3,
          'sd': 4,
          'numPoints': 5,
          'level': 2
      }
    ];

    service.getLevelValues(current, prior);
    const changedValues = {'currentValues': currentValues, 'priorValues': priorValues};
    const returnValue = service.currentPriorChangeValue(current, prior);
    expect(returnValue).toEqual(changedValues);
  });

  it('compare prior and current values and check the result', () => {
    const currentPanelValues: any = {
      id: 'b8558c40-f2d5-461a-ad81-49bc4678a621', name: 'new12', parentNodeId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      panelItemIds: ['b6dcd824-fa69-4091-b9d6-189c8820c160']
    };
    const priorPanelValues: any = {
      name: 'new1',
      id: 'b8558c40-f2d5-461a-ad81-49bc4678a621',
      parentNodeId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      panelItemIds: ['b6dcd824-fa69-4091-b9d6-189c8820c160']
    };
    const typeOfAction = 'Update';
    const eventType = 'Panel';
    const resultOfCompare: any = {
      auditTrail: {
        eventType: 'Panel',
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
    const returnValue = service.comparePriorAndCurrentValues(currentPanelValues, priorPanelValues, typeOfAction,
    AuditTrackingAction.Panel, AuditTrackingActionStatus.Success);
    expect(returnValue).toEqual(resultOfCompare);
  });

  // region: coverage of service methods for log failed login and change location
  it('when event is `failed login`, then it should call appNavigationTracking() with expected payload', () => {
    const expectedPayload = {...FAILED_LOGIN_AUDIT_TRAIL_PAYLOAD};
    service.logFailedLogin().then(() => {
      expect(loggingApiServiceMock.appNavigationTracking).toHaveBeenCalledWith(expectedPayload, false);
    });
  });

  it('when event is `change location` and action is logout, then it should call appNavigationTracking() with expected cur value in the payload', () => {
    setServiceUser(service);
    setLogoutServiceLabLocation(service);
    const currentValue: AuditTrailPriorCurrentValues = {
      group_id: service.currentUserLocationData.parentNodeId,
      groupName: service.currentUserLocationData.groupName,
      location_id: LOGOUT_LOCATION_ID,
      locationName: LOGOUT_LOCATION_NAME,
    };
    const logoutAuditTrail: AuditTrail = {
      eventType: AuditTrackingAction.ChangeLocation,
      action: AuditTrackingAction.Logout,
      actionStatus: AuditTrackingActionStatus.Success,
      runDateTime: new Date(),
      currentValue: {...currentValue, user_id: service.currentUserData.id},
      priorValue: {}
    };
    const expectedPayload = expectedLogoutChangeLocationPayload(service, logoutAuditTrail);
    service.logChangeLocation(logoutAuditTrail).then(() => {
      expect(loggingApiServiceMock.appNavigationTracking).toHaveBeenCalledWith(expectedPayload, true);
    });
  });

  it('when event is `change location` and action is login, then it should call appNavigationTracking() with expected prior/cur values in the payload', () => {
    setServiceUser(service);
    setLogoutServiceLabLocation(service);
    const priorValue: AuditTrailPriorCurrentValues = {
      group_id: service.currentUserLocationData.parentNodeId,
      groupName: service.currentUserLocationData.groupName,
      location_id: LOGOUT_LOCATION_ID,
      locationName: LOGOUT_LOCATION_NAME,
      user_id: "7529f553-f47d-42da-8099-a357c1b5b31a",
    };
    setLoginServiceLabLocation(service);
    const currentValue: AuditTrailPriorCurrentValues = {
      group_id: service.currentUserLocationData.parentNodeId,
      groupName: service.currentUserLocationData.groupName,
      location_id: LOGIN_LOCATION_ID,
      locationName: LOGIN_LOCATION_NAME,
      user_id: "7529f553-f47d-42da-8099-a357c1b5b31a",
    };
    const expectedPriorValue: AuditTrailPriorCurrentValues = { ...priorValue };
    const expectedCurrentValue: AuditTrailPriorCurrentValues = { ...currentValue };
    const loginAuditTrail: AuditTrail = {
      eventType: AuditTrackingAction.ChangeLocation,
      action: AuditTrackingAction.Login,
      actionStatus: AuditTrackingActionStatus.Success,
      runDateTime: new Date(),
      currentValue: expectedCurrentValue,
      priorValue: expectedPriorValue
    };
    const expectedPayload = expectedLoginChangeLocationPayload(service.currentUserData, service.currentUserLocationData, loginAuditTrail);
    service.logChangeLocation(loginAuditTrail).then(() => {
      expect(loggingApiServiceMock.appNavigationTracking).toHaveBeenCalled();
    });
  });
  // endregion

  it('should return modified payload with data and audit content on calling includeATDataToPayload method', () => {
    const dataPayload: any = [{
      id: 'b8558c40-f2d5-461a-ad81-49bc4678a621', name: 'new12', parentNodeId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      panelItemIds: ['b6dcd824-fa69-4091-b9d6-189c8820c160']
    }];
    const typeOfAction = AuditTrackingAction.Add;
    const eventType = AuditTrackingEvent.NBRLot;
    const actionStatus = AuditTrackingActionStatus.Pending;
    const returnValue = service.includeATDataToPayload(dataPayload, typeOfAction,
      actionStatus, eventType);
    const resultOfCompare: any = {
      auditTrail: {
        eventType: 'NBRLot',
        action: 'Add',
        actionStatus: 'Pending',
        priorValue: {},
        currentValue: {}
      }
    };

    expect(returnValue.audit.auditTrail).toEqual(jasmine.objectContaining(resultOfCompare.auditTrail));
    expect(returnValue.data).toEqual(jasmine.objectContaining(dataPayload));
  });
});

// region helper functions for failed login and change location
const wellFormedUserJson: AppUser = {
  accessToken: '',
  accountId: 'ea750fa2-c89b-4ed5-805b-648ab9be5fce',
  accountNumber: '203295',
  accountNumberArray: ['203295'],
  displayName: '',
  email: 'pooja_piplpalle+Dev2LAb@bio-rad.com',
  firstName: 'Pooja',
  id: '50f9d5e7-6eea-4756-ac55-17d05432c636',
  labLocationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
  labLocationIds: ['4ebf2f52-3936-4203-bf93-3f8befab64eb'],
  lastName: 'Piplpalle',
  roles: ['Admin'],
  userOktaId: '00uh0hremzn62Egrg2p7',
  userData: {
    assignedLabNumbers: [1],
    defaultLab: ''
  },
  permissions: [],
  userName: '',
  labId: ''
};
const wellFormedLabLocationJson: LabLocation = {
  accountName: 'Testing_FeatureEdge',
  accountNumber: '203295',
  displayName: 'Testing_FeatureEdge',
  groupName: 'Testing_FeatureEdge',
  hasChildren: false,
  id: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
  islabsettingcompleted: true,
  labLocationAddress: null,
  labLocationAddressId: 'ad59b4bd-c15d-48a7-8626-fae0060e3805',
  labLocationContact: null,
  labLocationContactId: '',
  labLocationName: 'Testing_FeatureEdge',
  licenseAssignDate: '2022-06-27T00:00:00Z',
  licenseExpirationDate: '2022-09-27T00:00:00Z',
  licenseNumberUsers: 1,
  locationCount: 0,
  locationDayLightSaving: '01:00:00',
  locationOffset: '-05:00:00',
  locationSettings: null,
  locationTimeZone: 'America/New_York',
  lotViewerInstalledProduct: '',
  lotViewerLicense: 1,
  migrationStatus: '',
  nodeType: 2,
  orderNumber: '',
  parentNode: null,
  parentNodeId: 'e67e8741-2e94-4073-b550-9698f961b155',
  primaryUnityLabNumbers: '',
  shipTo: '4325643',
  soldTo: '523534',
  unityNextInstalledProduct: '',
  unityNextTier: 0,
  usedArchive: true,
  children: null,
  contactRoles: null,
  previousContactUserId: '',
  labLanguagePreference: 'en-US'
};
const setServiceUser = (service:AppNavigationTrackingService): void => {
  service.currentUserData = {
    ...wellFormedUserJson,
    accountId: 'user_account_id1',
    accountNumber: 'user_accountNumber1',
    id: 'user_id1',
    roles: ['user_role1', 'user_role2']
  };
};
const LOGOUT_LOCATION_NAME = 'logout_location_name';
const LOGOUT_LOCATION_ID = 'logout_location_id';
const LOGIN_LOCATION_NAME = 'login_location_name';
const LOGIN_LOCATION_ID = 'login_location_id';
const setLogoutServiceLabLocation = (service:AppNavigationTrackingService): void => {
    service.currentUserLocationData = {
    ...wellFormedLabLocationJson,
    accountName: 'logout_location_account_name',
    groupName: 'logout_location_group_name',
    id: LOGOUT_LOCATION_ID,
    labLocationName: LOGOUT_LOCATION_NAME,
    parentNodeId: 'logout_location_parent_node_id',
    contactRoles: ['logout_location_role1', 'logout_location_role2']
  };
}
const setLoginServiceLabLocation = (service:AppNavigationTrackingService): void => {
  service.currentUserLocationData = {
    ...wellFormedLabLocationJson,
    accountName: 'login_location_account_name',
    groupName: 'login_location_group_name',
    id: LOGIN_LOCATION_ID,
    labLocationName: LOGIN_LOCATION_NAME,
    parentNodeId: 'login_location_parent_node_id',
    contactRoles: ['login_location_role1', 'login_location_role2']
  };
};
const expectedLogoutChangeLocationPayload = (service:AppNavigationTrackingService, auditTrail: AuditTrail): AppNavigationTracking => ({
  eventDateTime: new Date(),
  localDateTime: new Date(),
  account_id: service.currentUserData.accountId,
  user_id: service.currentUserData.id,
  accountNumber: service.currentUserData.accountNumber,
  accountName: service.currentUserLocationData.accountName,
  group_id: service.currentUserLocationData.parentNodeId,
  groupName: service.currentUserLocationData.groupName,
  location_id: service.currentUserLocationData.id,
  locationName: service.currentUserLocationData.labLocationName,
  userRoles: [
    ...service.currentUserData.roles,
    ...service.currentUserLocationData.contactRoles],
  auditTrail
});
const expectedLoginChangeLocationPayload = (user: AppUser, labLocation: LabLocation, auditTrail: AuditTrail): AppNavigationTracking => ({
  eventDateTime: new Date(),
  localDateTime: new Date(),
  account_id: user.accountId,
  user_id: user.id,
  accountNumber: user.accountNumber,
  accountName: labLocation.accountName,
  group_id: labLocation.parentNodeId,
  groupName: labLocation.groupName,
  location_id: labLocation.id,
  locationName: labLocation.labLocationName,
  userRoles: [...user.roles, ...labLocation.contactRoles],
  auditTrail
});
// endregion
