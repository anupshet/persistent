// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrLevelsInUseModule, BrSelect, BrInfoTooltip, BrCore, MaterialModule } from 'br-component-library';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AnalyteEntryComponent } from './analyte-entry.component';
import { LabSetupHeaderComponent } from '../lab-setup-header/lab-setup-header.component';
import { SpcRulesComponent } from '../spc-rules/spc-rules.component';
import { SpcRulesService } from '../spc-rules/spc-rules.service';
import { ConfigService } from '../../../../core/config/config.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { TreeNodesService } from '../../../../shared/services/tree-nodes.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { ApiService } from '../../../../shared/api/api.service';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { UploadConfigFileComponent } from '../../../../shared/components/upload-config-file/upload-config-file.component';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { EvaluationMeanSdConfigComponent } from '../../containers/evaluation-mean-sd-config/evaluation-mean-sd-config.component';
import { EvaluationMeanSdComponent } from '../../components/evaluation-mean-sd/evaluation-mean-sd.component';
import { LevelEvaluationMeanSdComponent } from '../../components/level-evaluation-mean-sd/level-evaluation-mean-sd.component';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { RequestNewConfigComponent } from '../../../../shared/components/request-new-config/request-new-config.component';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { ErrorsInterceptor } from '../../../../contracts/enums/http-errors.enum';

