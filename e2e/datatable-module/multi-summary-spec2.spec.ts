/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { SingleSummary } from '../page-objects/single-summary.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Multi-SummaryControlLevelUI.json').then(function(data) {
  jsonData = data;
});

describe('Point Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const newLabSetup = new NewLabSetup();
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const multiSummary = new MultiSummary();
  const pointData = new PointDataEntry();
  const library = new BrowserLibrary();
  const singleSummary = new SingleSummary();
  const setting = new Settings();
  const reagent = '';
  const calibrator = '';
  const reagentFromLabSetup = '';
  const calibratorFromLabSetup = '';
  const newReagent = '26430';
  const newCalibrator = '26430';
  let flagForIEBrowser: boolean;
  const errorMsgforZeroSD = 'SD should be zero';
  const errorSDMsg = 'Enter SD value';
  const errorPoint = 'Enter point value';
  const errorMean = ' Enter mean value';

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
  it('Test case 25: Display of modal when user navigates away from data entry page', function () {
    library.logStep('Test case 31: Verify Data entry text fields will display above the existing data row for Analytes.');
    library.logStep('Test case 25: Display of modal when user navigates away from data entry page');
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.isDataEntrySectionDisplayed().then(function (submit) {
      expect(submit).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '34.4');
    dataEnter.set('12', '0');
    dataEnter.set('13', '1');
    multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
      expect(values).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.verifyNavigateAwayModelUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clickDontSaveData().then(function (dontsave) {
      expect(dontsave).toBe(true);
    });
  });

  // tslint:disable-next-line: max-line-length
  it('Test case 26: Clicking on Dont Save Data button on the modal when user tries to navigate away from data entry page will navigate you to the new location.', function () {
    library.logStep('Test case 26: Clicking on Dont Save Data button on the modal when user tries to navigate away from data entry page will navigate you to the new location.');
    library.logStep('Test case 28: Verify analytes under control are displayed on navigating to control level data entry page..');
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '34.4');
    dataEnter.set('12', '0');
    dataEnter.set('13', '1');
    multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
      expect(values).toBe(true);
    });
    setting.clickOnEditThisControlLink().then(function (clickEdit) {
      expect(clickEdit).toBe(true);
    });
    multiSummary.verifyNavigateAwayModelUI().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clickDontSaveData().then(function (dontsave) {
      expect(dontsave).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (returnData) {
      expect(returnData).toBe(true);
    });
    multiSummary.isNoDataDisplayed(jsonData.AnalyteName1).then(function (disp1) {
      expect(disp1).toBe(true);
    });
    multiSummary.isNoDataDisplayed(jsonData.AnalyteName2).then(function (disp2) {
      expect(disp2).toBe(true);
    });
    multiSummary.isNoDataDisplayed(jsonData.AnalyteName3).then(function (disp3) {
      expect(disp3).toBe(true);
    });
    multiSummary.isNoDataDisplayed(jsonData.AnalyteName4).then(function (disp4) {
      expect(disp4).toBe(true);
    });
    multiSummary.isNoDataDisplayed(jsonData.AnalyteName5).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

it('Test case 8:  Mean, SD, Points, Level Verification.', function () {
  newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiSummary.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataEnter = new Map<string, string>();
  dataEnter.set('11', '34.4');
  dataEnter.set('12', '');
  dataEnter.set('13', '');
  multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
    expect(values).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (valuesSD) {
    expect(valuesSD).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (valuesPoint) {
    expect(valuesPoint).toBe(true);
  });
  dataEnter.clear();
  dataEnter.set('11', '34.4');
  dataEnter.set('12', '0.01');
  dataEnter.set('13', '');
  multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
    expect(values).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (valuesPoint) {
    expect(valuesPoint).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
  dataEnter.clear();
  dataEnter.set('11', '34.4');
  dataEnter.set('12', '');
  dataEnter.set('13', '10');
  multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
    expect(values).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (valuesSD) {
    expect(valuesSD).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
  dataEnter.clear();
  dataEnter.set('11', '');
  dataEnter.set('12', '0.01');
  dataEnter.set('13', '');
  multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
    expect(values).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (valuesMean) {
    expect(valuesMean).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (valuesPoint) {
    expect(valuesPoint).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
  dataEnter.clear();
  dataEnter.set('11', '');
  dataEnter.set('12', '0.01');
  dataEnter.set('13', '10');
  multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
    expect(values).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (valuesMean) {
    expect(valuesMean).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
  dataEnter.clear();
  dataEnter.set('11', '');
  dataEnter.set('12', '');
  dataEnter.set('13', '10');
  multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
    expect(values).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (valuesMean) {
    expect(valuesMean).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (valuesSD) {
    expect(valuesSD).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
});

it('Test case 19:   Level Entry: For a level, errors should only be shown when user moves to next level using the tab key.', function () {
  library.logStep('Test case 19:Level Entry: For a level, errors should only be shown when user moves to next level using the tab key.');
  // tslint:disable-next-line: max-line-length
  library.logStep('Test case 21:Level Entry: For a level, if user inputs one field and moves to next level, errors should be displayed for empty field for that level using the tab key.');
  newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiSummary.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataEnter = new Map<string, string>();
  dataEnter.set('101', '34.4');
  dataEnter.set('102', '0.02');
  dataEnter.set('103', '');
  multiSummary.selectLevelEntry().then(function (selected) {
    expect(selected).toBe(true);
  });

  const tabFocusedElement1 = new Map<string, string>();
  tabFocusedElement1.set('101', '102');
  tabFocusedElement1.set('102', '103');
  tabFocusedElement1.set('103', '104');

  multiSummary.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
    expect(result).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
  dataEnter.clear();
  dataEnter.set('101', '');
  dataEnter.set('102', '0.02');
  dataEnter.set('103', '');
  multiSummary.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
    expect(result).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (valMean) {
    expect(valMean).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (valPoint) {
    expect(valPoint).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
});

it('Test case 20:  Run Entry: For a level, errors should only be shown when user moves to next level using the tab key.', function () {

  library.logStep('Test case 20:  Run Entry: For a level, errors should only be shown when user moves to next level using the tab key.');
  // tslint:disable-next-line: max-line-length
  library.logStep('Test case 22:Run Entry: For a level, if user inputs one field and moves to next level, Errors should be displayed for empty field for that level.'); newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate1) {
      expect(navigate1).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate1) {
      expect(navigate1).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate1) {
      expect(navigate1).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '34.4');
    dataEnter.set('12', '');
    dataEnter.set('13', '10');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '12');
    tabFocusedElement1.set('12', '13');
    tabFocusedElement1.set('13', '14');

    multiSummary.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
    dataEnter.clear();
    dataEnter.set('11', '');
    dataEnter.set('12', '0.02');
    dataEnter.set('13', '');
    multiSummary.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (valMean) {
      expect(valMean).toBe(true);
    });
    multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (valPoint) {
      expect(valPoint).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });


  it('Test case 2: Run Entry Input Data Verification Using Tab Key (Multi Summary);', function () {
    library.logStep('Test case 10: Cancel button Verify when no data has been entered');
    library.logStep('Test case 37: Verify  Cancel  button functionality.');
    library.logStep('Test case 18:On Cancel : Should clear the values from the input fields.');
    library.logStep('Test case 37:Verify  Cancel  button functionality.');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const mapElement = new Map<string, string>();
    mapElement.set('11', '12');
    mapElement.set('12', '13');
    mapElement.set('13', '14');
    mapElement.set('14', '15');
    mapElement.set('15', '16');
    mapElement.set('16', '21');
    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '12');
    tabFocusedElement1.set('12', '13');
    tabFocusedElement1.set('13', '14');
    tabFocusedElement1.set('14', '15');
    tabFocusedElement1.set('15', '16');
    tabFocusedElement1.set('16', '21');
    multiSummary.verifyRunEntry(mapElement, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });


  it('Test case 3: Level Entry Input Data Verification Using the Tab Key (Muti Summary);', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '12');
    tabFocusedElement1.set('12', '13');
    tabFocusedElement1.set('13', '21');
    tabFocusedElement1.set('21', '22');
    tabFocusedElement1.set('22', '23');
    const mapElement = new Map<string, string>();
    mapElement.set('11', '12');
    mapElement.set('12', '13');
    mapElement.set('13', '21');
    mapElement.set('21', '22');
    mapElement.set('22', '23');
    multiSummary.verifyLevelEntry(mapElement, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });
});

it('Test case 5: Mean Value Verification', function () {
  const mean = '34.96', sd = '0.03', point = '6';
  library.logStep('Test case 4: Configuration set up verification');
  library.logStep('Test case 5: Mean Value Verification');
  newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.ProductName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiSummary.verifyNoOfLevels(jsonData.AnalyteLevels).then(function (checked) {
    expect(checked).toBe(true);
  });
  multiSummary.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataMap = new Map<string, string>();
  dataMap.set('11', '-.');
  dataMap.set('12', sd);
  dataMap.set('13', point);
  multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
    expect(disabled).toBe(true);
  });
  multiSummary.clearValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  dataMap.set('11', 'abc!@#$%^&*();_+:{}":<>');
  dataMap.set('12', sd);
  dataMap.set('13', point);
  multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiSummary.verifyMeanCharType('abc!@#$%^&*();_+:{}":<>').then(function (status) {
    expect(status).toBe(true);
  });
  multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
    expect(disabled).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (result) {
    expect(result).toBe(true);
  });
});

it('Test case 6: SD Value Verification', function () {
  library.logStep('Test case 14:Verify the Submit This Page Data button Enables and Disables properly.');
  const mean = '2', sd = '4', point = '6';
  newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.ProductName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiSummary.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataMap = new Map<string, string>();
  dataMap.set('11', mean);
  dataMap.set('12', '-');
  dataMap.set('13', point);
  multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
    expect(disabled).toBe(true);
  });
  multiSummary.clearValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  dataMap.set('11', mean);
  dataMap.set('12', 'abc!@#$%^&*();_+:{}":<>');
  dataMap.set('13', point);
  multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiSummary.verifySDCharType('abc!@#$%^&*();_+:{}":<>').then(function (status) {
    expect(status).toBe(true);
  });
  multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
    expect(disabled).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (clicked) {
    expect(clicked).toBe(true);
  });
});

