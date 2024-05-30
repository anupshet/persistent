// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, fakeAsync, TestBed, async   } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DialogResult, MaterialModule } from 'br-component-library';
import { ArchivedPanelComponent } from './archived-panel.component';
import { MappingService } from '../../mapping.service';
import { ApiService } from '../../../../../shared/api/api.service';
import { ConfigService } from '../../../../../core/config/config.service';
import { AppLoggerService } from '../../../../../shared/services/applogger/applogger.service';
import { ConnectivityMappingApiService } from '../../../../../shared/api/connectivityMappingApi.service';
import { CodelistApiService } from '../../../../../shared/api/codelistApi.service';
import { TruncatePipe } from '../../../../../shared/pipes/truncate.pipe';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { Chip } from '../../../../../contracts/models/connectivity-map/chip.model';
import { BrError } from '../../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import {HttpLoaderFactory} from "../../../../../app.module";

describe('ArchivedPanelComponent', () => {
  let component: ArchivedPanelComponent;
  let fixture: ComponentFixture<ArchivedPanelComponent>;

  const mockUnmappedProdChips = [
    {
      'documentId': 'bd48b7a4-d883-11ea-841f-06fe5f17c9ec',
      'entityId': null,
      'parentId': 'bdae705a-143b-49c3-be41-de425ba13dca',
      'levelId': null,
      'code': 'CardiacMarkers_ProductLotCode--3',
      'calibratorLotCodes': null,
      'reagentLotCodes': null,
      'disabled': true,
      'id': 'bd48b7a4-d883-11ea-841f-06fe5f17c9ec'
    },
    {
      'documentId': 'bd48b7a4-d883-11ea-841f-06fe5f17c9ec',
      'entityId': null,
      'parentId': 'bdae705a-143b-49c3-be41-de425ba13dca',
      'levelId': null,
      'code': 'CardiacMarkers_ProductLotCode--2',
      'calibratorLotCodes': null,
      'reagentLotCodes': null,
      'disabled': false,
      'id': 'bd48b7a4-d883-11ea-841f-06fe5f17c9ec'
    },
    {
      'documentId': 'bd48b7a4-d883-11ea-841f-06fe5f17c9ec',
      'entityId': null,
      'parentId': 'bdae705a-143b-49c3-be41-de425ba13dca',
      'levelId': null,
      'code': 'CardiacMarkers_ProductLotCode--1',
      'calibratorLotCodes': null,
      'reagentLotCodes': null,
      'disabled': true,
      'id': 'bd48b7a4-d883-11ea-841f-06fe5f17c9ec'
    }
  ];

  const mockUnmappedInstChips = [{
    calibratorLotCodes: null,
    code: 'AU600',
    documentId: 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec',
    entityId: null,
    levelId: null,
    parentId: null,
    reagentLotCodes: null,
    disabled: true,
    parsingJobConfigId: '111',
    id: 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec'
  },
  {
    calibratorLotCodes: null,
    code: '1480',
    documentId: '0856980e-db92-11ea-93a0-06e557ed42ee',
    entityId: null,
    levelId: null,
    parentId: null,
    reagentLotCodes: null,
    disabled: true,
    parsingJobConfigId: '111',
    id: '0856980e-db92-11ea-93a0-06e557ed42ee'
  }];

  const mockUnmappedTestChips = [
    {
      'documentId': 'd222afd0-fc7e-11ea-8e9f-06fe5f17c9ec',
      'entityId': null,
      'parentId': '09da4b87-5ad0-4c49-838d-5c1a1737bc12',
      'levelId': null,
      'reagentLotCodes': [],
      'calibratorLotCodes': [],
      'code': '_BNPSTAT2 -- pg/mL',
      'disabled': true,
      'parsingJobConfigId': null,
      'id': 'd222afd0-fc7e-11ea-8e9f-06fe5f17c9ec'
    },
    {
      'documentId': 'd222afd0-fc7e-11ea-8e9f-06fe5f17c9ec',
      'entityId': null,
      'parentId': '09da4b87-5ad0-4c49-838d-5c1a1737bc12',
      'levelId': null,
      'reagentLotCodes': [],
      'calibratorLotCodes': [],
      'code': '_BNPSTAT -- pg/mL',
      'disabled': false,
      'parsingJobConfigId': null,
      'id': 'd222afd0-fc7e-11ea-8e9f-06fe5f17c9ec'
    }
  ];

  const mockTree = [
    {
      'id': '6e816944-c3c8-4536-9a06-3453827c76bb',
      'labId': '1631c7f7-fb97-41dd-bfcb-48fd14b9413b',
      'locationId': null,
      'departmentId': null,
      'instrumentId': null,
      'codes': [
        {
          'id': '6e816944-c3c8-4536-9a06-3453827c76bb',
          'code': 'New_4_InstCode',
          'disabled': true
        }
      ],
      'product': [
        {
          'id': null,
          'levelCodes': [
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': 'b7d8213d-e20f-4f04-8bb4-f7370edfa2e6',
                  'code': 'New_3_ProductLotCode -- 1',
                  'disabled': true
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'New_3_AlbuminTest',
                      'disabled': true
                    }
                  ],
                  'reagentLot': [],
                  'calibratorLot': []
                }
              ]
            },
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '322498c5-dbee-46e5-8007-f548baac8890',
                  'code': 'New_3_ProductLotCode -- 2',
                  'disabled': true
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'New_3_AlbuminTest',
                      'disabled': true
                    }
                  ],
                  'reagentLot': [],
                  'calibratorLot': []
                }
              ]
            }
          ]
        }
      ]
    }];

  const mockConfigurations = {
    'configs': [
      {
        'id': '00000000-0000-0000-0000-000000000000',
        'name': 'Rebel\'s Spacecraft Manual',
        'edgeDeviceIds': [
          '88888888-4444-4444-4444-cccccccccccc'
        ],
        'isGenericASTM': true,
        'handlesSlideGen': false,
        'createdTime': '2021-04-08T20:05:20.03Z',
        'isConfigured': false,
        'isDeletable': true,
        'isHavingMappings': true
      },
      {
        'id': '00000000-0000-0000-0000-000000000001',
        'name': 'Empire\'s Spacecraft Manual',
        'edgeDeviceIds': [],
        'isGenericASTM': false,
        'handlesSlideGen': false,
        'createdTime': '2021-04-08T20:05:20.03Z',
        'isConfigured': false,
        'isDeletable': true,
        'isHavingMappings': true
      }
    ],
    'unassociatedEdgeDeviceIds': [
      '88888888-4444-4444-4444-ffffffffffff'
    ]
  };

  let mappingServiceInstance: MappingService;
  const mockMappingService = {
    currentUnmappedInstChips: of(mockUnmappedInstChips),
    currentEntityType: of(EntityType.LabProduct),
    currentEntityId: of('11111111111111111'),
    selectedConfigurationId: of('11111111111111111'),
    currentUnmappedProdChips: of(mockUnmappedProdChips),
    currentSelectedChipIndex: of(new Chip()),
    configurations: of(mockConfigurations),
    currentUnmappedTestChips: of(mockUnmappedTestChips),
    currentInstrumentCards: of(mockUnmappedInstChips),
    currentProductCards: of(mockUnmappedProdChips),
    enableProduct: () => {
      return of([]);
    },
    enableInstrument: () => {
      return of([]);
    },
    enableTest: () => {
      return of([]);
    },
    deleteProductCode: () => {
      return of([]);
    },
    deleteInstrumentCode: () => {
      return of([]);
    },
    deleteTestCode: () => {
      return of(mockTree);
    },
    updateDocument: () => {
      return of([]);
    },
    sendAuditTrailPayload: () => {
    }
  };

  let dialogInstance: MatDialog;
  const dialogRefStub = {
    afterClosed() {
      return of(true);
    },
    componentInstance: {
      buttonClicked: of(DialogResult.OK)
    },
    close() { }
  };
  const dialogStub = { open: () => dialogRefStub, close: () => { } };

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
      declarations: [
        ArchivedPanelComponent,
        TruncatePipe
      ],
      imports: [
        HttpClientModule,
        StoreModule.forRoot([]),
        MaterialModule,
        MatDialogModule,
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
        ApiService,
        ConfigService,
        AppLoggerService,
        ConnectivityMappingApiService,
        CodelistApiService,
        { provide: MappingService, useValue: mockMappingService },
        { provide: MatDialog, useValue: dialogStub },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateService,
        HttpClient
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedPanelComponent);
    component = fixture.componentInstance;
    mappingServiceInstance = fixture.debugElement.injector.get(MappingService);
    dialogInstance = fixture.debugElement.injector.get(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verify if disabled chip shown in the panel', () => {
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_disabled_chip');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(disabledChipElement).toBeTruthy();
    });
  });

  it('verify if disabled chip shown in the panel are sorted', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const disabledChips: String[] = component.disabledChips.map((el) => el.code);
      const disabledChipsSorted: String[] = [...disabledChips];
      disabledChipsSorted.sort((a, b) => a.localeCompare(b.toString()));
      expect(disabledChips).toEqual(disabledChipsSorted);
    });
  });

  it('verify if Restore and Delete options shown on click of chip', () => {
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chip');
    disabledChipElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const chipOptionsElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chipOptions');
      expect(chipOptionsElement).toBeTruthy();
    });
  });

  it('verify if Restore clicked then enables the code', () => {
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chip');
    disabledChipElement.click();
    fixture.whenStable().then(() => {
      const spy = spyOn(mappingServiceInstance, 'enableProduct').and.callThrough();
      fixture.detectChanges();
      const restoreElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_restore');
      restoreElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('verify if Delete clicked then Delete dialog is shown', () => {
    const spy = spyOn(dialogInstance, 'open').and.callThrough();
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chip');
    disabledChipElement.click();
    fixture.detectChanges();
    const deleteElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_delete');
    deleteElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('verify on click of delete deleteProductCode called when Entity is Product', () => {
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chip');
    disabledChipElement.click();
    const spy = spyOn(mappingServiceInstance, 'deleteProductCode').and.callThrough();
    fixture.detectChanges();
    const deleteElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_delete');
    deleteElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('verify if disabled chip shown in the panel for instruments', () => {
    mappingServiceInstance.currentEntityType = of(EntityType.LabInstrument);
    fixture.detectChanges();
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_disabled_chip');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(disabledChipElement).toBeTruthy();
    });
  });

  it('verify if Restore clicked then enables the code for instruments', () => {
    const spy = spyOn(mappingServiceInstance, 'enableInstrument').and.callThrough();
    mappingServiceInstance.currentEntityType = of(EntityType.LabInstrument);
    component.disabledChips = mockUnmappedInstChips;
    fixture.detectChanges();
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chip');
    disabledChipElement.click();
    fixture.detectChanges();
    const restoreElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_restore');
    restoreElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('verify on click of delete deleteInstrumentCode called when Entity is instruments', fakeAsync(() => {
    mappingServiceInstance.currentEntityType = of(EntityType.LabInstrument);
    component.disabledChips = mockUnmappedInstChips;
    fixture.detectChanges();
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chip');
    disabledChipElement.click();
    const spy = spyOn(mappingServiceInstance, 'deleteInstrumentCode').and.callThrough();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const deleteElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_delete');
      deleteElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  }));

  it('verify if disabled chip shown in the panel for test', () => {
    mappingServiceInstance.currentEntityType = of(EntityType.LabTest);
    component.disabledChips = mockUnmappedTestChips;
    fixture.detectChanges();
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_disabled_chip');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(disabledChipElement).toBeTruthy();
    });
  });

  it('verify if Restore clicked then enables the code for test', () => {
    const spy = spyOn(mappingServiceInstance, 'enableTest').and.callThrough();
    mappingServiceInstance.currentEntityType = of(EntityType.LabTest);
    fixture.detectChanges();
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chip');
    disabledChipElement.click();
    fixture.detectChanges();
    const restoreElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_restore');
    restoreElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('verify on click of delete deleteTestCode called when Entity is test', () => {
    const spy = spyOn(mappingServiceInstance, 'deleteTestCode').and.callThrough();
    mappingServiceInstance.currentEntityType = of(EntityType.LabTest);
    fixture.detectChanges();
    const disabledChipElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_chip');
    disabledChipElement.click();
    fixture.detectChanges();
    const deleteElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_delete');
    deleteElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
});
