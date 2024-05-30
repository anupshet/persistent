// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgRedux } from '@angular-redux/store';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrSelectComponent, MaterialModule } from 'br-component-library';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ApiService } from '../../../../shared/api/api.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { TreeNodesService } from '../../../../shared/services/tree-nodes.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { DepartmentEntryComponent } from '../../components/department-entry/department-entry.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { LabSetupDefaultsService } from '../../services/lab-setup-defaults.service';
import { DepartmentConfigComponent } from '../department-config/department-config.component';
import { DepartmentManagementComponent } from './department-management.component';
import { DepartmentAccessPermissions, Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

describe('DepartmentManagementComponent', () => {
  let component: DepartmentManagementComponent;
  let fixture: ComponentFixture<DepartmentManagementComponent>;
  const initialState = {};
  const State = [];
  let store: MockStore<any>;
  const selectedNodeData = {
    'displayName': 'New Mexico',
    'id': '72285DC498024F1DADCF8E9BC12DCDD3',
    'labLocationAddress': '',
    'labLocationAddressId': '0839deff-5a11-4ece-b781-e3868f2fcdb6',
    'labLocationContact': '',
    'labLocationContactId': 'c3a68a6c-d4db-4062-a1c3-bc143c472532',
    'labLocationName': 'New Mexico',
    'locationDayLightSaving': false,
    'locationOffset': 0,
    'locationTimeZone': 'Asia/Calcutta',
    'nodeType': 2,
    'parentNode': null,
    'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
    'children': [{
      'displayName': 'vishwajit Department',
      'departmentName': 'vishwajit Department',
      'departmentManagerId': 'C6BEB0158D4248D782B980752FA5CB2F',
      'departmentManager': {},
      'id': 'D5B5684C0D6B4436A29A64474E3A8B0E',
      'parentNodeId': '4B84D29BDD4F40FDB2BA0B4CEE10EBCF',
      'parentNode': null,
      'nodeType': 3,
      'children': []
    }]
  };

  const mockCurrentUser = {
    'firstName': 'World',
    'lastName': 'Traveler',
    'email': 'test@bio-rad.com',
    'userOktaId': '789789789789',
    'roles': [
      'Admin'
    ],
    'accessToken': {
      'accessToken': ``,
      'expiresAt': '1582722553',
      'tokenType': 'Bearer',
      'scopes': [
        'openid',
        'email'
      ],
      'authorizeUrl': 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/authorize',
      'userinfoUrl': 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/userinfo'
    },
    'accountNumber': '100472',
    'accountId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
    'accountNumberArray': [
      '100472'
    ],
    'labLocationId': 'b5401afc-d62f-4580-a89f-5b874905b318',
    'labLocationIds': [
      'b5401afc-d62f-4580-a89f-5b874905b318'
    ],
    'permissions': [],
    'userData': {
      'assignedLabNumbers': [],
      'defaultLab': ''
    },
    'id': 'fafc531c-963a-4c1f-92d1-0b3a78527389',
    'userName': '',
    'displayName': '',
    'labId': '',
  };

  class MockEntityTypeService { }
  class MockRouter { }
  const MockNgRedux = {
    select: () => {
      return { subscribe: () => { } };
    }
  };
  class MockAppLoggerService { }
  const navigationState = {
    selectedNode: selectedNodeData,
    selectedLeaf: null,
    currentBranch: [],
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: true,
    navigation: true,
    showArchivedItemsToggle: false,
    isArchiveItemsToggleOn: false
  };

  const mockNavigationService = {
    navigateToUrl: jasmine.createSpy()
  };

  const mockPortalApiService = {
    getUsers: () => null,
    getLabSetupNode: () => of(selectedNodeData)
  };

  const mockApiService = {
    apiUrl: 'apiUrl',
    subscriptionKey: 'subscriptionKey'
  };



  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    resetData: () => { },
    auditTrailViewData: () => { }
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = DepartmentAccessPermissions;
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };
  const TRANSLATIONS_EN = require('../../../../../assets/i18n/en.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        StoreModule.forRoot(State),
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        DepartmentManagementComponent,
        DepartmentConfigComponent,
        DepartmentEntryComponent,
        LabSetupHeaderComponent,
        BrSelectComponent
      ],
      providers: [
        LabSetupDefaultsService,
        TreeNodesService,
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: ApiService, useValue: mockApiService },
        { provide: Store, useValue: navigationState },
        provideMockStore({ initialState }),
        { provide: NavigationService, useValue: mockNavigationService },
        {
          provide: EntityTypeService, useClass: MockEntityTypeService
        },
        {
          provide: Router, useClass: MockRouter
        },
        {
          provide: AppLoggerService, useClass: MockAppLoggerService
        },
        {
          provide: NgRedux, useValue: MockNgRedux
        },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService,
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(DepartmentManagementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    store.setState(navigationState);
    fixture = TestBed.createComponent(DepartmentManagementComponent);
    component = fixture.componentInstance;
    component.navigationCurrentlySelectedNode$ = of(selectedNodeData);
    component.showSettings$ = of(navigationState.showSettings);
    component.getIsArchiveItemsToggleOn$ = of(navigationState.isArchiveItemsToggleOn);
    component.getCurrentUserState$ = of(mockCurrentUser);
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should card display', () => {
    component.showSettings = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector('.spec_cardDetails');
    fixture.detectChanges();
    expect(compiled).toBeTruthy();
  });

  it('should  multiple department cards and content are displayed correctly', () => {
    component.showSettings = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('card')).not.toBe(null);
    const departmentTitle = component.location.children[0].displayName;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector('.spec_cardDetails');
    expect(compiled.title).toEqual(departmentTitle);
  });

  it('should  "Add a Department" link is displayed and routes to LabSetup-Department', () => {
    component.showSettings = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement;
    const elem = compiled.nativeElement.querySelector('.addDepartmentButton');
    const button = compiled.query(e => e.name === 'button');
    expect(!!button).toBe(true);
    expect(TRANSLATIONS_EN.DEPARTMENTMANAGEMENT.ADDDEPARTMENT).toBe('Add a Department');

    elem.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockNavigationService.navigateToUrl).toHaveBeenCalled();
    });
  });

  it('Should call linkClicked() on card click', () => {
    const data = {
      'url': '/lab-setup/instruments/116b3d44-cadd-40f6-84e3-03b9388e1385/settings',
      'selectedNodeId': '7f6762b7-d75b-45fd-a00f-f1b53dedb4b0'
    };
    component.linkClicked(data);
    fixture.detectChanges();
    mockNavigationService.navigateToUrl(data.url, false, null, data.selectedNodeId);
    expect(mockNavigationService.navigateToUrl).toHaveBeenCalledWith(data.url, false, null, data.selectedNodeId);
  });

  it('Should load Card details data', () => {
    const selectedNodedata = {
      'displayName': 'New Mexico',
      'id': '72285DC498024F1DADCF8E9BC12DCDD3',
      'labLocationAddress': '',
      'labLocationAddressId': '0839deff-5a11-4ece-b781-e3868f2fcdb6',
      'labLocationContact': '',
      'labLocationContactId': 'c3a68a6c-d4db-4062-a1c3-bc143c472532',
      'labLocationName': 'New Mexico',
      'locationDayLightSaving': false,
      'locationOffset': 0,
      'locationTimeZone': 'Asia/Calcutta',
      'nodeType': 3,
      'parentNode': null,
      'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
      'children': [{
        'displayName': 'vishwajit Department',
        'departmentName': 'vishwajit Department',
        'departmentManagerId': 'C6BEB0158D4248D782B980752FA5CB2F',
        'departmentManager': {},
        'id': 'D5B5684C0D6B4436A29A64474E3A8B0E',
        'parentNodeId': '4B84D29BDD4F40FDB2BA0B4CEE10EBCF',
        'parentNode': null,
        'nodeType': 3,
        'children': []
      }]
    };
    const selectedNodeDataleaf = {
      'displayName': 'New Mexico',
      'id': '72285DC498024F1DADCF8E9BC12DCDD3',
      'labLocationAddress': '',
      'labLocationAddressId': '0839deff-5a11-4ece-b781-e3868f2fcdb6',
      'labLocationContact': '',
      'labLocationContactId': 'c3a68a6c-d4db-4062-a1c3-bc143c472532',
      'labLocationName': 'New Mexico',
      'locationDayLightSaving': false,
      'locationOffset': 0,
      'locationTimeZone': 'Asia/Calcutta',
      'nodeType': 2,
      'parentNode': null,
      'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
      'children': [{
        'displayName': 'vishwajit Department',
        'departmentName': 'vishwajit Department',
        'departmentManagerId': 'C6BEB0158D4248D782B980752FA5CB2F',
        'departmentManager': {},
        'id': 'D5B5684C0D6B4436A29A64474E3A8B0E',
        'parentNodeId': '4B84D29BDD4F40FDB2BA0B4CEE10EBCF',
        'parentNode': null,
        'nodeType': 3,
        'children': []
      }]
    };
    component.navigationCurrentlySelectedNode$ = of(selectedNodedata);
    component.navigationCurrentlySelectedLeaf$ = of(selectedNodeDataleaf);
    component.showSettings = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('card')).not.toBe(null);
    const departmentTitle = component.location.children[0].displayName;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector('.spec_cardDetails');
    expect(compiled.title).toEqual(departmentTitle);
  });
  it('Should called add department button click', () => {
    component.addDepartmentButtonClick();
    fixture.detectChanges();
    expect(mockNavigationService.navigateToUrl).toHaveBeenCalled();
  });
});
