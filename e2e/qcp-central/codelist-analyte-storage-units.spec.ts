/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary} from '../utils/browserUtil';
import { QcpCentral } from './page-objects/qcp-base-page.po';
import { AnalyteStorageUnits } from './page-objects/code-list/analytes/codelist-analyte-storage-units.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-analyte-storage-units.json').then(function(data) {
  jsonData = data;
});



describe('Test Suite: Codelist-Analytes Storage Units', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const analyteStorageUnit = new AnalyteStorageUnits();

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

  it('Test Case 1: Codelist - Analyte Storage Units - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Analyte Storage Units - UI Verification');
    library.logStep('Test Case 2: Codelist - Analyte Storage Units - Sort');
    const analyteId = 'Analyte Id';
    const analyteNameCol = 'Analyte Name';
    const unitCategoryNameCol = 'Unit Category Name';
    const unitIdCol = 'Unit Id';
    const unitNameCol = 'Unit Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    analyteStorageUnit.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(analyteId, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(analyteId).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(analyteId, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSortingIntegerData(analyteId).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(analyteNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.clickOnColumnToSort(analyteNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(analyteNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(analyteNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(analyteNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
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
    qcp.clickOnColumnToSort(unitIdCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(unitIdCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(unitIdCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSortingIntegerData(unitIdCol).then(function (clicked) {
      expect(clicked).toBe(true);
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
  });

  it('Test Case 3: Codelist - Analyte Storage Units - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Analyte Storage Units - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Analytes - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 4: CodeList - Analyte Storage Units - Pagination', function () {
    library.logStep('Test Case 4: CodeList - Analyte Storage Units - Pagination');
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
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

  it('Test Case 5: CodeList - Analyte Storage Units - Download Excel', function () {
    library.logStep('Test Case 5: CodeList - Analyte Storage Units - Download Excel');
    library.logStep('Test Case 6: CodeList - Analyte Storage Units - Verify Data');
    library.logStep('Test Case 7: CodeList - Analyte Storage Units - Verify non 0 IDs');
    const analyteIdCol = 'AnalyteId';
    const analyteNameCol = 'AnalyteName';
    const unitIdCol = 'UnitId';
    const unitNameCol = 'UnitName';
    const unitCategoryIdCol = 'UnitCategoryId';
    const unitCategoryNameCol = 'UnitCategoryName';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, analyteIdCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, analyteNameCol, jsonData.Analyte).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitIdCol, jsonData.UnitId).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }) .then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitIdCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitNameCol , jsonData.UnitName).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitCategoryIdCol , '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function() {
      await qcp.readCSVCodeList(jsonData.FileName, unitCategoryNameCol , jsonData.UnitCategoryName).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function(deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Analyte Storage Units', function () {
    library.logStep('Test Case 8: CodeList - Add New Analyte Storage Units');
    library.logStep('Test Case 9: CodeList - Verify Warning messages - Duplicate Unit Category');
    library.logStep('Test Case 10: CodeList - Verify Reload Button');
    library.logStep('Test Case 11: CodeList - Edit Analyte Storage Units');
    library.logStep('Test Case 12: CodeList - Analyte Storage Units Search-Display in table');
    library.logStep('Test Case 13: CodeList - Delete Analyte Storage Units');
    library.logStep('Test Case 14: Verify Analyte Storage Unit can not be deleted which has dependencies');
    library.logStep('Test Case 15: CodeList - Click Cancel on Add Analyte Storage Unit');
    library.logStep('Test Case 16: CodeList - Click Cancel on Edit Analyte Storage Unit');
    library.logStep('Test Case 17: CodeList - Click Cancel on Delete Analyte Storage Unit');
    const analyteName = jsonData.NewAnalyteName;
    const unitCategory = jsonData.UnitCategoryName;
    const unitName = jsonData.UnitName;
    const unitEdited = jsonData.EditedUnit;
    analyteStorageUnit.selectAnalyte(analyteName).then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.clickOnAddAnalyteStorageUnit().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    analyteStorageUnit.clickOnAddAnalyteStorageUnit().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyteStorageUnit.selectAnalyteName(analyteName).then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.selectUnitCategoryName(unitCategory).then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.selectUnitName(unitName).then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.clickSubmitStorageUnit().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.ToastMessageAdded).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickReloadButton().then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.clickOnAddAnalyteStorageUnit().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    analyteStorageUnit.selectAnalyteName(analyteName).then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.selectUnitCategoryName(unitCategory).then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.selectUnitName(unitName).then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.clickSubmitStorageUnit().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DuplicateUnitCategoryMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOkOnWarning().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseXButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.addSearchItemName(unitCategory).then(function (searched) {
      expect(searched).toBe(true);
    });
    analyteStorageUnit.verifyAnalyteStorageUnitAdded(analyteName, unitCategory, unitName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(unitName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(unitName).then(function(verified) {
      expect(verified).toBe(true);
    });
    analyteStorageUnit.selectUnitName(unitEdited).then(function (added) {
      expect(added).toBe(true);
    });
    analyteStorageUnit.clickSubmitStorageUnit().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickReloadButton().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(unitCategory).then(function (searched) {
      expect(searched).toBe(true);
    });
    analyteStorageUnit.verifyAnalyteStorageUnitAdded(analyteName, unitCategory, unitEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(unitEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(unitEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DeleteConfirmationMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(unitEdited).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.ToastDeleteMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    analyteStorageUnit.selectAnalyte(jsonData.Analyte).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(jsonData.UnitCategoryName).then(function (searched) {
      expect(searched).toBe(true);
    });
    analyteStorageUnit.verifyAnalyteStorageUnitAdded
    (jsonData.Analyte, jsonData.UnitCategoryName, jsonData.UnitName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(jsonData.UnitName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DeleteConfirmationMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DependencyStorageUnitNotDeletedMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOkOnWarning().then(function(verified) {
      expect(verified).toBe(true);
    });
  });
});
