// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MatMenuHarness, MatMenuItemHarness } from '@angular/material/menu/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


import { Observable, of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';
import { Autofixture } from '../../../../../../node_modules/ts-autofixture/dist/src';
import { InstructionIdName } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { Header } from '../../../../contracts/models/data-management/header.model';
import { ParsingEngineService } from '../../../services/parsing-engine.service';
import { ApiService } from '../../../api/api.service';
import { TreeNodesService } from '../../../services/tree-nodes.service';
import { ConfigService } from '../../../../core/config/config.service';
import { NavBarSettingComponent } from './nav-bar-setting.component';
import { NavigationService } from '../../navigation.service';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import { UserRole } from '../../../../contracts/enums/user-role.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { FeatureFlagsService } from '../../../../shared/services/feature-flags.service';

describe('NavBarSettingComponent', () => {
  const autofixture = new Autofixture();
  let component: NavBarSettingComponent;
  let fixture: ComponentFixture<NavBarSettingComponent>;
  const instructionsStub = autofixture.createMany(new InstructionIdName);
  const appState = [];
  let loader: HarnessLoader;
  const mockFeatureFlagsService = {
    hasClientInitialized: () => true,
    getFeatureFlag: () => true,
    getClient: () => ({ on: () => {} })
  };
  const mockCurrentLabLocation = {
    children: [],
    locationTimeZone: 'America/Los_Angeles',
    locationOffset: '',
    locationDayLightSaving: '',
    nodeType: 2,
    labLocationName: '',
    labLocationContactId: '',
    labLocationAddressId: '',
    labLocationContact: null,
    labLocationAddress: null,
    id: '',
    parentNodeId: '',
    displayName: '',
    contactRoles: [UserRole.LabSupervisor],
    locationSettings: {
      displayName: '',
      dataType: 1,
      instrumentsGroupedByDept: true,
      trackReagentCalibrator: false,
      fixedMean: false,
      decimalPlaces: 2,
      siUnits: false,
      labSetupRating: 0,
      labSetupComments: '',
      isLabSetupComplete: true,
      labSetupLastEntityId: 'null',
      id: '635b3412-679a-4201-97f4-c6df45bcfab6',
      parentNodeId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
      parentNode: null,
      nodeType: 9,
      children: null,
      isLabSetupCompleted: true
    },
    previousContactUserId: null,
    labLanguagePreference: 'en-us'
  };

  const selectedNode = {
    'displayName': 'New Mexico',
    'id': 'fake id',
    'labLocationAddress': '',
    'labLocationAddressId': '',
    'labLocationContact': '',
    'labLocationContactId': '',
    'labLocationName': 'New Mexico',
    'locationDayLightSaving': false,
    'locationOffset': 0,
    'locationTimeZone': 'Asia/Calcutta',
    'nodeType': 6,
    'parentNode': null,
    'parentNodeId': '',
    'children': []
  };

  const directoryChildren = [
    {
      'displayName': 'New Mexico',
      'id': 'fake id',
      'labLocationAddress': '',
      'labLocationAddressId': '',
      'labLocationContact': '',
      'labLocationContactId': '',
      'labLocationName': 'New Mexico',
      'locationDayLightSaving': false,
      'locationOffset': 0,
      'locationTimeZone': 'Asia/Calcutta',
      'nodeType': 5,
      'parentNode': null,
      'parentNodeId': '',
      'children': []
    },
    {
      'displayName': 'New Mexico',
      'id': 'fake id',
      'labLocationAddress': '',
      'labLocationAddressId': '',
      'labLocationContact': '',
      'labLocationContactId': '',
      'labLocationName': 'New Mexico',
      'locationDayLightSaving': false,
      'locationOffset': 0,
      'locationTimeZone': 'Asia/Calcutta',
      'nodeType': 6,
      'parentNode': null,
      'parentNodeId': '',
      'children': []
    }
  ];

  const authState = {
    isLoggedIn: true,
    currentUser: {
      labId: '1',
      firstName: 'first',
      lastName: 'last',
      email: 'user@bio-rad.com',
      userId: '112233',
      accountNumber: '123456789',
      labLocationId: '1234',
      accountId: '123456789',
      roles: ['LabSupervisor', 'LeadTechnician', 'Technician'],
      userOktaId: 'fake id',
      accessToken: {
        tokenType: 'Bearer',
      },
    },
    directory: {
      displayName: 'fake',
      accountNumber: 'fake',
      accountSettings: {
        displayName: '',
        dataType: 1,
        instrumentsGroupedByDept: true,
        trackReagentCalibrator: true,
        fixedMean: false,
        decimalPlaces: 4,
        siUnits: false,
        labSetupRating: 0,
        labSetupComments: '',
        isLabSetupComplete: false,
        labSetupLastEntityId: 'null',
        nodeType: 9,
        children: null
      },
      id: '12345',
      nodeType: 6,
      children: directoryChildren
    }
  };

  const userPreferenceState = {
    userPreference: {
      entityType: 2,
      lastSelectedEntityId: null,
      lastSelectedEntityType: 0,
      id: 'fake id',
    },
    isLoading: false
  };

  const initialState = {
    security: null,
    auth: null,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null
  };
  const storeStub = {
    security: null,
    auth: authState,
    userPreference: userPreferenceState,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null
  };

  const ApiServiceStub = {
    get: (number): Observable<Header> => {
      return of();
    }
  };

  const mockParsingEngineService = {
    getInstructions(labId: string): Observable<any> {
      return of(instructionsStub);
    }
  };
  let mockNavigationServiceInstance: NavigationService;
  const mockNavigationService = {
    routeToUserManagement: (labId: string) => { },
    routeToMapping: () => { },
    routeToFileUpload: () => { },
    routeToAccountManagement: () => { },
    routeToDashboard: () => { },
    navigateToManageControls: () => { }
  };
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule,
        NoopAnimationsModule,
        NgReduxTestingModule,
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
      declarations: [NavBarSettingComponent],
      providers: [
        { provide: FeatureFlagsService, useValue: mockFeatureFlagsService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: ApiService, useValue: ApiServiceStub },
        { provide: ParsingEngineService, useValue: mockParsingEngineService },
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState }),
        { provide: TreeNodesService, useValue: {} },
        {
          provide: ConfigService,
          useValue: { getConfig: () => of({}) }
        },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarSettingComponent);
    component = fixture.componentInstance;
    mockNavigationServiceInstance = fixture.debugElement.injector.get(NavigationService);
    component.hasConnectivityLicense = true;
    component.overlapTrigger = true;
    component.hasNonBrLicense = true;
    component.getCurrentLabLocation$ = of(mockCurrentLabLocation);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to connectivity mapping', () => {
    spyOn(mockNavigationServiceInstance, 'routeToMapping');
    component.navigateToConnectivityMapping();
    fixture.detectChanges();
    expect(mockNavigationServiceInstance.routeToMapping).toHaveBeenCalledWith(component.userLabId);
  });

  it('should navigate to account management', () => {
    spyOn(mockNavigationServiceInstance, 'routeToAccountManagement');
    component.navigateToAccountManagement();
    fixture.detectChanges();
    expect(mockNavigationServiceInstance.routeToAccountManagement).toHaveBeenCalled();
  });

  it('should navigate to dashboard', () => {
    spyOn(mockNavigationServiceInstance, 'routeToDashboard');
    component.navigateToDashboard();
    fixture.detectChanges();
    expect(mockNavigationServiceInstance.routeToDashboard).toHaveBeenCalled();
  });

  it('should navigate to file upload', () => {
    spyOn(mockNavigationServiceInstance, 'routeToFileUpload');
    component.navigateToFileUpload();
    fixture.detectChanges();
    expect(mockNavigationServiceInstance.routeToFileUpload).toHaveBeenCalledWith(component.userLabId);
  });

  it('should check if migration value changes', () => {
    component.migrationPending = true;
    component.ngOnChanges({
      migrationPending: new SimpleChange(null, component.migrationPending, false)
    });
    fixture.detectChanges();
    expect(component.migrationPending).toBeTruthy();
  });

  it('should check it works if current node is LabTest', () => {
    component.hasTests = component.searchForTests(selectedNode);
    expect(component.hasTests).toBeTruthy();
  });

  it('should open terms of use', () => {
    spyOn(window, 'open');
    spyOn(component, 'getCurrentLanguage').and.returnValue('en');
    component.openTermsOfUse();
    fixture.detectChanges();
    const currentLanguage = component.getCurrentLanguage();
    expect(window.open).toHaveBeenCalledWith(`assets/pdf/terms_of_use/UN_Terms_Of_Use_${currentLanguage}.pdf`, '_blank');
  });

  it('should open reference guide', () => {
    spyOn(window, 'open');
    spyOn(component, 'getCurrentLanguage').and.returnValue('en');
    component.routeToHelpCenter();
    fixture.detectChanges();
    const currentLanguage = component.getCurrentLanguage();
    expect(window.open).toHaveBeenCalledWith(`assets/pdf/reference_guide/UN_Reference_Guide_${currentLanguage}.pdf`, '_blank');
  });

  it('should open release notes', () => {
    spyOn(window, 'open');
    spyOn(component, 'getCurrentLanguage').and.returnValue('en');
    component.openReleaseNotes();
    fixture.detectChanges();
    const currentLanguage = component.getCurrentLanguage();
    expect(window.open).toHaveBeenCalledWith(`assets/pdf/release_notes/UN_Release_Notes_${currentLanguage}.pdf`, '_blank');
  });


  it('should hide manage controls menu item', async () => {
    let menu = await loader.getHarness(MatMenuHarness);
    component.hasNonBrLicense = false;
    fixture.detectChanges();
    await menu.open();
    let itemLengthAfter: MatMenuItemHarness[] = await (await menu.getItems());
    itemLengthAfter.forEach(item => {
      item.getText().then(text => {
        expect(text != component.getTranslation('NAV.SETTING.MANAGEOWNCONTROLS'));
      })
    });
  });


  it('should navigate to manage controls', () => {
    spyOn(mockNavigationServiceInstance, 'navigateToManageControls');
    component.navigateToManageControls();
    fixture.detectChanges();
    expect(mockNavigationServiceInstance.navigateToManageControls).toHaveBeenCalled();
  });

});
