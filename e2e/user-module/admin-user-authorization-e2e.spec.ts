/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/User-Authorization.json').then(function(data) {
  jsonData = data;
});

describe('Test suite: 111371 : Testing: User Authorization (Suite ID: 111372)', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const dashBoard = new Dashboard();
  const out = new LogOut();
  const library = new BrowserLibrary();

  afterEach(function () {
    out.signOut();
  });

  it('Test case 111373: Verify Admin Role Permissions @P1', function () {
    library.logStep('Test case 111373: Verify if User login to Admin Role Permissions');
    loginEvent.loginToApplication(jsonData.URL, jsonData.AdminUsername,
      jsonData.AdminPassword, jsonData.AdminFirstName).then(function (login) {
        expect(login).toBe(true);
      });
    dashBoard.clickGearIcon().then(function (result) {
      expect(result).toBe(true);
    });
    dashBoard.verifyMenuItemsForAdmin('admin').then(function (result) {
      expect(result).toBe(true);
    });
  });

  it('Test case 111374: Verify User Role Permissions @P1', function () {
    library.logStep('Test case 111374: Verify if User login to User Role Permissions');
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserUsername,
      jsonData.UserPassword, jsonData.UserFirstName).then(function (login) {
        expect(login).toBe(true);
      });
    dashBoard.clickGearIcon().then(function (result) {
      expect(result).toBe(true);
    });
    dashBoard.verifyMenuItemsForAdmin('user').then(function (result) {
      expect(result).toBe(true);
    });
  });
});
