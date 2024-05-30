//  © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, async   } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { groupBy, cloneDeep } from 'lodash';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';

import { ErrorLogService } from '../../../shared/services/error-log.service';
import * as actions from '../../../state/actions';
import { errorCodePrefix, groupByKey } from '../../../../../core/config/constants/general.const';
import { ImportError } from '../../../shared/models/connectivity-status.model';

import { ErrorLogComponent } from './error-log.component';
import { ImportStatusParam } from '../../../shared/models/connectivity-status.model';

describe('ErrorLogComponent', () => {
  let component: ErrorLogComponent;
  let app: any;
  let fixture: ComponentFixture<ErrorLogComponent>;
  let store: MockStore<any>;
  let subStore: MockStore<any>;
  let SpyonStore: any;
  const mockState = {};
  const mocErrorLogService = {
    showDetailsId: new EventEmitter<any>(),
  };

  const mockTranslationService = {
    get: (key: string) => {
      switch (key) {
        case 'ERRORCODE1':
          return of('A system error occurred while processing the data');
        case 'ERRORCODE2':
          return of('Data out of sequence');
        case 'ERRORCODE3':
          return of('Invalid date/time');
        case 'ERRORCODE4':
          return of('Control lot has expired');
        case 'ERRORCODE5':
          return of('Invalid result');
        case 'ERRORCODE6':
          return of('Missing required field');
        case 'ERRORCODE7':
          return of('Failure due to redundant data');
        case 'ERRORCODE8':
          return of('Instrument code is not defined');
        case 'ERRORCODE9':
          return of('Control lot code is not defined');
        case 'ERRORCODE10':
          return of('Analyte code is not defined');
        case 'ERRORCODE11':
          return of('Reagent lot code is not defined');
        case 'ERRORCODE12':
          return of('Calibrator lot code is not defined');
        case 'ERRORCODE13':
          return of('Test is not defined');
        case 'ERRORCODE14':
          return of('Invalid number of points');
        case 'ERRORCODE15':
          return of('Invalid mean');
        case 'ERRORCODE16':
          return of('Invalid standard deviation');
        case 'AnalyteRemoved':
          return of('Analyte has been removed');
        default:
          return of('');
      }
    },
  };
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
        uniqueServiceName:
          'Portal.Core.Models.Contact/Portal.Core.Models.Contact',
      },
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
        uniqueServiceName:
          'Portal.Core.Models.Address/Portal.Core.Models.Address',
      },
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
      children: null,
    },
    hasOwnAccountSettings: false,
    id: '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
    parentNodeId: 'b6e6e6e3-ed8e-4bc9-8b1b-3fcdfecd3476',
    parentNode: null,
    nodeType: 2,
    children: [],
  };

  const connectivityState = {
    hasInstructions: true,
    importStatusDetails: null,
    error: null,
  };
  const StateArray = {
    location: {
      currentLabLocation: currentLabLocation,
    },
    connectivity: connectivityState,
  };
  const ImportStatus = {
    'id': 'c1ddc078-721f-47a8-b4f9-614399ad1720',
    'userName': 'Anurag Bhonde',
    'fileNames': [
      'flex_transformer_point.txt'
    ],
    'uploadedDateTime': '2022-06-08T11:05:29.927125Z',
    'processedDateTime': '2022-06-08T11:05:59.256331Z',
    'totalCount': 3,
    'processedCount': 0,
    'disabledCount': 0,
    'errorCount': 3,
    'errorList': [
      {
        'labTestId': '1dfa780f-339f-447d-90e1-1bc65988194d',
        'processingErrorId': 2,
        'hierarchyPath': 'Lab - Connectivity-UX / AU400 / Multiqual 1,2,3 / Amylase',
        'details': '',
        'count': 3,
        'lastUpdated': '2022-06-08T11:05:59.256331Z'
      }
    ],
    'status': -4
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorLogComponent],
      providers: [
        { provide: TranslateService, useValue: mockTranslationService },
        { provide: ErrorLogService, useValue: mocErrorLogService },
        { provide: Store, useValue: StateArray },
        provideMockStore(mockState)
      ],
    });

    store = TestBed.get(Store);
    subStore = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(StateArray);
    subStore.setState(StateArray);
    fixture = TestBed.createComponent(ErrorLogComponent);
    component = fixture.componentInstance;
    app = fixture.debugElement.componentInstance;
    app.translate = mockTranslationService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the banner', async(() => {

    // Arrange
    app.errorLogService.showDetailsId.emit('');
    // Act
    app.close();
    // Assert
    app.errorLogService.showDetailsId.subscribe((data: any) => {
      app.showDetailsId = data;
      expect(app.showDetailsId).toBe('');
    });
  }));

  it('should hide details container div on click of Close button', () => {
    fakeAsync(() => {
      spyOn(component, 'close').and.callThrough();
      const closeButtonElement = fixture.debugElement.query(By.css('.spec_back'));
      closeButtonElement.nativeElement.click();
      fixture.whenStable().then(() => {
        expect(component.close).toHaveBeenCalled();
      });
    });
    fixture.detectChanges();
    const detailContainerElement = <HTMLElement>(
      fixture.debugElement.nativeElement.querySelector('.error-log-container')
    );
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const detailButtonElement = <HTMLElement>(
        fixture.debugElement.nativeElement.querySelector('.error-log-container')
      );
      expect(detailButtonElement).toBeFalsy();
    });
  });

  it('Should fetch import status Details and Error log', () => {

    SpyonStore = spyOn(subStore, 'dispatch');
    component.statusId = '43a1bd5e-d72b-45ee-b1f1-7d1e55b6ea3e';
    const importStatusParam: ImportStatusParam = {
      objectId: component.statusId,
    };
    component.getImportStatusDetails(component.statusId);
    expect(SpyonStore).toHaveBeenCalledTimes(1);
    expect(SpyonStore).toHaveBeenCalledWith(
      actions.connectivityActions.getImportStatusDetails({
        importStatusParam: importStatusParam,
      })
    );
  });

  it('should call getTranslatedText()', () => {
    app.translationService = mockTranslationService;
    const translationCode = 'ERRORCODE1';
    const message = app.getTranslation(translationCode);
    expect(message).toEqual('A system error occurred while processing the data');
  });

  it('should call getErrorsGroupByKey()', () => {
    const errorList = {
      'Lab - Connectivity-UX / AU400 / Multiqual 1,2,3 / Amylase': [{
        'labTestId': '1dfa780f-339f-447d-90e1-1bc65988194d',
        'processingErrorId': 2,
        'hierarchyPath': 'Lab - Connectivity-UX / AU400 / Multiqual 1,2,3 / Amylase',
        'details': ' Data out of sequence. ',
        'count': 3,
        'lastUpdated': '2022-06-08T09:22:59.219442Z'
      }]
    };
    app.getErrorsGroupByKey(errorList);
    const result = groupBy(errorList, groupByKey);
    expect(result).toBeTruthy();
  });

  it('should call populateTranslatedErrors()', () => {
    const errorList = [
      {
        'labTestId': '1dfa780f-339f-447d-90e1-1bc65988194d',
        'processingErrorId': 2,
        'hierarchyPath': 'Lab - Connectivity-UX / AU400 / Multiqual 1,2,3 / Amylase',
        'details': ' Data out of sequence. ',
        'count': 3,
        'lastUpdated': '2022-06-08T11:05:59.256331Z'
      }
    ];
    SpyonStore = spyOn(app, 'populateTranslatedErrors');
    app.populateTranslatedErrors(errorList);
    if (errorList) {
      const tempErrorlist = cloneDeep(errorList);
      tempErrorlist.map((error: ImportError) => {
        const errorId = error.processingErrorId;
        const translateErrorCode = errorCodePrefix + errorId;
        expect(translateErrorCode).toEqual('ERRORCODE2');
      });
      app.groupedObject = component.getErrorsGroupByKey(tempErrorlist);
      expect(app.groupedObject).toBeTruthy();
    }
  });

  it('should display Out Of Sequence Error for error code 1', () => {
    const errorList = [
      {
        labTestId: '56e06edf-0367-414e-a918-5e8fd70d8248',
        processingErrorId: 1,
        hierarchyPath:
          'Department4Report / VITROS 350 / Multiqual 1,2,3 / CK (Creatine Kinase)',
        details: '45830',
        count: 1,
        lastUpdated: '2022-03-11T13:04:08.814112Z',
      },
    ];
    fakeAsync(() => {
      component.statusId = '43a1bd5e-d72b-45ee-b1f1-7d1e55b6ea3e';
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const compiled_title = <HTMLElement>(
          fixture.debugElement.nativeElement.querySelector('.spec-hierarchyPath')
        );
        expect(compiled_title.textContent).toEqual(errorList[0].hierarchyPath);
        expect(errorList[0].processingErrorId).toEqual(1);
        expect(mockTranslationService.get).toHaveBeenCalledWith('ERRORCODE1');
      });
    });
  });

  it('should display Out Of Sequence Error for error code 2', () => {
    const errorList = [{
      'labTestId': '56e06edf-0367-414e-a918-5e8fd70d8248',
      'processingErrorId': 2,
      'hierarchyPath': 'Department4Report / VITROS 350 / Multiqual 1,2,3 / CK (Creatine Kinase)',
      'details': '45830',
      'count': 1,
      'lastUpdated': '2022-03-11T13:04:08.814112Z'
    }];
    fakeAsync(() => {
      component.statusId = '43a1bd5e-d72b-45ee-b1f1-7d1e55b6ea3e';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const compiled_title = <HTMLElement>(
          fixture.debugElement.nativeElement.querySelector('.spec-hierarchyPath')
        );
        expect(compiled_title.textContent).toEqual(errorList[0].hierarchyPath);
        expect(errorList[0].processingErrorId).toEqual(2);
        expect(mockTranslationService.get).toHaveBeenCalledWith('ERRORCODE2');
      });
    });
  });

  it('should display Out Of Sequence Error for error code 3', () => {
    const errorList = [{
      'labTestId': '56e06edf-0367-414e-a918-5e8fd70d8248',
      'processingErrorId': 3,
      'hierarchyPath': 'Department4Report / VITROS 350 / Multiqual 1,2,3 / CK (Creatine Kinase)',
      'details': '45830',
      'count': 1,
      'lastUpdated': '2022-03-11T13:04:08.814112Z'
    }];
    fakeAsync(() => {
      component.statusId = '43a1bd5e-d72b-45ee-b1f1-7d1e55b6ea3e';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const compiled_title = <HTMLElement>(
          fixture.debugElement.nativeElement.querySelector('.spec-hierarchyPath')
        );
        expect(compiled_title.textContent).toEqual(errorList[0].hierarchyPath);
        expect(errorList[0].processingErrorId).toEqual(3);
        expect(mockTranslationService.get).toHaveBeenCalledWith('ERRORCODE1');
      });
    });
  });



  it('should display Out Of Sequence Error for error code 4', () => {
    const errorList = [{
      'labTestId': '56e06edf-0367-414e-a918-5e8fd70d8248',
      'processingErrorId': 4,
      'hierarchyPath': 'Department4Report / VITROS 350 / Multiqual 1,2,3 / CK (Creatine Kinase)',
      'details': '45830',
      'count': 1,
      'lastUpdated': '2022-03-11T13:04:08.814112Z'
    }];
    fakeAsync(() => {
      component.statusId = '43a1bd5e-d72b-45ee-b1f1-7d1e55b6ea3e';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const compiled_title = <HTMLElement>(
          fixture.debugElement.nativeElement.querySelector('.spec-hierarchyPath')
        );
        expect(compiled_title.textContent).toEqual(errorList[0].hierarchyPath);
        expect(errorList[0].processingErrorId).toEqual(4);
        expect(mockTranslationService.get).toHaveBeenCalledWith('ERRORCODE4');
      });
    });
  });


});
