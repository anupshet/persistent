/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { AccountsListing } from '../page-objects/accounts-listing-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

let jsonData;

const library = new BrowserLibrary();
const accountsTab = new AccountsListing();
const dashBoard = new Dashboard();

const fs = require('fs');
library.parseJson('./JSON_data/PBI-237596-AccountListingSearchSort.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: Account and Location management', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1:To verify UI components of locations tab', function () {
    accountsTab.verfyUIComponents().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 2:To Verify ascending and desending sorting for account name column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.AccountNameColumn, jsonData.ColumnNo1).then(function (verified) {
      expect(verified).toBe(true);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.AccountNameColumn, jsonData.ColumnNo1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 3:To Verify assending and desending sorting for Account number column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.AccountNumberColumn, jsonData.ColumnNo2).then(function (verified) {
      expect(verified).toBe(true);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.AccountNumberColumn, jsonData.ColumnNo2).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 4:To Verify assending and desending sorting for Address column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.AddressColumn, jsonData.ColumnNo3).then(function (verified) {
      expect(verified).toBe(false);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.AddressColumn, jsonData.ColumnNo3).then(function (verified) {
      expect(verified).toBe(false);
    });
  });

  it('Test case 5:To Verify assending and desending sorting for location column', function () {
    accountsTab.verifysortingAscendingOrder(jsonData.LocationColumn, jsonData.ColumnNo4).then(function (verified) {
      expect(verified).toBe(true);
    });
    accountsTab.verifysortingDescendingOrder(jsonData.LocationColumn, jsonData.ColumnNo4).then(function (verified) {
      expect(verified).toBe(false);
    });
  });

  it('Test case 6:Verify search functionality based on Accounts name', function () {
    accountsTab.selectSearchCatagory(jsonData.AccountNameColumn).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.KeywordAccount, jsonData.ColumnNo1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 7:Verify search functionality based on Account number', function () {
    accountsTab.selectSearchCatagory(jsonData.AccountNumberColumn).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.KeywordAccountNumber, jsonData.ColumnNo2).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 8:Verify search functionality based on Address', function () {
    accountsTab.selectSearchCatagory(jsonData.AddressColumn).then(function (selected) {
      expect(selected).toBe(true);
    });
    accountsTab.searchAndVerify(jsonData.KeywordAddress, jsonData.ColumnNo3).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
