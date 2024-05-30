/**
 * © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
const fs = require('fs');
import { BrowserLibrary} from '../utils/browserUtil';

let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/PBI_216015_216014_ActionDisplayAndTimeConsistency.json').then(function (data) {
  jsonData = data;
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

describe('Test Suite: PBI 216015 - Action Display Width on edit point ,'+
        'PBI 216014 - Time Display Consistency', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  let flagForIEBrowser: boolean;
  const pointData = new PointDataEntry();
  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
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

  it('Test Case 1: Verify that the list of actions diplayed in the dropdown', function () {
    labsetup.navigateTO(jsonData.DeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.clickEnteredValuesRow2('11').then(function (clickedEnteredValuesRow) {
      expect(clickedEnteredValuesRow).toBe(true);
    });
    pointData.chooseAnAction(jsonData.Action).then(function (Selected) {
      expect(Selected).toBe(true);
    });
    pointData.clickSubmitUpdatesButton().then(function (submitUpdatesClicked) {
      expect(submitUpdatesClicked).toBe(true);
    });
    pointData.verifyActionDisplayed(jsonData.Action).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test Case : To verify Time Display Consistency in unity next', function () {
    labsetup.navigateTO(jsonData.DeptName).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Instrument2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Control2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte2).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.verifyTimeFormatForSummary().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    labsetup.navigateTO(jsonData.Analyte3).then(function (navigated) {
      expect(navigated).toBe(true);
    });
    pointData.verifyTimeFormatForPointEntry().then(function (navigated) {
      expect(navigated).toBe(true);
    });
  });

});
