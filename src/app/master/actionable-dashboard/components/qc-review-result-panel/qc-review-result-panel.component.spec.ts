// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QcReviewResultPanelComponent } from './qc-review-result-panel.component';
import { DataReviewService } from '../../../../shared/api/data-review.service';
import { UnityNextTier } from '../../../../contracts/enums/lab-location.enum';
import { UserRole } from '../../../../contracts/enums/user-role.enum';
import { LabLocationContact } from '../../../../contracts/models/lab-setup';
import { BrPermissionsService } from '../../../../security/services/permissions.service';

describe('QcReviewResultPanelComponent', () => {
  let component: QcReviewResultPanelComponent;
  let fixture: ComponentFixture<QcReviewResultPanelComponent>;

  const totalUnreviewedRunCount = {
    totalUnreviewedRunCount: 84
  };

  const mockDataReviewService = {
    getDataReviewCount: () => {
      return of(totalUnreviewedRunCount);
    }
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

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  let hasPermission = true;

  const mockBrPermissionsService = {
    hasAccess: () => hasPermission,
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcReviewResultPanelComponent ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: DataReviewService, useValue: mockDataReviewService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub },),
        TranslateService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcReviewResultPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display point data run', () => {
    const runPointDataCountElement = fixture.debugElement.nativeElement.querySelector('.datarun-count');
    expect(runPointDataCountElement).toBeDefined();
    expect(runPointDataCountElement.innerText).toEqual(String(totalUnreviewedRunCount.totalUnreviewedRunCount));
  });
});
