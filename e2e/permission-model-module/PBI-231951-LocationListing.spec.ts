/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { LocationListing } from '../page-objects/location-listing-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const locationListing = new LocationListing();

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/PBI-231951-LocationListing.json').then(function (data) {
  jsonData = data;
});

describe('Verify the Functionality of Location Listing', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();

  beforeEach(function () {
    loginEvent.doLogin(jsonData.URL, jsonData.username,
      jsonData.password).then(function (loggedIn) {
        console.log(jsonData.URL);
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: Verify Location tab is displayed and user is able to click it @smoke', function () {
    library.logStep('Load location page');
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 2:Verify column header names under location tab', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyColumnsUnderLocationTab(jsonData.expectedColumns).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 3:Verify lab name and address details under location tab', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyLabDetailsUnderColumn(jsonData.column1Header, jsonData.column1Value).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 4:Verify lab contact details under location tab', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyLabDetailsUnderColumn(jsonData.column2Header, jsonData.column2Value).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 5:Verify account information details under location tab', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyLabDetailsUnderColumn(jsonData.column3Header, jsonData.column3Value).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 6:Verify group name details under location tab', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyLabDetailsUnderColumn(jsonData.column4Header, jsonData.column4Value).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 7:Verify location details under location tab', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyLabDetailsUnderColumn(jsonData.column5Header, jsonData.column5Value).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 8:Verify license type details under location tab', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyLabDetailsUnderColumn(jsonData.column6Header, jsonData.column6Value).then(function (status) {
      expect(status).toBe(true);
    });
  });

  it('Test case 9:Verify license status contact details under location tab', function () {
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyLabDetailsUnderColumn(jsonData.column7Header, jsonData.column7Value).then(function (status) {
      expect(status).toBe(true);
    });
  });
});
