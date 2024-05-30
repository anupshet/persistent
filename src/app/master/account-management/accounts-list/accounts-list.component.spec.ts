// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AccountManagementApiService } from '../account-management-api.service';
import * as accountData from '../../../../../db.json';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { paginationAccounts } from '../../../core/config/constants/general.const';

import { AccountsListComponent } from './accounts-list.component';
import { AccountPageRequest } from '../../../contracts/models/account-management/account';
import { AccountsField } from '../../../contracts/enums/acccount-location-management.enum';
import { HttpLoaderFactory } from '../../../app.module';

describe('AccountsListComponent', () => {
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;
  let sampleAccounts;

  const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollY: false
  };
  const TRANSLATIONS_EN = require('../../../../assets/i18n/en.json');

  const accountPageResponse = {
    'accounts': accountData.accounts,
    'pageIndex': 2,
    'totalItems': 101,
    'totalPages': 6,
    'pageSize': 20
    };

  const AccountApiService = {
    searchAccounts: (pageIndex: number = 0) => {
      return of(accountPageResponse);
    }
  };

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsListComponent],
      imports: [
        MatTableModule,
        MatDialogModule,
        NgxPaginationModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),],
      providers: [{ provide: AccountManagementApiService, useValue: AccountApiService },
      { provide: MessageSnackBarService, useValue: '' },
      { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
      { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
      TranslateService,
      HttpClient],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
    sampleAccounts = accountData.accounts;
    component.accounts = sampleAccounts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct data in table rows ', () => {
    expect(component.accounts).toEqual(sampleAccounts);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
      expect(tableRows.length).toBe(component.paginationConfig.itemsPerPage);
      const accountName = tableRows[0].children[0];
      expect(accountName.children[0].children[0].innerText).toEqual(sampleAccounts[0].displayName);
      const accountNumber = tableRows[0].children[1];
      expect(accountNumber.children[0].children[1].innerText).toEqual(sampleAccounts[0].accountNumber);
      const locationCount = tableRows[0].children[3];
      expect(locationCount.children[0].innerText).toEqual(`${sampleAccounts[0].locationCount}`);
    });
  });

  it('should display "Loading accounts..." message while accounts are being fetched', () => {
    sampleAccounts = null;
    component.accounts = sampleAccounts;
    fixture.detectChanges();

    let loadingAccountMessage = fixture.debugElement.query(By.css('.spec_accounts_loading'));
    expect(loadingAccountMessage).toBeDefined();
    expect(loadingAccountMessage.nativeElement.textContent.length).toBeGreaterThan(0);
    expect(TRANSLATIONS_EN.ACCOUNTLIST.LOADING).toEqual('Loading accounts...');

    // Hide the message when accounts are available
    sampleAccounts = accountData.accounts;
    component.accounts = sampleAccounts;
    fixture.detectChanges();

    loadingAccountMessage = fixture.debugElement.query(By.css('.spec_accounts_loading'));
    expect(loadingAccountMessage).toBeNull();
  });


  it('should display "No Accounts" message when accounts are not present', () => {
    sampleAccounts = [];
    component.accounts = sampleAccounts;
    fixture.detectChanges();

    const noAccountsFoundMessage = fixture.debugElement.query(By.css('.spec_no_accounts_found'));
    expect(noAccountsFoundMessage).toBeDefined();
    expect(noAccountsFoundMessage.nativeElement.textContent.length).toBeGreaterThan(0);
    expect(TRANSLATIONS_EN.ACCOUNTLIST.NO).toEqual('No accounts found');
  });

  it('should hide the pagination controls when accounts are not present or when only one account page is present', () => {
    sampleAccounts = null;
    component.accounts = sampleAccounts;
    fixture.detectChanges();

    let paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();

    const pageData = {
      'id': paginationAccounts,
      'accounts': sampleAccounts,
      'pageIndex': 0,
      'totalPages': 1,
      'pageSize': 25
    };
    component.accounts = pageData.accounts;
    component.paginationConfig.currentPage = pageData.pageIndex + 1;
    component.paginationConfig.itemsPerPage = pageData.pageSize;
    component.paginationConfig.totalItems = pageData.pageSize * pageData.totalPages;
    fixture.detectChanges();

    paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();
  });

  it('should show the pagination controls when two account pages are present', () => {
    sampleAccounts = accountData.accounts.slice(0, 2);
    const pageData = {
      'id': paginationAccounts,
      'accounts': sampleAccounts,
      'pageIndex': 0,
      'totalPages': 2,
      'pageSize': 5
    };
    component.accounts = pageData.accounts;
    component.paginationConfig.currentPage = pageData.pageIndex + 1;
    component.paginationConfig.itemsPerPage = pageData.pageSize;
    component.paginationConfig.totalItems = pageData.pageSize * pageData.totalPages;
    fixture.detectChanges();

    const paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    expect(paginationButtons.length).toEqual(2);

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    expect(nextButton).toBeDefined();
    expect(nextButton.disabled).toBeFalsy();

    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    expect(prevButton).toBeDefined();
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should display accounts based on the Page selected in Pagination when we have multiple pages', () => {
    // click on the next button in the pagination and check if accounts are modified accordingly
    sampleAccounts = accountData.accounts;
    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    nextButton.click();
    fixture.detectChanges();
    expect(component.accounts).toEqual(sampleAccounts);

    // click on the prev button in the pagination and check if accounts are modified accordingly
    sampleAccounts = accountData.accounts;
    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    prevButton.click();
    fixture.detectChanges();
    expect(component.accounts).toEqual(sampleAccounts);

    // click on the third page in the pagination and check if accounts are modified accordingly
    sampleAccounts = accountData.accounts;
    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    const secondPageButton = paginationButtons[2].nativeElement;
    secondPageButton.click();
    fixture.detectChanges();
    expect(component.accounts).toEqual(sampleAccounts);
  });

  it('should display delete icon when 0 location present for account', () => {
    component.accounts[0].locationCount = 0;
    fixture.detectChanges();
    const deleteIcon = fixture.debugElement.query(By.css('.spec-delete')).nativeElement;
    expect(deleteIcon).toBeTruthy();
  });

  it('should open confirm delete dialog on click on delete icon', () => {
    component.accounts[0].locationCount = 0;
    const spy = spyOn(component, 'openDeleteAccountDialog').and.callThrough();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.spec-delete')).nativeElement;
    btn.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should create correct number of pages for pagination', () => {
    component.ngOnInit();
    fixture.detectChanges();
    // Pagination Directive automatically generate pages based on totalItems and the PageSize
    expect(component.paginationConfig.totalItems).toBeLessThanOrEqual(accountPageResponse.pageSize * accountPageResponse.totalPages);
  });

  it('should display reset button only if category is selected or search input is not null', () => {
    component.selectedCategory = 0;
    component.searchInput = null;
    fixture.detectChanges();
    let resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    expect(resetBtn).toBeNull();

    component.selectedCategory = 2;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    expect(resetBtn.nativeElement).toBeDefined();
    expect(TRANSLATIONS_EN.ACCOUNTLIST.RESET).toEqual('Reset');
  });

  it('should hide the reset button after it has been clicked', () => {
    component.selectedCategory = 1;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    let resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn')).nativeElement;
    resetBtn.click();
    fixture.detectChanges();
    expect(component.searchInput).toBeNull();
    expect(component.selectedCategory).toEqual(0);
    resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    fixture.detectChanges();
    expect(resetBtn).toBeNull();
  });

  it('should reset the category, serach-box and the results when reset button is clicked', () => {
    component.selectedCategory = 2;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    const resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn')).nativeElement;
    resetBtn.click();
    fixture.detectChanges();
    expect(component.searchInput).toBeNull();
    expect(component.selectedCategory).toEqual(0);
  });

  it('should send payload as per the category selected and the search input entered', () => {
    component.selectedCategory = 1;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(By.css('.spec-search-btn')).nativeElement;
    searchBtn.click();
    fixture.detectChanges();
    const mockSearchRequest = new AccountPageRequest();
    mockSearchRequest.searchString = 'sample search text';
    mockSearchRequest.searchColumn = AccountsField.AccountName;
    mockSearchRequest.pageIndex = 0;
    mockSearchRequest.pageSize = component.paginationConfig.itemsPerPage;
    mockSearchRequest.sortColumn = AccountsField.AccountName;
    mockSearchRequest.sortDescending = false;
    expect(component.accountPageRequest).toEqual(mockSearchRequest);
  });
});
