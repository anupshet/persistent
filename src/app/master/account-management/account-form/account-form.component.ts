// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil, take } from 'rxjs/operators';
import * as moment from 'moment';

import { unsubscribe } from '../../../core/helpers/rxjs-helper';
import { Account } from '../../../contracts/models/account-management/account';
import { Address } from '../../../contracts/models/account-management/address.model';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { AccountFormValidatorService } from './services';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';
import { unCountryCodes } from '../../../core/config/constants/un-country-codes.const';
import { AccountManagementApiService } from '../account-management-api.service';
import { Contact } from '../../../contracts/models/account-management/contact.model';
import { Permissions } from '../../../security/model/permissions.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { AddressResponse, LocationUtilitiesService } from '../../../shared/services/location-utilities.service';
import { MultipleButtonDialogComponent } from '../../../shared/components/multiple-button-dialog/multiple-button-dialog.component';
import { FeatureFlagsService } from '../../../shared/services/feature-flags.service';

@Component({
  selector: 'unext-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
  providers: [
    AccountFormValidatorService,
  ],
})
export class AccountFormComponent implements OnInit, OnDestroy {
  accountForm: FormGroup;
  countriesList: any[];
  editMode = false;
  displayWarning = false;
  clicked = false;
  updateChangesMade = true;
  existingAccountInformation: any;

  @ViewChild('sapNumber')
  sapNumberElement: ElementRef;

  maxMonths = 72;
  customerAccount: Account;
  licenseTypes: Array<any>;
  connectivityOptions: Array<any>;
  transformers: Array<any>;
  assignedTransformersList: Array<any> = [];
  licenseMonths = [];
  dateType: string;
  shipTo: string;
  soldTo: string;

  // Errors
  errorAccountMessage = '';

  private destroy$ = new Subject<boolean>();
  protected formChangesSubscription: Subscription;
  addAccountSubscription: Subscription;
  emailCheckSubscription: Subscription;
  updateAccountSubscription: Subscription;
  userCheckSubscription: Subscription;
  isProcessing = false;
  isInvalidAccountFormAddress: boolean = false;

