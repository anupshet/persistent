/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, element, by } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { NewNavigation } from '../page-objects/new-navigation-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/pbi-198753.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite 198753', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const navigation = new NewNavigation();
  const setting = new Settings();
  const library = new BrowserLibrary();

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  const labsetup = new NewLabSetup();
  it('Test case 1: To verify that the user can navigate to previous page using the current level Breadcrumbs.', function () {
    library.logStep('Test case 1: To verify that the user can navigate to previous page using the current level Breadcrumbs.');
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isControlPageDisplayed(jsonData.Control).then(function (controlPageDisplayed) {
      expect(controlPageDisplayed).toBe(true);
    });
    navigation.verifyHeader(jsonData.Control).then(function (headerDisplayed) {
      expect(headerDisplayed).toBe(true);
    });
    navigation.clickHeader(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isInstrumentPageDisplayedToUser(jsonData.Instrument).then(function (instrumentPageDisplayed) {
      expect(instrumentPageDisplayed).toBe(true);
    });
    navigation.verifyHeader(jsonData.Instrument).then(function (headerDisplayed) {
      expect(headerDisplayed).toBe(true);
    });
    navigation.clickHeader(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.isDepartmentPageDisplayed().then(function (deptDisplayed) {
      expect(deptDisplayed).toBe(true);
    });
    navigation.verifyHeader(jsonData.Department).then(function (headerDisplayed) {
      expect(headerDisplayed).toBe(true);
    });
    navigation.clickHeader(jsonData.Department).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    navigation.verifyHeader(jsonData.LabName).then(function (headerDisplayed) {
      expect(headerDisplayed).toBe(true);
    });
    setting.isDashboardDisplayed(jsonData.FirstName, jsonData.LabName).then(function (dashboarDisplayed) {
      expect(dashboarDisplayed).toBe(true);
    });
  });
});
