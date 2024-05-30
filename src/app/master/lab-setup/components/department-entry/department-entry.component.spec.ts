// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentFixture, TestBed, fakeAsync, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrSelect, MaterialModule } from 'br-component-library';
import { DepartmentEntryComponent } from './department-entry.component';
import { LabSetupHeaderComponent } from '../lab-setup-header/lab-setup-header.component';
import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { User } from '../../../../contracts/models/user-management/user.model';
import { PortalDataDocumentType } from '../../../../contracts/models/portal-api/portal-data.model';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { IndicatorModule } from '../../../../shared/indicator/indicator.module';
import { Address, Contact } from '../../../../contracts/models/portal-api/portal-data.model';
import { MigrationStates } from '../../../../contracts/enums/migration-state.enum';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { Department, LabLocationContact } from '../../../../contracts/models/lab-setup';
import { Lab } from '../../../../contracts/models/lab-setup/lab.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

describe('DepartmentEntryComponent', () => {
  let component: DepartmentEntryComponent;
  let fixture: ComponentFixture<DepartmentEntryComponent>;
  const formBuilder: FormBuilder = new FormBuilder();


  const appState = [];

  const navigationStub = {
    selectedNode: {},
    selectedLeaf: {},
    currentBranch: [],
    error: {},
    isSideNavExpanded: false,
    currentUser: {}
  };

  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['AccountManager'],
      permissions: {
        rolePermissions: {
          role: {
            permission: true,
          }
        }
      },
      userData: {
        assignedLabNumbers: [],
        defaultLab: ''
      },
      accountNumber: '123',
      accountId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      labLocationId: '0d66767b-612c-4254-9eed-3a7ab393029f',
      labLocationIds: ['0d66767b-612c-4254-9eed-3a7ab393029f'],
      accountNumberArray: [],
      accessToken: '',
      id: 'eca89ea6-aba1-4b95-9396-0238352a4765',
      labId: ''
    },
    directory: {
      id: 10,
      name: 'Test',
      locations: null,
      children: [{
        nodeType: 1
      }],
      primaryUnityLabNumbers: 'Test',
    }
  };

  const Accounts = {
    id: '123',
    accountNumber: '3456788',
    formattedAccountNumber: '',
    sapNumber: '',
    orderNumber: '',
    primaryUnityLabNumbers: '',
    labName: '',
    accountAddressId: '',
    accountAddress: Address,
    accountContactId: '',
    accountContact: null,
    licenseNumberUsers: 123,
    accountLicenseType: 123,
    licensedProducts: null,
    licenseAssignDate: new Date,
    licenseExpirationDate: new Date,
    comments: '',
    nodeType: EntityType.Account,
    parentNodeId: 'ROOT',
    displayName: '',
    migrationStatus: MigrationStates
  };

  const location = {
    currentLabLocation: {
      children: Department,
      locationTimeZone: '',
      locationOffset: '1',
      locationDayLightSaving: 'Yes',
      nodeType: EntityType.LabLocation,
      labLocationName: 'LocationName',
      labLocationContactId: '12',
      labLocationAddressId: '34',
      labLocationContact: Contact,
      labLocationAddress: Address,
      parentNode: Lab
    },
    currentLabLocationContact: LabLocationContact
  };

  const storeStub = {
    security: authStub,
    auth: authStub,
    userPreference: null,
    router: null,
    navigation: navigationStub,
    location: location,
    account: {
      currentAccountSummary: Accounts
    },
    uiConfigState: null
  };
  const userContacts: User[] | any[] = [{
    children: [],
    contactId: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
    contactInfo: {
      email: '',
      entityType: PortalDataDocumentType.Contact,
      firstName: '',
      id: '',
      lastName: '',
      middleName: '',
      name: '',
      phone: '123456789'
    },
    displayName: 'Vishwajit Shinde',
    id: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
    nodeType: 7,
    parentAccounts: [],
    parentNode: null,
    parentNodeId: '505B0FB328D44534A3FFB7232402B874',
    preferences: {},
    userOktaId: '00u50g52e23hH9W472p7',
    userRoles: ['LabSupervisor', 'LeadTechnician', 'Technician']
  },
  {
    children: [],
    contactId: 'a6bdda28-14b3-4b2a-b4a7-c36fdef80821',
    contactInfo: {
      email: '',
      entityType: PortalDataDocumentType.Contact,
      firstName: '',
      id: '',
      lastName: '',
      middleName: '',
      name: '',
      phone: '123456789'
    },
    displayName: 'Kashinath Chormale',
    id: 'a6bdda28-14b3-4b2a-b4a7-c36fdef80821',
    nodeType: 7,
    parentAccounts: [],
    parentNode: null,
    parentNodeId: '505B0FB328D44534A3FFB7232402B874',
    preferences: {},
    userOktaId: '00u5lggw62Q5PUxJ22p7',
    userRoles: ['Admin']
  }
  ];

  const departments: Array<Department> = [{
    children: [],
    departmentManagerGroup: {},
    departmentManager: {
      firstName: '',
      middleName: '',
      lastName: '',
      name: '',
      email: '',
      phone: '',
      id: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
      entityType: PortalDataDocumentType.Contact
    },
    levelSettings: {
      levelEntityId: null,
      levelEntityName: null,
      parentLevelEntityId: null,
      parentLevelEntityName: null,
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 0,
      targets: [{
        controlLotId: '261',
        controlLevel: '1',
        mean: 0,
        sd: 0,
        points: 0
      }],
      rules: [{
        id: '2',
        category: '1k',
        k: '3',
        disposition: 'N'
      }],
      levels: [{
        levelInUse: true,
        decimalPlace: 3
      }]
    },
    departmentManagerId: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
    departmentName: 'vishwajit Department1',
    displayName: 'vishwajit Department1',
    id: 'E0EB71CDDBCE4E849EF11140A063F732',
    nodeType: 3,
    parentNodeId: '4B84D29BDD4F40FDB2BA0B4CEE10EBCF',
  }];

  const DepartmentFormArray = {
    departmentsArray: [
      {
        'departmentName': 'det',
        'departmentManagerGroup': {
          'departmentManager': {
            'displayName': 'ashu suryavanshi',
            'contactId': 'a7a645b6-2003-4d6c-94b3-f790c14c8e9d',
            'userOktaId': '00u6d695oyELy21kN2p7',
            'userRoles': [
              'Admin'
            ],
            'contactInfo': {
              'entityType': 0,
              'searchAttribute': 'rani_dhole+24@bip-rad.com',
              'firstName': 'ashu',
              'middleName': '',
              'lastName': 'suryavanshi',
              'name': 'ashu suryavanshi',
              'email': 'rani_dhole+24@bip-rad.com',
              'phone': '',
              'id': 'a7a645b6-2003-4d6c-94b3-f790c14c8e9d',
              'featureInfo': {
                'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
              }
            },
            'preferences': {
              'entityType': 2,
              'searchAttribute': '4acf6beb-c276-4a30-bfa5-faa20a4059c1',
              'lastSelectedEntityId': null,
              'lastSelectedEntityType': 0,
              'termsAcceptedDateTime': null,
              'id': '4acf6beb-c276-4a30-bfa5-faa20a4059c1',
              'featureInfo': {
                'uniqueServiceName': 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
              }
            },
            'parentAccounts': [
              {
                'displayName': '100610',
                'accountNumber': '100610',
                'formattedAccountNumber': 'U100610',
                'sapNumber': '',
                'orderNumber': '',
                'accountAddressId': 'c3b04162-d776-4243-98e7-6bba026e6174',
                'accountContactId': 'b67fc2d9-c347-4185-8d1b-9d4ea8e6f978',
                'accountLicenseType': 0,
                'licensedProducts': [
                  {
                    'product': 1,
                    'fileOption': 0
                  }
                ],
                'licenseNumberUsers': 2,
                'accountContact': null,
                'accountAddress': null,
                'licenseAssignDate': '2020-02-18T13:32:29.197Z',
                'licenseExpirationDate': '2020-03-25T18:30:00Z',
                'comments': '',
                'primaryUnityLabNumbers': '',
                'migrationStatus': '',
                'accountSettings': {
                  'displayName': '',
                  'dataType': 1,
                  'instrumentsGroupedByDept': true,
                  'trackReagentCalibrator': false,
                  'fixedMean': false,
                  'decimalPlaces': 2,
                  'siUnits': false,
                  'labSetupRating': 0,
                  'labSetupComments': '',
                  'isLabSetupComplete': true,
                  'labSetupLastEntityId': 'null',
                  'id': '27feb9c3-0328-41fe-9688-b5642d7220f3',
                  'parentNodeId': 'e61ecb10-193a-4112-b02e-74c88fcfca04',
                  'parentNode': null,
                  'nodeType': 9,
                  'children': null
                },
                'id': 'e61ecb10-193a-4112-b02e-74c88fcfca04',
                'parentNodeId': 'ROOT',
                'parentNode': null,
                'nodeType': 0,
                'children': null
              }
            ],
            'id': '4acf6beb-c276-4a30-bfa5-faa20a4059c1',
            'parentNodeId': 'e61ecb10-193a-4112-b02e-74c88fcfca04',
            'parentNode': null,
            'nodeType': 7,
            'children': []
          }
        }
      },
      {
        'departmentName': ''
      },
      {
        'departmentName': ''
      }
    ]
  };

  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };
  const dialogStub = { open: () => dialogRefStub };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    subject: of(true),
    auditTrailViewData: () => { },
  };

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.DepartmentDelete, Permissions.DepartmentAdd, Permissions.DepartmentEdit];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };

  const mockNavigationService = {
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        BrSelect,
        IndicatorModule,
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
      declarations: [
        DepartmentEntryComponent,
        LabSetupHeaderComponent,
        ConfirmDialogDeleteComponent
      ],
      providers: [
        [{ provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        { provide: FormBuilder, useValue: formBuilder },
        { provide: MatDialog, useValue: dialogStub },
          AppLoggerService,
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: NavigationService, useValue: mockNavigationService },
        TranslateService,
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: NavigationService, useValue: mockNavigationService },
        HttpClient
        ]
      ]
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmDialogDeleteComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.contacts = userContacts;
    component.location = new LabLocation();
    component.location.children = departments;
    component.departments = departments;
    component.duplicateFound['0'] = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify on click of "Select another department" link add another form control to add another department', () => {
    const initial: number = component.departmentsGetter.length;
    component.addFormControl();
    const updated = component.departmentsGetter.length;
    fixture.detectChanges();
    expect(updated).toEqual(initial + 1);
  });

  it('Verify on click of "Cancel" button reset the form values and any dynamically added departments should reset as well',
    fakeAsync(() => {
      component.departmentForm.markAsDirty();
      component.departments = departments;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component.setInitForm();
        expect(component.departmentForm.pristine).toBeTruthy();
      });
    }));

  it('Verify the "Manager Name" is populated as dropdown selection', () => {
    fixture.detectChanges();
    component.departments = departments;
    component.contacts = userContacts;
    component.getGroupAtIndex(0).patchValue({ departmentName: 'Chemistry' });
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css('#multipleData .mat-select'));
    const matOptionelement = matOption.nativeElement;
    matOptionelement.click();
    fixture.detectChanges();
    const matOptionElementList = fixture.debugElement.query(By.css('.ng-trigger-transformPanel .mat-option'));
    const optionSetElement = matOptionElementList.nativeElement;
    optionSetElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(userContacts[0].displayName).toEqual(optionSetElement.innerText);
    });
  });

  it('Will display populated Department Name', () => {
    component.showSettings = true;
    component.departments = departments;
    component.contacts = userContacts;
    component.setInitForm();
    fixture.detectChanges();
    const departmentTitle = fixture.debugElement.query(By.css('.spec_departmentName'));
    fixture.whenStable().then(() => {
      expect(component.departments[0].displayName).toEqual(departmentTitle.nativeElement.value);
    });
  });

  it('Will display populated Manager Name', () => {
    component.showSettings = true;
    component.departments = departments;
    component.contacts = userContacts;
    component.contacts.splice(1, 1);
    component.setInitForm();
    component.getGroupAtIndex(0).get('departmentName').setValue('Text');
    fixture.detectChanges();
    const departmentName = fixture.debugElement.query(By.css('.spec_departmentName')).nativeElement;
    departmentName.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const departmentManager = fixture.debugElement.query(By.css('.spec_departmentManager'));
    expect(component.contact.displayName)
      .toEqual(departmentManager.nativeElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[2].childNodes[0].value);
  });

  it('Validation is performed on department entry form', () => {
    component.showSettings = true;
    component.departments = departments;
    component.setInitForm();
    component.contacts = userContacts;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('#spec_updateButton'));
    fixture.whenStable().then(() => {
      expect(btn.nativeElement.disabled).toBeTruthy();
      component.getGroupAtIndex(0).get('departmentName').setValue('');
      component.getGroupAtIndex(0).get('departmentManagerGroup').patchValue({ departmentManager: '' });
      expect(component.departmentForm.valid).toBeFalsy();

      // update view, once the values are entered
      fixture.detectChanges();
      expect(btn.nativeElement.disabled).toBeTruthy();
    });
  });

  it('Will display delete button, where there is no immediate children', () => {
    component.showSettings = true;
    component.departments = departments;
    component.setInitForm();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('#spec_deleteButton'));
    expect(btn).toBeTruthy();
  });

  it('Should display save button', () => {
    component.showSettings = false;
    component.contacts = userContacts;
    component.departments = departments;
    component.setInitForm();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('#spec_saveButton'));
    expect(btn.nativeElement.disabled).toBeTruthy();
    component.getGroupAtIndex(0).get('departmentName').setValue('Dept');
    component.isFormValid = component.getGroupAtIndex(0).get('departmentName').value && !component.duplicateFound[0];
    component.addDeptManagerControl(0);
    component.getGroupAtIndex(0).get('departmentManagerGroup').setValue({ departmentManager: component.contacts[0] });
    fixture.detectChanges();
    expect(btn.nativeElement.disabled).toBeFalsy();
  });

  it('Check Delete Department button click with dialog', () => {
    spyOn<any>(component, 'openConfirmLinkDialog').and.callThrough();
    spyOn(component, 'deleteDepartment').and.callThrough();
    fixture.detectChanges();
    component.departments = departments;
    component.deleteDepartment('700096ec-1a08-409a-9b6e-2561213f9cbc');
    expect(component['openConfirmLinkDialog']).toHaveBeenCalledWith('700096ec-1a08-409a-9b6e-2561213f9cbc');
  });

  it('Check sortContact called', () => {
    spyOn(component, 'sortContacts').and.callThrough();
    component.ngAfterViewInit();
    expect(component.sortContacts).toHaveBeenCalled();
  });

  it('Check onManagerSelectChange called with parameter', () => {
    const item = {
      id: 1
    };
    spyOn(component, 'onManagerSelectChange').and.callThrough();
    component.onManagerSelectChange(item);
    fixture.detectChanges();
    expect(component.onManagerSelectChange).toHaveBeenCalledWith(item);
  });

  it('Check resetForm when showsettings true', () => {
    component.departments = departments;
    component.showSettings = true;
    component.getGroupAtIndex(0).patchValue({ departmentName: 'Chemistry' });
    spyOn(component, 'resetForm').and.callThrough();
    component.resetForm();
    const departmentName = fixture.debugElement.nativeElement.querySelector('spec_departmentName');
    expect(departmentName).toEqual(null);
    expect(component.departmentForm).not.toBe(null);
  });

  it('Check resetForm when showsettings false', () => {
    component.departments = departments;
    spyOn(component, 'resetForm').and.callThrough();
    component.resetForm();
    expect(component.isFormValid).toBe(false);
  });

  it('Check form submitted', async(() => {
    component.isFormSubmitting = true;
    component.showSettings = true;
    component.departments = departments;
    component.departmentForm.value.departmentsArray = DepartmentFormArray;
    const typeofoperation = true;
    const spy = spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit(DepartmentFormArray, typeofoperation);
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('#spec_updateButton');
    button.click();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith(DepartmentFormArray, typeofoperation);
    });
  }));

  it('Should validation on input called', () => {
    const userContacts1: User[] | any[] = [{
      children: [],
      contactId: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
      contactInfo: {
        email: '',
        entityType: PortalDataDocumentType.Contact,
        firstName: '',
        id: '',
        lastName: '',
        middleName: '',
        name: '',
        phone: '123456789'
      },
      displayName: 'Vishwajit Shinde',
      id: 'ea3072f7-2dee-4454-880b-9efb8b34b617',
      nodeType: 7,
      parentAccounts: [],
      parentNode: null,
      parentNodeId: '505B0FB328D44534A3FFB7232402B874',
      preferences: {},
      userOktaId: '00u50g52e23hH9W472p7',
      userRoles: ['LabSupervisor', 'LeadTechnician', 'Technician']
    }];
    component.contacts = userContacts1;
    component.location = new LabLocation();
    component.location.children = departments;
    component.departments = departments;
    spyOn(component, 'valuechange').and.callThrough();
    spyOn(component, 'isNameDuplicate').and.callThrough();
    spyOn(component, 'checkValidation').and.callThrough();
    component.valuechange('department', '0');
    fixture.detectChanges();
    expect(component.isNameDuplicate).toHaveBeenCalled();
    expect(component.checkValidation).toHaveBeenCalledWith(component.duplicateFound);
  });
});
