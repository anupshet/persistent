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
library.parseJson('./JSON_data/Multi-SummaryControlLevelDataEntry.json').then(function(data) {
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
  it('Test case 1: Rows of analyte data are arranged consecutively by date and time', function () {
    library.logStep('Test case 29:Verify recently added data entry displayed on control level data entry page');
    library.logStep('Test case 36:Verify Submit This Page this page button functionality.');
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
    const dataMap = new Map<string, string>();
    dataMap.set('11', '2.46');
    dataMap.set('12', '0.06');
    dataMap.set('13', '10');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    dataMap.set('11', '6.7');
    dataMap.set('12', '0.9');
    dataMap.set('13', '5');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.verifyLatestDataDisplayed(6.7, 0.9, 5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiSummary.clickBack().then(function (clickedBack) {
      expect(clickedBack).toBe(true);
    });
    multiSummary.verifyLatestDataDisplayed(6.7, 0.9, 5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test case 13: Verify the comment Pez count' +
  ' is increased and content are correctly displayed in Analyte Summary View page.', function () {
    library.logStep('Test case 12: Verify the comment is displayed correctly in Analyte Summary View page');
    library.logStep('Test case 14:Verify the Submit This Page Data button Enables and Disables properly.');
    const mean = '3', sd = '6', point = '9';
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
    const data_Map = new Map<string, string>();
    data_Map.set('11', mean);
    data_Map.set('12', sd);
    data_Map.set('13', point);
    multiSummary.enterMeanSDPointValues(data_Map).then(function (result) {
      expect(result).toBe(true);
    });
    singleSummary.hoverTestClick(jsonData.Test13).then(function (hover) {
      expect(hover).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (Visible) {
      expect(Visible).toBe(true);
    });
    singleSummary.addComment('', jsonData.Comment).then(function (addcomment) {
      expect(addcomment).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    singleSummary.verifyEnteredComment(jsonData.Comment).then(function (text) {
      expect(text).toBe(true);
    });
    const cmntCountExpected = '1';
    const cmt = jsonData.Comment1;
    const test = '1';
    const meanNo1 = '2';
    const checkOnlyCount = false;
    multiSummary.verifyCommentAndCount(cmntCountExpected, cmt, test, checkOnlyCount).then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
  });
  it('Test case:Verify on entering daya at control ' +
  'level data displayed correctly on all Instrument, Control and Analyte level', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = months[date.getMonth() - 1];
    const yyyy = date.getFullYear();
    console.log(mm);
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('11', '2.46');
    dataMap.set('12', '0.06');
    dataMap.set('13', '10');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (submit) {
      expect(submit).toBe(true);
    });
    multiSummary.verifyLatestDataDisplayed('2.46', '0.06', '10').then(function (displayed1) {
      expect(displayed1).toBe(true);
    });
    multiSummary.verifyMonthMultiEntry(mm).then(function (month) {
      expect(month).toBe(true);
    });
    multiSummary.clickBack().then(function (clickedBack) {
      expect(clickedBack).toBe(true);
    });
    multiSummary.verifyLatestDataDisplayed('2.46', '0.06', '10').then(function (displayed2) {
      expect(displayed2).toBe(true);
    });
    multiSummary.verifyMonthMultiEntry(mm).then(function (month) {
      expect(month).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (control) {
      expect(control).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (tetst) {
      expect(tetst).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredTestMonth('2.46', '0.06', '10', mm).then(function (verify) {
      expect(verify).toBe(true);
    });
  });
  it('Test case 33: Verify pagination for more than 25 analytes', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.isPaginationDisplayed().then(function (result) {
      expect(result).toBe(true);
    });
    const pageno = '2';
    multiSummary.goToPage(pageno).then(function (page) {
      expect(page).toBe(true);
    });
    multiSummary.verifyNavigatedToPage(pageno).then(function (navigated) {
      expect(navigated).toBe(true);
    });

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
    const date = new Date();
    const yyyy = date.getFullYear();

    const dd3 = '15', mm3 = 'MAY', yyyy1 = yyyy - 1;
    multiSummary.changeDate(yyyy1, mm3, dd3).then(function (dateChanged) {
      expect(dateChanged).toBe(true);
    });

    const dataMap2 = new Map<string, string>();
    dataMap2.set('11', '46.7');
    dataMap2.set('12', '0.76');
    dataMap2.set('13', '27');

    multiSummary.enterMeanSDPointValues(dataMap2).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });


    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiSummary.verifyEnteredValueStoredNew('46.70', '0.76', '27').then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiSummary.verifyMonth('May').then(function (displayedMon) {
      expect(displayedMon).toBe(true);
    });
  });

  it('Test case 27: Clicking on the Save Data and Leave Page on the modal when user tries to navigate away from data entry page will save the data', function () {
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
    multiSummary.clickSaveData().then(function (dontsave) {
      expect(dontsave).toBe(true);
    });
    setting.clickReturnToDataLink().then(function (returnData) {
      expect(returnData).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredNew('34.40', '0.00', '1').then(function (result) {
      expect(result).toBe(true);
    });
  });
});
