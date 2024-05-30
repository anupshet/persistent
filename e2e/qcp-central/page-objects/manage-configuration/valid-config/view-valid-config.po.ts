/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const header = './/h2[contains(text(), "ValidConfigs")]';
const subHeader = './/div[contains(@class, "body-content")]/p[contains(text(), "Please select an instrument from below dropdown to view Valid Configurations.")]';
const manuDdl = './/button[contains(@data-id, "ddlValidConfigInstrumentManufacturer")]';
const instDdl = './/label[contains(text(), "Instrument*")]/parent::div//button[contains(@data-id, "ddlValidConfigInstrument")]';

const reagDdl = './/div//button[contains(@data-id, "ddlHasMicroSlideReagent")]';
const warningMsg = './/div[contains(@class, "bootbox-body")]';
const warningOk = './/button[contains(text(), "OK")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const manufacturerDDL = './/button[contains(@data-id, "InstrumentManufacturer")]';
const instrumentDDL = './/label[contains(text(), "Instrument*")]/parent::div//button[contains(@data-id, "Instrument")][contains(@aria-disabled, "false")]';
const colNameLinks = './/div[contains(text(), "Toggle column")]/a';
const validConfigTable = './/table[contains(@id, "tblValidConfig")]/tbody';
const addValidConfigBtn = './/button[contains(text(), "Add New ValidConfig")]';
const downloadBtn = './/button[@onclick = "DownloadCsv();"]';

