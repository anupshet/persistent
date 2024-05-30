/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { Analytes } from './page-objects/code-list/analytes/codelist-analytes.po';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary} from '../utils/browserUtil';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();

library.parseJson('./e2e/qcp-central/test-data/codelist-analyte.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Analytes Regression List', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const analyte = new Analytes();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (expanded) {
      expect(expanded).toBe(true);
    });
    qcp.selectSubMenuOptionCodeList(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: Codelist - Analytes - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Analytes - UI Verification');
    library.logStep('Test Case 2: Codelist - Analytes - Sort');
    const analyteNameCol = 'Analyte Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    analyte.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(analyteNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(analyteNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(analyteNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(analyteNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Analytes - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Analytes - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Analytes - Verify Table Result info is diplayed with selected number');
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed('25').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers('25').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo('25').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed('50').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers('50').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo('50').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed('100').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers('100').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo('100').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed('10').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers('10').then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo('10').then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  it('Test Case 5: CodeList - Analytes - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Analytes - Pagination');
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(false);
    });
    qcp.isNextButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickPageNumButtonPagination('2').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isNextButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickPreviosButtonPagination().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(false);
    });
    qcp.isNextButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickNextButtonPagination().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 6: CodeList - Analytes - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Analytes - Download Excel');
    library.logStep('Test Case 7: Analytes - Verify Non 0 ID');
    const analyterNameCol = 'Name';
    const analyteIDCol = 'Id';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, analyterNameCol, jsonData.Analyte).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, analyteIDCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Analyte', function () {
    library.logStep('Test Case 8: CodeList - Add New Analyte');
    library.logStep('Test Case 9: CodeList - Edit Analyte');
    library.logStep('Test Case 10: CodeList - Analyte Search-Display in table ');
    library.logStep('Test Case 11: CodeList - Click Cancel on Add Analyte');
    library.logStep('Test Case 12: CodeList - Click Cancel on Edit Analyte');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const analyteName = jsonData.NewAnalyteName + timestamp;
    const analyteEdited = analyteName + '_Edited';
    analyte.clickOnAddAnalyte().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.addAnalyteName(analyteName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    analyte.clickOnAddAnalyte().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyte.addAnalyteName(analyteName).then(function (added) {
      expect(added).toBe(true);
    });
    analyte.clickAddButtonOnAddAnalyte().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(analyteName).then(function (searched) {
      expect(searched).toBe(true);
    });
    analyte.verifyAnalyteAdded(analyteName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(analyteName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(analyteName).then(function(verified) {
      expect(verified).toBe(true);
    });
    analyte.addAnalyteName(analyteEdited).then(function (added) {
      expect(added).toBe(true);
    });
    analyte.clickAddButtonOnAddAnalyte().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(analyteEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    analyte.verifyAnalyteAdded(analyteEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});
