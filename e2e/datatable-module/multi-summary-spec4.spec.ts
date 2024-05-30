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
library.parseJson('./JSON_data/Multi-SummaryInstrumentLevelUI.json').then(function(data) {
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
  // it('Test case 32: Verify Values displayed for analyte having no data Instrument level.', function () {
  //   console.log('Test case 16:  Verify Instrument based multi data entry page if analyte has no existing data.');
  //   console.log('Test case 32: Verify Values displayed for analyte having no data Control level.');
  //   console.log('Test case 16: Verify Control based multi data entry page if analyte has no existing data.');
  //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiSummary.isNoDataDisplayed(jsonData.AnalyteName1).then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiSummary.isNoDataDisplayed(jsonData.AnalyteName1).then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  // });
  // tslint:disable-next-line: max-line-length
  // it('Test case 24: Instrument based on Clicking on Dont Save Data button on the modal when user tries to navigate away from data entry page will navigate you to the new location.', function () {
  //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiSummary.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   const dataEnter = new Map<string, string>();
  //   dataEnter.set('11', '34.4');
  //   dataEnter.set('12', '0');
  //   dataEnter.set('13', '1');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   setting.clickOnEditThisInstrumentLink().then(function (clickEdit) {
  //     expect(clickEdit).toBe(true);
  //   });
  //   multiSummary.verifyNavigateAwayModelUI().then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiSummary.clickDontSaveData().then(function (dontsave) {
  //     expect(dontsave).toBe(true);
  //   });
  //   setting.clickReturnToDataLink().then(function (returnData) {
  //     expect(returnData).toBe(true);
  //   });
  //   multiSummary.isNoDataDisplayed(jsonData.AnalyteName1).then(function (disp1) {
  //     expect(disp1).toBe(true);
  //   });
  //   multiSummary.isNoDataDisplayed(jsonData.AnalyteName2).then(function (disp2) {
  //     expect(disp2).toBe(true);
  //   });
  //   multiSummary.isNoDataDisplayed(jsonData.AnalyteName3).then(function (disp3) {
  //     expect(disp3).toBe(true);
  //   });
  //   multiSummary.isNoDataDisplayed(jsonData.AnalyteName4).then(function (disp4) {
  //     expect(disp4).toBe(true);
  //   });
  //   multiSummary.isNoDataDisplayed(jsonData.AnalyteName5).then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  // });
  // it('Test case 19: Verify Instrument based multi data entry page on sorting analyte by name', function () {
  //   console.log('Test case 19: Verify Instrument based multi data entry page on sorting analyte by name');
  //   console.log('Test case 15: Verify Control based multi summary page on sorting analyte by name');
  //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   const expectedarr = [];
  //   expectedarr.push('Multiqual 1,2,3-45830 Albumin');
  //   expectedarr.push('Multiqual 1,2,3-45830 Alkaline Phosphatase');
  //   expectedarr.push('Multiqual 1,2,3-45830 ALT(ALAT/GPT)');
  //   expectedarr.push('Multiqual 1,2,3-45830 Amylase');
  //   expectedarr.push('Multiqual 1,2,3-45830 Apolipoprotein A-I');

  //   multiSummary.verifyAnalytesSortedOnMultiEntry(expectedarr).then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   const expectedarr1 = [];
  //   expectedarr1.push('Multiqual 1,2,3-45830 Albumin');
  //   expectedarr1.push('Multiqual 1,2,3-45830 Alkaline Phosphatase');
  //   expectedarr1.push('Multiqual 1,2,3-45830 ALT(ALAT/GPT)');
  //   expectedarr1.push('Multiqual 1,2,3-45830 Amylase');
  //   expectedarr1.push('Multiqual 1,2,3-45830 Apolipoprotein A-I');

  //   multiSummary.verifyAnalytesSortedOnMultiEntry(expectedarr1).then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  // });


  // it('Test case 8:  Mean, SD, Points, Level Verification Instrument level.', function () {
  //   newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiSummary.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   const dataEnter = new Map<string, string>();
  //   dataEnter.set('11', '34.4');
  //   dataEnter.set('12', '');
  //   dataEnter.set('13', '');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (valuesSD) {
  //     expect(valuesSD).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (valuesPoint) {
  //     expect(valuesPoint).toBe(true);
  //   });
  //   dataEnter.clear();
  //   dataEnter.set('11', '34.4');
  //   dataEnter.set('12', '0.01');
  //   dataEnter.set('13', '');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (valuesPoint) {
  //     expect(valuesPoint).toBe(true);
  //   });
  //   multiSummary.clickCancelBtn().then(function (cancel) {
  //     expect(cancel).toBe(true);
  //   });
  //   dataEnter.clear();
  //   dataEnter.set('11', '34.4');
  //   dataEnter.set('12', '');
  //   dataEnter.set('13', '10');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (valuesSD) {
  //     expect(valuesSD).toBe(true);
  //   });
  //   multiSummary.clickCancelBtn().then(function (cancel) {
  //     expect(cancel).toBe(true);
  //   });
  //   dataEnter.clear();
  //   dataEnter.set('11', '');
  //   dataEnter.set('12', '0.01');
  //   dataEnter.set('13', '');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (valuesMean) {
  //     expect(valuesMean).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorPoint).then(function (valuesPoint) {
  //     expect(valuesPoint).toBe(true);
  //   });
  //   multiSummary.clickCancelBtn().then(function (cancel) {
  //     expect(cancel).toBe(true);
  //   });
  //   dataEnter.clear();
  //   dataEnter.set('11', '');
  //   dataEnter.set('12', '0.01');
  //   dataEnter.set('13', '10');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (valuesMean) {
  //     expect(valuesMean).toBe(true);
  //   });
  //   multiSummary.clickCancelBtn().then(function (cancel) {
  //     expect(cancel).toBe(true);
  //   });
  //   dataEnter.clear();
  //   dataEnter.set('11', '');
  //   dataEnter.set('12', '');
  //   dataEnter.set('13', '10');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorMean).then(function (valuesMean) {
  //     expect(valuesMean).toBe(true);
  //   });
  //   multiSummary.verifyErrorMsgDisplayed(errorSDMsg).then(function (valuesSD) {
  //     expect(valuesSD).toBe(true);
  //   });
  //   multiSummary.clickCancelBtn().then(function (cancel) {
  //     expect(cancel).toBe(true);
  //   });
  // });

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
       multiSummary.verifyNextButtonClicked().then(function (next) {
      expect(next).toBe(true);
    });
    multiSummary.verifyPreviousButtonClicked().then(function (previous) {
      expect(previous).toBe(true);
    });
    const pageno2 = '3';
    multiSummary.goToPage(pageno2).then(function (page2) {
      expect(page2).toBe(true);
    });
  });


    // it('Test case 16: Run Entry Input Data Verification Using Enter Key (Multi Summary)', function () {
    //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   multiSummary.clickManuallyEnterData().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   multiSummary.selectRunEntry().then(function (selected) {
    //     expect(selected).toBe(true);
    //   });
    //   const tabFocusedElement1 = new Map<string, string>();
    //   tabFocusedElement1.set('11', '12');
    //   tabFocusedElement1.set('12', '13');
    //   tabFocusedElement1.set('13', '21');
    //   tabFocusedElement1.set('21', '22');
    //   tabFocusedElement1.set('22', '23');
    //   tabFocusedElement1.set('14', '15');
    //   const mapEntry1 = new Map<string, string>();
    //   mapEntry1.set('11', '12');
    //   mapEntry1.set('12', '13');
    //   mapEntry1.set('13', '21');
    //   mapEntry1.set('21', '22');
    //   mapEntry1.set('22', '23');

    //   multiSummary.verifyRunEntryEnter(mapEntry1, tabFocusedElement1).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    //   multiSummary.clickCancelBtn().then(function (cancel) {
    //     expect(cancel).toBe(true);
    //   });
    // });

    // it('Test case 17:  Level Entry Input Data Verification Using the Enter Key (Muti Summary)', function () {
    //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   multiSummary.clickManuallyEnterData().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   multiSummary.selectLevelEntry().then(function (selected) {
    //     expect(selected).toBe(true);
    //   });

    //   const tabFocusedElement1 = new Map<string, string>();
    //   tabFocusedElement1.set('1001', '1002');
    //   tabFocusedElement1.set('1002', '1003');
    //   tabFocusedElement1.set('1003', '1004');
    //   tabFocusedElement1.set('1004', '1005');
    //   tabFocusedElement1.set('1005', '1006');
    //   const dataEntry1 = new Map<string, string>();
    //   dataEntry1.set('1001', '1002');
    //   dataEntry1.set('1002', '1003');
    //   dataEntry1.set('1003', '1004');
    //   dataEntry1.set('1004', '1005');
    //   dataEntry1.set('1005', '1006');


    //   multiSummary.verifyLevelEntryEnterKey(dataEntry1, tabFocusedElement1).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    //   multiSummary.clickCancelBtn().then(function (cancel) {
    //     expect(cancel).toBe(true);
    //   });
    // });

    // it('Test case 2: Run Entry Input Data Verification Using Tab Key (Multi Summary);', function () {
    //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   multiSummary.clickManuallyEnterData().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   const tabFocusedElement1 = new Map<string, string>();
    //   tabFocusedElement1.set('11', '12');
    //   tabFocusedElement1.set('12', '13');
    //   tabFocusedElement1.set('13', '21');
    //   tabFocusedElement1.set('21', '22');
    //   tabFocusedElement1.set('22', '23');

    //   const mapEntry1 = new Map<string, string>();
    //   mapEntry1.set('11', '12');
    //   mapEntry1.set('12', '13');
    //   mapEntry1.set('13', '21');
    //   mapEntry1.set('21', '22');
    //   mapEntry1.set('22', '23');



    //   multiSummary.verifyRunEntry(mapEntry1, tabFocusedElement1).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    //   multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
    //     expect(disabled).toBe(true);
    //   });
    //   multiSummary.clickCancelBtn().then(function (cancel) {
    //     expect(cancel).toBe(true);
    //   });
    // });


    // it('Test case 3: Level Entry Input Data Verification Using the Tab Key (Muti Summary);', function () {
    //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   multiSummary.clickManuallyEnterData().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   multiSummary.selectLevelEntry().then(function (selected) {
    //     expect(selected).toBe(true);
    //   });

    //   const tabFocusedElement1 = new Map<string, string>();
    //   tabFocusedElement1.set('1001', '1002');
    //   tabFocusedElement1.set('1002', '1003');
    //   tabFocusedElement1.set('1003', '1004');
    //   tabFocusedElement1.set('1004', '1005');
    //   tabFocusedElement1.set('1005', '1006');

    //   const mapEntry1 = new Map<string, string>();
    //   mapEntry1.set('1001', '1002');
    //   mapEntry1.set('1002', '1003');
    //   mapEntry1.set('1003', '1004');
    //   mapEntry1.set('1004', '1005');
    //   mapEntry1.set('1005', '1006');

    //   multiSummary.verifyLevelEntry(mapEntry1, tabFocusedElement1).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    //   multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
    //     expect(disabled).toBe(true);
    //   });
    //   multiSummary.clickCancelBtn().then(function (cancel) {
    //     expect(cancel).toBe(true);
    //   });
    // });

    // it('Test case 5:  Level Entry Input Data Verification Using the Enter Key (Muti Summary)', function () {
    //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   multiSummary.clickManuallyEnterData().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   multiSummary.selectLevelEntry().then(function (selected) {
    //     expect(selected).toBe(true);
    //   });

    //   const tabFocusedElement1 = new Map<string, string>();
    //   tabFocusedElement1.set('1001', '1002');
    //   tabFocusedElement1.set('1002', '1003');
    //   tabFocusedElement1.set('1003', '1004');
    //   tabFocusedElement1.set('1004', '1005');
    //   tabFocusedElement1.set('1005', '1006');

    //   const mapEntry1 = new Map<string, string>();
    //   mapEntry1.set('1001', '1002');
    //   mapEntry1.set('1002', '1003');
    //   mapEntry1.set('1003', '1004');
    //   mapEntry1.set('1004', '1005');
    //   mapEntry1.set('1005', '1006');


    //   multiSummary.verifyLevelEntryEnterKey(mapEntry1, tabFocusedElement1).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    //   multiSummary.clickCancelBtn().then(function (cancel) {
    //     expect(cancel).toBe(true);
    //   });
    // });


    // it('Test case 7: Mean Value Verification', function () {
    //   library.logStep('Test case 10:Mean, SD, Points, Level Verification')
    //   const mean = '34.96', sd = '0.03', point = '17';
    //   newLabSetup.navigateTO(jsonData.DepartmentName).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   newLabSetup.navigateTO(jsonData.InstrumentName).then(function (navigate) {
    //     expect(navigate).toBe(true);
    //   });
    //   multiSummary.clickManuallyEnterData().then(function (clicked) {
    //     expect(clicked).toBe(true);
    //   });
    //   const dataMap = new Map<string, string>();
    //   dataMap.set('11', '-.');
    //   dataMap.set('12', sd);
    //   dataMap.set('13', point);
    //   multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    //   multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
    //     expect(disabled).toBe(true);
    //   });
    //   multiSummary.clearValues(dataMap).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    //   dataMap.set('11', 'abc!@#$%^&*();_+:{}":<>');
    //   dataMap.set('12', sd);
    //   dataMap.set('13', point);
    //   multiSummary.enterMeanSDPointValues(dataMap).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    //   multiSummary.verifyMeanCharType('abc!@#$%^&*();_+:{}":<>').then(function (status) {
    //     expect(status).toBe(true);
    //   });
    //   multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
    //     expect(disabled).toBe(true);
    //   });
    //   multiSummary.clearValues(dataMap).then(function (result) {
    //     expect(result).toBe(true);
    //   });
    // });

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
});
