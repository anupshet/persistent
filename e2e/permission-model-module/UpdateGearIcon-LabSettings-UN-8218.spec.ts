/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { LabSettings } from '../page-objects/lab-settings-e2e.po';
import { Locations } from '../page-objects/locations-e2e.po';



let jsonData;
const library = new BrowserLibrary();
const labSettings = new LabSettings();

library.parseJson('./JSON_data/UpdateGearIcon-LabSettings-UN-8218.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: PBI 7148 -7164 - Implement Lab settings (Gear icon) , Update Add Analyte screen for Lab setup', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const location = new Locations();

  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
    });
  });
  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  });

  afterEach(function () {
    out.signOut();
  });

  it('Test Case 1 : To verify saved lab setting changes are stored indivisually for each location', function () {
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location1).then(function (result) {
      expect(result).toBe(true);
    });
    labSettings.goToLabSettings().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.isLabSettingsDisplayed().then(function (status) {
      expect(status).toBe(true);
    });
    /**
     * Prerequisite - for location 1 summary option is selected on Welcome Screen
     * */
    labSettings.isPointValueSelected().then(function (status) {
      expect(status).toBe(false);
    });
    labSettings.selectPointOptions().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectYesOptions().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectDecimal(jsonData.DefaultDecimal).then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labSettings.clickOnConfirmFromPopup().then(function (status) {
      expect(status).toBe(true);
    });
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location2).then(function (result) {
      expect(result).toBe(true);
    });
    labSettings.goToLabSettings().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.isLabSettingsDisplayed().then(function (status) {
      expect(status).toBe(true);
    });
    /**
     * Prerequisite - for location 2 Point option is selected on Welcome Screen
     * */
     labSettings.isPointValueSelected().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectSummaryOptions().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectNoOptions().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.selectDecimal(jsonData.DefaultDecimal2).then(function (enabled) {
      expect(enabled).toBe(true);
    });
    labSettings.clickOnConfirmFromPopup().then(function (status) {
      expect(status).toBe(true);
    });
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location1).then(function (result) {
      expect(result).toBe(true);
    });
    labSettings.goToLabSettings().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.isPointValueSelected().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.isYesSelected().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.clickOnCloseFromPopup().then(function (status) {
      expect(status).toBe(true);
    });
    location.openLocationDropdown().then(function (result) {
      expect(result).toBe(true);
    });
    location.selectGroupFromDropdown(jsonData.GroupName).then(function (result) {
      expect(result).toBe(true);
    });
    location.selectLocationFromDropdown(jsonData.Location2).then(function (result) {
      expect(result).toBe(true);
    });
    labSettings.goToLabSettings().then(function (status) {
      expect(status).toBe(true);
    });
    labSettings.isPointValueSelected().then(function (status) {
      expect(status).toBe(false);
    });
    labSettings.isYesSelected().then(function (status) {
      expect(status).toBe(false);
    });
    labSettings.clickOnCloseFromPopup().then(function (status) {
      expect(status).toBe(true);
    });
  });
});
