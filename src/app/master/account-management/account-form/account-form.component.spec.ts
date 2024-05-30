// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgRedux } from '@angular-redux/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AccountFormComponent } from './account-form.component';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { UserManagementApiService } from '../../../shared/api/userManagementApi.service';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { OrchestratorApiService } from '../../../shared/api/orchestratorApi.service';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';
import { AccountManagementApiService } from '../account-management-api.service';
import { TreePill } from '../../../contracts/models/lab-setup';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { UserRole } from '../../../contracts/enums/user-role.enum';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../app.module';
import { LocationUtilitiesService } from '../../../shared/services/location-utilities.service';
import { FeatureFlagsService } from '../../../shared/services/feature-flags.service';
import { LanguageDropdownComponent } from '../../../shared/components/language-dropdown/language-dropdown.component';

describe('AccountFormComponent', () => {
  let component: AccountFormComponent;
  let fixture: ComponentFixture<AccountFormComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const mockAccountForm = formBuilder.group({
    accountNumber: 'U123456',
    accountName: [
      '',
      [
        Validators.required,
        Validators.maxLength(200)
      ]
    ],
    address: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],
    country: [
      null,
      [
        Validators.required,
      ]
    ],
    state: [
      '',
      [
        Validators.required,
        Validators.maxLength(3)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.maxLength(100),
        Validators.email
      ]
    ],
    city: [
      '',
      [
        Validators.required,
        Validators.maxLength(60)
      ]
    ],
    address2: [
      '',
      [
        Validators.maxLength(100)
      ]
    ],
    address3: [
      '',
      [
        Validators.maxLength(100)
      ]
    ],
    firstName: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],
    zipCode: [
      '',
      [
        Validators.required,
        Validators.maxLength(20)
      ]
    ],
    phone: [
      '',
      [
        Validators.maxLength(25)
      ]
    ],
    // languagePreference: [
    //   '',
    //   [Validators.required]
    // ]
  });

  const mockNewAccount = {
    'id': '',
    'children': null,
    'nodeType': EntityType.Account,
    'parentNodeId': '',
    'displayName': 'LabTEST',
    'accountName': 'LabTEST',
    'accountNumber': '',
    'accountAddress': {
      'id': '',
      'streetAddress1': 'xyz colony',
      'streetAddress2': 'xyz colony',
      'streetAddress3': '',
      'city': 'Pune',
      'state': 'MH',
      'zipCode': '411052',
      'country': 'Argentina',
      'entityType': 1
    },
    'accountContact': {
      'firstName': 'Divya',
      'lastName': 'Lalwani',
      'name': 'Divya Lalwani',
      'email': 'divya_lalwani+testapi1@bio-rad.com',
      'phone': '123'
    },
    'contactRoles': [UserRole.AccountUserManager],
    'previousContactUserId': null,
    'languagePreference': 'es-ES'
  };

  const mockAccountManagementService = {
    form: mockAccountForm,
    addAccount: (): Observable<TreePill> => {
      return of(mockNewAccount);
    },
    updateAccount: (): Observable<TreePill> => {
      return of(mockNewAccount);
    },
    deleteUser: (): Observable<any> => {
      return of({});
    }
  };

  const mockUserManagementService = {
    response: 'test',
    queryUserByEmail: (email: string) => {
      return of(mockUserManagementService.response);
    }
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const changeState = {
    hasChanges: false,
    okCustomAction: null,
    customPromptAction: null,
    cancelCustomAction: null,
    currentDialogRef: null
  };

  const locationResponse = {
    country: "México",
    countryCode: "MX",
    countryCodeISO3: "MEX",
    countrySubdivision: "Aguascalientes",
    freeformAddress: "xyz, abc, 15555, Aguascalientes, Aguascalientes",
    localName: "Aguascalientes",
    municipality: "Aguascalientes",
    municipalitySubdivision: "abc",
    postalCode: "20210",
    streetName: "xyz",
    streetNumber: "120",
  };

  const mockChangeTrackerService = {
    getDialogRef(customCallback: Function) {
      changeState.currentDialogRef = customCallback;
    },
    resetDirty: () => { }
  };

  const mockOrchestratorApiService = {
    getConnectivityTransformers: (accountId: string) => null
  };

  const accountFormValue = {
    accountNumber: '123',
    accountName: '12345',
    legacyPrimaryLabNumber: 'UN12345',
    address: 'xyz colony',
    country: 'India',
    state: 'MP',
    email: 'divya_lalwani+devadmin@bio-rad.com',
    city: 'bhopal',
    address2: 'xyz colony',
    address3: 'xyz colony',
    firstName: 'divya',
    lastName: 'lalwani',
    zipCode: '451001',
    phone: '1234',
    languagePreference: 'es-ES'
  };

  const accountFormValueNoLanguagePreferenceChange = {
    accountNumber: '123',
    accountName: '12345',
    legacyPrimaryLabNumber: 'UN12345',
    address: 'xyz colony',
    country: 'India',
    state: 'MP',
    email: 'divya_lalwani+devadmin@bio-rad.com',
    city: 'bhopal',
    address2: 'xyz colony',
    address3: 'xyz colony',
    firstName: 'divya',
    lastName: 'lalwani',
    zipCode: '451001',
    phone: '1234'
  };

  const accountFormUpdateValue = {
    accountNumber: '123',
    accountName: '12345',
    address: 'xyz colony',
    legacyPrimaryLabNumber: 'UN12345',
    country: 'India',
    state: 'MP',
    email: 'divya_lalwani+devadmin@bio-rad.com',
    city: 'bhopal',
    address2: 'xyz colony',
    address3: 'xyz colony',
    firstName: 'divya',
    lastName: 'lalwani',
    zipCode: '451001',
    phone: '123456',
    languagePreference: 'fr-FR'
  };

  const dialogRefStub = {
    close: () => { },
    afterClosed: () => of(false)
  };

  const dialogStub = {
    open: () => dialogRefStub,
    close: () => { }
  };

  const State = [];
  const mockTranslationService = {
    getTranslatedMessage: () => { }
  };

  const mockBrPermissionsService = {
    hasAccess: () =>  true,
  };

  const mockLocationService = {
    validateAddress: (addressParams) => {
      return of({
        hasError: false,
        hasCorrection: false,
        message: '',
        result: locationResponse
      })
    },
    addressCleanUp: (dirtyAddress)=> {
      return { state: '', city: '', zipCode: '', address: '' }
    }
  }

  let isLocalizationActive = true;

  const mockFeatureFlagsService = {
    hasClientInitialized: () => true,
    getFeatureFlag: () => isLocalizationActive,
    getClient: () => { return { on: () => {} } }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountFormComponent,
        LanguageDropdownComponent
      ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(State),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: { runIndex: 1 } },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: PortalApiService, useValue: PortalApiService },
        { provide: OrchestratorApiService, useValue: mockOrchestratorApiService },
        { provide: UserManagementApiService, useValue: UserManagementApiService },
        { provide: UserManagementService, useValue: mockUserManagementService },
        { provide: MessageSnackBarService },
        { provide: MatSnackBar },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: NgRedux, useValue: {} },
        { provide: MatDialog, useValue: dialogStub },
        { provide: ChangeTrackerService, useValue: mockChangeTrackerService },
        { provide: AccountManagementApiService, useValue: mockAccountManagementService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        TranslateService,
        { provide: LocationUtilitiesService, useValue: mockLocationService },
        { provide: FeatureFlagsService, useValue: mockFeatureFlagsService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    isLocalizationActive = true;
    fixture = TestBed.createComponent(AccountFormComponent);
    component = fixture.componentInstance;
    component.data = mockNewAccount;
    mockNewAccount.previousContactUserId = null;
    dialogRefStub.afterClosed = () => of(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test a form group element count', () => {
    const formElement = fixture.debugElement.nativeElement.querySelectorAll('input');
    expect(formElement.length).toEqual(12);
  });

  it('check initial form values', () => {
    const accountFormValues = {
      accountNumber: 'U123456',
      accountName: '',
      address: '',
      country: null,
      state: '',
      email: '',
      city: '',
      address2: '',
      address3: '',
      firstName: '',
      lastName: '',
      zipCode: '',
      phone: '',
      // languagePreference: '',
    };
    expect(mockAccountForm.value).toEqual(accountFormValues);
  });

  it('should create account', () => {
    component.accountForm.setValue(accountFormValue);
    component.accountForm.enable();
    component.accountForm.setValue({
      ...component.accountForm.value,
      state: accountFormValue.state,
      city: accountFormValue.city,
      zipCode: accountFormValue.zipCode,
    })
    component.accountForm.controls['address'].setValue(accountFormValue.address)
    fixture.detectChanges();
    const spyObj = spyOn(component['accountManagementApiService'], 'addAccount').and.callThrough();
    component.createAccount();
    fixture.detectChanges();

    const accountFromForm = component.fetchAddAccountFormData();
    expect(accountFromForm.languagePreference).toEqual(accountFormValue.languagePreference);
    expect(spyObj).toHaveBeenCalledWith(accountFromForm);
  });

  it('should update account', () => {
    component.accountForm.patchValue(accountFormUpdateValue);
    component.accountForm.enable();
    component.accountForm.setValue({
      ...component.accountForm.value,
      state: accountFormUpdateValue.state,
      city: accountFormUpdateValue.city,
      zipCode: accountFormUpdateValue.zipCode,
    })
    component.accountForm.controls['address'].setValue(accountFormUpdateValue.address)
    fixture.detectChanges();
    const spyObj = spyOn(component['accountManagementApiService'], 'updateAccount').and.callThrough();
    component.updateAccount();
    fixture.detectChanges();

    const accountFromForm = component.fetchAddAccountFormData();
    expect(accountFromForm.languagePreference).toEqual(accountFormUpdateValue.languagePreference);
    expect(spyObj).toHaveBeenCalledWith(accountFromForm);
  });

  it('should update account and not present previous contact deletion dialog', () => {
    component.accountForm.patchValue(accountFormUpdateValue);
    component.accountForm.enable();
    component.accountForm.setValue({
      ...component.accountForm.value,
      state: accountFormUpdateValue.state,
      city: accountFormUpdateValue.city,
      zipCode: accountFormUpdateValue.zipCode,
    })
    component.accountForm.controls['address'].setValue(accountFormUpdateValue.address)
    fixture.detectChanges();
    const spyObj = spyOn(component['accountManagementApiService'], 'updateAccount').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    mockNewAccount.previousContactUserId = null;

    component.updateAccount();
    fixture.detectChanges();

    const accountFromForm = component.fetchAddAccountFormData();
    expect(spyObj).toHaveBeenCalledWith(accountFromForm);
    expect(component.dialog.open).not.toHaveBeenCalled();
  });

  it('should update account and present previous contact deletion dialog', () => {
    component.accountForm.patchValue(accountFormUpdateValue);
    component.accountForm.enable();
    component.accountForm.setValue({
      ...component.accountForm.value,
      state: accountFormUpdateValue.state,
      city: accountFormUpdateValue.city,
      zipCode: accountFormUpdateValue.zipCode,
    })
    component.accountForm.controls['address'].setValue(accountFormUpdateValue.address)
    fixture.detectChanges();
    const spyObj = spyOn(component['accountManagementApiService'], 'updateAccount').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    mockNewAccount.previousContactUserId = 'a1de4052-28a5-479f-b637-ef258e0e2578';

    component.updateAccount();
    fixture.detectChanges();

    const accountFromForm = component.fetchAddAccountFormData();
    expect(spyObj).toHaveBeenCalledWith(accountFromForm);
    expect(component.dialog.open).toHaveBeenCalled();
    mockNewAccount.previousContactUserId = null;
  });

  it('should send request to delete previous user when previous contact deletion confirmation dialog returns true', () => {
    dialogRefStub.afterClosed = () => of(true);
    component.accountForm.patchValue(accountFormUpdateValue);
    component.accountForm.enable();
    component.accountForm.setValue({
      ...component.accountForm.value,
      state: accountFormUpdateValue.state,
      city: accountFormUpdateValue.city,
      zipCode: accountFormUpdateValue.zipCode,
    })
    component.accountForm.controls['address'].setValue(accountFormUpdateValue.address)
    fixture.detectChanges();
    const spyObj = spyOn(component['accountManagementApiService'], 'updateAccount').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    spyOn(component['accountManagementApiService'], 'deleteUser').and.callThrough();
    mockNewAccount.previousContactUserId = 'a1de4052-28a5-479f-b637-ef258e0e2578';

    component.updateAccount();
    fixture.detectChanges();

    const accountFromForm = component.fetchAddAccountFormData();
    expect(spyObj).toHaveBeenCalledWith(accountFromForm);
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component['accountManagementApiService'].deleteUser).toHaveBeenCalled();
    mockNewAccount.previousContactUserId = null;
    dialogRefStub.afterClosed = () => of(false);
  });

  it('should not send request to delete previous user when previous contact deletion confirmation dialog returns false', () => {
    dialogRefStub.afterClosed = () => of(false);
    component.accountForm.patchValue(accountFormUpdateValue);
    component.accountForm.enable();
    component.accountForm.setValue({
      ...component.accountForm.value,
      state: accountFormUpdateValue.state,
      city: accountFormUpdateValue.city,
      zipCode: accountFormUpdateValue.zipCode,
    });

    component.accountForm.controls['address'].setValue(accountFormUpdateValue.address);
    const spyObj = spyOn(component['accountManagementApiService'], 'updateAccount').and.callThrough();
    spyOn(component.dialog, 'open').and.callThrough();
    spyOn(component['accountManagementApiService'], 'deleteUser').and.callThrough();
    mockNewAccount.previousContactUserId = 'a1de4052-28a5-479f-b637-ef258e0e2578';

    component.updateAccount();
    fixture.detectChanges();

    const accountFromForm = component.fetchAddAccountFormData();
    expect(spyObj).toHaveBeenCalledWith(accountFromForm);
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component['accountManagementApiService'].deleteUser).not.toHaveBeenCalled();
    mockNewAccount.previousContactUserId = null;
  });

  it('should address is validated when create account', () => {
    component.accountForm.setValue(accountFormValue);
    component.accountForm.enable();
    fixture.detectChanges();
    const spyObj = spyOn(component['locationService'], 'validateAddress').and.callThrough();
    component.handleAddressValidation(true, false);
    fixture.detectChanges();
    expect(spyObj).toHaveBeenCalled();
  });

  it('should initialize add form with default language preference en-US', () => {
    component.data = null;
    component.ngOnInit();

    expect(component.accountForm.get('languagePreference').value).toEqual(component.defaultLanguageValue);
  });

  it('should initialize edit form with language preference from account object', () => {
    component.data = mockNewAccount;
    component.ngOnInit();
    expect(component.accountForm.get('languagePreference').value).toEqual(mockNewAccount.languagePreference);
  });

  it('should hide language drop-down when feature flag for localization is not enabled and display it if enabled', () => {
    component.isLocalizationActive = false;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('unext-language-dropdown')).toBe(null);

    component.isLocalizationActive = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('unext-language-dropdown')).not.toBe(null);
  });

  it('should send default language preference en-US when adding account when localization feature flag is not enabled', () => {
    isLocalizationActive = false;
    component.data = null;
    component.ngOnInit();
    component.accountForm.patchValue(accountFormValueNoLanguagePreferenceChange);
    component.accountForm.enable();
    component.accountForm.setValue({
      ...component.accountForm.value,
      state: accountFormValue.state,
      city: accountFormValue.city,
      zipCode: accountFormValue.zipCode,
    });
    component.accountForm.controls['address'].setValue(accountFormValue.address);
    fixture.detectChanges();

    const spyObj = spyOn(component['accountManagementApiService'], 'addAccount').and.callThrough();
    component.createAccount();
    fixture.detectChanges();
    const accountFromForm = component.fetchAddAccountFormData();
    expect(accountFromForm.languagePreference).toEqual(component.defaultLanguageValue);
    expect(spyObj).toHaveBeenCalledWith(accountFromForm);
  });

  it('should send selected account\'s current language preference when updating an account and localization feature flag is not enabled', () => {
    isLocalizationActive = false;
    component.ngOnInit();
    fixture.detectChanges();
    const spyObj = spyOn(component['accountManagementApiService'], 'updateAccount').and.callThrough();
    component.updateAccount();
    fixture.detectChanges();

    const accountFromForm = component.fetchAddAccountFormData();
    expect(accountFromForm.languagePreference).toEqual(mockNewAccount.languagePreference);
    expect(spyObj).toHaveBeenCalledWith(accountFromForm);
  });
});
