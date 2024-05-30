// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { ExpiringLotsComponent } from './expiring-lots.component';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NgReduxModule } from '@angular-redux/store';
import { Observable, of } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';

import { ExpiringLotsListComponent } from '../../components/expiring-lots-panel/expiring-lots-list/expiring-lots-list.component';
import { ExpiringLotsPanelComponent } from '../../components/expiring-lots-panel/expiring-lots-panel.component';
import { MaterialModule } from '../../../../../../projects/br-component-library/src/lib/material-module';
import { UnDateFormatPipe } from '../../../../shared/date-time/pipes/unDateFormat.pipe';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { EntityInfo } from '../../../../contracts/models/data-management/entity-info.model';
import { UnityBusyDirective } from '../../../../shared/indicator/unity-busy.directive';
import { AccountState } from '../../../../shared/state/reducers/account.reducers';
import { ExpiringLotsService } from '../../services/expiring-lots.service';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';

describe('ExpiringLotsComponent', () => {
  let component: ExpiringLotsComponent;
  let fixture: ComponentFixture<ExpiringLotsComponent>;
  const autofixture = new Autofixture();
  const testData = autofixture.create(new EntityInfo());
  const mockDataTimeHelper = jasmine.createSpyObj(['getSomeDaysAheadDate']);
  const State = [];
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const accountState: AccountState = {
    currentAccountSummary: {
      accountName: 'test',
      children: [],
      accountAddress: {
        entityType: 1,
        streetAddress1: 'Rajiv Gandhi IT Park',
        streetAddress2: '',
        streetAddress3: '',
        city: 'Irvine',
        state: 'CA',
        country: 'IN',
        zipCode: '92620',
        id: '57189e4c-8ebf-4876-8b0b-5fd332cd615b',
        streetAddress: 'Rajiv Gandhi IT Park Pune',
        suite: '',
        searchAttribute: '',
        nickName: ''
      },
      accountAddressId: '57189e4c-8ebf-4876-8b0b-5fd332cd615b',
      accountContact: {
        firstName: 'Vishwajit',
        lastName: 'Shinde',
        name: 'Vishwajit Shinde',
        email: 'vishwajit_shinde+dev21@bio-rad.com',
      },
      accountContactId: '52a79ee7-fa7b-41be-afc8-e665cf8aa2dc',
      accountLicenseType: 0,
      accountNumber: '100508',
      comments: '',
      lotViewer: '',
      displayName: '100508',
      formattedAccountNumber: 'U100508',
      id: '9ce5c200-04d2-4281-825f-a9d9c1cbb36e',
      licenseNumberUsers: 10,
      licensedProducts: [
        {
          product: 1,
          fileOption: 0
        }
      ],
      nodeType: 0,
      orderNumber: '',
      parentNodeId: 'ROOT',
      primaryUnityLabNumbers: null,
      sapNumber: '',
      shipTo: '1000001',
      soldTo: '2000001',
      labName: null,
      licenseAssignDate: null,
      licenseExpirationDate: null,
      previousContactUserId: null,
      languagePreference: 'en-us'
    },
    error: null
  };

  const stub = {
    security: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null,
    account: accountState
  };

  const labProduct = {
    children: null,
    nodeType: null,
    lotInfo: {
      id: 123,
      productId: null,
      productName: null,
      lotNumber: null,
      expirationDate: null
    },
    parentNode: {
      children: null,
      nodeType: null,
      instrumentId: null,
      instrumentCustomName: null,
      instrumentSerial: null,
      instrumentInfo: null
    }
  };

  const ApiServiceStub = {
    get: (number): Observable<any> => {
      return of(testData);
    }
  };
  const mockExpiredLots = [
    {
      'labInstrumentId': 'a3e3c653-d082-4936-85f6-6b31b5a78462',
      'labProductId': 'e453e893-bb22-41b5-b750-edc191bfe57e',
      'productId': 4,
      'productName': 'Blood Gas',
      'lotNumber': '28720',
      'productMasterLotId': 131,
      'expirationDate': new Date('2021-05-31T00:00:00'),
      'isExpired': true,
      'productCustomName': 'letitben'
    },
    {
      'labInstrumentId': 'ad29d2cf-9c77-4863-ac6e-e0d905867a03',
      'labProductId': 'f5a213b1-6b5d-4188-aa8f-fb519acc8b01',
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '26430',
      'productMasterLotId': 72,
      'expirationDate': new Date('2021-05-31T00:00:00'),
      'isExpired': true,
      'productCustomName': 'sabal'
    },
    {
      'labInstrumentId': 'f5d72350-3936-4ce3-b845-6db4ced527e0',
      'labProductId': '0e85978b-26ab-407d-99b7-6dcb08f94889',
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '23000',
      'productMasterLotId': 69,
      'expirationDate': new Date('2021-05-31T00:00:00'),
      'isExpired': false,
      'productCustomName': ''
    }
  ];

  const mockExpiringLotsService = {
    getExpiringProducts: () => {
      return of([labProduct]);
    },
    getRenewedProducts: () => {
      return of([labProduct]);
    },
    getExpiredLots: () => {
      return of(mockExpiredLots);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExpiringLotsComponent,
        ExpiringLotsPanelComponent,
        ExpiringLotsListComponent,
        UnDateFormatPipe,
        UnityBusyDirective
      ],
      imports: [
        MaterialModule,
        NgReduxModule,
        NgReduxTestingModule,
        StoreModule.forRoot(State)
      ],
      providers: [
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: ExpiringLotsService, useValue: mockExpiringLotsService },
        { provide: Store, useValue: stub },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        provideMockStore({ initialState: stub })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiringLotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the hasDataToDisplay method successfully', () => {
    spyOn(component.hasDataToDisplay, 'emit').and.callThrough();
    const value = component.expiredItems.length > 0;
    component.hasDisplayData();
    fixture.detectChanges();
    expect(component.hasDataToDisplay.emit).toHaveBeenCalledWith(value);
  });

/*   it('should call the reloadExpiredItemsList method successfully', () => {
    spyOn(component, 'getExpiringProductLot').and.callThrough();
    component.reloadExpiredItemsList();
    fixture.detectChanges();
    expect(component.getExpiringProductLot).toHaveBeenCalled();
  }); */

});
