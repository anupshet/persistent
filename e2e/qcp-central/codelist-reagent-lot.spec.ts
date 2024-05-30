/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { ReagentLots } from './page-objects/code-list/reagents/codelist-reagent-lots.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

// QA
const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-reagent-lot.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Reagent Lot Regression Suite', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const reagLot = new ReagentLots();

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

  it('Test Case 1: Codelist - Reagent Lot - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Reagent Lot - UI Verification');
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    reagLot.uiVerification().then(function (verified) {
      expect(verified).toBe(true);
    });
  });

  it('Test Case 2: Codelist - Reagent Lot - Sort', function () {
    library.logStep('Test Case 2: Codelist - Reagent Lot - Sort');
    const reagentNameCol = 'Reagent Name';
    const lotNumberCol = 'Lot Number';
    const expiryDateCol = 'Expiration Date';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(reagentNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(reagentNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(reagentNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(reagentNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.clickOnColumnToSortReagentLotPage(lotNumberCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSortingIntegerData(lotNumberCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.clickOnColumnToSortReagentLotPage(lotNumberCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(lotNumberCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.clickOnColumnToSortReagentLotPage(expiryDateCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(expiryDateCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.clickOnColumnToSortReagentLotPage(expiryDateCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSortingIntegerData(expiryDateCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Reagent Lot - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Reagent Lot - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Reagent Lot - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5: CodeList - Reagent Lot - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Reagent Lot - Pagination');
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

  it('Test Case 6: CodeList - Reagent Lot - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Reagent Lot - Download Excel');
    library.logStep('Test Case 7: CodeList - Reagent Lot  - Verify Data');
    library.logStep('Test Case 8: CodeList - Reagent Lot  - Verify non zero IDs');
    const idCol = 'Id';
    const reagentIdCol = 'ReagentId';
    const reagentNameCol = 'ReagentName';
    const lotNumCol = 'LotNumber';
    const expiryDateCol = 'ShelfExpirationDate';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, reagentNameCol, jsonData.Reagent).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, lotNumCol, jsonData.DefaultReagent).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, expiryDateCol, jsonData.ExpiryDate).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, idCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, reagentIdCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 9: CodeList - Add New Reagent Lot', function () {
    library.logStep('Test Case 9: CodeList - Add New Reagent Lot');
    library.logStep('Test Case 10: CodeList - Edit Reagent Lot');
    library.logStep('Test Case 11: CodeList - Reagent Lot Search-Display in table ');
    library.logStep('Test Case 12: CodeList - Verify Reload Button');
    library.logStep('Test Case 13: CodeList - Delete Reagent');
    library.logStep('Test Case 14: CodeList - Verify that can not delete Unspecified');
    library.logStep('Test Case 15: CodeList - Click Close on Add Reagent Lot');
    library.logStep('Test Case 16: CodeList - Click Close on Edit Reagent Lot');
    library.logStep('Test Case 17: CodeList - Click Cancel on Delete Reagent Lot');
    const lotNumAdd = jsonData.ReagentLotAdd + 'Added';
    const lotNumEdit = jsonData.ReagentLotAdd + 'Edited';
    reagLot.selectReagent(jsonData.Reagent).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.clickOnAddNewReagentLot().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.addLotNumber(lotNumAdd).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.selectExpirationDate('2025', 'Dec', '25').then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    reagLot.clickOnAddNewReagentLot().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.addLotNumber(lotNumAdd).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.selectExpirationDate('2025', 'Dec', '25').then(function (added) {
      expect(added).toBe(true);
    });
    reagLot.clickOnSubmitLotButton().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.AddLotToastMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickReloadButton().then(function (added) {
      expect(added).toBe(true);
    });
    reagLot.selectReagent(jsonData.Reagent).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.addSearchItemName(lotNumAdd).then(function (searched) {
      expect(searched).toBe(true);
    });
    reagLot.verifyReagentLotAdded(lotNumAdd).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(lotNumAdd).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(lotNumAdd).then(function (verified) {
      expect(verified).toBe(true);
    });
    reagLot.addLotNumber(lotNumEdit).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.selectExpirationDate('2026', 'Jul', '20').then(function (added) {
      expect(added).toBe(true);
    });
    reagLot.clickOnSubmitLotButtonForUpdate().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.EditLotToastMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickReloadButton().then(function (added) {
      expect(added).toBe(true);
    });
    reagLot.selectReagent(jsonData.Reagent).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    reagLot.verifyReagentLotEdited('2026', 'Jul', '20').then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(jsonData.DefaultReagent).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.UnspecifiedNotDeletedMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOkOnWarning().then(function(clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(lotNumEdit).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DeleteConfirmationMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(lotNumEdit).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.DeleteLotToastMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});
