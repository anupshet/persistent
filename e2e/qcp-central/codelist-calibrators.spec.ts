/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Calibrators } from './page-objects/code-list/calibrators/codelist-calibrators.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;
const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-calibrator.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Calibrators Regression List', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const calibrator = new Calibrators();

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

  it('Test Case 1:Codelist - Calibartor - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Calibartor - UI Verification');
    library.logStep('Test Case 2: Codelist - Calibartor - Sort');
    const calibratorNameCol = 'Calibrator Name';
    const manufacturerNameCol = 'Manufacturer Name ';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    calibrator.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(calibratorNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(calibratorNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(calibratorNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(calibratorNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(manufacturerNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(manufacturerNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(manufacturerNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(manufacturerNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Calibartor - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Calibartor - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Calibartor - Verify Table Result info is diplayed with selected number');
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
/*
  it('Test Case 5: CodeList - Calibartor - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Calibartor - Pagination');
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

  it('Test Case 6: CodeList - Calibartor - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Calibartor - Download Excel');
    library.logStep('Test Case 7: CodeList - Calibartor - Manufacturer ID Non zero verification');
    const calibId = 'Id';
    const calibNameCol = 'Name';
    const manufacturerCol = 'ManufacturerName';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, calibNameCol, jsonData.Calibrator).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, manufacturerCol, jsonData.Manufacturer).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, calibId, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Calibartor', function () {
    library.logStep('Test Case 8: CodeList - Add New Calibartor');
    library.logStep('Test Case 9: CodeList - Calibartor Search-Display in table ');
    library.logStep('Test Case 10: CodeList - Edit Calibartor');
    library.logStep('Test Case 11: CodeList - Click Cancel on Add Calibartor');
    library.logStep('Test Case 12: CodeList - Click Cancel on Edit Calibartor');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const calibName = jsonData.NewCalibName + timestamp;
    const calibEdited = calibName + '_Edited';
    const ManufacturerName = jsonData.Manufacturer;
    qcp.selectManufacturer(ManufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    calibrator.clickOnAddNewCalibrator().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    calibrator.addNewSelectManufacturer(ManufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    calibrator.addNewCalibratorName(calibName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    calibrator.clickOnAddNewCalibrator().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    calibrator.addNewSelectManufacturer(ManufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    calibrator.addNewCalibratorName(calibName).then(function (added) {
      expect(added).toBe(true);
    });
    calibrator.clickAddOnAddNewCalibrator().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(calibName).then(function (searched) {
      expect(searched).toBe(true);
    });
    calibrator.verifyCalibratorAdded(calibName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(calibName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(calibName).then(function(verified) {
      expect(verified).toBe(true);
    });
    calibrator.addNewCalibratorName(calibEdited).then(function (added) {
      expect(added).toBe(true);
    });
    calibrator.clickOnSubmitOnEdit().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(calibEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    calibrator.verifyCalibratorAdded(calibEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
  }); */
});
