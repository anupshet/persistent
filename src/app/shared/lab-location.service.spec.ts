// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async   } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { Autofixture } from 'ts-autofixture/dist/src';

import { LabLocationService } from './lab-location.service';
import { ApiService } from './api/api.service';
import { ConfigService } from '../core/config/config.service';
import { LabLocation } from '../contracts/models/lab-setup';
import { LocationPost } from '../contracts/models/lab-setup/location-post.model';

describe('LabLocationService', () => {
  const State = [];
  const autofixture = new Autofixture();
  const labLocation = autofixture.create(new LabLocation());
  let sut: LabLocationService;

  // Service Mocks
  const ApiServiceStub = {
    get: (): Observable<LabLocation> => {
      return of(labLocation);
    },
    put: (model: LabLocation): Observable<LabLocation> => {
      return of(labLocation);
    },
    post: (model: LocationPost): Observable<LabLocation> => {
      return of(labLocation);
    },
    del: (id: number): Observable<string> => {
      return of('deleted');
    }
  };

  const ConfigServiceStub = {
    const: {
      apiMethods: {
        unApi: {
          labLocation: {
            labLocations: 'labLocationsUrl',
            labLocationsId: 'labLocationsIdUrl',
            labLocationId: 'labLocationIdUrl'
          }
        }
      }
    }
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          NgReduxTestingModule,
          StoreModule.forRoot(State)
        ],
        providers: [
          [
            LabLocationService,
            { provide: ApiService, useValue: ApiServiceStub },
            { provide: ConfigService, useValue: ConfigServiceStub }
          ]
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    sut = TestBed.get(LabLocationService);
  });

});
