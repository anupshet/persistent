/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { DatePipe, DecimalPipe } from '@angular/common';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdvancedLjPanelComponent } from '../../master/data-management/advanced-lj/advanced-lj-panel/advanced-lj-panel.component';
import { ImageToPdfService } from './image-to-pdf.service';
import { AppLoggerService } from './applogger/applogger.service';
import { RunsService } from '../services/runs.service';
import { NodeInfoService } from '../services/node-info.service';
import { PortalApiService } from '../api/portalApi.service';
import { ConfigService } from '../../core/config/config.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { NodeInfoAction } from '../state/node-info.action';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { LocaleConverter } from '../locale/locale-converter.service';
import { imageToPdfTestContent } from './image-to-pdf-test-content.model';
import { BrError } from '../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from './errorLogger/error-logger.service';
import { SummaryStatisticsTableService } from '../../master/data-management/analyte-detail-table/analytical-section/summary-statistics-table/summary-statistics-table.service';
import { DynamicReportingService } from './reporting.service';
import { HttpLoaderFactory } from '../../app.module';
import { LoggingApiService } from '../api/logging-api.service';
import { UnityNextDatePipe } from '../../shared/date-time/pipes/unity-next-date.pipe';


describe('ImageToPdfService', () => {
  let service: ImageToPdfService;
  let component: AdvancedLjPanelComponent;
  let fixture: ComponentFixture<AdvancedLjPanelComponent>;
  let de: DebugElement;

  const initInput = {
    analyteName: 'ALT (ALAT/GPT)',
    startDate: new Date('Tue Jul 13 2021 00:00:00 GMT-0700 (Pacific Daylight Time)'),
    endDate: new Date('Thu Aug 12 2021 23:59:59 GMT-0700 (Pacific Daylight Time)')
  };

  const runsServiceMock = {
    getRawDataPageByLabTestId: () => of([]).toPromise()
  };

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockTestSpecSummaryStatisticsTableService = {
    getSummaryStatsByLabMonthStatsInfoAndDate: () => of([]).toPromise()
  };

  const mockTestSpecDynamicReportingService = {
    getStatisticsPeerAndMethodData: () => of([]).toPromise()
  };

  const mockLoggingApiService = {
    auditTracking: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientModule,
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
      declarations: [AdvancedLjPanelComponent, UnityNextDatePipe],
      providers: [
        AppLoggerService,
        { provide: MatDialog, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: Store, useValue: [] },
        { provide: RunsService, useValue: runsServiceMock },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: SummaryStatisticsTableService, useValue: mockTestSpecSummaryStatisticsTableService },
        { provide: DynamicReportingService, useValue: mockTestSpecDynamicReportingService },
        {
          provide: LoggingApiService, useValue: mockLoggingApiService
        },
        NodeInfoService,
        PortalApiService,
        ConfigService,
        DatePipe,
        CodelistApiService,
        NodeInfoAction,
        DateTimeHelper,
        LocaleConverter,
        provideMockStore({}),
        TranslateService,
        DecimalPipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(AdvancedLjPanelComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    service = TestBed.inject(ImageToPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should download the pdf', () => {
    const spy = spyOn(service, 'generatePdfFromImage').and.callThrough();
    component.setTimeFrame(initInput.startDate, initInput.endDate);
    component.analyteName = initInput.analyteName;
    component.chartPngSrc = new imageToPdfTestContent().pngImage;
    component.chartWidth = 1450;
    component.chartHeight = 1680;
    component.pdfHeaderArray = ['analyteName', 'hierarchyText', 'labelmethod', 'method', 'LABELREAGENT', 'reagent', 'LABELCALIBRATOR', 'calibrator', 'LABELUNIT', 'unit'];
    component.selectedLevels = [1];
    component.downloadPdf();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
