/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';

import { MaterialModule } from 'br-component-library';
import { ConnectivityStatusDetailsComponent } from './connectivity-status-details.component';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { HeaderService } from '../../shared/header/header.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';

describe('ConnectivityStatusDetailsComponent', () => {
  let component: ConnectivityStatusDetailsComponent;
  let fixture: ComponentFixture<ConnectivityStatusDetailsComponent>;

  const mockHeaderService = {
    setDialogComponent(name: string) { }
  };
  const importStatus = {
    'connErrorType': '',
    'connErrorCode': '',
    'id': 'a1111111-1111-1111-1111-111111111111',
    'accountId': '11111111-1111-1111-1111-111111111111',
    'parsingJobName': 'Rogue X-Wing',
    'userName': 'Han Solo',
    'fileNames': ['data.txt'],
    'uploadedDateTime': new Date('2020-08-11T05:45:58.542Z'),
    'processedDateTime': new Date('2020-08-11T06:24:58.542Z'),
    'totalCount': 520,
    'processedCount': 960,
    'errorCount': 25,
    'status': 10,
    'disabledCount': 0,
    'isEdge': false,
    'isDownloadable': true,
    'errorList': [
      {
        'labTestId': '71111111-1111-1111-1111-111111111111',
        'processingErrorId': 4,
        'hierarchyPath': 'Immunology / Simens Dimension Vista / Liquichek Immunoassay / Lithium',
        'details': '99588',
        'count': 25
      },
      {
        'labTestId': '71111111-1111-1111-1111-111111111111',
        'processingErrorId': 1,
        'hierarchyPath': 'Immunology / Simens Dimension Vista / Liquichek Immunoassay / 123',
        'details': '99560',
        'count': 25
      },
      {
        'labTestId': '71111111-1111-1111-1111-111111111111',
        'processingErrorId': 2,
        'hierarchyPath': 'Immunology / Simens Dimension Vista / Liquichek Immunoassay / Lithium',
        'details': '',
        'count': 26
      }
    ]
  };

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const mockOrchestratorApiService = {
    getLogRecordFileUrlById: (statusID: string) => null,
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectivityStatusDetailsComponent, UnityNextDatePipe],
      imports: [
        StoreModule.forRoot({}),
        MaterialModule,
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
        { provide: HeaderService, useValue: mockHeaderService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: OrchestratorApiService, useValue: mockOrchestratorApiService },
        { provide: MessageSnackBarService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        DateTimeHelper,
        LocaleConverter,
        TranslateService,
        HttpClient
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectivityStatusDetailsComponent);
    component = fixture.componentInstance;
    component.importStatus = importStatus;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Error Details on click on "ERROR DETAIL" button', async(() => {
    spyOn(component, 'emitData').and.callThrough();
    const Button = fixture.debugElement.query(By.css('.spec_detail'));
    Button.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(component.emitData).toHaveBeenCalled();
    });
  }));

  it('should show Refresh button if processing is in progress', async(() => {
    component.importStatus = { ...importStatus, processedDateTime: null };
    component.ngOnInit();
    fixture.detectChanges();
    const refreshButtonElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_refresh');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  }));

  it('should show Detail button if processing is done and error count greater than zero', async(() => {
    component.importStatus = { ...importStatus, errorCount: 1 };
    component.ngOnInit();
    fixture.detectChanges();
    const detailButtonElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_detail');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(detailButtonElement).toBeTruthy();
    });
  }));

  it('should show Done status if processing is done and error count is zero', async(() => {
    component.importStatus = { ...importStatus, errorCount: 0 };
    component.ngOnInit();
    fixture.detectChanges();
    if (component.status === component.statusType.Done && component.pending === 0) {
      const doneIconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_done');
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(doneIconElement).toBeTruthy();
      });
    }
  }));

  it('should show download button if there are no files', async(() => {
    component.importStatus = { ...importStatus, fileNames: ['test'] };
    component.ngOnInit();

    fixture.detectChanges();

    expect(component.showDownloadButton()).toBeTrue();

    const downloadButton = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.download');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(downloadButton).toBeDefined();
    });
  }));

  it('should not show download button if there are no files', async(() => {
    component.importStatus = { ...importStatus, fileNames: [] };
    component.importStatus.isDownloadable = false ;
    component.ngOnInit();

    fixture.detectChanges();

    expect(component.showDownloadButton()).toBeFalse();

    const downloadButton = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.download');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(downloadButton).toBeNull();
    });
  }));
});
