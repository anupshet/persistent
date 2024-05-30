/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { ProductMasterLot } from './page-objects/code-list/products/codelist-products-master-lot.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-products-master-lot.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Products Master Lot Regression Suite', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const prodMasterLot = new ProductMasterLot();

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

  it('Test Case 1: Codelist - Products Master Lot - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Products Master Lot - UI Verification');
    library.logStep('Test Case 2: Codelist - Products Master Lot - Sort');
    const productNameCol = 'Product Name';
    const lotNumberCol = 'Lot Number';
    const totalLevelCol = 'Total Level';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    prodMasterLot.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(productNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(productNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(productNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(productNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(lotNumberCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSortingIntegerData(lotNumberCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(lotNumberCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(lotNumberCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(totalLevelCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSortingIntegerData(totalLevelCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(totalLevelCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSortingIntegerData(totalLevelCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Products Master Lot - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Products Master Lot - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Products Master Lot - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5: CodeList - Products Master Lot - Pagination', function () {
    library.logStep('Test Case 5: CodeList - Products Master Lot - Pagination');
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

  it('Test Case 6: CodeList - Products Master Lot - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Products Master Lot - Download Excel');
    library.logStep('Test Case 7: Products Master Lot - Verify Non 0 IDs');
    const idCol = 'Id';
    const prodcutIdCol = 'ProductId';
    const productNameCol = 'ProductName';
    const lotNumCol = 'LotNumber';
    const totalLevelCol = 'TotalLevel';
    const expiryDateCol = 'ExpirationDate';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, productNameCol, jsonData.ProductName).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, lotNumCol, jsonData.LotNumber).then(function (fileArray) {
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
      await qcp.readCSVCodeList(jsonData.FileName, prodcutIdCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, totalLevelCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Products Master Lot', function () {
    library.logStep('Test Case 8: CodeList - Add New Products Master Lot');
    library.logStep('Test Case 9: CodeList - Edit Products Master Lot');
    library.logStep('Test Case 10: CodeList - Products Master Lot Search-Display in table ');
    library.logStep('Test Case 11: CodeList - Click Cancel on Add Products Master Lot');
    library.logStep('Test Case 12: CodeList - Click Cancel on Edit Products Master Lot');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const lotNumAdd = jsonData.LotNumberAdd + timestamp;
    prodMasterLot.clickOnAddNewProductsMasterLot().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectManufacturerOnAddPage(jsonData.Manufacturer).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectMatrixOnAddPage(jsonData.MatrixName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectProductOnAddPage(jsonData.ProductNameAdd).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.addLotNumber(lotNumAdd).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.addTotalLevels('4').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectExpirationDate('2025', 'Dec', '25').then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(canceled) {
      expect(canceled).toBe(true);
    });
    prodMasterLot.clickOnAddNewProductsMasterLot().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectManufacturerOnAddPage(jsonData.Manufacturer).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectMatrixOnAddPage(jsonData.MatrixName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectProductOnAddPage(jsonData.ProductNameAdd).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.addLotNumber(lotNumAdd).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.addTotalLevels('4').then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectExpirationDate('2025', 'Dec', '25').then(function (added) {
      expect(added).toBe(true);
    });
    prodMasterLot.clickOnAddOnNewProductsMasterLot().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.selectManufacturer(jsonData.Manufacturer).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectMatrix(jsonData.MatrixName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectProduct(jsonData.ProductNameAdd).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.addSearchItemName(lotNumAdd).then(function (searched) {
      expect(searched).toBe(true);
    });
    prodMasterLot.verifyProductLotAdded(lotNumAdd).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(lotNumAdd).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(lotNumAdd).then(function (verified) {
      expect(verified).toBe(true);
    });
    prodMasterLot.selectExpirationDate('2026', 'Jul', '20').then(function (added) {
      expect(added).toBe(true);
    });
    prodMasterLot.clickOnAddOnNewProductsMasterLot().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.selectManufacturer(jsonData.Manufacturer).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectMatrix(jsonData.MatrixName).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    prodMasterLot.selectProduct(jsonData.ProductNameAdd).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.addSearchItemName(lotNumAdd).then(function (searched) {
      expect(searched).toBe(true);
    });
    prodMasterLot.verifyProductLotEdited('2026', 'Jul', '20').then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