describe('AnalyteEntryComponent', () => {
  let component: AnalyteEntryComponent;
  let fixture: ComponentFixture<AnalyteEntryComponent>;

  const mockRedux = {
    dispatch() { },
    configureStore() { },
    select() {
      return observableFrom('test');
    },
  };

  const mockApiService = {
    apiUrl: 'apiUrl',
    subscriptionKey: 'subscriptionKey'
  };

  const mockTreeNodesService = {
    getMatchingTestSpecs: () => []
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    auditTrailViewData: () => { }
  };

  const analytesList = [
    {
      id: 4,
      name: 'Acetaminophen'
    }
  ];

  const units = [[
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
  ]];

  const methods = [[
    {
      'id': 583,
      'name': 'Bromcresol Green (BCG)'
    },
    {
      'id': 585,
      'name': 'Bromcresol Red (BCR)'
    }
  ]];

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

  const reagents = [[
    {
      'id': 1108,
      'name': 'AlbG REF 7D53-23',
      'manufacturerId': '1',
      'manufacturerName': 'Abbott',
      'reagentCategoryId': '1'
    },
    {
      'id': 1107,
      'name': 'Albumin BCP REF 7D54-21',
      'manufacturerId': '1',
      'manufacturerName': 'Abbott',
      'reagentCategoryId': '1'
    },
    {
      'id': 1101,
      'name': 'ABC',
      'manufacturerId': '4',
      'manufacturerName': 'Seimens',
      'reagentCategoryId': '1'
    }
  ]];
  const reagentLots = [
    [
      {
        'id': 419,
        'reagentId': 1108,
        'lotNumber': 'Unspecified ***',
        'reagentCategory': 2,
        'shelfExpirationDate': new Date('2068-11-16T17:50:46.477'),
      }
    ]
  ];
  const calibratorLots = [
    [
      {
        'id': 415,
        'calibratorId': 341,
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
      }
    ]
  ];
  const levels = [
    {
      'levelInUse': true,
      'decimalPlace': 2,
    }
  ];
  const defaultManufacturer = {
    manufacturerId: '4',
    name: 'Seimens'
  };

  const dialogRefStub = {
    afterClosed() {
      return observableOf(true);
    }
  };
  const dialogStub = { open: () => dialogRefStub };

  const State = [];

  const submittedFormValues = {
    'defaultControls': {
      'decimalPlaces': '2',
      'summaryDataEntry': false,
      'defaultReagents': null,
      'defaultCalibrators': null,
      'selectAllAnalytes': false,
      'selectReagentLots': false,
      'selectCalibratorLots': false
    },
    'analytes': [
      {
        'analyte': true,
        'analyteInfo': {
          'reagentManufacturer': {
            'manufacturerId': 1,
            'name': 'Abbott'
          },
          'reagents': {
            'id': 1181,
            'name': 'Multigent Iron REF 6K95-41',
            'manufacturerId': 1,
            'manufacturerName': 'Abbott'
          },
          'reagentLots': {
            'id': 492,
            'reagentId': 1181,
            'reagentName': 'Multigent Iron REF 6K95-41',
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2068-11-16T17:50:53.79'
          },
          'calibratorManufacturer': {
            'manufacturerId': 1,
            'name': 'Abbott'
          },
          'calibrator': {
            'id': 280,
            'name': 'Multiconstituent Cal REF 1E65-05',
            'manufacturerId': 1,
            'manufacturerName': 'Abbott'
          },
          'calibratorLots': {
            'id': 281,
            'calibratorId': 280,
            'calibratorName': 'Multiconstituent Cal REF 1E65-05',
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2068-11-16T17:50:53.773'
          },
          'method': {
            'id': 105,
            'name': 'Ferene'
          },
          'unit': {
            'id': 53,
            'name': 'µmol/L',
            'unitCategoryId': 15,
            'unitCategoryName': 'mol/vol',
            'unitSystemTypeId': 2,
            'unitSystemTypeName': 'SI Unit'
          },
          'idx': 0
        }
      }
    ]
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
        'value': 2,
        'disposition': 'W'
      }
    ],
    'hasEvaluationMeanSd': false,
    'parentEntityId': ''
  };

  const productLotLevels = [{
    id: '240',
    level: 1,
    levelDescription: '1',
    lotNumber: '28721',
    productId: '4',
    productMasterLotId: '131',
    productMasterLotNumber: '28720'
  },

  {
    id: '241',
    level: 2,
    levelDescription: '2',
    lotNumber: '28722',
    productId: '4',
    productMasterLotId: '131',
    productMasterLotNumber: '28720'
  },
  {
    id: '242',
    level: 3,
    levelDescription: '3',
    lotNumber: '28723',
    productId: '4',
    productMasterLotId: '131',
    productMasterLotNumber: '28720'
  }];

  const mockNavigationService = {};

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockPortalApiService = {
    getLabSetupNode: () => { }
  };

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.AnalyteAdd, Permissions.AnalyteEdit, Permissions.AnalyteDelete, Permissions.Archiving];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnalyteEntryComponent,
        LabSetupHeaderComponent,
        SpcRulesComponent,
        ConfirmDialogDeleteComponent,
        RequestNewConfigComponent,
        UploadConfigFileComponent,
        TruncatePipe,
        EvaluationMeanSdConfigComponent,
        EvaluationMeanSdComponent,
        LevelEvaluationMeanSdComponent
      ],
      imports: [
        BrLevelsInUseModule,
        MatSnackBarModule,
        MatDialogModule,
        BrSelect,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        PerfectScrollbarModule,
        BrInfoTooltip,
        BrCore,
        StoreModule.forRoot(State),
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
        SpcRulesService,
        ConfigService,
        AppLoggerService,
        { provide: NgRedux, useValue: mockRedux },
        SpinnerService,
        { provide: ApiService, useValue: mockApiService },
        { provide: TreeNodesService, useValue: mockTreeNodesService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: MatDialog, useValue: dialogStub },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateModule,
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        TranslateService,
        HttpClient
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmDialogDeleteComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyteEntryComponent);
    component = fixture.componentInstance;
    component.showSettings = true;
    component.labConfigurationAnalytes = analytesList;
    component.defaultManufacturer = defaultManufacturer;
    component.defaultReagents = true;
    component.defaultCalibrators = true;
    component.selectedData = {
      selectedAnalyteMethodId: methods[0][0].id,
      selectedAnalyteUnitId: units[0][0].id
    };
    component.duplicateAnalytes = [];
    component.existingAnalyteTestSpecs = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the AnalyteEntry form displays Reagent and Calibrator Manufacturer dropdowns', () => {
    component.allReagents = reagents;

    component.allCalibrators = calibrators;
    const reagentManufacturerElement = fixture.debugElement.query(By.css('#spec_reagentManufacturer')).nativeElement;
    const calibratorManufacturerElement = fixture.debugElement.query(By.css('#spec_calibratorManufacturer')).nativeElement;

    expect(reagentManufacturerElement).not.toBe(null);
    expect(calibratorManufacturerElement).not.toBe(null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(reagentManufacturerElement.children.length > 0).toBeTruthy();
      expect(calibratorManufacturerElement.children.length > 0).toBeTruthy();
    });
  });

  it('should check if the AnalyteEntry form displays Unit of Measure dropdown below Method field', () => {
    component.methods = methods;

    component.units = units;
    const methodElement = fixture.debugElement.query(By.css('#spec_method')).nativeElement;
    const unitElement = fixture.debugElement.query(By.css('#spec_unit')).nativeElement;

    expect(methodElement).not.toBe(null);
    expect(unitElement).not.toBe(null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(methodElement.children.length > 0).toBeTruthy();
      expect(unitElement.children.length > 0).toBeTruthy();
    });
  });

  it('should check if reagent list is populated', () => {
    component.reagents = reagents;
    fixture.detectChanges();
    const reagentElement = fixture.debugElement.query(By.css('#spec_reagents')).nativeElement;
    expect(reagentElement).not.toBe(null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(reagentElement.children.length > 0).toBeTruthy();
    });
  });

  it('should check when item in calibrator list is selected, then lot input displayed', () => {
    component.allCalibrators = calibrators;
    component.selectedData.selectedAnalyteCalibratorLotId = calibratorLots[0][0].id;
    fixture.detectChanges();
    const elementIndex = 0;
    component.onCalibratorSelect(341, elementIndex);
    component.calibratorLots = calibratorLots;
    const calibratorLotElement = fixture.debugElement.query(By.css('#spec_calibratorLots')).nativeElement;
    expect(calibratorLotElement.children.length === 0).toBeTruthy();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(calibratorLotElement.children.length > 0).toBeTruthy();
    });
  });

  it('should check if method is populated and selected item is displayed', () => {
    component.methods = methods;
    const methodElement = fixture.debugElement.query(By.css('#spec_method')).nativeElement;

    expect(methodElement).not.toBe(null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const selectedMethod = component.getGroupAtIndex(0).get('analyteInfo.method').value;
      expect(selectedMethod.id).toEqual(component.selectedData.selectedAnalyteMethodId);
      expect(methodElement.children.length > 0).toBeTruthy();
    });
  });

  it('should check if unit is populated and selected item is displayed', () => {
    component.units = units;
    const unitElement = fixture.debugElement.query(By.css('#spec_unit')).nativeElement;

    expect(unitElement).not.toBe(null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const selectedUnit = component.getGroupAtIndex(0).get('analyteInfo.unit').value;
      expect(selectedUnit.id).toEqual(component.selectedData.selectedAnalyteUnitId);
      expect(unitElement.children.length > 0).toBeTruthy();
    });
  });
  it('should check if default manufacturere checkboxes are checked by default', () => {
    component.showSettings = false;
    component.setInitForm();
    expect(component.defaultReagents).toBeTruthy();
    expect(component.defaultCalibrators).toBeTruthy();
  });
  // TO DO: Aaratrika: Need to commit the fixed test case later
  it('should calibratorlots being populated for only **Unspecified lot', () => {
    component.showSettings = false;
    component.allCalibrators = calibrators;
    calibratorLots[0].push(
      {
        'id': 415,
        'calibratorId': 341,
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
      }
    );
    // fixture.detectChanges();
    const elementIndex = 0;
    component.calibratorLots = calibratorLots;
    spyOn(component, 'onCalibratorSelect').and.callThrough();
    spyOn(component.loadCalibratorLots, 'emit');
    component.onCalibratorSelect(415, elementIndex);
    fixture.detectChanges();
    expect(component.onCalibratorSelect).toHaveBeenCalled();
    expect(component.loadCalibratorLots.emit).toHaveBeenCalled();
  });

  it('should reagentlots being populated for multiple reagent lots', () => {
    // component.showSettings = false;
    component.allCalibrators = calibrators;
    calibratorLots[0].push(
      {
        'id': 415,
        'calibratorId': 341,
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
      }
    );
    fixture.detectChanges();
    const elementIndex = 0;
    component.calibratorLots = calibratorLots;
    spyOn(component, 'onCalibratorSelect').and.callThrough();
    spyOn(component.loadCalibratorLots, 'emit');
    component.onCalibratorSelect(415, elementIndex);
    fixture.detectChanges();
    expect(component.onCalibratorSelect).toHaveBeenCalled();
    expect(component.loadCalibratorLots.emit).toHaveBeenCalled();
  });

  it('should uncheck analyte when clicked', () => {
    component.showSettings = false;
    const arrAnalyteElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_analyte');
    const elementIndex = 0;
    const event = new Event('change');
    component.getGroupAtIndex(elementIndex).patchValue({ analyte: false });
    arrAnalyteElement.dispatchEvent(event);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(<HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_analyteInfo')).toBeNull();

    });
  });

  it('should check analyte selected count', () => {
    component.showSettings = false;
    component.labConfigurationAnalytes = analytesList;
    const arrAnalyteElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_analyteParentDiv');
    const elementIndex = 0;
    const event = new Event('click');
    component.getGroupAtIndex(elementIndex).patchValue({ analyte: true });
    arrAnalyteElement.dispatchEvent(event);
    spyOn(component, 'checkSelectedAnalytesCount').and.callThrough();
    component.checkSelectedAnalytesCount(0);
    expect(component.checkSelectedAnalytesCount).toHaveBeenCalled();
  });

  it('should reset form', () => {
    component.showSettings = false;
    component.labConfigurationAnalytes = analytesList;
    spyOn(component, 'resetForm').and.callThrough();
    component.resetForm();
    expect(component.resetForm).toHaveBeenCalled();
  });

  it('should reset form on analyte settings', () => {
    settings['productLots'] = productLotLevels;
    component.settingsNew = settings;
    component.showSettings = true;
    component.labConfigurationAnalytes = analytesList;
    fixture.detectChanges();
    component.selectedReagentManufacturerData = {
      'manufacturerId': '1',
      'name': 'Abbott'
    };
    component.reagentManufacturers[0] = [{
      'manufacturerId': '1',
      'name': 'Abbott'
    }];
    component.reagents = reagents;
    component.selectedData.selectedAnalyteReagentId = component.reagents[0][0].id;
    component.reagentLots = reagentLots;
    component.selectedData.selectedAnalyteReagentLotId = component.reagentLots[0][0].id;

    component.selectedCalibratorManufacturerData = {
      'manufacturerId': '1',
      'name': 'Abbott'
    };
    component.calibratorManufacturers[0] = [
      {
        'manufacturerId': '1',
        'name': 'Abbott'
      }
    ];
    component.calibrators = [[
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
      }
    ]];

    component.selectedData.selectedAnalyteCalibratorId = component.calibrators[0][0].id;
    component.calibratorLots = calibratorLots;
    component.selectedData.selectedAnalyteCalibratorLotId = component.reagentLots[0][0].id;
    component.units = units;
    component.selectedData.selectedAnalyteUnitId = component.units[0][0].id;
    component.methods = methods;
    component.selectedData.selectedAnalyteMethodId = component.methods[0][0].id;
    spyOn(component, 'onChangeLevelInUse').and.callThrough();
    component.resetForm();
    expect(component.onChangeLevelInUse).toHaveBeenCalled();
    expect(component.summaryDataEntry).toEqual(component.settingsNew.levelSettings.isSummary);
  });

  it('should change summary data entry value', () => {
    component.showSettings = true;
    const summaryDataElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_summarydataentry');
    const event = new Event('click');
    summaryDataElement.dispatchEvent(event);
    spyOn(component, 'onSummaryDataEntryChange').and.callThrough();
    component.onSummaryDataEntryChange(true);
    expect(component.onSummaryDataEntryChange).toHaveBeenCalled();
  });

  it('should select all anlytes on click of select all analytes', () => {
    component.showSettings = false;
    component.labConfigurationAnalytes.push({
      id: 7,
      name: 'Acetaminophen2'
    },
      {
        id: 9,
        name: 'Acetaminophen3'
      });
    fixture.detectChanges();
    spyOn(component, 'selectAllAnalytes').and.callThrough();
    component.selectAllAnalytes({ checked: true });
    expect(component.selectAllAnalytes).toHaveBeenCalled();

  });

  it('should unselect all anlytes on click of select all analytes if already checked', () => {
    component.showSettings = false;
    component.labConfigurationAnalytes.push({
      id: 7,
      name: 'Acetaminophen2'
    },
      {
        id: 9,
        name: 'Acetaminophen3'
      });
    fixture.detectChanges();
    spyOn(component, 'selectAllAnalytes').and.callThrough();
    component.selectAllAnalytes({ checked: false });
    expect(component.selectAllAnalytes).toHaveBeenCalled();

  });

  it('should delete analyte', () => {
    component.showSettings = true;
    component.settingsNew = settings;
    spyOn(component, 'deleteAnalyte').and.callThrough();
    component.deleteAnalyte();
    expect(component.deleteAnalyte).toHaveBeenCalled();
  });

  it('should show link for dont see analyate on add analyte page', () => {
    component.showSettings = false;
    fixture.detectChanges();
    const dontSeeAnalyteElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeAnalyte');
    expect(dontSeeAnalyteElement).toBeTruthy();
  });

  it('should open request test config on click of dont see analyate', () => {
    component.showSettings = false;
    fixture.detectChanges();
    const dontSeeAnalyteElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeAnalyte');
    const spy = spyOn(component, 'requestNewConfiguration').and.callThrough();
    dontSeeAnalyteElement.click();
    expect(spy).toHaveBeenCalledWith(component.newRequestConfigType.Analyte);
  });

  it('should show link for dont see reagent', () => {
    const dontSeeReagentElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeReagent');
    expect(dontSeeReagentElement).toBeTruthy();
  });

  it('should open request new reagent config on click of dont see reagent', () => {
    const dontSeeReagentElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeReagent');
    spyOn(component, 'requestNewConfiguration').and.callThrough();
    fixture.detectChanges();
    dontSeeReagentElement.click();
    expect(component.requestNewConfiguration).toHaveBeenCalledWith(component.newRequestConfigType.Reagent);
  });

  it('should show link for dont see reagent', () => {
    const dontSeeCalibratorElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeCalibrator');
    expect(dontSeeCalibratorElement).toBeTruthy();
  });

  it('should open request new reagent config on click of dont see reagent', () => {
    const dontSeeCalibratorElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeCalibrator');
    spyOn(component, 'requestNewConfiguration').and.callThrough();
    fixture.detectChanges();
    dontSeeCalibratorElement.click();
    expect(component.requestNewConfiguration).toHaveBeenCalledWith(component.newRequestConfigType.Calibrator);
  });

  it('should filter list of manufacturers on select default reagent manufacturer checkbox', () => {
    component.showSettings = false;
    component.allReagents = reagents;
    spyOn(component, 'onDefaultReagentManufacturerClick').and.callThrough();
    component.onDefaultReagentManufacturerClick({ checked: true });
    expect(component.onDefaultReagentManufacturerClick).toHaveBeenCalled();
  });

  it('should filter list of manufacturers on select default calibrator manufacturer checkbox', () => {
    component.showSettings = false;
    component.allCalibrators = [[
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
    spyOn(component, 'onDefaultReagentCalibratorClick').and.callThrough();
    component.onDefaultReagentCalibratorClick({ checked: true });
    expect(component.onDefaultReagentCalibratorClick).toHaveBeenCalled();
  });
  it('should filter list of manufacturers on unselect default reagent manufacturer checkbox', () => {
    component.showSettings = true;
    component.allReagents = reagents;
    component.selectedReagentData = reagents[0][0];
    spyOn(component, 'onDefaultReagentManufacturerClick').and.callThrough();
    component.onDefaultReagentManufacturerClick({ checked: false });
    expect(component.onDefaultReagentManufacturerClick).toHaveBeenCalled();
  });
  it('should filter list of manufacturers on unselect default calibrator manufacturer checkbox', () => {
    component.showSettings = true;
    component.allCalibrators = [[
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
    component.selectedCalibratorData = {
      'id': 796,
      'name': '12345678904555',
      'manufacturerId': '10',
      'manufacturerName': 'Abraxis'
    };
    spyOn(component, 'onDefaultReagentCalibratorClick').and.callThrough();
    component.onDefaultReagentCalibratorClick({ checked: false });
    expect(component.onDefaultReagentCalibratorClick).toHaveBeenCalled();
  });

  it('should submit form', () => {
    component.showSettings = true;
    settings['productLots'] = productLotLevels;
    component.settingsNew = settings;
    fixture.detectChanges();
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit(submittedFormValues);
    expect(component.onSubmit).toHaveBeenCalled();
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

  it('should archive analyte entry form', () => {
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

  it('should open request calibrator lot config on click of dont see calibrator lot', () => {
    const spyon = spyOn(component, 'requestNewConfiguration').and.callThrough();
    component.showSettings = true;
    component.allCalibrators = calibrators;
    component.selectedData.selectedAnalyteCalibratorLotId = calibratorLots[0][0].id;
    fixture.detectChanges();
    const elementIndex = 0;
    component.onCalibratorSelect(341, elementIndex);
    component.calibratorLots = calibratorLots;
    fixture.detectChanges();
    const element = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeCalibratorLot');
    const event = new Event('click');
    element.dispatchEvent(event);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spyon).toHaveBeenCalledWith(component.newRequestConfigType.CalibratorLot);
    });
  });

  it('should open request new reagent config on click of dont see reagent lot', () => {
    component.showSettings = true;
    const dontSeeReagentLotElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_dontSeeReagentLot');
    const spy = spyOn(component, 'requestNewConfiguration').and.callThrough();
    fixture.detectChanges();
    dontSeeReagentLotElement.click();
    expect(spy).toHaveBeenCalledWith(component.newRequestConfigType.ReagentLot);
  });

  it('should show same level checkboxes selected which are inherited using settings by default while adding new analyte to control', () => {
    component.showSettings = false;
    settings['productLots'] = productLotLevels;
    component.settingsNew = settings;
    fixture.detectChanges();
    for (let i = 0; i < component.levels.length; i++) {
      expect(component.levels[i].levelInUse).toEqual(settings.levelSettings['level' + (i + 1) + 'Used']);
    }
  });

  it('should allow user to change reagent manufacturer even if analyte has data or no data', () => {
    component.showSettings = true;
    component.reagents = reagents;
    component.calibrators = calibrators;
    const elementIndex = 0;
    component.sideNavItemsList = ['Albumin', 'Ferritin', 'Iron'];
    fixture.detectChanges();

    component.hasAnalyteDataPoints = false;
    fixture.detectChanges();

    spyOn(component, 'onReagentManufacturerSelect').and.callThrough();
    component.onReagentManufacturerSelect('1', elementIndex);
    fixture.detectChanges();
    expect(component.onReagentManufacturerSelect).toHaveBeenCalledTimes(1);

    component.hasAnalyteDataPoints = true;
    fixture.detectChanges();

    component.onReagentManufacturerSelect('4', elementIndex);
    fixture.detectChanges();
    expect(component.onReagentManufacturerSelect).toHaveBeenCalledTimes(2);
  });

  it('should allow user to change calibrator manufacturer even if analyte has data or no data', () => {
    component.showSettings = true;
    component.reagents = reagents;
    component.calibrators = calibrators;
    const elementIndex = 0;
    component.sideNavItemsList = ['Albumin', 'Ferritin', 'Iron'];
    fixture.detectChanges();

    component.hasAnalyteDataPoints = false;
    fixture.detectChanges();

    spyOn(component, 'onCalibratorManufacturerSelect').and.callThrough();
    component.onCalibratorManufacturerSelect('10', elementIndex);
    fixture.detectChanges();
    expect(component.onCalibratorManufacturerSelect).toHaveBeenCalledTimes(1);

    component.hasAnalyteDataPoints = true;
    fixture.detectChanges();

    component.onCalibratorManufacturerSelect('1', elementIndex);
    fixture.detectChanges();
    expect(component.onCalibratorManufacturerSelect).toHaveBeenCalledTimes(2);
  });

  it('should allow user to change reagent even if analyte has data or no data', () => {
    component.showSettings = true;
    component.reagents = reagents;
    component.calibrators = calibrators;
    const elementIndex = 0;
    component.sideNavItemsList = ['Albumin', 'Ferritin', 'Iron'];
    fixture.detectChanges();

    component.hasAnalyteDataPoints = false;
    fixture.detectChanges();

    spyOn(component, 'onReagentSelect').and.callThrough();
    component.onReagentSelect(1108, elementIndex);
    fixture.detectChanges();
    expect(component.onReagentSelect).toHaveBeenCalledTimes(1);

    component.hasAnalyteDataPoints = true;
    fixture.detectChanges();

    component.onReagentSelect(1107, elementIndex);
    fixture.detectChanges();
    expect(component.onReagentSelect).toHaveBeenCalledTimes(2);
  });

  it('should allow user to change calibrator even if analyte has data or no data', () => {
    component.showSettings = true;
    component.reagents = reagents;
    component.calibrators = calibrators;
    const elementIndex = 0;
    component.sideNavItemsList = ['Albumin', 'Ferritin', 'Iron'];
    fixture.detectChanges();

    component.hasAnalyteDataPoints = false;
    fixture.detectChanges();

    spyOn(component, 'onCalibratorSelect').and.callThrough();
    component.onCalibratorSelect(341, elementIndex);
    fixture.detectChanges();
    expect(component.onCalibratorSelect).toHaveBeenCalledTimes(1);

    component.hasAnalyteDataPoints = true;
    fixture.detectChanges();
    component.onCalibratorSelect(297, elementIndex);
    fixture.detectChanges();
    expect(component.onCalibratorSelect).toHaveBeenCalledTimes(2);
  });

  it('should show "Analyte changes are not allowed." error message if changes not allowed error occurs', () => {
    component.isFormSubmitting = true;
    let contentElement = fixture.debugElement.nativeElement.querySelector('#spec_analyteentry_changesnotallowed');
    expect(contentElement).toBeNull();

    component.errorObject = {
      error: {
        error: ErrorsInterceptor.labsetup136
      },
      message: 'Error text',
      source: 'Source',
      stack: 'Stack'
    };
    fixture.detectChanges();

    contentElement = fixture.debugElement.nativeElement.querySelector('#spec_analyteentry_changesnotallowed');
    expect(contentElement.textContent).toBeDefined();
   // expect(contentElement.textContent).toContain('Analyte changes are not allowed.');
    expect(component.isFormSubmitting).toBeFalse();

    component.errorObject = null;
    fixture.detectChanges();

    contentElement = fixture.debugElement.nativeElement.querySelector('#spec_analyteentry_changesnotallowed');
    expect(contentElement).toBeNull();
  });

  it('should show "We are unable to make the change at this time. Please contact technical support. " error message if unable to make change error occurs', () => {
    component.isFormSubmitting = true;
    let contentElement = fixture.debugElement.nativeElement.querySelector('#spec_analyteentry_unabletomakethechange');
    expect(contentElement).toBeNull();

    component.errorObject = {
      error: {
        error: ErrorsInterceptor.labsetup135
      },
      message: 'Error text',
      source: 'Source',
      stack: 'Stack'
    };
    fixture.detectChanges();

    contentElement = fixture.debugElement.nativeElement.querySelector('#spec_analyteentry_unabletomakethechange');
    expect(contentElement.textContent).toBeDefined();
   // expect(contentElement.textContent).toContain('We are unable to make the change at this time. Please contact technical support.');
    expect(component.isFormSubmitting).toBeFalse();

    component.errorObject = null;
    fixture.detectChanges();

    contentElement = fixture.debugElement.nativeElement.querySelector('#spec_analyteentry_changesnotallowed');
    expect(contentElement).toBeNull();
  });

  it('should not show "Analyte changes are not allowed." error message for general errors', () => {
    component.isFormSubmitting = true;
    let contentElement = fixture.debugElement.nativeElement.querySelector('#spec_analyteentry_changesnotallowed');
    expect(contentElement).toBeNull();

    component.errorObject = {
      error: {
        error: '123'
      },
      message: 'Error text',
      source: 'Source',
      stack: 'Stack'
    };
    fixture.detectChanges();

    contentElement = fixture.debugElement.nativeElement.querySelector('#spec_analyteentry_changesnotallowed');
    expect(contentElement).toBeNull();
    expect(component.isFormSubmitting).toBeFalse();
  });

  it('should create the component with an empty search input', () => {
    const searchAnalyteControl = component.analyteSearchFilter;
    expect(searchAnalyteControl).toEqual('');
  });

  it('should update the search input value when text is entered', () => {
    const searchAnalyteControl = component.analyteSearchFilter;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let input = fixture.debugElement.query(By.css('input'));
      let el = input.nativeElement;
      expect(el.value).toBe('Iron');
      el.value = 'Iron';
      el.dispatchEvent(new Event('input'));
      expect(searchAnalyteControl).toBe('Iron');
    });
  });

  it('should fetch data when search value changes', () => {
    const searchAnalyteControl = component.analyteSearchFilter;
    expect(searchAnalyteControl).not.toBe(null);
    fixture.detectChanges();
    spyOn(component, 'isAnalyteVisible').and.callThrough();
    component.isAnalyteVisible(0);
    expect(component.isAnalyteVisible).toHaveBeenCalled();
  });
});
