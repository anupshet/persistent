/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Matrices } from './page-objects/code-list/codelist-matrices.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-matrices.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Matrices Regression List', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const matrices = new Matrices();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (expanded) {
      expect(expanded).toBe(true);
    });
    qcp.selectSubMenu(jsonData.SubMenu).then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: Codelist - Matrices - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Matrices - UI Verification');
    library.logStep('Test Case 2: Codelist - Matrices - Sort');
    const MatricesNameCol = 'Matrix Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    matrices.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(MatricesNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(MatricesNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(MatricesNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(MatricesNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Matrices - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Matrices - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Matrices - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5: CodeList - Matrices - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Matrices - Pagination');
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

  it('Test Case 6: CodeList - Matrices - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Matrices - Download Excel');
    library.logStep('Test Case 7: Matrices - Verify Non 0 ID');
    const MatricesNameCol = 'name';
    const MatricesIDCol = 'matrixId';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, MatricesNameCol, jsonData.Matrices).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, MatricesIDCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: Matrices - Add New Matrices', function () {
    library.logStep('Test Case 8: Matrices - Add New Matrices');
    library.logStep('Test Case 9: Matrices - Edit Matrices');
    library.logStep('Test Case 10: Matrices - Matrices Search-Display in table ');
    library.logStep('Test Case 11: Matrices - Click Cancel on Add Matrices');
    library.logStep('Test Case 12: Matrices - Click Cancel on Edit Matrices');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const MatrixName = jsonData.NewMatrixName + timestamp;
    const MatricesEdited = MatrixName + '_Edited';
    matrices.clickOnAddMatrices().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    matrices.addMatricesName(MatrixName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    matrices.clickOnAddMatrices().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    matrices.addMatricesName(MatrixName).then(function (added) {
      expect(added).toBe(true);
    });
    matrices.clickAddOnAddMatricesPopup().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(MatrixName).then(function (searched) {
      expect(searched).toBe(true);
    });
    matrices.verifyMatricesAdded(MatrixName).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(MatrixName).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(MatrixName).then(function (verified) {
      expect(verified).toBe(true);
    });
    matrices.addMatricesName(MatricesEdited).then(function (added) {
      expect(added).toBe(true);
    });
    matrices.clickAddOnAddMatricesPopup().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(MatricesEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    matrices.verifyMatricesAdded(MatricesEdited).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
