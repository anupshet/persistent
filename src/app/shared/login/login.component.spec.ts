/* // © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  OktaAuthService,
  OktaAuthModule,
  OKTA_CONFIG
} from '@okta/okta-angular';
import { of } from 'rxjs';
import { MaterialModule } from 'br-component-library';

import { AuthenticationService, OktaService } from '../../../app/security/services';
import { NavigationService } from '../navigation/navigation.service';
import { LoginComponent } from './login.component';
import { LoggingApiService } from '../api/logging-api.service';
import { BrError } from '../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const activatedRouteStub = {
    paramMap: of({ get: () => { } }),
    queryParams: of({}),
    snapshot: {
      paramMap: of({ get: () => { } }),
      queryParams: of({}),
    }
  };
  const authStubData = {
    getLoginWidget: () => of({ remove: () => of({}), showSignInToGetTokens: () => Promise.resolve() }),
    isAuthenticated: () => of(false)
  };
  const mockLoggingApiService = {
    auditTracking: () => { }
  };
  const storeStub = {
    security: null,
    auth: activatedRouteStub,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null
  };
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MaterialModule,
        OktaAuthModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: AuthenticationService,
          useValue: authStubData
        },
        { provide: NavigationService, useValue: of('') },
        { provide: Store, useValue: storeStub },
        { provide: LoggingApiService, useValue: mockLoggingApiService },
        {
          provide: OKTA_CONFIG,
          useValue: {}
        },
        {
          provide: OktaAuthService,
          useValue: { }
        },
        {
          provide: OktaService,
          useValue: {
            getWidget: {}
          }
        },
        provideMockStore({ initialState: storeStub }),
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.loginWidget = { remove: () => { }, showSignInToGetTokens: () => Promise.resolve() };
    fixture.detectChanges();
  });

  it('should be clear localStorage when clearUserLocalSession function get called', () => {
    window.localStorage.setItem('localStorage', 'Fake Data');
    component.clearUserLocalSession();
    fixture.detectChanges();
    expect(window.localStorage.length).toEqual(0);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
 */
