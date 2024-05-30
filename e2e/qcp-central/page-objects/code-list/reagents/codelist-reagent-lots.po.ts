/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const mainTitle = './/h2[contains(text(), "Reagent Lot")]';
const infoTitle = './/p[contains(text(), "Below is the current Reagent Lot Configuration")]';
const showEntriesDdl = './/select[contains(@name, "_length")]';
const searchBox = './/input[contains(@type, "search")]';
const tableFirstVal = './/tbody/tr[1]/td[2]';
const paginationControls = './/ul[contains(@class, "pagination")]';
const addNewReagLotBtn = './/button[contains(text(), "Add New Reagent Lot")]';
const addLotNumInput = '//input[@id = "LotNumberAdd"]';
const addLotNumSelect = './/button[contains(@data-id , "ddlLotNumberAdd")]';
const addLotNumDDLSearchBox = './/button[contains(@data-id , "ddlLotNumberAdd")]/following-sibling::div//input';
const expirationDateInput = './/input[contains(@id, "ExpirationDateAdd")]';
const expiryDateDisplay = './/input[contains(@id, "ExpirationDateAdd")]/parent::div/parent::div[@style = "display: block;"]';
const selectYearDDL = './/select[@data-handler = "selectYear"]';
const selectMonthDDL = './/select[@data-handler = "selectMonth"]';
const selectDay = '(.//td[@data-handler = "selectDay"]/a)';
const submitButtonReagLot = './/button[contains(@id, "AddReagentLot")]';
const updateSubmitButtonReagentLot = './/button[contains(@id, "btnUpdateReagentLot")]';
const reagDdl = '(.//button[contains(@data-id, "Reagent")])[1]';
const closeAddReagPopup = './/button[contains(text(), "Close")]';
const dataTable = './/table[contains(@id,"tbl")]//tbody/tr[1]';
const expDateColAllValues = './/tr/th[contains(@aria-controls, "tbl")]/ancestor::table//tbody/tr/td[4]';

