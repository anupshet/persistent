/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element, ExpectedConditions } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { InheritedSettings } from '../page-objects/settings-Inheritance-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';

const fs = require('fs');
let jsonData;

const library=new BrowserLibrary();
library.parseJson('./JSON_data/pbi-198752.json').then(function(data) {
  jsonData = data;
})

describe('Test Suite PBI 198752', function () {
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const analyte = new AddAnalyte();
  const dashboard = new Dashboard();
  const setting = new Settings();
  const newSetting = new InheritedSettings();
  browser.waitForAngularEnabled(false);

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1: To verify when adding analytes to control, Level checboxes are selected by default', function () {
    labsetup.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ProductName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.verifyLevelsStatus().then(function (checked) {
      expect(checked).toBe(false);
    });
  });

  it('Test case 2: To verify that the user cannot uncheck all the Levels in Use checkboxes.', function () {
    labsetup.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ProductName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.verifyLevelsStatus().then(function (checked) {
      expect(checked).toBe(false);
    });
    analyte.uncheckAllLevels().then(function (uncheck) {
      expect(uncheck).toBe(false);
    });
  });

  it('Test case 3: To Verify that an analyte can be added to control.', function () {
    labsetup.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ProductName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.verifyLevelsStatus().then(function (checked) {
      expect(checked).toBe(false);
    });
    analyte.selectAnalyteName(jsonData.Analyte).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectUnits(jsonData.Unit).then(function (unitSelected) {
      expect(unitSelected).toBe(true);
    });
    browser.sleep(3000);
    analyte.clickAddAnalyteButton().then(function (cancelled) {
      expect(cancelled).toBe(true);
    });
    dashboard.clickUnityNext().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    labsetup.navigateTO(jsonData.DepartmentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.InstrumentName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.ProductName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.clickOnEditThisAnalyteLink().then(function (editAnalyte) {
      expect(editAnalyte).toBe(true);
    });
    newSetting.verifyNumberOfLevelDisplayed(3).then(function (levels) {
      expect(levels).toBe(true);
    });
  });
});
