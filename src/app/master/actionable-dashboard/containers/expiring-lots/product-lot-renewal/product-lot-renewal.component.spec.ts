// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DatePipe } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

import { ProductLotRenewalComponent } from './product-lot-renewal.component';
import {
  ProductLotRenewalDetailsComponent
} from '../../../components/expiring-lots-panel/product-lot-renewal-details/product-lot-renewal-details.component';
import { PortalApiService } from '../../../../../shared/api/portalApi.service';
import { CodelistApiService } from '../../../../../shared/api/codelistApi.service';
import { ConfigService } from '../../../../../core/config/config.service';
import { ApiService } from '../../../../../shared/api/api.service';
import { DateTimeHelper } from '../../../../../shared/date-time/date-time-helper';
import { AppLoggerService } from '../../../../../shared/services/applogger/applogger.service';
import { SpinnerService } from '../../../../../shared/services/spinner.service';
import { ExpiringLotsService } from '../../../services/expiring-lots.service';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { MigrationStates } from '../../../../../contracts/enums/migration-state.enum';
import { Address } from '../../../../../contracts/models/portal-api/portal-data.model';
import { LabProduct, LabInstrument, LabLocation } from '../../../../../contracts/models/lab-setup';
import { LotRenewal } from '../../../../../contracts/models/actionable-dashboard/actionable-dashboard.model';
import { ActionableItem } from '../../../../../contracts/models/actionable-dashboard/actionableItem.model';
import { UnityDateTimeModule } from '../../../../../shared/date-time/unity-date-time.module';
import { LotRenewalPayload } from '../../../../../contracts/models/actionable-dashboard/actionable-dashboard.model';
import { BrError } from '../../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import {HttpLoaderFactory} from "../../../../../app.module";

