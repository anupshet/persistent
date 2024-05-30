/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Dashboard } from '../page-objects/dashboard-e2e.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { DataTable } from '../page-objects/data-table-e2e.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { MultiPoint } from '../page-objects/multi-point.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';


const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();
library.parseJson('./JSON_data/Multi-Point.json').then(function(data) {
  jsonData = data;
});

describe('Multi Point Data Entry', function () {
  browser.waitForAngularEnabled(false);

  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const dataTable = new DataTable();
  const dashBoard = new Dashboard();
  const dashboard = new Dashboard();
  const multiSummary = new MultiSummary();
  const multiPoint = new MultiPoint();
  const newLabSetup = new NewLabSetup();
  const pezCommentEle = '(//em[@class="spc_pezcell_comments_number"])[1]';


  beforeEach(function () {
    loginEvent.loginToApplication(jsonData.URL, jsonData.AmrutaUsername,
      jsonData.AmrutaPassword, jsonData.AmrutaFirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
  });

  afterEach(function () {
    out.signOut();
  });

  //  ***************************************************************************************************** */


  it('Test case 2: Run Entry Input Data Verification Using Tab Key (Multi Point)', function () {
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyRunEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });

    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '2');
    dataEnter.set('14', '4');
    dataEnter.set('21', '6');
    dataEnter.set('24', '8');
    dataEnter.set('31', '10');
    dataEnter.set('34', '12');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '31');
    tabFocusedElement1.set('31', '34');
    tabFocusedElement1.set('34', '35');

    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 3: Level Entry Input Data Verification Using the Tab Key (Multi Point)', function () {
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyLevelEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });

    //  step 2
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '1');
    dataEnter.set('14', '2');
    dataEnter.set('17', '3');
    dataEnter.set('21', '4');
    dataEnter.set('24', '5');
    dataEnter.set('27', '6');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '17');
    tabFocusedElement1.set('17', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '27');
    tabFocusedElement1.set('27', '35');

    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 7: Cancel button Verify when no data has been entered', function () {
    const dataMap = new Map<string, string>();
    const val = '14';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 20: Verify Instrument based multi point page on sorting analyte by name', function () {
    const instruFlag = true;
    const prodFlag = false;

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySortingOfAnalyteSummeryEntryIntrumentBased(jsonData.Dept2Instrument1Prod1Test1,
      jsonData.Dept2Instrument1Prod1Test2, jsonData.Dept2Instrument1Prod1Test3, instruFlag).then(function (sorted) {
        expect(sorted).toBe(true);
      });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySortingOfAnalyteSummeryEntryIntrumentBased(jsonData.Dept2Instrument1Prod1Test1,
      jsonData.Dept2Instrument1Prod1Test2, jsonData.Dept2Instrument1Prod1Test3, prodFlag).then(function (sorted) {
        expect(sorted).toBe(true);
      });
  });

  it('Test case 25: Verify Product based multi point page on sorting analyte by name', function () {
    const prodFlag = false;

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySortingOfAnalyteSummeryEntryIntrumentBased(jsonData.Dept2Instrument1Prod1Test1,
      jsonData.Dept2Instrument1Prod1Test2, jsonData.Dept2Instrument1Prod1Test3, prodFlag).then(function (sorted) {
        expect(sorted).toBe(true);
      });
  });



  it('Test case 26: Verify Application User Access.', function () {
    const username = jsonData.AmrutaUserRoleUsername;
    const password = jsonData.AmrutaPassword;
    const firstName = jsonData.AmrutaFirstName;
    const assignedLab = jsonData.assignedLab;
    out.signOut().then(function (status) {
      expect(status).toBe(true);
    });
    loginEvent.doLogin(username, password, firstName).then(function (status) {
      expect(status).toBe(true);
    });
    dashboard.verifyAssignedLabToUser(assignedLab).then(function (verified) {
      expect(verified).toBe(true);
    });
  });


  it('Test case 27: Run Entry Input Data Verification Using Enter Key (Multi Point)', function () {
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyRunEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '1');
    dataEnter.set('14', '2');
    dataEnter.set('21', '3');
    dataEnter.set('24', '4');
    dataEnter.set('31', '5');
    dataEnter.set('34', '6');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '31');
    tabFocusedElement1.set('31', '34');
    tabFocusedElement1.set('34', '35');

    multiPoint.verifyRunEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 28: Level Entry Input Data Verification Using the Enter Key (Multi Point)', function () {
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyLevelEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    //  Test 1
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '1');
    dataEnter.set('14', '2');
    dataEnter.set('17', '3');
    dataEnter.set('21', '4');
    dataEnter.set('24', '5');
    dataEnter.set('27', '6');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '17');
    tabFocusedElement1.set('17', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '27');
    tabFocusedElement1.set('27', '35');

    multiPoint.verifyLevelEntryUsingEnterKey(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });
  });

  it('Test case 31: Multi Point entry components are displayed in groups by product lots when an instrument with all point entry tests are selected from nav menu', function () {
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyPointEntryComponentsInstrumentView(jsonData.Dept2Instrument1,
      jsonData.Dept2Instrument1Prod1, jsonData.Dept2Instrument1Prod1Test1, jsonData.Dept2Instrument1Prod1Test2,
      jsonData.Dept2Instrument1Prod1Test3).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    multiPoint.verifyTopPageHeaderInstrumentView(jsonData.Dept2Instrument1).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyDefaultRunEntrySelection(jsonData.Dept2Instrument1).then(function (selected) {
      expect(selected).toBe(true);
    });
    multiSummary.verifyLevelsDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyFooterComponents().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test case 32: Multi point entry components are displayed when a product lot with all point entry tests are selected from nav menu',
   function () {
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyPointEntryComponentsProductView(jsonData.Dept2Instrument1Prod1,
      jsonData.Dept2Instrument1Prod1Test1, jsonData.Dept2Instrument1Prod1Test2,
      jsonData.Dept2Instrument1Prod1Test3).then(function (displayed) {
        expect(displayed).toBe(true);
      });
    multiPoint.verifyDefaultRunEntrySelection(jsonData.Dept2Instrument1Prod1).then(function (selected) {
      expect(selected).toBe(true);
    });
    multiSummary.verifyLevelsDisplayed().then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyFooterComponents().then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });

  it('Test case 33: For Multi-Point : Initially, all fields should be empty.', function () {
    const instrument = jsonData.Dep2Instrument2cobas;         //  Dept2Instrument2;  //  'Roche cobas c 501'
    const product = jsonData.Dept2Instrument2Prod1;
    const test1 = jsonData.Dept2Instrument2Prod1Test1; //  'CO2 (Carbon Dioxide)';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyIntrumentLevelPageUIElements(instrument).then(function (verified) {
      expect(verified).toBe(true);
    });
    multiPoint.verifyAllFieldsEmpty().then(function (verified) {
      expect(verified).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(test1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterTestRun().then(function (linkClicked) {
      expect(linkClicked).toBe(true);
      browser.sleep(3000);
    });
    multiPoint.verifyAllFieldsEmpty().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test case 34: On Cancel : Should clear the values from the input fields.', function () {
    const val1 = '2.25', val2 = '3.25', val3 = '4.25', val4 = '5.25'; //  , val5 = '6.25', val6 = '7.25';
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1Prod1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    const dataMap = new Map<string, string>();
    dataMap.set('11', val1);
    dataMap.set('14', val2);
    dataMap.set('21', val3);
    dataMap.set('24', val4);

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyAllFieldsEmpty().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

  it('Test case 35: On Cancel : Should collapse change-lot/comment.', function () {
    const product = jsonData.Dept2Instrument1Prod1;  //  Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; //  'Albumin'
    const test2 = jsonData.Dept2Instrument1Prod1Test2; //  'Calcium',
    const val1 = '2.25', val2 = '3.25'; //  , val3 = '4.25', val4 = '5.25', val5 = '6.25', val6 = '7.25';
    const comment = jsonData.newCommentStringTc9;

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    const dataMap = new Map<string, string>();
    dataMap.set('11', val1);
    dataMap.set('14', val2);

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.hoverOverTest(test2).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickVerifyChangeLot().then(function (opened) {
      expect(opened).toBe(true);
    });
    multiPoint.addComment(comment).then(function (status) {
      expect(status).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
      expect(enabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiSummary.addCommentCollapse().then(function (collapse) {
      expect(collapse).toBe(true);
    });
    multiPoint.verifyAllFieldsEmpty().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });



  //   //  If data deletion is disabled then this test case will be failed
  //  // Test case not working as the recet saved data is not displayed below the analyte on control page
  //  it('Test case 1: Rows of test data are arranged consecutively by date and time', function () {
  //    const product = jsonData.Dept2Instrument1Prod1;
  //    const test1 = jsonData.Dept2Instrument1Prod1Test1;
  //    const test2 = jsonData.Dept2Instrument1Prod1Test2;
  //    const test3 = jsonData.Dept2Instrument1Prod1Test3;
  //    const date = new Date();
  //    const yyyy = date.getFullYear();
  //    const yyyy1 = yyyy - 1;
  //    const dd = '12', mm = 'JAN';
  //    const val = '5';
  //    const dd1 = '14', mm1 = 'FEB';
  //    const val1 = '10';
  //    const dd2 = '11', mm2 = 'MAR';
  //    const val2 = '15';
  //    const dataMap = new Map<string, string>();
  //    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
  //      expect(navigate).toBe(true);
  //    });
  //    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
  //      expect(navigate).toBe(true);
  //    });
  //    newLabSetup.navigateTO(product).then(function (navigate) {
  //      expect(navigate).toBe(true);
  //    });
  //    multiPoint.clearAllTestsData(test1).then(function (cleared) {
  //      expect(cleared).toBe(true);
  //    });
  //    multiPoint.clearAllTestsData(test2).then(function (cleared) {
  //      expect(cleared).toBe(true);
  //    });
  //    multiPoint.clearAllTestsData(test3).then(function (cleared) {
  //      expect(cleared).toBe(true);
  //    });
  //    multiPoint.clickOnBackArrow().then(function(clicked) {
  //      expect(clicked).toBe(true);
  //    });
  //    multiPoint.changeDate(yyyy1, mm, dd).then(function (dateChanged) {
  //      expect(dateChanged).toBe(true);
  //    });
  //    multiSummary.clickManuallyEnterData().then(function(clicked) {
  //      expect(clicked).toBe(true);
  //    });
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
  //    multiPoint.changeDate(yyyy1, mm1, dd1).then(function (dateChanged) {
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
  //    // Step 8
  //    multiPoint.changeDate(yyyy1, mm2, dd2).then(function (dateChanged) {
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


  // If data deletion is disabled then this test case will be failed
  // Passing but need to run once again
  it('Test case 4: Configuration set up verification', function () {
    const product = jsonData.Dept2Instrument2Prod2; // 'Cardiac Markers Plus LT';
    const test = jsonData.Dept2Instrument2Prod2Test1; // 'CK (Creatine Kinase)';
    const dataMap = new Map<string, string>();
    const val = '10.12345';
    const level1Val = '3';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dep2Instrument2cobas).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clearAllTestsData4LevelTest(test).then(function (cleared) {
      expect(cleared).toBe(true);
      multiPoint.clickOnBackArrow().then(function (navigated) {
        expect(navigated).toBe(true);
      });
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('101', val);
    dataMap.set('104', val);
    dataMap.set('107', val);
    dataMap.set('110', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyDecimalValueL1(level1Val).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyDecimalValueL2(level1Val).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyDecimalValueL3(level1Val).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.verifyDecimalValueL4(level1Val).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.clearAllTestsData4LevelTest(test).then(function (cleared) {
      expect(cleared).toBe(true);
    });
  });




  it('Test case 6: Prevent selection of month from beyond current month on Analyte Point Entry form', function () {
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const dataMap = new Map<string, string>();
    const val = '14';
    const date = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const mm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    const dd = '1';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clearAllTestsData(test1).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiPoint.clickOnBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    //  // Step 1
    multiPoint.changeDateCurrentMonth(yyyy, mm, dd).then(function (changed) {
      expect(changed).toBe(true);
    });
    multiSummary.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.selectPrevMonthDisabled(yyyy, mm).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiPoint.selectPrevYearDisabled(yyyy, mm).then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });

  //  // If data deletion is disabled then this test case will be failed
  //  it('Test case 12: Date-Time Picker localization verify', function () {
  //    const dataMap = new Map<string, string>();
  //    const val = '6.68';
  //    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
  //    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
  //    const commentString = jsonData.newCommentStringTc9;
  //    const expectedCommentValue1 = jsonData.expectedCommentValue;

  //    loginEvent.loginToApplication(jsonData.URL, jsonData.AmrutaUsername,
  //    jsonData.AmrutaPassword, jsonData.AmrutaFirstName).then(function (loggedIn) {
  //      expect(loggedIn).toBe(true);
  //    });

  //    dataTable.goToDataTablePage().then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });

  //    dataTable.clickHamburgerIcon().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });

  //    dataTable.expandTree().then(function (expanded) {
  //      expect(expanded).toBe(true);
  //    });

  //    multiPoint.clearAllTestsData(test1).then(function (cleared) {
  //      expect(cleared).toBe(true);
  //    });

  //    dataTable.goToInstrument_ProductName(product).then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });


  //    //  // Go to SpcRules Page
  //    //  dashBoard.goToSpcRuleTab().then(function (navigated) {
  //    //    expect(navigated).toBe(true);
  //    //  });

  //    //  // Verify Summary Data Toggle is Disabled
  //    //  multiSummary.verifyMultiSummaryEntryDisabled().then(function (disabled) {
  //    //    expect(disabled).toBe(true);
  //    //  });

  //    //  // Go to Data Table Tab
  //    //  dashBoard.goToDataTableTab().then(function (navigated) {
  //    //    expect(navigated).toBe(true);
  //    //  });

  //    dashBoard.goToDashboard().then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });

  //    // Change Lab Setup Address
  //    labSetup.goToLabSetupPage().then(function (displayed) {
  //      expect(displayed).toBe(true);
  //      dashBoard.waitForPage();
  //    });

  //    labSetup.updateLabLocation().then(function (location) {
  //      dashBoard.waitForElement();
  //      dashBoard.waitForElement();
  //      expect(location).toBe(true);
  //    });

  //    dashBoard.goToDashboard().then(function (board) {
  //      expect(board).toBe(true);
  //    });


  //    dataTable.goToDataTablePage().then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });

  //    dataTable.clickHamburgerIcon().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });

  //    dataTable.expandTree().then(function (expanded) {
  //      expect(expanded).toBe(true);
  //    });

  //    dataTable.goToInstrument_ProductName(product).then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });

  //    multiSummary.clickManuallyEnterData().then(function(clicked) {
  //      expect(clicked).toBe(true);
  //    });

  //    dataMap.set('11', val);
  //    multiPoint.enterValues(dataMap).then(function (result) {
  //      expect(result).toBe(true);
  //    });

  //    multiPoint.hoverOverTest(test1).then(function(hovered) {
  //      expect(hovered).toBe(true);
  //    });

  //    multiSummary.clickShowOptionnew().then(function(clicked) {
  //      expect(clicked).toBe(true);
  //    });

  //    multiPoint.addComment(commentString).then(function(status) {
  //      expect(status).toBe(true);
  //    });

  //    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
  //      expect(disabled).toBe(true);
  //    });

  //    multiSummary.clickSubmitButton().then(function (clicked) {
  //      expect(clicked).toBe(true);
  //    });

  //    multiPoint.verifyEnteredValueStored(val).then(function (displayed) {
  //      expect(displayed).toBe(true);
  //    });


  //    browser.actions().mouseMove(element(by.xpath(pezCommentEle))).perform();
  //    dashBoard.waitForElement();
  //    dataTable.verifyTimeZoneOnCommentSection().then(function (tooltip1) {
  //      expect(tooltip1).toBe(true);
  //    });

  //    dataTable.verifyCommentSection(expectedCommentValue1).then(function (comment1) {
  //      expect(comment1).toBe(true);
  //    });

  //    multiPoint.refresh().then(function (refreshed) {
  //      expect(refreshed).toBe(true);
  //    });

  //    dashBoard.goToDashboard().then(function (navigated) {
  //      expect(navigated).toBe(true);
  //    });
  //    // Change Lab Setup Address
  //    labSetup.goToLabSetupPage().then(function (displayed) {
  //      expect(displayed).toBe(true);
  //      dashBoard.waitForPage();
  //    });
  //    labSetup.updateLabLocationToDefault().then(function (location) {
  //      dashBoard.waitForElement();
  //      dashBoard.waitForElement();
  //      expect(location).toBe(true);
  //    });

  //    multiPoint.refresh().then(function (refreshed) {
  //      expect(refreshed).toBe(true);
  //    });
  //  });

  //  Test will be failed incase saved data is taking time to load

  it('Test case 14: Verify Instrument based multi point page', function () {
    const dataMap = new Map<string, string>();
    const dataMap1 = new Map<string, string>();
    const dataMap2 = new Map<string, string>();
    const instrument = jsonData.Dept2Instrument1; // 'ADVIA 1200';
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const test2 = jsonData.Dept2Instrument1Prod1Test2;
    const test3 = jsonData.Dept2Instrument1Prod1Test3;
    const invalidVal = 'abcd';
    const decimalVal = '2';
    const setVal1 = '2', setVal2 = '4', setVal3 = '6', setVal4 = '8', setVal5 = '10', setVal6 = '12';
    const set2Val1 = '3', set2Val2 = '6', set2Val3 = '9', set2Val4 = '12', set2Val5 = '15', set2Val6 = '18';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiPoint.clearAllTestsData(test1).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiPoint.clearAllTestsData(test2).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiPoint.clearAllTestsData(test3).then(function (cleared) {
      expect(cleared).toBe(true);
    });

    multiPoint.clickOnBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.clickOnBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dataMap.set('11', invalidVal);
    dataMap.set('14', invalidVal);
    dataMap.set('21', invalidVal);
    dataMap.set('24', invalidVal);
    dataMap.set('31', invalidVal);
    dataMap.set('34', invalidVal);

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dataMap.set('11', setVal1);
    dataMap.set('14', setVal2);
    dataMap.set('21', setVal3);
    dataMap.set('24', setVal4);
    dataMap.set('31', setVal5);
    dataMap.set('34', setVal6);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.verifyEnteredValueStoredT3L2(setVal1, setVal2, setVal3, setVal4, setVal5, setVal6).then(function (result) {
      expect(result).toBe(true);
    });

    multiPoint.verifyDecimalValueL1(decimalVal).then(function (result) {
      expect(result).toBe(true);
    });

    multiPoint.verifyDecimalValueL2(decimalVal).then(function (result) {
      expect(result).toBe(true);
    });

    multiPoint.verifyDecimalValueL1T2(decimalVal).then(function (result) {
      expect(result).toBe(true);
    });

    multiPoint.verifyDecimalValueL2T2(decimalVal).then(function (result) {
      expect(result).toBe(true);
    });

    multiPoint.verifyDecimalValueL1T3(decimalVal).then(function (result) {
      expect(result).toBe(true);
    });

    multiPoint.verifyDecimalValueL2T3(decimalVal).then(function (result) {
      expect(result).toBe(true);
    });

    dataMap1.set('11', set2Val1);
    dataMap1.set('14', set2Val2);
    dataMap1.set('21', set2Val3);
    dataMap1.set('24', set2Val4);
    dataMap1.set('31', set2Val5);
    dataMap1.set('34', set2Val6);
    multiPoint.enterValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.verifyEnteredValueStoredT3L2(set2Val1, set2Val2, set2Val3, set2Val4, set2Val5, set2Val6).then(function (result) {
      expect(result).toBe(true);
    });
  });



  //  Test will be failed incase saved data is taking time to load
  it('Test case 15: Verify product based multi point page', function () {
    const dataMap = new Map<string, string>();
    const dataMap1 = new Map<string, string>();
    const dataMap2 = new Map<string, string>();
    const instrument = jsonData.Dept2Instrument1;
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const invalidVal = 'abcd';
    const setVal1 = '2', setVal2 = '4', setVal3 = '6', setVal4 = '8', setVal5 = '10', setVal6 = '12';
    const set2Val1 = '3', set2Val2 = '6', set2Val3 = '9', set2Val4 = '12', set2Val5 = '15', set2Val6 = '18';
    const level1Val = '2', level2Val = '2';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clearAllTestsData(test1).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiPoint.clickOnBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', invalidVal);
    dataMap.set('14', invalidVal);
    dataMap.set('21', invalidVal);
    dataMap.set('24', invalidVal);
    dataMap.set('31', invalidVal);
    dataMap.set('34', invalidVal);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickCancelBtn().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', setVal1);
    dataMap.set('14', setVal2);
    dataMap.set('21', setVal3);
    dataMap.set('24', setVal4);
    dataMap.set('31', setVal5);
    dataMap.set('34', setVal6);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredT3L2(setVal1, setVal2, setVal3, setVal4, setVal5, setVal6).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.verifyDecimalValueL1(level1Val).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.verifyDecimalValueL2(level2Val).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.verifyDecimalValueL1T2(level1Val).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.verifyDecimalValueL2T2(level2Val).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.verifyDecimalValueL1T3(level1Val).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.verifyDecimalValueL2T3(level2Val).then(function (result) {
      expect(result).toBe(true);
    });
    dataMap1.set('11', set2Val1);
    dataMap1.set('14', set2Val2);
    dataMap1.set('21', set2Val3);
    dataMap1.set('24', set2Val4);
    dataMap1.set('31', set2Val5);
    dataMap1.set('34', set2Val6);
    multiPoint.enterValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredT3L2(set2Val1, set2Val2, set2Val3, set2Val4, set2Val5, set2Val6).then(function (result) {
      expect(result).toBe(true);
    });
  });


  //  // TC is Invalid TC 9 covered here
  //    it('Test case 16: Verify Instrument based multi point page data on select different Date-Timer Picker', function () {
  //      const dataMap = new Map<string, string>();
  //      const dataMap1 = new Map<string, string>();
  //      const instrument = jsonData.Dept2Instrument1; // 'ADVIA 1200';
  //      const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
  //      const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
  //      const test2 = jsonData.Dept2Instrument1Prod1Test2;	// 'Calcium',
  //      const test3 = jsonData.Dept2Instrument1Prod1Test3; // 'Creatinine',
  //      const commentString = jsonData.commentStringTC14;
  //      const commentString2 = jsonData.commentString2TC14;
  //      const setVal1 = '2.19', setVal2 = '4.20', setVal3 = '6.21', setVal4 = '8.22';
  //      const set2Val1 = '3.12', set2Val2 = '6.13', set2Val3 = '9.14', set2Val4 = '12.15';
  //      const expectedCommentCount = jsonData.expectedCommentValue;
  //      const dd = '12', mm = 'JAN';
  //      const date = new Date();
  //      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  //      const mm1 = months[date.getMonth()];
  //      const yyyy = date.getFullYear();
  //      const dd1 = '1';
  //      const toastMsg = jsonData.toastMsg;
  //      loginEvent.loginToApplication(jsonData.URL, jsonData.AmrutaUsername, jsonData.AmrutaPassword,
  //        jsonData.AmrutaFirstName).then(function (loggedIn) {
  //        expect(loggedIn).toBe(true);
  //      });
  //      dataTable.goToDataTablePage().then(function (displayed) {
  //        expect(displayed).toBe(true);
  //      });
  //      dataTable.clickHamburgerIcon().then(function (clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      dataTable.expandTree().then(function (expanded) {
  //        expect(expanded).toBe(true);
  //      });
  //      multiPoint.clearAllTestsData(test1).then(function (cleared) {
  //        expect(cleared).toBe(true);
  //      });
  //      multiPoint.clearAllTestsData(test2).then(function (cleared) {
  //        expect(cleared).toBe(true);
  //      });
  //      multiPoint.clearAllTestsData(test3).then(function (cleared) {
  //        expect(cleared).toBe(true);
  //      });
  //      //  dataTable.goToInstrument_ProductName(product).then(function (navigated) {
  //      //    expect(navigated).toBe(true);
  //      //  });
  //      //  //  // Go to SpcRules Page
  //      //  dashBoard.goToSpcRuleTab().then(function (navigated) {
  //      //    expect(navigated).toBe(true);
  //      //  });
  //      //  multiPoint.isLevel1CheckBoxChecked().then(function (checked) {
  //      //    expect(checked).toBe(true);
  //      //  });
  //      //  multiPoint.isLevel2CheckBoxChecked().then(function (checked) {
  //      //    expect(checked).toBe(true);
  //      //  });
  //      const level1 = true;
  //      const level1Val = '2';
  //      const level2 = true;
  //      const level2Val = '2';
  //      const level3 = false;
  //      const level3Val = '';
  //      const level4 = false;
  //      const level4Val = '';
  //      //  multiSummary.setDecimalPlaces(level1,level1Val,level2,level2Val,level3,level3Val,level4,level4Val).then(function (level) {
  //      //    expect(level).toBe(true);
  //      //  });
  //      //  // Verify Summary Data Toggle is Disabled
  //      //  multiSummary.verifyMultiSummaryEntryDisabled().then(function (disabled) {
  //      //    expect(disabled).toBe(true);
  //      //  });
  //      //  multiSummary.clickApply().then(function (clicked) {
  //      //    expect(clicked).toBe(true);
  //      //  });
  //      //  multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {
  //      //  });
  //      //  // Go to Data Table Tab
  //      //  dashBoard.goToDataTableTab().then(function (navigated) {
  //      //    expect(navigated).toBe(true);
  //      //  });
  //      dataTable.goToInstrument_ProductName(instrument).then(function (navigated) {
  //        dashBoard.waitForElement();
  //        expect(navigated).toBe(true);
  //      });
  //      multiSummary.clickManuallyEnterData().then(function(clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.verifyIntrumentLevelPageUIElements(instrument).then(function (verified) {
  //        expect(verified).toBe(true);
  //      });
  //      multiPoint.changeDate(yyyy, mm, dd).then(function (dateChanged) {
  //        expect(dateChanged).toBe(true);
  //      });
  //      dataMap.set('11', setVal1);
  //      dataMap.set('14', setVal2);
  //      dataMap.set('21', setVal3);
  //      dataMap.set('24', setVal4);
  //      multiPoint.enterValues(dataMap).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      //  multiPoint.enterComment(commentString).then(function (status) {
  //      //    expect(status).toBe(true);
  //      //  });
  //      multiPoint.hoverOverTest(test1).then(function(hovered) {
  //        expect(hovered).toBe(true);
  //      });
  //      multiSummary.clickShowOptionnew().then(function(clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.addComment(commentString).then(function(status) {
  //        expect(status).toBe(true);
  //      });
  //      multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
  //        expect(enabled).toBe(true);
  //      });
  //      multiSummary.clickSubmitButton().then(function (clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.verifyEnteredValueStoredT2L2(setVal1, setVal3, setVal2, setVal4).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL1(level1Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL2(level2Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL1T2(level1Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL2T2(level2Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyPezCommentToolTip(commentString).then(function (doneThat) {
  //        expect(doneThat).toBe(true);
  //      });
  //      dataTable.verifyCommentSection(expectedCommentCount).then(function (comment1) {
  //        expect(comment1).toBe(true);
  //      });
  //      dataTable.verifytheReviewSummaryPage().then(function (review1) {
  //        expect(review1).toBe(true);
  //      });
  //      multiPoint.clickOnDoneButton().then(function (status) {
  //        expect(status).toBe(true);
  //      });
  //      multiPoint.changeDateCurrentMonth(yyyy, mm1, dd1).then(function (changed) {
  //        expect(changed).toBe(true);
  //      });
  //      dataMap1.set('11', set2Val1);
  //      dataMap1.set('14', set2Val2);
  //      dataMap1.set('21', set2Val3);
  //      dataMap1.set('24', set2Val4);
  //      multiPoint.enterValues(dataMap1).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      //  multiPoint.enterComment(commentString2).then(function (status) {
  //      //    expect(status).toBe(true);
  //      //  });
  //      multiPoint.hoverOverTest(test1).then(function(hovered) {
  //        expect(hovered).toBe(true);
  //      });
  //      multiSummary.clickShowOptionnew().then(function(clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.addComment(commentString2).then(function(status) {
  //        expect(status).toBe(true);
  //      });
  //      multiSummary.clickSubmitButton().then(function (clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.verifyEnteredValueStoredT2L2(set2Val1, set2Val2, set2Val3, set2Val4).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL1(level1Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL2(level2Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL1T2(level1Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL2T2(level2Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyPezCommentToolTip(commentString2).then(function (doneThat) {
  //        expect(doneThat).toBe(true);
  //      });
  //      dataTable.verifyCommentSection(expectedCommentCount).then(function (comment1) {
  //        expect(comment1).toBe(true);
  //      });
  //      dataTable.verifytheReviewSummaryPage().then(function (review1) {
  //        expect(review1).toBe(true);
  //      });
  //      multiPoint.clickOnDoneButton().then(function (status) {
  //        expect(status).toBe(true);
  //      });
  //      multiPoint.verifyEnteredValueStoredT2L2(set2Val1, set2Val2, set2Val3, set2Val4).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.setFutureDate().then(function (datePrev) {
  //        expect(datePrev).toBe(true);
  //      });
  //    });


  // it('Test case 17: Verify Instrument based multi point page data on level setting changed', function () {
  //   const dataMap = new Map<string, string>();
  //   const dataMap1 = new Map<string, string>();
  //   const dataMap2 = new Map<string, string>();
  //   const dataMap3 = new Map<string, string>();
  //   const dataMap4 = new Map<string, string>();
  //   const dataMap5 = new Map<string, string>();
  //   const instrument = jsonData.Dep2Instrument2cobas; // 'Roche cobas c 501' //  Dep2Instrument2
  //   const product = jsonData.Dept2Instrument2Prod3; // 'Multiqual 1,2,3'
  //   const val1 = '1.11', val2 = '2.11', val3 = '3.11', val4 = '4.11', val5 = '5.11', val6 = '6.11';
  //   const val7 = '7.11', val8 = '8.11', val9 = '9.11', val10 = '10.11', val11 = '11.11', val12 = '12.11';
  //   const val13 = '13.11', val14 = '14.11', val15 = '15.11', val16 = '16.11', val17 = '17.11', val18 = '18.11';
  //   const commentString = jsonData.commentStringTC15;
  //   const expectedCommentCount = jsonData.expectedCommentValue;
  //   const expectedInteractionCount = jsonData.expectedInteractionCount;
  //   const string1 = jsonData.commentString1TC15;
  //   const string2 = jsonData.commentString2TC15;
  //   const string3 = jsonData.commentString3TC15;
  //   const string4 = jsonData.commentString4TC15;
  //   const string5 = jsonData.commentString5TC15;
  //   const string6 = jsonData.commentString6TC15;
  //   const test1 = '1', test2 = '2', test3 = '3', test4 = '4', test5 = '5', test6 = '6';
  //   const instLvlTest1 = '3', instLvlTest2 = '4', instLvlTest3 = '5', instLvlTest4 = '6', instLvlTest5 = '7', instLvlTest6 = '8';
  //   const test1Name = jsonData.Dept2Instrument2Prod3Test1; // 'Albumin'
  //   const test2Name = jsonData.Dept2Instrument2Prod3Test2; // 'Cholesterol, HDL'
  //   const test3Name = jsonData.Dept2Instrument2Prod3Test3; // 'Creatinine'
  //   const test4Name = jsonData.Dept2Instrument2Prod3Test4; // 'GGT (Gamma Glutamyltransferase)',
  //   const test5Name = jsonData.Dept2Instrument2Prod3Test5; // 'Triglycerides',
  //   const test6Name = jsonData.Dept2Instrument2Prod3Test6; // 'Valproic Acid (Depakene)',
  //   const otherProdTest1 = jsonData.Dept2Instrument2Prod1Test1; // 'CO2 (Carbon Dioxide)'
  //   const otherProdTest2 = jsonData.Dept2Instrument2Prod2Test1; // 'CK (Creatine Kinase)';
  //   const toastMsg = jsonData.toastMsg;

  //   loginEvent.loginToApplication(jsonData.URL,jsonData.AmrutaUsername,
  //     jsonData.AmrutaPassword,jsonData.AmrutaFirstName).then(function (loggedIn) {
  //     expect(loggedIn).toBe(true);
  //   });
  //   dataTable.goToDataTablePage().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   dataTable.clickHamburgerIcon().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   dataTable.expandTree().then(function (expanded) {
  //     expect(expanded).toBe(true);
  //   });
  //   multiPoint.clearAllTestsDatacobas(otherProdTest1).then(function (cleared) {
  //     expect(cleared).toBe(true);
  //   });
  //   multiPoint.clearAllTestsData4LevelTest(otherProdTest2).then(function (cleared) {
  //     expect(cleared).toBe(true);
  //   });
  //   dataTable.goToTest2withSameName(test1Name).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   multiPoint.deleteData().then(function (cleared) {
  //     expect(cleared).toBe(true);
  //   });
  //   multiPoint.clearAllTestsDatacobas(test2Name).then(function (cleared) {
  //     expect(cleared).toBe(true);
  //   });
  //   dataTable.goToTest2withSameName(test3Name).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   multiPoint.deleteData().then(function (cleared) {
  //     expect(cleared).toBe(true);
  //   });
  //   multiPoint.clearAllTestsDatacobas(test4Name).then(function (cleared) {
  //     expect(cleared).toBe(true);
  //   });
  //   multiPoint.clearAllTestsDatacobas(test5Name).then(function (cleared) {
  //     expect(cleared).toBe(true);
  //   });
  //   multiPoint.clearAllTestsDatacobas(test6Name).then(function (cleared) {
  //     expect(cleared).toBe(true);
  //   });
  //   dataTable.goToInstrument_ProductName(product).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   // Go to SpcRules Page
  //   dashBoard.goToSpcRuleTab().then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   multiPoint.isLevel1CheckBoxChecked().then(function (checked) {
  //     expect(checked).toBe(true);
  //   });
  //   multiPoint.isLevel2CheckBoxChecked().then(function (checked) {
  //     expect(checked).toBe(true);
  //   });
  //   multiPoint.isLevel3CheckBoxChecked().then(function (checked) {
  //     expect(checked).toBe(true);
  //   });

  //   const level1 = true;
  //   const level1Val = '2';
  //   const level2 = true;
  //   const level2Val = '2';
  //   const level3 = true;
  //   const level3Val = '2';
  //   const level4 = false;
  //   const level4Val = '';
  //   multiSummary.setDecimalPlaces(level1, level1Val, level2, level2Val, level3, level3Val, level4, level4Val).then(function (level) {
  //     expect(level).toBe(true);
  //   });
  //   // Verify Summary Data Toggle is Disabled
  //   multiSummary.verifyMultiSummaryEntryDisabled().then(function (disabled) {
  //     expect(disabled).toBe(true);
  //   });
  //   multiSummary.clickApply().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {
  //   });
  //   // Go to Data Table Tab
  //   dashBoard.goToDataTableTab().then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });
  //   dataTable.goToInstrument_ProductName(instrument).then(function (navigated) {
  //     dashBoard.waitForElement();
  //     expect(navigated).toBe(true);
  //   });
  //   multiSummary.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   multiPoint.verifyIntrumentLevelPageUIElementsSixTests(instrument).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   dataTable.goToInstrument_ProductName(instrument).then(function (navigated) {
  //     dashBoard.waitForElement();
  //     expect(navigated).toBe(true);
  //   });
  //   //  //  Matrix 1
  //   dataMap.set('301', val1);
  //   dataMap.set('304', val2);
  //   dataMap.set('401', val3);
  //   dataMap.set('404', val4);
  //   dataMap.set('501', val5);
  //   dataMap.set('504', val6);
  //   dataMap.set('601', val7);
  //   dataMap.set('604', val8);
  //   dataMap.set('701', val9);
  //   dataMap.set('704', val10);
  //   dataMap.set('801', val11);
  //   dataMap.set('804', val12);
  //   multiPoint.enterValues(dataMap).then(function (result) {
  //     console.log('Values entered for Matrix 1');
  //     expect(result).toBe(true);
  //   });
  //   // Step 6
  //   multiSummary.clickSubmitButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  //   // Substep 1
  //   // Verifying Values for Level 1 all tests
  //   // Verifying Values for Level 2 all tests
  //   // Substep 2
  //   // Verifying Decimal Values for Level 1 all tests
  //   // Verifying Decimal Values for Level 2 all tests
  //   multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL2AllTest(val2, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL2AllTest(level2Val, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL1AllTest(val3, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL2AllTest(val4, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL2AllTest(level2Val, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL1AllTest(val5, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL2AllTest(val6, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL2AllTest(level2Val, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL1AllTest(val7, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL2AllTest(val8, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL2AllTest(level2Val, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL1AllTest(val9, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL2AllTest(val10, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL2AllTest(level2Val, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL1AllTest(val11, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyEnteredValueStoredL2AllTest(val12, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   multiPoint.verifyDecimalValueL2AllTest(level2Val, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   // Step 7
  //   // Matrix 2 - Level 1 & Level 3 Data
  //   dataMap1.set('301', val1);
  //   dataMap1.set('307', val2);
  //   dataMap1.set('401', val3);
  //   dataMap1.set('407', val4);
  //   dataMap1.set('501', val5);
  //   dataMap1.set('507', val6);
  //   dataMap1.set('601', val7);
  //   dataMap1.set('607', val8);
  //   dataMap1.set('701', val9);
  //   dataMap1.set('707', val10);
  //   dataMap1.set('801', val11);
  //   dataMap1.set('807', val12);
  //   multiPoint.enterValues(dataMap1).then(function (result) {
  //     expect(result).toBe(true);
  //   });
  //   multiPoint.enterCommentForAllTestsInstrumentLevel(string1, instLvlTest1, test1).then(function (added) {
  //     expect(added).toBe(true);
  //   });
  //   multiPoint.enterCommentForAllTestsInstrumentLevel(string2, instLvlTest2, test2).then(function (added) {
  //     expect(added).toBe(true);
  //   });
  //   multiPoint.enterCommentForAllTestsInstrumentLevel(string3, instLvlTest3, test3).then(function (added) {
  //     expect(added).toBe(true);
  //   });
  //   multiPoint.enterCommentForAllTestsInstrumentLevel(string4, instLvlTest4, test4).then(function (added) {
  //     expect(added).toBe(true);
  //   });
  //   multiPoint.enterCommentForAllTestsInstrumentLevel(string5, instLvlTest5, test5).then(function (added) {
  //     expect(added).toBe(true);
  //   });

  //   multiPoint.enterCommentForAllTestsInstrumentLevel(string6, instLvlTest6, test6).then(function (added) {
  //     expect(added).toBe(true);
  //   });

  //   multiSummary.clickSubmitButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });

  //   // Verifying Values for Level 1 & Level 3 all tests
  //   //  // Verifying Decimal Values for Level 1 & Level 3 all tests
  //   multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val2, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL3AllTest(level3Val, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val3, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val4, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL3AllTest(level3Val, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val5, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val6, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL3AllTest(level3Val, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val7, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val8, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL3AllTest(level3Val, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val9, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val10, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL3AllTest(level3Val, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val11, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val12, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL1AllTest(level1Val, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyDecimalValueL3AllTest(level3Val, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   // Verify Pez Comment Icon for all 6 tests
  //   multiPoint.verifyPezCommentToolTipAllTest(string1, test1).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });

  //   multiPoint.verifyPezCommentToolTipAllTest(string2, test2).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });

  //   multiPoint.verifyPezCommentToolTipAllTest(string3, test3).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });

  //   multiPoint.verifyPezCommentToolTipAllTest(string4, test4).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });

  //   multiPoint.verifyPezCommentToolTipAllTest(string5, test5).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });

  //   multiPoint.verifyPezCommentToolTipAllTest(string6, test6).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });

  //   // Verify Pez Comment Number for all 6 tests
  //   multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test1).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test2).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test3).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test4).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test5).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test6).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });

  //   // Verify Interaction Icn for all 6 tests
  //   multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test1).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test2).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test3).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test4).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test5).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });
  //   multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test6).then(function (verified) {
  //     expect(verified).toBe(true);
  //   });

  //   // Matrix 3 - Level 2 & Level 3 Data
  //   dataMap2.set('304', val7);
  //   dataMap2.set('307', val8);
  //   dataMap2.set('404', val9);
  //   dataMap2.set('407', val10);
  //   dataMap2.set('504', val11);
  //   dataMap2.set('507', val12);
  //   dataMap2.set('604', val13);
  //   dataMap2.set('607', val14);
  //   dataMap2.set('704', val15);
  //   dataMap2.set('707', val16);
  //   dataMap2.set('804', val17);
  //   dataMap2.set('807', val18);
  //   multiPoint.enterValues(dataMap2).then(function (result) {
  //     expect(result).toBe(true);
  //   });


  //   multiSummary.clickSubmitButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });

  //   // Verifying Values for Level 2 all tests
  //   multiPoint.verifyEnteredValueStoredL2AllTest(val7, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val8, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val9, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val10, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val11, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val12, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val13, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val14, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val15, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val16, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val17, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val18, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });


  //   // Matrix 4 - Level 1 Only
  //   dataMap3.set('301', val1);
  //   dataMap3.set('401', val2);
  //   dataMap3.set('501', val3);
  //   dataMap3.set('601', val4);
  //   dataMap3.set('701', val5);
  //   dataMap3.set('801', val6);
  //   multiPoint.enterValues(dataMap3).then(function (result) {
  //     expect(result).toBe(true);
  //   });

  //   multiSummary.clickSubmitButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });

  //   // Verifying Values for Level 1 all tests
  //   multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val2, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val3, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val4, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val5, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL1AllTest(val6, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });


  //   // Matrix 5 - Level 2 Only
  //   dataMap4.set('304', val7);
  //   dataMap4.set('404', val8);
  //   dataMap4.set('504', val9);
  //   dataMap4.set('604', val10);
  //   dataMap4.set('704', val11);
  //   dataMap4.set('804', val12);
  //   multiPoint.enterValues(dataMap4).then(function (result) {
  //     expect(result).toBe(true);
  //   });

  //   multiSummary.clickSubmitButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });


  //   // Verifying Values for Level 2 all tests
  //   multiPoint.verifyEnteredValueStoredL2AllTest(val7, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val8, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val9, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val10, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val11, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL2AllTest(val12, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   // Matrix 6 - Level 3 Only
  //   dataMap5.set('307', val13);
  //   dataMap5.set('407', val14);
  //   dataMap5.set('507', val15);
  //   dataMap5.set('607', val16);
  //   dataMap5.set('707', val17);
  //   dataMap5.set('807', val18);
  //   multiPoint.enterValues(dataMap5).then(function (result) {
  //     expect(result).toBe(true);
  //   });

  //   multiSummary.clickSubmitButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });


  //   // Verifying Values for Level 3 all tests
  //   multiPoint.verifyEnteredValueStoredL3AllTest(val13, test1).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val14, test2).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val15, test3).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val16, test4).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val17, test5).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiPoint.verifyEnteredValueStoredL3AllTest(val18, test6).then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  // });


  // ****************************** *Not working due to bug*************************************

  // it('Test case 18: Verify Instrument based multi point page data on lot changed', function () {
  //   const instrument = jsonData.Dept2Instrument1; // 'ADVIA 1200';
  //   const val = '5.10';
  //   let oldReagentLot, oldCallibratorLot;
  //   const newReagentLot = jsonData.NewReagentLot; // '26430 -  Persistent'
  //   const newCallibratorLot = jsonData.NewCalibaratorLot;  // '26430 - Persistent'

  //   loginEvent.loginToApplication(jsonData.URL,
  //     jsonData.AmrutaUsername, jsonData.AmrutaPassword, jsonData.AmrutaFirstName).then(function (loggedIn) {
  //       expect(loggedIn).toBe(true);
  //     });

  //   dataTable.goToDataTablePage().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });
  //   dataTable.clickHamburgerIcon().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });

  //   dataTable.expandTree().then(function (expanded) {
  //     expect(expanded).toBe(true);
  //   });

  //   dataTable.goToInstrument_ProductName(instrument).then(function (navigated) {
  //     expect(navigated).toBe(true);
  //   });

  //   multiSummary.clickManuallyEnterData().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });

  //   // Step 2
  //   const dataMap = new Map<string, string>();
  //   dataMap.set('21', val);

  //   multiPoint.enterValues(dataMap).then(function (result) {
  //     expect(result).toBe(true);
  //   });

  //   multiPoint.clickVerifyChangeLot().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiSummary.changeReagentLot(newReagentLot).then(function (changed) {
  //     oldReagentLot = changed;
  //   });


  //   multiSummary.changeCallibratortLot(newCallibratorLot).then(function (changed) {
  //     oldCallibratorLot = changed;
  //   });

  //   multiSummary.clickSubmitButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });

  //   multiPoint.clickVerifyChangeLot().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiSummary.verifyNewLotValue(oldReagentLot, oldCallibratorLot).then(function (status) {
  //     expect(status).toBe(true);
  //   });

  //   // Change lot again to old lot

  //   dataMap.set('21', val);

  //   multiPoint.enterValues(dataMap).then(function (result) {
  //     expect(result).toBe(true);
  //   });

  //   multiPoint.clickVerifyChangeLot().then(function (displayed) {
  //     expect(displayed).toBe(true);
  //   });

  //   multiSummary.changeReagentLot(oldReagentLot).then(function (changed) {
  //     const lot = changed;

  //   });


  //   multiSummary.changeCallibratortLot(oldCallibratorLot).then(function (changed) {
  //     const lot = changed;

  //   });

  //   multiSummary.clickSubmitButton().then(function (clicked) {
  //     expect(clicked).toBe(true);
  //   });
  // });
  //  *****************************************************************************************

  // Invalid TC
  //    it('Test case 21: Verify Product based multi point page data on select different Date-Timer Picker', function () {
  //      const dataMap = new Map<string, string>();
  //      const dataMap1 = new Map<string, string>();
  //      const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
  //      const test1 = jsonData.Dept2Instrument1Prod1Test1 // 'Albumin'
  //      const test2 = jsonData.Dept2Instrument1Prod1Test2	// 'Calcium',
  //      const test3 = jsonData.Dept2Instrument1Prod1Test3 // 'Creatinine',
  //      const commentString = jsonData.commentString1TC18
  //      const commentString2 = jsonData.commentString2TC18
  //      const setVal1 = '2.19', setVal2 = '4.20', setVal3 = '6.21', setVal4 = '8.22';
  //      const set2Val1 = '3.12', set2Val2 = '6.13', set2Val3 = '9.14', set2Val4 = '12.15';
  //      const expectedCommentCount = jsonData.expectedCommentValue;
  //      const dd = '12', mm = 'JAN';
  //      const date = new Date();
  //      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  //      const mm1 = months[date.getMonth()]
  //      const yyyy = date.getFullYear()
  //      const dd1 = '1';
  //      const toastMsg = jsonData.toastMsg;

  //      loginEvent.loginToApplication(jsonData.URL, jsonData.AmrutaUsername,
  //      jsonData.AmrutaPassword, jsonData.AmrutaFirstName).then(function (loggedIn) {
  //        expect(loggedIn).toBe(true);
  //      });
  //      dataTable.goToDataTablePage().then(function (displayed) {
  //        expect(displayed).toBe(true);
  //      });
  //      dataTable.clickHamburgerIcon().then(function (clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      dataTable.expandTree().then(function (expanded) {
  //        expect(expanded).toBe(true);
  //      });
  //      multiPoint.clearAllTestsData(test1).then(function (cleared) {
  //        expect(cleared).toBe(true);
  //      });
  //      multiPoint.clearAllTestsData(test2).then(function (cleared) {
  //        expect(cleared).toBe(true);
  //      });
  //      multiPoint.clearAllTestsData(test3).then(function (cleared) {
  //        expect(cleared).toBe(true);
  //      });
  //      dataTable.goToInstrument_ProductName(product).then(function (navigated) {
  //        expect(navigated).toBe(true);
  //      });
  //      // Go to SpcRules Page
  //      dashBoard.goToSpcRuleTab().then(function (navigated) {
  //        expect(navigated).toBe(true);
  //      });
  //      multiPoint.isLevel1CheckBoxChecked().then(function (checked) {
  //        expect(checked).toBe(true);
  //      });
  //      multiPoint.isLevel2CheckBoxChecked().then(function (checked) {
  //        expect(checked).toBe(true);
  //      });
  //      const level1 = true;
  //      const level1Val = '2';
  //      const level2 = true;
  //      const level2Val = '2';
  //      const level3 = false;
  //      const level3Val = '';
  //      const level4 = false;
  //      const level4Val = '';
  //      multiSummary.setDecimalPlaces(level1, level1Val, level2, level2Val, level3, level3Val, level4, level4Val).then(function (level) {
  //        expect(level).toBe(true);
  //      });
  //      // Verify Summary Data Toggle is Disabled
  //      multiSummary.verifyMultiSummaryEntryDisabled().then(function (disabled) {
  //        expect(disabled).toBe(true);
  //      });
  //      multiSummary.clickApply().then(function (clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      //  multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {
  //      //  });
  //      // Go to Data Table Tab
  //      dashBoard.goToDataTableTab().then(function (navigated) {
  //        expect(navigated).toBe(true);
  //      });
  //      multiSummary.clickManuallyEnterData().then(function(clicked){
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.verifyIntrumentLevelPageUIElements(product).then(function (verified) {
  //        expect(verified).toBe(true);
  //      });
  //      multiPoint.changeDate(yyyy, mm, dd).then(function (dateChanged) {
  //        expect(dateChanged).toBe(true);
  //      });
  //      dataMap.set('11', setVal1);
  //      dataMap.set('14', setVal2);
  //      dataMap.set('21', setVal3);
  //      dataMap.set('24', setVal4);
  //      multiPoint.enterValues(dataMap).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.hoverOverTest(test1).then(function(hovered){
  //        expect(hovered).toBe(true);
  //      });
  //      multiSummary.clickShowOptionnew().then(function(clicked){
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.addComment(commentString).then(function(status) {
  //        expect(status).toBe(true);
  //      });
  //      multiSummary.verifySubmitButtonEnabled().then(function (enabled) {
  //        expect(enabled).toBe(true);
  //      });
  //      multiSummary.clickSubmitButton().then(function (clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.verifyEnteredValueStoredT2L2(setVal1, setVal3, setVal2, setVal4).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL1(level1Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL2(level2Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL1T2(level1Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL2T2(level2Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyPezCommentToolTip(commentString).then(function (doneThat) {
  //        expect(doneThat).toBe(true);
  //      });
  //      dataTable.verifyCommentSection(expectedCommentCount).then(function (comment1) {
  //        expect(comment1).toBe(true);
  //      });
  //      dataTable.verifytheReviewSummaryPage().then(function (review1) {
  //        expect(review1).toBe(true);
  //      });
  //      multiPoint.clickOnDoneButton().then(function (status) {
  //        expect(status).toBe(true);
  //      });
  //      multiPoint.changeDateCurrentMonth(yyyy, mm1, dd1).then(function (changed) {
  //        expect(changed).toBe(true);
  //      });
  //      dataMap1.set('11', set2Val1);
  //      dataMap1.set('14', set2Val2);
  //      dataMap1.set('21', set2Val3);
  //      dataMap1.set('24', set2Val4);
  //      multiPoint.enterValues(dataMap1).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.enterComment(commentString2).then(function (status) {
  //        expect(status).toBe(true);
  //      });
  //      multiPoint.hoverOverTest(test1).then(function(hovered){
  //        expect(hovered).toBe(true);
  //      });
  //      multiSummary.clickShowOptionnew().then(function(clicked){
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.addComment(commentString).then(function(status) {
  //        expect(status).toBe(true);
  //      });
  //      multiSummary.clickSubmitButton().then(function (clicked) {
  //        expect(clicked).toBe(true);
  //      });
  //      multiPoint.verifyEnteredValueStoredT2L2(setVal1, setVal2, setVal3, setVal4).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL1(level1Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL2(level2Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL1T2(level1Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.verifyDecimalValueL2T2(level2Val).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      dashBoard.goToSpcRuleTab().then(function (navigated) {
  //        expect(navigated).toBe(true);
  //      });
  //      dashBoard.goToDataTableTab().then(function (navigated) {
  //         expect(navigated).toBe(true);
  //      });
  //      multiPoint.verifyPezCommentToolTip(commentString2).then(function (doneThat) {
  //        expect(doneThat).toBe(true)
  //      });
  //      dataTable.verifyCommentSection(expectedCommentCount).then(function (comment1) {
  //        expect(comment1).toBe(true);
  //      });
  //      dataTable.verifytheReviewSummaryPage().then(function (review1) {
  //        expect(review1).toBe(true);
  //      });
  //      multiPoint.clickOnDoneButton().then(function (status) {
  //        expect(status).toBe(true);
  //      });
  //      multiPoint.verifyEnteredValueStoredT2L2(set2Val1, set2Val2, set2Val3, set2Val4).then(function (result) {
  //        expect(result).toBe(true);
  //      });
  //      multiPoint.setFutureDate().then(function (datePrev) {
  //        expect(datePrev).toBe(true);
  //      });
  //    });


  /* it('Test case 22: Verify product based multi point page data on level setting changed', function () {
     const dataMap = new Map<string, string>();
     const dataMap1 = new Map<string, string>();
     const dataMap2 = new Map<string, string>();
     const dataMap3 = new Map<string, string>();
     const dataMap4 = new Map<string, string>();
     const dataMap5 = new Map<string, string>();
     const instrument = jsonData.Dep2Instrument2cobas;        // Dept2Instrument2; // 'Roche cobas c 501'
     const product = jsonData.Dept2Instrument2Prod3; // 'Multiqual 1,2,3'
     const val1 = '1.11', val2 = '2.11', val3 = '3.11', val4 = '4.11', val5 = '5.11', val6 = '6.11';
     const val7 = '7.11', val8 = '8.11', val9 = '9.11', val10 = '10.11', val11 = '11.11', val12 = '12.11';
     const val13 = '13.11', val14 = '14.11', val15 = '15.11', val16 = '16.11', val17 = '17.11', val18 = '18.11';
     const commentString = jsonData.commentStringTC19;
     const expectedCommentCount = jsonData.expectedCommentValue;
     const expectedInteractionCount = jsonData.expectedInteractionCount;
     const string1 = jsonData.commentString1TC15;
     const string2 = jsonData.commentString2TC15;
     const string3 = jsonData.commentString3TC15;
     const string4 = jsonData.commentString4TC15;
     const string5 = jsonData.commentString5TC15;
     const string6 = jsonData.commentString6TC15;
     const test1 = '1', test2 = '2', test3 = '3', test4 = '4', test5 = '5', test6 = '6';
     const test1Name = jsonData.Dept2Instrument2Prod3Test1; // 'Albumin'
     const test2Name = jsonData.Dept2Instrument2Prod3Test2; // 'Cholesterol, HDL'
     const test3Name = jsonData.Dept2Instrument2Prod3Test3; // 'Creatinine'
     const test4Name = jsonData.Dept2Instrument2Prod3Test4; // 'GGT (Gamma Glutamyltransferase)',
     const test5Name = jsonData.Dept2Instrument2Prod3Test5; // 'Triglycerides',
     const test6Name = jsonData.Dept2Instrument2Prod3Test6; // 'Valproic Acid (Depakene)',
     const toastMsg = jsonData.toastMsg;

     loginEvent.loginToApplication(jsonData.URL, jsonData.AmrutaUsername,
      jsonData.AmrutaPassword, jsonData.AmrutaFirstName).then(function (loggedIn) {
       expect(loggedIn).toBe(true);
     });

     dataTable.goToDataTablePage().then(function (displayed) {
       expect(displayed).toBe(true);
     });

     dataTable.clickHamburgerIcon().then(function (clicked) {
       expect(clicked).toBe(true);
     });

     dataTable.expandTree().then(function (expanded) {
       expect(expanded).toBe(true);
     });

     dataTable.goToInstrument_ProductName(test2Name).then(function (navigated) {
       expect(navigated).toBe(true);
     });

     dataTable.goToTest2withSameName(test1Name).then(function (navigated) {
       expect(navigated).toBe(true);
     });

     multiPoint.deleteData().then(function (cleared) {
       expect(cleared).toBe(true);
     });

     multiPoint.clearAllTestsDatacobas(test2Name).then(function (cleared) {
       expect(cleared).toBe(true);
     });

     dataTable.goToTest2withSameName(test3Name).then(function (navigated) {
       expect(navigated).toBe(true);
     });

     multiPoint.deleteData().then(function (cleared) {
       expect(cleared).toBe(true);
     });

     multiPoint.clearAllTestsDatacobas(test4Name).then(function (cleared) {
       expect(cleared).toBe(true);
     });

     multiPoint.clearAllTestsDatacobas(test5Name).then(function (cleared) {
       expect(cleared).toBe(true);
     });

     multiPoint.clearAllTestsDatacobas(test6Name).then(function (cleared) {
       expect(cleared).toBe(true);
     });


     dataTable.goToInstrument_ProductName(product).then(function (navigated) {
       expect(navigated).toBe(true);
     });

     // Go to SpcRules Page
     dashBoard.goToSpcRuleTab().then(function (navigated) {
       expect(navigated).toBe(true);
     });


     multiPoint.isLevel1CheckBoxChecked().then(function (checked) {
       expect(checked).toBe(true);
     });

     multiPoint.isLevel2CheckBoxChecked().then(function (checked) {
       expect(checked).toBe(true);
     });

     multiPoint.isLevel3CheckBoxChecked().then(function (checked) {
       expect(checked).toBe(true);
     });


     const level1 = true;
     const level1Val = '2';
     const level2 = true;
     const level2Val = '2';
     const level3 = true;
     const level3Val = '2';
     const level4 = false;
     const level4Val = '';
     multiSummary.setDecimalPlaces(level1, level1Val, level2, level2Val, level3, level3Val, level4, level4Val).then(function (level) {
       expect(level).toBe(true);
     });

     // Verify Summary Data Toggle is Disabled
     multiSummary.verifyMultiSummaryEntryDisabled().then(function (disabled) {
       expect(disabled).toBe(true);
     });


     multiSummary.clickApply().then(function (clicked) {
       expect(clicked).toBe(true);
     });


     multiSummary.verifyToastMsg(toastMsg).then(function (msgDisplayed) {
     });

     // Go to Data Table Tab
     dashBoard.goToDataTableTab().then(function (navigated) {
       expect(navigated).toBe(true);
     });


     dataTable.goToInstrument_ProductName(instrument).then(function (navigated) {
       dashBoard.waitForElement();
       expect(navigated).toBe(true);
     });

     multiSummary.clickManuallyEnterData().then(function(clicked){
       expect(clicked).toBe(true);
     });

     multiPoint.verifyIntrumentLevelPageUIElementsSixTests(instrument).then(function (verified) {
       expect(verified).toBe(true);
     });

     dataTable.goToInstrument_ProductName(product).then(function (navigated) {
       dashBoard.waitForElement();
       expect(navigated).toBe(true);
     });

     // Matrix 1
     dataMap.set('11', val1);
     dataMap.set('14', val2);
     dataMap.set('21', val3);
     dataMap.set('24', val4);
     dataMap.set('31', val5);
     dataMap.set('34', val6);
     dataMap.set('41', val7);
     dataMap.set('44', val8);
     dataMap.set('51', val9);
     dataMap.set('54', val10);
     dataMap.set('61', val11);
     dataMap.set('64', val12);
     multiPoint.enterValues(dataMap).then(function (result) {
       expect(result).toBe(true);
     });

     multiPoint.hoverOverTest(test1).then(function(hovered){
       expect(hovered).toBe(true);
     });

     multiSummary.clickShowOptionnew().then(function(clicked){
       expect(clicked).toBe(true);
     });

     multiPoint.addComment(commentString).then(function(status) {
       expect(status).toBe(true);
     });

     //  multiPoint.enterComment(commentString).then(function (status) {
     //    expect(status).toBe(true);
     //  });

     // Step 6
     multiSummary.clickSubmitButton().then(function (clicked) {
       expect(clicked).toBe(true);
     });

     // Substep 1
     // Verifying Values for Level 1 & Level 2 all tests
     // Substep 2
     // Verifying Decimal Values for Level 1 all tests
        // Verifying Decimal Values for Level 2 all tests
     multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val2, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL2AllTest(level2Val, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });


     multiPoint.verifyEnteredValueStoredL1AllTest(val3, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val4, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL2AllTest(level2Val, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val5, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val6, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL2AllTest(level2Val, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val7, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val8, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL2AllTest(level2Val, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val9, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val10, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL2AllTest(level2Val, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val11, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val12, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL2AllTest(level2Val, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     // Substep 3

     multiPoint.verifyPezCommentToolTip(commentString).then(function (doneThat) {
       expect(doneThat).toBe(true);
     });

     // Substep 4
     dataTable.verifyCommentSection(expectedCommentCount).then(function (comment1) {
       expect(comment1).toBe(true);
     });

     dataTable.verifytheReviewSummaryPage().then(function (review) {
       expect(review).toBe(true);
     });

     multiPoint.clickOnDoneButton().then(function (status) {
       expect(status).toBe(true);
     });

     // Substep 5
     dataTable.verifyInteractionIconButtonOnProductLevel().then(function (disabled) {
       expect(disabled).toBe(true);
     });

     // Step 7
     console.log('Matrix 2');
     // Matrix 2 - Level 1 & Level 3 Data
     dataMap1.set('11', val1);
     dataMap1.set('17', val2);
     dataMap1.set('21', val3);
     dataMap1.set('27', val4);
     dataMap1.set('31', val5);
     dataMap1.set('37', val6);
     dataMap1.set('41', val7);
     dataMap1.set('47', val8);
     dataMap1.set('51', val9);
     dataMap1.set('57', val10);
     dataMap1.set('61', val11);
     dataMap1.set('67', val12);
     multiPoint.enterValues(dataMap1).then(function (result) {
       expect(result).toBe(true);
     });

     multiPoint.enterCommentForAllTests(string1, test1).then(function (added) {
       expect(added).toBe(true);
     });

     multiPoint.enterCommentForAllTests(string2, test2).then(function (added) {
       expect(added).toBe(true);
     });

     multiPoint.enterCommentForAllTests(string3, test3).then(function (added) {
       expect(added).toBe(true);
     });

     multiPoint.enterCommentForAllTests(string4, test4).then(function (added) {
       expect(added).toBe(true);
     });

     multiPoint.enterCommentForAllTests(string5, test5).then(function (added) {
       expect(added).toBe(true);
     });

     multiPoint.enterCommentForAllTests(string6, test6).then(function (added) {
       expect(added).toBe(true);
     });

     multiSummary.clickSubmitButton().then(function (clicked) {
       expect(clicked).toBe(true);
     });

     // Verifying Values for Level 1 all tests
         // Verifying Values for Level 3 all tests
     //  // Verifying Decimal Values for Level 1 all tests
     // Verifying Decimal Values for Level 3 all tests
     multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val2, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL3AllTest(level3Val, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val3, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val4, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyDecimalValueL3AllTest(level3Val, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val5, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyEnteredValueStoredL3AllTest(val6, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyDecimalValueL3AllTest(level3Val, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });


     multiPoint.verifyEnteredValueStoredL1AllTest(val7, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyEnteredValueStoredL3AllTest(val8, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyDecimalValueL3AllTest(level3Val, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyEnteredValueStoredL1AllTest(val9, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyEnteredValueStoredL3AllTest(val10, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL3AllTest(level3Val, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });


     multiPoint.verifyEnteredValueStoredL1AllTest(val11, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyEnteredValueStoredL3AllTest(val12, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyDecimalValueL1AllTest(level1Val, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });
     multiPoint.verifyDecimalValueL3AllTest(level3Val, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     // Verify Pez Comment Icon for all 6 tests
     multiPoint.verifyPezCommentToolTipAllTest(string1, test1).then(function (verified) {
       expect(verified).toBe(true);
     });

     multiPoint.verifyPezCommentToolTipAllTest(string2, test2).then(function (verified) {
       expect(verified).toBe(true);
     });

     multiPoint.verifyPezCommentToolTipAllTest(string3, test3).then(function (verified) {
       expect(verified).toBe(true);
     });

     multiPoint.verifyPezCommentToolTipAllTest(string4, test4).then(function (verified) {
       expect(verified).toBe(true);
     });

     multiPoint.verifyPezCommentToolTipAllTest(string5, test5).then(function (verified) {
       expect(verified).toBe(true);
     });

     multiPoint.verifyPezCommentToolTipAllTest(string6, test6).then(function (verified) {
       expect(verified).toBe(true);
     });

     // Verify Pez Comment Number for all 6 tests
     multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test1).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test2).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test3).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test4).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test5).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyCommentNumberAllTest(expectedCommentCount, test6).then(function (verified) {
       expect(verified).toBe(true);
     });

     // Verify Interaction Icn for all 6 tests
     multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test1).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test2).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test3).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test4).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test5).then(function (verified) {
       expect(verified).toBe(true);
     });
     multiPoint.verifyInteractionIconAllTests(expectedInteractionCount, test6).then(function (verified) {
       expect(verified).toBe(true);
     });



     // Matrix 3 - Level 2 & Level 3 Data
     dataMap2.set('14', val7);
     dataMap2.set('17', val8);
     dataMap2.set('24', val9);
     dataMap2.set('27', val10);
     dataMap2.set('34', val11);
     dataMap2.set('37', val12);
     dataMap2.set('44', val13);
     dataMap2.set('47', val14);
     dataMap2.set('54', val15);
     dataMap2.set('57', val16);
     dataMap2.set('64', val17);
     dataMap2.set('67', val18);
     multiPoint.enterValues(dataMap2).then(function (result) {
       expect(result).toBe(true);
     });


     multiSummary.clickSubmitButton().then(function (clicked) {
       expect(clicked).toBe(true);
     });

     // Verifying Values for Level 2 all tests
     // Verifying Values for Level 3 all tests
     multiPoint.verifyEnteredValueStoredL2AllTest(val7, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val8, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val9, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val10, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val11, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val12, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val13, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val14, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val15, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val16, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val17, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val18, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     // Matrix 4 - Level 1 Only
     dataMap3.set('11', val1);
     dataMap3.set('21', val2);
     dataMap3.set('31', val3);
     dataMap3.set('41', val4);
     dataMap3.set('51', val5);
     dataMap3.set('61', val6);
     multiPoint.enterValues(dataMap3).then(function (result) {
       expect(result).toBe(true);
     });

     multiSummary.clickSubmitButton().then(function (clicked) {
       expect(clicked).toBe(true);
     });

     // Verifying Values for Level 1 all tests
     multiPoint.verifyEnteredValueStoredL1AllTest(val1, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val2, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val3, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val4, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val5, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL1AllTest(val6, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });


     // Matrix 5 - Level 2 Only
     dataMap4.set('14', val7);
     dataMap4.set('24', val8);
     dataMap4.set('34', val9);
     dataMap4.set('44', val10);
     dataMap4.set('54', val11);
     dataMap4.set('64', val12);
     multiPoint.enterValues(dataMap4).then(function (result) {
       expect(result).toBe(true);
     });

     multiSummary.clickSubmitButton().then(function (clicked) {
       expect(clicked).toBe(true);
     });


     // Verifying Values for Level 2 all tests
     multiPoint.verifyEnteredValueStoredL2AllTest(val7, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val8, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val9, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val10, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val11, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL2AllTest(val12, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     // Matrix 6 - Level 3 Only
     dataMap5.set('17', val13);
     dataMap5.set('27', val14);
     dataMap5.set('37', val15);
     dataMap5.set('47', val16);
     dataMap5.set('57', val17);
     dataMap5.set('67', val18);
     multiPoint.enterValues(dataMap5).then(function (result) {
       expect(result).toBe(true);
     });

     multiSummary.clickSubmitButton().then(function (clicked) {
       expect(clicked).toBe(true);
     });


     // Verifying Values for Level 3 all tests
     multiPoint.verifyEnteredValueStoredL3AllTest(val13, test1).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val14, test2).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val15, test3).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val16, test4).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val17, test5).then(function (displayed) {
       expect(displayed).toBe(true);
     });

     multiPoint.verifyEnteredValueStoredL3AllTest(val18, test6).then(function (displayed) {
       expect(displayed).toBe(true);
     });
   }); */


  it('Test case 38: Clicking on the Dont Save Data button on the modal when user tries to navigate away from data entry page will navigate you to the new location', function () {
    const instrument1 = jsonData.Dept2Instrument1;  // 'ADVIA 1200';
    const instrument2 = jsonData.Dep2Instrument2cobas;    // jsonData.Dept2Instrument2;  // 'Roche cobas c 501'
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const test2 = jsonData.Dept2Instrument1Prod1Test2; // 'Calcium',
    const test3 = jsonData.Dept2Instrument1Prod1Test3; // 'Creatinine',
    const val1 = '3.15', val2 = '4.15';
    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clearAllTestsData(test1).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiPoint.clearAllTestsData(test2).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiPoint.clearAllTestsData(test3).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiPoint.clickOnBackArrow().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    // Step 5
    const dataMap = new Map<string, string>();
    dataMap.set('11', val1);
    dataMap.set('14', val2);

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiPoint.clickOnBackArrow().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyDontSaveBtnClick(instrument1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyValuesNotStored(val1, val2).then(function (notfound) {
      expect(notfound).toBe(true);
    });

  });

  it('Test case 5: Value Field Verification', function () {
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const dataMap = new Map<string, string>();
    const val = '14';
    const maxLen = jsonData.maxLen;
    const invalidStr = jsonData.invalidString;

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clearAllTestsData(test1).then(function (cleared) {
      expect(cleared).toBe(true);
    });
    multiPoint.clickOnBackArrow().then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyMaxLength(maxLen, 11).then(function (notsaved) {
      expect(notsaved).toBe(true);
    });

    //  multiPoint.verifyValCharType(invalidStr, 11).then(function (status) {
    //    expect(status).toBe(true);
    //  });

    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.verifyEnteredValueStored(val).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });


  it('Test case 10: Verify the comment is displayed correctly in Analyte Point View page', function () {
    const dataMap = new Map<string, string>();
    const val = '18';
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const commentString = jsonData.commentStringTc8;
    const expectedCommentValue = jsonData.expectedCommentValue;

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiPoint.hoverOverTest(test).then(function (hovered) {
      expect(hovered).toBe(true);
    });

    multiSummary.clickShowOptionnew().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.addComment(commentString).then(function (status) {
      expect(status).toBe(true);
    });

    //  multiPoint.enterComment(commentString).then(function (status) {
    //    expect(status).toBe(true);
    //  });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.verifyPezCommentToolTip(commentString).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });

    dataTable.verifyCommentSection(expectedCommentValue).then(function (comment1) {
      expect(comment1).toBe(true);
    });
    dataTable.verifytheReviewSummaryPage().then(function (review1) {
      expect(review1).toBe(true);
    });

    multiPoint.clickOnDoneButton().then(function (status) {
      expect(status).toBe(true);
    });

    dataTable.verifyInteractionIconButtonOnProductLevel().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });


  it('Test case 11: Verify the comment Pez count is increased and content are correctly displayed in Analyte Summary View page',
   function () {
    const dataMap = new Map<string, string>();
    const val = '5.82';
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const commentString = jsonData.commentStringTc9;
    const newCommentString = jsonData.newCommentStringTc9;
    const expectedCommentValue1 = jsonData.expectedCommentValue;
    const expectedCommentValue2 = jsonData.expectedCommentValue2;

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    //  multiPoint.clearAllTestsData(test1).then(function (cleared) {
    //    expect(cleared).toBe(true);
    //  });

    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.hoverOverTest(test1).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiSummary.clickShowOptionnew().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.addComment(commentString).then(function (status) {
      expect(status).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyEnteredValueStored(val).then(function (saved) {
      expect(saved).toBe(true);
    });
    multiPoint.verifyPezCommentToolTip(commentString).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    dataTable.verifyCommentSection(expectedCommentValue1).then(function (comment1) {
      expect(comment1).toBe(true);
    });
    newLabSetup.navigateTO(test1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.editComment(val, newCommentString).then(function (status) {
      expect(status).toBe(true);
    });
    multiPoint.clickOnBackArrow().then(function (navigated) {
      expect(navigated).toBe(true);
    });
    multiPoint.verifyPezCommentToolTipForComment2(newCommentString).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
    dataTable.verifyCommentSection(expectedCommentValue2).then(function (comment1) {
      expect(comment1).toBe(true);
    });
    dataTable.verifytheReviewSummaryPage().then(function (review1) {
      expect(review1).toBe(true);
    });
    multiPoint.clickOnDoneButton().then(function (status) {
      expect(status).toBe(true);
    });
    dataTable.verifyInteractionIconButtonOnProductLevel().then(function (disabled) {
      expect(disabled).toBe(true);
    });
  });




  it('Test case 13: Verify the Submit Data button Enables and Disables properly', function () {
    const dataMap = new Map<string, string>();
    const dataMap1 = new Map<string, string>();
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const val = '3';
    const val2 = '6';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyEnteredValueStored(val).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    dataMap1.set('11', val2);
    dataMap1.set('14', ' ');
    multiPoint.enterValues(dataMap1).then(function (result) {
      expect(result).toBe(true);
    });
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiPoint.clearValuesDeleteBtn(dataMap1).then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });
    multiPoint.refresh().then(function (refreshed) {
      expect(refreshed).toBe(true);
    });
  });

  // Test case 8
  it('Test case 29: Run Entry: Verification for all data values in Analyte Point View page are correct using the tab Key', function () {
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const setVal1 = '9', setVal2 = '8', setVal3 = '7', setVal4 = '6', setVal5 = '5', setVal6 = '4';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyRunEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    //  Entering correct data
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '2');
    dataEnter.set('14', '4');
    dataEnter.set('21', '6');
    dataEnter.set('24', '8');
    dataEnter.set('31', '10');
    dataEnter.set('34', '12');


    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '31');
    tabFocusedElement1.set('31', '34');
    tabFocusedElement1.set('34', '35');


    multiPoint.verifyRunEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });

    // Submit Button Enabled
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });

    //  Entering Incorrect data
    const dataEnter1 = new Map<string, string>();
    dataEnter.set('11', ' ');
    dataEnter.set('14', ' ');
    dataEnter.set('21', ' ');
    dataEnter.set('24', ' ');
    dataEnter.set('31', '.');
    dataEnter.set('34', '.');

    const tabFocusedElement2 = new Map<string, string>();
    tabFocusedElement2.set('11', '14');
    tabFocusedElement2.set('14', '21');
    tabFocusedElement2.set('21', '24');
    tabFocusedElement2.set('24', '31');
    tabFocusedElement2.set('31', '34');
    tabFocusedElement2.set('34', '35');


    //  Enter Values in Run Entry
    multiPoint.verifyRunEntry(dataEnter, tabFocusedElement2).then(function (result) {
      expect(result).toBe(true);
    });

    // Submit Button Disabled
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });

    const dataMap = new Map<string, string>();
    dataMap.set('11', setVal1);
    dataMap.set('14', setVal2);
    dataMap.set('21', setVal3);
    dataMap.set('24', setVal4);
    dataMap.set('31', setVal5);
    dataMap.set('34', setVal6);

    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });

    multiPoint.verifyRunEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.verifyEnteredValueStoredT3L2(setVal1, setVal2, setVal3, setVal4, setVal5, setVal6).then(function (result) {
      expect(result).toBe(true);
    });

    const storedMap = new Map<string, string>();
    storedMap.set('11', setVal5);

    multiPoint.enterValues(storedMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
      dashBoard.waitForPage();
    });

    multiPoint.verifyEnteredValueStored(setVal5).then(function (displayed) {
      expect(displayed).toBe(true);
    });
  });




  it('Test case 30: Level Entry: Verification for all data values in Analyte Summary View page are correct using the tab Key', function () {
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const setVal1 = '2', setVal2 = '3', setVal3 = '4', setVal4 = '5', setVal5 = '6', setVal6 = '7';
    const level1Val = '2';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiPoint.verifyLevelEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });

    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    //  Entering correct data
    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '2');
    dataEnter.set('14', '4');
    dataEnter.set('17', '6');
    dataEnter.set('21', '8');
    dataEnter.set('24', '10');
    dataEnter.set('27', '12');


    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '17');
    tabFocusedElement1.set('17', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '27');
    tabFocusedElement1.set('27', '35');


    multiPoint.verifyLevelEntry(dataEnter, tabFocusedElement1).then(function (result) {
      expect(result).toBe(true);
    });

    // Submit Button Enabled
    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });

    //  Entering Incorrect data
    const dataEnter1 = new Map<string, string>();
    dataEnter.set('11', ' ');
    dataEnter.set('14', ' ');
    dataEnter.set('17', ' ');
    dataEnter.set('21', ' ');
    dataEnter.set('24', '.');
    dataEnter.set('27', '.');

    const tabFocusedElement2 = new Map<string, string>();
    tabFocusedElement2.set('11', '14');
    tabFocusedElement2.set('14', '17');
    tabFocusedElement2.set('17', '21');
    tabFocusedElement2.set('21', '24');
    tabFocusedElement2.set('24', '27');
    tabFocusedElement2.set('27', '35');


    //  Enter Values in Run Entry
    multiPoint.verifyLevelEntry(dataEnter, tabFocusedElement2).then(function (result) {
      expect(result).toBe(true);
    });

    // Submit Button Disabled
    multiSummary.verifySubmitButtonDisabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });

    const dataMap = new Map<string, string>();
    dataMap.set('11', setVal1);
    dataMap.set('14', setVal2);
    dataMap.set('17', setVal3);
    dataMap.set('21', setVal4);
    dataMap.set('24', setVal5);
    dataMap.set('27', setVal6);

    multiSummary.clickCancelBtn().then(function (cancel) {
      expect(cancel).toBe(true);
    });

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.verifyEnteredValueStoredT3L2(setVal1, setVal2, setVal3, setVal4, setVal5, setVal6).then(function (result) {
      expect(result).toBe(true);
    });

    const storedMap = new Map<string, string>();
    storedMap.set('11', setVal5);

    multiPoint.enterValues(storedMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
      dashBoard.waitForPage();
    });

    multiPoint.verifyEnteredValueStored(setVal5).then(function (displayed) {
      expect(displayed).toBe(true);
    });

  });


  it('Test case 36: Display of modal when user navigates away from data entry page', function () {
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const val1 = '3.15', val2 = '4.15';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    // Step 5
    const dataMap = new Map<string, string>();
    dataMap.set('11', val1);
    dataMap.set('14', val2);

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiPoint.clickOnBackArrow().then(function (product1) {
      expect(product1).toBe(true);
    });

    multiPoint.verifyModalComponent().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    multiPoint.verifyDontSaveBtnClick(jsonData.Dept2Instrument1).then(function (displayed) {
      expect(displayed).toBe(true);
      dashBoard.waitForElement();
    });
  });


  it('Test case 37: Clicking on "X" on the modal for when user navigates away from data entry page, will make the modal disappear and data entered will remain on the data ', function () {
    const product = jsonData.Dept2Instrument1Prod1;  //  Assayed Chemistry';
    const val1 = '3.15', val2 = '4.15';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    // Step 5
    const dataMap = new Map<string, string>();
    dataMap.set('11', val1);
    dataMap.set('14', val2);

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    // Step 6  ;
    multiPoint.clickOnBackArrow().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.verifyModalComponent().then(function (displayed) {
      expect(displayed).toBe(true);
    });

    // Step 7
    multiPoint.closeModalDialog().then(function (closed) {
      expect(closed).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickCancelBtn().then(function (cancle) {
      expect(cancle).toBe(true);
      dashBoard.waitForElement();
    });

  });


  it('Test case 39: Clicking on the Save data and leave page on the modal when user tries to navigate away from data entry page will save the data', function () {
    const instrument1 = jsonData.Dept2Instrument1;  // 'ADVIA 1200';
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const val1 = '3.15', val2 = '4.15';

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    // Step 5
    const dataMap = new Map<string, string>();
    dataMap.set('11', val1);
    dataMap.set('14', val2);

    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    // Step 6
    multiPoint.clickOnBackArrow().then(function (product1) {
      expect(product1).toBe(true);
    });

    // Step 7
    multiSummary.verifySaveBtnClick(instrument1).then(function (clicked) {
      expect(clicked).toBe(true);
    });

    // Step 8
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiPoint.verifyEnteredValueStored(val1).then(function (found) {
      expect(found).toBe(true);
    });

    multiPoint.verifyEnteredValueStoredL2(val2).then(function (found) {
      expect(found).toBe(true);
    });
  });




  it('Test case 40: Verify Multi Point Data Entry with User.', function () {
    const username = jsonData.AmrutaUserRoleUsername;
    const password = jsonData.AmrutaPassword;
    const firstName = jsonData.AmrutaFirstName;
    // const assignedLab = jsonData.assignedLab;
    const product = jsonData.Dept2Instrument1Prod1;  // Assayed Chemistry';
    const test1 = jsonData.Dept2Instrument1Prod1Test1; // 'Albumin'
    const dataMap = new Map<string, string>();
    const val = '5.45';


    out.signOut();
    loginEvent.doLogin(username, password, firstName);

    newLabSetup.navigateTO(jsonData.Dept2).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(jsonData.Dept2Instrument1).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    newLabSetup.navigateTO(product).then(function (navigate) {
      expect(navigate).toBe(true);
    });

    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });

    multiSummary.verifySubmitButtonEnabled().then(function (disabled) {
      expect(disabled).toBe(true);
    });

    multiSummary.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });

    multiPoint.verifyEnteredValueStored(val).then(function (displayed) {
      expect(displayed).toBe(true);
    });

    multiPoint.clearAllTestsData(test1).then(function (cleared) {
      expect(cleared).toBe(true);
    });
  });



  //  Test cases before this
});