export class ViewValid {
  isReagentDropDownDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(reagDdl));
      ddl.getAttribute('aria-disabled').then(function (val) {
        if (val === 'false') {
          console.log('Reagent drop down is displayed');
          library.logStep('Reagent drop down is displayed');
          library.logStepWithScreenshot('Reagent drop down is displayed', 'Reagent drop down is displayed');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Reagent drop down is not displayed');
          console.log('Reagent drop down is not displayed');
          library.logStepWithScreenshot('Reagent drop down is not displayed', 'Reagent drop down is not displayed');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  selectReagent(reagentName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(reagDdl));
      browser.wait(browser.ExpectedConditions.visibilityOf(ddl), 110000, 'Reagent DDL not displayed');
      ddl.isDisplayed().then(function () {
        library.click(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + reagentName + '")]'));
        browser.executeScript('arguments[0].scrollIntoView();', options);
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 12000, 'Reagent opts not displayed');
        library.clickJS(options);
        library.logStep('Reagent selected: ' + reagentName);
        console.log('Reagent selected: ' + reagentName);
        library.logStepWithScreenshot('Reagent selected: ' + reagentName, 'Reagent selected: ' + reagentName);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Instrument drop down not displayed');
        console.log('Instrument drop down not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }
  isColumnDisplayed(expectedColumnName) {
    let flag, found = false;
    const colMap = new Map();
    let colnameVal;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath('.//table/thead/tr/th'));
      colNamesList.isDisplayed().then(function () {
        colNamesList.each(function (colname, index) {
          colname.getText().then(function (colName) {
            colMap.set(index, colName);
          });
        });
      }).then(function () {
        for (colnameVal of colMap.values()) {
          // console.log('Col nameAct: ' + colnameVal);
          // console.log('Col nameExp: ' + expectedColumnName);
          if (colnameVal.includes(expectedColumnName)) {
            console.log('Pass: ExpCol: ' + expectedColumnName + ' act: ' + colnameVal);
            found = true;
            // library.logStep('Column is displayed: ' + colnameVal);
            // console.log('Column is displayed: ' + colnameVal);
            break;
          } else {
            // console.log('False: ExpCol: ' + expectedColumnName + ' act: '  + colnameVal);
            found = false;
          }
        }
      }).then(function () {
        if (found === true) {
          library.logStep('Column is displayed: ' + colnameVal);
          console.log('Column is displayed: ' + colnameVal);
          library.logStepWithScreenshot('Expected Colum Displayed' + expectedColumnName, 'Expected Colum Displayed' + expectedColumnName);
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Column is not displayed: ' + expectedColumnName);
          console.log('Column is not displayed: ' + expectedColumnName);
          library.logStepWithScreenshot('Column is not displayed: ' + expectedColumnName, 'Column is not displayed: ' + expectedColumnName);
          flag = false;
          resolve(flag);
        }
      }); // .catch(function() {
      //   library.logStep('Table not loaded');
      //   console.log('Table not loaded');
      //   flag = false;
      //   resolve(flag);
      // });
    });
  }


  findElementsInTable(expectedColumnName, ElemenetName) {
    let flag = false;
    let colIndex, count = 0;
    let actualText;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath('.//table/thead/tr/th'));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const dataCells = element.all(by.xpath('.//tbody/tr/td[' + colIndex + ']'));
        dataCells.each(function (cell) {
          cell.getText().then(function (text) {
            actualText = text;
            if (actualText.includes(ElemenetName)) {
              count++;
            }
          });
        }).then(function () {
          if (count > 0) {
            library.logStep('Data displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            console.log('Data displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            library.logStepWithScreenshot('Data displayed in Column ' + colIndex + ' ' + expectedColumnName, 'findElementsInTable');
            flag = true;
            resolve(flag);
          } else {
            library.logStep('Expected Data is not displayed in Column ' + colIndex + ' : ' + expectedColumnName + ' : ' + actualText);
            console.log('Expected Data is not displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            flag = false;
            resolve(flag);
          }
        });
      });
    });
  }

  isTableDisplayedWithValues() {
    let flag = false;
    return new Promise((resolve) => {
      const tableValues = element(by.xpath('.//tbody/tr[1]/td[2]'));
      tableValues.getText().then(function (text) {
        if (text !== '') {
          console.log('Table is displayed with Values');
          library.logStep('Table is displayed with Values');
          library.logStepWithScreenshot('Table is displayed with Values', 'Table is displayed with Values');
          flag = true;
          resolve(flag);
        } else {
          console.log('Table is displayed with Values');
          library.logStep('Table is displayed with Values');
          flag = false;
          resolve(flag);
        }
      }).catch(function () {
        console.log('Table is not loaded');
        library.logStep('Table is not loaded');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyWarningMessage(expectedMessage) {
    let flag = false;
    return new Promise((resolve) => {
      const warning = element(by.xpath(warningMsg));
      browser.wait(browser.ExpectedConditions.visibilityOf(warning), 20000, 'Warning is not displayed');
      warning.isDisplayed().then(function () {
        warning.getText().then(function (actualMessage) {
          if (actualMessage.includes(expectedMessage)) {
            console.log('Valid config can not be deleted, dependency exist');
            library.logStep('Valid config can not be deleted, dependency exist');
            library.logStepWithScreenshot('Valid config can not be deleted, dependency exist', 'Valid config can not be deleted, dependency exist');
            flag = true;
            resolve(flag);
          } else {
            console.log('Valid config deleted');
            library.logStep('Valid config deleted');
            flag = false;
            resolve(flag);
          }
        });
      });
    });
  }

  clickOkOnWarning() {
    let flag = false;
    return new Promise((resolve) => {
      const okBtn = element(by.xpath(warningOk));
      okBtn.isDisplayed().then(function () {
        library.clickJS(okBtn);
        console.log('Warning Ok button clicked');
        library.logStep('Warning Ok button clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Warning not displayed');
        library.logStep('Warning not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  waitForValidConfigDisplayed(manufacturerName, instrumentName, reagent) {
    let flag = false;
    return new Promise((resolve) => {
      const waiting = global.window.setInterval(() => {
        console.log('Inwait');
        const manufactDdl = element(by.xpath(manufacturerDDL));
        browser.wait(browser.ExpectedConditions.elementToBeClickable(manufactDdl), 20000, 'Manufacturer Dropdown is not clickable');
        library.click(manufactDdl);
        const manOptions = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + manufacturerName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(manOptions), 15000, 'Manufacturer Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', manOptions);
        library.clickJS(manOptions);
        const inst = element(by.xpath(instrumentDDL));
        browser.wait(browser.ExpectedConditions.elementToBeClickable(inst), 30000, 'Instrument Dropdown is not clickable');
        browser.executeScript('arguments[0].scrollIntoView();', inst);
        library.clickJS(inst);
        dashboard.waitForScroll();
        const instOptions = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + instrumentName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(instOptions), 15000, 'Instrument Dropdown Options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', instOptions);
        library.clickJS(instOptions);
        const searchInput = element(by.xpath('.//tfoot/tr/th[7]//input'));
        searchInput.clear();
        searchInput.sendKeys(reagent);
        const tableValues = element(by.xpath(tableFirstVal));
        tableValues.getText().then(function (text) {
          if (text !== '') {
            console.log('Table is displayed with Values');
            clearInterval(waiting);
            flag = true;
            resolve(flag);
          }
        });

      }, 2000);
    });
  }

  waitForRefresh() {
    let flag = false;
    return new Promise((resolve) => {
      browser.refresh();
      dashboard.waitForElement();
      browser.refresh();
      dashboard.waitForElement();
      browser.refresh();
      dashboard.waitForElement();
      dashboard.waitForElement();
      flag = true;
      resolve(flag);
    });
  }
}
