/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const mainTitle = './/h2[contains(text(), "Analyte Storage Unit")]';
const infoTitle = './/p[contains(text(), "Below is the current Analyte Storage Unit Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const analyteDdl = './/button[contains(@data-id, "ddlAnalyte")]';
const addAnalyteSUButton = './/button[contains(text(), "Add New Analyte Storage Unit")]';
const selectAnalyteName = './/button[contains(@data-id, "ddlAllAnalyte")]';
const selectAnalyteSearchBox = './/button[contains(@data-id , "ddlAllAnalyte")]/following-sibling::div//input';
const selectUnitCategory = './/button[contains(@data-id, "ddlAllUnitCategory")]';
const selectUnit = './/button[@data-id = "ddlAllUnit"]';
const selectUnitSearchBox = '(.//button[contains(@data-id , "ddlAllUnit")]/following-sibling::div//input)[2]';
const submitStorageUnitButton = './/button[contains(text(), "Submit")]';
const dataTable = './/table[contains(@id,"tbl")]//tbody/tr[1]';
const analyteNameAllValues = './/tr/th[contains(@aria-controls, "tbl")]/ancestor::table//tbody/tr/td[2]';
const unitCategoryAllValues = './/tr/th[contains(@aria-controls, "tbl")]/ancestor::table//tbody/tr/td[3]';
const uniteNameAllValues = './/tr/th[contains(@aria-controls, "tbl")]/ancestor::table//tbody/tr/td[5]';

export class AnalyteStorageUnits {
  uiVerification() {
    let flag = false;
    let count = 0;
    return new Promise((resolve) => {
      const maptest = new Map<string, string>();
      maptest.set('Header Displayed', mainTitle);
      maptest.set('Analyte DropDown Displayed', analyteDdl);
      maptest.set('Sub Header Displayed', infoTitle);
      maptest.set('Show Default Displayed', showEntriesDdl);
      maptest.set('Search Displayed', searchBox);
      maptest.set('Table Displayed', tableFirstVal);
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
          console.log('Analyte Storage Units page UI verified');
          library.logStepWithScreenshot('Analyte Storage Units page UI verified', 'Analyte Storage Units page UI verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Analyte Storage Units page UI not verified');
          library.logStep('Analyte Storage Units page UI not verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOnAddAnalyteStorageUnit() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addAnalyteSUButton));
      clickBtn.isDisplayed().then(function() {
        library.click(clickBtn);
        console.log('Add new Analyte Storage Units button clicked');
        library.logStep('Add new Analyte Storage Units button clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Add new Analyte Storage Units button not displayed');
        library.logStep('Add new Analyte Storage Units button not displayed');
        flag = true;
        resolve(flag);
      });
    });
  }

  selectAnalyteName(analyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(selectAnalyteName));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Analyte Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('(.//span[contains(text(), "' + analyteName + '")])[2]'));
        const search = element(by.xpath(selectAnalyteSearchBox));
        search.sendKeys(analyteName);
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
          library.logStepWithScreenshot('Analyte Name not displayed', 'Analyte Name not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectUnitCategoryName(unitCategoryName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(selectUnitCategory));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Unit Category Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + unitCategoryName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Unit Category Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Unit Category selected: ' + unitCategoryName);
        console.log('Unit Category selected: ' + unitCategoryName);
        library.logStepWithScreenshot('Unit Category selected: ' + unitCategoryName, 'Unit Category selected: ' + unitCategoryName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Unit Category drop down not displayed');
          console.log('Unit Category drop down not displayed');
          library.logStepWithScreenshot('Unit Category not displayed', 'Unit Category not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectUnitName(unitName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(selectUnit));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Unit Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//span[text() = "' + unitName + '"]'));
        const search = element(by.xpath(selectUnitSearchBox));
        search.sendKeys(unitName);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Unit Name selected: ' + unitName);
        console.log('Unit Name selected: ' + unitName);
        library.logStepWithScreenshot('Unit Name selected: ' + unitName, 'Unit Name selected: ' + unitName);
        flag = true;
        resolve(flag);
      }).catch(function () {
          library.logStep('Unit Name drop down not displayed');
          console.log('Unit Name drop down not displayed');
          library.logStepWithScreenshot('Unit Name drop down not displayed', 'Unit Name drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  clickSubmitStorageUnit() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(submitStorageUnitButton));
      library.click(clickBtn);
      dashboard.waitForScroll();
      console.log('Submit on Add new Analyte Storage Unit button clicked');
      library.logStep('Submit on Add new Analyte Storage Unit button clicked');
      library.logStepWithScreenshot('Submit displayed', 'Submit displayed');
      flag = true;
      resolve(flag);
    });
  }

  selectAnalyte(expectedAnalyte) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(analyteDdl));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Analyte Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + expectedAnalyte + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Analyte Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Analyte selected: ' + expectedAnalyte);
        console.log('Analyte selected: ' + expectedAnalyte);
        library.logStepWithScreenshot('Analyte Name selected: ' + expectedAnalyte, 'Analyte Name selected: ' + expectedAnalyte);
        flag = true;
        resolve(flag);
      }).catch(function () {
          library.logStep('Analyte Name drop down not displayed');
          console.log('Analyte Name drop down not displayed');
          library.logStepWithScreenshot('Analyte Name not displayed', 'Analyte Name not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  verifyAnalyteStorageUnitAdded(expectedAnalyte, expectedUnitCategoryName, expectedUnitName) {
    let flag, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTableEle = element(by.xpath(dataTable));
      const analyte = element(by.xpath(analyteNameAllValues));
      const unitCat = element(by.xpath(unitCategoryAllValues));
      const unit = element(by.xpath(uniteNameAllValues));
      dataTableEle.isDisplayed().then(function () {
        analyte.getText().then(function (actualTxt) {
          const actualAnalyte = actualTxt.trim();
          if (expectedAnalyte === actualAnalyte) {
            library.logStep('Analyte is displayed in the table: ' + actualAnalyte);
            console.log('Analyte is displayed in the table: ' + actualAnalyte);
            flag1 = true;
          }
        }).then(function() {
          unitCat.getText().then(function (actualTxt) {
            const actualUnitCat = actualTxt.trim();
            if (expectedUnitCategoryName === actualUnitCat) {
              library.logStep('Unit Category is displayed in the table: ' + actualUnitCat);
              console.log('Unit Category is displayed in the table: ' + actualUnitCat);
              flag2 = true;
            }
          });
        }).then(function() {
          unit.getText().then(function (actualTxt) {
            const actualUnit = actualTxt.trim();
            if (expectedUnitName === actualUnit) {
              library.logStep('Unit is displayed in the table: ' + actualUnit);
              console.log('Unit is displayed in the table: ' + actualUnit);
              flag3 = true;
            }
          });
        }).then(function() {
          if (flag1 && flag2 && flag3 === true) {
            library.logStep('Analyte Storage Unit is added');
            console.log('Analyte Storage Unit is added');
            library.logStepWithScreenshot('AnalyteStorageUnit', 'AnalyteStorageUnit');
            flag = true;
            resolve(flag);
          } else {
            library.logStep('Analyte Storage Unit is not added');
            console.log('Analyte Storage Unit is not added');
            library.logStepWithScreenshot('Analyte Storage Unit is not added', 'Analyte Storage Unit is not added');
            flag = false;
            resolve(flag);
          }
        });
      }).catch(function() {
        library.logStep('Data Table is not displayed');
        console.log('Data Table is not displayed');
        library.logStepWithScreenshot('Data Table is not displayed', 'Data Table is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }
}
