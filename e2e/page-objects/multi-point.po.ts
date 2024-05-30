/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { Dashboard } from './dashboard-e2e.po';
import { protractor } from 'protractor/built/ptor';
import { log4jsconfig } from '../../LOG4JSCONFIG/log4jsconfig';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
const library = new BrowserLibrary();
const dashBoard = new Dashboard();

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Multi-Point.json', (err, data) => {
  if (err) { throw err; }
  const multiPointData = JSON.parse(data);
  jsonData = multiPointData;
});


const calendarSectionElement = '//label[@class="dateLabel"]';
const changeDatexPath = './/span[@id ="changeDate"]';
const dateOnCalendar = 'mat-calendar-period-button mat-button';
const calendarHeader = './/div[@class = "mat-calendar-header"]';
const calendarIconEle = 'mat-datepicker-toggle-default-icon ng-star-inserted';
const calendarNextMonthArrowMultiSummary = 'mat-calendar-next-button mat-icon-button';
const calendarNextMonthArrowMultiSummaryDisabled = '//button[@class="mat-calendar-next-button mat-icon-button"][@disabled]';
const calendarPrevMonthArrowMultiPoint = './/button[@class="mat-calendar-previous-button mat-icon-button"]';
const calendarTodaysDay = './/div[contains(@class, "mat-calendar-body-today")]';
const calendarPrevYear2018 = './/td[@class="mat-calendar-body-cell mat-calendar-body-disabled ng-star-inserted"][@aria-label="2018"]';
const level1HeaderEle = './/h3[contains(text(),"Level 1")]'; // "//span[contains(text(),'Level 1')]";
const level2HeaderEle = './/h3[contains(text(),"Level 2")]'; // "//span[contains(text(),'Level 2')]";
const level3HeaderEle = './/h3[contains(text(),"Level 3")]'; // "//span[contains(text(),'Level 3')]";
const level4HeaderEle = './/h3[contains(text(),"Level 4")]'; // "//span[contains(text(),'Level 4')]";
const runEntryRadioBtn = '//mat-radio-button[1]';
const levelEntryRadiioBtn = '//mat-radio-button[2]';
const dataTableTabEle = './/a[@class = "table-link"]';
const defaultActiveLink = './/div[@role = "tab"][contains(@class, "active")]/div[contains(text() , "TEST RESULTS")]';
const spcRuleTabEle = './/ul[@class="mob-actions-bar"]/li[2]/a';
const instrumentHeader2InstrumentView = './/p[@class="instrument-description ng-star-inserted"]';
const instrumentRocheCobas = './/unext-side-nav/mat-sidenav-container/mat-sidenav/div/perfect-scrollbar/div/div[1]/unext-node/section/mat-accordion/mat-expansion-panel/em';
const focusedItem = './/div[contains(@class, "active node-content-wrapper-focused")]';
const pageHeaderEle = 'mat-h5';
const productHeaderInstrView = './/h2[@class="mat-h5"]'; // '(.//h5[@class="mat-h5"])[2]';
const prodHeaderEle = './/h1[contains(@class,"mat-h5")]'; // './/h5[@class="mat-h5"]';
const prodLotNameEle = '//h2/span';    // '//h5/span';
const test1NameHeader = '(.//br-analyte-point-entry//h6[contains(@class,"mat-h6")])[1]';
// '(.//h6[contains(@class,"mat-h6")])[1]'//'(.//h6[@class="mat-h6"])[1]';
const test2NameHeader = '(.//br-analyte-point-entry//h6[contains(@class,"mat-h6")])[2]';
// '(.//h6[contains(@class,"mat-h6")])[2]'//'(.//h6[@class="mat-h6"])[2]';
const test3NameHeader = '(.//br-analyte-point-entry//h6[contains(@class,"mat-h6")])[3]';
// '(.//h6[@class="mat-h6"])[3]'; //'(.//h6[contains(@class,"mat-h6")])[3]'
const allTestNameHeader = './/h6[@class="mat-h6"]';
const allTestsEle = './/span[contains(@class, "toggle-children-placeholder")]/parent::tree-node-expander/parent::div/parent::tree-node-wrapper/div/div/tree-node-content/section/span/span[1]';
const changeLotHyperLink = './/span[@class="link-text open-lot-select"][text() = "Change lot"]';
const addCommentHyperLink = './/span[@class="link-text add-comment-link ng-star-inserted"][text() = "Add comment"]';
const cancelBtnbyId = 'cancelBtn';
const submitBtnById = 'submitBtn';
const cancelBtnElmbyXpath = './/button[@id="cancelBtn"]';
const submitBtnElmbyXpath = './/button[@id="submitBtn"]';
const addCommentEle = '(.//span[contains(text(),"Add comment")])[1]';
const addCommentTextBox = '(.//textarea[@formcontrolname="comments"])[1]';
const dataFieldInputBoxAllFields = '//input[contains(@class,"mat-input-element")]';
const dataFieldInputBox = '(.//input[contains(@class,"mat-input-element")])[1]';
const testViewSummarySectionCollapsArrowUpwards = './/span[@class="chevron"]';
const storedValSectionEle = './/br-analyte-point-view/div';
const storedValT1L1 = '(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[1]';
const storedValT1L2 = '(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[1]';
const storedValT1L3 = '(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[1]';
const storedValT1T4 = '(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[5]/div/div/div)[1]';
const storedValT2L1 = '(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[2]';
const storedValT2L2 = '(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[2]';
const storedValT3L1 = '(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[3]';
const storedValT3L2 = '(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[3]';
const storedDataFirstEleLevel4TestView = '(.//unext-runs-table/div/div/perfect-scrollbar/div/div[1]/div/perfect-scrollbar/div/div[1]/div/div/table/tbody/tr/td[2]/unext-value-cell/div)[1]';
const storedDataFirstEleTestView = '(.//unext-runs-table/div/div/perfect-scrollbar/div/div[1]/div/perfect-scrollbar/div/div[1]/div/div/table/tbody/tr/td[3]/unext-value-cell/div)[1]';
const storedDataFirstEleTestViewcobas = '(.//unext-runs-table/div/perfect-scrollbar/div/div[1]/div[2]/div/perfect-scrollbar/div/div[1]/div/div/table/tbody/tr/td[2]/unext-value-cell)[1]';
const storedDataAllTest4Level = './/unext-runs-table/div/div/perfect-scrollbar/div/div[1]/div/perfect-scrollbar/div/div[1]/div/div/table/tbody/tr/td[2]/unext-value-cell/div';
const storedDataAllTestView = './/unext-runs-table/div/div/perfect-scrollbar/div/div[1]/div/perfect-scrollbar/div/div[1]/div/div/table/tbody/tr/td[3]/unext-value-cell/div';
const storedDataAllTestViewcobas = './/unext-runs-table/div/perfect-scrollbar/div/div[1]/div[2]/div/perfect-scrollbar/div/div[1]/div/div/table/tbody/tr/td[2]/unext-value-cell';
const deleteBtnTestView = './/span/mat-icon[contains(text(),"delete")]';
const confirmDeleteByIdTestView = 'dialog_button2';
const selectedProd = './/*[@class="fake-bg"]';
const prodArrowEle = '(.//span[@class="toggle-children-wrapper toggle-children-wrapper-collapsed ng-star-inserted"]/span[@class="toggle-children"])[1]';
const assyedChemistryProdExpandArrow = './/span[contains(text(),"Assayed")]/ancestor::div/preceding-sibling::tree-node-expander/span/span';
const level1CheckBox = '//p[contains(text(),"Levels in use")]/parent::div/mat-checkbox[1]//input[@aria-checked="true"]';
const level2CheckBox = '//p[contains(text(),"Levels in use")]/parent::div/mat-checkbox[2]//input[@aria-checked="true"]';
const level3CheckBox = '//p[contains(text(),"Levels in use")]/parent::div/mat-checkbox[3]//input[@aria-checked="true"]';
const level4CheckBox = '//p[contains(text(),"Levels in use")]/parent::div/mat-checkbox[4]//input[@aria-checked="true"]';
const level1DecimalSavedPlaces = '(//mat-select[1]//span)[1]';
const level2DecimalSavedPlaces = '(//mat-select[1]//span)[2]';
const level3DecimalSavedPlaces = '(//mat-select[1]//span)[3]';
const level4DecimalSavedPlaces = '(//mat-select[1]//span)[4]';
const pezIconComment = './/span[@class="grey pez icon-Comment ng-star-inserted"]';
const pezCommentStringEle = './/p[contains(@class, "allow-string-break")]';
const pezCommentStringEle2 = '(.//p[contains(@class, "allow-string-break")])[2]';
const reviewSummaryDoneButton = './/button/span[contains(text(),"DONE")]';
const addCommentTextBoxTestView = './/textarea[@name = "enteredCommentContent"]';
const saveUpdateBtnTestView = './/button/span[text() = "SUBMIT UPDATES"]';
const pageHeaderEleProInstr = './/div[@class="heading"]//h1';
const test1HeaderEle = '(//br-analyte-point-entry/div/div[1]/div[1]/h6)[1]';
const test2HeaderEle = '(//br-analyte-point-entry/div/div[1]/div[1]/h6)[2]';
const test3HeaderEle = '(//br-analyte-point-entry/div/div[1]/div[1]/h6)[3]';
const test4HeaderEle = '(//br-analyte-point-entry/div/div[1]/div[1]/h6)[4]';
const test5HeaderEle = '(//br-analyte-point-entry/div/div[1]/div[1]/h6)[5]';
const test6HeaderEle = '(//br-analyte-point-entry/div/div[1]/div[1]/h6)[6]';
const test1SummaryEntrySectionEle = '(//br-analyte-point-entry/div)[1]';
const test2SummaryEntrySectionEle = '(//br-analyte-point-entry/div)[2]';
const test3SummaryEntrySectionEle = '(//br-analyte-point-entry/div)[3]';
const test4SummaryEntrySectionEle = '(//br-analyte-point-entry/div)[4]';
const test5SummaryEntrySectionEle = '(//br-analyte-point-entry/div)[5]';
const test6SummaryEntrySectionEle = '(//br-analyte-point-entry/div)[6]';
const showOptionsEle = '//span[contains(text(),"Show options")]';
const manuallyEnterData = './/a[@class="manually-enter-data"]';
const manuallyRunEle = './/a[@class="manually-enter-test-run"]';
const addCommentTxtArea = '//textarea[@placeholder=" Add a comment "]';
const modalDialog = './/mat-dialog-container[contains(@class,"mat-dialog-container")]';
const title = './/h2'; // './/h3';       // "//h1[@class='mat-dialog-title']"
const message = './/p[contains(@class,"mat-dialog-content")]'; // './/p[@class = "mat-dialog-content"]';    // "mat-dialog-content"
const dontSave = './/button/span[contains(text() , "Dont save data")]'; // "dialog_button1"
const saveData = './/button/span[contains(text() , "Save data and leave page")]';    // "dialog_button2"
const closeDialog = './/button/span/i[contains(text() , "close")]';
const pageheading = './/div[@class="heading"]';
const changeCallibratorLot = '//label[contains(text(),"Calibrator Lot")]';
const changeReagentLot = '//label[contains(text(),"Reagent Lot")]';
const reportsTab = './/div[@role = "tab"]/div[contains(text(), "REPORTS")]';
const editInstLink = './/span[contains(text(), "Edit this Instrument")]';
const editContLink = './/span[contains(text(), "Edit this Control")]';
const backArrow = './/mat-icon[@class = "arrowBack mat-icon"]';


export class MultiPoint {


  changeDate(year, month, day) {
    let changeDate = false;
    return new Promise((resolve) => {
      log4jsconfig.log().info('In Change Date');
      dashBoard.waitForElement();
      element(by.xpath(changeDatexPath)).click();
      element(by.className(dateOnCalendar)).click().then(function () {
        log4jsconfig.log().info('Calendar Clicked');
        dashBoard.waitForElement();
      });
      element(by.xpath('//div[contains(@class, "calendar-body")][contains(text(),"' + year + '")]')).click().then(function () {
        log4jsconfig.log().info('Year Selected');
        dashBoard.waitForScroll();
      });
      element(by.xpath('//div[@class="mat-calendar-body-cell-content" and text()="' + month + '"]')).click().then(function () {
        log4jsconfig.log().info('Month Selected');
        dashBoard.waitForElement();
      });
      element(by.xpath('(//div[contains(@class, "calendar-body")][contains(text(),"' + day + '")])[1]')).click().then(function () {
        changeDate = true;
        log4jsconfig.log().info('Pass: Date Changed');
        resolve(changeDate);
      });

    });
  }

