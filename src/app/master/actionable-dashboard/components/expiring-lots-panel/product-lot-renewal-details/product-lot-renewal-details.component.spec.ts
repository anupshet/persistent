// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {HttpLoaderFactory} from "../../../../../app.module";
import { StoreModule } from '@ngrx/store';


import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

import { ProductLotRenewalDetailsComponent } from './product-lot-renewal-details.component';
import { UnityDateTimeModule } from '../../../../../../app/shared/date-time/unity-date-time.module';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { ActionableItem } from '../../../../../contracts/models/actionable-dashboard/actionableItem.model';
import { UnityNextDatePipe } from '../../../../../shared/date-time/pipes/unity-next-date.pipe';
import { BrError } from '../../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';

describe('ProductLotRenewalDetailsComponent', () => {
  let component: ProductLotRenewalDetailsComponent;
  let fixture: ComponentFixture<ProductLotRenewalDetailsComponent>;
  const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollY: false
  };
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };
  const d: EntityType = null;
  const singleLotArray = [
    {
      'expirationDate': new Date(),
      'id': '272',
      'productId': '17',
      'productName': 'Hemoglobin A2',
      'actionableType': null,
      'parentInstrument': null
    }
  ];
  const multipleLotArray = [
    {
      'expirationDate': new Date(),
      'id': '272',
      'productId': '17',
      'productName': 'Hemoglobin A2',
      'actionableType': null,
      'parentInstrument': null
    },
    {
      'expirationDate': new Date(),
      'id': '273',
      'productId': '18',
      'productName': 'Hemoglobin A2',
      'actionableType': null,
      'parentInstrument': null
    }
  ];
  const singleInstrumentArray = [
    {
      'expirationDate': new Date(),
      'id': '272',
      'departmentId': '',
      'manufacturerId': '',
      'instrumentModelId': 1,
      'instrumentModelName': '',
      'customName': '',
      'serialNumber': '',
      'children': null,
      'createdOn': new Date(),
      'modifiedOn': new Date(),
      'isDeleted': true,
      'nodeType': d,
      'isInstrumentChecked': true,
      'instrumentId': '',
      'instrumentCustomName': '',
      'instrumentSerial': '',
      'instrumentInfo': null,
      'type': null,
      'isSummary': true,
      'label': '',
      'nodeEntityId': '',
      'parentNodeId': '',
      'displayName': ''
    }
  ];
  const multipleInstrumentArray = [
    {
      'expirationDate': new Date(),
      'id': '272',
      'departmentId': '',
      'manufacturerId': '',
      'instrumentModelId': 1,
      'instrumentModelName': '',
      'customName': '',
      'serialNumber': '',
      'children': null,
      'createdOn': new Date(),
      'modifiedOn': new Date(),
      'isDeleted': true,
      'nodeType': d,
      'isInstrumentChecked': true,
      'instrumentId': '',
      'instrumentCustomName': '',
      'instrumentSerial': '',
      'instrumentInfo': null,
      'type': null,
      'isSummary': true,
      'label': '',
      'nodeEntityId': '',
      'parentNodeId': '',
      'displayName': ''
    },
    {
      'expirationDate': new Date(),
      'id': '273',
      'departmentId': '',
      'manufacturerId': '',
      'instrumentModelId': 2,
      'instrumentModelName': '',
      'customName': '',
      'serialNumber': '',
      'children': null,
      'createdOn': new Date(),
      'modifiedOn': new Date(),
      'isDeleted': true,
      'nodeType': d,
      'isInstrumentChecked': true,
      'instrumentId': '',
      'instrumentCustomName': '',
      'instrumentSerial': '',
      'instrumentInfo': null,
      'type': null,
      'isSummary': true,
      'label': '',
      'nodeEntityId': '',
      'parentNodeId': '',
      'displayName': ''
    }
  ];

  const selectedLot: ActionableItem = {
    'expirationDate': new Date(),
    'id': '272',
    'productId': '17',
    'productName': 'Hemoglobin A2',
    'actionableType': null,
    'parentInstrument': null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductLotRenewalDetailsComponent,
        UnityNextDatePipe
      ],
      imports: [
        StoreModule.forRoot([]),
        PerfectScrollbarModule,
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSelectModule,
        UnityDateTimeModule,
        BrowserAnimationsModule,
        MatIconModule,
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
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateService
      ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLotRenewalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label text for single lot', () => {
    component.selectedLots = singleLotArray;
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#spec_singleLot')).toBeTruthy();
  });

  it('should display dropdown for multiple lots', () => {
    component.selectedLots = multipleLotArray;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelector('.spec_multipleLot');
      expect(compiled).toBeTruthy();
    });
  });

  it('should display label text for single instrument', () => {
    component.selectedInstruments = singleInstrumentArray;
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#singleInstrument')).toBeTruthy();
  });

  it('should display checkbox for multiple instrument', () => {
    component.selectedInstruments = multipleInstrumentArray;
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#multipleInstrument')).toBeTruthy();
  });

  it('should check change lot button is disabled initially', () => {
    fixture.detectChanges();
    const changeLotBtn = fixture.debugElement.nativeElement.querySelector('#changelot');
    fixture.whenStable().then(() => {
      expect(changeLotBtn.disabled).toBe(true);
    });
  });

  it('should change lot button enabled', () => {
    component.selectedLots = multipleLotArray;
    component.selectedLot = multipleLotArray[0];
    component.selectedInstruments = multipleInstrumentArray;
    fixture.detectChanges();
    const changeLotBtn = fixture.debugElement.nativeElement.querySelector('#changelot');
    const instrumentCheckbox = fixture.debugElement.nativeElement.querySelector('#multipleInstrument');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.lotChanged();
      instrumentCheckbox.children[0].dispatchEvent(new Event('change'));
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(changeLotBtn.disabled).toBe(false);
      });
    });
  });

  it('has change lot button as disabled after clicking it', () => {
    component.selectedLots = multipleLotArray;
    component.selectedLot = multipleLotArray[0];
    component.selectedInstruments = multipleInstrumentArray;
    component.selectedInstruments[0].isInstrumentChecked = true;
    fixture.detectChanges();
    const changeLotBtn = fixture.debugElement.nativeElement.querySelector('#changelot');
    const instrumentCheckbox = fixture.debugElement.nativeElement.querySelector('#multipleInstrument');
    fixture.whenStable().then(() => {
      component.lotChanged();
      instrumentCheckbox.children[0].dispatchEvent(new Event('change'));
      fixture.detectChanges();
      fixture.whenStable().then(async () => {
        fixture.detectChanges();
        expect(changeLotBtn.disabled).toBe(false);

        changeLotBtn.dispatchEvent(new Event('click'));

        fixture.detectChanges();
        await fixture.whenStable().then(() => {
          expect(changeLotBtn.disabled).toBeTruthy();
        });
      });
    });
  });

  it('should check selectedLots length is equal to 1', () => {
    component.selectedLots = multipleLotArray.splice(1, 1);
    component.changeLot();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(selectedLot).toBeDefined();
    });
  });

});
