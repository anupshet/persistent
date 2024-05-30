// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { ComponentFixture, fakeAsync, TestBed, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';

import { BrError } from '../../contracts/models/shared/br-error.model';
import { MessageSnackBarService } from '../../core/helpers/message-snack-bar/message-snack-bar.service';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { DEFAULT_PERFECT_SCROLLBAR_CONFIG } from '../data-management/single-page-section/single-page-section.const';
import { BioRadUserManagementApiService } from './biorad-user-management-api.service';
import { BioRadUserManagementComponent } from './biorad-user-management.component';
import * as mockData from '../../../../db.json';
import { asc, desc, paginationBioRadUsers } from '../../core/config/constants/general.const';
import { BioRadUserPageRequest } from '../../contracts/models/biorad-user-management/bio-rad-user.models';
import { BioRadUserField } from '../../contracts/enums/biorad-user-management.enum';
import { BioRadUserRoles } from '../../contracts/enums/user-role.enum';
import { HttpLoaderFactory } from '../../app.module';
import * as fromRoot from '../../state/app.state';

describe('BioRadUserManagementComponent', () => {
  let component: BioRadUserManagementComponent;
  let fixture: ComponentFixture<BioRadUserManagementComponent>;
  let sampleBioRadUsers;

  const addUser = {
    id: '100',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john_doe_test@bio-rad.com',
    userRoles: [
      'AccountManager',
    ],
  };

  const mockbioRadUserManagementApiService = {
    searchBioRadUsers: () => {
      return of(mockData.bioRadUserPageResponse[0]);
    },
    addBioRadUser: () => {
      return of(mockData.bioRadUserPageResponse[0]);
    },
    updateBioRadUser: () => {
      return of(mockData.bioRadUserPageResponse[0]);
    }
  };

  const MatDialogRefService = {
    close: () => {
      return {};
    },
    backdropClick: () => {
      return of();
    },
  };

  const mockMessageSnackBarService = {
    showMessageSnackBar: () => {
      return {};
    },
    getLoadBioRadUsersErrorMessage: () => {
      return {};
    },
    getAddBioRadUsersErrorMessage: () => {
      return {};
    },
    getAddBioRadUsersSuccessMessage: () => {
      return {};
    },
    getUpdateBioRadUsersErrorMessage: () => {
      return {};
    },
    getDeleteBioRadUsersErrorMessage: () => {
      return {};
    }
  };


  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockCurrentUser = {
    firstName: 'World',
    lastName: 'Traveler',
    email: 'test@bio-rad.com',
    userOktaId: '789789789789',
    roles: [
      'AccountManager'
    ],
    accessToken: {
      accessToken: ``,
      expiresAt: '1582722553',
      tokenType: 'Bearer',
      scopes: [
        'openid',
        'email'
      ],
      authorizeUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/authorize',
      userinfoUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/userinfo'
    },
    accountNumber: '100472',
    accountId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
    accountNumberArray: [
      '100472'
    ],
    labLocationId: 'b5401afc-d62f-4580-a89f-5b874905b318',
    labLocationIds: [
      'b5401afc-d62f-4580-a89f-5b874905b318'
    ],
    permissions: [],
    userData: {
      assignedLabNumbers: [],
      defaultLab: ''
    },
    id: 'fafc531c-963a-4c1f-92d1-0b3a78527389',
    userName: '',
    displayName: '',
    labId: ''
  };

  let store: MockStore<any>;

  const securityStub = {
    currentUser: mockCurrentUser
  };

  const storeStub = {
    security: securityStub,
    auth: null,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatTableModule,
        NgxPaginationModule,
        HttpClientModule,
        HttpClientTestingModule,
        StoreModule.forRoot(fromRoot.reducers),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          }
        }),
      ],
      declarations: [BioRadUserManagementComponent],
      providers: [
        { provide: BioRadUserManagementApiService, useValue: mockbioRadUserManagementApiService },
        { provide: MatDialogRef, useValue: MatDialogRefService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MessageSnackBarService, useValue: mockMessageSnackBarService },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: Store, useValue: storeStub },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        provideMockStore({ initialState: storeStub }),
        TranslateService,
        HttpClient
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BioRadUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sampleBioRadUsers = mockData.bioRadUserPageResponse[0].users;
    component.bioradUsers = sampleBioRadUsers;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Bio-Rad users', fakeAsync(() => {
    expect(component.bioradUsers).toEqual(sampleBioRadUsers);
    fixture.whenStable().then(() => {
      const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
      expect(tableRows.length).toBe(sampleBioRadUsers.length);

      for (let i = 0, len = sampleBioRadUsers.length; i < len; i++) {
        const bioradUserContactName = tableRows[i].children[0];
        expect(bioradUserContactName.children[0].innerText).toContain(sampleBioRadUsers[i].firstName + ' ' + sampleBioRadUsers[0].lastName);
        const bioradUserEmail = tableRows[i].children[1];
        expect(bioradUserEmail.innerText).toContain(sampleBioRadUsers[i].email);

        const bioradManager = fixture.debugElement.nativeElement.querySelector('#spec_bioradmanager_' + i.toString());
        const ctsUser = fixture.debugElement.nativeElement.querySelector('#spec_ctsuser_' + i.toString());
        const lotViewerSales = fixture.debugElement.nativeElement.querySelector('#spec_lotviewersales_' + i.toString());
        const qcpUser = fixture.debugElement.nativeElement.querySelector('#spec_qcpuser_' + i.toString());
        const qcpCTSUser = fixture.debugElement.nativeElement.querySelector('#spec_qcpctsuser_' + i.toString());
        const qcpDailyUser = fixture.debugElement.nativeElement.querySelector('#spec_dailyuser_' + i.toString());
        const marketingUser = fixture.debugElement.nativeElement.querySelector('#spec_marketinguser_' + i.toString());
        for (let j = 0; j < sampleBioRadUsers[i].userRoles.length; j++) {
          if (sampleBioRadUsers[i].userRoles[j] === BioRadUserRoles.BioRadManager) {
            expect(bioradManager).toBeDefined();
            expect(bioradManager.innerText).toContain('BIORADUSER.BIORADMANAGER');
          }
          if (sampleBioRadUsers[i].userRoles[j] === BioRadUserRoles.CTSUser) {
            expect(ctsUser).toBeDefined();
            expect(ctsUser.innerText).toContain('BIORADUSER.CTSUSER');
          }
          if (sampleBioRadUsers[i].userRoles[j] === BioRadUserRoles.LotViewerSales) {
            expect(lotViewerSales).toBeDefined();
            expect(lotViewerSales.innerText).toContain('BIORADUSER.LOTVIEWERSALES');
          }
          if (sampleBioRadUsers[i].userRoles[j] === BioRadUserRoles.QCPUser) {
            expect(qcpUser).toBeDefined();
            expect(qcpUser.innerText).toContain('BIORADUSER.QCPADMIN');
          }
          if (sampleBioRadUsers[i].userRoles[j] === BioRadUserRoles.QCPCTSUser) {
            expect(qcpCTSUser).toBeDefined();
            expect(qcpCTSUser.innerText).toContain('BIORADUSER.QCPCTSUSER');
          }
          if (sampleBioRadUsers[i].userRoles[j] === BioRadUserRoles.DailyUser) {
            expect(qcpDailyUser).toBeDefined();
            expect(qcpDailyUser.innerText).toContain('BIORADUSER.QCPDAILYUSER');
          }
          if (sampleBioRadUsers[i].userRoles[j] === BioRadUserRoles.MarketingUser) {
            expect(marketingUser).toBeDefined();
            expect(marketingUser.innerText).toContain('BIORADUSER.QCPMARKETINGUSER');
          }
        }

        const bioradUserTerritoryId = tableRows[i].children[3];
        expect(bioradUserTerritoryId.innerText).toEqual(sampleBioRadUsers[i].territoryId ?? '');
      }
    });
  }));

  it('should display "Loading Bio-Rad users..." message while Bio-Rad users are being fetched', () => {
    sampleBioRadUsers = null;
    component.bioradUsers = sampleBioRadUsers;
    fixture.detectChanges();

    let loadingBioRadUsersMessage = fixture.debugElement.query(By.css('.spec_bioradusers_loading'));
    expect(loadingBioRadUsersMessage).toBeDefined();
    expect(loadingBioRadUsersMessage.nativeElement.textContent.length).toBeGreaterThan(0);
    expect(loadingBioRadUsersMessage.nativeElement.textContent).toEqual(' BIORADUSER.LOADINGBIORAD');

    // Hide the message when Bio-Rad users are available
    sampleBioRadUsers = mockData.bioRadUserPageResponse[0].users;
    component.bioradUsers = sampleBioRadUsers;
    fixture.detectChanges();

    loadingBioRadUsersMessage = fixture.debugElement.query(By.css('.spec_bioradusers_loading'));
    expect(loadingBioRadUsersMessage).toBeNull();
  });

  it('should display "No Bio-Rad users found" message when Bio-Rad users are not present', () => {
    sampleBioRadUsers = [];
    component.bioradUsers = sampleBioRadUsers;
    fixture.detectChanges();

    const noBioRadUsersFoundMessage = fixture.debugElement.query(By.css('.spec_no_bioradusers_found'));
    expect(noBioRadUsersFoundMessage).toBeDefined();
    expect(noBioRadUsersFoundMessage.nativeElement.textContent.length).toBeGreaterThan(0);
    expect(noBioRadUsersFoundMessage.nativeElement.textContent).toEqual('BIORADUSER.NOBIORAD');
  });

  it('should hide the pagination controls when Bio-Rad users are not present or when only one page is present', () => {
    sampleBioRadUsers = null;
    component.bioradUsers = sampleBioRadUsers;
    fixture.detectChanges();

    let paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();

    const pageData = {
      'id': paginationBioRadUsers,
      'bioradUsers': sampleBioRadUsers,
      'pageIndex': 0,
      'totalPages': 1,
      'pageSize': 25
    };
    component.bioradUsers = pageData.bioradUsers;
    component.paginationConfig.currentPage = pageData.pageIndex + 1;
    component.paginationConfig.itemsPerPage = pageData.pageSize;
    component.paginationConfig.totalItems = pageData.pageSize * pageData.totalPages;
    fixture.detectChanges();

    paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeNull();
  });

  it('should show the pagination controls when two pages are present', () => {
    sampleBioRadUsers = mockData.bioRadUserPageResponse[0].users;
    const pageData = {
      'id': paginationBioRadUsers,
      'bioradUsers': sampleBioRadUsers,
      'pageIndex': 0,
      'totalPages': 2,
      'pageSize': 5
    };
    component.bioradUsers = pageData.bioradUsers;
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

  it('should show the pagination controls when three pages are present', () => {
    sampleBioRadUsers = mockData.bioRadUserPageResponse[0].users;
    const pageData = {
      'id': paginationBioRadUsers,
      'bioradUsers': sampleBioRadUsers,
      'pageIndex': 0,
      'totalPages': 3,
      'pageSize': 5
    };
    component.bioradUsers = pageData.bioradUsers;
    component.paginationConfig.currentPage = pageData.pageIndex + 1;
    component.paginationConfig.itemsPerPage = pageData.pageSize;
    component.paginationConfig.totalItems = pageData.pageSize * pageData.totalPages;
    fixture.detectChanges();

    const paginationControl = fixture.debugElement.query(By.css('.spec-pagination-control'));
    expect(paginationControl).toBeDefined();

    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    expect(paginationButtons.length).toEqual(3);

    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    expect(nextButton).toBeDefined();
    expect(nextButton.disabled).toBeFalsy();

    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    expect(prevButton).toBeDefined();
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should display Bio-Rad users based on the page selected in pagination when we have multiple pages', () => {
    // click on the next button in the pagination and check if Bio-Rad users are modified accordingly
    sampleBioRadUsers = mockData.bioRadUserPageResponse[0].users;
    component.paginationConfig = {
      id: paginationBioRadUsers,
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: 9,
    };
    const nextButton = fixture.debugElement.query(By.css('.spec-next-button')).nativeElement;
    nextButton.click();
    fixture.detectChanges();
    expect(component.bioradUsers).toEqual(sampleBioRadUsers);

    // click on the prev button in the pagination and check if bioradUsers are modified accordingly
    sampleBioRadUsers = mockData.bioRadUserPageResponse[0].users;
    const prevButton = fixture.debugElement.query(By.css('.spec-prev-button')).nativeElement;
    prevButton.click();
    fixture.detectChanges();
    expect(component.bioradUsers).toEqual(sampleBioRadUsers);

    // click on the third page in the pagination and check if bioradUsers are modified accordingly
    sampleBioRadUsers = mockData.bioRadUserPageResponse[0].users;
    const paginationButtons = fixture.debugElement.queryAll(By.css('.spec-page-button'));
    const secondPageButton = paginationButtons[2].nativeElement;
    secondPageButton.click();
    fixture.detectChanges();
    expect(component.bioradUsers).toEqual(sampleBioRadUsers);
  });

  it('should create correct number of pages for pagination', () => {
    component.ngOnInit();
    fixture.detectChanges();
    // Pagination Directive automatically generate pages based on totalItems and the PageSize
    expect(component.paginationConfig.totalItems).toBeLessThanOrEqual(mockData.bioRadUserPageResponse[0].pageSize *
      mockData.bioRadUserPageResponse[0].totalPages);
  });

  it('should display reset button only if search field is selected or search input is not null', () => {
    component.selectedField = 0;
    component.searchInput = null;
    fixture.detectChanges();
    let resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    expect(resetBtn).toBeNull();

    component.selectedField = 2;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    expect(resetBtn.nativeElement).toBeDefined();
    //expect(resetBtn.nativeElement.textContent).toEqual('Reset');
  });

  it('should hide the reset button after it has been clicked', () => {
    component.selectedField = 1;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    let resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn')).nativeElement;
    resetBtn.click();
    fixture.detectChanges();
    expect(component.searchInput).toBeNull();
    expect(component.selectedField).toEqual(0);
    resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn'));
    fixture.detectChanges();
    expect(resetBtn).toBeNull();
  });

  it('should reset the search field, search-box and the results when reset button is clicked', () => {
    component.selectedField = 2;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    const resetBtn = fixture.debugElement.query(By.css('.spec-reset-btn')).nativeElement;
    resetBtn.click();
    fixture.detectChanges();
    expect(component.searchInput).toBeNull();
    expect(component.selectedField).toEqual(0);
  });

  it('should send payload as per the search field selected and the search input entered', () => {
    component.selectedField = 1;
    component.searchInput = 'sample search text';
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(By.css('.spec-search-btn')).nativeElement;
    searchBtn.click();
    fixture.detectChanges();
    const mockSearchRequest = new BioRadUserPageRequest();
    mockSearchRequest.searchString = component.searchInput;
    mockSearchRequest.searchColumn = BioRadUserField.BioRadUserContactName;
    mockSearchRequest.pageIndex = 0;
    mockSearchRequest.pageSize = component.paginationConfig.itemsPerPage;
    mockSearchRequest.sortColumn = BioRadUserField.BioRadUserContactName;
    mockSearchRequest.sortDescending = false;
    expect(component.bioRadUserPageRequest).toEqual(mockSearchRequest);
  });

  it('should send sort request', () => {
    const sortRequest: Sort = { active: component.displayedColumnsBioRadUserManagement[0], direction: asc };
    const searchBioRadUsers = spyOn(mockbioRadUserManagementApiService, 'searchBioRadUsers').and.callThrough();

    component.sortList(sortRequest);

    expect(component.sortInfo.active).toEqual(sortRequest.active);
    expect(component.sortInfo.direction).toEqual(sortRequest.direction);
    expect(component.bioRadUserPageRequest.pageIndex).toEqual(0);
    expect(component.bioRadUserPageRequest.pageSize).toEqual(component.paginationConfig.itemsPerPage);
    expect(component.bioRadUserPageRequest.sortColumn).toEqual(1);
    expect(component.bioRadUserPageRequest.sortDescending).toEqual(false);
    expect(component.paginationConfig.currentPage).toEqual(1);
    expect(searchBioRadUsers).toHaveBeenCalledTimes(1);

    sortRequest.active = component.displayedColumnsBioRadUserManagement[2];
    sortRequest.direction = desc;

    component.sortList(sortRequest);

    expect(component.sortInfo.active).toEqual(sortRequest.active);
    expect(component.sortInfo.direction).toEqual(sortRequest.direction);
    expect(component.bioRadUserPageRequest.pageIndex).toEqual(0);
    expect(component.bioRadUserPageRequest.pageSize).toEqual(component.paginationConfig.itemsPerPage);
    expect(component.bioRadUserPageRequest.sortColumn).toEqual(3);
    expect(component.bioRadUserPageRequest.sortDescending).toEqual(true);
    expect(component.paginationConfig.currentPage).toEqual(1);
    expect(searchBioRadUsers).toHaveBeenCalledTimes(2);
  });

  it('on click of add a Bio-Rad button it should open the add user form at the first position of the datatable', fakeAsync(() => {
    sampleBioRadUsers = mockData.bioRadUserPageResponse[0].users;
    const pageData = {
      'id': paginationBioRadUsers,
      'bioradUsers': sampleBioRadUsers,
      'pageIndex': 0,
      'totalPages': 3,
      'pageSize': 5
    };
    component.bioradUsers = pageData.bioradUsers;
    component.paginationConfig.currentPage = pageData.pageIndex + 1;
    component.paginationConfig.itemsPerPage = pageData.pageSize;
    component.paginationConfig.totalItems = pageData.pageSize * pageData.totalPages;
    fixture.detectChanges();
    const spyObj = spyOn(component, 'addUserForm').and.callThrough();
    component.addUserForm();
    fixture.detectChanges();
    expect(spyObj).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.bioradUsers.length).toEqual(14);
      expect(component.selectedItemIndex).toEqual(0);
      expect(component.isUserFormOpened).toEqual(true);
      expect(component.isForEditForm).toEqual(false);
      const firstNameTag = fixture.debugElement.query(By.css('#firstName')).nativeElement;
      expect(firstNameTag).toBeDefined();
      const lastNameTag = fixture.debugElement.query(By.css('#lastName')).nativeElement;
      expect(lastNameTag).toBeDefined();
      const userEmailTag = fixture.debugElement.query(By.css('#userEmail')).nativeElement;
      expect(userEmailTag).toBeDefined();
      const userRoleTag = fixture.debugElement.query(By.css('.user-role')).nativeElement;
      expect(userRoleTag).toBeDefined();
      const cancelBtn = fixture.debugElement.query(By.css('.cancel-button')).nativeElement;
      expect(cancelBtn).toBeDefined();
      const formAddBtn = fixture.debugElement.query(By.css('.add-biorad-user')).nativeElement;
      expect(formAddBtn).toBeDefined();
      expect(formAddBtn.disabled).toBeTruthy();
    });
  }));

  it('check the length of User Roles drop down', () => {
    const userRoleDropdown = fixture.debugElement.query(By.css('.select-role')).nativeElement;
    expect(userRoleDropdown).toBeDefined();
    userRoleDropdown.click();
    fixture.detectChanges();
    const matOptions = fixture.debugElement.queryAll(By.css('.single-role'));
    fixture.detectChanges();
    expect(matOptions.length).toEqual(7);
  });

  it('should check initial form values for user form after add user form is opened', () => {
    const addUserForm = component.userForm;
    const userValues = {
      firstName: null,
      lastName: null,
      userEmail: null,
      userRole: null
    };
    fixture.detectChanges();
    expect(component.userForm.valid).toBeFalsy();
    expect(addUserForm.value).toEqual(userValues);
  });

  it('on click of add it should call the add method ', fakeAsync(() => {
    component.userForm.controls['firstName'].setValue(addUser.firstName);
    component.userForm.controls['lastName'].setValue(addUser.lastName);
    component.userForm.controls['userEmail'].setValue(addUser.email);
    component.userForm.controls['userRole'].setValue(addUser.userRoles[0]);
    expect(component.userForm.valid).toBeTruthy();
    fixture.detectChanges();
    const saveSpy = spyOn(component, 'saveRecord').and.callThrough();
    component.saveRecord(false);
    expect(saveSpy).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.bioradUsers.length).toEqual(13);
      expect(component.selectedItemIndex).toEqual(null);
      expect(component.isUserFormOpened).toEqual(false);
      expect(component.isForEditForm).toEqual(false);
    });
  }));

  it('on click of cancel button without making form dirty it should close the user form and remove the extra object added', fakeAsync(() => {
    const spyObj = spyOn(component, 'addUserForm').and.callThrough();
    component.addUserForm();
    expect(spyObj).toHaveBeenCalled();
    fixture.detectChanges();
    const spyCancelForm = spyOn(component, 'cancelForm').and.callThrough();
    component.cancelForm();
    fixture.detectChanges();
    expect(spyCancelForm).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.bioradUsers.length).toEqual(13);
      expect(component.selectedItemIndex).toEqual(null);
      expect(component.isUserFormOpened).toEqual(false);
      expect(component.isForEditForm).toEqual(false);
    });
  }));

  it('on click name of any record from the datatable it should load the Edit user form with prefilled values and it should call the update method  ', () => {
    const editValues = {
      firstName: 'Jane',
      lastName: 'Doe',
      territoryId: '9000001',
      userEmail: 'jane_doe_test@bio-rad.com',
      userRole: ['SalesPerson']
    };
    const spyOpenFormForEdit = spyOn(component, 'openFormForEdit').and.callThrough();
    component.openFormForEdit(1);
    expect(spyOpenFormForEdit).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.userForm.value).toEqual(editValues);
    expect(component.userForm.controls['firstName'].disabled).toBeFalse();
    expect(component.userForm.controls['lastName'].disabled).toBeFalse();
    expect(component.userForm.controls['userEmail'].disabled).toBeFalse();
    expect(component.userForm.controls['territoryId'].disabled).toBeFalse();
    expect(component.selectedItemIndex).toEqual(1);
    expect(component.isUserFormOpened).toEqual(true);
    expect(component.isForEditForm).toEqual(true);
    expect(component.userForm.valid).toBeTruthy();
    fixture.detectChanges();
    const saveSpy = spyOn(component, 'saveRecord').and.callThrough();
    component.saveRecord(false);
    expect(saveSpy).toHaveBeenCalled();
    fixture.detectChanges();
    const resetAllDataSpy = spyOn(component, 'resetAllData').and.callThrough();
    component.resetAllData();
    expect(resetAllDataSpy).toHaveBeenCalled();
    const resetBioRadUserListSpy2 = spyOn(component, 'resetBioRadUserList').and.callThrough();
    component.resetBioRadUserList();
    expect(resetBioRadUserListSpy2).toHaveBeenCalled();
    expect(component.bioradUsers.length).toEqual(13);
    expect(component.selectedItemIndex).toEqual(null);
    expect(component.isUserFormOpened).toEqual(false);
    expect(component.isForEditForm).toEqual(false);
  });

  it('should delete bio rad user on click of delete icon', fakeAsync(() => {
    const editValues = {
      firstName: 'Jane',
      lastName: 'Doe',
      territoryId: '9000001',
      userEmail: 'jane_doe_test@bio-rad.com',
      userRole: ['SalesPerson']
    };
    const spyOpenFormForEdit = spyOn(component, 'openFormForEdit').and.callThrough();

    // Test for AccountManager role
    storeStub.security.currentUser.roles = [BioRadUserRoles.BioRadManager];
    component.ngOnInit();
    fixture.detectChanges();
    component.openFormForEdit(4);
    expect(spyOpenFormForEdit).toHaveBeenCalled();
    fixture.detectChanges();
    expect(component.userForm.value).toEqual(editValues);
    expect(component.userForm.controls['firstName'].disabled).toBeFalse();
    expect(component.userForm.controls['lastName'].disabled).toBeFalse();
    expect(component.userForm.controls['userEmail'].disabled).toBeFalse();
    expect(component.userForm.controls['territoryId'].disabled).toBeFalse();
    expect(component.selectedItemIndex).toEqual(4);
    expect(component.isUserFormOpened).toEqual(true);
    expect(component.isForEditForm).toEqual(true);
    expect(component.userForm.valid).toBeTruthy();
    fixture.detectChanges();
    spyOn(component, 'openDeleteUserDialog').and.callThrough();
    let btn = fixture.debugElement.query(By.css('.spec-delete_4'));
    expect(btn).toBeDefined();
    expect(btn.nativeElement).toBeDefined();
    btn.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(component.openDeleteUserDialog).toHaveBeenCalledWith(component.bioradUsers[4]);
      component.cancelForm();

      component.openFormForEdit(11);
      fixture.detectChanges();
      btn = fixture.debugElement.query(By.css('.spec-delete_11'));
      expect(btn).toBeNull();
      expect(component.userForm.controls['firstName'].disabled).toBeTrue();
      expect(component.userForm.controls['lastName'].disabled).toBeTrue();
      expect(component.userForm.controls['userEmail'].disabled).toBeTrue();
      component.cancelForm();

      // Test for QCPUser role
      storeStub.security.currentUser.roles = [BioRadUserRoles.QCPUser];
      component.ngOnInit();
      fixture.detectChanges();

      component.openFormForEdit(4);
      fixture.detectChanges();
      btn = fixture.debugElement.query(By.css('.spec-delete_4'));
      expect(btn).toBeNull();
      expect(component.userForm.controls['firstName'].disabled).toBeTrue();
      expect(component.userForm.controls['lastName'].disabled).toBeTrue();
      expect(component.userForm.controls['userEmail'].disabled).toBeTrue();
      expect(component.userForm.controls['territoryId'].disabled).toBeTrue();
      component.cancelForm();

      component.openFormForEdit(11);
      fixture.detectChanges();
      btn = fixture.debugElement.query(By.css('.spec-delete_11'));
      expect(btn).toBeDefined();
      expect(btn.nativeElement).toBeDefined();
      expect(component.userForm.controls['firstName'].disabled).toBeFalse();
      expect(component.userForm.controls['lastName'].disabled).toBeFalse();
      expect(component.userForm.controls['userEmail'].disabled).toBeFalse();
      component.cancelForm();

      // Test for combined AccountManager and QCPUser roles
      storeStub.security.currentUser.roles = [BioRadUserRoles.BioRadManager, BioRadUserRoles.QCPUser];
      component.ngOnInit();
      fixture.detectChanges();

      component.openFormForEdit(4);
      fixture.detectChanges();
      btn = fixture.debugElement.query(By.css('.spec-delete_4'));
      expect(btn).toBeDefined();
      expect(btn.nativeElement).toBeDefined();
      expect(component.userForm.controls['firstName'].disabled).toBeFalse();
      expect(component.userForm.controls['lastName'].disabled).toBeFalse();
      expect(component.userForm.controls['userEmail'].disabled).toBeFalse();
      expect(component.userForm.controls['territoryId'].disabled).toBeFalse();
      component.cancelForm();

      component.openFormForEdit(11);
      fixture.detectChanges();
      btn = fixture.debugElement.query(By.css('.spec-delete_11'));
      expect(btn).toBeDefined();
      expect(btn.nativeElement).toBeDefined();
      expect(component.userForm.controls['firstName'].disabled).toBeFalse();
      expect(component.userForm.controls['lastName'].disabled).toBeFalse();
      expect(component.userForm.controls['userEmail'].disabled).toBeFalse();
      component.cancelForm();
    });
  }));
});
