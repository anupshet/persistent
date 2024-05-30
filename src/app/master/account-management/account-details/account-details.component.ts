// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { unsubscribe } from '../../../core/helpers/rxjs-helper';
import { take, takeUntil } from 'rxjs/operators';
import { PaginationInstance } from 'ngx-pagination';
import { orderBy } from 'lodash';

import { IconService } from '../../../shared/icons/icons.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { AccountManagementApiService } from '../account-management-api.service';
import { OrchestratorApiService } from '../../../shared/api/orchestratorApi.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { UserManagementService } from '../../../shared/services/user-management.service';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { Account } from '../../../contracts/models/account-management/account';
import { Lab } from '../../../contracts/models/lab-setup/lab.model';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, Operations } from '../../../core/config/constants/error-logging.const';
import {
  blankSpace, paginationGroups, maxMonthLength, asc, paginationItemsPerPage,
  localizationToggleCode, nonBrLotsToggleCode, brBrandedToggleCode, featureFlagsChangeCode, featureFlagsInitializedCode
} from '../../../core/config/constants/general.const';
import { LabLocation } from '../../../contracts/models/lab-setup';
import { ConnectivityTier, UnityNextTier } from '../../../contracts/enums/lab-location.enum';
import { Transformer } from '../../../contracts/models/account-management/transformers.model';
import { unCountryCodes } from '../../../core/config/constants/un-country-codes.const';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { PortalDataDocumentType } from '../../../contracts/models/portal-api/portal-data.model';
import { LocationSearchRequest } from '../../../contracts/models/account-management/location-page.model';
import { LocationField } from '../../../contracts/enums/acccount-location-management.enum';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { datePickerValidator } from './datepicker-validator';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Permissions } from '../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { ErrorsInterceptor } from '../../../contracts/enums/http-errors.enum';
import { ConfirmDialogDeleteComponent } from '../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';
import { AddressResponse, LocationUtilitiesService } from '../../../shared/services/location-utilities.service';
import { MultipleButtonDialogComponent } from '../../../shared/components/multiple-button-dialog/multiple-button-dialog.component';
import { FeatureFlagsService } from '../../../shared/services/feature-flags.service';
import { AddOnsFlags, AddOnDisplayItem, ValueAssignmentDefinition,
    AllowBRDefinition, AllowNonBRDefinition, AllowSiemensDefinition, AllowSysmexDefinition, AddOnDisplayItemGroup
} from '../../../contracts/models/lab-setup/lab-location-addons.model';

