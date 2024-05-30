/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const btnAddUnitName = './/button[contains(text(), "Add New Unit")]';
const inputUnitName = './/input[contains(@id, "Name")]';
const btnAddNewUnit = './/button[contains(@type, "submit")]';
const mainTitle = './/h2[contains(text(), "Units")]';
const infoTitle = './/p[contains(text(), "Below is the current Unit Configuration")]';
const ddlShowEntries = './/select[contains(@name, "_length")]';
const inputSearchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const firstRow = './/table[@id =  "tblUnit"]//tbody/tr[1]';
const firstUnitName = './/tr/th[@aria-controls = "tblUnit"]/ancestor::table//tbody/tr/td[2]';
const ddlSystemType = './/button[contains(@data-id, "UnitSystemTypeId")]';
const ddlUnitCategory = './/button[contains(@data-id, "UnitCategoryId")]';


export class UnitNames {
  selectSubMenuOption(subMenuName, subMenuOption) {
    let flag = false;
    return new Promise((resolve) => {
      browser.actions().mouseMove
        (element(by.xpath('(.//ul[contains(@class, "dropdown-menu")]//a[text() =  "' + subMenuName + '"])[1]'))).perform();
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
        library.logStepWithScreenshot('Menu not displayed: ' + subMenuOption, 'subMenuOption');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnAddNewUnit() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAddUnitName));
      clickBtn.isDisplayed().then(function() {
        library.click(clickBtn);
        console.log('Add new Unit button clicked');
        library.logStepWithScreenshot('Add new Unit button clicked', 'Add new Unit button clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Add new Unit button clicked');
        library.logStepWithScreenshot('Add new Unit button clicked', 'Add new Unit button clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  addUnitName(name) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(inputUnitName));
      nameInput.isDisplayed().then(function() {
        nameInput.clear();
        nameInput.sendKeys(name);
        console.log('Added Unit name: ' + name);
        library.logStepWithScreenshot('Added Unit name: ' + name, 'Added Unit name: ' + name);
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Unit Name Input box not displayed');
        library.logStepWithScreenshot('Unit Name Input box not displayed', 'Unit Name Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddButtonOnAddUnit() {
    let flag = false;
    return new Promise((resolve) => {
      const clickAdd = element(by.xpath(btnAddNewUnit));
      clickAdd.isDisplayed().then(function() {
        library.click(clickAdd);
        console.log('Add Clicked');
        library.logStepWithScreenshot('Add Clicked', 'Add Clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Add button not displayed');
        library.logStepWithScreenshot('Add button not displayed', 'Add button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyUnitAdded(expectedUnit) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(firstRow));
      dataTable.isDisplayed().then(function () {
        const name = element(by.xpath(firstUnitName));
        name.getText().then(function (actualTxt) {
          const actualUnit = actualTxt.trim();
          if (expectedUnit === actualUnit) {
            library.logStep('Unit Name is displayed in the table: ' + actualUnit);
            console.log('Unit Name is displayed in the table: ' + actualUnit);
            library.logStepWithScreenshot('UnitNameDisplayed ', 'UnitNameDisplayed');
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
      maptest.set('Show Default Displayed', ddlShowEntries);
      maptest.set('Search Displayed', inputSearchBox);
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
          console.log('Unit Name Page UI Verified');
          library.logStepWithScreenshot('Unit Name Page UI Verified', 'Unit Name Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Unit Name page UI not verified');
          library.logStep('Unit Name page UI not verified');
          library.logStepWithScreenshot('Unit Name Page UI not Verified', 'Unit Name Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  selectUnitSystemType(unitSystemTypeName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlSystemType));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Unit System Type Name Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + unitSystemTypeName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Unit System Type Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Unit System Type selected: ' + unitSystemTypeName);
        console.log('Unit System Type selected: ' + unitSystemTypeName);
        library.logStepWithScreenshot
        ('Unit System Type selected: ' + unitSystemTypeName, 'Unit System Type selected: ' + unitSystemTypeName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Unit System Type drop down not displayed');
          console.log('Unit System Type drop down not displayed');
          library.logStepWithScreenshot('Unit System Type not displayed', 'Unit System Type not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectUnitCategoryName(unitCategoryName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlUnitCategory));
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
}
