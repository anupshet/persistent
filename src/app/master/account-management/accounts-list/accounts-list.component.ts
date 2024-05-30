// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { Account, AccountPageRequest, AccountPageResponse } from '../../../contracts/models/account-management/account';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { AccountFormComponent } from '../account-form/account-form.component';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../../shared/icons/icons.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { Operations, blankSpace, componentInfo } from '../../../core/config/constants/error-logging.const';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { AccountDetailsComponent } from '../account-details/account-details.component';
import { AccountManagementApiService } from '../account-management-api.service';
import { DisplayedColumnsAccounts, AccountsField } from '../../../contracts/enums/acccount-location-management.enum';
import { pageItemsDisplay, paginationAccounts, paginationItemsPerPage } from '../../../core/config/constants/general.const';
import { ConfirmDialogDeleteComponent } from '../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
import { Permissions } from '../../../security/model/permissions.model';


@Component({
  selector: 'unext-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit, OnDestroy {
  @ViewChild(PerfectScrollbarComponent) accountComponentRef?: PerfectScrollbarComponent;

  searchInput: string = null;
  selectedCategory = 0;
  icons = icons;
  sortInfo: Sort;
  iconsUsed: Array<Icon> = [
    icons.search[24],
    icons.delete[24],
    icons.sortActive[24],
    icons.refreshBlue[24]
  ];

  totalPages = 0;
  readonly maxSize = pageItemsDisplay;
  paginationConfig: PaginationInstance = {
    id: paginationAccounts,
    itemsPerPage: paginationItemsPerPage,
    currentPage: 1,
    totalItems: 1,
  };
  accountPageRequest = new AccountPageRequest();

  protected destroy$ = new Subject<boolean>();

  displayedColumnsAccounts: string[] = [
    DisplayedColumnsAccounts.accountName,
    DisplayedColumnsAccounts.accountNumber,
    DisplayedColumnsAccounts.accountAddress,
    DisplayedColumnsAccounts.accountLocations,
    DisplayedColumnsAccounts.accountOperations,
  ];
  accounts: Array<Account>;
  accountsFields = AccountsField;
  permissions = Permissions;
  locationsPermissions = [
    Permissions.GroupAdd,
    Permissions.GroupEdit,
    Permissions.GroupDelete,
    Permissions.LocationAdd,
    Permissions.LocationEdit,
    Permissions.LocationDelete
  ];

  constructor(
    private accountManagementApiService: AccountManagementApiService,
    private dialog: MatDialog,
    private messageSnackBar: MessageSnackBarService,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.sortInfo = { active: this.displayedColumnsAccounts[0], direction: 'asc' };
    this.accountPageRequest.searchString = '';
    this.accountPageRequest.searchColumn = AccountsField.AccountName;
    this.accountPageRequest.sortColumn = AccountsField.AccountName;
    this.accountPageRequest.sortDescending = false;
    this.accountPageRequest.pageIndex = 0;
    this.accountPageRequest.pageSize = this.paginationConfig.itemsPerPage;
    this.loadAccountList(this.accountPageRequest);
  }

  private loadAccountList(accountPageRequest: AccountPageRequest) {
    const pageNumber = accountPageRequest.pageIndex ? accountPageRequest.pageIndex : 0;
    accountPageRequest.pageIndex = pageNumber;
    this.accounts = null;
    this.accountManagementApiService.searchAccounts<AccountPageResponse>(accountPageRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(accountData => {
        this.accounts = accountData.accounts || [];
        this.paginationConfig.itemsPerPage = paginationItemsPerPage;
        this.totalPages = accountData.totalPages;
        this.paginationConfig.totalItems = accountData.totalItems;
        if (accountPageRequest.searchColumn > 0 && accountPageRequest.searchString) {
          this.paginationConfig.currentPage = this.paginationConfig.currentPage <= this.totalPages ? this.paginationConfig.currentPage : 1;
        }
      }, error => {
        this.accounts = [];
        if (error.error && error.error.status === 'error') {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              (componentInfo.AccountsListComponent + blankSpace + Operations.GetAccountList)));
        }

        this.messageSnackBar.showMessageSnackBar(this.getLoadAccountsErrorMessage());
      });
  }

  sortList(sort: Sort) {
    this.sortInfo = sort;
    this.accountPageRequest.pageIndex = 0;
    this.accountPageRequest.pageSize = this.paginationConfig.itemsPerPage;
    const sortDescending = sort.direction === 'desc' ? true : false;
    const sortColumn = Object.keys(DisplayedColumnsAccounts).indexOf(sort.active) + 1;
    this.accountPageRequest.sortDescending = sortDescending;
    this.accountPageRequest.sortColumn = sortColumn;
    this.paginationConfig.currentPage = 1;
    this.loadAccountList(this.accountPageRequest);
    this.scrollTop();
  }

  searchAccounts() {
    if (!this.searchInput || +this.selectedCategory < 1) {
      return;
    }
    this.accountPageRequest.searchString = this.searchInput;
    this.accountPageRequest.searchColumn = +this.selectedCategory;
    this.accountPageRequest.pageIndex = 0;
    this.accountPageRequest.pageSize = this.paginationConfig.itemsPerPage;
    const sortDescending = this.sortInfo.direction === 'desc' ? true : false;
    const sortColumn = Object.keys(DisplayedColumnsAccounts).indexOf(this.sortInfo.active) + 1;
    this.accountPageRequest.sortDescending = sortDescending;
    this.accountPageRequest.sortColumn = sortColumn;
    this.paginationConfig.currentPage = 1;

    this.loadAccountList(this.accountPageRequest);
    this.scrollTop();
  }

  openDialogCreateAccount(): void {
    const dialogRef = this.dialog.open(AccountFormComponent, {
      panelClass: 'cdk-create-account',
      id: 'account-form',
      autoFocus: true
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result !== true && result) {
          this.messageSnackBar.showMessageSnackBar(result);
          this.loadAccountList(this.accountPageRequest);
        }
      });
  }

  openDialogEditAccount(account: Account): void {
    try {
      const dialogRef = this.dialog.open(AccountFormComponent, {
        panelClass: 'cdk-create-account',
        id: 'account-form',
        autoFocus: true,
        data: account
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result !== true && result) {
            this.messageSnackBar.showMessageSnackBar(result);
            this.loadAccountList(this.accountPageRequest);
          }
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.AccountsListComponent + blankSpace + Operations.OpenDialog)));
    }
  }

  openAccountDetails(account: Account) {
    const dialogRef = this.dialog.open(AccountDetailsComponent, {
      panelClass: 'cdk-location-form',
      id: 'account-location-form',
      autoFocus: true
    });

    dialogRef.componentInstance.account = account;
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result !== true && result) {
          this.messageSnackBar.showMessageSnackBar(result);
        }
        this.loadAccountList(this.accountPageRequest);
      });
  }

  openDeleteAccountDialog(account: Account): void {
    const dialogRef = this.dialog.open(ConfirmDialogDeleteComponent, {
      data: ''
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          this.deleteAnAccount(account);
        }
      });
  }

  deleteAnAccount(account: Account) {
    this.accountManagementApiService.deleteAccount(account.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(accountData => {
        this.loadAccountList(this.accountPageRequest);
        this.messageSnackBar.showMessageSnackBar(this.getDeletedAccountMessage() + account.displayName);
      }, error => {
        if (error.error && error.error.status === 'error') {
          this.messageSnackBar.showMessageSnackBar(this.getDeleteAccountErrorMessage());
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              componentInfo.AccountsListComponent + blankSpace + Operations.DeleteAnAccount));
        }
      });
  }

  private getLoadAccountsErrorMessage() {
    return this.getTranslation('TRANSLATION.ERROROCCURRED');
  }

  private getDeletedAccountMessage() {
    return this.getTranslation('TRANSLATION.DELETEDACCOUNT');
  }

  private getDeleteAccountErrorMessage() {
    return this.getTranslation('TRANSLATION.DELETINGACCOUNT');
  }

  onAccountPageChange(accPageIndex: number) {
    this.paginationConfig.currentPage = accPageIndex;
    this.accountPageRequest.pageIndex = accPageIndex - 1;
    this.loadAccountList(this.accountPageRequest);
    this.scrollTop();
  }

  reset() {
    this.searchInput = null;
    this.selectedCategory = 0;
    this.paginationConfig.currentPage = 1;
    this.accountPageRequest.searchString = '';
    this.accountPageRequest.searchColumn = AccountsField.AccountName;
    this.accountPageRequest.sortColumn = AccountsField.AccountName;
    this.accountPageRequest.sortDescending = false;
    this.accountPageRequest.pageIndex = 0;
    this.loadAccountList(this.accountPageRequest);
    this.scrollTop();
  }

  scrollTop() {
    if (this.accountComponentRef && this.accountComponentRef.directiveRef) {
      this.accountComponentRef.directiveRef.scrollToTop();
    }
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