@Component({
  selector: 'unext-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  @Input() account: Account;
  @Input() accountId: string;
  @Input() location: LabLocation;
  @Input() locationId: string;
  @ViewChild('groupNameValue') groupNameValue: ElementRef;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24]
  ];
  locationForm: FormGroup;
  groups: Array<Lab>;
  editedGroup: Lab;
  locationsData: Array<LabLocation>;
  sortedGroupsList: Array<Lab>;
  groupSelected = false;
  selectedGroup: Lab;
  totalPages = 0;
  readonly maxSize = 5;
  paginationConfig: PaginationInstance = {
    id: paginationGroups,
    itemsPerPage: paginationItemsPerPage,
    currentPage: 1,
    totalItems: 1,
  };
  locationSearchRequest: LocationSearchRequest = {
    groupId: '',
    searchString: '',
    searchColumn: null,
    sortDescending: false,
    sortColumn: LocationField.LocationLabInfo,
    pageIndex: 1,
    pageSize: paginationItemsPerPage,
  };
  licenseMonths: Array<number> = [];
  public unityNextTierOptions = UnityNextTier;
  public connectivityTierOptions = ConnectivityTier;
  protected destroy$ = new Subject<boolean>();
  loadLocationForm = false;
  transformers: Array<Transformer> = [];
  countriesList: any[] = [];
  displayName = '';
  formattedAccountNumber = '';
  isLoadedFromAccount = false;
  displayWarning = false;
  transformerSelectionsChanged = false;
  addOnSelectionsChanged = false;
  protected formChangesSubscription: Subscription;
  emailCheckSubscription: Subscription;
  addLocationSubscription: Subscription;
  groupForm: FormGroup;
  addGroupBtnSelected = false;
  duplicateGroupErrorMsg = false;
  closeBtnClicked = false;
  isAddGroupClicked = false;
  updateSubscription: Subscription;
  editLocationMode = false;
  editGroupButton = false;
  displayDeleteWarning = false;
  existingLocationInformation: any;
  isLicenseActivated = false;
  permissions = Permissions;
  languageValidators = [];
  isInvalidAccountFormAddress = false;
  isLocalizationActive  = false;
  readonly defaultLanguageValue = 'en-US';
  expiryDatePlaceholder: { [key: string]: string };
  assignDatePlaceholder: { [key: string]: string };
  addOnsList: AddOnDisplayItemGroup[] = [];
  selectedAddOns: string[] = [];

  valueAssignmentAddOnItem: AddOnDisplayItem;
  allowBRAddOnItem: AddOnDisplayItem;
  allowNonBRAddOnItem: AddOnDisplayItem;
  allowBRBrandedAddOnItem: AddOnDisplayItem;
  allowSiemensAddOnItem: AddOnDisplayItem;
  allowSysmexAddOnItem: AddOnDisplayItem;

  ff_nonbrlots = false;
  ff_siemenslots = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountDetailsComponent>,
    public dialog: MatDialog,
    private iconService: IconService,
    private accountManagementApiService: AccountManagementApiService,
    private orchestratorApiService: OrchestratorApiService,
    private errorLoggerService: ErrorLoggerService,
    private userManagementService: UserManagementService,
    private messageSnackBarService: MessageSnackBarService,
    private formbuilder: FormBuilder,
    private dateTimeHelper: DateTimeHelper,
    private brPermissionsService: BrPermissionsService,
    private changeTrackerService: ChangeTrackerService,
    private locationService: LocationUtilitiesService,
    private translate: TranslateService,
    groupNameValue: ElementRef,
    private featureFlagsService: FeatureFlagsService
  ) {
    this.groupNameValue = groupNameValue;
    this.iconService.addIcons(this.iconsUsed);
    this.languageValidators = ['required'];
    for (let i = 0; i < maxMonthLength; i++) {
      this.licenseMonths.push(i + 1);
    }
    this.initializeFlagListeners();
  }

  ngOnInit(): void {
    this.assignDatePlaceholder = { 'true': this.getTranslation('ACCOUNTDETAILS.ASSIGNDATESTAR'), 'false': this.getTranslation('ACCOUNTDETAILS.ASSIGNDATE') };
    this.expiryDatePlaceholder = { 'true': this.getTranslation('ACCOUNTDETAILS.EXPIRYDATESTAR'), 'false': this.getTranslation('ACCOUNTDETAILS.EXPIRYDATE') };
    this.valueAssignmentAddOnItem = { value: ValueAssignmentDefinition, displayName: this.getTranslation('ACCOUNTDETAILS.VALUE') };
    this.allowBRAddOnItem = { value: AllowBRDefinition, displayName: this.getTranslation('ACCOUNTDETAILS.BRCONTROLS') };
    this.allowNonBRAddOnItem = { value: AllowNonBRDefinition, displayName: this.getTranslation('ACCOUNTDETAILS.NONBRCONTROLS') };
    this.allowSiemensAddOnItem = { value: AllowSiemensDefinition, displayName: this.getTranslation('ACCOUNTDETAILS.SIEMENSCONTROLS') };
    this.allowSysmexAddOnItem = { value: AllowSysmexDefinition, displayName: this.getTranslation('ACCOUNTDETAILS.SYSMEXCONTROLS') };
    if (this.account) {
      this.displayName = this.account.displayName;
      this.formattedAccountNumber = this.account.formattedAccountNumber === '' ?
        this.account.accountNumber : this.account.formattedAccountNumber;
      this.loadGroups();
      this.groupForm = this.formbuilder.group({
        groupName: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator, this.isGroupNameExist()]]
      });
      this.isLoadedFromAccount = true;
      this.editLocationMode = false;
    }
    if (this.location) {
      this.displayName = this.location.accountName;
      this.formattedAccountNumber = this.location?.formattedAccountNumber;
      this.selectedGroup = {
        id: this.location?.parentNode?.id,
        nodeType: this.location?.parentNode?.nodeType,
        parentNodeId: this.location?.parentNode?.parentNodeId,
        displayName: this.location?.parentNode?.displayName
      };
      this.isLoadedFromAccount = false;
      this.openLocationForm(this.location);
    }
  }

  initializeFlagListeners() {
    if (this.featureFlagsService.hasClientInitialized()) {
      this.isLocalizationActive = this.featureFlagsService.getFeatureFlag(localizationToggleCode, false);
      this.ff_nonbrlots = this.featureFlagsService.getFeatureFlag(nonBrLotsToggleCode, false);
      this.ff_siemenslots = this.featureFlagsService.getFeatureFlag(brBrandedToggleCode, false);
    } else {
      this.featureFlagsService.getClient().on(featureFlagsInitializedCode, () => {
        this.isLocalizationActive = this.featureFlagsService.getFeatureFlag(localizationToggleCode);
        this.ff_nonbrlots = this.featureFlagsService.getFeatureFlag(nonBrLotsToggleCode);
        this.ff_siemenslots = this.featureFlagsService.getFeatureFlag(brBrandedToggleCode);
      });
    }
    this.featureFlagsService.getClient().on(featureFlagsChangeCode + localizationToggleCode, (value: boolean, previous: boolean) => {
      this.isLocalizationActive = value;
    });
    this.featureFlagsService.getClient().on(featureFlagsChangeCode + nonBrLotsToggleCode, (value: boolean, previous: boolean) => {
      this.ff_nonbrlots = value;
    });
    this.featureFlagsService.getClient().on(featureFlagsChangeCode + brBrandedToggleCode, (value: boolean, previous: boolean) => {
      this.ff_siemenslots = value;
    });
  }

  private loadGroups() {
    this.accountManagementApiService.getGroups(EntityType.Account, this.account.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        if (account) {
          this.groups = account.children ? account.children.filter(a => a.nodeType === EntityType.Lab) : [];
          this.sortedGroupsList = orderBy(this.groups, [el => el.displayName.replace(/\s/g, '')
            .toLocaleLowerCase()], [asc]);

          if (this.sortedGroupsList && this.sortedGroupsList.length > 0) {
            this.groupSelected = true;
            let index = 0;
            if (this.selectedGroup) {
              index = this.sortedGroupsList.findIndex(el => el.id === this.selectedGroup.id);
            }
            index = index > 0 ? index : 0;
            this.getLocationsAsPerGroup(this.sortedGroupsList[index]);
          }
        }
      }, error => {
        this.groups = [];
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
            componentInfo.AccountDetailsComponent + blankSpace + Operations.GetAccountGroups));
      });
  }

  getLocationsAsPerGroup(selectedGroup: Lab) {
    this.selectedGroup = selectedGroup;
    this.locationSearchRequest.groupId = selectedGroup.id;
    this.paginationConfig.currentPage = 1;
    this.locationSearchRequest.pageIndex = 1;

    if (selectedGroup) {
      this.loadLocationList(this.locationSearchRequest);
    }
  }

  loadLocationList(locationSearchRequest: LocationSearchRequest) {
    this.locationsData = null;
    this.totalPages = 0;
    this.accountManagementApiService.searchLocations(locationSearchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(locationPage => {
        if (locationPage) {
          this.groupSelected = true;
          this.locationsData = locationPage.locations;
          this.totalPages = locationPage.totalPages;
          this.paginationConfig.totalItems = locationPage.totalItems;
        }
      }, error => {
        this.locationsData = [];
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
            componentInfo.AccountDetailsComponent + blankSpace + Operations.GetAccountGroups));
      });
  }

  getCountriesValues() {
    unCountryCodes.forEach(countryCode => {
      this.countriesList.push({
        countryCode: countryCode,
        countryName: this.getCountry(countryCode)
      });
    });
  }

  getCountry(countryCode: string): string {
    return this.getTranslation('COUNTRY.COUNTRY' + countryCode.toUpperCase());
  }

  onLocationPageChange(pageIndex: number) {
    this.paginationConfig.currentPage = pageIndex;
    this.locationSearchRequest.pageIndex = pageIndex;
    this.loadLocationList(this.locationSearchRequest);
  }

  openLocationForm(location: LabLocation) {
    this.loadLocationForm = true;
    this.getCountriesValues();
    if (location) {
      this.loadTransformersList(location?.parentNode?.parentNodeId, location?.id);
      this.location = location;
      this.editLocationMode = true;
      this.initializeLocationForm(location);
      this.transformerSelectionsChanged = false;
      this.addOnSelectionsChanged = false;
    } else {
      this.loadTransformersList(this.account?.id, location?.id);
      this.initializeLocationForm(null);
      this.editLocationMode = false;
    }
    this.setupChangeTracker();

    /* Applying Permissions to the location Form */
    if (!this.hasPermissionToAccess([Permissions.LocationAdd, Permissions.LocationEdit])) {
      this.locationForm.disable();
    }
    /* Applying Permissions to the location Form */
  }

  backToExistingView() {
    if (this.changeTrackerService.unSavedChanges) {
      this.displayWarning = true;
    } else {
      if (this.isLoadedFromAccount) {
        Object.keys(this.locationForm.controls).forEach((key) => {
          this.locationForm.get(key).markAsPristine();
        });
        this.loadLocationForm = false;
        this.locationForm.reset();
      } else {
        Object.keys(this.locationForm.controls).forEach((key) => {
          this.locationForm.get(key).markAsPristine();
        });
        this.locationForm.reset();
        this.loadLocationForm = false;
        this.dialogRef.close();
      }
    }
  }

  /* LOCATION FORMS FUNCTIONS STARTS */
  initializeLocationForm(location: LabLocation) {
    if (location) {
      const getCountry = this.countriesList.find(country => country.countryCode === location.labLocationAddress?.country);
      // Convert Date to UTC to eliminate timezone issues
      let assignDate = new Date(location.licenseAssignDate);
      let expiryDate = new Date(location.licenseExpirationDate);
      assignDate = new Date(assignDate.getUTCFullYear(), assignDate.getUTCMonth(), assignDate.getUTCDate());
      expiryDate = new Date(expiryDate.getUTCFullYear(), expiryDate.getUTCMonth(), expiryDate.getUTCDate());
      this.locationForm = this.formbuilder.group({
        orderNumber: [location.orderNumber, [Validators.maxLength(50)]],
        unityNextTier: [this.unityNextTierOptions[location.unityNextTier] ? location.unityNextTier : null],
        unityNextInstalledProduct: [location.unityNextInstalledProduct],
        connectivityTier: [this.connectivityTierOptions[location.connectivityTier] ? location.connectivityTier : null],
        connectivityInstalledProduct: [location.connectivityInstalledProduct],
        transformers: [{ value: [], disabled: true }],
        lotViewerLicense: [location.lotViewerLicense],
        addOns: [ this.getSelectedAddOns() , Validators.required],
        lotViewerInstalledProduct: [location.lotViewerInstalledProduct],
        licenseAssignDate: [assignDate],
        licenseExpirationDate: [expiryDate],
        licenseLength: [''],
        licenseNumberUsers: [String(location.licenseNumberUsers), [Validators.maxLength(6), Validators.min(1),
        Validators.pattern(/^[0-9]*$/)]],
        shipTo: [location.shipTo, [Validators.required, Validators.maxLength(20)]],
        soldTo: [location.soldTo, [Validators.required, Validators.maxLength(20)]],
        labLocationName: [location.labLocationName, [Validators.required, Validators.maxLength(200)]],
        labLocationCountryId: [getCountry ? location.labLocationAddress?.country : null, [Validators.required]],
        labLocationAddress: [location.labLocationAddress?.streetAddress1, [Validators.required, Validators.maxLength(100)]],
        labLocationAddressSecondary: [location.labLocationAddress?.streetAddress2, Validators.maxLength(100)],
        labLocationState: [location.labLocationAddress?.state, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        labLocationCity: [location.labLocationAddress?.city, [Validators.required, Validators.maxLength(60)]],
        locationZipCode: [location.labLocationAddress?.zipCode, [Validators.maxLength(20)]],
        labContactEmail: [location.labLocationContact?.email, [Validators.required, Validators.email, Validators.maxLength(50)]],
        labContactFirst: [location.labLocationContact?.firstName, [Validators.required, Validators.maxLength(50)]],
        labContactLast: [location.labLocationContact?.lastName, [Validators.required, Validators.maxLength(50)]],
        comments: [location.comments, [Validators.maxLength(75)]],
        labLanguagePreference: [location.labLanguagePreference || this.defaultLanguageValue, [Validators.required]]
      });
      this.changeUnityNextTier();
      this.handleAddOns(false);
      this.changeConnectivityNextTier();
      this.changeQCLotViewer();
      this.checkForLicensedFields();

      setTimeout(() => {
        this.locationForm.markAllAsTouched(); // waiting for the form to load with all dropdowns values and fields
      }, 500);
      this.existingLocationInformation = this.locationForm.getRawValue();
      this.locationForm.controls['transformers'].setValue([]);
      this.existingLocationInformation.transformers = [];
    } else {
      this.locationForm = this.formbuilder.group({
        orderNumber: ['', [Validators.maxLength(50)]],
        unityNextTier: [this.unityNextTierOptions.None],
        unityNextInstalledProduct: [''],
        connectivityTier: [{ value: this.connectivityTierOptions.None, disabled: true }],
        connectivityInstalledProduct: [''],
        transformers: [{ value: [], disabled: true }],
        lotViewerLicense: [0],
        addOns: [ { value: []} , Validators.required],
        lotViewerInstalledProduct: [''],
        licenseAssignDate: [new Date()],
        licenseExpirationDate: [''],
        licenseLength: [''],
        licenseNumberUsers: [null, [Validators.maxLength(6), Validators.min(1), Validators.pattern(/^[0-9]*$/)]],
        shipTo: ['', [Validators.required, Validators.maxLength(20)]],
        soldTo: ['', [Validators.required, Validators.maxLength(20)]],
        labLocationName: ['', [Validators.required, Validators.maxLength(200)]],
        labLocationAddress: ['', [Validators.required, Validators.maxLength(100)]],
        labLocationAddressSecondary: ['', Validators.maxLength(100)],
        labLocationCountryId: ['', [Validators.required]],
        labLocationState: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        labLocationCity: ['', [Validators.required, Validators.maxLength(60)]],
        locationZipCode: ['', [Validators.maxLength(20)]],
        labContactEmail: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
        labContactFirst: ['', [Validators.required, Validators.maxLength(50)]],
        labContactLast: ['', [Validators.required, Validators.maxLength(50)]],
        comments: ['', [Validators.maxLength(75)]],
        labLanguagePreference: [this.defaultLanguageValue, [Validators.required]]
      });
    }
    this.locationForm.get('labLocationCountryId').valueChanges.subscribe(value => {
      this.handleCountryChange();
    });
    this.locationForm.get('labLocationState').valueChanges.subscribe(value => {
      this.handleAddressChange();
    });
    this.locationForm.get('labLocationCity').valueChanges.subscribe(value => {
      this.handleAddressChange();
    });
    this.locationForm.get('labLocationAddress').valueChanges.subscribe(value => {
      this.handleAddressChange();
    });
    this.locationForm.get('locationZipCode').valueChanges.subscribe(value => {
      this.handleAddressChange();
    });
  }

  handleAddressChange(): void {
    if (this.isInvalidAccountFormAddress) {
      this.markAddressInvalidState(false);
    }
  }

  getSelectedAddOns(): AddOnsFlags {
    const addOns = {
      valueAssignment: this.selectedAddOns.includes(ValueAssignmentDefinition),
      allowBR: this.selectedAddOns.includes(AllowBRDefinition),
      allowNonBR: this.selectedAddOns.includes(AllowNonBRDefinition),
      allowSiemensHematology: this.selectedAddOns.includes(AllowSiemensDefinition),
      allowSysmexHemostasis: this.selectedAddOns.includes(AllowSysmexDefinition)
    };
    return addOns;
  }

  onAddOnSelectionChanged(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      if (event.source.selected) {
        this.selectedAddOns.push(event.source.value);
      } else {
        this.selectedAddOns = this.selectedAddOns.filter(obj => obj !== event.source.value);
      }
    }if (this.editLocationMode) {
      delete this.location.addOnsFlags['allowBRBranded'];
      this.addOnSelectionsChanged = JSON.stringify(this.location.addOnsFlags) !== JSON.stringify(this.getSelectedAddOns());
    }
  }

  handleCountryChange(): void {
    if (this.locationForm.controls.labLocationCountryId?.value !== '') {
      this.toggleDisableAccountFormControls('enable', ['labLocationState', 'locationZipCode', 'labLocationAddress', 'labLocationCity']);
      if (this.hasPermissionToAccess([Permissions.LocationAdd, Permissions.LocationEdit])) {
        this.resetMultipleAccountFormControls(['labLocationState', 'labLocationCity', 'locationZipCode', 'labLocationAddress']);
      }
    }
    if (this.isInvalidAccountFormAddress) {
      this.markAddressInvalidState(false);
    }
  }

  toggleDisableAccountFormControls(action: string, formControls: Array<string>): void {
    if (action === 'enable') {
      formControls.forEach(control => { this.locationForm.controls[control].enable(); });
    } else if (action === 'disable') {
      formControls.forEach(control => { this.locationForm.controls[control].disable(); });
    }
  }

  resetMultipleAccountFormControls(formControls: Array<string>): void {
    formControls.forEach(control => {
      this.locationForm.controls[control].setValue('');
    });
  }

  handleAddressValidation(fromAddLocation: boolean = false, fromUpdateLocation: boolean = false): void {
    const params = {
      address: this.locationForm.controls.labLocationAddress.value,
      country: this.locationForm.controls.labLocationCountryId.value,
      state: this.locationForm.controls.labLocationState.value,
      city: this.locationForm.controls.labLocationCity.value,
      zipCode: this.locationForm.controls.locationZipCode.value
    };
    this.locationService.validateAddress(params)
      .pipe(take(1))
      .subscribe(results => {
        if (results.hasError) {
          this.markAddressInvalidState(true);
          return;
        }
        if (results.hasCorrection) {
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
                this.processAccount(fromAddLocation, fromUpdateLocation);
              } else if (dialogResult == 'CONFIRM') {
                this.handleAddressCorrection(results.result);
                this.processAccount(fromAddLocation, fromUpdateLocation);
              } else {
                this.markAddressInvalidState(true);
              }
            });
        } else {
          this.processAccount(fromAddLocation, fromUpdateLocation);
        }
      });
  }

  processAccount(fromAddLocation: boolean = false, fromUpdateLocation: boolean = false): void {
    if (fromAddLocation) {
      if (this.locationForm.valid) {
        if (this.editLocationMode) {
          this.updateLocation();
        } else {
          this.addLocation();
        }
      }
    } else if (fromUpdateLocation) {
      this.updateLocation();
    } else {
      this.addLocation();
    }
  }

  handleAddressCorrection(unformattedAddress: AddressResponse): void {
    const cleanAddress = this.locationService.formatAddress(unformattedAddress);
    const { state, city, zipCode, address } = cleanAddress;
    this.locationForm.controls.labLocationState.setValue(state);
    this.locationForm.controls.labLocationCity.setValue(city);
    this.locationForm.controls.locationZipCode.setValue(zipCode);
    this.locationForm.controls.labLocationAddress.setValue(address);
  }

  markAddressInvalidState(state: boolean): void {
    this.locationForm.controls.labLocationAddress.setErrors({ invalidAddress: state });
    this.locationForm.controls.labLocationState.setErrors({ invalidAddress: state });
    if (this.locationForm.controls.labLocationCity.value) {
      this.locationForm.controls.labLocationCity.setErrors({ invalidAddress: state });
    }
    if (this.locationForm.controls.locationZipCode.value) {
      this.locationForm.controls.locationZipCode.setErrors({ invalidAddress: state });
    }
    if (!state && this.isInvalidAccountFormAddress) {
      this.locationForm.get('labLocationAddress').setErrors(null);
      this.locationForm.get('labLocationState').setErrors(null);
      this.locationForm.get('labLocationCity').setErrors(null);
      this.locationForm.get('locationZipCode').setErrors(null);
    }
    this.isInvalidAccountFormAddress = state;
  }

  loadTransformersList(accountId: string, locationId: string) {
    try {
      this.orchestratorApiService.getConnectivityTransformers(accountId, locationId).then(transformers => {
        if (transformers) {
          this.transformers = transformers;
          this.transformers = orderBy(this.transformers, [el => el.displayName.replace(/\s/g, '')
            .toLocaleLowerCase()], [asc]);
          if (this.editLocationMode) {
            const selectedTransformers = this.transformers.filter(el => el.isAssigned === true);
            if (selectedTransformers && selectedTransformers.length > 0) {
              this.locationForm.controls['transformers'].setValue(selectedTransformers);
              this.existingLocationInformation.transformers = selectedTransformers;
            }
            // To keep track of value changed or not
            if (this.existingLocationInformation) {
              this.locationForm.valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe(formValue => {
                  this.transformerSelectionsChanged = JSON
                  .stringify(this.locationForm.getRawValue()) !== JSON.stringify(this.existingLocationInformation);
                });
            }

          }
        }
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AccountFormComponent + blankSpace + Operations.GetConnectivityTransformers)));
    }
  }

  validationErrorExists(controlName: string) {
    return ((this.locationForm.controls[controlName].errors || this.locationForm.dirty) && !this.locationForm.valid);
  }

  checkForhasError = (controlName: string, errorName: string) => {
    return this.locationForm.controls[controlName].hasError(errorName);
  }

  /* Change function for Unity Next Tier */
  changeUnityNextTier() {
    const locationFormControls = this.locationForm.controls;
    if (locationFormControls['unityNextTier'].value === this.unityNextTierOptions.PeerQc
      || locationFormControls['unityNextTier'].value === this.unityNextTierOptions.DailyQc) {
      locationFormControls['unityNextInstalledProduct']
        .setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9-]+$/)]);
      locationFormControls['unityNextInstalledProduct'].updateValueAndValidity();
      locationFormControls['connectivityTier'].enable();
    } else {
      locationFormControls['unityNextInstalledProduct'].reset();
      locationFormControls['unityNextInstalledProduct'].clearValidators();
      locationFormControls['unityNextInstalledProduct'].updateValueAndValidity();
      locationFormControls['connectivityTier'].setValue(this.connectivityTierOptions.None);
      locationFormControls['connectivityTier'].disable();
    }
    this.changeConnectivityNextTier();
  }

  /* Change function for Connectivity Next Tier */
  changeConnectivityNextTier() {
    if ((this.locationForm.controls['connectivityTier'].value === this.connectivityTierOptions.UNConnect) || (this.locationForm.controls['connectivityTier'].value === this.connectivityTierOptions.UNUpload)) {
      this.locationForm.controls['connectivityInstalledProduct']
        .setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9-]+$/)]);
      this.locationForm.controls['connectivityInstalledProduct'].updateValueAndValidity();
      this.locationForm.controls['transformers'].setValidators(Validators.required);
      this.locationForm.controls['transformers'].enable();
      this.locationForm.controls['transformers'].updateValueAndValidity();
    } else {
      this.locationForm.controls['connectivityInstalledProduct'].reset();
      this.locationForm.controls['connectivityInstalledProduct'].clearValidators();
      this.locationForm.controls['connectivityInstalledProduct'].updateValueAndValidity();
      this.locationForm.controls['transformers'].reset();
      this.locationForm.controls['transformers'].clearValidators();
      this.locationForm.controls['transformers'].disable();
      this.locationForm.controls['transformers'].updateValueAndValidity();
      this.locationForm.controls['transformers'].setValue([]);
    }
  }

  /* Change function for QCLotViewer */
  changeQCLotViewer() {
    if (this.locationForm.controls['lotViewerLicense'].value) {
      this.locationForm.controls['lotViewerInstalledProduct']
        .setValidators([Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9-]+$/)]);
      this.locationForm.controls['lotViewerInstalledProduct'].updateValueAndValidity();
    } else {
      this.locationForm.controls['lotViewerInstalledProduct'].reset();
      this.locationForm.controls['lotViewerInstalledProduct'].clearValidators();
      this.locationForm.controls['lotViewerInstalledProduct'].updateValueAndValidity();
    }
  }

  unityNextTierInstalledProducts() {
    const locationFormControls = this.locationForm.controls;
    return locationFormControls['unityNextTier'].value === UnityNextTier.PeerQc
      || locationFormControls['unityNextTier'].value === UnityNextTier.DailyQc;
  }

  connectivityNextTierInstalledPrdoucts() {
    const connectivityTierValue = this.locationForm.controls['connectivityTier'].value;
    return (connectivityTierValue === ConnectivityTier.UNConnect || connectivityTierValue === ConnectivityTier.UNUpload) ? true : false;
  }

  qcLotViewerInstalledPrdoucts() {
    return this.locationForm.controls['lotViewerLicense'].value === 1 ? true : false;
  }

  checkForLicensedFields() {
    const unityNextTierValue = this.locationForm.controls['unityNextTier'].value;
    const connectivityTierValue = this.locationForm.controls['connectivityTier'].value;
    const lotViewerLicenseValue = this.locationForm.controls['lotViewerLicense'].value;

    if (unityNextTierValue !== this.unityNextTierOptions.None ||
      connectivityTierValue !== this.connectivityTierOptions.None ||
      lotViewerLicenseValue !== 0) {
      this.isLicenseActivated = true;
      this.setRequiredLicensedFields(true);
    } else {
      this.isLicenseActivated = false;
      this.setRequiredLicensedFields(false);
    }
  }

  handleAddOns(viaLicenseChange: boolean) {
    this.addOnsList = [];
    const addOnItemsObj = {
      displayName: this.getTranslation('ACCOUNTDETAILS.CONTROLS'),
      addOnItems: []
    };
    const valueAssignObj = {
      displayName: this.getTranslation('ACCOUNTDETAILS.OTHERS'),
      addOnItems: []
    };
    if (!viaLicenseChange) {
      this.selectedAddOns = [];
    }
    const licenseValue = this.locationForm.controls['unityNextTier'].value;

    if (licenseValue === this.unityNextTierOptions.DailyQc) {
      addOnItemsObj.addOnItems.push(this.allowNonBRAddOnItem , this.allowBRAddOnItem);
      if (this.ff_siemenslots) {
        addOnItemsObj.addOnItems.push(this.allowSiemensAddOnItem , this.allowSysmexAddOnItem);
      }
      valueAssignObj.addOnItems.push(this.valueAssignmentAddOnItem);
      this.addOnsList.push(addOnItemsObj, valueAssignObj);
      this.selectedAddOns.push(AllowNonBRDefinition);

    } else if (licenseValue === this.unityNextTierOptions.PeerQc) {
      addOnItemsObj.addOnItems.push(this.allowBRAddOnItem);
      if (this.ff_siemenslots) {
        addOnItemsObj.addOnItems.push(this.allowSiemensAddOnItem , this.allowSysmexAddOnItem);
      }
      valueAssignObj.addOnItems.push(this.valueAssignmentAddOnItem);
      this.addOnsList.push(addOnItemsObj, valueAssignObj);
      this.selectedAddOns = this.selectedAddOns.filter(obj => obj === ValueAssignmentDefinition);

    } else if (licenseValue === this.unityNextTierOptions.None) {
      this.selectedAddOns = [];
    }
    // for initial setup
    if (this.editLocationMode && !viaLicenseChange) {
      if (this.location.addOnsFlags.allowBR) {
        this.selectedAddOns.push(AllowBRDefinition);
      }
      if (this.location.addOnsFlags.allowNonBR) {
        this.selectedAddOns.push(AllowNonBRDefinition);
      }
      if (this.location.addOnsFlags.allowSiemensHematology) {
        this.selectedAddOns.push(AllowSiemensDefinition);
      }
      if (this.location.addOnsFlags.allowSysmexHemostasis) {
        this.selectedAddOns.push(AllowSysmexDefinition);
      }
      if (this.location.addOnsFlags.valueAssignment) {
        this.selectedAddOns.push(ValueAssignmentDefinition);
      }
    }
    this.locationForm.controls['addOns'].setValue(this.selectedAddOns);
  }

  isSaveButtonDisabled() {
    if (this.locationForm) {
      const unityNextTierValue = this.locationForm.controls['unityNextTier'].value;
      const lotViewerLicenseValue = this.locationForm.controls['lotViewerLicense'].value;
      if (!this.editLocationMode) {
        return (unityNextTierValue === this.unityNextTierOptions.None && lotViewerLicenseValue === 0);
      } else {
        return (unityNextTierValue === this.unityNextTierOptions.None && lotViewerLicenseValue === 0) ||
        (!this.transformerSelectionsChanged && !this.addOnSelectionsChanged);
      }
    } else {
      return false;
    }
  }

  setRequiredLicensedFields(validatorRequired: boolean) {
    if (validatorRequired) {
      this.locationForm.controls['licenseAssignDate']
        .setValidators(Validators.required);
      this.locationForm.controls['licenseExpirationDate']
        .setValidators(Validators.required);
      this.locationForm.controls['licenseNumberUsers'].setValidators([Validators.maxLength(6), Validators.min(1), Validators.pattern(/^[0-9]*$/), Validators.required]);
      this.locationForm.controls['licenseAssignDate'].setValidators(datePickerValidator());
      this.locationForm.controls['licenseExpirationDate'].setValidators(datePickerValidator());
    } else {
      this.locationForm.controls['licenseAssignDate'].clearValidators();
      this.locationForm.controls['licenseExpirationDate'].clearValidators();
      this.locationForm.controls['licenseNumberUsers'].clearValidators();
      this.locationForm.controls['licenseNumberUsers'].setValidators([Validators.maxLength(6), Validators.min(1), Validators.pattern(/^[0-9]*$/)]);
    }
    this.locationForm.controls['licenseAssignDate'].updateValueAndValidity();
    this.locationForm.controls['licenseExpirationDate'].updateValueAndValidity();
    this.locationForm.controls['licenseNumberUsers'].updateValueAndValidity();
  }

  calculateLicenseExpireDate() {
    const assignDate = this.locationForm.controls['licenseAssignDate'].value?._d ?
      this.locationForm.controls['licenseAssignDate'].value?._d : this.locationForm.controls['licenseAssignDate'].value;
    if (assignDate instanceof Date) {
      const newMonths = this.locationForm.controls.licenseLength.value;
      const lad = assignDate;
      const licenseExpirationDate = new Date(lad);
      licenseExpirationDate.setMonth(lad.getMonth() + newMonths);
      this.locationForm.controls['licenseExpirationDate'].setValue(licenseExpirationDate);
      this.locationForm.controls['licenseExpirationDate'].markAsTouched();
    }
  }

  onLicenseAssignDateChange() {
    this.locationForm.controls['licenseExpirationDate'].setValue(null);
    this.locationForm.controls['licenseLength'].reset();
    this.locationForm.controls['licenseLength'].updateValueAndValidity();
  }

  getMinDate() {
    return new Date(this.locationForm.controls['licenseAssignDate'].value);
  }

  licenseDateFilter = (d: moment.Moment): boolean => {
    const day = d.day();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  emailPrecheckForLocation(locationForm: FormGroup): Observable<string> {
    if (this.locationForm.valid) {
      const email = locationForm.controls.labContactEmail.value;
      return this.userManagementService.queryUserByEmail(email);
    }
    return null;
  }

  checkFormValidity(fromAddLocation = false, fromUpdateLocation = false) {
    this.handleAddressValidation(fromAddLocation, fromUpdateLocation);
  }

  /* Form Add location Function */
  addLocation() {
    try {
      if (this.locationForm.valid) {
        const formValue = this.locationForm.value;
        const payloadToSend: LabLocation = {
          id: null,
          parentNodeId: this.selectedGroup.id,
          parentNode: {
            id: this.selectedGroup.id,
            parentNodeId: this.selectedGroup.parentNodeId,
            nodeType: this.selectedGroup.nodeType,
            displayName: this.selectedGroup.displayName
          },
          nodeType: EntityType.LabLocation,
          displayName: formValue.labLocationName.trim(),
          children: null,
          labLocationName: formValue.labLocationName.trim(),
          locationTimeZone: '',
          locationOffset: '',
          locationDayLightSaving: '',
          labLocationContactId: '',
          labLocationAddressId: '',
          labLocationContact: {
            id: null,
            entityType: PortalDataDocumentType.Contact,
            firstName: formValue.labContactFirst,
            lastName: formValue.labContactLast,
            name: formValue.labContactFirst + formValue.labContactLast,
            email: formValue.labContactEmail,
          },
          labLocationAddress: {
            id: null,
            entityType: PortalDataDocumentType.Address,
            streetAddress1: formValue.labLocationAddress.trim(),
            streetAddress2: formValue.labLocationAddressSecondary.trim(),
            city: formValue.labLocationCity.trim(),
            state: formValue.labLocationState,
            country: formValue.labLocationCountryId,
            zipCode: formValue.locationZipCode,
          },
          shipTo: formValue.shipTo,
          soldTo: formValue.soldTo,
          orderNumber: formValue.orderNumber,
          unityNextTier: formValue.unityNextTier,
          unityNextInstalledProduct: formValue.unityNextInstalledProduct,
          connectivityTier: formValue.connectivityTier,
          connectivityInstalledProduct: formValue.connectivityInstalledProduct,
          lotViewerLicense: formValue.lotViewerLicense,
          lotViewerInstalledProduct: formValue.lotViewerInstalledProduct,
          addOnsFlags: this.getSelectedAddOns(),
          licenseNumberUsers: formValue.licenseNumberUsers === null ? formValue.licenseNumberUsers : +formValue.licenseNumberUsers,
          licenseAssignDate: this.dateTimeHelper.convertDateToUTCWithoutTime(new Date(formValue.licenseAssignDate)),
          licenseExpirationDate: this.dateTimeHelper.convertDateToUTCWithoutTime(new Date(formValue.licenseExpirationDate)),
          hasChildren: false,
          locationCount: this.account?.locationCount,
          accountName: this.account.displayName.trim(),
          accountNumber: this.account.formattedAccountNumber,
          groupName: this.selectedGroup.displayName.trim(),
          comments: formValue.comments,
          transformers: formValue.transformers ? formValue.transformers.map(({ id, displayName }) => {
            return { id, displayName };
          }) : null,
          contactRoles: null,
          previousContactUserId: null,
          labLanguagePreference: this.isLocalizationActive ? formValue.labLanguagePreference : this.defaultLanguageValue
        };
        this.addLocationSubscription = this.accountManagementApiService
          .addLocation(payloadToSend)
          .pipe(take(1))
          .subscribe(
            newLocation => {
              this.loadLocationForm = false;
              this.locationForm.reset();
              this.selectedGroup.hasChildren = true;
              this.messageSnackBarService.showMessageSnackBar(this.getTranslation('ACCOUNTDETAILS.CREATEDLOCATION') +
                ' ' + newLocation.labLocationName);
              // Reload the location list so that newly added location will display in selected group
              this.loadLocationList(this.locationSearchRequest);
              if (this.selectedGroup.children === null) {
                this.loadGroups();
              }
            },
            error => {
              if (error.error?.errorCode === ErrorsInterceptor.labsetup109) {
                this.locationForm.controls['licenseNumberUsers'].setErrors({ invalid: true, userCount: true });
              }
              if (error.error?.errorCode === ErrorsInterceptor.labsetup112) {
                this.locationForm.controls['labContactEmail'].setErrors({ invalid: true, existsInOtherGroup: true });
              }
            }
          );
      }
    } catch (e) {
      if (e && e.message) {
        this.messageSnackBarService.showMessageSnackBar(
          this.getTranslation('ACCOUNTDETAILS.CREATEDLOCATION') + ' ' + e.message,
          3000
        );
      }
    }
  }

  /* Form Update location Function */
  updateLocation() {
    try {
      if (this.locationForm.valid) {
        const formValue = this.locationForm.getRawValue();
        const payloadToUpdate: LabLocation = {
          id: this.location.id,
          parentNodeId: this.location.parentNodeId,
          parentNode: this.location.parentNode,
          nodeType: this.location.nodeType,
          displayName: formValue.labLocationName.trim(),
          children: null,
          labLocationName: formValue.labLocationName.trim(),
          locationTimeZone: '',
          locationOffset: '',
          locationDayLightSaving: '',
          labLocationContactId: this.location.labLocationContactId,
          labLocationAddressId: this.location.labLocationAddressId,
          labLocationContact: {
            entityType: this.location.labLocationContact.entityType,
            firstName: formValue.labContactFirst,
            lastName: formValue.labContactLast,
            name: this.location.labLocationContact.name,
            email: formValue.labContactEmail,
            id: this.location.labLocationContact.id
          },
          labLocationAddress: {
            entityType: this.location.labLocationAddress.entityType,
            streetAddress1: formValue.labLocationAddress.trim(),
            streetAddress2: formValue.labLocationAddressSecondary.trim(),
            city: formValue.labLocationCity.trim(),
            state: formValue.labLocationState,
            country: formValue.labLocationCountryId,
            zipCode: formValue.locationZipCode,
            id: this.location.labLocationAddress.id
          },
          shipTo: formValue.shipTo,
          soldTo: formValue.soldTo,
          orderNumber: formValue.orderNumber,
          unityNextTier: formValue.unityNextTier,
          unityNextInstalledProduct: formValue.unityNextInstalledProduct,
          connectivityTier: formValue.connectivityTier,
          connectivityInstalledProduct: formValue.connectivityInstalledProduct,
          lotViewerLicense: formValue.lotViewerLicense,
          lotViewerInstalledProduct: formValue.lotViewerInstalledProduct,
          addOnsFlags: this.getSelectedAddOns(),
          licenseNumberUsers: formValue.licenseNumberUsers === null ? formValue.licenseNumberUsers : +formValue.licenseNumberUsers,
          licenseAssignDate: this.dateTimeHelper.convertDateToUTCWithoutTime(new Date(formValue.licenseAssignDate)),
          licenseExpirationDate: this.dateTimeHelper.convertDateToUTCWithoutTime(new Date(formValue.licenseExpirationDate)),
          hasChildren: true,
          locationCount: this.location.locationCount,
          accountName: this.location.accountName.trim(),
          accountNumber: this.formattedAccountNumber,
          groupName: this.selectedGroup.displayName.trim(),
          comments: formValue.comments,
          transformers: formValue.transformers ? formValue.transformers.map(({ id, displayName }) => {
            return { id, displayName };
          }) : null,
          contactRoles: null,
          previousContactUserId: null,
          labLanguagePreference: this.isLocalizationActive ? formValue.labLanguagePreference : ( this.location?.labLanguagePreference
           || this.defaultLanguageValue)
        };
        this.updateSubscription = this.accountManagementApiService
          .updateLocation(payloadToUpdate)
          .pipe(take(1))
          .subscribe(
            updateLocation => {
              this.loadLocationForm = false;
              this.locationForm.reset();
              this.messageSnackBarService.showMessageSnackBar(this.getTranslation('ACCOUNTDETAILS.UPDATEDLOCATION') +
                ' ' + updateLocation.labLocationName);

              if (!!updateLocation.previousContactUserId) {
                this.confirmDeletionOfPreviousContact(updateLocation.previousContactUserId);
              }

              if (this.isLoadedFromAccount) {
                // Reload the location list so that newly added location will display in selected group
                this.loadLocationList(this.locationSearchRequest);
              } else {
                this.dialogRef.close();
              }
            },
            error => {
              if (error.error?.errorCode === ErrorsInterceptor.labsetup109) {
                this.locationForm.controls['licenseNumberUsers'].setErrors({ invalid: true, userCount: true });
              }
            }
          );
      }
    } catch (e) {
      if (e && e.message) {
        this.messageSnackBarService.showMessageSnackBar(
          this.getTranslation('ACCOUNTDETAILS.UPDATEDLOCATION') + ' ' + e.message,
          3000
        );
      }
    }
  }

  /* Change tracker service functions */
  setupChangeTracker(): void {
    const me = this;
    me.changeTrackerService.getDialogRef(async function () {
      me.dialogRef.close();
    });
    me.formChangesSubscription = me.locationForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (me.locationForm.dirty) {
          me.changeTrackerService.setDirty();
          me.changeTrackerService.setCustomPrompt(async function () {
            me.displayWarning = true;
          });
        } else {
          me.changeTrackerService.resetDirty();
        }
      });
  }

  onExitWithoutSaving() {
    if (!this.isLoadedFromAccount) {
      this.changeTrackerService.resetDirty();
      this.displayWarning = false;
      this.locationForm.reset();
      this.isLicenseActivated = false;
      this.loadLocationForm = false;
      this.dialogRef.close();
    } else {
      this.changeTrackerService.resetDirty();
      this.displayWarning = false;
      this.isLicenseActivated = false;
      this.locationForm?.reset();
      this.loadLocationForm = false;
      this.groupForm?.reset();
      this.addGroupBtnSelected = false;
      this.editGroupButton = false;
    }
    if (this.closeBtnClicked) {
      this.dialogRef.close();
    }
  }

  addAGroup(): void {
    this.addGroupBtnSelected = true;
  }

  saveGroup(): void {
    this.isAddGroupClicked = true; // to disable multiple click of Add Group Button
    const payload: Lab = {
      id: '', // empty on add  populated on edit
      parentNodeId: this.account.id,
      nodeType: EntityType.Lab,
      displayName: this.groupForm.controls['groupName'].value.trim(),
      name: this.groupForm.controls['groupName'].value.trim(),
      hasChildren: false,
      labName: this.groupForm.controls['groupName'].value.trim()
    };
    this.accountManagementApiService.addGroup<Lab>(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.addGroupBtnSelected = false;
        this.groupForm.reset();
        this.displayWarning = false;
        this.loadGroups();
        this.isAddGroupClicked = false;
      }, error => {
        this.addGroupBtnSelected = false;
        this.groupForm.reset();
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
            componentInfo.AccountDetailsComponent + blankSpace + Operations.AddAccountGroups));
      });
  }

  saveEditedGroup(groupNameEditedValue) {
    if (this.editedGroup) {
      this.editedGroup.name = groupNameEditedValue;
      this.editedGroup.displayName = groupNameEditedValue;
      this.accountManagementApiService.updateGroup(this.editedGroup)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadGroups();
          this.editedGroup = null;
          this.displayWarning = false;
          this.editGroupButton = false;
        });
    }
  }

  onCancelGroup() {
    if (this.editGroupButton && this.groupForm.controls['groupName'].pristine) {
      this.editGroupButton = false;
      this.groupForm.reset();
    } else if (this.groupForm.controls['groupName'].value) {
      this.displayWarning = true;
    } else {
      this.addGroupBtnSelected = false;
      this.groupForm.reset();
    }
    this.displayDeleteWarning = false;
  }

  isGroupNameExist() {
    return (control: AbstractControl): ValidationErrors | null => {
      this.duplicateGroupErrorMsg = false;
      if ((this.addGroupBtnSelected || this.editGroupButton) && control.value?.trim().length > 0) {
        const modifiedList = this.groups.filter(item =>
          item.displayName?.replace(/\s\s+/g, ' ').toLowerCase().trim() === control.value?.replace(/\s\s+/g, ' ').toLowerCase().trim());
        if (modifiedList.length > 0 && !control.pristine) {
          this.duplicateGroupErrorMsg = true;
        }
        return (modifiedList.length > 0) ? { duplicateGroupErrorMsg: true } : null;
      } else {
        return null;
      }
    };
  }

  public noWhitespaceValidator(control) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  editGroup(group) {
    this.editGroupButton = true;
    this.groupForm.controls.groupName.patchValue(group.displayName);
    this.editedGroup = group;
  }

  onDeleteGroup(group) {
    this.displayDeleteWarning = true;
    this.editedGroup = group;
  }

  deleteGroup() {
    this.accountManagementApiService.deleteGroup(this.editedGroup.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(groupData => {
        this.displayDeleteWarning = false;
        this.loadGroups();
      }, error => {
        if (error.error && error.error.status === 'error') {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              componentInfo.AccountDetailsComponent + blankSpace + Operations.DeleteAGroup));
        }
      });

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
    if (this.locationForm?.valid) {
      this.displayWarning = false;
      this.checkFormValidity();
    } else if (this.groupForm?.valid) {
      this.displayWarning = false;
      if (this.addGroupBtnSelected) {
        this.saveGroup();
      }
      if (this.editGroupButton) {
        this.saveEditedGroup(this.groupNameValue.nativeElement.value);
      }

      if (this.closeBtnClicked) {
        this.dialogRef.close();
      }
    }
  }

  closeDialog() {
    if (this.loadLocationForm) {
      if (this.locationForm.dirty || this.changeTrackerService.unSavedChanges) {
        this.displayWarning = true;
      } else {
        this.dialogRef.close();
      }
    } else if (this.editGroupButton && this.groupForm.controls['groupName'].value !== this.editedGroup.name) {
      this.displayWarning = true;
      this.closeBtnClicked = true;
    } else if (this.addGroupBtnSelected && this.groupForm.controls['groupName'].value.trim()) {
      this.displayWarning = true;
      this.closeBtnClicked = true;
    } else {
      this.dialogRef.close();
    }
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  openDeleteLocationDialog(location: LabLocation) {
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: ''
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteLocation(location);
        }
      });
  }

  deleteLocation(location: LabLocation) {
    this.accountManagementApiService.deleteLocation(location.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => {
        this.loadGroups();
        this.messageSnackBarService.showMessageSnackBar(this.getTranslation('ACCOUNTDETAILS.DELETELOCATIONMESSAGE')
          + location.displayName);
      }, error => {
        if (error.error) {
          this.messageSnackBarService.showMessageSnackBar(this.getTranslation('ACCOUNTDETAILS.DELETELOCATIONERROR'));
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              componentInfo.AccountDetailsComponent + blankSpace + Operations.DeleteLocation));
        }
      });
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    unsubscribe(this.addLocationSubscription);
    unsubscribe(this.emailCheckSubscription);
    unsubscribe(this.updateSubscription);
  }
}
