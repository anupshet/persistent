/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary} from '../utils/browserUtil';
import { UnitCategory } from './page-objects/code-list/units/codelist-unit-categories.po';
import { UnitNames } from './page-objects/code-list/units/codelist-unit-names.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();

library.parseJson('./e2e/qcp-central/test-data/codelist-unit-categories.json').then(function(data) {
  jsonData = data;
});
describe('Test Suite: Codelist-Unit Category Regression Suite', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const unitCategory = new UnitCategory();
  const unit = new UnitNames();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (expanded) {
      expect(expanded).toBe(true);
    });
    unit.selectSubMenuOption(jsonData.SubMenu , jsonData.SubMenuOption).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: Codelist - Unit Category - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Unit Category - UI Verification');
    library.logStep('Test Case 2: Codelist - Unit Category - Sort');
    const unitCategoryNameCol = 'Unit Category Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    unitCategory.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(unitCategoryNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(unitCategoryNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(unitCategoryNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(unitCategoryNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Unit Category - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Unit Category - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Unit Category - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5: CodeList - Unit Category - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Unit Category - Pagination');
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

  it('Test Case 6: CodeList - Unit Category - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Unit Category - Download Excel');
    library.logStep('Test Case 7: Unit Category - Verify Non 0 ID');
    const unitCatNameCol = 'Name';
    const unitCatIDCol = 'Id';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitCatNameCol, jsonData.UnitCategory).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitCatIDCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: Add New Unit Category', function () {
    library.logStep('Test Case 8: Add New Unit Category');
    library.logStep('Test Case 9: Edit Unit Category');
    library.logStep('Test Case 10: Unit Category Search-Display in table');
    library.logStep('Test Case 11: Click Cancel on Add Unit Category');
    library.logStep('Test Case 12: Click Cancel on Edit Unit Category');
    library.logStep('Test Case 13: Verify warning message on adding Duplicate Unit Category');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const unitCatName = jsonData.NewCategoryName + timestamp;
    const unitCatEdited = unitCatName + '_Edited';
    unitCategory.clickOnAddUnitCategory().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unitCategory.addUnitCategoryName(unitCatName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    unitCategory.clickOnAddUnitCategory().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unitCategory.addUnitCategoryName(unitCatName).then(function (added) {
      expect(added).toBe(true);
    });
    unitCategory.clickAddButtonOnAddUnitCategory().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(unitCatName).then(function (searched) {
      expect(searched).toBe(true);
    });
    unitCategory.verifyUnitCategoryAdded(unitCatName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(unitCatName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    unitCategory.clickOnAddUnitCategory().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unitCategory.addUnitCategoryName(unitCatName).then(function (added) {
      expect(added).toBe(true);
    });
    unitCategory.clickAddButtonOnAddUnitCategory().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DuplicateCategoryWarning).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOkOnWarning().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.addSearchItemName(unitCatName).then(function (searched) {
      expect(searched).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(unitCatName).then(function(verified) {
      expect(verified).toBe(true);
    });
    unitCategory.addUnitCategoryName(unitCatEdited).then(function (added) {
      expect(added).toBe(true);
    });
    unitCategory.clickSubmitButtonOnUpdateUnitCategory().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(unitCatEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    unitCategory.verifyUnitCategoryAdded(unitCatEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});
