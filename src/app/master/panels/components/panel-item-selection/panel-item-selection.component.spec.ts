// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, fakeAsync, flush, TestBed, tick, async   } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MaterialModule } from 'br-component-library';

import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { PanelItemSelectionComponent } from './panel-item-selection.component';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { PanelsApiService } from '../../services/panelsApi.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('PanelItemSelectionComponent', () => {
  let component: PanelItemSelectionComponent;
  let fixture: ComponentFixture<PanelItemSelectionComponent>;
  const initialState = {};
  let store;

  const mockPanelList = {
    'displayName': 'checkifreportgenefae',
    'departmentName': 'checkifreportgenefae',
    'departmentManagerId': 'ee354112-5b3d-4fef-852f-7adb315551f1',
    'departmentManager': {
        'entityType': 0,
        'searchAttribute': '',
        'firstName': '',
        'middleName': '',
        'lastName': '',
        'name': '',
        'email': '',
        'phone': '',
        'id': ''
    },
    'id': '74749ac7-ce60-4e44-b4d6-cf85a7fc1a61',
    'parentNodeId': '2fd875ce-851d-49de-b662-6b46d718b8d1',
    'nodeType': 3,
    'isArchived': false,
    'sortOrder': 0,
    'isUnavailable': false,
    'unavailableReasonCode': '',
    'children': [
        {
            'displayName': 'Access 2',
            'instrumentId': '2555',
            'instrumentCustomName': '',
            'instrumentSerial': '',
            'instrumentInfo': {
                'id': 2555,
                'name': 'Access 2',
                'manufacturerId': 14,
                'manufacturerName': 'Beckman Coulter'
            },
            'id': '0c1e1cba-ade6-4541-9f2b-689cc0ea72b4',
            'parentNodeId': '74749ac7-ce60-4e44-b4d6-cf85a7fc1a61',
            'nodeType': 4,
            'isArchived': false,
            'sortOrder': 0,
            'isUnavailable': false,
            'unavailableReasonCode': '',
            'children': [
                {
                    'id': '5cab0851-55c6-4e1c-8037-d47ca20c89b8',
                    'parentNodeId': '0c1e1cba-ade6-4541-9f2b-689cc0ea72b4',
                    'nodeType': 5,
                    'displayName': 'Cardiac Markers Plus LT',
                    'productId': '168',
                    'productMasterLotId': '1131',
                    'productCustomName': '',
                    'isArchived': false,
                    'sortOrder': 0,
                    'isUnavailable': false,
                    'unavailableReasonCode': '',
                    'productInfo': {
                        'id': 168,
                        'name': 'Cardiac Markers Plus LT',
                        'manufacturerId': 2,
                        'manufacturerName': 'Bio-Rad',
                        'matrixId': 3,
                        'matrixName': 'Serum'
                    },
                    'lotInfo': {
                        'id': 1131,
                        'productId': 168,
                        'productName': 'Cardiac Markers Plus LT',
                        'lotNumber': '67630',
                        'expirationDate': '2033-01-31T00:00:00Z'
                    },
                    'productLotLevels': [
                        {
                            'id': '2391',
                            'productMasterLotId': '1131',
                            'productId': '168',
                            'productMasterLotNumber': '67630',
                            'lotNumber': '67631',
                            'level': 1,
                            'levelDescription': 'Level 1'
                        },
                        {
                            'id': '2392',
                            'productMasterLotId': '1131',
                            'productId': '168',
                            'productMasterLotNumber': '67630',
                            'lotNumber': '67632',
                            'level': 2,
                            'levelDescription': 'Level 2'
                        },
                        {
                            'id': '2393',
                            'productMasterLotId': '1131',
                            'productId': '168',
                            'productMasterLotNumber': '67630',
                            'lotNumber': '67633',
                            'level': 3,
                            'levelDescription': 'Level 3'
                        },
                        {
                            'id': '2394',
                            'productMasterLotId': '1131',
                            'productId': '168',
                            'productMasterLotNumber': '67630',
                            'lotNumber': '67634',
                            'level': 4,
                            'levelDescription': 'Level 4'
                        },
                        {
                            'id': '2395',
                            'productMasterLotId': '1131',
                            'productId': '168',
                            'productMasterLotNumber': '67630',
                            'lotNumber': '67635',
                            'level': 5,
                            'levelDescription': 'Level 5'
                        },
                        {
                            'id': '2396',
                            'productMasterLotId': '1131',
                            'productId': '168',
                            'productMasterLotNumber': '67630',
                            'lotNumber': '67636',
                            'level': 6,
                            'levelDescription': 'Level 6'
                        }
                    ],
                    'children': [
                        {
                            'id': 'd6e4d387-aac3-444d-bf52-ed07d25d39dc',
                            'displayName': 'Myoglobin',
                            'testId': '318',
                            'testSpecId': '319',
                            'labUnitId': '63',
                            'correlatedTestSpecId': '',
                            'testSpecInfo': {
                                'id': 319,
                                'testId': 318,
                                'analyteStorageUnitId': 386,
                                'analyteId': 447,
                                'analyteName': 'Myoglobin',
                                'methodId': 63,
                                'methodName': 'Chemiluminescence',
                                'instrumentId': 2555,
                                'instrumentName': 'Access 2',
                                'reagentId': 911,
                                'reagentManufacturerId': '14',
                                'reagentManufacturerName': 'Beckman Coulter',
                                'reagentName': 'Myoglobin REF 973243',
                                'reagentLotId': 221,
                                'reagentLotNumber': 'Unspecified ***',
                                'reagentLot': {
                                    'id': 221,
                                    'reagentId': 911,
                                    'lotNumber': 'Unspecified ***',
                                    'shelfExpirationDate': '2068-11-05T17:40:49.09Z'
                                },
                                'storageUnitId': 2,
                                'storageUnitName': 'ng/mL',
                                'calibratorId': 135,
                                'calibratorManufacturerId': '14',
                                'calibratorManufacturerName': 'Beckman Coulter',
                                'calibratorName': 'Myoglobin Cal REF 973244',
                                'calibratorLotId': 135,
                                'calibratorLotNumber': 'Unspecified ***',
                                'calibratorLot': {
                                    'id': 135,
                                    'calibratorId': 135,
                                    'lotNumber': 'Unspecified ***',
                                    'shelfExpirationDate': '2068-11-05T17:40:49.09Z'
                                }
                            },
                            'parentNodeId': '5cab0851-55c6-4e1c-8037-d47ca20c89b8',
                            'nodeType': 6,
                            'isArchived': false,
                            'sortOrder': 0,
                            'isUnavailable': false,
                            'unavailableReasonCode': '',
                            'allTestSpecIds': [
                                319
                            ],
                            'levelSettings': {
                                'levelEntityName': 'LevelSetting',
                                'parentLevelEntityId': 'd6e4d387-aac3-444d-bf52-ed07d25d39dc',
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
                                        'levelInUse': true,
                                        'decimalPlace': 2
                                    },
                                    {
                                        'levelInUse': true,
                                        'decimalPlace': 2
                                    },
                                    {
                                        'levelInUse': true,
                                        'decimalPlace': 2
                                    },
                                    {
                                        'levelInUse': true,
                                        'decimalPlace': 2
                                    },
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
                                    }
                                ],
                                'id': 'ffedaf63-1dd5-4ae9-b6cb-61b88f4a08bb',
                                'parentNodeId': 'd6e4d387-aac3-444d-bf52-ed07d25d39dc',
                                'nodeType': 8,
                                'displayName': 'ffedaf63-1dd5-4ae9-b6cb-61b88f4a08bb',
                                'isUnavailable': false,
                                'unavailableReasonCode': ''
                            },
                            'isLotExpired': false
                        }
                    ],
                    'levelSettings': {
                        'levelEntityName': 'LevelSetting',
                        'parentLevelEntityId': '5cab0851-55c6-4e1c-8037-d47ca20c89b8',
                        'parentLevelEntityName': 'LabProduct',
                        'minNumberOfPoints': 0,
                        'runLength': 0,
                        'dataType': 0,
                        'targets': null,
                        'rules': null,
                        'levels': [
                            {
                                'levelInUse': true,
                                'decimalPlace': 2
                            },
                            {
                                'levelInUse': true,
                                'decimalPlace': 2
                            },
                            {
                                'levelInUse': true,
                                'decimalPlace': 2
                            },
                            {
                                'levelInUse': true,
                                'decimalPlace': 2
                            },
                            {
                                'levelInUse': true,
                                'decimalPlace': 2
                            },
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
                            }
                        ],
                        'id': '82036a1f-028c-4810-9bfa-03b633eaf306',
                        'parentNodeId': '5cab0851-55c6-4e1c-8037-d47ca20c89b8',
                        'nodeType': 8,
                        'displayName': '82036a1f-028c-4810-9bfa-03b633eaf306',
                        'isUnavailable': false,
                        'unavailableReasonCode': ''
                    }
                }
            ]
        },
        {
            'displayName': 'shraddha',
            'instrumentId': '1935',
            'instrumentCustomName': 'shraddha',
            'instrumentSerial': '',
            'instrumentInfo': {
                'id': 1935,
                'name': 'Stago STA',
                'manufacturerId': 29,
                'manufacturerName': 'Diagnostica Stago'
            },
            'id': 'ffbc0e09-678b-4012-8f8e-0711479b9de5',
            'parentNodeId': '74749ac7-ce60-4e44-b4d6-cf85a7fc1a61',
            'nodeType': 4,
            'isArchived': false,
            'sortOrder': 0,
            'isUnavailable': false,
            'unavailableReasonCode': '',
            'children': null
        }
    ],
    priorPanelItemListData: () => {}
};
  const mockCurrentBranch = [
    {
      displayName: 'Ajs lab',
      labLocationName: 'Ajs lab',
      locationTimeZone: 'America/Los_Angeles',
      locationOffset: '-08:00:00',
      locationDayLightSaving: '01:00:00',
      labLocationContactId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
      labLocationAddressId: '6239b09a-ed9b-43ec-8b41-03fa44a31a9f',
      labLocationContact: null,
      labLocationAddress: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      id: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
      parentNodeId: '6414a6bb-be30-40a5-82d5-48088dd3064c',
      parentNode: null,
      nodeType: 2,
      children: [
        {
          displayName: 'NewAccount1',
          departmentName: 'NewAccount1',
          departmentManagerId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
          departmentManager: null,
          accountSettings: null,
          hasOwnAccountSettings: false,
          isArchived: false,
          id: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
          parentNodeId: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
          parentNode: null,
          nodeType: 3,
          children: [
            {
              displayName: 'BeckManCus',
              instrumentId: '1540',
              instrumentCustomName: 'BeckManCus',
              instrumentSerial: '123Beck',
              instrumentInfo: {
                id: 1540,
                name: 'AU480',
                manufacturerId: 14,
                manufacturerName: 'Beckman Coulter'
              },
              accountSettings: null,
              hasOwnAccountSettings: false,
              isArchived: false,
              id: '0b01ae03-4886-4ca8-8d52-7a87bdb4885e',
              parentNodeId: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
              parentNode: null,
              nodeType: 4,
              children: [],
              isUnavailable: false,
              unavailableReasonCode: ''
            }
          ],
          isUnavailable: false,
          unavailableReasonCode: ''
        }
      ],
      isUnavailable: false,
      unavailableReasonCode: ''
    }
  ];
  const mockDepartmentWithUptoGrandChildren = {
    displayName: 'NewAccount1',
    departmentName: 'NewAccount1',
    departmentManagerId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
    departmentManager: null,
    accountSettings: null,
    hasOwnAccountSettings: false,
    isArchived: false,
    id: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
    parentNodeId: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
    parentNode: null,
    nodeType: 3,
    children: [
      {
        'displayName': 'D-10',
        'instrumentId': '2749',
        'instrumentCustomName': '',
        'instrumentSerial': '',
        'instrumentInfo': {
          'id': 2749,
          'name': 'D-10',
          'manufacturerId': 2,
          'manufacturerName': 'Bio-Rad'
        },
        'accountSettings': null,
        'hasOwnAccountSettings': false,
        'isArchived': false,
        'id': 'dd01541f-fbbc-4740-915b-46917eb0fceb',
        'parentNodeId': '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
        'parentNode': null,
        'nodeType': 4,
        'children': [
          {
            'displayName': 'Diabetes (Liquichek Vista)',
            'productId': '405',
            'productMasterLotId': '217',
            'productCustomName': '',
            'productInfo': {
              'id': 405,
              'name': 'Diabetes (Liquichek Vista)',
              'manufacturerId': 2,
              'manufacturerName': 'Bio-Rad',
              'matrixId': 6,
              'matrixName': 'Whole Blood'
            },
            'lotInfo': {
              'id': 217,
              'productId': 405,
              'productName': 'Diabetes (Liquichek Vista)',
              'lotNumber': '55710V',
              'expirationDate': '2068-11-30T00:00:00'
            },
            'productLotLevels': null,
            'levelSettings': null,
            'accountSettings': null,
            'hasOwnAccountSettings': false,
            'isArchived': false,
            'id': '4fcc18a9-ea28-4df0-b938-3f694c788438',
            'parentNodeId': 'dd01541f-fbbc-4740-915b-46917eb0fceb',
            'parentNode': null,
            'nodeType': 5,
            'children': [
              {
                'displayName': ' Hemoglobin A1c',
                'testSpecId': '5',
                'correlatedTestSpecId': 'F34508AEE1ED4219AD20DCC2D001F2F7',
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
                'levelSettings': null,
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'id': '36610b51-fbd8-487e-a05f-3bb312ac35bb',
                'parentNodeId': '4fcc18a9-ea28-4df0-b938-3f694c788438',
                'parentNode': null,
                'nodeType': 6,
                'children': [],
                'isUnavailable': false,
                'unavailableReasonCode': ''
              }
            ],
            'isUnavailable': false,
            'unavailableReasonCode': ''
          },
          {
            'displayName': 'Test control 2',
            'productId': '405',
            'productMasterLotId': '217',
            'productCustomName': '',
            'productInfo': {
              'id': 405,
              'name': 'Test control 2',
              'manufacturerId': 2,
              'manufacturerName': 'Bio-Rad',
              'matrixId': 6,
              'matrixName': 'Whole Blood'
            },
            'lotInfo': {
              'id': 217,
              'productId': 405,
              'productName': 'Test control 2',
              'lotNumber': '55720V',
              'expirationDate': '2021-01-30T00:00:00'
            },
            'productLotLevels': null,
            'levelSettings': null,
            'accountSettings': null,
            'hasOwnAccountSettings': false,
            'isArchived': false,
            'id': '4fcc18a9-ea28-4df0-b938-3f694c788438',
            'parentNodeId': 'dd01541f-fbbc-4740-915b-46917eb0fceb',
            'parentNode': null,
            'nodeType': 5,
            'children': [
              {
                'displayName': 'Test 2',
                'testSpecId': '5',
                'correlatedTestSpecId': 'F34508AEE1ED4219AD20DCC2D00test2',
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
                'levelSettings': null,
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'id': '36610b51-fbd8-487e-a05f-3bb312ac35bb',
                'parentNodeId': '4fcc18a9-ea28-4df0-b938-3f694c788438',
                'parentNode': null,
                'nodeType': 6,
                'children': [],
                'isUnavailable': false,
                'unavailableReasonCode': ''
              }
            ],
            'isUnavailable': false,
            'unavailableReasonCode': ''
          }
        ],
        'isUnavailable': false,
        'unavailableReasonCode': ''
      }
    ],
    isUnavailable: false,
    unavailableReasonCode: ''
  };

  const navigationState = {
    selectedNode: null,
    selectedLeaf: null,
    currentBranch: mockCurrentBranch,
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: true,
    selectedLeftNavItem: null,
    showArchivedItemsToggle: false,
    isArchiveItemsToggleOn: false,
    instrumentsGroupedByDept: true
  };

  const mockPanelService = jasmine.createSpyObj('PanelsApiService', ['priorPanelItemListData']);
  const mockState = {
    navigation: navigationState,
  };

  const mockPortalApiService = jasmine.createSpyObj('LabTestService', {
    getLabSetupNode: of(mockDepartmentWithUptoGrandChildren),
    getLabSetupAncestorsMultiple: of([])
  });

  const mockBrPermissionsService = {
    hasAccess: () =>  true,
  };
  let panelsApiServiceInstance: PanelsApiService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        MaterialModule,
        StoreModule.forRoot([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [PanelItemSelectionComponent],
      providers: [
        TranslateService,
        DateTimeHelper,
        LocaleConverter,
        HttpClient,
        { provide: TranslateService, useValue: { get: tag => of(tag) } },
        { provide: MessageSnackBarService, useValue: {} },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: PanelsApiService, useValue: mockPanelService },
        { provide: Store, useValue: mockState },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        provideMockStore({ initialState }),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    store.setState(mockState);
    fixture = TestBed.createComponent(PanelItemSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    panelsApiServiceInstance = fixture.debugElement.injector.get(PanelsApiService);

  });

  it('should create', () => {
    panelsApiServiceInstance.changedPanelList = [mockPanelList];
    expect(component).toBeTruthy();
  });

  it('should show all the children under the node on click of expand icon button', () => {
    const treeNodeElements = fixture.debugElement.nativeElement.querySelectorAll('.spec-tree-node');
    const initialLength = treeNodeElements.length;
    const expandColapseButton = fixture.debugElement.nativeElement.querySelector('.spec-expand-colapse-button');
    expandColapseButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    const updatedTreeNodeElements = fixture.debugElement.nativeElement.querySelectorAll('.spec-tree-node');
    expect(updatedTreeNodeElements.length).toBe(initialLength + 1);
  });

  it('should select all the analytes under the node on selecting checkbox of any parent', fakeAsync(async () => {
    await component.initialize();
    fixture.detectChanges();
    let leafCheckbox = fixture.debugElement.nativeElement.querySelector('.spec-leaf-checkbox');
    expect(leafCheckbox?.classList?.contains('mat-checkbox-checked')).not.toBeTrue();
    const parentCheckbox = fixture.debugElement.nativeElement.querySelector('.spec-parent-checkbox');
    parentCheckbox.dispatchEvent(new Event('change'));
    tick(3000);
    await fixture.whenStable().then(() => {
      fixture.detectChanges();
      leafCheckbox = fixture.debugElement.nativeElement.querySelector('.spec-leaf-checkbox');
      expect(leafCheckbox?.classList?.contains('mat-checkbox-checked')).toBeTrue();
      flush();
    });
  }));

  it('should emit selected analytes on selection of any analyte', fakeAsync(async () => {
    const spy = spyOn(component.selectedItemsEvent, 'emit');
    await component.initialize();
    fixture.detectChanges();
    const parentCheckbox = fixture.debugElement.nativeElement.querySelector('.spec-parent-checkbox');
    parentCheckbox.dispatchEvent(new Event('change'));
    tick(3000);
    await fixture.whenStable().then(() => {
      fixture.detectChanges();
      const selectedItems = component.getSelectedDescendants();
      expect(component.selectedItemsEvent.emit).toHaveBeenCalledWith(selectedItems);
      flush();
    });
  }));

  it('should show expired lots items as disabled on the tree', fakeAsync(async () => {
    await component.initialize();
    fixture.detectChanges();
    const parentCheckbox = fixture.debugElement.nativeElement.querySelector('.spec-parent-checkbox');
    parentCheckbox.dispatchEvent(new Event('change'));
    tick(3000);
    await fixture.whenStable().then(() => {
      const leafCheckboxes = fixture.debugElement.nativeElement.querySelectorAll('.spec-leaf-checkbox');
      expect(leafCheckboxes[0]?.classList?.contains('mat-checkbox-disabled')).toBeFalse();
      expect(leafCheckboxes[1]?.classList?.contains('mat-checkbox-disabled')).toBeTrue();
      flush();
    });
  }));
});
