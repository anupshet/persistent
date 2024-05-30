// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { DecimalPipe } from '@angular/common';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { from as observableFrom, of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrLevelsInUseModule, BrSelect, MaterialModule } from 'br-component-library';

import { ConfigService } from '../../../../core/config/config.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { AnalyteManagementComponent } from './analyte-management.component';
import { AnalyteConfigComponent } from '../analyte-config/analyte-config.component';
import { AnalyteEntryComponent } from '../../components/analyte-entry/analyte-entry.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { SpcRulesComponent } from '../../components/spc-rules/spc-rules.component';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LabDataApiService } from '../../../../shared/api/labDataApi.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { TreeNodesService } from '../../../../shared/services/tree-nodes.service';
import { AuthenticationService } from '../../../../security/services';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';

describe('AnalyteManagementComponent', () => {
  let component: AnalyteManagementComponent;
  let fixture: ComponentFixture<AnalyteManagementComponent>;
  const appState = [];
  const initialState = {};
  const storeStub = {};
  const mockSelectedLeaf = {
    'displayName': 'Prealbumin',
    'testSpecId': '1791',
    'correlatedTestSpecId': '70C35368CD8347D3A8D90AD6ABA2CF38',
    'testId': '1786',
    'labUnitId': '14',
    'testSpecInfo': {
      'id': 1791,
      'testId': 1786,
      'analyteStorageUnitId': 24,
      'analyteId': 21,
      'analyteName': 'Prealbumin',
      'methodId': 43,
      'methodName': 'Immunoturbidimetric',
      'instrumentId': 1254,
      'instrumentName': 'ARCHITECT c16000',
      'reagentId': 1200,
      'reagentManufacturerId': null,
      'reagentManufacturerName': 'Abbott',
      'reagentName': 'Prealbumin REF 1E02-21',
      'reagentLotId': 511,
      'reagentLotNumber': 'Unspecified ***',
      'reagentLot': {
        'id': 511,
        'reagentId': 1200,
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': '2068-11-16T17:50:56.353'
      },
      'storageUnitId': 14,
      'storageUnitName': 'mg/dL',
      'calibratorId': 288,
      'calibratorManufacturerId': null,
      'calibratorManufacturerName': 'Abbott',
      'calibratorName': 'Prealbumin Cal REF 6E57-02',
      'calibratorLotId': 289,
      'calibratorLotNumber': 'Unspecified ***',
      'calibratorLot': {
        'id': 289,
        'calibratorId': 288,
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': '2068-11-16T17:50:56.353'
      }
    },
    'levelSettings': {
      'levelEntityId': 'B9D1F12F287241F4B91A51F6C7298FA2',
      'levelEntityName': 'LabTest',
      'parentLevelEntityId': 'ADFC9711D8DA4D299EBBEC045C77CDD9',
      'parentLevelEntityName': 'LabProduct',
      'minNumberOfPoints': 5,
      'runLength': 4,
      'dataType': 0,
      'targets': [],
      'rules': [],
      'levels': [
        {
          'levelInUse': false,
          'decimalPlace': 2
        }
      ]
    },
    'mappedTestSpecs': null,
    'id': 'B9D1F12F287241F4B91A51F6C7298FA2',
    'parentNodeId': 'ADFC9711D8DA4D299EBBEC045C77CDD9',
    'parentNode': null,
    'nodeType': 6,
    'children': []
  };
  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigate')
  };
  const mockNavigationService = {
    navigateToUrl: () => {
    },
    setSelectedNodeById: () => {
    },
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    auditTrailViewData : () => { }
  };

  const getCurrentUserStub = {
    hasDefaultSystemAccess: () => {
      return true;
    }
  };

  const mockRedux = {
    dispatch() { },
    configureStore() { },
    select() {
      return observableFrom('test');
    },
  };

  const labSetupDataApiService = {
    getRawDataPageByLabTestId() { }
  };

  const mockPortalApiService = {
    getLabSetupAncestors: () => of()
  };

  const mockTreeNodesService = {
    getMatchingTestSpecs: () => []
  };
  let navigationServiceInstance: NavigationService;

  const mockControlState = {
    displayName: 'Anemia',
    productId: '1',
    productMasterLotId: '46',
    productCustomName: '',
    productInfo: {
      id: 1,
      name: 'Anemia',
      manufacturerId: 2,
      manufacturerName: 'Bio-Rad',
      matrixId: 3,
      matrixName: 'Serum'
    },
    lotInfo: {
      id: 46,
      productId: 1,
      productName: 'Anemia',
      lotNumber: '43280',
      expirationDate: new Date('2020-11-30T00:00:00')
    },
    productLotLevels: [
      {
        id: '60',
        productMasterLotId: '46',
        productId: '1',
        productMasterLotNumber: '43280',
        lotNumber: '43280',
        level: 1,
        levelDescription: '1'
      }
    ],
    levelSettings: {
      levelEntityId: null,
      levelEntityName: null,
      parentLevelEntityId: null,
      parentLevelEntityName: null,
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 1,
      targets: [
        {
          controlLotId: '60',
          controlLevel: '1',
          mean: 0,
          sd: 0,
          points: 0
        }
      ],
      rules: [],
      levels: [
        {
          levelInUse: true,
          decimalPlace: 2
        }
      ],
      id: 'c3922fe9-5be7-4511-bcfe-05d8bd9ee499',
      parentNodeId: '4634c26b-b9fa-42e4-a63c-4789f464b7a5',
      parentNode: null,
      nodeType: 8,
      displayName: 'c3922fe9-5be7-4511-bcfe-05d8bd9ee499',
      children: null
    },
    accountSettings: {
      displayName: '',
      dataType: 1,
      instrumentsGroupedByDept: true,
      trackReagentCalibrator: true,
      fixedMean: false,
      decimalPlaces: 2,
      siUnits: false,
      labSetupRating: 5,
      labSetupComments: 'good',
      isLabSetupComplete: true,
      labSetupLastEntityId: 'null',
      id: 'abc06021-d040-40de-a469-d6259fd94505',
      parentNodeId: '7b66af6a-8e69-4e94-9cbf-05a1111abfdc',
      parentNode: null,
      nodeType: 9,
      children: null
    },
    hasOwnAccountSettings: false,
    id: '4634c26b-b9fa-42e4-a63c-4789f464b7a5',
    parentNodeId: 'fa2eea70-14f9-43a7-a8bf-5a9bec910c38',
    parentNode: null,
    nodeType: 5,
    children: [
      mockSelectedLeaf
    ]
  };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  const mockEntityTypeService = {
    getLevelName: (val) => val
  };

  let mockBrPermissionsService = {
    hasAccess: () => true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnalyteManagementComponent,
        AnalyteConfigComponent,
        AnalyteEntryComponent,
        LabSetupHeaderComponent,
        SpcRulesComponent,
        UnityNextNumericPipe
      ],
      imports: [
        StoreModule.forRoot(appState),
        BrLevelsInUseModule,
        MatSnackBarModule,
        MatDialogModule,
        BrSelect,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
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
        { provide: AuthenticationService, useValue: getCurrentUserStub },
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState }),
        { provide: Router, useValue: mockRouter },
        { provide: EntityTypeService, useValue: mockEntityTypeService },
        SpcRulesService,
        ConfigService,
        AppLoggerService,
        { provide: NgRedux, useValue: mockRedux },
        { provide: LabDataApiService, useValue: labSetupDataApiService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: LabDataApiService, useValue: labSetupDataApiService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: TreeNodesService, useValue: mockTreeNodesService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        CodelistApiService,
        DateTimeHelper,
        LocaleConverter,
        SpinnerService,
        TranslateService,
        HttpClient,
        DecimalPipe,
        UnityNextNumericPipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyteManagementComponent);
    component = fixture.componentInstance;
    navigationServiceInstance = fixture.debugElement.injector.get(NavigationService);
    component.navigationCurrentlySelectedLeaf$ = of(mockSelectedLeaf);
    component.navigationCurrentlySelectedNode$ = of(mockSelectedLeaf);
    component.navigationSelectedNode$ = of(mockControlState);
    component.navigationShowSettings$ = of(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should check if Analyte card is displayed using the analyte-config-component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('unext-analyte-config-component')).not.toBe(null);
  });

  it('Should check if Link to Return to Data Table is displayed and routes to Data Table', () => {
    const link = fixture.debugElement.nativeElement.querySelector('#spec_returnToData');
    link.click();
    const spy = spyOn(navigationServiceInstance, 'setSelectedNodeById').and.callThrough();
    navigationServiceInstance.setSelectedNodeById(EntityType.LabTest, '', mockRouter.navigateByUrl(component.dataTableUrl));
    expect(spy).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(component.dataTableUrl);
  });

  it('Should check if Link to Go to Control Settings is displayed and routes to Control Settings', () => {
    component.navigationCurrentlySelectedLeaf$ = of(mockControlState);
    component.navigationCurrentlySelectedNode$ = of(mockControlState);
    component.navigationShowSettings$ = of(false);
    component.ngOnInit();
    const spy = spyOn(navigationServiceInstance, 'navigateToUrl');
    fixture.detectChanges();
    const link = fixture.debugElement.nativeElement.querySelector('.spec_goToControlSettings');
    link.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('Should check if control is at the selected leaf (Lab Setup mode)', () => {
    component.navigationCurrentlySelectedLeaf$ = of(mockControlState);
    component.navigationCurrentlySelectedNode$ = of(mockControlState);
    component.navigationShowSettings$ = of(false);
    component.ngOnInit();
    expect(component.selectedProduct).toBe(mockControlState);
  });

  it('Should check if no selected leaf or selected node', () => {
    component.navigationCurrentlySelectedLeaf$ = of(null);
    component.navigationCurrentlySelectedNode$ = of(null);
    component.navigationShowSettings$ = of(false);
    component.ngOnInit();
    expect(component.selectedNodeDisplayName).toBe('');
  });

  it('Should display message if analytes are not added and user is non-admin', () => {
    mockBrPermissionsService = {
      hasAccess: () => false,
    };
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.spec-message-analyte')).toBeFalsy();
      fixture.detectChanges();
      expect(compiled.querySelector('.spec-message-analyte').textContent).
        toContain('No Analyte added for Control ' + component.selectedNodeDisplayName);
    });
  });
});
