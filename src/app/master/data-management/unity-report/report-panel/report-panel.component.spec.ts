// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { MaterialModule } from 'br-component-library';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ConfigService } from '../../../../core/config/config.service';
import { ReportHelperService } from '../report-helper.service';
import { ReportingService } from '../reporting.service';
import { ReportPanelComponent } from './report-panel.component';
import { UnityDateTimeModule } from '../../../../shared/date-time/unity-date-time.module';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { TranslateService } from '@ngx-translate/core';

describe('ReportPanelComponent', () => {
  let component: ReportPanelComponent;
  let fixture: ComponentFixture<ReportPanelComponent>;
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

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        PerfectScrollbarModule,
        HttpClientModule,
        FormsModule,
        UnityDateTimeModule
      ],
      declarations: [ReportPanelComponent, UnityNextDatePipe],
      providers: [
        DatePipe,
        ReportingService,
        ReportHelperService,
        PortalApiService,
        { provide: TranslateService, useValue: { get: tag => of(tag) } },
        { provide: MatDialog, useValue: {} },
        { provide: ConfigService, useValue: { getConfig: () => of({}) } },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: NavigationService, useValue: of('') },
        SpinnerService,
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
