// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.

import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { PaginationInstance } from 'ngx-pagination';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Icon } from '../../contracts/models/shared/icon.model';
import { icons } from '../../core/config/constants/icon.const';
import { IconService } from '../../shared/icons/icons.service';
import { BioRadUserField, DisplayedColumnsBioRadUserManagement } from '../../contracts/enums/biorad-user-management.enum';
import { asc, blankSpace, deleteBioRadUser, desc, pageItemsDisplay, paginationBioRadUsers, paginationItemsPerPage } from '../../core/config/constants/general.const';
import { BioRadUser, BioRadUserPageRequest, BioRadUserPageResponse } from '../../contracts/models/biorad-user-management/bio-rad-user.models';
import { MessageSnackBarService } from '../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { BioRadUserManagementApiService } from './biorad-user-management-api.service';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { componentInfo, Operations } from '../../core/config/constants/error-logging.const';
import { BioRadUserRoles } from '../../contracts/enums/user-role.enum';
import { ConfirmDialogDeleteComponent } from '../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { ErrorsInterceptor } from '../../contracts/enums/http-errors.enum';
import * as fromRoot from '../../state/app.state';
import * as fromSecuritySelector from '../../security/state/selectors';
import { AppUser } from '../../security/model';

@Component({
  selector: 'unext-biorad-user-management',
  templateUrl: './biorad-user-management.component.html',
  styleUrls: ['./biorad-user-management.component.scss']
})
export class BioRadUserManagementComponent implements OnInit, OnDestroy {
  @ViewChild(PerfectScrollbarComponent) bioradUserManagementComponentRef?: PerfectScrollbarComponent;

  displayedColumnsBioRadUserManagement: string[] = [
    DisplayedColumnsBioRadUserManagement.BioRadUserContactName,
    DisplayedColumnsBioRadUserManagement.BioRadUserEmail,
    DisplayedColumnsBioRadUserManagement.BioRadUserRole,
    DisplayedColumnsBioRadUserManagement.BioRadUserTerritoryId
  ];

  searchInput = '';
  selectedField = 0;
  icons = icons;
  sortInfo: Sort;
  iconsUsed: Array<Icon> = [
    icons.search[24],
    icons.delete[24],
    icons.sortActive[24],
    icons.refreshBlue[24],
    icons.refreshBlueDisabled[24],
    icons.arrowBack[24]
  ];

  totalPages = 0;
  readonly maxSize = pageItemsDisplay;
  paginationConfig: PaginationInstance = {
    id: paginationBioRadUsers,
    itemsPerPage: paginationItemsPerPage,
    currentPage: 1,
    totalItems: 1,
  };
  bioRadUserPageRequest = new BioRadUserPageRequest();

  userForm: FormGroup;
  bioradUsers: Array<BioRadUser>;
  selectedPageNumber = 1;
  selectedItemIndex = -1;
  bioradUserManagerFields = BioRadUserField;
  bioRadUserRoles = BioRadUserRoles;
  showSaveWarning = false;
  isUserFormOpened = false;
  isForEditForm = false;
  existingFormValue: any;

  protected destroy$ = new Subject<boolean>();

  private currentUserRoles: Array<string>;

  @HostListener('window:keyup.esc') onKeyUp() {
    this.closeDialog();
  }