describe('ProductLotRenewalComponent', () => {
  let component: ProductLotRenewalComponent;
  let fixture: ComponentFixture<ProductLotRenewalComponent>;
  const State = [];
  let store: MockStore<any>;
  const mockState = {};
  const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollY: false
  };

  const Accounts = {
    id: '123',
    accountNumber: '3456788',
    formattedAccountNumber: '',
    sapNumber: '',
    orderNumber: '',
    primaryUnityLabNumbers: '',
    labName: '',
    accountAddressId: '',
    accountAddress: Address,
    accountContactId: '',
    accountContact: null,
    licenseNumberUsers: 123,
    accountLicenseType: 123,
    licensedProducts: null,
    licenseAssignDate: Date,
    licenseExpirationDate: Date,
    comments: '',
    nodeType: EntityType.Account,
    parentNodeId: 'ROOT',
    displayName: '',
    migrationStatus: MigrationStates
  };

  const storeStub = {
    account: {
      currentAccountSummary: Accounts
    }
  };

  const labInstrument = [{
    manufacturerId: '123',
    children: [{
      manufacturerId: '12',
      children: {
        nodeType: EntityType.LabTest,
        testSpecId: '23',
        labUnitId: '46',
        testSpecInfo: null,
        testId: '78',
        correlatedTestSpecId: '77',
        displayName: 'yo',
        parentNode: LabProduct,
      },
      nodeType: EntityType.LabProduct,
      productId: '23',
      productMasterLotId: '123',
      productCustomName: 'productName',
      productInfo: null,
      lotInfo: {
        id: '3',
        productId: '23',
        productName: 'product',
        lotNumber: '234',
        expirationDate: new Date,
        lotWithExpirationDate: '06-01-2020',
      },
      parentNode: LabInstrument,
      productLotLevels: null
    }],
    nodeType: EntityType.LabInstrument,
    isInstrumentChecked: true,
    instrumentId: '123',
    instrumentCustomName: 'my name',
    instrumentSerial: '',
    instrumentInfo: [
      {
        id: '1',
        name: 'instrument',
        manufacturerId: '',
        manufacturerName: 'yes i know',
      }
    ],
    parentNode: {
      children: LabInstrument,
      nodeType: EntityType.LabDepartment,
      departmentName: '',
      departmentManagerId: '',
      departmentManager: '',
      parentNode: LabLocation
    }
  }];

  const node: LotRenewalPayload = {
    id: '23',
    nodeType: 4,
    productMasterLotId: '1'
  };

  const actionableItem: ActionableItem[] =
    [
      {
        productName: 'product',
        id: '1',
        productId: '123',
        actionableType: null,
        expirationDate: new Date,
        parentInstrument: new LabInstrument,
      }
    ];

  const productLotList = [{
    'id': 1,
    'lotNumber': '123',
    'expirationDate': '',
    'lotWithExpirationDate': '',
  }];

  const data: LotRenewal = {
    selectedLot: {
      productName: '',
      id: '',
      productId: '',
      actionableType: null,
      expirationDate: new Date,
      parentInstrument: null,
    },
    selectedInstruments: [
      {
        manufacturerId: '2',
        children: [
          {
            manufacturerId: '',
            children: null,
            nodeType: EntityType.LabProduct,
            productId: '23',
            productMasterLotId: '33',
            productCustomName: 'the',
            productInfo: null,
            lotInfo: null,
            parentNode: {
              manufacturerId: '1',
              children: null,
              nodeType: EntityType.LabInstrument,
              isInstrumentChecked: true,
              instrumentId: '23',
              instrumentCustomName: 'yes',
              instrumentSerial: 'serial',
              instrumentInfo: null,
              parentNode: null,
              id: '23',
              parentNodeId: '3',
              displayName: 'sss'
            },
            productLotLevels: null,
            id: '239',
            parentNodeId: '3',
            displayName: 'sss'
          }
        ],
        nodeType: 4,
        isInstrumentChecked: true,
        instrumentId: '13',
        instrumentCustomName: 'instument2',
        instrumentSerial: 'instrumentSerial1',
        instrumentInfo: null,
        parentNode: null,
        id: '23',
        parentNodeId: '2',
        displayName: 'yes'

      },
      {
        manufacturerId: '3',
        children: [
          {
            manufacturerId: '',
            children: null,
            nodeType: EntityType.LabProduct,
            productId: '234',
            productMasterLotId: '334',
            productCustomName: 'they',
            productInfo: null,
            lotInfo: null,
            parentNode: {
              manufacturerId: '2',
              children: null,
              nodeType: EntityType.LabInstrument,
              isInstrumentChecked: true,
              instrumentId: '235',
              instrumentCustomName: 'yes',
              instrumentSerial: 'serial',
              instrumentInfo: null,
              parentNode: null,
              id: '23',
              parentNodeId: '3',
              displayName: 'sss'
            },
            productLotLevels: null,
            id: '239',
            parentNodeId: '3',
            displayName: 'sss'
          }
        ],
        nodeType: 4,
        isInstrumentChecked: true,
        instrumentId: '13',
        instrumentCustomName: 'instument2',
        instrumentSerial: 'instrumentSerial1',
        instrumentInfo: null,
        parentNode: null,
        id: '23',
        parentNodeId: '2',
        displayName: 'yes'

      }
    ]
  };

  const mockDataTimeHelper = jasmine.createSpyObj([
    'getTimeZoneOffset',
    'isExpiredOnSpecificDate'
  ]);

  const configServiceSpy = jasmine.createSpyObj('ConfigService', {
    getConfig: (key: string) => {
      return { url: 'not needed yet' };
    }
  });

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockPortalApiService = {
    duplicateLabProductNode: () => {
      return of(node);
    }
  };

  const mockCodelistApiService = {
    getProductMasterLotsByProductId: () => {
      return of(productLotList);
    }
  };

  const mockExpiringLotService = {
    getLabProducts: () => {
      return of(labInstrument);
    }
  };

  const mockDataTimeHelperDate = {
    getSomeDaysAheadDate: () => {
      return '06-01-2020';
    },
    isExpiredOnSpecificDate: () => {
      return true;
    }
  };

  let portalAPIInstance: PortalApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductLotRenewalComponent,
        ProductLotRenewalDetailsComponent
      ],
      imports: [
        PerfectScrollbarModule,
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatSelectModule,
        UnityDateTimeModule,
        MatIconModule,
        StoreModule.forRoot(State),
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
        ApiService,
        AppLoggerService,
        CodelistApiService,
        DatePipe,
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        { provide: ExpiringLotsService, useValue: mockExpiringLotService },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        { provide: DateTimeHelper, useValue: mockDataTimeHelperDate },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: Store, useValue: storeStub },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        provideMockStore(mockState),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        SpinnerService,
        TranslateService
      ]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(storeStub);
    fixture = TestBed.createComponent(ProductLotRenewalComponent);
    component = fixture.componentInstance;
    portalAPIInstance = fixture.debugElement.injector.get(PortalApiService);
    component.actionableItem.productId = '23';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check selected function call duplicateLabProductNode method of portalAPIService which returns value', () => {
    spyOn(portalAPIInstance, 'duplicateLabProductNode').and.returnValue(of(node));
    component.selected(data);
    expect(portalAPIInstance.duplicateLabProductNode).toHaveBeenCalled();
  });

  it('Check selected function call duplicateLabProductNode method of portalAPIService which returns Error', () => {
    spyOn(portalAPIInstance, 'duplicateLabProductNode').and.returnValue(throwError({ status: 404 }));
    component.selected(data);
    expect(portalAPIInstance.duplicateLabProductNode).toHaveBeenCalled();
  });

  it('check filterExpiredLots call isExpiredOnSpecificDate method of dateTimeHelper service', () => {
    spyOn(component['dateTimeHelper'], 'isExpiredOnSpecificDate').and.callThrough();
    component.filterExpiredLots(actionableItem);
    expect(component['dateTimeHelper']['isExpiredOnSpecificDate']).toHaveBeenCalled();
  });
});
