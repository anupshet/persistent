/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const btnSubmit = '//button[contains(text(), "Submit")]';
const btnAddAnalyte = '//button[@data-id="ddlAnalyteAdd"]';
const btnAddProductAnalyte = './/button[contains(text(), "Add New Product Analyte")]';
const mainTitle = './/h2[contains(text(), "Product Analyte")]';
const infoTitle = './/p[contains(text(), "Below is the current Product Analyte Configuration")]';
const ddlShowEntries = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const paginationControls = './/ul[contains(@class, "pagination")]';
const manufacturerDropdown = '//label[@for="ddlManufacturer"]/following-sibling::div//select[@id="ddlManufacturer"]';
const btnReloadTable = './/a[contains(text(), "Reload Table")]';
const btnDelete = './/a[contains(text(), "Delete")]';
const ddlManufacturer = '(.//button[contains(@data-id, "Manufacturer")])[2]';
const ddlProduct = '(.//button[contains(@data-id, "Product")])[1]';
const addNewManufactureTxtMsg = '(//button[@data-id="ddlManufacturerAdd"]//span)[1]';
const addNewProductTxtMsg = '(//button[@data-id="ddlProductAdd"]//span)[1]';
const addProductDropdown = '//button[@data-id="ddlProductAdd"]';
const dataTableGrid = './/table[@id =  "tblProductAnalyte"]//tbody/tr[1]';
const AnalytesElement = './/tr/th[@aria-controls = "tblProductAnalyte"]/ancestor::table//tbody/tr/td[3]';

export class ProductAnaly {

