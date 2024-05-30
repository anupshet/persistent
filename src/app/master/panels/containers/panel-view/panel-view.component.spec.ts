import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Autofixture } from 'ts-autofixture/dist/src';

import { PanelViewComponent } from './panel-view.component';
import { InProgressMessageTranslationService } from '../../../../shared/services/inprogress-message-translation.service';
import { MockPanels } from '../../mock-data/panels-mock-data';
import { AuthenticationService } from '../../../../security/services';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { EntityInfo } from '../../../../contracts/models/data-management/entity-info.model';
import { DataManagementService } from '../../../../shared/services/data-management.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../../app.module';


describe('PanelViewComponent', () => {
  let component: PanelViewComponent;
  let fixture: ComponentFixture<PanelViewComponent>;
  const fakedataManagementService = jasmine.createSpy('updateEntityInfo', () => { });
  const autofixture = new Autofixture();
  const testData = autofixture.create(new EntityInfo());
  let store: MockStore<any>;
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
      'accessToken': '',
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

  const navigationState = {
    selectedNode: MockPanels[0],
    selectedLeaf: {},
    currentBranch: [],
    error: {},
    isSideNavExpanded: false,
    currentUser: mockCurrentUser,
    showSettings: true
  };

  const mockInprogressMessageService = {
    setProgressMessage: (unavailableReasonCode) => {
      return { progressHeader: null, progressMessage: null };
    },
    getTranslatedInprogressTexts: (translationCode) => { }
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const getCurrentUserStub = {
    hasDefaultSystemAccess: () => { }
  };

  const ApiServiceStub = {
    get: (number): Observable<any> => {
      return of(testData);
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot([]), RouterTestingModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
      declarations: [PanelViewComponent],
      providers: [
        { provide: AuthenticationService, useValue: getCurrentUserStub },
        { provide: Store, useValue: { navigation: navigationState } },
        { provide: InProgressMessageTranslationService, useValue: mockInprogressMessageService },
        { provide: Router, useValue: '' },
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: DataManagementService, useValue: fakedataManagementService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: Location },
        { provide: EntityTypeService },
        TranslateService,
        provideMockStore({})]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelViewComponent);
    component = fixture.componentInstance;
    component.getCurrentSelectedNode$ = of(navigationState.selectedNode);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
