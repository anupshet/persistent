/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const btnAddUnitSysType = './/button[contains(text(), "Add New Unit System Type")]';
const tbxAddUnitSysTypeName = './/input[contains(@id, "UnitSystemTypeNameAdd")]';
const btnSubmitAddId = 'btnAddUnitSystemType';
const btnSubmitEditId = 'btnUpdateUnitSystemType';
const titleMain = './/h2[contains(text(), "Unit System Type")]';
const titleInfo = './/p[contains(text(), "Below is the current Unit System Type Configuration")]';
const ddlShowEntries = './/select[contains(@name, "_length")]';
const tbxSearch = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const firstVal = './/table[@id =  "tblUnitSystemType"]//tbody/tr[1]';
const firstUnitSystemType = './/tr/th[@aria-controls = "tblUnitSystemType"]/ancestor::table//tbody/tr/td[2]';

export class UnitSystemTypes {
  clickOnAddUnitSystemType() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAddUnitSysType));
      library.click(clickBtn);
      console.log('Add new Unit System Type button clicked');
      library.logStep('Add new Unit System Type button clicked');
      library.logStepWithScreenshot('Add new Unit System Type button clicked', 'Add new Unit System Type button clicked');
      flag = true;
      resolve(flag);
    });
  }

  addUnitSystemTypeName(name) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(tbxAddUnitSysTypeName));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(name);
        library.logStep('Added Unit System Type name: ' + name);
        console.log('Added Unit System Type name: ' + name);
        library.logStepWithScreenshot('Added Unit System Type name: ' + name, 'Added Unit System Type name: ' + name);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Unit System Type Name Input box not displayed');
        console.log('Unit System Type Name Input box not displayed');
        library.logStepWithScreenshot('Unit System Type Name Input box not displayed', 'Unit System Type Name Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddButtonOnAddUnitSystemType() {
    let flag = false;
    return new Promise((resolve) => {
      const clickAdd = element(by.id(btnSubmitAddId));
      clickAdd.isDisplayed().then(function () {
        library.click(clickAdd);
        library.logStep('Add Clicked');
        console.log('Add Clicked');
        library.logStepWithScreenshot('Add Clicked', 'Add Clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Add button not displayed');
        console.log('Add button not displayed');
        library.logStepWithScreenshot('Add button not displayed', 'Add button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickSubmitButtonOnUpdateUnitSystemType() {
    let flag = false;
    return new Promise((resolve) => {
      const clickAdd = element(by.id(btnSubmitEditId));
      clickAdd.isDisplayed().then(function () {
        library.click(clickAdd);
        console.log('Add Clicked');
        library.logStepWithScreenshot('Add Clicked', 'Add Clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Add button not displayed');
        library.logStepWithScreenshot('Add button not displayed', 'Add button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyUnitSystemTypeAdded(expectedUnitSystemType) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(firstVal));
      dataTable.isDisplayed().then(function () {
        const unitSysType = element(by.xpath(firstUnitSystemType));
        unitSysType.getText().then(function (actualTxt) {
          const actualunitSysType = actualTxt.trim();
          if (expectedUnitSystemType === actualunitSysType) {
            library.logStep('Unit System Type is displayed in the table: ' + actualunitSysType);
            console.log('Unit System Type is displayed in the table: ' + actualunitSysType);
            library.logStepWithScreenshot('UnitSystemTypeDisplayed', 'UnitSystemTypeDisplayed');
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
      maptest.set('Header Displayed', titleMain);
      maptest.set('Sub Header Displayed', titleInfo);
      maptest.set('Show Default Displayed', ddlShowEntries);
      maptest.set('Search Displayed', tbxSearch);
      maptest.set('Table Displayed', tableFirstVal);
      const head = element(by.xpath(titleMain));
      head.isDisplayed().then(function () {
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
      }).then(function () {
        if (maptest.size === count) {
          console.log('Unit System Type Page UI Verified');
          library.logStepWithScreenshot('Unit System Type Page UI Verified', 'Unit System Type Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Unit System Type page UI not verified');
          library.logStep('Unit System Type page UI not verified');
          library.logStepWithScreenshot('Unit System Type Page UI not Verified', 'Unit System Type Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