  constructor(
    private store: Store<fromRoot.State>,
    private bioRadUserManagementApiService: BioRadUserManagementApiService,
    private dialogRef: MatDialogRef<BioRadUserManagementComponent>,
    private dialog: MatDialog,
    private messageSnackBar: MessageSnackBarService,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    /* Inital Configuration  */
    this.createUserForm();
    this.initiateBioRadUserList();
    this.dialogRef.backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeDialog();
      });
    
    this.store.pipe(select(fromSecuritySelector.getCurrentUser))
      .pipe(
        filter(curUser => !!curUser),
        takeUntil(this.destroy$))
      .subscribe((curUser: AppUser) => {
        this.currentUserRoles = curUser.roles;
      });
  }

  initiateBioRadUserList() {
    this.sortInfo = { active: this.displayedColumnsBioRadUserManagement[0], direction: asc };
    this.bioRadUserPageRequest.searchString = '';
    this.bioRadUserPageRequest.searchColumn = BioRadUserField.BioRadUserRole;
    this.bioRadUserPageRequest.sortColumn = BioRadUserField.BioRadUserContactName;
    this.bioRadUserPageRequest.sortDescending = false;
    this.bioRadUserPageRequest.pageIndex = 0;
    this.bioRadUserPageRequest.pageSize = this.paginationConfig.itemsPerPage;
    this.loadBioRadUserList(this.bioRadUserPageRequest);
  }

  /* Load the Bio Rad User List and map the pagination configuration */
  private loadBioRadUserList(bioRadUserPageRequest: BioRadUserPageRequest) {
    const pageNumber = bioRadUserPageRequest.pageIndex ? bioRadUserPageRequest.pageIndex : 0;
    bioRadUserPageRequest.pageIndex = pageNumber;
    this.bioradUsers = null;
    this.bioRadUserManagementApiService.searchBioRadUsers<BioRadUserPageResponse>(bioRadUserPageRequest)
      .pipe(take(1))
      .subscribe(bioRadUserPageResponse => {
        this.bioradUsers = bioRadUserPageResponse.users || [];
        this.paginationConfig.itemsPerPage = paginationItemsPerPage;
        this.totalPages = bioRadUserPageResponse.totalPages;
        this.paginationConfig.totalItems = bioRadUserPageResponse.totalItems;
        if (bioRadUserPageRequest.searchColumn > 0 && bioRadUserPageRequest.searchString) {
          this.paginationConfig.currentPage = this.paginationConfig.currentPage <= this.totalPages ? this.paginationConfig.currentPage : 1;
        }
      }, error => {
        this.bioradUsers = [];

        if (error.error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              (componentInfo.BioRadUserManagementComponent + blankSpace + Operations.GetBioRadUsers)));
        }

        this.messageSnackBar.showMessageSnackBar(this.getLoadBioRadUsersErrorMessage());
      });
  }

  /* serach Function with category values which will call server side api*/
  searchUsers() {
    if (!this.searchInput || +this.selectedField < 1) {
      return;
    }
    this.bioRadUserPageRequest.searchString = this.searchInput;
    this.bioRadUserPageRequest.searchColumn = +this.selectedField;
    this.bioRadUserPageRequest.pageIndex = 0;
    const sortDescending = this.sortInfo.direction === desc ? true : false;
    const sortColumn = Object.keys(DisplayedColumnsBioRadUserManagement).indexOf(this.sortInfo.active) + 1;
    this.bioRadUserPageRequest.sortDescending = sortDescending;
    this.bioRadUserPageRequest.sortColumn = sortColumn;
    this.paginationConfig.currentPage = 1;

    this.loadBioRadUserList(this.bioRadUserPageRequest);
    this.scrollTop();
  }

  sortList(sort: Sort) {
    this.sortInfo = sort;
    this.bioRadUserPageRequest.pageIndex = 0;
    const sortDescending = sort.direction === desc ? true : false;
    const sortColumn = Object.keys(DisplayedColumnsBioRadUserManagement).indexOf(sort.active) + 1;
    this.bioRadUserPageRequest.sortDescending = sortDescending;
    this.bioRadUserPageRequest.sortColumn = sortColumn;
    this.paginationConfig.currentPage = 1;
    this.loadBioRadUserList(this.bioRadUserPageRequest);
    this.scrollTop();
  }

  /* User Form functions*/
  /* Load the Bio Rad User form */
  createUserForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern('^(?! ).*[^ ]$')]),
      lastName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern('^(?! ).*[^ ]$')]),
      userEmail: new FormControl(null, [Validators.required, Validators.email]),
      userRole: new FormControl(null, Validators.required),
    });
  }

  /*user form error check function according to control */
  checkForhasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  /* add bio -rad user function to load the user form at the start of the list */
  addUserForm() {
    this.scrollTop();
    this.selectedItemIndex = 0;
    this.isUserFormOpened = true;
    this.isForEditForm = false;
    this.bioradUsers.unshift(new BioRadUser);
    this.bioradUsers[0].isEditing = true;
    this.bioradUsers = [...this.bioradUsers];
    this.userForm.controls['firstName'].enable();
    this.userForm.controls['lastName'].enable();
    this.userForm.controls['userEmail'].enable();
  }

  /* edit  bio -rad user function to load the user form at the clicked location of the list */
  openFormForEdit(index: number) {
    this.selectedItemIndex = index;
    this.bioradUsers[index].isEditing = !this.bioradUsers[index].isEditing;
    this.isUserFormOpened = true;
    this.isForEditForm = true;
    this.userForm.controls['firstName'].setValue(this.bioradUsers[index].firstName);
    this.userForm.controls['lastName'].setValue(this.bioradUsers[index].lastName);
    this.userForm.controls['userEmail'].setValue(this.bioradUsers[index].email);
    this.userForm.controls['userRole'].setValue(this.bioradUsers[index].userRoles);
    if (this.bioradUsers[index]?.userRoles?.includes(BioRadUserRoles.LotViewerSales)) {
      this.userForm.addControl('territoryId', new FormControl('', [Validators.required, Validators.maxLength(7),
      Validators.minLength(7), Validators.pattern(/^[9][0-9]*$/)]));
      this.userForm.controls['territoryId'].setValue(this.bioradUsers[index].territoryId);
    } else {
      if (this.userForm.controls['territoryId']) {
        this.userForm.removeControl('territoryId');
      }
    }

    if (this.hasEditDeleteForRoles(this.bioradUsers[index])) {
      this.userForm.controls['firstName'].enable();
      this.userForm.controls['lastName'].enable();
      this.userForm.controls['userEmail'].enable();
      if (this.userForm.controls['territoryId']) {
        this.userForm.controls['territoryId'].enable();
      }
    } else {
      this.userForm.controls['firstName'].disable();
      this.userForm.controls['lastName'].disable();
      this.userForm.controls['userEmail'].disable();
      
      if (this.userForm.controls['territoryId']) {
        this.userForm.controls['territoryId'].disable();
      }
    }

    this.existingFormValue = JSON.parse(JSON.stringify(this.userForm.value));
  }

  closeDialog() {
    (this.userForm.dirty) ? (this.showSaveWarning = true)
      : (this.showSaveWarning = false, this.dialogRef.close(), this.resetAllData());
  }

  cancelForm() {
    this.resetAllData();
  }

  saveRecord(isSaveAndExit) {
    const bioRadUserData: BioRadUser = {
      id: this.isForEditForm ? this.bioradUsers[this.selectedItemIndex].id : null,
      firstName: this.userForm.controls['firstName'].value,
      lastName: this.userForm.controls['lastName'].value,
      email: this.userForm.controls['userEmail'].value,
      userRoles: this.userForm.controls['userRole'].value,
      territoryId: this.userForm.controls['territoryId']?.value ? this.userForm.controls['territoryId']?.value : ''
    };
    if (!this.isForEditForm) {
      // call the add user API
      this.bioRadUserManagementApiService.addBioRadUser(bioRadUserData)
        .pipe(take(1))
        .subscribe(addedBioRadUser => {
          if (addedBioRadUser) {
            this.messageSnackBar.showMessageSnackBar(
              `${addedBioRadUser.displayName}` +
              this.getAddBioRadUsersSuccessMessage()
            );
            this.selectedField = null;
            this.searchInput = '';
            this.loadBioRadUserList(this.bioRadUserPageRequest);
            this.resetAllData();
          }
        }, error => {
          if (error.error?.errorCode === ErrorsInterceptor.labsetup103) {
            this.userForm.controls['userEmail'].setErrors({ invalid: true, duplicateEmail: true });
          } else {
            if (error.error) {
              this.errorLoggerService.logErrorToBackend(
                this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
                  (componentInfo.BioRadUserManagementComponent + blankSpace + Operations.AddAnBioRadUser)));
            }
            this.loadBioRadUserList(this.bioRadUserPageRequest);
            this.messageSnackBar.showMessageSnackBar(this.getAddBioRadUsersErrorMessage());
            this.resetAllData();
          }
        });

    } else {
      // call the update user API
      this.bioRadUserManagementApiService.updateBioRadUser(bioRadUserData)
        .pipe(take(1))
        .subscribe(updateBioRadUser => {
          if (updateBioRadUser) {
            this.messageSnackBar.showMessageSnackBar(
              `${updateBioRadUser.firstName} ${updateBioRadUser.lastName}` +
              this.getUpdateBioRadUsersSuccessMessage()
            );
            this.loadBioRadUserList(this.bioRadUserPageRequest);
            this.resetAllData();
          }
        }, error => {
          if (error.error?.errorCode === ErrorsInterceptor.labsetup103) {
            this.userForm.controls['userEmail'].setErrors({ invalid: true, duplicateEmail: true });
          } else {
            if (error.error) {
              this.errorLoggerService.logErrorToBackend(
                this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
                  (componentInfo.BioRadUserManagementComponent + blankSpace + Operations.UpdateAnBioRadUser)));
            }
            this.loadBioRadUserList(this.bioRadUserPageRequest);
            this.messageSnackBar.showMessageSnackBar(this.getUpdateBioRadUsersErrorMessage());
            this.resetAllData();
          }
        });
    }
    if (isSaveAndExit) {
      this.dialogRef.close();
    }
  }

  resetAllData() {
    this.selectedItemIndex = null;
    this.showSaveWarning = false;
    this.isUserFormOpened = false;
    this.userForm.reset();
    if (this.userForm.controls['territoryId']) {
      this.userForm.removeControl('territoryId');
    }
    if (!this.isForEditForm) {
      this.bioradUsers?.shift();
    } else {
      this.isForEditForm = false;
    }
    this.resetBioRadUserList();
  }

  resetBioRadUserList() {
    if (this.bioradUsers && this.bioradUsers.length > 0) {
      this.bioradUsers = this.bioradUsers.map((item) =>
        Object.assign({}, item, { isEditing: false })
      );
      this.bioradUsers = [...this.bioradUsers];
    }
  }

  checkValuesAreEqual() {
    return JSON.stringify(this.userForm.value) === JSON.stringify(this.existingFormValue);
  }

  checkForSelectedValues(role) {
    if (this.isUserFormOpened) {
      const selectedValues = this.userForm.controls['userRole'].value;
      if (selectedValues && selectedValues.length > 0) {
        if (role === BioRadUserRoles.LotViewerSales) {
          return (selectedValues.includes(BioRadUserRoles.BioRadManager) ||
            selectedValues.includes(BioRadUserRoles.CTSUser)) ? true : false;
        } else {
          return selectedValues.includes(BioRadUserRoles.LotViewerSales) ? true : false;
        }
      }
    }
  }

  isBioRadManager(): boolean {
    return this.currentUserRoles && this.currentUserRoles.length > 0 && this.currentUserRoles.includes(BioRadUserRoles.BioRadManager);
  }

  isQCPAdmin(): boolean {
    return this.currentUserRoles && this.currentUserRoles.length > 0 && this.currentUserRoles.includes(BioRadUserRoles.QCPUser);
  }

  hasUNRoles(brUser: BioRadUser): boolean {
    return brUser && brUser.userRoles && (brUser.userRoles.includes(BioRadUserRoles.BioRadManager) || brUser.userRoles.includes(BioRadUserRoles.CTSUser)
      || brUser.userRoles.includes(BioRadUserRoles.LotViewerSales));
  }

  hasQCPRoles(brUser: BioRadUser): boolean {
    return brUser && brUser.userRoles && (brUser.userRoles.includes(BioRadUserRoles.QCPUser) || brUser.userRoles.includes(BioRadUserRoles.QCPCTSUser)
      || brUser.userRoles.includes(BioRadUserRoles.DailyUser) || brUser.userRoles.includes(BioRadUserRoles.MarketingUser));
  }

  hasEditDeleteForRoles(brUser: BioRadUser): boolean {
    let hasEditDeleteForRoles = false;

    if (this.hasUNRoles(brUser) && this.hasQCPRoles(brUser)) {
      hasEditDeleteForRoles = this.isBioRadManager() && this.isQCPAdmin();
    } else if (this.hasUNRoles(brUser)) {
      hasEditDeleteForRoles = this.isBioRadManager();
    } else if (this.hasQCPRoles(brUser)) {
      hasEditDeleteForRoles = this.isQCPAdmin();
    }

    return hasEditDeleteForRoles;
  }

  roleSelectionChange() {
    const selectedValues = this.userForm.controls['userRole'].value;
    if (selectedValues && selectedValues.length > 0 && selectedValues.includes(BioRadUserRoles.LotViewerSales)) {
      this.userForm.addControl('territoryId', new FormControl('', [Validators.required, Validators.maxLength(7),
      Validators.minLength(7), Validators.pattern(/^[9][0-9]*$/)]));
    } else {
      this.userForm.removeControl('territoryId');
    }
  }

  /* User Form functions*/

  reset() {
    this.searchInput = null;
    this.selectedField = 0;
    this.paginationConfig.currentPage = 1;
    this.bioRadUserPageRequest.searchString = '';
    this.bioRadUserPageRequest.searchColumn = BioRadUserField.BioRadUserRole;
    this.bioRadUserPageRequest.pageIndex = 0;
    this.loadBioRadUserList(this.bioRadUserPageRequest);
    this.scrollTop();
  }

  scrollTop() {
    if (this.bioradUserManagementComponentRef && this.bioradUserManagementComponentRef.directiveRef) {
      this.bioradUserManagementComponentRef.directiveRef.scrollToTop();
    }
  }

  onBioRadUserPageChange(accPageIndex: number) {
    this.paginationConfig.currentPage = accPageIndex;
    this.bioRadUserPageRequest.pageIndex = accPageIndex - 1;
    this.loadBioRadUserList(this.bioRadUserPageRequest);
    this.scrollTop();
  }

  openDeleteUserDialog(bioradUser: BioRadUser) {
    const displayName = deleteBioRadUser;
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: { displayName }
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteAnUser(bioradUser);
        }
      });
  }

  deleteAnUser(bioradUser: BioRadUser) {
    this.bioRadUserManagementApiService.deleteBioRadUser(bioradUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(deleteResponse => {
        if (deleteResponse) {
          this.resetAllData();
          this.loadBioRadUserList(this.bioRadUserPageRequest);
          this.messageSnackBar.showMessageSnackBar(bioradUser.firstName + ' ' + bioradUser.lastName +
            this.getDeleteBioRadUsersSuccessMessage());
        }
      }, error => {
        if (error.error) {
          this.messageSnackBar.showMessageSnackBar(this.getDeleteBioRadUsersErrorMessage());
          this.resetAllData();
          this.loadBioRadUserList(this.bioRadUserPageRequest);
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              componentInfo.BioRadUserManagementComponent + blankSpace + Operations.DeleteAnBioRadUser));
        }
      });
  }

  // Error && Success messages
  private getLoadBioRadUsersErrorMessage() {
    return this.getTranslation('BIORADUSERMANAGEMENT.LOADBIORADUSERSERROR');
  }

  private getAddBioRadUsersErrorMessage() {
    return this.getTranslation('BIORADUSERMANAGEMENT.ADDBIORADUSERERROR');
  }

  private getAddBioRadUsersSuccessMessage() {
    return this.getTranslation('BIORADUSERMANAGEMENT.ADDBIORADUSERSUCCESS');
  }


  private getUpdateBioRadUsersErrorMessage() {
    return this.getTranslation('BIORADUSERMANAGEMENT.UPDATEBIORADUSERERROR');
  }

  private getUpdateBioRadUsersSuccessMessage() {
    return this.getTranslation('BIORADUSERMANAGEMENT.UPDATEBIORADUSERSUCCESS');
  }

  private getDeleteBioRadUsersSuccessMessage() {
    return this.getTranslation('BIORADUSERMANAGEMENT.DELETEBIORADUSERSUCCESS');
  }


  private getDeleteBioRadUsersErrorMessage() {
    return this.getTranslation('BIORADUSERMANAGEMENT.DELETEBIORADUSERERROR');
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

