/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StoreModule, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConnectivityStatusComponent } from './connectivity-status.component';
import * as fromRoot from '../../state';
import { CheckForTloaderService } from '../../../../shared/services/check-for-tloader.service';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { IconService } from '../../../../shared/icons/icons.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('ConnectivityStatusComponent', () => {
  let component: ConnectivityStatusComponent;
  let fixture: ComponentFixture<ConnectivityStatusComponent>;
  let destroy$: Subject<boolean>;
  let store: MockStore<any>;
  let subStore: MockStore<any>;
  const MocCheckForTloaderService = {
    tloaderSubject: new Subject<boolean>()
  };

  const mockState = {};

  const currentLabLocation = {
    displayName: 'Vishwajit\'s Lab',
    labLocationName: 'Vishwajit\'s Lab',
    locationTimeZone: 'Asia/Kolkata',
    locationOffset: '05:30:00',
    locationDayLightSaving: '00:00:00',
    labLocationContactId: '74098d1f-e0a0-46ab-b1c1-405cf10c4d9b',
    labLocationAddressId: '0a69a3c7-68ca-4f42-92c7-be79879bb37d',
    labLocationContact: {
      entityType: 0,
      searchAttribute: 'vishwajit_shinde+devconn@bio-rad.com',
      firstName: 'vishwajit',
      middleName: '',
      lastName: 'shinde',
      name: 'vishwajit shinde',
      email: 'vishwajit_shinde+devconn@bio-rad.com',
      phone: '',
      id: '74098d1f-e0a0-46ab-b1c1-405cf10c4d9b',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
      }
    },
    labLocationAddress: {
      entityType: 1,
      searchAttribute: '',
      nickName: '',
      streetAddress1: 'Rajiv Gandhi IT park',
      streetAddress2: '',
      streetAddress3: '',
      streetAddress: 'Rajiv Gandhi IT park',
      suite: '',
      city: 'Pune',
      state: 'MH',
      country: 'IN',
      zipCode: '410057',
      id: '0a69a3c7-68ca-4f42-92c7-be79879bb37d',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
      }
    },
    accountSettings: {
      displayName: '',
      dataType: 1,
      instrumentsGroupedByDept: true,
      trackReagentCalibrator: false,
      fixedMean: false,
      decimalPlaces: 2,
      siUnits: false,
      labSetupRating: 0,
      labSetupComments: '',
      isLabSetupComplete: true,
      labSetupLastEntityId: 'null',
      id: '635b3412-679a-4201-97f4-c6df45bcfab6',
      parentNodeId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
      parentNode: null,
      nodeType: 9,
      children: null
    },
    hasOwnAccountSettings: false,
    id: '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
    parentNodeId: 'b6e6e6e3-ed8e-4bc9-8b1b-3fcdfecd3476',
    parentNode: null,
    nodeType: 2,
    children: []
  };

  const connectivityState = {
    hasInstructions: true,
    importStatusList: [
      {
        id: 'f809d052-48f8-47bf-88df-a775cd169799',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'Test1',
        userName: 'vishwajit shinde',
        fileName: 'Point Data_AU600Inst_1pts.txt',
        uploadedDateTime: '2020-07-09T06:50:32.256Z',
        status: 'Error'
      },
      {
        id: '06e16937-bae6-46c3-97ec-dd32cc19315e',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'Instruction1',
        userName: 'vishwajit shinde',
        fileName: 'Point Data_AU600Inst_1pts.txt',
        uploadedDateTime: '2020-07-29T05:45:05.648Z',
        status: 'Error'
      },
      {
        id: '7235a769-b186-4b9e-a640-225727df6556',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'BUG174506',
        userName: 'vishwajit shinde',
        fileName: 'Sanika_ Point Data_AU640Inst_9pts.txt',
        uploadedDateTime: '2020-08-05T09:20:23.585Z',
        status: 'Processing'
      },
      {
        id: 'e0042713-1307-4115-8943-fd2f5c35fa93',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'BUG-174506',
        userName: 'vishwajit shinde',
        fileName: 'Sanika_ Point Data_AU640Inst_9pts.txt',
        uploadedDateTime: '2020-08-06T08:42:25.42Z',
        status: 'Processing'
      },
      {
        id: 'c7f8bff7-6ea3-4eba-8dec-8cfe2765795c',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'Demo',
        userName: 'vishwajit shinde',
        fileName: 'Point Data_AU600Inst_9pts.txt',
        uploadedDateTime: '2020-08-04T05:24:55.836Z',
        status: 'Error'
      },
      {
        id: '339e29c9-e605-4244-8c27-8c91fec508af',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'Demo',
        userName: 'vishwajit shinde',
        fileName: 'Point Data_AU600Inst_9pts.txt',
        uploadedDateTime: '2020-08-04T05:25:46.597Z',
        status: 'Error'
      },
      {
        id: 'a503920a-3bee-4348-9316-105e0ce2bd57',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'Test2',
        userName: 'vishwajit shinde',
        fileName: 'Point Data_AU600Inst_9pts.txt',
        uploadedDateTime: '2020-08-04T05:29:42.758Z',
        status: 'Processing'
      },
      {
        id: '2506640a-dca7-49fc-9d1c-93165a38df46',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'BUG174506',
        userName: 'vishwajit shinde',
        fileName: 'Sanika_ Point Data_AU640Inst_9pts.txt',
        uploadedDateTime: '2020-08-04T06:09:57.732Z',
        status: 'Processing'
      },
      {
        id: 'd01cd128-68b7-42e3-a4cc-8b7413d97090',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'BUG174506',
        userName: 'vishwajit shinde',
        fileName: 'Sanika_ Point Data_AU640Inst_9pts.txt',
        uploadedDateTime: '2020-08-04T06:10:43.951Z',
        status: 'Processing'
      },
      {
        id: '627d2273-485a-4268-8010-980ab2a36f63',
        accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
        parsingJobConfigName: 'BUG174924',
        userName: 'vishwajit shinde',
        fileName: 'USE THIS FILE TO TEST demo-lactic with April 31 records removed.txt',
        uploadedDateTime: '2020-08-11T05:16:29.579Z',
        status: 'Processing'
      }
    ],
    importStatusDetails: null,
    error: null
  };

  const StateArray = {
    location: {
      currentLabLocation: currentLabLocation
    },
    connectivity: connectivityState
  };

  const mockOrchestratorApiService = {
    getStatusPages: (statusesPaginationRequest) => {
      return of(mockStatusPages);
    },
  };

  const mockStatusPages = {
    'statuses': [
      {
        'id': 'b7f2f77e-5ad8-4809-87f1-925a3c2a4634',
        'userName': 'tushar ad',
        'fileNames': [
          'Triglycerides.csv',
          'TSH.csv',
          'TIBC Total Iron Binding Capacity.csv',
          'Urea Nitrogen.csv',
          'Tobramycin.csv',
          'Uric Acid.csv'
        ],
        'uploadedDateTime': '2022-06-18T00:35:51.916427Z',
        'processedDateTime': null,
        'totalCount': 5096,
        'processedCount': 15502,
        'disabledCount': 728,
        'errorCount': 1684,
        'errorList': [],
        'status': 9,
        'isEdge': false,
        'connErrorCode': null,
        'connErrorType': 'Import Error'
      },
      {
        'id': 'b18c6827-c184-42d9-b676-7f2720a90a92',
        'userName': 'tushar ad',
        'fileNames': [
          'Protein, Total, Serum.csv',
          'Potassium.csv',
          'Prealbumin.csv',
          'Theophylline.csv',
          'T4, Total.csv',
          'T3 UptakeT Uptake.csv',
          'T4, Free.csv',
          'T3, Free.csv',
          'Salicylate.csv',
          'Sodium.csv'
        ],
        'uploadedDateTime': '2022-06-18T00:35:28.334389Z',
        'processedDateTime': null,
        'totalCount': 7280,
        'processedCount': 14879,
        'disabledCount': 728,
        'errorCount': 270,
        'errorList': [],
        'status': 9,
        'isEdge': false,
        'connErrorCode': null,
        'connErrorType': 'Import Error'
      },
      {
        'id': '809ba73b-7955-41ee-a7ee-8e2e2255cdd3',
        'userName': 'tushar ad',
        'fileNames': [
          'IgG.csv',
          'Lithium.csv',
          'Iron.csv',
          'Magnesium.csv'
        ],
        'uploadedDateTime': '2022-06-18T00:34:57.656311Z',
        'processedDateTime': null,
        'totalCount': 7280,
        'processedCount': 16647,
        'disabledCount': 0,
        'errorCount': 286,
        'errorList': [],
        'status': 9,
        'isEdge': false,
        'connErrorCode': null,
        'connErrorType': 'Import Error'
      }
    ],
    'pageIndex': 0,
    'totalPages': 2,
    'pageSize': 20,
    'totalItems': 40
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectivityStatusComponent],
      imports: [
NgxPaginationModule,
StoreModule.forRoot(fromRoot.reducers),
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
        { provide: IconService },
        { provide: Store, useValue: StateArray },
        { provide: CheckForTloaderService, useValue: MocCheckForTloaderService },
        { provide: OrchestratorApiService, useValue: mockOrchestratorApiService },
        provideMockStore(mockState),
        TranslateService,
      ]
    }).compileComponents();
    store = TestBed.get(Store);
    subStore = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(StateArray);
    subStore.setState(StateArray);
    fixture = TestBed.createComponent(ConnectivityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    destroy$ = new Subject<boolean>();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the pagination controls when statuses are not present or when only one status page is present', () => {
    component.statusList = null;
    fixture.detectChanges();

    let paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();
    component.paginationConfig.currentPage = mockStatusPages.pageIndex;
    component.paginationConfig.itemsPerPage = mockStatusPages.pageSize;
    component.paginationConfig.totalItems = mockStatusPages.pageSize * mockStatusPages.totalPages;
    fixture.detectChanges();

    paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();
  });

  it('should show the pagination controls when two status pages are present', () => {
    component.paginationConfig.currentPage = mockStatusPages.pageIndex;
    component.paginationConfig.itemsPerPage = mockStatusPages.pageSize;
    component.paginationConfig.totalItems = mockStatusPages.totalItems;
    fixture.detectChanges();

    const paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    expect(paginationButtons.length).toEqual(2);

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    expect(nextButton).toBeDefined();
    expect(nextButton.disabled).toBeFalsy();

    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    expect(prevButton).toBeDefined();
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should display statuses based on the Page selected in Pagination when we have multiple pages', () => {
    component.paginationConfig.currentPage = mockStatusPages.pageIndex;
    component.paginationConfig.itemsPerPage = mockStatusPages.pageSize;
    component.paginationConfig.totalItems = mockStatusPages.totalItems;
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    nextButton.click();
    fixture.detectChanges();
    expect(component.statusList).toBeTruthy();

    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    prevButton.click();
    fixture.detectChanges();
    expect(component.statusList).toBeTruthy();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    const secondPageButton = paginationButtons[1].nativeElement;
    secondPageButton.click();
    fixture.detectChanges();
    expect(component.statusList).toBeTruthy();
  });

  it('should create correct number of pages for pagination', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.paginationConfig.totalItems).
      toBeLessThanOrEqual(component.paginationConfig.itemsPerPage * component.paginationConfig.totalItems);
  });

});

