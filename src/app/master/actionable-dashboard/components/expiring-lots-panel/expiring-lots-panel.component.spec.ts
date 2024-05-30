// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { NgReduxModule } from '@angular-redux/store';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/lib/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { of, Subject } from 'rxjs';
import { MaterialModule } from 'br-component-library';

import { ExpiringLotsListComponent } from './expiring-lots-list/expiring-lots-list.component';
import { ExpiringLotsPanelComponent } from './expiring-lots-panel.component';
import { ProductLotRenewalComponent } from '../../containers/expiring-lots/product-lot-renewal/product-lot-renewal.component';
import { UnityDateTimeModule } from '../../../../shared/date-time/unity-date-time.module';
import { ApiService } from '../../../../shared/api/api.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { ConfigService } from '../../../../core/config/config.service';
import { ProductLotRenewalDetailsComponent } from './product-lot-renewal-details/product-lot-renewal-details.component';
import { ActionableItemType } from '../../../../contracts/models/actionable-dashboard/actionableItem.model';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { UserRole } from '../../../../contracts/enums/user-role.enum';
import { HttpLoaderFactory } from '../../../../app.module';

describe('ExpiringLotsPanelComponent', () => {
  let component: ExpiringLotsPanelComponent;
  let fixture: ComponentFixture<ExpiringLotsPanelComponent>;
  const State = [];
  const expiredItems = [
    {
      'productName': 'ZCardiac Markers Plus LT (Liquichek Vista)',
      'id': '637C34F5F31240A99D23545A6B8809A9',
      'productId': '1234',
      'actionableType': 0,
      'expirationDate': new Date('2020-06-30T00:00:00'),
      'parentInstrument': null

    }
  ];

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
  const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollY: false
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

  const timeZone = 'America/Los_Angeles';
  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };
  const dialogStub = { open: () => dialogRefStub };

  const mockCurrentLabLocation = {
    children: [],
    locationTimeZone: 'America/Los_Angeles',
    locationOffset: '',
    locationDayLightSaving: '',
    nodeType: 2,
    labLocationName: '',
    labLocationContactId: '',
    labLocationAddressId: '',
    labLocationContact: null,
    labLocationAddress: null,
    id: '',
    parentNodeId: '',
    displayName: '',
    contactRoles: [UserRole.LabSupervisor],
    previousContactUserId: null,
    labLanguagePreference: 'en-us'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExpiringLotsPanelComponent,
        ExpiringLotsListComponent,
        ProductLotRenewalComponent,
        ProductLotRenewalDetailsComponent,
      ],
      imports: [
        MaterialModule,
        NgReduxModule,
        NgReduxTestingModule,
        PerfectScrollbarModule,
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        MatDialogModule,
        NgReduxModule,
        NgReduxTestingModule,
        MatCheckboxModule,
        MatSelectModule,
        UnityDateTimeModule,
        BrowserAnimationsModule,
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
        PortalApiService,
        SpinnerService,
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: MatDialog, useValue: dialogStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateService
      ]
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ProductLotRenewalComponent] } }).compileComponents();

    const timeZoneStub: Subject<any> = MockNgRedux.getSelectorStub<string, any>('timeZone');
    timeZoneStub.next(timeZone);
    fixture = TestBed.createComponent(ExpiringLotsPanelComponent);
    component = fixture.componentInstance;
    component.expiredItems = mockExpiredLots;
    component.getCurrentLabLocation$ = of(mockCurrentLabLocation);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Ensure expired lot count should display ', () => {
    fixture.detectChanges();
    const expiredCount = fixture.debugElement.nativeElement.querySelector('.expiring-count');
    fixture.whenStable().then(() => {
      expect((component.expiredItems.length).toString()).toEqual(expiredCount.innerText);
    });
  });

  it('Ensure expiring lot list is displayed', () => {
    expect(fixture.debugElement.nativeElement.querySelector('unext-expiring-lots-list')).not.toBe(null);
  });

  it('tests for case ActionableItemType.Product', () => {
    mockExpiredLots[0]['actionableType'] = ActionableItemType.Product;
    component.openDialogBox(mockExpiredLots[0]);
    fixture.detectChanges();
    expect(component.openDialogBoxForProduct(mockExpiredLots[0])).toBeUndefined();
  });

  it('tests for case ActionableItemType.Reagent', () => {
    expiredItems['actionableType'] = ActionableItemType.Reagent;
    component.openDialogBox(expiredItems);
    fixture.detectChanges();
  });

  it('tests for case ActionableItemType.Calibrator', () => {
    expiredItems['actionableType'] = ActionableItemType.Calibrator;
    component.openDialogBox(expiredItems);
    fixture.detectChanges();
  });

  it('call Dialog box', () => {
    spyOn(component, 'openDialogBox').and.callThrough();
    component.onLotsClicked(expiredItems);
    fixture.detectChanges();
    expect(component.openDialogBox).toHaveBeenCalled();
  });

  it('should get the timezone', () => {
    const timezone = 'America/Los_Angeles';
    component.getTimeZone();
    fixture.detectChanges();
    expect(component.timeZone).not.toBeNull();
    expect(component.timeZone).toEqual(timezone);
  });

});
