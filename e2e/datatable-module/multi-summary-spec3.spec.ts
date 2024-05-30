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
library.parseJson('./JSON_data/Multi-SummaryInstrumentLevelDataEntry.json').then(function(data) {
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
  // tslint:disable-next-line: max-line-length
  // it('Test case 27: Instrument level on Clicking on the Save Data and Leave Page on the modal when user tries to navigate away from data entry page will save the data', function () {
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
  //   dataEnter.set('11', '54.4');
  //   dataEnter.set('12', '0.5');
  //   dataEnter.set('13', '10');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   setting.clickOnEditThisInstrumentLink().then(function (clickEdit) {
  //     expect(clickEdit).toBe(true);
  //   });
  //   multiSummary.verifyNavigateAwayModelUI().then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiSummary.clickSaveData().then(function (dontsave) {
  //     expect(dontsave).toBe(true);
  //   });
  //   setting.clickReturnToDataLink().then(function (returnData) {
  //     expect(returnData).toBe(true);
  //   });
  //   multiSummary.verifyEnteredValueStored('54.40', '0.50', '10', '1').then(function (result) {
  //     expect(result).toBe(true);
  //   });
  // });
  // tslint:disable-next-line: max-line-length
  // it('Test case 24: Verify if user clicks on a number to go to a different page without saving, the user will be presented with the pop up  message.', function () {
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
  //   dataEnter.set('11', '54.4');
  //   dataEnter.set('12', '0');
  //   dataEnter.set('13', '10');
  //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //     expect(values).toBe(true);
  //   });
  //   multiSummary.isPaginationDisplayed().then(function (result) {
  //     expect(result).toBe(true);
  //   });
  //   const pageno = '2';
  //   multiSummary.goToPage(pageno).then(function (page) {
  //     expect(page).toBe(true);
  //   });
  //   multiSummary.clickSaveData().then(function (save) {
  //     expect(save).toBe(true);
  //   });
  //   multiSummary.goToPage('1').then(function (page) {
  //     expect(page).toBe(true);
  //   });
  //   multiSummary.verifyEnteredValueStored('54.40', '0.00', '10', '1').then(function (result) {
  //     expect(result).toBe(true);
  //   });

  // });

  //  // it('Test case 20:  Verify that users can submit total 25 runs per page.', function () {
  //   //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
  //   //     expect(navigate).toBe(true);
  //   //   });
  //   //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
  //   //     expect(navigate).toBe(true);
  //   //   });
  //   //   multiSummary.clickManuallyEnterData().then(function (clicked) {
  //   //     expect(clicked).toBe(true);
  //   //   });
  //   //   const dataEnter = new Map<string, string>();
  //   //   dataEnter.set('11', '34.4');
  //   //   dataEnter.set('12', '0');
  //   //   dataEnter.set('13', '1');
  //   //   dataEnter.set('21', '35.4');
  //   //   dataEnter.set('22', '0');
  //   //   dataEnter.set('23', '2');
  //   //   dataEnter.set('31', '36.4');
  //   //   dataEnter.set('32', '0');
  //   //   dataEnter.set('33', '3');
  //   //   dataEnter.set('41', '37.4');
  //   //   dataEnter.set('42', '0');
  //   //   dataEnter.set('43', '4');
  //   //   dataEnter.set('51', '38.4');
  //   //   dataEnter.set('52', '0');
  //   //   dataEnter.set('53', '5');
  //   //   dataEnter.set('61', '39.4');
  //   //   dataEnter.set('62', '0');
  //   //   dataEnter.set('63', '6');
  //   //   dataEnter.set('71', '34.5');
  //   //   dataEnter.set('72', '0');
  //   //   dataEnter.set('73', '7');
  //   //   dataEnter.set('81', '34.6');
  //   //   dataEnter.set('82', '0');
  //   //   dataEnter.set('83', '8');
  //   //   dataEnter.set('91', '34.7');
  //   //   dataEnter.set('92', '0');
  //   //   dataEnter.set('93', '9');
  //   //   dataEnter.set('101', '34.8');
  //   //   dataEnter.set('102', '0');
  //   //   dataEnter.set('103', '10');
  //   //   dataEnter.set('111', '34.9');
  //   //   dataEnter.set('112', '0');
  //   //   dataEnter.set('113', '1');
  //   //   dataEnter.set('121', '35.4');
  //   //   dataEnter.set('122', '0');
  //   //   dataEnter.set('123', '2');
  //   //   dataEnter.set('131', '36.4');
  //   //   dataEnter.set('132', '0');
  //   //   dataEnter.set('133', '1');
  //   //   dataEnter.set('141', '37.4');
  //   //   dataEnter.set('142', '0');
  //   //   dataEnter.set('143', '9');
  //   //   dataEnter.set('151', '38.4');
  //   //   dataEnter.set('152', '0');
  //   //   dataEnter.set('153', '8');
  //   //   dataEnter.set('161', '34.4');
  //   //   dataEnter.set('162', '0');
  //   //   dataEnter.set('163', '7');
  //   //   dataEnter.set('171', '33.4');
  //   //   dataEnter.set('172', '0');
  //   //   dataEnter.set('173', '6');
  //   //   dataEnter.set('181', '32.4');
  //   //   dataEnter.set('182', '0');
  //   //   dataEnter.set('183', '1');
  //   //   dataEnter.set('191', '31.4');
  //   //   dataEnter.set('192', '0');
  //   //   dataEnter.set('193', '5');
  //   //   dataEnter.set('201', '35.4');
  //   //   dataEnter.set('202', '0');
  //   //   dataEnter.set('203', '1');
  //   //   dataEnter.set('211', '36.4');
  //   //   dataEnter.set('212', '0');
  //   //   dataEnter.set('213', '1');
  //   //   dataEnter.set('221', '32.4');
  //   //   dataEnter.set('222', '0');
  //   //   dataEnter.set('223', '3');
  //   //   dataEnter.set('231', '31.4');
  //   //   dataEnter.set('232', '0');
  //   //   dataEnter.set('233', '5');
  //   //   dataEnter.set('241', '40.4');
  //   //   dataEnter.set('242', '0');
  //   //   dataEnter.set('243', '6');
  //   //   dataEnter.set('251', '44.4');
  //   //   dataEnter.set('252', '0');
  //   //   dataEnter.set('253', '11');
  //   //   multiSummary.enterMeanSDPointValues(dataEnter).then(function (values) {
  //   //     expect(values).toBe(true);
  //   //   });
  //   //   multiSummary.clickSubmitButton().then(function (saveData) {
  //   //     expect(saveData).toBe(true);
  //   //   });

  //   //   multiSummary.verifyEnteredValueStored('34.40', '0.00', '1', '1').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('35.40', '0.00', '2', '2').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('36.40', '0.00', '3', '3').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('37.40', '0.00', '4', '4').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('38.40', '0.00', '5', '5').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('39.40', '0.00', '6', '6').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('34.50', '0.00', '7', '7').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('34.60', '0.00', '8', '8').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('34.70', '0.00', '9', '9').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('34.80', '0.00', '10', '10').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('34.90', '0.00', '1', '11').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('35.40', '0.00', '2', '12').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('36.40', '0.00', '1', '13').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('37.40', '0.00', '9', '14').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('38.40', '0.00', '8', '15').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('34.40', '0.00', '7', '16').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('33.40', '0.00', '6', '17').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('32.40', '0.00', '1', '18').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('31.40', '0.00', '5', '19').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('35.40', '0.00', '1', '20').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('36.40', '0.00', '1', '21').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('32.40', '0.00', '3', '22').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('31.40', '0.00', '5', '23').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('40.40', '0.00', '6', '24').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });
  //   //   multiSummary.verifyEnteredValueStored('44.40', '0.00', '11', '25').then(function (result) {
  //   //     expect(result).toBe(true);
  //   //   });

  //   // });

  //   it('Test case 1: Rows of test data are arranged consecutively by date and time', function () {
  //     library.logStep('Test case 18:Verify Instrument based multi data entry page if data already exists for analyte');
  //     newLabSetup.navigateTO(jsonData.DepartmentName).then(function (dept) {
  //       expect(dept).toBe(true);
  //     });
  //     newLabSetup.navigateTO(jsonData.InstrumentName).then(function (inst) {
  //       expect(inst).toBe(true);
  //     });
  //     newLabSetup.navigateTO(jsonData.ProductName).then(function (prod) {
  //       expect(prod).toBe(true);
  //     });
  //     newLabSetup.navigateTO(jsonData.AnalyteName).then(function (analyte) {
  //       expect(analyte).toBe(true);
  //     });
  //     singleSummary.clickManuallyEnterData().then(function (manually) {
  //       expect(manually).toBe(true);
  //     });
  //     var dataMap = new Map<string, string>();
  //     dataMap.set('11', '2.46');
  //     dataMap.set('12', '0.06');
  //     dataMap.set('13', '10');
  //     multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
  //       expect(disabled).toBe(true);
  //     });
  //     multiSummary.clickSubmitButton().then(function (disabled) {
  //       console.log('inside submit');
  //       expect(disabled).toBe(true);
  //     });
  //     dataMap.set('11', '6.7');
  //     dataMap.set('12', '0.9');
  //     dataMap.set('13', '5');
  //     multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
  //       expect(disabled).toBe(true);
  //     });
  //     multiSummary.clickSubmitButton().then(function (disabled) {
  //       console.log('inside submit');
  //       expect(disabled).toBe(true);
  //     });
  //     multiSummary.clickBackArrow().then(function (back) {
  //       expect(back).toBe(true);
  //     });
  //     multiSummary.clickBackArrow().then(function (back) {
  //       expect(back).toBe(true);
  //     });
  //     multiSummary.verifyLatestDataDisplayed(6.7, 0.9, 5).then(function (displayed) {
  //       expect(displayed).toBe(true);
  //     });
  //   });
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

  it('Test case 15: Verify the comment Pez count is increased and' +
  ' content are correctly displayed in Analyte Summary View page.', function () {
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

  // tslint:disable-next-line: max-line-length
  // it('Test case:Verify on entering daya at Instrument level data displayed correctly on all Instrument, Control and Analyte level', function () {
  //   newLabSetup.navigateTO(jsonData.DepartmentName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.InstrumentName1).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   const date = new Date();
  //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   const mm = months[date.getMonth() - 1 ];
  //   const yyyy = date.getFullYear();
  //   multiSummary.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   const dataMap = new Map<string, string>();
  //   dataMap.set('11', '22.46');
  //   dataMap.set('12', '0.06');
  //   dataMap.set('13', '210');
  //   multiSummary.enterMeanSDPointValues(dataMap).then(function (disabled) {
  //     expect(disabled).toBe(true);
  //   });
  //   multiSummary.clickSubmitButton().then(function (disabled) {
  //     expect(disabled).toBe(true);
  //   });
  //   multiSummary.verifyLatestDataDisplayed('22.46', '0.06', '210').then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiSummary.verifyMonthMultiEntry(mm).then(function (month) {
  //     expect(month).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.ControlName).then(function (navigate) {
  //     expect(navigate).toBe(true);
  //   });
  //   multiSummary.verifyLatestDataDisplayed('22.46', '0.06', '210').then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiSummary.verifyMonthMultiEntry(mm).then(function (month) {
  //     expect(month).toBe(true);
  //   });
  //   newLabSetup.navigateTO(jsonData.AnalyteName1).then(function (prod) {
  //     expect(prod).toBe(true);
  //   });
  //   multiSummary.verifyEnteredValueStoredTestMonth('22.46', '0.06', '210', mm).then(function (verify) {
  //     expect(verify).toBe(true);
  //   });
  // });
});
