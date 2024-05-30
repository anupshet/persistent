// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgRedux } from '@angular-redux/store';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { from as observableFrom, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrInfoTooltip, BrCore, BrLevelsInUseModule, MaterialModule, BrSelect } from 'br-component-library';

import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { LabSetupHeaderComponent } from '../lab-setup-header/lab-setup-header.component';
import * as fromRoot from '../../state';
import { ControlEntryComponent } from './control-entry.component';
import { SpcRulesComponent } from '../spc-rules/spc-rules.component';
import { SpcRulesService } from '../spc-rules/spc-rules.service';
import { ConfigService } from '../../../../core/config/config.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { LabTest, LabProduct } from '../../../../contracts/models/lab-setup';
import { EvaluationMeanSdConfigComponent } from '../../containers/evaluation-mean-sd-config/evaluation-mean-sd-config.component';
import { EvaluationMeanSdComponent } from '../../components/evaluation-mean-sd/evaluation-mean-sd.component';
import { LevelEvaluationMeanSdComponent } from '../../components/level-evaluation-mean-sd/level-evaluation-mean-sd.component';
import { UpdateSettingsDialogComponent } from '../update-settings-dialog/update-settings-dialog.component';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { LocalizationService } from '../../../../shared/navigation/services/localizaton.service';
import { ApiService } from '../../../../shared/api/api.service';

