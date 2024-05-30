//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { AdvancedLJ } from '../page-objects/advanced-lj-e2e.po';
import { RevisedPointData } from '../page-objects/point-form-revision.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { PointDataEntry } from '../page-objects/point-data-entry-e2e.po';
import { AddAnalyte } from '../page-objects/new-labsetup-analyte-e2e.po';
import { EvalMeanSD } from '../page-objects/EvalMeanSD-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();
library.parseJson('./JSON_data/advancedlj-210198-test.json').then(function (data) {
  jsonData = data;
});

describe('Test Suite: PBI 210198: When Z-score is selected, plot all levels by their z-scores on separate charts', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const labsetup = new NewLabSetup();
  const advancedLj=new AdvancedLJ();
  const analyte=new AddAnalyte();
  const evalMeanSD = new EvalMeanSD();
  const RevisedPointData1=new RevisedPointData();
  const multiSummary= new MultiSummary();
  const pointData=new PointDataEntry();
  let imageName,details;
  const time='October 29, 2021';

  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.Username, jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
      browser.sleep(10000);
      expect(loggedIn).toBe(true);
    });
    advancedLj.setBrowserDateTime(time).then(function (set) {
      expect(set).toBe(true);
  });
  });

  afterEach(function () {
    advancedLj.verifyImageComparison(imageName,details).then(async function (clicked) {
      await expect(clicked).toBe(true);
    });
    out.signOut();
  });

  it('Test Case 1: To verify on selecting z-score option in y-axis dropdown,all level charts are displayed according to the z-score separately.', function () {
    imageName=jsonData.image1;
    details='Separated Stacked chart as per z-score calculation';
    const floatPoint='2';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
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
    labsetup.clickEditThisAnalyte().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.addFloatPointValue(floatPoint).then(function (floatpointAdded) {
      expect(floatpointAdded).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.enterAllPointValues(10,11,12).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.enterAllPointValues(10.1,11.1,12.1).then(function (entered) {
      expect(entered).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    pointData.enterAllPointValues(10.4,11.4,12.4).then(function (entered) {
      expect(entered).toBe(true);
    });
    pointData.clickOnSendToPeerGrpButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectYaxisDropdownValue('Z-score').then(function (selected) {
      expect(selected).toBe(true);
    });
  });
  it('Test Case 2: To verify the mean line is at 0, and that the SD white region is between 0 and +1 and -1, SD yellow region is between 1 and 2 and -1 and -2, and the SD pink region is between 2 and 3 and -2 and -3.', function () {
    imageName=jsonData.image2;
    details='The mean line is at 0, and that the SD white region is between 0 and +1 and -1, SD yellow region is between 1 and 2 and -1 and -2, and the SD pink region is between 2 and 3 and -2 and -3.';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
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
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectYaxisDropdownValue('Z-score').then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  it('Test Case 3: To verify changes in evaluation type of mean , sd and reagent , calibrator lots are also displayed in separated stacked chart. @P1', function () {
    imageName=jsonData.image3;
    details='Changes of  Mean , SD, and Reagent, Calibrator lot changes are displayed in Separated Stacked chart ';
    labsetup.navigateTO(jsonData.Department).then(function (navigated) {
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
    labsetup.clickEditThisAnalyte().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    analyte.selectReagentLot(jsonData.ReagentLot).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.selectCalibratortLot(jsonData.CalibratorLot).then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.clickUpdateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    labsetup.clickEditThisAnalyte().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    evalMeanSD.clickSetValues().then(function (clickedSetValues) {
      expect(clickedSetValues).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('1', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedMeanValue('1', '10').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedSDValue('1', '1.5').then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.selectFixedFloatMeanSD('2', 'Fixed', 'Fixed').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedMeanValue('2', '10').then(function (rdbSelected) {
      expect(rdbSelected).toBe(true);
    });
    evalMeanSD.addFixedSDValue('2', '1').then(function (added) {
      expect(added).toBe(true);
    });
    evalMeanSD.clickUpdate().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.clickReturnToDataLink().then(function (clicked) {
      expect(clicked).toBe(true);
    });
      RevisedPointData1.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    pointData.enterAllPointValues(11,11.4,11.5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    })
    pointData.clickOnSendToPeerGrpButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.clickLJChart().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    advancedLj.selectYaxisDropdownValue('Z-score').then(function (selected) {
      expect(selected).toBe(true);
    });
    advancedLj.clickZoomOut().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });
});