  icons = icons;
  iconsUsed: Array<Icon> = [icons.close[24]];
  permissions = Permissions;
  languageValidators = [];
  isLocalizationActive: boolean = false;
  readonly defaultLanguageValue = 'en-US';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountFormComponent>,
    public dialog: MatDialog,
    private accountFormValidatorService: AccountFormValidatorService,
    private messageSnackBarService: MessageSnackBarService,
    private changeTrackerService: ChangeTrackerService,
    private matDialogService: MatDialogRef<any>,
    private accountManagementApiService: AccountManagementApiService,
    private brPermissionsService: BrPermissionsService,
    private formbuilder: FormBuilder,
    private locationService: LocationUtilitiesService,
    private featureFlagsService: FeatureFlagsService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.accountForm = this.formbuilder.group({
      accountNumber: '', // Removed per Gurneet 7-13-2023
      accountName: [
        '',
        [Validators.required, Validators.maxLength(200)]
      ],
      legacyPrimaryLabNumber: [
        '',
        [Validators.maxLength(10)]
      ],
      address: [
        ''
        , [Validators.required, Validators.maxLength(100)]
      ],
      country: [
        null,
        [Validators.required]
      ],
      state: [
        '',
        [Validators.required]
      ],
      email: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.email],
      ],
      city: [
        '',
        [Validators.required, Validators.maxLength(60)]
      ],
      address2: [
        '',
        [Validators.maxLength(100)]
      ],
      address3: [
        '',
        [Validators.maxLength(100)]
      ],
      firstName: [
        '',
        [Validators.required, Validators.maxLength(50)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.maxLength(50)]
      ],
      zipCode: [
        '',
        [Validators.maxLength(20)]
      ],
      phone: [
        '',
        [Validators.maxLength(25)]
      ],
      languagePreference: [
        this.defaultLanguageValue,
        [Validators.required]
      ]
    });

    this.languageValidators = ['required'];

    const hasAddEdit = this.hasPermissionToAccess([Permissions.AccountAdd, Permissions.AccountEdit]);
    /* Applying Permissions to the Accounts Form */
    if (!hasAddEdit) {
      this.accountForm.disable();
    } else {
      this.accountForm.enable();
    }
    /* Applying Permissions to the Accounts Form */

    if (this.data) {
      this.editMode = true;
      const accountAddress = this.data.accountAddress;
      const accountContact = this.data.accountContact;
      this.accountForm.patchValue({
        accountNumber: this.data.accountNumber,
        legacyPrimaryLabNumber: this.data.legacyPrimaryLabNumber,
        accountName: this.data.displayName,
        address: accountAddress?.streetAddress1,
        city: accountAddress?.city,
        state: accountAddress?.state,
        country: accountAddress?.country,
        zipCode: accountAddress?.zipCode,
        firstName: accountContact?.firstName,
        lastName: accountContact?.lastName,
        email: accountContact?.email,
        address2: accountAddress?.streetAddress2,
        address3: accountAddress?.streetAddress3,
        phone: accountContact?.phone,
        languagePreference: this.data.languagePreference || this.defaultLanguageValue
      });

      this.existingAccountInformation = this.accountForm.value;
      if (this.data.isMigrationStatusEmpty && hasAddEdit) {
        this.accountForm.controls.legacyPrimaryLabNumber.enable();
      } else {
        this.accountForm.controls.legacyPrimaryLabNumber.disable();
      }
    }

    // To keep track of value changed or not
    this.accountForm.valueChanges.subscribe(formValue => {
      this.updateChangesMade = JSON.stringify(formValue) === JSON.stringify(this.existingAccountInformation);
    });

    this.countriesList = [];
    unCountryCodes.forEach((countryCode) => {
      this.countriesList.push({
        countryCode: countryCode,
        countryName: this.getCountry(countryCode),
      });
    });
    this.setupChangeTracker();

    if ( hasAddEdit && !this.data ) {
      this.firstDisabled();
    }
    this.accountForm.get('country').valueChanges.subscribe(value => {
      this.handleCountryChange()
    });
    this.accountForm.get('state').valueChanges.subscribe(value => {
      this.handleAddressChange()
    });
    this.accountForm.get('city').valueChanges.subscribe(value => {
      this.handleAddressChange()
    });
    this.accountForm.get('address').valueChanges.subscribe(value => {
      this.handleAddressChange()
    });
    this.accountForm.get('zipCode').valueChanges.subscribe(value => {
      this.handleAddressChange()
    });

    this.initializeFlagListeners();
  }

  initializeFlagListeners() {
    if (this.featureFlagsService.hasClientInitialized()) {
      this.isLocalizationActive = this.featureFlagsService.getFeatureFlag('localization-toggle', false);
    } else {
      this.featureFlagsService.getClient().on('initialized', () => {
        const valueFlag = this.featureFlagsService.getFeatureFlag('localization-toggle');
        this.isLocalizationActive = valueFlag;
      });
    }
    this.featureFlagsService.getClient().on('change:localization-toggle', (value: boolean, previous: boolean) => {
      this.isLocalizationActive = value;
    });
  }

  handleAddressChange(): void {
    if (this.isInvalidAccountFormAddress) {
      this.markAddressInvalidState(false)
    }
  }

  handleCountryChange(): void {
    if (this.accountForm.controls.country?.value !== '' && !this.data) {
      this.toggleDisableAccountFormControls('enable', ['state','zipCode','address','city'])
      this.resetMultipleAccountFormControls(['state','city','zipCode','address'])
    }
    if (this.isInvalidAccountFormAddress) {
      this.markAddressInvalidState(false)
    }
  }

  toggleDisableAccountFormControls(action: string, formControls: Array<string>): void {
    if ( action === 'enable' ) {
      formControls.forEach( control => { this.accountForm.controls[control].enable() });
    } else if ( action === 'disable' ) {
      formControls.forEach( control => { this.accountForm.controls[control].disable() });
    }
  }

  resetMultipleAccountFormControls( formControls: Array<string> ): void {
    formControls.forEach( control => {
      this.accountForm.controls[control].setValue('')
    });
  }

  firstDisabled (): void {
    this.toggleDisableAccountFormControls('disable', ['state','city','zipCode','address'])
  }

  handleAddressValidation(fromExitAndSave = false, fromUpdateAccount = false): void {
    const params = {
      address: this.accountForm.controls.address.value,
      country: this.accountForm.controls.country.value,
      state: this.accountForm.controls.state.value,
      city: this.accountForm.controls.city.value,
      zipCode: this.accountForm.controls.zipCode.value
    }
    this.locationService.validateAddress(params)
    .pipe(take(1))
    .subscribe( results => {
        if ( results.hasError ) {
          this.markAddressInvalidState(true)
          return
        }
        if ( results.hasCorrection ) {
          const dialogRef = this.dialog.open(MultipleButtonDialogComponent, {
              width: '580px',
              data: {
                message: [this.getTranslation('ACCOUNTDETAILS.ADDRESSCONFIRM.NOMATCHFOUND'), (results as any).result?.freeformAddress],
                cancelButton: true,
                cancelButtonText: this.getTranslation('ACCOUNTDETAILS.ADDRESSCONFIRM.CANCEL'),
                buttons: [
                  {
                    text: this.getTranslation('ACCOUNTDETAILS.ADDRESSCONFIRM.OK'),
                    returns: 'CONFIRM',
                    flat: true,
                    color: 'primary'
                  },
                  {
                    text: this.getTranslation('ACCOUNTDETAILS.ADDRESSCONFIRM.PROCEEDANYWAY'),
                    returns: 'PROCEED',
                    stroked: true,
                    color: 'primary'
                  }
                ]
              }
          });
          dialogRef.afterClosed()
            .subscribe(dialogResult => {
              if (dialogResult == 'PROCEED') {
                this.processAccount(fromExitAndSave, fromUpdateAccount)
              } else if ( dialogResult == 'CONFIRM' ) {
                this.handleAddressCorrection(results.result)
                this.processAccount(fromExitAndSave, fromUpdateAccount)
              } else {
                this.markAddressInvalidState(true)
              }
            })
        } else {
          this.processAccount(fromExitAndSave, fromUpdateAccount)
        }
      })
  }

  processAccount(fromExitAndSave: boolean = false, fromUpdateAccount: boolean = false): void {
    if (fromExitAndSave) {
      if (this.accountForm.valid) {
        if (this.data) {
          this.updateAccount();
        } else {
          this.createAccount();
        }
      }
    } else if (fromUpdateAccount) {
      this.updateAccount()
    } else {
      this.createAccount()
    }
  }

  handleAddressCorrection(unformattedAddress: AddressResponse): void {
    const cleanAddress = this.locationService.formatAddress(unformattedAddress)
    const { state, city, zipCode, address } = cleanAddress
    this.accountForm.controls.state.setValue(state)
    this.accountForm.controls.city.setValue(city)
    this.accountForm.controls.zipCode.setValue(zipCode)
    this.accountForm.controls.address.setValue(address)
  }

  markAddressInvalidState(state: boolean): void {
    this.accountForm.controls.address.setErrors({invalidAddress: state})
    this.accountForm.controls.state.setErrors({invalidAddress: state})
    this.accountForm.controls.city.setErrors({invalidAddress: state})
    this.accountForm.controls.zipCode.setErrors({invalidAddress: state})
    this.accountForm.controls.country.setErrors({invalidAddress: state})
    if ( !state && this.isInvalidAccountFormAddress ) {
      this.accountForm.get('address').setErrors(null)
      this.accountForm.get('state').setErrors(null)
      this.accountForm.get('city').setErrors(null)
      this.accountForm.get('zipCode').setErrors(null)
      this.accountForm.get('country').setErrors(null)
    }
    this.isInvalidAccountFormAddress = state
  }

  ngOnDestroy() {
    unsubscribe(this.addAccountSubscription);
    unsubscribe(this.emailCheckSubscription);
    unsubscribe(this.updateAccountSubscription);
    unsubscribe(this.userCheckSubscription);
  }

  // convenience getter for easy access to form fields
  get f(): {
    [key: string]: AbstractControl;
  } {
    return this.accountForm.controls;
  }

  // To allow prepopulation of License Type dropdown
  compareLicenseTypeOptions(obj1: string, obj2: number) {
    return parseInt(obj1, 10) === obj2;
  }

  // To allow prepopulation of Connectivity dropdown in edit mode
  compareConnectivityOptions(obj1: string, obj2: number) {
    return parseInt(obj1, 10) === obj2;
  }

  licenseDateFilter = (d: moment.Moment): boolean => {
    const day = d.day();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  getCountry(countryCode: string): string {
    return this.getTranslation('COUNTRY.COUNTRY' + countryCode.toUpperCase());
  }

  setupChangeTracker(): void {
    const me = this;
    me.changeTrackerService.getDialogRef(async function () {
      me.matDialogService.close();
    });
    me.formChangesSubscription = me.accountForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (me.accountForm.dirty) {
          me.changeTrackerService.setDirty();
          me.changeTrackerService.setCustomPrompt(async function () {
            me.displayWarning = true;
          });
        } else {
          me.changeTrackerService.resetDirty();
        }
      });
  }

  close() {
    this.changeTrackerService.unSavedChanges
      ? (this.displayWarning = true)
      : this.matDialogService.close();
    Object.keys(this.accountForm.controls).forEach((key) => {
      this.accountForm.get(key).markAsPristine();
    });
  }

  onExitWithoutSaving() {
    this.changeTrackerService.resetDirty();
  }

  onSubmit() {
    this.changeTrackerService.resetDirty();
  }

  fetchAddAccountFormData(id?: string) : Account {
    const account = new Account();
    const address = new Address();
    const contact = new Contact();

    // If editing, include ids.
    if (id) {
      account.id = id;

      if (this.data.accountAddress) {
        account.accountAddressId = this.data.accountAddress.id;
      }
      if (this.data.accountContact) {
        account.accountContactId = this.data.accountContact.id;
      }
    }

    if (this.accountForm.controls.accountName) {
      account.accountName = (this.accountForm.controls.accountName.value).trim();
      account.displayName = (this.accountForm.controls.accountName.value).trim();
    }

    if (this.accountForm.controls.accountNumber) {
      account.accountNumber = this.accountForm.controls.accountNumber.value;
    }

    if (this.accountForm.controls.legacyPrimaryLabNumber) {
      account.primaryUnityLabNumbers = this.accountForm.controls.legacyPrimaryLabNumber.value;
    }

    if (this.accountForm.controls.address) {
      address.streetAddress1 = (this.accountForm.controls.address.value).trim();
    }

    if (this.accountForm.controls.address2) {
      address.streetAddress2 = (this.accountForm.controls.address2.value).trim();
    }

    if (this.accountForm.controls.address3) {
      address.streetAddress3 = (this.accountForm.controls.address3.value).trim();
    }

    if (this.accountForm.controls.city) {
      address.city = (this.accountForm.controls.city.value).trim();
    }

    if (this.accountForm.controls.state) {
      address.state = this.accountForm.controls.state.value;
    }

    if (this.accountForm.controls.zipCode) {
      address.zipCode = this.accountForm.controls.zipCode.value;
    }

    if (this.accountForm.controls.country) {
      address.country = this.accountForm.controls.country.value;
    }

    account.accountAddress = address;

    if (this.accountForm.controls.firstName) {
      contact.firstName = (this.accountForm.controls.firstName.value).trim();
    }

    if (this.accountForm.controls.lastName) {
      contact.lastName = (this.accountForm.controls.lastName.value).trim();
    }

    if (this.accountForm.controls.firstName && this.accountForm.controls.lastName) {
      contact.name = (this.accountForm.controls.firstName.value).trim() + ' ' + (this.accountForm.controls.lastName.value).trim();
    }

    if (this.accountForm.controls.email) {
      contact.email = this.accountForm.controls.email.value;
    }

    if (this.accountForm.controls.phone) {
      contact.phone = this.accountForm.controls.phone.value;
    }

    if (this.accountForm.controls.languagePreference && this.isLocalizationActive) {
      account.languagePreference = this.accountForm.controls.languagePreference.value;
    }
    else {
      account.languagePreference = this.data?.languagePreference || this.defaultLanguageValue;
    }

    account.accountContact = contact;
    return account;
  }

  createAccount() {
    try {
      this.accountForm.markAsPristine();
      if (this.accountForm.valid) {
        this.isProcessing = true;
        const account = this.fetchAddAccountFormData();
        this.addAccountSubscription = this.accountManagementApiService
          .addAccount(account)
          .pipe(
            finalize(() => {
              this.clicked = false;
              this.isProcessing = false;
            }), take(1)
          )
          .subscribe(
            (newAccount) => {
              this.dialogRef.close(
                this.getTranslation('TRANSLATION.CREATEACCOUNT') +
                ' ' +
                newAccount.displayName
              );
              this.changeTrackerService.resetDirty();
            },
            (e) => {
              if (e && e.message) {
                this.errorAccountMessage = e.message;
              }
            }
          );
      }
    } catch (e) {
      if (e && e.message) {
        this.errorAccountMessage = e.message;
        this.messageSnackBarService.showMessageSnackBar(
          this.getTranslation('TRANSLATION.UPDATEACCOUNT') +
          ' ' +
          this.errorAccountMessage,
          3000
        );
      }
      this.clicked = false;
      this.isProcessing = false;
    }
  }

  updateAccount() {
    try {
      this.accountForm.markAsPristine();
      if (this.accountFormValidatorService.isFormValid(this.accountForm)) {
        this.isProcessing = true;

        const account = this.fetchAddAccountFormData(
          this.data.id
        );

        this.updateAccountSubscription = this.accountManagementApiService.updateAccount(account)
          .pipe(
            finalize(() => {
              this.isProcessing = false;
            }), take(1))
          .subscribe(
            (updateAccount: Account) => {
              this.dialogRef.close(
                this.getTranslation('TRANSLATION.UPDATEACCOUNT') +
                ' ' +
                this.accountForm.controls.accountName.value
              );
              this.changeTrackerService.resetDirty();

              if (!!updateAccount.previousContactUserId) {
                this.confirmDeletionOfPreviousContact(updateAccount.previousContactUserId);
              }
            },
            e => {
              if (e && e.message) {
                this.errorAccountMessage = ' ' + this.getTranslation('TRANSLATION.ERROROCCURED');
              }
            }
          );
      }
    } catch (e) {
      if (e && e.message) {
        this.errorAccountMessage = e.message;
        this.messageSnackBarService.showMessageSnackBar(
          this.getTranslation('TRANSLATION.ERROROCCURED') + ' ' + this.errorAccountMessage,
          10000
        );
      }

      this.isProcessing = false;
    }
  }

  private confirmDeletionOfPreviousContact(previousContactUserId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: this.getTranslation('ACCOUNTDETAILS.CONFIRMDIALOG.DELETEPREVIOUSUNUSEDCONTACT'),
        cancelButtonText: this.getTranslation('ACCOUNTDETAILS.CONFIRMDIALOG.NO'),
        confirmButtonText: this.getTranslation('ACCOUNTDETAILS.CONFIRMDIALOG.YES')
      }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe(hasConfirmed => {
        if (hasConfirmed) {
          this.accountManagementApiService.deleteUser(previousContactUserId)
            .pipe(
              take(1)
            )
            .subscribe(
              () => {
                this.messageSnackBarService.showMessageSnackBar(this.getTranslation('ACCOUNTDETAILS.CONFIRMDIALOG.DELETEPREVIOUSUNUSEDCONTACTSUCCESS'));
              },
              (e) => {
                if (e && e.message) {
                  this.messageSnackBarService.showMessageSnackBar(this.getTranslation('ACCOUNTDETAILS.CONFIRMDIALOG.DELETEPREVIOUSUNUSEDCONTACTERROR'));
                }
              }
            );
        }
      });
  }

  saveAndExit() {
    this.handleAddressValidation(true, false)
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translateService.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