  changeDateCurrentMonth(year, month, day) {
    let changeDateCurrentMonth = false;
    return new Promise((resolve) => {
      log4jsconfig.log().info('In Change Date Current Month');
      dashBoard.waitForScroll();
      const calendarEle = element(by.xpath(calendarHeader));
      calendarEle.isDisplayed().then(function () {
        element(by.className(dateOnCalendar)).click().then(function () {
          log4jsconfig.log().info('Calendar Clicked');
          dashBoard.waitForElement();
        });
      })
        .catch(function () {
          element(by.xpath(changeDatexPath)).click().then(function () {
            dashBoard.waitForElement();
          });
          element(by.className(dateOnCalendar)).click().then(function () {
            dashBoard.waitForElement();
          });
        });


      element(by.xpath('//*[contains(text(),"' + year + '")]')).click().then(function () {
        log4jsconfig.log().info('Year Selected');
        dashBoard.waitForElement();
      });
      element(by.xpath('.//div[contains(text(),"' + month + '")]')).click().then(function () {
        log4jsconfig.log().info('Month Selected');
        dashBoard.waitForElement();
      });
      element(by.xpath('(//div[contains(@class, "calendar-body")][contains(text(), "' + day + '")])[1]')).click().then(function () {
        changeDateCurrentMonth = true;
        log4jsconfig.log().info('Pass: Date Changed for current month');
        resolve(changeDateCurrentMonth);
      });

    });
  }

  enterValues(dataMap) {
    let status = false;
    return new Promise((resolve) => {
      dataMap.forEach(function (key, value) {
        const data = element(by.xpath('//*[@tabindex="' + value + '"]'));
        library.scrollToElement(data);
        data.clear().then(function () {
          data.sendKeys(key).then(function () {
            console.log('Values entered: ' + key);
            log4jsconfig.log().info('Data Entered : ' + key);
            status = true;
            resolve(status);

          });
        });
      });
    });
  }


