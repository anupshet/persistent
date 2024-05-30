/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { BrowserLibrary, findElement, locatorType } from '../utils/browserUtil';
const path = require('path');
const library = new BrowserLibrary();
const archiveToggle = '//*[@id="spec_archive-input"]';
const toggle = '//*[@id="spec_archive-input"]/../..';
const archiveToggleForDept = '//*[contains(@class,"slide-toggle-label")]//parent::mat-slide-toggle[@formcontrolname="archived"]';
const disabledCancel = '//span[contains(text(),"Cancel")]/parent::button[@disabled="true"]';
const disabledUpdate = '//span[contains(text(),"Update")]/../..';
const enabledCancel = '//span[contains(text(),"Cancel")]';
const enabledUpdate = '//span[contains(text(),"Update")]';
const updateButton = './/span[contains(text(),"Update")]//parent::span//parent::button';
const updateDeptButton = 'spec_updateButton';
const reportsEnabled = '//div[@aria-disabled="false"][@role="tab"]//div[contains(text(),"REPORTS")]';
const editAnalyte = '//span[contains(text(),"Edit this analyte")]';
const editControl = '//span[contains(text(),"Edit this Control")]';
const editInstrument = '//span[contains(text(),"Edit this Instrument")]';
const leftNavArchiveTToggle = 'mat-slide-toggle-1-input';
const leftNavToggle = './/mat-slide-toggle[contains(@name, "archivedItems")]//input';
const archivedItemNotPresent = './/mat-slide-toggle[contains(@name, "archivedItems")]//input//following::mat-nav-list';
const expiredLot = '//*[text() = "This lot is expired. Please add a new lot."]';
const expiredLotPopUp = '//*[contains(text(),"The lot for this analyte")]';

export class ArchivingLots {

  clickArchiveToggle() {
    let flag = false;
    return new Promise((resolve) => {
      const archiveToggleBtn = findElement(locatorType.XPATH, archiveToggle);
      archiveToggleBtn.getAttribute('aria-checked').then(function (status) {
        if (status === 'false') {
          library.clickJS(archiveToggleBtn);
          library.logStep('Archive toggle button is turned on.');
          const updateBtn = findElement(locatorType.XPATH, updateButton);
          library.clickJS(updateBtn);
          library.logStepWithScreenshot('Update button clicked.', 'archive');
          console.log('Update button clicked.');
          if (updateBtn.isDisplayed()) {
            library.clickJS(updateBtn);
            library.logStepWithScreenshot('Update button clicked for 2nd time', 'archive');
            console.log('Update button clicked for 2nd time');
          }
          browser.wait
            (browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 50000, 'Element is visible');
          flag = true;
          resolve(flag);
        } else {
          library.logStepWithScreenshot('Archive toggle button is already on.', 'archive');
          flag = true;
          console.log('Archive toggle button is already on.');
          resolve(flag);
        }
      });
    });
  }

  clickArchiveToggleForDept() {
    let flag = false;
    return new Promise((resolve) => {
      const archiveToggleBtn = element(by.xpath(archiveToggleForDept));
      archiveToggleBtn.getAttribute('class').then(function (status) {
        if (!status.includes('mat-checked')) {
          console.log('Akshay');
          browser.sleep(5000);
          library.click(archiveToggleBtn);
          library.logStep('Archive toggle button is turned on.');
          const updateBtn = findElement(locatorType.ID, updateDeptButton);
          library.clickJS(updateBtn);
          library.logStepWithScreenshot('Update button clicked.', 'archive');
          console.log('Update button clicked.');
          flag = true;
          resolve(flag);
        } else {
          library.logStepWithScreenshot('Archive toggle button is already on.', 'archive');
          flag = true;
          console.log('Archive toggle button is already on.');
          resolve(flag);
        }
      });
    });
  }

