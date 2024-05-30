/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const mainTitle = './/h2[contains(text(), "Calibrators")]';
const infoTitle = './/p[contains(text(), "Below is the current Calibrator Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const addNewCalibratorBtn = './/button[contains(text(), "Add New Calibrator")]';
const manufacturerDDL = '(.//button[contains(@data-id, "Manufacturer")])[2]';
const calibNameTxt = '//input[@id="Name"]';
const addButton = '(//button[contains(text(), "Add")])[2]';
const submitButton = '//button[contains(text(), "Submit")]';

export class Calibrators {
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
          console.log('Calibrator Page UI Verified');
          library.logStepWithScreenshot('Calibrator Page UI Verified', 'Calibrator Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Calibrator page UI not verified');
          library.logStepWithScreenshot('Calibrator Page UI not Verified', 'Calibrator Page UI not Verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOnAddNewCalibrator() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addNewCalibratorBtn));
      clickBtn.isDisplayed().then(function() {
        library.click(clickBtn);
        console.log('Add new Calibrator button clicked');
        library.logStepWithScreenshot('Add new Calibrator button clicked', 'Add new Calibrator button clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Add new Calibrator button not displayed');
        library.logStepWithScreenshot('Add new Calibrator button not displayed', 'Add new Calibrator button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  addNewSelectManufacturer(manufacturerName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(manufacturerDDL));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 40000, 'Manufacturer Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + manufacturerName + '")])[2]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Manufacturer Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        console.log('Manufacturer selected: ' + manufacturerName);
        library.logStepWithScreenshot('Manufacturer selected: ' + manufacturerName, 'Manufacturer selected: ' + manufacturerName);
        flag = true;
        resolve(flag);
      }).catch(function () {
          console.log('Manufacturer drop down not displayed');
          library.logStepWithScreenshot('Manufacturer drop down not displayed', 'Manufacturer drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  addNewCalibratorName(calibratorName) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(calibNameTxt));
      nameInput.isDisplayed().then(function() {
        nameInput.clear();
        nameInput.sendKeys(calibratorName);
        console.log('Calibrator name added: ' + calibratorName);
        library.logStepWithScreenshot('Calibrator name added: ' + calibratorName, 'Calibrator name added: ' + calibratorName);
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Calibrator name box not displayed');
        library.logStepWithScreenshot('Calibrator name box not displayed', 'Calibrator name box not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickAddOnAddNewCalibrator() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addButton));
      clickBtn.isDisplayed().then(function() {
        library.click(clickBtn);
        console.log('Add button clicked');
        library.logStepWithScreenshot('Add button clicked', 'Add button clicked');
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

  clickOnSubmitOnEdit() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(submitButton));
      clickBtn.isDisplayed().then(function() {
        library.click(clickBtn);
        console.log('Submit button clicked');
        library.logStepWithScreenshot('Submit button clicked', 'Submit button clicked');
        flag = true;
        resolve(flag);
      }).catch(function() {
        console.log('Submit button not displayed');
        library.logStepWithScreenshot('Submit button not displayed', 'Submit button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyCalibratorAdded(expectedCalibrator) {
    let flag = false;
    return new Promise((resolve) => {
      const calib = element(by.xpath('.//tr/td[2][contains(text(), "' + expectedCalibrator + '")]'));
      calib.isDisplayed().then(function () {
        console.log('Calibrator is added: ' + expectedCalibrator);
        library.logStepWithScreenshot('Calibrator is added: ' + expectedCalibrator, 'Calibrator is added: ' + expectedCalibrator);
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Calibrator is not displayed: ' + expectedCalibrator);
        library.logStepWithScreenshot('Calibrator is not displayed', 'Calibrator is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }
}
