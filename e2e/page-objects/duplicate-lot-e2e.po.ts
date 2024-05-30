/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const fs = require('fs');
let jsonData;
fs.readFile('./JSON_data/Duplicate_Lot.json', (err, data1) => {
  if (err) { throw err; }
  const settings = JSON.parse(data1);
  jsonData = settings;
});

// fs.readFile('./JSON_data/DuplicateLot_stage.json', (err, data1) => {
//   if (err) { throw err; }
//   const settings = JSON.parse(data1);
//   jsonData = settings;
// });

const library = new BrowserLibrary();
const dashboard = new Dashboard();
const sideNavigation = './/mat-sidenav[@id = "sideNav"]';
const sideNavElementsAll = './/unext-nav-side-bar-link//div[1]';
const lotNumberValue = './/mat-select[contains(@aria-label, "Lot Number")]//span[contains(@class, "mat-select-value")]/span';
const controlNameValue = './/mat-select[contains(@aria-label, "Control Name")]//span[contains(@class, "mat-select-value")]/span';
const duplicateLotButton = '//*[text()="DUPLICATE LOT"]//parent::button';
const duplicateLotPopUp = '//*[contains(@class,"mat-dialog-container")]';
const dupicateLotDropdown = '(//*[contains(@aria-label,"Lot Number")])[2]';
const customName = '(//*[@formcontrolname="customName"])[2]';
const submitBtn = '//*[text()="DUPLICATE"]//parent::button[1]';
const lotNumber = '//unext-duplicate-node-entry//br-select[@formcontrolname="lotNumber"]/mat-form-field[@id="multipleData"]//mat-select';
const duplicate = '//unext-duplicate-node-entry//span[contains(text(),"DUPLICATE")]';
const startNewLotButton = '//*[text()="START NEW LOT"]//parent::button';
const selectLot = './/span[contains(@class, "placeholder")][contains(text(),"Select Lot")]';
const onThisInstrumentRadioButton = './/div[contains(text(),"On this instrument")]/ancestor::mat-radio-button';
const onThisInstrumentRadioButtonSelected = './/div[contains(text(),"On this instrument")]/ancestor::mat-radio-button[contains(@class,"mat-radio-checked")]';
const infoOnThisInstrument = './/div[contains(text(),"On this instrument")]/ancestor::mat-radio-button/following-sibling::p[text()="Retain all analytes and settings except evaluation mean and SD."]';
const onMultipleInstrumentsRadioButtonDisabled = './/div[contains(text(),"On multiple instruments")]/ancestor::mat-radio-button[contains(@class,"mat-radio-disabled")]';
// const onMultipleInstrumentsRadioButton =
// './/div[contains(text(),"On multiple instruments")]/ancestor::mat-radio-button[@ng-reflect-disabled="false"]';
const onMultipleInstrumentsRadioButton = './/div[contains(text(),"On multiple instruments")]/ancestor::mat-radio-button';
const infoOnMultipleInstruments = './/div[contains(text(),"On multiple instruments")]/ancestor::mat-radio-button/following-sibling::p[contains(text(),"Retain all analytes and settings except evaluation mean and SD for these instruments.")]';
const cancelButtonOverlay = './/mat-dialog-container//button/span[text()="Cancel"]';
const startNewLotButtonOverlay = './/mat-dialog-container//button/span[text()="START NEW LOT"]';
// const cancelButtonOverlayEnabled = './/span[text()="Cancel"]/parent::button[@ng-reflect-disabled="false"]';
const cancelButtonOverlayEnabled = './/span[text()="Cancel"]/parent::button';
// const startNewLotButtonOverlayEnabled = './/span[text()="START NEW LOT"]/parent::button[@ng-reflect-disabled="false"]';
const startNewLotButtonOverlayEnabled = './/span[text()="START NEW LOT"]/parent::button';
const closeButton = './/button[contains(@class, "dialog-close-button")]';
const duplicateLotOverlay = './/mat-dialog-content[contains(@class,"duplicate-node-entry-component")]';
const selectAllInstrumentCheckbox =
  './/mat-checkbox[@formcontrolname="selectAllInstruments"]/label//strong[text()="All instruments below"]';
