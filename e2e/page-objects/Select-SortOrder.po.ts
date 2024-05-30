/*
 * Copyright © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved
 */
import { stat } from 'fs';
import { browser, By, by, element } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BrowserLibrary, locatorType, findElement } from '../utils/browserUtil';
import { Dashboard } from './dashboard-e2e.po';

const fs = require('fs');
const library = new BrowserLibrary();
const AtoZButton = '//*[contains(text(),"A-Z")]/parent::button[1]';
const cancelBtn = '//*[contains(text(),"A-Z")]/parent::button[1]//following::button[1]';
const doneBtn = '//*[contains(text(),"A-Z")]/parent::button[1]//following::button[2]';

export class CustomSortOrder {


  verifyDefaultItemSorting(itemName) {
    return new Promise((resolve) => {
      let myElement;
      const originalList: Array<string> = [];
      const tempList: Array<string> = [];
      let sortedTempList = [];
      let count = 0;
      let i = 0;
      if (itemName === 'Panel') {
        myElement = '//*[text()="Panels"]//parent::div//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text"]';
      }
      if (itemName === 'Department') {
        myElement = '//*[text()="Panels"]//parent::div/parent::div/mat-nav-list//div[@class="primary-dispaly-text"]';
      }
      if (itemName === 'Instrument' || itemName === 'Control' || itemName === 'Analyte' || itemName === 'PanelsAnalyte') {
        myElement = '//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text"]';
      }
      if (itemName === 'DataTabel') {
        myElement = '//*[contains(@class,"analyte-form")]//li//*[contains(@class,"-view-component")]//div[contains(@class,"hdr-ctn ") or contains(@class,"flex-ctn ")]//span[1]';
      }
      if (itemName === 'ArchivedItems') {
        myElement = '//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text grey"]';
      }



      /* const decimal = findElement(locatorType.XPATH, selectedDecimal);
      library.scrollToElement(decimal); */


      const ele = element.all(by.xpath(myElement));
      ele.each(function (eachElement) {
        // browser.wait(browser.ExpectedConditions.visibilityOf(eachElement), 10000, 'Failed : Department List is not visible');
        browser.executeScript('arguments[0].scrollIntoView(true);', eachElement);
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
          library.logStepWithScreenshot(itemName + ' list is Alphabetically sorted', 'sorted');
          console.log(itemName + ' - list is alphabetically sorted');
          resolve(true);
        } else {
          library.logFailStep(itemName + ' Left navigation list is not sorted');
          console.log(itemName + ' - list is not alphabetically sorted');
          resolve(false);
        }
      });
    });
  }

  clickOnSortButton(itemName) {
    let ele;
    if (itemName === 'Panel' || itemName === 'Instrument' || itemName === 'Control' || itemName === 'Analyte' || itemName === 'PanelsAnalyte') {
      ele = '(//*[text()="Sort"])[1]';
    }
    if (itemName === 'Department') {
      ele = '(//*[text()="Sort"])[2]';
    }
    return new Promise((resolve) => {
      element(by.xpath(ele)).isDisplayed().then(function (displayed) {
        browser.executeScript('arguments[0].scrollIntoView(true);', element(by.xpath(ele)));
        library.clickJS(element(by.xpath(ele)));
        resolve(true);
      }).catch(function () {
        resolve(false);
      });
    });
  }

  verifySortOptionsArePresent() {
    return new Promise((resolve) => {
      const sortUI = new Map<string, string>();
      sortUI.set(AtoZButton, 'A-Z Sort Button');
      sortUI.set(cancelBtn, 'Cancel Button');
      sortUI.set(doneBtn, 'Done Button');
      sortUI.forEach(function (key, value) {
        element(by.xpath(value)).isDisplayed().then(function (displayed) {
          library.logStep(key + ' - is displayed ');
          console.log(key + ' - is displayed ');
          resolve(true);
        }).catch(function () {
          library.logStep(key + ' - is not displayed ');
          console.log(key + ' - is not displayed ');
          resolve(false);
        });
      });
    });
  }

  customSortItems(fromItemName, toItemName) {
    return new Promise((resolve) => {
      try {
        const fromElem = findElement(locatorType.XPATH, '//*[contains(text(),"'+fromItemName+'")]//preceding::mat-icon[1]//*[@id="Layer"]');
        fromElem.isDisplayed().then(function () {
          console.log('Grabbers are displayed');
          library.logStep('Grabbers are displayed');
          const toElem = findElement(locatorType.XPATH, '//*[contains(text(),"'+toItemName+'")]//preceding::mat-icon[1]//*[@id="Layer"]');
          // browser.actions().dragAndDrop(fromElem, toElem).mouseUp().perform();
          browser.actions().mouseDown(toElem).mouseMove(fromElem).mouseUp().perform();
          browser.sleep(2000);
          library.logStepWithScreenshot(toElem + '  item moved to ' + toElem, 'rearrange item');
          resolve(true);
        }).catch(function () {
          console.log('Failed : Grabbers are not displayed');
          library.logStep('Failed : Grabbers are not displayed');
          resolve(false);
        });
      } catch (e) {
        console.log(e);
        library.logFailStep('Failed - Unable to drag and drop element');
        resolve(false);
      }
    });
  }

  clickOnDoneBtn() {
    return new Promise((resolve) => {
      const done = element(by.xpath(doneBtn));
      done.isDisplayed().then(function (displayed) {
        console.log('Clicked on done button');
        library.logStep('Clicked on done button');
        library.clickJS(done);
        resolve(true);
      }).catch(function () {
        console.log('Failed : unable to click on done button');
        library.logStep('Failed : unable to click on done button');
        resolve(false);
      });
    });
  }

  clickOnCancelBtn() {
    return new Promise((resolve) => {
      const cancel = element(by.xpath(cancelBtn));
      cancel.isDisplayed().then(function (displayed) {
        console.log('Clicked on cancel button');
        library.logStep('Clicked on cancel button');
        library.clickJS(cancel);
        resolve(true);
      }).catch(function () {
        console.log('Failed : unable to click on cancel button');
        library.logStep('Failed : unable to click on cancel button');
        resolve(false);
      });
    });
  }

  clickOnAtoZSortBtn() {
    return new Promise((resolve) => {
      const aTozBtn = element(by.xpath(AtoZButton));
      aTozBtn.isDisplayed().then(function (displayed) {
        console.log('Clicked on A To Z button');
        library.logStep('Clicked on A To Z button');
        library.clickJS(aTozBtn);
        resolve(true);
      }).catch(function () {
        console.log('Failed : unable to click on A To Z button');
        library.logStep('Failed : unable to click on A To Z button');
        resolve(false);
      });
    });
  }

  verifyCustomSortedValues(customeSort, itemName) {
    let myElement;
    let i = 0;
    return new Promise((resolve) => {
      const originalListbeforeDone: Array<string> = [];
      const originalListAfterDone: Array<string> = [];
      if (itemName === 'Panel') {
        myElement = '//*[text()="Panels"]//parent::div//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text"]';
      }
      if (itemName === 'Department') {
        myElement = '//*[text()="Panels"]//parent::div/parent::div/mat-nav-list';
      }
      if (itemName === 'Instrument' || itemName === 'Control' || itemName === 'Analyte' || itemName === 'PanelsAnalyte') {
        myElement = '//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text"]';
      }

      const eleBeforeDone = element.all(by.xpath(myElement));
      eleBeforeDone.each(function (optText) {
        browser.sleep(5000);
        optText.getText().then(function (text) {
          text.trim();
          console.log('++++++> Before Done +++> ', text);
          originalListbeforeDone[i] = text.toUpperCase();
          i++;
        });
      });

      if (customeSort === true) {
        const done = element(by.xpath(doneBtn));
        done.isDisplayed().then(function (displayed) {
          console.log('Clicked on done button');
          library.logStep('Clicked on done button');
          library.clickJS(done);

        });
      }
      const eleAfterDone = element.all(by.xpath(myElement));
      eleAfterDone.each(function (optText) {
        optText.getText().then(function (text) {
          text.trim();
          console.log('++++++> After Done +++> ', text);
          originalListAfterDone[i] = text.toUpperCase();
          i++;
        });
      });

      for (const j in originalListbeforeDone) {
        if (originalListbeforeDone[j] === originalListAfterDone[j]) {
          console.log('Value after saving custom sort are persisted');
          library.logStep('Value after saving custom sort are persisted');
          resolve(true);
        } else {
          console.log('Failed : Value after saving custom sort are not persisted');
          library.logStep('Value after saving custom sort are not persisted');
          resolve(false);
        }
      }
    });
  }


  verifyCustomSortedValuesForDatatable(itemName) {
    let myElement;
    let myLeftNavElement;
    let i = 0;
    return new Promise((resolve) => {

      myElement = '//*[contains(@class,"analyte-form")]//li//*[contains(@class,"-view-component")]//div[contains(@class,"hdr-ctn ") or contains(@class,"flex-ctn ")]//*[1]';
      if (itemName === 'Instrument') {
        myLeftNavElement = '//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text"]';
      }

      const eleLeftNav = element.all(by.xpath(myLeftNavElement));
      eleLeftNav.each(function (optText) {
        optText.getText().then(function (textLeftNav) {
          const originalList: Array<string> = [];
          const tempList: Array<string> = [];
          let sortedTempList = [];
          textLeftNav.trim();
          //library.scrollToElement(findElement(locatorType.XPATH, myElement))
          browser.wait(browser.ExpectedConditions.visibilityOf((element(by.xpath(myElement)))), 10000, 'Expand button is not clickable');
          const eleAfterSorting = element.all(by.xpath(myElement));
          eleAfterSorting.each(function (optText) {
            optText.getText().then(function (text) {
              text.trim();
              if (text.includes(textLeftNav)) {
                originalList[i] = text.toUpperCase();
                tempList[i] = text.toUpperCase();
                i++;
              }
            });
          }).then(function () {
            sortedTempList = tempList.sort();

            for (const j in sortedTempList) {
              if (originalList[j] === sortedTempList[j]) {
                console.log('Sorted items are displayed');
                resolve(true);
              } else {
                console.log('Failed : Sorted items are not displayed');
                resolve(false);
              }
            }
          });

        });
      });
    });
  }

  customSortItemsForPanels(fromItemName, toItemName) {
    return new Promise((resolve) => {
      try {
        const fromElem = findElement(locatorType.XPATH, '//*[text()="'+ fromItemName +'"]//preceding::mat-icon[1]');
        fromElem.isDisplayed().then(function () {
          console.log('Grabbers are displayed');
          library.logStep('Grabbers are displayed');
          const toElem = findElement(locatorType.XPATH, '//*[text()="'+ toItemName +'"]//preceding::mat-icon[1]');
          // browser.actions().dragAndDrop(fromElem, toElem).mouseUp().perform();
          browser.actions().mouseDown(toElem).mouseMove(fromElem).mouseUp().perform();
          browser.sleep(2000);
          library.logStepWithScreenshot(toElem + '  item moved to ' + toElem, 'rearrange item');
          resolve(true);
        }).catch(function () {
          console.log('Failed : Grabbers are not displayed');
          library.logStep('Failed : Grabbers are not displayed');
          resolve(false);
        });
      } catch (e) {
        console.log(e);
        library.logFailStep('Failed - Unable to drag and drop element');
        resolve(false);
      }
    });
  }

  verifyCustomSortedValuesForPanelDatatable(itemName) {
    let myElement;
    let myLeftNavElement;
    let i = 0;
    return new Promise((resolve) => {

      myElement = '//*[contains(@class,"analyte-form")]//li//*[contains(@class,"-view-component")]//div[contains(@class,"hdr-ctn ") or contains(@class,"flex-ctn ")]//p';
      if (itemName === 'Instrument') {
        myLeftNavElement = '//unext-nav-side-bar-link/span//div[@class="primary-dispaly-text"]';
      }

      const eleLeftNav = element.all(by.xpath(myLeftNavElement));
      eleLeftNav.each(function (optText) {
        optText.getText().then(function (textLeftNav) {
          const originalList: Array<string> = [];
          const tempList: Array<string> = [];
          let sortedTempList = [];
          textLeftNav.trim();
          browser.wait(browser.ExpectedConditions.visibilityOf((element(by.xpath(myElement)))), 10000, 'Expand button is not clickable');
          const eleAfterSorting = element.all(by.xpath(myElement));
          eleAfterSorting.each(function (optText) {
            optText.getText().then(function (text) {
              text.trim();
              if (text.includes(textLeftNav)) {
                originalList[i] = text.toUpperCase();
                tempList[i] = text.toUpperCase();
                i++;
              }
            });
          }).then(function () {
            sortedTempList = tempList.sort();

            for (const j in sortedTempList) {
              if (originalList[j] === sortedTempList[j]) {
                console.log('Sorted items are displayed');
                resolve(true);
              } else {
                console.log('Failed : Sorted items are not displayed');
                resolve(false);
              }
            }
          });

        });
      });
    });
  }

}
