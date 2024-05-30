/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { BrowserLibrary } from '../utils/browserUtil';
const library = new BrowserLibrary();
const clearselectionbutton = "//span[contains(text(),'CLEAR SELECTION ')]//parent::button";
const errordialogforclearselection = "//p[text()='You are about reset your selections.']";
const continuebutton = "//span[contains(text(),' continue ')]//parent::button";
const locationandeptcheckbox = "//div[@class='category']//mat-checkbox//label";
const instrumentcheckbox = "//span[text()=' VITROS 4600 ']//parent::label"
const errordialogfordept = "//p[text()=' There is a maximum of 1 department per report']";
const closebutton = "//span[text()=' close ']//parent::button";
const errordialogforcontrol = "//p[text()=' There is a maximum of 25 lots per report']"
const errordialogforinstrument = "//p[text()=' There is a maximum of 5 instruments per report']"
const controlcheckbox = "//span[text()=' MULTIQUAL 1,2,3 UNASSAYED ']//parent::label"
browser.waitForAngularEnabled(true);
let jsonData;

library.parseJson('./JSON_data/UN-12458_QuickReport.json').then(function (data) {
  jsonData = data;
});
export class ErrorDialogs {
  verifyClearSelectionErrordialog() {
    return new Promise(resolve => {
      const errorDialog = element(by.xpath(errordialogforclearselection));
      browser.wait(browser.ExpectedConditions.visibilityOf(errorDialog), 30000, 'Error Dialog is not visible');
      errorDialog.isPresent().then(function () {
        library.logStepWithScreenshot('Error Dialog for clear selection button is present', "Error Dialog for clear selection");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Error Dialog for clear selection button is not present");
        resolve(false);
      })
    });
  }
  clickOnClearSelectionButton() {
    return new Promise(resolve => {
      const clearselection = element(by.xpath(clearselectionbutton));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(clearselection), 30000, 'Error Dialog is not visible');
      clearselection.isDisplayed().then(function () {
        library.clickJS(clearselection);
        library.logStepWithScreenshot("Clear Selection button is displayed and clicked", "Clear Selection button is displayed and clicked");
        resolve(true);
      }).catch(function () {
        library.logFailStep("Clear Selection button is not displayed");
        resolve(false);
      })
    })
  }
  clickOnContinueButton() {
    return new Promise(resolve => {
      const continuebtn = element(by.xpath(continuebutton));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(continuebtn), 30000, 'Error Dialog is not visible');
      continuebtn.isDisplayed().then(function () {
        library.clickJS(continuebtn);
        library.logStepWithScreenshot("continue button is displayed and clicked", "continue button is displayed and clicked");
        resolve(true);
      }).catch(function () {
        library.logFailStep("continue button is not displayed");
        resolve(false);
      })
    })
  }
  verifyErrorDialogForDeptSelection() {
    return new Promise((resolve) => {
      const errordialog = element(by.xpath(errordialogfordept));
      const closebtn = element(by.xpath(closebutton));
      const checkboxes = element(by.xpath(locationandeptcheckbox));
      library.scrollToElement(checkboxes);
      element.all(by.xpath(locationandeptcheckbox)).then(function (checkboxes) {
        for (let i = 2; i <= 3; i++) {
          if (i == 3) {
            checkboxes[i].click();
            errordialog.isDisplayed().then(function () {
              console.log("Error Dialog for dept is displayed");
              library.logStepWithScreenshot("Error Dialog for dept is displayed", "Error Dialog for dept is displayed");
              library.clickJS(closebtn);
              resolve(true)
            }).catch(function () {
              console.log("Error Dialog is not displayed");
              library.logFailStep("Error Dialog is displayed");
              resolve(false);
            });
          } else {
            checkboxes[i].click();
          }
        }
      });
    });
  }
  verifyErrorDialogForInstrumentSelection() {
    return new Promise((resolve) => {
      const errordialog = element(by.xpath(errordialogforinstrument));
      const closebtn = element(by.xpath(closebutton));
      const checkboxes = element(by.xpath(instrumentcheckbox));
      library.scrollToElement(checkboxes);
      library.clickJS(checkboxes);
      errordialog.isDisplayed().then(function () {
        console.log("Error Dialog for instrument is displayed");
        library.logStepWithScreenshot("Error Dialog for instrument is displayed", "Error Dialog for instrument is displayed");
        library.clickJS(closebtn);
        resolve(true)
      }).catch(function () {
        console.log("Error Dialog is not displayed");
        library.logFailStep("Error Dialog is displayed");
        resolve(false);
      });
    });
  }
  verifyErrorDialogForControlSelection() {
    return new Promise((resolve) => {
      const errordialog = element(by.xpath(errordialogforcontrol));
      const closebtn = element(by.xpath(closebutton));
      const checkboxes = element(by.xpath(controlcheckbox));
      library.scrollToElement(checkboxes);
      checkboxes.click();
      errordialog.isDisplayed().then(function () {
        console.log("Error Dialog for control is displayed");
        library.logStepWithScreenshot("Error Dialog for control is displayed", "Error Dialog for control is displayed");
        library.clickJS(closebtn);
        resolve(true)
      }).catch(function () {
        console.log("Error Dialog is not displayed");
        library.logFailStep("Error Dialog is displayed");
        resolve(false);
      });
    })
  }
}

