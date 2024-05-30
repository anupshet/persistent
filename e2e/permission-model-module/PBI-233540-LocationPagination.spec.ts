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
library.parseJson('./JSON_data/PBI-233540-LocationPagination.json').then(function (data) {
  jsonData = data;
});

describe('Verify pagination functionality of location listing page', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();

  beforeEach(function () {
    loginEvent.doLogin(jsonData.URL, jsonData.username,
      jsonData.password).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: Verify that pagination is working as expected on location listing page', function () {
    library.logStep('Load location page');
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.clickOnLocationTab().then(function (status) {
      expect(status).toBe(true);
    });
    locationListing.verifyPaginationOnLocationListingPage(jsonData.noOfItemsPerPage).then(function (status) {
      expect(status).toBe(true);
    });
  });
});
