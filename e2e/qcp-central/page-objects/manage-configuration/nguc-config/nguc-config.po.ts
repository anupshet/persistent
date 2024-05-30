/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const instDdl = './/label[contains(text(), "Instrument*")]/parent::div//button[contains(@data-id, "ddlOldConfigInstrument")]';
const addNewOldConfig = './/button[text() = "Add New OldConfig"]';
const newAnalyteDropdownEle = './/button[@data-id = "analyteId"]';
const newInstrumDropdownEle = './/button[@data-id = "instrumentId"]';
const newInstDropDownSearchBox = './/button[@data-id = "instrumentId"]/following-sibling::div//input';
const newMethodDropdownEle = './/button[@data-id = "methodId"]';
const newReagentDropdownEle = './/button[@data-id = "reagentId"]';
const addButton = './/button[text() ="Add"]';

export class NgucConfig {
  isInstrumentDropDownDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ddl = element(by.xpath(instDdl));
      browser.waitForAngular();
      ddl.getAttribute('aria-disabled').then(function (val) {
        if (val === 'false') {
          console.log('Instrument drop down is displayed');
          library.logStep('Instrument drop down is displayed');
          library.logStepWithScreenshot('Instrument drop down is displayed', 'Instrument drop down is displayed');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Instrument drop down is not displayed');
          console.log('Instrument drop down is not displayed');
          library.logStepWithScreenshot('Instrument drop down is not displayed', 'Instrument drop down is not displayed');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOnAddNewOldConfigButton() {
    let flag = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(addNewOldConfig));
      browser.executeScript('arguments[0].scrollIntoView();', btn);
      btn.isDisplayed().then(function () {
        library.click(btn);
        console.log('Add New NGUC Config Button Clicked');
        library.logStep('Add New NGUC Config Button Clicked');
        library.logStepWithScreenshot('Add New NGUC Config Button Clicked', 'Reagent drop down is displayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Add New NGUC Config Button not displayed');
        console.log('Add New NGUC Config Button not displayed');
        library.logStepWithScreenshot('Add New NGUC Config Button not displayed', 'Add New NGUC Config Button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectNewConfigToAdd(Analyte, Instrument, Method, Reagent) {
    let flag, flag1, flag2, flag3, flag4 = false;
    return new Promise((resolve) => {
      const analyteddl = element(by.xpath(newAnalyteDropdownEle));
      const instddl = element(by.xpath(newInstrumDropdownEle));
      const instddlsearch = element(by.xpath(newInstDropDownSearchBox));
      const methodddl = element(by.xpath(newMethodDropdownEle));
      const reagentddl = element(by.xpath(newReagentDropdownEle));
      const optionsAnalyte = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + Analyte + '")]'));
      const optionsInst = element(by.xpath('.//li[@class = "active"]/a[contains(@role,"option")][contains(@aria-selected, "false")]/span[contains(text(), "' + Instrument + '")]'));
      const optionsMethod = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + Method + '")]'));
      const optionsReag = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + Reagent + '")]'));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(analyteddl), 15000, 'Analyte DDL not displayed');
      analyteddl.isDisplayed().then(function () {
        library.click(analyteddl);
        browser.wait(browser.ExpectedConditions.visibilityOf(optionsAnalyte), 15000, 'Analyte opts not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', optionsAnalyte);
        library.clickJS(optionsAnalyte);
        library.logStep('Analyte selected: ' + Analyte);
        console.log('Analyte selected: ' + Analyte);
        library.logStepWithScreenshot('Analyte selected: ' + Analyte, 'Analyte selected: ' + Analyte);
        flag1 = true;
      }).then(function () {
        browser.wait(browser.ExpectedConditions.elementToBeClickable(instddl), 15000, 'Instrument DDL not displayed');
        instddl.isDisplayed().then(function () {
          library.click(instddl);
          instddlsearch.sendKeys(Instrument);
          browser.wait(browser.ExpectedConditions.visibilityOf(optionsInst), 15000, 'Instrument opts not displayed');
          library.clickJS(optionsInst);
          library.logStep('Instrument selected: ' + Instrument);
          console.log('Instrument selected: ' + Instrument);
          library.logStepWithScreenshot('Instrument selected: ' + Instrument, 'Instrument selected: ' + Instrument);
          flag2 = true;
        });
      }).then(function () {
        browser.wait(browser.ExpectedConditions.elementToBeClickable(methodddl), 15000, 'Method DDL not displayed');
        methodddl.isDisplayed().then(function () {
          library.click(methodddl);
          browser.wait(browser.ExpectedConditions.visibilityOf(optionsMethod), 15000, 'Method opts not displayed');
          browser.executeScript('arguments[0].scrollIntoView();', optionsMethod);
          library.clickJS(optionsMethod);
          library.logStep('Method selected: ' + Method);
          console.log('Method selected: ' + Method);
          library.logStepWithScreenshot('Method selected: ' + Method, 'Method selected: ' + Method);
          flag3 = true;
        });
      }).then(function () {
        browser.wait(browser.ExpectedConditions.elementToBeClickable(reagentddl), 15000, 'Reagent DDL not displayed');
        reagentddl.isDisplayed().then(function () {
          library.click(reagentddl);
          browser.wait(browser.ExpectedConditions.visibilityOf(optionsReag), 15000, 'Reagent opts not displayed');
          browser.executeScript('arguments[0].scrollIntoView();', optionsReag);
          library.clickJS(optionsReag);
          library.logStep('Reagent selected: ' + Reagent);
          console.log('Reagent selected: ' + Reagent);
          library.logStepWithScreenshot('Reagent selected: ' + Reagent, 'Reagent selected: ' + Reagent);
          flag4 = true;
        });
      }).then(function () {
        if (flag1 && flag2 && flag3 && flag4 === true) {
          library.logStep('AMIR selected to add nee NGUC config');
          console.log('AMIR selected to add nee NGUC config');
          flag = true;
          resolve(flag);
        }
      }).catch(function () {
        library.logStep('Not able to select AMIR for new NGUC config');
        console.log('Not able to select AMIR for new NGUC config');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnAddButton() {
    let flag = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(addButton));
      const inst = element(by.xpath(instDdl));
      browser.executeScript('arguments[0].scrollIntoView();', btn);
      btn.isDisplayed().then(function () {
        library.click(btn);
        console.log('Add Button Clicked on New NGUC Config page');
        library.logStep('Add Button Clicked on New NGUC Config page');
        library.logStepWithScreenshot('Add Button Clicked on New NGUC Config page', 'Add Button Clicked on New NGUC Config page');
        dashboard.waitForPage();
        browser.wait(browser.ExpectedConditions.elementToBeClickable(inst), 15000, 'Instrument DDL is not clickable');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Add Button not displayed on New NGUC Config popup');
        console.log('Add Button not displayed on New NGUC Config popup');
        library.logStepWithScreenshot('Add Button not displayed on New NGUC Config popup', 'Add Button not displayed on New NGUC Config popup');
        flag = false;
        resolve(flag);
      });
    });
  }
}