describe('ControlEntryComponent', () => {
  let component: ControlEntryComponent;
  let fixture: ComponentFixture<ControlEntryComponent>;

  const manufacturerProduct = [
    {
      'id': '11',
      'name': 'Diabetes',
      'manufacturerId': 2,
      'manufacturerName': 'Bio-Rad'
    },
    {
      'id': '405',
      'name': 'Diabetes (Liquichek Vista)',
      'manufacturerId': 2,
      'manufacturerName': 'Bio-Rad'
    },
    {
      'id': '240',
      'name': 'Diabetes (Liquichek)',
      'manufacturerId': 2,
      'manufacturerName': 'Bio-Rad'
    },
    {
      'id': '17',
      'name': 'Hemoglobin A2',
      'manufacturerId': 2,
      'manufacturerName': 'Bio-Rad'
    }
  ];

  const mockRedux = {
    dispatch() { },
    configureStore() { },
    select() {
      return observableFrom('test');
    },
  };


  const levels = [
    {
      levelInUse: true,
      decimalPlace: 1,
      disabled: false
    }, {
      levelInUse: true,
      decimalPlace: 2,
      disabled: false
    }, {
      levelInUse: false,
      decimalPlace: 3,
      disabled: false
    },
    {
      levelInUse: false,
      decimalPlace: 3,
      disabled: false
    }
  ];
  const mockLocalizationService = {
    getLanguageMapping: () => { },
  };
  const currentlySelectedControl = [
    {
      'displayName': 'Diabetes',
      'productId': '11',
      'productMasterLotId': '205',
      'productCustomName': '',
      'productInfo': {
        'id': 11,
        'name': 'Diabetes',
        'manufacturerId': '2',
        'manufacturerName': 'Bio-Rad',
        'matrixId': 6,
        'matrixName': 'Whole Blood'
      },
      'lotInfo': {
        'id': 205,
        'productId': 11,
        'productName': 'Diabetes',
        'lotNumber': '33970',
        'expirationDate': new Date('2020-06-30T00:00:00')
      },
      'productLotLevels': [
        {
          'id': '513',
          'productMasterLotId': '205',
          'productId': '11',
          'productMasterLotNumber': '33970',
          'lotNumber': '33971',
          'level': 1,
          'levelDescription': '1'
        },
        {
          'id': '514',
          'productMasterLotId': '205',
          'productId': '11',
          'productMasterLotNumber': '33970',
          'lotNumber': '33972',
          'level': 2,
          'levelDescription': '2'
        }
      ],
      'levelSettings': {
        'levelEntityId': null,
        'levelEntityName': null,
        'parentLevelEntityId': null,
        'parentLevelEntityName': null,
        'minNumberOfPoints': 5,
        'runLength': 4,
        'dataType': 1,
        'targets': [],
        'rules': [
          {
            'id': '2',
            'category': '1k',
            'k': '3',
            'disposition': 'R'
          },
          {
            'id': '1',
            'category': '1k',
            'k': '2',
            'disposition': 'R'
          }
        ],
        'levels': [
          {
            'levelInUse': true,
            'decimalPlace': 2
          },
          {
            'levelInUse': true,
            'decimalPlace': 2
          }
        ],
        'id': 'fbc4df7a-5d0e-4370-a308-e721507cdf9a',
        'parentNodeId': '701a09f7-73e7-4fb4-8c81-22eaa0c90d7a',
        'parentNode': null,
        'nodeType': 8,
        'displayName': 'fbc4df7a-5d0e-4370-a308-e721507cdf9a',
        'children': null
      },
      'accountSettings': {
        'displayName': '',
        'dataType': 1,
        'instrumentsGroupedByDept': true,
        'trackReagentCalibrator': false,
        'fixedMean': false,
        'decimalPlaces': 2,
        'siUnits': false,
        'labSetupRating': 0,
        'labSetupComments': '',
        'isLabSetupComplete': true,
        'labSetupLastEntityId': 'null',
        'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
        'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
        'parentNode': null,
        'nodeType': 9,
        'children': null
      },
      'hasOwnAccountSettings': false,
      'id': '701a09f7-73e7-4fb4-8c81-22eaa0c90d7a',
      'parentNodeId': 'ae413eb1-b8d9-42e7-9452-78aabd3756c3',
      'parentNode': null,
      'nodeType': 5,
      'children': [],
      'lotNumber': ' Lot 33970'
    }
  ];
  const Masterlots = [
    {
      'id': 203,
      'productId': 11,
      'productName': 'Diabetes',
      'lotNumber': '33950',
      'lotWithExpirationDate': '33950 exp. 30 June 2019',
      'expirationDate': new Date('2019-06-30T00:00:00')
    },
    {
      'id': 204,
      'productId': 11,
      'productName': 'Diabetes',
      'lotNumber': '33960',
      'lotWithExpirationDate': '33960 exp. 30 Nov 2019',
      'expirationDate': new Date('2019-11-30T00:00:00')
    },
    {
      'id': 205,
      'productId': 11,
      'productName': 'Diabetes',
      'lotNumber': '33970',
      'lotWithExpirationDate': '33970 exp. 30 June 2020',
      'expirationDate': new Date('2020-06-30T00:00:00')
    },
    {
      'id': 206,
      'productId': 11,
      'productName': 'Diabetes',
      'lotNumber': '33980',
      'lotWithExpirationDate': '33980 exp. 30 June 2020',
      'expirationDate': new Date('2021-06-31T00:00:00')
    }
  ];

  const decimalPlaceData = [0, 1, 2, 3, 4];
  const mockCodeListService = {
    getProductsByInstrumentId: () => {
      return of([manufacturerProduct]);
    },
    getProductMasterLotsByProductId: () => {
      return of(Masterlots);
    }
  };

  const mockNavigationService = {
    navigateToUrl: jasmine.createSpy()
  };


  const TestData: LabTest = {
    'displayName': ' Hemoglobin A1c',
    'testSpecId': '5',
    'correlatedTestSpecId': '4C0D59DD8DB645BCB7C71DC4D758EB2D',
    'testId': '5',
    'labUnitId': '93',
    'testSpecInfo': {
      'id': 5,
      'testId': 5,
      'analyteStorageUnitId': 666,
      'analyteId': 2566,
      'analyteName': ' Hemoglobin A1c',
      'methodId': 22,
      'methodName': 'HPLC',
      'instrumentId': 2749,
      'instrumentName': 'D-10',
      'reagentId': 693,
      'reagentManufacturerId': null,
      'reagentManufacturerName': 'Bio-Rad',
      'reagentName': 'D-10 Dual A1c (220-0201)',
      'reagentLotId': 3,
      'reagentLot': {
        'id': 3,
        'reagentId': 693,
        'lotNumber': 'Unspecified ***',
        'reagentCategory': 2,
        'shelfExpirationDate': new Date('2068-11-02T16:50:23.89')
      },
      'storageUnitId': 93,
      'storageUnitName': '%',
      'calibratorId': 3,
      'calibratorManufacturerId': null,
      'calibratorManufacturerName': 'Bio-Rad',
      'calibratorName': 'D-10 Dual A1c Calibrator',
      'calibratorLotId': 3,
      'calibratorLot': {
        'id': 3,
        'calibratorId': 3,
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': new Date('2068-11-02T16:50:23.89')
      }
    },
    'levelSettings': {
      'levelEntityId': null,
      'levelEntityName': null,
      'parentLevelEntityId': null,
      'parentLevelEntityName': null,
      'minNumberOfPoints': 5,
      'runLength': 4,
      'dataType': 1,
      'targets': [],
      'rules': [
        {
          'id': '2',
          'category': '1k',
          'k': '3',
          'disposition': 'R'
        },
        {
          'id': '1',
          'category': '1k',
          'k': '2',
          'disposition': 'R'
        }
      ],
      'levels': [
        {
          'levelInUse': true,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        }
      ],
      'id': '443d6c04-582b-4d1b-86f3-646c827d651e',
      'parentNodeId': 'fba654ab-98dc-4886-93ec-106387b16d95',
      'parentNode': null,
      'isSummary': true,
      'decimalPlaces': 2,
      'level1Used': true,
      'level2Used': true,
      'level3Used': false,
      'level4Used': false,
      'level5Used': false,
      'level6Used': false,
      'level7Used': false,
      'level8Used': false,
      'level9Used': false,
      'displayName': '443d6c04-582b-4d1b-86f3-646c827d651e',
      'children': null
    },
    'accountSettings': {
      'displayName': '',
      'dataType': 1,
      'instrumentsGroupedByDept': true,
      'trackReagentCalibrator': false,
      'fixedMean': false,
      'decimalPlaces': 2,
      'siUnits': false,
      'labSetupRating': 0,
      'labSetupComments': '',
      'isLabSetupComplete': true,
      'labSetupLastEntityId': 'null',
      'id': '04c21413-6775-4c50-9a2a-a9a2c028a139',
      'parentNodeId': '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
      'parentNode': null,
      'nodeType': 9,
      'children': null
    },
    'hasOwnAccountSettings': false,
    'id': 'fba654ab-98dc-4886-93ec-106387b16d95',
    'parentNodeId': 'f6bb8062-eeb3-4269-9568-d6bf435b7840',
    'parentNode': null,
    'nodeType': 6,
    'children': []
  };

  const selectedNode: LabProduct = {
    'displayName': 'Diabetes',
    'productId': '11',
    'productMasterLotId': '206',
    'productCustomName': '',
    'productInfo': {
      'id': 11,
      'name': 'Diabetes',
      'manufacturerId': '2',
      'manufacturerName': 'Bio-Rad',
      'matrixId': 6,
      'matrixName': 'Whole Blood'
    },
    'lotInfo': {
      'id': 206,
      'productId': 11,
      'productName': 'Diabetes',
      'lotNumber': '33980',
      'expirationDate': new Date('2021-03-31T00:00:00')
    },
    'levelSettings': {
      'levelEntityId': 'B9D1F12F287241F4B91A51F6C7298FA2',
      'levelEntityName': 'LabTest',
      'parentLevelEntityId': 'ADFC9711D8DA4D299EBBEC045C77CDD9',
      'parentLevelEntityName': 'LabProduct',
      'minNumberOfPoints': 5,
      'runLength': 4,
      'dataType': 1,
      'targets': [],
      'rules': [
        {
          'id': '2',
          'category': '1k',
          'k': '3',
          'disposition': 'R'
        },
        {
          'id': '1',
          'category': '1k',
          'k': '2',
          'disposition': 'R'
        }
      ],
      'levels': [
        {
          'levelInUse': true,
          'decimalPlace': 2
        },
        {
          'levelInUse': true,
          'decimalPlace': 2
        }
      ],
      'id': 'edbdad7d-e5da-4a00-9f68-1aafd9c7a4a1',
      'parentNodeId': 'e8bee5e0-fec3-48fe-9676-95986997fcba',
      'parentNode': null,
      'isSummary': true,
      'decimalPlaces': 2,
      'level1Used': true,
      'level2Used': true,
      'level3Used': false,
      'level4Used': false,
      'level5Used': false,
      'level6Used': false,
      'level7Used': false,
      'level8Used': false,
      'level9Used': false,
      'displayName': 'edbdad7d-e5da-4a00-9f68-1aafd9c7a4a1',
      'children': null
    },
    'productLotLevels': [
      {
        'id': '513',
        'productMasterLotId': '205',
        'productId': '11',
        'productMasterLotNumber': '33970',
        'lotNumber': '33971',
        'level': 1,
        'levelDescription': '1'
      }],
    'hasOwnAccountSettings': false,
    'id': 'e8bee5e0-fec3-48fe-9676-95986997fcba',
    'parentNodeId': '473b7eb6-60a0-4cbe-ae4a-ecba63d0fce0',
    'parentNode': null,
    'nodeType': 5,
    'children': [{
      'id': '1',
      'parentNodeId': '1',
      'children': [],
      'nodeType': 6,
      'testSpecId': '1',
      'labUnitId': '12',
      'testSpecInfo': null,
      'testId': '1',
      'correlatedTestSpecId': '23',
      'displayName': 'name',
      'parentNode': {
        'id': '1',
        'displayName': 'Diabetes',
        'parentNodeId': '11',
        'manufacturerId': '',
        'children': [],
        'nodeType': 6,
        'productId': '',
        'productMasterLotId': '',
        'productCustomName': '',
        'productInfo': null,
        'lotInfo': null,
        'parentNode': null,
        'levelSettings': null,
        'productLotLevels': [
          {
            'id': '513',
            'productMasterLotId': '205',
            'productId': '11',
            'productMasterLotNumber': '33970',
            'lotNumber': '33971',
            'level': 1,
            'levelDescription': '1'
          }]
      },
      'mappedTestSpecs': 'spec'
    }]
  };

  const settings = {
    'entityIds': ['121'],
    'entityType': 5,
    'levelSettings': {
      'Id': '1',
      'isSummary': false,
      'decimalPlaces': 1,
      'level1Used': true,
      'level2Used': true,
      'level3Used': false,
      'level4Used': false,
      'level5Used': true,
      'level6Used': false,
      'level7Used': false,
      'level8Used': false,
      'level9Used': false
    },
    'runSettings': {
      'minimumNumberOfPoints': 1212,
      'floatStatsStartDate': new Date()
    },
    'ruleSettings': [
      {
        'ruleId': 2,
        'value': 5,
        'disposition': 'R'
      },
      {
        'ruleId': 1,
        'value': 3,
        'disposition': 'W'
      }
    ],
    'hasEvaluationMeanSd': false,
    'parentEntityId': ''
  };
  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    auditTrailViewData: () => { }
  };

  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };
  const dialogStub = { open: () => dialogRefStub };

  const mockDataTimeHelper = jasmine.createSpyObj(['isExpired']);
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.ControlAdd, Permissions.ControlEdit, Permissions.ControlDelete, Permissions.Archiving];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrSelect,
          MaterialModule,
          FormsModule,
          MatSnackBarModule,
          MatDialogModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          HttpClientModule,
          BrLevelsInUseModule,
          BrInfoTooltip,
          BrCore,
          PerfectScrollbarModule,
          StoreModule.forRoot(fromRoot.reducers),
          HttpClientTestingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          }),
        ],
        declarations: [ControlEntryComponent,
          LabSetupHeaderComponent,
          SpcRulesComponent,
          ConfirmDialogDeleteComponent,
          EvaluationMeanSdConfigComponent,
          EvaluationMeanSdComponent,
          LevelEvaluationMeanSdComponent,
          UpdateSettingsDialogComponent
        ],
        providers: [
          [SpcRulesService,
            PortalApiService,
            ConfigService,
            AppLoggerService,
            SpinnerService,
            DatePipe,
            { provide: Router, useValue: '' },
            { provide: CodelistApiService, useValue: mockCodeListService },
            { provide: DateTimeHelper, useValue: mockDataTimeHelper },
            { provide: NavigationService, useValue: mockNavigationService },
            { provide: NgRedux, useValue: mockRedux },
            { provide: MatDialog, useValue: dialogStub },
            { provide: BrPermissionsService, useValue: mockBrPermissionsService },
            { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
            TranslateService,
            { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
            { provide: LocalizationService, mockLocalizationService },
            ApiService,
            HttpClient,
            UnityNextDatePipe
          ]
        ]
      }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmDialogDeleteComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlEntryComponent);
    component = fixture.componentInstance;
    component.levels = selectedNode.levelSettings.levels.map((item) => Object.assign({}, item, { disabled: false }));
    component.labSetupControlsHeaderNode = 5;
    component.title = 'ADVIA Centaur XP';
    component.decimalPlaceData = decimalPlaceData;
    component.levels = levels;
    component.navigationCurrentlySelectedNode$ = of(selectedNode);
    component.navigationCurrentlySelectedLeaf$ = of(selectedNode);
    component.labConfigurationControls = manufacturerProduct;
    component.currentlySelectedControls = currentlySelectedControl;
    component.isDefineOwnControlAvailable = false;
    component.settings = settings;
    component.showSettings = false;
    component.numberOfInitialBlankControls = 3;
    component.setInitForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Ensure ControlEntry form is displayed', () => {
    component.setInitForm();
    expect(fixture.debugElement.nativeElement.querySelector('.spec_controlForm')).not.toBe(null);
  });

  // TODO: Fix testcase
  xit('Validation is performed on control entry form', async () => {
    const lots = [];
    lots[0] = Masterlots;
    component.showSettings = true;
    component.numberOfInitialBlankControls = 1;
    component.labSetupControlsHeaderNode = 5;
    component.title = 'ADVIA Centaur XP';
    component.decimalPlaceData = decimalPlaceData;
    component.setInitForm();
    component.settings = settings;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const elementIndex = 0;
      component.getGroupAtIndex(elementIndex).get('controlName').setValue(component._labConfigurationControls[0]);
      component.lotList = lots;
      component.getGroupAtIndex(elementIndex).get('controlInfo.lotNumber').setValue(Masterlots[0]);
      fixture.detectChanges();
      expect(component.controlsForm.valid).toBeTruthy();
    });
  });

  // TODO: Fix testcase
  xit(`When in Lab Setup - Settings Mode :
        1) Ensure Summary Data Entry Toggle is displayed
        2) Ensure LevelsInUse checkboxes are displayed
        3) Ensure Decimal Places dropdown is displayed
        4) Ensure SPC Rules section is displayed `, async () => {
    component.showSettings = true;
    const lots = [];
    lots[0] = Masterlots;
    component.numberOfInitialBlankControls = 1;
    component.levels = selectedNode.levelSettings.levels.map((item) => Object.assign({}, item, { disabled: false }));
    component.currentSelectedControl = selectedNode;
    component.currentSelectedControl.children = [TestData];
    component.labSetupControlsHeaderNode = 5;
    component.decimalPlaceData = decimalPlaceData;
    component.levels = levels;
    component.summary = false;
    component.setInitForm();
    component.settings = settings;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const elementIndex = 0;
      component.getGroupAtIndex(elementIndex).get('controlName').setValue(component._labConfigurationControls[0]);
      component.lotList = lots;
      component.getGroupAtIndex(elementIndex).get('controlInfo.lotNumber').setValue(Masterlots[0]);
      component.summaryToggleHandler(true);
      fixture.detectChanges();
      const decimalPlaces = fixture.debugElement.nativeElement.querySelector('.spec_decimalPlaces');
      const specRules = fixture.debugElement.nativeElement.querySelector('.spec_specRulesDisplay');
      fixture.detectChanges();
      expect(component.levels).not.toBe(null);
      expect(decimalPlaces).not.toBe(null);
      expect(specRules).not.toBe(null);
      expect(component.summary).toEqual(true);
    });
  });

  it('should verify on click of "Select another control" link adds another form control to add another control', () => {
    const initial: number = component.controlsGetter?.length;
    component.addFormGroups(1);
    fixture.whenStable().then(() => {
      const updated = component.controlsGetter?.length;
      fixture.detectChanges();
      expect(updated).toEqual(initial + 1);
    });
  });

  it('In labSetup Mode, Verify on click of "Cancel" button reset the form values and any dynamically added controls' +
    ' should reset as well', () => {
      component.labSetupControlsHeaderNode = 5;
      component.lotList[0] = Masterlots;
      const elementIndex = 0;
      component.onControlSelectChange(component._labConfigurationControls[0], elementIndex);
      component.addFormControl();
      fixture.detectChanges();
      expect(component.controlsGetter?.length).toEqual(component.numberOfInitialBlankControls + 1);
      component.resetForm();
      fixture.detectChanges();
      component.onResetClicked(0);
      const customNameDisplay = fixture.debugElement.nativeElement.querySelector('.spec_customNameDisplay');
      const lotNumberSelect = fixture.debugElement.nativeElement.querySelector('.spec_lotNumberSelect');
      expect(customNameDisplay).toBe(null);
      expect(lotNumberSelect).toBe(null);
      expect(component.controlsGetter?.length).toEqual(component.numberOfInitialBlankControls);
    });

  // TODO: Fix testcase
  xit('In Settings Mode, Verify on click of "Cancel" button reset the form values', () => {
    component.showSettings = true;
    const lots = [];
    lots[0] = Masterlots;
    component.numberOfInitialBlankControls = 1;
    component.levels = selectedNode.levelSettings.levels.map((item) => Object.assign({}, item, { disabled: false }));
    component.currentSelectedControl = selectedNode;
    component.labSetupControlsHeaderNode = 5;
    component.title = 'ADVIA Centaur XP';
    component.decimalPlaceData = decimalPlaceData;
    component.levels = levels;
    component.summary = true;
    component.setInitForm();
    component.settings = settings;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const elementIndex = 0;
      component.getGroupAtIndex(elementIndex).get('controlName').setValue(component._labConfigurationControls[0]);
      component.lotList = lots;
      component.getGroupAtIndex(elementIndex).get('controlInfo.lotNumber').setValue(Masterlots[0]);
      fixture.detectChanges();
      component.resetForm();
      fixture.detectChanges();
      const customNameDisplay = fixture.debugElement.nativeElement.querySelector('.spec_customNameDisplay');
      const lotNumberSelect = fixture.debugElement.nativeElement.querySelector('.spec_lotNumberSelect');
      const decimalPlaces = fixture.debugElement.nativeElement.querySelector('.spec_decimalPlaces');
      const specRules = fixture.debugElement.nativeElement.querySelector('.spec_specRulesDisplay');
      expect(customNameDisplay).not.toBe(null);
      expect(lotNumberSelect).not.toBe(null);
      expect(component.levels).not.toBe(null);
      expect(decimalPlaces).not.toBe(null);
      expect(specRules).not.toBe(null);
      expect(component.summary).toEqual(false);
    });
  });

  it('Verify on selecting "Control name" from dropdown adds field "Lot Number" and "Custom Name"', () => {
    const lots = [];
    lots[0] = Masterlots;
    component.labSetupControlsHeaderNode = 5;
    component.onControlSelectChange(component._labConfigurationControls[0], 0);
    component.getGroupAtIndex(0).get('controlName').setValue(component._labConfigurationControls[0]);
    component.lotList = lots;
    component.getGroupAtIndex(0).get('controlInfo.lotNumber').setValue(component.lotList[0][0]);
    component.onLoadLots();
    fixture.detectChanges();
    const customNameDisplay = fixture.debugElement.nativeElement.querySelector('.spec_customNameDisplay');
    const lotNumberSelect = fixture.debugElement.nativeElement.querySelector('.spec_lotNumberSelect');
    fixture.whenStable().then(() => {
      expect(customNameDisplay).not.toEqual(null);
      expect(lotNumberSelect).not.toEqual(null);
    });
  });

  it('Should not show "define your own control" option when hasNoSearchResultList is false', () => {
    const lots = [];
    lots[0] = Masterlots;
    component.showDefineOwnControlForm = true;
    component.hasNoSearchResultList = false;
    component.isDefineOwnControlAvailable = true;
    component.isDefineOwnControlVisible = true;
    component.labSetupControlsHeaderNode = 5;
    component.onControlSelectChange(component._labConfigurationControls[0], 0);
    component.getGroupAtIndex(0).get('controlName').setValue(component._labConfigurationControls[0]);
    component.lotList = lots;
    component.getGroupAtIndex(0).get('controlInfo.lotNumber').setValue(component.lotList[0][0]);
    component.onLoadLots();
    fixture.detectChanges();
    const ngContnetWrapper = fixture.debugElement.nativeElement.querySelector('ng-content');
    const customNameDisplay = fixture.debugElement.nativeElement.querySelector('.control-name');
    fixture.whenStable().then(() => {
      expect(customNameDisplay).toBeFalsy();
      expect(ngContnetWrapper).toBeFalsy();
    });
  });

  //TODO fix test
  xit('Should pass "define your own control" option to br-select component through ng-content', () => {
    const lots = [];
    lots[0] = Masterlots;
    component.showDefineOwnControlForm = false;
    component.hasNoSearchResultList = true;
    component.isDefineOwnControlAvailable = true;
    component.isDefineOwnControlVisible = true;
    component.labSetupControlsHeaderNode = 5;
    component.onControlSelectChange(component._labConfigurationControls[0], 0);
    component.getGroupAtIndex(0).get('controlName').setValue(component._labConfigurationControls[0]);
    component.lotList = lots;
    component.getGroupAtIndex(0).get('controlInfo.lotNumber').setValue(component.lotList[0][0]);
    component.onLoadLots();
    const ngContnetWrapper = fixture.debugElement.nativeElement.querySelector('ng-content');
    const customNameDisplay = fixture.debugElement.nativeElement.querySelector('.control-name');
    const lotNumberSelect = fixture.debugElement.nativeElement.querySelector('.br-search-control-overlay');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(customNameDisplay).toBeTruthy();
      expect(ngContnetWrapper).toBeTruthy();
      expect(lotNumberSelect).toBeTruthy();
    });
  });

  // TODO: Fix testcase
  xit('Verify "Delete" button available if Test are not available', async () => {
    component.showSettings = true;
    component.isFormSubmitting = false;
    component._lotsList[0] = Masterlots;
    component.numberOfInitialBlankControls = 1;
    component.levels = selectedNode.levelSettings.levels.map((item) => Object.assign({}, item, { disabled: false }));
    component.navigationCurrentlySelectedNode$ = of(selectedNode);
    component.navigationCurrentlySelectedLeaf$ = of(TestData);
    component.currentSelectedControl = selectedNode;
    component.currentSelectedControl.children = [];
    component.labSetupControlsHeaderNode = 5;
    component.title = 'ADVIA Centaur XP';
    component.decimalPlaceData = decimalPlaceData;
    component.levels = levels;
    component.isTestAvailable = false;
    component.lotList[0] = Masterlots;
    component.isTestAvailable = false;
    component.setInitForm();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const deleteButton = fixture.debugElement.nativeElement.querySelector('#spec_delete_button');
      expect(deleteButton).not.toBe(null);
      spyOn<any>(component, 'openConfirmLinkDialog').and.callThrough();
      spyOn(component, 'deleteControl').and.callThrough();
      fixture.detectChanges();
      component.currentSelectedControl = selectedNode;
      component.deleteControl();
      fixture.detectChanges();
      expect(component['openConfirmLinkDialog']).toHaveBeenCalledWith(selectedNode);
    });
  });

  it('Save button enables in Labsetup Mode', () => {
    component.labSetupControlsHeaderNode = 5;
    component.lotList[0] = Masterlots;
    const elementIndex = 0;
    component.onControlSelectChange(component._labConfigurationControls[0], elementIndex);
    spyOn(component.loadLots, 'emit').and.callThrough();
    //need to mark manually as above code does not set pristine value properly.
    component.getGroupAtIndex(elementIndex).get('controlName').markAsDirty();
    component.onLoadLots();
    component._lotsList[0] = Masterlots;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.spec_submit_control'));
    expect(btn.nativeElement.disabled).toBeTruthy();
    component.getGroupAtIndex(elementIndex).get('controlName').setValue(component._labConfigurationControls[0]);
    component.onControlSelectChange(component._labConfigurationControls[0], 0);
    fixture.detectChanges();
    component.lotList[0] = Masterlots;
    component.getGroupAtIndex(elementIndex).get('controlInfo.lotNumber').setValue(Masterlots[0]);
    fixture.detectChanges();
    component.onSubmit(component.controlsForm.value);
    expect(btn.nativeElement.disabled).toBeFalsy();
  });

  // TODO: Fix testcase
  xit('Update button enables in Settings Mode', async () => {
    component.showSettings = true;
    component.numberOfInitialBlankControls = 1;
    component.summary = false;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const lots = [];
      lots[0] = Masterlots;
      component.isFormSubmitting = false;
      component.navigationCurrentlySelectedNode$ = of(TestData);
      component.navigationCurrentlySelectedLeaf$ = of(selectedNode);
      component.decimalPlaceData = decimalPlaceData;
      component.settings = settings;
      const elementIndex = 0;
      component.setInitForm();
      fixture.detectChanges();
      component.onControlSelectChange(component._labConfigurationControls[0], elementIndex);
      spyOn(component.loadLots, 'emit').and.callThrough();
      const btn = fixture.debugElement.query(By.css('.spec_update_control'));
      expect(btn.nativeElement.disabled).toBeTruthy();
      component.getGroupAtIndex(elementIndex).get('controlName').setValue(component._labConfigurationControls[0]);
      component.lotList = lots;
      component.getGroupAtIndex(elementIndex).get('controlInfo.lotNumber').setValue(Masterlots[0]);
      fixture.detectChanges();
      component.onSubmit(component.controlsForm.value);
      expect(btn.nativeElement.disabled).toBeFalsy();
    });
  });

  it('Check saveLabConfigrationControl has been called in openUpdateSettingsDialog function', async () => {
    const labAnalayte = {
      'nodeType': 5,
      'id': '6e11dc78-dbc1-487e-8f34-4b0cfe91f3bb',
      'manufacturerId': 2,
      'productId': 125,
      'productMasterLotId': 280,
      'customName': 'dasd11',
      'parentNodeId': '455dd2f5-2faa-47ac-950b-d4bf0912ec4e'
    };
    const spy = spyOn(component.saveLabConfigrationControl, 'emit');
    const typeOfOperation = true;
    component.openUpdateSettingsDialog(labAnalayte, settings, typeOfOperation);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith({ labConfigFormValues: labAnalayte, settings: settings, typeOfOperation: typeOfOperation });
    });
  });

  it('should open EvaluationMeanSd component on click with dialog', () => {
    spyOn<any>(component, 'openEvaluationMeanSdDialog').and.callThrough();
    fixture.detectChanges();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1017px';
    dialogConfig.disableClose = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.data = {
      entity: null,
      hasEvaluationMeanSd: false,
      settingsValues: settings
    };
    component.openEvaluationMeanSdDialog(settings);
    expect(component.openEvaluationMeanSdDialog).toHaveBeenCalledWith(settings);
  });

  it('should archive control entry form', async () => {
    component.showSettings = true;
    component.showArchivedFilterToggle = true;
    fixture.detectChanges();
    const archiveElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_archive');
    const contentElement = fixture.debugElement.nativeElement.querySelector('#spec_content');
    const SpyOn = spyOn(component, 'onArchiveToggle').and.callThrough();
    const event = new Event('change');
    archiveElement.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(SpyOn).toHaveBeenCalledWith(event, contentElement);
    });
  });

  it('should not show manufacturer name for BR control', () => {
    const expected = 'Diabetes';
    expect(component._labConfigurationControls[0].displayName).toEqual(expected);
  });

  it('should show [NBR Control] tag for custom control', () => {
    component.isDefineOwnControlAvailable = true;
    component.labConfigurationControls = [{
      'id': '11',
      'name': 'Diabetes',
      'manufacturerId': 0,
      'manufacturerName': 'Other - Customer-Defined'
    }]
    const expected = 'Diabetes [NBR Control]';
    expect(component._labConfigurationControls[0].displayName).toEqual(expected);
  });

  it('should show [NBR Control] tage for custom control', () => {
    component.labConfigurationControls = [{
      'id': '11',
      'name': 'Diabetes',
      'manufacturerId': 4,
      'manufacturerName': 'Siemens'
    }]
    const expected = 'Diabetes [Siemens]';
    expect(component._labConfigurationControls[0].displayName).toEqual(expected);
  });
});
