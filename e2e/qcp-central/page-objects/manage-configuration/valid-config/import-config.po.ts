/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { Dashboard } from '../../../../page-objects/dashboard-e2e.po';
import { BrowserLibrary } from '../../../../utils/browserUtil';
import { browser, by, element } from 'protractor';

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const microslideCheckbox = './/input[@id="chkMicroslide"]';
const uploadAndView = './/input[contains(@value, "Upload and View")]';
const importBtn = './/a[contains(@id, "btnImport")]';
const statusBtn = './/a[contains(@id, "btnStatus")]';
const errorMsg = './/div[contains(@class,"bootbox-body")]';
const errorMsgOk = './/div[contains(@class,"modal-footer")]/button[text() = "OK"]';
const errorMessage = './/table[@id = "tblDataError"]/tbody/tr[1]/td';
const errorClose = './/div[@id = "divDataError"]//button[@class = "close"]';
const confirmImportOk = './/button[contains(text(), "OK")]';
const columnHeaders = './/table/thead/tr/th[contains(@aria-controls, "tblExcelSheet")]';
const excelContentTable = './/table[@id = "tblExcelSheet"]';
const confirmationMessage = '';

export class ImportConfig {
  verifyAllColumnDisplayed(expectedColumnNames) {
    let flag = false;
    const actualColumns = new Array();
    let sizeOfActCols, count = 0;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath(columnHeaders));
      colNamesList.isDisplayed().then(function () {
        colNamesList.each(function (colname, index) {
          colname.getText().then(function (colName) {
            actualColumns.push(colName);
          });
        });
      }).then(function () {
        sizeOfActCols = actualColumns.length;
        for (let i = 0; i < sizeOfActCols; i++) {
          if (actualColumns[i].includes(expectedColumnNames[i])) {
            console.log('Pass: ExpCol: ' + expectedColumnNames[i] + ' act: ' + actualColumns[i]);
            count++;
          } else {
            console.log('False: ExpCol: ' + expectedColumnNames[i] + ' act: ' + actualColumns[i]);
          }
        }
      }).then(function () {
        if (count === sizeOfActCols) {
          library.logStep('Columns are displayed: ' + count);
          console.log('Columns are displayed: ' + count);
          library.logStepWithScreenshot('Columns are displayed: ' + count, 'ColumnsDisplayed');
          flag = true;
          resolve(flag);
        } else {
          library.logStep('Columns are not displayed: ' + count);
          console.log('Columns are not displayed: ' + count);
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  findElementsInTable(expectedColumnName, ElemenetName) {
    let flag = false;
    let colIndex, count = 0;
    let actualText;
    return new Promise((resolve) => {
      const colNamesList = element.all(by.xpath('.//table/thead/tr/th'));
      colNamesList.each(function (colname, index) {
        colname.getText().then(function (colName) {
          if (colName === expectedColumnName) {
            colIndex = index + 1;
          }
        });
      }).then(function () {
        const dataCells = element.all(by.xpath('.//tbody/tr/td[' + colIndex + ']'));
        dataCells.each(function (cell, index) {
          cell.getText().then(function (text) {
            actualText = text;
            if (actualText.includes(ElemenetName)) {
              count++;
            }
          });
        }).then(function () {
          if (count > 0) {
            library.logStep('Data displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            console.log('Data displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            flag = true;
            resolve(flag);
          } else {
            library.logStep('Expected Data is not displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            console.log('Expected Data is not displayed in Column ' + colIndex + ' ' + expectedColumnName + ' : ' + actualText);
            flag = false;
            resolve(flag);
          }
        });
      });
    });
  }

  isTableDisplayedWithValues() {
    let flag = false;
    return new Promise((resolve) => {
      const tableValues = element(by.xpath('.//tbody/tr[1]/td[2]'));
      tableValues.getText().then(function (text) {
        if (text !== '') {
          console.log('Table is displayed with Values');
          library.logStep('Table is displayed with Values');
          flag = true;
          resolve(flag);
        } else {
          console.log('Table is displayed with Values');
          library.logStep('Table is displayed with Values');
          flag = false;
          resolve(flag);
        }
      }).catch(function () {
        console.log('Table is not loaded');
        library.logStep('Table is not loaded');
        flag = false;
        resolve(flag);
      });
    });
  }


  isMicroslideCheckboxDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const chkbox = element(by.xpath(microslideCheckbox));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(chkbox), 15000, 'Checkbox not displayed');
      chkbox.isDisplayed().then(function () {
        console.log('Microslide Checkbox is displayed');
        library.logStep('Microslide Checkbox is displayed');
        library.logStepWithScreenshot('Microslide Checkbox is displayed', 'CheckboxDisplayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Microslide Checkbox is not displayed');
        library.logStep('Microslide Checkbox is not displayed');
        library.logStepWithScreenshot('Microslide Checkbox not displayed', 'CheckboxnotDisplayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickMicroslideCheckbox() {
    let flag = false;
    return new Promise((resolve) => {
      const chkbox = element(by.xpath(microslideCheckbox));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(chkbox), 20000, 'Checkbox not clickable');
      chkbox.isDisplayed().then(function () {
        library.click(chkbox);
        // browser.wait(browser.ExpectedConditions.elementToBeSelected(chkbox), 20000, 'Checkbox not selected');
        console.log('Microslide Checkbox checked');
        library.logStep('Microslide Checkbox checked');
        library.logStepWithScreenshot('Microslide Checkbox clicked', 'Checkboxclicked');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Microslide Checkbox is not displayed');
        library.logStep('Microslide Checkbox is not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOnUploadAndViewButton() {
    let flag = false;
    return new Promise((resolve) => {
      const uploadandview = element(by.xpath(uploadAndView));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(uploadandview), 20000, 'Button not clickable');
      uploadandview.getAttribute('class').then(function (text) {
        if (text.includes('disabled')) {
          console.log('Upload and View Button is disabled');
          library.logStep('Upload and View Button is disabled');
          library.logStepWithScreenshot('Upload and View Button is disabled ', 'UploadAndViewDisabled');
          flag = false;
          resolve(flag);
        } else {
          browser.wait(browser.ExpectedConditions.elementToBeClickable(uploadandview), 15000, 'uploadandview not clickable');
          library.click(uploadandview);
          browser.wait(browser.ExpectedConditions.
            visibilityOf(element(by.xpath(excelContentTable))), 20000, 'Excel Content Table is not displayed');
          console.log('Upload and View Button Clicked');
          library.logStep('Upload and View Button Clicked');
          library.logStepWithScreenshot('Upload and View Button Clicked ', 'UploadAndViewClicked');
          flag = true;
          resolve(flag);
        }
      });
    });
  }

  clickOnImportButton() {
    let flag = false;
    return new Promise((resolve) => {
      const importbtn = element(by.xpath(importBtn));
      importbtn.getAttribute('class').then(function (text) {
        if (text.includes('disabled')) {
          console.log('Import Button is disabled');
          library.logStep('Import Button is disabled');
          flag = false;
          resolve(flag);
        } else {
          browser.wait(browser.ExpectedConditions.elementToBeClickable(importbtn), 15000, 'Import Button not clickable');
          library.click(importbtn);
          console.log('Import Button Clicked');
          library.logStep('Import Button Clicked');
          flag = true;
          resolve(flag);
        }
      });
    });
  }

  clickOnStatusButton() {
    let flag = false;
    return new Promise((resolve) => {
      const statusbtn = element(by.xpath(statusBtn));
      statusbtn.getAttribute('class').then(function (text) {
        if (text.includes('disabled')) {
          console.log('Status Button is disabled');
          library.logStep('Status Button is disabled');
          flag = false;
          resolve(flag);
        } else {
          library.click(statusbtn);
          console.log('Status Button Clicked');
          library.logStep('Status Button Clicked');
          flag = true;
          resolve(flag);
        }
      });
    });
  }

  verifyErrorMessageDisplayed(expectedMessage) {
    let flag = false;
    return new Promise((resolve) => {
      const error = element(by.xpath(errorMsg));
      browser.wait(browser.ExpectedConditions.visibilityOf(error), 35000, 'Error Message not Displayed');
      error.getText().then(function (text) {
        if (text.includes(expectedMessage)) {
          console.log('Expected Error message displayed: ' + text);
          library.logStep('Expected Error message displayed: ' + text);
          library.logStepWithScreenshot('Expected Error message displayed: ' + text, 'errorMsg');
          flag = true;
          resolve(flag);
        } else {
          console.log('Error message not displayed: ' + expectedMessage);
          library.logStep('Error message not displayed: ' + expectedMessage);
          library.logStepWithScreenshot('Error message not displayed: ' + expectedMessage, 'errorMsgNotDisp');
          flag = false;
          resolve(flag);
        }
      });
    });
  }

  clickOkOnErrorMessage() {
    let flag = false;
    return new Promise((resolve) => {
      const okbtn = element(by.xpath(errorMsgOk));
      okbtn.isDisplayed().then(function () {
        library.click(okbtn);
        console.log('Ok Clicked on Error Message popup');
        library.logStep('Ok Clicked on Error Message popup');
        library.logStepWithScreenshot('Ok Clicked on Error Message popup', 'errorMsgOk');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Error Message not displayed');
        library.logStep('Error Message not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyValidationErrorMessage(expectedError) {
    let flag = false;
    return new Promise((resolve) => {
      const errormsg = element(by.xpath(errorMessage));
      browser.wait(browser.ExpectedConditions.visibilityOf(errormsg), 20000, 'errormsg not visible');
      errormsg.isDisplayed().then(function () {
        errormsg.getText().then(function (text) {
          if (text.includes(expectedError)) {
            console.log('Expected Validation message is displayed: ' + text);
            library.logStep('Expected Validation message is displayed: ' + text);
            library.logStepWithScreenshot('verifyValidationErrorMessage', 'verifyValidationErrorMessage');
            flag = true;
            resolve(flag);
          } else {
            console.log('Incorrect Validation message displayed: ' + text);
            library.logStep('Incorrect Validation message displayed:  ' + text);
            library.logStepWithScreenshot('verifyValidationErrorMessage', 'verifyValidationErrorMessage');
            flag = false;
            resolve(flag);
          }
        });
      }).catch(function () {
        console.log('Error Message not displayed');
        library.logStep('Error Message not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  closeValidationError() {
    let flag = false;
    return new Promise((resolve) => {
      const errormsg = element(by.xpath(errorClose));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(errormsg), 15000, 'errormsg not visible');
      errormsg.isDisplayed().then(function () {
        library.click(errormsg);
        console.log('Clicked closed on Error Message popup');
        library.logStep('Clicked closed on Error Message popup');
        library.logStepWithScreenshot('closeValidationError', 'closeValidationError');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Error Message close button not displayed');
        library.logStep('Error Message close button not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  clickOkOnConfirmImport() {
    let flag = false;
    return new Promise((resolve) => {
      const okbtn = element(by.xpath(confirmImportOk));
      okbtn.isDisplayed().then(function () {
        browser.wait(browser.ExpectedConditions.elementToBeClickable(okbtn), 15000, 'Import Confirm Button not clickable');
        library.clickJS(okbtn);
        dashboard.waitForPage();
        dashboard.waitForElement();
        console.log('Clicked Ok on Confirm import popup');
        library.logStep('Clicked Ok on Confirm import popup');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Confirm Import Message not displayed');
        library.logStep('Confirm Import Message not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyConfirmImportMessage() {
    let flag = false;
    return new Promise((resolve) => {
      const confirmationmsg = element(by.xpath(confirmationMessage));
      confirmationmsg.isDisplayed().then(function () {
        console.log('Confirm import popup Message displayed');
        library.logStep('Confirm import popup Message displayed');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('Confirm Import Message not displayed');
        library.logStep('Confirm Import Message not displayed');
        flag = false;
        resolve(flag);
      });
    });
  }
}
