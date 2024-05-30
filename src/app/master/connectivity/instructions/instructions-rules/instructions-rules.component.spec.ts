// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { of, Observable } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';
import { ActivatedRouteStub } from '../../../../../testing/activated-route-stub';
import { InstructionsRulesComponent } from './instructions-rules.component';
import { ParsingEngineService } from '../../../../shared/services/parsing-engine.service';
import { ParsingJobConfig } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { LoggingApiService } from '../../../../shared/api/logging-api.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

describe('InstructionsRulesComponent', () => {
  let component: InstructionsRulesComponent;
  let fixture: ComponentFixture<InstructionsRulesComponent>;
  const activatedRouteStub = new ActivatedRouteStub(null, { id: '1' });

  const formBuilder: FormBuilder = new FormBuilder();
  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking']);
  const auditTrackingServiceSpy = jasmine.createSpyObj('AppNavigationTrackingService', ['sendAuditTrailPayload',
    'createAuditTrailPayload']);

  const mockInstructionsForm = formBuilder.group({
    instructionName: '',
    edgeBoxIdentifier: '',
    dataEntry: true,
    instrumentCode: '',
    staticInstrumentCode: '',
    productLotLevel: '',
    testCode: '',
    dateTimeFormats: [],
    dateTimeResulted: '',
    timeResulted: '',
    capturedDateTime: false,
    mean: '',
    sd: '',
    numPts: '',
    resultValue: '',
    decimalCommaSeparator: true,
    separateQualitativeQuantitative: true
  });

  const mockNewInstruction = {
    instructionName: 'parsing config',
    edgeBoxIdentifier: 'EDGE-1234-SS',
    dataEntry: true,
    instrumentCode: 'au400',
    staticInstrumentCode: '',
    productLotLevel: 'multiqual123',
    testCode: 'alb',
    dateTimeFormats: ['MDY'],
    dateTimeResulted: '09012021',
    timeResulted: '',
    capturedDateTime: false,
    mean: '',
    sd: '',
    numPts: '',
    resultValue: '2.2',
    decimalCommaSeparator: true,
    separateQualitativeQuantitative: true
  };

  const mockselectedInstruction = {
    createdTime: '2021-12-15T11:04:07.231597',
    edgeDeviceIds: [],
    handlesSlideGen: false,
    id: 'c4b0bbb4-0d06-4ca5-a1e1-6d4892ad84b0',
    isConfigured: false,
    isGenericASTM: true,
    name: 'Mike-WC-Point'
  };

  const mockOrchestratorApiService = {
    getEdgeBoxIdentifiers: (accountId: string) => null,
  };

  const mockParsingEngineService = {
    getInstructions(accountId: string): Observable<any> {
      return of({
        configs: Array<ParsingJobConfig>(),
        unassociatedEdgeDeviceIds: []
      });
    },

    getInstructionsById(accountId: string, instructionId: string): Observable<any> {
      return of({
        configs: Array<ParsingJobConfig>(),
        unassociatedEdgeDeviceIds: []
      });
    },

    addInstructions: (accountId: string, parsingInfo): Observable<any> => {
      return of(mockNewInstruction);
    },

    updateInstructions: (selectedInstruction: string, parsingInfo): Observable<any> => {
      return of(mockNewInstruction);
    }
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: () => { },
  };
  const TRANSLATIONS_EN = require('../../../../../assets/i18n/en.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InstructionsRulesComponent
      ],
      imports: [
        MaterialModule,
        FormsModule,
        PerfectScrollbarModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
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
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ParsingEngineService, useValue: mockParsingEngineService },
        { provide: OrchestratorApiService, useValue: mockOrchestratorApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService,
        { provide: LoggingApiService, useValue: loggingApiServiceMock },
        { provide: AppNavigationTrackingService, useValue: auditTrackingServiceSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsRulesComponent);
    component = fixture.componentInstance;
    component.instructionsForm = mockInstructionsForm;
    component.selectedInstruction = mockselectedInstruction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display selected transformer name', () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(TRANSLATIONS_EN.INSTRUCTIONSRULES.unity).toContain('Unity Next Connect device configuration');
  });

  it('should update edge instructions', async(() => {
    // Arrange
    component.isEdit = true;
    component.edgeBoxIdentifiers = ['EDGE-1232', 'EDGE-3233-SS2'];
    component.existingConfigurationsNames = ['instruction 1', 'parsing config'];
    component.instructionsForm.setValue(mockNewInstruction);
    fixture.detectChanges();

    // Act
    spyOn(component, 'onSubmit').and.callThrough();

    // Assert
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.onSubmit();
      expect(component.instructionsForm.invalid).toBe(true);
      expect(component.onSubmit).toHaveBeenCalled();
    });
  }));

  it('should create edge instructions', async(() => {
    // Arrange
    component.isEdit = false;
    component.edgeBoxIdentifiers = ['EDGE-1232', 'EDGE-3233-SS2'];
    component.existingConfigurationsNames = ['instruction 1', 'parsing config'];
    component.instructionsForm.setValue(mockNewInstruction);
    fixture.detectChanges();

    // Act
    spyOn(component, 'onSubmit').and.callThrough();

    // Assert
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.onSubmit();
      expect(component.instructionsForm.invalid).toBe(true);
      expect(component.onSubmit).toHaveBeenCalled();
    });
  }));

  it('should display configuration tab on click on cancel button', async(() => {
    component.edgeBoxIdentifiers = ['EDGE-1232', 'EDGE-3233-SS2'];
    fixture.detectChanges();
    spyOn(component, 'onCancel').and.callThrough();
    const spyObj = spyOn(component.showConfigurations, 'emit').and.callThrough();
    const btn = fixture.debugElement.query(By.css('#spec-cancel'));
    btn.nativeElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.onCancel();
      expect(spyObj).toHaveBeenCalled();
    });
  }));

});
