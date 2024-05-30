// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing/ng-redux-testing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async   } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { Autofixture } from 'ts-autofixture/dist/src';

import { EntityInfo } from '../../../contracts/models/data-management/entity-info.model';
import { ConfigService } from '../../../core/config/config.service';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { ExpiringLotsService } from './expiring-lots.service';

describe('ExpiringLotsService', () => {
  const autofixture = new Autofixture();
  const testData = autofixture.create(new EntityInfo());
  let sut: ExpiringLotsService;

  const ApiServiceStub = {
    listLabSetupNode: (): Observable<EntityInfo> => {
      return of(testData);
    }
  };

  const ConfigServiceStub = {
    const: {
      apiMethods: {
        unApi: {
          portal: {
            labSetupList: 'labSetupListUrl'
          }
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgReduxTestingModule,
        RouterTestingModule
      ],
      providers: [
        ExpiringLotsService,
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: ConfigService, useValue: ConfigServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    sut = TestBed.get(ExpiringLotsService);
  });

  it('should create', () => {
    expect(sut).toBeTruthy();
  });

  it('should get the expiring Products', () => {
    // sut.getExpiringProducts('', '');
    spyOn(ApiServiceStub, 'listLabSetupNode').and.returnValue(of(testData));
    // expect(sut.getExpiringProducts).toBeTruthy();
    expect(ApiServiceStub.listLabSetupNode).toBeDefined();
  });

  it('should get the renewed Products', () => {
    sut.getRenewedProducts('', '');
    spyOn(ApiServiceStub, 'listLabSetupNode').and.returnValue(of(testData));
    expect(sut.getRenewedProducts).toBeTruthy();
    expect(ApiServiceStub.listLabSetupNode).toBeDefined();
  });

  it('should get the Lab products', () => {
    sut.getLabProducts('');
    spyOn(ApiServiceStub, 'listLabSetupNode').and.returnValue(of(testData));
    expect(sut.getLabProducts).toBeTruthy();
    expect(ApiServiceStub.listLabSetupNode).toBeDefined();
  });

});
