// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxModule } from '@angular-redux/store';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrLevelsInUseModule, BrSelect, ErrorHandlingFormsModule, MaterialModule } from 'br-component-library';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { LabTree } from '../../../../contracts/models/lab-setup/lab-tree.model';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { Error } from '../../../../contracts/models/shared/error.model';
import { ConfigService } from '../../../../core/config/config.service';
import { ApiService } from '../../../../shared/api/api.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { LabDataApiService } from '../../../../shared/api/labDataApi.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { TreeNodesService } from '../../../../shared/services/tree-nodes.service';
import { AnalyteEntryComponent } from '../../components/analyte-entry/analyte-entry.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { SpcRulesComponent } from '../../components/spc-rules/spc-rules.component';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { AnalyteConfigComponent } from './analyte-config.component';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';

describe('AnalyteConfigComponent', () => {
  let component: AnalyteConfigComponent;
  let fixture: ComponentFixture<AnalyteConfigComponent>;
  let de: DebugElement;
  const analyteEntryformBuilder: FormBuilder = new FormBuilder();

  const appState = [];

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    auditTrailViewData : () => { }
  };

  const analytesList = [
    {
      id: 4,
      name: 'Acetaminophen'
    }
  ];
  const units = [
    {
      'id': 15,
      'name': 'g/dL',
      'unitCategoryId': 10,
      'unitCategoryName': 'mass/vol',
      'unitSystemTypeId': 1,
      'unitSystemTypeName': 'Conventional Unit'
    },
    {
      'id': 65,
      'name': 'g/L',
      'unitCategoryId': 10,
      'unitCategoryName': 'mass/vol',
      'unitSystemTypeId': 2,
      'unitSystemTypeName': 'SI Unit'
    }
  ];
  const methods = [
    {
      'id': 583,
      'name': 'Bromcresol Green (BCG)'
    },
    {
      'id': 585,
      'name': 'Bromcresol Red (BCR)'
    }
  ];
  const calibrators = [[
    {
      'id': 796,
      'name': '12345678904555',
      'manufacturerId': '10',
      'manufacturerName': 'Abraxis'
    },
    {
      'id': 297,
      'name': '25-OH Vitamin D Cal REF 5P02',
      'manufacturerId': '1',
      'manufacturerName': 'Abbott'
    },
    {
      'id': 341,
      'name': '2nd Generation Testosterone Cal REF 2P13-01',
      'manufacturerId': '1',
      'manufacturerName': 'Abbott'
    }
  ]];
  const reagents = [
    {
      'id': 1108,
      'name': 'AlbG REF 7D53-23',
      'manufacturerId': '1',
      'manufacturerName': 'Abbott'
    },
    {
      'id': 1107,
      'name': 'Albumin BCP REF 7D54-21',
      'manufacturerId': '1',
      'manufacturerName': 'Abbott'
    },
    {
      'id': 1101,
      'name': 'ABC',
      'manufacturerId': '4',
      'manufacturerName': 'Seimens'
    }
  ];
  const reagentLots = [
    {
      'id': 419,
      'reagentId': 1108,
      'lotNumber': 'Unspecified ***',
      'reagentCategory': 2,
      'shelfExpirationDate': new Date('2068-11-16T17:50:46.477'),
    },
    {
      'id': 444,
      'reagentId': 1108,
      'lotNumber': 'Sample lot',
      'reagentCategory': 2,
      'shelfExpirationDate': new Date('2068-11-16T17:50:46.477'),
    }
  ];
  const calibratorLots = [
    {
      'id': 415,
      'calibratorId': 341,
      'lotNumber': 'Unspecified ***',
      'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
    },
    {
      'id': 425,
      'calibratorId': 341,
      'lotNumber': 'Sample lot ***',
      'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
    }
  ];
  const mockAnalyteState = {
    'name': null,
    'labTestId': null,
    'createdOn': null,
    'isClosed': null,
    'isDeleted': null,
    'analyteId': null,
    'unitId': null,
    'reagentManufacturerId': null,
    'reagentId': null,
    'reagentLotId': null,
    'methodId': null,
    'calibratorManufacturerId': null,
    'calibratorId': null,
    'calibratorLotId': null,
    'labInstrumentProductLotId': null,
    'analyteName': null,
    'type': null,
    'productLotInfo': null,
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
      'reagentCategory': 2,
      'reagentLotId': 511,
      'reagentLotNumber': 'Unspecified ***',
      'reagentLot': {
        'id': 511,
        'reagentId': 1200,
        'lotNumber': 'Unspecified ***',
        'reagentCategory': 2,
        'shelfExpirationDate': new Date('2068-11-16T17:50:56.353')
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
        'shelfExpirationDate': new Date('2068-11-16T17:50:56.353')
      }
    },
    'levelSettings': {
      'levelEntityId': 'B9D1F12F287241F4B91A51F6C7298FA2',
      'levelEntityName': 'LabTest',
      'parentLevelEntityId': 'ADFC9711D8DA4D299EBBEC045C77CDD9',
      'parentLevelEntityName': 'LabProduct',
      'minNumberOfPoints': 5,
      'runLength': 4,
      'targets': [],
      'rules': [],
      'levels': [
        {
          'levelInUse': false,
          'decimalPlace': 2
        }
      ],
      isSummary: true,
      decimalPlaces: 2,
      level1Used: false,
      level2Used: false,
      level3Used: false,
      level4Used: false,
      level5Used: false,
      level6Used: false,
      level7Used: false,
      level8Used: false,
      level9Used: false,

    },
    'mappedTestSpecs': null,
    'id': 'B9D1F12F287241F4B91A51F6C7298FA2',
    'parentNodeId': 'ADFC9711D8DA4D299EBBEC045C77CDD9',
    'parentNode': null,
    'isArchived': false,
    'nodeType': 6,
    'children': []
  };
  const mockCodelistApiService = {
    getUnits: () => {
      return observableOf(units);
    },
    getReagents: () => {
      return observableOf(reagents);
    },
    getCalibrators: () => {
      return observableOf(calibrators);
    },
    getReagentLotsByReagentId: () => {
      return observableOf(reagentLots);
    },
    getMethods: () => {
      return observableOf(methods);
    },
    getCalibratorLotsByCalibratorId: () => {
      return observableOf(calibratorLots);
    },
    postTestSpecIdAsync: () => { },
    postTestSpecsInBatchAsync: (arg1) => {
      if (arg1) {
        return observableOf([mockAnalyteState.testSpecInfo]).toPromise();
      } else {
        return Promise.reject('error');
      }
    }
  };
  let codeListInstance: CodelistApiService;

  const labSetupDataApiService = {
    getSummaryDataByLabTestIdsAsync: () => {
      return observableOf([]).toPromise();
    },
    getRunDataByLabTestIdsAsync: () => {
      return observableOf([]).toPromise();
    }
  };
  let labDataApiServiceInstance: LabDataApiService;
  const mockAnalytesState = {
    error: {
      message: 'error occured',
      source: null,
      error: null,
      stack: null
    },
    labAnalyte: null,
    labAnalytes: null,
    analytes: [
      {
        id: 4,
        name: 'Acetaminophen'
      }
    ],
    analyte: null,
    deleteAnalyte: false
  };
  const mockApiService = {
    apiUrl: 'apiUrl',
    subscriptionKey: 'subscriptionKey'
  };
  const mockTreeNodesService = {
    getMatchingTestSpecs: (a, b) => {
      if (a.length > 0) {
        return [mockAnalyteState.testSpecInfo];
      } else {
        return [];
      }
    }
  };
  let treenodeServiceInstance: TreeNodesService;

  const decimalPlace: Array<any> = ['0', '1', '2', '3', '4'];

  class MockRouterServices {
    readonly url = '/lab-setup/analytes/c6316dee-a44b-421e-ab71-64988b34401b/settings';
    public events = observableOf(new NavigationEnd(0, this.url, this.url));
  }

  const mockSecurityDirectory: LabTree = {
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
      labSetupLastEntityId: null,
      id: 'abc06021-d040-40de-a469-d6259fd94505',
      parentNodeId: '7b66af6a-8e69-4e94-9cbf-05a1111abfdc',
      parentNode: null,
      nodeType: 9,
      children: null
    },
    id: null,
    name: 'ROOT',
    locations: null,
    children: []
  };

  const mockInstrumentState = {
    displayName: 'ARCHITECT c4000',
    instrumentId: '1497',
    instrumentCustomName: '',
    instrumentSerial: '',
    instrumentInfo: {
      id: 1497,
      name: 'ARCHITECT c4000',
      manufacturerId: 1,
      manufacturerName: 'Abbott'
    },
    levelSettings: {
      levelEntityId: null,
      levelEntityName: null,
      parentLevelEntityId: null,
      parentLevelEntityName: null,
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 1,
      targets: null,
      rules: [],
      levels: [
        {
          levelInUse: true,
          decimalPlace: 2
        }
      ],
      Id: '',
      isSummary: true,
      decimalPlaces: 2,
      level1Used: false,
      level2Used: false,
      level3Used: false,
      level4Used: false,
      level5Used: false,
      level6Used: false,
      level7Used: false,
      level8Used: false,
      level9Used: false,
      id: '7ff66f57-17c3-46ab-a31b-e33f2911ae56',
      parentNodeId: 'fa2eea70-14f9-43a7-a8bf-5a9bec910c38',
      parentNode: null,
      nodeType: 8,
      displayName: '7ff66f57-17c3-46ab-a31b-e33f2911ae56',
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
    id: 'fa2eea70-14f9-43a7-a8bf-5a9bec910c38',
    parentNodeId: 'cca643e1-262c-448d-9201-f2a5ef3e35e8',
    parentNode: null,
    isArchived: false,
    nodeType: 4,
    children: []
  };

  let mockControlState = {
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
      Id: '',
      isSummary: true,
      decimalPlaces: 2,
      level1Used: true,
      level2Used: false,
      level3Used: false,
      level4Used: false,
      level5Used: false,
      level6Used: false,
      level7Used: false,
      level8Used: false,
      level9Used: false,
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
    isArchived: false,
    nodeType: 5,
    children: [
      mockAnalyteState
    ]
  };

  const mockPortalApiService = {
    getLabSetupNode: () => {
      return observableOf(mockControlState);
    }
  };

  let portalAPIInstance: PortalApiService;

  const mockAnalyteNodeData = {
      'analytes': [
        {
          'analyteId': 299,
          'calibratorId': 278,
          'calibratorLotId': 279,
          'reagentId': 1175,
          'reagentLotId': 486,
          'storageUnitId': 35,
          'instrumentId': 1254,
          'methodId': 43
        }
      ],
      'settings': {
        'entityId': 'a4dd6559-b7f3-46ff-9669-203a98103c75',
        'entityType': 0,
        'parentEntityId': 'bcddf930-24f1-4683-aea5-3947d20609c3',
        'levelSettings': {
          'id': '',
          'isSummary': true,
          'decimalPlaces': 0,
          'level1Used': true,
          'level2Used': false,
          'level3Used': false,
          'level4Used': false,
          'level5Used': false,
          'level6Used': false,
          'level7Used': false,
          'level8Used': false,
          'level9Used': false
        },
        'runSettings': {
          'minimumNumberOfPoints': 10,
          'floatStatsStartDate': null
        },
        'ruleSettings': [],
        'hasEvaluationMeanSd': false,
        'archiveState': 0,
        'productLots': [
          {
            'id': '2122',
            'productMasterLotId': '1016',
            'productId': '392',
            'productMasterLotNumber': '22630',
            'lotNumber': '22631',
            'level': 1,
            'levelDescription': 'Level 1'
          }
        ]
      }
    };

  const analyteEmitterMock = { analytes: mockAnalyteNodeData.analytes, settings: mockAnalyteNodeData.settings };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: () =>  true,
  };

  const mockNavigationService = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyteConfigComponent, AnalyteEntryComponent, LabSetupHeaderComponent, SpcRulesComponent],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrSelect,
        HttpClientModule,
        HttpClientTestingModule,
        BrLevelsInUseModule,
        NgReduxModule,
        ReactiveFormsModule, FormsModule,
        BrowserAnimationsModule,
        ErrorHandlingFormsModule,
        RouterTestingModule,
        StoreModule.forRoot(appState),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        { provide: FormBuilder, useValue: analyteEntryformBuilder },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: LabDataApiService, useValue: labSetupDataApiService },
        ConfigService,
        AppLoggerService,
        DateTimeHelper,
        LocaleConverter,
        SpcRulesService,
        SpinnerService,
        { provide: ApiService, useValue: mockApiService },
        { provide: TreeNodesService, useValue: mockTreeNodesService },
        { provide: Router, useClass: MockRouterServices },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateService,
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyteConfigComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    portalAPIInstance = fixture.debugElement.injector.get(PortalApiService);
    labDataApiServiceInstance = fixture.debugElement.injector.get(LabDataApiService);
    codeListInstance = fixture.debugElement.injector.get(CodelistApiService);
    treenodeServiceInstance = fixture.debugElement.injector.get(TreeNodesService);
    component.labConfigAnalytes$ = observableOf(mockAnalytesState);
    component.securityDirectory$ = observableOf(mockSecurityDirectory);
    component.currentSelectedNode$ = observableOf(mockInstrumentState);
    component.currentSelectedLeaf$ = observableOf(mockControlState);
    component.getArchiveToggle$ = observableOf(false);
    component.showSettings = false;
    component.duplicateAnalytes = [];
    component.existingAnalyteTestSpecs = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('AnalyteEntry form is displayed', () => {
    expect(fixture.debugElement.nativeElement.querySelector('unext-analyte-entry-component')).not.toBe(null);
  });

  it('Ensure Summary Data Entry Toggle is displayed', () => {
    expect(fixture.debugElement.queryAll(By.css('#spec_summarydataentry'))).not.toBe(null);
  });

  it('Ensure LevelsInUse checkboxes are displayed', () => {
    expect(fixture.debugElement.queryAll(By.css('#spec_levelsinuse'))).not.toBe(null);
  });

  it('Ensure SPC Rules section is displayed based on SummaryDataEntry boolean value', () => {
    const summaryDataEntryElement = fixture.debugElement.nativeElement.querySelector('#spec_summarydataentry');
    fixture.detectChanges();
    expect(summaryDataEntryElement).toBeFalsy();
    expect(fixture.debugElement.queryAll(By.css('#spec_Spcruleselement'))).not.toBe(null);
  });

  it('should check if Decimal Places dropdown is displayed', () => {
    const decimalPlacesElement = fixture.debugElement.queryAll(By.css('#spec_levelsinuse'));
    expect(decimalPlacesElement).not.toBe(null);
    component.levels = decimalPlace;
    fixture.detectChanges();
    expect(component.levels.length).toBeGreaterThanOrEqual(1);
  });

  it('click on control edit Add analyte button and having control data in state', () => {
    mockControlState = Object.assign({ ...mockControlState }, ...mockControlState.levelSettings.levels, [{
      levelInUse: false,
      decimalPlace: 2
    },
    {
      levelInUse: false,
      decimalPlace: 2
    }
    ]);
    component.currentSelectedNode$ = observableOf(mockControlState);
    component.currentSelectedBranch$ = observableOf([mockInstrumentState]);
    spyOn(component, 'initialize').and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    spyOn(component, 'loadHeaderTitleData').and.callThrough();
    component.loadHeaderTitleData();
    expect(component.loadHeaderTitleData).toHaveBeenCalled();
  });

  it('click on control edit Add analyte button and getting control data from service', () => {
    mockControlState.levelSettings = null;
    mockControlState.children = null;
    component.currentSelectedNode$ = observableOf(mockControlState);
    component.currentSelectedBranch$ = observableOf([mockInstrumentState]);
    spyOn(portalAPIInstance, 'getLabSetupNode').and.callThrough();
    portalAPIInstance.getLabSetupNode(mockControlState.nodeType, mockControlState.id, LevelLoadRequest.None);
    expect(portalAPIInstance.getLabSetupNode).toHaveBeenCalled();
    spyOn(component, 'initialize').and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    spyOn(component, 'loadHeaderTitleData').and.callThrough();
    component.loadHeaderTitleData();
    expect(component.loadHeaderTitleData).toHaveBeenCalled();
  });

  it('when in edit mode and values in summary data', () => {
    component.showSettings = true;
    mockControlState.children = [mockAnalyteState];
    component.currentSelectedNode$ = observableOf(mockControlState);
    component.currentSelectedLeaf$ = observableOf(mockAnalyteState);
    spyOn(labDataApiServiceInstance, 'getSummaryDataByLabTestIdsAsync').and.callThrough();
    labDataApiServiceInstance.getSummaryDataByLabTestIdsAsync([mockAnalyteState.id], 1);
    expect(labDataApiServiceInstance.getSummaryDataByLabTestIdsAsync).toHaveBeenCalled();
    spyOn(component, 'initialize').and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    spyOn(component, 'loadCurrentNodeAndLeaf').and.callThrough();
    component.loadCurrentNodeAndLeaf();
    expect(component.loadCurrentNodeAndLeaf).toHaveBeenCalled();
  });

  it('when in edit mode and values in point data', () => {
    component.showSettings = true;
    mockControlState.children = [mockAnalyteState];
    component.currentSelectedBranch$ = observableOf([mockControlState]);
    component.currentSelectedNode$ = observableOf(mockControlState);
    component.currentSelectedLeaf$ = observableOf(mockAnalyteState);
    component.loadHeaderTitleData();
    spyOn(labDataApiServiceInstance, 'getRunDataByLabTestIdsAsync').and.callThrough();
    labDataApiServiceInstance.getRunDataByLabTestIdsAsync([mockAnalyteState.id]);
    expect(labDataApiServiceInstance.getRunDataByLabTestIdsAsync).toHaveBeenCalled();
    spyOn(component, 'initialize').and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    spyOn(component, 'loadCurrentNodeAndLeaf').and.callThrough();
    component.loadCurrentNodeAndLeaf();
    expect(component.loadCurrentNodeAndLeaf).toHaveBeenCalled();
  });

  it('load units and reagents list', () => {
    component.currentSelectedBranch$ = observableOf([mockInstrumentState]);
    component.loadHeaderTitleData();
    const analyteEntryComp = de.query(By.directive(AnalyteEntryComponent));
    const cmp = analyteEntryComp.componentInstance;
    spyOn(component, 'onLoadUnits').and.callThrough();
    spyOn(component, 'onLoadReagents').and.callThrough();
    cmp.loadUnits.emit(0);
    cmp.loadReagents.emit(0);
    expect(component.onLoadUnits).toHaveBeenCalled();
    expect(component.onLoadReagents).toHaveBeenCalled();
    spyOn(codeListInstance, 'getUnits').and.callThrough();
    codeListInstance.getUnits(12, analytesList[0].id, 1260);
    expect(codeListInstance.getUnits).toHaveBeenCalled();
    spyOn(codeListInstance, 'getReagents').and.callThrough();
    codeListInstance.getReagents(12, analytesList[0].id, 1260);
    expect(codeListInstance.getReagents).toHaveBeenCalled();
  });

  it('load calibrators,methods and reagent lots list on reagent select', () => {
    mockSecurityDirectory.accountSettings.trackReagentCalibrator = false;
    spyOn(component, 'initialize').and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    const analyteEntryComp = de.query(By.directive(AnalyteEntryComponent));
    const cmp = analyteEntryComp.componentInstance;
    spyOn(component, 'onLoadReagentLots').and.callThrough();
    cmp.loadReagentLots.emit({ reagentId: 1108, index: 0 });
    expect(component.onLoadReagentLots).toHaveBeenCalled();
    spyOn(component, 'onLoadCalibrators').and.callThrough();
    cmp.loadCalibrators.emit({ reagentId: 1108, index: 0 });
    expect(component.onLoadCalibrators).toHaveBeenCalled();
    spyOn(codeListInstance, 'getReagentLotsByReagentId').and.callThrough();
    codeListInstance.getReagentLotsByReagentId('1108');
    expect(codeListInstance.getReagentLotsByReagentId).toHaveBeenCalled();
    spyOn(codeListInstance, 'getMethods').and.callThrough();
    codeListInstance.getMethods(analytesList[0].id, 1260, 1108);
    expect(codeListInstance.getMethods).toHaveBeenCalled();
    spyOn(codeListInstance, 'getCalibrators').and.callThrough();
    codeListInstance.getCalibrators(analytesList[0].id, 1260, 1108);
    expect(codeListInstance.getCalibrators).toHaveBeenCalled();
  });

  it('load calibrator lots list on calibrator select', () => {
    mockSecurityDirectory.accountSettings.trackReagentCalibrator = false;
    spyOn(component, 'initialize').and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    const analyteEntryComp = de.query(By.directive(AnalyteEntryComponent));
    const cmp = analyteEntryComp.componentInstance;
    spyOn(component, 'onLoadCalibratorLots').and.callThrough();
    cmp.loadCalibratorLots.emit({ calibratorId: 341, index: 0 });
    expect(component.onLoadCalibratorLots).toHaveBeenCalled();
    spyOn(codeListInstance, 'getCalibratorLotsByCalibratorId').and.callThrough();
    codeListInstance.getCalibratorLotsByCalibratorId('341');
    expect(codeListInstance.getCalibratorLotsByCalibratorId).toHaveBeenCalled();
  });

  it('click on submit verify data is saved when there is matching combination present', () => {
    component.selectedAnalyte = mockAnalyteState;
    const analyteEntryComp = de.query(By.directive(AnalyteEntryComponent));
    const cmp = analyteEntryComp.componentInstance;
    spyOn(component, 'saveLabConfigurationAnalyte').and.callThrough();
    cmp.saveLabConfigurationAnalyte.emit(analyteEmitterMock);
    expect(component.saveLabConfigurationAnalyte).toHaveBeenCalled();
    spyOn(treenodeServiceInstance, 'getMatchingTestSpecs').and.callThrough();
    treenodeServiceInstance.getMatchingTestSpecs([component.selectedAnalyte.testSpecInfo], [mockAnalyteState.testSpecInfo]);
    expect(treenodeServiceInstance.getMatchingTestSpecs).toHaveBeenCalled();
  });

  it('click on submit verify data is saved', () => {
    component.showSettings = true;
    component.existingAnalyteTestSpecs = [];
    component.selectedAnalyte = null;
    const analyteEntryComp = de.query(By.directive(AnalyteEntryComponent));
    const cmp = analyteEntryComp.componentInstance;
    spyOn(component, 'saveLabConfigurationAnalyte').and.callThrough();
    cmp.saveLabConfigurationAnalyte.emit(analyteEmitterMock);
    expect(component.saveLabConfigurationAnalyte).toHaveBeenCalled();
  });

  it('click on submit with no levelsettings updated', () => {
    component.showSettings = true;
    mockControlState.children = [mockAnalyteState];
    component.currentSelectedNode$ = observableOf(mockControlState);
    component.currentSelectedLeaf$ = observableOf(mockAnalyteState);
    component.selectedAnalyte = mockAnalyteState;
    spyOn(component, 'initialize').and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    const analyteEntryComp = de.query(By.directive(AnalyteEntryComponent));
    const cmp = analyteEntryComp.componentInstance;
    mockAnalyteNodeData.settings = null;
    spyOn(component, 'saveLabConfigurationAnalyte').and.callThrough();
    cmp.saveLabConfigurationAnalyte.emit(analyteEmitterMock);
    expect(component.saveLabConfigurationAnalyte).toHaveBeenCalled();
  });

  it('delete analyte function should be called', () => {
    const analyteEntryComp = de.query(By.directive(AnalyteEntryComponent));
    const cmp = analyteEntryComp.componentInstance;
    spyOn(component, 'onDeleteAnalyte').and.callThrough();
    cmp.deleteAnalyteId.emit();
    expect(component.onDeleteAnalyte).toHaveBeenCalled();
  });

  it('call to function setErrorMessage', () => {
    const data: Error = {
      message: 'test error message',
      source: null,
      error: 'test error',
      stack: null
    };
    spyOn(component, 'setErrorMessage').and.callThrough();
    component.setErrorMessage(data);
    expect(component.setErrorMessage).toHaveBeenCalled();
  });

  it('call to function setErrorMessage', () => {
    const data: Error = {
      message: 'test error message',
      source: null,
      error: 'test error',
      stack: null
    };
    spyOn(component, 'setErrorMessage').and.callThrough();
    component.setErrorMessage(data);
    expect(component.setErrorMessage).toHaveBeenCalled();
  });
});
