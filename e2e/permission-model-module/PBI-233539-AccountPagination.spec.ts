/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { AccoutManager } from '../page-objects/account-management-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const manager = new AccoutManager();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

const fs = require('fs');
let jsonData;

fs.readFile('./JSON_data/PBI-233539-AccountPagination.json', (err, data) => {
  if (err) { throw err; }
  const manuallyAddNewUserData = JSON.parse(data);
  jsonData = manuallyAddNewUserData;
});

describe("Verify that pagination is working as expected on Account listing page", function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AMUsername,
      jsonData.AMPassword, jsonData.AMFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  it("Verify that pagination is working as expected on Account listing page", function () {
    library.logStep('Verify that pagination is working as expected on Account listing page');
    dashBoard.goToAccountManagementpage().then(function (status) {
      expect(status).toBe(true);
    });
    manager.clickAccountTab().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manager.paginationButtonsDisplayed().then(function (paginationdisplayed) {
      expect(paginationdisplayed).toBe(true);
    });
    manager.clickOnSecondPage().then(function (secondpage) {
      expect(secondpage).toBe(true);
    });
    manager.clickOnNextPage().then(function (nextpage) {
      expect(nextpage).toBe(true);
    });
    manager.clickOnPreviousPage().then(function (nextpage) {
      expect(nextpage).toBe(true);
    });
  });
});

