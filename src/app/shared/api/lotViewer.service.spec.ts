// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { of, Observable } from 'rxjs';

import { ApiService } from '../../shared/api/api.service';
import { ConfigService } from '../../core/config/config.service';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { LotViewerService } from './lotViewer.service';
import { LotviewerReportType } from '../../contracts/enums/lotviewer/lotviewer-reporttype.enum';
import { TranslateService } from '@ngx-translate/core';

let service: LotViewerService;
let datePipe: DatePipe;
let locationPayload = {
  allowedShipTo: "",
  locationId: "abf29e2f-72ed-4620-89a3-d0d74d2197e1"
}

const apiServiceSpy = {
  get: (path: string, responseType?: string, showAsBusy?: boolean): Observable<any> => {
    return of({});
  }
};

const ConfigServiceStub = {
  getConfig: (string): string => {
    return 'result';
  }
};

describe('LotViewerApiService', () => {
  const State = [];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgReduxTestingModule,
        StoreModule.forRoot(State)
      ],
      providers: [
        DatePipe,
        LotViewerService,
        { provide: TranslateService, useValue: { get: tag => of(tag) } },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ConfigService, useValue: ConfigServiceStub }
      ]
    });

    service = TestBed.inject(LotViewerService);
    datePipe = TestBed.inject(DatePipe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pass the correct request URL to the API for getting lot viewer report type', () => {
    spyOn(service, 'post').and.returnValue(of({}));
    // If Sales Role
    service.getLotviewerReport(LotviewerReportType.LotVisiblitySales, locationPayload);
    expect(service.post).toHaveBeenCalledWith(`powerbi/embedtoken/${LotviewerReportType.LotVisiblitySales}`, locationPayload, false);

    // If User Role
    service.getLotviewerReport(LotviewerReportType.LotVisiblityUser, locationPayload);
    expect(service.post).toHaveBeenCalledWith(`powerbi/embedtoken/${LotviewerReportType.LotVisiblityUser}`, locationPayload, false);
  });

});
