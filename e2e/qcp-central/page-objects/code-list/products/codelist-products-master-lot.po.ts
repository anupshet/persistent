/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const mainTitle = './/h2[contains(text(), "Product Master Lot")]';
const infoTitle = './/p[contains(text(), "Below is the current Product Master Lot Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const paginationControls = './/ul[contains(@class, "pagination")]';
const matrixDdl = './/button[@data-id="ddlMatrix"]';
const productDdl = './/button[@data-id="ddlProduct"]';
const addProductMasterLotButton = './/button[contains(text(), "Add New Product Master Lot")]';
const addNewManufacturerDDL = '(.//button[contains(@data-id, "Manufacturer")])[2]';
const manufacturerSearch = './/button[contains(@data-id , "ManufacturerId")]/following-sibling::div//input';
const addNewMatrixDDL = './/button[@data-id="MatrixId"]';
const addNewProductDDL = './/button[@data-id="ProductId"]';
const lotNumber = './/input[@id="LotNumber"]';
const level = './/input[@id="TotalLevel"]';
const addProductMasterLotAddButton = './/button[contains(@type, "submit")]';
const dataTable = './/table[contains(@id,"tbl")]//tbody/tr[1]';
const lotNumColAllValues = './/tr/th[contains(@aria-controls, "tbl")]/ancestor::table//tbody/tr/td[2]';
const expDateColAllValues = './/tr/th[contains(@aria-controls, "tbl")]/ancestor::table//tbody/tr/td[4]';
const expirationDateInput = './/input[contains(@id, "ExpirationDate")]';
const selectYearDDL = './/select[@data-handler = "selectYear"]';
const selectMonthDDL = './/select[@data-handler = "selectMonth"]';
const selectDay = '(.//td[@data-handler = "selectDay"]/a)';

