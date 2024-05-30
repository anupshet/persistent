// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { MockNgRedux, NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable, of, Subject } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';
import { OktaAuthService } from '@okta/okta-angular';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';
import { InstructionIdName } from '../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { EntityInfo } from '../../../contracts/models/data-management/entity-info.model';
import { ParsingEngineService } from '../../services/parsing-engine.service';
import { AuthenticationService } from '../../../security/services';
import { PortalApiService } from '../../api/portalApi.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { EntityTypeService } from '../../services/entity-type.service';
import { SideNavService } from '../../side-nav/side-nav.service';
import { NavCurrentLocationComponent } from '../nav-header/nav-current-location/nav-current-location.component';
import { NavHeaderComponent } from '../nav-header/nav-header.component';
import { NavHierarchyComponent } from '../nav-header/nav-hierarchy/nav-hierarchy.component';
import { NavigationService } from '../navigation.service';
import { NavBarLabComponent } from './nav-bar-lab/nav-bar-lab.component';
import { NotificationComponent } from './notification/notification.component';
import { NavBarUserComponent } from './nav-bar-user/nav-bar-user.component';
import { NavBarTopComponent } from './nav-bar.component';
import { AccountState } from '../../state/reducers/account.reducers';
import { ConfigService } from '../../../core/config/config.service';
import { LoggingApiService } from '../../api/logging-api.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../app.module';
import { NotificationApiService } from '../services/notificationApi.service';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { DynamicReportingService } from '../../services/reporting.service';
import { ConfirmNavigateGuard } from '../../../master/reporting/shared/guard/confirm-navigate.guard';

@Component({
  selector: 'unext-nav-bar-setting',
  template: '<div></div>'
})
export class NavBarSettingComponent { }

