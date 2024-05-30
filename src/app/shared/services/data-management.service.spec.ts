// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';

import { LabProduct } from '../../contracts/models/lab-setup';
import { PortalApiService } from '../api/portalApi.service';
import { NodeInfoAction } from '../state/node-info.action';
import { DataManagementService } from './data-management.service';
import { LevelLoadRequest } from '../../contracts/models/portal-api/labsetup-data.model';
import { DataManagementAction } from './data-management.action';
import { DataManagementSpinnerService } from './data-management-spinner.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { AppNavigationTracking } from '../models/audit-tracking.model';
import { HttpLoaderFactory } from '../../app.module';

let service: DataManagementService;
const autofixture = new Autofixture();
const labProduct = autofixture.create(new LabProduct());
const ancestors = [
  {
    'displayName': ' Hemoglobin A1c',
    'testSpecId': '5',
    'correlatedTestSpecId': 'CF4619742EA04099A4A9463550E90305',
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
    'levelSettings': {
      'levelEntityId': null,
      'levelEntityName': 'LevelSetting',
      'parentLevelEntityId': 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
      'parentLevelEntityName': 'LabTest',
      'minNumberOfPoints': 0,
      'runLength': 0,
      'dataType': 0,
      'targets': null,
      'rules': null,
      'levels': [
        {
          'levelInUse': true,
          'decimalPlace': 0
        },
        {
          'levelInUse': false,
          'decimalPlace': 0
        },
        {
          'levelInUse': false,
          'decimalPlace': 0
        },
        {
          'levelInUse': false,
          'decimalPlace': 0
        },
        {
          'levelInUse': false,
          'decimalPlace': 0
        },
        {
          'levelInUse': false,
          'decimalPlace': 0
        },
        {
          'levelInUse': false,
          'decimalPlace': 0
        },
        {
          'levelInUse': false,
          'decimalPlace': 0
        },
        {
          'levelInUse': false,
          'decimalPlace': 0
        }
      ],
      'id': '20b951cf-bec0-fae5-4507-c98b5138d3a9',
      'parentNodeId': 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
      'parentNode': null,
      'nodeType': 8,
      'displayName': '20b951cf-bec0-fae5-4507-c98b5138d3a9',
      'children': null
    },
    'accountSettings': null,
    'hasOwnAccountSettings': false,
    'mappedTestSpecs': null,
    'id': 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
    'parentNodeId': '63a72dbf-49ce-44e5-b949-b43f7d512e73',
    'parentNode': null,
    'nodeType': 6,
    'children': null
  }
];

const mockAuditTrailValues: Array<AppNavigationTracking> = [
  {
    accountName: 'AB Testing Lab Data Upload ',
    eventDateTime: new Date('2023-02-22T07:30:44.693Z'),
    auditTrail: {
      action: 'Update',
      actionStatus: 'Success',
      currentValue: {
        isAction: true,
        action: 'Control reconstituted new',
        isComment: true,
        comment: 'New point edit test 1',
        levelData: [
          {
            level: 1,
            resultValue: 2
          }
        ]
      },
      eventType: 'Analyte Data Table',
      priorValue: {
        levelData: [
          {
            level: 1,
            resultValue: 1
          }
        ]
      },
      device_id: '71d26b6a-0f6b-40bc-bdcb-282076b672e8',
      runDateTime: new Date('2023-02-22T07:30:44.693Z')
    }
  }
];

const mockDataTimeHelper = { getTimeZoneOffset: () => '-8' };

const mockTranslationService = {
  getTranslatedMessage: () => { }
};

const portalApiServiceSpy = {
  getLabSetupNode: (nodeId: string, options: LevelLoadRequest) => of(labProduct),
  getLabSetupAncestors: (nodeId: string) => of(ancestors),
  getLabSetupNodeWithTestSettings: (nodeId: string, options: LevelLoadRequest) => of(labProduct),
};

const mockCodelistApiService = {
  getUnits: () => {
    return of('');
  }
};

describe('DataManagementService', () => {
  const mockStore = {
    security: null,
    auth: null,
    userPreference: null,
    router: null,
    navigation: null,
    location: null,
    account: null,
    uiConfigState: null,
    connectivity: null
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot([]),
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
        DataManagementService,
        DataManagementAction,
        NodeInfoAction,
        DataManagementSpinnerService,
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        { provide: Store, useValue: mockStore },
        { provide: PortalApiService, useValue: portalApiServiceSpy },
        { provide: DateTimeHelper, useValue: mockDataTimeHelper },
        TranslateService,
      ]
    });

    service = TestBed.get(DataManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should proccess history data when extractInteractions is called', () => {
    const processdData = service.extractInteractions(mockAuditTrailValues, 'America/Los_Angeles');
    const stringDate = processdData[0].dateTime.toString();
    expect(processdData[0].pezDateTimeOffset).toEqual('-8');
    expect(stringDate).toEqual(new Date('2023-02-22T07:30:44.693Z').toString());
  });
});
