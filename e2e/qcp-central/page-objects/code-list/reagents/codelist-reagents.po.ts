/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const btnAdd = '(//button[contains(text(), "Add")])[2]';
const txtReagentName = '//input[@id="Name"]';
const btnAddNewReagent = './/button[contains(text(), "Add New Reagent")]';
const mainTitle = './/h2[contains(text(), "Reagents")]';
const infoTitle = './/p[contains(text(), "Below is the current Reagent Configuration")]';
const ddlShowEntries = './/select[contains(@name, "_length")]';
const txtSearchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const paginationControls = './/ul[contains(@class, "pagination")]';
const manufacturerDropdown = '//label[@for="ddlManufacturer"]/following-sibling::div//select[@id="ddlManufacturer"]';
const btnEdit = '(.//a[contains(text(), "Edit")])[1]';
const ddlManufacturer = '(.//button[contains(@data-id, "Manufacturer")])[2]';
const reagentsPage = '//a[contains(@href, "/Reagents/Reagents")]';
const btnSubmit = '//button[contains(text(), "Submit")]';
const btnManufacturer = '//button[@data-id="ManufacturerDisplay"]';
const dataTableGrid = './/table[@id =  "tblReagent"]//tbody/tr[1]';
const ReagentElement = './/tr/th[@aria-controls = "tblReagent"]/ancestor::table//tbody/tr/td[3]';
const ReagentElements = './/tr/th[@aria-controls = "tblReagent"]/ancestor::table//tbody/tr/td[2]';

export class Reagents {

  goToReagents() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(reagentsPage));
      library.clickJS(clickBtn);
      console.log('Reagents submenu option clicked');
      library.logStep('Reagents submenu option  clicked');
      library.logStepWithScreenshot('goToReagents', 'goToReagents');
      flag = true;
      resolve(flag);
    });
  }

  clickOnAddNewReagent() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAddNewReagent));
      library.click(clickBtn);
      console.log('Add new Reagent button clicked');
      library.logStep('Add new Reagent button clicked');
      library.logStepWithScreenshot('clickOnAddNewReagent', 'clickOnAddNewReagent');
      flag = true;
      resolve(flag);
    });
  }

  addNewSelectManufacturer(manufacturerName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlManufacturer));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'Manufacturer Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + manufacturerName + '")])[2]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Manufacturer Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Manufacturer selected: ' + manufacturerName);
        console.log('Manufacturer selected: ' + manufacturerName);
        library.logStepWithScreenshot('Manufacturer selected: ' + manufacturerName, 'Manufacturer selected: ' + manufacturerName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Manufacturer drop down not displayed');
          console.log('Manufacturer drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  addNewEnterReagent(reagentName) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(txtReagentName));
      nameInput.clear();
      nameInput.sendKeys(reagentName);
      library.logStep('Reagent name added and modified ' + reagentName);
      console.log('Reagent name added and modified ' + reagentName);
      library.logStepWithScreenshot('addNewEnterReagent', 'addNewEnterReagent');
      flag = true;
      resolve(flag);
    });
  }

  clickOnAdd() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAdd));
      library.click(clickBtn);
      console.log('Add button clicked');
      library.logStep('Add button clicked');
      library.logStepWithScreenshot('clickOnAdd', 'clickOnAdd');
      flag = true;
      resolve(flag);
    });
  }

  clickOnSubmit() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnSubmit));
      library.click(clickBtn);
      console.log('Submit button clicked');
      library.logStep('Submit button clicked');
      library.logStepWithScreenshot('clickOnSubmit', 'clickOnSubmit');
      flag = true;
      resolve(flag);
    });
  }

  verifyReagentsAdded(expectedReagentName) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(dataTableGrid));
      dataTable.isDisplayed().then(function () {
        const ReagentEle = element(by.xpath(ReagentElements));
        ReagentEle.getText().then(function (actualTxt) {
          const actualReagents = actualTxt.trim();
          console.log('expected ' + expectedReagentName + 'actualReagents' + actualReagents);
          if (expectedReagentName === actualReagents) {
            library.logStep('Reagents is displayed in the table: ' + actualReagents);
            console.log('Reagents is displayed in the table: ' + actualReagents);
            library.logStepWithScreenshot('ReagentsDisplayed', 'ReagentsDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyManufacturerSelected(expectedManufactureName) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(dataTableGrid));
      dataTable.isDisplayed().then(function () {
        const ReagentEle = element(by.xpath(ReagentElement));
        ReagentEle.getText().then(function (actualTxt) {
          const actualManufacturer = actualTxt.trim();
          console.log('expected ' + expectedManufactureName + 'actualReagents' + actualManufacturer);
          if (expectedManufactureName === actualManufacturer) {
            library.logStep('Manufacturer is displayed in the table: ' + actualManufacturer);
            console.log('Manufacturer is displayed in the table: ' + actualManufacturer);
            library.logStepWithScreenshot('ManufacturerDisplayed', 'ManufacturerDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyManufacturerDisabled() {
    let flag = false;
    return new Promise((resolve) => {
      const manufac = element(by.xpath(btnManufacturer));
      manufac.isDisplayed().then(function () {
        manufac.getAttribute('aria-disabled').then(function (text) {
          if (text.includes('true')) {
            library.logStep('Manufacturer is disabled');
            console.log('Manufacturer is disabled');
            library.logStepWithScreenshot('Manufacturer Button is disabled', 'Manufacturer Button is disabled');
            flag = false;
            resolve(flag);
          } else {
            library.logStep('Manufacturer  is enabled');
            console.log('Manufacturer  is enabled');
            library.logStepWithScreenshot('Manufacturer is enabled', 'Manufacturer is enabled');
            flag = true;
            resolve(flag);
          }
        });
      });
    });
  }

  uiVerification() {
    let flag = false;
    let count = 0;
    return new Promise((resolve) => {
      const reagents = new Map<string, string>();
      reagents.set('Header Displayed', mainTitle);
      reagents.set('Sub Header Displayed', infoTitle);
      reagents.set('Show Default Displayed', ddlShowEntries);
      reagents.set('Search Displayed', txtSearchBox);
      reagents.set('Table Displayed', tableFirstVal);
      reagents.set('Page control Displayed', paginationControls);
      reagents.set('Manufacturer Dropdown  Displayed', manufacturerDropdown);
      reagents.set('Edit Button Displayed', btnEdit);
      const head = element(by.xpath(mainTitle));
      head.isDisplayed().then(function() {
        reagents.forEach(function (key, value) {
          const test = element(by.xpath(key));
          test.isDisplayed().then(function () {
            console.log(value + ' is displayed.');
            library.logStep(value + ' is displayed.');
            library.logStepWithScreenshot('uiVerification', 'uiVerification');
            count++;
          }).catch(function () {
            library.logStep(value + ' is not displayed.');
            console.log(value + ' is not displayed.');
            library.logStepWithScreenshot('uiVerification', 'uiVerification');
          });
        });
      }).then(function() {
        if (reagents.size === count) {
          console.log('Code list Reagents page UI verified');
          library.logStepWithScreenshot('Code list Reagents Page UI verified', 'Code list Reagents page UI verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Code list Reagents page UI not verified');
          library.logStep('Code list Reagents page UI not verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
