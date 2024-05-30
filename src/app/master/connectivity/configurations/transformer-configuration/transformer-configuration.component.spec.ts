// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';

import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { TransformerConfigurationComponent } from './transformer-configuration.component';
import { TransformerFields } from '../../../../contracts/models/account-management/transformers.model';
import { ParsingJobConfig } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { LoggingApiService } from '../../../../shared/api/logging-api.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

describe('TransformerConfigurationComponent', () => {
   let component: TransformerConfigurationComponent;
   let fixture: ComponentFixture<TransformerConfigurationComponent>;
   const formBuilder: FormBuilder = new FormBuilder();

  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking']);
  const auditTrackingServiceSpy = jasmine.createSpyObj('AppNavigationTrackingService', ['sendAuditTrailPayload',
    'createAuditTrailPayload']);
  const mockSelecetdTransformer = {
      createdTime: '2021-12-15T11:04:07.231597',
      edgeDeviceIds: [],
      handlesSlideGen: false,
      id: 'c4b0bbb4-0d06-4ca5-a1e1-6d4892ad84b0',
      isConfigured: true,
      isGenericASTM: false,
      name: 'Mike-WC-Point'
   };

   const mockDynamicForm = formBuilder.group({
      instructionName: '',
      dformat: '',
      DecSep: '',
      use_clot: '',
      ignore_inactive: '',
      use_control: '',
      use_method: '',
      use_cm: '',
      use_cl: '',
      use_ml: '',
      get_inst_label: '',
      use_single_label: '',
      use_combination_label: '',
      use_ct: '',
      read_op: '',
      ignore_code: ''
   });

   const mockFields = {
      'transformerId': '3935',
      'instructionName': 'Meditech QC Summary Report Transformer',
      'config': [
         {
            'key': 'dformat',
            'isRequired': true,
            'label': 'Date Format (Must be either MDY, DMY, YMD or YDM)',
            'validDateFormat': [
               'LocalizedString',
               'MDY',
               'DMY',
               'YMD',
               'YDM'
            ],
            'type': 'option',
            'maxLength': '3',
            'value': ''
         },
         {
            'key': 'DecSep',
            'isRequired': false,
            'label': 'Decimal Separator (Must be either period or comma)',
            'options': [
               'Decimal',
               'Comma'
            ],
            'type': 'radio',
            'maxLength': '1',
            'value': ''
         },
         {
            'key': '',
            'isRequired': false,
            'label': '',
            'type': 'title',
            'value': ''
         },
         {
            'key': 'ignore_inactive',
            'isRequired': false,
            'label': 'Ignore data with a STATUS of INACTIVE',
            'type': 'checkbox',
            'value': ''
         },
         {
            'key': '',
            'isRequired': false,
            'label': '',
            'type': 'title',
            'value': ''
         },
         {
            'key': '',
            'isRequired': false,
            'label': 'Get Instrument Code from:  (Choose only one)',
            'type': 'title',
            'value': ''
         },
         {
            'key': '',
            'isRequired': false,
            'label': '--Use a single field--',
            'type': 'title',
            'value': ''
         },
         {
            'key': 'use_control',
            'isRequired': false,
            'label': 'CONTROL Column',
            'isGrouped': true,
            'type': 'checkbox',
            'value': ''
         },
         {
            'key': 'use_method',
            'isRequired': false,
            'label': 'METHOD Column',
            'isGrouped': true,
            'type': 'checkbox',
            'value': ''
         },
         {
            'key': 'use_cl',
            'isRequired': false,
            'label': 'CONTROL Column and LOT Column',
            'isGrouped': true,
            'type': 'checkbox',
            'value': ''
         },
         {
            'key': 'use_ml',
            'isRequired': false,
            'label': 'METHOD Column and LOT Column',
            'isGrouped': true,
            'type': 'checkbox',
            'value': ''
         }
      ]
   };

   const mockOrchestratorApiService = {
      getTransformersFields(data: any): Observable<any> {
         return of({ TransformerFields });
      },

      updateTransformerConfiguration(data: any): Observable<any> {
         return of({
            configs: Array<ParsingJobConfig>(),
            unassociatedEdgeDeviceIds: []
         });
      },

      addTransformerConfiguration(data: any): Observable<any> {
         return of({
            configs: Array<ParsingJobConfig>(),
            unassociatedEdgeDeviceIds: []
         });
      },
   };

   const mockErrorLoggerService = jasmine.createSpyObj([
      'logErrorToBackend',
      'populateErrorObject'
   ]);

   const mockBrPermissionsService = {
      hasAccess: () => true,
   };

   const appState = [];

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TransformerConfigurationComponent],
         imports: [ReactiveFormsModule,
            FormsModule,
            MaterialModule,
            ReactiveFormsModule,
            HttpClientModule,
            BrowserAnimationsModule,
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
            { provide: OrchestratorApiService, useValue: mockOrchestratorApiService },
            { provide: FormBuilder, useValue: formBuilder },
            { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
           { provide: BrPermissionsService, useValue: mockBrPermissionsService },
            TranslateService,
           { provide: LoggingApiService, useValue: loggingApiServiceMock },
           { provide: AppNavigationTrackingService, useValue: auditTrackingServiceSpy },
         ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransformerConfigurationComponent);
      component = fixture.componentInstance;
      component.selectedTransformer = mockSelecetdTransformer;
      component.dynamicForm = mockDynamicForm;
      component.dynamicFormfields = mockFields;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should display selected transformer name', () => {
      const compiled = fixture.debugElement.nativeElement;
      fixture.detectChanges();
      expect(compiled.querySelector('.spec-transformer-name').textContent).toContain(mockSelecetdTransformer.name + ' TRANSFORMERCONFIGURATION.CONFIGURATION');
   });

   it('should create dynamic form and patch selected values', async(() => {
      component.selectedTransformer.isConfigured = true;
      component.existingConfigurationsNames = ['instruction 1', 'parsing config'];
      fixture.detectChanges();
      component.createDynamicFormfields(mockFields);
      component.retrieveTransformersConfigurations(mockFields.config);
   }));

   it('should apply choose one validation for checkbox fields', async(() => {
      const value = {
         'key': 'use_cl',
         'isRequired': false,
         'label': 'CONTROL Column and LOT Column',
         'isGrouped': true,
         'type': 'checkbox',
         'groupName': 'abc',
         'value': ''
      };
      fixture.detectChanges();
      spyOn(component, 'chooseOneValidation').and.callThrough();
      fixture.whenStable().then(() => {
         fixture.detectChanges();
         component.chooseOneValidation(value);
         expect(component.chooseOneValidation).toHaveBeenCalledWith(value);
      });
   }));

   it('should display configuration tab on click on cancel button', async(() => {
      fixture.detectChanges();
      spyOn(component, 'onCancel').and.callThrough();
      const spyObj = spyOn(component.showConfigurations, 'emit').and.callThrough();
      const btn = fixture.debugElement.query(By.css('.spec-cancel'));
      btn.nativeElement.click();
      fixture.whenStable().then(() => {
         fixture.detectChanges();
         component.onCancel();
         expect(spyObj).toHaveBeenCalled();
      });
   }));

   it('should update transformer configuration', async(() => {
      component.selectedTransformer.isConfigured = true;
      fixture.detectChanges();
      spyOn(component, 'onSubmit').and.callThrough();
      const btn = fixture.debugElement.query(By.css('.spec-save'));
      btn.nativeElement.click();
      fixture.whenStable().then(() => {
         fixture.detectChanges();
         component.onSubmit();
         expect(component.dynamicForm.invalid).toBe(true);
         expect(component.onSubmit).toHaveBeenCalled();
      });
   }));

   it('should create transformer configuration', async(() => {
      component.selectedTransformer.isConfigured = false;
      fixture.detectChanges();
      spyOn(component, 'onSubmit').and.callThrough();
      const btn = fixture.debugElement.query(By.css('.spec-save'));
      btn.nativeElement.click();
      fixture.whenStable().then(() => {
         fixture.detectChanges();
         component.onSubmit();
         expect(component.dynamicForm.invalid).toBe(true);
         expect(component.onSubmit).toHaveBeenCalled();
      });
   }));
});
