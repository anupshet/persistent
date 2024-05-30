/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';

let jsonData;

const library = new BrowserLibrary();
const accountsTab = new AccountsListing();
const dashBoard = new Dashboard();
const AccountMgmt = new AccoutManager();

const fs = require('fs');
library.parseJson('./JSON_data/SortBioRadUserManagement-UN-10612.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Bio-Rad User Management Sorting', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dashBoard.goToBioRadUserManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });



  it('Test case 1:Verify assending and desending sorting for "NAME"  column', function () {
    accountsTab.verifysortingDescendingOrder(jsonData.UserNameColumn, jsonData.ColumnNo1).then(function (clicked) {
      expect(clicked).toBe(true);
    });


    accountsTab.verifysortingAscendingOrder(jsonData.UserNameColumn, jsonData.ColumnNo1).then(function (verified) {
      expect(verified).toBe(true);
    });

  });

  it('Test case 2:Verify assending and desending sorting for "ROLE"  column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.RoleColumn, jsonData.ColumnNo3).then(function (verified) {
      expect(verified).toBe(true);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.RoleColumn, jsonData.ColumnNo3).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 4:Verify assending and desending sorting for "EMAIL"  column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.EmailColumn, jsonData.ColumnNo2).then(function (verified) {
      expect(verified).toBe(true);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.EmailColumn, jsonData.ColumnNo2).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test Case 5:Verify that after 20users pagination should be displayed below list of users',function(){

    accountsTab.verifyPaginationOnLocationListingPage(jsonData.noOfItemsPerPage).then(function(displayed){
      expect(displayed).toBe(true);
    });


  });


})
