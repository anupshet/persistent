// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SimpleChange } from '@angular/core';
import { RouterEvent, Router, NavigationEnd } from '@angular/router';
import { Autofixture } from 'ts-autofixture/dist/src';
import { Observable, of, ReplaySubject } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrSelect, MaterialModule } from 'br-component-library';
import { EntityInfo } from '../../../../contracts/models/data-management/entity-info.model';
import { Manufacturer } from '../../../../contracts/models/lab-setup/manufacturer.model';
import { ConfigService } from '../../../../core/config/config.service';
import { decimalPlace } from '../../../../core/config/constants/general.const';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { LabSetupHeaderComponent } from '../lab-setup-header/lab-setup-header.component';
import { SpcRulesComponent } from '../spc-rules/spc-rules.component';
import { SpcRulesService } from '../spc-rules/spc-rules.service';
import { InstrumentEntryComponent } from './instrument-entry.component';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { LabInstrument } from '../../../../contracts/models/lab-setup';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { NavigationState } from '../../../../shared/navigation/state/reducers/navigation.reducer';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { LocalizationService } from '../../../../shared/navigation/services/localizaton.service';
import { ApiService } from '../../../../shared/api/api.service';

describe('InstrumentEntryComponent', () => {
  let component: InstrumentEntryComponent;
  let fixture: ComponentFixture<InstrumentEntryComponent>;
  let store: MockStore<any>;
  const autofixture = new Autofixture();
  const testData = autofixture.create(new EntityInfo());
  const ApiServiceStub = {
    get: (): Observable<any> => {
      return of(testData);
    }
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    auditTrailViewData : () => {}
  };

  const instrumentList = [[
    {
      'id': 3115,
      'name': 'Alinity c',
      'manufacturerId': 1,
      'manufacturerName': 'Abbott'
    },
    {
      'id': 1254,
      'name': 'ARCHITECT c16000',
      'manufacturerId': 1,
      'manufacturerName': 'Abbott'
    }
  ]];
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
        levelInUse: true,
        decimalPlace: 3
      }]
    },
    id: 'A914E73C1F124BEF909053B1BEB2ED19',
    parentNodeId: 'EDAB53E0CA694FDF80A7CB4D756030C7',
    parentNode: null,
    nodeType: 4,
    children: []
  };

  const mockNavigationService = {
    navigateToUrl: () => { }
  };
  let navigationServiceInstance: NavigationService;
  const navigationState: NavigationState = {
    selectedNode: selectedNode,
    selectedLeaf: null,
    currentBranch: [],
    connectivityFullTree: null,
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: false,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: true,
    settings: null,
    showArchivedItemsToggle: true,
    isArchiveItemsToggleOn: false,
    showAccountUserSelectorToggle: false,
    isAccountUserSelectorOn: false,
    hasNonBrLicense: false
  };

  const manufacturersList: Manufacturer[] = [
    {
      'manufacturerId': '3',
      'name': 'AB SCIEXy'
    },
    {
      'manufacturerId': '1',
      'name': 'Abbott'
    },
    {
      'manufacturerId': '119',
      'name': 'abctest123456'
    },
    {
      'manufacturerId': '7',
      'name': 'ABON Biopharma'
    }];
  const decimalPlaceData = decimalPlace;
  const mockLocalizationService = {
    getLanguageMapping: () => { },
  };
  const mockAllInstrumentInDep: Array<LabInstrument> = [{
    'displayName': 'c1',
    'instrumentId': '2749',
    'instrumentCustomName': 'c1',
    'instrumentSerial': 's1',
    'instrumentInfo': {
      'id': 2749,
      'name': 'D-10',
      'manufacturerId': '2',
      'manufacturerName': 'Bio-Rad'
    },
    'levelSettings': {
      'levelEntityId': null,
      'levelEntityName': null,
      'parentLevelEntityId': null,
      'parentLevelEntityName': null,
      'minNumberOfPoints': 5,
      'runLength': 4,
      'dataType': 1,
      'targets': null,
      'rules': [{
        'id': '2',
        'category': '1k',
        'k': '3',
        'disposition': 'D'
      }, {
        'id': '1',
        'category': '1k',
        'k': '2',
        'disposition': ''
      }],
      'levels': [{
        'levelInUse': true,
        'decimalPlace': 2
      }],
      'id': 'eea97668-4b3e-44ab-a648-125fe7272cfd',
      'parentNodeId': 'acae537d-639e-45b2-bd28-ac28f39a4802',
      'parentNode': null,
      'nodeType': 8,
      'displayName': 'eea97668-4b3e-44ab-a648-125fe7272cfd',
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
      'labSetupComments': 'null',
      'isLabSetupComplete': true,
      'labSetupLastEntityId': 'null',
      'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
      'parentNode': null,
      'parentNodeId': null,
      'nodeType': 9,
      'children': null
    },
    'hasOwnAccountSettings': false,
    'id': 'acae537d-639e-45b2-bd28-ac28f39a4802',
    'parentNodeId': '30a6c2b3-b8c1-42b1-ba27-f4c45a249893',
    'parentNode': null,
    'nodeType': 4,
    'children': []
  }, {
    'displayName': 'AU400',
    'instrumentId': '1506',
    'instrumentCustomName': '',
    'instrumentSerial': '',
    'instrumentInfo': {
      'id': 1506,
      'name': 'AU400',
      'manufacturerId': '14',
      'manufacturerName': 'Beckman Coulter'
    },
    'levelSettings': {
      'levelEntityId': null,
      'levelEntityName': null,
      'parentLevelEntityId': null,
      'minNumberOfPoints': 5,
      'runLength': 4,
      'dataType': 1,
      'targets': null,
      'rules': [{
        'id': '2',
        'category': '1k',
        'k': '3',
        'disposition': 'D'
      }, {
        'id': '1',
        'category': '1k',
        'k': '2',
        'disposition': 'D'
      }],
      'levels': [{
        'levelInUse': true,
        'decimalPlace': 2
      }],
      'id': '71461299-5521-4102-89f5-0ef82ac31bd7',
      'parentNodeId': '7bf5093b-92ae-4391-a479-4b918268a41e',
      'parentNode': null,
      'nodeType': 8,
      'displayName': '71461299-5521-4102-89f5-0ef82ac31bd7',
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
      'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
      'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
      'parentNode': null,
      'nodeType': 9,
      'children': null
    },
    'hasOwnAccountSettings': false,
    'id': '7bf5093b-92ae-4391-a479-4b918268a41e',
    'parentNodeId': '30a6c2b3-b8c1-42b1-ba27-f4c45a249893',
    'parentNode': null,
    'nodeType': 4,
    'children': []
  }];

  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'test/url'
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.InstrumentAdd, Permissions.InstrumentEdit,
      Permissions.InstrumentDelete, Permissions.Archiving];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };

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
        NgReduxTestingModule,
        StoreModule.forRoot([]),
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
        InstrumentEntryComponent,
        LabSetupHeaderComponent,
        SpcRulesComponent,
        ConfirmDialogDeleteComponent
      ],
      providers: [
        SpcRulesService,
        ConfigService,
        EntityTypeService,
        AppLoggerService,
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: Store, useValue: { navigation: navigationState } },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: Router, useValue: routerMock },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: LocalizationService, mockLocalizationService },
        ApiService,
        SpinnerService,
        provideMockStore({ initialState: { navigation: navigationState } }),
        TranslateService,
        HttpClient
      ]
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmDialogDeleteComponent] } })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(navigationState);
    fixture = TestBed.createComponent(InstrumentEntryComponent);
    component = fixture.componentInstance;
    // component.navigationShowSettings$ = of(navigationState);
    navigationServiceInstance = fixture.debugElement.injector.get(NavigationService);
    fixture.detectChanges();
    component.instrumentList = instrumentList;
    component.manufacturers = manufacturersList;
    component.cancelButtonEnabled = true;
    component.selectedNode = selectedNode;
    component.navigationSelectedLeaf$ = of(selectedNode);
    component.instrumentLimitMessage = 'test message';
  });

  xit('Verify that InstrumentEntryform is displayed', () => {
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = true;
    component.cancelButtonEnabled = true;

    component.setInitForm();
    component.setSelectedNode(selectedNode);
    fixture.detectChanges();
    const instrumentDisplay = fixture.debugElement.nativeElement.querySelector('#spec_instrumentEntryComponent');
    expect(instrumentDisplay.childNodes).not.toBe(null);
  });

  xit('Verify that Validation is performed on InstrumentEntryform', () => {
    component.selectedNode = selectedNode;
    component.decimalPlaceData = decimalPlaceData;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = true;
    component.setInitForm();
    component.setSelectedNode(selectedNode);
    fixture.detectChanges();
    const instrumentForm = fixture.debugElement.nativeElement.querySelector('#spec_instrumentEntryForm');
    expect(instrumentForm.checkValidity()).toBe(true);
  });

  xit('Ensure SPC Rules section is displayed when needed', () => {
    selectedNode.levelSettings.dataType = 1;
    component.selectedNode = selectedNode;
    component.decimalPlaceData = decimalPlaceData;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = true;
    component.setInitForm();
    component.setSelectedNode(selectedNode);
    fixture.detectChanges();
    const spcRules = fixture.debugElement.nativeElement.querySelector('#spec_spcRules');
    expect(spcRules).toBe(null);
  });

  xit('Ensure SPC Rules section is not visible while showSettingsFields is false', () => {
    selectedNode.levelSettings.dataType = 0;
    component.selectedNode = selectedNode;
    component.decimalPlaceData = decimalPlaceData;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = true;
    component.setInitForm();
    component.setSelectedNode(selectedNode);
    fixture.detectChanges();
    const spcRules = fixture.debugElement.nativeElement.querySelector('#spec_spcRules');
    expect(spcRules).toBeNull();
  });

  it('Check resetForm when showsettings true ', () => {
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = true;
    component.resetForm();
    fixture.detectChanges();
    expect(component.formValueNotSet).toBe(true);

  });
  it('Check resetForm when showsettings false ', () => {
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = false;
    component.resetForm();
    fixture.detectChanges();
    expect(component.instrumentList).toEqual([]);

  });

  it('check onInstrumentManufacturerSelect when showsettings false ', () => {
    const item = manufacturersList[1];
    spyOn(component, 'onInstrumentManufacturerSelect').and.callThrough();
    component.onInstrumentManufacturerSelect(item, 1);
    fixture.detectChanges();
    expect(component.onInstrumentManufacturerSelect).toHaveBeenCalledWith(item, 1);
  });

  it('Check onNameChange when showsettings false', () => {
    const itemValue = 'abc';
    const pointIndex = 0;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = false;
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    spyOn(component, 'onNameChange').and.callThrough();
    spyOn(component, 'checkValidation').and.callThrough();
    component.onNameChange(itemValue, pointIndex);
    fixture.detectChanges();
    expect(component.checkValidation).toHaveBeenCalledWith();
  });

  it('Check onNameChange when showsettings true', () => {
    const itemValue = 'abc';
    const pointIndex = 0;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = true;
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    spyOn(component, 'onNameChange').and.callThrough();
    spyOn(component, 'checkFormState').and.callThrough();
    spyOn(component, 'checkValidation').and.callThrough();
    component.onNameChange(itemValue, pointIndex);
    fixture.detectChanges();
    expect(component.checkFormState).toHaveBeenCalled();
    expect(component.checkValidation).toHaveBeenCalledWith();
  });

  it('Check onSerialNoChange when custom name is empty', () => {
    const itemValue = ' ';
    const pointIndex = 0;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = false;
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    spyOn(component, 'onNameChange').and.callThrough();
    spyOn(component, 'isNameDuplicate').and.callThrough();
    spyOn(component, 'checkValidation').and.callThrough();
    component.onNameChange(itemValue, pointIndex, 1234);
    fixture.detectChanges();
    expect(component.isNameDuplicate).toHaveBeenCalled();
    expect(component.checkValidation).toHaveBeenCalled();
  });


  it('Check onSerialNoChange when showsettings false', () => {
    const itemValue = '123';
    const pointIndex = 0;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = false;
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    spyOn(component, 'onSerialNoChange').and.callThrough();
    spyOn(component, 'checkValidation').and.callThrough();
    component.onSerialNoChange(itemValue, pointIndex);
    fixture.detectChanges();
    expect(component.checkValidation).toHaveBeenCalled();
  });

  it('Check onSerialNoChange when showsettings true', () => {
    const itemValue = '123';
    const pointIndex = 0;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = true;
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    spyOn(component, 'onSerialNoChange').and.callThrough();
    spyOn(component, 'checkFormState').and.callThrough();
    spyOn(component, 'checkValidation').and.callThrough();
    component.onSerialNoChange(itemValue, pointIndex);
    fixture.detectChanges();
    expect(component.checkFormState).toHaveBeenCalled();
    expect(component.checkValidation).toHaveBeenCalled();
  });

  it('Check onSerialNoChange when serial number is empty', () => {
    const itemValue = ' ';
    const pointIndex = 0;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.selectedNode = selectedNode;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.showSettings = false;
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    spyOn(component, 'onSerialNoChange').and.callThrough();
    spyOn(component, 'isNameDuplicate').and.callThrough();
    spyOn(component, 'checkValidation').and.callThrough();
    component.onSerialNoChange(itemValue, pointIndex);
    fixture.detectChanges();
    expect(component.isNameDuplicate).toHaveBeenCalled();
    expect(component.checkValidation).toHaveBeenCalled();
  });

  xit('Check instrument delete ', () => {
    component.showSettings = true;
    component.canDeleteInstrument = false;
    component.formValueNotSet = false;
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.setInitForm();
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    component.selectedNode = selectedNode;

    const spyOnDailog = spyOn<any>(component, 'openConfirmLinkDialog').and.callThrough();
    const spy = spyOn(component, 'deleteInstrument').and.callThrough();
    fixture.detectChanges();
    component.deleteInstrument();
    const button = fixture.debugElement.nativeElement.querySelector('#spec_deleteInstrument');
    button.click();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      expect(spyOnDailog).toHaveBeenCalledWith(component.selectedNode);
    });
  });

  xit('Check form gets submitted ', () => {
    component.showSettings = false;
    component.instrumentList = instrumentList;
    component.manufacturers = manufacturersList;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.setInitForm();
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    const typeofoperation= true;
    const formvalue = {
      'instruments': [{
        'instrumentManufacturer': {
          'manufacturerId': 1,
          'name': 'Abbott'
        },
        'instrumentInfo': {
          'instrumentModel': {
            'id': 3116,
            'name': 'Alinity i',
            'manufacturerId': 1,
            'manufacturerName': 'Abbott'
          },
          'customName': 'abc',
          'serialNumber': 'abc123'
        }
      }, {
        'instrumentManufacturer': ''
      }, {
        'instrumentManufacturer': ''
      }, {
        'instrumentManufacturer': ''
      }]
    };
    const spy = spyOn(component, 'onSubmit').and.callThrough();
    fixture.detectChanges();
    component.onSubmit(formvalue,typeofoperation);
    const button = fixture.debugElement.nativeElement.querySelector('#spec_submitForm');
    button.click();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith(formvalue,typeofoperation);
    });
  });

  xit('Check form gets updated ', () => {
    component.showSettings = true;
    component.navigationSelectedLeaf$ = of(selectedNode);
    component.formValueNotSet = false;
    component.instrumentList = instrumentList;
    component.manufacturers = manufacturersList;
    component.allInstrumentInDep = mockAllInstrumentInDep;
    component.setInitForm();
    const typeofoperation= true;
    const formvalue = {
      'instruments': [{
        'instrumentManufacturer': {
          'manufacturerId': 1,
          'name': 'Abbott'
        },
        'instrumentInfo': {
          'instrumentModel': {
            'id': 3116,
            'name': 'Alinity i',
            'manufacturerId': 1,
            'manufacturerName': 'Abbott'
          },
          'customName': 'abc',
          'serialNumber': 'abc123'
        }
      }, {
        'instrumentManufacturer': ''
      }, {
        'instrumentManufacturer': ''
      }, {
        'instrumentManufacturer': ''
      }]
    };
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    const spy = spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit(formvalue,typeofoperation);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(formvalue,typeofoperation);
  });

  it('Checks ngOnChanges with Instrument list', () => {
    const currentInstrumentList = instrumentList;
    component.instrumentList = instrumentList;
    component.manufacturers = manufacturersList;
    component.selectedNode = selectedNode;
    const spy = spyOn(component, 'ngOnChanges').and.callThrough();
    const instrumentsList = new SimpleChange(null, currentInstrumentList, false);
    component.ngOnChanges({
      instrumentList: instrumentsList
    });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({ instrumentList: instrumentsList });

  });

  it('Checks ngOnChanges when instrument manufacturer selected and showSettings false', () => {
    component.showSettings = false;
    component.pointIndexOfInstrument = 0;
    const currentInstrumentList = instrumentList;
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    const spy = spyOn(component, 'ngOnChanges').and.callThrough();
    const instrumentsList = new SimpleChange(null, currentInstrumentList, false);
    component.ngOnChanges({
      instrumentList: instrumentsList
    });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({ instrumentList: instrumentsList });

  });
  it('Checks ngOnChanges when instrument list length is 1', () => {
    component.showSettings = false;
    component.pointIndexOfInstrument = 0;
    const currentInstrumentList = [[
      {
        'id': 3115,
        'name': 'Alinity c',
        'manufacturerId': 1,
        'manufacturerName': 'Abbott'
      }]];
    component.onInstrumentManufacturerSelect(manufacturersList[1], 0);
    spyOn(component, 'ngOnChanges').and.callThrough();
    const instrumentsList = new SimpleChange(null, currentInstrumentList, false);
    component.ngOnChanges({
      instrumentList: instrumentsList
    });
    fixture.detectChanges();
    expect(component.ngOnChanges).toHaveBeenCalledWith({ instrumentList: instrumentsList });

  });

  it('Checks ngOnChanges for add instrument', () => {
    const manufacturersPrev = manufacturersList;
    const manufacturerCurrent = manufacturersList;

    const spy = spyOn(component, 'ngOnChanges').and.callThrough();
    const manufacturer = new SimpleChange(manufacturersPrev, manufacturerCurrent, false);
    component.selectedNode = selectedNode;
    component.ngOnChanges({
      manufacturers: manufacturer
    });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({ manufacturers: manufacturer });

  });

  it('Checks showSettings in ngOnInit', () => {
    component.manufacturers = manufacturersList;
    component.instrumentList = instrumentList;
    navigationState.showSettings = true;
    component.navigationShowSettings$ = of(navigationState);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.showSettings).toBeTruthy();

  });

  it('should not call update form with end navigation event', () => {
    component.showSettings = false;
    const methodSpy = spyOn(component, 'updateForm');
    eventSubject.next(new NavigationEnd(1, 'regular', 'redirectUrl'));
    expect(methodSpy).not.toHaveBeenCalled();

  });

  it('Check getSelectedNode for Selected Node', () => {
    component.naviagtionSelectedNode$ = of(selectedNode);
    component.manufacturers = manufacturersList;
    const methodSpy = spyOn(component, 'setSelectedNode').and.callThrough();
    component.getSelectedNode();
    fixture.detectChanges();
    expect(methodSpy).toHaveBeenCalled();
    expect(component.selectedNode).toEqual(selectedNode);
  });

  it('Check getSelectedNode if Selected Node is null Selected Leaf should be set as selected Node', () => {
    component.naviagtionSelectedNode$ = of(null);
    component.navigationSelectedLeaf$ = of(selectedNode);
    component.manufacturers = manufacturersList;
    const methodSpy = spyOn(component, 'setSelectedNode').and.callThrough();

    component.getSelectedNode();
    fixture.detectChanges();
    expect(methodSpy).toHaveBeenCalled();
    expect(component.selectedNode).toEqual(selectedNode);
  });

  it('checks add control functionality', () => {
    component.navigationSelectedLeaf$ = of(selectedNode);
    component.naviagtionSelectedNode$ = of(null);
    navigationState.showSettings = true;
    component.navigationShowSettings$ = of(navigationState);
    component.formValueNotSet = false;
    component.ngOnInit();
    const spy1 = spyOn(component, 'redirectToControl').and.callThrough();
    const spy2 = spyOn(navigationServiceInstance, 'navigateToUrl');
    fixture.detectChanges();
    const link = fixture.debugElement.nativeElement.querySelector('#spec_addControl');
    link.click();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

  });

  it('should archive control entry form', () => {
    component.showSettings = true;
    component.showArchivedFilterToggle = true;
    component.onInstrumentManufacturerSelect(manufacturersList[0], 1);
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
