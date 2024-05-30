/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary} from '../utils/browserUtil';
import { Manufacturer } from './page-objects/code-list/codelist-manufacturer.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelistmanufacturer.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Manufacturer Regression Suite', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const manufacturer = new Manufacturer();

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

  it('Test Case 1: Codelist - Manufacturer - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Manufacturer - UI Verification');
    library.logStep('Test Case 2: Codelist - Manufacturer - Sort');
    const manufacturerNameCol = 'Manufacturer Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    manufacturer.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
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

  it('Test Case 3: Codelist - Manufacturer - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Manufacturer - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Manufacturer - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5: CodeList - Manufacturer - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Manufacturer - Pagination');
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

  it('Test Case 6: CodeList - Manufacturer - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Manufacturer - Download Excel');
    library.logStep('Test Case 7: Manufacturer - Verify Non 0 ID');
    const manufacturerNameCol = 'name';
    const manufacturerIDCol = 'manufacturerId';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, manufacturerNameCol, jsonData.Manufacturer).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, manufacturerIDCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Manufacturer', function () {
    library.logStep('Test Case 8: CodeList - Add New Manufacturer');
    library.logStep('Test Case 9: CodeList - Edit Manufacturer');
    library.logStep('Test Case 10: CodeList - Manufacturer Search-Display in table');
    library.logStep('Test Case 11: CodeList - Click Cancel on Add Manufacturer');
    library.logStep('Test Case 12: CodeList - Click Cancel on Edit Manufacturer');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const manufacturerName = jsonData.NewManufacturerName + timestamp;
    const manufacturerEdited = manufacturerName + '_Edited';
    manufacturer.clickOnAddManufacturer().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manufacturer.addManufacturerName(manufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    manufacturer.clickOnAddManufacturer().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    manufacturer.addManufacturerName(manufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    manufacturer.clickAddButtonOnAddManufacturer().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(manufacturerName).then(function (searched) {
      expect(searched).toBe(true);
    });
    manufacturer.verifyManufacturerAdded(manufacturerName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(manufacturerName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(manufacturerName).then(function(verified) {
      expect(verified).toBe(true);
    });
    manufacturer.addManufacturerName(manufacturerEdited).then(function (added) {
      expect(added).toBe(true);
    });
    manufacturer.clickAddButtonOnAddManufacturer().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(manufacturerEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    manufacturer.verifyManufacturerAdded(manufacturerEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});