  clickCancelButton() {
    let result = false;
    return new Promise((resolve) => {
      const editThislink = element(by.xpath(enabledCancel));
      editThislink.isDisplayed().then(function () {
        library.clickJS(editThislink);
        console.log('Cancel button clicked');
        library.logStep('Cancel button clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Cancel button not displayed');
        library.logStep('Cancel button not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clickUpdateButton() {
    let result = false;
    return new Promise((resolve) => {
      const updateBtn = element(by.xpath(updateButton));
      updateBtn.isDisplayed().then(function () {
        library.clickJS(updateBtn);
        console.log('Update button clicked');
        library.logStep('Update button clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('Update button not displayed');
        library.logStep('Update button not displayed');
        result = false;
        resolve(result);
      });
    });
  }

  clickUnArchiveToggleForDept() {
    let flag = false;
    return new Promise((resolve) => {
      const archiveToggleBtn = findElement(locatorType.XPATH, archiveToggleForDept);
      archiveToggleBtn.getAttribute('class').then(function (status) {
        if (status.includes('mat-checked')) {
          library.click(archiveToggleBtn);
          library.logStep('Archive toggle button is turned off.');
          const updateBtn = findElement(locatorType.ID, updateDeptButton);
          library.clickJS(updateBtn);
          library.logStepWithScreenshot('Update button clicked.', 'archive');
          console.log('Update button clicked.');
          flag = true;
          resolve(flag);
        } else {
          library.logStepWithScreenshot('Archive toggle button is not already on.', 'archive');
          flag = true;
          console.log('Archive toggle button is not already on.');
          resolve(flag);
        }
      });
    });
  }

  clickUnarchiveToggle() {
    let flag = false;
    return new Promise((resolve) => {
      const archiveToggleBtn = findElement(locatorType.XPATH, archiveToggle);
      archiveToggleBtn.getAttribute('aria-checked').then(function (status) {
        if (status === 'true') {
          library.clickJS(archiveToggleBtn);
          library.logStep('Archive toggle button is turned off.');
          const updateBtn = findElement(locatorType.XPATH, updateButton);
          library.clickJS(updateBtn);
          library.logStepWithScreenshot('Update button clicked.', 'archive');
          flag = true;
          resolve(flag);
        } else {
          library.logStepWithScreenshot('Archive toggle button is already off.', 'archive');
          flag = true;
          resolve(flag);
        }
      });
    });
  }

  clickUnarchiveToggleAnalyte() {
    let result = false;
    return new Promise((resolve) => {
      const toggleClick = element(by.xpath(toggle));
      toggleClick.isDisplayed().then(function () {
        library.clickJS(toggleClick);
        console.log('toggle button clicked');
        library.logStep('toggle button clicked');
        result = true;
        resolve(result);
      }).catch(function () {
        console.log('toggle button not displayed');
        library.logStep('toggle button not displayed');
        result = false;
        resolve(result);
      });
    });
  }
  verifyReportsTabEnabled() {
    let flag = false;
    return new Promise((resolve) => {
      const reportsenabledTab = findElement(locatorType.XPATH, reportsEnabled);
      if (reportsenabledTab.isDisplayed()) {
        library.logStepWithScreenshot('Reports Tab is enabled.', 'reportDisabled');
        flag = true;
        resolve(flag);
      } else {
        library.logFailStep('Reports Tab is disabled.');
        flag = false;
        resolve(flag);
      }
    });
  }

  verifyEditLinkEnabled(level) {
    let flag = false;
    return new Promise((resolve) => {
      if (level === 'Instrument') {
        const editInstrumentLink = findElement(locatorType.XPATH, editInstrument);
        if (editInstrumentLink.isEnabled) {
          library.logStepWithScreenshot('Edit instrument link enabled.', 'editLinkEnabled');
          flag = true;
          resolve(flag);
        } else {
          library.logFailStep('Edit instrument link is disabled.');
          flag = false;
          resolve(flag);
        }

      } else if (level === 'Control') {
        const editControlLink = findElement(locatorType.XPATH, editControl);
        if (editControlLink.isEnabled) {
          library.logStepWithScreenshot('Edit Control link enabled.', 'editLinkEnabled');
          flag = true;
          resolve(flag);
        } else {
          library.logFailStep('Edit Control link is disabled.');
          flag = false;
          resolve(flag);
        }
      } else {
        const editAnalyteLink = findElement(locatorType.XPATH, editAnalyte);
        if (editAnalyteLink.isEnabled) {
          library.logStepWithScreenshot('Edit Analyte link enabled.', 'editLinkEnabled');
          flag = true;
          resolve(flag);
        } else {
          library.logFailStep('Edit Analyte link is disabled.');
          flag = false;
          resolve(flag);
        }
      }
    });
  }

  verifyLeftNavigationToggleFunctionality(greyedElement) {
    let flag = false;
    return new Promise((resolve) => {
      const leftNavArchiveToggleBtn = findElement(locatorType.XPATH, leftNavToggle);
      leftNavArchiveToggleBtn.getAttribute('aria-checked').then(function (status) {
        if (status === 'false') {
          library.clickJS(leftNavArchiveToggleBtn);
          library.logStep('Left Navigation Archive toggle button is turned on.');
          library.logStepWithScreenshot('Update button clicked.', 'archive');
          const leftNavArchivedElement = findElement(locatorType.XPATH, '//mat-nav-list//div[@class="primary-dispaly-text archived"][contains(text(),' + greyedElement + ')]');
          if (leftNavArchivedElement.isDisplayed()) {
            library.logStepWithScreenshot('Archived item in left navigation is displaying greyed out.', 'archive');
            flag = true;
            resolve(flag);
          } else {
            library.logFailStep('Archived item in left navigation is not displaying greyed out.');
            flag = false;
            resolve(flag);
          }
          library.clickJS(leftNavArchiveToggleBtn);
          library.logStep('Left Navigation Archive toggle button is turned off.');
          library.logStepWithScreenshot('Update button clicked.', 'archive');
          const leftNavArchivedElement1 = findElement(locatorType.XPATH, '//mat-nav-list//div[@class="primary-dispaly-text"][contains(text(),' + greyedElement + ')]');
          if (leftNavArchivedElement1.isDisplayed()) {
            library.logStepWithScreenshot('UnArchived item in left navigation is not displaying greyed out.', 'Unarchive');
            flag = true;
            resolve(flag);
          } else {
            library.logFailStep('UnArchived item in left navigation is  displaying greyed out.');
            flag = false;
            resolve(flag);
          }
        } else {
          library.clickJS(leftNavArchiveToggleBtn);
          library.logStep('Left Navigation Archive toggle button is turned off.');
          library.logStepWithScreenshot('Update button clicked.', 'archive');
          const leftNavArchivedElement = findElement(locatorType.XPATH, '//mat-nav-list//div[@class="primary-dispaly-text"][contains(text(),' + greyedElement + ')]');
          if (leftNavArchivedElement.isDisplayed()) {
            library.logStepWithScreenshot('UnArchived item in left navigation is not displaying greyed out.', 'Unarchive');
            flag = true;
            resolve(flag);
          } else {
            library.logFailStep('UnArchived item in left navigation is  displaying greyed out.');
            flag = false;
            resolve(flag);
          }
          library.clickJS(leftNavArchiveToggleBtn);
          library.logStep('Left Navigation Archive toggle button is turned on.');
          library.logStepWithScreenshot('Update button clicked.', 'archive');
          const leftNavArchivedElement1 = findElement(locatorType.XPATH, '//mat-nav-list//div[@class="primary-dispaly-text archived"][contains(text(),' + greyedElement + ')]');
          if (leftNavArchivedElement1.isDisplayed()) {
            library.logStepWithScreenshot('Archived item in left navigation is displaying greyed out.', 'archive');
            flag = true;
            resolve(flag);
          } else {
            library.logFailStep('Archived item in left navigation is not displaying greyed out.');
            flag = false;
            resolve(flag);
          }
        }
      });
    });
  }

  verifyChildNodeArchived(node) {
    let arch = false;
    return new Promise((resolve) => {
      const child = findElement(locatorType.XPATH, '//mat-nav-list//div[contains(text(),"' + node + '")]');
      child.getAttribute('class').then(function (name) {
        name.includes('grey').then(function () {
          console.log('Child node is archived:' + node);
          library.logStep('Child node is archived:' + node);
          library.logStepWithScreenshot('Pass-nodearchived', 'Pass-nodearchived');
          arch = true;
          resolve(arch);
        }).then(function () {
          console.log('Child node is not archived:' + node);
          library.logStep('Child node is not archived:' + node);
          library.logStepWithScreenshot('nodenotarchived', 'nodenotarchived');
          arch = false;
          resolve(arch);
        });
      });
    });
  }
  verifyDataTablePageGreyedOut() {
    const flag = false;
    return new Promise((resolve) => {
      // const greyed = findElement(locatorType.XPATH, '(.//unext-overlay-component/div[contains(@class, "overlay-div")])[1]');
      const overlay = element(by.xpath('(//*[@class="disabled-section"])[1]'));
      overlay.isDisplayed().then(function () {
        console.log('Data table is greyed out');
        library.logStep('Data table is greyed out');
        resolve(true);
      }).catch(function () {
        console.log('Data table not greyed out');
        library.logStep('Data table not greyed out');
        resolve(false);
      });
    });
  }

  verifyDataTablePageGreyedOutAnalyteLevel() {
    const flag = false;
    return new Promise((resolve) => {
      const greyed = findElement(locatorType.XPATH, '(.//unext-overlay-component/div[contains(@class, "overlay-div")])[1]');
      // const overlay = element(by.xpath('(//*[@class="disabled-section"])[1]'));
      greyed.isDisplayed().then(function () {
        console.log('Data table is greyed out');
        library.logStep('Data table is greyed out');
        resolve(true);
      }).catch(function () {
        console.log('Data table not greyed out');
        library.logStep('Data table not greyed out');
        resolve(false);
      });
    });
  }

  verifySettingPageGreyedOut() {
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      // const greyed = findElement(locatorType.XPATH, '(.//unext-overlay-component/div[contains(@class, "overlay-div")])[1]');
      // const returnLink = findElement(locatorType.XPATH, './/button[contains(@id, "spc_returnToData")]');

      const overlay = element(by.xpath('(.//unext-overlay-component/div[contains(@class, "overlay-div")])[1]'));
      overlay.isDisplayed().then(function () {
        console.log('setting page is greyed out');
        library.logStep('setting page is greyed out');
        flag = true;
        resolve(flag);
      }).catch(function () {
        console.log('setting page is not greyed out');
        library.logStep('setting page is not greyed out');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyleftNavigationGreyedOut(node) {
    let arch = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      element(by.xpath('//mat-nav-list//div[contains(text(),"' + node + '")]')).getAttribute('class').then(function (name) {
        if (name.includes('grey')) {
          console.log('Child node is archived:' + node);
          library.logStep('Child node is archived:' + node);
          library.logStepWithScreenshot('Pass-nodearchived', 'Pass-nodearchived');
          arch = true;
          resolve(arch);
        } else {
          console.log('Child node is not archived:' + node);
          library.logStep('Child node is not archived:' + node);
          library.logStepWithScreenshot('nodenotarchived', 'nodenotarchived');
          arch = false;
          resolve(arch);
        }
      }).catch(function () {
        console.log('Child node is not archived:' + node);
        library.logStep('Child node is not archived:' + node);
        library.logStepWithScreenshot('Pass-nodearchived', 'Pass-nodearchived');
        arch = false;
        resolve(arch);
      });
    });
  }

  verifyArchiveItemToggleDisplayed() {
    let togg = false;
    return new Promise((resolve) => {
      browser.sleep(5000);
      const leftTogg = element(by.xpath(leftNavToggle));
      leftTogg.isDisplayed().then(function () {
        browser.executeScript('arguments[0].scrollIntoView();', element(by.xpath(leftNavToggle)));
        browser.wait(browser.ExpectedConditions.elementToBeClickable(element(by.xpath(leftNavToggle))), 100000, '');
        console.log('Archived Item Toggle is displayed');
        library.logStep('Archived Item Toggle is displayed');
        library.logStepWithScreenshot('LeftNavToggleDisplayed', 'LeftNavToggleDisplayed');
        togg = true;
        resolve(togg);
      }).catch(function () {
        console.log('Archived Item Toggle is not displayed');
        library.logStep('Archived Item Toggle not is displayed');
        library.logStepWithScreenshot('LeftNavToggleDisplayed', 'LeftNavToggleDisplayed');
        togg = false;
        resolve(togg);
      });
    });
  }




  clickArchiveItemToggle() {
    let togg = false;
    return new Promise((resolve) => {
      browser.sleep(3000);
      findElement(locatorType.XPATH, leftNavToggle).isDisplayed().then(function () {
        library.clickJS(element(by.xpath(leftNavToggle)));
        const ele = element(by.xpath('(.//unext-nav-side-bar-link/span)[1]'));
        browser.wait(browser.ExpectedConditions.elementToBeClickable(ele), 10000, 'Left navigation not clickable');
        console.log('Archived Item Toggle is clicked');
        library.logStep('Archived Item Toggle is clicked');
        library.logStepWithScreenshot('LeftNavToggleclicked', 'LeftNavToggleclicked');
        togg = true;
        resolve(togg);
      }).catch(function () {
        console.log('Archived Item Toggle is not displayed');
        library.logStep('Archived Item Toggle is not displayed');
        library.logStepWithScreenshot('LeftNavToggleDisplayed', 'LeftNavToggleDisplayed');
        togg = false;
        resolve(togg);
      });
    });
  }

  verifyArchiveItemsNotDisplayedByDefault() {
    return new Promise((resolve) => {
      const archivedItems = element(by.xpath(archivedItemNotPresent));
      archivedItems.isDisplayed().then(function () {
        console.log('Failed : Archived Item Toggle is displayed');
        library.logStep('Failed : Archived Item Toggle is displayed');
        library.logStepWithScreenshot('LeftNavToggleDisplayed', 'LeftNavToggleDisplayed');
        resolve(false);
      }).catch(function () {
        console.log('Pass : Archived Item Toggle is not displayed');
        library.logStep('Pass : Archived Item Toggle not is displayed');
        library.logStepWithScreenshot('LeftNavToggleDisplayed', 'LeftNavToggleDisplayed');
        resolve(true);
      });
    });
  }

  verifyLotIsExpired() {
    return new Promise((resolve) => {
      const archivedItems = element(by.xpath(expiredLot));
      archivedItems.isDisplayed().then(function () {
        console.log('Lot is expired');
        library.logStep('Lot is expired');
        library.logStepWithScreenshot('Lot is expired', 'Lot is expired');
        resolve(true);
      }).catch(function () {
        console.log('Fail : Lot is not expired');
        library.logStep('Fail : Lot is not expired');
        library.logStepWithScreenshot('Lot is expired', 'Lot is not expired');
        resolve(false);
      });
    });

  }

  verifyPopUpForExpiredLotsOnPanel(expiredAnalyte) {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 500000, 'Element is visible');
      browser.wait(browser.ExpectedConditions.elementToBeClickable(element(by.xpath('//*[text()="' + expiredAnalyte + '"]'))), 100000, '');
      browser.actions().mouseMove(element(by.xpath('//*[text()="' + expiredAnalyte + '"]'))).perform();
      library.logStepWithScreenshot('Lot is expired Pop up', 'Lot is expired Pop up');
      const archivedItems = element(by.xpath(expiredLotPopUp));
      browser.sleep(3000);
      archivedItems.isDisplayed().then(function () {
        console.log('Lot is expired');
        library.logStep('Lot is expired');
        library.logStepWithScreenshot('Lot is expired', 'Lot is expired');
        resolve(true);
      }).catch(function () {
        console.log('Fail : Lot is not expired');
        library.logStep('Fail : Lot is not expired');
        library.logStepWithScreenshot('Lot is expired', 'Lot is not expired');
        resolve(false);
      });
    });
  }

  verifyCancelUpdateEnabled(value) {
    browser.ignoreSynchronization = true;
    let flag = false;
    return new Promise((resolve) => {
      const disabledCancelBtn = browser.findElement(by.xpath(disabledCancel));
      const disabledUpdateBtn = browser.findElement(by.xpath(disabledUpdate));
      const enabledCancelBtn = browser.findElement(by.xpath(enabledCancel));
      const enableddUpdateBtn = browser.findElement(by.xpath(enabledUpdate));
      // tslint:disable-next-line: triple-equals
      if (value.toLowerCase() == 'enabled') {
        if (enabledCancelBtn.isDisplayed() && enableddUpdateBtn.isDisplayed()) {
          library.logStepWithScreenshot('Cancel and Update button are enabled.', 'cancelupdate');
          console.log('Enabled');
          flag = true;
          resolve(flag);
        } else {
          library.logStepWithScreenshot('Cancel and Update button are not enabled.', 'cancelupdate');
          flag = false;
          resolve(flag);
        }
      } else {
        if (disabledCancelBtn.isDisplayed() && disabledUpdateBtn.isDisplayed()) {
          library.logFailStep('Cancel and Update button disabled.');
          console.log('Disabled');
          flag = true;
          resolve(flag);
        } else {
          library.logStepWithScreenshot('Cancel and Update button are not disabled.', 'cancelupdate');
          flag = false;
          resolve(flag);
        }
      }
    });
  }

VerifyCountOfDisabledAnalytes(expectedCount) {
    let flag = false;
    return new Promise((resolve) => {
      const greyedOutAnalyte = element.all(by.xpath('.//div[contains(@class, "overlay-div")]/parent::unext-overlay-component'));
      greyedOutAnalyte.count().then(function (actualCount) {
        console.log('The count is: ' + actualCount);
        if (actualCount === expectedCount) {
          library.logStep(actualCount + ' Analytes are Greyed Out');
          flag = true;
          resolve(flag);
        } else {
          flag = false;
          resolve(flag);
        }
      });
    });
  }
  verifyAnalyteGreyedOut(Analyte) {
    let flag = false;
    return new Promise((resolve) => {
      const greyedOutAnalyte = element(by.xpath('.//div[contains(@class, "overlay-div")]/parent::unext-overlay-component/following-sibling::div//span[text()="' + Analyte + '"]'));
      greyedOutAnalyte.isDisplayed().then(function () {
        library.logStepWithScreenshot('Analyte is greyed out on Multi Entry Data Table', 'greyedOut');
        flag = true;
        resolve(flag);
      }).catch(function () {
        library.logFailStep('Analyte is not greyed out on Multi Entry Data Table');
        flag = false;
        resolve(flag);
      });
    });
  }

  verifyArchiveToggleDisplayed() {
    browser.ignoreSynchronization = true;
    let flag = false;
    return new Promise((resolve) => {
      browser.sleep(8000);
      const archiveToggleBtn = element((by.xpath(archiveToggle)));
      archiveToggleBtn.isDisplayed().then(function () {
        archiveToggleBtn.getAttribute('aria-checked').then(function (status) {
          if (status === 'false') {
            library.logStepWithScreenshot('Archive Toggle Button Displayed and is in off state.', 'archiveDisplayed');
            flag = true;
            resolve(flag);
          } else {
            library.logStepWithScreenshot('Archive Toggle Button Displayed and is in on state.', 'archiveDisplayed');
            flag = true;
            resolve(flag);
          }
        });
      }).catch(function () {
        library.logFailStep('Archive Toggle Button is not Displayed.');
        flag = false;
        resolve(flag);
      });
    });
  }

}
