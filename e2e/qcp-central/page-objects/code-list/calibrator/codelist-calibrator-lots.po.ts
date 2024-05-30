/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const addNewCalibLotBtn = './/button[contains(text(), "Add New Calibrator Lot")]';
const submitButtonCalibLot = './/button[contains(@id, "AddCalibratorLot")]';
const calibratorDdl = '(.//button[contains(@data-id, "Calibrator")])[1]';
const btnSubmit = '//button[contains(text(), "Submit")]';
const btnEditSubmit = '(//button[contains(text(), "Submit")])[2]';
const btnAddCalibratorLot = './/button[contains(text(), "Add New Calibrator Lot")]';
const mainTitle = './/h2[contains(text(), "Calibrator Lot")]';
const infoTitle = './/p[contains(text(), "Below is the current Calibrator Lot Configuration")]';
const ddlShowEntries = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const paginationControls = './/ul[contains(@class, "pagination")]';
const calibratorDropdown = '//label[@for="ddlCalibrator"]/following-sibling::div//select[@id="ddlCalibrator"]';
const btnReloadTable = './/a[contains(text(), "Reload Table")]';
const btnDelete = './/a[contains(text(), "Delete")]';
const btnEdit = './/a[contains(text(), "Edit")]';
const ddlCalibratorAdd = '(.//button[contains(@data-id, "ddlCalibratorAdd")])[1]';
const txtLotNumber = '//*[@id="LotNumberAdd"]';
const txtBoxExpirationDate = '//input[@id="ExpirationDateAdd"]';
const ddlSelectYear = './/select[@data-handler = "selectYear"]';
const ddlSelectMonth = './/select[@data-handler = "selectMonth"]';
const selectDay = '(.//td[@data-handler = "selectDay"]/a)';
const unspecifiedConfirmEditMessage = './/div[contains(@class, "bootbox-body")]';
const btnEditOk = '//button[@data-bb-handler="ok"]';
const dataTableGrid = './/table[@id =  "tblCalibratorLot"]//tbody/tr[1]';
const CalibratorLotElement = './/tr/th[@aria-controls = "tblCalibratorLot"]/ancestor::table//tbody/tr/td[3]';
const CalibratorElement = './/tr/th[@aria-controls = "tblCalibratorLot"]/ancestor::table//tbody/tr/td[2]';

