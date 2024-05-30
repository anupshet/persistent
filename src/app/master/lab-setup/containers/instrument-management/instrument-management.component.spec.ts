// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxModule } from '@angular-redux/store';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule, BrSelect } from 'br-component-library';
import { ConfigService } from '../../../../core/config/config.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { InstrumentEntryComponent } from '../../components/instrument-entry/instrument-entry.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { SpcRulesComponent } from '../../components/spc-rules/spc-rules.component';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { InstrumentConfigComponent } from '../instrument-config/instrument-config.component';
import { InstrumentManagementComponent } from './instrument-management.component';
import { Department } from '../../../../contracts/models/lab-setup';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { InstrumentAccessPermissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';

describe('InstrumentManagementComponent', () => {
  let component: InstrumentManagementComponent;
  let fixture: ComponentFixture<InstrumentManagementComponent>;

  const selectedNode = {
    displayName: 'Archi300',
    instrumentId: '1254',
    instrumentCustomName: 'Archi300',
    instrumentSerial: '123',
    instrumentInfo: {
      id: 1254,
      name: 'ARCHITECT c16000',
      manufacturerId: '1',
      manufacturerName: 'Abbott'
    },
    levelSettings: {
      levelEntityId: 'A914E73C1F124BEF909053B1BEB2ED19',
      levelEntityName: 'LabInstrument',
      parentLevelEntityId: '0',
      parentLevelEntityName: 'ROOT',
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 1,
      targets: [{
        controlLotId: '261',
        controlLevel: '1',
        mean: 0,
        sd: 0,
        points: 0
      }],
      rules: [
        {
          id: '1',
          category: '1k',
          k: '3',
          disposition: 'N'
        },
        {
          id: '1',
          category: '1k',
          k: '2',
          disposition: 'N'
        }
      ],
      levels: [{
        levelInUse: false,
        decimalPlace: 2
      }]
    },
    id: 'A914E73C1F124BEF909053B1BEB2ED19',
    parentNodeId: 'b5401afc-d62f-4580-a89f-5b874905b318',
    parentNode: null,
    nodeType: 4,
    children: []
  };
  const controls = [{
    displayName: 'Blood Gas Plus E',
    productId: '5',
    productMasterLotId: '136',
    productCustomName: '',
    accountSettings: null,
    hasOwnAccountSettings: false,
    id: '66d22f7c-5f90-44a4-a4b0-c2bd0ceb45e6',
    parentNodeId: '35384487-ceef-4f9b-823b-eaf8e7e01e8c',
    parentNode: null,
    nodeType: 5,
    children: [],
    lotNumber: ' Lot 22280'
  }];
  const selectedLeaf = {
    displayName: 'Dep2',
    departmentName: 'Dep2',
    departmentManagerId: '7a5e01e2-33e5-4578-bd55-a76978f06275',
    accountSettings: null,
    hasOwnAccountSettings: false,
    id: '6de94e3b-2916-4d33-af6f-f2413405ca8d',
    parentNodeId: '6de94e3b-2916-4d33-af6f-f2413405ca8d',
    parentNode: null,
    nodeType: 3,
    children: []
  };
  const mockCurrentUser = {
    'firstName': 'Pratik',
    'lastName': 'Thakare',
    'email': 'pratik_thakare+dev20@bio-rad.com',
    'userOktaId': '00u69n49iubpFpXmE2p7',
    'roles': [
      'Admin'
    ],
    'accessToken': {
      'accessToken': `eyJraWQiOiJPYWRzbHZzVDBQRU0tMUdya1FLQzd2TXY3bXVnc3B2NkdnMEx1NVczd
      S1NIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnVaUnRRczB3SW1Bc0ozcDl3ejlOTEN
      zSTJYcHJMaUoxVm1VeGxuSUlmeVkiLCJpc3MiOiJodHRwczovL2Jpb3JhZC1leHQub2t0YS5jb20vb2F1
      dGgyL2F1czUzbmxtOTAwQkJLbFBuMnA3IiwiYXVkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJpYXQiO
      jE1ODI3MTg5NTIsImV4cCI6MTU4MjcyMjU1MiwiY2lkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJ1aW
      QiOiIwMHU2OW40OWl1YnBGcFhtRTJwNyIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJwcmF
      0aWtfdGhha2FyZStkZXYyMEBiaW8tcmFkLmNvbSIsIlVzZXJMYXN0TmFtZSI6IlRoYWthcmUiLCJVc2Vy
      Rmlyc3ROYW1lIjoiUHJhdGlrIiwiVXNlckVtYWlsIjoicHJhdGlrX3RoYWthcmUrZGV2MjBAYmlvLXJhZ
      C5jb20iLCJVc2VyRGlzcGxheU5hbWUiOiJQcmF0aWsgVGhha2FyZSJ9.JdB-JPL8XAIYJ7m5dyrRK4P9C
      _he8AiIeio_1TacYR6r62TPIatbdYURA4XuTSBws5NxJ76WTXWww_G35eN7tdRjW6FZOJu6AWp0xsAwfs
      GhtOj6T4pwwkB5KsyHXo39cWYcD8skCEBv7svH4sneUypQSpBYRWAqfVog9FCoPcAhbh_jw5kotG6nj3Y
      SOMDQSkm1hR_XEAjbeUGpX57rjQGXi4cD_VBvHDFAMT19dwEcnxJiuSwlYoZwNeUG5SX54xBtb8h5RGNd
      WFeg9plh-wjHGImxaoIceQ-hxUY-6f8A9camDc-0paEv4qI7Evb7sOrBFWiQfYHvJFVGPvr-SA`,
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
    'permissions': { 'rolePermissions': {} },
    'userData': {
      'assignedLabNumbers': [],
      'defaultLab': ''
    },
    'id': 'fafc531c-963a-4c1f-92d1-0b3a78527389',
    'userName': '',
    'displayName': '',
    'labId': ''
  };
  const mockCodeListService = {
  };
  const navigationState = {
    selectedNode: selectedLeaf,
    selectedLeaf: selectedNode,
    currentBranch: [],
    error: {},
    isSideNavExpanded: false,
    currentUser: mockCurrentUser,
    showSettings: true,
    instrumentsGroupedByDept: true,
  };
  const allInstrumentInDep: Department = {
    'displayName': 'Dep2',
    'departmentManagerGroup':{},
    'departmentName': 'Dep2',
    'departmentManagerId': 'b5401afc-d62f-4580-a89f',
    'departmentManager': null,
    'id': '6de94e3b-2916-4d33-af6f-f2413405ca8d',
    'parentNodeId': 'b5401afc-d62f-4580-a89f-5b874905b318',
    'nodeType': 3,
    'children': [
      {
        'displayName': 'c4 s4',
        'instrumentId': '2749',
        'instrumentCustomName': 'c4 s4',
        'instrumentSerial': 's4',
        'instrumentInfo': null,
        'id': 'dc114d7c-ea9f-4d77-89db-9dcb71d43696',
        'parentNodeId': '6de94e3b-2916-4d33-af6f-f2413405ca8d',
        'nodeType': 4,
        'children': []
      },
      {
        'displayName': 'c6 s6',
        'instrumentId': '2903',
        'instrumentCustomName': 'c6 s6',
        'instrumentSerial': 's6',
        'instrumentInfo': null,
        'id': 'fd5793ef-44d2-4725-bfeb-f2013c8ae8fd',
        'parentNodeId': '6de94e3b-2916-4d33-af6f-f2413405ca8d',
        'nodeType': 4,
        'children': []
      }
    ]
  };
  const mockNavigationService = {
    navigateToUrl: jasmine.createSpy('navigate')
  };
  const apiServiceStub = {
    getLabSetupNode: () => of(allInstrumentInDep)
  };

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigate')
  };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  const mockEntityTypeService = {
    getLevelName: (val) => val
  };

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrSelect,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgReduxModule,
        NgReduxTestingModule,
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
        InstrumentManagementComponent,
        InstrumentConfigComponent,
        InstrumentEntryComponent,
        LabSetupHeaderComponent,
        SpcRulesComponent
      ],
      providers: [
        { provide: Store, useValue: { navigation: navigationState } },
        { provide: Router, useValue: mockRouter },
        { provide: EntityTypeService, useValue: mockEntityTypeService },
        { provide: CodelistApiService, useValue: mockCodeListService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: PortalApiService, useValue: apiServiceStub },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        SpcRulesService,
        ConfigService,
        AppLoggerService,
        SpinnerService,
        provideMockStore({}),
        TranslateService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentManagementComponent);
    component = fixture.componentInstance;
    component.getCurrentlySelectedNode$ = of(navigationState.selectedNode);
    component.getCurrentUser$ = of(navigationState.currentUser);
    component.navigationShowSettings$ = of(navigationState.showSettings);
    component.getInstrumentsGroupedByDeptVal$ = of(navigationState.instrumentsGroupedByDept);
    component.getCurrentlySelectedLeaf$ = of(navigationState.selectedLeaf);
    component.currentNode = selectedNode;
    component.showInstrumentConfig = false;
    component.hasPermissionToAccess(InstrumentAccessPermissions);
    fixture.detectChanges();
  });

  it('Verify that Instrument Management Form is displayed', () => {
    const instrumentDisplay = fixture.debugElement.nativeElement.querySelector('#spc_instrumentManagementComponent');
    expect(instrumentDisplay.childNodes).not.toBe(null);
  });

  it('Should check if Link routes to Data Table', () => {
    component.selectedNode = selectedNode;
    component.currentNode.children = controls;
    fixture.detectChanges();
    const link = fixture.debugElement.nativeElement.querySelector('#spc_returnToData');
    link.click();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/data/A914E73C1F124BEF909053B1BEB2ED19/4/table');
  });

  it('Should check if Link routes to controls', () => {
    component.selectedNode = selectedNode;
    component.currentNode.children = [];
    fixture.detectChanges();
    const link = fixture.debugElement.nativeElement.querySelector('#spc_returnToData');
    link.click();
    expect(mockNavigationService.navigateToUrl).
      toHaveBeenCalledWith('lab-setup/controls/A914E73C1F124BEF909053B1BEB2ED19/settings', false, selectedNode);
    expect(component).toBeTruthy();
  });

  it('Should check if processLabWithNoDepartments function performing set of activity.', () => {
    component.processLabWithNoDepartments(selectedNode, selectedLeaf);
    expect(component.instrumentName).toEqual('Archi300');
    expect(component.showAddInstrument).toEqual(false);
    expect(component.currentNode).toEqual(selectedNode);
    expect(component).toBeTruthy();
  });

});
