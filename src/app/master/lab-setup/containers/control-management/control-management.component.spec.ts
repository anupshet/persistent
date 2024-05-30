// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NgReduxModule } from '@angular-redux/store';
import { By } from '@angular/platform-browser';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrLevelsInUseModule, BrSelectComponent, MaterialModule } from 'br-component-library';
import { ControlManagementComponent } from './control-management.component';
import { ControlConfigComponent } from '../control-config/control-config.component';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import * as fromRoot from '../../state';
import { ControlEntryComponent } from '../../components/control-entry/control-entry.component';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { ConfigService } from '../../../../core/config/config.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { SpcRulesComponent } from '../../components/spc-rules/spc-rules.component';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { AuthenticationService } from '../../../../security/services';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';

describe('ControlManagementComponent', () => {
  let component: ControlManagementComponent;
  let fixture: ComponentFixture<ControlManagementComponent>;
  let navigationServiceInstance: NavigationService;
  const mockCodeListService = {
    getProductMasterLotsByProductId: () => { },
    getProductsByInstrumentId: () => { }
  };

  const getCurrentUserStub = {
    hasDefaultSystemAccess: () => {
      return true;
    }
  };

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigate')
  };

  const selectedNodeInstrument = {
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

    id: 'A914E73C1F124BEF909053B1BEB2ED19',
    parentNodeId: 'EDAB53E0CA694FDF80A7CB4D756030C7',
    parentNode: null,
    nodeType: 4,
    children: []
  };

  const selectedNode = {
    'displayName': 'Blood Gas',
    'id': '72285DC498024F1DADCF8E9BC12DCDD3',
    'labLocationAddress': '',
    'labLocationAddressId': '0839deff-5a11-4ece-b781-e3868f2fcdb6',
    'labLocationContact': '',
    'labLocationContactId': 'c3a68a6c-d4db-4062-a1c3-bc143c472532',
    'labLocationName': 'New Mexico',
    'locationDayLightSaving': false,
    'locationOffset': 0,
    'locationTimeZone': 'Asia/Calcutta',
    'nodeType': 5,
    'parentNode': null,
    'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
    'levelSettings': {
      'levelEntityId': 'B9D1F12F287241F4B91A51F6C7298FA2',
      'levelEntityName': 'LabTest',
      'parentLevelEntityId': 'ADFC9711D8DA4D299EBBEC045C77CDD9',
      'parentLevelEntityName': 'LabProduct',
      'minNumberOfPoints': 5,
      'runLength': 4,
      'dataType': 0,
      'targets': [{
        'controlLotId': '261',
        'controlLevel': '1',
        'mean': 0,
        'sd': 0,
        'points': 0
      }],
      'rules': [
        {
          'id': '1',
          'category': '1k',
          'k': '3',
          'disposition': 'N'
        },
        {
          'id': '1',
          'category': '1k',
          'k': '2',
          'disposition': 'N'
        }
      ],
      'levels': [{
        'levelInUse': false,
        'decimalPlace': 2
      }]
    },
    'children': []
  };

  const TestData = {
    'displayName': ' Hemoglobin A1c',
    'testSpecId': '5',
    'correlatedTestSpecId': '4C0D59DD8DB645BCB7C71DC4D758EB2D',
    'testId': '5',
    'labUnitId': '93',
    'testSpecInfo': {
      'id': 5,
      'testId': '5',
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
      'reagentLotNumber': 'Unspecified ***',
      'reagentLot': {
        'id': 3,
        'reagentId': 693,
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': '2068-11-02T16:50:23.89'
      },
      'storageUnitId': 93,
      'storageUnitName': '%',
      'calibratorId': 3,
      'calibratorManufacturerId': null,
      'calibratorManufacturerName': 'Bio-Rad',
      'calibratorName': 'D-10 Dual A1c Calibrator',
      'calibratorLotId': 3,
      'calibratorLotNumber': 'Unspecified ***',
      'calibratorLot': {
        'id': 3,
        'calibratorId': 3,
        'lotNumber': 'Unspecified ***',
        'shelfExpirationDate': '2068-11-02T16:50:23.89'
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
      'nodeType': 8,
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
    'mappedTestSpecs': null,
    'id': 'fba654ab-98dc-4886-93ec-106387b16d95',
    'parentNodeId': 'f6bb8062-eeb3-4269-9568-d6bf435b7840',
    'parentNode': null,
    'nodeType': 6,
    'children': []
  };

  const mockNavigationService = {
    navigateToUrl: jasmine.createSpy(),
    setSelectedNodeById: () => { }
  };


  const mockDataTimeHelper = jasmine.createSpyObj(['isExpired']);
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  const mockEntityTypeService = {
    getLevelName: (val) => val
  };

  let mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.ControlAdd, Permissions.ControlEdit,
      Permissions.ControlAddViewOnly, Permissions.ControlEditViewOnly];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };
  const TRANSLATIONS_EN = require('../../../../../assets/i18n/en.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(fromRoot.reducers),
        BrLevelsInUseModule,
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        MatSnackBarModule,
        MatDialogModule,
        ReactiveFormsModule,
        NgReduxModule,
        NgReduxTestingModule,
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot(fromRoot.reducers),
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
      declarations: [ControlManagementComponent,
        ControlConfigComponent,
        ControlEntryComponent,
        SpcRulesComponent,
        LabSetupHeaderComponent,
        BrSelectComponent
      ],
      providers: [
        { provide: AuthenticationService, useValue: getCurrentUserStub },
        ConfigService,
        { provide: EntityTypeService, useValue: mockEntityTypeService },
        { provide: CodelistApiService, useValue: mockCodeListService },
        AppLoggerService,
        SpcRulesService,
        SpinnerService,
        { provide: Router, useValue: mockRouter },
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        PortalApiService,
        DatePipe,
        TranslateService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlManagementComponent);
    component = fixture.componentInstance;
    component.navigationCurrentlySelectedLeaf$ = of(selectedNode);
    component.navigationCurrentlySelectedNode$ = of(selectedNodeInstrument);
    component.showSettings$ = of(true);
    navigationServiceInstance = fixture.debugElement.injector.get(NavigationService);
    fixture.detectChanges();
  });

  //AJROY
  xit('should create', () => {
    component.showSettings = true;
    component.currentSelectedNode = selectedNodeInstrument;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  xit('Ensure Control Name is displayed in Title', () => {
    component.showSettings = true;
    component.navigationCurrentlySelectedLeaf$ = of(TestData);
    component.navigationCurrentlySelectedNode$ = of(selectedNode);
    fixture.detectChanges();
    const controlTitle = fixture.debugElement.nativeElement.querySelector('#control-management-title');
    fixture.whenStable().then(() => {
      expect(component.control.displayName).toEqual(controlTitle.innerText);
    });
  });

  xit('Ensure control config card is displayed', () => {
    component.showSettings = true;
    component.navigationCurrentlySelectedLeaf$ = of(TestData);
    component.navigationCurrentlySelectedNode$ = of(selectedNode);
    spyOn(navigationServiceInstance, 'setSelectedNodeById').and.callThrough();
    component.gotoInstrumentSettings();
    fixture.detectChanges();
    expect(navigationServiceInstance.setSelectedNodeById).toHaveBeenCalled();
    expect(fixture.debugElement.nativeElement.querySelector('unext-control-config')).not.toBe(null);
  });

  xit('Should check if Link to Return to Data Table is displayed and routes to Data Table', () => {
    component.showSettings = true;
    component.navigationCurrentlySelectedLeaf$ = of(selectedNode);
    component.navigationCurrentlySelectedNode$ = of(selectedNodeInstrument);
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('#spec_returnToControlData'));
    component.redirectToDataTable();
    fixture.detectChanges();
    expect(mockNavigationService.navigateToUrl).toHaveBeenCalled();
    component.control = selectedNode;
    component.control.children = [TestData];
    component.redirectToDataTable();
    fixture.detectChanges();
    expect(TRANSLATIONS_EN.CONTROLMANAGEMENT.RETURNDATA).toEqual('Return To data');
  });

});