export class CalibratorLots {
  isCalibratorDropDownDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(calibratorDdl));
      ddl.isDisplayed().then(function() {
        console.log('Calibrator drop down is displayed');
        library.logStep('Calibrator drop down is displayed');
        library.logStepWithScreenshot('Calibrator drop down is displayed', 'Calibrator drop down is displayed');
        flag = true;
        resolve(flag);
      }).catch(function() {
        library.logStep('Calibrator drop down is not displayed');
        console.log('Calibrator drop down is not displayed');
        library.logStepWithScreenshot('Calibrator drop down is not displayed', 'Calibrator drop down is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectCalibrator(calibratorName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(calibratorDdl));
      dashboard.waitForPage();
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Calibrator Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.click(ddl);
        const options = element(by.xpath('.//li/a[contains(@role,"option")]/span[contains(text(),  "' + calibratorName + '")]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Calibrator Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        dashboard.waitForPage();
        library.logStep('Calibrator selected: ' + calibratorName);
        console.log('Calibrator selected: ' + calibratorName);
        library.logStepWithScreenshot('Calibrator selected: ' + calibratorName, 'Calibrator selected: ' + calibratorName);
        flag = true;
        resolve(flag);
      });
    });
  }

  clickOnAddNewCalibratorLot() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addNewCalibLotBtn));
      library.clickJS(clickBtn);
      console.log('Add new Calibrator Lot button clicked');
      library.logStep('Add new Calibrator Lot button clicked');
      library.logStepWithScreenshot('clickOnAddNewCalibratorLot', 'clickOnAddNewCalibratorLot');
      flag = true;
      resolve(flag);
    });
  }

  clickOnSubmitLotButton() {
    let flag = false;
    return new Promise((resolve) => {
      const submitBtn = element(by.xpath(submitButtonCalibLot));
      library.clickJS(submitBtn);
      console.log('Add new Calibrator Lot Submit button clicked');
      library.logStep('Add new Calibrator Lot Submit button clicked');
      library.logStepWithScreenshot('clickOnSubmitLotButton', 'clickOnSubmitLotButton');
      flag = true;
      resolve(flag);
    });
  }

  clickOnAddCalibratorLots() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnAddCalibratorLot));
      library.click(clickBtn);
      console.log('Add new Calibrator lots button clicked');
      library.logStep('Add new Calibrator lots button clicked');
      library.logStepWithScreenshot('clickOnAddCalibratorLots', 'clickOnAddCalibratorLots');
      flag = true;
      resolve(flag);
    });
  }

  selectNewCalibrator(calibratorName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(ddlCalibratorAdd));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Calibrator Dropdown is not clickable');
      ddl.isDisplayed().then(function () {
        library.clickJS(ddl);
        const options = element(by.xpath('(//ul[@class="dropdown-menu inner"]//span[contains(text(),  "' + calibratorName + '")])[2]'));
        browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Calibrator Dropdown options not displayed');
        browser.executeScript('arguments[0].scrollIntoView();', options);
        dashboard.waitForScroll();
        library.clickJS(options);
        library.logStep('Calibrator selected: ' + calibratorName);
        console.log('Calibrator selected: ' + calibratorName);
        library.logStepWithScreenshot('Calibrator selected: ' + calibratorName, 'Calibrator selected: ' + calibratorName);
        flag = true;
        resolve(flag);
      })
        .catch(function () {
          library.logStep('Calibrator drop down not displayed');
          console.log('Calibrator drop down not displayed');
          flag = false;
          resolve(flag);
        });
    });
  }

  addNewLotNumber(LotNumber) {
    let flag = false;
    return new Promise((resolve) => {
      const nameInput = element(by.xpath(txtLotNumber));
      nameInput.clear();
      nameInput.sendKeys(LotNumber);
      library.logStep('Lot number added: ' + LotNumber);
      console.log('Lot number added: ' + LotNumber);
      library.logStepWithScreenshot('addNewLotNumber', 'addNewLotNumber');
      flag = true;
      resolve(flag);
    });
  }

  selectExpDate(year, mon, day) {
    let flag, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      const dateBox = element(by.xpath(txtBoxExpirationDate));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(dateBox), 20000, 'Expiry date is not clickable');
      dateBox.isDisplayed().then(function () {
        library.click(dateBox);
        console.log('Expiry Date clicked');
      }).then(function () {
        const yearDdl = element(by.xpath(ddlSelectYear));
        yearDdl.isDisplayed().then(function () {
          library.click(yearDdl);
          const yearOpt = yearDdl.element(by.xpath('.//option[text()="' + year + '"]'));
          library.click(yearOpt);
          console.log('Year Selected: ' + year);
          library.logStep('Year Selected: ' + year);
          library.logStepWithScreenshot('selectExpDate', 'selectExpDate');
          flag1 = true;
        }).catch(function () {
          console.log('Year not displayed');
          library.logStep('Year not displayed');
          library.logStepWithScreenshot('selectExpDate', 'selectExpDate');
          flag1 = false;
        });
      }).then(function () {
        const monDdl = element(by.xpath(ddlSelectMonth));
        monDdl.isDisplayed().then(function () {
          library.click(monDdl);
          const monOpt = monDdl.element(by.xpath('.//option[text()="' + mon + '"]'));
          library.click(monOpt);
          console.log('Month Selected: ' + mon);
          library.logStep('Month Selected: ' + mon);
          library.logStepWithScreenshot('selectExpDate', 'selectExpDate');
          flag2 = true;
        }).catch(function () {
          console.log('Month not displayed');
          library.logStep('Month not displayed');
          flag2 = false;
        });
      }).then(function () {
        const daySel = element(by.xpath(selectDay));
        daySel.isDisplayed().then(function () {
          const dayOpt = element(by.xpath(selectDay + '[' + day + ']'));
          library.click(dayOpt);
          console.log('Day Selected: ' + day);
          library.logStep('Day Selected: ' + day);
          library.logStepWithScreenshot('selectExpDate', 'selectExpDate');
          flag3 = true;
        });
      }).then(function () {
        if (flag1 && flag2 && flag3 === true) {
          console.log('Date Selected: ' + mon + day + year);
          library.logStep('Date Selected: ' + mon + day + year);
          library.logStepWithScreenshot('selectExpDate', 'selectExpDate');
          flag = true;
          resolve(flag);
        }
      });
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

  clickOnEditSubmit() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnEditSubmit));
      library.click(clickBtn);
      console.log('Submit button clicked');
      library.logStep('Submit button clicked');
      library.logStepWithScreenshot('clickOnEditSubmit', 'clickOnEditSubmit');
      flag = true;
      resolve(flag);
    });
  }

  clickOnOkButton() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(btnEditOk));
      library.click(clickBtn);
      console.log('Ok button clicked');
      library.logStep('OK button clicked');
      library.logStepWithScreenshot('clickOnOkButton', 'clickOnOkButton');
      flag = true;
      resolve(flag);
    });
  }

  verifyUnspefiedConfirmationMessage(expectedMessage) {
    let flag = false;
    return new Promise((resolve) => {
      const msgEle = element(by.xpath(unspecifiedConfirmEditMessage));
      msgEle.isDisplayed().then(function () {
        msgEle.getText().then(function (actualTxt) {
          if (actualTxt.includes(expectedMessage)) {
            library.logStep('Unspecified Confirmation message displayed: ' + actualTxt);
            console.log('Unspecified Confirmation message displayed: ' + actualTxt);
            library.logStepWithScreenshot
              ('Unspecified Confirmation message displayed: ' + actualTxt, 'Unspecified Confirmation message displayed: ' + actualTxt);
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Expected Unspecified Confirmation message not displayed: ' + expectedMessage);
        console.log('Expected Unspecified Confirmation message not displayed: ' + expectedMessage);
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyDependecncyMessage(expectedMessage) {
    let flag = false;
    return new Promise((resolve) => {
      const msgEle = element(by.xpath(unspecifiedConfirmEditMessage));
      msgEle.isDisplayed().then(function () {
        msgEle.getText().then(function (actualTxt) {
          if (actualTxt.includes(expectedMessage)) {
            library.logStep('Dependancy Confirmation message displayed: ' + actualTxt);
            console.log('Dependancy Confirmation message displayed: ' + actualTxt);
            library.logStepWithScreenshot
              ('Dependancy Confirmation message displayed: ' + actualTxt, 'Dependancy Confirmation message displayed: ' + actualTxt);
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Expected Dependancy Confirmation message not displayed: ' + expectedMessage);
        console.log('Expected Dependancy Confirmation message not displayed: ' + expectedMessage);
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyCalibratorDisabled() {
    let flag = false;
    return new Promise((resolve) => {
      const manufac = element(by.xpath(ddlCalibratorAdd));
      manufac.isDisplayed().then(function () {
        manufac.getAttribute('aria-disabled').then(function (text) {
          if (text.includes('true')) {
            library.logStep('Calibrator is disabled');
            console.log('Calibrator is disabled');
            library.logStepWithScreenshot('Calibrator Button is disabled', 'Calibrator Button is disabled');
            flag = false;
            resolve(flag);
          } else {
            library.logStep('Calibrator  is enabled');
            console.log('Calibrator  is enabled');
            library.logStepWithScreenshot('Calibrator is enabled', 'Calibrator is enabled');
            flag = true;
            resolve(flag);
          }
        });
      });
    });
  }

  verifyCalibratorLotAdded(expectedCalibratorLot) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(dataTableGrid));
      dataTable.isDisplayed().then(function () {
        const CalibratorLotEle = element(by.xpath(CalibratorLotElement));
        CalibratorLotEle.getText().then(function (actualTxt) {
          const actualCalibratorLot = actualTxt.trim();
          console.log('expected ' + expectedCalibratorLot + 'actualProducts' + actualCalibratorLot);
          if (expectedCalibratorLot === actualCalibratorLot) {
            library.logStep('Calibrator Lot is displayed in the table: ' + actualCalibratorLot);
            console.log('Calibrator Lot is displayed in the table: ' + actualCalibratorLot);
            library.logStepWithScreenshot('CalibratorLotDisplayed', 'CalibratorLotDisplayed');
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

  uiVerification() {
    let flag = false;
    let count = 0;
    return new Promise((resolve) => {
      const proanalyte = new Map<string, string>();
      proanalyte.set('Header Displayed', mainTitle);
      proanalyte.set('Sub Header Displayed', infoTitle);
      proanalyte.set('Show Default Displayed', ddlShowEntries);
      proanalyte.set('Search Displayed', searchBox);
      proanalyte.set('Table Displayed', tableFirstVal);
      proanalyte.set('Page control Displayed', paginationControls);
      proanalyte.set('Calibrator Dropdown  Displayed', calibratorDropdown);
      proanalyte.set('Reload Table Button Displayed', btnReloadTable);
      proanalyte.set('Delete Button Displayed', btnDelete);
      proanalyte.set('Edit Button Displayed', btnEdit);
      const head = element(by.xpath(mainTitle));
      head.isDisplayed().then(function() {
        proanalyte.forEach(function (key, value) {
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
        if (proanalyte.size === count) {
          console.log('Code list Calibrator Lots page UI verified');
          library.logStepWithScreenshot('Code list Calibrator Lots  Page UI verified', 'Code list Calibrator Lots  page UI verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Code list Calibrator Lots  page UI not verified');
          library.logStep('Code list Calibrator Lots page UI not verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  readCalibratorName() {
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTable = element(by.xpath(dataTableGrid));
      dataTable.isDisplayed().then(function () {
        const CalibratorEle = element(by.xpath(CalibratorElement));
        CalibratorEle.getText().then(function (actualTxt) {
          const actualCalibrator = actualTxt.trim();
            console.log('Calibrator Name is displayed in the table: ' + actualCalibrator);
            library.logStep('Calibrator Name is displayed in the table: ' + actualCalibrator);
            library.logStepWithScreenshot('readCalibratorName', 'readCalibratorName');
            resolve(actualCalibrator);
        });
      }).catch(function () {
        library.logStep('Data table not displayed');
        console.log('Data table not displayed');
        resolve('undefined');
      });
    });
  }

  clickOnColumnToSortCalibratorLotPage(expectedColumnName, sortType) {
    let flag = false;
    return new Promise((resolve) => {
      const colNameFound = element(by.xpath('.//thead/tr/th[contains(text(), "' + expectedColumnName + '")]'));
      library.click(colNameFound);
      colNameFound.getAttribute('class').then(function (text) {
        if (sortType === 'Ascending') {
          if (text.includes('desc')) {
            library.click(colNameFound);
            dashboard.waitForElement();
            console.log(expectedColumnName + ' clicked to sort in Ascending');
            library.logStep(expectedColumnName + ' clicked to sort in Ascending');
            library.logStepWithScreenshot('clickOnColumnToSortCalibratorLotPage', 'clickOnColumnToSortCalibratorLotPage');
            flag = true;
            resolve(flag);
          } else {
            console.log(expectedColumnName + ' is already sorted in Ascending order');
            library.logStep(expectedColumnName + ' is already sorted in Ascending order');
            flag = true;
            resolve(flag);
          }
        } else if (sortType === 'Descending') {
          if (text.includes('asc')) {
            library.click(colNameFound);
            dashboard.waitForElement();
            console.log(expectedColumnName + ' clicked to sort in Descending');
            library.logStep(expectedColumnName + ' clicked to sort in Descending');
            library.logStepWithScreenshot('clickOnColumnToSortCalibratorLotPage', 'clickOnColumnToSortCalibratorLotPage');
            flag = true;
            resolve(flag);
          } else {
            console.log(expectedColumnName + ' is already sorted in Descending order');
            library.logStep(expectedColumnName + ' is already sorted in Descending order');
            flag = true;
            resolve(flag);
          }
        }
      }).catch(function () {
        console.log(expectedColumnName + ' not displayed');
        library.logStep(expectedColumnName + ' not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }
}
