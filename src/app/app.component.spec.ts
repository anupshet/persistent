// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';
import { MaterialModule } from 'br-component-library';
import { OktaAuthService } from '@okta/okta-angular';

import { AppComponent } from './app.component';
import { ConfigService } from './core/config/config.service';
import { CoreModule } from './core/core.module';
import { GaActivitiesService } from './core/google-analytics/ga-activities.service';
import { AuthenticationService } from './security/services';
import { IconService } from './shared/icons/icons.service';
import { NavigationModule } from './shared/navigation/navigation.module';
import { SharedModule } from './shared/shared.module';
import { VersionCheckService } from './shared/version-check.service';
import { ErrorLoggerService } from './shared/services/errorLogger/error-logger.service';
import { ApiService } from './shared/api/api.service';
import { LoggingApiService } from './shared/api/logging-api.service';
import { HttpErrorService } from './security/services/http-errors.service';
import { ConfirmNavigateGuard } from './master/reporting/shared/guard/confirm-navigate.guard';
import { HttpLoaderFactory } from './app.module';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;


describe('AppComponent', () => {
  const appState = [];


  const mockConfigService = {
    getConfig: () => {
      return { 'portalUrl': '' };
    }
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockVersionCheckService = jasmine.createSpyObj([
    'checkVersion'
  ]);

  const mockLoggingApiService = {
    auditTracking: () => { }
  };

  const mockHttpErrorService = {
    geterrorCode: () => { }
  };

  const mockConfirmNavigateGuard = {
    canDeactivate: () => { },
    openGenericDialog: () => { },
    confirmationModal: () => { },
    navigateWithoutModal: () => { }
  };

  const mockOktaAuthService = jasmine.createSpyObj([
    'signInWithRedirect',
    'tokenManager'
  ]);

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          AppComponent
        ],
        imports: [
          HttpClientModule,
          HttpClientTestingModule,
          RouterTestingModule,
          MaterialModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          }),
          NgReduxTestingModule,
          CoreModule,
          NavigationModule,
          StoreModule.forRoot(appState),
          PerfectScrollbarModule,
          SharedModule
        ],
        providers: [
          {
            provide: AuthenticationService, useValue: { authenticationState: () => of(true) }
          },
          {
            provide: GaActivitiesService, useValue: { create: () => of(true) }
          },
          {
            provide: ConfigService, useValue: mockConfigService
          },
          {
            provide: VersionCheckService, useValue: mockVersionCheckService
          },
          {
            provide: IconService
          },
          {
            provide: ErrorLoggerService, useValue: mockErrorLoggerService
          },
          {
            provide: LoggingApiService, useValue: mockLoggingApiService
          },
          {
            provide: OktaAuthService, useValue: mockOktaAuthService
          },
          {
            provide: HttpErrorService, useValue: mockHttpErrorService
          },
          { provide: ConfirmNavigateGuard, useValue: mockConfirmNavigateGuard },
          ApiService,
          TranslateService
        ]
      }).compileComponents();
    })
  );

  it('should create the app',
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );


});


