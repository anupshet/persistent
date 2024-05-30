/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const ddlAnalyte = './/button[contains(@data-id, "ddlAnalyte")]';
const ddlAnalyteAdd = './/button[contains(@data-id, "ddlAnalyteAdd")]';
const btnAddUnitConv = './/button[contains(text(), "Add New Analyte Unit Conversion")]';
const ddlFromUnitCat = './/button[contains(@data-id, "ddlFromUnitCategoryAdd")]';
const ddlFromUnit = './/button[contains(@data-id, "ddlFromUnitAdd")]';
const ddlToUnitCat = './/button[contains(@data-id, "ddlToUnitCategoryAdd")]';
const ddlToUnit = './/button[contains(@data-id, "ddlToUnitAdd")]';
const tbxFromOffsetId = 'txtFromOffsetAdd';
const tbxToOffsetId = 'txtToOffsetAdd';
const tbxMultiplierId = 'txtMultiplierAdd';
const tbxDividerId = 'txtDividerAdd';
const tbxCommentId = 'txtCommentAdd';
const btnSubmitAddId = 'btnAddAnalyteUnitConversion';
const btnSubmitEditId = 'btnUpdateAnalyteUnitConversion';
const titleMain = './/h2[contains(text(), "Analyte Unit Conversion")]';
const titleInfo = './/p[contains(text(), "Below is the current Analyte Unit Conversion Configuration")]';
const ddlShowEntries = './/select[contains(@name, "_length")]';
const tbxSearch = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const firstRow = './/tr/th[@aria-controls = "tblAnalyteUnitConversion"]/ancestor::table//tbody/tr[1]/td';
const firstVal = './/table[@id =  "tblAnalyteUnitConversion"]//tbody/tr[1]';
const firstAnalyte = './/tr/th[@aria-controls = "tblAnalyteUnitConversion"]/ancestor::table//tbody/tr/td[2]';
const firstFromUnitName = './/tr/th[@aria-controls = "tblAnalyteUnitConversion"]/ancestor::table//tbody/tr/td[3]';
const firstFromUnitOffset = './/tr/th[@aria-controls = "tblAnalyteUnitConversion"]/ancestor::table//tbody/tr/td[4]';
const firstMultiplier = './/tr/th[@aria-controls = "tblAnalyteUnitConversion"]/ancestor::table//tbody/tr/td[5]';
const firstDivider = './/tr/th[@aria-controls = "tblAnalyteUnitConversion"]/ancestor::table//tbody/tr/td[6]';
const firstToUnitOffset = './/tr/th[@aria-controls = "tblAnalyteUnitConversion"]/ancestor::table//tbody/tr/td[7]';
const firstToUnitName = './/tr/th[@aria-controls = "tblAnalyteUnitConversion"]/ancestor::table//tbody/tr/td[8]';
const analyteSearchEle = './/button[contains(@data-id , "ddlAnalyte")]/following-sibling::div//input';
const analyteSearch = './/button[contains(@data-id , "ddlAnalyteAdd")]/following-sibling::div//input';
const addAnalyteSearch = './/button[contains(@data-id , "ddlAnalyteAdd")]/following-sibling::div//input';
const unitCatSearch = './/button[contains(@data-id , "ddlUnitCategory")]/following-sibling::div//input';
const fromUnitCatSearch = './/button[contains(@data-id , "ddlFromUnitCategoryAdd")]/following-sibling::div//input';
const fromUnitNameSearch = './/button[contains(@data-id , "ddlFromUnitAdd")]/following-sibling::div//input';
const toUnitCatSearch = './/button[contains(@data-id , "ddlToUnitCategoryAdd")]/following-sibling::div//input';
const toUnitSearch = './/button[contains(@data-id , "ddlToUnitAdd")]/following-sibling::div//input';