const lotDuplicationNotificationOnInstrument = './/div[contains(text(),"Duplication of this lot is in progress.")][contains(text(),"Please check back later to work with this lot")]';
const retainCVCheckbox = '//span[@class="mat-checkbox-label"][contains(text(),"Retain fixed CV where set")]/ancestor::mat-checkbox';
const retainCVLabel = './/mat-checkbox//span[@class="mat-checkbox-label"][contains(text(),"Retain fixed CV where set")]';
// Panel Methods
const panelName = 'mat-input-1';
const EC = protractor.ExpectedConditions;
export class DuplicateLot {
  createDuplicateLot(lotId) {
    let flag = false;
    return new Promise((resolve) => {
      const lotNumberEle = findElement(locatorType.XPATH, lotNumber);
      library.clickJS(lotNumberEle);
      library.logStepWithScreenshot('Lot Number Dropdown clicked', 'LotNumberDropdown');
      const lotIdOption = findElement(locatorType.XPATH, '//mat-option//span[contains(text(),"' + lotId + '")]');
      library.clickJS(lotIdOption);
      console.log('Option selected');
      const duplicateBtn = findElement(locatorType.XPATH, duplicate);
      library.clickJS(duplicateBtn);
      console.log('duplicateBtn Clicked');
      library.logStepWithScreenshot('Duplicate Button Clicked.', 'DuplicateClicked');
      flag = true;
      resolve(flag);
    });
  }

  verifyLotNumberNotDuplicatedNew(controlName, oldLotNumber, newLotNumber) {
    let result = false;
    return new Promise((resolve) => {
      const duplicatedLotOld = findElement(locatorType.XPATH, '//div[contains(text(),"' + controlName + '")]/following-sibling::div/span[contains(text(),"' + oldLotNumber + '")]');
      const duplicatedLotNew = findElement(locatorType.XPATH, '//div[contains(text(),"' + controlName + '")]/following-sibling::div/span[contains(text(),"' + newLotNumber + '")]');
      if (duplicatedLotOld.isDisplayed() && duplicatedLotNew.isDisplayed()) {
        result = true;
        library.logStepWithScreenshot('Lot Number is not duplicated', 'lotNumberNotDuplicated');
        console.log('Lot Number is not duplicated');
        resolve(result);
      } else {
        result = false;
        library.logFailStep('Lot Number is  duplicated.');
        console.log('Lot Number is  duplicated');
        resolve(result);
      }
    });
  }

  VerifyDuplicateLotCreatedNew(controlName, lotId) {
    let result = false;
    return new Promise((resolve) => {
      const duplicatedLot = findElement(locatorType.XPATH, '//div[contains(text(),"' + controlName + '")]/following-sibling::div/span[contains(text(),"' + lotId + '")]');
      if (duplicatedLot.isDisplayed()) {
        result = true;
        library.logStep('Duplicate Lot created');
        library.logStepWithScreenshot('Control Name Duplicated', 'ControlNameDuplicated');
        console.log('Duplicate Lot created');
        resolve(result);
      } else {
        result = false;
        library.logStep('Duplicate Lot not created');
        library.logFailStep('Control Name not Duplicated');
        console.log('Duplicate Lot not created');
        resolve(result);
      }
    });
  }

  VerifyDuplicateLotCreated(controlName, lotId) {
    let result = false;
    let count = 0;
    return new Promise((resolve) => {
      const list = element.all(by.xpath(sideNavElementsAll));
      list.count().then(function (num) {
        for (let i = 1; i <= num; i++) {
          const ele = element(by.xpath('(.//mat-nav-list//div[contains(@class, "primary-dispaly-text")])[' + i + ']'));
          const lotEle = element(by.xpath('(.//unext-nav-side-bar-link//div/span[contains(@class, "lot-number")])[' + i + ']'));
          ele.getText().then(function (txt) {
            lotEle.getText().then(function (lottxt) {
              if (txt.includes(controlName) && lottxt.includes(lotId)) {
                count++;
                console.log('Lot Duplicated with: ' + i + ' ' + txt + ' ' + lottxt);
                library.logStep('Lot Duplicated with: ' + i + ' ' + txt + ' ' + lottxt);
                library.logStepWithScreenshot('lotDuplicated', 'lotDuplicated');
              }
            });
          });
        }
      }).then(function () {
        if (count === 1) {
          console.log('Lot Duplicated');
          library.logStep('Lot Duplicated');
          result = true;
          resolve(result);
        } else {
          library.logFailStep('Lot Duplicateion Failed');
          result = false;
          resolve(result);
        }
      });
    });
  }

