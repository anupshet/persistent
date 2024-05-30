/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { browser, by, element } from 'protractor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';


const library = new BrowserLibrary();
const dashboard = new Dashboard();

const defaultLocation = './/div/span[contains(@class ,"mat-small spec_labName")]';
const locationsPane = './/div/div[contains(@class ,"cdk-overlay-pane")]';
const SingleLocationIcon = './/mat-icon[@role="img"]/parent::div[contains(@class , "no-dropdown")]';
const MultiLocationIcon = './/mat-icon[@role="img"]/parent::div[contains(@class , "spec-locations ")]';
const expandIconsLocation = '(//mat-tree/mat-nested-tree-node/div/button/span/mat-icon[@role = "img"])';
const groups = '//mat-tree/mat-nested-tree-node/div[@class = "mat-tree-node"]';
const groupArea = '(.//div[contains(@class, "mat-menu-content")]/mat-tree/mat-nested-tree-node)';
const groupLocations = '(.//mat-nested-tree-node[@aria-expanded="true"]/div/mat-tree-node/span)';

export class Locations {

  verifyDefaultLocation(expected) {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 20000, 'Element is visible');
      browser.wait(browser.ExpectedConditions.visibilityOf((element(by.xpath(defaultLocation)))), 20000, 'Element is visible');
      const defaultLocationEle = element(by.xpath(defaultLocation));
      defaultLocationEle.getText().then(function (text) {
        if (expected.includes(text)) {
          library.logStep('Pass: Default location is as expected');
          resolve(true);
        } else {
          library.logStepWithScreenshot('Default location Failed','Fail');
          resolve(false);
        }
      });
    });
  }
  verifyDeptforLocation(expected) {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 20000, 'Element is visible');
      const defaultDeptLocationEle = element(by.xpath('//mat-nav-list//div[contains(text(),"' + expected + '")]'));
      defaultDeptLocationEle.isDisplayed().then(function (text) {
        if (text) {
          library.logStep('Pass: Dept for location is as expected');
          resolve(true);
        } else {
          library.logStep('Fail');
          resolve(false);
        }
      });
    });
  }

  openLocationDropdown() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.visibilityOf(element(by.xpath(defaultLocation))), 55000);
      const defaultLocationEle = element(by.xpath(defaultLocation));
      defaultLocationEle.click();
      const locationsPaneEle = element(by.xpath(locationsPane));
      dashboard.waitForScroll();
      locationsPaneEle.isDisplayed().then((flag) => {
        resolve(flag);
      }).catch(() => {
        library.logStep("Dropdown is not displayed");
        resolve(false);
      });
    });
  }

  selectLocationFromDropdown(value) {
    return new Promise((resolve) => {
      const locationOption = element(by.xpath('.//mat-radio-button/label/div/span[contains(text(),"' + value + '")]'));
      locationOption.click().then((flag) => {
        const defaultLocationEle = element(by.xpath(defaultLocation));
        defaultLocationEle.getText().then(function (text) {
          if (text.includes(value)) {
            library.logStep('Pass: Location is selected');
            resolve(true);
          } else {
            library.logStep('Fail:  Location is not selected');
            resolve(false);
          }
        });
      });
    });
  }

  selectGroupFromDropdown(value) {
    return new Promise((resolve) => {
      element.all(by.xpath(groups)).then(function (groupnames) {
        for (let i = 0; i < groupnames.length; i++) {
          groupnames[i].getText().then(function (name) {
            if (name.includes(value)) {
              ++i;
              const groupEle = element(by.xpath(expandIconsLocation + '[' + i + ']'));
              groupEle.click();
              resolve(true);
            }
          });
        }
      });
    });
  }


  verifySingleLocationIcon() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 20000, 'Element is visible');
      browser.wait(browser.ExpectedConditions.visibilityOf((element(by.xpath(defaultLocation)))), 20000, 'Element is visible');
      const SingleLocationIconEle = element(by.xpath(SingleLocationIcon));
      SingleLocationIconEle.isDisplayed().then(function (text) {
        resolve(text);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  verifyMultiLocationIcon() {
    return new Promise((resolve) => {
      browser.wait(browser.ExpectedConditions.invisibilityOf((element(by.xpath('//*[@src="assets/images/bds/icn_loader.gif"]')))), 20000, 'Element is visible');
      browser.wait(browser.ExpectedConditions.visibilityOf((element(by.xpath(defaultLocation)))), 20000, 'Element is visible');
      const MultiLocationIconEle = element(by.xpath(MultiLocationIcon));
      MultiLocationIconEle.isDisplayed().then(function (text) {
        resolve(text);
      }).catch(() => {
        resolve(false);
      });
    });
  }
  selectLocationFromGroup(value) {
    return new Promise((resolve) => {
      const locationOption = element(by.xpath('.//div[@class!="tree-invisible"]/span[text()  = "' + value + '"]'));
      library.clickJS(locationOption);
      resolve(true);
    });
  }

  singleGroupExpanded() {
    return new Promise((resolve) => {
      element.all(by.xpath(groups)).then(function (groupnames) {
        for (let i = 0; i < groupnames.length; i++) {
          const groupEle = element(by.xpath(expandIconsLocation + '[' + (i + 1) + ']'));
          groupEle.click();
        }
      });
      element.all(by.xpath(groupArea)).then(function (groupnames) {
        for (let i = 0; i < (groupnames.length - 1); i++) {
          groupnames[i].getAttribute("aria-expanded").then(function (flag) {
            if (flag) {
              resolve(false);
            }
          });
        }
        resolve(true);
      });
    });
  }

  isValidGroupName() {
    return new Promise((resolve) => {
      element.all(by.xpath(groups)).getText().then(function (name) {
        console.log("names---------"+name);
            if (name.length > 52) {
              resolve(false);
            }
        });
        resolve(true);
    });
  }

  isGroupsSorted() {
    return new Promise((resolve) => {
      const originalList: Array<string> = [];
      const tempList: Array<string> = [];
      let sortedTempList:string[] = [];
      let count = 0;
      let i = 0;

      const ele = element.all(by.xpath(groups));
      ele.each(function (eachElement) {
        eachElement.getText().then(function (text) {
          text.trim();
          originalList[i] = text.toUpperCase();
          tempList[i] = text.toUpperCase();
          i++;
        });
      }).then(function () {
        sortedTempList = tempList.sort();
        for (const j in sortedTempList) {
          if (originalList[j] === sortedTempList[j]) {
            count++;
            library.logStep(originalList[i] + ' displayed.');
          } else {
            library.logStep(originalList[i] + ' not displayed.');
          }
        }
        if (count === originalList.length) {
          resolve(true);
        } else {
          library.logFailStep(' Left navigation list is not sorted');
          resolve(false);
        }
      });
    });
  }


  isGroupLocationsSorted() {
    return new Promise((resolve) => {
      let count2 = 0;

      element.all(by.xpath(groups)).then(function (groupnames) {
        for (let i = 0; i < groupnames.length; i++) {
          const originalList: Array<string> = [];
          const tempList: Array<string> = [];
          let sortedTempList:string[] = [];
          let k = 0; let count = 0;
          const groupEle = element(by.xpath(expandIconsLocation + '[' + (i + 1) + ']'));
          groupEle.click().then(function () {
            dashboard.waitForScroll();
            const ele = element.all(by.xpath(groupLocations));
            ele.each(function (eachElement) {
              eachElement.getText().then(function (text) {
                text.trim();
                originalList[k] = text.toUpperCase();
                tempList[k] = text.toUpperCase();
                k++;
              });
            }).then(function () {
              sortedTempList = tempList.sort();
              for (const j in sortedTempList) {
                if (originalList[j] === sortedTempList[j]) {
                  count++;
                  library.logStep(originalList[i] + ' displayed.');
                } else {
                  library.logStep(originalList[i] + ' not displayed.');
                }
              }
              if (count === originalList.length)
                count2++;

              if (i == (groupnames.length - 1))
                if (count2 == groupnames.length) resolve(true);
                else resolve(false);
            });
          });
          groupEle.click();
        }
      });
    });
  }

  verifyExpandIconPresent() {
    return new Promise((resolve) => {
      element(by.xpath(expandIconsLocation)).isDisplayed().then(function () {
        resolve(true);
      }).catch(() => {
        library.logStep("Icon is not displayed");
        resolve(false);
      });
    });
  }

}