export class AnalyteUnitConversion {
  clickOnAddAnalyteUnitConversion() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAddUnitConv));
      library.click(clickBtn);
      console.log('Add new Analyte Unit Conversion button clicked');
      library.logStep('Add new Analyte Unit Conversion button clicked');
      library.logStepWithScreenshot('Add new Analyte Unit Conversion button clicked', 'Add new Analyte Unit Conversion button clicked');
      flag = true;
      resolve(flag);
    });
  }

  clickSubmitButtonOnAddAnalyteUnitConversion() {
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

  clickSubmitButtonOnUpdateAnalyteUnitConversion() {
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

  verifyAnalyteUnitConversionAdded(expAnalyte, expFromUnit, expFromOffset, expMultiplier, expDivider, expToOffset, expToUnit) {
    const maptest = new Map<string, string>();
    let flag = false;
    let count = 0;
    return new Promise((resolve) => {
      maptest.set(firstAnalyte, expAnalyte);
      maptest.set(firstFromUnitName, expFromUnit);
      maptest.set(firstFromUnitOffset, expFromOffset);
      maptest.set(firstMultiplier, expMultiplier);
      maptest.set(firstDivider, expDivider);
      maptest.set(firstToUnitOffset, expToOffset);
      maptest.set(firstToUnitName, expToUnit);
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(firstVal));
      dataTable.isDisplayed().then(function () {
        maptest.forEach(function (key, value) {
          const ele = element(by.xpath(value));
          ele.getText().then(function (actualTxt) {
            const actualUnitConv = actualTxt.trim();
            if (key === actualUnitConv) {
              count++;
              console.log(key + ' is displayed.');
              library.logStep(key + ' is displayed.');
            } else {
              library.logStep(key + ' is not displayed.');
              console.log(key + ' is not displayed.');
            }
          });
        });
      }).then(function () {
        if (maptest.size === count) {
          console.log('Analyte Unit Conversion Added');
          library.logStepWithScreenshot('Analyte Unit Conversion Added', 'Analyte Unit Conversion Added');
          flag = true;
          resolve(flag);
        } else {
          console.log('Analyte Unit Conversion not Added');
          library.logStep('Analyte Unit Conversion not Added');
          library.logStepWithScreenshot('Analyte Unit Conversion not Added', 'Analyte Unit Conversion not Added');
          flag = false;
          resolve(flag);
        }
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
          console.log('Analyte Unit Conversion Page UI Verified');
          library.logStepWithScreenshot('Analyte Unit Conversion Page UI Verified', 'Analyte Unit Conversion Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Analyte Unit Conversion page UI not verified');
          library.logStep('Analyte Unit Conversion page UI not verified');
          library.logStepWithScreenshot('Analyte Unit Conversion Page UI not Verified', 'Analyte Unit Conversion Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  selectAnalyte(analyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlAnalyte));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'Analyte Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const search = element(by.xpath(analyteSearchEle));
        search.sendKeys(analyteName);
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + analyteName + '")])[1]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Analyte Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Analyte selected: ' + analyteName);
        console.log('Analyte selected: ' + analyteName);
        library.logStepWithScreenshot('Analyte selected: ' + analyteName, 'Analyte selected: ' + analyteName);
        flag = true;
        resolve(flag);
      }).catch(function () {
          library.logStep('Analyte drop down not displayed');
          console.log('Analyte drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectAnalyteAddAnalyteUnitConversion(analyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlAnalyteAdd));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'Analyte Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const search = element(by.xpath(addAnalyteSearch));
        search.sendKeys(analyteName);
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + analyteName + '")])[2]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Analyte Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Analyte selected: ' + analyteName);
        console.log('Analyte selected: ' + analyteName);
        library.logStepWithScreenshot('Analyte selected: ' + analyteName, 'Analyte selected: ' + analyteName);
        flag = true;
        resolve(flag);
      }).catch(function () {
          library.logStep('Analyte drop down not displayed');
          console.log('Analyte drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectFromUnitCategory(fromUnitCategory) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlFromUnitCat));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'From Unit Category Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const search = element(by.xpath(fromUnitCatSearch));
        search.sendKeys(fromUnitCategory);
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + fromUnitCategory + '")])[1]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'From Unit Category Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.click(options);
        library.logStep('From Unit Category selected: ' + fromUnitCategory);
        console.log('From Unit Category selected: ' + fromUnitCategory);
        library.logStepWithScreenshot
        ('From Unit Category selected: ' + fromUnitCategory, 'From Unit Category selected: ' + fromUnitCategory);
        flag = true;
        resolve(flag);
      }).catch(function () {
          library.logStep('From Unit Category drop down not displayed');
          console.log('From Unit Category drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectFromUnitName(fromUnit) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlFromUnit));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'From Unit Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const search = element(by.xpath(fromUnitNameSearch));
        search.sendKeys(fromUnit);
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + fromUnit + '")])[1]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'From Unit Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.click(options);
        library.logStep('From Unit selected: ' + fromUnit);
        console.log('From Unit selected: ' + fromUnit);
        library.logStepWithScreenshot
        ('From Unit selected: ' + fromUnit, 'From Unit selected: ' + fromUnit);
        flag = true;
        resolve(flag);
      }).catch(function () {
          library.logStep('From Unit drop down not displayed');
          console.log('From Unit drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectToUnitCategory(toUnitCategory) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlToUnitCat));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'To Unit Category Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const search = element(by.xpath(toUnitCatSearch));
        search.sendKeys(toUnitCategory);
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + toUnitCategory + '")])[2]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'To Unit Category Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.click(options);
        library.logStep('To Unit Category selected: ' + toUnitCategory);
        console.log('To Unit Category selected: ' + toUnitCategory);
        library.logStepWithScreenshot
        ('To Unit Category selected: ' + toUnitCategory, 'To Unit Category selected: ' + toUnitCategory);
        flag = true;
        resolve(flag);
      }).catch(function () {
          library.logStep('To Unit Category drop down not displayed');
          console.log('To Unit Category drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectToUnitName(toUnit) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlToUnit));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'To Unit Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const search = element(by.xpath(toUnitSearch));
        search.sendKeys(toUnit);
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + toUnit + '")])[2]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'To Unit Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('To Unit selected: ' + toUnit);
        console.log('To Unit selected: ' + toUnit);
        library.logStepWithScreenshot
        ('To Unit selected: ' + toUnit, 'To Unit selected: ' + toUnit);
        flag = true;
        resolve(flag);
      }).catch(function () {
          library.logStep('To Unit drop down not displayed');
          console.log('To Unit drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  addFromOffset(fromOffset) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.id(tbxFromOffsetId));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(fromOffset);
        library.logStep('Added From Offset: ' + fromOffset);
        console.log('Added From Offset: ' + fromOffset);
        library.logStepWithScreenshot('Added From Offset: ' + fromOffset, 'Added From Offset: ' + fromOffset);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('From Offset Input box not displayed');
        console.log('From Offset Input box not displayed');
        library.logStepWithScreenshot('From Offset Input box not displayed', 'From Offset Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  addToOffset(toOffset) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.id(tbxToOffsetId));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(toOffset);
        library.logStep('Added To Offset: ' + toOffset);
        console.log('Added To Offset: ' + toOffset);
        library.logStepWithScreenshot('Added To Offset: ' + toOffset, 'Added To Offset: ' + toOffset);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('To Offset Input box not displayed');
        console.log('To Offset Input box not displayed');
        library.logStepWithScreenshot('To Offset Input box not displayed', 'To Offset Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  addMultiplier(multiplier) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.id(tbxMultiplierId));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(multiplier);
        library.logStep('Added multiplier: ' + multiplier);
        console.log('Added multiplier: ' + multiplier);
        library.logStepWithScreenshot('Added multiplier: ' + multiplier, 'Added multiplier: ' + multiplier);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Multiplier Input box not displayed');
        console.log('Multiplier Input box not displayed');
        library.logStepWithScreenshot('Multiplier Input box not displayed', 'Multiplier Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  addDivider(divider) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.id(tbxDividerId));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(divider);
        library.logStep('Added Divider: ' + divider);
        console.log('Added Divider: ' + divider);
        library.logStepWithScreenshot('Added Divider: ' + divider, 'Added Divider: ' + divider);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Divider Input box not displayed');
        console.log('Divider Input box not displayed');
        library.logStepWithScreenshot('Divider Input box not displayed', 'Divider Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  addUnitConversionComment(comment) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.id(tbxCommentId));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(comment);
        library.logStep('Added Analyte Unit Conversion comment: ' + comment);
        console.log('Added Analyte Unit Conversion comment: ' + comment);
        library.logStepWithScreenshot('Added Analyte Unit Conversion comment: ' + comment,
        'Added Analyte Unit Conversion comment: ' + comment);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Analyte Unit Conversion comment Input box not displayed');
        console.log('Analyte Unit Conversion comment Input box not displayed');
        library.logStepWithScreenshot('Analyte Unit Conversion comment Input box not displayed', 'Analyte Unit Conversion comment Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }
}