describe('NavBarComponent', () => {
  let component: NavBarTopComponent;
  let fixture: ComponentFixture<NavBarTopComponent>;
  const autofixture = new Autofixture();
  const authServiceStub = {
    getCurrentUser: () => { },
    getMigrationState: () => { },
    logOut: () => {
      return of([]);
    },
  };
  const mockLoggingApiService = {
    auditTracking: () => { }
  };

  const mockNotificationApiService = {
    notificationData: () => {
      return {
        auditTrail: {
          eventType: 'notification',
          action: 'view',
          actionStatus: 'Success',
          currentValue:
            { ids: ['4c354ec8-cfbc-479b-ac3b-0dff92602c75', '72cef12e-deab-4995-975f-79638daf1718'] }
          , priorValue: {}
        },
      };
    },
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { }
  };

  const mockOktaAuthService = jasmine.createSpyObj([
    'signInWithRedirect',
    'tokenManager'
  ]);

  let authServiceInstance: AuthenticationService;
  let navigationServiceInstance: NavigationService;
  let brPermissionsServiceInstance: BrPermissionsService;
  const authStub = {
    isLoggedIn: true,
    currentUser: {
      firstName: 'Vishwajit',
      lastName: 'Shinde',
      email: 'vishwajit_shinde+dev20@bio-rad.com',
      userOktaId: '',
      roles: [
        'Admin',
        'AccountManager'
      ],
      accessToken: {},
      accountNumber: '100469',
      accountId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      accountNumberArray: [
        '100469'
      ],
      labLocationId: '0d66767b-612c-4254-9eed-3a7ab393029f',
      labLocationIds: [
        '0d66767b-612c-4254-9eed-3a7ab393029f'
      ],
      permissions: [],
      userData: {},
      id: 'eca89ea6-aba1-4b95-9396-0238352a4765'
    },
    directory: {
      displayName: '100469',
      accountNumber: '100469',
      formattedAccountNumber: 'U100469',
      sapNumber: '',
      orderNumber: '',
      accountAddressId: '30114426-9a0f-4901-bdb1-20327584045a',
      accountContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
      accountLicenseType: 0,
      licensedProducts: [
        {
          product: 1,
          fileOption: 1
        }
      ],
      licenseNumberUsers: 1,
      accountContact: {
        entityType: 0,
        searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
        firstName: 'Vishwajit',
        middleName: '',
        lastName: 'Shinde',
        name: 'Vishwajit Shinde',
        email: 'vishwajit_shinde+dev20@bio-rad.com',
        phone: '',
        id: '05c1be86-ad8d-4937-a834-2369bec4604e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
        }
      },
      accountAddress: {
        entityType: 1,
        searchAttribute: '',
        nickName: '',
        streetAddress1: '21 Technology Drive',
        streetAddress2: '',
        streetAddress3: '',
        streetAddress: '21 Technology Drive',
        suite: '',
        city: '',
        state: '',
        country: 'US',
        zipCode: '',
        id: '30114426-9a0f-4901-bdb1-20327584045a',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
        }
      },
      licenseAssignDate: '2020-02-08T03:55:17.832Z',
      licenseExpirationDate: '2025-02-14T08:00:00Z',
      comments: '',
      primaryUnityLabNumbers: '',
      migrationStatus: '',
      accountSettings: null,
      id: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      parentNodeId: 'ROOT',
      parentNode: null,
      nodeType: 0,
      children: [
        {
          displayName: 'Vishwajit\'s Lab',
          labName: 'Vishwajit\'s Lab',
          accountSettings: null,
          hasOwnAccountSettings: false,
          id: '5340ad39-3d2f-473e-a940-d27e8dbac1af',
          parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
          parentNode: null,
          nodeType: 1,
          children: [
            {
              displayName: 'Vishwajit\'s Lab',
              labLocationName: 'Vishwajit\'s Lab',
              locationTimeZone: 'America/New_York',
              locationOffset: '-05:00:00',
              locationDayLightSaving: '00:00:00',
              labLocationContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
              labLocationAddressId: '1d196092-3052-41fa-9110-b95aae0a048e',
              labLocationContact: {
                entityType: 0,
                searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
                firstName: 'Vishwajit',
                middleName: '',
                lastName: 'Shinde',
                name: 'Vishwajit Shinde',
                email: 'vishwajit_shinde+dev20@bio-rad.com',
                phone: '',
                id: '05c1be86-ad8d-4937-a834-2369bec4604e',
                featureInfo: {
                  uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
                }
              },
              labLocationAddress: {
                entityType: 1,
                searchAttribute: '',
                nickName: '',
                streetAddress1: '21 Technology Drive',
                streetAddress2: '',
                streetAddress3: '',
                streetAddress: '21 Technology Drive',
                suite: '',
                city: '',
                state: '',
                country: 'US',
                zipCode: '',
                id: '1d196092-3052-41fa-9110-b95aae0a048e',
                featureInfo: {
                  uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
                }
              },
              accountSettings: null,
              hasOwnAccountSettings: false,
              id: '0d66767b-612c-4254-9eed-3a7ab393029f',
              parentNodeId: '5340ad39-3d2f-473e-a940-d27e8dbac1af',
              parentNode: null,
              nodeType: 2,
              children: []
            }
          ]
        },
        {
          displayName: 'Vishwajit Shinde',
          contactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
          userOktaId: '00u69josqmCIi9IX52p7',
          userRoles: [
            'Admin',
            'AccountManager'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
            firstName: 'Vishwajit',
            middleName: '',
            lastName: 'Shinde',
            name: 'Vishwajit Shinde',
            email: 'vishwajit_shinde+dev20@bio-rad.com',
            phone: '',
            id: '05c1be86-ad8d-4937-a834-2369bec4604e',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: 'eca89ea6-aba1-4b95-9396-0238352a4765',
            lastSelectedEntityId: '0d66767b-612c-4254-9eed-3a7ab393029f',
            lastSelectedEntityType: 2,
            termsAcceptedDateTime: '2020-02-08T06:41:36.215Z',
            id: 'eca89ea6-aba1-4b95-9396-0238352a4765',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100469',
              accountNumber: '100469',
              formattedAccountNumber: 'U100469',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '30114426-9a0f-4901-bdb1-20327584045a',
              accountContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 1
                }
              ],
              licenseNumberUsers: 1,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-08T03:55:17.832Z',
              licenseExpirationDate: '2025-02-14T08:00:00Z',
              comments: '',
              primaryUnityLabNumbers: '',
              migrationStatus: '',
              accountSettings: null,
              id: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: 'eca89ea6-aba1-4b95-9396-0238352a4765',
          parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'Vishwajit Shinde',
          contactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
          userOktaId: '00u69josqmCIi9IX52p7',
          userRoles: ['LabSupervisor', 'LeadTechnician', 'Technician'],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
            firstName: 'Vishwajit',
            middleName: '',
            lastName: 'Shinde',
            name: 'Vishwajit Shinde',
            email: 'vishwajit_shinde+dev20@bio-rad.com',
            phone: '',
            id: '05c1be86-ad8d-4937-a834-2369bec4604e',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: '8939cdc3-791b-424a-9b4b-4a3b7b957610',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: null,
            id: '8939cdc3-791b-424a-9b4b-4a3b7b957610',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100469',
              accountNumber: '100469',
              formattedAccountNumber: 'U100469',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '30114426-9a0f-4901-bdb1-20327584045a',
              accountContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 1
                }
              ],
              licenseNumberUsers: 1,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-08T03:55:17.832Z',
              licenseExpirationDate: '2025-02-14T08:00:00Z',
              comments: '',
              primaryUnityLabNumbers: '',
              migrationStatus: '',
              accountSettings: null,
              id: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: '8939cdc3-791b-424a-9b4b-4a3b7b957610',
          parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
          parentNode: null,
          nodeType: 7,
          children: []
        }
      ]
    }
  };
  const AccountStub = {
    currentAccountSummary: {
      accountAddress: {
        entityType: 1,
        searchAttribute: '',
        nickName: '',
        streetAddress1: '21 Technology Drive',
        streetAddress2: '',
        streetAddress3: '',
        streetAddress: '21 Technology Drive',
        suite: '',
        city: '',
        state: '',
        country: 'US',
        zipCode: '',
        id: '30114426-9a0f-4901-bdb1-20327584045a',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
        }
      },
      accountAddressId: '30114426-9a0f-4901-bdb1-20327584045a',
      accountContact: {
        entityType: 0,
        searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
        firstName: 'Vishwajit',
        middleName: '',
        lastName: 'Shinde',
        name: 'Vishwajit Shinde',
        email: 'vishwajit_shinde+dev20@bio-rad.com',
        phone: '',
        id: '05c1be86-ad8d-4937-a834-2369bec4604e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
        }
      },
      accountContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
      accountLicenseType: 0,
      accountNumber: '100469',
      comments: '',
      displayName: '100469',
      formattedAccountNumber: 'U100469',
      id: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      licenseAssignDate: '2020-02-08T03:55:17.832Z',
      licenseExpirationDate: '2025-02-14T08:00:00Z',
      licenseNumberUsers: 1,
      licensedProducts: [
        {
          product: 1,
          fileOption: 1
        }
      ],
      nodeType: 0,
      orderNumber: '',
      parentNodeId: 'ROOT',
      primaryUnityLabNumbers: null,
      migrationStatus: '',
      sapNumber: ''
    }
  };
  const selectedNodeData = {
    displayName: 'Vishwajit\'s Lab ',
    labLocationName: 'Vishwajit\'s Lab ',
    locationTimeZone: 'America/New_York ',
    locationOffset: '-05:00:00 ',
    locationDayLightSaving: '00:00:00 ',
    labLocationContactId: '05c1be86-ad8d-4937-a834-2369bec4604e ',
    labLocationAddressId: '1d196092-3052-41fa-9110-b95aae0a048e ',
    accountSettings: null,
    hasOwnAccountSettings: false,
    id: '0d66767b-612c-4254-9eed-3a7ab393029f ',
    parentNodeId: '5340ad39-3d2f-473e-a940-d27e8dbac1af ',
    parentNode: null,
    nodeType: 2,
    children: []
  };
  const navigationStoreStub = {
    selectedNode: selectedNodeData,
    selectedLeaf: {},
    currentBranch: [],
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: true,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: true
  };
  const storeStub = {
    security: null,
    auth: authStub,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: navigationStoreStub,
    location: null,
    dataManagement: null
  };
  const instructionsStub = autofixture.createMany(new InstructionIdName);
  const testData = autofixture.create(new EntityInfo());

  const ApiServiceStub = {
    get: (number): Observable<any> => {
      return of(testData);
    }
  };

  const mockParsingEngineService = {
    getInstructions(labId: string): Observable<any> {
      return of(instructionsStub);
    }
  };

  const mockNavigationService = {
    sortNavItems: () => { },
    navigateToDashboard: () => { },
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

  class MockNotificationService {
    public get $labStream() {
      return of(null);
    }
  }

  const mockConfirmNavigateGuard = {
    canDeactivate:     () => { },
    openGenericDialog: () => { },
    confirmationModal: () => { },
  };

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const dynamicReportingService = {
    getReportNotifications: () => of([])
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        CommonModule,
        NgReduxTestingModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })],
      declarations: [
        NavBarTopComponent, NavBarLabComponent, NotificationComponent,
        NavBarSettingComponent, NavBarUserComponent, NavHeaderComponent, NavHierarchyComponent,
        NavCurrentLocationComponent,
        TruncatePipe
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceStub },
        EntityTypeService,
        SideNavService,
        TranslateService,
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: ParsingEngineService, useValue: mockParsingEngineService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: LoggingApiService, useValue: mockLoggingApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: NotificationApiService, useValue: mockNotificationApiService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: OktaAuthService, useValue: mockOktaAuthService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: DynamicReportingService, useValue: dynamicReportingService },
        { provide: ConfirmNavigateGuard, useValue: mockConfirmNavigateGuard },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const accountStateStub: Subject<any> = MockNgRedux.getSelectorStub<AccountState, any>('accountState');
    accountStateStub.next(AccountStub);
    fixture = TestBed.createComponent(NavBarTopComponent);
    component = fixture.componentInstance;
    authServiceInstance = fixture.debugElement.injector.get(AuthenticationService);
    navigationServiceInstance = fixture.debugElement.injector.get(NavigationService);
    brPermissionsServiceInstance = fixture.debugElement.injector.get(BrPermissionsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigateToDashboard service on button click', () => {
    spyOn(navigationServiceInstance, 'navigateToDashboard');

    const button1 = fixture.debugElement.query(By.css('#spc_header_logo_button'));
    button1.triggerEventHandler('click', null);

    fixture.detectChanges();
    expect(navigationServiceInstance.navigateToDashboard).toHaveBeenCalled();
  });

});
