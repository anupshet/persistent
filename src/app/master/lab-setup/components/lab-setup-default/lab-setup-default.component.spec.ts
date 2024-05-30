// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, fakeAsync, tick, async   } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrSelect, BrInfoTooltip } from 'br-component-library';
import { LabSetupDefaultComponent } from './lab-setup-default.component';
import { LabSetupHeaderComponent } from '../lab-setup-header/lab-setup-header.component';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { LoggingApiService } from '../../../../shared/api/logging-api.service';

describe('LabSetupDefaultComponent', () => {
  let component: LabSetupDefaultComponent;
  let fixture: ComponentFixture<LabSetupDefaultComponent>;
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockNavigationService = {};

  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking']);
  const auditTrackingServiceSpy = jasmine.createSpyObj('AppNavigationTrackingService', ['logAuditTracking']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LabSetupDefaultComponent,
        LabSetupHeaderComponent
      ],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatIconModule,
        MatMenuModule,
        BrInfoTooltip,
        BrSelect,
        MatSelectModule,
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
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: LoggingApiService, useValue: loggingApiServiceMock },
        { provide: AppNavigationTrackingService, useValue: auditTrackingServiceSpy },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: NavigationService, useValue: mockNavigationService },
        AppLoggerService,
        TranslateService,]
    })
      .compileComponents();
  }));

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const mockAppNavigationTrackingService = {
    comparePriorAndCurrentValues: () => {
      return {
        auditTrail: {
          eventType: 'User Management',
          action: 'Update',
          actionStatus: 'Success',
          priorValue: {
            name: 'new1'
          },
          currentValue: {
            name: 'new12'
          }
        }
      };
    },
    logAuditTracking: () => { }
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSetupDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });

  it('should log audit trail on navigation to Lab default', fakeAsync(() => {
    const comparePriorAndCurrentValuesSpy = spyOn(mockAppNavigationTrackingService, 'comparePriorAndCurrentValues').and.returnValue({
      auditTrail: {
        eventType: 'Lab Default',
        action: 'View',
        actionStatus: 'Success',
        priorValue: {
          name: 'new1'
        },
        currentValue: {
          name: 'new12'
        }
      }
    });
    const logAuditTrackingSpy = spyOn(mockAppNavigationTrackingService, 'logAuditTracking');
    component.ngOnInit();
    expect(comparePriorAndCurrentValuesSpy).toHaveBeenCalled();
    expect(logAuditTrackingSpy).toHaveBeenCalled();
  }));

  it('Verify that all defaults should be set for LabSetupDefaults on startup ', () => {
    const controls = component.labSetupForm.controls;

    expect(controls.dataType.value).toBe(component.summary);
    expect(controls.instrumentsGroupedByDept.value).toBe(true);
    expect(controls.trackReagentCalibrator.value).toBe(true);
    expect(controls.fixedMean.value).toBe(true);
    expect(controls.decimalPlaces.value).toBe('');
    expect(controls.siUnits.value).toBe(false);
  });

  it('Verify that error message is displayed', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.errorMessage = 'This is an error';
    fixture.detectChanges();

    tick();
    const element: HTMLElement = compiled.querySelector('#error-message');
    expect(element.innerText).toBe(component.errorMessage);
  }));
});
