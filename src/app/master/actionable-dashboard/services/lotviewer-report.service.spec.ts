// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing/ng-redux-testing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async   } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { LotViewerService } from '../../../shared/api/lotViewer.service';
import { LotviewerReportService } from './lotviewer-report.service';
import { LotviewerReportType } from '../../../contracts/enums/lotviewer/lotviewer-reporttype.enum';
import { TranslateService } from '@ngx-translate/core';

describe('LotviewerReportService', () => {
  let sut: LotviewerReportService;
  let locationPayload = {
    allowedShipTo: "",
    locationId: "abf29e2f-72ed-4620-89a3-d0d74d2197e1"
  }
  const lotViewerServiceStub = {
    getLotviewerReport: (): Observable<LotviewerReportType> => {
      return of(LotviewerReportType.LabProfile);
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
        LotviewerReportService,
        { provide: TranslateService, useValue: { get: tag => of(tag) } },
        { provide: LotViewerService, useValue: lotViewerServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    sut = TestBed.get(LotviewerReportService);
  });

  it('should create', () => {
    expect(sut).toBeTruthy();
  });

  it('should get the report successfully', () => {
    sut.getLotviewerReport(LotviewerReportType.LabProfile, locationPayload);
    spyOn(lotViewerServiceStub, 'getLotviewerReport').and.callThrough();
    expect(sut.getLotviewerReport).toBeDefined();
    expect(lotViewerServiceStub.getLotviewerReport).toBeDefined();
  });

});
