// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'br-component-library';
import { ConfigurationsComponent } from './configurations.component';
import { ParsingEngineService } from '../../../shared/services/parsing-engine.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../app.module';
import { OrchestratorApiService } from '../../../shared/api/orchestratorApi.service';
import { LoggingApiService } from '../../../shared/api/logging-api.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';


describe('ConfigurationsComponent', () => {
  let component: ConfigurationsComponent;
  let fixture: ComponentFixture<ConfigurationsComponent>;

  const mockConfigurations = {
    'configs': [
      {
        'id': '00000000-0000-0000-0000-000000000000',
        'name': 'Rebel\'s Spacecraft Manual',
        'edgeDeviceIds': [
          '88888888-4444-4444-4444-cccccccccccc'
        ],
        'isGenericASTM': true,
        'handlesSlideGen': false,
        'createdTime': '2021-04-08T20:05:20.03Z',
        'isConfigured': false,
        'isDeletable': true,
        'isHavingMappings': true
      },
      {
        'id': '00000000-0000-0000-0000-000000000001',
        'name': 'Empire\'s Spacecraft Manual',
        'edgeDeviceIds': [],
        'isGenericASTM': false,
        'handlesSlideGen': false,
        'createdTime': '2021-04-08T20:05:20.03Z',
        'isConfigured': false,
        'isDeletable': true,
        'isHavingMappings': true
      }
    ],
    'unassociatedEdgeDeviceIds': [
      '88888888-4444-4444-4444-ffffffffffff'
    ]
  };
  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking']);

  const mocktransformers = [
    {
      'id': 'a1b42fbb-3a5d-49fc-b0e6-94092ee8013c',
      'name': 'Meditech QC summary',
      'handlesSlideGen': false,
      'edgeDeviceIds': [],
      'isGenericASTM': false,
      'createdTime': '2022-06-27T12:14:51.412365',
      'isConfigured': true,
      'transformerName': 'Universal Flex File Transformer',
      'transformerId': '3921'
    },
    {
      'id': 'a08803dc-81cd-4739-a263-ed22826e45ad',
      'name': 'ASTM 4.0 Point',
      'handlesSlideGen': false,
      'edgeDeviceIds': [
        '1234567'
      ],
      'isGenericASTM': true,
      'createdTime': '2023-01-25T10:37:48.969624',
      'isConfigured': true,
      'transformerName': '',
      'transformerId': ''
    },
    {
      'id': '2e765edd-92e8-4b7b-8b7c-e8d048e1f54d',
      'name': 'ray',
      'handlesSlideGen': false,
      'edgeDeviceIds': [],
      'isGenericASTM': false,
      'createdTime': '2022-06-30T08:20:23.321055',
      'isConfigured': false,
      'transformerName': 'ray',
      'transformerId': '1234',
      'isDeletable': true,
      'isHavingMappings': true
    },
    {
      'id': '6bb2c44c-34f4-476a-9311-cd113da0a370',
      'name': 'CPSI Data Details Transformer',
      'handlesSlideGen': false,
      'edgeDeviceIds': [],
      'isGenericASTM': false,
      'createdTime': '2022-06-27T12:14:51.412365',
      'isConfigured': true,
      'transformerName': 'Meditech Data Review By Activity Transformer v4.0',
      'transformerId': '3922'
    },
    {
      'id': '75eac019-5573-45fc-b9f2-13b69250a6cb',
      'name': ' MISYS QC Detail Report Transformer',
      'handlesSlideGen': false,
      'edgeDeviceIds': [],
      'isGenericASTM': false,
      'createdTime': '2022-06-27T12:14:51.412365',
      'isConfigured': true,
      'transformerName': 'Labdaq Daily Control Report Transformer v4.0',
      'transformerId': '3948'
    },
    {
      'id': '078e241a-e0b5-44b2-b632-74320013c3cc',
      'name': 'Cerner Millennium QC Results Listing',
      'handlesSlideGen': false,
      'edgeDeviceIds': [],
      'isGenericASTM': false,
      'createdTime': '2022-06-27T12:14:51.412365',
      'isConfigured': true,
      'transformerName': 'Cerner Millennium Monthly LJ Chart Transformer v4.0',
      'transformerId': '3961'
    }
  ];

  const mockParsingEngineService = {
    getInstructions(accountId: string): Observable<any> {
      return of(mockConfigurations);
    },
  };

  const mockOrchestratorApiService = {
    deleteConfiguration(data: any): Observable<any> {
      return of({});
    },
  };

  const appState = [];

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationsComponent],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        MatDialogModule,
        HttpClientModule,
        PerfectScrollbarModule,
        StoreModule.forRoot(appState),
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
        { provide: MatDialog, useValue: {} },
        { provide: ParsingEngineService, useValue: mockParsingEngineService },
        { provide: OrchestratorApiService, useValue: mockOrchestratorApiService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: MatDialogRef, useValue: { close: () => of({}) } },
        TranslateService,
        { provide: LoggingApiService, useValue: loggingApiServiceMock },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        HttpClient
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Create" link and configuration list', () => {
    component.configurationList = mocktransformers;
    component.configurationList.length = 6;
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('.spec-create-link').textContent).toContain('CONFIGURATION.CREATE');
  });

  it('should display create configuration form on click on configure button', async(() => {
    component.configurationList = mocktransformers;
    component.configurationList.length = 6;
    fixture.detectChanges();
    spyOn(component, 'createConfiguration').and.callThrough();
    const btn = fixture.debugElement.query(By.css('.spec-configure'));
    btn.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(component.createConfiguration).toHaveBeenCalledWith(component.dataSource[0]);
      expect(component.showCommonForm).toBe(true);
    });
  }));

  it('should display create configuration form on click on create link', async(() => {
    component.configurationList = mocktransformers;
    component.configurationList.length = 6;
    fixture.detectChanges();
    spyOn(component, 'createConfiguration').and.callThrough();
    const btn = fixture.debugElement.query(By.css('.spec-create-link'));
    btn.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(component.createConfiguration).toHaveBeenCalledWith();
      expect(component.showCommonForm).toBe(true);
    });
  }));

  it('should display configurations', async(() => {
    component.showConfigurations();
    component.showListing = true;
    fixture.detectChanges();
    expect(component.showEdgeForm).toBe(false);
    expect(component.showTransformersForm).toBe(false);
  }));

  it('should display transformer configuration form on click on edit button', async(() => {
    component.configurationList = mocktransformers;
    component.configurationList.length = 6;
    fixture.detectChanges();
    spyOn(component, 'createOrEditConfiguration').and.callThrough();
    spyOn(component, 'configureOrEditTransformer').and.callThrough();
    const btn = fixture.debugElement.query(By.css('.col-action'));
    btn.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(component.createOrEditConfiguration).toBeDefined();
      expect(component.configureOrEditTransformer).toBeDefined();
      expect(component.configurationList[0].isGenericASTM).toBe(false);
      expect(component.configurationList[0].isConfigured).toBe(true);
    });
  }));

  it('should delete configuration click on delete icon', async(() => {
    component.configurationList = mocktransformers;
    component.configurationList.length = 6;
    component.edgeList.length = 2;
    fixture.detectChanges();
    spyOn(component, 'onDeleteConfigClicked').and.callThrough();
    const btn = fixture.debugElement.query(By.css('.spec-delete'));
    btn.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(component.onDeleteConfigClicked).toHaveBeenCalled();
    });
  }));

  it('should display edge configuration form on click on edit button', async(() => {
    component.configurationList = mocktransformers;
    component.configurationList.length = 1;

    fixture.detectChanges();
    spyOn(component, 'createOrEditConfiguration').and.callThrough();
    spyOn(component, 'createOrEditEdgeConfiguration').and.callThrough();

    const btn = fixture.debugElement.query(By.css('.spec-edit-edge'));
    if (btn && btn.nativeElement && btn.nativeElement.click) {
      btn.nativeElement.click();
    }

    fixture.whenStable().then(() => {
      expect(component.createOrEditEdgeConfiguration).toBeDefined();
      expect(component.configurationList[0].isGenericASTM).toBe(false);
      expect(component.showEdgeForm).toBe(false);
    });
  }));
});
