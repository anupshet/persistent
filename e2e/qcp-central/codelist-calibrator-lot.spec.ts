/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { CalibratorLots } from './page-objects/code-list/calibrator/codelist-calibrator-lots.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./e2e/qcp-central/test-data/codelist-calibrator-lot.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Calibrator Lots Regression List', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const calibratorlot = new CalibratorLots();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (expanded) {
      expect(expanded).toBe(true);
    });
    qcp.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1:Codelist - Calibrator-Calibrator Lots - UI Verification', function () {
    library.logStep('Test Case 1:Codelist - Calibrator-Calibrator Lots - UI Verification');
    library.logStep('Test Case 2:Codelist - Calibrator-Calibrator Lots - Sort');
    const CalibratorNameCol = 'Calibrator Name';
    const LotNumberCol = 'Lot Number';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    calibratorlot.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(CalibratorNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(CalibratorNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(CalibratorNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(CalibratorNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    calibratorlot.clickOnColumnToSortCalibratorLotPage(LotNumberCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSortingIntegerData(LotNumberCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    calibratorlot.clickOnColumnToSortCalibratorLotPage(LotNumberCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    // qcp.verifyAscendingSorting(LotNumberCol).then(function (clicked) {
    //   expect(clicked).toBe(true);
    // });
  });

  it('Test Case 3:Codelist - Calibrator-Calibrator Lots - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3:Codelist - Calibrator-Calibrator Lots - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Calibrator-Calibrator Lots - Verify Table Result info is diplayed with selected number');
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[2]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[2]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[3]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[3]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[0]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[0]).then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  it('Test Case 5:CodeList - Calibrator-Calibrator Lots - Pagination', function () {
    library.logStep('Test Case 5:CodeList - Calibrator-Calibrator Lots - Pagination');
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.isPrevButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(false);
    });
    qcp.isNextButtonEnabled().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickPageNumButtonPagination(jsonData.PageButton).then(function (clicked) {
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

  it('Test Case 6:CodeList - Calibrator-Calibrator Lots - Download Excel', function () {
    library.logStep('Test Case 6:CodeList - Calibrator-Calibrator Lots - Download Excel');
    library.logStep('Test Case 7:CodeList - Calibrator-Calibrator Lots - ID Non zero verification');
    library.logStep('Test Case 8:CodeList - Calibrator-Calibrator Lots - Calibrator ID Non zero verification');
    const CalibratorNameCol = 'CalibratorName';
    const IDCol = 'Id';
    const CalibratorIDCol = 'CalibratorId';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, CalibratorNameCol, jsonData.Calibrator).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, IDCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, CalibratorIDCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 9:CodeList - Add New Calibrator-Calibrator Lots', function () {
    library.logStep('Test Case 9:CodeList - Add New Calibrator-Calibrator Lots');
    library.logStep('Test Case 10:CodeList - Calibrator Lots Search-Display in table ');
    library.logStep('Test Case 11:CodeList - Verify Reload Button');
    library.logStep('Test Case 12:CodeList - Delete Calibrator Lots Analyte');
    library.logStep('Test Case 13: CodeList - Click Close on Add Calibrator Lots');
    library.logStep('Test Case 14: CodeList - Click Cancel on delete Calibrator Lots');
    library.logStep('Test Case 15: CodeList - Edit Calibrator Lot');
    library.logStep('Test Case 16: CodeList - Click Cancel on Edit Calibrator Lots');
    library.logStep('Test Case 17: CodeList - Calibrator showing in disable mode on Edit Calibrator Lots');
    library.logStep('Test Case 18: CodeList - Unspecified lot can not be edit in Calibrator Lots');
    library.logStep('Test Case 19: CodeList - Unspecified lot can not be delete in Calibrator Lots');
    const CalibratorName = jsonData.Calibrator;
    const LotNumber = jsonData.LotNumber;
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const lotNumber = jsonData.LotNumber + timestamp;
    const lotNumberEdited = lotNumber + '_Edited';
    const UnspecifiedLotNumber = jsonData.UnspecifiedLotNumber ;
    let expected;
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    calibratorlot.readCalibratorName().then(function (verified) {
      expected = verified;
      expect(verified).not.toBe('undefined');
    });
    calibratorlot.clickOnAddCalibratorLots().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.clickOnAddCalibratorLots().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    calibratorlot.selectNewCalibrator(CalibratorName).then(function (added) {
      expect(added).toBe(true);
    });
    calibratorlot.addNewLotNumber(LotNumber).then(function (added) {
      expect(added).toBe(true);
    });
    calibratorlot.selectExpDate(jsonData.ExpiryDateYear, jsonData.ExpiryDateMonth, jsonData.ExpiryDateDay).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    calibratorlot.clickOnSubmit().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.ToastMessageAdded).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.addSearchItemName(LotNumber).then(function (searched) {
      expect(searched).toBe(true);
    });
    calibratorlot.verifyCalibratorLotAdded(LotNumber).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(LotNumber).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(LotNumber).then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.verifyCalibratorDisabled().then(function (added) {
      expect(added).toBe(false);
    });
    calibratorlot.addNewLotNumber(lotNumberEdited).then(function (added) {
      expect(added).toBe(true);
    });
    calibratorlot.clickOnEditSubmit().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.ToastMessageEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.addSearchItemName(lotNumberEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    calibratorlot.verifyCalibratorLotAdded(lotNumberEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(lotNumberEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DeleteConfirmationMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(lotNumberEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.selectCalibrator(CalibratorName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickReloadButton().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    calibratorlot.verifyCalibratorLotAdded(expected).then(function (verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.selectCalibrator(jsonData.Calibrator).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.addSearchItemName(UnspecifiedLotNumber).then(function (searched) {
      expect(searched).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(UnspecifiedLotNumber).then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.verifyUnspefiedConfirmationMessage(jsonData.UnspecifiedConfirmationmessageEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.clickOnOkButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(UnspecifiedLotNumber).then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.verifyUnspefiedConfirmationMessage(jsonData.UnspecifiedConfirmationmessageDeleted).then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.clickOnOkButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.selectCalibrator(jsonData.AnalyteCalibratorName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.addSearchItemName(jsonData.CalibratorLotNumber).then(function (searched) {
      expect(searched).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(jsonData.CalibratorLotNumber).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.verifyDependecncyMessage(jsonData.DependencyConfirmationmessageDeleted).then(function(verified) {
      expect(verified).toBe(true);
    });
    calibratorlot.clickOnOkButton().then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});

