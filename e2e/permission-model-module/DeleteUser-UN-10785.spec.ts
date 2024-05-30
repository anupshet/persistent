/*
* Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
*/
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { UserManagement } from '../page-objects/user-management-e2e.po';

let jsonData;

const library = new BrowserLibrary();
const accountsTab = new AccountsListing();
const dashBoard = new Dashboard();
const userMgmt = new UserManagement();

library.parseJson('./JSON_data/UserListingSearchSort-UN-10410.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: UN-10410 : Implement Search and Sort for user management', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dashBoard.goToUserManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1 : Verify User management page is displayed', function () {
    userMgmt.verfyUIComponents().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 2 : To Verify ascending and desending sorting for user name column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.UserNameColumnHeader, jsonData.UserNameColumnNo).then(function (verified) {
      /**
       * Params - Name,1
       */
      expect(verified).toBe(true);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.UserNameColumnHeader, jsonData.UserNameColumnNo).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 3 : To Verify assending and desending sorting for Email column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.UserEmailColumnHeader, jsonData.UserEmailColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 4 : To Verify assending and desending sorting for Role column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.UserRoleColumnHeader, jsonData.UserRoleColumnNo).then(function (verified) {
      expect(verified).toBe(false);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.UserRoleColumnHeader, jsonData.UserRoleColumnNo).then(function (verified) {
      expect(verified).toBe(false);
    });
  });

  it('Test case 5 : To Verify assending and desending sorting for location column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.UserLocationColumnHeader, jsonData.UserLocationColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.UserLocationColumnHeader, jsonData.UserLocationColumnNo).then(function (verified) {
      expect(verified).toBe(false);
    });
  });

  it('Test case 6 : Verify search functionality based on User name', function () {
    accountsTab.selectSearchCatagory(jsonData.nameCategoryName).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.userNameKeyword, jsonData.UserNameColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 7 : Verify search functionality based on Email', function () {
    accountsTab.selectSearchCatagory(jsonData.emailCategoryName).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.emailKeyword, jsonData.UserEmailColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 8 : Verify search functionality based on Role', function () {
    accountsTab.selectSearchCatagory(jsonData.roleCategoryName).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.roleKeyword, jsonData.UserRoleColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 9 : Verify search functionality based on Role', function () {
    accountsTab.selectSearchCatagory(jsonData.locationCategoryName).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.locationKeyword, jsonData.UserLocationColumnNo).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 10 : Verify search button is disabled by default', function () {
    userMgmt.verifySearchBtnIsDisabled().then(function (status) {
      expect(status).toBe(true);
    });

  });

  it('Test case 11 : Verify reset button functionality on User managment page', function () {

    userMgmt.verifySearchBtnIsDisabled().then(function (status) {
      expect(status).toBe(true);

      accountsTab.selectSearchCatagory(jsonData.roleCategoryName).then(function (selected) {
        expect(selected).toBe(true);
      });
      accountsTab.searchAndVerify(jsonData.roleKeyword, jsonData.UserRoleColumnNo).then(function (verified) {
        expect(verified).toBe(true);
      });

      //clickOnResetAndVerify//From Mayank
    });

  });

});
