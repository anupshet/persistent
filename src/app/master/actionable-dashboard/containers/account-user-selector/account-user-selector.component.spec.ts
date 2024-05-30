// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';

import * as fromRoot from '../../../../state/app.state';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { Address } from '../../../../contracts/models/portal-api/portal-data.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { ConfigService } from '../../../../core/config/config.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service'
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service'
import { AuthenticationService } from '../../../../security/services';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AccountUserSelectorComponent } from './account-user-selector.component';
import { HttpLoaderFactory } from '../../../../app.module';

describe('AccountUserSelectorComponent', () => {
  let component: AccountUserSelectorComponent;
  let fixture: ComponentFixture<AccountUserSelectorComponent>;
  let hasExpiringLicense = false;
  const initialState = {};

  const getCurrentUserStub = {
    getCurrentUser: () => { }
  };

  const configServiceSpy = jasmine.createSpyObj('ConfigService', {
    getConfig: () => {
    }
  });

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockNavigationService = {
    sortNavItems: () => {
    },
    routeTo: (url: string) => {
      of(url);
    },
    navigateToUrl: jasmine.createSpy('navigate'),
    setStateForSelectedNode: jasmine.createSpy('setStateForSelectedNode')
  };

  const mockAppNavigationService = {
    logChangeLocation: () => { }
  };

  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['AccountUserManager'],
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
      }],
      primaryUnityLabNumbers: 'Test',
    }
  };

  const Accounts = {
    id: '123',
    accountNumber: '3456788',
    formattedAccountNumber: '',
    sapNumber: '',
    orderNumber: '',
    primaryUnityLabNumbers: '',
    labName: '',
    accountAddressId: '',
    accountAddress: Address,
    accountContactId: '',
    accountContact: null,
    licenseNumberUsers: 123,
    accountLicenseType: 123,
    licensedProducts: null,
    licenseAssignDate: new Date,
    licenseExpirationDate: new Date,
    comments: '',
    nodeType: EntityType.Account,
    parentNodeId: 'ROOT',
    displayName: '',
  };

  const navigationStub = {
    selectedNode: {},
    selectedLeaf: {},
    currentBranch: [],
    error: {},
    isSideNavExpanded: false,
    currentUser: {}
  };

  const storeStub = {
    security: authStub,
    auth: authStub,
    userPreference: null,
    router: null,
    navigation: navigationStub,
    location: location,
    account: {
      currentAccountSummary: Accounts
    },
    uiConfigState: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountUserSelectorComponent ],
      imports: [
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
      ],
      providers: [
        { provide: Store, useValue: storeStub },
        { provide: AuthenticationService, useValue: getCurrentUserStub },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        provideMockStore({ initialState }),
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUserSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display list of groups', () => {
    const groupName = fixture.debugElement.nativeElement.querySelectorAll('.group-name');
    expect(groupName).toBeDefined();
  });

  it('should display list of location if group exists', () => {
    const locationName = fixture.debugElement.nativeElement.querySelectorAll('.location-name');
    expect(locationName).toBeDefined();
  });

  it('Should display location selector panel', () => {
    const locationSelectorPanel = fixture.debugElement.nativeElement.querySelector('.account-user-selector-component');
    expect(locationSelectorPanel).toBeTruthy();
  });

  it('should not display location selector panel if location is selected', () => {
    const accountUserSelectorElement = fixture.debugElement.nativeElement.querySelector('.account-user-selector-component');
    expect(accountUserSelectorElement).toBeTruthy();
    component.viewAccountSelector = false;
    fixture.detectChanges();
    expect(accountUserSelectorElement.viewAccountSelector).toBeFalsy();
  });

  it('should display proceed button on the account user selector panel', () => {
    const proceedButton = fixture.debugElement.query(By.css('.proceedButton')).nativeElement;
    expect(proceedButton).toBeDefined();
  });

  it('should disable proceed button when location is not selected', () => {
    const proceedButton = fixture.debugElement.query(By.css('.proceedButton')).nativeElement;
    component.disableProceed = true;
    fixture.detectChanges();
    expect(proceedButton.disabled).toBeTruthy();
  });
});

