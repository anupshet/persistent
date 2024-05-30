// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { NgReduxModule } from '@angular-redux/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpHandler } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Observable, of } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';
import { BrInfoTooltip } from 'br-component-library';

import { ConnectivityComponent } from './connectivity.component';
import { SharedModule } from '../../shared/shared.module';
import {
  InstructionsComponent,
  InstructionsRulesComponent,
  InstructionsTableComponent,
} from './instructions';
import { MappingComponent } from './mapping/';
import { UploadComponent } from './upload/upload.component';
import { HeaderService } from './shared/header/header.service';
import {
  DropdownFilterComponent,
  EntityMapComponent,
  InstrumentMapComponent,
  MapHeaderComponent,
  MappingDialogComponent,
  ProductMapComponent,
  ReagentCalibratorDialogComponent,
  SideNavigationComponent,
  TestMapComponent
} from './mapping/';
import { MappingService } from './mapping/mapping.service';
import { ParsingEngineService } from '../../shared/services/parsing-engine.service';
import { InstructionIdName, ParsingJobConfig } from '../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { FileReceiveService } from './shared/services/file-receive.service';
import { FileVerificationService } from './shared/services/file-verification.service';
import { ApiService } from '../../shared/api/api.service';
import { ConnectivityMappingApiService } from '../../shared/api/connectivityMappingApi.service';
import { ConfigService } from '../../core/config/config.service';
import { AppLoggerService } from '../../shared/services/applogger/applogger.service';
import { CodelistApiService } from '../../shared/api/codelistApi.service';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../contracts/models/shared/br-error.model';
import { InstructionsService } from './instructions/instructions.service';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../app.module';
import { LoggingApiService } from '../../shared/api/logging-api.service';

// tslint:disable-next-line:component-selector
@Component({ selector: 'unext-connectivity-header', template: '' })
class HeaderStubComponent { }

const activatedRouteStub = new ActivatedRouteStub(null, { entityId: '1' });

const mockBrPermissionsService = {
  hasAccess: () =>  true,
};

describe('ConnectivityComponent', () => {
  const autofixture = new Autofixture();
  let component: ConnectivityComponent;
  let fixture: ComponentFixture<ConnectivityComponent>;
  const appState = [];
  const instructionsStub = autofixture.createMany(new InstructionIdName);
  let de: DebugElement;
  let parsingEngineService: ParsingEngineService;
  let _headerService: HeaderService;

  const mockUser = {
    accountId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
    accountLocationTimeZone: 'Asia/Kolkata',
    accountNumber: '101006',
    labId: 'b6e6e6e3-ed8e-4bc9-8b1b-3fcdfecd3476',
    userId: '35cfd3cc-ff95-48bc-a983-e8527e14f0d2',
    userName: 'vishwajit shinde'
  };

  const mockParsingEngineService = {
    getInstructions(accountId: string): Observable<any> {
      return of({
        configs: Array<ParsingJobConfig>(),
        unassociatedEdgeDeviceIds: []
      });
    }
  };
  const headerServiceMock = {
    getDialogComponent: () => {
      return of({
        componentName: 'status'
      });
    },

    getDialogComponentMapping: () => {
      return of({});
    }
  };

  const mockFileReceiveService = {
    postFileData(labId: string, formData: any): Observable<any> {
      return of({});
    },

    updateFileStatus(data: any): Observable<any> {
      return of({});
    }
  };

  const mockApiService = {
    putFileWithS3(fileData: any): Observable<any> {
      return of({});
    }
  };

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };
  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgReduxModule,
        PerfectScrollbarModule,
        SharedModule,
        BrInfoTooltip,
        RouterTestingModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(appState),
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
      declarations: [
        ConnectivityComponent,
        HeaderStubComponent,
        InstructionsComponent,
        InstructionsRulesComponent,
        InstructionsTableComponent,
        MappingComponent,
        UploadComponent,
        DropdownFilterComponent,
        EntityMapComponent,
        InstrumentMapComponent,
        MapHeaderComponent,
        MappingDialogComponent,
        ProductMapComponent,
        ReagentCalibratorDialogComponent,
        SideNavigationComponent,
        TestMapComponent
      ], providers: [
        MappingService,
        ConnectivityMappingApiService,
        HttpClient,
        HttpHandler,
        ConfigService,
        AppLoggerService,
        CodelistApiService,
        { provide: HeaderService, useValue: headerServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: { mockUser } },
        { provide: MatDialogRef, useValue: {} },
        { provide: ParsingEngineService, useValue: mockParsingEngineService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: FileReceiveService, useValue: mockFileReceiveService },
        FileVerificationService,
        { provide: ApiService, useValue: mockApiService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: LoggingApiService, useValue: loggingApiServiceMock },
        {
          provide: InstructionsService,
          useValue: {
            getStep: () => of({}),
            getNextBtnState: () => of({}),
            getResetBtnState: () => of({}),
            setNewPath: () => of({})
          }
        },
        TranslateService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectivityComponent);
    component = fixture.componentInstance;
    parsingEngineService = TestBed.get(ParsingEngineService);
    _headerService = TestBed.get(HeaderService);
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should set new path on active link', () => {
    const spy = spyOn(component, 'setNewPath').and.callThrough();
    component.showUpload = true;
    fixture.detectChanges();
    const uploadComp = de.query(By.directive(UploadComponent));
    const cmp = uploadComp.componentInstance;
    cmp.activeLink.emit('status');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('status');
    });
  });
});