export class ReagentLots {
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
      maptest.set('Pagination Buttons Displayed', paginationControls);
      const head = element(by.xpath(mainTitle));
      head.isDisplayed().then(function() {
        maptest.forEach(function (key, value) {
          const ele = element(by.xpath(key));
          ele.isDisplayed().then(function () {
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
        if (maptest.size === count) {
          console.log('Reagent Lot Page UI Verified');
          library.logStepWithScreenshot('Reagent Lot Page UI Verified', 'Reagent Lot Page UI Verified');
          flag = true;
          resolve(flag);
        } else {
          console.log('Reagent Lot page UI not verified');
          library.logStep('Reagent Lot page UI not verified');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOnAddNewReagentLot() {
    let flag = false;
    return new Promise((resolve) => {
      const clickBtn = element(by.xpath(addNewReagLotBtn));
      library.clickJS(clickBtn);
      console.log('Add new Reagent Lot button clicked');
      library.logStep('Add new Reagent Lot button clicked');
      library.logStepWithScreenshot('clickOnAddNewReagentLot', 'clickOnAddNewReagentLot');
      flag = true;
      resolve(flag);
    });
  }

  addLotNumber(lotNumber) {
    let flag = false;
    return new Promise((resolve) => {
      const inputBoxLot = element(by.xpath(addLotNumInput));
      inputBoxLot.isDisplayed().then(function () {
        inputBoxLot.clear();
        inputBoxLot.sendKeys(lotNumber);
        console.log('Lot Number added: ' + lotNumber);
        library.logStep('Lot Number added: ' + lotNumber);
        library.logStepWithScreenshot('addLotNumber', 'addLotNumber');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Lot Number input boc not displayed');
        library.logStep('Lot Number input boc not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectExpirationDate(year, mon, day) {
    let flag, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      const dateBox = element(by.xpath(expirationDateInput));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(dateBox), 20000, 'Expiry date is not clickable');
      dateBox.isDisplayed().then(function () {
        library.click(dateBox);
        console.log('Expiry Date clicked');
      }).then(function () {
        const yearDdl = element(by.xpath(selectYearDDL));
        yearDdl.isDisplayed().then(function () {
          library.click(yearDdl);
          const yearOpt = yearDdl.element(by.xpath('.//option[text()="' + year + '"]'));
          library.click(yearOpt);
          console.log('Year Selected: ' + year);
          library.logStep('Year Selected: ' + year);
          library.logStepWithScreenshot('selectExpirationDate', 'selectExpirationDate');
          flag1 = true;
        }).catch(function () {
          console.log('Year not displayed');
          library.logStep('Year not displayed');
          flag1 = false;
        });
      }).then(function () {
        const monDdl = element(by.xpath(selectMonthDDL));
        monDdl.isDisplayed().then(function () {
          library.click(monDdl);
          const monOpt = monDdl.element(by.xpath('.//option[text()="' + mon + '"]'));
          library.click(monOpt);
          console.log('Month Selected: ' + mon);
          library.logStep('Month Selected: ' + mon);
          library.logStepWithScreenshot('selectExpirationDate', 'selectExpirationDate');
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
          library.logStepWithScreenshot('selectExpirationDate', 'selectExpirationDate');
          flag3 = true;
        });
      }).then(function () {
        if (flag1 && flag2 && flag3 === true) {
          console.log('Date Selected: ' + mon + day + year);
          library.logStep('Date Selected: ' + mon + day + year);
          flag = true;
          resolve(flag);
        }
      });
    });
  }

  verifyExpirationDateisHidden() {
    let flag  = false;
    return new Promise((resolve) => {
      const dateBox = element(by.xpath(expiryDateDisplay));
      dateBox.isDisplayed().then(function () {
        console.log('Expiry date field is displayed');
        library.logStep('Expiry date field is displayed');
        library.logStepWithScreenshot('Expiry date field is displayed', 'Expiry date field is displayed');
        library.logStepWithScreenshot('verifyExpirationDateisHidden', 'verifyExpirationDateisHidden');
        flag = false;
        resolve(flag);
      }).catch(function() {
        console.log('Expiry date field is hidden');
        library.logStep('Expiry date field is hidden');
        library.logStepWithScreenshot('Expiry date field is hidden', 'Expiry date field is hidden');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickOnSubmitLotButton() {
    let flag = false;
    return new Promise((resolve) => {
      const submitBtn = element(by.xpath(submitButtonReagLot));
      library.clickJS(submitBtn);
      dashboard.waitForScroll();
      console.log('Add new Reagent Lot Submit button clicked');
      library.logStep('Add new Reagent Lot Submit button clicked');
      library.logStepWithScreenshot('clickOnSubmitLotButton', 'clickOnSubmitLotButton');
      flag = true;
      resolve(flag);
    });
  }

  clickOnSubmitLotButtonForUpdate() {
    let flag = false;
    return new Promise((resolve) => {
      const submitBtn = element(by.xpath(updateSubmitButtonReagentLot));
      library.clickJS(submitBtn);
      console.log('Edit Reagent Lot Submit button clicked');
      library.logStep('Edit Reagent Lot Submit button clicked');
      library.logStepWithScreenshot('clickOnSubmitLotButtonForUpdate', 'clickOnSubmitLotButtonForUpdate');
      flag = true;
      resolve(flag);
    });
  }

  isReagentDropDownDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(reagDdl));
      dashboard.waitForScroll();
      ddl.isDisplayed().then(function () {
        console.log('Reagent drop down is displayed');
        library.logStep('Reagent drop down is displayed');
        library.logStepWithScreenshot('Reagent drop down is displayed', 'Reagent drop down is displayed');
        library.logStepWithScreenshot('isReagentDropDownDisplayed', 'isReagentDropDownDisplayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Reagent drop down is not displayed');
        console.log('Reagent drop down is not displayed');
        library.logStepWithScreenshot('Reagent drop down is not displayed', 'Reagent drop down is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  selectReagent(reagentName) {
    let flag = false;
    return new Promise((resolve) => {
      const ddl = element(by.xpath(reagDdl));
      dashboard.waitForPage();
      browser.wait(browser.ExpectedConditions.elementToBeClickable(ddl), 20000, 'Reagent Dropdown is not clickable');
      library.click(ddl);
      const options = element(by.xpath('(.//li/a[contains(@role,"option")]/span[contains(text(),  "' + reagentName + '")])[1]'));
      browser.wait(browser.ExpectedConditions.visibilityOf(options), 15000, 'Reagent Dropdown options not displayed');
      browser.executeScript('arguments[0].scrollIntoView();', options);
      dashboard.waitForScroll();
      library.clickJS(options);
      dashboard.waitForPage();
      library.logStep('Reagent selected: ' + reagentName);
      console.log('Reagent selected: ' + reagentName);
      library.logStepWithScreenshot('Reagent selected: ' + reagentName, 'Reagent selected: ' + reagentName);
      flag = true;
      resolve(flag);
    });
  }

  selectLotNumber(lotNumber) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const selectLot = element(by.xpath(addLotNumSelect));
      const opt = element(by.xpath('.//span[contains(text(), "' + lotNumber + '")]'));
      selectLot.isDisplayed().then(function () {
        library.clickJS(selectLot);
        const search = element(by.xpath(addLotNumDDLSearchBox));
        search.sendKeys(lotNumber);
        browser.executeScript('arguments[0].scrollIntoView(true);', opt);
        library.clickJS(opt);
        console.log('Lot Number selected: ' + lotNumber);
        library.logStep('Lot Number selected: ' + lotNumber);
        library.logStepWithScreenshot('selectLotNumber', 'selectLotNumber');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Lot Number dropdown not displayed');
        library.logStep('Lot Number dropdown not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOncloseAddLotButton() {
    let flag = false;
    return new Promise((resolve) => {
      const closeBtn = element(by.xpath(closeAddReagPopup));
      library.clickJS(closeBtn);
      console.log('Add new Reagent Lot close button clicked');
      library.logStep('Add new Reagent Lot close button clicked');
      library.logStepWithScreenshot('clickOncloseAddLotButton', 'clickOncloseAddLotButton');
      flag = true;
      resolve(flag);
    });
  }

  isAddedLotDisplayedInLotSelection(lotNumber) {
    let flag = false;
    return new Promise((resolve) => {
      const selectLot = element(by.xpath(addLotNumSelect));
      const opt = element(by.xpath('.//span[contains(text(), "' + lotNumber + '")]'));
      selectLot.isDisplayed().then(function () {
        library.clickJS(selectLot);
        opt.isDisplayed().then(function () {
          console.log('Already added lot is displatyed in the lot number dropdown');
          library.logStep('Already added lot is displatyed in the lot number dropdown');
          library.logStepWithScreenshot('isAddedLotDisplayedInLotSelection', 'isAddedLotDisplayedInLotSelection');
          flag = false;
          resolve(flag);
        }).catch(function () {
          console.log('Already added lot is not displatyed in the lot number dropdown');
          library.logStep('Already added lot is not displatyed in the lot number dropdown');
          flag = true;
          resolve(flag);
        });
      });
    });
  }

  verifyReagentLotAdded(lotNumber) {
    let flag = false;
    return new Promise((resolve) => {
      const reag = element(by.xpath('.//tr/td[3][contains(text(), "' + lotNumber + '")]'));
      reag.isDisplayed().then(function () {
        library.logStep('Reagent lot is added: ' + lotNumber);
        console.log('Reagent lot is added: ' + lotNumber);
        library.logStepWithScreenshot('Reagent lot is added: ' + lotNumber, 'Reagent lot is added: ' + lotNumber);
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logStep('Reagent lot is not displayed: ' + lotNumber);
        console.log('Reagent lot is not displayed: ' + lotNumber);
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyExpiryDateAfter50Years(lotNumber) {
    let flag = false;
    const  date = new Date();
    const thisyear = date.getFullYear();
    const expiryYear = (thisyear + 50).toString();
    return new Promise((resolve) => {
      const expiryDate = element(by.xpath('.//td[contains(text(), "' + lotNumber + '")]/following-sibling::td[1]'));
      expiryDate.isDisplayed().then(function () {
        expiryDate.getText().then(function(actualDate) {
          if (actualDate.includes(expiryYear)) {
            library.logStep('Expiry Date is after 50 years ' + expiryYear + ' for lot number: ' + lotNumber);
            console.log('Expiry Date is after 50 years ' + expiryYear + ' for lot number: ' + lotNumber);
            library.logStepWithScreenshot('Expiry Date is after 50 years ' + expiryYear + ' for lot number: ' + lotNumber, 'Expiry Date is after 50 years ' + expiryYear + ' for lot number: ' + lotNumber);
            flag = true;
            resolve(flag);
          } else {
            library.logStep('Expiry Date is not displayed after 50 years for lot number: ' + lotNumber);
            console.log('Expiry Date is not displayed after 50 years for lot number: ' + lotNumber);
            library.logStepWithScreenshot('Expiry Date is not displayed after 50 years for lot number: ' + lotNumber, 'Expiry Date is not displayed after 50 years for lot number: ' + lotNumber);
            flag = false;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Lot & Expiry date is not available in table ' + lotNumber);
        console.log('Lot & Expiry date is not available in table ' + lotNumber);
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyReagentLotEdited(year, mon, day) {
    let flag = false;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const dataTableEle = element(by.xpath(dataTable));
      dataTableEle.isDisplayed().then(function () {
        const expDate = element(by.xpath(expDateColAllValues));
        expDate.getText().then(function (actualTxt) {
          const actualDate = actualTxt.trim();
          if (actualDate.includes(year) && actualDate.includes(mon) && actualDate.includes(day)) {
            library.logStep('Reagent lot is edited with expiry date: ' + actualDate);
            console.log('Reagent lot is edited with expiry date: ' + actualDate);
            library.logStepWithScreenshot('ReagentlotEdited', 'ReagentlotEdited');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logStep('Reagent lot Data table not displayed');
        console.log('Reagent lot Data table not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnColumnToSortReagentLotPage(expectedColumnName, sortType) {
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
            library.logStepWithScreenshot('clickOnColumnToSortReagentLotPage', 'clickOnColumnToSortReagentLotPage');
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
