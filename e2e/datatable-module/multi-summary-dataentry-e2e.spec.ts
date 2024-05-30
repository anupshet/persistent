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
library.parseJson('./JSON_data/Multi-Summary.json').then(function(data) {
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

  it('Test case 32: Verify Values displayed for analyte having no data Instrument level.', function () {
    console.log('Test case 16:  Verify Instrument based multi data entry page if analyte has no existing data.');
    console.log('Test case 32: Verify Values displayed for analyte having no data Control level.');
    console.log('Test case 16: Verify Control based multi data entry page if analyte has no existing data.');
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.isNoDataDisplayed(jsonData.AnalyteName1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.isNoDataDisplayed(jsonData.AnalyteName1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
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

  it('Test case 24: Instrument based on Clicking on Dont Save Data button on the modal when user tries to navigate away from data entry page will navigate you to the new location.', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
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
    setting.clickOnEditThisInstrumentLink().then(function (clickEdit) {
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
  });

  it('Test case 19: Verify Instrument based multi data entry page on sorting analyte by name', function () {
    console.log('Test case 19: Verify Instrument based multi data entry page on sorting analyte by name');
    console.log('Test case 15: Verify Control based multi summary page on sorting analyte by name');
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const expectedarr = [];
    expectedarr.push('Multiqual 1,2,3-45830 Albumin');
    expectedarr.push('Multiqual 1,2,3-45830 Alkaline Phosphatase');
    expectedarr.push('Multiqual 1,2,3-45830 ALT(ALAT/GPT)');
    expectedarr.push('Multiqual 1,2,3-45830 Amylase');
    expectedarr.push('Multiqual 1,2,3-45830 Apolipoprotein A-I');

    multiSummary.verifyAnalytesSortedOnMultiEntry(expectedarr).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const expectedarr1 = [];
    expectedarr1.push('Multiqual 1,2,3-45830 Albumin');
    expectedarr1.push('Multiqual 1,2,3-45830 Alkaline Phosphatase');
    expectedarr1.push('Multiqual 1,2,3-45830 ALT(ALAT/GPT)');
    expectedarr1.push('Multiqual 1,2,3-45830 Amylase');
    expectedarr1.push('Multiqual 1,2,3-45830 Apolipoprotein A-I');

    multiSummary.verifyAnalytesSortedOnMultiEntry(expectedarr1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 35:  Users can change date and time prior to entering data for all the analyes.', function () {
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

    multiSummary.verifyEnteredValueStored('46.70', '0.76', '27', '1').then(function (displayed) {
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
    multiSummary.verifyEnteredValueStored('34.40', '0.00', '1', '1').then(function (result) {
      expect(result).toBe(true);
    });
  });

  it('Test case 27: Instrument level on Clicking on the Save Data and Leave Page on the modal when user tries to navigate away from data entry page will save the data', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '54.4');
    dataEnter.set('12', '0.5');
    dataEnter.set('13', '10');
    multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
      expect(values).toBe(true);
    });
    setting.clickOnEditThisInstrumentLink().then(function (clickEdit) {
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
    multiSummary.verifyEnteredValueStored('54.40', '0.50', '10', '1').then(function (result) {
      expect(result).toBe(true);
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
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 19:   Level Entry: For a level, errors should only be shown when user moves to next level using the tab key.', function () {
    library.logStep('Test case 19:Level Entry: For a level, errors should only be shown when user moves to next level using the tab key.');
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
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 20:  Run Entry: For a level, errors should only be shown when user moves to next level using the tab key.', function () {

    library.logStep('Test case 20:  Run Entry: For a level, errors should only be shown when user moves to next level using the tab key.');
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
      multiSummary.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
    });
  });



  // *************** Instrument Level ****************

  it('Test case 8:  Mean, SD, Points, Level Verification Instrument level.', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
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
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test case 21: Verify pagination for more than 25 analytes Instrument level', function () {
    library.logStep('Test case 21: Verify pagination for more than 25 analytes Instrument level');
    library.logStep('Test case 22: "Verify pagination buttons will be presented on the bottom of the page after 25th Analyte.');
    library.logStep('Test case 23:  Verify pagination for more than 100 analytes.');
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
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
  });

  it('Test case 24: Verify if user clicks on a number to go to a different page without saving, the user will be presented with the pop up  message.', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '54.4');
    dataEnter.set('12', '0');
    dataEnter.set('13', '10');
    multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
      expect(values).toBe(true);
    });
    multiSummary.isPaginationDisplayed().then(function (result) {
      expect(result).toBe(true);
    });
    const pageno = '2';
    multiSummary.goToPage(pageno).then(function (page) {
      expect(page).toBe(true);
    });
    multiSummary.clickSaveData().then(function (save) {
      expect(save).toBe(true);
    });
    multiSummary.goToPage('1').then(function (page) {
      expect(page).toBe(true);
    });
    multiSummary.verifyEnteredValueStored('54.40', '0.00', '10', '1').then(function (result) {
      expect(result).toBe(true);
    });

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
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
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
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
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
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
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
    multiSummary.clickManuallyEnterData().then(function (clicked) {
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

  it('Test case 16: Run Entry Input Data Verification Using Enter Key (Multi Summary)', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
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
    tabFocusedElement1.set('14', '15');
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

  it('Test case 17:  Level Entry Input Data Verification Using the Enter Key (Muti Summary)', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('1001', '1002');
    tabFocusedElement1.set('1002', '1003');
    tabFocusedElement1.set('1003', '1004');
    tabFocusedElement1.set('1004', '1005');
    tabFocusedElement1.set('1005', '1006');
    const dataEntry1 = new Map<string, string>();
    dataEntry1.set('1001', '1002');
    dataEntry1.set('1002', '1003');
    dataEntry1.set('1003', '1004');
    dataEntry1.set('1004', '1005');
    dataEntry1.set('1005', '1006');


    multiSummary.verifyLevelEntryEnterKey(dataEntry1, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });



  // --------------------------------------Instrument level test cases--------------------------------------------------------

  it('Test case 1: Rows of test data are arranged consecutively by date and time', function () {
    library.logStep('Test case 18:Verify Instrument based multi data entry page if data already exists for analyte');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
      expect(dept).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
      expect(inst).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
      expect(prod).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName).then(function (analyte) {
      expect(analyte).toBe(true);
    });
    singleSummary.clickManuallyEnterData().then(function (manually) {
      expect(manually).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('11', '2.46');
    dataMap.set('12', '0.06');
    dataMap.set('13', '10');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      console.log('inside submit');
      expect(disabled).toBe(true);
    });
    dataMap.set('11', '6.7');
    dataMap.set('12', '0.9');
    dataMap.set('13', '5');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      console.log('inside submit');
      expect(disabled).toBe(true);
    });
    multiSummary.clickBackArrow().then(function (back) {
      expect(back).toBe(true);
    });
    multiSummary.clickBackArrow().then(function (back) {
      expect(back).toBe(true);
    });
    multiSummary.verifyLatestDataDisplayed(6.7, 0.9, 5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test case 2: Run Entry Input Data Verification Using Tab Key (Multi Summary);', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
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



    multiSummary.verifyRunEntry(mapEntry1, tabFocusedElement1).then(function (result) {
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
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('1001', '1002');
    tabFocusedElement1.set('1002', '1003');
    tabFocusedElement1.set('1003', '1004');
    tabFocusedElement1.set('1004', '1005');
    tabFocusedElement1.set('1005', '1006');

    const mapEntry1 = new Map<string, string>();
    mapEntry1.set('1001', '1002');
    mapEntry1.set('1002', '1003');
    mapEntry1.set('1003', '1004');
    mapEntry1.set('1004', '1005');
    mapEntry1.set('1005', '1006');

    multiSummary.verifyLevelEntry(mapEntry1, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
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

  it('Test case 5:  Level Entry Input Data Verification Using the Enter Key (Muti Summary)', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.selectLevelEntry().then(function (selected) {
      expect(selected).toBe(true);
    });

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('1001', '1002');
    tabFocusedElement1.set('1002', '1003');
    tabFocusedElement1.set('1003', '1004');
    tabFocusedElement1.set('1004', '1005');
    tabFocusedElement1.set('1005', '1006');

    const mapEntry1 = new Map<string, string>();
    mapEntry1.set('1001', '1002');
    mapEntry1.set('1002', '1003');
    mapEntry1.set('1003', '1004');
    mapEntry1.set('1004', '1005');
    mapEntry1.set('1005', '1006');


    multiSummary.verifyLevelEntryEnterKey(mapEntry1, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 6: Configuration set up verification', function () {
    library.logStep('Test case 18:Verify Instrument based multi data entry page data on level setting changed');
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.verifyNoOfLevels(jsonData.AnalyteLevels).then(function (checked) {
      expect(checked).toBe(true);
    });

    const dataMap = new Map<string, string>();
    dataMap.set('11', '30.9867');
    dataMap.set('12', '14.897');
    dataMap.set('13', '10');
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);

    });
    multiSummary.enterMeanSDPointValues(dataMap).then(function (entered) {
      expect(entered).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.verifyEnteredValueStored('30.99', '14.90', '10', '1').then(function (result) {
      expect(result).toBe(true);
    });
  });

  it('Test case 7: Mean Value Verification', function () {
    library.logStep('Test case 10:Mean, SD, Points, Level Verification');
    const mean = '34.96', sd = '0.03', point = '17';
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
      expect(navigate).toBe(true);
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
    multiSummary.clearValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
  });

  it('Test case 8: SD Value Verification', function () {
    library.logStep('Test case 10:Mean, SD, Points, Level Verification');
    const mean = '2', sd = '4', point = '6';
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
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

  it('Test case 9: Point Value Verification', function () {
    library.logStep('Test case 10:Mean, SD, Points, Level Verification');
    library.logStep('Test case 12: Verify cancel button functionality');
    library.logStep('Test case 16:Verify the Submit This Page Data button Enables and Disables properly.');
    const mean = '4.6', sd = '0.4', point = '-';
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
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


  it('Test case 15: Verify the comment Pez count is increased and ' +
  'content are correctly displayed in Analyte Summary View page.', function () {
    library.logStep('Test case 14: Verify the comment is displayed correctly in Analyte Summary View page');
    library.logStep('Test case 20:Verify Instrument based multi data entry page data on level setting changed');
    const mean = '3', sd = '6', point = '9';
    newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
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

  it('Test case:Verify on entering daya at control level data ' +
  'displayed correctly on all Instrument, Control and Analyte level', function () {
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

  it('Test case:Verify on entering daya at Instrument level data displayed ' +
  'correctly on all Instrument, Control and Analyte level', function () {
    newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = months[date.getMonth() - 1];
    const yyyy = date.getFullYear();
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('11', '22.46');
    dataMap.set('12', '0.06');
    dataMap.set('13', '210');
    multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.verifyLatestDataDisplayed('22.46', '0.06', '210').then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiSummary.verifyMonthMultiEntry(mm).then(function (month) {
      expect(month).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.verifyLatestDataDisplayed('22.46', '0.06', '210').then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiSummary.verifyMonthMultiEntry(mm).then(function (month) {
      expect(month).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (prod) {
      expect(prod).toBe(true);
    });
    multiSummary.verifyEnteredValueStoredTestMonth('22.46', '0.06', '210', mm).then(function (verify) {
      expect(verify).toBe(true);
    });
  });
});




