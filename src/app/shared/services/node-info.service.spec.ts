/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { NodeInfoService } from './node-info.service';
import { PortalApiService } from '../api/portalApi.service';
import { ConfigService } from '../../core/config/config.service';
import { AppLoggerService } from './applogger/applogger.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { NodeInfoAction } from '../state/node-info.action';
import { TreePill } from '../../contracts/models/lab-setup';

describe('NodeInfoService', () => {
  let service: NodeInfoService;

  const ancestors = [[{
    displayName: 'IgE',
    id: 'af56e051-3717-4b52-9244-cadf33d6e724',
    parentNodeId: '5bb2fab0-6358-412e-b606-3636c4fc0b84',
    nodeType: 6,
    children: [],
    testSpecInfo: {
      id: 1,
      testId: 1,
      analyteStorageUnitId: 666,
      analyteId: 2566,
      analyteName: ' Hemoglobin A1c',
      methodId: 22,
      methodName: 'HPLC',
      instrumentId: 2749,
      instrumentName: 'D-10',
      reagentId: 664,
      reagentManufacturerId: null,
      reagentManufacturerName: 'Bio-Rad',
      reagentName: 'D-10 Dual HbA1c/A2/F (220-0201)',
      reagentLotId: 1,
      reagentLotNumber: 'Unspecified ***',
      reagentLot: {
        id: 1,
        reagentId: 664,
        lotNumber: 'Unspecified ***',
        shelfExpirationDate: '2068-11-02T16:50:23.827'
      },
      storageUnitId: 93,
      storageUnitName: '%',
      calibratorId: 1,
      calibratorManufacturerId: null,
      calibratorManufacturerName: 'Bio-Rad',
      calibratorName: 'D-10 Dual A2/F/A1c Calibrator',
      calibratorLotId: 1,
      calibratorLotNumber: 'Unspecified ***',
      calibratorLot: {
        id: 1,
        calibratorId: 1,
        lotNumber: 'Unspecified ***',
        shelfExpirationDate: '2068-11-02T16:50:23.827'
      }
    }
  },
  {
    id: '5bb2fab0-6358-412e-b606-3636c4fc0b84',
    nodeType: 5,
    parentNodeId: '4c85f20c-b507-4f82-8f78-1cc5c14f3e51',
    displayName: 'control 1',
    lotInfo: {
      id: 73,
      productId: 2,
      productName: 'Assayed Chemistry',
      lotNumber: '26440',
      expirationDate: new Date()
    },
    children: [
      {
        displayName: 'IgE',
        id: 'af56e051-3717-4b52-9244-cadf33d6e724',
        parentNodeId: '5bb2fab0-6358-412e-b606-3636c4fc0b84',
        nodeType: 6,
        children: []
      }
    ]
  },
  {
    displayName: 'Archi300',
    instrumentId: '1254',
    instrumentCustomName: 'Archi300',
    instrumentSerial: '123',
    instrumentInfo: {
      id: 1254,
      name: 'ARCHITECT c16000',
      manufacturerId: '1',
      manufacturerName: 'Abbott'
    },
    levelSettings: {
      levelEntityId: 'A914E73C1F124BEF909053B1BEB2ED19',
      levelEntityName: 'LabInstrument',
      parentLevelEntityId: '0',
      parentLevelEntityName: 'ROOT',
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 1,
      targets: [{
        controlLotId: '261',
        controlLevel: '1',
        mean: 0,
        sd: 0,
        points: 0
      }],
      rules: [
        {
          id: '1',
          category: '1k',
          k: '3',
          disposition: 'N'
        },
        {
          id: '1',
          category: '1k',
          k: '2',
          disposition: 'N'
        }
      ],
      levels: [{
        levelInUse: false,
        decimalPlace: 2
      }]
    },
    id: 'A914E73C1F124BEF909053B1BEB2ED19',
    parentNodeId: 'b5401afc-d62f-4580-a89f-5b874905b318',
    parentNode: null,
    nodeType: 4,
    children: []
  }]];

  const mockPortalApiService = {
    getLabSetupAncestorsMultiple: (nodeId: string): Observable<TreePill[][]> => {
      return of(ancestors);
    }
  };

  const mockCodelistApiService = {
    getUnits: () => {
      return of([]);
    },
    getConfig: () => {
      return { 'portalUrl': '' };
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        StoreModule.forRoot([])
      ],
      providers: [
        { provide: Store, useValue: [] },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        AppLoggerService,
        ConfigService,
        DatePipe,
        NodeInfoAction,
        provideMockStore({})
      ]
    });
    service = TestBed.inject(NodeInfoService);
    service.getAncestorsState$ = of(ancestors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get header details when fetchHeaderDetails called', () => {
    service.currentHeaderData.pipe(take(1)).subscribe(d => expect(d).toBeFalsy()).unsubscribe();
    service.fetchHeaderDetails('af56e051-3717-4b52-9244-cadf33d6e724');
    service.currentHeaderData.pipe(filter(_d => !!_d), take(1)).subscribe(d => expect(d).toBeTruthy()).unsubscribe();
  });
});
