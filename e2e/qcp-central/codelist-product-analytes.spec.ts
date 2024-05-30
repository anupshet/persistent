/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser } from 'protractor';
import { LoginEvent } from '../page-objects/login-e2e.po';
import { LogOut } from '../page-objects/logout-e2e.po';
import { BrowserLibrary } from '../utils/browserUtil';
import { ProductAnaly } from './page-objects/code-list/products/codelist-product-analyte.po';
import { QcpCentral } from './page-objects/qcp-base-page.po';

const fs = require('fs');
let jsonData;

const library = new BrowserLibrary();
library.parseJson('./e2e/qcp-central/test-data/codelist-products-analyte.json').then(function(data) {
  jsonData = data;
});

describe('Test Suite: Codelist-Product Analytes Regression List', function () {
  browser.waitForAngularEnabled(false);
  const loginEvent = new LoginEvent();
  const out = new LogOut();
  const qcp = new QcpCentral();
  const productanalyt = new ProductAnaly();

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

  it('Test Case 1:Codelist - Product-Product Analytes - UI Verification', function () {
    library.logStep('Test Case 1:Codelist - Product-Product Analytes - UI Verification');
    library.logStep('Test Case 2:Codelist - Product-Product Analytes - Sort');
    const ProductsNameCol = 'Product Name';
    const AnalyteNameCol = 'Analyte Name ';
    const sortAsc = 'Ascending';
    const sortDesc = 'Descending';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    productanalyt.uiVerification().then(function (selected) {
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
    qcp.clickOnColumnToSort(AnalyteNameCol, sortDesc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyDescendingSortingIntegerData(AnalyteNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnColumnToSort(AnalyteNameCol, sortAsc).then(function (sorted) {
      expect(sorted).toBe(true);
    });
    qcp.verifyAscendingSorting(AnalyteNameCol).then(function (clicked) {
      expect(clicked).toBe(true);
    });
  });

  it('Test Case 3:Codelist - Product-Product Analytes - Show Entries - 10,25,50,100', function () {
    library.logStep('Test Case 3:Codelist - Product-Product Analytes - Show Entries - 10,25,50,100');
    library.logStep('Test Case 4: Codelist - Product-Product Analytes - Verify Table Result info is diplayed with selected number');
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

  it('Test Case 5:CodeList - Product-Product Analytes - Pagination', function () {
    library.logStep('Test Case 5:CodeList - Product-Product Analytes - Pagination');
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

  it('Test Case 6:CodeList - Product-Product Analytes - Download Excel', function () {
    library.logStep('Test Case 6:CodeList - Product-Product Analytes - Download Excel');
    library.logStep('Test Case 7:CodeList - Product-Product Analytes - Analyte ID Non zero verification');
    library.logStep('Test Case 8:CodeList - Product-Product Analytes - Product ID Non zero verification');
    const AnalyteNameCol = 'AnalyteName';
    const AnalyteIDCol = 'AnalyteId';
    const ProductIDCol = 'ProductId';
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    qcp.clickOnDownloadToExcelCodeList(jsonData.FileName).then(function (selected) {
      expect(selected).toBe(true);
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, AnalyteNameCol, jsonData.Analytes).then(function (fileArray) {
        expect(fileArray).toBe(true);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, AnalyteIDCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.readCSVCodeList(jsonData.FileName, ProductIDCol, '0').then(function (fileArray) {
        expect(fileArray).toBe(false);
      });
    }).then(async function () {
      await qcp.deleteDownloadedFile(jsonData.FileName).then(function (deleted) {
        expect(deleted).toBe(true);
      });
    });
  });

  it('Test Case 9:CodeList - Add New Product Analytes', function () {
    library.logStep('Test Case 9:CodeList - Add New Product-Product Analytes');
    library.logStep('Test Case 10:CodeList - Product Analytes Search-Display in table ');
    library.logStep('Test Case 11:CodeList - Verify Reload Button');
    library.logStep('Test Case 12:CodeList - Delete Analyte Product Analyte');
    library.logStep('Test Case 13:CodeList - Verify selected value in Add Product Analyte');
    library.logStep('Test Case 14: CodeList - Click Close on Add Product Analyte');
    library.logStep('Test Case 15: CodeList - Click Cancel on delete Product Analyte');
    const AnalyteName = jsonData.Analytes;
    const ProductName = jsonData.ProductName;
    const ManufacturerName = jsonData.ManufacturerName;
    let expected;
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    productanalyt.readProductAnalytes().then(function (verified) {
      expected = verified;
      expect(verified).not.toBe('undefined');
    });
    productanalyt.clickOnAddProductAnalytes().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    productanalyt.clickOnAddProductAnalytes().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    productanalyt.addNewSelectManufacturer(ManufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    productanalyt.addNewSelectProduct(ProductName).then(function (added) {
      expect(added).toBe(true);
    });
    productanalyt.addNewSelectAnalyte(AnalyteName).then(function (added) {
      expect(added).toBe(true);
    });
    productanalyt.clickOnSubmit().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    qcp.verifyToastMessageDisplayed(jsonData.ToastMessageAdded).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.addSearchItemName(AnalyteName).then(function (searched) {
      expect(searched).toBe(true);
    });
    productanalyt.verifyProductAnalytesAdded(AnalyteName).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(AnalyteName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.verifyConfirmationMessage(jsonData.DeleteConfirmationMessage).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCancelButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteAgainstColumnValue(AnalyteName).then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnDeleteConfirmButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.selectManufacturer(ManufacturerName).then(function (added) {
      expect(added).toBe(true);
    });
    productanalyt.selectProduct(ProductName).then(function (added) {
      expect(added).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    productanalyt.clickOnAddProductAnalytes().then(function (clicked) {
      expect(clicked).toBe(true);
    });
    productanalyt.verifyManufactureSelectedValue(ManufacturerName).then(function (verified) {
      expect(verified).toBe(true);
    });
    productanalyt.verifyProductSelectedValue(ProductName).then(function (verified) {
      expect(verified).toBe(true);
    });
    qcp.clickOnCloseButton().then(function(verified) {
      expect(verified).toBe(true);
    });
    qcp.clickReloadButton().then(function (added) {
      expect(added).toBe(true);
    });
    qcp.waitUntilTableLoaded().then(function (selected) {
      expect(selected).toBe(true);
    });
    productanalyt.verifyProductAnalytesAdded(expected).then(function (verified) {
      expect(verified).toBe(true);
    });
    });
  });
