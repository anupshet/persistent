/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const addNewValidConfigBtn = './/button[contains(text(), "ADD NEW DATA MAPPING")]';
const oldInstrumentDDL = './/button[contains(@data-id, "oldInstrumentId")]';
const searchOldInst = './/button[contains(@data-id, "oldInstrumentId")]/parent::div//input';
const oldAnalyteDDL = './/button[contains(@data-id, "oldAnalyteId")]';
const searchOldAnalyte = './/button[contains(@data-id, "oldAnalyteId")]/parent::div//input';
const oldMethodDDL = './/button[contains(@data-id, "oldMethodId")]';
const searchOldMethod = './/button[contains(@data-id, "oldMethodId")]/parent::div//input';
const addBtn = './/button[@id = "addMapping"]';
const selectedValidConfig = './/ul[@id = "selValidConfigs"]/li';
const reagDdl = './/div//button[contains(@data-id, "Reagent")]';

export class DataUnMappedConfig {
  clickAddNewDataMapping() {
    let flag = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(addNewValidConfigBtn));
      browser.executeScript('arguments[0].scrollIntoView();', btn);
      btn.isDisplayed().then(function () {
        library.click(btn);
        console.log('Add New Valid Config Button Clicked');
        library.logStep('Add New Valid Config Button Clicked');
        library.logStepWithScreenshot('Add New Valid Config Button Clicked', 'Add New Valid Config Button Clicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Add New Valid Config Button not displayed');
        console.log('Add New Valid Config Button not displayed');
        library.logStepWithScreenshot('Add New Valid Config Button not displayed', 'Add New Valid Config Button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectInstrumentAddNewDataMapping(instrumentName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(oldInstrumentDDL));
      browser.wait
        (browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Old Instrument Dropdown is not clickable').then(function () {
          library.clickJS(ddl);
          dashboard.waitForScroll();
          const search = element(by.xpath(searchOldInst));
          search.sendKeys(instrumentName);
          const options = element
            (by.xpath('.//li/a[contains(@role,"option")][contains(@aria-selected,"false")]/span[contains(text(),  "' + instrumentName + '")]'));
          browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Old Instrument Dropdown Options not displayed');
          browser.executeScript('arguments[0].scrollIntoView();', options);
          library.clickJS(options);
          library.logStep('Old Instrument selected: ' + instrumentName);
          console.log('Old Instrument selected: ' + instrumentName);
          library.logStepWithScreenshot('Old Instrument selected: ' + instrumentName, 'Old Instrument selected: ' + instrumentName);
          flag = true;
          resolve(flag);
        }).catch(function () {
          library.logStep('Old Instrument drop down not displayed');
          console.log('Old Instrument drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectAnalyteAddNewDataMapping(AnalyteName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(oldAnalyteDDL));
      browser.wait
        (browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Old Analyte Dropdown is not clickable').then(function () {
          library.clickJS(ddl);
          dashboard.waitForScroll();
          const search = element(by.xpath(searchOldAnalyte));
          search.sendKeys(AnalyteName);
          const options = element(by.xpath
            ('.//li/a[contains(@role,"option")][contains(@aria-selected,"false")]/span[contains(text(),  "' + AnalyteName + '")]'));
          browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Old Analyte Dropdown Options not displayed');
          browser.executeScript('arguments[0].scrollIntoView();', options);
          library.clickJS(options);
          library.logStep('Old Analyte selected: ' + AnalyteName);
          console.log('Old Analyte selected: ' + AnalyteName);
          library.logStepWithScreenshot('Old Analyte selected: ' + AnalyteName, 'Old Analyte selected: ' + AnalyteName);
          flag = true;
          resolve(flag);
        }).catch(function () {
          library.logStep('Old AnalyteName drop down not displayed');
          console.log('Old AnalyteName drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectMethodAddNewDataMapping(MethodName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(oldMethodDDL));
      browser.wait
        (browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Old Method Dropdown is not clickable').then(function () {
          library.clickJS(ddl);
          dashboard.waitForScroll();
          const search = element(by.xpath(searchOldMethod));
          search.sendKeys(MethodName);
          const options = element
            (by.xpath('.//li/a[contains(@role,"option")][contains(@aria-selected,"false")]/span[contains(text(),  "' + MethodName + '")]'));
          browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Old Method Dropdown Options not displayed');
          browser.executeScript('arguments[0].scrollIntoView();', options);
          library.clickJS(options);
          library.logStep('Old Method selected: ' + MethodName);
          console.log('Old Method selected: ' + MethodName);
          library.logStepWithScreenshot('Old Method selected: ' + MethodName, 'Old Method selected: ' + MethodName);
          flag = true;
          resolve(flag);
        }).catch(function () {
          library.logStep('Old Method drop down not displayed');
          console.log('Old Method drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  selectOldConfig(oldConfig) {
    let flag = false;
    return new Promise((resolve) => {
      const checkbox = element(by.xpath('.//td[contains(text(), "' + oldConfig + '")]/preceding-sibling::td/input'));
      browser.wait(browser.ExpectedConditions.visibilityOf(checkbox), 15000, 'Old Config Options not displayed');
      checkbox.isDisplayed().then(function () {
        library.clickJS(checkbox);
        library.logStep('Old config selected: ' + oldConfig);
        console.log('Old config selected: ' + oldConfig);
        library.logStepWithScreenshot('Old config selected: ' + oldConfig, 'Old config selected: ' + oldConfig);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Old config not displayed: ' + oldConfig);
        console.log('Old config not displayed: ' + oldConfig);
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddConfig() {
    let flag = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(addBtn));
      browser.executeScript('arguments[0].scrollIntoView();', btn);
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        dashboard.waitForElement();
        console.log('ADD button on Add New Valid Config Clicked');
        library.logStep('ADD button on Add New Valid Config Clicked');
        library.logStepWithScreenshot('ADD button on Add New Valid Config Clicked', 'ADD button on Add New Valid Config Clicked');
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

  verifyReagentlotInValidConfig(reagentLot) {
    let flag = false;
    return new Promise((resolve) => {
      const validconfig = element(by.xpath(selectedValidConfig));
      validconfig.isDisplayed().then(function () {
        validconfig.getText().then(function (actual) {
          if (actual.includes(reagentLot)) {
            console.log('Reagent Lot Displayed: ' + reagentLot);
            library.logStep('Reagent Lot Displayed: ' + reagentLot);
            library.logStepWithScreenshot('Reagent Lot Displayed: ' + reagentLot, 'Reagent Lot Displayed: ' + reagentLot);
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Reagent Lot Not Displayed for Vitros config');
        console.log('Reagent Lot Not Displayed for Vitros config');
        library.logStepWithScreenshot('Reagent Lot Not Displayed for Vitros config', 'Reagent Lot Not Displayed for Vitros config');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectReagent(reagentName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(reagDdl));
      browser.wait(browser.ExpectedConditions.visibilityOf(ddl), 110000, 'Reagent DDL not displayed');
      browser.executeScript('arguments[0].scrollIntoView();', ddl);
      ddl.isDisplayed().then(function () {
        library.click(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + reagentName + '")]'));
        browser.executeScript('arguments[0].scrollIntoView();', options);
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 12000, 'Reagent opts not displayed');
        options.click();
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

  selectCheckBox(instrumentName) {
    let flag = false;
    return new Promise((resolve) => {
      const checkbox = element(by.xpath('.//td[contains(text(), "' + instrumentName + '")]/parent::tr/td/input'));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(checkbox), 20000, 'checkbox not clickable');
      checkbox.isDisplayed().then(function () {
        library.clickJS(checkbox);
        library.logStep('Mapping selected for Instrument: ' + instrumentName);
        console.log('Mapping selected for Instrument: ' + instrumentName);
        library.logStepWithScreenshot
          ('Mapping selected for Instrument: ' + instrumentName, 'Mapping selected for Instrument: ' + instrumentName);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Checkbox not displayed for Instrument: ' + instrumentName);
        console.log('Checkbox not displayed for Instrument: ' + instrumentName);
        flag = false;
        resolve(flag);
      });
    });
  }
}
