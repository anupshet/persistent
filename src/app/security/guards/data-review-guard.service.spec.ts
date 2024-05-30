// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, inject, TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { DataReviewGuard } from './data-review-guard.service';
import { LabLocationContact } from '../../contracts/models/lab-setup';
import { UnityNextTier } from '../../contracts/enums/lab-location.enum';
import { UserRole } from '../../contracts/enums/user-role.enum';
import { AuthenticationService } from '../services';
import { BrPermissionsService } from '../services/permissions.service';
import { Permissions } from '../model/permissions.model';

describe('DataReviewGuard', () => {
  let dataReviewGuard: DataReviewGuard;
  let isAuthenticated = false;
  let hasPermission = false;

  const mockAuthService =  {
    isAuthenticated: () => of(isAuthenticated)
  };

  const mockBrPermissionsService = {
    hasAccess: () => hasPermission,
  };
  
  const route: Route = {
    data: [
      Permissions.BenchReview,
      Permissions.BenchReviewViewOnly,
      Permissions.SupervisorReview,
      Permissions.SupervisorReviewViewOnly
    ]
  };

  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '123',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['LabSupervisor'],
      permissions: {
        rolePermissions: {
          role: {
            permission: true,
          }
        }
      },
      userData: {
        assignedLabNumbers: [],
        defaultLab: ''
      },
      accountNumber: '123',
      accountId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      labLocationId: '0d66767b-612c-4254-9eed-3a7ab393029f',
      labLocationIds: ['0d66767b-612c-4254-9eed-3a7ab393029f'],
      accountNumberArray: [],
      accessToken: '',
      id: 'eca89ea6-aba1-4b95-9396-0238352a4765',
      labId: ''
    },
    directory: {
      id: 10,
      name: 'Test',
      locations: null,
      children: [{
        nodeType: 1
      },{
        nodeType: 7,
        userOktaId: '123',
        userName: '',
        firstName: 'user',
        lastName: 'test',
        displayName: '',
        email: 'user@bio-rad.com',
        userRoles: ['LabSupervisor'],
      }],
      primaryUnityLabNumbers: 'Test',
    }
  };

  const mockCurrentLabLocation = {
    children: [],
    locationTimeZone: 'America/Los_Angeles',
    locationOffset: '',
    locationDayLightSaving: '',
    nodeType: 2,
    unityNextTier: UnityNextTier.DailyQc,
    labLocationName: '',
    labLocationContactId: '',
    labLocationAddressId: '',
    labLocationContact: null,
    labLocationAddress: null,
    id: '',
    parentNodeId: '',
    displayName: '',
    contactRoles: [UserRole.Technician, UserRole.LabSupervisor],
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
    previousContactUserId: null
  };

  const location = {
    currentLabLocation: mockCurrentLabLocation,
    currentLabLocationContact: LabLocationContact
  };

  const storeStub = {
    security: authStub,
    auth: authStub,
    userPreference: null,
    location: location
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot([])
      ],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        DataReviewGuard,
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub })
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject(
    [DataReviewGuard],
    (service: DataReviewGuard) => {
      dataReviewGuard = service;
      dataReviewGuard.getCurrentLabLocation$ = of(mockCurrentLabLocation);
    }
  ));

  it('should create', () => {
    expect(dataReviewGuard).toBeTruthy();
  });

  it('canLoad returns false if not authenticated', ((done: DoneFn) => {
    isAuthenticated = false;
    hasPermission = true;
    mockCurrentLabLocation.unityNextTier = UnityNextTier.DailyQc;

    dataReviewGuard.canLoad(route).pipe(
      take(1)
    ).subscribe((result) => {
      expect(result).toBeFalse();
      done();
    });
  }));

  it('canLoad returns false if does not have permissions', ((done: DoneFn) => {
    isAuthenticated = true;
    hasPermission = false;
    mockCurrentLabLocation.unityNextTier = UnityNextTier.DailyQc;

    dataReviewGuard.canLoad(route).pipe(
      take(1)
    ).subscribe((result) => {
      expect(result).toBeFalse();
      done();
    });
  }));

  it('canLoad returns false if location does not have unityNextTier of Advanced QC', ((done: DoneFn) => {
    isAuthenticated = true;
    hasPermission = true;
    mockCurrentLabLocation.unityNextTier = UnityNextTier.PeerQc;

    dataReviewGuard.canLoad(route).pipe(
      take(1)
    ).subscribe((result) => {
      expect(result).toBeFalse();
      done();
    });
  }));

  it('canLoad returns true if is authenticated, has permissions, and has unityNextTier of Advanced QC', ((done: DoneFn) => {
    isAuthenticated = true;
    hasPermission = true;
    mockCurrentLabLocation.unityNextTier = UnityNextTier.DailyQc;

    dataReviewGuard.canLoad(route).pipe(
      take(1)
    ).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  }));
});
