/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const mainTitle = './/h2[contains(text(), "Analytes")]';
const infoTitle = './/p[contains(text(), "Below is the current Analyte Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const addAnalyteButton = './/button[contains(text(), "Add New Analyte")]';
const addAnalyteName = './/input[contains(@id, "Name")]';
const addAnalyteAddButton = './/button[contains(@type, "submit")]';
const dataTable = './/table[contains(@id,"tbl")]//tbody/tr[1]';
const colTwoAllVals = './/tr/th[contains(@aria-controls, "tbl")]/ancestor::table//tbody/tr/td[2]';

export class Analytes {
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
          console.log('Analytes page UI verified');
          library.logStepWithScreenshot('Analytes page UI verified', 'Analytes page UI verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Analytes page UI not verified');
          library.logStep('Analytes page UI not verified');
          library.logStepWithScreenshot('Analytes page UI not verified', 'Analytes page UI not verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOnAddAnalyte() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addAnalyteButton));
      library.click(clickBtn);
      console.log('Add new Analyte button clicked');
      library.logStep('Add new Analyte button clicked');
      library.logStepWithScreenshot('Add new Analyte button clicked', 'Add new Analyte button clicked');
      flag = true;
      resolve(flag);
    });
  }

  addAnalyteName(name) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(addAnalyteName));
      nameInput.isDisplayed().then(function() {
        nameInput.clear();
        nameInput.sendKeys(name);
        library.logStep('Added Analyte: ' + name);
        console.log('Added Analyte: ' + name);
        library.logStepWithScreenshot('Added Analyte: ' + name, 'Added Analyte: ' + name);
        flag = true;
        resolve(flag);
      }).catch(function() {
        library.logStep('Analyte Name Input box not displayed');
        console.log('Analyte Name Input box not displayed');
        library.logStepWithScreenshot('Analyte Name Input box not displayed', 'Analyte Name Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddButtonOnAddAnalyte() {
    let flag = false;
    return new Promise((resolve) => {
      const clickAdd = element(by.xpath(addAnalyteAddButton));
      clickAdd.isDisplayed().then(function() {
        library.click(clickAdd);
        library.logStep('Add Clicked');
        console.log('Add Clicked');
        library.logStepWithScreenshot('Add Clicked', 'Add Clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        library.logStep('Add button not displayed');
        console.log('Add button not displayed');
        library.logStepWithScreenshot('Add button not displayed', 'Add button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyAnalyteAdded(expectedAnalyte) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTableEle = element(by.xpath(dataTable));
      dataTableEle.isDisplayed().then(function () {
        const analyte = element(by.xpath(colTwoAllVals));
        analyte.getText().then(function (actualTxt) {
          const actualAnalyte = actualTxt.trim();
          if (expectedAnalyte === actualAnalyte) {
            library.logStep('Analyte is displayed in the table: ' + actualAnalyte);
            console.log('Analyte is displayed in the table: ' + actualAnalyte);
            library.logStepWithScreenshot('AnalyteDisplayed', 'AnalyteDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        library.logStepWithScreenshot('AnalyteNotDisplayed', 'AnalyteNotDisplayed');
        flag = false;
        resolve(flag);
      });
    });
  }
}
