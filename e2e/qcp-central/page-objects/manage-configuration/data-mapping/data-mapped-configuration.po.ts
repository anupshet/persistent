/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const fs = require('fs');
const csvmodule = require('papaparse');
const path = require('path');
const reqPath = path.join(__dirname, '../');
const downloadPath = path.join(reqPath, 'qcp-downloads');
const library = new BrowserLibrary();
const dashboard = new Dashboard();
const tableHeaders = './/table/thead/tr/th';
const manufacturerDDL = './/button[contains(@data-id, "ddlManufacturer")]';
const checkBox = './/td/input[contains(@type, "checkbox")]';
const deleteBtn = './/button[contains(text(), "DELETE")]';

export class DataMappedConfig {
  findElementsInTable(expectedColumnName, ElemenetName) {
    let flag = false;
    let colIndex, count = 0;
    let actualText;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(tableHeaders));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const dataCell = element.all(by.xpath('.//tbody/tr[1]/td[' + colIndex + ']'));
        dataCell.getText().then(function (txt) {
          const text = txt + '';
          const textFound = text.split('-');
          for (const str of textFound) {
            actualText = str.trim();
            if (actualText === ElemenetName) {
              count++;
            }
          }
        }).then(function () {
          if (count >= 1) {
            library.logStep('Data displayed in Column ' + expectedColumnName + ' : ' + ElemenetName);
            console.log('Data displayed in Column ' + expectedColumnName + ' : ' + ElemenetName);
            flag = true;
            resolve(flag);
          } else {
            library.logStep('Expected Data is not displayed in Column ' + expectedColumnName + ' : ' + ElemenetName);
            console.log('Expected Data is not displayed in Column ' + expectedColumnName + ' : ' + ElemenetName);
            flag = false;
            resolve(flag);
          }
        });
      });
    });
  }

  selectSubMenuOptionDataMappedConfig(subMenuName, subMenuOption) {
    let flag = false;
    return new Promise((resolve) => {
      browser.actions().mouseMove
        (element(by.xpath('.//ul[contains(@class, "dropdown-menu")]//a[text() = "' + subMenuName + '"]'))).perform();
      const menuOpt = element(by.xpath('(.//ul/li/a[contains(text(), "' + subMenuOption + '")])[1]'));
      browser.wait(browser.ExpectedConditions.textToBePresentInElement(menuOpt, subMenuOption), 10000, subMenuOption + ' not visible');
      menuOpt.isDisplayed().then(function () {
        library.click(menuOpt);
        library.logStep('Menu selected: ' + subMenuOption);
        console.log('Menu selected: ' + subMenuOption);
        library.logStepWithScreenshot('Menu selected: ' + subMenuOption, 'Menu selected: ' + subMenuOption);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Menu not displayed: ' + subMenuOption);
        console.log('Menu not displayed: ' + subMenuOption);
        flag = true;
        resolve(flag);
      });
    });
  }

  selectManufacturer(manufacturerName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(manufacturerDDL));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Manufacturer Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.click(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + manufacturerName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Manufacturer Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Manufacturer selected: ' + manufacturerName);
        console.log('Manufacturer selected: ' + manufacturerName);
        library.logStepWithScreenshot('Manufacturer selected: ' + manufacturerName, 'Manufacturer selected: ' + manufacturerName);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Manufacturer drop down not displayed');
        console.log('Manufacturer drop down not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  getiFirstDataFromColumn(expectedColumnName) {
    let colIndex = 0;
    let dataFound = 'undefined';
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(tableHeaders));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
            console.log('colIndex: ' + colIndex);
          }
        });
      }).then(function () {
        const dataCell = element(by.xpath('.//tbody/tr[1]/td[' + colIndex + ']'));
        dataCell.getText().then(function (txt) {
          dataFound = txt + '';
        }).then(function () {
          if (dataFound !== '') {
            library.logStep('Data displayed in Column ' + expectedColumnName + ' : ' + dataFound);
            console.log('Data displayed in Column ' + expectedColumnName + ' : ' + dataFound);
            resolve(dataFound);
          } else {
            library.logStep('Column does not have any data: ' + expectedColumnName + ' : ' + dataFound);
            console.log('Column does not have any data: ' + expectedColumnName + ' : ' + dataFound);
            resolve(dataFound);
          }
        }).catch(function () {
          library.logStep('Column and data not found: ' + expectedColumnName);
          console.log('Column and data not found: ' + expectedColumnName);
          resolve('undefined');
        });
      });
    });
  }

  async readDataCSVDataMapping(filename, expectedColumnName, expectedValue) {
    let flag, colfound, valfound = false;
    let colNum = 0;
    const columnNames = [];
    const filePathName = downloadPath + '\\' + filename;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const fileExist = fs.existsSync(filePathName);
      if (fileExist) {
        const tempRead = fs.readFileSync(filePathName, 'utf16le');
        const readF = tempRead.replace(/^\uFEFF/, '');
        csvmodule.parse(readF, {
          complete: (csvValues) => {
            for (let i = 0; i < csvValues.data[0].length - 1; i++) {
              columnNames.push(csvValues.data[0][i]);
            }
            for (const text of columnNames) {
              if (text === expectedColumnName) {
                colNum = columnNames.indexOf(text);
                colfound = true;
                break;
              }
            }
            for (let j = 1; j < csvValues.data.length - 1; j++) {
              const tempTxt = csvValues.data[j][colNum];
              let tempstr, tempAct, tempif;
              tempif = tempTxt;
              if ((tempif.charAt(tempif.length - 1)).includes('-')) {
                tempAct = tempif.substr(0, tempif.length - 1);
                tempstr = tempAct.trim();
              } else {
                tempstr = tempif.trim();
              }
              const actulaVal = tempstr.replace(/\s/g, '');
              const expected = expectedValue.replace(/\s/g, '');
              if (expected === actulaVal) {
                console.log('Value is displayed: ' + actulaVal);
                library.logStep('Value is displayed: ' + actulaVal);
                valfound = true;
              }
            }
          }
        });
        if (colfound && valfound === true) {
          console.log('Value ' + expectedValue + ' found in column ' + expectedColumnName);
          library.logStep('Value ' + expectedValue + ' found in column ' + expectedColumnName);
          flag = true;
          resolve(flag);
        } else {
          flag = false;
          resolve(flag);
          console.log('Value and column not found');
          library.logStep('Value and column not found');
        }
      } else {
        console.log('File not available');
      }
    });
  }

  selectCheckbox() {
    let flag = false;
    return new Promise((resolve) => {
      const chb = element(by.xpath(checkBox));
      chb.isDisplayed().then(function () {
        library.clickJS(chb);
        console.log('Check box is selected for first row');
        library.logStep('Check box is selected for first row');
        library.logStepWithScreenshot('Check box is selected for first row', 'Check box is selected for first row');
        browser.wait(browser.ExpectedConditions.elementToBeSelected(chb), 15000, 'Checkbox is not clickable');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Check box is not displayed');
        console.log('Check box is not displayed');
        library.logStepWithScreenshot('Check box is not displayed', 'Check box is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnDeleteButton() {
    let flag = false;
    return new Promise((resolve) => {
      const deletebtn = element(by.xpath(deleteBtn));
      deletebtn.isDisplayed().then(function () {
        library.click(deletebtn);
        console.log('Delete clicked for first row');
        library.logStep('Delete clicked for first row');
        library.logStepWithScreenshot('Delete clicked for first row', 'Delete clicked for first row');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Delete is not displayed');
        console.log('Delete is not displayed');
        library.logStepWithScreenshot('Delete is not displayed', 'Delete is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }
}
