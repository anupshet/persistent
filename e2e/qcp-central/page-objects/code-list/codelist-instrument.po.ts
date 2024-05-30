/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const btnAddInstrument = './/button[contains(text(), "Add New Instrument")]';
const nameAddInstrument = './/input[contains(@id, "InstrumentNameAdd")]';
const btnAddInstrumentEdit = './/button[contains(@id, "btnUpdateInstrument")]';
const btnAddInstrumentAdd = './/button[contains(@id, "btnAddInstrument")]';
const mainTitle = './/h2[contains(text(), "Instruments")]';
const infoTitle = './/p[contains(text(), "Below is the current Instrument Configuration")]';
const ddlShowEntries = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const paginationControls = './/ul[contains(@class, "pagination")]';
const addManufacturer = '//button[@data-id="ddlManufacturerAdd"]';
const manufacturerName = '//button[@data-id="ddlManufacturerAdd"]/following-sibling::div//span[contains(text(),"Abbott")]';
const dataTableGrid = './/table[@id =  "tblInstrument"]//tbody/tr[1]';

export class Instrument {
  clickOnAddInstrument() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAddInstrument));
      library.click(clickBtn);
      console.log('Add new instrument button clicked');
      library.logStep('Add new instrument button clicked');
      library.logStepWithScreenshot('clickOnAddInstrument', 'clickOnAddInstrument');
      flag = true;
      resolve(flag);
    });
  }

  addNewInstrument(manufacturer, name) {
    let flag = false;
    return new Promise((resolve) => {
      const addManufacturerDrpdwn = element(by.xpath(addManufacturer));
      const nameInput = element(by.xpath(nameAddInstrument));
      const clickAdd = element(by.xpath(btnAddInstrumentAdd));
      const manufName = element(by.xpath(manufacturerName));
      library.clickJS(addManufacturerDrpdwn);
      library.clickJS(manufName);
      library.logStep('Manufacturer Selected: ' + manufacturerName);
      console.log('Manufacturer Selected: ' + manufacturerName);
      library.logStepWithScreenshot('addNewInstrument', 'addNewInstrument');
      nameInput.clear();
      nameInput.sendKeys(name);
      library.click(clickAdd);
      library.logStep('Added instrument: ' + name);
      console.log('Added instrument: ' + name);
      library.logStepWithScreenshot('addNewInstrument', 'addNewInstrument');
      flag = true;
      resolve(flag);
    });
  }

  editInstrumentsName(iname) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(nameAddInstrument));
      const clickAdd = element(by.xpath(btnAddInstrumentEdit));
      nameInput.clear();
      nameInput.sendKeys(iname);
      library.clickJS(clickAdd);
      library.logStep('Submit button clicked');
      library.logStep('Instrument Name Edited: ' + iname);
      library.logStepWithScreenshot('editInstrumentsName', 'editInstrumentsName');
      flag = true;
      resolve(flag);
    });
  }

  verifyInstrumentAdded(expectedInstrument) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(dataTableGrid));
      browser.wait(browser.ExpectedConditions.visibilityOf(dataTable), 20000, 'Data table not displayed');
      dataTable.isDisplayed().then(function () {
        const instrument = element(by.xpath('.//tr/th[@aria-controls = "tblInstrument"]/ancestor::table//tbody/tr/td[2]'));
        instrument.getText().then(function (actualTxt) {
          const actualInstrument = actualTxt.trim();
          if (expectedInstrument === actualInstrument) {
            library.logStep('Instrument is displayed in the table: ' + actualInstrument);
            console.log('Instrument is displayed in the table: ' + actualInstrument);
            library.logStepWithScreenshot('InstrumentDisplayed', 'InstrumentDisplayed');
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
        const manufac = element(by.xpath(addManufacturer));
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
      const instru = new Map<string, string>();
      instru.set('Header Displayed', mainTitle);
      instru.set('Sub Header Displayed', infoTitle);
      instru.set('Show Default Displayed', ddlShowEntries);
      instru.set('Search Displayed', searchBox);
      instru.set('Table Displayed', tableFirstVal);
      instru.set('Page control Displayed', paginationControls);
      const head = element(by.xpath(mainTitle));
      head.isDisplayed().then(function() {
        instru.forEach(function (key, value) {
          const test = element(by.xpath(key));
          test.isDisplayed().then(function () {
            console.log(value + ' is displayed.');
            library.logStep(value + ' is displayed.');
            library.logStepWithScreenshot('uiVerification', 'uiVerification');
            count++;
          }).catch(function () {
            library.logStep(value + ' is not displayed.');
            console.log(value + ' is not displayed.');
          });
        });
      }).then(function() {
        if (instru.size === count) {
          console.log('Code list Instrument page UI verified');
          library.logStepWithScreenshot('Code list Instrument Page UI verified', 'Code list Instrument page UI verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Code list Instrument page UI not verified');
          library.logStep('Code list Instrument page UI not verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
