/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
/* import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { TestSpecService } from './test-spec.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { ConfigService } from '../../core/config/config.service';
import { AppLoggerService } from './applogger/applogger.service';

describe('TestSpecService', () => {
  let service: TestSpecService;

  const mockTestSpecApiResponse = {
    '1': {
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
        shelfExpirationDate: new Date('2068-11-02T16:50:23.827')
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
        shelfExpirationDate: new Date('2068-11-02T16:50:23.827')
      }
    }
  };

  const mockCodelistApiService = {
    getTestSpecsByIds: () => {
      return of(mockTestSpecApiResponse);
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
        { provide: CodelistApiService, useValue: mockCodelistApiService },
        ConfigService,
        AppLoggerService
      ]
    });
    service = TestBed.inject(TestSpecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all test specs from API endpoint and testSpecCache updated', async() => {
    expect(service.testSpecCache).toBeFalsy();
    await service.getTestSpecs([1]);
    expect(service.testSpecCache).toBeTruthy();
  });

  it('should return the output from cache if already present', async() => {
    service.testSpecCache = mockTestSpecApiResponse;
    await service.getTestSpecs([1]);
    // the new testSpecCache object will be the same as it was previously as the data for id 1 alredy present
    expect(service.testSpecCache).toEqual(mockTestSpecApiResponse);
  });
});
 */