it('Test case 7: Point Value Verification', function () {
  library.logStep('Test case 23: For a level, if user inputs Points = 1, then sd should be zero, else error should display.');
  library.logStep('Test case 24: For a level, user should NOT be able to enter <=0 & decimal values for numPoints field.');
  library.logStep('Test case 18:On Cancel : Should clear the values from the input fields.');
  const mean = '4.6', sd = '0.4', point = '-';
  newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.ProductName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiSummary.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  const dataMap = new Map<string, string>();
  dataMap.set('11', mean);
  dataMap.set('12', sd);
  dataMap.set('13', '-');
  multiSummary.enterMeanSDPointValues(dataMap).then(function (result1) {
    expect(result1).toBe(true);
  });
  multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
    expect(disabled).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  dataMap.set('11', mean);
  dataMap.set('12', sd);
  dataMap.set('13', '1234567890123412');
  multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
    expect(result).toBe(true);
  });
  multiSummary.verifyMaxLength('1234567890123412', '16').then(function (status) {
    expect(status).toBe(true);
  });
  multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
    expect(disabled).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  dataMap.set('11', '36.8');
  dataMap.set('12', '4.65');
  dataMap.set('13', '1');
  dataMap.set('14', 'protractor.Key.TAB');

  multiSummary.enterMeanSDPointValues(dataMap).then(function (dataEntered) {
    expect(dataEntered).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(jsonData.errorMsgforZeroSD).then(function (errordisplayed) {
    expect(errordisplayed).toBe(true);
  });
  multiSummary.verifySubmitButtonDisabled().then(function (submitDisabled) {
    expect(submitDisabled).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
  dataMap.set('11', '56.6');
  dataMap.set('12', '0.36');
  dataMap.set('13', '0');
  dataMap.set('14', 'protractor.Key.TAB');
  multiSummary.enterMeanSDPointValues(dataMap).then(function (dataEntered) {
    expect(dataEntered).toBe(true);
  });
  multiSummary.verifyErrorMsgDisplayed(jsonData.errorPoint).then(function (errordisplayed) {
    expect(errordisplayed).toBe(true);
  });
  multiSummary.verifySubmitButtonDisabled().then(function (submitDisabled) {
    expect(submitDisabled).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
});



it('Test case 4: Run Entry Input Data Verification Using Enter Key (Multi Summary)', function () {
  newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
    expect(navigate).toBe(true);
  });
  multiSummary.clickManuallyEnterData().then(function (clicked) {
    expect(clicked).toBe(true);
  });
  multiSummary.selectRunEntry().then(function (selected) {
    expect(selected).toBe(true);
  });
  const tabFocusedElement1 = new Map<string, string>();
  tabFocusedElement1.set('11', '12');
  tabFocusedElement1.set('12', '13');
  tabFocusedElement1.set('13', '21');
  tabFocusedElement1.set('21', '22');
  tabFocusedElement1.set('22', '23');

  const mapEntry1 = new Map<string, string>();
  mapEntry1.set('11', '12');
  mapEntry1.set('12', '13');
  mapEntry1.set('13', '21');
  mapEntry1.set('21', '22');
  mapEntry1.set('22', '23');

  multiSummary.verifyRunEntryEnter(mapEntry1, tabFocusedElement1).then(function (result) {
    expect(result).toBe(true);
  });
  multiSummary.clickCancelBtn().then(function (cancel) {
    expect(cancel).toBe(true);
  });
});

});