export class ProductMasterLot {
  uiVerification() {
    let flag = false;
    let count = 0;
    return new Promise((resolve) => {
      const maptest = new Map<string, string>();
      maptest.set('Header Displayed', mainTitle);
      maptest.set('Sub Header Displayed', infoTitle);
      maptest.set('Show Default Displayed', showEntriesDdl);
      maptest.set('Search Displayed', searchBox);
      maptest.set('Table Displayed', tableFirstVal);
      maptest.set('Pagination Buttons Displayed', paginationControls);
      const head = element(by.xpath(mainTitle));
      head.isDisplayed().then(function() {
        maptest.forEach(function (key, value) {
          const ele = element(by.xpath(key));
          ele.isDisplayed().then(function () {
            console.log(value + ' is displayed.');
            library.logStep(value + ' is displayed.');
            count++;
          }).catch(function () {
            library.logStep(value + ' is not displayed.');
            console.log(value + ' is not displayed.');
          });
        });
      }).then(function() {
        if (maptest.size === count) {
          console.log('Product Master Lot Page UI Verified');
          library.logStepWithScreenshot('Product Master Lot Page UI Verified', 'Product Master Lot Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Product Master Lot page UI not verified');
          library.logStep('Product Master Lot page UI not verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  selectMatrix(matrixName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(matrixDdl));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Matrix Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + matrixName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Matrix Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Matrix selected: ' + matrixName);
        console.log('Matrix selected: ' + matrixName);
        library.logStepWithScreenshot('Matrix selected: ' + matrixName, 'Matrix selected: ' + matrixName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Matrix drop down not displayed');
          console.log('Matrix drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectProduct(productName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(productDdl));
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

  clickOnAddNewProductsMasterLot() {
    let flag = false;
    return new Promise((resolve) => {
      const addNewBtn = element(by.xpath(addProductMasterLotButton));
      addNewBtn.isDisplayed().then(function() {
        library.click(addNewBtn);
        console.log('Add New Product Master Lot button clicked');
        library.logStep('Add New Product Master Lot button clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        library.logStep('Add New Product Master Lot button not displayed');
        console.log('Add New Product Master Lot button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectManufacturerOnAddPage(manufacturerName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(addNewManufacturerDDL));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Manufacturer Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        // browser.executeScript('arguments[0].click();', ddl);
        const search = element(by.xpath(manufacturerSearch));
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + manufacturerName + '")])[2]'));
        search.sendKeys(manufacturerName);
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

  selectMatrixOnAddPage(matrixName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(addNewMatrixDDL));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Matrix Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + matrixName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Matrix Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Matrix selected: ' + matrixName);
        console.log('Matrix selected: ' + matrixName);
        library.logStepWithScreenshot('Matrix selected: ' + matrixName, 'Matrix selected: ' + matrixName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Matrix drop down not displayed');
          console.log('Matrix drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectProductOnAddPage(productName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(addNewProductDDL));
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

  addLotNumber(lotNum) {
    let flag = false;
    return new Promise((resolve) => {
      const numInput = element(by.xpath(lotNumber));
      numInput.isDisplayed().then(function() {
        numInput.clear();
        numInput.sendKeys(lotNum);
        library.logStep('Added Lot Number: ' + lotNum);
        console.log('Added Lot Number: ' + lotNum);
        flag = true;
        resolve(flag);
      });
    });
  }

  addTotalLevels(levels) {
    let flag = false;
    return new Promise((resolve) => {
      const levelEle = element(by.xpath(level));
      levelEle.isDisplayed().then(function() {
        levelEle.clear();
        levelEle.sendKeys(levels);
        library.logStep('Added levels: ' + levels);
        console.log('Added levels: ' + levels);
        flag = true;
        resolve(flag);
      });
    });
  }

  clickOnAddOnNewProductsMasterLot() {
    let flag = false;
    return new Promise((resolve) => {
      const addNewBtn = element(by.xpath(addProductMasterLotAddButton));
      addNewBtn.isDisplayed().then(function() {
        library.clickJS(addNewBtn);
        dashboard.waitForPage();
        console.log('Add clicked on Add New Product Master Lot');
        library.logStep('Add clicked on Add New Product Master Lot');
        flag = true;
        resolve(flag);
      }).catch(function() {
        library.logStep('Add New Product Master Lot button not displayed');
        console.log('Add New Product Master Lot button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyProductLotAdded(expectedLot) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTableEle = element(by.xpath(dataTable));
      dataTableEle.isDisplayed().then(function () {
        const analyte = element(by.xpath(lotNumColAllValues));
        analyte.getText().then(function (actualTxt) {
          const actualLot = actualTxt.trim();
          if (expectedLot === actualLot) {
            library.logStep('Product lot is displayed in the table: ' + actualLot);
            console.log('Product lot is displayed in the table: ' + actualLot);
            library.logStepWithScreenshot('ProductlotDisplayed', 'ProductlotDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Product lot Data table not displayed');
        console.log('Product lot Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyProductLotEdited(year, mon, day) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTableEle = element(by.xpath(dataTable));
      dataTableEle.isDisplayed().then(function () {
        const expDate = element(by.xpath(expDateColAllValues));
        expDate.getText().then(function (actualTxt) {
          const actualDate = actualTxt.trim();
          if (actualDate.includes(year) && actualDate.includes(mon) && actualDate.includes(day)) {
            library.logStep('Product lot is edited with expiry date: ' + actualDate);
            console.log('Product lot is edited with expiry date: ' + actualDate);
            library.logStepWithScreenshot('ProductlotEdited', 'ProductlotEdited');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Product lot Data table not displayed');
        console.log('Product lot Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectExpirationDate(year, mon, day) {
    let flag, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      const dateBox = element(by.xpath(expirationDateInput));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(dateBox), 20000, 'Expiry date is not clickable');
      dateBox.isDisplayed().then(function () {
        library.click(dateBox);
        console.log('Expiry Date clicked');
      }).then(function () {
        const yearDdl = element(by.xpath(selectYearDDL));
        yearDdl.isDisplayed().then(function () {
          library.click(yearDdl);
          const yearOpt = yearDdl.element(by.xpath('.//option[text()="' + year + '"]'));
          library.click(yearOpt);
          console.log('Year Selected: ' + year);
          library.logStep('Year Selected: ' + year);
          flag1 = true;
        }).catch(function () {
          console.log('Year not displayed');
          library.logStep('Year not displayed');
          flag1 = false;
        });
      }).then(function () {
        const monDdl = element(by.xpath(selectMonthDDL));
        monDdl.isDisplayed().then(function () {
          library.click(monDdl);
          const monOpt = monDdl.element(by.xpath('.//option[text()="' + mon + '"]'));
          library.click(monOpt);
          console.log('Month Selected: ' + mon);
          library.logStep('Month Selected: ' + mon);
          flag2 = true;
        }).catch(function () {
          console.log('Month not displayed');
          library.logStep('Month not displayed');
          flag2 = false;
        });
      }).then(function () {
        const daySel = element(by.xpath(selectDay));
        daySel.isDisplayed().then(function () {
          const dayOpt = element(by.xpath(selectDay + '[' + day + ']'));
          library.click(dayOpt);
          console.log('Day Selected: ' + day);
          library.logStep('Day Selected: ' + day);
          flag3 = true;
        });
      }).then(function () {
        if (flag1 && flag2 && flag3 === true) {
          console.log('Date Selected: ' + mon + day + year);
          library.logStep('Date Selected: ' + mon + day + year);
          flag = true;
          resolve(flag);
        }
      });
    });
  }
}
