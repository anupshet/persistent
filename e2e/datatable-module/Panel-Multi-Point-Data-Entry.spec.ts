/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { MultiSummary } from '../page-objects/multi-summary-e2e.po';
import { NewLabSetup } from '../page-objects/new-labsetup-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { SingleSummary } from '../page-objects/single-summary.po';
import { Settings } from '../page-objects/settings-labsetup-e2e.po';
import { Panels } from '../page-objects/panels-e2e.po';
import { MultiPointDataEntryInstrument } from '../page-objects/Multi-Point_new.po';


const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./JSON_data/Panel_MultiPoint.json').then(function(data) {
  jsonData = data;
});

describe('Point Data Entry', function () {
  browser.waitForAngularEnabled(false);
  const newLabSetup = new NewLabSetup();
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const multiSummary = new MultiSummary();
  const library = new BrowserLibrary();
  const singleSummary = new SingleSummary();
  const setting = new Settings();
  let flagForIEBrowser: boolean;
  const panel = new Panels();
  const multiPoint = new MultiPointDataEntryInstrument();

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
  it('Test Case 1: To verify the UI of Analyte Multi data table page', function () {
    library.logStep('Test Case 1: To verify the UI of Analyte Multi data table page');
    library.logStep('Test Case 2: To verify the UI of Analyte Multi data table page');
    const val = '1.85';
    const commentString = 'Comment Test';
    const dataMap = new Map<string, string>();
    panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.isNoDataDisplayed(jsonData.Analyte1).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.isNoDataDisplayed(jsonData.Analyte2).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.isNoDataDisplayed(jsonData.Analyte3).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyPanelMultipointUI('2', '', 'Test1536PM_New').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.hoverOverTest(jsonData.Analyte1).then(function (hovered) {
      expect(hovered).toBe(true);
    });
    multiPoint.clickShowOptions().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyOptions().then(function (verified) {
      expect(verified).toBe(true);
    });
    multiSummary.clickBack().then(function (clickedBack) {
      expect(clickedBack).toBe(true);
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
    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.hoverOverTest(jsonData.Analyte1).then(function (hovered) {
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
    multiSummary.clickBack().then(function (clickedBack) {
      expect(clickedBack).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifyCommentSection('1').then(function (comment1) {
      expect(comment1).toBe(true);
    });
    multiPoint.verifytheReviewSummaryPage(jsonData.Analyte1, commentString).then(function (review1) {
      expect(review1).toBe(true);
    });
    multiPoint.verifyInteractionIconButtonOnProductLevel().then(function (disabled) {
      expect(disabled).toBe(true);
    });

  });

  it('Test Case 4: Rows of test data are arranged consecutively by date and time', function () {
    const date = new Date();
    const months = ['JAN', 'FEB', 'MAR', '  `', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currMonth = date.getMonth();
    const currYear = date.getFullYear();
    let year, mon1, mon2, mon3, day1, day2, day3;
    const val = '2.00', val1 = '3.01', val2 = '4.10';
    if (currMonth >= 2) {
      year = currYear;
      mon1 = months[currMonth - 2];
      mon2 = months[currMonth - 1];
      mon3 = months[currMonth];
      day1 = 3;
      day2 = 2;
      day3 = 1;
    } else if (currMonth < 2) {
      year = currYear - 1;
      mon1 = months[currMonth - 2];
      mon2 = months[currMonth - 1];
      mon3 = months[currMonth];
      day1 = 3;
      day2 = 2;
      day3 = 1;
    }
    const dataMap = new Map<string, string>();
    panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.isNoDataDisplayed(jsonData.Analyte2).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.changeDate(year, mon1, day1).then(function (dateChanged) {
      expect(dateChanged).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('21', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredForAnalyte(val, jsonData.Analyte2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    multiPoint.changeDate(year, mon2, day2).then(function (dateChanged) {
      expect(dateChanged).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('21', val1);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredForAnalyte(val1, jsonData.Analyte2).then(function (displayed) {
      expect(displayed).toBe(true);
    });
    /* multiPoint.changeDate(year, mon3, day3).then(function (dateChanged) {
      expect(dateChanged).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('21', val2);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyEnteredValueStoredForAnalyte(val2, jsonData.Analyte2).then(function (displayed) {
      expect(displayed).toBe(true);
    }); */
  });

  it('Test case 5:Run Entry Input Data Verification Using Tab Key (Multi Point)', function () {
    library.logStep('Test case 26:Run Entry Input Data Verification Using Enter Key (Multi Point)');
    panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
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
    dataEnter.set('21', '8');
    dataEnter.set('24', '10');
    dataEnter.set('31', '14');
    dataEnter.set('34', '16');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '31');
    tabFocusedElement1.set('31', '34');
    tabFocusedElement1.set('34', 'End');


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

  it('Test case 6:Level Entry Input Data Verification Using the Tab Key (Multi Point)', function () {
    library.logStep('Test case 25:Level Entry Input Data Verification Using the Enter Key (Multi Point)');
    library.logStep('Test case 6:Level Entry Input Data Verification Using the Tab Key (Multi Point)');
    panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifyLevelEntrySelection().then(function (selected) {
      expect(selected).toBe(true);
    });

    const dataEnter = new Map<string, string>();
    dataEnter.set('11', '2');
    dataEnter.set('14', '4');
    dataEnter.set('17', '8');
    dataEnter.set('21', '10');
    dataEnter.set('24', '14');
    dataEnter.set('27', '16');

    const tabFocusedElement1 = new Map<string, string>();
    tabFocusedElement1.set('11', '14');
    tabFocusedElement1.set('14', '17');
    tabFocusedElement1.set('17', '21');
    tabFocusedElement1.set('21', '24');
    tabFocusedElement1.set('24', '27');
    tabFocusedElement1.set('27', 'End');

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

  it('Test case 7:Value field Verification', function () {
    const invalidPositiveValue = 1234567890123456789;
    const invalidNegativeValue = -1234567890123456789;
    const alphabetvalue = 'abc!@#$%^&*+=';
    const validPositiveValue = '100.2';
    const validNagativeValue = '-10.3';
    panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
    multiPoint.enterData(jsonData.Analyte1, invalidPositiveValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.Analyte1, invalidPositiveValue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.Analyte1, invalidNegativeValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.Analyte1, invalidNegativeValue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.Analyte1, alphabetvalue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.Analyte1, alphabetvalue, 'invalid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.Analyte1, validPositiveValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.Analyte1, validPositiveValue, 'valid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.enterData(jsonData.Analyte1, validNagativeValue).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.compareEnteredValue(jsonData.Analyte1, validNagativeValue, 'valid').then(function (compCorrect1) {
      expect(compCorrect1).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
  });

  it('Test case 8:Prevent selection of month (future month) from beyond current month on Multi Data Table page of Panels',
    function () {
      panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
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
    });

  it('Test case 10:Verify the comment is displayed correctly on Analyte Multi Data Table page',
    function () {
      library.logStep('Test case 11:Verify the comment Pez count is increased and content are correctly displayed on Panel Multi Data Entry page');
      library.logStep('Test case 10:Instrument: Verify the comment is displayed correctly on Analyte Multi Data Table page');
      const dataMap = new Map<string, string>();
      const val = '6.95';
      const commentString = 'Comment one to check comment count';
      const newCommentString = 'Comment two to check comment count';
      const expectedCommentValue1 = '1';
      const expectedCommentValue2 = '2';
      panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiPoint.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      dataMap.set('11', val);
      multiPoint.enterValues(dataMap).then(function (result) {
        expect(result).toBe(true);
      });
     /*  multiPoint.hoverOverTest(jsonData.Analyte1).then(function (hovered) {
        expect(hovered).toBe(true);
      });
      multiPoint.clickShowOptions().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiPoint.addComment(commentString).then(function (status) {
        expect(status).toBe(true);
      }); */
      multiPoint.clickSubmitButton().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiPoint.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiPoint.verifyEnteredValueStored(val).then(function (saved) {
        expect(saved).toBe(true);
      });
      /* multiPoint.verifyPezCommentToolTip(commentString).then(function (doneThat) {
        expect(doneThat).toBe(true);
      });
      multiPoint.verifyCommentSection(expectedCommentValue1).then(function (comment1) {
        expect(comment1).toBe(true);
      }); */
      multiSummary.clickBack().then(function (clickedBack) {
        expect(clickedBack).toBe(true);
      });
      setting.navigateTO(jsonData.Department).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Instrument).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.ControlName).then(function (navigate) {
        expect(navigate).toBe(true);
      });
      setting.navigateTO(jsonData.Analyte1).then(function (navigate) {
        expect(navigate).toBe(true);
      });
    });
  it('Test case 12:Verify the Submit Data button Enables and Disables properly', function () {
    library.logStep('Test case 12:Verify the Submit Data button Enables and Disables properly');
    const dataMap = new Map<string, string>();
    panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
    multiPoint.enterData(jsonData.Analyte1, 5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.verifySubmitButtonEnabled().then(function (submitEnabled) {
      expect(submitEnabled).toBe(true);
    });
    multiPoint.clearData(jsonData.Analyte1).then(function (dataCleared) {
      expect(dataCleared).toBe(true);
    });
    multiPoint.clickCancel().then(function (cancelClicked) {
      expect(cancelClicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
    multiSummary.clickBack().then(function (clickedBack) {
      expect(clickedBack).toBe(true);
    });
    setting.navigateTO(jsonData.Department).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.Instrument).then(function (navigate) {
      expect(navigate).toBe(true);
    });
    setting.navigateTO(jsonData.ControlName).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    setting.navigateTO(jsonData.Analyte1).then(function (navigateControl) {
      expect(navigateControl).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.verifySubmitButtonDisabled().then(function (submitDisabledBefore) {
      expect(submitDisabledBefore).toBe(true);
    });
  });

  /**
   * NOT PRIORITY
   */
  /* it('Test case 23:Verify that User with user role access can enter the data in the panel', function () {
    library.logStep('Test case 23:Verify that User with user role access can enter the data in the panel');
    const dataMap = new Map<string, string>();
    const val = '2.70';
    const commentString = 'Comment added by user ' + jsonData.Analyte2;
    out.signOut().then(function (status) {
      expect(status).toBe(true);
    });
    loginEvent.loginToApplication(jsonData.URL, jsonData.UserRoleUsername,
      jsonData.Password, jsonData.FirstName).then(function (loggedIn) {
        expect(loggedIn).toBe(true);
      });
    panel.clickOnPanelName("test123").then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    dataMap.set('11', val);
    multiPoint.enterValues(dataMap).then(function (result) {
      expect(result).toBe(true);
    });
    multiPoint.hoverOverTest('Ferritin').then(function (hovered) {
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
    multiSummary.clickBack().then(function (clickedBack) {
      expect(clickedBack).toBe(true);
    });
    panel.clickOnPanelName("test123").then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifySpecificAnalyteComment('Ferritin', commentString).then(function (doneThat) {
      expect(doneThat).toBe(true);
    });
  }); */

  it('Test case 19:To Verify that a modal will be displayed if user clicks on any pagination button without saving data',
    function () {
      library.logStep('Test case 19:To Verify that a modal will be displayed if user clicks on any pagination button without saving data');
      library.logStep('Test case 20:Display of modal when user navigates away from data entry page');
      library.logStep('Test case 21:Clicking on the Dont save data button on the modal when user tries to navigate away from data entry page will navigate you to the new location');
      library.logStep('Test case 22:Clicking on the Save this page on the modal when user tries to navigate away from data entry page will save the data');
      panel.clickOnPanelName('Test1536PM_New').then(function (navigate) {
        expect(navigate).toBe(true);
      });
      multiPoint.clickManuallyEnterData().then(function (clicked) {
        expect(clicked).toBe(true);
      });
      multiPoint.enterData('Albumin', 5).then(function (dataEntered) {
        expect(dataEntered).toBe(true);
      });
      setting.navigateTO('Calcium').then(function (navigateControl) {
        expect(navigateControl).toBe(true);
      });
      multiPoint.verifyUnsavedDataDialog().then(function (dialogDisplayed) {
        expect(dialogDisplayed).toBe(true);
      });
      multiPoint.clickDontSaveDataButton().then(function (dontSaveClicked) {
        expect(dontSaveClicked).toBe(true);
      });
      setting.isAnalytePageDisplayed('Calcium').then(function (controlPage) {
        expect(controlPage).toBe(true);
      });
    });


  /*it('Test case 15:Control: To verify ' +
       'that Pagination buttons will be presented on the bottom of the page after 25th Analyte.', function () {
    library.logStep('Test case' +
       ' 15:Control: To verify that Pagination buttons will be presented on the bottom of the page after 25th Analyte.');
    library.logStep('Test case 16:To Verify ' +
       'that user will be navigated to specific page of analytes by clicking on Page number in Pagination Control');
    library.logStep('Test case 17: To Verify that once the user Navigated to the second page back arrow button will be displayed.');
    library.logStep('Test case 18: To Verify that clicking on Back arrow will navigate user to previous page');

    panel.clickOnPanelName("Test25Analytes").then(function (navigate) {
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
  it('Test Case 3: Verify multi-Point page analyte name sorting', function () {
    library.logStep('Test Case 3:Verify multi-Point page analyte name sorting');

    panel.clickOnPanelName("Test1536PM_New").then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.verifySortingByAnalyteNames().then(function (sortingVerified) {
      expect(sortingVerified).toBe(true);
    });
  });

  it('Test case 9:Verify the date displayed correct on Analyte Multi Data Table page', function () {
    library.logStep('Test case 13:Control:Verify Control based multi-point page data on select different Date-Timer Picker');
    library.logStep('Select the date and time prior to default date and time in Date-Timer Picker. +E142')
    panel.clickOnPanelName("Test1536PM_New").then(function (navigate) {
      expect(navigate).toBe(true);
    });
    multiPoint.clickManuallyEnterData().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickChangeDateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickYearMonthSelectorButton().then(function (datePickerClicked) {
      expect(datePickerClicked).toBe(true);
    });
    multiPoint.selectYear('2018').then(function (yearSelected) {
      expect(yearSelected).toBe(true);
    });
    multiPoint.selectMonth('DEC').then(function (yearSelected) {
      expect(yearSelected).toBe(true);
    });
    multiPoint.selectDate('15').then(function (dateSelected) {
      expect(dateSelected).toBe(true);
    });
    multiPoint.enterData(jsonData.Analyte1, 5).then(function (dataEntered) {
      expect(dataEntered).toBe(true);
    });
    multiPoint.clickSubmitButton().then(function (submitClicked) {
      expect(submitClicked).toBe(true);
    });
    multiPoint.verifyDataEntered(jsonData.Analyte1, 5).then(function (noDataVerified) {
      expect(noDataVerified).toBe(true);
    });
    multiPoint.verifyMonthDay('Dec', '15').then(function (dayMonth) {
      expect(dayMonth).toBe(true);
    });
    multiPoint.clickChangeDateButton().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    multiPoint.clickYearMonthSelectorButton().then(function (datePickerClicked) {
      expect(datePickerClicked).toBe(true);
    });
    multiPoint.selectYear('2019').then(function (yearSelected) {
      expect(yearSelected).toBe(true);
    });
    multiPoint.selectMonth('MAR').then(function (yearSelected) {
      expect(yearSelected).toBe(true);
    });
    multiPoint.selectDate('15').then(function (dateSelected) {
      expect(dateSelected).toBe(true);
    });
  }); */

});

