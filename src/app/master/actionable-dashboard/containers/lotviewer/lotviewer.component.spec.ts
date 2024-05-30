// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Observable, of } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';

import { LotviewerComponent } from './lotviewer.component';
import { LotviewerPanelComponent } from '../../components/lotviewer-panel/lotviewer-panel.component';
import { LotviewerEmbedUrl } from '../../../../contracts/models/lotviewer/lotviewer-embed-url.model';
import { EntityInfo } from '../../../../contracts/models/data-management/entity-info.model';
import { LotviewerEmbedToken } from '../../../../contracts/models/lotviewer/lotviewer-embed-token.model';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LoggingApiService } from '../../../../shared/api/logging-api.service';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { LotViewerService } from '../../../../shared/api/lotViewer.service';
import { Address } from '../../../../contracts/models/portal-api/portal-data.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { MigrationStates } from '../../../../contracts/enums/migration-state.enum';
import { HttpLoaderFactory } from '../../../../app.module';

describe('LotviewerComponent', () => {
  let component: LotviewerComponent;
  let fixture: ComponentFixture<LotviewerComponent>;
  const autofixture = new Autofixture();
  const testData = autofixture.create(new EntityInfo());
  const testLotViewerEmbedToken = autofixture.create(new LotviewerEmbedToken);
  const testLotViewerEmbedUrl = autofixture.create(new LotviewerEmbedUrl);
  testLotViewerEmbedUrl.embedToken = testLotViewerEmbedToken;

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };
  const ApiServiceStub = {
    get: (number): Observable<any> => {
      return of(testData);
    }
  };

  const appState = [];

  const navigationStub = {
    selectedNode: {},
    selectedLeaf: {},
    currentBranch: [],
    error: {},
    isSideNavExpanded: false,
    currentUser: {}
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
      roles: ['AccountManager'],
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
    migrationStatus: MigrationStates
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

  const lotViewerServiceStub = {
    getLotviewerReport: (LotviewerReportType): Observable<LotviewerEmbedUrl> => {
      // returning null due to lotviewer component long sleep interval test cases are failing
      return of(null);
    }
  };

  const mockLoggingApiService = {
    auditTracking: () => { }
  };

  const mockBrPermissionsService = {
    hasAccess: () =>  true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LotviewerComponent,
        LotviewerPanelComponent
      ],
      imports: [
        MatCardModule,
        MatDialogModule,
        StoreModule.forRoot(appState),
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
      providers: [
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: LoggingApiService, useValue: mockLoggingApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: LotViewerService, useValue: lotViewerServiceStub },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
