// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { NgReduxModule } from '@angular-redux/store';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import {TranslateFakeLoader,TranslateLoader,TranslateModule,TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { MaterialModule } from 'br-component-library';

import { ExpiringLotsListComponent } from '../expiring-lots-list/expiring-lots-list.component';
import { ExpiringLotsPanelComponent } from '../expiring-lots-panel.component';
import { UnDateFormatPipe } from '../../../../../shared/date-time/pipes/unDateFormat.pipe';
import { SortedListItem } from '../../../../../contracts/models/actionable-dashboard/actionableItem.model';
import { BrError } from '../../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ExpiredLots } from '../../../../../contracts/models/actionable-dashboard/expired-lots.model';
import { UnityNextDatePipe } from '../../../../../shared/date-time/pipes/unity-next-date.pipe';

describe('ExpiringLotsListComponent', () => {
  let component: ExpiringLotsListComponent;
  let fixture: ComponentFixture<ExpiringLotsListComponent>;
  const expriredfakeItems = [
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
      'labInstrumentId': 'ad29d2cf-9c78-4863-ac6e-e0d905867a03',
      'labProductId': 'f5a213b1-5b5d-4188-aa8f-fb519acc8b01',
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '26430',
      'productMasterLotId': 72,
      'expirationDate': new Date('2021-05-31T00:00:00'),
      'isExpired': true,
      'productCustomName': 'sabal'
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

  const expriredfakeItemsSorted = [
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
      'labInstrumentId': 'ad29d2cf-9c78-4863-ac6e-e0d905867a03',
      'labProductId': 'f5a213b1-5b5d-4188-aa8f-fb519acc8b01',
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
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const expiredItems: Array<ExpiredLots> = [
    {
      'labInstrumentId': 'a3e3c653-d082-4936-85f6-6b31b5a78462',
      'labProductId': 'e453e893-bb22-41b5-b750-edc191bfe57e',
      'productId': 4,
      'productName': 'Blood Gas',
      'lotNumber': '28720',
      'productMasterLotId': 131,
      'expirationDate': new Date(),
      'isExpired': false,
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
      'expirationDate': new Date('2021-05-30T00:00:00'),
      'isExpired': true,
      'productCustomName': ''
    },
    {
      'labInstrumentId': 'f5d72350-3936-4ce3-b845-6db4ced527e0',
      'labProductId': '0e85978b-26ab-407d-99b7-6dcb08f94889',
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '23000',
      'productMasterLotId': 69,
      'expirationDate': new Date('2021-05-30T00:00:00'),
      'isExpired': true,
      'productCustomName': ''
    }
  ];

  const expiredItemsSortedMock: Array<ExpiredLots> = [
    {
      'labInstrumentId': 'f5d72350-3936-4ce3-b845-6db4ced527e0',
      'labProductId': '0e85978b-26ab-407d-99b7-6dcb08f94889',
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '23000',
      'productMasterLotId': 69,
      'expirationDate': new Date('2021-05-30T00:00:00'),
      'isExpired': true,
      'productCustomName': ''
    },
    {
      'labInstrumentId': 'f5d72350-3936-4ce3-b845-6db4ced527e0',
      'labProductId': '0e85978b-26ab-407d-99b7-6dcb08f94889',
      'productId': 2,
      'productName': 'Assayed Chemistry',
      'lotNumber': '23000',
      'productMasterLotId': 69,
      'expirationDate': new Date('2021-05-30T00:00:00'),
      'isExpired': true,
      'productCustomName': ''
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
      'labInstrumentId': 'a3e3c653-d082-4936-85f6-6b31b5a78462',
      'labProductId': 'e453e893-bb22-41b5-b750-edc191bfe57e',
      'productId': 4,
      'productName': 'Blood Gas',
      'lotNumber': '28720',
      'productMasterLotId': 131,
      'expirationDate': new Date(),
      'isExpired': false,
      'productCustomName': 'letitben'
    }
  ];

  const sortedItemList: Array<SortedListItem> = [{
    sortedExpirationDate: '03',
    sortedDisplayNameItemList: [{
      productName: 'test1',
      id: '1',
      productId: 'test1',
      actionableType: null,
      expirationDate: new Date('03/03/2020'),
      parentInstrument: null
    }, {
      productName: 'test2',
      id: '2',
      productId: 'test2',
      actionableType: null,
      expirationDate: new Date('03/03/2020'),
      parentInstrument: null
    }]
  }, {
    sortedExpirationDate: '04',
    sortedDisplayNameItemList: [{
      productName: 'test3',
      id: '1',
      productId: 'test3',
      actionableType: null,
      expirationDate: new Date('03/03/2020'),
      parentInstrument: null
    }, {
      productName: 'test4',
      id: '2',
      productId: 'test4',
      actionableType: null,
      expirationDate: new Date('03/03/2020'),
      parentInstrument: null
    }]
  }];

  const sortedItemListMock: Array<SortedListItem> = [{
    sortedExpirationDate: '03',
    sortedDisplayNameItemList: [{
      productName: 'test1',
      id: '1',
      productId: 'test1',
      actionableType: null,
      expirationDate: new Date('03/03/2020'),
      parentInstrument: null
    }, {
      productName: 'test2',
      id: '2',
      productId: 'test2',
      actionableType: null,
      expirationDate: new Date('03/03/2020'),
      parentInstrument: null
    }]
  }, {
    sortedExpirationDate: '04',
    sortedDisplayNameItemList: [{
      productName: 'test3',
      id: '1',
      productId: 'test3',
      actionableType: null,
      expirationDate: new Date('03/03/2020'),
      parentInstrument: null
    }, {
      productName: 'test4',
      id: '2',
      productId: 'test4',
      actionableType: null,
      expirationDate: new Date('03/03/2020'),
      parentInstrument: null
    }]
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExpiringLotsPanelComponent,
        ExpiringLotsListComponent,
        UnDateFormatPipe,
        UnityNextDatePipe
      ],
      imports: [
        // AngularMaterialModule,
        MaterialModule,
        NgReduxModule,
        NgReduxTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: Store, useValue: {}},
        provideMockStore({ initialState: {} }),
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(ExpiringLotsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    component.selectedItem = expriredfakeItems[0];
    component.sortedItemList = sortedItemList;
    component.expiredItems = expiredItems;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Verify list is in alphabetical order', () => {
    spyOn(component, 'getSortedExpiredItems').and.returnValue(expriredfakeItemsSorted);
    expect(component.getSortedExpiredItems(expriredfakeItems)[0].productName).toEqual(expriredfakeItemsSorted[0].productName);
    expect(component.getSortedExpiredItems).toHaveBeenCalled();
  });

  it('Verify list is displayed for one item', () => {
    const SPyObject = spyOn(component, 'getSortedExpiredItems').and.returnValue(expriredfakeItemsSorted);
    expect(SPyObject.length).toBeGreaterThanOrEqual(1);
  });

  it('should get expiring product lots on changes', () => {
    component.sortedItemList = sortedItemList;
    const spy = spyOn(component, 'getExpiringAndExpiredLotFilteredList');
    component.ngOnChanges();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should get expiring product lots on initialization', () => {
    component.sortedItemList = sortedItemList;
    const spy = spyOn(component, 'getExpiringAndExpiredLotFilteredList');
    component.ngOnInit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should get lot info from from lot list', () => {
    component.expiredItems = expiredItems;
    const spy = spyOn(component.actionableItem, 'emit');
    component.getLotinfofromLotlist('e453e893-bb22-41b5-b750-edc191bfe57e');
    fixture.detectChanges();
    expect(component.selectedItem).toEqual(expiredItems[0]);
    expect(spy).toHaveBeenCalledWith(component.selectedItem);
  });

  it('should get the sorted array', () => {
    const result = component.getSortedExpiredItems(expiredItems);
    fixture.detectChanges();
    expect(result).toEqual(expiredItemsSortedMock);
  });

  it('should get lot infrom from lot list', () => {
    component.expiredItems = expiredItems;
    let dateRepeated: string = null;
    component.getExpiringAndExpiredLotFilteredList();
    fixture.detectChanges();
    expiredItems.forEach((item: ExpiredLots) => {
      dateRepeated = (item.expirationDate).toString();
      const itemIndex = component.sortedItemList
        .findIndex((i: SortedListItem) =>
          i.sortedExpirationDate === dateRepeated);
      if (itemIndex > -1) {
        const itemData = { name: (item.productCustomName) ? item.productCustomName : item.productName, id: item.labProductId };
        component.sortedItemList[itemIndex].sortedDisplayNameItemList.push(itemData);
        return;
      }
      {
        component.sortedItemList.push({
          sortedExpirationDate: dateRepeated,
          sortedDisplayNameItemList: [{ name: (item.productCustomName) ? item.productCustomName : item.productName, id: item.labProductId }]
        });
      }
    });
    expect(component.getExpiringAndExpiredLotFilteredList).toBeTruthy();
  });

  it('should check if the isExpiringTodayorTomorrow method returns proper value', () => {
    // create todays date in expected format and expect the method to return true
    const day = (new Date()).getDate();
    const month = ((new Date()).getUTCMonth() + 1);
    const today = `${(new Date()).getUTCFullYear()}-${month <= 9 ? '0' + month : month}-${day <= 9 ? '0' + day : day}T00:00:00`;
    let result = component.isExpiringTodayorTomorrow(today);
    expect(result).toBeTrue();
    result = component.isExpiringTodayorTomorrow('2020-05-31T00:00:00');
    expect(result).toBeFalse();
  });

  // This should be called with fakeAsync to run correctly.
  it('should show count infront of repeated product name', () => {
    component.getExpiringAndExpiredLotFilteredList();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const lotCount = fixture.debugElement.nativeElement.querySelector('.spec-lot-count');
      expect(lotCount.innerText).toEqual('(2)');
    });
  });
});
