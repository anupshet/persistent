/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../utils/browserUtil';
import { by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const addManufacturerButton = './/button[contains(text(), "Add New Manufacturer")]';
const addManufacturerName = './/input[contains(@id, "name")]';
const addManufacturerAddButton = './/button[contains(@type, "submit")]';
const mainTitle = './/h2[contains(text(), "Manufacturers")]';
const subTitle = './/h3[contains(text(), "Your Manufacturers configuration page.")]';
const infoTitle = './/p[contains(text(), "Below is the current Manufacturer Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';

export class Manufacturer {
  clickOnAddManufacturer() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addManufacturerButton));
      library.click(clickBtn);
      console.log('Add new manufacturer button clicked');
      library.logStep('Add new manufacturer button clicked');
      library.logStepWithScreenshot('Add new manufacturer button clicked', 'Add new manufacturer button clicked');
      flag = true;
      resolve(flag);
    });
  }

  addManufacturerName(name) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(addManufacturerName));
      nameInput.isDisplayed().then(function () {
        nameInput.clear();
        nameInput.sendKeys(name);
        library.logStep('Added manufacturer name: ' + name);
        console.log('Added manufacturer name: ' + name);
        library.logStepWithScreenshot('Added manufacturer name: ' + name, 'Added manufacturer name: ' + name);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Manufacturer Name Input box not displayed');
        console.log('Manufacturer Name Input box not displayed');
        library.logStepWithScreenshot('Manufacturer Name Input box not displayed', 'Manufacturer Name Input box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddButtonOnAddManufacturer() {
    let flag = false;
    return new Promise((resolve) => {
      const clickAdd = element(by.xpath(addManufacturerAddButton));
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

  verifyManufacturerAdded(expectedManufacturer) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath('.//table[@id =  "tblManufacturer"]//tbody/tr[1]'));
      dataTable.isDisplayed().then(function () {
        const manufacturer = element(by.xpath('.//tr/th[@aria-controls = "tblManufacturer"]/ancestor::table//tbody/tr/td[2]'));
        manufacturer.getText().then(function (actualTxt) {
          const actualManufacturer = actualTxt.trim();
          if (expectedManufacturer === actualManufacturer) {
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
      maptest.set('Sub Title Displayed', subTitle);
      maptest.set('Sub Header Displayed', infoTitle);
      maptest.set('Show Default Displayed', showEntriesDdl);
      maptest.set('Search Displayed', searchBox);
      maptest.set('Table Displayed', tableFirstVal);
      const head = element(by.xpath(mainTitle));
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
          console.log('Manufacturer Page UI Verified');
          library.logStepWithScreenshot('Manufacturer Page UI Verified', 'Manufacturer Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Manufacturer page UI not verified');
          library.logStep('Manufacturer page UI not verified');
          library.logStepWithScreenshot('Manufacturer Page UI not Verified', 'Manufacturer Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }
}