  verifyEnteredValueStored(expectedVal) {
    let valueData, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      dashBoard.waitForPage();
      const valueEle = element(by.xpath(storedValT1L1));
      dashBoard.waitForElement();
      valueEle.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal)) {
          log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = true;
        } else {
          log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = false;
        }
      });

      if (expectedVal === true) {
        displayed = true;
        resolve(displayed);
      }

    });
  }



  verifyRunEntrySelection() {
    let verifyRunEntrySelection = false;
    return new Promise((resolve) => {
      log4jsconfig.log().info('In verify Run Entry Selection');
      dashBoard.waitForElement();
      const runRadio = element(by.xpath(runEntryRadioBtn));
      runRadio.getAttribute('value').then(function (status) {
        if (status) {
          log4jsconfig.log().info('Pass: Run Entry is Selected');
          verifyRunEntrySelection = true;
          resolve(verifyRunEntrySelection);
        } else {
          log4jsconfig.log().info('Fail: Run Entry is not selected');
          verifyRunEntrySelection = false;
          resolve(verifyRunEntrySelection);
        }
      });
    });
  }


  verifyLevelEntrySelection() {
    let verifyLevelEntrySelection = false;
    return new Promise((resolve) => {
      log4jsconfig.log().info('In verify Level Entry Selection');
      dashBoard.waitForElement();
      const levelEntry = element(by.xpath(levelEntryRadiioBtn));
      levelEntry.getAttribute('value').then(function (status) {
        if (status === 'false') {
          levelEntry.click().then(function (clicked) {
            log4jsconfig.log().info('Level Entry Selected ');
            dashBoard.waitForElement();
            verifyLevelEntrySelection = true;
            resolve(verifyLevelEntrySelection);
          });

        } else if (status === 'true') {
          log4jsconfig.log().info('Pass: Level Entry Selected ');
          verifyLevelEntrySelection = true;
          resolve(verifyLevelEntrySelection);
        } else {
          log4jsconfig.log().info('Fail: Level Entry Selected ');
          verifyLevelEntrySelection = false;
          resolve(verifyLevelEntrySelection);
        }

      });

    });
  }




  verifyRunEntry(mapValues, tabElement) {

    let result = false;
    return new Promise((resolve) => {


      mapValues.forEach(function (key, value) {


        const data = element(by.xpath('//*[@tabindex="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          log4jsconfig.log().info('Data entered at ' + key + '');
          data.sendKeys(protractor.Key.TAB).then(function () {
            log4jsconfig.log().info('Tab key pressed');
            dashBoard.waitForElement();
            const key1 = tabElement.get(value);
            log4jsconfig.log().info('key 1 ' + key1);
            //  if (key1 === "22" || key1 === "12" || key1 === "32" || key1 === "37") {
            if (key1 === '35') {
              log4jsconfig.log().info('First/last element');
            } else {
              const focusedElement = element(by.xpath('//*[@tabindex=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);
              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  result = true;
                  log4jsconfig.log().info('Pass: Run Entry');
                  resolve(result);

                } else {
                  result = false;
                  log4jsconfig.log().info('Fail: Run Entry');
                  resolve(result);
                }

              });
            }

          });
        });
      });
    });

  }

  verifyLevelEntry(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {


      mapValues.forEach(function (key, value) {


        const data = element(by.xpath('//*[@tabindex="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          log4jsconfig.log().info('Data entered: ' + key + '');
          data.sendKeys(protractor.Key.TAB).then(function () {
            log4jsconfig.log().info('Tab key pressed');
            dashBoard.waitForElement();
            const key1 = tabElement.get(value);
            log4jsconfig.log().info('key 1 ' + key1);
            if (key1 === '35') {
              log4jsconfig.log().info('First/last element');
            } else {
              const focusedElement = element(by.xpath('//*[@tabindex=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);
              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  result = true;
                  log4jsconfig.log().info('Pass: Level Entry');
                  resolve(result);

                } else {
                  result = false;
                  log4jsconfig.log().info('Fail: Level Entry');
                  resolve(result);
                }

              });
            }

          });
        });
      });
    });

  }

  verifyRunEntryUsingEnterKey(mapValues, tabElement) {

    let result = false;
    return new Promise((resolve) => {


      mapValues.forEach(function (key, value) {


        const data = element(by.xpath('//*[@tabindex="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(key).then(function () {
          log4jsconfig.log().info('Data entered: ' + key + '');
          data.sendKeys(protractor.Key.ENTER).then(function () {
            log4jsconfig.log().info('Enter key pressed');
            dashBoard.waitForElement();
            const key1 = tabElement.get(value);
            log4jsconfig.log().info('Enter key pressed');
            if (key1 === '35') {      // || key1 === "37") {
              log4jsconfig.log().info('First/last element');
            } else {
              const focusedElement = element(by.xpath('//*[@tabindex=' + key1 + ']/ancestor::mat-form-field'));

              library.scrollToElement(focusedElement);
              focusedElement.getAttribute('class').then(function (focus) {

                if (focus.includes('mat-focused')) {
                  log4jsconfig.log().info('Pass: Run Entry with Enter Key');
                  result = true;

                  resolve(result);

                } else {

                  result = false;
                  log4jsconfig.log().info('Fail: Run Entry with Enter Key');
                  resolve(result);
                }

              });
            }

          });
        });
      });
    });

  }


  verifyLevelEntryUsingEnterKey(mapValues, tabElement) {
    let result = false;
    return new Promise((resolve) => {


      mapValues.forEach(function (key, value) {


        const data = element(by.xpath('//*[@tabindex="' + value + '"]'));
        data.sendKeys(key).then(function () {
          log4jsconfig.log().info('Data entered: ' + key + '');
          data.sendKeys(protractor.Key.ENTER).then(function () {
            log4jsconfig.log().info('Enter key pressed');
            dashBoard.waitForElement();
            const key1 = tabElement.get(value);
            log4jsconfig.log().info('key 1 ' + key1);
            if (key1 === '35') {
              log4jsconfig.log().info('First/last element');
            } else {
              const focusedElement = element(by.xpath('//*[@tabindex=' + key1 + ']/ancestor::mat-form-field'));
              library.scrollToElement(focusedElement);
              dashBoard.waitForElement();
              focusedElement.getAttribute('class').then(function (focus) {
                if (focus.includes('mat-focused')) {
                  result = true;
                  log4jsconfig.log().info('Pass: Level Entry with Enter Key');
                  resolve(result);

                } else {
                  result = false;
                  log4jsconfig.log().info('Fail: Level Entry with Enter Key');
                  resolve(result);
                }

              });
            }

          });
        });
      });
    });

  }

  isLevel1CheckBoxChecked() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const levelEle = element(by.xpath(level1CheckBox));
      dashBoard.waitForElement();
      dashBoard.waitForPage();
      levelEle.isDisplayed().then(function () {
        log4jsconfig.log().info('Pass: Level 1 check box is checked');
        status = true;
        resolve(status);
      });
    });
  }

  isLevel2CheckBoxChecked() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const error = element(by.xpath(level2CheckBox));
      error.isDisplayed().then(function () {
        log4jsconfig.log().info('Pass: Level 2 check box is checked');
        status = true;
        resolve(status);
      });
    });
  }

  isLevel3CheckBoxChecked() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const error = element(by.xpath(level3CheckBox));
      error.isDisplayed().then(function () {
        log4jsconfig.log().info('Pass: Level 3 check box is checked');
        status = true;
        resolve(status);
      });
    });
  }

  isLevel4CheckBoxChecked() {
    let status = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const error = element(by.xpath(level4CheckBox));
      error.isDisplayed().then(function () {
        log4jsconfig.log().info('Pass: Level 4 check box is checked');
        status = true;
        resolve(status);
      });
    });
  }


  verifyEnteredValueStoredL2(expectedVal) {
    let valueData, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForScroll();
      const valueEle = element(by.xpath(storedValT1L2));
      valueEle.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal)) {
          log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = true;
        } else {
          log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = false;
        }
      });

      if (expectedVal === true) {
        displayed = true;
        resolve(displayed);
      }

    });
  }

  verifyEnteredValueStoredL3(expectedVal) {
    let valueData, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForScroll();
      const valueEle = element(by.xpath(storedValT1L3));
      library.scrollToElement(valueEle);
      valueEle.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal)) {
          log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = true;
        } else {
          log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = false;
        }
      });

      if (expectedVal === true) {
        displayed = true;
        resolve(displayed);
      }

    });
  }

  verifyEnteredValueStoredL4(expectedVal) {
    let valueData, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForScroll();
      const valueEle = element(by.xpath(storedValT1T4));
      valueEle.getText().then(function (dataVal) {

        if (dataVal.includes(expectedVal)) {
          log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = true;
        } else {
          log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' expected ' + expectedVal);
          valueData = false;
        }
      });

      if (expectedVal === true) {
        displayed = true;
        resolve(displayed);
      }

    });
  }


  verifyDecimalValueL1(decVal) {
    let displayed = false;
    return new Promise((resolve) => {
      if (decVal === '0') {
        log4jsconfig.log().info('Decimal Value is set to 0');
        dashBoard.waitForPage();
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT1L1));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
        });
      } else {
        dashBoard.waitForPage();
        dashBoard.waitForScroll();
        dashBoard.waitForPage();
        const valueEle = element(by.xpath(storedValT1L1));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;
          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = false;
            resolve(displayed);
          }
        });
      }

    });
  }

  verifyDecimalValueL2(decVal) {
    let displayed = false;
    return new Promise((resolve) => {
      if (decVal === '0') {
        log4jsconfig.log().info('Decimal Value is set to 0');
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT1L2));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForPage();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT1L2));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;
          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = false;
            resolve(displayed);
          }

        });
      }
    });
  }

  verifyDecimalValueL3(decVal) {
    let displayed = false;
    return new Promise((resolve) => {
      if (decVal === '0') {
        log4jsconfig.log().info('Decimal Value is set to 0');
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT1L3));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT1L3));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = false;
            resolve(displayed);
          }

        });
      }
    });
  }

  verifyDecimalValueL4(decVal) {
    let displayed = false;
    return new Promise((resolve) => {
      if (decVal === '0') {
        log4jsconfig.log().info('Decimal Value is set to 0');
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT1T4));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT1T4));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = false;
            resolve(displayed);
          }

        });
      }
    });
  }

  // To verify Decimal Places for Level1 of Test 2
  verifyDecimalValueL1T2(decVal) {
    let displayed = false;
    return new Promise((resolve) => {
      if (decVal === '0') {
        log4jsconfig.log().info('Decimal Value is set to 0');
        dashBoard.waitForPage();
        //// element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT2L1));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForPage();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT2L1));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = false;
            resolve(displayed);
          }
        });
      }

    });
  }

  // To verify Decimal Places for Level2 of Test 2
  verifyDecimalValueL2T2(decVal) {
    let displayed = false;
    return new Promise((resolve) => {
      if (decVal === '0') {
        log4jsconfig.log().info('Decimal Value is set to 0');
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT2L2));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        dashBoard.waitForPage();
        const valueEle = element(by.xpath(storedValT2L2));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = false;
            resolve(displayed);
          }

        });
      }
    });
  }


  // To verify Decimal Places for Level1 of Test 3
  verifyDecimalValueL1T3(decVal) {
    let displayed = false;
    return new Promise((resolve) => {
      if (decVal === '0') {
        log4jsconfig.log().info('Decimal Value is set to 0');
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT3L1));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        dashBoard.waitForPage();
        const valueEle = element(by.xpath(storedValT3L1));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = false;
            resolve(displayed);
          }

        });
      }
    });
  }


  // To verify Decimal Places for Level2 of Test 3
  verifyDecimalValueL2T3(decVal) {
    let displayed = false;
    return new Promise((resolve) => {
      if (decVal === '0') {
        log4jsconfig.log().info('Decimal Value is set to 0');
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        const valueEle = element(by.xpath(storedValT3L2));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        dashBoard.waitForPage();
        const valueEle = element(by.xpath(storedValT3L2));
        library.scrollToElement(valueEle);
        valueEle.getText().then(function (dataVal) {
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Value Displayed ' + dataVal + ' with expected decimal places ' + decVal);
            displayed = false;
            resolve(displayed);
          }

        });
      }
    });
  }



  verifyMaxLength(testMaxLen, xid) {
    return new Promise((resolve) => {
      log4jsconfig.log().info('In verify Max Length');
      let verifyMaxLength = false;
      const mValue = element(by.xpath('//*[@tabindex="' + xid + '"]'));
      const sLen = testMaxLen.length;
      mValue.sendKeys(testMaxLen)
        .then(function () {
          mValue.getAttribute('Value').then(function (displayedVal) {
            if (displayedVal !== sLen) {
              log4jsconfig.log().info('Pass: 16 characters Entered');
              verifyMaxLength = true;
              dashBoard.waitForPage();
            }
          });
        }).then(function () {
          element(by.id(cancelBtnbyId)).click();
          resolve(verifyMaxLength);

        });
    });

  }

  verifyValCharType(testVal, xid) {
    let verifyValCharType = false;
    return new Promise((resolve) => {
      log4jsconfig.log().info('In Verify Char Type');
      const mValue = element(by.xpath('//*[@tabindex="' + xid + '"]'));
      const tLen = testVal.length;
      mValue.sendKeys(testVal);
      dashBoard.waitForScroll();
      element(by.id(submitBtnById)).click().then(function () {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForPage();
        dashBoard.waitForPage();
        library.scrollToElement(element(by.xpath(storedValT1L1)));
        element(by.xpath(storedValT1L1)).getText().then(function (dispVal) {
          if (dispVal !== testVal) {
            log4jsconfig.log().info('Pass: Verify Value field Character Type');
            verifyValCharType = true;
            resolve(verifyValCharType);
          } else {
            log4jsconfig.log().info('Fail: Verify Value field Character Type');
            verifyValCharType = false;
            resolve(verifyValCharType);
          }
        });
      }).catch(function () {
        verifyValCharType = false;
        resolve(verifyValCharType);
      });

    });
  }

  selectPrevMonthDisabled(year, month) {
    let disabled = false;
    let status = 'false';
    return new Promise((resolve) => {
      log4jsconfig.log().info('In select Prev Month Disabled');
      dashBoard.waitForPage();
      element(by.xpath(changeDatexPath)).click().then(function () {
        const prevMonth = element(by.xpath(calendarPrevMonthArrowMultiPoint));
        prevMonth.getAttribute('disabled').then(function (value) {
          status = value;
          element(by.className(dateOnCalendar)).click().then(function () {
            dashBoard.waitForElement();
          });
        });
        element(by.xpath('//*[contains(text(),' + year + ')]')).click().then(function () {
          dashBoard.waitForElement();
        });
        element(by.xpath('.//div[contains(text(),"' + month + '")]')).click().then(function () {
          dashBoard.waitForElement();
        });
        element(by.xpath(calendarTodaysDay)).click().then(function () {
          dashBoard.waitForElement();
          if (status === 'true') {
            log4jsconfig.log().info('Pass: Prev Month Button is disabled');
            disabled = true;
            resolve(disabled);
          } else {
            log4jsconfig.log().info('Fail: Prev Month Button is Enabled');
            disabled = false;
            resolve(disabled);
          }
        });
      });
    });
  }

  selectPrevYearDisabled(year, month) {
    let disabled = false;
    let status = 'false';
    return new Promise((resolve) => {
      log4jsconfig.log().info('In select Prev Year Disabled');
      element(by.xpath(changeDatexPath)).click().then(function () {
        element(by.className(dateOnCalendar)).click().then(function () {
          dashBoard.waitForElement();
        });

        dashBoard.waitForPage();
        const prevYear = element(by.xpath(calendarPrevYear2018));
        prevYear.getAttribute('aria-disabled').then(function (value) {
          status = value;
          element(by.xpath('//*[contains(text(),' + year + ')]')).click().then(function () {
            dashBoard.waitForElement();
          });
          element(by.xpath('.//div[contains(text(),"' + month + '")]')).click().then(function () {
            dashBoard.waitForElement();
          });
          element(by.xpath(calendarTodaysDay)).click().then(function () {
            dashBoard.waitForElement();

            if (status === 'true') {
              log4jsconfig.log().info('Pass: Prev Year Button is disabled');
              disabled = true;
              resolve(disabled);
            } else {
              log4jsconfig.log().info('Fail: Prev Year Button is disabled');
              disabled = false;
              resolve(disabled);
            }
          });
        });
      });
    });
  }

  enterComment(commentText) {
    let enterComment = false;
    return new Promise((resolve) => {
      log4jsconfig.log().info('In enter Comment');
      const addCommentLinkEle = element(by.xpath(addCommentEle));
      library.scrollToElement(addCommentLinkEle);
      addCommentLinkEle.click().then(function () {
        dashBoard.waitForPage();
        const addCommentTxtEle = element(by.xpath(addCommentTextBox));
        library.scrollToElement(addCommentTxtEle);
        addCommentTxtEle.sendKeys(commentText).then(function () {
          dashBoard.waitForPage();
          log4jsconfig.log().info('Pass: Comment Added: ' + commentText);
          enterComment = true;
          resolve(enterComment);
        });
      });
    });
  }


  clickOnDoneButton() {
    let clickOnDoneButton = false;
    return new Promise((resolve) => {
      const doneButton = element(by.xpath(reviewSummaryDoneButton));
      // doneButton.click().then(function () {
      library.clickJS(doneButton);
      dashBoard.waitForElement();
      log4jsconfig.log().info('Pass: Done Button Clicked');
      clickOnDoneButton = true;
      resolve(clickOnDoneButton);
      // })
    });
  }


  verifyPezCommentToolTip(expToolTip) {
    let verifyPezCommentToolTip = false;
    return new Promise((resolve) => {
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForPage();
      log4jsconfig.log().info('In hover Mosue On Pez Comment Icon');
      browser
        .actions()
        .sendKeys(protractor.Key.ESCAPE)
        .perform();
      const pezIcnEle = element(by.xpath(pezIconComment));
      library.scrollToElement(pezIcnEle);
      // .then(function () {
      browser.waitForAngular();
      browser.actions().mouseMove(pezIcnEle).perform().then(function () {
        dashBoard.waitForPage();
        const actToolTipele = element(by.xpath(pezCommentStringEle));
        dashBoard.waitForPage();
        // library.click(actToolTipele);
        // dashBoard.waitForPage();

        actToolTipele.getText().then(function (actToolTip) {
          const meanEle = element(by.xpath('.//input[@tabindex = "11"]'));
          library.scrollToElement(meanEle);
          meanEle.sendKeys(protractor.Key.ESCAPE).then(function () {
            log4jsconfig.log().info('Escape printed');
          });
          // browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
          if (actToolTip.includes(expToolTip)) {
            log4jsconfig.log().info('Pass: Verify Pez Comment ToolTip');
            verifyPezCommentToolTip = true;
            resolve(verifyPezCommentToolTip);
          } else {
            log4jsconfig.log().info('Fail: Verify Pez Comment ToolTip');
            verifyPezCommentToolTip = false;
            resolve(verifyPezCommentToolTip);
          }
        });
        // });
      });
    });
  }

  verifyPezCommentToolTipForComment2(expToolTipComment2) {
    let verifyPezCommentToolTipForComment2 = false;
    return new Promise((resolve) => {
      log4jsconfig.log().info('In hover Mosue On Pez Comment Icon');
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForPage();
      const pezIcnEle = element(by.xpath(pezIconComment));
      browser.waitForAngular();
      browser.actions().mouseMove(pezIcnEle).perform().then(function () {
        // library.hoverOverElement(pezIcnEle);
        dashBoard.waitForPage();
        dashBoard.waitForPage();
        const actToolTipele = element(by.xpath(pezCommentStringEle2));
        library.scrollToElement(actToolTipele);
        dashBoard.waitForElement();
        actToolTipele.getText().then(function (actToolTip) {
          if (actToolTip.includes(expToolTipComment2)) {
            log4jsconfig.log().info('Pass: Expected tooltip: ' + expToolTipComment2 + ' Actual ToolTip: ' + actToolTip);
            verifyPezCommentToolTipForComment2 = true;
            resolve(verifyPezCommentToolTipForComment2);
          } else {
            log4jsconfig.log().info('Fail: Expected tooltip: ' + expToolTipComment2 + ' Actual ToolTip: ' + actToolTip);
            verifyPezCommentToolTipForComment2 = false;
            resolve(verifyPezCommentToolTipForComment2);
          }
        });
        // });
      });
    });
  }


  goToTestView(testName) {
    let goToTestView = false;
    return new Promise((resolve) => {
      const testEle = element(by.xpath('.//span[@class="ml-2 line-height-fix ng-star-inserted"][contains(text(),"' + testName + '")]'));
      testEle.click().then(function () {
        goToTestView = true;
        log4jsconfig.log().info('Test clicked: ' + testName);
        resolve(goToTestView);
        dashBoard.waitForPage();
      });
    });
  }


  editComment(value, newComment) {
    let editComment = false;
    return new Promise((resolve) => {
      // let valEle = element(by.xpath(".//div[contains(text(),'" + value + "')]"))
      const valEle = element(by.xpath('//span[@class="show"][contains(text(),"' + value + '")]'));


      library.scrollToElement(valEle);
      dashBoard.waitForElement();
      valEle.isDisplayed().then(function () {

        // valEle.click().then(function () {
        library.clickJS(valEle);
        dashBoard.waitForPage();
        const commentBox = element(by.xpath(addCommentTextBoxTestView));
        commentBox.sendKeys(newComment).then(function () {
          dashBoard.waitForPage();
          const submitBtn = element(by.xpath(saveUpdateBtnTestView));
          submitBtn.click().then(function () {
            dashBoard.waitForPage();
            log4jsconfig.log().info('Pass: Comment Edited: ' + newComment);
            editComment = true;
            resolve(editComment);
          });
        });
        // })
      });
    });
  }


  clearAllTestsData(test) {
    return new Promise((resolve) => {
      library.logStep('In Clear Test Data');
      dashBoard.waitForElement();
      let cleared = false;
      const testName = element(by.xpath('//span/div[contains(text(),"' + test + '")]'));
      library.logStep('Test Opened: ' + test);
      library.scrollToElement(testName);
      dashBoard.waitForElement();
      testName.isDisplayed().then(function () {
        library.clickJS(testName);
      }).catch(function () {
        const prodExpnd = element(by.xpath('.//h4[contains(text(), "' + jsonData.Dept2Instrument1Prod1 + '")]'));
        prodExpnd.click().then(function () {
          console.log('In Catch Block');
        });
      });
      dashBoard.waitForElement();
      const firstDataEle = element(by.xpath(storedDataFirstEleTestView));
      firstDataEle.isDisplayed().then(function () {
        // dashBoard.waitForElement();
        library.logStep('First data line found');
        element.all(by.xpath(storedDataAllTestView)).then(function (txt) {
          for (let i = 0; i < txt.length; i++) {
            library.logStep('Data found: ' + txt.length);
            dashBoard.waitForElement();
            const scrollEle = element(by.xpath(storedDataFirstEleTestView));
            library.scrollToElement(scrollEle);
            dashBoard.waitForElement();

            library.clickJS(scrollEle);
            dashBoard.waitForElement();
            const deleteDataSet = element(by.xpath(deleteBtnTestView));
            deleteDataSet.click().then(function () {
              // dashBoard.waitForElement();
              const confirmDelete = element(by.id(confirmDeleteByIdTestView));
              confirmDelete.click().then(function () {
                dashBoard.waitForElement();
                cleared = true;
                resolve(cleared);
              });
            });

          }

        });
      }).catch(function () {
        console.log('Catch: Data not available in the test');
        cleared = true;
        resolve(cleared);
      });

    });


  }

  clearAllTestsDatacobas(test) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let cleared = false;
      const testName = element(by.xpath('//span[contains(text(),"' + test + '")]'));
      library.scrollToElement(testName);
      dashBoard.waitForElement();
      testName.isDisplayed().then(function () {
        library.clickJS(testName);


      }).catch(function () {
        const prodExpnd = element(by.xpath(assyedChemistryProdExpandArrow));
        prodExpnd.click().then(function () {
        });
      });


      dashBoard.waitForElement();
      const firstDataEle = element(by.xpath(storedDataFirstEleTestViewcobas));
      firstDataEle.isDisplayed().then(function () {
        // dashBoard.waitForElement();
        element.all(by.xpath(storedDataAllTestViewcobas)).then(function (txt) {
          for (let i = 0; i < txt.length; i++) {

            dashBoard.waitForElement();
            const scrollEle = element(by.xpath(storedDataFirstEleTestViewcobas));
            library.scrollToElement(scrollEle);
            dashBoard.waitForElement();

            library.clickJS(scrollEle);
            dashBoard.waitForElement();
            const deleteDataSet = element(by.xpath(deleteBtnTestView));
            deleteDataSet.click().then(function () {
              // dashBoard.waitForElement();
              const confirmDelete = element(by.id(confirmDeleteByIdTestView));
              confirmDelete.click().then(function () {
                log4jsconfig.log().info('Confirm delete clicked');
                dashBoard.waitForElement();
                log4jsconfig.log().info('Data Cleared');
                cleared = true;
                resolve(cleared);
              });
            });

          }

        });



      }).catch(function () {
        cleared = true;
        resolve(cleared);
      });

    });


  }


  clearAllTestsData4LevelTest(test) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let cleared = false;
      console.log('Clear all test data 4 levels');
      log4jsconfig.log().info('Clear all test data 4 levels');
      const testName = element(by.xpath('//span/div[contains(text(),"' + test + '")]'));
      library.logStep('Test Opened: ' + test);
      dashBoard.waitForElement();
      testName.isDisplayed().then(function () {
        console.log('Test name displayed');
        library.click(testName);
      }).catch(function () {
        const prodExpnd = element(by.xpath('.//h4[contains(text(), "' + jsonData.Dept2Instrument2Prod2 + '")]'));
        prodExpnd.click().then(function () {
          console.log('In Catch Block');
        });
      });

      dashBoard.waitForElement();
      const firstDataEle = element(by.xpath(storedDataFirstEleLevel4TestView));
      firstDataEle.isDisplayed().then(function () {
        // dashBoard.waitForElement();
        library.logStep('First data line found');
        console.log('First data line found');
        element.all(by.xpath(storedDataAllTest4Level)).then(function (txt) {
          console.log('Tests found: ' + txt.length);
          for (let i = 0; i < txt.length; i++) {
            library.logStep('Data found: ' + txt.length);
            console.log('Data found: ' + txt.length);
            dashBoard.waitForElement();
            const scrollEle = element(by.xpath(storedDataFirstEleLevel4TestView));
            library.scrollToElement(scrollEle);
            dashBoard.waitForElement();
            library.clickJS(scrollEle);
            dashBoard.waitForElement();
            const deleteDataSet = element(by.xpath(deleteBtnTestView));
            deleteDataSet.click().then(function () {
              // dashBoard.waitForElement();
              const confirmDelete = element(by.id(confirmDeleteByIdTestView));
              confirmDelete.click().then(function () {
                dashBoard.waitForElement();
                console.log('Data Cleared');
                library.logStep('Data Cleared');
                dashBoard.waitForElement();
                dashBoard.waitForPage();
                cleared = true;
                resolve(cleared);
              });
            });
          }
        });
      }).catch(function () {
        console.log('In catch First line displayed');
        cleared = true;
        resolve(cleared);
      });
    });
  }

  clearValues(dataMap) {
    let status = false;
    return new Promise((resolve) => {
      dataMap.forEach(function (key, value) {
        const data = element(by.xpath('//*[@tabindex="' + value + '"]'));
        library.scrollToElement(data);
        data.clear().then(function () {
          log4jsconfig.log().info('Data cleared at ' + key);
          dashBoard.waitForElement();
          status = true;
          resolve(status);
        });
      });
    });
  }

  clickOnDataTableTab() {
    let clickOnDataTableTab = false;
    return new Promise((resolve) => {
      const dataTab = element(by.xpath(dataTableTabEle));
      dataTab.click().then(function () {
        dashBoard.waitForElement();
        log4jsconfig.log().info('Data Table Tab Clicked');
        clickOnDataTableTab = true;
        resolve(clickOnDataTableTab);
      });
    });
  }

  clearValuesDeleteBtn(dataMap) {
    let status = false;
    return new Promise((resolve) => {
      dataMap.forEach(function (key, value) {
        const data = element(by.xpath('//*[@tabindex="' + value + '"]'));
        library.scrollToElement(data);
        data.sendKeys(protractor.Key.CONTROL, 'a');
        data.sendKeys(protractor.Key.DELETE).then(function () {
          data.clear().then(function () {
            log4jsconfig.log().info('Data cleared at ' + key);
            dashBoard.waitForElement();
            status = true;
            resolve(status);
          });
        });
      });
    });
  }

  goToInstrument1(instrumentId) {
    let status = false;
    return new Promise((resolve) => {
      const instEle = element(by.xpath('//span[@class = "ml-2 line-height-fix ng-star-inserted"][text()= "' + instrumentId + '"]'));
      instEle.click().then(function () {
        dashBoard.waitForElement();
        log4jsconfig.log().info('Instrument ' + instrumentId + ' Clicked');
        status = true;
        resolve(status);
      });
    });
  }


  verifyIntrumentLevelPageUIElements(instru_prod_Name) {
    let verified, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      const header = element(by.xpath(prodHeaderEle));
      header.getText().then(function (text) {
        if (text.includes(instru_prod_Name)) {
          console.log(text + ' and expected ' + instru_prod_Name);
          const runRadio = element(by.xpath(runEntryRadioBtn));
          const levelRadio = element(by.xpath(levelEntryRadiioBtn));
          if (runRadio.isDisplayed() || levelRadio.isDisplayed()) {
            console.log('Radio buttons displayed.');
            flag1 = true;
          }
        }
        const lot = element(by.xpath(prodLotNameEle));
        if (lot.isDisplayed()) {
          log4jsconfig.log().info('Lot displayed.');
          flag2 = true;
        }

        const test1 = element(by.xpath(test1HeaderEle));
        const test1SummaryEntry = element(by.xpath(test1SummaryEntrySectionEle));
        const test2 = element(by.xpath(test2HeaderEle));
        const test2SummaryEntry = element(by.xpath(test2SummaryEntrySectionEle));
        const dateTimePicker = element(by.xpath(calendarSectionElement));
        const level1 = element(by.xpath(level1HeaderEle));
        const level2 = element(by.xpath(level2HeaderEle));
        if (test1.isDisplayed() && test1SummaryEntry.isDisplayed()
          && test2.isDisplayed() && test2SummaryEntry.isDisplayed()
          && dateTimePicker.isDisplayed() && level1.isDisplayed() && level2.isDisplayed()) {
          flag3 = true;

        }
        if (flag1 === flag2 === flag3 === true) {
          log4jsconfig.log().info('Pass: UI verified at instrument level.');
          verified = true;
          resolve(verified);

        }

      });
    });

  }

  verifyEnteredValueStoredT3L2(expectedVal1, expectedVal3, expectedVal2, expectedVal4, expectedVal5, expectedVal6) {
    let valueData1, valueData2, valueData3, valueData4, valueData5, displayed = false;
    const valueData6 = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      //// element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForPage();
      dashBoard.waitForPage();
      const valueEle1 = element(by.xpath(storedValT1L1));
      valueEle1.isPresent().then(function () {
        library.scrollToElement(valueEle1);
        valueEle1.getText().then(function (dataVal) {
          if (dataVal.includes(expectedVal1)) {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal1);
            valueData1 = true;
          } else {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal1);
            valueData1 = false;
          }
        });
      }).catch(function () {
        console.log('Element not found: valueEle1 ');
        valueData1 = false;
      });


      dashBoard.waitForPage();
      //// element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForPage();
      const valueEle2 = element(by.xpath(storedValT2L1));
      valueEle2.isPresent().then(function () {
        library.scrollToElement(valueEle2);
        valueEle2.getText().then(function (dataVal) {
          if (dataVal.includes(expectedVal3)) {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal2);
            valueData2 = true;
          } else {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal2);
            valueData2 = false;
          }
        });
      }).catch(function () {
        console.log('Element not found: valueEle2 ');
        valueData2 = false;
      });

      dashBoard.waitForScroll();
      dashBoard.waitForPage();
      const valueEle3 = element(by.xpath(storedValT1L2));
      valueEle3.isPresent().then(function () {
        library.scrollToElement(valueEle3);
        valueEle3.getText().then(function (dataVal) {
          if (dataVal.includes(expectedVal2)) {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal3);
            valueData3 = true;
          } else {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal3);
            valueData3 = false;
          }
        });
      }).catch(function () {
        console.log('Element not found: valueEle3 ');
        valueData3 = false;
      });


      dashBoard.waitForScroll();
      const valueEle4 = element(by.xpath(storedValT2L2));
      valueEle4.isPresent().then(function () {
        library.scrollToElement(valueEle4);
        valueEle4.getText().then(function (dataVal) {
          if (dataVal.includes(expectedVal4)) {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal4);
            valueData4 = true;
          } else {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal4);
            valueData4 = false;
          }
        });
      }).catch(function () {
        console.log('Element not found: valueEle4 ');
        valueData4 = false;
      });

      dashBoard.waitForScroll();
      const valueEle5 = element(by.xpath(storedValT3L1));
      valueEle5.isPresent().then(function () {
        library.scrollToElement(valueEle5);
        valueEle5.getText().then(function (dataVal) {
          if (dataVal.includes(expectedVal5)) {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal5);
            valueData5 = true;
          } else {
            console.log('Value Displayed ' + dataVal + ' expected ' + expectedVal5);
            valueData5 = false;
          }
        });
      }).catch(function () {
        console.log('Element not found: valueEle5 ');
        valueData5 = false;
      });


      // dashBoard.waitForScroll();
      // let valueEle6 = element(by.xpath(storedValT3L2))
      // library.scrollToElement(valueEle6);
      // valueEle6.getText().then(function (dataVal) {
      //   if (dataVal.includes(expectedVal6)) {
      // log4jsconfig.log().info("Value Displayed " + dataVal + " expected " + expectedVal6);
      //     valueData6 = true;
      //   }
      //   else {
      // log4jsconfig.log().info("Value Displayed " + dataVal + " expected " + expectedVal6);
      //     valueData6 = false;
      //   }
      // })


      if (valueData1 && valueData2 && valueData3 && valueData4 && valueData5 /*&&  valueData6*/ === true) {
        console.log('Pass: Expected Values displayed');
        displayed = true;
        resolve(displayed);
      }

    });
  }


  verifyEnteredValueStoredT2L2(expectedVal1, expectedVal2, expectedVal3, expectedVal4) {
    let valueData1, valueData2, valueData3, valueData4, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForScroll();
      dashBoard.waitForPage();
      const valueEle1 = element(by.xpath(storedValT1L1));
      library.scrollToElement(valueEle1);
      valueEle1.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal1)) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' expected ' + expectedVal1);
          valueData1 = true;
        } else {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' expected ' + expectedVal1);
          valueData1 = false;
        }
      });

      dashBoard.waitForScroll();
      const valueEle2 = element(by.xpath(storedValT2L1));
      library.scrollToElement(valueEle2);
      valueEle2.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal3)) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' expected ' + expectedVal3);
          valueData2 = true;
        } else {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' expected ' + expectedVal3);
          valueData2 = false;
        }
      });

      dashBoard.waitForScroll();
      const valueEle3 = element(by.xpath(storedValT1L2));
      library.scrollToElement(valueEle3);
      valueEle3.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal2)) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' expected ' + expectedVal2);
          valueData3 = true;
        } else {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' expected ' + expectedVal2);
          valueData3 = false;
        }
      });

      dashBoard.waitForScroll();
      const valueEle4 = element(by.xpath(storedValT2L2));
      library.scrollToElement(valueEle4);
      valueEle4.getText().then(function (dataVal) {
        if (dataVal.includes(expectedVal4)) {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' expected ' + expectedVal4);
          valueData4 = true;
        } else {
          log4jsconfig.log().info('Value Displayed ' + dataVal + ' expected ' + expectedVal4);
          valueData4 = false;
        }
      });



      if (valueData1 && valueData2 && valueData3 && valueData4 === true) {
        log4jsconfig.log().info('Pass: Expected Values displayed');
        displayed = true;
        resolve(displayed);
      }

    });
  }


  setFutureDate() {
    let set = false;
    return new Promise((resolve) => {
      element(by.xpath(changeDatexPath)).click().then(function () {
        dashBoard.waitForPage();
      });
      element(by.className(calendarIconEle)).click().then(function () {
        log4jsconfig.log().info('Calendar Clicked');
        const nextMonth = element(by.className(calendarNextMonthArrowMultiSummary));
        nextMonth.isDisplayed().then(function () {
          log4jsconfig.log().info('Next month clicked.');
          nextMonth.click();
          dashBoard.waitForElement();
        });
      }).catch(function () {
        log4jsconfig.log().info('Next month is not enabled.');
      });
      const nextMonthDisabled = element(by.xpath(calendarNextMonthArrowMultiSummaryDisabled));
      if (nextMonthDisabled.isDisplayed()) {
        log4jsconfig.log().info('Pass: Not able to select future date');
        const selectedDate = element(by.xpath(calendarTodaysDay));
        selectedDate.click();
        set = true;
        resolve(set);
      } else {
        log4jsconfig.log().info('Fail: Able to Select Future Date');
        set = false;
        resolve(set);
      }

    });
  }


  enterCommentForAllTests(commentText, test) {
    let enterComment = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      if (test === '1') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        // const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + test + ']'));

      } else if (test === '2') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        // const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + test + ']'));

        // let addCommentLinkEle = element(by.xpath("(//span[contains(text(),'Add comment')])[" + test + "]"))

      } else if (test === '3') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        // const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + test + ']'));

      } else if (test === '4') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        //  const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + test + ']'));


      } else if (test === '5') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        //  const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + test + ']'));

      } else if (test === '6') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });


      }

      const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + test + ']'));
      // library.scrollToElement(addCommentLinkEle);
      // dashBoard.waitForElement();
      // library.clickJS(addCommentLinkEle)
      //   dashBoard.waitForElement();
      //   let addCommentTxtEle = element(by.xpath("(//textarea[@formcontrolname='comments'])[" + test + "]"));
      //   library.scrollToElement(addCommentTxtEle);
      //   dashBoard.waitForPage();
      //   addCommentTxtEle.sendKeys(commentText).then(function () {
      //     dashBoard.waitForPage();
      //     enterComment = true;
      //     resolve(enterComment)
      //   })
      // })
      library.scrollToElement(addCommentTxtEle);
      dashBoard.waitForPage();
      addCommentTxtEle.sendKeys(commentText).then(function () {
        log4jsconfig.log().info('Comment added for test: ' + test);
        dashBoard.waitForPage();
        enterComment = true;
        resolve(enterComment);
      });
    });
  }

  verifyIntrumentLevelPageUIElementsSixTests(instru_prod_Name) {
    let verified, flag1, flag2, flag3 = false;
    return new Promise((resolve) => {
      const header = element(by.className(pageHeaderEle));
      header.getText().then(function (text) {
        if (text.includes(instru_prod_Name)) {
          const runRadio = element(by.xpath(runEntryRadioBtn));
          const levelRadio = element(by.xpath(levelEntryRadiioBtn));
          if (runRadio.isDisplayed() || levelRadio.isDisplayed()) {
            log4jsconfig.log().info('Run & Level Entry Dispayed');
            flag1 = true;
          }
        }
        const lot = element(by.xpath(prodLotNameEle));
        if (lot.isDisplayed()) {
          log4jsconfig.log().info('Lot number Dispayed');
          flag2 = true;
        }

        const test1 = element(by.xpath(test1HeaderEle));
        const test1SummaryEntry = element(by.xpath(test1SummaryEntrySectionEle));
        const test2 = element(by.xpath(test2HeaderEle));
        const test2SummaryEntry = element(by.xpath(test2SummaryEntrySectionEle));
        const test3 = element(by.xpath(test3HeaderEle));
        const test3SummaryEntry = element(by.xpath(test3SummaryEntrySectionEle));
        const test4 = element(by.xpath(test4HeaderEle));
        const test4SummaryEntry = element(by.xpath(test4SummaryEntrySectionEle));
        const test5 = element(by.xpath(test5HeaderEle));
        const test5SummaryEntry = element(by.xpath(test5SummaryEntrySectionEle));
        const test6 = element(by.xpath(test6HeaderEle));
        const test6SummaryEntry = element(by.xpath(test6SummaryEntrySectionEle));
        const dateTimePicker = element(by.xpath(calendarSectionElement));
        const level1 = element(by.xpath(level1HeaderEle));
        const level2 = element(by.xpath(level2HeaderEle));
        const level3 = element(by.xpath(level3HeaderEle));
        const level4 = element(by.xpath(level4HeaderEle));
        if (test1.isDisplayed() && test1SummaryEntry.isDisplayed()
          && test2.isDisplayed() && test2SummaryEntry.isDisplayed()
          && test3.isDisplayed() && test3SummaryEntry.isDisplayed()
          && test4.isDisplayed() && test4SummaryEntry.isDisplayed()
          && test5.isDisplayed() && test5SummaryEntry.isDisplayed()
          && test6.isDisplayed() && test6SummaryEntry.isDisplayed()
          && dateTimePicker.isDisplayed() && level1.isDisplayed()
          && level2.isDisplayed() && level3.isDisplayed() && level4.isDisplayed()) {
          log4jsconfig.log().info('6 Tests, All Levels, Date Picker, Displayed');
          flag3 = true;
        }
        if (flag1 === flag2 === flag3 === true) {
          log4jsconfig.log().info('UI Verified');
          verified = true;
          resolve(verified);

        }

      });
    });

  }


  verifyEnteredValueStoredL1AllTest(expectedVal, test) {
    let val = false, displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      let valEle;
      // element(by.xpath(dataTableTabEle)).click();
      if (test === '1') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '2') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '3') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '4') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '5') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '6') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      }

      let valData;
      library.scrollToElement(valEle);
      dashBoard.waitForScroll();
      valEle.isDisplayed().then(function () {
        valEle.getText().then(function (data) {
          valData = data;
          if (valData.includes(expectedVal)) {
            log4jsconfig.log().info('Pass: ' + valData + ' Values verified for Level 1 - Test ' + test);

            val = true;


          } else {
            log4jsconfig.log().info('Fail ' + valData + ' Values verified for Level 1 - Test ' + test);
            val = false;
          }

        });

        if (val === true) {
          displayed = true;
          resolve(displayed);
        }
      }).catch(function () {
        displayed = false;
        resolve(displayed);
      });
    });
  }


  verifyEnteredValueStoredL2AllTest(expectedVal, test) {
    let val = false, displayed = false;
    return new Promise((resolve) => {
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForElement();
      let valEle;
      if (test === '1') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));
      } else if (test === '2') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));
      } else if (test === '3') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));
      } else if (test === '4') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));
      } else if (test === '5') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));
      } else if (test === '6') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));
      }
      let valData;
      library.scrollToElement(valEle);
      dashBoard.waitForScroll();
      valEle.isDisplayed().then(function () {
        valEle.getText().then(function (data) {
          valData = data;
          if (valData.includes(expectedVal)) {
            log4jsconfig.log().info('Pass: ' + valData + ' Values verified for Level 2 - Test ' + test);
            val = true;


          } else {
            log4jsconfig.log().info('Fail: ' + valData + ' Values verified for Level 2 - Test ' + test);
            val = false;
          }

        });

        if (val === true) {

          displayed = true;
          resolve(displayed);
        }
      }).catch(function () {
        displayed = false;
        resolve(displayed);
      });
    });
  }

  verifyEnteredValueStoredL3AllTest(expectedVal, test) {
    let val = false, displayed = false;
    return new Promise((resolve) => {
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForElement();
      // dashBoard.waitForElement();
      let valEle;
      if (test === '1') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '2') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '3') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '4') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '5') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '6') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));
      }
      let valData;
      library.scrollToElement(valEle);
      valEle.getText().then(function (data) {
        valData = data;
        if (valData.includes(expectedVal)) {
          log4jsconfig.log().info('Pass: ' + valData + ' Values verified for Level 3 - Test ' + test);
          val = true;


        } else {
          log4jsconfig.log().info('Fail: ' + valData + ' Values verified for Level 3 - Test ' + test);
          val = false;
        }

      });

      if (val === true) {
        displayed = true;
        resolve(displayed);
      }
    });
  }


  verifyDecimalValueL1AllTest(decVal, test) {
    let displayed = false;
    return new Promise((resolve) => {
      let valEle;
      dashBoard.waitForElement();
      if (test === '1') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '2') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '3') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '4') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '5') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      } else if (test === '6') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div/div)[' + test + ']'));
      }
      let dataVal;
      if (decVal === '0') {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        library.scrollToElement(valEle);
        valEle.getText().then(function (txt) {
          dataVal = txt;
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForElement();
        library.scrollToElement(valEle);
        valEle.getText().then(function (txt) {
          dataVal = txt;
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: ' + dataVal + ' Decimal verified for Level 1 - Test ' + test);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: ' + dataVal + ' Decimal verified for Level 1 - Test ' + test);
            displayed = false;
            resolve(displayed);
          }
        });
      }
    });
  }


  verifyDecimalValueL2AllTest(decVal, test) {
    let displayed = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let valEle;
      if (test === '1') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));

      } else if (test === '2') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));

      } else if (test === '3') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));

      } else if (test === '4') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));

      } else if (test === '5') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));

      } else if (test === '6') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[3]/div/div/div)[' + test + ']'));
      }

      let dataVal;
      if (decVal === '0') {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        library.scrollToElement(valEle);
        valEle.getText().then(function (txt) {
          dataVal = txt;
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        library.scrollToElement(valEle);
        valEle.getText().then(function (txt) {
          dataVal = txt;
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: ' + dataVal + ' Decimal verified for Level 2 - Test ' + test);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Pass: ' + dataVal + ' Decimal verified for Level 2 - Test ' + test);
            displayed = false;
            resolve(displayed);
          }
        });
      }
    });
  }

  verifyDecimalValueL3AllTest(decVal, test) {
    let displayed = false;
    return new Promise((resolve) => {
      // element(by.xpath(dataTableTabEle)).click();
      dashBoard.waitForElement();
      let valEle;
      if (test === '1') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '2') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '3') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '4') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '5') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));

      } else if (test === '6') {
        valEle = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[4]/div/div/div)[' + test + ']'));
      }
      let dataVal;
      if (decVal === '0') {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        library.scrollToElement(valEle);
        valEle.getText().then(function (txt) {
          dataVal = txt;
        });
      } else {
        dashBoard.waitForPage();
        // element(by.xpath(dataTableTabEle)).click();
        dashBoard.waitForScroll();
        library.scrollToElement(valEle);
        valEle.getText().then(function (txt) {
          dataVal = txt;
          const temp = dataVal.split('.');
          const afterDecVal = temp[1];
          const strLen = afterDecVal.length;

          if (decVal === strLen) {
            log4jsconfig.log().info('Pass: ' + dataVal + ' Decimal verified for Level 3 - Test ' + test);
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: ' + dataVal + ' Decimal verified for Level 3 - Test ' + test);
            displayed = false;
            resolve(displayed);
          }
        });
      }
    });
  }


  verifyPezCommentToolTipAllTest(expToolTip, test) {
    let displayed = false;
    return new Promise((resolve) => {
      // element(by.xpath(dataTableTabEle)).click();
      let pezIcnEle;
      dashBoard.waitForElement();
      if (test === '1') {
        pezIcnEle = element(by.xpath('(.//span[@class="grey pez icon-Comment ng-star-inserted"])[' + test + ']'));

      } else if (test === '2') {
        pezIcnEle = element(by.xpath('(.//span[@class="grey pez icon-Comment ng-star-inserted"])[' + test + ']'));

      } else if (test === '3') {
        pezIcnEle = element(by.xpath('(.//span[@class="grey pez icon-Comment ng-star-inserted"])[' + test + ']'));

      } else if (test === '4') {
        pezIcnEle = element(by.xpath('(.//span[@class="grey pez icon-Comment ng-star-inserted"])[' + test + ']'));

      } else if (test === '5') {
        pezIcnEle = element(by.xpath('(.//span[@class="grey pez icon-Comment ng-star-inserted"])[' + test + ']'));

      } else if (test === '6') {
        pezIcnEle = element(by.xpath('(.//span[@class="grey pez icon-Comment ng-star-inserted"])[' + test + ']'));
      }

      library.scrollToElement(pezIcnEle);
      dashBoard.waitForPage();
      browser.actions().mouseMove(pezIcnEle).perform().then(() => {
        dashBoard.waitForPage();
        dashBoard.waitForPage();
        const actToolTipele = element(by.xpath(pezCommentStringEle));
        library.scrollToElement(actToolTipele);
        dashBoard.waitForElement();
        actToolTipele.getText().then(function (actToolTip) {
          if (actToolTip.includes(expToolTip)) {
            log4jsconfig.log().info('Pass: Tool Tip Verified');
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Tool Tip Verified');
            displayed = false;
            resolve(displayed);
          }
        });
      });
    });
  }

  verifyCommentNumberAllTest(expectedCommentNum, test) {
    let displayed = false;
    return new Promise((resolve) => {
      // element(by.xpath(dataTableTabEle)).click();
      let pezNumEle;
      dashBoard.waitForElement();
      if (test === '1') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));

      } else if (test === '2') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));

      } else if (test === '3') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));

      } else if (test === '4') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));

      } else if (test === '5') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));

      } else if (test === '6') {
        pezNumEle = element(by.xpath('(//em[@class="spc_pezcell_comments_number"])[' + test + ']'));
      }

      library.scrollToElement(pezNumEle);
      pezNumEle.getText().then(function (actualvalue) {
        if (actualvalue === expectedCommentNum) {
          log4jsconfig.log().info('Pass: Comment Number Verified');
          displayed = true;
          resolve(displayed);
        } else {
          log4jsconfig.log().info('Fail: Comment Number Verified');
          displayed = false;
          resolve(displayed);
        }
      });
    });
  }





  verifyInteractionIconAllTests(expectedValue, test) {
    let displayed = false;
    return new Promise((resolve) => {
      // element(by.xpath(dataTableTabEle)).click();
      let interEle;
      dashBoard.waitForElement();
      if (test === '1') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));

      } else if (test === '2') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));

      } else if (test === '3') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));

      } else if (test === '4') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));

      } else if (test === '5') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));

      } else if (test === '6') {
        interEle = element(by.xpath('(//em[@class="spc_pezcell_interactions_number"])[' + test + ']'));
      }

      interEle.isDisplayed().then(function () {
        library.scrollToElement(interEle);
        interEle.getText().then(function (actualvalue) {
          if (actualvalue === expectedValue) {
            log4jsconfig.log().info('Pass: Interaction Icon Verified');
            displayed = true;
            resolve(displayed);
          } else {
            log4jsconfig.log().info('Fail: Interaction Icon Verified');
            displayed = false;
            resolve(displayed);
          }
        });
      }).catch(function () {
        log4jsconfig.log().info('Element not displayed for test: ' + test);
        displayed = false;
        resolve(displayed);
      });
    });
  }



  deleteData() {
    let deleteData = false;
    return new Promise((resolve) => {
      const sectCollEle = element(by.xpath(testViewSummarySectionCollapsArrowUpwards)); // /div[@class="toggle-trigger opened"]
      sectCollEle.isDisplayed().then(function () {
        sectCollEle.click().then(function () {

          dashBoard.waitForElement();
        });
      });
      // dashBoard.waitForElement();
      const firstDataEle = element(by.xpath(storedDataFirstEleTestViewcobas));
      firstDataEle.isDisplayed().then(function () {
        dashBoard.waitForElement();
        element.all(by.xpath(storedDataAllTestViewcobas)).then(function (test) {
          for (let i = 0; i < test.length; i++) {
            // dashBoard.waitForElement();
            const scrollEle = element(by.xpath(storedDataFirstEleTestViewcobas));
            library.scrollToElement(scrollEle);
            dashBoard.waitForElement();
            library.clickJS(scrollEle);
            dashBoard.waitForElement();
            const deleteDataSet = element(by.xpath(deleteBtnTestView));
            deleteDataSet.click().then(function () {
              dashBoard.waitForElement();
              const confirmDelete = element(by.id(confirmDeleteByIdTestView));
              confirmDelete.click().then(function () {
                dashBoard.waitForElement();
                log4jsconfig.log().info('Data Deleted');
                deleteData = true;
                resolve(deleteData);
              });
            });
          }
        });
      }).catch(function () {
        deleteData = true;
        resolve(deleteData);
      });
    });

  }

  verifySortingOfAnalyteSummeryEntryIntrumentBased(expectedTest1, expectedTest2, expectedTest3, instruFlag) {
    let sorted = false;
    return new Promise((resolve) => {
      /*   if (instruFlag === true) {
            //let instru = element(by.xpath(instrumentRocheCobas));
            let instru = element(by.xpath(focusedItem));

            instru.click().then(function () {
            })
            dashBoard.waitForElement();
          }
          else { */
      element(by.xpath(test1HeaderEle)).getText().then(function (test1) {

        const test2Elel = element(by.xpath(test2HeaderEle));
        library.scrollToElement(test2Elel);
        test2Elel.getText().then(function (test2) {


          const test3Ele2 = element(by.xpath(test3HeaderEle));
          library.scrollToElement(test3Ele2);
          test3Ele2.getText().then(function (test3) {


            if (test1 === expectedTest1 && test2 === expectedTest2 && test3 === expectedTest3) {
              log4jsconfig.log().info('Pass: Analytes Sorted');
              sorted = true;
              resolve(sorted);
            } else {
              log4jsconfig.log().info('Fail: Analytes Sorted');
              sorted = false;
              resolve(sorted);
            }
          });
        });
      });
      // }
    });

  }

  enterCommentForAllTestsInstrumentLevel(commentText, test, commTbxNum) {
    let enterComment = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      if (test === '3') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        // const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + commTbxNum + ']'));

      } else if (test === '4') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        // const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + commTbxNum + ']'));

      } else if (test === '5') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        //  const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + commTbxNum + ']'));

      } else if (test === '6') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        //  const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + commTbxNum + ']'));

      } else if (test === '7') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

        //  const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + commTbxNum + ']'));

      } else if (test === '8') {
        const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + test + ']'));
        library.scrollToElement(mValue);
        library.hoverOverElement(mValue);
        log4jsconfig.log().info('Hovered over test.');
        dashBoard.waitForElement();
        const showOptionsLink = element(by.xpath(showOptionsEle));
        library.scrollToElement(showOptionsLink);
        showOptionsLink.isDisplayed().then(function () {
          library.clickAction(showOptionsLink);
          log4jsconfig.log().info('Show Option Button clicked.');
          dashBoard.waitForScroll();
        });

      }


      // library.scrollToElement(addCommentLinkEle);
      // dashBoard.waitForElement();
      // library.clickJS(addCommentLinkEle);
      //   dashBoard.waitForElement();

      const addCommentTxtEle = element(by.xpath('(.//textarea[@placeholder=" Add a comment "])[' + commTbxNum + ']'));

      //   let addCommentTxtEle = element(by.xpath("(//textarea[@formcontrolname='comments'])[" + commTbxNum + "]"));
      // library.scrollToElement(addCommentTxtEle);
      library.scrollToElement(addCommentTxtEle);
      dashBoard.waitForPage();
      addCommentTxtEle.sendKeys(commentText).then(function () {

        dashBoard.waitForPage();
        log4jsconfig.log().info('Pass: Comments added');
        enterComment = true;
        resolve(enterComment);
      });
    });
  }

  verifyDecimalPlaces(level1, level1Val, level2, level2Val, level3, level3Val, level4, level4Val) {
    let verified, levelFlag1, levelFlag2, levelFlag3, levelFlag4 = false;
    return new Promise((resolve) => {
      if (level1 === true) {
        const level = element(by.xpath(level1DecimalSavedPlaces));
        level.getText().then(function (actDecNum1) {
          if (actDecNum1.includes(level1Val)) {
            log4jsconfig.log().info('Decimal verified on level1');
            levelFlag1 = true;
            dashBoard.waitForElement();
          }
        });
      }

      if (level2 === true) {
        const level = element(by.xpath(level2DecimalSavedPlaces));
        level.getText().then(function (actDecNum1) {
          if (actDecNum1.includes(level2Val)) {
            log4jsconfig.log().info('Decimal verified on level2');
            levelFlag2 = true;
            dashBoard.waitForElement();
          }
        });
      }
      if (level3 === true) {
        const level = element(by.xpath(level3DecimalSavedPlaces));
        level.getText().then(function (actDecNum1) {
          if (actDecNum1.includes(level3Val)) {
            log4jsconfig.log().info('Decimal verified on level3');
            levelFlag3 = true;
            dashBoard.waitForElement();
          }
        });
      }
      if (level4 === true) {
        const level = element(by.xpath(level4DecimalSavedPlaces));
        level.getText().then(function (actDecNum1) {
          if (actDecNum1.includes(level4Val)) {
            log4jsconfig.log().info('Decimal verified on level4');
            levelFlag4 = true;
            dashBoard.waitForElement();
          }
        });
      }
      if (levelFlag1 === true || levelFlag2 === true || levelFlag3 === true || levelFlag4 === true) {
        log4jsconfig.log().info('Pass: Decimal verified all 4 levels');
        verified = true;
        resolve(verified);
      }
    });
  }



  verifyPointEntryComponentsInstrumentView(instrument, prod1, test1, test2, test3) {
    let verifyPointEntryComponentsInstrumentView, instrumentId, prod1Id, test1Id, test2Id, test3Id = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const instHeadEle = element(by.xpath(prodHeaderEle));
      const prodEle = element(by.xpath(productHeaderInstrView));
      const test1Ele = element(by.xpath(test1NameHeader));
      const test2Ele = element(by.xpath(test2NameHeader));
      const test3Ele = element(by.xpath(test3NameHeader));

      instHeadEle.getText().then(function (instHeader) {
        if (instHeader.includes(instrument)) {
          instrumentId = true;
        } else {
          instrumentId = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + instHeadEle);
      });

      // Verify Product1 Header
      prodEle.getText().then(function (prodHeader) {
        if (prodHeader.includes(prod1)) {

          prod1Id = true;
        } else {
          prod1Id = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + prodEle);
      });

      // Verify Test1 Header
      test1Ele.getText().then(function (testHeader) {

        if (testHeader.includes(test1)) {

          test1Id = true;
        } else {
          test1Id = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + test1Ele);
      });

      // Verify Test 2 header
      library.scrollToElement(test2Ele);
      test2Ele.getText().then(function (prodHeader) {

        if (prodHeader.includes(test2)) {

          test2Id = true;
        } else {
          test2Id = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + test2Ele);
      });

      // Verify Test 3 Header
      library.scrollToElement(test3Ele);
      test3Ele.getText().then(function (testHeader) {
        if (testHeader.includes(test3)) {

          test3Id = true;
        } else {
          test3Id = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + test3Ele);
      });


      test1Ele.isDisplayed().then(function (status) {
        // console.log("(instrumentId, prod1Id, test1Id, test2Id, test3Id)")
        // console.log(instrumentId, prod1Id, test1Id, test2Id, test3Id)
        if (instrumentId && prod1Id && test1Id && test2Id && test3Id === true) {
          library.logStep('Pass: Header, Product, Tests displayed');
          verifyPointEntryComponentsInstrumentView = true;
          resolve(verifyPointEntryComponentsInstrumentView);
        } else {
          library.logFailStep('Fail: Header, Product, Tests failed to display');
          verifyPointEntryComponentsInstrumentView = false;
          resolve(verifyPointEntryComponentsInstrumentView);
        }
      });
    });
  }


  verifyChangeLotAddComments() {
    return new Promise((resolve) => {
      let verifyChangeLotAddComments = false;
      dashBoard.waitForElement();

      const testList = element.all(by.xpath(allTestNameHeader));
      const changeLotList = element.all(by.xpath(changeLotHyperLink));
      const addCommentList = element.all(by.xpath(addCommentHyperLink));

      testList.count().then(function (testsNum) {
        changeLotList.count().then(function (changeLotNum) {


          addCommentList.count().then(function (addCommentNum) {


            if (testsNum === changeLotNum && testsNum === addCommentNum) {
              log4jsconfig.log().info('Pass: Change lot & Add comments verified');
              verifyChangeLotAddComments = true;
              resolve(verifyChangeLotAddComments);
            } else {
              log4jsconfig.log().info('Fail: Change lot & Add comments failed to verify');
              verifyChangeLotAddComments = false;
              resolve(verifyChangeLotAddComments);
            }
          });
        });
      });
    });
  }

  verifyChangeLotAddCommentsNew() {
    return new Promise((resolve) => {
      let verifyChangeLotAddCommentsNew = false;
      const showOptCount = 0;
      const commentBoxCount = 0;
      dashBoard.waitForElement();
      log4jsconfig.log().info('In Change lot add comment method');
      const testList = element.all(by.xpath(allTestNameHeader));
      testList.count().then(function (testsNum) {
        log4jsconfig.log().info('Test List Count is : ' + testsNum);
        // testList.forEach(element => {
        for (let i = 0; i < testsNum; i++) {
          log4jsconfig.log().info('In For Loop');
          testList.get(i).getText().then(function (testName) {
            const mValue = element(by.xpath('(.//h6[@class = "mat-h6"])[' + i + ']'));
            library.scrollToElement(mValue);
            library.hoverOverElement(mValue);
            log4jsconfig.log().info('Hovered on ' + testName);
            dashBoard.waitForElement();
            const showOptionsLink = element(by.xpath(showOptionsEle));
            library.scrollToElement(showOptionsLink);
            showOptionsLink.click().then(function () {
              dashBoard.waitForElement();
              // showOptCount = showOptCount+1;
              // log4jsconfig.log().info("Show Option Count is : "+showOptCount)
            });
          });
        }
        const commentAdd = element.all(by.xpath(addCommentTxtArea));
        commentAdd.count().then(function (commCount) {
          log4jsconfig.log().info('Comment box Count is : ' + commCount);


          if (testsNum === showOptCount && testsNum === commCount) {
            verifyChangeLotAddCommentsNew = true;
            resolve(verifyChangeLotAddCommentsNew);
          } else {
            verifyChangeLotAddCommentsNew = false;
            resolve(verifyChangeLotAddCommentsNew);
          }
        });
      });
    });
  }



  verifyTopPageHeaderInstrumentView(instrumentId) {
    return new Promise((resolve) => {
      let verifyTopPageHeader, instrumentheader1, defaultDataTable, reportDisp, editInst = false;
      dashBoard.waitForElement();
      const instHeadEle = element(by.xpath(prodHeaderEle));
      const defaultActiveLinkEle = element(by.xpath(defaultActiveLink));
      const reportsElm = element(by.xpath(reportsTab));
      const editThisInstrumentEle = element(by.xpath(editInstLink));

      instHeadEle.getText().then(function (head1) {
        if (head1.includes(instrumentId)) {

          instrumentheader1 = true;
        } else {
          instrumentheader1 = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + instHeadEle);
      });

      defaultActiveLinkEle.isPresent().then(function (status) {
        if (status) {
          defaultDataTable = true;
        } else {
          defaultDataTable = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + defaultActiveLinkEle);
      });

      reportsElm.isPresent().then(function (status) {
        if (status) {

          reportDisp = true;
        } else {
          reportDisp = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + reportsElm);
      });

      editThisInstrumentEle.isPresent().then(function (status) {
        if (status) {

          editInst = true;
        } else {
          editInst = false;
        }
      }).catch(function () {
        library.logFailStep('Element not found: ' + editThisInstrumentEle);
      });

      editThisInstrumentEle.isDisplayed().then(function (status) {
        if (instrumentheader1 && defaultDataTable && reportDisp && editInst === true) {
          log4jsconfig.log().info('Pass: UI Verified');
          verifyTopPageHeader = true;
          resolve(verifyTopPageHeader);
        } else {
          log4jsconfig.log().info('Fail: UI Verified');
          verifyTopPageHeader = false;
          resolve(verifyTopPageHeader);
        }
      });
    });
  }


  verifyDefaultRunEntrySelection(instrumentId) {
    return new Promise((resolve) => {
      console.log('verifyDefaultRunEntrySelection');
      let verifyTopPageHeader, verifyDefaultRunEntrySelection = false;
      dashBoard.waitForElement();
      const instHeadEle = element(by.xpath(prodHeaderEle));
      const runRadio = element(by.xpath(runEntryRadioBtn));

      instHeadEle.getText().then(function (instHeader) {
        if (instHeader.match(instrumentId)) {

          verifyTopPageHeader = true;
        } else {
          verifyTopPageHeader = false;
        }
      });


      runRadio.getAttribute('value').then(function (status) {
        if (status) {
          log4jsconfig.log().info('Pass: Run Entry Selection');
          console.log('Pass: Run Entry Selection');
          verifyDefaultRunEntrySelection = true;
          resolve(verifyDefaultRunEntrySelection);
        } else {
          console.log('Fail: Run Entry Selection failed');
          log4jsconfig.log().info('Fail: Run Entry Selection failed');
          verifyDefaultRunEntrySelection = false;
          resolve(verifyDefaultRunEntrySelection);
        }
      });

    });
  }


  verifyFooterComponents() {
    return new Promise((resolve) => {
      console.log('verifyFooterComponents');
      let verifyFooterComponents, datePicker, cancelBtn, submitBtn = false;
      const dateElm = element(by.xpath(changeDatexPath));
      const cancelElm = element(by.xpath(cancelBtnElmbyXpath));
      const submitElm = element(by.xpath(submitBtnElmbyXpath));

      dateElm.isPresent().then(function (status) {
        if (status) {
          datePicker = true;
        } else {
          datePicker = false;
        }
      });

      cancelElm.isPresent().then(function (status) {
        if (status) {

          cancelBtn = true;
        } else {

          cancelBtn = false;
        }
      });

      submitElm.getAttribute('disabled').then(function (status) {
        if (status) {

          submitBtn = true;
        } else {

          submitBtn = false;
        }
      });

      submitElm.isDisplayed().then(function () {
        console.log(datePicker, cancelBtn, submitBtn);
        if (datePicker && cancelBtn && submitBtn === true) {
          log4jsconfig.log().info('Pass: Footer Verified');
          console.log('Pass: Footer Verified');
          verifyFooterComponents = true;
          resolve(verifyFooterComponents);
        } else {
          console.log('Fail: Footer Verified');
          log4jsconfig.log().info('Fail: Footer Verified');
          verifyFooterComponents = false;
          resolve(verifyFooterComponents);
        }
      });

    });

  }

  verifyPointEntryComponentsProductView(product, test1, test2, test3) {
    let verifyPointEntryComponentsProductView, productId, editLink, testId1, testId2, testId3 = false;
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      console.log('verifyPointEntryComponentsProductView');

      const prodEle = element(by.xpath(prodHeaderEle));
      const editContEle = element(by.xpath(editContLink));
      const test1Ele = element(by.xpath(test1NameHeader));
      const test2Ele = element(by.xpath(test2NameHeader));
      const test3Ele = element(by.xpath(test3NameHeader));


      // Verify Product Header
      library.scrollToElement(prodEle);
      prodEle.getText().then(function (prodHeader) {
        if (prodHeader.includes(product)) {
          productId = true;
        } else {
          productId = false;
        }
      });

      editContEle.isDisplayed().then(function (status) {
        if (status) {
          editLink = true;
        } else {
          editLink = false;
        }
      });

      // Verify Test1 Header
      library.scrollToElement(test1Ele);
      test1Ele.getText().then(function (testHeader) {
        if (testHeader.includes(test1)) {
          testId1 = true;
        } else {
          testId1 = false;
        }
      });

      // Verify Test2 Header
      library.scrollToElement(test2Ele);
      test2Ele.getText().then(function (testHeader) {
        if (testHeader.includes(test2)) {
          testId2 = true;
        } else {
          testId2 = false;
        }
      });


      // Verify Test3 Header
      library.scrollToElement(test3Ele);
      test3Ele.getText().then(function (testHeader) {
        if (testHeader.includes(test3)) {
          testId3 = true;
        } else {
          testId3 = false;
        }
      });



      test2Ele.isDisplayed().then(function (status) {
        console.log(productId, editLink, testId1, testId2, testId3);
        console.log('productId, editLink, testId1, testId2 ,testId3');
        if (productId && editLink && testId1 && testId2 && testId3 === true) {
          log4jsconfig.log().info('Pass: Points entry components verified');
          console.log('Pass: Points entry components verified');
          verifyPointEntryComponentsProductView = true;
          resolve(verifyPointEntryComponentsProductView);
        } else {
          console.log('Fail: Points entry components failed to verify');
          log4jsconfig.log().info('Fail: Points entry components failed to verify');
          verifyPointEntryComponentsProductView = false;
          resolve(verifyPointEntryComponentsProductView);
        }
      });
    });

  }






  verifyAllFieldsEmpty() {
    let verifyAllFieldsEmpty = false;
    let count = 0;
    return new Promise((resolve) => {
      element.all(by.xpath(dataFieldInputBoxAllFields)).each(function (ele, index) {

        ele.getAttribute('placeholder').then(function (placeVal) {
          if (placeVal === 'Value') {
            count++;
          }
        });
      });
      element(by.xpath(dataFieldInputBox)).isDisplayed().then(function () {
        if (count > 0) {
          log4jsconfig.log().info('Pass: All Fields are Empty');
          verifyAllFieldsEmpty = true;
          resolve(verifyAllFieldsEmpty);
        } else {
          log4jsconfig.log().info('Fail: Fields are not empty');
          verifyAllFieldsEmpty = false;
          resolve(verifyAllFieldsEmpty);
        }
      });
    });
  }


  verifyValuesNotStored(expectedVal1, expectedVal2) {
    let valT1L1, valT1L2, notDisplayed = false;
    let verifyValuesNotStored = false;
    return new Promise((resolve) => {
      element(by.xpath(storedValSectionEle)).isDisplayed().then(function () {
        dashBoard.waitForPage();
        const valEleT1L1 = element(by.xpath(storedValT1L1));
        let t1l1Val;
        const valEleT1L2 = element(by.xpath(storedValT2L2));
        let t1l2Val;

        valEleT1L1.getText().then(function (txt) {
          t1l1Val = txt;
          if (t1l1Val.indexOf(expectedVal1) < 0) {
            valT1L1 = true;

          } else {
            valT1L1 = false;
          }
        });

        valEleT1L2.getText().then(function (txt) {
          t1l2Val = txt;
          if (t1l2Val.indexOf(expectedVal2) < 0) {

            valT1L2 = true;

          } else {
            valT1L2 = false;
          }
        });


        if (valT1L1 === true && valT1L2 === true) {
          notDisplayed = true;
          log4jsconfig.log().info('Value not stored');
          verifyValuesNotStored = true;
          resolve(verifyValuesNotStored);
        } else {
          log4jsconfig.log().info('Value stored');
          verifyValuesNotStored = false;
          resolve(verifyValuesNotStored);
        }

      }).catch(function () {
        log4jsconfig.log().info('Value not stored');
        verifyValuesNotStored = true;
        resolve(verifyValuesNotStored);
      });
    });
  }


  refresh() {
    let refresh = false;
    return new Promise((resolve) => {
      browser.refresh();
      dashBoard.waitForElement();
      dashBoard.waitForElement();
      log4jsconfig.log().info('Page Refreshed');
      refresh = true;
      resolve(refresh);
    });
  }




  clearDataAllTests() {
    let clearData = false;
    return new Promise((resolve) => {
      browser.sleep(6000);
      element.all(by.xpath(allTestsEle)).each(function (ele, index) {
        ele.getText().then(function (testName) {
          library.scrollToElement(ele);
          ele.click().then(function () {
            dashBoard.waitForPage();
            dashBoard.waitForElement();
          });
          const firstDataEle = element(by.xpath(storedDataFirstEleTestView));
          firstDataEle.isDisplayed().then(function () {
            dashBoard.waitForElement();
            element.all(by.xpath(storedDataAllTestView)).then(function (test) {
              for (let i = 0; i < test.length; i++) {

                dashBoard.waitForElement();
                const scrollEle = element(by.xpath(storedDataFirstEleTestView));
                library.scrollToElement(scrollEle);
                dashBoard.waitForElement();
                library.clickJS(scrollEle);
                dashBoard.waitForElement();
                const deleteDataSet = element(by.xpath(deleteBtnTestView));
                deleteDataSet.click().then(function () {
                  dashBoard.waitForElement();
                  const confirmDelete = element(by.id(confirmDeleteByIdTestView));
                  confirmDelete.click().then(function () {
                    dashBoard.waitForPage();
                    clearData = true;
                    resolve(clearData);
                  });
                });
              }
            });
          }).catch(function () {
            clearData = true;
            resolve(clearData);
          });
        });
      });
    });
  }

  clickManuallyEnterData() {
    let status = false;
    return new Promise((resolve) => {
      const enterSummary = element(by.xpath(manuallyEnterData));
      enterSummary.isDisplayed().then(function () {
        library.clickJS(enterSummary);
        status = true;
        log4jsconfig.log().info('Manually Enter Data Clicked.');
        resolve(status);
      });
    });
  }

  clickManuallyEnterTestRun() {
    let status = false;
    return new Promise((resolve) => {
      const enterRun = element(by.xpath(manuallyRunEle));
      enterRun.isDisplayed().then(function () {
        library.clickJS(enterRun);
        status = true;
        log4jsconfig.log().info('Manually enter data clicked.');
        resolve(status);
      });
    });
  }

  hoverOverTest(testid) {
    let hover = false;
    return new Promise((resolve) => {
      const mValue = element(by.xpath('.//h6["' + testid + '"]'));
      library.scrollToElement(mValue);
      library.hoverOverElement(mValue);
      log4jsconfig.log().info('Hovered over test.');
      dashBoard.waitForElement();
      hover = true;
      resolve(hover);
    });
  }

  addComment(cmnt) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      let comment = false;
      const commentAdd = element(by.xpath(addCommentTxtArea));
      commentAdd.isDisplayed().then(function () {
        library.scrollToElement(commentAdd);
        commentAdd.sendKeys(cmnt).then(function () {
          comment = true;
          resolve(comment);
        });
      });
    });
  }

  verifyModalComponent() {
    return new Promise((resolve) => {
      let verifyModalComponent, modalDisp, title2, text2, btn22, btn23 = false;
      dashBoard.waitForElement();

      const expTitle = 'You have unsaved data';
      const expMsg = 'If you navigate away from this page, your data will not be saved.';
      const btnTxt1 = 'Dont save data';
      const btnTxt2 = 'Save data and leave page';

      const modal = element(by.xpath(modalDialog));
      if (modal.isPresent) {

        modalDisp = true;
      }


      // Verify title
      element(by.xpath(title)).getText()
        .then(function (title1) {

          if (title1.match(expTitle)) {

            title2 = true;

          }
        });


      // Verify Message
      element(by.xpath(message)).getText()
        .then(function (text1) {

          if (text1.match(expMsg)) {

            text2 = true;
          }
        });



      // Verify Button 1
      const bt1 = element(by.xpath(dontSave));
      bt1.getText()
        .then(function (btn1) {
          if (bt1.isDisplayed()) {

            btn22 = true;
          }
        });


      // Verify Button 2
      const bt2 = element(by.xpath(saveData));
      bt2.getText()
        .then(function (btn2) {

          if (bt1.isDisplayed()) {

            btn23 = true;
          }
        });


      // Verify modal all components

      if (modalDisp === title2 === text2 === btn22 === btn23 === true) {
        log4jsconfig.log().info('Modal components are displayed');
        verifyModalComponent = true;
        resolve(verifyModalComponent);
      }

    });

  }

  closeModalDialog() {
    return new Promise((resolve) => {
      let closeModalDialog = false;

      const modal = element(by.xpath(modalDialog));
      // let clsIcn= element(by.xpath('.//button[@class="close icon-cancel mat-button"]'))
      const clsIcn = element(by.xpath(closeDialog));
      // library.clickJS(clsIcn).then(function()
      clsIcn.click().then(function () {

        if (!modal.isPresent) {
          log4jsconfig.log().info('Modal closed');
          closeModalDialog = true;
          resolve(closeModalDialog);
        }
      });

    });
  }
  clickDontSaveBtn() {
    let verifyDontSaveBtnClick = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(dontSave));
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        log4jsconfig.log().info('Pass: Dont save Btn clicked & user is navigated to other page');
        verifyDontSaveBtnClick = true;
        resolve(verifyDontSaveBtnClick);
      });

    });
  }

  clickSaveAndLeaveBtn() {
    let verifyDontSaveBtnClick = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(saveData));
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        log4jsconfig.log().info('Pass:  save and Leave Btn clicked & user is navigated to other page');
        verifyDontSaveBtnClick = true;
        resolve(verifyDontSaveBtnClick);
      });

    });
  }

  verifyDontSaveBtnClick(instrumentId) {
    let verifyDontSaveBtnClick = false;
    return new Promise((resolve) => {
      const btn = element(by.xpath(dontSave));
      btn.isDisplayed().then(function () {
        library.clickJS(btn);
        dashBoard.waitForPage();
        const pageHeading = element(by.xpath(prodHeaderEle));
        pageHeading.getText().then(function (head) {
          if (head.match(instrumentId)) {
            log4jsconfig.log().info('Pass: Dont save Btn clicked & user is navigated to other page');
            verifyDontSaveBtnClick = true;
            resolve(verifyDontSaveBtnClick);
          }
        });
      });
    });
  }


  clickVerifyChangeLot() {
    let displayed = false;
    return new Promise((resolve) => {
      try {
        dashBoard.waitForPage();
        //  let changeLot = element(by.xpath(chngLot));
        const reagent = element(by.xpath(changeReagentLot));
        const calibrator = element(by.xpath(changeCallibratorLot));
        library.scrollToElement(calibrator);
        /*changeLot.click().then(function () {
          dashBoard.waitForElement();

          dashBoard.waitForPage();
        })*/
        if (reagent.isDisplayed() && calibrator.isDisplayed()) {
          log4jsconfig.log().info('Pass: click Verify Change Lot ');
          displayed = true;
          resolve(displayed);
        } else {
          log4jsconfig.log().info('Fail: click Verify Change Lot ');
          displayed = false;
          resolve(displayed);

        }
      } catch (error) {
        displayed = false;
        resolve(displayed);
      }
    });
  }


  clickShowOptionAllTests() {
    let clickShowOpt = false;
    return new Promise((resolve) => {
      const showOptionsLink = element(by.xpath(showOptionsEle));
      showOptionsLink.isDisplayed().then(function () {
        library.scrollToElement(showOptionsLink);
        library.clickAction(showOptionsLink);
        log4jsconfig.log().info('Show Option Button clicked.');
        dashBoard.waitForPage();
        clickShowOpt = true;
        resolve(clickShowOpt);
      });

    });
  }



  clickOnBackArrow() {
    let clicked = false;
    return new Promise((resolve) => {
      const backBtn = element(by.xpath(backArrow));
      browser.wait(element(by.xpath(backArrow)).isPresent());
      backBtn.isDisplayed().then(function () {
        library.hoverOverElement(backBtn);
        library.clickJS(backBtn);
        dashBoard.waitForPage();
        dashBoard.waitForPage();
        clicked = true;
        resolve(clicked);
      });
    });
  }

  clickSubmitButton() {
    let status = false;
    return new Promise((resolve) => {
      const submit = element(by.id(submitBtnById));
      submit.isDisplayed().then(function () {
        // browser.actions().mouseMove(submit).perform().then(function(){
        // submit.click().then(function(){
        library.hoverOverElement(submit);
        library.clickJS(submit);
        dashBoard.waitForPage();
        dashBoard.waitForPage();
        library.logStep('Submit button is clicked.');
        status = true;
        resolve(status);
      });
      // })
      // })
    });
  }

  verifyEnteredValueWarnedByRule(expectedVal,warnRule,row:Number) {
    let valueData=false;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      const valueRule = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div[3])[' + row + ']'));
      dashBoard.waitForElement();
      browser.executeScript('arguments[0].scrollIntoView();', valueRule);
      valueRule.getText().then(function (dataVal) {
        if (dataVal.includes(warnRule)) {
          library.logStepWithScreenshot("Warning Rule Value Displayed ","WarnDisplayed");
          valueData = true;
          resolve(valueData);
        }
        else {
          library.logStep("Warning Rule Value is Not Displayed ");
          valueData = false;
          resolve(valueData);
        }
      });

    });
  }

  verifyEnteredValueRejectByRule(expectedVal,rejectRule,row:Number) {
    let valueData=false, displayed = false,ruleVal;
    return new Promise((resolve) => {
      dashBoard.waitForPage();
      dashBoard.waitForPage();
      const valueRule = element(by.xpath('(.//br-analyte-point-view/div/div[2]/div[1]/table/tbody/tr/td[2]/div/div[3])[' + row + ']'));
      browser.executeScript('arguments[0].scrollIntoView();', valueRule);
      valueRule.getText().then(function (dataVal) {
        if (dataVal.includes(rejectRule)) {
          library.logStepWithScreenshot("Rejection Rule Value Displayed ","RejectRules");
          valueData = true;
          resolve(valueData);
        }
        else {
          library.logStepWithScreenshot("Rejection Rule Value is Not Displayed ","Error");
          valueData = false;
          resolve(valueData);
        }
      });
    });
  }

}
