/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';

const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();

library.parseJson('./JSON_data/MultiPoint_Spec1.json').then(function(data) {
  jsonData = data;
});
describe('Multi Point Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const multiPoint = new MultiPointDataEntryInstrument();
  const library = new BrowserLibrary();
  const setting = new Settings();
  let flagForIEBrowser: boolean;

  beforeAll(function () {
    browser.getCapabilities().then(function (c) {
      console.log('browser:- ' + c.get('browserName'));
      if (c.get('browserName').includes('internet explorer')) {
        flagForIEBrowser = true;
      }
    });
  });

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    });

  afterEach(function () {
    out.signOut();
  });

  it('Test case 1:Instrument:To verify the UI of Instrument data table page', function () {
    library.logStep('Test case 1:Instrument: To verify the UI of Instrument data table page');
    library.logStep('Test case 2:Instrument: For Instrument page, Initially, all fields should be empty');
    library.logStep('Test case 3:Instrument: Verify Instrument multi-point page analyte name sorting');
    library.logStep('Test case 1:Control: To verify the UI of Control data table page');
    library.logStep('Test case 2:Control: For Control page, Initially, all fields should be empty');
    library.logStep('Test case 3:Control: Verify Control multi-point page analyte name sorting');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyDefaultMultiPointInstrumentUI(jsonData.Instrument,
      jsonData.Control1, jsonData.Lot, jsonData.Levels, jsonData.C1Analyte1).then(function (uiVerified) {
        expect(uiVerified).toBe(true);
      });
    multiPoint.verifySortingByAnalyteNames().then(function (sortingVerified) {
      expect(sortingVerified).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyMultiPointInstrumentPageDataEntryUI(jsonData.C1Analyte1, jsonData.Levels).then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.verifyDefaultMultiPointControlUI(
      jsonData.Control1, jsonData.Lot, jsonData.Levels, jsonData.C1Analyte1).then(function (uiVerified) {
        expect(uiVerified).toBe(true);
      });
    multiPoint.verifySortingByAnalyteNames().then(function (sortingVerified) {
      expect(sortingVerified).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyMultiPointInstrumentPageDataEntryUI(jsonData.C1Analyte1, jsonData.Levels).then(function (pageVerified) {
      expect(pageVerified).toBe(true);
    });
  });

  it('Test case 7:Instrument:Value field Verification', function () {
    library.logStep('Test case 7:Instrument:Value field Verification');
    const invalidPositiveValue = 1234567890123456789;
    const invalidNegativeValue = -1234567890123456789;
    const alphabetvalue = 'abc!@#$%^&*+=';
    const validPositiveValue = '100.2';
    const validNagativeValue = '-10.3';
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, invalidPositiveValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, invalidPositiveValue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, invalidNegativeValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, invalidNegativeValue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, alphabetvalue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, alphabetvalue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, validPositiveValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, validPositiveValue, 'valid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, validNagativeValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, validNagativeValue, 'valid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
  });

  it('Test case 7:Control:Value field Verification', function () {
    library.logStep('Test case 7:Control:Value field Verification');
    const invalidPositiveValue = 1234567890123456789;
    const invalidNegativeValue = -1234567890123456789;
    const alphabetvalue = 'abc!@#$%^&*+=';
    const validPositiveValue = '100.2';
    const validNagativeValue = '-10.3';
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, invalidPositiveValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, invalidPositiveValue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, invalidNegativeValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, invalidNegativeValue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, alphabetvalue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, alphabetvalue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, validPositiveValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, validPositiveValue, 'valid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, validNagativeValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.C1Analyte1, validNagativeValue, 'valid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
  });

  it('Test case 8:Instrument:Prevent selection of month (future month) from beyond current month on Instrument Data Table page',
   function () {
    library.logStep('Test case 8:Instrument:Prevent selection of month (future month)from beyond current month on Instrument Data Table page');
    library.logStep('Test case 8:Control:Prevent selection of month (future month) from beyond current month on Control Data Table page');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickChangeDateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyNextMonthDisabled().then(function (nextMonthNotAvailable) {
      expect(nextMonthNotAvailable).toBe(true);
    });
    multiPoint.clickYearMonthSelectorButton().then(function (buttonClicked) {
      expect(buttonClicked).toBe(true);
    });
    multiPoint.verifyNextYearDisabled().then(function (nextYearDisabled) {
      expect(nextYearDisabled).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.clickChangeDateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyNextMonthDisabled().then(function (nextMonthNotAvailable) {
      expect(nextMonthNotAvailable).toBe(true);
    });
    multiPoint.clickYearMonthSelectorButton().then(function (buttonClicked) {
      expect(buttonClicked).toBe(true);
    });
    multiPoint.verifyNextYearDisabled().then(function (nextYearDisabled) {
      expect(nextYearDisabled).toBe(true);
    });
  });

  it('Test case 12:Instrument:Verify the Submit Data button Enables and Disables properly', function () {
    library.logStep('Test case 12:Instrument:Verify the Submit Data button Enables and Disables properly');
    library.logStep('Test case 12:Control:Verify the Submit Data button Enables and Disables properly');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, 1.1).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clearData(jsonData.C1Analyte1).then(function (dataCleared) {
      expect(dataCleared).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, 1.1).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clearData(jsonData.C1Analyte1).then(function (dataCleared) {
      expect(dataCleared).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
  });
});
