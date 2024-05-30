/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const btnAddUnitCat = './/button[contains(text(), "Add New Unit Category")]';
const tbxAddUnitCatName = './/input[contains(@id, "unitCategoryName")]';
const btnSubmitAddId = 'btnAddUnit';
const btnSubmitEditId = 'btnUpdateUnit';
const titleMain = './/h2[contains(text(), "Unit Category")]';
const titleInfo = './/p[contains(text(), "Below is the current Unit Category Configuration")]';
const ddlShowEntries = './/select[contains(@name, "_length")]';
const tbxSearch = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const firstVal = './/table[@id =  "tblUnitCategory"]//tbody/tr[1]';
const firstUnitCategory = './/tr/th[@aria-controls = "tblUnitCategory"]/ancestor::table//tbody/tr/td[2]';

export class UnitCategory {
  clickOnAddUnitCategory() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAddUnitCat));
      library.click(clickBtn);
      console.log('Add new Unit Category button clicked');
      library.logStep('Add new Unit Category button clicked');
      library.logStepWithScreenshot('Add new Unit Category button clicked', 'Add new Unit Category button clicked');
      flag = true;
      resolve(flag);
    });
  }

  addUnitCategoryName(name) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(tbxAddUnitCatName));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(name);
        library.logStep('Added Unit Category name: ' + name);
        console.log('Added Unit Category name: ' + name);
        library.logStepWithScreenshot('Added Unit Category name: ' + name, 'Added Unit Category name: ' + name);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Unit Category Name Input box not displayed');
        console.log('Unit Category Name Input box not displayed');
        library.logStepWithScreenshot('Unit Category Name Input box not displayed', 'Unit Category Name Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddButtonOnAddUnitCategory() {
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

  clickSubmitButtonOnUpdateUnitCategory() {
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

  verifyUnitCategoryAdded(expectedUnitCategory) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(firstVal));
      dataTable.isDisplayed().then(function () {
        const unitCat = element(by.xpath(firstUnitCategory));
        unitCat.getText().then(function (actualTxt) {
          const actualunitCat = actualTxt.trim();
          if (expectedUnitCategory === actualunitCat) {
            library.logStep('Unit Category is displayed in the table: ' + actualunitCat);
            console.log('Unit Category is displayed in the table: ' + actualunitCat);
            library.logStepWithScreenshot('UnitCategoryDisplayed', 'UnitCategoryDisplayed');
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
          console.log('Unit Category Page UI Verified');
          library.logStepWithScreenshot('Unit Category Page UI Verified', 'Unit Category Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Unit Category page UI not verified');
          library.logStep('Unit Category page UI not verified');
          library.logStepWithScreenshot('Unit Category Page UI not Verified', 'Unit Category Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
