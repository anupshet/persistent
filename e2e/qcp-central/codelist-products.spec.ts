/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { Products } from './page-objects/code-list/products/codelist-products.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-products.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Products Regression List', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const products = new Products();

  beforeEach(function () {
    loginEvent.loginToQCP(jsonData.URL, jsonData.Username, jsonData.Password).then(function (loggedIn) {
      expect(loggedIn).toBe(true);
    });
    qcp.expandMainMenu(jsonData.MainMenu).then(function (expanded) {
      expect(expanded).toBe(true);
    });
    products.goToProducts().then(function (selected) {
      expect(selected).toBe(true);
    });
  });

  afterEach(function () {
    out.signOutQCP();
  });

  it('Test Case 1: Codelist - Products - UI Verification', function () {
    library.logStep('Test Case 1: Codelist - Products - UI Verification');
    library.logStep('Test Case 2: Codelist - Products - Sort');
    const ProductsNameCol = 'Product Name';
    const ManufacturerNameCol = 'Manufacturer Name';
    const MatrixNameCol = 'Matrix Name';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
   products.uiVerification().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnColumnToSort(ProductsNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(ProductsNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(ProductsNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(ProductsNameCol).then(function (clicked) {
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
    qcp.clickOnColumnToSort(MatrixNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSorting(MatrixNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(MatrixNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(MatrixNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3: Codelist - Products - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3: Codelist - Products - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Products - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5: CodeList - Products - Pagination', function () {
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

  it('Test Case 6: CodeList - Products - Download Excel', function () {
    library.logStep('Test Case 6: CodeList - Products - Download Excel');
    library.logStep('Test Case 7: Products - Verify Non 0 ID');
    const ProductsNameCol = 'Name';
    const ProductsIDCol = 'Id';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, ProductsNameCol, jsonData.Products).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, ProductsIDCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 8: CodeList - Add New Products', function () {
    library.logStep('Test Case 8: CodeList - Add New Products');
    library.logStep('Test Case 9: CodeList - Edit Products');
    library.logStep('Test Case 10: CodeList - Products Search-Display in table ');
    library.logStep('Test Case 11: CodeList - Click Cancel on Add Products');
    library.logStep('Test Case 12: CodeList - Click Cancel on Edit Products');
    const year = new Date(new Date().getFullYear().toString()).getTime();
    const timestamp = Date.now() - year;
    const NewProduct = jsonData.NewProductName + timestamp;
    const ProductsEdited = NewProduct + '_Edited';
    const Matrix = jsonData.MatrixName;
    const Manufacturer = jsonData.ManufacturerName;
    products.clickOnAddProducts().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    products.addProducts(NewProduct, Matrix, Manufacturer).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.clickOnCancelButton().then(function (searched) {
      expect(searched).toBe(true);
    });
    products.clickOnAddProducts().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    products.addProducts(NewProduct, Matrix, Manufacturer).then(function (added) {
      expect(added).toBe(true);
    });
    products.clickAddOnAddProductsPopup().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(NewProduct).then(function (searched) {
      expect(searched).toBe(true);
    });
    products.verifyProductsAdded(NewProduct).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(NewProduct).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function (searched) {
      expect(searched).toBe(true);
    });
    qcp.clickOnEditAgainstColumnValue(NewProduct).then(function (verified) {
      expect(verified).toBe(true);
    });
    products.editProductsName(ProductsEdited).then(function (added) {
      expect(added).toBe(true);
    });
    products.clickAddOnAddProductsPopup().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.addSearchItemName(ProductsEdited).then(function (searched) {
      expect(searched).toBe(true);
    });
    products.verifyProductsAdded(ProductsEdited).then(function (verified) {
      expect(verified).toBe(true);
    });
  });
});
