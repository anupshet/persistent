// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, fakeAsync, inject, TestBed, async   } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { DataEntryMode } from '../../../contracts/models/lab-setup/data-entry-mode.enum';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { LabSettingsDialogComponent } from './lab-settings-dialog.component';
import { UserRole } from '../../../contracts/enums/user-role.enum';
import { LoggingApiService } from '../../api/logging-api.service';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../app.module';
import * as fromRoot from '../../../state/app.state';

describe('LabSettingsDialogComponent', () => {
  let component: LabSettingsDialogComponent;
  let fixture: ComponentFixture<LabSettingsDialogComponent>;
  const appState = [];
  const formBuilder: FormBuilder = new FormBuilder();
  const mockLabSettingsForm = formBuilder.group({
    dataType: DataEntryMode.Summary,
    trackReagentCalibrator: false,
    siUnits: false,
    decimalPlaces: 2
  });

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

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

  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking']);
  const auditTrackingServiceSpy = jasmine.createSpyObj('AppNavigationTrackingService', ['logAuditTracking']);

  const mockCurrentLabLocation = {
    children: [],
    locationTimeZone: 'America/Los_Angeles',
    locationOffset: '',
    locationDayLightSaving: '',
    nodeType: 2,
    labLocationName: '',
    labLocationContactId: '',
    labLocationAddressId: '',
    labLocationContact: null,
    labLocationAddress: null,
    id: '',
    parentNodeId: '',
    displayName: '',
    contactRoles: [UserRole.LabSupervisor],
    locationSettings: {
      displayName: '',
      dataType: 1,
      instrumentsGroupedByDept: true,
      trackReagentCalibrator: false,
      fixedMean: false,
      decimalPlaces: 2,
      siUnits: false,
      labSetupRating: 0,
      labSetupComments: '',
      isLabSetupComplete: true,
      labSetupLastEntityId: 'null',
      id: '635b3412-679a-4201-97f4-c6df45bcfab6',
      parentNodeId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
      parentNode: null,
      nodeType: 9,
      children: null,
      isLabSetupCompleted: true
    },
    previousContactUserId: null,
    labLanguagePreference: 'en-us'
  };
  const mockBrPermissionsService = {
    hasAccess: () => true,
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabSettingsDialogComponent],
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatRadioModule,
        MatSelectModule,
        HttpClientModule,
        HttpClientTestingModule,
        StoreModule.forRoot(fromRoot.reducers),
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
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: LoggingApiService, useValue: loggingApiServiceMock },
        { provide: AppNavigationTrackingService, useValue: auditTrackingServiceSpy },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSettingsDialogComponent);
    component = fixture.componentInstance;
    component.labSettingsForm = mockLabSettingsForm;
    component.getCurrentLabLocation$ = of(mockCurrentLabLocation);
    fixture.detectChanges();
  });

  it('should create', () => {
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

  it('should display Lab Settings header and message', () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    // expect(compiled.querySelector('.spec-header').textContent).toContain('Lab default settings');
    fixture.detectChanges();
    /* expect(compiled.querySelector('.spec-message').textContent)
      .toContain('Change the default settings for adding new entry in lab setup. Previous entries will not be affected.'); */
  });

  it('should reset lab settings form on click on back', fakeAsync(() => {
    const spy = spyOn(component.labSettingsForm, 'reset').and.callThrough();
    const backButton = fixture.debugElement.nativeElement.querySelector('.spec-back');
    backButton.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('should send the selected form values and close the dialog on click of Update button', inject([MatDialogRef], matDialogRef => {
    const spy = spyOn(matDialogRef, 'close');
    const updateButton = fixture.debugElement.nativeElement.querySelector('.spec-update');
    updateButton.click();
    component.onUpdateClick(mockLabSettingsForm.value);
    expect(spy).toHaveBeenCalled();
  }));
});
