// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { MaterialModule } from 'br-component-library';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { NavigationService } from '../../navigation/navigation.service';
import { SettingBarComponent } from './setting-bar.component';
import { UserMessagesDialogComponent } from './tos-modal/user-messages-modal-dialog.component';
import { AuthenticationService, OktaService, AuthEventService } from '../../../security/services';
import { Okta } from '../../../security/services/okta.widget';
import { SecurityConfigService } from '../../../security/security-config.service';
import { ConfigService } from '../../../core/config/config.service';
import { UserPreferenceService } from '../../user-preference.service';
import { AppLoggerService } from '../../services/applogger/applogger.service';
import { UserPreferenceAction } from '../../services/user-preference/user-preference.action';
import { BrPermissionsService } from '../../../security/services/permissions.service';


describe('SettingBarComponent', () => {
  let component: SettingBarComponent;
  let fixture: ComponentFixture<SettingBarComponent>;
  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['Admin'],
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

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          MaterialModule,
          FormsModule,
          ReactiveFormsModule,
          NgReduxTestingModule,
          RouterTestingModule,
          BrowserAnimationsModule,
          MatToolbarModule,
          MatDividerModule,
          BrowserAnimationsModule,
          HttpClientTestingModule,
          StoreModule.forRoot([])
        ],
        declarations: [SettingBarComponent, UserMessagesDialogComponent],
        providers: [
          AppLoggerService,
          {
            provide: AuthenticationService,
            useValue: {}
          },
          {
            provide: UserPreferenceService,
            useValue: {
              resetUserPreferenceState: () => of ({})
            }
          },
          UserPreferenceAction,
          {
            provide: OktaService,
            useValue: {
              getWidget: () => of({})
            }
          },
          { provide: Okta,
            useValue: {}
          },
          SecurityConfigService,
          AuthEventService,
          {
            provide: ConfigService,
            useValue: {
              getConfig: () => of({})
            } // Add any data you wish to test if it is passed/used correctly
          },
          { provide: NavigationService, useValue: of('') },
          { provide: Store, useValue: storeStub },
          { provide: BrPermissionsService, useValue: mockBrPermissionsService },
          { provide: TranslateService, useValue: { get: tag => of(tag) } },
          provideMockStore({ initialState: storeStub })
        ]
      }).compileComponents();
    })
  );


  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
