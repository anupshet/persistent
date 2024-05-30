// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { MaterialModule, BrSelect } from 'br-component-library';
import { DuplicateNodeEntryComponent } from './duplicate-node-entry.component';
import { IconService } from '../../icons/icons.service';
import { DuplicateNodeEntry } from '../../../contracts/models/shared/duplicate-node-entry.model';
import { LabProduct } from '../../../contracts/models/lab-setup';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { OperationType } from '../../../contracts/enums/lab-setup/operation-type.enum';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../app.module';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { CodelistApiService } from '../../api/codelistApi.service';

describe('DuplicateNodeEntryComponent', () => {
  let component: DuplicateNodeEntryComponent;
  let fixture: ComponentFixture<DuplicateNodeEntryComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const mockDataTimeHelper = jasmine.createSpyObj(['getSomeDaysAheadDate']);

  const formValues = {
    'duplicateNodeArray': [
      {
        'lotNumber': {
          'id': 74,
          'productId': 2,
          'productName': 'Assayed Chemistry',
          'lotNumber': '26450',
          'expirationDate': '2021-05-31T00:00:00',
          'lotWithExpirationDate': '26450 exp. May 31 2021'
        },
        'customName': ''
      }
    ]
  };

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    comparePriorAndCurrentValues: () => { }
  };

  const mockSourceNode: LabProduct = {
    'displayName': 'Assayed Chemistry',
    'productId': '2',
    'productMasterLotId': '69',
    'productCustomName': '',
    'manufacturerId': '2',
    'productInfo': {
      'id': 2,
      'name': 'Assayed Chemistry',
      'manufacturerId': '2',
      'manufacturerName': 'Bio-Rad',
      'matrixId': 3,
      'matrixName': 'Serum'
    },
    'lotInfo': {
      'id': 69,
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '23000',
      'expirationDate': new Date('2020-12-31T00:00:00')
    },
    'productLotLevels': [
      {
        'id': '105',
        'productMasterLotId': '69',
        'productId': '2',
        'productMasterLotNumber': '23000',
        'lotNumber': '23001',
        'level': 1,
        'levelDescription': '1'
      },
      {
        'id': '106',
        'productMasterLotId': '69',
        'productId': '2',
        'productMasterLotNumber': '23000',
        'lotNumber': '23002',
        'level': 2,
        'levelDescription': '2'
      },
      {
        'id': '107',
        'productMasterLotId': '69',
        'productId': '2',
        'productMasterLotNumber': '23000',
        'lotNumber': '23003',
        'level': 3,
        'levelDescription': '3'
      },
      {
        'id': '108',
        'productMasterLotId': '69',
        'productId': '2',
        'productMasterLotNumber': '23000',
        'lotNumber': '23004',
        'level': 4,
        'levelDescription': '4'
      },
      {
        'id': '109',
        'productMasterLotId': '69',
        'productId': '2',
        'productMasterLotNumber': '23000',
        'lotNumber': '23005',
        'level': 5,
        'levelDescription': '5'
      },
      {
        'id': '110',
        'productMasterLotId': '69',
        'productId': '2',
        'productMasterLotNumber': '23000',
        'lotNumber': '23006',
        'level': 6,
        'levelDescription': '6'
      }
    ],
    'levelSettings': {
      'levelEntityId': null,
      'levelEntityName': 'LevelSetting',
      'parentLevelEntityId': 'b2a5668b-b4e7-4426-843b-b1c3e1f7bb58',
      'parentLevelEntityName': 'LabProduct',
      'minNumberOfPoints': 0,
      'runLength': 0,
      'dataType': 1,
      'targets': null,
      'rules': null,
      'levels': [
        {
          'levelInUse': false,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        },
        {
          'levelInUse': false,
          'decimalPlace': 2
        }
      ],
      'id': '1cbaf298-9653-1034-f9cc-ed2dfe945eaf',
      'parentNodeId': 'b2a5668b-b4e7-4426-843b-b1c3e1f7bb58',
      'parentNode': null,
      'nodeType': 8,
      'displayName': '1cbaf298-9653-1034-f9cc-ed2dfe945eaf',
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
      'id': '20918760-455a-4e7f-ad1f-407fb2cb98f5',
      'parentNodeId': '5446ac3b-d62d-4f14-980e-a2b3a95ae13c',
      'parentNode': null,
      'nodeType': 9,
      'children': null
    },
    'hasOwnAccountSettings': false,
    'id': 'b2a5668b-b4e7-4426-843b-b1c3e1f7bb58',
    'parentNodeId': 'de44b190-e8f2-4b3b-8900-9a50da77f970',
    'parentNode': null,
    'nodeType': 5,
    'children': [
      {
        'displayName': 'Acetaminophen',
        'testSpecId': '1806',
        'correlatedTestSpecId': '5FACF8C3FF8E481EA4F1FF2F76F477F7',
        'testId': '1801',
        'labUnitId': '3',
        'testSpecInfo': {
          'id': 1806,
          'testId': 1801,
          'analyteStorageUnitId': 667,
          'analyteId': 4,
          'analyteName': 'Acetaminophen',
          'methodId': 112,
          'methodName': 'Enzymatic, colorimetric',
          'instrumentId': 1254,
          'instrumentName': 'ARCHITECT c16000',
          'reagentId': 1105,
          'reagentManufacturerId': null,
          'reagentManufacturerName': 'Sekisui',
          'reagentName': 'Sekisui Diagnostics SEKURE Acetaminophen L3K',
          'reagentLotId': 416,
          'reagentLotNumber': 'Unspecified ***',
          'reagentLot': {
            'id': 416,
            'reagentId': 1105,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': new Date('2068-11-16T17:50:45.727'),
            'reagentCategory': 1
          },
          'storageUnitId': 3,
          'storageUnitName': 'µg/mL',
          'calibratorId': 257,
          'calibratorManufacturerId': null,
          'calibratorManufacturerName': 'Sekisui',
          'calibratorName': 'Sekisui Diagnostics SEKURE Acetaminophen L3K Cal',
          'calibratorLotId': 258,
          'calibratorLotNumber': 'Unspecified ***',
          'calibratorLot': {
            'id': 258,
            'calibratorId': 257,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': new Date('2068-11-16T17:50:45.913')
          }
        },
        'levelSettings': {
          'levelEntityId': null,
          'levelEntityName': 'LevelSetting',
          'parentLevelEntityId': '2ebaf298-964d-a743-734b-46c2014e2f7a',
          'parentLevelEntityName': 'LabTest',
          'minNumberOfPoints': 0,
          'runLength': 0,
          'dataType': 1,
          'targets': null,
          'rules': null,
          'levels': [
            {
              'levelInUse': true,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            },
            {
              'levelInUse': false,
              'decimalPlace': 2
            }
          ],
          'id': '2ebaf298-9659-1b23-d085-c5f085628205',
          'parentNodeId': '2ebaf298-964d-a743-734b-46c2014e2f7a',
          'parentNode': null,
          'nodeType': 8,
          'displayName': '2ebaf298-9659-1b23-d085-c5f085628205',
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
          'id': '20918760-455a-4e7f-ad1f-407fb2cb98f5',
          'parentNodeId': '5446ac3b-d62d-4f14-980e-a2b3a95ae13c',
          'parentNode': null,
          'nodeType': 9,
          'children': null
        },
        'hasOwnAccountSettings': false,
        'mappedTestSpecs': null,
        'id': '2ebaf298-964d-a743-734b-46c2014e2f7a',
        'parentNodeId': 'b2a5668b-b4e7-4426-843b-b1c3e1f7bb58',
        'parentNode': null,
        'nodeType': 6,
        'children': [

        ],
        'isUnavailable': false,
        'unavailableReasonCode': 'null'
      }
    ],
    'isUnavailable': false,
    'unavailableReasonCode': ''
  };


  const duplicateNodeInfo: DuplicateNodeEntry = {
    sourceNode: mockSourceNode,
    userId: null,
    parentDisplayName: null,
    availableLots: [{
      id: 1,
      lotNumber: '123',
      expirationDate: new Date(),
      lotWithExpirationDate: null
    }
    ]
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockInstrumentInfoList = [
    {
      customName: 'abc',
      instrumentId: '272a3e97-7b45-4eb3-bc18-e662624b93c0',
      departmentName: 'Chemistry',
      instrumentName: 'ACL 100'
    },
    {
      instrumentName: 'ACL 100',
      instrumentId: 'e1ee3b2d-bf9b-48c9-ad1b-1f4b7a34cb3d',
      departmentName: 'Dept1',
      customName: ''
    },
    {
      instrumentName: 'AIA-360',
      instrumentId: '558e473e-cfb3-46cc-a069-2507bd3c31e6',
      departmentName: 'AJ',
      customName: ''
    }
  ];

  const mockInstrumentInfoListMoreThanFive = [
    {
      customName: 'abc',
      instrumentId: '272a3e97-7b45-4eb3-bc18-e662624b93c0',
      departmentName: 'Chemistry',
      instrumentName: 'ACL 100'
    },
    {
      instrumentName: 'ACL 100',
      instrumentId: 'e1ee3b2d-bf9b-48c9-ad1b-1f4b7a34cb3d',
      departmentName: 'Dept1',
      customName: ''
    },
    {
      instrumentName: 'AIA-360',
      instrumentId: '558e473e-cfb3-46cc-a069-2507bd3c31e6',
      departmentName: 'AJ',
      customName: ''
    },
    {
      customName: 'abc',
      instrumentId: '272a3e97-7b45-4eb3-bc18-e662624b93c0',
      departmentName: 'Chemistry',
      instrumentName: 'ACL 100'
    },
    {
      instrumentName: 'ACL 100',
      instrumentId: 'e1ee3b2d-bf9b-48c9-ad1b-1f4b7a34cb3d',
      departmentName: 'Dept1',
      customName: ''
    },
    {
      instrumentName: 'AIA-360',
      instrumentId: '558e473e-cfb3-46cc-a069-2507bd3c31e6',
      departmentName: 'AJ2',
      customName: ''
    }
  ];

  const mockNBrLotData = [
    {
      product: {
        id: 1,
        name: 'test control 1',
        manufacturerId: 'm1',
        manufacturerName: 'test manufacturer 1',
        matrixId: 1,
        matrixName: 'Test matrix'
      },
      lots: [
        {
          masterLotInfo: {
            id: 1,
            productId: 1,
            productName: 'test product 1',
            lotNumber: '12345',
            expirationDate: new Date(),
            lotWithExpirationDate: ''
          },
          levelInfo: [
            {
              id: '1',
              productMasterLotId: '1',
              productId: '1',
              productMasterLotNumber: 'test 12345',
              lotNumber: 'test 12345',
              level: 1,
              levelDescription: 'Test level description 1'
            },
            {
              id: '2',
              productMasterLotId: '2',
              productId: '2',
              productMasterLotNumber: 'test 123456',
              lotNumber: 'test 123456',
              level: 2,
              levelDescription: 'Test level description 2'
            },
            {
              id: '3',
              productMasterLotId: '2',
              productId: '3',
              productMasterLotNumber: 'test 1234',
              lotNumber: 'test 1234',
              level: 3,
              levelDescription: 'Test level description 3'
            },
          ]
        }],
      accountId: '0edb0653-f262-48ac-a886-cab545a5db1c',
      nodeType: 1,
      levelInfo: [1, 2, 3]
    }
  ];

  const storeStub = {
    security: null,
    auth: '',
    userPreference: null,
    router: null,
    location: '',
    uiConfigState: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrSelect,
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
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DuplicateNodeEntryComponent],
      providers: [
        { provide: IconService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService,
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        CodelistApiService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateNodeEntryComponent);
    component = fixture.componentInstance;
    component.duplicateNodeInfo = duplicateNodeInfo;
    component.emitValue = false;
    component.isNonBrLot = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the selected option as lotNumber', () => {
    const selectedLot = duplicateNodeInfo.availableLots[0];
    component.onLotChange(selectedLot);
    expect(component.duplicateControlGroupsGetter.controls[0].get('lotNumber').value).toEqual(selectedLot);
  });

  it('should show instrument checkboxes', () => {
    component.duplicateControlGroupsGetter.controls[0].get('lotNumber').setValue(duplicateNodeInfo.availableLots[0]);
    component.duplicateControlGroupsGetter.controls[0].get('duplicateLotInstruments').setValue(1);
    fixture.detectChanges();
    const duplicateInstRadio = fixture.debugElement.query(By.css('.spec_duplicateInstRadio')).nativeElement;
    const spy = spyOn(component, 'onCurrentMultipleInstrumentChange');
    duplicateInstRadio.value = OperationType.Duplicate;
    duplicateInstRadio.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    component.instrumentList = mockInstrumentInfoList;
    fixture.detectChanges();
    const instrumentCheckboxes = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_instrumentCheckbox');
    expect(instrumentCheckboxes).toBeTruthy();
  });

  it('should show All instruments below checkbox if there are 5 or more instruments in the list', () => {
    component.duplicateControlGroupsGetter.controls[0].get('lotNumber').setValue(duplicateNodeInfo.availableLots[0]);
    component.instrumentList = mockInstrumentInfoListMoreThanFive;
    fixture.detectChanges();
    const allInstrumentsCheckbox = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_allInstrumentsCheckbox');
    const instrumentCheckboxes = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_instrumentCheckbox');
    expect(instrumentCheckboxes).toBeTruthy();
    expect(allInstrumentsCheckbox).toBeTruthy();
  });

  it('should select all Instruments when clicked on All instruments below checkbox', () => {
    component.duplicateControlGroupsGetter.controls[0].get('lotNumber').setValue(duplicateNodeInfo.availableLots[0]);
    component.instrumentList = mockInstrumentInfoListMoreThanFive;
    fixture.detectChanges();
    const allInstrumentsCheckbox = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_allInstrumentsCheckbox');
    const instrumentCheckboxes = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_instrumentCheckbox');
    const spy = spyOn(component, 'selectAllInstruments').and.callThrough();
    allInstrumentsCheckbox.dispatchEvent(new Event('change'));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(instrumentCheckboxes).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should submit data on click of submit button', () => {
    spyOn(component, 'hasPermissionToAccess')
      .withArgs([component.permissions.StartNewLotViewOnly]).and.returnValue(false)
      .withArgs([component.permissions.StartNewLot]).and.returnValue(true)
      .withArgs([component.permissions.ControlAdd]).and.returnValue(true);
    const submitButtonElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_submit');
    const spy = spyOn(component, 'duplicateNode').and.callThrough();
    component.duplicateControlGroupsGetter.controls[0].get('lotNumber').setValue(duplicateNodeInfo.availableLots[0]);
    fixture.detectChanges();
    submitButtonElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should show Retain fixed CV where set checkbox', () => {
    component.duplicateControlGroupsGetter.controls[0].get('lotNumber').setValue(duplicateNodeInfo.availableLots[0]);
    component.instrumentList = mockInstrumentInfoListMoreThanFive;
    fixture.detectChanges();
    const reatinFixedCVCheckbox = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_retainFixedCvCheckbox');
    expect(reatinFixedCVCheckbox).toBeTruthy();
  });

  it('should Retain fixed CV where set checkbox set to false by default', () => {
    component.duplicateControlGroupsGetter.controls[0].get('lotNumber').setValue(duplicateNodeInfo.availableLots[0]);
    component.instrumentList = mockInstrumentInfoListMoreThanFive;
    fixture.detectChanges();
    const reatinFixedCVCheckbox = fixture.debugElement.query(By.css('.spec_retainFixedCvCheckbox')).nativeElement;
    expect(reatinFixedCVCheckbox.isChecked).toBeFalsy();
  });

  it('should emit list request for Duplicate operation type select ', () => {
    const spy = spyOn(component.instrumentListRequest, 'emit');
    component.onCurrentMultipleInstrumentChange(OperationType.Duplicate);
    expect(spy).toHaveBeenCalled();
  });
});

