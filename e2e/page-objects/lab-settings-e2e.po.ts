/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';


const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Settings.json', (err, data1) => {
  if (err) { throw err; }
  const settings = JSON.parse(data1);
  jsonData = settings;
});

const library = new BrowserLibrary();
const dashboard = new Dashboard();

const labsettingspopup = '//div[@class="lab-settings-wrapper"]/p[contains(text(),"Lab default settings")]';
const summaryopt = '(.//input[@type="radio"])[1]';
const pointopt = '//span[text()="Point"]/../../../div/div[1]';
const yes_option = '(.//input[@type="radio"])[3]';
const no_option = '(.//input[@type="radio"])[4]';
const backbutton = './/button/span[contains(text(), "Back")]';
const confirmbutton = './/button/span[contains(text(), "Update")]';
const updateBtn = './/button/span[text()=" Update "]';
const gearIcon = '//unext-nav-bar-setting//mat-icon';
const accountManagementMenu = '//div[@role="menu"]//div/button/span[contains(text(),"Account Management")]';
const labSettings = '//div[@role="menu"]//div/button/span[contains(text(),"Lab Settings")]';
const titleLogo = 'header_logo_button';
const unityNext = './/button/span[text() = "Unity Next"]';
const labName = './/div[@class="breadcrumb-wrapper"]//h4';
const sideNavigation = 'sideNav';
const toast = "//snack-bar-container";
const deleteLocCloseBtn = './/mat-icon[contains(@class, "mat-icon notranslate close mat-icon-no-color")]';
const decimalPlacesDDArrow = '(.//mat-select[@tabindex="0"]//div[contains(@class,"mat-select-value")])[1]';

