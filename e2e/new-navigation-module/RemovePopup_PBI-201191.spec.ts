/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();
library.parseJson('./JSON_data/PBI-201191-RemovePopup.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: PBI 201191 - Remove control Lot Number Popup', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const setting = new Settings();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: Verify that the tooltips is not displayed in left navigation bar , at control level.', function () {
    labsetup.navigateTO(jsonData.deptName).then(function (navigated) {
        expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.instrumentName).then(function (navigated) {
        expect(navigated).toBe(true);
    });
    setting.verifyAdditionalTooltips(jsonData.controlName).then(function (verified) {
        expect(verified).toBe(true);
    });

  });
});
