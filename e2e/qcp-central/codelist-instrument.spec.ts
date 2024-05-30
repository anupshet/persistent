/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary} from '../utils/browserUtil';
import { Instrument } from './page-objects/code-list/codelist-instrument.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;


const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-instrument.json').then(function(data) {
  jsonData = data;
});


describe('Test Suite: Codelist-Instrument Regression Suite', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const instrument = new Instrument();

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

  it('Test Case 1: Codelist - Instrument - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Instrument - UI Verification');
    library.logStep('Test Case 2: Codelist - Instrument - Sort');
    const instrumentNameCol = 'Instrument Name';
    const manufactureNameCol = 'Manufacturer Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    instrument.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(instrumentNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(instrumentNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(instrumentNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(instrumentNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(manufactureNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(manufactureNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(manufactureNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(manufactureNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Instrument - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Instrument - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Codelist - Instrument - Verify Table Result info is diplayed with selected number');
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
    qcp.verifyTableResultInfo(jsonData.PageOptions[2]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[3]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[3]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo(jsonData.PageOptions[3]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[0]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[0]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableResultInfo(jsonData.PageOptions[0]).then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  it('Test Case 5: CodeList - Instrument - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Instrument - Pagination');
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

  it('Test Case 6: CodeList - Instrument  - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Instrument - Download Excel');
    library.logStep('Test Case 7: CodeList - Verify Non 0 ID');
    const instrumentNameCol = 'Name';
    const instrumentIDCol = 'Id';
    const maanufactureIDCol = 'ManufacturerId';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, instrumentNameCol, jsonData.Instrument).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, instrumentIDCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, maanufactureIDCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Instrument', function () {
    library.logStep('Test Case 8: CodeList - Add New Instrument');
    library.logStep('Test Case 9: CodeList - Edit Instrument');
    library.logStep('Test Case 10: CodeList - Instrument Search-Display in table');
    library.logStep('Test Case 11: CodeList - Click Close on Add Instrument');
    library.logStep('Test Case 12: CodeList - Click Close on Edit Instrument');
    library.logStep('Test Case 13: CodeList - Verify Manufacturer disable');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const instrumentName = jsonData.NewInstrumentName + timestamp;
    const instrumentEdited = instrumentName + '_Edited';
    const ManufacturerName = jsonData.ManufacturerName;
    instrument.clickOnAddInstrument().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    instrument.clickOnAddInstrument().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    instrument.addNewInstrument(ManufacturerName, instrumentName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(instrumentName).then(function (searched) {
      expect(searched).toBe(true);
    });
    instrument.verifyInstrumentAdded(instrumentName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(instrumentName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(instrumentName).then(function(verified) {
      expect(verified).toBe(true);
    });
    instrument.verifyManufacturerDisabled().then(function (added) {
      expect(added).toBe(false);
    });
    instrument.editInstrumentsName(instrumentEdited).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(instrumentEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    instrument.verifyInstrumentAdded(instrumentEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});
