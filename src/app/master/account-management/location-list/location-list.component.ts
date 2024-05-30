// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject,  Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { PaginationInstance } from 'ngx-pagination';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { blankSpace, Operations, componentInfo } from '../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { AccountManagementApiService } from '../account-management-api.service';
import { LabLocation } from '../../../contracts/models/lab-setup/lab-location.model';
import { DisplayedColumnsLocations, LocationField } from '../../../contracts/enums/acccount-location-management.enum';
import { IconService } from '../../../shared/icons/icons.service';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { LocationPage, LocationSearchRequest } from '../../../contracts/models/account-management/location-page.model';
import { paginationLocations, paginationItemsPerPage, pageItemsDisplay } from '../../../core/config/constants/general.const';
import { AccountDetailsComponent } from '../account-details/account-details.component';
import { Permissions } from '../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { MigrationStates } from '../../../contracts/enums/migration-state.enum';

@Component({
  selector: 'unext-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})

export class LocationListComponent implements OnInit, OnDestroy {
  @ViewChild(PerfectScrollbarComponent) locationComponentRef?: PerfectScrollbarComponent;

  @Input() accountId: string;
  searchInput: string = null;
  selectedCategory = 0; // reset value 0
  displayedColumnsLocations: string[] = [
    DisplayedColumnsLocations.lab,
    DisplayedColumnsLocations.labContact,
    DisplayedColumnsLocations.account,
    DisplayedColumnsLocations.group,
    DisplayedColumnsLocations.locations,
    DisplayedColumnsLocations.licenseType,
    DisplayedColumnsLocations.addOns,
    DisplayedColumnsLocations.licenseStatus

  ];
  locationFields = LocationField;
  locations: Array<LabLocation>;
  sortInfo: Sort;
  totalPages = 0;
  readonly maxSize = pageItemsDisplay;
  paginationConfig: PaginationInstance = {
    id: paginationLocations,
    itemsPerPage: 1,
    currentPage: 1,
    totalItems: 1,
  };
  locationSearchRequest = new LocationSearchRequest();
  protected destroy$ = new Subject<boolean>();
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.arrowBack[24],
    icons.sortActive[24],
    icons.refreshBlue[24]
  ];
  permissions = Permissions;
  migrationState = new BehaviorSubject<MigrationStates>(MigrationStates.Empty);

  constructor(
    private accountManagementApiService: AccountManagementApiService,
    private errorLoggerService: ErrorLoggerService,
    private iconService: IconService,
    private dialog: MatDialog,
    private messageSnackBar: MessageSnackBarService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.sortInfo = { active: this.displayedColumnsLocations[0], direction: 'asc' };
    this.locationSearchRequest = {
      groupId: '',
      searchString: '',
      searchColumn: null,
      sortDescending: false,
      sortColumn: LocationField.LocationLabInfo,
      pageIndex: 1,
      pageSize: paginationItemsPerPage,
    };
    this.loadLocations(this.locationSearchRequest);
  }

  loadLocations(locationSearchRequest: LocationSearchRequest) {
    const pageNumber = locationSearchRequest.pageIndex ? locationSearchRequest.pageIndex : 1;
    locationSearchRequest.pageIndex = pageNumber;
    this.locations = null;
    this.accountManagementApiService.searchLocations<LocationPage>(locationSearchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => {
        this.locations = locations.locations;
        this.paginationConfig.itemsPerPage = locations.pageSize;
        this.totalPages = locations.totalPages;
        this.paginationConfig.totalItems = locations.totalItems;
      }, error => {
        this.locations = [];
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
            componentInfo.LocationListComponent + blankSpace + Operations.GetLocations));
      });
  }

  hasMultipleLicenses(location: LabLocation) {
    let licenseCount = 0;
    if (location.lotViewerLicense) {
      licenseCount += 1;
    }
    if (location.connectivityTier > 0) {
      licenseCount += 1;
    }
    if (location.unityNextTier > -1) {
      licenseCount += 1;
    }
    if (location?.addOnsFlags?.valueAssignment) {
      licenseCount += 1;
    }
    return licenseCount > 1;
  }

  noAvailableLicense(location: LabLocation) {
    return location.unityNextTier < 0 && location.connectivityTier <= 0 && location.lotViewerLicense === 0;
  }

  getAddress(location: LabLocation) {
    if (location.labLocationAddress) {
      return `${location.labLocationAddress.streetAddress}, ${location.labLocationAddress.city}, ${location.labLocationAddress.state
        }, ${location.labLocationAddress.zipCode}, ${location.labLocationAddress.country}`;
    }
  }

  sortList(sort: Sort) {
    this.sortInfo = sort;
    this.locationSearchRequest.pageIndex = 1;
    this.locationSearchRequest.pageSize = this.paginationConfig.itemsPerPage;
    if (!sort.active || sort.direction === '') {
      this.locationSearchRequest.sortColumn = null;
      this.locationSearchRequest.sortDescending = null;
    } else {
      const sortDescending = sort.direction === 'desc' ? true : false;
      const sortColumn = this.getSortColumnValue(sort.active);
      this.locationSearchRequest.sortDescending = sortDescending;
      this.locationSearchRequest.sortColumn = sortColumn;
    }
    this.paginationConfig.currentPage = 1;
    this.loadLocations(this.locationSearchRequest);
    this.scrollTop();
  }

  searchFromLocations() {
    if (!this.searchInput || +this.selectedCategory < 1) {
      this.messageSnackBar.showMessageSnackBar(this.getFilterErrorMessages());
      return;
    }
    this.locationSearchRequest.searchString = this.searchInput;
    this.locationSearchRequest.searchColumn = +this.selectedCategory;
    this.locationSearchRequest.pageIndex = 1;
    this.locationSearchRequest.pageSize = this.paginationConfig.itemsPerPage;
    if (!this.sortInfo?.active || this.sortInfo?.direction === '') {
      this.locationSearchRequest.sortColumn = null;
      this.locationSearchRequest.sortDescending = null;
    } else {
      const sortDescending = this.sortInfo.direction === 'desc' ? true : false;
      const sortColumn = this.getSortColumnValue(this.sortInfo.active);
      this.locationSearchRequest.sortDescending = sortDescending;
      this.locationSearchRequest.sortColumn = sortColumn;
      this.paginationConfig.currentPage = 1;
    }
    this.loadLocations(this.locationSearchRequest);
    this.scrollTop();
  }

  onPageChange(pageIndex: number) {
    this.paginationConfig.currentPage = pageIndex;
    this.locationSearchRequest.pageIndex = pageIndex;
    this.locationSearchRequest.pageSize = this.paginationConfig.itemsPerPage;
    if (this.selectedCategory > 0 && this.searchInput) {
      this.locationSearchRequest.searchString = this.searchInput;
      this.locationSearchRequest.searchColumn = +this.selectedCategory;
    }
    if (!this.sortInfo) {
      this.locationSearchRequest.sortColumn = null;
      this.locationSearchRequest.sortDescending = null;
    } else {
      const sortDescending = this.sortInfo.direction === 'desc' ? true : false;
      const sortColumn = this.getSortColumnValue(this.sortInfo.active);
      this.locationSearchRequest.sortDescending = sortDescending;
      this.locationSearchRequest.sortColumn = sortColumn;
    }
    this.loadLocations(this.locationSearchRequest);
    this.scrollTop();
  }

  reset() {
    this.searchInput = null;
    this.selectedCategory = 0; // reset to nothing selected in the category dropdown
    this.locationSearchRequest.searchString = '';
    this.locationSearchRequest.searchColumn = null;
    this.locationSearchRequest.sortColumn = LocationField.LocationLabInfo;
    this.locationSearchRequest.sortDescending = false;
    this.locationSearchRequest.pageIndex = 1;
    this.paginationConfig.currentPage = 1;
    this.loadLocations(this.locationSearchRequest);
    this.scrollTop();
  }

  scrollTop() {
    if (this.locationComponentRef && this.locationComponentRef.directiveRef) {
      this.locationComponentRef.directiveRef.scrollToTop();
    }
  }

  getSortColumnValue(sortColumneName: String): number {
    let columnNumber = null;
    switch (sortColumneName) {
      case DisplayedColumnsLocations.lab: {
        columnNumber = LocationField.LocationLabInfo;
        break;
      }
      case DisplayedColumnsLocations.account: {
        columnNumber = LocationField.LocationAccount;
        break;
      }
      case DisplayedColumnsLocations.labContact: {
        columnNumber = LocationField.LocationContact;
        break;
      }
      case DisplayedColumnsLocations.group: {
        columnNumber = LocationField.LocationGroup;
        break;
      }
      case DisplayedColumnsLocations.licenseType: {
        columnNumber = LocationField.LocationLicenseType;
        break;
      }
      case DisplayedColumnsLocations.licenseStatus: {
        columnNumber = LocationField.LocationLicenseStatus;
        break;
      }
      case DisplayedColumnsLocations.addOns: {
        columnNumber = LocationField.LocationAddOns;
        break;
      }
      default: {
        columnNumber = LocationField.LocationLicenseStatus;
        break;
      }
    }
    return columnNumber;
  }

  openLocationDetails(location: LabLocation) {
    const dialogRef = this.dialog.open(AccountDetailsComponent, {
      panelClass: 'cdk-location-form',
      id: 'account-location-form',
      autoFocus: true
    });

    dialogRef.componentInstance.accountId = this.accountId;
    dialogRef.componentInstance.location = location;

    dialogRef.afterClosed().subscribe(ele => {
      this.loadLocations(this.locationSearchRequest);
    });
  }


  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getFilterErrorMessages() {
    return this.getTranslation('TRANSLATION.KINDLY');
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

}
