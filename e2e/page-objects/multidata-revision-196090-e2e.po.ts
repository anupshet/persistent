//© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { by, element } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';
const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/multi-data-form-196090.json', (err, data) => {
  if (err) { throw err; }
  const connectivity = JSON.parse(data);
  jsonData = connectivity;
});
const dashBoard = new Dashboard();
const library = new BrowserLibrary();
const levelicon = '//div//label[contains(@class,"level-label")]';
const sendtopeergroupbtn = '//span[text()="Send To Peer Group"]';
const toggleBtn = '//div[text()="Show last entry"]//parent::div//mat-slide-toggle//input';
const showoptiondiv = '//div[contains(@class,"toggle-trigger")]';
export class RevisedMultiDataForm {
  verifyLastEntryIsGreyShaded(analyte, level1) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const lastentry = element(by.xpath('(.//unext-analyte-multi-point/div/span[contains(text(),"' + analyte + '")]/parent::div/following-sibling::div[contains(@class, "analyte-multi-point-component")]//div//span[contains(@class, "is-last-data-entry")])[' + level1 + ']'));
      library.scrollToElement(lastentry);
      lastentry.getCssValue("background-color").then(function (color) {
        if (color.includes('rgba(158, 158, 158, 0.4)')) {
          library.logStepWithScreenshot('LastEntrybox is greyShaded', 'LastEntrybox is greyShaded');
          resolve(true);
        }
        else {
          library.logFailStep('LastEntrybox is not greyshaded');
          resolve(false);
        }
      });
    });
  }
  verifyLastEntryIsRedandYellowShadedIfrulesapplied(analyte, level1, level2) {
    return new Promise((resolve) => {
      const lastentryforrejected = element(by.xpath('(.//unext-analyte-multi-point/div/span[contains(text(),"' + analyte + '")]/parent::div/following-sibling::div[contains(@class, "analyte-multi-point-component")]//div//span[contains(@class, "is-last-data-entry")])[' + level1 + ']'));
      const lastentryforwarning = element(by.xpath('(.//unext-analyte-multi-point/div/span[contains(text(),"' + analyte + '")]/parent::div/following-sibling::div[contains(@class, "analyte-multi-point-component")]//div//span[contains(@class, "is-last-data-entry")])[' + level2 + ']'));
      library.waitForElement(lastentryforrejected);
      library.scrollToElement(lastentryforrejected);
      lastentryforrejected.getCssValue("background-color").then(function (color) {
        if (color.includes('rgba(183, 28, 28, 1)')) {
          library.logStepWithScreenshot('LastEntry is RedShaded if rejected', 'LastEntry is RedShaded if rejected');
          resolve(true);
        }
        else {
          library.logFailStep('LastEntrybox is not RedShaded if rejected');
          resolve(false);
        }
      }).then(function () {
        library.scrollToElement(lastentryforwarning);
        lastentryforwarning.getCssValue("background-color").then(function (color) {
          if (color.includes('rgba(219, 177, 77, 1)')) {
            library.logStepWithScreenshot('LastEntry is YellowShaded if WarningRule is applied ', 'LastEntry is YellowShaded if WarningRule is applied ');
            resolve(true);
          }
          else {
            library.logFailStep('LastEntrybox is not yellowshaded if WarningRule is applied');
            resolve(false);
          }
        });
      });
    });
  }
  verifyIfLastEntryIsPresentIfToggleIsOn(LevelValue) {
    return new Promise((resolve) => {
      dashBoard.waitForElement();
      const toggle = element(by.xpath(toggleBtn));
      const lastEntry = '//div[@class="box ng-star-inserted"]//span';
      const lastEntryValue = element(by.xpath(lastEntry));
      library.waitForElement(lastEntryValue);
      lastEntryValue.getAttribute('class').then(function (value) {
        if (value.includes('is-last-data-entry')) {
          library.logStepWithScreenshot("Last Entry box is present if toggle is on", "Last Entry box is present if toggle is on");
          lastEntryValue.getText().then(function (actualText) {
            if (actualText.includes(LevelValue)) {
              library.logStepWithScreenshot("Last Entry value is present if toggle is on", "Last Entry value is present if toggle is on");
              resolve(true);
            } else {
              library.logFailStep("Last Entry value is not present if toggle is on");
              resolve(false);
            }
          });
        } else {
          library.logFailStep("Last Entry box is not present if toggle is on");
          resolve(false);
        }
      });
      library.clickJS(toggle);
      library.logStepWithScreenshot('Toggle is turned OFF', 'Toggle OFF')
      dashBoard.waitForElement();
      lastEntryValue.isDisplayed().then(function () {
        library.logStepWithScreenshot('When toggle is OFF Previous data is present', 'OFF-Previous data present');
        resolve(false);
      }).catch(function () {
        library.logStepWithScreenshot('When toggle is OFF Previous data entry is not present', 'OFF-Previous data not present');
        resolve(true);
      })
    });
  }
  verifythepresenceoflevelHeader() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const levelheader = element(by.xpath(levelicon));
      levelheader.isDisplayed().then(function () {
        console.log("level header is displayed");
        dashBoard.waitForElement();
        resolve(true);
        library.logStepWithScreenshot("labellevel is displayed", "labellevelScreenshot");
      }).catch(function () {
        resolve(false);
        library.logFailStep("label for level is not present");
      });
    });
  }
  verifyShowOptionFormAreaisClosedByDefault() {
    return new Promise((resolve) => {
      const showoptiontoggle = element(by.xpath(showoptiondiv));
      library.scrollToElement(showoptiontoggle);
      showoptiontoggle.getAttribute('class').then(function (value) {
        if (value.includes('isFormVisible')) {
          library.logFailStep("ShowOption Form area is opened byDefault");
          resolve(false);
        } else {
          library.logStepWithScreenshot("ShowOption Form area is Closed byDefault", "ShowOption Form area is Closed");
          resolve(true);
        }
        library.clickJS(showoptiontoggle);
        showoptiontoggle.getAttribute('class').then(function (value) {
          if (value.includes('isFormVisible')) {
            library.logStepWithScreenshot("ShowOption Form area is open after clicking on show option toggle", "ShowOption Form area");
            resolve(true)
          } else {
            library.logFailStep("ShowOption Form area is Closed after clicking on show option togglet");
            resolve(false);
          }
        });
      });
    });
  }
  presenceofSendToPeerGroupbtnOnMultidata() {
    dashBoard.waitForPage();
    return new Promise((resolve) => {
      const button = findElement(locatorType.XPATH, sendtopeergroupbtn);
      button.isDisplayed().then(function () {
        library.logStepWithScreenshot("Send to peer group button", "Send to peer group button screenshot");
        resolve(true);
      },
        function () {
          library.logStepWithScreenshot("Send to peer group button not displayed", "Send to peer group button screenshot");
          resolve(false);
        });
    });
  }
  clickonSendtoPeerBtn() {
    return new Promise((resolve) => {
      const button = findElement(locatorType.XPATH, sendtopeergroupbtn);
      button.isDisplayed().then(function () {
        library.clickJS(button);
        library.logStepWithScreenshot("Send to peer group button is clicked", "Send to peer group button is clicked");
        resolve(true);
      },
        function () {
          library.logFailStep("Send to peer group button not displayed");
          resolve(false);
        });
    });
  }
}