const EC = protractor.ExpectedConditions;
export class LabSettings {
  isLabSettingsDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const labsettingspopupEle = element(by.xpath(labsettingspopup));
      labsettingspopupEle.isDisplayed().then(function () {
        library.logStep('Lab default settings popup is displayed');
        result = true;
        resolve(result);
      });
    });
  }

  clickOnCloseFromPopup() {
    return new Promise((resolve) => {
      const deleteLocClosebtnEle = element(by.xpath(deleteLocCloseBtn));
      deleteLocClosebtnEle.isDisplayed().then(function () {
        library.clickJS(deleteLocClosebtnEle);
        resolve(true)
      });
    });
  }
  goToLabSettings() {
    let status = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const pointoptionEle = element(by.xpath(pointopt));
      const gearElement = element(by.xpath(gearIcon));
      library.clickJS(gearElement);
      library.logStep('Gear Icon Clicked.');
      const labSettingsEle = element(by.xpath(labSettings));
      library.clickJS(labSettingsEle);
      browser.wait(protractor.ExpectedConditions.elementToBeClickable(pointoptionEle), 30000);
      status = true;
      resolve(status);
    });
  }

  async isLabSettingsDisplayed_Async() {
    let result = false;
    const labsettingspopupEle = element(by.xpath(labsettingspopup));
    if (await labsettingspopupEle.isDisplayed()) {
      library.logStep('Lab default settings popup is displayed');
      result = true;
    }
    return result;
  }

  isCorrectDefaultValueDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForElement();
      const summaryoptEle = element(by.xpath(summaryopt));
      const no_optionEle = element(by.xpath(no_option));
      summaryoptEle.isSelected().then(function () {
        library.logStep('Summary as default is selected');
        no_optionEle.isSelected().then(function () {
          library.logStep('No as default is selected');
          result = true;
          resolve(result);
        });
      });
    });
  }

  isUpdatedValueSelected() {
    let result1 = false, result2 = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const pointoptionEle = element(by.xpath(pointopt));
      const yes_optionEle = element(by.xpath(yes_option));
      pointoptionEle.isSelected().then(function (flag) {
        result1 = flag;
        library.logStep('Point is selected');
        yes_optionEle.isSelected().then(function (flag2) {
          result2 = flag2;
          library.logStep('Yes is selected');
        });
      });
      if (result1 && result2) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  }

  isPointValueSelected() {
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const pointoptionEle = element(by.xpath(pointopt));
      pointoptionEle.isSelected().then(function (flag) {
        library.logStep('Point is selected');
        resolve(flag);
      });
    });
  }

  isYesSelected() {
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const yes_optionEle = element(by.xpath(yes_option));
      yes_optionEle.isSelected().then(function (flag2) {
        library.logStep('Yes is selected');
        resolve(flag2);
      });

    });
  }

  clickOnBackFromPopup() {
    return new Promise((resolve) => {
      const backbuttonEle = element(by.xpath(backbutton));
      backbuttonEle.isDisplayed().then(function () {
        library.clickJS(backbuttonEle);
        resolve(true)
      });
    });
  }
  clickOnConfirmFromPopup() {
    dashboard.waitForPage();
    return new Promise((resolve) => {
      const confirmbuttonEle = element(by.xpath(confirmbutton));
      browser.wait(browser.ExpectedConditions.elementToBeClickable(confirmbuttonEle), 8888);
      confirmbuttonEle.isDisplayed().then(function () {
        library.clickJS(confirmbuttonEle);
        library.waitLoadingImageIconToBeInvisible();
        resolve(true)
      });
    });
  }
  changeDefaultValues() {
    let result = false;
    let flag1 = false, flag2 = false;
    return new Promise((resolve) => {
      const pointoptionEle = element(by.xpath(pointopt));
      const yes_optionEle = element(by.xpath(yes_option));
      if (pointoptionEle.isDisplayed()) {
        library.clickJS(pointoptionEle);
        flag1 = true;
        library.logStep('Point option is selected');
      }
      if (yes_optionEle.isDisplayed()) {
        library.clickJS(yes_optionEle);
        flag2 = true;
        library.logStep('Yes option is selected');
      }
      if (flag1 && flag2) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  }

  selectPointOptions() {
    let result = false;
    let flag1 = false, flag2 = false;
    return new Promise((resolve) => {
      const pointoptionEle = element(by.xpath(pointopt));
      if (pointoptionEle.isDisplayed()) {
        library.click(pointoptionEle);
        flag1 = true;
        library.logStep('Point option is selected');
      }
      if (flag1) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  }
  selectSummaryOptions() {
    let result = false;
    let flag1 = false, flag2 = false;
    return new Promise((resolve) => {
      const summaryoptEle = element(by.xpath(summaryopt));
      if (summaryoptEle.isDisplayed()) {
        library.clickJS(summaryoptEle);
        flag1 = true;
        library.logStep('Summary option is selected');
      }
      if (flag1) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  }

  selectYesOptions() {
    let result = false;
    let flag1 = false, flag2 = false;
    return new Promise((resolve) => {
      const yes_optionEle = element(by.xpath(yes_option));

      if (yes_optionEle.isDisplayed()) {
        library.clickJS(yes_optionEle);
        flag2 = true;
        library.logStep('Yes option is selected');
      }
      if (flag2) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  }



  selectNoOptions() {
    let flag1 = false, flag2 = false;
    return new Promise((resolve) => {
      const no_optionEle = element(by.xpath(no_option));

      if (no_optionEle.isDisplayed()) {
        library.clickJS(no_optionEle);
        flag2 = true;
        library.logStep('NO option is selected');
      }
      if (flag2) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  }

  verifySelectReagentLotNoCheckboxIsdisplayed() {
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const selectReagentLotNoEle = element(by.xpath('//mat-checkbox/label/span[text()=" Select reagent lot number "]'));
      browser.wait(EC.visibilityOf(selectReagentLotNoEle), 30000);
      selectReagentLotNoEle.isDisplayed().then(function () {
        console.log('Select reagent lot number checkbox is displayed');
        library.logStep('Select reagent lot number checkbox is displayed');
        resolve(true);
      }).catch(function () {
        console.log('Failed : Select reagent lot number checkbox is not displayed');
        library.logFailStep('Failed : Select reagent lot number checkbox is not displayed');
        library.logStepWithScreenshot('Failed : Select reagent lot number checkbox is not displayed', 'Not displayed');
        resolve(false);
      });
    });
  }
  verifySelectCalibratorLotNoCheckboxIsDisplayed() {
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const selectCalibratorLotNoEle = element(by.xpath('//mat-checkbox/label/span[text()=" Select calibrator lot number "]'));
      selectCalibratorLotNoEle.isDisplayed().then(function () {
        console.log('Select calibrator lot number checkbox is displayed');
        library.logStep('Select calibrator lot number checkbox is displayed');
        resolve(true);
      }).catch(function () {
        console.log('Failed : Select calibrator lot number checkbox is not displayed');
        library.logFailStep('Failed : Select calibrator lot number checkbox is not displayed');
        library.logStepWithScreenshot('Failed : Select calibrator lot number checkbox is not displayed', 'Not displayed');
        resolve(false);
      });
    });
  }
  selectDecimal(value) {
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ddArrow = element(by.xpath(decimalPlacesDDArrow));
      ddArrow.isDisplayed().then(function () {
        library.scrollToElement(ddArrow);
        library.clickJS(ddArrow);
        console.log('Decimal Value dropdown arrow clicked');
        library.logStep('Decimal Value dropdown arrow clicked');
        const selectedDecimal = element(by.xpath('.//mat-option[@aria-selected="true"]'));
        selectedDecimal.isDisplayed().then(function () {
          selectedDecimal.getText().then(function (text) {
            console.log('Decimal Value Already Selected ' + text);
            library.logStep('Decimal Value Already Selected ' + text);
          });
        }).then(function () {
          element.all(by.xpath('.//mat-option/span')).each(function (element1, index) {
            element1.getText().then(function (text) {
              if (text == value) {
                ++index;
                const str = element(by.xpath("(.//mat-option/span)[" + index + "]"));
                str.click();
                resolve(true);
              }
            });
          });

        });
      }).catch(function () {
        console.log('Could not select another Decimal Value');
        library.logFailStep('Could not select another Decimal Value');
        resolve(false);
      });
    });
  }

  isDecimalSelected(value) {
    browser.ignoreSynchronization = true;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const ddArrow = element(by.xpath(decimalPlacesDDArrow));
      ddArrow.isDisplayed().then(function () {
        library.scrollToElement(ddArrow);
        library.clickJS(ddArrow);
        const selectedDecimal = element(by.xpath('.//mat-option[@aria-selected="true"]'));
        selectedDecimal.isDisplayed().then(function () {
          selectedDecimal.getText().then(function (text) {
            if (text == value) {
              console.log('Decimal Value Selected -' + text);
              library.logStep('Decimal Value Selected -' + text);
              resolve(true);
            }
          });
        });
      });
    });
  }
  clickUpdateButton() {
    return new Promise(async (resolve) => {

      const updateBtnEle = await element(by.xpath(updateBtn));
      await library.clickJS_async(updateBtnEle);
      library.logStep('updateBtnEle Clicked.');
      let loadingPopUp = element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]'));
      await browser.wait(browser.ExpectedConditions.invisibilityOf(loadingPopUp), 25000);
      await browser.wait(browser.ExpectedConditions.invisibilityOf(element(by.xpath(toast))), 25000);
      resolve(true);
    });
  }
  navigateTOControlLot(to) {
    let flag = false;
    return new Promise(async (resolve) => {
      dashboard.waitForElement();
      const sideNav = element(by.xpath('//div[contains(@class, "spec_sidenav_link")]/div/span[contains(text(),"' + to + '")]'));
      browser.executeScript('arguments[0].scrollIntoView(true);', sideNav);
      browser.wait(browser.ExpectedConditions.visibilityOf((sideNav)), 30000, 'Side navigation not visible: ' + to);
      sideNav.isDisplayed().then(function () {
        library.clickJS(sideNav);
        dashboard.waitForScroll();
        flag = true;
        library.logStep('User is navigated to ' + to);
        console.log('User is navigated to ' + to);
        resolve(flag);
      }).catch(function () {
        flag = true;
        library.logStep('Not displayed' + to);
        console.log('Not displayed' + to);
        resolve(flag);
      });
    });

  }
}

