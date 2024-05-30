/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { Dashboard } from '../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../utils/browserUtil';
import { by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const addMatricesButton = './/button[contains(text(), "Add New Matrix")]';
const addMatricesName = './/input[contains(@id, "name")]';
const addMatricesAddButton = './/button[contains(@type, "submit")]';
const mainTitle = './/h2[contains(text(), "Matrices")]';
const infoTitle = './/p[contains(text(), "Below is the current Matrix Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';

export class Matrices {
  clickOnAddMatrices() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addMatricesButton));
      library.click(clickBtn);
      console.log('Add new Matrices button clicked');
      library.logStep('Add new Matrices button clicked');
      flag = true;
      resolve(flag);
    });
  }

  addMatricesName(name) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(addMatricesName));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(name);
        library.logStep('Added Matrix name: ' + name);
        console.log('Added Matrix name: ' + name);
        library.logStepWithScreenshot('Added Matrix name: ' + name, 'Added Matrix name: ' + name);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Name fiels is not displayed');
        console.log('Name fiels is not displayed');
        library.logStepWithScreenshot('Name is not displayed', 'Name is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddOnAddMatricesPopup() {
    let flag = false;
    return new Promise((resolve) => {
      const clickAdd = element(by.xpath(addMatricesAddButton));
      clickAdd.isDisplayed().then(function () {
        library.click(clickAdd);
        library.logStep('Add clicked on Matrix');
        console.log('Add clicked on Matrix');
        library.logStepWithScreenshot('Add Clicked', 'Add Clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Add is not displayed');
        console.log('Add is not displayed');
        library.logStepWithScreenshot('Add is not displayed', 'Add is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyMatricesAdded(expectedMatrices) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath('.//table[@id =  "tblMatrix"]//tbody/tr[1]'));
      dataTable.isDisplayed().then(function () {
        const MatricesEle = element(by.xpath('.//tr/th[@aria-controls = "tblMatrix"]/ancestor::table//tbody/tr/td[2]'));
        MatricesEle.getText().then(function (actualTxt) {
          const actualMatrices = actualTxt.trim();
          console.log('expected ' + expectedMatrices + 'actualMatrices' + actualMatrices);
          if (expectedMatrices === actualMatrices) {
            library.logStep('Matrices is displayed in the table: ' + actualMatrices);
            console.log('Matrices is displayed in the table: ' + actualMatrices);
            library.logStepWithScreenshot('MatricesDisplayed', 'MatricesDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        library.logStepWithScreenshot('Data table not displayed', 'Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

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
          console.log('Matrices Page UI Verified');
          library.logStepWithScreenshot('Matrices Page UI Verified', 'Matrices Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Matrices page UI not verified');
          library.logStep('Matrices page UI not verified');
          library.logStepWithScreenshot('Matrices Page UI not Verified', 'Matrices Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
