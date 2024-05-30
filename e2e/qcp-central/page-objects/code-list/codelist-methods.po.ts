/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */

import { Dashboard } from '../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../utils/browserUtil';
import { by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const addMethodButton = './/button[contains(text(), "Add New Method")]';
const addMethodName = './/input[contains(@id, "Name")]';
const addMethodAddButton = './/button[contains(@type, "submit")]';
const mainTitle = './/h2[contains(text(), "Methods")]';
const infoTitle = './/p[contains(text(), "Below is the current Method Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const firstVal = './/table[@id =  "tblMethod"]//tbody/tr[1]';
const firstMethod = './/tr/th[@aria-controls = "tblMethod"]/ancestor::table//tbody/tr/td[2]';

export class Methods {
  clickOnAddMethod() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addMethodButton));
      clickBtn.isDisplayed().then(function() {
        library.click(clickBtn);
        console.log('Add new Method button clicked');
        library.logStep('Add new Method button clicked');
        library.logStepWithScreenshot('Add new Method button clicked', 'Add new Method button clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Add new Method button clicked');
        library.logStepWithScreenshot('Add new Method button clicked', 'Add new Method button clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  addMethodName(name) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(addMethodName));
      nameInput.isDisplayed().then(function() {
        nameInput.clear();
        nameInput.sendKeys(name);
        library.logStep('Added Method name: ' + name);
        console.log('Added Method name: ' + name);
        library.logStepWithScreenshot('Added Method name: ' + name, 'Added Method name: ' + name);
        flag = true;
        resolve(flag);
      }).catch(function() {
        library.logStep('Method Name Input box not displayed');
        console.log('Method Name Input box not displayed');
        library.logStepWithScreenshot('Method Name Input box not displayed', 'Method Name Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddButtonOnAddMethod() {
    let flag = false;
    return new Promise((resolve) => {
      const clickAdd = element(by.xpath(addMethodAddButton));
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

  verifyMethodAdded(expectedMethod) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(firstVal));
      dataTable.isDisplayed().then(function () {
        const method = element(by.xpath(firstMethod));
        method.getText().then(function (actualTxt) {
          const actualmethod = actualTxt.trim();
          if (expectedMethod === actualmethod) {
            library.logStep('Method is displayed in the table: ' + actualmethod);
            console.log('Method is displayed in the table: ' + actualmethod);
            library.logStepWithScreenshot('MethodDisplayed', 'MethodDisplayed');
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
          console.log('Method Page UI Verified');
          library.logStepWithScreenshot('Method Page UI Verified', 'Method Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Method page UI not verified');
          library.logStep('Method page UI not verified');
          library.logStepWithScreenshot('Method Page UI not Verified', 'Method Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
