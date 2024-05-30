/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Reagents } from './page-objects/code-list/reagents/codelist-reagents.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-reagents.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Reagents Regression List', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const reagents = new Reagents();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (expanded) {
      expect(expanded).toBe(true);
    });
    reagents.goToReagents().then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1:Codelist - Reagents-Reagents - UI Verification', function () {
    library.logStep('Test Case 1:Codelist - Reagents-Reagents - UI Verification');
    library.logStep('Test Case 2:Codelist - Reagents-Reagents - Sort');
    const ReagentNameCol = 'Reagent Name';
    const ManufacturerNameCol = 'Manufacturer Name ';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    reagents.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(ReagentNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(ReagentNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(ReagentNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(ReagentNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(ManufacturerNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(ManufacturerNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(ManufacturerNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(ManufacturerNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3:Codelist -Reagents-Reagents - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3:Codelist - Reagents-Reagents - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4:Codelist - Reagents-Reagents - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5:CodeList - Reagents-Reagents - Pagination', function () {
    library.logStep('Test Case 5:CodeList - Reagents-Reagents - Pagination');
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

  it('Test Case 6:CodeList - Reagents-Reagents - Download Excel', function () {
    library.logStep('Test Case 6:CodeList - Reagents-Reagents - Download Excel');
    library.logStep('Test Case 7:CodeList - Reagents-Reagents - Manufacturer ID Non zero verification');
    const ReagentNameCol = 'Name';
    const ManufaturerIDCol = 'ManufacturerId';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, ReagentNameCol, jsonData.Reagents).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, ManufaturerIDCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8:CodeList - Add New Reagents', function () {
    library.logStep('Test Case 8:CodeList - Add New Reagents');
    library.logStep('Test Case 9:CodeList - Reagents Search-Display in table ');
    library.logStep('Test Case 10:CodeList - Edit Reagents');
    library.logStep('Test Case 11: CodeList - Click Cancel on Add Reagents');
    library.logStep('Test Case 12: CodeList - Click Cancel on Edit Reagents');
    library.logStep('Test Case 13: CodeList - Verify Manufacturer disable');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const reagentName = jsonData.NewReagentName + timestamp;
    const reagentEdited = reagentName + '_Edited';
    const ManufacturerName = jsonData.ManufacturerName;
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    reagents.clickOnAddNewReagent().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    reagents.clickOnAddNewReagent().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagents.addNewSelectManufacturer(ManufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    reagents.addNewEnterReagent(reagentName).then(function (added) {
      expect(added).toBe(true);
    });
    reagents.clickOnAdd().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(reagentName).then(function (searched) {
      expect(searched).toBe(true);
    });
    reagents.verifyReagentsAdded(reagentName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(reagentName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(reagentName).then(function(verified) {
      expect(verified).toBe(true);
    });
    reagents.verifyManufacturerDisabled().then(function (added) {
      expect(added).toBe(false);
    });
    reagents.addNewEnterReagent(reagentEdited).then(function (added) {
      expect(added).toBe(true);
    });
    reagents.clickOnSubmit().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(reagentEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    reagents.verifyReagentsAdded(reagentEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.selectManufacturer(ManufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    reagents.verifyManufacturerSelected(ManufacturerName).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
