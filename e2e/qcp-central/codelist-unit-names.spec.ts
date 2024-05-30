/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { UnitNames } from './page-objects/code-list/units/codelist-unit-names.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-unit-names.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist- Unit Names Regression List', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
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

  it('Test Case 1: Codelist - Unit Names - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Unit Names  - UI Verification');
    library.logStep('Test Case 2: Codelist - Unit Names  - Sort');
    const unitNameCol = 'Unit Name';
    const unitCategoryCol = 'Unit Category Name';
    const unitSystemTypeCol = 'Unit System Type Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    unit.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(unitNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(unitNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(unitNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(unitNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(unitCategoryCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(unitCategoryCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(unitCategoryCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(unitCategoryCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(unitSystemTypeCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(unitSystemTypeCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(unitSystemTypeCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(unitSystemTypeCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Unit Names  - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Unit Names  - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Unit Names  - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5: CodeList - Unit Names  - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Unit Names - Pagination');
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

  it('Test Case 6: CodeList - Unit Names  - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Unit Names  - Download Excel');
    library.logStep('Test Case 7: Unit Names  - Verify Non 0 ID');
    const idCol = 'Id';
    const unitNameCol = 'Name';
    const unitCategoryIdCol = 'UnitCategoryId';
    const unitCategoryNameCol = 'UnitCategoryName';
    const unitSystemTypeIdCol = 'UnitSystemTypeId';
    const unitSystemTypeNameCol = 'UnitSystemTypeName';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, unitNameCol, jsonData.UnitName).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, unitCategoryNameCol, jsonData.UnitCategory).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, unitSystemTypeNameCol, jsonData.UnitSystemType).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, idCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, unitCategoryIdCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, unitSystemTypeIdCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Unit Names ', function () {
    library.logStep('Test Case 8: CodeList - Add New Unit Names ');
    library.logStep('Test Case 9: CodeList - Edit Unit Names ');
    library.logStep('Test Case 10: CodeList - Unit Names  Search-Display in table ');
    library.logStep('Test Case 11: CodeList - Click Cancel on Add Unit Names ');
    library.logStep('Test Case 12: CodeList - Click Cancel on Edit Unit Names ');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const newUnit = jsonData.NewUnitName + timestamp;
    const unitEdited = newUnit + '_Edited';
    const catgoryName = jsonData.UnitCategory;
    const systemType = jsonData.UnitSystemType;
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    unit.clickOnAddNewUnit().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unit.addUnitName(newUnit).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCancelButton().then(function (searched) {
      expect(searched).toBe(true);
    });
    unit.clickOnAddNewUnit().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unit.addUnitName(newUnit).then(function (added) {
      expect(added).toBe(true);
    });
    unit.selectUnitCategoryName(catgoryName).then(function (added) {
      expect(added).toBe(true);
    });
    unit.selectUnitSystemType(systemType).then(function (added) {
      expect(added).toBe(true);
    });
    unit.clickAddButtonOnAddUnit().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(newUnit).then(function (searched) {
      expect(searched).toBe(true);
    });
    unit.verifyUnitAdded(newUnit).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(newUnit).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function (searched) {
      expect(searched).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(newUnit).then(function (verified) {
      expect(verified).toBe(true);
    });
    unit.addUnitName(unitEdited).then(function (added) {
      expect(added).toBe(true);
    });
    unit.clickAddButtonOnAddUnit().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(unitEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    unit.verifyUnitAdded(unitEdited).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
