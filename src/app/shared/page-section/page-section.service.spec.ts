import { TestBed, async   } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';

import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';

import { PageSectionService } from './page-section.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { AppLoggerService } from '../services/applogger/applogger.service';
import { AuthenticationService } from '../../security/services';
import { LabTestService } from '../services/test-run.service';
import { RunsService } from '../services/runs.service';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { DataManagementService } from '../services/data-management.service';
import { HttpLoaderFactory } from '../../app.module';

describe('PageSectionService', () => {
  let service: PageSectionService;

  const mockCodeListService = {
    getTestInfoFromCodeList() { },
    getReagentLotsByReagentId() { },
    getCalibratorLotsByCalibratorId() { },
    getTestById() { },
    getTestSpecById() { },
    getUserActionsAsync() { }
  };
  const mockAuthenticationService = jasmine.createSpy('getCurrentUser', () => { });
  const mockLabTestService = jasmine.createSpyObj([
    'getLabTest',
    'putLabTest',
    'postLabTest'
  ]);
  const mockRunsService = jasmine.createSpy('extractPointDataResultStatus', () => { });
  const mockDateTimeHelper = jasmine.createSpyObj([
    'getTimeZoneOffset',
    'getLastDayOfPreviousMonth'
  ]);
  const mockDataManagementService = jasmine.createSpy('getPortalProductByLabInstrumentProductLotIdAsync', () => { });

  beforeEach(async(() => {
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
      declarations: [],
      providers: [
        PageSectionService,
        AppLoggerService,
        { provide: DataManagementService, useValue: mockDataManagementService },
        { provide: DateTimeHelper, useValue: mockDateTimeHelper },
        { provide: RunsService, useValue: mockRunsService },
        { provide: LabTestService, useValue: mockLabTestService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: CodelistApiService, useValue: mockCodeListService },
        TranslateService,
        { provide: Store, useValue: [] },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(PageSectionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
