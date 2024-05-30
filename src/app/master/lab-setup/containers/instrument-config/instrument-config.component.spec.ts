// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxModule } from '@angular-redux/store';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';

import { BrSelect, MaterialModule } from 'br-component-library';

import { EntityInfo } from '../../../../contracts/models/data-management/entity-info.model';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { ConfigService } from '../../../../core/config/config.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { InstrumentEntryComponent } from '../../components/instrument-entry/instrument-entry.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { SpcRulesComponent } from '../../components/spc-rules/spc-rules.component';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import * as actions from '../../state/actions';
import { InstrumentConfigComponent } from './instrument-config.component';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { LabInstrumentValues } from '../../../../contracts/models/lab-setup/instrument.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { HttpLoaderFactory } from '../../../../../app/app.module';
import { LocalizationService } from '../../../../shared/navigation/services/localizaton.service';
import { ApiService } from '../../../../shared/api/api.service';

describe('InstrumentConfigComponent', () => {
  let component: InstrumentConfigComponent;
  let fixture: ComponentFixture<InstrumentConfigComponent>;
  let dispatchSpy;
  let store: MockStore<any>;
  const autofixture = new Autofixture();
  const archivedSettings = autofixture.create(new Settings());
  const manufacturersList = autofixture.create(new Manufacturer());

  const mockDepartmant = {
    children: [],
    departmentManager: {
      firstName: '',
      middleName: '',
      lastName: '',
      name: '',
      email: '',
      phone: '',
      id: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
      entityType: null
    },
    levelSettings: {
      levelEntityId: null,
      levelEntityName: null,
      parentLevelEntityId: null,
      parentLevelEntityName: null,
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 0,
      targets: [{
        controlLotId: '261',
        controlLevel: '1',
        mean: 0,
        sd: 0,
        points: 0
      }],
      rules: [{
        id: '2',
        category: '1k',
        k: '3',
        disposition: 'N'
      }],
      levels: [{
        levelInUse: true,
        decimalPlace: 3
      }]
    },
    departmentManagerId: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
    departmentName: 'vishwajit Department1',
    displayName: 'vishwajit Department1',
    id: 'E0EB71CDDBCE4E849EF11140A063F732',
    nodeType: 3,
    parentNodeId: '4B84D29BDD4F40FDB2BA0B4CEE10EBCF',
  };

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
    parentNodeId: 'EDAB53E0CA694FDF80A7CB4D756030C7',
    parentNode: null,
    nodeType: 4,
    children: []
  };

  const testData = autofixture.create(new EntityInfo());
  const ApiServiceStub = {
    get: (number): Observable<any> => {
      return of(testData);
    },
    getLabSetupNode: () => of(mockDepartmant)
  };
  const mockNavigationService = {
    navigateToUrl: () => { }
  };
  const mockLocalizationService = {
    getLanguageMapping: () => { },
  };
  const mockCurrentUser = {
    'firstName': 'Pratik',
    'lastName': 'Thakare',
    'email': 'pratik_thakare+dev20@bio-rad.com',
    'userOktaId': '00u69n49iubpFpXmE2p7',
    'roles': [
      'Admin',
      'AccountManager'
    ],
    'accessToken': {
      'accessToken': 'eyJraWQiOiJPYWRzbHZzVDBQRU0tMUdya1FLQzd2TXY3bXVnc3B2NkdnMEx1NVczdS1NIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnVaUnRRczB3SW1Bc0ozcDl3ejlOTENzSTJYcHJMaUoxVm1VeGxuSUlmeVkiLCJpc3MiOiJodHRwczovL2Jpb3JhZC1leHQub2t0YS5jb20vb2F1dGgyL2F1czUzbmxtOTAwQkJLbFBuMnA3IiwiYXVkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJpYXQiOjE1ODI3MTg5NTIsImV4cCI6MTU4MjcyMjU1MiwiY2lkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJ1aWQiOiIwMHU2OW40OWl1YnBGcFhtRTJwNyIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJwcmF0aWtfdGhha2FyZStkZXYyMEBiaW8tcmFkLmNvbSIsIlVzZXJMYXN0TmFtZSI6IlRoYWthcmUiLCJVc2VyRmlyc3ROYW1lIjoiUHJhdGlrIiwiVXNlckVtYWlsIjoicHJhdGlrX3RoYWthcmUrZGV2MjBAYmlvLXJhZC5jb20iLCJVc2VyRGlzcGxheU5hbWUiOiJQcmF0aWsgVGhha2FyZSJ9.JdB-JPL8XAIYJ7m5dyrRK4P9C_he8AiIeio_1TacYR6r62TPIatbdYURA4XuTSBws5NxJ76WTXWww_G35eN7tdRjW6FZOJu6AWp0xsAwfsGhtOj6T4pwwkB5KsyHXo39cWYcD8skCEBv7svH4sneUypQSpBYRWAqfVog9FCoPcAhbh_jw5kotG6nj3YSOMDQSkm1hR_XEAjbeUGpX57rjQGXi4cD_VBvHDFAMT19dwEcnxJiuSwlYoZwNeUG5SX54xBtb8h5RGNdWFeg9plh-wjHGImxaoIceQ-hxUY-6f8A9camDc-0paEv4qI7Evb7sOrBFWiQfYHvJFVGPvr-SA',
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
    'labId': ''
  };
  const navigationState = {
    selectedNode: selectedNode,
    selectedLeaf: {},
    currentBranch: [],
    error: {},
    isSideNavExpanded: false,
    currentUser: mockCurrentUser,
    showSettings: true
  };
  const mockCodeListService = {
    getInstruments: () => {
      return of([manufacturersList]);
    },
  };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        BrSelect,
        NgReduxModule,
        NgReduxTestingModule,
        StoreModule.forRoot([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        InstrumentConfigComponent,
        InstrumentEntryComponent,
        LabSetupHeaderComponent,
        SpcRulesComponent,
      ],
      providers: [
        ConfigService,
        EntityTypeService,
        SpcRulesService,
        AppLoggerService,
        SpinnerService,
        TranslateService,
        { provide: Store, useValue: { navigation: navigationState } },
        { provide: CodelistApiService, useValue: mockCodeListService },
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: LocalizationService, mockLocalizationService },
        ApiService,
        provideMockStore({})
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));
  beforeEach(() => {
    store.setState(navigationState);
    fixture = TestBed.createComponent(InstrumentConfigComponent);
    component = fixture.componentInstance;
    component.labConfigManufacturers$ = of([manufacturersList]);
    component.currentUserState$ = of(navigationState.currentUser);
    component.getIsArchiveItemsToggleOn$ = of(false);
    fixture.detectChanges();
  });

  it('Ensure setTitle function perform set of activity', () => {
    selectedNode.levelSettings.dataType = 0;
    component.currentNode = selectedNode;
    expect(component.selectedNodeDisplayName).toBe(selectedNode.displayName);
    expect(typeof component.selectedNodeDisplayName).toEqual('string');
    expect(typeof component.labSetupInstrumentHeaderTitle).toEqual('string');
  });

  it('Ensure all instruemnt list gets loaded ', () => {
    selectedNode.levelSettings.dataType = 0;
    const children = mockDepartmant.children;
    component.currentNode = selectedNode;
    component.currentNode.nodeType = 3;
    expect(component.allInstrumentInDep).toEqual(children);
  });

  it('Ensure restInstrumentConfig function resetting instrument list', () => {
    component.restInstrumentConfigData();
    expect(typeof component.instrumentList).toEqual('object');
    expect(component.instrumentList.length).toEqual(0);
  });

  it('Ensure onLoadInstruments function returning correct data.', fakeAsync(() => {
    component.onLoadInstruments('1', 0);
    tick(1000);
    expect(typeof component.instrumentList).toEqual('object');
    expect(component.instrumentList[0].length).toEqual(1);
  }));

  it('should dispatch selectedNodeId for deleting instrument.', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    const nodeId = selectedNode;
    component.onDeleteInstrument(nodeId);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      actions.LabConfigInstrumentActions.deleteInstrument({ instrument: nodeId })
    );
  });

  it('should dispatch instrument for saving it.', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    const nodeType = EntityType.LabInstrument;
    const typeOfOperation = true;
    const labInstruments: LabInstrumentValues = {
      labConfigFormValues: [selectedNode],
      archivedSettings: archivedSettings, nodeType, typeOfOperation
    };
    component.saveLabConfigurationInstrument(labInstruments);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      actions.LabConfigInstrumentActions.saveInstruments({ labInstruments })
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
