// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrSelect, MaterialModule } from 'br-component-library';
import { DuplicateInstrumentEntryComponent } from './duplicate-instrument-entry.component';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { ConfigService } from '../../../../core/config/config.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { DuplicateInstrumentEntry } from '../../../../contracts/models/lab-setup/duplicate-copy-entry.model';
import { customName, department } from '../../../../core/config/constants/general.const';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';
import { LocalizationService } from '../../../../shared/navigation/services/localizaton.service';
import { ApiService } from '../../../../shared/api/api.service';

describe('DuplicateInstrumentEntryComponent', () => {
  let component: DuplicateInstrumentEntryComponent;
  let fixture: ComponentFixture<DuplicateInstrumentEntryComponent>;

  const appState = [];
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockCurrentBranch = [
    {
      displayName: 'Ajs lab',
      labLocationName: 'Ajs lab',
      locationTimeZone: 'America/Los_Angeles',
      locationOffset: '-08:00:00',
      locationDayLightSaving: '01:00:00',
      labLocationContactId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
      labLocationAddressId: '6239b09a-ed9b-43ec-8b41-03fa44a31a9f',
      labLocationContact: null,
      labLocationAddress: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      id: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
      parentNodeId: '6414a6bb-be30-40a5-82d5-48088dd3064c',
      parentNode: null,
      nodeType: 2,
      children: [
        {
          displayName: 'NewAccount1',
          departmentName: 'NewAccount1',
          departmentManagerId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
          departmentManager: null,
          accountSettings: null,
          hasOwnAccountSettings: false,
          isArchived: false,
          id: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
          parentNodeId: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
          parentNode: null,
          nodeType: 3,
          children: [
            {
              displayName: 'BeckManCus',
              instrumentId: '1540',
              instrumentCustomName: 'BeckManCus',
              instrumentSerial: '123Beck',
              instrumentInfo: {
                id: 1540,
                name: 'AU480',
                manufacturerId: '14',
                manufacturerName: 'Beckman Coulter'
              },
              accountSettings: null,
              hasOwnAccountSettings: false,
              isArchived: false,
              id: '0b01ae03-4886-4ca8-8d52-7a87bdb4885e',
              parentNodeId: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
              parentNode: null,
              nodeType: 4,
              children: [],
              isUnavailable: false,
              unavailableReasonCode: ''
            }
          ],
          isUnavailable: false,
          unavailableReasonCode: ''
        },
        {
          displayName: 'NewAccount2',
          departmentName: 'NewAccount2',
          departmentManagerId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
          departmentManager: null,
          accountSettings: null,
          hasOwnAccountSettings: false,
          isArchived: false,
          id: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
          parentNodeId: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
          parentNode: null,
          nodeType: 3,
          children: [
            {
              displayName: 'BeckManCus',
              instrumentId: '1540',
              instrumentCustomName: 'BeckManCus',
              instrumentSerial: '123Beck',
              instrumentInfo: {
                id: 1540,
                name: 'AU480',
                manufacturerId: '14',
                manufacturerName: 'Beckman Coulter'
              },
              accountSettings: null,
              hasOwnAccountSettings: false,
              isArchived: false,
              id: '0b01ae03-4886-4ca8-8d52-7a87bdb4885e',
              parentNodeId: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
              parentNode: null,
              nodeType: 4,
              children: [],
              isUnavailable: false,
              unavailableReasonCode: ''
            }
          ],
          isUnavailable: false,
          unavailableReasonCode: ''
        }
      ],
      isUnavailable: false,
      unavailableReasonCode: ''
    }
  ];

  const mockCurrentBranchWithOneDepartment = [
    {
      displayName: 'Ajs lab',
      labLocationName: 'Ajs lab',
      locationTimeZone: 'America/Los_Angeles',
      locationOffset: '-08:00:00',
      locationDayLightSaving: '01:00:00',
      labLocationContactId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
      labLocationAddressId: '6239b09a-ed9b-43ec-8b41-03fa44a31a9f',
      labLocationContact: null,
      labLocationAddress: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      id: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
      parentNodeId: '6414a6bb-be30-40a5-82d5-48088dd3064c',
      parentNode: null,
      nodeType: 2,
      children: [
        {
          displayName: 'NewAccount1',
          departmentName: 'NewAccount1',
          departmentManagerId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
          departmentManager: null,
          accountSettings: null,
          hasOwnAccountSettings: false,
          isArchived: false,
          id: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
          parentNodeId: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
          parentNode: null,
          nodeType: 3,
          children: [
            {
              displayName: 'BeckManCus',
              instrumentId: '1540',
              instrumentCustomName: 'BeckManCus',
              instrumentSerial: '123Beck',
              instrumentInfo: {
                id: 1540,
                name: 'AU480',
                manufacturerId: '14',
                manufacturerName: 'Beckman Coulter'
              },
              accountSettings: null,
              hasOwnAccountSettings: false,
              isArchived: false,
              id: '0b01ae03-4886-4ca8-8d52-7a87bdb4885e',
              parentNodeId: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
              parentNode: null,
              nodeType: 4,
              children: [],
              isUnavailable: false,
              unavailableReasonCode: ''
            }
          ],
          isUnavailable: false,
          unavailableReasonCode: ''
        }
      ],
      isUnavailable: false,
      unavailableReasonCode: ''
    }
  ];

  const mockCurrentBranchWithoutDepartment = [
    {
      displayName: 'Ajs lab',
      labLocationName: 'Ajs lab',
      locationTimeZone: 'America/Los_Angeles',
      locationOffset: '-08:00:00',
      locationDayLightSaving: '01:00:00',
      labLocationContactId: '8fbcd781-1f5b-4ca7-b62f-88063346e07e',
      labLocationAddressId: '6239b09a-ed9b-43ec-8b41-03fa44a31a9f',
      labLocationContact: null,
      labLocationAddress: null,
      accountSettings: null,
      hasOwnAccountSettings: false,
      id: '3a073cb2-7bf4-4a40-acfa-b6b3628a8d3e',
      parentNodeId: '6414a6bb-be30-40a5-82d5-48088dd3064c',
      parentNode: null,
      nodeType: 2,
      children: [
        {
          displayName: 'BeckManCus',
          instrumentId: '1540',
          instrumentCustomName: 'BeckManCus',
          instrumentSerial: '123Beck',
          instrumentInfo: {
            id: 1540,
            name: 'AU480',
            manufacturerId: '13',
            manufacturerName: 'Beckman Coulter'
          },
          accountSettings: null,
          hasOwnAccountSettings: false,
          isArchived: false,
          id: '0b01ae03-4886-4ca8-8d52-7a87bdb4885e',
          parentNodeId: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
          parentNode: null,
          nodeType: 4,
          children: [],
          isUnavailable: false,
          unavailableReasonCode: ''
        }
      ],
      isUnavailable: false,
      unavailableReasonCode: ''
    }
  ];
  const mockLocalizationService = {
    getLanguageMapping: () => { },
  };
  const mockDuplicateNodeInfo: DuplicateInstrumentEntry = {
    sourceNode: {
      displayName: 'BeckManCus',
      instrumentId: '1540',
      instrumentCustomName: 'BeckManCus',
      instrumentSerial: '123Beck',
      instrumentInfo: {
        id: 1540,
        name: 'AU480',
        manufacturerId: '14',
        manufacturerName: 'Beckman Coulter'
      },
      accountSettings: null,
      hasOwnAccountSettings: false,
      isArchived: false,
      id: '0b01ae03-4886-4ca8-8d52-7a87bdb4885e',
      parentNodeId: '5376a8d5-a6b3-47ad-a752-1b7491fdb348',
      parentNode: null,
      nodeType: 4,
      children: [],
      isUnavailable: false,
      unavailableReasonCode: ''
    }
  };

  const mockPortalApiService = {
    getLabSetupNode: () => {
      return of(mockCurrentBranch[0]);
    }
  };

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.InstrumentEdit];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };

  let portalApiService: PortalApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DuplicateInstrumentEntryComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        BrSelect,
        HttpClientModule,
        MaterialModule,
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
        { provide: PortalApiService, useValue: mockPortalApiService },
        ConfigService,
        AppLoggerService,
        DatePipe,
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: LocalizationService, mockLocalizationService },
        TranslateService,
        HttpClient,
        ApiService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateInstrumentEntryComponent);
    portalApiService = fixture.debugElement.injector.get(PortalApiService);
    component = fixture.componentInstance;
    component.duplicateNodeInfo = mockDuplicateNodeInfo;
    component.currentSelectedBranch$ = of(mockCurrentBranch);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show department dropdown if there are no departments in lab', () => {
    const spy = spyOn(portalApiService, 'getLabSetupNode').and.returnValue(
      of(mockCurrentBranchWithoutDepartment[0])
    );
    fixture.detectChanges();
    const departmentsElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_departments');
    expect(spy).toHaveBeenCalled();
    expect(departmentsElement).toBeFalsy();
  });

  it('should not show department dropdown if there is only one department in lab', () => {
    const spy = spyOn(portalApiService, 'getLabSetupNode').and.returnValue(
      of(mockCurrentBranchWithOneDepartment[0])
    );
    fixture.detectChanges();
    component.isInstrumentModelDuplicate = true;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const departmentsElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_departments');
      expect(spy).toHaveBeenCalled();
      expect(departmentsElement.hasAttribute('hidden')).toEqual(true);
    });
  });

  it('should show department dropdown if there are more than one departments in lab', () => {
    fixture.detectChanges();
    const departmentsElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_departments');
    expect(departmentsElement.hasAttribute('hidden')).toEqual(false);
  });

  it('should show error message if same instrument present in the selected department', () => {
    fixture.detectChanges();
    const formGetter = <FormGroup>component.duplicateInstrumentGroupGetter.at(0);
    formGetter.get(department).setValue(mockCurrentBranch[0].children[0]);
    component.onDepartmentChange(formGetter.get(department).value);
    fixture.detectChanges();
    const instrumentExistsMsgElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_instrumentExistsMsg');
    expect(instrumentExistsMsgElement).toBeTruthy();
  });

  it('should show error message if same custom name present in the selected department', () => {
    fixture.detectChanges();
    const formGetter = <FormGroup>component.duplicateInstrumentGroupGetter.at(0);
    formGetter.get(department).setValue(mockCurrentBranch[0].children[0]);
    formGetter.get(customName).setValue('BeckManCus');
    component.onDepartmentChange(formGetter.get(department).value);
    fixture.detectChanges();
    const customNameExistsMsgElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_customNameExistsMsg');
    expect(customNameExistsMsgElement).toBeTruthy();
  });
});