  VerifyAllAnalytesCreatedUnderDuplicatedLotsNew(analyte1, analyte2, analyte3) {
    let result = false;
    return new Promise((resolve) => {
      const ele1 = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + analyte1 + '")]');
      const ele2 = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + analyte2 + '")]');
      const ele3 = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + analyte3 + '")]');
      if (ele1.isDisplayed() && ele2.isDisplayed() && ele3.isDisplayed()) {
        console.log('All Analyte Duplicated');
        library.logStep('All Analyte Duplicated.');
        result = true;
        resolve(result);
      } else {
        console.log('All Analyte not Duplicated');
        library.logStep('All Analyte not Duplicated.');
        result = false;
        resolve(result);
      }
    });
  }

  VerifyAllAnalytesCreatedUnderDuplicatedLots(AnalyteNames) {
    let result = false;
    let count = 0, number = 0;
    return new Promise((resolve) => {
      dashboard.waitForScroll();
      const sideNav = element(by.xpath(sideNavigation));
      library.waitForElement(sideNav);
      browser.wait(browser.ExpectedConditions.visibilityOf((sideNav)), 10000, 'Side navigation not visible: ');
      sideNav.isPresent().then(function () {
        const list = element.all(by.xpath(sideNavElementsAll));
        list.count().then(function (num) {
          number = num;
          for (let i = 1; i <= num; i++) {
            const ele = element(by.xpath('(.//unext-nav-side-bar-link//div[1])[' + i + ']'));
            ele.getText().then(function (txt) {
              if (txt.includes(AnalyteNames[i - 1])) {
                count++;
                console.log('Analyte Duplicated: ' + i + ' ' + txt);
                library.logStep('Analyte Duplicated: ' + i + ' ' + txt);
              }
            });
          }
        }).then(function () {
          if (count === number) {
            console.log('Analytes are diuplicated');
            library.logStep('Analytes are diuplicated');
            result = true;
            resolve(result);
          } else {
            library.logFailStep('Fail: Analytes are not diuplicated');
            result = false;
            resolve(result);
          }
        });
      });
    });
  }

  navigateToDuplicateLot(controlName, lotId) {
    let flag = false;
    return new Promise((resolve) => {
      const duplicatedLot = findElement(locatorType.XPATH, '//div[contains(text(),"' + controlName + '")]/following-sibling::div/span[contains(text(),"' + lotId + '")]');
      library.clickJS(duplicatedLot);
      library.logStep('Navigated to duplicate control.');
      console.log('Navigated to duplicate control.');
      flag = true;
      resolve(flag);
    });
  }

  verifyLotNumberNotDuplicated(oldLotNumber) {
    browser.ignoreSynchronization = true;
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const lotNumberEle = element(by.xpath(lotNumberValue));
      lotNumberEle.isDisplayed().then(function () {
        lotNumberEle.getText().then(function (value) {
          if (value.includes(oldLotNumber)) {
            flag = false;
            library.logFailStep('The New Lot Number matches with the Old Lot Number');
            resolve(flag);
          } else {
            flag = true;
            library.logStepWithScreenshot('The New Lot Number does not match with the Old Lot Number', 'NewLotNumber');
            resolve(flag);
          }
        });
      });
    });
  }

  verifyControlNameDuplicated(controlName) {
    browser.ignoreSynchronization = true;
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const lotNumberElement = element(by.xpath(controlNameValue));
      lotNumberElement.isDisplayed().then(function () {
        lotNumberElement.getText().then(function (value) {
          if (value.includes(controlName)) {
            flag = true;
            library.logStepWithScreenshot('The Control Name matches with the Old Control Name', 'NewControlName');
            resolve(flag);
          } else {
            flag = false;
            library.logFailStep('The New Control Name does not match with the Old Control Number');
            resolve(flag);
          }
        });
      });
    });
  }

  ClickDuplicateLotButton() {
    return new Promise((resolve) => {
      const duplicateLotBtn = element(by.xpath(duplicateLotButton));
      duplicateLotBtn.isDisplayed().then(function () {
        library.clickJS(duplicateLotBtn);
        console.log('clicked on duplicate lot button');
        library.logStep('clicked on duplicate lot button');
      }).catch(function () {
        console.log('Failed : unable to click on duplicate lot button');
        library.logStep('Failed : unable to click on duplicate lot button');
        library.logStepWithScreenshot('Failed : unable to click on duplicate lot button', 'DuplicateLotBtnNotClicked');
        resolve(false);
      });
    });
  }

  VerifyDuplicateLotsPopupUI() {
    return new Promise((resolve) => {
      const duplicateLotPopUpEnt = element(by.xpath(duplicateLotPopUp));
      duplicateLotPopUpEnt.isDisplayed().then(function () {
        element(by.xpath(dupicateLotDropdown)).isDisplayed().then(function () {
          element(by.xpath(customName)).isDisplayed().then(function () {
            element(by.xpath(submitBtn)).isDisplayed().then(function () {
              console.log('Duplicate Lot Pop up is displayed');
              library.logStep('Duplicate Lot Pop up is displayed');
              library.logStepWithScreenshot('Duplicate Lot Pop up is displayed', 'Popup Diplayed');
              resolve(true);
            }).catch(function () {
              console.log('Failed : Submit button is not displayed');
              library.logStep('Failed : Submit button is not displayed');
              library.logStepWithScreenshot('Failed : Submit button is not displayed', 'submitBtnNotDiplayed');
              resolve(false);
            });
          }).catch(function () {
            console.log('Failed : Custome Name option is not displayed');
            library.logStep('Failed : Custome Name option is not displayed');
            library.logStepWithScreenshot('Failed : Custome Name option is not displayed', 'customnNameNotDiplayed');
            resolve(false);
          });
        }).catch(function () {
          console.log('Failed : Duplcate Lot dropdown is not displayed');
          library.logStep('Failed : Duplcate Lot dropdown is not displayed');
          library.logStepWithScreenshot('Failed : Duplcate Lot dropdown is not displayed', 'dropdownNotDisplayed');
          resolve(false);
        });
      });
    });
  }

  VerifyDuplicateLotBtnDisplayed() {
    return new Promise((resolve) => {
      const duplicateLotBtn = element(by.xpath(duplicateLotButton));
      duplicateLotBtn.isDisplayed().then(function () {
        console.log('Duplicate Lot Button is displayed');
        library.logStep('Duplicate Lot Button is displayed');
        library.logStepWithScreenshot('Duplicate Lot Button is displayed', 'DuplicateLotBtnDisplayed');
        resolve(true);
      }).catch(function () {
        console.log('Failed : Duplicate Lot Button is displayed');
        library.logStep('Failed : Duplicate Lot Button is displayed');
        library.logStepWithScreenshot('Failed : Duplicate Lot Button is displayed', 'DuplicateLotBtnNotDisplayed');
        resolve(false);
      });
    });
  }

  clickRemoveIcon(itemName) {
    let flag;
    return new Promise((resolve) => {
      const removeItem = findElement(locatorType.XPATH, '//span[contains(text(),"' + itemName + '")]/ancestor::span/following-sibling::div/mat-icon');
      library.clickJS(removeItem);
      library.logStepWithScreenshot(itemName + ' Item Removed.', 'ItemRemoved');
      flag = true;
      resolve(flag);
    });

  }

  verifyItemsRemovedFromPanelItem(itemName) {
    let flag;
    return new Promise((resolve) => {
      try {
        const removeItemDisp = element(by.xpath('//span[contains(text(),"' + itemName + '")]'));
        if (removeItemDisp.isDisplayed()) {
          library.logFailStep(itemName + ' Removed Item is still displaing in panel Items.');
          flag = false;
          resolve(flag);
        } else {
          library.logStepWithScreenshot(itemName + ' Removed Item is not displaing in panel Items.', 'ItemRemoved');
          flag = true;
          resolve(flag);
        }
      } catch (e) {
        library.logStepWithScreenshot(itemName + ' Removed Item is not displaing in panel Items.', 'ItemRemoved');
        flag = true;
        resolve(flag);
      }
    });
  }

  enterPanelName(panelNameEnter) {
    let flag;
    return new Promise((resolve) => {
      const panelNameEle = findElement(locatorType.ID, panelName);
      panelNameEle.sendKeys(panelNameEnter);
      library.logStepWithScreenshot(panelNameEnter + 'Panel Name Entered.', 'PanelNameEntered');
      flag = true;
      resolve(flag);
    });
  }

  rearrangePanelItems(fromElementNumber, toElementNumber) {
    let flag;
    return new Promise((resolve) => {
      try {
        const elem = findElement(locatorType.XPATH, '//unext-panel-item-list//div[contains(@class,"drop")]/div[' + fromElementNumber + ']');
        const target = findElement(locatorType.XPATH, '//unext-panel-item-list//div[contains(@class,"drop")]/div[' + toElementNumber + ']');
        browser.actions().dragAndDrop(elem, target).mouseUp().perform();
        library.logStepWithScreenshot(fromElementNumber + '  item moved to ' + toElementNumber, 'rearrange item');
        flag = true;
        resolve(flag);
      } catch (e) {
        console.log(e);
        library.logFailStep(fromElementNumber + '  item not moved to ' + toElementNumber);
        flag = false;
        resolve(flag);
      }
    });
  }

  verifyItemsRearranged(itemName, ItemIndex) {
    let flag;
    return new Promise((resolve) => {
      const arrangedItem = findElement(locatorType.XPATH, '//unext-panel-item-list//div[contains(@class,"drop")]/div[' + ItemIndex + ']/span/span[contains(text(),"' + itemName + '")]');
      if (arrangedItem.isDisplayed()) {
        library.logStepWithScreenshot(itemName + ' Item moved to ' + ItemIndex + ' successfully', 'rearrange item');
        flag = true;
        resolve(flag);
      } else {
        library.logFailStep(itemName + ' Item is not moved to ' + ItemIndex + ' successfully');
        flag = false;
        resolve(flag);
      }
    });
  }

  VerifyStartNewLotBtnDisplayed() {
    return new Promise((resolve) => {
      const startNewLotBtn = element(by.xpath(startNewLotButton));
      startNewLotBtn.isDisplayed().then(function () {
        console.log('Start New Lot Button is displayed');
        library.logStep('Start New Lot Button is displayed');
        library.logStepWithScreenshot('Start New Lot Button is displayed', 'StartNewLotBtnDisplayed');
        resolve(true);
      }).catch(function () {
        console.log('Failed : Start New Lot Button is not displayed');
        library.logStep('Failed : Start New Lot Button is not displayed');
        library.logFailStep('Failed : Start New Lot Button is not displayed');
        resolve(false);
      });
    });
  }

  ClickStartNewLotButton() {
    return new Promise((resolve) => {
      const startNewLotBtn = element(by.xpath(startNewLotButton));
      startNewLotBtn.isDisplayed().then(function () {
        library.clickJS(startNewLotBtn);
        console.log('clicked on Start New Lot button');
        library.logStep('clicked on Start New Lot button');
      }).catch(function () {
        console.log('Failed : unable to click on Start New Lot button');
        library.logStep('Failed : unable to click on Start New Lot button');
        library.logStepWithScreenshot('Failed : unable to click on Start New Lot button', 'StartNewLotBtnNotClicked');
        resolve(false);
      });
    });
  }

  VerifyStartNewLotPopupUI(controlName) {
    let status = false;
    let count = 0;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const headerString = 'Start a new lot of ' + controlName;
      const header = './/h2[contains(text(), "' + headerString + '")]';
      const pageUI = new Map<string, string>();
      pageUI.set(header, 'Duplicate Lot Overlay header');
      pageUI.set(selectLot, 'Select Lot dropdown');
      pageUI.set(onThisInstrumentRadioButtonSelected, 'By default selected "on This Instrument" Radio Button');
      pageUI.set(infoOnThisInstrument, 'Text "Retain all analytes and settings except evaluation mean and SD."');
      pageUI.set(onMultipleInstrumentsRadioButtonDisabled, 'By default disabled "on Multiple Instruments" Radio Button');
      pageUI.set(infoOnMultipleInstruments, 'Text "Retain all analytes and settings except evaluation mean and SD for these instruments."');
      pageUI.set(cancelButtonOverlay, 'Cancel Button');
      pageUI.set(startNewLotButtonOverlay, 'START NEW LOT Button');
      pageUI.set(closeButton, 'Close Button');
      const overlay = element(by.xpath(duplicateLotOverlay));
      overlay.isDisplayed().then(function () {
        pageUI.forEach(function (key, value) {
          const ele = element(by.xpath(value));
          ele.isDisplayed().then(function () {
            console.log(key + ' is displayed');
            library.logStep(key + ' is displayed');
            count++;
          }).catch(function () {
            library.logFailStep(key + ' is not displayed.');
          });
        });
      }).then(function () {
        if (count === pageUI.size) {
          status = true;
          library.logStepWithScreenshot('Start New Lot Overlay UI verified', 'UIVerified');
          resolve(status);
        } else {
          status = false;
          library.logFailStep('Could not verify Start New Lot Overlay UI');
          resolve(status);
        }
      });
    });
  }

  clickLotNumberDropdown() {
    let flag = false;
    return new Promise((resolve) => {
      const lotNumberEle = findElement(locatorType.XPATH, lotNumber);
      library.clickJS(lotNumberEle);
      library.logStepWithScreenshot('Lot Number Dropdown clicked', 'LotNumberDropdown');
      flag = true;
      resolve(flag);
    });
  }

  verifyLotDisplayed(lot, expiry) {
    // let flag = false;
    return new Promise((resolve) => {
      const lotEle = element(by.xpath('.//mat-option/span[contains(text(),"' + lot + '")][contains(text(),"' + expiry + '")]'));
      lotEle.isDisplayed().then(function () {
        console.log('Lot along with expiration date is displayed');
        library.logStepWithScreenshot('Lot along with expiration date is displayed', 'LotDisplayed');
      });
    });
  }

  SelectLot(lotId) {
    let flag = false;
    return new Promise((resolve) => {
      const lotIdOption = findElement(locatorType.XPATH, '//mat-option//span[contains(text(),"' + lotId + '")]');
      library.clickJS(lotIdOption);
      console.log('Lot selected');
      library.logStepWithScreenshot('Lot selected', 'LotSelected');
      flag = true;
      resolve(flag);
    });
  }

  selectOnThisInstrumentOption() {
    let flag = false;
    return new Promise((resolve) => {
      const onThisInstrumentRadioBtn = findElement(locatorType.XPATH, onThisInstrumentRadioButton);
      onThisInstrumentRadioBtn.click();
      console.log('On This Instrument Radio  Button clicked');
      library.logStep('On This Instrument Radio  Button clicked');
      flag = true;
      resolve(flag);
    });
  }

  selectOnMultipleInstrumentsOption() {
    let flag = false;
    return new Promise((resolve) => {
      const onMultipleInstrumentsRadioBtn = findElement(locatorType.XPATH, onMultipleInstrumentsRadioButton);
      onMultipleInstrumentsRadioBtn.click();
      console.log('On Multiple Instruments Radio  Button clicked');
      library.logStep('On Multiple Instruments Radio  Button clicked');
      flag = true;
      resolve(flag);
    });
  }

  clickCancelButton() {
    let flag = false;
    return new Promise((resolve) => {
      const cancelBtn = findElement(locatorType.XPATH, cancelButtonOverlay);
      cancelBtn.click();
      console.log('Cancel Button clicked');
      library.logStep('Cancel Button clicked');
      flag = true;
      resolve(flag);
    });
  }

  clickCloseButton() {
    let flag = false;
    return new Promise((resolve) => {
      const closeBtn = element(by.xpath(closeButton));
      closeBtn.isDisplayed().then(function (close) {
        library.scrollToElement(closeBtn);
        closeBtn.click();
        console.log('Close Button clicked');
        library.logStep('Close Button clicked');
        flag = true;
        resolve(flag);
      });
    });
  }

  clickStartNewLotButtonOnOverlay() {
    let flag = false;
    return new Promise((resolve) => {
      const startNewLotBtnOverlay = findElement(locatorType.XPATH, startNewLotButtonOverlay);
      startNewLotBtnOverlay.click();
      console.log('Start New Lot Button clicked');
      library.logStep('Start New Lot Button clicked');
      flag = true;
      resolve(flag);
    });
  }

  verifyStartNewLotOverlayDisplayed() {
    let flag = false;
    return new Promise((resolve) => {
      const overlay = element(by.xpath(duplicateLotOverlay));
      overlay.isDisplayed().then(function () {
        flag = true;
        resolve(flag);
        console.log('Start New Lot Overlay is displayed');
        library.logStep('Start New Lot Overlay is displayed');
      }).catch(function () {
        flag = false;
        resolve(flag);
        console.log('Start New Lot Overlay is not displayed');
        library.logFailStep('Start New Lot Overlay is not displayed');
      });
    });
  }

  VerifyAnalyteDuplicated(analyte1) {
    let result = false;
    return new Promise((resolve) => {
      const ele1 = element(by.xpath('//mat-nav-list//div[contains(text(),"' + analyte1 + '")]'));
      ele1.isDisplayed().then(function () {
        console.log('Analyte is Duplicated');
        library.logStep('Analyte is Duplicated.');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Analyte is not Duplicated');
        library.logFailStep('Analyte is not Duplicated.');
        result = false;
        resolve(result);
      });
    });
  }

  verifyCancelEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const cancelEnabled = element(by.xpath(cancelButtonOverlayEnabled));
      cancelEnabled.isDisplayed().then(function () {
        console.log('Cancel Button is Enabled');
        library.logStep('Cancel Button is Enabled');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Cancel Button is not Enabled');
        library.logFailStep('Cancel Button is not Enabled');
        result = false;
        resolve(result);
      });
    });
  }

  verifyStartNewLotEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const startNewLotEnabled = element(by.xpath(startNewLotButtonOverlayEnabled));
      startNewLotEnabled.isDisplayed().then(function () {
        console.log('Start New Lot Button is Enabled');
        library.logStep('Start New Lot Button is Enabled');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Start New Lot Button is not Enabled');
        library.logFailStep('Start New Lot Button is not Enabled');
        result = false;
        resolve(result);
      });
    });
  }

  verifyOnMultipleInstrumentsEnabled() {
    let result = false;
    return new Promise((resolve) => {
      const onMultipleInstruments = element(by.xpath(onMultipleInstrumentsRadioButton));
      onMultipleInstruments.isDisplayed().then(function () {
        console.log('On Multiple Instruments Radio Button is Enabled');
        library.logStepWithScreenshot('On Multiple Instruments Radio Button is Enabled', 'OMIRBEnabled');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('On Multiple Instruments Radio Button is not Enabled');
        library.logFailStep('On Multiple Instruments Radio Button is not Enabled');
        result = false;
        resolve(result);
      });
    });
  }

  verifyCheckBxInstDeptDisplayed(instrumentName, departmentName) {
    let result = false;
    return new Promise((resolve) => {
      const instDeptName = element(by.xpath('.//div[@formarrayname="instrumentsArray"]//mat-checkbox/label//span[@class="instrument-name"][contains(text(),"' + instrumentName + '")]/ancestor::mat-checkbox/following-sibling::span[contains(text(),"' + departmentName + '")]'));
      instDeptName.isDisplayed().then(function () {
        console.log('Instrument name ' + instrumentName + ' and Department name ' + departmentName +
          ' along with a Checkbox is displayed.');
        library.logStep('Instrument name ' + instrumentName + ' and Department name ' + departmentName + ' along with a Checkbox is displayed.');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Instrument name ' + instrumentName + ' and Department name ' + departmentName + ' along with a Checkbox is not displayed.');
        library.logFailStep('Instrument name ' + instrumentName + ' and Department name ' + departmentName + ' along with a Checkbox is not displayed.');
        result = false;
        resolve(result);
      });
    });
  }

  verifyCheckBxSelectAllInstrumentsDisplayed() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const selectAllInstrumentChkbx = element(by.xpath(selectAllInstrumentCheckbox));
      selectAllInstrumentChkbx.isDisplayed().then(function () {
        console.log('All Instruments below text along with a check box is displayed');
        library.logStepWithScreenshot('All Instruments below text along with a check box is displayed', 'AllBelowInstrumentsCheckbox');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('All Instruments below text along with a check box is not displayed');
        library.logFailStep('All Instruments below text along with a check box is not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clickCheckBxInst(instrumentName, departmentName) {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const instDeptName = element(by.xpath('//mat-checkbox/label//span[@class="instrument-name"][contains(text(),"' + instrumentName + '")]/ancestor::mat-checkbox/following-sibling::span[contains(text(),"' + departmentName + '")]/parent::div/mat-checkbox'));
      instDeptName.isDisplayed().then(function () {
        library.scrollToElement(instDeptName);
        instDeptName.click();
        console.log('Clicked checkbox for Instrument name ' + instrumentName + ' and Department name ' + departmentName);
        library.logStepWithScreenshot('Clicked checkbox for Instrument name ' + instrumentName + ' and Department name ' + departmentName, 'CheckBoxClicked');
        result = true;
        resolve(result);
      });
    });
  }

  clickCheckBxAllBelowInstruments() {
    let result = false;
    return new Promise((resolve) => {
      const selectAllInstrumentChkbx = element(by.xpath(selectAllInstrumentCheckbox));
      selectAllInstrumentChkbx.isDisplayed().then(function () {
        library.scrollToElement(selectAllInstrumentChkbx);
        selectAllInstrumentChkbx.click();
        console.log('All Instruments below check box is clicked');
        library.logStepWithScreenshot('All Instruments below check box is clicked', 'AIBCBClicked');
        result = true;
        resolve(result);
      });
    });
  }

  verifyAllCheckedBoxesChecked(expectedCount) {
    let result = false;
    return new Promise((resolve) => {
      const allCheckboxes = element.all(by.xpath('.//mat-checkbox[contains(@class,"mat-checkbox-checked")]'));
      allCheckboxes.count().then(function (num) {
        if (num === expectedCount) {
          console.log('All Instruments check boxes are checked');
          library.logStepWithScreenshot('All Instruments check boxes are checked', 'AllChecked');
          result = true;
          resolve(result);
        } else {
          console.log('All Instruments check boxes are not checked');
          library.logFailStep('All Instruments check boxes are not checked');
          result = false;
          resolve(result);
        }
      });
    });
  }

  verifyNotification() {
    let result = false;
    return new Promise((resolve) => {
      dashboard.waitForPage();
      const lotDuplicationNotification = element(by.xpath(lotDuplicationNotificationOnInstrument));
      lotDuplicationNotification.isDisplayed().then(function () {
        console.log('Lot Duplication Notification is displayed on Instrument Data Table Page');
        library.logStepWithScreenshot('Lot Duplication Notification is displayed on Instrument Data Table Page', 'NotificationShown');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Lot Duplication Notification is not displayed on Instrument Data Table Page');
        library.logFailStep('Lot Duplication Notification is not displayed on Instrument Data Table Page');
        result = false;
        resolve(result);
      });
    });
  }

  verifyRetainCVCheckbox() {
    let result = false;
    return new Promise((resolve) => {
      const retainCV = element(by.xpath(retainCVCheckbox));
      retainCV.isDisplayed().then(function () {
        console.log('Retain CV checkbox is displayed');
        library.logStepWithScreenshot('Retain CV checkbox is displayed', 'retainCVDisplayed');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Retain CV checkbox is not displayed');
        library.logFailStep('Retain CV checkbox is not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clickRetainCVCheckbox() {
    let result = false;
    return new Promise((resolve) => {
      const retainCV = element(by.xpath(retainCVCheckbox));
      retainCV.isDisplayed().then(function () {
        library.scrollToElement(retainCV);
        retainCV.click();
        console.log('Retain CV checkbox is clicked');
        library.logStepWithScreenshot('Retain CV checkbox is clicked', 'retainCVClicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Retain CV checkbox is not displayed');
        library.logFailStep('Retain CV checkbox is not displayed');
        result = false;
        resolve(result);
      });
    });
  }
    VerifyStartNewLotPopupUIForDashboard() {
      let status = false;
      let count = 0;
      return new Promise((resolve) => {
        dashboard.waitForPage();
        /* const headerString = 'Start a new lot of ' + controlName;
        const header = './/h2[contains(text(), "' + headerString + '")]'; */
        const pageUI = new Map<string, string>();
        //pageUI.set(header, 'Duplicate Lot Overlay header');
        pageUI.set(selectLot, 'Select Lot dropdown');
        pageUI.set(onThisInstrumentRadioButtonSelected, 'By default selected "on This Instrument" Radio Button');
        pageUI.set(infoOnThisInstrument, 'Text "Retain all analytes and settings except evaluation mean and SD."');
        pageUI.set(onMultipleInstrumentsRadioButtonDisabled, 'By default disabled "on Multiple Instruments" Radio Button');
        pageUI.set(infoOnMultipleInstruments, 'Text "Retain all analytes and settings except evaluation mean and SD for these instruments."');
        pageUI.set(cancelButtonOverlay, 'Cancel Button');
        pageUI.set(startNewLotButtonOverlay, 'START NEW LOT Button');
        pageUI.set(closeButton, 'Close Button');
        browser.wait(EC.visibilityOf(element(by.xpath(duplicateLotOverlay))), 7000);
        const overlay = element(by.xpath(duplicateLotOverlay));
        overlay.isDisplayed().then(function () {
          pageUI.forEach(function (key, value) {
            const ele = element(by.xpath(value));
            ele.isDisplayed().then(function () {
              console.log(key + ' is displayed');
              library.logStep(key + ' is displayed');
              count++;
            }).catch(function () {
              library.logFailStep(key + ' is not displayed.');
            });
          });
        }).then(function () {
          if (count === pageUI.size) {
            status = true;
            library.logStepWithScreenshot('Start New Lot Overlay UI verified', 'UIVerified');
            resolve(status);
          } else {
            status = false;
            library.logFailStep('Could not verify Start New Lot Overlay UI');
            resolve(status);
          }
        });
      });
    }
}
