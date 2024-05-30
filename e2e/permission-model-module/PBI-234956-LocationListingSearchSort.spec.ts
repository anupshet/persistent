/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { browser } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
import { LocationListing } from '../page-objects/location-listing-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';

let jsonData;

const library = new BrowserLibrary();
const locationTab = new LocationListing();
const dashBoard = new Dashboard();

const fs = require('fs');
library.parseJson('./JSON_data/PBI-234956-LocationListingSearchSort.json').then(function (data) {
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
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.verfyUIComponents().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 2:To Verify assending and desending sorting for Lab column', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.verifysortingAscendingOrder(jsonData.Lab, jsonData.ColumnNo1).then(function (verified) {
      expect(verified).toBe(true);
    });
    locationTab.verifysortingDescendingOrder(jsonData.Lab, jsonData.ColumnNo1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 3:To Verify assending and desending sorting for Lab Contact column', function () {
    locationTab.clickOnLocationTab().then(function (verified) {
      expect(verified).toBe(true);
    });
    locationTab.verifysortingAscendingOrder(jsonData.LabContact, jsonData.ColumnNo2).then(function (verified) {
      expect(verified).toBe(true);
    });
    locationTab.verifysortingDescendingOrder(jsonData.LabContact, jsonData.ColumnNo2).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 4:To Verify assending and desending sorting for Account column', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.verifysortingAscendingOrder(jsonData.Account, jsonData.ColumnNo3).then(function (verified) {
      expect(verified).toBe(true);
    });
    locationTab.verifysortingDescendingOrder(jsonData.Account, jsonData.ColumnNo3).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 5:To Verify assending and desending sorting for Group column', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.verifysortingAscendingOrder(jsonData.Group, jsonData.ColumnNo4).then(function (verified) {
      expect(verified).toBe(true);
    });
    locationTab.verifysortingDescendingOrder(jsonData.Group, jsonData.ColumnNo4).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 6:To Verify assending and desending sorting for License type column', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.verifysortingAscendingOrder(jsonData.LicenseType, jsonData.ColumnNo6).then(function (verified) {
      expect(verified).toBe(true);
    });
    locationTab.verifysortingDescendingOrder(jsonData.LicenseType, jsonData.ColumnNo6).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 8:To Verify assending and desending sorting for License status column', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.verifysortingAscendingOrder(jsonData.LicenseStatus, jsonData.ColumnNo7).then(function (verified) {
      expect(verified).toBe(true);
    });
    locationTab.verifysortingDescendingOrder(jsonData.LicenseStatus, jsonData.ColumnNo7).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 9:Verify search functionality based on Lab name', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.Lab).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.searchAndVerify(jsonData.KeywordLab, jsonData.ColumnNo1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 10:Verify search functionality based on Lab Contact', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.LabContact).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.searchAndVerify(jsonData.KeywordContact, jsonData.ColumnNo2).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 11:Verify search functionality based on Account', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.Account).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.searchAndVerify(jsonData.KeywordAccount, jsonData.ColumnNo3).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 10:Verify search functionality based on Group name', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.Group).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.searchAndVerify(jsonData.KeywordGroup, jsonData.ColumnNo4).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 11:Verify search functionality based on License type', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.LicenseType).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.searchAndVerify(jsonData.KeywordLicense, jsonData.ColumnNo6).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 12:Verify reset functionality', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.Lab).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.enterKeyword(jsonData.KeywordLab).then(function (verified) {
      expect(verified).toBe(true);
    });
    locationTab.resetFunction().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 13:Verify search functionality based on Address', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.Lab).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.searchAndVerify(jsonData.KeywordAddress, jsonData.ColumnNo1).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 14:Verify search functionality based on Ship to', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.ShipToSoldTo).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.enterKeyword(jsonData.KeywordShipto).then(function (entered) {
      expect(entered).toBe(true);
    });
    locationTab.clickFirstLabName().then(function (firstLabNameClicked) {
      expect(firstLabNameClicked).toBe(true);
    });
    locationTab.verifyShipToSoldTo('shipTo', jsonData.KeywordShipto).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 15:Verify search functionality based on Sold to', function () {
    locationTab.clickOnLocationTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    locationTab.selectSearchCatagory(jsonData.ShipToSoldTo).then(function (selected) {
      expect(selected).toBe(true);
    });
    locationTab.enterKeyword(jsonData.KeywordSoldto).then(function (entered) {
      expect(entered).toBe(true);
    });
    locationTab.clickFirstLabName().then(function (firstLabNameClicked) {
      expect(firstLabNameClicked).toBe(true);
    });
    locationTab.verifyShipToSoldTo('soldTo', jsonData.KeywordSoldto).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
