// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { StoreModule, Store } from '@ngrx/store';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';
import { NgRedux } from '@angular-redux/store';
import { of, from as observableFrom } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DatePipe } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { Autofixture } from 'ts-autofixture/dist/src';
import { BrSelect, BrLevelsInUseComponent } from 'br-component-library';

import { ControlConfigComponent } from './control-config.component';
import * as actions from '../../state/actions';
import * as fromRoot from '../../state';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { LabSetupHeaderComponent } from '../../components/lab-setup-header/lab-setup-header.component';
import { SpcRulesComponent } from '../../components/spc-rules/spc-rules.component';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { ConfigService } from '../../../../core/config/config.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { LabProduct, LabTest } from '../../../../contracts/models/lab-setup';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ControlConfig, ControlSettingsValues, Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { ProductLot } from '../../../../contracts/models/lab-setup/product-lots-list-point.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';

xdescribe('ControlConfigComponent', () => {
  let component: ControlConfigComponent;
  let fixture: ComponentFixture<ControlConfigComponent>;
  let store: MockStore<any>;
  let SpyonStore: any;
  const mockState = {};
  const autofixture = new Autofixture();
  const settings = autofixture.create(new Settings());
  const testData = autofixture.create(new LabTest());
  const breadcrumbListData = autofixture.create(new TreePill());
  const productLotList = autofixture.create(new ProductLot());
  const manufacturerProduct = {
    id: '1',
    name: 'Diabetes',
    manufacturerId: 1,
    manufacturerName: 'Bio-Rad',
  };

  const mockCodelistApiService = {
    getProductMasterLotsByProductId: () => {
      return of(productLotList);
    }
  };

  const mockRedux = {
    dispatch(action) { },
    configureStore() { },
    select() {
      return observableFrom('test');
    },
  };

  const mockConfigService = {
    getConfig: () => {
      return observableFrom([]);
    }
  };

  const selectedNode = {
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
      'nodeType': 8,
      'displayName': 'edbdad7d-e5da-4a00-9f68-1aafd9c7a4a1',
      'children': null
    },
    'hasOwnAccountSettings': false,
    'id': 'e8bee5e0-fec3-48fe-9676-95986997fcba',
    'parentNodeId': '473b7eb6-60a0-4cbe-ae4a-ecba63d0fce0',
    'parentNode': null,
    'nodeType': 5,
    'children': [testData]
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

  const labControlsFormValue = {
    'labConfigFormValues': [
      {
        'nodeType': 5,
        'manufacturerId': '2',
        'productId': '1',
        'productMasterLotId': '1086',
        'customName': '',
        'id': '',
        'displayName': 'abc',
        'parentNodeId': '473b7eb6-60a0-4cbe-ae4a-ecba63d0fce0'
      }
    ]
  };

  const mockLabProduct = {
    'nodeType': 5,
    'displayName': 'abc',
    'id': '',
    'manufacturerId': '2',
    'productId': '1',
    'productMasterLotId': '1086',
    'productCustomName': '',
    'parentNodeId': '473b7eb6-60a0-4cbe-ae4a-ecba63d0fce0',
    'children': null
  };

  const mockNewLocation = {
    'id': '669b42c2-355d-4e88-af85-e34d74d90920',
    'parentNodeId': '99415057-1026-4c22-b687-5198ec44a5ab',
    'parentNode': {
      'displayName': 'Dev2 Internal Account1',
      'id': '99415057-1026-4c22-b687-5198ec44a5ab',
      'isUnavailable': false,
      'labName': 'Dev2 Internal Account1',
      'nodeType': 1,
      'parentNodeId': 'bf1d67a6-a43a-46ac-bafc-992b8305f421'
    },
    'nodeType': 2,
    'displayName': 'Amazing Lab Center',
    'children': null,
    'labLocationName': 'test after',
    'locationTimeZone': '',
    'locationOffset': '',
    'locationDayLightSaving': '',
    'labLocationContactId': '9753dfcb-448c-4faa-b5f0-e5a40f47033a',
    'labLocationAddressId': '57c048df-7904-4d9d-aed1-77e64ab760fb',
    'labLocationContact': {
      'entityType': 0,
      'firstName': 'rock',
      'lastName': 'doe',
      'name': 'rockdoe',
      'email': 'rock@gms.com',
      'id': ''
    },
    // 'contactRoles': [BioRadUserRoles.BioRadManager],
    'labLocationAddress': {
      'entityType': 0,
      'nickName': '123 Main St.',
      'streetAddress1': 'demoi',
      'streetAddress2': 'Ste. ABC',
      'streetAddress': 'demoi',
      'city': 'ee',
      'state': 'eee',
      'country': 'AX',
      'zipCode': '234234',
      'id': ''
    },
    'shipTo': '1234',
    'soldTo': '123456',
    'orderNumber': 'U100503',
    'unityNextTier': 1,
    'unityNextInstalledProduct': null,
    'connectivityTier': 0,
    'connectivityInstalledProduct': null,
    'lotViewerLicense': 1,
    'lotViewerInstalledProduct': null,
    'addOns': 1,
    'addOnsFlags': {
      'valueAssignment': true,
      'allowBR': false,
      'allowNonBR': false,
      'allowSiemensHematology': false,
      'allowSysmexHemostasis': false
    },
    // 'crossOverStudy': 1,
    'licenseNumberUsers': 12223,
    // 'licenseAssignDate': new Date(assignDate),
    // 'licenseExpirationDate': new Date(expiryDate),
    'hasChildren': true,
    'locationCount': 3,
    'accountName': 'Amazing Lab Center',
    'accountNumber': 'U100503',
    'groupName': 'Another Group',
    'formattedAccountNumber': 'U100503',
    'transformers': null,
    // 'migrationStatus': MigrationStates.Completed,
    'previousContactUserId': null,
    // 'labLanguagePreference': 'en-us'
  };

  const controlEmitter: ControlSettingsValues = { labConfigFormValues: labControlsFormValue.labConfigFormValues, settings: settings };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: () =>  true,
  };

  @Component({ selector: 'unext-control-entry', template: '' })
  class ControlEntryComponent { }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ControlConfigComponent,
        ControlEntryComponent,
        BrLevelsInUseComponent,
        LabSetupHeaderComponent,
        SpcRulesComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatRadioModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        RouterTestingModule.withRoutes([]),
        BrSelect,
        StoreModule.forRoot(fromRoot.reducers),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),

      ],
      providers: [
        DatePipe,
        DateTimeHelper,
        LocaleConverter,
        NavigationService,
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        { provide: NgRedux, useValue: mockRedux },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        PortalApiService,
        AppLoggerService,
        EntityTypeService,
        SpcRulesService,
        SpinnerService,
        TranslateService,
        HttpClient,
        provideMockStore(mockState)
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));
  const navigationState = {
    selectedNode: selectedNodeInstrument,
    selectedLeaf: selectedNode,
    currentBranch: [],
    error: null,
    isSideNavExpanded: false,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: false,
    navigation: false
  };

  const StateArray = {
    navigation: navigationState
  };

  beforeEach(() => {
    store.setState(StateArray);
    fixture = TestBed.createComponent(ControlConfigComponent);
    component = fixture.componentInstance;
    component.navigationCurrentlySelectedNode$ = of(selectedNode);
    component.currentLabLocation$ = of(mockNewLocation);
    component.loadHeaderTitleData();
    component.labConfigControlList$ = of([manufacturerProduct]);
    fixture.detectChanges();
    component.settingsSpcRulesetControl$ = of(settings);
    component.loadSpcRuleSettings();
  });

  it('should create when Instrument as Selected Node', () => {
    component.title = 'mocktitle';
    component.navigationCurrentlySelectedLeaf$ = of(selectedNode);
    component.navigationCurrentlySelectedNode$ = of(selectedNodeInstrument);
    component.navigationCurrentBranchState$ = of([breadcrumbListData]);
    component.settingsSpcRulesetControl$ = of(settings);
    component.loadHeaderTitleData();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create when Instrument as Selected Leaf', () => {
    component.navigationCurrentlySelectedLeaf$ = of(selectedNodeInstrument);
    component.settingsSpcRulesetControl$ = of(settings);
    component.loadHeaderTitleData();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('verify that control entry form is displayed ', () => {
    component.labConfigurationControlsList = [manufacturerProduct];
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('unext-control-entry')).not.toBe(null);
  });

  it('Should Delete control called with id', () => {
    SpyonStore = spyOn(store, 'dispatch');
    const controlId = selectedNode;
    component.onDeleteControl(controlId);
    component.onResetForm();
    fixture.detectChanges();
    expect(SpyonStore).toHaveBeenCalledTimes(1);
    expect(SpyonStore).toHaveBeenCalledWith(
      actions.LabConfigControlActions.deleteControl({ control: controlId })
    );
  });

  it('Should Lab Control Configuration save', () => {
    component.showSettings = true;
    const nodeType = EntityType.LabProduct;
    const labControlArray: LabProduct[] = [];
    const labControlMock = new LabProduct();
    const typeOfOperation = controlEmitter.typeOfOperation;
    labControlMock.displayName = mockLabProduct.displayName;
    labControlMock.id = mockLabProduct.id;
    labControlMock.manufacturerId = mockLabProduct.manufacturerId;
    labControlMock.productId = mockLabProduct.productId;
    labControlMock.productMasterLotId = mockLabProduct.productMasterLotId;
    labControlMock.productCustomName = mockLabProduct.productCustomName;
    labControlMock.parentNodeId = mockLabProduct.parentNodeId;

    labControlArray.push(labControlMock);
    const controlConfigEmitter: ControlConfig = { labControls: labControlArray, settings: settings, nodeType ,typeOfOperation:typeOfOperation};
    SpyonStore = spyOn(store, 'dispatch');
    component.labConfigControlList$ = of([manufacturerProduct]);
    component.saveConfigControl(controlEmitter);
    fixture.detectChanges();
    expect(SpyonStore).toHaveBeenCalledTimes(1);
    expect(SpyonStore).toHaveBeenCalledWith(
      actions.LabConfigControlActions.saveControl({ controlConfigEmitter })
    );
  });

  it('load product lots list on Lots select', () => {
    spyOn(component, 'onLoadLots').and.callThrough();
    component.onLoadLots('abc', 1);
    fixture.detectChanges();
    expect(component.onLoadLots).toHaveBeenCalledWith('abc', 1);
  });
});

