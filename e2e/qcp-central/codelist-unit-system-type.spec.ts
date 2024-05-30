/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary} from '../utils/browserUtil';
import { UnitSystemTypes } from './page-objects/code-list/units/codelist-unit-system-type.po';
import { UnitNames } from './page-objects/code-list/units/codelist-unit-names.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const library = new BrowserLibrary();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 900000;

let jsonData;
const filePath = './e2e/qcp-central/test-data/codelist-unit-system-type-qa.json';
library.parseJson(filePath).then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Unit System Type Regression Suite', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const unitSystemType = new UnitSystemTypes();
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

  it('Test Case 1: Codelist - Unit System Type - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Unit System Type - UI Verification');
    library.logStep('Test Case 2: Codelist - Unit System Type - Sort');
    const unitSystemTypeNameCol = 'Unit System Type Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    unitSystemType.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(unitSystemTypeNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(unitSystemTypeNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(unitSystemTypeNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(unitSystemTypeNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Unit System Type - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Unit System Type - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Unit System Type - Verify Table Result info is diplayed with selected number');
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.selectDefaultOptionsDisplayed(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.verifyTableDisplayedWithSelectedNumbers(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(false);
    });
    qcp.verifyTableResultInfo(jsonData.PageOptions[1]).then(function (selected) {
      expect(selected).toBe(false);
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

  it('Test Case 5: CodeList - Unit System Type - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Unit System Type - Pagination');
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
      expect(clicked).toBe(false);
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

  it('Test Case 6: CodeList - Unit System Type - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Unit System Type - Download Excel');
    library.logStep('Test Case 7: Unit System Type - Verify Non 0 ID');
    const unitSysTypeNameCol = 'Name';
    const unitSysTypeIDCol = 'Id';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitSysTypeNameCol, jsonData.UnitSystemType).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitSysTypeIDCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: Add New Unit System Type', function () {
    library.logStep('Test Case 8: Add New Unit System Type');
    library.logStep('Test Case 9: Edit Unit System Type');
    library.logStep('Test Case 10: Unit System Type Search-Display in table');
    library.logStep('Test Case 11: Click Cancel on Add Unit System Type');
    library.logStep('Test Case 12: Click Cancel on Edit Unit System Type');
    library.logStep('Test Case 13: Verify warning message on adding Duplicate Unit System Type');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const unitSysTypeName = jsonData.NewSystemTypeName + timestamp;
    const unitSysTypeEdited = unitSysTypeName + '_Edited';
    unitSystemType.clickOnAddUnitSystemType().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unitSystemType.addUnitSystemTypeName(unitSysTypeName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    unitSystemType.clickOnAddUnitSystemType().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    unitSystemType.addUnitSystemTypeName(unitSysTypeName).then(function (added) {
      expect(added).toBe(true);
    });
    unitSystemType.clickAddButtonOnAddUnitSystemType().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(unitSysTypeName).then(function (searched) {
      expect(searched).toBe(true);
    });
    unitSystemType.verifyUnitSystemTypeAdded(unitSysTypeName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(unitSysTypeName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.addSearchItemName(unitSysTypeName).then(function (searched) {
      expect(searched).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(unitSysTypeName).then(function(verified) {
      expect(verified).toBe(true);
    });
    unitSystemType.addUnitSystemTypeName(unitSysTypeEdited).then(function (added) {
      expect(added).toBe(true);
    });
    unitSystemType.clickSubmitButtonOnUpdateUnitSystemType().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(unitSysTypeEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    unitSystemType.verifyUnitSystemTypeAdded(unitSysTypeEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});
