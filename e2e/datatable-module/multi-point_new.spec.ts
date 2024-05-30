/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/MultiPoint_new.json').then(function(data) {
  jsonData = data;
});

describe('Multi Point Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const multiPoint = new MultiPointDataEntryInstrument();
  const library = new BrowserLibrary();
  const pointData = new PointDataEntry();
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

  // Control Level TC
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
    library.logStep(
      'Test case 8:Instrument:Prevent selection of month (future month) from beyond current month on Instrument Data Table page');
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

// TC 12 for control here
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
    multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
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
    multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
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

  it('Test case 21:Instrument:To Verify that a modal will be displayed if user clicks on any pagination button without saving data',
   function () {
    library.logStep(
      'Test case 21:Instrument:To Verify that a modal will be displayed if user clicks on any pagination button without saving data');
    library.logStep(
      'Test case 22:Instrument:Display of modal when user navigates away from data entry page');
    library.logStep(
      'Test case 23:Instrument:Clicking on the Dont save data button on the' +
       'modal when user tries to navigate away from data entry page will navigate you to the new location');
    library.logStep(
      'Test case 24:Instrument:Clicking on the Save this page on the modal' +
       'when user tries to navigate away from data entry page will save the data');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.verifyPageSelected(1).then(function (page1Selected) {
      expect(page1Selected).toBe(true);
    });
    multiPoint.clickPaginationNextButton().then(function (nextClicked) {
      expect(nextClicked).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
      expect(dontSaveClicked).toBe(true);
    });
    multiPoint.verifyPageSelected(2).then(function (page2Selected) {
      expect(page2Selected).toBe(true);
    });
    multiPoint.clickPaginationPreviousButton().then(function (previousClicked) {
      expect(previousClicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
      expect(dontSaveClicked).toBe(true);
    });
    setting.isControlPageDisplayed(jsonData.Control1).then(function (controlPage) {
      expect(controlPage).toBe(true);
    });
    setting.goToHomePage().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.clickPaginationNextButton().then(function (nextClicked) {
      expect(nextClicked).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickSaveDataButton().then(function (saveButtonClicked) {
      expect(saveButtonClicked).toBe(true);
    });
    multiPoint.verifyPageSelected(2).then(function (page2Selected) {
      expect(page2Selected).toBe(true);
    });
    multiPoint.clickPaginationPreviousButton().then(function (previousClicked) {
      expect(previousClicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyDataEntered(jsonData.C1Analyte1, 5).then(function (noDataVerified) {
      expect(noDataVerified).toBe(true);
    });
  });

  // Control Level TC
  it('Test case 21:Control:Display of modal when user navigates away from data entry page',
   function () {
    library.logStep('Test case 21:Control:To Verify that a modal will be displayed if user clicks on any pagination button without saving data');
    library.logStep('Test case 22:Control:Display of modal when user navigates away from data entry page');
    library.logStep('Test case 23:Control:Clicking on the Dont save data button on the modal when user tries to navigate away from data entry page will navigate you to the new location');
    library.logStep('Test case 24:Control:Clicking on the Save this page on the modal when user tries to navigate away from data entry page will save the data');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C2Analyte1, 2.55).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.verifyPageSelected(1).then(function (page1Selected) {
      expect(page1Selected).toBe(true);
    });
    multiPoint.clickPaginationNextButton().then(function (nextClicked) {
      expect(nextClicked).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
      expect(dontSaveClicked).toBe(true);
    });
    multiPoint.verifyPageSelected(2).then(function (page2Selected) {
      expect(page2Selected).toBe(true);
    });
    multiPoint.clickPaginationPreviousButton().then(function (previousClicked) {
      expect(previousClicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C2Analyte1, 2.56).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    setting.navigateTO(jsonData.C2Analyte1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
      expect(dontSaveClicked).toBe(true);
    });
    pointData.verifyPointEntryPageHeader(jsonData.C2Analyte1).then(function (analytePage) {
      expect(analytePage).toBe(true);
    });
    setting.goToHomePage().then(function (homeClicked) {
      expect(homeClicked).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.verifyPageSelected(1).then(function (page1Selected) {
      expect(page1Selected).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.enterData(jsonData.C2Analyte1, 2.57).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.clickPaginationNextButton().then(function (nextClicked) {
      expect(nextClicked).toBe(true);
    });
    multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
      expect(dialogDisplayed).toBe(true);
    });
    multiPoint.clickSaveDataButton().then(function (saveButtonClicked) {
      expect(saveButtonClicked).toBe(true);
    });
    multiPoint.verifyPageSelected(2).then(function (page2Selected) {
      expect(page2Selected).toBe(true);
    });
    multiPoint.clickPaginationPreviousButton().then(function (previousClicked) {
      expect(previousClicked).toBe(true);
    });
    multiPoint.verifyDataEntered(jsonData.C2Analyte1, 2.57).then(function (noDataVerified) {
      expect(noDataVerified).toBe(true);
    });
  });

  it('Test case 5:Instrument: Run Entry Input Data Verification Using Tab Key (Multi Point)', function () {
    library.logStep('Test case 5:Instrument: Run Entry Input Data Verification Using Tab Key (Multi Point)');
    library.logStep('Test case 26:Instrument: Run Entry Input Data Verification Using Enter Key (Multi Point)');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyRunEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '2');
    dataEnter.set('14', '4');
    dataEnter.set('17', '6');
    dataEnter.set('21', '8');
    dataEnter.set('24', '10');
    dataEnter.set('27', '12');
    dataEnter.set('31', '14');
    dataEnter.set('34', '16');
    dataEnter.set('37', '18');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '17');
    tabFocusedElement1.set('17', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '27');
    tabFocusedElement1.set('27', '31');
    tabFocusedElement1.set('31', '34');
    tabFocusedElement1.set('34', '37');
    tabFocusedElement1.set('37', 'End');
    multiPoint.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    multiPoint.verifyRunEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 6:Instrument: Level Entry Input Data Verification Using the Tab Key (Multi Point)', function () {
    library.logStep('Test case 6:Instrument: Level Entry Input Data Verification Using the Tab Key (Multi Point)');
    library.logStep('Test case 27:Instrument: Level Entry Input Data Verification Using the Enter Key (Multi Point)');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyLevelEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    //  step 2
    const dataEnter = new Map<string, string>();
    dataEnter.set('101', '1');
    dataEnter.set('104', '2');
    dataEnter.set('107', '3');
    dataEnter.set('201', '4');
    dataEnter.set('204', '5');
    dataEnter.set('207', '6');
    dataEnter.set('301', '7');
    dataEnter.set('304', '8');
    dataEnter.set('307', '9');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('101', '104');
    tabFocusedElement1.set('104', '107');
    tabFocusedElement1.set('107', '201');
    tabFocusedElement1.set('201', '204');
    tabFocusedElement1.set('204', '207');
    tabFocusedElement1.set('207', '301');
    tabFocusedElement1.set('301', '304');
    tabFocusedElement1.set('304', '307');
    tabFocusedElement1.set('307', 'End');
    multiPoint.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    multiPoint.verifyLevelEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 5:Control: Run Entry Input Data Verification Using Tab Key (Multi Point)', function () {
    library.logStep('Test case 5:Control: Run Entry Input Data Verification Using Tab Key (Multi Point)');
    library.logStep('Test case 26:Control: Run Entry Input Data Verification Using Enter Key (Multi Point)');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyRunEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '2');
    dataEnter.set('14', '4');
    dataEnter.set('17', '6');
    dataEnter.set('21', '8');
    dataEnter.set('24', '10');
    dataEnter.set('27', '12');
    dataEnter.set('31', '14');
    dataEnter.set('34', '16');
    dataEnter.set('37', '18');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '17');
    tabFocusedElement1.set('17', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '27');
    tabFocusedElement1.set('27', '31');
    tabFocusedElement1.set('31', '34');
    tabFocusedElement1.set('34', '37');
    tabFocusedElement1.set('37', 'End');
    multiPoint.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    multiPoint.verifyRunEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 6:Control: Level Entry Input Data Verification Using the Tab Key (Multi Point)', function () {
    library.logStep('Test case 6:Control: Level Entry Input Data Verification Using the Tab Key (Multi Point)');
    library.logStep('Test case 27:Control: Level Entry Input Data Verification Using the Enter Key (Multi Point)');
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyLevelEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    //  step 2
    const dataEnter = new Map<string, string>();
    dataEnter.set('101', '1');
    dataEnter.set('104', '2');
    dataEnter.set('107', '3');
    dataEnter.set('201', '4');
    dataEnter.set('204', '5');
    dataEnter.set('207', '6');
    dataEnter.set('301', '7');
    dataEnter.set('304', '8');
    dataEnter.set('307', '9');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('101', '104');
    tabFocusedElement1.set('104', '107');
    tabFocusedElement1.set('107', '201');
    tabFocusedElement1.set('201', '204');
    tabFocusedElement1.set('204', '207');
    tabFocusedElement1.set('207', '301');
    tabFocusedElement1.set('301', '304');
    tabFocusedElement1.set('304', '307');
    tabFocusedElement1.set('307', 'End');
    multiPoint.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    multiPoint.verifyLevelEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

// TC 10 covered here
  it(
    'Test case 11:Instrument: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page',
   function () {
    library.logStep('Test case 10:Instrument: Verify the comment is displayed correctly in Analyte Point View page');
    library.logStep
    ('Test case 11:Instrument: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page');
    const dataMap = new Map<string, string>();
    const val = '1.85';
    const commentString = 'Comment one to check comment count';
    const newCommentString = 'Comment two to check comment count';
    const expectedCommentValue1 = '1';
    const expectedCommentValue2 = '2';
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.hoverOverTest(jsonData.C1Analyte1).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiPoint.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.addComment(commentString).then(function (status) {
      expect(status).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    if (flagForIEBrowser === true) {
      setting.goToHomePage().then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiPoint.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    }
    multiPoint.verifyEnteredValueStored(val).then(function (saved) {
      expect(saved).toBe(true);
    });
    multiPoint.verifyPezCommentToolTip(commentString).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    multiPoint.verifyCommentSection(expectedCommentValue1).then(function (comment1) {
      expect(comment1).toBe(true);
    });
    setting.navigateTO(jsonData.Control1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.C1Analyte1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.editComment(val, newCommentString).then(function (status) {
      expect(status).toBe(true);
    });
    setting.goToHomePage().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySpecificAnalyteComment2(jsonData.C1Analyte1, commentString).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    multiPoint.verifyCommentSection(expectedCommentValue2).then(function (comment1) {
      expect(comment1).toBe(true);
    });
    multiPoint.verifytheReviewSummaryPage(jsonData.C1Analyte1, newCommentString ).then(function (review1) {
      expect(review1).toBe(true);
    });
    multiPoint.verifyInteractionIconButtonOnProductLevel().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

// TC 10 covered here
it('Test case 11:Control: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page',
 function () {
  library.logStep('Test case 10:Control: Verify the comment is displayed correctly in Analyte Point View page');
  library.logStep
  ('Test case 11:Control: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page');
  const dataMap = new Map<string, string>();
  const val = '1.83';
  const commentString = 'Comment one to check comment count';
  const newCommentString = 'Comment two to check comment count';
  const expectedCommentValue1 = '1';
  const expectedCommentValue2 = '2';
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Control2).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  dataMap.set('11', val);
  multiPoint.enterValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.hoverOverTest(jsonData.C2Analyte1).then(function (hovered) {
    expect(hovered).toBe(true);
  });
  multiPoint.clickShowOptions().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.addComment(commentString).then(function (status) {
    expect(status).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
   if (flagForIEBrowser === true) {
  setting.goToHomePage().then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
   }

  multiPoint.verifyEnteredValueStored(val).then(function (saved) {
    expect(saved).toBe(true);
  });
  multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte1, commentString).then(function (doneThat) {
    expect(doneThat).toBe(true);
  });
  multiPoint.verifySpecificAnalyteCommentNumber(jsonData.C2Analyte1, expectedCommentValue1).then(function (comment1) {
    expect(comment1).toBe(true);
  });
  setting.navigateTO(jsonData.C2Analyte1).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.editComment(val, newCommentString).then(function (status) {
    expect(status).toBe(true);
  });
  setting.goToHomePage().then(function (navigated) {
    expect(navigated).toBe(true);
  });
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Control2).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifySpecificAnalyteComment2(jsonData.C2Analyte1, commentString).then(function (doneThat) {
    expect(doneThat).toBe(true);
  });
  multiPoint.verifySpecificAnalyteCommentNumber(jsonData.C2Analyte1, expectedCommentValue2).then(function (comment1) {
    expect(comment1).toBe(true);
  });
  multiPoint.verifytheReviewSummaryPage(jsonData.C2Analyte1, commentString).then(function (review1) {
    expect(review1).toBe(true);
  });
});

it('Test case 25:Instrument: Verify that User with user role access can enter the data on instrument level', function () {
  library.logStep('Test case 25:Instrument: Verify that User with user role access can enter the data on instrument level');
  const dataMap = new Map<string, string>();
  const val = '2.70';
  const commentString = 'Comment added by user ' + jsonData.C1Analyte2;
  out.signOut().then(function (status) {
    expect(status).toBe(true);
  });
  loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
    jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  dataMap.set('21', val);
  multiPoint.enterValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.hoverOverTest(jsonData.C1Analyte2).then(function (hovered) {
    expect(hovered).toBe(true);
  });
  multiPoint.clickShowOptions().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.addComment(commentString).then(function (status) {
    expect(status).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
  multiPoint.verifyEnteredValueStoredL1AllTest(val, '2').then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifySpecificAnalyteComment(jsonData.C1Analyte2, commentString).then(function (doneThat) {
    expect(doneThat).toBe(true);
  });
});

it('Test case 25:Control: Verify that User with user role access can enter the data on control level', function () {
  library.logStep('Test case 25:Control: Verify that User with user role access can enter the data on control level');
  const dataMap = new Map<string, string>();
  const val = '2.80';
  const commentString = 'Comment added by user ' + jsonData.Control2;
  out.signOut().then(function (status) {
    expect(status).toBe(true);
  });
  loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
    jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Control2).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  dataMap.set('21', val);
  multiPoint.enterValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.hoverOverTest(jsonData.C2Analyte2).then(function (hovered) {
    expect(hovered).toBe(true);
  });
  multiPoint.clickShowOptions().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.addComment(commentString).then(function (status) {
    expect(status).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  if (flagForIEBrowser === true) {
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
  }
  multiPoint.verifyEnteredValueStoredL1AllTest(val, '2').then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte2, commentString).then(function (doneThat) {
    expect(doneThat).toBe(true);
  });
});

it('Test case 13:Control: Verify Control based multi-point page', function () {
  library.logStep('Test case 13:Control: Verify Control based multi-point page');
  const dataMap1 = new Map<string, string>();
    const test1 = '1', test2 = '2', test3 = '3';
    const val1 = '1.11', val2 = '1.12', val3 = '1.13';
    const val4 = '2.14', val5 = '2.15', val6 = '2.16';
    const val7 = '3.17', val8 = '3.18', val9 = '3.19';
    const string3 = 'Comment for analyte ' + jsonData.C2Analyte3;
    const commentCount = '1';
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('11', val1);
    dataMap.set('14', val2);
    dataMap.set('17', val3);
    dataMap.set('21', val4);
    dataMap.set('24', val5);
    dataMap.set('27', val6);
    dataMap.set('31', val7);
    dataMap.set('34', val8);
    dataMap.set('37', val9);
    multiPoint.enterValues(dataMap).then(function (result) {
      console.log('Values entered for Matrix 1');
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
      setting.goToHomePage().then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Control2).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiPoint.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val2, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val3, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val4, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val5, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val6, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val7, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val8, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val9, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMap1.set('11', val9);
    dataMap1.set('14', val8);
    dataMap1.set('21', val7);
    dataMap1.set('27', val6);
    dataMap1.set('34', val5);
    dataMap1.set('37', val4);
    multiPoint.enterValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.enterCommentForAllTests(string3, jsonData.C2Analyte3).then(function (added) {
      expect(added).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
      setting.goToHomePage().then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Control2).then(function (navigate) {
        expect(navigate).toBe(true);
      });
    multiPoint.verifyEnteredValueStoredL1AllTest(val9, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val8, test1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val7, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val6, test2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val5, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val4, test3).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte3, string3).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    multiPoint.verifySpecificAnalyteInteractionNumber(jsonData.C2Analyte3, commentCount).then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 15:Control: Verify Control based multi-Point page data on level setting changed', function () {
    library.logStep('Test case 15:Control: Verify Control based multi-Point page data on level setting changed');
    const dataMap1 = new Map<string, string>();
    const test4 = '4', test5 = '5', test6 = '6';
    const val10 = '4.20', val11 = '4.21', val12 = '4.22';
    const val13 = '5.23', val14 = '5.24', val15 = '5.25';
    const val16 = '6.26', val17 = '6.27', val18 = '6.28';
    const string4 = 'Comment for analyte ' + jsonData.C2Analyte4;
    const commentCount = '1';
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Control2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('41', val10);
    dataMap.set('44', val11);
    dataMap.set('47', val12);
    dataMap.set('51', val13);
    dataMap.set('54', val14);
    dataMap.set('57', val15);
    dataMap.set('61', val16);
    dataMap.set('64', val17);
    dataMap.set('67', val18);
    multiPoint.enterValues(dataMap).then(function (result) {
      console.log('Values entered for Matrix 1');
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
      setting.goToHomePage().then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Control2).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiPoint.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    multiPoint.verifyEnteredValueStoredL1AllTest(val10, test4).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val11, test4).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val12, test4).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val13, test5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val14, test5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val15, test5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL1AllTest(val16, test6).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val17, test6).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val18, test6).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    dataMap1.set('41', val18);
    dataMap1.set('54', val17);
    dataMap1.set('67', val16);
    multiPoint.enterValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.enterCommentForAllTests(string4, jsonData.C2Analyte4).then(function (added) {
      expect(added).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
      setting.goToHomePage().then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Control2).then(function (navigate) {
        expect(navigate).toBe(true);
      });
    multiPoint.verifyEnteredValueStoredL1AllTest(val18, test4).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL2AllTest(val17, test5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredL3AllTest(val16, test6).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifySpecificAnalyteComment(jsonData.C2Analyte4, string4).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    multiPoint.verifySpecificAnalyteInteractionNumber(jsonData.C2Analyte4, commentCount).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
  });


it('Test case 13:Instrument: Verify Instrument based multi-point page', function () {
  library.logStep('Test case 13:Instrument: Verify Instrument based multi-point page');
  const dataMap1 = new Map<string, string>();
  const test1 = '1', test2 = '2', test3 = '3';
  const val1 = '1.11', val2 = '1.12', val3 = '1.13';
  const val4 = '2.14', val5 = '2.15', val6 = '2.16';
  const val7 = '3.17', val8 = '3.18', val9 = '3.19';
  const string1 = 'Comment for analyte ' + jsonData.C1Analyte1;
  const commentCount = '1';
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataMap = new Map<string, string>();
  dataMap.set('11', val1);
  dataMap.set('14', val2);
  dataMap.set('17', val3);
  dataMap.set('21', val4);
  dataMap.set('24', val5);
  dataMap.set('27', val6);
  dataMap.set('31', val7);
  dataMap.set('34', val8);
  dataMap.set('37', val9);

  multiPoint.enterValues(dataMap).then(function (result) {
    console.log('Values entered for Matrix 1');
    expect(result).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val2, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val3, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val4, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val5, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val6, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val7, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val8, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val9, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });

  dataMap1.set('11', val9);
  dataMap1.set('14', val8);
  dataMap1.set('21', val7);
  dataMap1.set('27', val6);
  dataMap1.set('34', val5);
  dataMap1.set('37', val4);
  multiPoint.enterValues(dataMap1).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.enterCommentForAllTests(string1, jsonData.C1Analyte1).then(function (added) {
    expect(added).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
  multiPoint.verifyEnteredValueStoredL1AllTest(val9, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val8, test1).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val7, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val6, test2).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val5, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val4, test3).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyPezCommentToolTipAllTest(string1, test1).then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.verifyCommentNumberAllTest(commentCount, test1).then(function (verified) {
    expect(verified).toBe(true);
  });
});

it('Test case 15:Instrument: Verify Instrument based multi point page data on level setting changed', function () {
  library.logStep('Test case 15:Instrument: Verify Instrument based multi point page data on level setting changed');
  const dataMap1 = new Map<string, string>();
  const test4 = '4', test5 = '5', test6 = '6';
  const val10 = '4.20', val11 = '4.21', val12 = '4.22';
  const val13 = '5.23', val14 = '5.24', val15 = '5.25';
  const val16 = '6.26', val17 = '6.27', val18 = '6.28';
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataMap = new Map<string, string>();
  dataMap.set('41', val10);
  dataMap.set('44', val11);
  dataMap.set('47', val12);
  dataMap.set('51', val13);
  dataMap.set('54', val14);
  dataMap.set('57', val15);
  dataMap.set('61', val16);
  dataMap.set('64', val17);
  dataMap.set('67', val18);
  multiPoint.enterValues(dataMap).then(function (result) {
    console.log('Values entered for Matrix 1');
    expect(result).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  multiPoint.verifyEnteredValueStoredL1AllTest(val10, test4).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val11, test4).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val12, test4).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val13, test5).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val14, test5).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val15, test5).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL1AllTest(val16, test6).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val17, test6).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val18, test6).then(function (displayed) {
    expect(displayed).toBe(true);
  });

  dataMap1.set('41', val12);
  dataMap1.set('54', val11);
  dataMap1.set('67', val10);

  multiPoint.enterValues(dataMap1).then(function (result) {
    expect(result).toBe(true);
  });
  multiPoint.clickSubmitButton().then(function (clicked) {
    expect(clicked).toBe(true);
  });
    setting.goToHomePage().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
  multiPoint.verifyEnteredValueStoredL1AllTest(val12, test4).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL2AllTest(val11, test5).then(function (displayed) {
    expect(displayed).toBe(true);
  });
  multiPoint.verifyEnteredValueStoredL3AllTest(val10, test6).then(function (displayed) {
    expect(displayed).toBe(true);
  });
});


it('Test case 16:Control: To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.', function () {
  library.logStep
  ('Test case 16:Control: To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.');
  library.logStep
  ('Test case 17:Control: ' +
       'To Verify that user will be navigated to specific page of analytes by clicking on Page number in Pagination Control');
  library.logStep('Test case 18:Control: To Verify that once the user Navigated to the second page back arrow button will be displayed.');
  library.logStep('Test case 19:Control: To Verify that clicking on Back arrow will navigate user to previous page');
  library.logStep('Test case 20:Control: To Verify that Clicking on Single arrow (Next) will be taking user to very next page of Analytes');
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Control2).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.paginationButtonsDisplayed().then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.verifyPrevButtonEnabled().then(function (verified) {
    expect(verified).toBe(false);
  });
  multiPoint.clickOnSecondPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('2').then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyPrevButtonEnabled().then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.clickOnPreviousPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('1').then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.clickOnNextPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('2').then(function (clicked) {
    expect(clicked).toBe(true);
  });
});

it
('Test case 16:Instrument: To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.', function () {
  library.logStep(
    'Test case 16:Instrument: To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.');
  library.logStep
  ('Test case 17:Instrument: To ' +
       'Verify that user will be navigated to specific page of analytes by clicking on Page number in Pagination Control');
  library.logStep(
    'Test case 18:Instrument: To Verify that Clicking on Single arrow (Next) will be taking user to very next page of Analytes');
  library.logStep(
    'Test case 19:Instrument: To Verify that once the user Navigated to the second page Previous arrow button will be enabled.');
  library.logStep(
    'Test case 20:Instrument: To Verify that clicking on Previous arrow will navigate user to previous page');
  setting.navigateTO(jsonData.Department).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  setting.navigateTO(jsonData.Instrument).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiPoint.paginationButtonsDisplayed().then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.verifyPrevButtonEnabled().then(function (verified) {
    expect(verified).toBe(false);
  });
  multiPoint.clickOnSecondPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('2').then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyPrevButtonEnabled().then(function (verified) {
    expect(verified).toBe(true);
  });
  multiPoint.clickOnPreviousPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('1').then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.clickOnNextPage().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiPoint.verifyNavigationToPage('2').then(function (clicked) {
    expect(clicked).toBe(true);
  });
});
});

  // it('Test case 9:Instrument:Verify the date displayed correct on Instrument Data Table page', function () {
  //   library.logStep('Test case 9:Instrument:Verify the date displayed correct on Instrument Data Table page');
  //   library.logStep('Test case 14:Instrument:Verify Instrument based multi-Point page data on select different Date-Timer Picker');
  //   setting.navigateTO(jsonData.Department).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Instrument).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiPoint.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   multiPoint.clickChangeDateButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
  //     expect(datePickerClicked).toBe(true);
  //   });
  //   pointData.selectYear('2018').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectMonth('DEC').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectDate('15').then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  //   multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
  //     expect(dataEntered).toBe(true);
  //   });
  //   multiPoint.clickSubmitButton().then(function (submitClicked) {
  //     expect(submitClicked).toBe(true);
  //   });
  //   multiPoint.verifyDataEntered(jsonData.C1Analyte1, 5).then(function (noDataVerified) {
  //     expect(noDataVerified).toBe(true);
  //   });
  //   multiPoint.verifyMonthDay('Dec', '15').then(function (dayMonth) {
  //     expect(dayMonth).toBe(true);
  //   });
  //   multiPoint.clickChangeDateButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
  //     expect(datePickerClicked).toBe(true);
  //   });
  //   pointData.selectYear('2019').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectMonth('MAR').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectDate('15').then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  //   multiPoint.enterData(jsonData.C1Analyte1, 5.1).then(function (dataEntered) {
  //     expect(dataEntered).toBe(true);
  //   });
  //   multiPoint.clickSubmitButton().then(function (submitClicked) {
  //     expect(submitClicked).toBe(true);
  //   });
  //   multiPoint.verifyDataEntered(jsonData.C1Analyte1, 5.1).then(function (noDataVerified) {
  //     expect(noDataVerified).toBe(true);
  //   });
  //   multiPoint.verifyMonthDay('Mar', '15').then(function (dayMonth) {
  //     expect(dayMonth).toBe(true);
  //   });
  //   dashboard.clickUnityNext().then(function (homeClicked) {
  //     expect(homeClicked).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Department).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Instrument).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiPoint.clickChangeDateButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   const today = new Date();
  //   const todaysDate = today.getDate();
  //   const tomorrowsDate = todaysDate + 1;
  //   console.log('Tomorrows date is: ' + tomorrowsDate);
  //   pointData.verifyFutureDateSelection(tomorrowsDate).then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  // });

  // // Control Level TC
  // it('Test case 9:Control:Verify the date displayed correct on Control Data Table page', function () {
  //   library.logStep('Test case 9:Control:Verify the date displayed correct on Control Data Table page');
  //   library.logStep('Test case 14:Control:Verify Control based multi-point page data on select different Date-Timer Picker');
  //   setting.navigateTO(jsonData.Department).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Instrument).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Control1).then(function (navigateControl) {
  //     expect(navigateControl).toBe(true);
  //   });
  //   multiPoint.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   multiPoint.clickChangeDateButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
  //     expect(datePickerClicked).toBe(true);
  //   });
  //   pointData.selectYear('2018').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectMonth('DEC').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectDate('15').then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  //   multiPoint.enterData(jsonData.C1Analyte1, 5).then(function (dataEntered) {
  //     expect(dataEntered).toBe(true);
  //   });
  //   multiPoint.clickSubmitButton().then(function (submitClicked) {
  //     expect(submitClicked).toBe(true);
  //   });
  //   multiPoint.verifyDataEntered(jsonData.C1Analyte1, 5).then(function (noDataVerified) {
  //     expect(noDataVerified).toBe(true);
  //   });
  //   multiPoint.verifyMonthDay('Dec', '15').then(function (dayMonth) {
  //     expect(dayMonth).toBe(true);
  //   });
  //   multiPoint.clickChangeDateButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   pointData.clickYearMonthSelectorButton().then(function (datePickerClicked) {
  //     expect(datePickerClicked).toBe(true);
  //   });
  //   pointData.selectYear('2019').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectMonth('MAR').then(function (yearSelected) {
  //     expect(yearSelected).toBe(true);
  //   });
  //   pointData.selectDate('15').then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  //   multiPoint.enterData(jsonData.C1Analyte1, 5.1).then(function (dataEntered) {
  //     expect(dataEntered).toBe(true);
  //   });
  //   multiPoint.clickSubmitButton().then(function (submitClicked) {
  //     expect(submitClicked).toBe(true);
  //   });
  //   multiPoint.verifyDataEntered(jsonData.C1Analyte1, 5.1).then(function (noDataVerified) {
  //     expect(noDataVerified).toBe(true);
  //   });
  //   multiPoint.verifyMonthDay('Mar', '15').then(function (dayMonth) {
  //     expect(dayMonth).toBe(true);
  //   });
  //   dashboard.clickUnityNext().then(function (homeClicked) {
  //     expect(homeClicked).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Department).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Instrument).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.Control1).then(function (navigateControl) {
  //     expect(navigateControl).toBe(true);
  //   });
  //   multiPoint.clickChangeDateButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   const today = new Date();
  //   const todaysDate = today.getDate();
  //   const tomorrowsDate = todaysDate + 1;
  //   console.log('Tomorrows date is: ' + tomorrowsDate);
  //   pointData.verifyFutureDateSelection(tomorrowsDate).then(function (dateSelected) {
  //     expect(dateSelected).toBe(true);
  //   });
  // });

    // it('Pre-requisite: Clear all tests', function() {
  //   setting.navigateTO(jsonData.Department).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.EmptyInstrument).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.EmptyControl).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiPoint.clearAllTestsData(jsonData.EmptyAnalyte1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiPoint.clearAllTestsData(jsonData.EmptyAnalyte2).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //  });

  // it('Test case 4: Rows of test data are arranged consecutively by date and time', function () {
  //   library.logStep('Test case 4: Rows of test data are arranged consecutively by date and time');
  //    const date = new Date();
  //    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  //    const currMonth = date.getMonth();
  //    const currYear = date.getFullYear();
  //    let year, mon1, mon2, mon3, day1, day2, day3;
  //    const val = '1.32', val1 = '2.40', val2 = '3.10';
  //    if (currMonth >= 2) {
  //      year = currYear;
  //      mon1 = months[currMonth - 2];
  //      mon2 = months[currMonth - 1];
  //      mon3 = months[currMonth];
  //      day1 = 3;
  //      day2 = 2;
  //      day3 = 1;
  //    } else if (currMonth < 2) {
  //      year = currYear - 1;
  //      mon1 = months[currMonth - 2];
  //      mon2 = months[currMonth - 1];
  //      mon3 = months[currMonth];
  //      day1 = 3;
  //      day2 = 2;
  //      day3 = 1;
  //    }
  //    const dataMap = new Map<string, string>();
  //    setting.navigateTO(jsonData.Department).then(function (navigate) {
  //      expect(navigate).toBe(true);
  //     });
  //     setting.navigateTO(jsonData.EmptyInstrument).then(function (navigate) {
  //       expect(navigate).toBe(true);
  //     });
  //     setting.navigateTO(jsonData.EmptyControl).then(function (navigate) {
  //       expect(navigate).toBe(true);
  //     });
  //     multiPoint.changeDate(year, mon1, day1).then(function (dateChanged) {
  //       expect(dateChanged).toBe(true);
  //     });
  //     multiPoint.clickManuallyEnterData().then(function(clicked) {
  //       expect(clicked).toBe(true);
  //     });
  //    dataMap.set('11', val);
  //    multiPoint.enterValues(dataMap).then(function (result) {
  //      expect(result).toBe(true);
  //    });
  //    multiPoint.clickSubmitButton().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });
  //    multiPoint.verifyEnteredValueStored(val).then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });
  //    multiPoint.changeDate(year, mon2, day2).then(function (dateChanged) {
  //      expect(dateChanged).toBe(true);
  //    });
  //    dataMap.set('11', val1);
  //    multiPoint.enterValues(dataMap).then(function (result) {
  //      expect(result).toBe(true);
  //    });
  //    multiPoint.clickSubmitButton().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });
  //    multiPoint.verifyEnteredValueStored(val1).then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });
  //    multiPoint.changeDate(year, mon3, day3).then(function (dateChanged) {
  //      expect(dateChanged).toBe(true);
  //    });
  //    dataMap.set('11', val2);
  //    multiPoint.enterValues(dataMap).then(function (result) {
  //      expect(result).toBe(true);
  //    });
  //    multiPoint.clickSubmitButton().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });
  //    multiPoint.verifyEnteredValueStored(val2).then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });
  //  });

  //  it('Pre-requisite: Clear all tests', function() {

  //   setting.navigateTO(jsonData.Department).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.EmptyInstrument).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   setting.navigateTO(jsonData.EmptyControl).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiPoint.clearAllTestsData(jsonData.EmptyAnalyte1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiPoint.clearAllTestsData(jsonData.EmptyAnalyte2).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  // });

  // it('Test case 4: Rows of test data are arranged consecutively by date and time', function () {
  //   library.logStep('Test case 4: Rows of test data are arranged consecutively by date and time');
  //    const date = new Date();
  //    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  //    const currMonth = date.getMonth();
  //    const currYear = date.getFullYear();
  //    let year, mon1, mon2, mon3, day1, day2, day3;
  //    const val = '1.32', val1 = '2.40', val2 = '3.10';
  //    if (currMonth >= 2) {
  //      year = currYear;
  //      mon1 = months[currMonth - 2];
  //      mon2 = months[currMonth - 1];
  //      mon3 = months[currMonth];
  //      day1 = 3;
  //      day2 = 2;
  //      day3 = 1;
  //    } else if (currMonth < 2) {
  //      year = currYear - 1;
  //      mon1 = months[currMonth - 2];
  //      mon2 = months[currMonth - 1];
  //      mon3 = months[currMonth];
  //      day1 = 3;
  //      day2 = 2;
  //      day3 = 1;
  //    }
  //    const dataMap = new Map<string, string>();
  //    setting.navigateTO(jsonData.Department).then(function (navigate) {
  //      expect(navigate).toBe(true);
  //     });
  //     setting.navigateTO(jsonData.EmptyInstrument).then(function (navigate) {
  //       expect(navigate).toBe(true);
  //     });
  //     multiPoint.changeDate(year, mon1, day1).then(function (dateChanged) {
  //       expect(dateChanged).toBe(true);
  //     });
  //     multiPoint.clickManuallyEnterData().then(function(clicked) {
  //       expect(clicked).toBe(true);
  //     });
  //    dataMap.set('11', val);
  //    multiPoint.enterValues(dataMap).then(function (result) {
  //      expect(result).toBe(true);
  //    });
  //    multiPoint.clickSubmitButton().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });
  //    multiPoint.verifyEnteredValueStored(val).then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });
  //    multiPoint.changeDate(year, mon2, day2).then(function (dateChanged) {
  //      expect(dateChanged).toBe(true);
  //    });
  //    dataMap.set('11', val1);
  //    multiPoint.enterValues(dataMap).then(function (result) {
  //      expect(result).toBe(true);
  //    });
  //    multiPoint.clickSubmitButton().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });
  //    multiPoint.verifyEnteredValueStored(val1).then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });
  //    multiPoint.changeDate(year, mon3, day3).then(function (dateChanged) {
  //      expect(dateChanged).toBe(true);
  //    });
  //    dataMap.set('11', val2);
  //    multiPoint.enterValues(dataMap).then(function (result) {
  //      expect(result).toBe(true);
  //    });
  //    multiPoint.clickSubmitButton().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });
  //    multiPoint.verifyEnteredValueStored(val2).then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });
  //  });

