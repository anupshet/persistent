// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { MaterialModule } from 'br-component-library';

import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { LabBarComponent } from './lab-bar.component';

describe('LabBarComponent', () => {
  let component: LabBarComponent;
  let fixture: ComponentFixture<LabBarComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['User'],
      permissions: [],
      userData: {
        assignedLabNumbers: [],
        defaultLab: ''
      },
      accountNumber: '',
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
      children: [],
      primaryUnityLabNumbers: 'Test',
    }
  };
  const storeStub = {
    security: null,
    auth: authStub,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          MaterialModule,
          HttpClientModule,
          BrowserAnimationsModule,
          RouterTestingModule
        ],
        declarations: [LabBarComponent],
        providers: [
          { provide: Store, useValue: storeStub },
          { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
          provideMockStore({ initialState: storeStub })
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LabBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