  clickOnAddProductAnalytes() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAddProductAnalyte));
      library.click(clickBtn);
      library.logStepWithScreenshot('clickOnAddProductAnalytes', 'clickOnAddProductAnalytes');
      console.log('Add new Product Analytes button clicked');
      library.logStep('Add new Product Analytes button clicked');
      flag = true;
      resolve(flag);
    });
  }

  selectProduct(productName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlProduct));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Product Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + productName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Product Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Product selected: ' + productName);
        console.log('Product selected: ' + productName);
        library.logStepWithScreenshot('Product selected: ' + productName, 'Product selected: ' + productName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Product drop down not displayed');
          console.log('Product drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  addNewSelectManufacturer(manufacturerName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlManufacturer));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'Manufacturer Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        library.logStepWithScreenshot('addNewSelectManufacturer', 'addNewSelectManufacturer');
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + manufacturerName + '")])[2]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Manufacturer Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Manufacturer selected: ' + manufacturerName);
        console.log('Manufacturer selected: ' + manufacturerName);
        library.logStepWithScreenshot('Manufacturer selected: ' + manufacturerName, 'Manufacturer selected: ' + manufacturerName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Manufacturer drop down not displayed');
          console.log('Manufacturer drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  addNewSelectProduct(productName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(addProductDropdown));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'product Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        library.logStepWithScreenshot('addNewSelectProduct', 'addNewSelectProduct');
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + productName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'product Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('product selected: ' + productName);
        console.log('product selected: ' + productName);
        library.logStepWithScreenshot('product selected: ' + productName, 'product selected: ' + productName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('product drop down not displayed');
          console.log('product drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  addNewSelectAnalyte(analyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(btnAddAnalyte));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'Analyte Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        library.logStepWithScreenshot('addNewSelectAnalyte', 'addNewSelectAnalyte');
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + analyteName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Analyte Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Analyte selected: ' + analyteName);
        console.log('Analyte selected: ' + analyteName);
        library.logStepWithScreenshot('Analyte selected: ' + analyteName, 'Analyte selected: ' + analyteName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Analyte drop down not displayed');
          console.log('Analyte drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }
  clickOnSubmit() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnSubmit));
      library.click(clickBtn);
      console.log('Submit button clicked');
      library.logStep('Submit button clicked');
      library.logStepWithScreenshot('clickOnSubmit', 'clickOnSubmit');
      flag = true;
      resolve(flag);
    });
  }

  verifyProductAnalytesAdded(expectedAnalyteName) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(dataTableGrid));
      dataTable.isDisplayed().then(function () {
        const AnalytesEle = element(by.xpath(AnalytesElement));
        AnalytesEle.getText().then(function (actualTxt) {
          const actualAnalytes = actualTxt.trim();
          console.log('expected ' + expectedAnalyteName + 'actualProducts' + actualAnalytes);
          if (expectedAnalyteName === actualAnalytes) {
            library.logStep('Product Analytes is displayed in the table: ' + actualAnalytes);
            console.log('Product Analytes is displayed in the table: ' + actualAnalytes);
            library.logStepWithScreenshot('ProductAnalytesDisplayed', 'ProductAnalytesDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyManufactureSelectedValue(manufactureName) {
    let flag = false;
    return new Promise((resolve) => {
      const submitBtn = element(by.xpath(btnAddAnalyte));
      submitBtn.isDisplayed().then(function () {
        const ManufactureTxtEle = element(by.xpath(addNewManufactureTxtMsg));
        ManufactureTxtEle.getText().then(function (actualTxt) {
          const actualManufacture = actualTxt.trim();
          console.log('expected ' + manufactureName + 'actualManufactureName' + actualManufacture);
          if (manufactureName === actualManufacture) {
            library.logStep('Manufacture Name is displayed in the table: ' + actualManufacture);
            console.log('Manufacture Name is displayed in the table: ' + actualManufacture);
            library.logStepWithScreenshot('ManufactureNameDisplayed', 'ManufactureNameDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Submit button not displayed');
        console.log('Submit button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyProductSelectedValue(productName) {
    let flag = false;
    return new Promise((resolve) => {
      const submitBtn = element(by.xpath(btnAddAnalyte));
      submitBtn.isDisplayed().then(function () {
        const ProductTxtEle = element(by.xpath(addNewProductTxtMsg));
        ProductTxtEle.getText().then(function (actualTxt) {
          const actualProduct = actualTxt.trim();
          console.log('expected ' + productName + 'actualProductName' + actualProduct);
          if (productName === actualProduct) {
            library.logStep('Product Name is displayed in the table: ' + actualProduct);
            console.log('Product Name is displayed in the table: ' + actualProduct);
            library.logStepWithScreenshot('ProductNameDisplayed', 'ProductNameDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Submit button not displayed');
        console.log('Submit button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  uiVerification() {
    let flag = false;
    let count = 0;
    return new Promise((resolve) => {
      const proanalyte = new Map<string, string>();
      proanalyte.set('Header Displayed', mainTitle);
      proanalyte.set('Sub Header Displayed', infoTitle);
      proanalyte.set('Show Default Displayed', ddlShowEntries);
      proanalyte.set('Search Displayed', searchBox);
      proanalyte.set('Table Displayed', tableFirstVal);
      proanalyte.set('Page control Displayed', paginationControls);
      proanalyte.set('Manufacturer Dropdown  Displayed', manufacturerDropdown);
      proanalyte.set('Reload Table Button Displayed', btnReloadTable);
      proanalyte.set('Delete Button Displayed', btnDelete);
      const head = element(by.xpath(mainTitle));
      head.isDisplayed().then(function() {
        proanalyte.forEach(function (key, value) {
          const test = element(by.xpath(key));
          test.isDisplayed().then(function () {
            console.log(value + ' is displayed.');
            library.logStep(value + ' is displayed.');
            library.logStepWithScreenshot('uiVerification', 'uiVerification');
            count++;
          }).catch(function () {
            library.logStep(value + ' is not displayed.');
            console.log(value + ' is not displayed.');
            library.logStepWithScreenshot('uiVerification', 'uiVerification');
          });
        });
      }).then(function() {
        if (proanalyte.size === count) {
          console.log('Code list Product Analytes page UI verified');
          library.logStepWithScreenshot('Code list Product Analytes Page UI verified', 'Code list Product Analytes page UI verified');
          library.logStepWithScreenshot('uiVerification', 'uiVerification');
          flag = true;
          resolve(flag);
        } else {
          console.log('Code list Product Analytespage UI not verified');
          library.logStep('Code list Product Analytes page UI not verified');
          library.logStepWithScreenshot('uiVerification', 'uiVerification');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  readProductAnalytes() {
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(dataTableGrid));
      dataTable.isDisplayed().then(function () {
        const AnalytesEle = element(by.xpath(AnalytesElement));
        AnalytesEle.getText().then(function (actualTxt) {
          const actualAnalytes = actualTxt.trim();
            console.log('Product Analytes is displayed in the table: ' + actualAnalytes);
            library.logStep('Product Analytes is displayed in the table: ' + actualAnalytes);
            library.logStepWithScreenshot('readProductAnalytes', 'readProductAnalytes');
            resolve(actualAnalytes);
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        resolve('undefined');
      });
    });
  }
}


